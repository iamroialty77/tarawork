import { NextRequest, NextResponse } from "next/server";
import { simpleParser } from "mailparser";
import { requireAdminUser } from "@/lib/authz";
import { assertSameOrigin } from "@/lib/security";
import { getImapFolders, isImapConfigured, withImapClient } from "@/lib/imapMailbox";
import { supabaseAdmin } from "@/lib/supabase_admin";

export const runtime = "nodejs";
export const maxDuration = 60;
const toIsoDate = (value: string | Date | undefined | null) => {
  if (!value) return new Date().toISOString();
  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime()) ? new Date().toISOString() : date.toISOString();
};

export async function POST(req: NextRequest) {
  const originError = assertSameOrigin(req);
  if (originError) return originError;
  const admin = await requireAdminUser();
  if (admin.error) return NextResponse.json({ error: admin.error }, { status: admin.status });
  if (!isImapConfigured()) return NextResponse.json({ error: "IMAP is not configured. Add IMAP_USER and IMAP_PASS to the server environment." }, { status: 503 });

  try {
    const result = await withImapClient(async (client) => {
      const folderPaths = await getImapFolders(client);
      const folders = Object.entries(folderPaths).filter((entry): entry is [string, string] => Boolean(entry[1]));
      const { data: logged } = await supabaseAdmin.from("email_messages").select("id,metadata").limit(10000);
      const existing = new Map<string, { id: string; metadata: Record<string, any> }>();
      for (const row of logged || []) if (row.metadata?.imapUid && row.metadata?.imapFolder) existing.set(`${row.metadata.imapFolder}:${row.metadata.imapUid}`, row as any);
      let imported = 0; let updated = 0;

      for (const [folderType, folderPath] of folders) {
        const lock = await client.getMailboxLock(folderPath);
        try {
          const total = Number((client.mailbox as any)?.exists || 0);
          if (!total) continue;
          const start = Math.max(1, total - 49);
          for await (const message of client.fetch(`${start}:*`, { uid: true, envelope: true, flags: true, internalDate: true, source: true })) {
            const uid = Number(message.uid);
            const key = `${folderPath}:${uid}`;
            const flags = Array.from(message.flags || []);
            const metadata: Record<string, any> = { imapUid: uid, imapFolder: folderPath, imapFolderType: folderType, isRead: flags.includes("\\Seen"), imapFlags: flags, syncedAt: new Date().toISOString() };
            if (folderType === "trash") metadata.trashedAt = toIsoDate(message.internalDate);
            const found = existing.get(key);
            if (found) {
              await supabaseAdmin.from("email_messages").update({ metadata: { ...found.metadata, ...metadata } }).eq("id", found.id);
              updated++; continue;
            }

            const parsed = message.source ? await simpleParser(message.source) : null;
            const from = parsed?.from?.value?.[0] || message.envelope?.from?.[0];
            const recipients = parsed?.to && "value" in parsed.to ? parsed.to.value : message.envelope?.to || [];
            const mailboxUser = (process.env.IMAP_USER || process.env.SMTP_USER || "").toLowerCase();
            const fromEmail = String(from?.address || "").toLowerCase();
            const attachments = (parsed?.attachments || []).map((file) => ({ filename: file.filename || "attachment", contentType: file.contentType, size: file.size }));
            metadata.attachments = attachments;
            metadata.messageId = parsed?.messageId || message.envelope?.messageId || null;
            const { error } = await supabaseAdmin.from("email_messages").insert({
              type: "imap_sync", direction: fromEmail === mailboxUser ? "outbound" : "inbound", from_email: fromEmail || null,
              from_name: from?.name || null, to_email: recipients.map((address: any) => address.address).filter(Boolean).join(", ") || null,
              reply_to: parsed?.replyTo?.value?.[0]?.address || fromEmail || null, subject: parsed?.subject || message.envelope?.subject || "(No subject)",
              text_body: parsed?.text || (parsed?.html ? "This email contains HTML content." : ""), html_body: null,
              status: folderType === "drafts" ? "draft" : "sent", metadata,
              created_at: toIsoDate(message.internalDate),
            });
            if (!error) imported++;
          }
        } finally { lock.release(); }
      }
      return { imported, updated, folders: folders.length };
    });
    return NextResponse.json({ success: true, ...result });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unable to sync IMAP mailbox." }, { status: 500 });
  }
}

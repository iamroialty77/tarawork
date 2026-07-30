import { NextRequest, NextResponse } from "next/server";
import { requireAdminUser } from "@/lib/authz";
import { assertSameOrigin } from "@/lib/security";
import { supabaseAdmin } from "@/lib/supabase_admin";
import { applyImapMessageAction, getImapQuota } from "@/lib/imapMailbox";

export const runtime = "nodejs";

const cleanId = (value: unknown) => String(value || "").trim().slice(0, 80);

export async function GET() {
  const admin = await requireAdminUser("email.manage");
  if (admin.error) return NextResponse.json({ error: admin.error }, { status: admin.status });

  const { data, error, count } = await supabaseAdmin
    .from("email_messages")
    .select("subject,text_body,from_email,to_email,metadata", { count: "exact" })
    .limit(10000);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  let usedBytes = 0;
  let trashBytes = 0;
  for (const message of data || []) {
    const textBytes = Buffer.byteLength(`${message.subject || ""}${message.text_body || ""}${message.from_email || ""}${message.to_email || ""}`, "utf8");
    const attachmentBytes = Array.isArray(message.metadata?.attachments)
      ? message.metadata.attachments.reduce((total: number, file: { size?: unknown }) => total + Math.max(0, Number(file?.size) || 0), 0)
      : 0;
    const messageBytes = textBytes + attachmentBytes + 1024;
    usedBytes += messageBytes;
    if (message.metadata?.trashedAt) trashBytes += messageBytes;
  }
  const imapQuota = await getImapQuota().catch(() => null);
  if (imapQuota) usedBytes = imapQuota.usedBytes;
  const configuredLimit = Number(process.env.ADMIN_EMAIL_STORAGE_LIMIT_BYTES || 5 * 1024 * 1024 * 1024);
  const providerLimit = imapQuota?.limitBytes;
  const limitBytes = providerLimit || (Number.isFinite(configuredLimit) && configuredLimit > 0 ? configuredLimit : 5 * 1024 * 1024 * 1024);
  return NextResponse.json({ usedBytes, availableBytes: Math.max(0, limitBytes - usedBytes), limitBytes, trashBytes, messageCount: count || data?.length || 0, percentage: Math.min(100, (usedBytes / limitBytes) * 100), source: imapQuota ? "imap" : "local" });
}

export async function PATCH(req: NextRequest) {
  const originError = assertSameOrigin(req);
  if (originError) return originError;
  const admin = await requireAdminUser("email.manage");
  if (admin.error) return NextResponse.json({ error: admin.error }, { status: admin.status });

  try {
    const body = await req.json();
    const id = cleanId(body.id);
    const action = String(body.action || "");
    if (!id || !["read", "unread", "trash", "restore"].includes(action)) {
      return NextResponse.json({ error: "Invalid email action." }, { status: 400 });
    }

    const { data: message, error } = await supabaseAdmin
      .from("email_messages")
      .select("id,direction,status,metadata")
      .eq("id", id)
      .maybeSingle();
    if (error || !message) return NextResponse.json({ error: "Email not found." }, { status: 404 });

    let metadata = message.metadata && typeof message.metadata === "object" ? { ...message.metadata } : {};
    if (action === "read" || action === "unread") metadata.isRead = action === "read";
    if (action === "trash") {
      metadata.trashedAt = new Date().toISOString();
      metadata.previousFolder = message.status === "draft" ? "drafts" : message.direction === "outbound" ? "sent" : "inbox";
    }
    if (action === "restore") delete metadata.trashedAt;
    metadata = await applyImapMessageAction(metadata, action as "read" | "unread" | "trash" | "restore");

    const { error: updateError } = await supabaseAdmin.from("email_messages").update({ metadata }).eq("id", id);
    if (updateError) throw updateError;
    return NextResponse.json({ success: true, metadata });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unable to update email." }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const originError = assertSameOrigin(req);
  if (originError) return originError;
  const admin = await requireAdminUser("email.manage");
  if (admin.error) return NextResponse.json({ error: admin.error }, { status: admin.status });

  const id = cleanId(new URL(req.url).searchParams.get("id"));
  if (!id) return NextResponse.json({ error: "Email id is required." }, { status: 400 });
  const { data: message } = await supabaseAdmin.from("email_messages").select("metadata").eq("id", id).maybeSingle();
  if (!message?.metadata?.trashedAt) return NextResponse.json({ error: "Move the email to Trash first." }, { status: 400 });
  await applyImapMessageAction({ ...message.metadata }, "delete");
  const { error } = await supabaseAdmin.from("email_messages").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}

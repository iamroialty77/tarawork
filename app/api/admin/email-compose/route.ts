import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { requireAdminUser } from "@/lib/authz";
import { assertSameOrigin } from "@/lib/security";
import { supabaseAdmin } from "@/lib/supabase_admin";

export const runtime = "nodejs";
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_RECIPIENTS = 50;
const MAX_FILES = 8;
const MAX_FILE_BYTES = 8 * 1024 * 1024;
const MAX_TOTAL_BYTES = 15 * 1024 * 1024;
const BLOCKED_EXTENSIONS = new Set(["exe", "msi", "bat", "cmd", "com", "scr", "ps1", "vbs", "js", "jar", "app", "dmg", "iso"]);
type EmailAttachment = { filename: string; contentType: string; contentBase64: string; size: number };
const clean = (value: unknown, max: number) => String(value || "").trim().slice(0, max);
const escapeHtml = (value: string) => value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

export async function POST(req: NextRequest) {
  const originError = assertSameOrigin(req);
  if (originError) return originError;
  const admin = await requireAdminUser("email.manage");
  if (admin.error) return NextResponse.json({ error: admin.error }, { status: admin.status });

  try {
    const body = await req.json();
    const action = body.action === "draft" ? "draft" : "send";
    const draftId = clean(body.draftId, 80);
    const recipients = [...new Set(String(body.to || "").split(/[;,\n]+/).map((value) => value.trim().toLowerCase()).filter(Boolean))];
    if (recipients.length > MAX_RECIPIENTS) return NextResponse.json({ error: `You can send to up to ${MAX_RECIPIENTS} recipients at once.` }, { status: 400 });
    const invalidRecipients = recipients.filter((email) => !EMAIL.test(email));
    if (invalidRecipients.length) return NextResponse.json({ error: `Invalid email address: ${invalidRecipients[0]}` }, { status: 400 });
    const attachments: EmailAttachment[] = Array.isArray(body.attachments) ? body.attachments.slice(0, MAX_FILES + 1).map((file: Record<string, unknown>) => ({ filename: clean(file?.filename, 180).replace(/[\\/]/g, "_"), contentType: clean(file?.contentType, 120) || "application/octet-stream", contentBase64: String(file?.contentBase64 || "").trim(), size: Number(file?.size || 0) })) : [];
    if (attachments.length > MAX_FILES) return NextResponse.json({ error: `You can attach up to ${MAX_FILES} files.` }, { status: 400 });
    let totalBytes = 0;
    for (const file of attachments) {
      const extension = file.filename.split(".").pop()?.toLowerCase() || "";
      if (!file.filename || !file.contentBase64 || !Number.isFinite(file.size) || file.size <= 0 || file.size > MAX_FILE_BYTES) return NextResponse.json({ error: "Each attachment must be a valid file up to 8MB." }, { status: 400 });
      if (BLOCKED_EXTENSIONS.has(extension)) return NextResponse.json({ error: `${file.filename} is not an allowed attachment type.` }, { status: 400 });
      if (!/^[A-Za-z0-9+/=]+$/.test(file.contentBase64)) return NextResponse.json({ error: `${file.filename} contains invalid file data.` }, { status: 400 });
      totalBytes += file.size;
    }
    if (totalBytes > MAX_TOTAL_BYTES) return NextResponse.json({ error: "Attachments must be 15MB or smaller in total." }, { status: 400 });
    const to = recipients.join(", ");
    const subject = clean(body.subject, 300) || "(No subject)";
    const message = clean(body.message, 20000);
    if (action === "send" && (!recipients.length || !message)) return NextResponse.json({ error: "At least one valid recipient and a message are required." }, { status: 400 });
    if (action === "draft" && !to && subject === "(No subject)" && !message) return NextResponse.json({ error: "Add some draft content first." }, { status: 400 });

    const smtpUser = process.env.SMTP_USER || "";
    const fromName = process.env.MARKETING_EMAIL_FROM_NAME || "TaraWork Support";
    const attachmentSummary = attachments.map(({ filename, contentType, size }) => ({ filename, contentType, size }));
    const record = { type: "admin_compose", direction: "outbound", from_email: smtpUser || null, from_name: fromName, to_email: to || null, reply_to: smtpUser || null, subject, text_body: message, html_body: null, status: action === "draft" ? "draft" : "sent", metadata: { composedBy: admin.user?.id, recipients, attachments: attachmentSummary } };

    if (action === "send") {
      const smtpPass = process.env.SMTP_PASS || "";
      if (!smtpUser || !smtpPass) return NextResponse.json({ error: "SMTP is not configured." }, { status: 500 });
      const port = Number(process.env.SMTP_PORT || "465");
      const transporter = nodemailer.createTransport({ host: process.env.SMTP_HOST || "smtp.hostinger.com", port, secure: port === 465, auth: { user: smtpUser, pass: smtpPass } });
      await transporter.sendMail({ from: `"${fromName}" <${smtpUser}>`, to: recipients, replyTo: smtpUser, subject, text: message, html: `<div style="font-family:Arial,sans-serif;line-height:1.7;color:#0f172a;max-width:680px;margin:auto"><p style="white-space:pre-line">${escapeHtml(message)}</p><hr style="border:0;border-top:1px solid #e2e8f0;margin:24px 0"><p style="font-size:12px;color:#64748b">TaraWork Support</p></div>`, attachments: attachments.map((file) => ({ filename: file.filename, contentType: file.contentType, content: file.contentBase64, encoding: "base64" })) });
    }

    const query = draftId ? supabaseAdmin.from("email_messages").update(record).eq("id", draftId).select().single() : supabaseAdmin.from("email_messages").insert(record).select().single();
    const { data, error } = await query;
    if (error) throw error;
    return NextResponse.json({ success: true, message: data });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unable to process email." }, { status: 500 });
  }
}

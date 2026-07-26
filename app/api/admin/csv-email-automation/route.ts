import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { requireAdminUser } from "@/lib/authz";
import { assertSameOrigin, getClientIp, rateLimit } from "@/lib/security";
import { logEmailMessages, type EmailLogInput } from "@/lib/emailLog";

export const runtime = "nodejs";
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_ROWS = 500;
const clean = (value: unknown, max: number) => String(value ?? "").trim().slice(0, max);
const escapeHtml = (value: string) => value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

function render(template: string, alias: string, row: Record<string, string>) {
  return template
    .replace(/\{\{\s*([a-zA-Z0-9_-]+)\.([a-zA-Z0-9_-]+)\s*\}\}/g, (match, source, column) =>
      source.toLowerCase() === alias.toLowerCase() && Object.prototype.hasOwnProperty.call(row, column) ? row[column] : match)
    .replace(/\{\{\s*([a-zA-Z0-9_-]+)\s*\}\}/g, (match, column) =>
      Object.prototype.hasOwnProperty.call(row, column) ? row[column] : match);
}

export async function GET() {
  const admin = await requireAdminUser();
  if (admin.error) return NextResponse.json({ error: admin.error }, { status: admin.status });
  return NextResponse.json({ config: { enabled: true }, recipientCount: 0 });
}

export async function POST(req: NextRequest) {
  const originError = assertSameOrigin(req);
  if (originError) return originError;
  const admin = await requireAdminUser();
  if (admin.error) return NextResponse.json({ error: admin.error }, { status: admin.status });
  const limited = rateLimit({ key: `admin:csv-campaign:${admin.user?.id || getClientIp(req)}`, limit: 3, windowMs: 60 * 60 * 1000 });
  if (limited) return limited;

  try {
    const body = await req.json();
    const alias = clean(body.alias, 80).replace(/[^a-zA-Z0-9_-]/g, "");
    const emailColumn = clean(body.emailColumn, 100);
    const subjectTemplate = clean(body.subject, 300);
    const messageTemplate = clean(body.message, 20000);
    if (!alias || !emailColumn || !subjectTemplate || !messageTemplate) return NextResponse.json({ error: "CSV name, email column, subject, and message are required." }, { status: 400 });
    if (!Array.isArray(body.rows) || !body.rows.length || body.rows.length > MAX_ROWS) return NextResponse.json({ error: `Provide between 1 and ${MAX_ROWS} CSV rows.` }, { status: 400 });

    const seen = new Set<string>();
    const recipients: Array<{ email: string; row: Record<string, string> }> = [];
    let duplicatesSkipped = 0;
    for (const raw of body.rows) {
      if (!raw || typeof raw !== "object" || Array.isArray(raw)) continue;
      const row = Object.fromEntries(Object.entries(raw).slice(0, 100).map(([key, value]) => [clean(key, 100), clean(value, 2000)]));
      const email = clean(row[emailColumn], 320).toLowerCase();
      if (!EMAIL.test(email)) continue;
      if (seen.has(email)) { duplicatesSkipped++; continue; }
      seen.add(email); recipients.push({ email, row });
    }
    if (!recipients.length) return NextResponse.json({ error: "No valid email addresses were found in the selected column." }, { status: 400 });

    const smtpUser = process.env.SMTP_USER || "", smtpPass = process.env.SMTP_PASS || "";
    if (!smtpUser || !smtpPass) return NextResponse.json({ error: "SMTP is not configured." }, { status: 500 });
    const port = Number(process.env.SMTP_PORT || "465");
    const fromName = process.env.MARKETING_EMAIL_FROM_NAME || "TaraWork Support";
    const transporter = nodemailer.createTransport({ host: process.env.SMTP_HOST || "smtp.hostinger.com", port, secure: port === 465, auth: { user: smtpUser, pass: smtpPass } });
    let sent = 0, failed = 0;
    const emailLogs: EmailLogInput[] = [];
    const sendOne = async (recipient: (typeof recipients)[number]) => {
      const subject = render(subjectTemplate, alias, recipient.row).slice(0, 300);
      const message = render(messageTemplate, alias, recipient.row).slice(0, 20000);
      try {
        await transporter.sendMail({ from: `"${fromName}" <${smtpUser}>`, to: recipient.email, replyTo: smtpUser, subject, text: message, html: `<div style="font-family:Arial,sans-serif;line-height:1.7;color:#0f172a;max-width:680px;margin:auto"><p style="white-space:pre-line">${escapeHtml(message)}</p><hr style="border:0;border-top:1px solid #e2e8f0;margin:24px 0"><p style="font-size:12px;color:#64748b">TaraWork Support</p></div>` });
        sent++;
        emailLogs.push({ type: "csv_campaign", direction: "outbound", fromEmail: smtpUser, fromName, toEmail: recipient.email, replyTo: smtpUser, subject, textBody: message, status: "sent", metadata: { alias, sentBy: admin.user?.id } });
      } catch (error) {
        failed++;
        emailLogs.push({ type: "csv_campaign", direction: "outbound", fromEmail: smtpUser, fromName, toEmail: recipient.email, replyTo: smtpUser, subject, textBody: message, status: "failed", metadata: { alias, sentBy: admin.user?.id, error: error instanceof Error ? error.message : "SMTP send failed" } });
      }
    };
    // Small batches keep large campaigns responsive without overwhelming the SMTP provider.
    for (let index = 0; index < recipients.length; index += 5) {
      await Promise.all(recipients.slice(index, index + 5).map(sendOne));
    }
    await logEmailMessages(emailLogs);
    return NextResponse.json({ success: true, sent, failed, duplicatesSkipped });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unable to send CSV campaign." }, { status: 500 });
  }
}

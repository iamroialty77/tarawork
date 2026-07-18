import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { requireAdminUser } from "@/lib/authz";
import { logEmailMessage } from "@/lib/emailLog";
import { assertSameOrigin, getClientIp, rateLimit } from "@/lib/security";
import { supabaseAdmin } from "@/lib/supabase_admin";

export const runtime = "nodejs";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const cleanLine = (value: unknown, limit: number) => String(value || "").replace(/\s+/g, " ").trim().slice(0, limit);
const escapeHtml = (value: string) => value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

export async function POST(req: NextRequest) {
  const originError = assertSameOrigin(req);
  if (originError) return originError;

  const admin = await requireAdminUser();
  if (admin.error) return NextResponse.json({ error: admin.error }, { status: admin.status });

  const limited = rateLimit({
    key: `admin:email-reply:${admin.user?.id || getClientIp(req)}`,
    limit: 30,
    windowMs: 60 * 60 * 1000,
  });
  if (limited) return limited;

  try {
    const body = await req.json();
    const messageId = cleanLine(body.messageId, 80);
    const replyBody = String(body.message || "").trim().slice(0, 12000);
    if (!messageId || !replyBody) return NextResponse.json({ error: "Message and reply are required." }, { status: 400 });

    const { data: original, error } = await supabaseAdmin
      .from("email_messages")
      .select("id,direction,from_email,from_name,reply_to,subject,related_table,related_id")
      .eq("id", messageId)
      .maybeSingle();
    if (error || !original) return NextResponse.json({ error: "Original email was not found." }, { status: 404 });
    if (original.direction === "outbound") return NextResponse.json({ error: "Only inbound messages can be replied to." }, { status: 400 });

    const recipient = cleanLine(original.reply_to || original.from_email, 320).toLowerCase();
    if (!EMAIL_REGEX.test(recipient)) return NextResponse.json({ error: "This message has no valid reply address." }, { status: 400 });

    const smtpHost = process.env.SMTP_HOST || "smtp.hostinger.com";
    const smtpPort = Number(process.env.SMTP_PORT || "465");
    const smtpUser = process.env.SMTP_USER || "";
    const smtpPass = process.env.SMTP_PASS || "";
    const fromName = process.env.MARKETING_EMAIL_FROM_NAME || "TaraWork Support";
    if (!smtpUser || !smtpPass) return NextResponse.json({ error: "SMTP is not configured." }, { status: 500 });

    const subject = /^re:/i.test(original.subject) ? original.subject : `Re: ${original.subject}`;
    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpPort === 465,
      auth: { user: smtpUser, pass: smtpPass },
    });
    await transporter.verify();
    await transporter.sendMail({
      from: `"${fromName}" <${smtpUser}>`,
      to: recipient,
      replyTo: smtpUser,
      subject,
      text: replyBody,
      html: `<div style="font-family:Arial,sans-serif;line-height:1.7;color:#0f172a;max-width:680px;margin:auto"><p style="white-space:pre-line">${escapeHtml(replyBody)}</p><hr style="border:0;border-top:1px solid #e2e8f0;margin:24px 0"><p style="font-size:12px;color:#64748b">TaraWork Support</p></div>`,
    });

    await logEmailMessage({
      type: "admin_reply",
      direction: "outbound",
      fromEmail: smtpUser,
      fromName,
      toEmail: recipient,
      subject,
      textBody: replyBody,
      status: "sent",
      relatedTable: original.related_table || "email_messages",
      relatedId: original.related_id || original.id,
      metadata: { replyToMessageId: original.id, repliedBy: admin.user?.id },
    });
    await supabaseAdmin.from("email_messages").update({ status: "replied" }).eq("id", original.id);

    return NextResponse.json({ success: true, recipient, subject });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unable to send reply." }, { status: 500 });
  }
}

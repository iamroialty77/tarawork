import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { requireAdminUser } from "@/lib/authz";
import { assertSameOrigin } from "@/lib/security";
import { supabaseAdmin } from "@/lib/supabase_admin";

export const runtime = "nodejs";
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const clean = (value: unknown, max: number) => String(value || "").trim().slice(0, max);
const escapeHtml = (value: string) => value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

export async function POST(req: NextRequest) {
  const originError = assertSameOrigin(req);
  if (originError) return originError;
  const admin = await requireAdminUser();
  if (admin.error) return NextResponse.json({ error: admin.error }, { status: admin.status });

  try {
    const body = await req.json();
    const action = body.action === "draft" ? "draft" : "send";
    const draftId = clean(body.draftId, 80);
    const to = clean(body.to, 320).toLowerCase();
    const subject = clean(body.subject, 300) || "(No subject)";
    const message = clean(body.message, 20000);
    if (action === "send" && (!EMAIL.test(to) || !message)) return NextResponse.json({ error: "A valid recipient email and message are required." }, { status: 400 });
    if (action === "draft" && !to && subject === "(No subject)" && !message) return NextResponse.json({ error: "Add some draft content first." }, { status: 400 });

    const smtpUser = process.env.SMTP_USER || "";
    const fromName = process.env.MARKETING_EMAIL_FROM_NAME || "TaraWork Support";
    const record = { type: "admin_compose", direction: "outbound", from_email: smtpUser || null, from_name: fromName, to_email: to || null, reply_to: smtpUser || null, subject, text_body: message, html_body: null, status: action === "draft" ? "draft" : "sent", metadata: { composedBy: admin.user?.id } };

    if (action === "send") {
      const smtpPass = process.env.SMTP_PASS || "";
      if (!smtpUser || !smtpPass) return NextResponse.json({ error: "SMTP is not configured." }, { status: 500 });
      const port = Number(process.env.SMTP_PORT || "465");
      const transporter = nodemailer.createTransport({ host: process.env.SMTP_HOST || "smtp.hostinger.com", port, secure: port === 465, auth: { user: smtpUser, pass: smtpPass } });
      await transporter.sendMail({ from: `"${fromName}" <${smtpUser}>`, to, replyTo: smtpUser, subject, text: message, html: `<div style="font-family:Arial,sans-serif;line-height:1.7;color:#0f172a;max-width:680px;margin:auto"><p style="white-space:pre-line">${escapeHtml(message)}</p><hr style="border:0;border-top:1px solid #e2e8f0;margin:24px 0"><p style="font-size:12px;color:#64748b">TaraWork Support</p></div>` });
    }

    const query = draftId ? supabaseAdmin.from("email_messages").update(record).eq("id", draftId).select().single() : supabaseAdmin.from("email_messages").insert(record).select().single();
    const { data, error } = await query;
    if (error) throw error;
    return NextResponse.json({ success: true, message: data });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unable to process email." }, { status: 500 });
  }
}

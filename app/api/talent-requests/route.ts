import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { supabaseAdmin } from "@/lib/supabase_admin";
import { assertSameOrigin, getClientIp, rateLimit } from "@/lib/security";
import { logEmailMessage } from "@/lib/emailLog";

export const runtime = "nodejs";

type TalentRequestBody = {
  name?: string;
  email?: string;
  company?: string;
  roleNeeded?: string;
  budget?: string;
  hoursPerWeek?: string;
  startDate?: string;
  notes?: string;
};

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const sanitizeSingleLine = (value: unknown, maxLength = 180) =>
  String(value || "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, maxLength);

const sanitizeLongText = (value: unknown, maxLength = 5000) =>
  String(value || "")
    .replace(/\r\n/g, "\n")
    .replace(/\r/g, "\n")
    .trim()
    .slice(0, maxLength);

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

export async function POST(req: NextRequest) {
  const originError = assertSameOrigin(req);
  if (originError) return originError;

  const limited = rateLimit({
    key: `talent-request:${getClientIp(req)}`,
    limit: 5,
    windowMs: 60 * 60 * 1000,
  });
  if (limited) return limited;

  try {
    const body = (await req.json()) as TalentRequestBody;
    const name = sanitizeSingleLine(body.name, 100);
    const email = sanitizeSingleLine(body.email, 150).toLowerCase();
    const company = sanitizeSingleLine(body.company, 180);
    const roleNeeded = sanitizeSingleLine(body.roleNeeded, 120);
    const budget = sanitizeSingleLine(body.budget, 80);
    const hoursPerWeek = sanitizeSingleLine(body.hoursPerWeek, 80);
    const startDate = sanitizeSingleLine(body.startDate, 80);
    const notes = sanitizeLongText(body.notes, 5000);

    if (!name || !email || !roleNeeded || !notes) {
      return NextResponse.json(
        { error: "Name, email, role needed, and hiring notes are required." },
        { status: 400 },
      );
    }

    if (!EMAIL_REGEX.test(email)) {
      return NextResponse.json({ error: "Invalid email address." }, { status: 400 });
    }

    const requestPayload = {
      name,
      email,
      company,
      role_needed: roleNeeded,
      budget,
      hours_per_week: hoursPerWeek,
      start_date: startDate,
      notes,
      status: "new",
      source: "hire_request_page",
    };

    let savedId: string | null = null;
    try {
      const { data, error } = await supabaseAdmin
        .from("talent_requests")
        .insert([requestPayload])
        .select("id")
        .single();

      if (!error && data?.id) {
        savedId = data.id;
      } else if (error) {
        console.warn("Talent request was emailed but not saved:", error.message);
      }
    } catch (error) {
      console.warn("Talent request save skipped:", error instanceof Error ? error.message : error);
    }

    const smtpHost = process.env.SMTP_HOST || "smtp.hostinger.com";
    const smtpPort = Number(process.env.SMTP_PORT || "465");
    const smtpUser = process.env.SMTP_USER || "hello@tarawork.online";
    const smtpPass = process.env.SMTP_PASS || "";
    const contactInbox = process.env.CONTACT_EMAIL || "hello@tarawork.online";

    if (!smtpPass) {
      return NextResponse.json(
        { error: "SMTP is not configured. Please set SMTP_PASS in environment variables." },
        { status: 500 },
      );
    }

    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpPort === 465,
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
    });

    const rows = [
      ["Name", name],
      ["Email", email],
      ["Company", company || "Not provided"],
      ["Role Needed", roleNeeded],
      ["Budget", budget || "Not sure"],
      ["Hours Per Week", hoursPerWeek || "Not provided"],
      ["Start Date", startDate || "Not provided"],
      ["Saved Request ID", savedId || "Not saved yet"],
    ];

    const adminSubject = `New Talent Shortlist Request: ${roleNeeded}`;
    const adminTextBody = `${rows.map(([label, value]) => `${label}: ${value}`).join("\n")}\n\nNotes:\n${notes}`;
    const adminHtmlBody = `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #0f172a;">
          <h2 style="margin: 0 0 16px;">New Talent Shortlist Request</h2>
          <table style="border-collapse: collapse; width: 100%; max-width: 680px;">
            ${rows
              .map(
                ([label, value]) => `
                  <tr>
                    <td style="border: 1px solid #e2e8f0; padding: 10px; font-weight: 700; background: #f8fafc;">${escapeHtml(label)}</td>
                    <td style="border: 1px solid #e2e8f0; padding: 10px;">${escapeHtml(value)}</td>
                  </tr>
                `,
              )
              .join("")}
          </table>
          <p style="margin: 18px 0 8px; font-weight: 700;">Hiring Notes</p>
          <div style="white-space: pre-line; border: 1px solid #e2e8f0; padding: 14px; background: #f8fafc;">${escapeHtml(notes)}</div>
        </div>
      `;

    await transporter.sendMail({
      from: `"TaraWork Talent Requests" <${smtpUser}>`,
      to: contactInbox,
      replyTo: email,
      subject: adminSubject,
      text: adminTextBody,
      html: adminHtmlBody,
    });

    await logEmailMessage({
      type: "talent_request",
      direction: "inbound",
      fromEmail: email,
      fromName: name,
      toEmail: contactInbox,
      replyTo: email,
      subject: adminSubject,
      textBody: adminTextBody,
      htmlBody: adminHtmlBody,
      relatedTable: "talent_requests",
      relatedId: savedId,
      metadata: { roleNeeded, budget, hoursPerWeek, startDate, company },
    });

    const confirmationSubject = "We received your TaraWork talent shortlist request";
    const confirmationTextBody = `Hi ${name},\n\nWe received your request for ${roleNeeded}. We will review the role, budget, schedule, and notes you shared, then reply with next steps.\n\nTaraWork.online`;
    const confirmationHtmlBody = `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #0f172a;">
          <h2 style="margin: 0 0 12px;">We received your request</h2>
          <p>Hi ${escapeHtml(name)},</p>
          <p>We received your request for <strong>${escapeHtml(roleNeeded)}</strong>. We will review the role, budget, schedule, and notes you shared, then reply with next steps.</p>
          <p style="margin-top: 20px;">TaraWork.online</p>
        </div>
      `;

    await transporter.sendMail({
      from: `"TaraWork" <${smtpUser}>`,
      to: email,
      subject: confirmationSubject,
      text: confirmationTextBody,
      html: confirmationHtmlBody,
    });

    await logEmailMessage({
      type: "talent_request_confirmation",
      direction: "outbound",
      fromEmail: smtpUser,
      fromName: "TaraWork",
      toEmail: email,
      subject: confirmationSubject,
      textBody: confirmationTextBody,
      htmlBody: confirmationHtmlBody,
      relatedTable: "talent_requests",
      relatedId: savedId,
      metadata: { roleNeeded },
    });

    return NextResponse.json({ success: true, id: savedId });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to submit talent request.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

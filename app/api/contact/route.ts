import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { logEmailMessage } from "@/lib/emailLog";

export const runtime = "nodejs";

type ContactRequestBody = {
  name?: string;
  email?: string;
  message?: string;
};

const sanitizeText = (value: string) => value.replace(/\s+/g, " ").trim();

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as ContactRequestBody;
    const name = sanitizeText(body.name || "");
    const email = sanitizeText(body.email || "");
    const message = (body.message || "").trim();

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Name, email, and message are required." },
        { status: 400 },
      );
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Invalid email address." }, { status: 400 });
    }

    if (name.length > 100 || email.length > 150 || message.length > 5000) {
      return NextResponse.json(
        { error: "Input is too long. Please shorten your message." },
        { status: 400 },
      );
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

    const safeName = escapeHtml(name);
    const safeEmail = escapeHtml(email);
    const safeMessage = escapeHtml(message).replace(/\n/g, "<br />");

    const subject = `New Contact Us message from ${name}`;
    const textBody = `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`;
    const htmlBody = `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #0f172a;">
          <h2 style="margin-bottom: 16px;">New Contact Us Message</h2>
          <p><strong>Name:</strong> ${safeName}</p>
          <p><strong>Email:</strong> ${safeEmail}</p>
          <p style="margin-top: 16px;"><strong>Message:</strong></p>
          <p>${safeMessage}</p>
        </div>
      `;

    await transporter.sendMail({
      from: `"TaraWork Contact Form" <${smtpUser}>`,
      to: contactInbox,
      replyTo: email,
      subject,
      text: textBody,
      html: htmlBody,
    });

    await logEmailMessage({
      type: "contact_form",
      direction: "inbound",
      fromEmail: email,
      fromName: name,
      toEmail: contactInbox,
      replyTo: email,
      subject,
      textBody,
      htmlBody,
      metadata: { source: "landing_contact_form" },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to send message.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

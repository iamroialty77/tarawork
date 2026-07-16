import { requireAdminUser } from "@/lib/authz";
import { logEmailMessage } from "@/lib/emailLog";
import { assertSameOrigin, getClientIp, rateLimit } from "@/lib/security";
import { supabaseAdmin } from "@/lib/supabase_admin";
import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

export const runtime = "nodejs";

type EmailFreelancersBody = {
  subject?: string;
  message?: string;
  dryRun?: boolean;
  attachment?: EmailAttachment | null;
};

type EmailAttachment = {
  filename?: string;
  contentType?: string;
  contentBase64?: string;
  size?: number;
};

type Recipient = {
  id: string;
  name: string;
  email: string;
};

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const BATCH_SIZE = 25;
const MAX_ATTACHMENT_BYTES = 5 * 1024 * 1024;
const ALLOWED_ATTACHMENT_TYPES = new Set([
  "application/pdf",
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
]);

const sanitizeText = (value: string) => value.replace(/\s+/g, " ").trim();

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

const extractApplicationEmail = (aiInsights: unknown) => {
  if (!aiInsights || typeof aiInsights !== "object") return "";
  const applicationProfile = (aiInsights as Record<string, unknown>).applicationProfile;
  if (!applicationProfile || typeof applicationProfile !== "object") return "";
  const email = (applicationProfile as Record<string, unknown>).contactEmail;
  return typeof email === "string" ? sanitizeText(email) : "";
};

const chunk = <T,>(items: T[], size: number) => {
  const chunks: T[][] = [];
  for (let index = 0; index < items.length; index += size) {
    chunks.push(items.slice(index, index + size));
  }
  return chunks;
};

const normalizeAttachment = (attachment: EmailAttachment | null | undefined) => {
  if (!attachment) return null;

  const filename = sanitizeText(attachment.filename || "");
  const contentType = sanitizeText(attachment.contentType || "");
  const contentBase64 = typeof attachment.contentBase64 === "string" ? attachment.contentBase64.trim() : "";
  const size = Number(attachment.size || 0);

  if (!filename || !contentType || !contentBase64) {
    throw new Error("Attachment is incomplete. Please select the file again.");
  }

  if (!ALLOWED_ATTACHMENT_TYPES.has(contentType)) {
    throw new Error("Only PDF, JPG, PNG, WEBP, and GIF attachments are allowed.");
  }

  if (!Number.isFinite(size) || size <= 0 || size > MAX_ATTACHMENT_BYTES) {
    throw new Error("Attachment must be 5MB or smaller.");
  }

  if (!/^[A-Za-z0-9+/=]+$/.test(contentBase64)) {
    throw new Error("Attachment data is invalid. Please select the file again.");
  }

  return {
    filename,
    contentType,
    content: Buffer.from(contentBase64, "base64"),
    size,
  };
};

async function getFreelancerRecipients() {
  const { data: profiles, error } = await supabaseAdmin
    .from("profiles")
    .select("id, name, aiInsights")
    .eq("role", "freelancer")
    .order("updated_at", { ascending: false });

  if (error) throw new Error(error.message);

  const recipientsById = new Map<string, Recipient>();
  const missingEmailIds: string[] = [];

  for (const profile of profiles || []) {
    const email = extractApplicationEmail(profile.aiInsights);
    if (email && EMAIL_REGEX.test(email)) {
      recipientsById.set(profile.id, {
        id: profile.id,
        name: profile.name || "Freelancer",
        email,
      });
    } else {
      missingEmailIds.push(profile.id);
    }
  }

  if (missingEmailIds.length > 0) {
    for (const idBatch of chunk(missingEmailIds, 100)) {
      const authUsers = await Promise.all(
        idBatch.map(async (id) => {
          const { data, error: authError } = await supabaseAdmin.auth.admin.getUserById(id);
          if (authError || !data.user?.email || !EMAIL_REGEX.test(data.user.email)) return null;
          const profile = (profiles || []).find((item) => item.id === id);
          return {
            id,
            name: profile?.name || "Freelancer",
            email: data.user.email,
          };
        }),
      );

      authUsers.filter(Boolean).forEach((recipient) => {
        recipientsById.set((recipient as Recipient).id, recipient as Recipient);
      });
    }
  }

  const seenEmails = new Set<string>();
  const recipients = Array.from(recipientsById.values()).filter((recipient) => {
    const key = recipient.email.toLowerCase();
    if (seenEmails.has(key)) return false;
    seenEmails.add(key);
    return true;
  });

  return {
    recipients,
    totalFreelancers: profiles?.length || 0,
    missingEmailCount: Math.max(0, (profiles?.length || 0) - recipients.length),
  };
}

export async function POST(req: NextRequest) {
  try {
    const originError = assertSameOrigin(req);
    if (originError) return originError;

    const admin = await requireAdminUser();
    if (admin.error) {
      return NextResponse.json({ error: admin.error }, { status: admin.status });
    }

    const body = (await req.json()) as EmailFreelancersBody;
    const subject = sanitizeText(body.subject || "");
    const message = (body.message || "").trim();
    const dryRun = body.dryRun !== false;
    const attachment = normalizeAttachment(body.attachment);

    const limited = rateLimit({
      key: `admin:email-freelancers:${dryRun ? "preview" : "send"}:${admin.user?.id || getClientIp(req)}`,
      limit: dryRun ? 30 : 5,
      windowMs: 60 * 60 * 1000,
    });
    if (limited) return limited;

    if (!subject || !message) {
      return NextResponse.json({ error: "Subject and message are required." }, { status: 400 });
    }

    if (subject.length > 140 || message.length > 8000) {
      return NextResponse.json({ error: "Subject or message is too long." }, { status: 400 });
    }

    const { recipients, totalFreelancers, missingEmailCount } = await getFreelancerRecipients();

    if (dryRun) {
      return NextResponse.json({
        success: true,
        dryRun: true,
        recipientCount: recipients.length,
        totalFreelancers,
        missingEmailCount,
        attachment: attachment
          ? {
              filename: attachment.filename,
              contentType: attachment.contentType,
              size: attachment.size,
            }
          : null,
        sampleRecipients: recipients.slice(0, 10).map((recipient) => ({
          name: recipient.name,
          email: recipient.email,
        })),
      });
    }

    if (recipients.length === 0) {
      return NextResponse.json({ error: "No freelancer email addresses were found." }, { status: 400 });
    }

    const smtpHost = process.env.SMTP_HOST || "smtp.hostinger.com";
    const smtpPort = Number(process.env.SMTP_PORT || "465");
    const smtpUser = process.env.SMTP_USER || "";
    const smtpPass = process.env.SMTP_PASS || "";
    const fromName = process.env.MARKETING_EMAIL_FROM_NAME || "TaraWork";

    if (!smtpUser || !smtpPass) {
      return NextResponse.json(
        { error: "SMTP is not configured. Please set SMTP_USER and SMTP_PASS in environment variables." },
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

    const safeMessage = escapeHtml(message).replace(/\n/g, "<br />");
    const mailBatches = chunk(recipients, BATCH_SIZE);

    try {
      await transporter.verify();

      for (const batch of mailBatches) {
        await transporter.sendMail({
          from: `"${fromName}" <${smtpUser}>`,
          to: smtpUser,
          bcc: batch.map((recipient) => recipient.email),
          subject,
          text: message,
          attachments: attachment
            ? [
                {
                  filename: attachment.filename,
                  content: attachment.content,
                  contentType: attachment.contentType,
                },
              ]
            : undefined,
          html: `
            <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #0f172a;">
              <div style="max-width: 640px; margin: 0 auto;">
                <h1 style="font-size: 22px; margin-bottom: 16px;">${escapeHtml(subject)}</h1>
                <p style="white-space: pre-line;">${safeMessage}</p>
                <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 24px 0;" />
                <p style="font-size: 12px; color: #64748b;">You are receiving this because you have a freelancer account on TaraWork.</p>
              </div>
            </div>
          `,
        });
      }
    } catch (smtpError) {
      const smtpMessage = smtpError instanceof Error ? smtpError.message : "SMTP send failed.";
      const isAuthError = smtpMessage.includes("535") || smtpMessage.toLowerCase().includes("authentication failed");
      return NextResponse.json(
        {
          error: isAuthError
            ? `SMTP login failed for ${smtpUser}. Check that SMTP_USER is the full mailbox address and SMTP_PASS is the mailbox password from Hostinger.`
            : smtpMessage,
        },
        { status: 502 },
      );
    }

    await supabaseAdmin.from("admin_audit_logs").insert([
      {
        admin_id: admin.user?.id,
        action: "email_freelancers",
        target_type: "marketing_email",
        target_id: admin.user?.id,
        details: {
          subject,
          recipientCount: recipients.length,
          batchCount: mailBatches.length,
          attachment: attachment
            ? {
                filename: attachment.filename,
                contentType: attachment.contentType,
                size: attachment.size,
              }
            : null,
        },
      },
    ]);

    await logEmailMessage({
      type: "freelancer_announcement",
      direction: "outbound",
      fromEmail: smtpUser,
      fromName,
      toEmail: `bcc:${recipients.length} freelancers`,
      subject,
      textBody: message,
      status: "sent",
      relatedTable: "admin_audit_logs",
      relatedId: admin.user?.id || null,
      metadata: {
        recipientCount: recipients.length,
        batchCount: mailBatches.length,
        attachment: attachment
          ? {
              filename: attachment.filename,
              contentType: attachment.contentType,
              size: attachment.size,
            }
          : null,
      },
    });

    return NextResponse.json({
      success: true,
      recipientCount: recipients.length,
      batchCount: mailBatches.length,
      missingEmailCount,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to email freelancers.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

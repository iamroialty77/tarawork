import nodemailer from "nodemailer";
import { supabaseAdmin } from "@/lib/supabase_admin";

export type ReminderAudience = "all" | "freelancer" | "employer";
export type ProfileReminderConfig = {
  enabled: boolean;
  threshold: number;
  audience: ReminderAudience;
  subject: string;
  message: string;
  cooldownDays: number;
};

export type ProfileReminderRecipient = {
  id: string;
  name: string;
  role: "freelancer" | "employer";
  email: string;
  completion: number;
};

export const DEFAULT_PROFILE_REMINDER_CONFIG: ProfileReminderConfig = {
  enabled: false,
  threshold: 50,
  audience: "all",
  subject: "",
  message: "",
  cooldownDays: 14,
};

const CONFIG_TYPE = "profile_completion_automation_config";
const REMINDER_TYPE = "profile_completion_reminder";
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const clean = (value: unknown, max: number) => String(value || "").trim().slice(0, max);
const escapeHtml = (value: string) =>
  value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

export function normalizeProfileReminderConfig(value: unknown): ProfileReminderConfig {
  const input = value && typeof value === "object" ? value as Record<string, unknown> : {};
  const threshold = Math.min(100, Math.max(0, Math.round(Number(input.threshold ?? 50))));
  const cooldownDays = Math.min(90, Math.max(1, Math.round(Number(input.cooldownDays ?? 14))));
  const audience = input.audience === "freelancer" || input.audience === "employer" ? input.audience : "all";
  return {
    enabled: input.enabled === true,
    threshold,
    cooldownDays,
    audience,
    subject: clean(input.subject, 180),
    message: clean(input.message, 8000),
  };
}

export async function getProfileReminderConfig() {
  const { data, error } = await supabaseAdmin
    .from("email_messages")
    .select("metadata")
    .eq("type", CONFIG_TYPE)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (error) throw error;
  return normalizeProfileReminderConfig(data?.metadata);
}

export async function saveProfileReminderConfig(config: ProfileReminderConfig, adminId?: string) {
  const { error } = await supabaseAdmin.from("email_messages").insert({
    type: CONFIG_TYPE,
    direction: "outbound",
    subject: config.subject || "Profile reminder automation settings",
    text_body: config.message || "",
    status: "draft",
    metadata: { ...config, updatedBy: adminId || null },
  });
  if (error) throw error;
}

const hasText = (value: unknown) => typeof value === "string" && value.trim().length > 0;

function calculateCompletion(profile: Record<string, unknown>, hasPortfolio: boolean) {
  const role = String(profile.role || "").toLowerCase();
  const checkpoints = role === "employer"
    ? [hasText(profile.name), hasText(profile.bio), hasText(profile.username), hasText(profile.companyName), hasText(profile.avatar_url)]
    : [
        hasText(profile.bio),
        Array.isArray(profile.skills) && profile.skills.length > 0,
        hasText(profile.username),
        hasPortfolio,
        hasText(profile.hourlyRate) && profile.hourlyRate !== "$0",
      ];
  return Math.round((checkpoints.filter(Boolean).length / checkpoints.length) * 100);
}

async function resolveEmails(profiles: Array<Record<string, unknown>>) {
  const results = await Promise.all(profiles.map(async (profile) => {
    const insights = profile.aiInsights && typeof profile.aiInsights === "object"
      ? profile.aiInsights as Record<string, unknown>
      : {};
    const application = insights.applicationProfile && typeof insights.applicationProfile === "object"
      ? insights.applicationProfile as Record<string, unknown>
      : {};
    const savedEmail = clean(application.contactEmail, 320).toLowerCase();
    if (EMAIL.test(savedEmail)) return { id: String(profile.id), email: savedEmail };
    const { data } = await supabaseAdmin.auth.admin.getUserById(String(profile.id));
    const authEmail = clean(data.user?.email, 320).toLowerCase();
    return EMAIL.test(authEmail) ? { id: String(profile.id), email: authEmail } : null;
  }));
  return new Map(results.filter(Boolean).map((item) => [item!.id, item!.email]));
}

export async function getProfileReminderRecipients(config: ProfileReminderConfig, excludeRecentlySent = true) {
  let query = supabaseAdmin
    .from("profiles")
    .select("id, name, role, bio, username, skills, hourlyRate, companyName, avatar_url, aiInsights")
    .in("role", ["freelancer", "employer"]);
  if (config.audience !== "all") query = query.eq("role", config.audience);
  const { data: profiles, error } = await query;
  if (error) throw error;

  const ids = (profiles || []).map((profile) => profile.id);
  const portfolioIds = new Set<string>();
  for (let index = 0; index < ids.length; index += 500) {
    const batch = ids.slice(index, index + 500);
    const { data } = await supabaseAdmin.from("portfolio_items").select("profile_id").in("profile_id", batch);
    (data || []).forEach((item) => portfolioIds.add(item.profile_id));
  }

  const eligible = (profiles || []).map((profile) => ({
    profile,
    completion: calculateCompletion(profile, portfolioIds.has(profile.id)),
  })).filter((item) => item.completion <= config.threshold);
  const emails = await resolveEmails(eligible.map((item) => item.profile));

  let recentlySent = new Set<string>();
  if (excludeRecentlySent) {
    const since = new Date(Date.now() - config.cooldownDays * 86400000).toISOString();
    const { data } = await supabaseAdmin
      .from("email_messages")
      .select("related_id")
      .eq("type", REMINDER_TYPE)
      .eq("status", "sent")
      .gte("created_at", since);
    recentlySent = new Set((data || []).map((item) => item.related_id).filter(Boolean));
  }

  return eligible.flatMap(({ profile, completion }): ProfileReminderRecipient[] => {
    const id = String(profile.id);
    const role = String(profile.role).toLowerCase() as "freelancer" | "employer";
    const email = emails.get(id);
    if (!email || recentlySent.has(id)) return [];
    return [{ id, name: clean(profile.name, 160) || (role === "employer" ? "Employer" : "Freelancer"), role, email, completion }];
  });
}

function renderTemplate(template: string, recipient: ProfileReminderRecipient) {
  const baseUrl = (process.env.NEXT_PUBLIC_SITE_URL || "https://tarawork.online").replace(/\/$/, "");
  const values: Record<string, string> = {
    name: recipient.name,
    role: recipient.role,
    completion: String(recipient.completion),
    profile_url: `${baseUrl}/settings`,
  };
  return template.replace(/\{\{(name|role|completion|profile_url)\}\}/g, (_, key: string) => values[key]);
}

export async function sendProfileReminders(config: ProfileReminderConfig, triggeredBy: string) {
  if (!config.subject || !config.message) throw new Error("Add a subject and message before running the automation.");
  const recipients = (await getProfileReminderRecipients(config, true)).slice(0, 200);
  if (!recipients.length) return { sent: 0, failed: 0, recipients: [] as ProfileReminderRecipient[] };

  const smtpUser = process.env.SMTP_USER || "";
  const smtpPass = process.env.SMTP_PASS || "";
  if (!smtpUser || !smtpPass) throw new Error("SMTP is not configured.");
  const port = Number(process.env.SMTP_PORT || "465");
  const fromName = process.env.MARKETING_EMAIL_FROM_NAME || "TaraWork Support";
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.hostinger.com",
    port,
    secure: port === 465,
    auth: { user: smtpUser, pass: smtpPass },
  });

  let sent = 0;
  let failed = 0;
  for (const recipient of recipients) {
    const subject = renderTemplate(config.subject, recipient);
    const message = renderTemplate(config.message, recipient);
    try {
      await transporter.sendMail({
        from: `"${fromName}" <${smtpUser}>`,
        to: recipient.email,
        replyTo: smtpUser,
        subject,
        text: message,
        html: `<div style="font-family:Arial,sans-serif;line-height:1.7;color:#0f172a;max-width:680px;margin:auto"><p style="white-space:pre-line">${escapeHtml(message)}</p><hr style="border:0;border-top:1px solid #e2e8f0;margin:24px 0"><p style="font-size:12px;color:#64748b">TaraWork Support</p></div>`,
      });
      sent += 1;
      await supabaseAdmin.from("email_messages").insert({
        type: REMINDER_TYPE,
        direction: "outbound",
        from_email: smtpUser,
        from_name: fromName,
        to_email: recipient.email,
        reply_to: smtpUser,
        subject,
        text_body: message,
        status: "sent",
        related_table: "profiles",
        related_id: recipient.id,
        metadata: { completion: recipient.completion, role: recipient.role, triggeredBy },
      });
      await supabaseAdmin.from("notifications").insert({
        user_id: recipient.id,
        title: subject,
        message,
        type: "warning",
        link: "/settings",
      });
    } catch {
      failed += 1;
    }
  }
  return { sent, failed, recipients };
}

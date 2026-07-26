import nodemailer from "nodemailer";
import { supabaseAdmin } from "@/lib/supabase_admin";
import { getProfileSlug } from "@/lib/profileUrl";
import { getConfirmedAuthEmail } from "@/lib/emailEligibility.mjs";

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
  missingFields: string[];
  profileUrl: string;
  messageUrl: string;
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
const hasRate = (value: unknown) => {
  const normalized = String(value || "").replace(/[^0-9.]/g, "");
  return normalized.length > 0 && Number(normalized) > 0;
};

function getCompletionDetails(profile: Record<string, unknown>, hasPortfolio: boolean) {
  const role = String(profile.role || "").toLowerCase();
  const checkpoints: Array<{ label: string; complete: boolean }> = role === "employer"
    ? [
        { label: "Full Name", complete: hasText(profile.name) },
        { label: "About / Bio", complete: hasText(profile.bio) },
        { label: "Profile Username", complete: hasText(profile.username) },
        { label: "Company Name", complete: hasText(profile.companyName) },
        { label: "Profile Photo", complete: hasText(profile.avatar_url) },
      ]
    : [
        { label: "Full Name", complete: hasText(profile.name) },
        { label: "About / Bio", complete: hasText(profile.bio) },
        { label: "Professional Category", complete: hasText(profile.category) && String(profile.category).trim().toLowerCase() !== "general" },
        { label: "Skills / Services", complete: Array.isArray(profile.skills) && profile.skills.length > 0 },
        { label: "Profile Username", complete: hasText(profile.username) },
        { label: "Portfolio", complete: hasPortfolio },
        { label: "Hourly Rate", complete: hasRate(profile.hourlyRate) },
        { label: "Profile Photo", complete: hasText(profile.avatar_url) },
      ];
  return {
    completion: Math.round((checkpoints.filter((checkpoint) => checkpoint.complete).length / checkpoints.length) * 100),
    missingFields: checkpoints.filter((checkpoint) => !checkpoint.complete).map((checkpoint) => checkpoint.label),
  };
}

async function resolveEmails(profiles: Array<Record<string, unknown>>) {
  const results = await Promise.all(profiles.map(async (profile) => {
    const { data } = await supabaseAdmin.auth.admin.getUserById(String(profile.id));
    const authEmail = getConfirmedAuthEmail(data.user);
    return authEmail ? { id: String(profile.id), email: authEmail } : null;
  }));
  return new Map(results.filter(Boolean).map((item) => [item!.id, item!.email]));
}

export async function getProfileReminderRecipients(config: ProfileReminderConfig, excludeRecentlySent = true) {
  let query = supabaseAdmin
    .from("profiles")
    .select("id, name, role, category, bio, username, skills, hourlyRate, companyName, avatar_url, aiInsights, status")
    .in("role", ["freelancer", "employer"])
    .or("status.is.null,status.neq.suspended");
  if (config.audience !== "all") query = query.eq("role", config.audience);
  const { data: profiles, error } = await query;
  if (error) throw error;

  const ids = (profiles || []).map((profile) => profile.id);
  const portfolioIds = new Set<string>();
  for (let index = 0; index < ids.length; index += 500) {
    const batch = ids.slice(index, index + 500);
    const [legacyResult, currentResult] = await Promise.all([
      supabaseAdmin.from("portfolio_items").select("profile_id").in("profile_id", batch),
      supabaseAdmin.from("portfolios").select("profile_id, portfolio_projects(id)").in("profile_id", batch),
    ]);
    if (legacyResult.error) throw new Error(`Unable to verify legacy portfolios: ${legacyResult.error.message}`);
    if (currentResult.error) throw new Error(`Unable to verify current portfolios: ${currentResult.error.message}`);
    (legacyResult.data || []).forEach((item) => portfolioIds.add(item.profile_id));
    (currentResult.data || []).forEach((item) => {
      if (Array.isArray(item.portfolio_projects) && item.portfolio_projects.length > 0) portfolioIds.add(item.profile_id);
    });
  }

  const eligible = (profiles || []).map((profile) => ({
    profile,
    ...getCompletionDetails(profile, portfolioIds.has(profile.id)),
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

  const baseUrl = (process.env.NEXT_PUBLIC_SITE_URL || "https://tarawork.online").replace(/\/$/, "");
  return eligible.flatMap(({ profile, completion, missingFields }): ProfileReminderRecipient[] => {
    const id = String(profile.id);
    const role = String(profile.role).toLowerCase() as "freelancer" | "employer";
    const email = emails.get(id);
    if (!email || recentlySent.has(id)) return [];
    const slug = getProfileSlug(clean(profile.username, 120), id);
    return [{
      id,
      name: clean(profile.name, 160) || (role === "employer" ? "Employer" : "Freelancer"),
      role,
      email,
      completion,
      missingFields,
      profileUrl: `${baseUrl}/${encodeURIComponent(slug)}`,
      messageUrl: `${baseUrl}/messages`,
    }];
  });
}

function renderTemplate(template: string, recipient: ProfileReminderRecipient) {
  const values: Record<string, string> = {
    name: recipient.name,
    role: recipient.role === "employer" ? "Employer" : "Freelancer",
    completion: String(recipient.completion),
    profile_url: recipient.profileUrl,
    missing_fields: recipient.missingFields.join(", ") || "None",
  };
  return template.replace(/\{\{(name|role|completion|profile_url|missing_fields)\}\}/g, (_, key: string) => values[key]);
}

function renderHtmlTemplate(template: string, recipient: ProfileReminderRecipient) {
  const values: Record<string, string> = {
    role: recipient.role === "employer" ? "Employer" : "Freelancer",
    completion: String(recipient.completion),
    missing_fields: recipient.missingFields.join(", ") || "None",
  };
  const tokens = template.split(/(\{\{(?:name|role|completion|profile_url|missing_fields)\}\})/g);
  return tokens.map((token) => {
    if (token === "{{name}}") {
      return `<a href="${escapeHtml(recipient.messageUrl)}" style="color:#4f46e5;font-weight:700;text-decoration:underline">${escapeHtml(recipient.name)}</a>`;
    }
    if (token === "{{profile_url}}") {
      return `<a href="${escapeHtml(recipient.profileUrl)}" style="color:#4f46e5;font-weight:700">${escapeHtml(recipient.profileUrl)}</a>`;
    }
    const match = token.match(/^\{\{(role|completion|missing_fields)\}\}$/);
    if (match) return escapeHtml(values[match[1]]);
    return escapeHtml(token);
  }).join("").replace(/\n/g, "<br />");
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
        html: `<div style="font-family:Arial,sans-serif;line-height:1.7;color:#0f172a;max-width:680px;margin:auto"><p>${renderHtmlTemplate(config.message, recipient)}</p><p><a href="${escapeHtml(recipient.profileUrl)}" style="display:inline-block;background:#4f46e5;color:#fff;text-decoration:none;padding:12px 20px;border-radius:10px;font-weight:700">Complete your profile</a></p><hr style="border:0;border-top:1px solid #e2e8f0;margin:24px 0"><p style="font-size:12px;color:#64748b">TaraWork Support</p></div>`,
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
        metadata: { completion: recipient.completion, role: recipient.role, missingFields: recipient.missingFields, triggeredBy },
      });
      await supabaseAdmin.from("notifications").insert({
        user_id: recipient.id,
        title: subject,
        message,
        type: "warning",
        link: recipient.profileUrl,
      });
    } catch {
      failed += 1;
    }
  }
  return { sent, failed, recipients };
}

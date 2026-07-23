import nodemailer from "nodemailer";
import { supabaseAdmin } from "@/lib/supabase_admin";
import { getJobSharePath } from "@/lib/jobShare";

export type JobMatchConfig = {
  enabled: boolean;
  threshold: number;
  subject: string;
  message: string;
  cooldownDays: number;
};
export type JobMatchRecipient = {
  userId: string;
  name: string;
  email: string;
  jobId: string;
  jobTitle: string;
  company: string;
  score: number;
  matchedSkills: string[];
  jobUrl: string;
};

const CONFIG_TYPE = "job_match_automation_config";
const MESSAGE_TYPE = "job_match_reminder";
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const clean = (value: unknown, max: number) => String(value || "").trim().slice(0, max);
const normalize = (value: unknown) => clean(value, 120).toLowerCase();
const escapeHtml = (value: string) =>
  value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

export const DEFAULT_JOB_MATCH_CONFIG: JobMatchConfig = {
  enabled: false,
  threshold: 50,
  subject: "",
  message: "",
  cooldownDays: 14,
};

export function normalizeJobMatchConfig(value: unknown): JobMatchConfig {
  const input = value && typeof value === "object" ? value as Record<string, unknown> : {};
  return {
    enabled: input.enabled === true,
    threshold: Math.min(100, Math.max(50, Math.round(Number(input.threshold ?? 50)))),
    cooldownDays: Math.min(90, Math.max(1, Math.round(Number(input.cooldownDays ?? 14)))),
    subject: clean(input.subject, 180),
    message: clean(input.message, 8000),
  };
}

export async function getJobMatchConfig() {
  const { data, error } = await supabaseAdmin.from("email_messages").select("metadata")
    .eq("type", CONFIG_TYPE).order("created_at", { ascending: false }).limit(1).maybeSingle();
  if (error) throw error;
  return normalizeJobMatchConfig(data?.metadata);
}

export async function saveJobMatchConfig(config: JobMatchConfig, adminId?: string) {
  const { error } = await supabaseAdmin.from("email_messages").insert({
    type: CONFIG_TYPE,
    direction: "outbound",
    subject: config.subject || "Job match automation settings",
    text_body: config.message || "",
    status: "draft",
    metadata: { ...config, updatedBy: adminId || null },
  });
  if (error) throw error;
}

function scoreMatch(profile: Record<string, unknown>, job: Record<string, unknown>) {
  const userSkills = new Set((Array.isArray(profile.skills) ? profile.skills : []).map(normalize).filter(Boolean));
  const jobSkills = (Array.isArray(job.skills) ? job.skills : []).map(normalize).filter(Boolean);
  const matchedSkills = jobSkills.filter((skill) => userSkills.has(skill));
  const skillScore = jobSkills.length ? (matchedSkills.length / jobSkills.length) * 100 : 55;
  const categoryScore = normalize(profile.category) && normalize(profile.category) === normalize(job.category) ? 100 : 0;
  return { score: Math.round(skillScore * 0.75 + categoryScore * 0.25), matchedSkills };
}

async function getEmail(profile: Record<string, unknown>) {
  const insights = profile.aiInsights && typeof profile.aiInsights === "object"
    ? profile.aiInsights as Record<string, unknown> : {};
  const application = insights.applicationProfile && typeof insights.applicationProfile === "object"
    ? insights.applicationProfile as Record<string, unknown> : {};
  const savedEmail = clean(application.contactEmail, 320).toLowerCase();
  if (EMAIL.test(savedEmail)) return savedEmail;
  const { data } = await supabaseAdmin.auth.admin.getUserById(String(profile.id));
  const authEmail = clean(data.user?.email, 320).toLowerCase();
  return EMAIL.test(authEmail) ? authEmail : "";
}

export async function getJobMatchRecipients(config: JobMatchConfig, excludeRecentlySent = true) {
  const [{ data: profiles, error: profileError }, { data: jobs, error: jobError }, { data: applications, error: applicationError }] = await Promise.all([
    supabaseAdmin.from("profiles").select("id, name, category, skills, aiInsights").eq("role", "freelancer"),
    supabaseAdmin.from("jobs").select("id, title, company, category, skills, status, createdAt").eq("status", "live"),
    supabaseAdmin.from("applications").select("freelancer_id, job_id"),
  ]);
  if (profileError) throw profileError;
  if (jobError) throw jobError;
  if (applicationError) throw applicationError;
  const appliedPairs = new Set((applications || []).map((item) => `${item.freelancer_id}:${item.job_id}`));

  let sentPairs = new Set<string>();
  if (excludeRecentlySent) {
    const since = new Date(Date.now() - config.cooldownDays * 86400000).toISOString();
    const { data } = await supabaseAdmin.from("email_messages").select("related_id, metadata")
      .eq("type", MESSAGE_TYPE).eq("status", "sent").gte("created_at", since);
    sentPairs = new Set((data || []).map((item) => `${item.related_id}:${item.metadata?.jobId || ""}`));
  }

  const baseUrl = (process.env.NEXT_PUBLIC_SITE_URL || "https://tarawork.online").replace(/\/$/, "");
  const recipients = await Promise.all((profiles || []).map(async (profile) => {
    const matches = (jobs || []).map((job) => ({ job, ...scoreMatch(profile, job) }))
      .filter((match) =>
        match.score >= config.threshold &&
        !sentPairs.has(`${profile.id}:${match.job.id}`) &&
        !appliedPairs.has(`${profile.id}:${match.job.id}`),
      )
      .sort((a, b) => b.score - a.score);
    const best = matches[0];
    if (!best) return null;
    const email = await getEmail(profile);
    if (!email) return null;
    return {
      userId: profile.id,
      name: clean(profile.name, 160) || "Freelancer",
      email,
      jobId: best.job.id,
      jobTitle: best.job.title,
      company: clean(best.job.company, 180) || "TaraWork employer",
      score: best.score,
      matchedSkills: best.matchedSkills,
      jobUrl: `${baseUrl}${getJobSharePath({ id: best.job.id, title: best.job.title })}`,
    } satisfies JobMatchRecipient;
  }));
  return recipients.filter((recipient): recipient is JobMatchRecipient => recipient !== null);
}

function render(template: string, recipient: JobMatchRecipient) {
  const values: Record<string, string> = {
    name: recipient.name,
    job_title: recipient.jobTitle,
    company: recipient.company,
    match_score: String(recipient.score),
    matched_skills: recipient.matchedSkills.join(", ") || "your profile skills",
    job_url: recipient.jobUrl,
  };
  return template.replace(/\{\{(name|job_title|company|match_score|matched_skills|job_url)\}\}/g, (_, key: string) => values[key]);
}

export async function sendJobMatches(config: JobMatchConfig, triggeredBy: string) {
  if (!config.subject || !config.message) throw new Error("Add a subject and message before running the automation.");
  const recipients = (await getJobMatchRecipients(config, true)).slice(0, 200);
  if (!recipients.length) return { sent: 0, failed: 0, recipients };
  const smtpUser = process.env.SMTP_USER || "";
  const smtpPass = process.env.SMTP_PASS || "";
  if (!smtpUser || !smtpPass) throw new Error("SMTP is not configured.");
  const port = Number(process.env.SMTP_PORT || "465");
  const fromName = process.env.MARKETING_EMAIL_FROM_NAME || "TaraWork Support";
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.hostinger.com", port, secure: port === 465, auth: { user: smtpUser, pass: smtpPass },
  });

  let sent = 0;
  let failed = 0;
  for (const recipient of recipients) {
    const subject = render(config.subject, recipient);
    const message = render(config.message, recipient);
    try {
      await transporter.sendMail({
        from: `"${fromName}" <${smtpUser}>`, to: recipient.email, replyTo: smtpUser, subject, text: message,
        html: `<div style="font-family:Arial,sans-serif;line-height:1.7;color:#0f172a;max-width:680px;margin:auto"><p style="white-space:pre-line">${escapeHtml(message)}</p><p><a href="${escapeHtml(recipient.jobUrl)}" style="display:inline-block;background:#4f46e5;color:#fff;text-decoration:none;padding:12px 20px;border-radius:10px;font-weight:700">View matching job</a></p><hr style="border:0;border-top:1px solid #e2e8f0;margin:24px 0"><p style="font-size:12px;color:#64748b">TaraWork Job Match</p></div>`,
      });
      sent += 1;
      await supabaseAdmin.from("email_messages").insert({
        type: MESSAGE_TYPE, direction: "outbound", from_email: smtpUser, from_name: fromName,
        to_email: recipient.email, reply_to: smtpUser, subject, text_body: message, status: "sent",
        related_table: "profiles", related_id: recipient.userId,
        metadata: { jobId: recipient.jobId, matchScore: recipient.score, triggeredBy },
      });
      await supabaseAdmin.from("notifications").insert({
        user_id: recipient.userId, title: subject, message, type: "info", link: getJobSharePath({ id: recipient.jobId, title: recipient.jobTitle }),
      });
    } catch {
      failed += 1;
    }
  }
  return { sent, failed, recipients };
}

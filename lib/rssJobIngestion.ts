import { createHash } from "node:crypto";
import Parser from "rss-parser";
import { supabaseAdmin } from "@/lib/supabase_admin";
import { curateRssJob, mergeAiCuration, semanticJobKey } from "@/lib/rssJobCuration";
import { classifyRssJobsWithLocalAi } from "@/lib/rssLocalAi";

export type FeedConfig = { name: string; url: string };
export type RssAutomationConfig = { enabled: boolean; expiryDays: number; minimumQualityScore: number; maximumScamRiskScore: number; excludeUsOnly: boolean; useLocalAi: boolean; feeds: FeedConfig[] };
type ExistingJob = { external_url: string | null; title: string; company: string | null; semantic_fingerprint?: string | null };
type RssItemFields = { companyName?: string };

const MAX_ITEMS_PER_FEED = 50;
const MAX_CURATED_RSS_JOBS = 500;
const DEFAULT_CONFIG: RssAutomationConfig = {
  enabled: false,
  expiryDays: 21,
  minimumQualityScore: 55,
  maximumScamRiskScore: 35,
  excludeUsOnly: true,
  useLocalAi: true,
  feeds: [
    { name: "Himalayas", url: "https://himalayas.app/jobs/rss" },
    { name: "Remote OK", url: "https://remoteok.com/remote-jobs.rss" },
  ],
};

const cleanText = (value: unknown, maxLength: number) => String(value || "")
  .replace(/<style[\s\S]*?<\/style>/gi, " ")
  .replace(/<script[\s\S]*?<\/script>/gi, " ")
  .replace(/<[^>]+>/g, " ")
  .replace(/&nbsp;/gi, " ")
  .replace(/&amp;/gi, "&")
  .replace(/&lt;/gi, "<")
  .replace(/&gt;/gi, ">")
  .replace(/&#39;/g, "'")
  .replace(/&quot;/gi, '"')
  .replace(/\s+/g, " ")
  .trim()
  .slice(0, maxLength);

const dedupKey = (title: string, company: string) => `${title}|${company}`.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
const stableJobId = (url: string) => `rss_${createHash("sha256").update(url).digest("hex").slice(0, 24)}`;

export function normalizeRssConfig(value: unknown): RssAutomationConfig {
  const input = value && typeof value === "object" ? value as Record<string, unknown> : {};
  const rawFeeds = Array.isArray(input.feeds) ? input.feeds : DEFAULT_CONFIG.feeds;
  const feeds = rawFeeds.slice(0, 12).map((entry, index) => {
    const candidate = entry as Partial<FeedConfig>;
    const name = cleanText(candidate.name || `Feed ${index + 1}`, 120);
    let url: URL;
    try { url = new URL(String(candidate.url || "")); } catch { throw new Error(`Invalid RSS URL for ${name}.`); }
    if (url.protocol !== "https:") throw new Error(`RSS URL for ${name} must use HTTPS.`);
    return { name, url: url.toString() };
  });
  return {
    enabled: input.enabled === true,
    expiryDays: Math.min(30, Math.max(14, Math.round(Number(input.expiryDays ?? 21)))),
    minimumQualityScore: Math.min(90, Math.max(30, Math.round(Number(input.minimumQualityScore ?? 55)))),
    maximumScamRiskScore: Math.min(80, Math.max(0, Math.round(Number(input.maximumScamRiskScore ?? 35)))),
    excludeUsOnly: input.excludeUsOnly !== false,
    useLocalAi: input.useLocalAi !== false,
    feeds,
  };
}

export async function getRssAutomationConfig() {
  const { data, error } = await supabaseAdmin.from("rss_automation_configs").select("enabled,expiry_days,minimum_quality_score,maximum_scam_risk_score,exclude_us_only,use_local_ai,feeds").eq("id", "primary").maybeSingle();
  if (error) throw error;
  if (!data) return DEFAULT_CONFIG;
  return normalizeRssConfig({ enabled: data.enabled, expiryDays: data.expiry_days, minimumQualityScore: data.minimum_quality_score, maximumScamRiskScore: data.maximum_scam_risk_score, excludeUsOnly: data.exclude_us_only, useLocalAi: data.use_local_ai, feeds: data.feeds });
}

export async function saveRssAutomationConfig(config: RssAutomationConfig, adminId?: string) {
  const normalized = normalizeRssConfig(config);
  const { error } = await supabaseAdmin.from("rss_automation_configs").upsert({
    id: "primary", enabled: normalized.enabled, expiry_days: normalized.expiryDays, minimum_quality_score: normalized.minimumQualityScore,
    maximum_scam_risk_score: normalized.maximumScamRiskScore, exclude_us_only: normalized.excludeUsOnly, use_local_ai: normalized.useLocalAi, feeds: normalized.feeds,
    updated_by: adminId || null, updated_at: new Date().toISOString(),
  });
  if (error) throw error;
  return normalized;
}

function itemDate(item: Parser.Item) {
  const candidate = item.isoDate || item.pubDate;
  if (!candidate) return new Date();
  const parsed = new Date(candidate);
  return Number.isNaN(parsed.getTime()) ? new Date() : parsed;
}

export async function ingestRssJobs(config?: RssAutomationConfig, trigger: "manual" | "cron" = "cron", adminId?: string) {
  const resolved = normalizeRssConfig(config || await getRssAutomationConfig());
  if (trigger === "cron" && !resolved.enabled) return { skipped: true, reason: "RSS automation is disabled.", feeds: resolved.feeds.length, inserted: 0, duplicates: 0, expired: 0, errors: [] as string[] };
  const feeds = resolved.feeds;
  if (!feeds.length) return { skipped: true, reason: "No RSS feeds are configured.", feeds: 0, inserted: 0, duplicates: 0, expired: 0, errors: [] as string[] };

  const { data: run, error: runError } = await supabaseAdmin.from("rss_automation_runs").insert({ trigger_type: trigger, started_by: adminId || null }).select("id").single();
  if (runError) throw runError;

  const now = new Date();
  const days = resolved.expiryDays;
  const { data: existing, error: existingError } = await supabaseAdmin
    .from("jobs")
    .select("external_url,title,company,semantic_fingerprint")
    .eq("source", "rss")
    .limit(5000);
  if (existingError) throw existingError;

  const existingJobs = (existing || []) as ExistingJob[];
  const knownUrls = new Set(existingJobs.map((job) => job.external_url).filter(Boolean) as string[]);
  const knownListings = new Set(existingJobs.map((job) => dedupKey(job.title, job.company || "")));
  const semanticListings = new Set(existingJobs.map((job) => job.semantic_fingerprint || semanticJobKey(job.title, job.company || "")));
  const parser = new Parser<Record<string, never>, RssItemFields>({
    headers: { "User-Agent": "TaraWork-RSS/1.0" }, timeout: 15_000, maxRedirects: 3,
    customFields: { item: [["himalayasJobs:companyName", "companyName"]] },
  });
  const rows: Record<string, unknown>[] = [];
  const errors: string[] = [];
  let duplicates = 0;
  let rejected = 0;
  let aiProcessed = 0;
  let aiFallback = 0;

  for (const feed of feeds) {
    try {
      const parsed = await parser.parseURL(feed.url);
      const candidates: Array<{ externalUrl: string; title: string; company: string; description: string; listingKey: string; semanticKey: string; publishedAt: Date; expiresAt: Date }> = [];
      for (const item of parsed.items.slice(0, MAX_ITEMS_PER_FEED)) {
        const externalUrl = String(item.link || item.guid || "").trim();
        const title = cleanText(item.title, 240);
        const company = cleanText(item.companyName || item.creator || parsed.title || feed.name, 160);
        if (!title || !externalUrl) continue;
        let safeUrl: URL;
        try { safeUrl = new URL(externalUrl); } catch { continue; }
        if (!/^https?:$/.test(safeUrl.protocol)) continue;
        const listingKey = dedupKey(title, company);
        const semanticKey = semanticJobKey(title, company);
        if (knownUrls.has(safeUrl.toString()) || knownListings.has(listingKey) || semanticListings.has(semanticKey)) { duplicates += 1; continue; }

        const publishedAt = itemDate(item);
        const expiresAt = new Date(publishedAt.getTime() + days * 86_400_000);
        if (expiresAt <= now) continue;
        const description = cleanText(item.contentSnippet || item.content || item.summary || `${title} at ${company}`, 8000);
        candidates.push({ externalUrl: safeUrl.toString(), title, company, description, listingKey, semanticKey, publishedAt, expiresAt });
      }
      const aiBatch = resolved.useLocalAi ? await classifyRssJobsWithLocalAi(candidates.map((job) => ({ key: job.semanticKey, title: job.title, company: job.company, description: job.description }))) : { results: new Map(), errors: [], processed: 0, fallback: candidates.length };
      aiProcessed += aiBatch.processed; aiFallback += aiBatch.fallback;
      for (const candidate of candidates) {
        const { externalUrl, title, company, description, listingKey, semanticKey, publishedAt, expiresAt } = candidate;
        const baseCuration = curateRssJob({ title, company, description, publishedAt, expiresAt, rate: "See source listing" }, resolved);
        const aiResult = aiBatch.results.get(semanticKey);
        const curation = aiResult ? mergeAiCuration(baseCuration, aiResult, resolved) : baseCuration;
        if (!curation.accepted) { rejected += 1; continue; }
        const estimatedRate = curation.salaryEstimate ? `Estimated $${Math.round(curation.salaryEstimate.min / 1000)}k–$${Math.round(curation.salaryEstimate.max / 1000)}k USD/year` : "See source listing";
        rows.push({
          id: stableJobId(externalUrl), title, description, company,
          category: curation.category, paymentMethod: "Flat-Rate", rate: estimatedRate,
          duration: "Ongoing", skills: curation.skills, createdAt: publishedAt.toISOString(), jobType: "Contract",
          status: "live", source: "rss", source_feed: feed.name, external_url: externalUrl,
          published_at: publishedAt.toISOString(), expires_at: expiresAt.toISOString(), energy_requirement: "Balanced",
          semantic_fingerprint: curation.semanticKey, location_label: curation.location, location_eligible: !curation.usOnly,
          quality_score: curation.qualityScore, scam_risk_score: curation.scamRiskScore, scam_risk_reasons: curation.scamReasons,
          seniority_tag: curation.seniority, salary_estimated: Boolean(curation.salaryEstimate), salary_estimate_min: curation.salaryEstimate?.min || null,
          salary_estimate_max: curation.salaryEstimate?.max || null, salary_estimate_currency: curation.salaryEstimate?.currency || null,
          curation_status: "curated", curated_at: now.toISOString(),
        });
        knownUrls.add(externalUrl);
        knownListings.add(listingKey);
        semanticListings.add(semanticKey);
      }
    } catch (error) {
      errors.push(`${feed.name}: ${error instanceof Error ? error.message : "Unable to parse feed."}`);
    }
  }

  let inserted = 0;
  if (rows.length) {
    const { error } = await supabaseAdmin.from("jobs").insert(rows);
    if (error) throw error;
    inserted = rows.length;
  }
  const { data: expiredRows, error: expiryError } = await supabaseAdmin
    .from("jobs")
    .update({ status: "closed" })
    .eq("source", "rss")
    .eq("status", "live")
    .lte("expires_at", now.toISOString())
    .select("id");
  if (expiryError) throw expiryError;

  const { data: overflowRows, error: overflowError } = await supabaseAdmin
    .from("jobs")
    .select("id")
    .eq("source", "rss")
    .eq("status", "live")
    .eq("curation_status", "curated")
    .order("quality_score", { ascending: false })
    .order("scam_risk_score", { ascending: true })
    .order("published_at", { ascending: false })
    .range(MAX_CURATED_RSS_JOBS, 4999);
  if (overflowError) throw overflowError;
  const overflowIds = (overflowRows || []).map((job) => job.id);
  if (overflowIds.length) {
    const { error: trimError } = await supabaseAdmin.from("jobs").update({ status: "closed" }).in("id", overflowIds);
    if (trimError) throw trimError;
  }

  const result = { skipped: false, feeds: feeds.length, inserted, duplicates, rejected, aiProcessed, aiFallback, trimmed: overflowIds.length, expired: expiredRows?.length || 0, errors };
  const { error: completionError } = await supabaseAdmin.from("rss_automation_runs").update({
    status: errors.length === feeds.length ? "failed" : "completed", inserted_count: inserted,
    duplicate_count: duplicates, expired_count: result.expired, errors, completed_at: new Date().toISOString(),
    rejected_count: rejected, ai_processed_count: aiProcessed, ai_fallback_count: aiFallback,
  }).eq("id", run.id);
  if (completionError) throw completionError;
  return result;
}

import { createHash } from "node:crypto";
import Parser from "rss-parser";
import { supabaseAdmin } from "@/lib/supabase_admin";

type FeedConfig = { name: string; url: string };
type ExistingJob = { external_url: string | null; title: string; company: string | null };

const MAX_ITEMS_PER_FEED = 50;
const DEFAULT_EXPIRY_DAYS = 21;

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

function expiryDays() {
  const configured = Number(process.env.RSS_JOB_EXPIRY_DAYS || DEFAULT_EXPIRY_DAYS);
  return Number.isFinite(configured) ? Math.min(30, Math.max(14, Math.round(configured))) : DEFAULT_EXPIRY_DAYS;
}

export function getRssFeedConfigs(): FeedConfig[] {
  const raw = process.env.RSS_JOB_FEEDS?.trim();
  if (!raw) return [];
  let value: unknown;
  try { value = JSON.parse(raw); } catch { throw new Error("RSS_JOB_FEEDS must be a JSON array of { name, url } objects."); }
  if (!Array.isArray(value)) throw new Error("RSS_JOB_FEEDS must be a JSON array.");
  return value.map((entry, index) => {
    const candidate = entry as Partial<FeedConfig>;
    const name = cleanText(candidate.name || `Feed ${index + 1}`, 120);
    let url: URL;
    try { url = new URL(String(candidate.url || "")); } catch { throw new Error(`Invalid RSS URL for ${name}.`); }
    if (url.protocol !== "https:") throw new Error(`RSS URL for ${name} must use HTTPS.`);
    return { name, url: url.toString() };
  });
}

function itemDate(item: Parser.Item) {
  const candidate = item.isoDate || item.pubDate;
  if (!candidate) return new Date();
  const parsed = new Date(candidate);
  return Number.isNaN(parsed.getTime()) ? new Date() : parsed;
}

export async function ingestRssJobs() {
  const feeds = getRssFeedConfigs();
  if (!feeds.length) return { skipped: true, reason: "RSS_JOB_FEEDS is not configured.", feeds: 0, inserted: 0, duplicates: 0, expired: 0, errors: [] as string[] };

  const now = new Date();
  const days = expiryDays();
  const { data: existing, error: existingError } = await supabaseAdmin
    .from("jobs")
    .select("external_url,title,company")
    .eq("source", "rss")
    .limit(5000);
  if (existingError) throw existingError;

  const existingJobs = (existing || []) as ExistingJob[];
  const knownUrls = new Set(existingJobs.map((job) => job.external_url).filter(Boolean) as string[]);
  const knownListings = new Set(existingJobs.map((job) => dedupKey(job.title, job.company || "")));
  const parser = new Parser({ headers: { "User-Agent": "TaraWork-RSS/1.0" }, timeout: 15_000, maxRedirects: 3 });
  const rows: Record<string, unknown>[] = [];
  const errors: string[] = [];
  let duplicates = 0;

  for (const feed of feeds) {
    try {
      const parsed = await parser.parseURL(feed.url);
      for (const item of parsed.items.slice(0, MAX_ITEMS_PER_FEED)) {
        const externalUrl = String(item.link || item.guid || "").trim();
        const title = cleanText(item.title, 240);
        const company = cleanText(item.creator || parsed.title || feed.name, 160);
        if (!title || !externalUrl) continue;
        let safeUrl: URL;
        try { safeUrl = new URL(externalUrl); } catch { continue; }
        if (!/^https?:$/.test(safeUrl.protocol)) continue;
        const listingKey = dedupKey(title, company);
        if (knownUrls.has(safeUrl.toString()) || knownListings.has(listingKey)) { duplicates += 1; continue; }

        const publishedAt = itemDate(item);
        const expiresAt = new Date(publishedAt.getTime() + days * 86_400_000);
        if (expiresAt <= now) continue;
        const description = cleanText(item.contentSnippet || item.content || item.summary || `${title} at ${company}`, 8000);
        rows.push({
          id: stableJobId(safeUrl.toString()), title, description, company,
          category: "Other", paymentMethod: "Flat-Rate", rate: "See source listing",
          duration: "Ongoing", skills: [], createdAt: publishedAt.toISOString(), jobType: "Contract",
          status: "live", source: "rss", source_feed: feed.name, external_url: safeUrl.toString(),
          published_at: publishedAt.toISOString(), expires_at: expiresAt.toISOString(), energy_requirement: "Balanced",
        });
        knownUrls.add(safeUrl.toString());
        knownListings.add(listingKey);
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

  return { skipped: false, feeds: feeds.length, inserted, duplicates, expired: expiredRows?.length || 0, errors };
}

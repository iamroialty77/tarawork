import { supabaseAdmin } from "@/lib/supabase_admin";
import { getSiteSettings, saveSiteSettings } from "@/lib/siteSettings";
import { querySearchPerformance } from "@/lib/googleSearchConsole";

export type SeoAutomationMode = "monitor" | "approval" | "safe_autopilot";
export type SeoAutomationConfig = { enabled: boolean; mode: SeoAutomationMode; schedule: "daily" | "weekly" | "monthly"; seedKeywords: string[]; minimumScore: number; maxChangesPerRun: number; protectHomeMetadata: boolean; googleSiteUrl: string; lastRunAt: string | null; nextRunAt: string | null; updatedBy: string | null };
export const DEFAULT_SEO_AUTOMATION_CONFIG: SeoAutomationConfig = { enabled: false, mode: "approval", schedule: "weekly", seedKeywords: ["remote jobs Philippines", "hire Filipino freelancers"], minimumScore: 70, maxChangesPerRun: 3, protectHomeMetadata: true, googleSiteUrl: "", lastRunAt: null, nextRunAt: null, updatedBy: null };
const clean = (value: unknown, max = 80) => String(value || "").replace(/\s+/g, " ").trim().slice(0, max);
const normalize = (value: unknown) => clean(value).toLowerCase().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, " ").trim();

export async function getSeoAutomationConfig() {
  const { data, error } = await supabaseAdmin.from("seo_automation_configs").select("*").eq("id", "primary").maybeSingle();
  if (error) throw new Error(error.message); if (!data) return DEFAULT_SEO_AUTOMATION_CONFIG;
  return { enabled: Boolean(data.enabled), mode: data.mode as SeoAutomationMode, schedule: data.schedule, seedKeywords: Array.isArray(data.seed_keywords) ? data.seed_keywords : DEFAULT_SEO_AUTOMATION_CONFIG.seedKeywords, minimumScore: Number(data.minimum_score) || 70, maxChangesPerRun: Number(data.max_changes_per_run) || 3, protectHomeMetadata: data.protect_home_metadata !== false, googleSiteUrl: clean(data.google_site_url, 500), lastRunAt: data.last_run_at, nextRunAt: data.next_run_at, updatedBy: data.updated_by } as SeoAutomationConfig;
}

export async function saveSeoAutomationConfig(input: Partial<SeoAutomationConfig>, adminId: string) {
  const mode: SeoAutomationMode = ["monitor", "approval", "safe_autopilot"].includes(String(input.mode)) ? input.mode as SeoAutomationMode : "approval";
  const schedule = ["daily", "weekly", "monthly"].includes(String(input.schedule)) ? input.schedule : "weekly";
  const seeds = [...new Set((Array.isArray(input.seedKeywords) ? input.seedKeywords : []).map((item) => clean(item, 70)).filter(Boolean))].slice(0, 12);
  const payload = { id: "primary", enabled: Boolean(input.enabled), mode, schedule, seed_keywords: seeds.length ? seeds : DEFAULT_SEO_AUTOMATION_CONFIG.seedKeywords, minimum_score: Math.max(50, Math.min(100, Number(input.minimumScore) || 70)), max_changes_per_run: Math.max(1, Math.min(10, Number(input.maxChangesPerRun) || 3)), protect_home_metadata: input.protectHomeMetadata !== false, google_site_url: clean(input.googleSiteUrl, 500) || null, updated_by: adminId, updated_at: new Date().toISOString() };
  const { error } = await supabaseAdmin.from("seo_automation_configs").upsert(payload); if (error) throw new Error(error.message); return getSeoAutomationConfig();
}

type Signal = { keyword: string; sources: Set<string>; frequency: number; impressions: number; clicks: number; ctr: number | null; position: number | null; targetPage: string };
const intent = (keyword: string) => /\b(hire|hiring|talent|freelancer|assistant|developer)\b/i.test(keyword) ? "commercial" : /\b(job|jobs|work|apply|salary|rate)\b/i.test(keyword) ? "transactional" : /\b(how|what|best|guide|tips|cost)\b/i.test(keyword) ? "informational" : "discovery";

async function discover(config: SeoAutomationConfig) {
  const signals = new Map<string, Signal>();
  const add = (raw: unknown, source: string, frequency = 1, metrics?: Partial<Signal>) => { const keyword = normalize(raw); if (keyword.length < 8 || keyword.split(" ").length < 2 || /\b(other|general|adminva|uncategorized|unknown)\b/.test(keyword)) return; const current = signals.get(keyword) || { keyword, sources: new Set<string>(), frequency: 0, impressions: 0, clicks: 0, ctr: null, position: null, targetPage: "/" }; current.sources.add(source); current.frequency += frequency; Object.assign(current, Object.fromEntries(Object.entries(metrics || {}).filter(([, value]) => value !== undefined))); signals.set(keyword, current); };
  const autocomplete = await Promise.all(config.seedKeywords.map((seed) => fetch(`https://suggestqueries.google.com/complete/search?client=firefox&hl=en-PH&q=${encodeURIComponent(seed)}`, { signal: AbortSignal.timeout(5000), cache: "no-store" }).then((response) => response.ok ? response.json() : null).catch(() => null)));
  autocomplete.forEach((result) => Array.isArray(result?.[1]) && result[1].forEach((item: unknown) => add(item, "google_autocomplete", 3)));
  config.seedKeywords.forEach((seed) => { add(seed, "configured_seed", 2); add(`${seed} 2026`, "opportunity_model"); add(`best ${seed}`, "opportunity_model"); });
  const [jobs, profiles, blogs] = await Promise.all([supabaseAdmin.from("jobs").select("title,category,skills").limit(500), supabaseAdmin.from("profiles").select("category,skills").eq("role", "freelancer").limit(500), supabaseAdmin.from("blog_posts").select("title,keyword").eq("status", "published").limit(250)]);
  (jobs.data || []).forEach((row) => { add(row.title, "marketplace", 2); add(`${row.category || "remote"} jobs philippines`, "marketplace", 2); });
  (profiles.data || []).forEach((row) => add(`hire filipino ${row.category || "freelancer"}`, "talent_directory", 2));
  (blogs.data || []).forEach((row) => { add(row.keyword, "published_content", 2); add(row.title, "published_content"); });
  if (config.googleSiteUrl) try { const rows = await querySearchPerformance(config.googleSiteUrl); rows.forEach((row: any) => add(row.keys?.[0], "search_console", 5, { impressions: Number(row.impressions) || 0, clicks: Number(row.clicks) || 0, ctr: Number(row.ctr) || 0, position: Number(row.position) || null, targetPage: clean(row.keys?.[1], 500) || "/" })); } catch { /* Connection problems are reported in the run summary without stopping discovery. */ }
  return [...signals.values()].map((item) => { const words = item.keyword.split(" "); const hasLocal = /philippines|filipino|pinoy/.test(item.keyword); const gsc = item.sources.has("search_console"); const quickWin = item.position !== null && item.position >= 4 && item.position <= 20; const lowCtr = item.impressions >= 20 && (item.ctr || 0) < .03; const score = Math.min(100, 30 + Math.min(item.frequency, 8) * 3 + (hasLocal ? 12 : 0) + (words.length >= 3 && words.length <= 7 ? 8 : 0) + (gsc ? 12 : 0) + (quickWin ? 18 : 0) + (lowCtr ? 8 : 0)); return { ...item, sources: [...item.sources], score, intent: intent(item.keyword), competition: words.length >= 5 ? "low" : score >= 85 && words.length <= 3 ? "high" : "medium" }; }).sort((a, b) => b.score - a.score || b.impressions - a.impressions).slice(0, 100);
}

const nextRun = (schedule: SeoAutomationConfig["schedule"]) => { const date = new Date(); date.setUTCDate(date.getUTCDate() + (schedule === "daily" ? 1 : schedule === "weekly" ? 7 : 30)); return date.toISOString(); };

export async function runSeoAutomation(trigger: "manual" | "cron", adminId?: string) {
  const config = await getSeoAutomationConfig();
  const { data: run, error: runError } = await supabaseAdmin.from("seo_automation_runs").insert({ trigger_type: trigger, mode: config.mode, status: "running", started_by: adminId || null }).select("id").single(); if (runError) throw new Error(runError.message);
  try {
    if (trigger === "cron" && (!config.enabled || (config.nextRunAt && new Date(config.nextRunAt).getTime() > Date.now()))) { const reason = !config.enabled ? "Automation is disabled." : "The configured schedule is not due yet."; await supabaseAdmin.from("seo_automation_runs").update({ status: "skipped", completed_at: new Date().toISOString(), summary: { reason } }).eq("id", run.id); return { runId: run.id, skipped: true, reason, discovered: 0, applied: 0 }; }
    const opportunities = await discover(config); const qualified = opportunities.filter((item) => item.score >= config.minimumScore);
    for (const item of opportunities) await supabaseAdmin.from("seo_keyword_opportunities").upsert({ keyword: item.keyword, normalized_keyword: item.keyword, source: item.sources, intent: item.intent, opportunity_score: item.score, competition: item.competition, impressions: item.impressions || null, clicks: item.clicks || null, ctr: item.ctr, average_position: item.position, target_page: item.targetPage || "/", status: "monitoring", evidence: { frequency: item.frequency }, last_seen_at: new Date().toISOString() }, { onConflict: "normalized_keyword,target_page" });
    let applied = 0;
    if (qualified.length && config.mode !== "monitor") {
      const selected = qualified.slice(0, config.maxChangesPerRun); const before = await getSiteSettings(); const keywords = [ ...selected.map((item) => item.keyword), ...before.seoKeywords ].filter((item, index, list) => list.findIndex((value) => value.toLowerCase() === item.toLowerCase()) === index).slice(0, 20); const primary = selected[0].keyword; const displayPrimary = primary.replace(/\b\w/g, (character) => character.toUpperCase()); const optimizedTitle = `${displayPrimary} | TaraWork`.slice(0, 60); const optimizedDescription = `Discover ${primary} on TaraWork. Find trusted remote opportunities, skilled Filipino professionals, and practical tools for successful online work.`.slice(0, 160); const after = { ...before, seoKeywords: keywords, ...(config.protectHomeMetadata ? {} : { seoTitle: optimizedTitle, seoDescription: optimizedDescription, ogTitle: optimizedTitle, ogDescription: optimizedDescription }) };
      const status = config.mode === "safe_autopilot" ? "applied" : "proposed";
      if (status === "applied") { await saveSiteSettings(after, adminId || config.updatedBy || "seo-autopilot"); applied = selected.length; }
      await supabaseAdmin.from("seo_change_history").insert({ run_id: run.id, change_type: "homepage_keyword_targets", target_page: "/", before_value: before, after_value: after, reason: `Top ${selected.length} qualified keyword opportunities`, confidence: selected[0].score, status, applied_by: adminId || null });
    }
    const completedAt = new Date().toISOString(); await supabaseAdmin.from("seo_automation_runs").update({ status: "completed", discovered_count: opportunities.length, applied_count: applied, summary: { qualified: qualified.length, topKeywords: opportunities.slice(0, 5).map((item) => ({ keyword: item.keyword, score: item.score })), searchConsoleUsed: opportunities.some((item) => item.sources.includes("search_console")) }, completed_at: completedAt }).eq("id", run.id); await supabaseAdmin.from("seo_automation_configs").update({ last_run_at: completedAt, next_run_at: nextRun(config.schedule) }).eq("id", "primary"); return { runId: run.id, discovered: opportunities.length, qualified: qualified.length, applied, topKeywords: opportunities.slice(0, 10) };
  } catch (error) { await supabaseAdmin.from("seo_automation_runs").update({ status: "failed", error_message: error instanceof Error ? error.message.slice(0, 1000) : "Unknown SEO automation error", completed_at: new Date().toISOString() }).eq("id", run.id); throw error; }
}

export async function rollbackSeoChange(changeId: string, adminId: string) {
  const { data, error } = await supabaseAdmin.from("seo_change_history").select("id,before_value,status").eq("id", changeId).maybeSingle(); if (error || !data) throw new Error(error?.message || "SEO change not found."); if (data.status !== "applied") throw new Error("Only applied changes can be rolled back.");
  await saveSiteSettings(data.before_value, adminId); const { error: updateError } = await supabaseAdmin.from("seo_change_history").update({ status: "rolled_back", rolled_back_at: new Date().toISOString() }).eq("id", changeId); if (updateError) throw new Error(updateError.message);
}

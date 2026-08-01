import { supabaseAdmin } from "@/lib/supabase_admin";
import { sanitizeArticleHtml } from "@/lib/articleHtml";
import { blogCategories } from "@/lib/blog";

export type BlogAutomationConfig = { enabled: boolean; mode: "ideas" | "review" | "auto_publish"; schedule: "weekly" | "biweekly" | "monthly"; articlesPerRun: number; minimumKeywordScore: number; preferredCategories: string[]; tone: string; targetWords: number; lastRunAt: string | null; nextRunAt: string | null; updatedBy: string | null };
export const DEFAULT_BLOG_AUTOMATION_CONFIG: BlogAutomationConfig = { enabled: false, mode: "review", schedule: "weekly", articlesPerRun: 1, minimumKeywordScore: 60, preferredCategories: [...blogCategories], tone: "professional, practical, trustworthy, and helpful", targetWords: 1200, lastRunAt: null, nextRunAt: null, updatedBy: null };
const clean = (value: unknown, max = 200) => String(value || "").replace(/\s+/g, " ").trim().slice(0, max);
const slugify = (value: string) => value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 90);

export function getBlogAiConfig() {
  const configuredBaseUrl = clean(process.env.BLOG_AI_BASE_URL, 500).replace(/\/+$/, "");
  const localProvider = Boolean(configuredBaseUrl);
  const baseUrl = configuredBaseUrl || "https://api.openai.com/v1";
  const apiKey = localProvider ? clean(process.env.BLOG_AI_API_KEY, 1000) : clean(process.env.OPENAI_API_KEY, 1000);
  const accessClientId = clean(process.env.BLOG_AI_ACCESS_CLIENT_ID, 500);
  const accessClientSecret = clean(process.env.BLOG_AI_ACCESS_CLIENT_SECRET, 1000);
  const model = clean(process.env.BLOG_AI_MODEL || process.env.OPENAI_MODEL, 120) || (localProvider ? "llama3.1:8b" : "gpt-4o-mini");
  const isLoopback = /^https?:\/\/(localhost|127\.0\.0\.1|\[::1\])(?::|\/|$)/i.test(baseUrl);
  const insecureProductionUrl = Boolean(process.env.VERCEL && localProvider && !baseUrl.startsWith("https://"));
  const configured = Boolean(apiKey) && !(process.env.VERCEL && isLoopback) && !insecureProductionUrl;
  return { provider: localProvider ? "Local AI" : "OpenAI", baseUrl, apiKey, model, configured, isLoopback, insecureProductionUrl, accessClientId, accessClientSecret };
}

export async function getBlogAutomationConfig() {
  const { data, error } = await supabaseAdmin.from("blog_automation_configs").select("*").eq("id", "primary").maybeSingle();
  if (error) throw new Error(error.message); if (!data) return DEFAULT_BLOG_AUTOMATION_CONFIG;
  return { enabled: Boolean(data.enabled), mode: data.mode, schedule: data.schedule, articlesPerRun: Number(data.articles_per_run) || 1, minimumKeywordScore: Number(data.minimum_keyword_score) || 60, preferredCategories: Array.isArray(data.preferred_categories) ? data.preferred_categories : [...blogCategories], tone: clean(data.tone, 300) || DEFAULT_BLOG_AUTOMATION_CONFIG.tone, targetWords: Number(data.target_words) || 1200, lastRunAt: data.last_run_at, nextRunAt: data.next_run_at, updatedBy: data.updated_by } as BlogAutomationConfig;
}

export async function saveBlogAutomationConfig(input: Partial<BlogAutomationConfig>, adminId: string) {
  const mode = ["ideas", "review", "auto_publish"].includes(String(input.mode)) ? input.mode : "review"; const schedule = ["weekly", "biweekly", "monthly"].includes(String(input.schedule)) ? input.schedule : "weekly";
  const categories = (Array.isArray(input.preferredCategories) ? input.preferredCategories : []).filter((item) => blogCategories.includes(item as any));
  const payload = { id: "primary", enabled: Boolean(input.enabled), mode, schedule, articles_per_run: Math.max(1, Math.min(3, Number(input.articlesPerRun) || 1)), minimum_keyword_score: Math.max(40, Math.min(100, Number(input.minimumKeywordScore) || 60)), preferred_categories: categories.length ? categories : [...blogCategories], tone: clean(input.tone, 300) || DEFAULT_BLOG_AUTOMATION_CONFIG.tone, target_words: Math.max(700, Math.min(2500, Number(input.targetWords) || 1200)), updated_by: adminId, updated_at: new Date().toISOString() };
  const { error } = await supabaseAdmin.from("blog_automation_configs").upsert(payload); if (error) throw new Error(error.message); return getBlogAutomationConfig();
}

async function selectTopics(config: BlogAutomationConfig) {
  const [{ data: opportunities }, { data: posts }] = await Promise.all([
    supabaseAdmin.from("seo_keyword_opportunities").select("keyword,opportunity_score,intent,source,target_page").gte("opportunity_score", config.minimumKeywordScore).order("opportunity_score", { ascending: false }).limit(100),
    supabaseAdmin.from("blog_posts").select("title,keyword,slug").limit(1000),
  ]);
  const covered = new Set((posts || []).flatMap((post) => [post.keyword, post.title, post.slug]).map((item) => clean(item).toLowerCase()));
  const candidates = (opportunities || []).filter((item) => { const keyword = clean(item.keyword).toLowerCase(); if (!keyword || /\b(other|general|adminva|uncategorized|unknown|reddit)\b/.test(keyword) || covered.has(keyword)) return false; return ![...covered].some((existing) => existing.length > 7 && (existing.includes(keyword) || keyword.includes(existing))); });
  return candidates.slice(0, config.articlesPerRun).map((item) => ({ keyword: clean(item.keyword, 120), score: Number(item.opportunity_score) || 0, intent: clean(item.intent, 30), source: item.source || [], targetPage: clean(item.target_page, 500) || "/" }));
}

async function generateArticle(topic: { keyword: string; score: number; intent: string }, config: BlogAutomationConfig) {
  const ai = getBlogAiConfig();
  if (!ai.apiKey) throw new Error(ai.provider === "Local AI" ? "BLOG_AI_API_KEY is required for the Local AI connection." : "OPENAI_API_KEY is required for Blog Autopilot article generation.");
  if (process.env.VERCEL && ai.isLoopback) throw new Error("Vercel cannot reach a localhost Local AI URL. Set BLOG_AI_BASE_URL to a secure public HTTPS tunnel or hosted endpoint.");
  if (ai.insecureProductionUrl) throw new Error("BLOG_AI_BASE_URL must use HTTPS when Blog Autopilot runs on Vercel.");
  const prompt = `Create an original, publication-ready TaraWork blog article targeting the keyword "${topic.keyword}".
Audience: Filipino freelancers and/or businesses hiring Filipino remote talent. Search intent: ${topic.intent}. Tone: ${config.tone}. Target length: about ${config.targetWords} words.
Requirements: useful and specific; no fabricated statistics, testimonials, guarantees, or claims; no keyword stuffing; use concise paragraphs, H2/H3 headings, bullet lists, practical steps, and a natural TaraWork call to action. Do not include an H1 because the page title supplies it. Return valid JSON only with keys title, excerpt, category, imageAlt, readTime, contentHtml. category must be one of: ${config.preferredCategories.join(" | ")}. excerpt must be 140-220 characters. contentHtml may use only p,h2,h3,strong,em,ul,ol,li,blockquote,table,thead,tbody,tr,th,td tags.`;
  const headers: Record<string, string> = { Authorization: `Bearer ${ai.apiKey}`, "Content-Type": "application/json" };
  if (ai.accessClientId && ai.accessClientSecret) { headers["CF-Access-Client-Id"] = ai.accessClientId; headers["CF-Access-Client-Secret"] = ai.accessClientSecret; }
  const response = await fetch(`${ai.baseUrl}/chat/completions`, { method: "POST", headers, body: JSON.stringify({ model: ai.model, temperature: 0.55, response_format: { type: "json_object" }, messages: [{ role: "system", content: "You are a senior SEO editor for a trustworthy Filipino remote-work marketplace. Return strict JSON." }, { role: "user", content: prompt }] }), cache: "no-store", signal: AbortSignal.timeout(120_000) });
  const payload = await response.json(); if (!response.ok) throw new Error(clean(payload.error?.message, 500) || "AI article generation failed.");
  let article: any; try { article = JSON.parse(payload.choices?.[0]?.message?.content || "{}"); } catch { throw new Error("AI returned invalid article JSON."); }
  const title = clean(article.title, 140); const excerpt = clean(article.excerpt, 280); const category = config.preferredCategories.includes(article.category) ? article.category : config.preferredCategories[0]; const content = sanitizeArticleHtml(String(article.contentHtml || "").slice(0, 50000));
  if (!title || excerpt.length < 100 || content.length < 1500) throw new Error("Generated article did not meet the minimum editorial quality checks.");
  return { title, excerpt, category, imageAlt: clean(article.imageAlt, 180) || title, readTime: /^\d{1,2} min read$/.test(clean(article.readTime, 30)) ? clean(article.readTime, 30) : `${Math.max(4, Math.round(config.targetWords / 220))} min read`, content };
}

const getNextRun = (schedule: BlogAutomationConfig["schedule"]) => { const date = new Date(); date.setUTCDate(date.getUTCDate() + (schedule === "weekly" ? 7 : schedule === "biweekly" ? 14 : 30)); return date.toISOString(); };

export async function runBlogAutomation(trigger: "manual" | "cron", adminId?: string) {
  const config = await getBlogAutomationConfig(); const { data: run, error: runError } = await supabaseAdmin.from("blog_automation_runs").insert({ trigger_type: trigger, status: "running", mode: config.mode, started_by: adminId || null }).select("id").single(); if (runError) throw new Error(runError.message);
  try {
    if (trigger === "cron" && (!config.enabled || (config.nextRunAt && new Date(config.nextRunAt).getTime() > Date.now()))) { const reason = !config.enabled ? "Blog automation is disabled." : "The configured schedule is not due yet."; await supabaseAdmin.from("blog_automation_runs").update({ status: "skipped", error_message: reason, completed_at: new Date().toISOString() }).eq("id", run.id); return { runId: run.id, skipped: true, reason, created: 0 }; }
    const topics = await selectTopics(config); await supabaseAdmin.from("blog_automation_runs").update({ selected_topics: topics }).eq("id", run.id);
    if (!topics.length) { await supabaseAdmin.from("blog_automation_runs").update({ status: "completed", summary: { reason: "No uncovered qualified topics were found." }, completed_at: new Date().toISOString() }).eq("id", run.id); return { runId: run.id, topics: [], created: 0 }; }
    if (config.mode === "ideas") { await supabaseAdmin.from("blog_automation_runs").update({ status: "completed", summary: { ideas: topics }, completed_at: new Date().toISOString() }).eq("id", run.id); return { runId: run.id, topics, created: 0 }; }
    const createdIds: string[] = []; const createdPosts: Array<{ id: string; title: string; status: string; keyword: string }> = [];
    for (const topic of topics) {
      const article = await generateArticle(topic, config); let slug = slugify(article.title) || `article-${Date.now()}`; const { data: collision } = await supabaseAdmin.from("blog_posts").select("id").eq("slug", slug).maybeSingle(); if (collision) slug = `${slug}-${Date.now().toString(36)}`;
      const status = config.mode === "auto_publish" ? "published" : "draft"; const { data, error } = await supabaseAdmin.from("blog_posts").insert({ title: article.title, slug, excerpt: article.excerpt, category: article.category, image_url: "/landing/filipino-collaboration.png", image_alt: article.imageAlt, keyword: topic.keyword, read_time: article.readTime, content: [{ heading: "", body: article.content, format: "html" }], status, published_at: new Date().toISOString(), author_id: adminId || config.updatedBy || null }).select("id,title,status").single(); if (error) throw new Error(error.message); createdIds.push(data.id); createdPosts.push({ ...data, keyword: topic.keyword }); await supabaseAdmin.from("seo_keyword_opportunities").update({ status: status === "published" ? "applied" : "approved" }).eq("normalized_keyword", topic.keyword.toLowerCase());
    }
    const completedAt = new Date().toISOString(); await supabaseAdmin.from("blog_automation_runs").update({ status: "completed", created_post_ids: createdIds, created_count: createdIds.length, summary: { posts: createdPosts }, completed_at: completedAt }).eq("id", run.id); await supabaseAdmin.from("blog_automation_configs").update({ last_run_at: completedAt, next_run_at: getNextRun(config.schedule) }).eq("id", "primary"); return { runId: run.id, topics, posts: createdPosts, created: createdIds.length };
  } catch (error) { await supabaseAdmin.from("blog_automation_runs").update({ status: "failed", error_message: error instanceof Error ? error.message.slice(0, 1000) : "Unknown blog automation error", completed_at: new Date().toISOString() }).eq("id", run.id); throw error; }
}

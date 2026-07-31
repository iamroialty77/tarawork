import { NextRequest, NextResponse } from "next/server";
import { requireAdminUser } from "@/lib/authz";
import { getClientIp, rateLimit } from "@/lib/security";
import { supabaseAdmin } from "@/lib/supabase_admin";

export const runtime = "nodejs";

const clean = (value: unknown, max = 80) => String(value || "").replace(/\s+/g, " ").trim().slice(0, max);
const normalize = (value: unknown) => clean(value).toLowerCase().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, " ").trim();
const stopWords = new Set(["a", "an", "and", "are", "for", "from", "in", "of", "on", "or", "the", "to", "with"]);

type Candidate = { phrase: string; sources: Set<string>; frequency: number };

const intentOf = (phrase: string) => {
  if (/\b(hire|hiring|talent|freelancer|assistant|developer|manager)\b/i.test(phrase)) return "Commercial";
  if (/\b(job|jobs|work|career|apply|salary|rate)\b/i.test(phrase)) return "Transactional";
  if (/\b(how|what|best|guide|tips|cost)\b/i.test(phrase)) return "Informational";
  return "Discovery";
};

export async function GET(req: NextRequest) {
  const admin = await requireAdminUser("site_settings.manage");
  if (admin.error) return NextResponse.json({ error: admin.error }, { status: admin.status });
  const limited = rateLimit({ key: `admin:seo-keywords:${admin.user?.id || getClientIp(req)}`, limit: 30, windowMs: 60 * 60 * 1000 });
  if (limited) return limited;

  const seed = normalize(req.nextUrl.searchParams.get("seed") || "remote jobs Philippines") || "remote jobs philippines";
  const candidates = new Map<string, Candidate>();
  const add = (raw: unknown, source: string, frequency = 1) => {
    const phrase = normalize(raw);
    const words = phrase.split(" ").filter((word) => word && !stopWords.has(word));
    if (phrase.length < 8 || phrase.length > 70 || words.length < 2) return;
    const current = candidates.get(phrase) || { phrase, sources: new Set<string>(), frequency: 0 };
    current.sources.add(source); current.frequency += frequency; candidates.set(phrase, current);
  };

  const seedSuggestions = [
    seed, `${seed} 2026`, `best ${seed}`, `how to ${seed}`,
    "remote jobs philippines", "online jobs philippines", "work from home jobs philippines",
    "hire filipino freelancers", "hire virtual assistant philippines", "filipino virtual assistant",
    "freelance jobs philippines", "filipino remote workers", "hire filipino remote talent",
  ];
  seedSuggestions.forEach((item) => add(item, "TaraWork opportunity model", 1));

  const autocompletePromise = fetch(
    `https://suggestqueries.google.com/complete/search?client=firefox&hl=en-PH&q=${encodeURIComponent(seed)}`,
    { headers: { "User-Agent": "TaraWork-SEO-Workspace/1.0" }, signal: AbortSignal.timeout(5000), cache: "no-store" },
  ).then(async (response) => response.ok ? response.json() : null).catch(() => null);

  const [jobsResult, profilesResult, blogsResult, autocomplete] = await Promise.all([
    supabaseAdmin.from("jobs").select("title,category,skills").limit(500),
    supabaseAdmin.from("profiles").select("category,skills").eq("role", "freelancer").limit(500),
    supabaseAdmin.from("blog_posts").select("title,keyword,category").eq("status", "published").limit(250),
    autocompletePromise,
  ]);

  if (Array.isArray(autocomplete?.[1])) autocomplete[1].forEach((item: unknown) => add(item, "Google autocomplete", 3));
  for (const job of jobsResult.data || []) {
    add(job.title, "Live marketplace", 2); add(`${job.category || "remote"} jobs philippines`, "Live marketplace", 2);
    if (Array.isArray(job.skills)) job.skills.slice(0, 8).forEach((skill: unknown) => add(`${skill} jobs philippines`, "Live marketplace"));
  }
  for (const profile of profilesResult.data || []) {
    add(`hire filipino ${profile.category || "freelancer"}`, "Talent directory", 2);
    if (Array.isArray(profile.skills)) profile.skills.slice(0, 8).forEach((skill: unknown) => add(`hire filipino ${skill}`, "Talent directory"));
  }
  for (const post of blogsResult.data || []) {
    add(post.keyword, "Published content", 2); add(post.title, "Published content"); add(post.category, "Published content");
  }

  const seedTokens = new Set(seed.split(" ").filter((word) => !stopWords.has(word)));
  const suggestions = [...candidates.values()].map((candidate) => {
    const words = candidate.phrase.split(" ");
    const overlap = words.filter((word) => seedTokens.has(word)).length;
    const hasPhilippines = /philippines|filipino|pinoy/.test(candidate.phrase);
    const autocompleteSignal = candidate.sources.has("Google autocomplete");
    const longTail = words.length >= 3 && words.length <= 7;
    const score = Math.min(100, 28 + overlap * 8 + Math.min(candidate.frequency, 8) * 3 + (hasPhilippines ? 12 : 0) + (autocompleteSignal ? 18 : 0) + (longTail ? 8 : 0));
    const competition = score >= 82 && words.length <= 3 ? "High" : words.length >= 5 ? "Low" : "Medium";
    return { keyword: candidate.phrase, score, intent: intentOf(candidate.phrase), competition, sources: [...candidate.sources], frequency: candidate.frequency };
  }).sort((a, b) => b.score - a.score || b.frequency - a.frequency || a.keyword.localeCompare(b.keyword)).slice(0, 30);

  return NextResponse.json({
    seed,
    suggestions,
    generatedAt: new Date().toISOString(),
    methodology: "Opportunity scores combine Google autocomplete presence, TaraWork marketplace/content frequency, Philippine relevance, search intent, and long-tail specificity. They are not search-volume estimates.",
    warnings: [jobsResult.error, profilesResult.error, blogsResult.error].filter(Boolean).map((error) => error?.message),
  });
}

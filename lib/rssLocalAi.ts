import { getBlogAiConfig } from "@/lib/blogAutomation";

export type LocalAiJobInput = { key: string; title: string; company: string; description: string };
export type LocalAiJobResult = {
  key: string; skills: string[]; category: string; seniority: string; location: string;
  usOnly: boolean; qualityScore: number; scamRiskScore: number; scamReasons: string[];
  salaryMin: number | null; salaryMax: number | null;
};

const clean = (value: unknown, max = 160) => String(value || "").replace(/\s+/g, " ").trim().slice(0, max);
const score = (value: unknown) => Math.max(0, Math.min(100, Math.round(Number(value) || 0)));
const salary = (value: unknown) => { const amount = Math.round(Number(value) || 0); return amount >= 10_000 && amount <= 300_000 ? amount : null; };

function normalizeResult(value: unknown, allowedKeys: Set<string>): LocalAiJobResult | null {
  if (!value || typeof value !== "object") return null;
  const row = value as Record<string, unknown>; const key = clean(row.key, 100);
  if (!allowedKeys.has(key)) return null;
  const salaryMin = salary(row.salaryMin); const salaryMax = salary(row.salaryMax);
  return {
    key,
    skills: Array.isArray(row.skills) ? row.skills.map((item) => clean(item, 40)).filter(Boolean).slice(0, 12) : [],
    category: clean(row.category, 60), seniority: clean(row.seniority, 30), location: clean(row.location, 100),
    usOnly: row.usOnly === true, qualityScore: score(row.qualityScore), scamRiskScore: score(row.scamRiskScore),
    scamReasons: Array.isArray(row.scamReasons) ? row.scamReasons.map((item) => clean(item, 100)).filter(Boolean).slice(0, 6) : [],
    salaryMin: salaryMin && salaryMax && salaryMin <= salaryMax ? salaryMin : null,
    salaryMax: salaryMin && salaryMax && salaryMin <= salaryMax ? salaryMax : null,
  };
}

async function classifyBatch(batch: LocalAiJobInput[]) {
  const ai = getBlogAiConfig();
  if (!ai.configured || ai.provider !== "Local AI") throw new Error("Local AI is not configured.");
  const headers: Record<string, string> = { Authorization: `Bearer ${ai.apiKey}`, "Content-Type": "application/json" };
  if (ai.accessClientId && ai.accessClientSecret) { headers["CF-Access-Client-Id"] = ai.accessClientId; headers["CF-Access-Client-Secret"] = ai.accessClientSecret; }
  const jobs = batch.map((job) => ({ key: job.key, title: clean(job.title, 180), company: clean(job.company, 100), description: clean(job.description, 1200) }));
  const prompt = [
    "Classify remote jobs for Filipino applicants. Be conservative. Do not invent facts.",
    "Return JSON only: {\"jobs\":[{\"key\":\"same key\",\"skills\":[\"short tags\"],\"category\":\"short category\",\"seniority\":\"Junior|Mid-level|Senior|Lead\",\"location\":\"short label\",\"usOnly\":false,\"qualityScore\":0,\"scamRiskScore\":0,\"scamReasons\":[],\"salaryMin\":null,\"salaryMax\":null}]}",
    "Scores are 0-100. usOnly=true only for explicit US residency/work authorization restrictions.",
    "Salary is estimated annual USD only when absent; use conservative role/seniority estimates between 10000 and 300000.",
    "High scam risk for upfront fees, guaranteed income, crypto deposits, or messaging-only recruitment.",
    `Jobs: ${JSON.stringify(jobs)}`,
  ].join("\n");
  const response = await fetch(`${ai.baseUrl}/chat/completions`, { method: "POST", headers, cache: "no-store", signal: AbortSignal.timeout(35_000), body: JSON.stringify({ model: ai.model, temperature: 0.1, max_tokens: 2200, response_format: { type: "json_object" }, messages: [{ role: "system", content: "You are a compact job classification engine. Output strict JSON only." }, { role: "user", content: prompt }] }) });
  const body = await response.text();
  if (!response.ok) throw new Error(`Local AI HTTP ${response.status}.`);
  let payload: any; try { payload = JSON.parse(body); } catch { throw new Error("Local AI returned non-JSON HTTP content."); }
  const content = String(payload.choices?.[0]?.message?.content || "{}").trim().replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, "");
  let parsed: any; try { parsed = JSON.parse(content); } catch { throw new Error("Local AI returned invalid classification JSON."); }
  const allowedKeys = new Set(batch.map((job) => job.key));
  return (Array.isArray(parsed.jobs) ? parsed.jobs : []).map((row: unknown) => normalizeResult(row, allowedKeys)).filter((row: LocalAiJobResult | null): row is LocalAiJobResult => Boolean(row));
}

export async function classifyRssJobsWithLocalAi(jobs: LocalAiJobInput[]) {
  const results = new Map<string, LocalAiJobResult>(); const errors: string[] = [];
  for (let index = 0; index < jobs.length; index += 10) {
    const batch = jobs.slice(index, index + 10);
    try { for (const result of await classifyBatch(batch)) results.set(result.key, result); }
    catch (error) { errors.push(error instanceof Error ? error.message : "Local AI classification failed."); }
  }
  return { results, errors, processed: results.size, fallback: jobs.length - results.size };
}

export function getRssLocalAiStatus() {
  const ai = getBlogAiConfig();
  return { configured: ai.configured && ai.provider === "Local AI", provider: ai.provider, model: ai.model, endpointType: ai.provider === "Local AI" ? "Cloudflare tunnel" : "not local" };
}

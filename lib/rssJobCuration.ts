export type RssCurationInput = {
  title: string;
  company: string;
  description: string;
  publishedAt: Date;
  expiresAt: Date;
  rate?: string;
};

export type RssCurationSettings = {
  minimumQualityScore: number;
  maximumScamRiskScore: number;
  excludeUsOnly: boolean;
};

export type AiCurationOverlay = {
  skills: string[]; category: string; seniority: string; location: string; usOnly: boolean;
  qualityScore: number; scamRiskScore: number; scamReasons: string[];
  salaryMin: number | null; salaryMax: number | null;
};

const SKILLS: Array<[RegExp, string]> = [
  [/\b(?:node(?:\.js)?|express|nestjs)\b/i, "Node.js"], [/\btypescript\b/i, "TypeScript"],
  [/\bjavascript\b/i, "JavaScript"], [/\breact(?:\.js)?\b/i, "React"], [/\bnext(?:\.js)?\b/i, "Next.js"],
  [/\bpython\b/i, "Python"], [/\b(?:django|flask|fastapi)\b/i, "Python Web"], [/\bphp\b/i, "PHP"],
  [/\b(?:laravel)\b/i, "Laravel"], [/\b(?:aws|amazon web services)\b/i, "AWS"], [/\bfigma\b/i, "Figma"],
  [/\b(?:seo|search engine optimization)\b/i, "SEO"], [/\bwordpress\b/i, "WordPress"],
  [/\b(?:customer support|customer service)\b/i, "Customer Support"], [/\b(?:virtual assistant|\bva\b)\b/i, "Virtual Assistance"],
  [/\b(?:data entry|spreadsheet|excel)\b/i, "Data Entry"], [/\b(?:sales|business development)\b/i, "Sales"],
  [/\b(?:copywriting|content writ(?:er|ing))\b/i, "Content Writing"], [/\b(?:graphic design|designer)\b/i, "Graphic Design"],
];

const scamPatterns: Array<[RegExp, number, string]> = [
  [/\b(?:pay|fee|deposit|purchase).{0,35}(?:apply|start|training|equipment)\b/i, 35, "Requests upfront payment"],
  [/\b(?:telegram|whatsapp).{0,30}(?:only|interview|contact)\b/i, 18, "Off-platform-only contact"],
  [/\b(?:guaranteed income|earn \$?\d+.{0,15}(?:daily|per day)|get rich)\b/i, 25, "Unrealistic earnings claim"],
  [/\b(?:crypto|bitcoin).{0,30}(?:payment|investment|deposit)\b/i, 20, "Crypto payment or investment language"],
  [/\b(?:no experience).{0,30}(?:\$\d{3,}|high income)\b/i, 15, "High income with no experience claim"],
];

const normalize = (value: string) => value.toLowerCase().replace(/\b(?:remote|work from home|wfh|job|hiring)\b/g, " ").replace(/[^a-z0-9]+/g, " ").trim();
export const semanticJobKey = (title: string, company: string) => `${normalize(title)}|${normalize(company)}`;

const detectSeniority = (text: string) => /\b(?:lead|principal|staff)\b/i.test(text) ? "Lead" : /\b(?:senior|sr\.?)[\s-]/i.test(text) ? "Senior" : /\b(?:junior|jr\.?|entry.level|graduate)\b/i.test(text) ? "Junior" : "Mid-level";
const detectCategory = (text: string) => /\b(?:developer|engineer|programmer|software|node|react|python|php)\b/i.test(text) ? "Web Development" : /\b(?:design|figma|creative)\b/i.test(text) ? "Graphic Design" : /\b(?:writer|writing|copywriter|editor)\b/i.test(text) ? "Writing & Translation" : /\b(?:marketing|seo|social media)\b/i.test(text) ? "Digital Marketing" : /\b(?:virtual assistant|data entry|administrative)\b/i.test(text) ? "Virtual Assistance" : /\b(?:customer support|customer service)\b/i.test(text) ? "Customer Service" : "Other";

function estimateSalary(title: string, description: string) {
  const text = `${title} ${description}`;
  const seniority = detectSeniority(text);
  let midpoint = /\b(?:engineer|developer|software|data scientist|devops)\b/i.test(text) ? 70000 : /\b(?:designer|product manager|marketing manager)\b/i.test(text) ? 58000 : /\b(?:writer|seo|customer success|sales)\b/i.test(text) ? 48000 : 36000;
  midpoint *= seniority === "Lead" ? 1.55 : seniority === "Senior" ? 1.3 : seniority === "Junior" ? 0.7 : 1;
  const round = (value: number) => Math.round(value / 5000) * 5000;
  return { min: round(midpoint * 0.85), max: round(midpoint * 1.15), seniority };
}

export function curateRssJob(input: RssCurationInput, settings: RssCurationSettings) {
  const text = `${input.title} ${input.description}`;
  const skills = SKILLS.filter(([pattern]) => pattern.test(text)).map(([, skill]) => skill).slice(0, 12);
  const usOnly = /\b(?:us|u\.s\.|united states)\s*(?:only|based|required|residents?)\b|\bmust (?:reside|live|be based) in (?:the )?(?:us|u\.s\.|united states)\b/i.test(text)
    && !/\b(?:worldwide|global|anywhere|philippines|asia|apac)\b/i.test(text);
  const location = usOnly ? "United States only" : /\b(?:worldwide|global|anywhere)\b/i.test(text) ? "Remote worldwide" : /\b(?:philippines|filipino)\b/i.test(text) ? "Philippines" : "Remote / location unspecified";
  const scamReasons = scamPatterns.filter(([pattern]) => pattern.test(text)).map(([, , reason]) => reason);
  const scamRiskScore = Math.min(100, scamPatterns.reduce((score, [pattern, weight]) => score + (pattern.test(text) ? weight : 0), 0) + (!input.company.trim() ? 15 : 0));
  let qualityScore = 35;
  if (input.description.length >= 300) qualityScore += 15;
  if (input.description.length >= 900) qualityScore += 10;
  if (input.company.trim()) qualityScore += 10;
  if (skills.length >= 2) qualityScore += 10;
  if (/\b(?:responsibilities|requirements|qualifications|experience)\b/i.test(text)) qualityScore += 10;
  if (/\b(?:salary|compensation|pay range|\$\d|usd|php)\b/i.test(text)) qualityScore += 10;
  qualityScore = Math.max(0, Math.min(100, qualityScore - Math.round(scamRiskScore / 2)));
  const salary = estimateSalary(input.title, input.description);
  const hasSalary = /\b(?:salary|compensation|pay range|\$\s?\d|usd\s?\d|php\s?\d)\b/i.test(text) || Boolean(input.rate && !/see source/i.test(input.rate));
  const rejectionReasons: string[] = [];
  if (input.expiresAt <= new Date()) rejectionReasons.push("Expired listing");
  if (settings.excludeUsOnly && usOnly) rejectionReasons.push("US-only location restriction");
  if (qualityScore < settings.minimumQualityScore) rejectionReasons.push(`Quality score below ${settings.minimumQualityScore}`);
  if (scamRiskScore > settings.maximumScamRiskScore) rejectionReasons.push(`Scam risk above ${settings.maximumScamRiskScore}`);
  return {
    accepted: rejectionReasons.length === 0, rejectionReasons, qualityScore, scamRiskScore, scamReasons,
    skills, category: detectCategory(text), seniority: salary.seniority, location, usOnly,
    salaryEstimate: hasSalary ? null : { min: salary.min, max: salary.max, currency: "USD", period: "year", method: "role-seniority heuristic" },
    semanticKey: semanticJobKey(input.title, input.company),
  };
}

export function mergeAiCuration(base: ReturnType<typeof curateRssJob>, ai: AiCurationOverlay, settings: RssCurationSettings) {
  const skills = [...new Set([...base.skills, ...ai.skills.map((item) => item.trim()).filter(Boolean)])].slice(0, 12);
  const scamRiskScore = Math.max(base.scamRiskScore, Math.max(0, Math.min(100, ai.scamRiskScore)));
  const usOnly = base.usOnly || ai.usOnly;
  // Blend quality to reduce the impact of a weak model, while hard safety signals only move upward.
  const qualityScore = Math.max(0, Math.min(100, Math.round(base.qualityScore * 0.65 + ai.qualityScore * 0.35)));
  const salaryEstimate = ai.salaryMin && ai.salaryMax && ai.salaryMin <= ai.salaryMax
    ? { min: ai.salaryMin, max: ai.salaryMax, currency: "USD", period: "year", method: "local AI role-seniority estimate" }
    : base.salaryEstimate;
  const rejectionReasons = base.rejectionReasons.filter((reason) => !reason.startsWith("Quality score") && !reason.startsWith("Scam risk") && reason !== "US-only location restriction");
  if (settings.excludeUsOnly && usOnly) rejectionReasons.push("US-only location restriction");
  if (qualityScore < settings.minimumQualityScore) rejectionReasons.push(`Quality score below ${settings.minimumQualityScore}`);
  if (scamRiskScore > settings.maximumScamRiskScore) rejectionReasons.push(`Scam risk above ${settings.maximumScamRiskScore}`);
  return {
    ...base, accepted: rejectionReasons.length === 0, rejectionReasons, skills, qualityScore, scamRiskScore, usOnly,
    scamReasons: [...new Set([...base.scamReasons, ...ai.scamReasons])].slice(0, 8),
    category: ai.category || base.category, seniority: ai.seniority || base.seniority,
    location: usOnly ? "United States only" : ai.location || base.location, salaryEstimate,
  };
}

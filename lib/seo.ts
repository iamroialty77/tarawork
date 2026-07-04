export const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL ||
  process.env.SITE_URL ||
  "https://www.tarawork.online"
).replace(/\/$/, "");

export const siteName = "TaraWork";

export const defaultSeoDescription =
  "A professional way to hire Filipino freelancers and virtual assistants. Post remote jobs, review skilled talent, compare portfolios, and start work with confidence.";

export const seoKeywords = [
  "hire Filipino freelancers",
  "Filipino virtual assistant",
  "virtual assistant Philippines",
  "remote jobs Philippines",
  "Filipino freelancers",
  "Philippines virtual assistants",
  "remote freelance jobs",
  "hire freelancers Philippines",
  "hire remote Filipino talent",
  "freelance jobs Philippines",
  "online jobs Philippines",
  "TaraWork",
  "online work Philippines",
  "freelance marketplace",
  "Philippines freelance marketplace",
];

export function absoluteUrl(path = "/") {
  return `${siteUrl}${path.startsWith("/") ? path : `/${path}`}`;
}

export function truncateSeoText(value: string, maxLength = 155) {
  const normalized = value.replace(/\s+/g, " ").trim();
  if (normalized.length <= maxLength) return normalized;
  return `${normalized.slice(0, maxLength - 1).trim()}...`;
}

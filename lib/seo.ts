export const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL ||
  process.env.SITE_URL ||
  "https://www.tarawork.online"
).replace(/\/$/, "");

export const siteName = "TaraWork";

export const defaultSeoDescription =
  "Hire skilled Filipino freelancers and virtual assistants, or find remote freelance work through TaraWork's professional marketplace.";

export const seoKeywords = [
  "Filipino freelancers",
  "Philippines virtual assistants",
  "remote freelance jobs",
  "hire freelancers Philippines",
  "TaraWork",
  "online work Philippines",
  "freelance marketplace",
];

export function absoluteUrl(path = "/") {
  return `${siteUrl}${path.startsWith("/") ? path : `/${path}`}`;
}

export function truncateSeoText(value: string, maxLength = 155) {
  const normalized = value.replace(/\s+/g, " ").trim();
  if (normalized.length <= maxLength) return normalized;
  return `${normalized.slice(0, maxLength - 1).trim()}...`;
}

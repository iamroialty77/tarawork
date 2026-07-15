export const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL ||
  process.env.SITE_URL ||
  "https://www.tarawork.online"
).replace(/\/$/, "");

export const siteName = "TaraWork";

export const defaultOgImage = {
  url: "/landing/filipino-hero.png",
  width: 1200,
  height: 630,
  alt: "TaraWork Filipino remote jobs and freelancing platform",
};

export const collaborationOgImage = {
  url: "/landing/filipino-collaboration.png",
  width: 1200,
  height: 630,
  alt: "Filipino professionals collaborating remotely through TaraWork",
};

export const remoteWorkOgImage = {
  url: "/landing/filipino-remote-work.png",
  width: 1200,
  height: 630,
  alt: "Filipino freelancer working remotely in the Philippines",
};

export const defaultSeoDescription =
  "Hire Filipino freelancers and virtual assistants for remote work. Post jobs, compare skilled Pinoy talent, review portfolios, and start hiring with confidence.";

export const seoKeywords = [
  "TaraWork",
  "TaraWork online",
  "Tara Work",
  "Tara Work online",
  "tare work",
  "tarabjo",
  "tarawork Philippines",
  "hire Filipino freelancers",
  "Filipino virtual assistant",
  "virtual assistant Philippines",
  "remote jobs Philippines",
  "Filipino freelancers",
  "Pinoy freelancers",
  "Filipino remote workers",
  "Filipino online workers",
  "Philippines virtual assistants",
  "remote freelance jobs",
  "hire freelancers Philippines",
  "hire remote Filipino talent",
  "hire Pinoy freelancers",
  "hire Filipino remote workers",
  "filipino freelancers hiring site",
  "hire online Filipino talent",
  "remote jobs for Filipinos",
  "flexible remote jobs for Filipino students",
  "best freelance niche Philippines",
  "how to hire Filipino talent safely",
  "top remote jobs for Filipinos",
  "freelance jobs Philippines",
  "freelance work Philippines",
  "freelance job site Philippines",
  "freelance marketplace Philippines",
  "freelancer Philippines",
  "freelancing Philippines",
  "online freelance jobs Philippines",
  "work from home jobs Philippines",
  "home based jobs Philippines",
  "part time online jobs Philippines",
  "online jobs Philippines",
  "online jobs for Filipinos",
  "remote work Philippines",
  "remote work for Filipinos",
  "virtual assistant jobs Philippines",
  "VA jobs Philippines",
  "Filipino customer support freelancer",
  "Filipino social media manager",
  "Filipino web developer",
  "Filipino graphic designer",
  "Filipino content writer",
  "Filipino ecommerce assistant",
  "Filipino bookkeeper",
  "Filipino data entry specialist",
  "Filipino appointment setter",
  "Filipino video editor",
  "online work Philippines",
  "freelance marketplace",
  "Philippines freelance marketplace",
];

export const freelanceJobKeywordsPhilippines = [
  "freelance jobs Philippines",
  "freelance work Philippines",
  "online freelance jobs Philippines",
  "remote freelance jobs Philippines",
  "work from home freelance jobs Philippines",
  "part time freelance jobs Philippines",
  "freelance jobs for beginners Philippines",
  "freelance jobs for students Philippines",
  "online jobs Philippines",
  "online jobs for Filipinos",
  "remote jobs for Filipinos",
  "home based jobs Philippines",
  "virtual assistant jobs Philippines",
  "customer support jobs Philippines",
  "social media manager jobs Philippines",
  "web developer freelance jobs Philippines",
  "graphic designer freelance jobs Philippines",
  "content writer freelance jobs Philippines",
  "ecommerce assistant jobs Philippines",
  "bookkeeping freelance jobs Philippines",
  "data entry online jobs Philippines",
];

export function absoluteUrl(path = "/") {
  return `${siteUrl}${path.startsWith("/") ? path : `/${path}`}`;
}

export function truncateSeoText(value: string, maxLength = 155) {
  const normalized = value.replace(/\s+/g, " ").trim();
  if (normalized.length <= maxLength) return normalized;
  return `${normalized.slice(0, maxLength - 1).trim()}...`;
}

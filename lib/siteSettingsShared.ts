export type SiteSettings = {
  contactEmail: string;
  contactPhone: string;
  address: string;
  mapsUrl: string;
  facebookUrl: string;
  linkedinUrl: string;
  instagramUrl: string;
  youtubeUrl: string;
  xUrl: string;
  seoTitle: string;
  seoDescription: string;
  seoKeywords: string[];
  googleSiteVerification: string;
  bingSiteVerification: string;
  gaMeasurementId: string;
  gtmContainerId: string;
  canonicalUrl: string;
  ogTitle: string;
  ogDescription: string;
  ogImageUrl: string;
  twitterCardType: "summary" | "summary_large_image";
  searchIndexing: boolean;
  metadataAutomationEnabled: boolean;
};

export const DEFAULT_SITE_SETTINGS: SiteSettings = {
  contactEmail: "hello@tarawork.online",
  contactPhone: "+63 994 483 4740",
  address: "Waling-Waling, Purok Sta. Cruz, Calumpang, General Santos City, Philippines",
  mapsUrl: "https://www.google.com/maps/search/?api=1&query=Waling-Waling%2C+Purok+Sta.+Cruz%2C+Calumpang%2C+General+Santos+City",
  facebookUrl: "https://www.facebook.com/profile.php?id=61581316087458&mibextid=wwXIfr",
  linkedinUrl: "https://www.linkedin.com/company/tarawork-online/posts/?feedView=all",
  instagramUrl: "",
  youtubeUrl: "",
  xUrl: "",
  seoTitle: "Tara Work | Remote Jobs and Freelancing Platform in the Philippines",
  seoDescription: "Tara Work connects Filipino freelancers and businesses through remote jobs, verified talent, and practical tools for building successful working relationships.",
  seoKeywords: ["remote jobs Philippines", "Filipino freelancers", "hire Filipino talent", "online jobs"],
  googleSiteVerification: "",
  bingSiteVerification: "",
  gaMeasurementId: "",
  gtmContainerId: "",
  canonicalUrl: "https://www.tarawork.online/",
  ogTitle: "Tara Work | Find Remote Work and Filipino Talent",
  ogDescription: "Discover remote opportunities or hire skilled Filipino freelancers through Tara Work.",
  ogImageUrl: "/landing/filipino-hero.png",
  twitterCardType: "summary_large_image",
  searchIndexing: true,
  metadataAutomationEnabled: true,
};

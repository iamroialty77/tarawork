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
};

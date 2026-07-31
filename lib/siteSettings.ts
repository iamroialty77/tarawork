import { supabaseAdmin } from "@/lib/supabase_admin";
import { DEFAULT_SITE_SETTINGS, type SiteSettings } from "@/lib/siteSettingsShared";

const SETTINGS_TYPE = "public_site_settings";
const clean = (value: unknown, max: number) => String(value || "").trim().slice(0, max);
const url = (value: unknown) => {
  const result = clean(value, 500);
  return !result || /^https:\/\//i.test(result) ? result : "";
};
const imageUrl = (value: unknown) => {
  const result = clean(value, 500);
  return !result || /^https:\/\//i.test(result) || result.startsWith("/") ? result : "";
};
const valueOrDefault = (input: Record<string, unknown>, key: keyof SiteSettings) =>
  Object.prototype.hasOwnProperty.call(input, key) ? input[key] : DEFAULT_SITE_SETTINGS[key];
const keywords = (value: unknown) => {
  const source = Array.isArray(value) ? value : typeof value === "string" ? value.split(",") : [];
  return [...new Set(source.map((item) => clean(item, 60)).filter(Boolean))].slice(0, 20);
};

export function normalizeSiteSettings(value: unknown): SiteSettings {
  const input = value && typeof value === "object" ? value as Record<string, unknown> : {};
  return {
    contactEmail: clean(input.contactEmail, 320),
    contactPhone: clean(input.contactPhone, 80),
    address: clean(input.address, 500),
    mapsUrl: url(input.mapsUrl),
    facebookUrl: url(input.facebookUrl),
    linkedinUrl: url(input.linkedinUrl),
    instagramUrl: url(input.instagramUrl),
    youtubeUrl: url(input.youtubeUrl),
    xUrl: url(input.xUrl),
    seoTitle: clean(valueOrDefault(input, "seoTitle"), 70),
    seoDescription: clean(valueOrDefault(input, "seoDescription"), 180),
    seoKeywords: keywords(valueOrDefault(input, "seoKeywords")),
    googleSiteVerification: clean(valueOrDefault(input, "googleSiteVerification"), 200),
    bingSiteVerification: clean(valueOrDefault(input, "bingSiteVerification"), 200),
    gaMeasurementId: /^G-[A-Z0-9]+$/i.test(clean(valueOrDefault(input, "gaMeasurementId"), 30))
      ? clean(valueOrDefault(input, "gaMeasurementId"), 30).toUpperCase() : "",
    gtmContainerId: /^GTM-[A-Z0-9]+$/i.test(clean(valueOrDefault(input, "gtmContainerId"), 30))
      ? clean(valueOrDefault(input, "gtmContainerId"), 30).toUpperCase() : "",
    canonicalUrl: url(valueOrDefault(input, "canonicalUrl")),
    ogTitle: clean(valueOrDefault(input, "ogTitle"), 70),
    ogDescription: clean(valueOrDefault(input, "ogDescription"), 200),
    ogImageUrl: imageUrl(valueOrDefault(input, "ogImageUrl")),
    twitterCardType: input.twitterCardType === "summary" ? "summary" : "summary_large_image",
    searchIndexing: typeof input.searchIndexing === "boolean" ? input.searchIndexing : DEFAULT_SITE_SETTINGS.searchIndexing,
    metadataAutomationEnabled: typeof input.metadataAutomationEnabled === "boolean" ? input.metadataAutomationEnabled : DEFAULT_SITE_SETTINGS.metadataAutomationEnabled,
  };
}

export async function getSiteSettings() {
  const { data, error } = await supabaseAdmin.from("email_messages").select("metadata")
    .eq("type", SETTINGS_TYPE).order("created_at", { ascending: false }).limit(1).maybeSingle();
  if (error) throw new Error(error.message);
  return data?.metadata ? { ...DEFAULT_SITE_SETTINGS, ...normalizeSiteSettings(data.metadata) } : DEFAULT_SITE_SETTINGS;
}

export async function saveSiteSettings(settings: SiteSettings, adminId: string) {
  const { error } = await supabaseAdmin.from("email_messages").insert({
    type: SETTINGS_TYPE, direction: "outbound", subject: "Public site settings",
    text_body: "", status: "draft", metadata: { ...settings, updatedBy: adminId, updatedAt: new Date().toISOString() },
  });
  if (error) throw new Error(error.message);
}

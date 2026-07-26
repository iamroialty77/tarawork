import { supabaseAdmin } from "@/lib/supabase_admin";
import { DEFAULT_SITE_SETTINGS, type SiteSettings } from "@/lib/siteSettingsShared";

const SETTINGS_TYPE = "public_site_settings";
const clean = (value: unknown, max: number) => String(value || "").trim().slice(0, max);
const url = (value: unknown) => {
  const result = clean(value, 500);
  return !result || /^https:\/\//i.test(result) ? result : "";
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

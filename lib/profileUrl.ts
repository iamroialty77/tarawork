const FREE_PROFILE_BASE_URL = "https://www.tarawork.online";
const PREMIUM_PROFILE_ROOT_DOMAIN = "tarawork.ph";

function stripProtocolAndSlashes(value: string): string {
  return value.replace(/^https?:\/\//i, "").replace(/\/+$/g, "");
}

export function normalizeProfileSlug(value?: string | null): string {
  if (!value) return "";
  const normalized = value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
  return normalized;
}

export function getProfileSlug(username?: string | null, id?: string | null): string {
  const usernameSlug = normalizeProfileSlug(username);
  if (usernameSlug) return usernameSlug;

  const idSlug = normalizeProfileSlug(id);
  if (idSlug) return idSlug;

  return "user";
}

export function getPremiumProfileDomain(username?: string | null, id?: string | null): string {
  const slug = getProfileSlug(username, id);
  return `${slug}.${PREMIUM_PROFILE_ROOT_DOMAIN}`;
}

export function buildPublicProfileUrl(options: {
  tier?: "free" | "pro" | string;
  username?: string | null;
  id?: string | null;
  customDomain?: string | null;
}): string {
  const slug = getProfileSlug(options.username, options.id);

  if (options.tier === "pro") {
    const customDomain = options.customDomain?.trim() ? stripProtocolAndSlashes(options.customDomain.trim()) : "";
    return `https://${customDomain || getPremiumProfileDomain(options.username, options.id)}`;
  }

  return `${FREE_PROFILE_BASE_URL}/${slug}`;
}

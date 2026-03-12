const FREE_PROFILE_BASE_URL = "https://www.tarawork.online";
const PREMIUM_PROFILE_PATH_PREFIX = "@";

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
  return `${FREE_PROFILE_BASE_URL}/${PREMIUM_PROFILE_PATH_PREFIX}${slug}`;
}

export function buildPublicProfileUrl(options: {
  tier?: "free" | "pro" | string;
  username?: string | null;
  id?: string | null;
  customDomain?: string | null;
}): string {
  const slug = getProfileSlug(options.username, options.id);

  if (options.tier === "pro") {
    return `${FREE_PROFILE_BASE_URL}/${PREMIUM_PROFILE_PATH_PREFIX}${slug}`;
  }

  return `${FREE_PROFILE_BASE_URL}/${slug}`;
}

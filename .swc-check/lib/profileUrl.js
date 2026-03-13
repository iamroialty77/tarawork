var FREE_PROFILE_BASE_URL = "https://www.tarawork.online";
var PREMIUM_PROFILE_PATH_PREFIX = "@";
export function normalizeProfileSlug(value) {
    if (!value) return "";
    var normalized = value.trim().toLowerCase().replace(/[^a-z0-9-]/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "");
    return normalized;
}
export function getProfileSlug(username, id) {
    var usernameSlug = normalizeProfileSlug(username);
    if (usernameSlug) return usernameSlug;
    var idSlug = normalizeProfileSlug(id);
    if (idSlug) return idSlug;
    return "user";
}
export function getPremiumProfileDomain(username, id) {
    var slug = getProfileSlug(username, id);
    return "".concat(FREE_PROFILE_BASE_URL, "/").concat(PREMIUM_PROFILE_PATH_PREFIX).concat(slug);
}
export function buildPublicProfileUrl(options) {
    var slug = getProfileSlug(options.username, options.id);
    if (options.tier === "pro") {
        return "".concat(FREE_PROFILE_BASE_URL, "/").concat(PREMIUM_PROFILE_PATH_PREFIX).concat(slug);
    }
    return "".concat(FREE_PROFILE_BASE_URL, "/").concat(slug);
}

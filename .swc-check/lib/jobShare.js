var JOB_SHARE_BASE_URL = "https://www.tarawork.online";
var normalizeTokenPart = function normalizeTokenPart(value) {
    return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 70) || "job";
};
export var createJobShareToken = function createJobShareToken(job) {
    var slug = normalizeTokenPart(job.title || "job");
    var encodedId = encodeURIComponent(job.id);
    return "".concat(slug, "--").concat(encodedId);
};
export var getJobSharePath = function getJobSharePath(job) {
    return "/jobs/".concat(createJobShareToken(job));
};
export var getJobShareUrl = function getJobShareUrl(job) {
    return "".concat(JOB_SHARE_BASE_URL).concat(getJobSharePath(job));
};
export var extractJobIdFromShareToken = function extractJobIdFromShareToken(token) {
    var marker = "--";
    var markerIndex = token.lastIndexOf(marker);
    if (markerIndex === -1) return token;
    return decodeURIComponent(token.slice(markerIndex + marker.length));
};

import { Job } from "../types";

const JOB_SHARE_BASE_URL = "https://www.tarawork.online";

const normalizeTokenPart = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 70) || "job";

export const createJobShareToken = (job: Pick<Job, "id" | "title">) => {
  const slug = normalizeTokenPart(job.title || "job");
  const encodedId = encodeURIComponent(job.id);
  return `${slug}--${encodedId}`;
};

export const getJobSharePath = (job: Pick<Job, "id" | "title">) =>
  `/jobs/${createJobShareToken(job)}`;

export const getJobShareUrl = (job: Pick<Job, "id" | "title">) =>
  `${JOB_SHARE_BASE_URL}${getJobSharePath(job)}`;

export const extractJobIdFromShareToken = (token: string) => {
  const marker = "--";
  const markerIndex = token.lastIndexOf(marker);
  if (markerIndex === -1) return token;
  return decodeURIComponent(token.slice(markerIndex + marker.length));
};


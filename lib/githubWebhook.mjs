import { createHmac, timingSafeEqual } from "node:crypto";

const SIGNATURE_PREFIX = "sha256=";
const MILESTONE_ID_PATTERN = /^[A-Za-z0-9][A-Za-z0-9._/-]{0,119}$/;

/**
 * Verify GitHub's sha256 webhook signature without leaking timing information.
 */
export function verifyGitHubWebhookSignature({ rawBody, signature, secret }) {
  if (
    typeof rawBody !== "string" ||
    typeof signature !== "string" ||
    !signature.startsWith(SIGNATURE_PREFIX) ||
    typeof secret !== "string" ||
    secret.length < 32
  ) {
    return false;
  }

  const expected = `${SIGNATURE_PREFIX}${createHmac("sha256", secret).update(rawBody).digest("hex")}`;
  const providedBuffer = Buffer.from(signature, "utf8");
  const expectedBuffer = Buffer.from(expected, "utf8");

  return (
    providedBuffer.length === expectedBuffer.length &&
    timingSafeEqual(providedBuffer, expectedBuffer)
  );
}

export function getMilestoneIdFromPullRequest(payload) {
  const milestoneId = payload?.pull_request?.head?.ref;
  if (typeof milestoneId !== "string" || !MILESTONE_ID_PATTERN.test(milestoneId)) {
    return null;
  }

  return milestoneId;
}


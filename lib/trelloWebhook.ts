import crypto from "crypto";

function getBaseAppUrl(requestUrl: string) {
  const configuredUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.NEXT_PUBLIC_SITE_URL;
  if (configuredUrl) {
    return configuredUrl.replace(/\/$/, "");
  }

  return new URL(requestUrl).origin;
}

export function buildTrelloWebhookCallbackUrl({ requestUrl, userId }: { requestUrl: string; userId: string }) {
  const baseAppUrl = getBaseAppUrl(requestUrl);
  const callbackUrl = new URL(`${baseAppUrl}/api/webhooks/trello`);
  callbackUrl.searchParams.set("userId", userId);
  return callbackUrl.toString();
}

export function verifyTrelloWebhookSignature({
  rawBody,
  callbackUrl,
  signatureHeader,
}: {
  rawBody: string;
  callbackUrl: string;
  signatureHeader: string | null;
}) {
  const secret = process.env.TRELLO_API_SECRET;
  if (!secret) {
    return true;
  }

  if (!signatureHeader) {
    return false;
  }

  const digest = crypto.createHmac("sha1", secret).update(rawBody + callbackUrl).digest("base64");
  if (digest.length !== signatureHeader.length) {
    return false;
  }
  return crypto.timingSafeEqual(Buffer.from(digest), Buffer.from(signatureHeader));
}

import { NextRequest, NextResponse } from "next/server";

type RateLimitOptions = {
  key: string;
  limit: number;
  windowMs: number;
};

const rateLimitStore = new Map<string, { count: number; resetAt: number }>();

const blockedUserAgentPatterns = [
  /bot/i,
  /crawler/i,
  /spider/i,
  /scraper/i,
  /curl/i,
  /wget/i,
  /python-requests/i,
  /httpclient/i,
  /libwww-perl/i,
  /go-http-client/i,
  /java\//i,
  /okhttp/i,
  /headless/i,
  /phantomjs/i,
  /selenium/i,
  /playwright/i,
  /puppeteer/i,
];

const getAllowedOrigins = (req: NextRequest) => {
  const configured = (process.env.APP_ORIGIN || process.env.NEXT_PUBLIC_APP_URL || "")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);
  return new Set([req.nextUrl.origin, ...configured]);
};

export function assertSameOrigin(req: NextRequest) {
  const origin = req.headers.get("origin");
  if (!origin) return null;

  if (!getAllowedOrigins(req).has(origin)) {
    return NextResponse.json({ error: "Invalid request origin." }, { status: 403 });
  }

  return null;
}

export function assertNotLikelyBot(req: NextRequest) {
  const userAgent = req.headers.get("user-agent")?.trim() || "";
  const accept = req.headers.get("accept") || "";
  const contentType = req.headers.get("content-type") || "";
  const secFetchSite = req.headers.get("sec-fetch-site") || "";
  const secFetchMode = req.headers.get("sec-fetch-mode") || "";

  if (!userAgent || blockedUserAgentPatterns.some((pattern) => pattern.test(userAgent))) {
    return NextResponse.json({ error: "Automated requests are not allowed." }, { status: 403 });
  }

  if (contentType && !contentType.toLowerCase().includes("application/json")) {
    return NextResponse.json({ error: "Invalid request content type." }, { status: 415 });
  }

  if (accept && !accept.includes("application/json") && !accept.includes("*/*")) {
    return NextResponse.json({ error: "Invalid request accept header." }, { status: 406 });
  }

  if (secFetchSite && !["same-origin", "same-site", "none"].includes(secFetchSite)) {
    return NextResponse.json({ error: "Invalid request context." }, { status: 403 });
  }

  if (secFetchMode && !["cors", "same-origin", "navigate"].includes(secFetchMode)) {
    return NextResponse.json({ error: "Invalid request mode." }, { status: 403 });
  }

  return null;
}

export function getClientIp(req: NextRequest) {
  const forwardedFor = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  return forwardedFor || req.headers.get("x-real-ip") || "unknown";
}

export function rateLimit({ key, limit, windowMs }: RateLimitOptions) {
  const now = Date.now();
  const current = rateLimitStore.get(key);

  if (!current || current.resetAt <= now) {
    rateLimitStore.set(key, { count: 1, resetAt: now + windowMs });
    return null;
  }

  if (current.count >= limit) {
    const retryAfter = Math.max(1, Math.ceil((current.resetAt - now) / 1000));
    return NextResponse.json(
      { error: "Too many requests. Please try again later." },
      {
        status: 429,
        headers: {
          "Retry-After": String(retryAfter),
        },
      },
    );
  }

  current.count += 1;
  return null;
}

export function isUuid(value: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
}

export function isSafeJobId(value: string) {
  return /^[a-zA-Z0-9_-]{3,120}$/.test(value);
}

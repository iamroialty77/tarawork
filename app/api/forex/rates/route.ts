import { NextResponse } from "next/server";
import type { CurrencyCode } from "../../../../types";
import {
  FALLBACK_RATES_UPDATED_AT,
  FALLBACK_WEEKLY_USD_RATES,
  SUPPORTED_CURRENCIES,
} from "../../../../lib/currency";

export const runtime = "nodejs";

const toSupportedRates = (rawRates: unknown): Record<CurrencyCode, number> | null => {
  if (!rawRates || typeof rawRates !== "object") return null;
  const source = rawRates as Record<string, unknown>;
  const out: Partial<Record<CurrencyCode, number>> = {};

  for (const code of SUPPORTED_CURRENCIES) {
    const value = source[code];
    const numericValue = typeof value === "number" ? value : Number(value);
    if (!Number.isFinite(numericValue) || numericValue <= 0) return null;
    out[code] = numericValue;
  }

  return out as Record<CurrencyCode, number>;
};

const getLiveRates = async (): Promise<Record<CurrencyCode, number> | null> => {
  const apiKey = process.env.EXCHANGERATE_API_KEY;
  const endpoint = apiKey
    ? `https://v6.exchangerate-api.com/v6/${apiKey}/latest/USD`
    : "https://open.er-api.com/v6/latest/USD";

  try {
    const response = await fetch(endpoint, {
      method: "GET",
      headers: { Accept: "application/json" },
      cache: "no-store",
    });
    if (!response.ok) return null;

    const payload = await response.json();
    const rawRates = payload?.conversion_rates ?? payload?.rates;
    const parsed = toSupportedRates(rawRates);
    if (!parsed || parsed.USD !== 1) return null;
    return parsed;
  } catch {
    return null;
  }
};

export async function GET(request: Request) {
  const url = new URL(request.url);
  const base = url.searchParams.get("base") || "USD";
  if (base !== "USD") {
    return NextResponse.json(
      { error: "Only base=USD is supported." },
      { status: 400 },
    );
  }

  const liveRates = await getLiveRates();
  if (liveRates) {
    return NextResponse.json({
      base: "USD",
      rates: liveRates,
      source: "live",
      updatedAt: new Date().toISOString(),
    });
  }

  return NextResponse.json({
    base: "USD",
    rates: FALLBACK_WEEKLY_USD_RATES,
    source: "fallback",
    updatedAt: FALLBACK_RATES_UPDATED_AT,
  });
}

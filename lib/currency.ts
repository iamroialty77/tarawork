import type { CurrencyCode } from "../types";

export const SUPPORTED_CURRENCIES: CurrencyCode[] = ["USD", "AUD", "GBP", "PHP"];

export const FALLBACK_WEEKLY_USD_RATES: Record<CurrencyCode, number> = {
  USD: 1,
  AUD: 1.52,
  GBP: 0.78,
  PHP: 56.4,
};

export const FALLBACK_RATES_UPDATED_AT = "2026-03-20";

export const CURRENCY_SYMBOLS: Record<CurrencyCode, string> = {
  USD: "$",
  AUD: "A$",
  GBP: "£",
  PHP: "₱",
};

export const isCurrencyCode = (value: unknown): value is CurrencyCode =>
  typeof value === "string" && SUPPORTED_CURRENCIES.includes(value as CurrencyCode);

export const getCurrencySymbol = (currency: CurrencyCode): string => CURRENCY_SYMBOLS[currency];

export const formatCurrencyAmount = (
  amount: number,
  currency: CurrencyCode,
): string =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 2,
  }).format(amount);

export const convertAmount = (
  amount: number,
  fromCurrency: CurrencyCode,
  toCurrency: CurrencyCode,
  ratesByUsd: Record<CurrencyCode, number>,
): number | null => {
  const fromRate = ratesByUsd[fromCurrency];
  const toRate = ratesByUsd[toCurrency];
  if (!fromRate || !toRate || fromRate <= 0 || toRate <= 0) return null;
  return (amount / fromRate) * toRate;
};

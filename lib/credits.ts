import { supabaseAdmin } from "@/lib/supabase_admin";
import {
  PREMIUM_CREDIT_COSTS,
  PREMIUM_MONTHLY_CREDITS,
  PREMIUM_TOPUP_CREDITS,
  type PremiumCreditAction,
} from "@/lib/creditConfig";

type ConsumeCreditsResult =
  | { ok: true; cost: number; balance: number }
  | {
      ok: false;
      code: "not_premium" | "insufficient_credits" | "config_missing" | "system_error";
      message: string;
      cost: number;
      balance?: number;
    };

function toObject(value: unknown): Record<string, unknown> {
  return typeof value === "object" && value !== null ? (value as Record<string, unknown>) : {};
}

function isMissingTableError(error: { code?: string; message?: string } | null | undefined) {
  if (!error) return false;
  return (
    error.code === "PGRST205" ||
    error.code === "42P01" ||
    error.message?.includes("relation") ||
    error.message?.includes("Could not find the table") ||
    false
  );
}

function isMissingFunctionError(error: { code?: string; message?: string } | null | undefined) {
  if (!error) return false;
  return (
    error.code === "PGRST202" ||
    error.code === "42883" ||
    error.message?.toLowerCase().includes("function") ||
    false
  );
}

export function getCreditCost(action: PremiumCreditAction): number {
  return PREMIUM_CREDIT_COSTS[action];
}

export async function getCreditBalance(userId: string): Promise<number> {
  const { data, error } = await supabaseAdmin
    .from("user_credit_wallets")
    .select("balance")
    .eq("user_id", userId)
    .maybeSingle();

  if (error) {
    if (isMissingTableError(error)) return 0;
    throw error;
  }

  return Number(data?.balance || 0);
}

export async function isUserPremiumActive(userId: string): Promise<boolean> {
  const { data, error } = await supabaseAdmin
    .from("portfolios")
    .select("theme_settings")
    .eq("profile_id", userId)
    .maybeSingle();

  if (error) {
    if (error.code === "PGRST116" || isMissingTableError(error)) return false;
    throw error;
  }

  const themeSettings = toObject(data?.theme_settings);
  const premiumProfile = toObject(themeSettings.premiumProfile);
  const billing = toObject(premiumProfile.billing);
  const tier = premiumProfile.tier;
  const expiresAt = typeof billing.proExpiresAt === "string" ? new Date(billing.proExpiresAt) : null;
  const hasValidExpiry = !!expiresAt && !Number.isNaN(expiresAt.getTime());
  const notExpired = !hasValidExpiry || !!expiresAt && expiresAt.getTime() > Date.now();

  return tier === "pro" && notExpired;
}

export async function consumePremiumCredits(params: {
  userId?: string;
  action: PremiumCreditAction;
  idempotencyKey?: string;
  metadata?: Record<string, unknown>;
}): Promise<ConsumeCreditsResult> {
  const cost = getCreditCost(params.action);
  if (!params.userId) {
    return {
      ok: false,
      code: "system_error",
      message: "Missing userId for premium credit spending.",
      cost,
    };
  }

  const isPremium = await isUserPremiumActive(params.userId);
  if (!isPremium) {
    return {
      ok: false,
      code: "not_premium",
      message: "Premium account required to use this feature.",
      cost,
    };
  }

  const { data, error } = await supabaseAdmin.rpc("consume_user_credits", {
    p_user_id: params.userId,
    p_action: params.action,
    p_amount: cost,
    p_metadata: params.metadata || {},
    p_idempotency_key: params.idempotencyKey || null,
  });

  if (error) {
    if (isMissingFunctionError(error) || isMissingTableError(error)) {
      return {
        ok: false,
        code: "config_missing",
        message: "Credit system is not configured in database yet.",
        cost,
      };
    }
    return {
      ok: false,
      code: "system_error",
      message: error.message || "Credit spending failed.",
      cost,
    };
  }

  const row = Array.isArray(data) ? data[0] : data;
  if (!row || row.success !== true) {
    return {
      ok: false,
      code: "insufficient_credits",
      message: row?.error || "Insufficient credits.",
      cost,
      balance: Number(row?.balance || 0),
    };
  }

  return {
    ok: true,
    cost,
    balance: Number(row.balance || 0),
  };
}

export async function grantPremiumMonthlyCredits(params: {
  userId: string;
  source: "paymongo_checkout" | "paymongo_subscription";
  idempotencyKey?: string;
  metadata?: Record<string, unknown>;
}) {
  const { error } = await supabaseAdmin.rpc("grant_user_credits", {
    p_user_id: params.userId,
    p_amount: PREMIUM_MONTHLY_CREDITS,
    p_action: "premium_monthly_allocation",
    p_metadata: {
      source: params.source,
      ...(params.metadata || {}),
    },
    p_idempotency_key: params.idempotencyKey || null,
  });

  if (error && !isMissingFunctionError(error) && !isMissingTableError(error)) {
    throw error;
  }
}

export async function grantTopupCredits(params: {
  userId: string;
  idempotencyKey?: string;
  metadata?: Record<string, unknown>;
}) {
  const { error } = await supabaseAdmin.rpc("grant_user_credits", {
    p_user_id: params.userId,
    p_amount: PREMIUM_TOPUP_CREDITS,
    p_action: "credit_topup_purchase",
    p_metadata: params.metadata || {},
    p_idempotency_key: params.idempotencyKey || null,
  });

  if (error && !isMissingFunctionError(error) && !isMissingTableError(error)) {
    throw error;
  }
}

export { PREMIUM_CREDIT_COSTS, PREMIUM_MONTHLY_CREDITS, PREMIUM_TOPUP_CREDITS };

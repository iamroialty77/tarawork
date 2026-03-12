import { NextResponse } from "next/server";
import { supabaseAdmin } from "../../../../lib/supabase_admin";
import { verifyPaymongoSignature } from "../../../../lib/paymongo";
import { grantPremiumMonthlyCredits, grantTopupCredits } from "../../../../lib/credits";

type ProductType = "pro" | "verification" | "credit_topup";
type PremiumAction = "activate" | "deactivate" | "ignore";
const PREMIUM_SUBSCRIPTION_DAYS = 30;
const DAY_IN_MS = 24 * 60 * 60 * 1000;

type WebhookPayload = {
  data?: {
    id?: string;
    attributes?: {
      livemode?: boolean;
      type?: string;
      data?: {
        id?: string;
        type?: string;
        attributes?: {
          metadata?: {
            product_type?: ProductType;
            user_id?: string;
          };
        };
      };
    };
  };
};

type CheckoutSessionRecord = {
  checkout_id: string;
  user_id: string;
  product_type: ProductType;
  status: string;
};

function toObject(value: unknown): Record<string, unknown> {
  return typeof value === "object" && value !== null ? (value as Record<string, unknown>) : {};
}

function readString(value: unknown): string | undefined {
  return typeof value === "string" && value.length > 0 ? value : undefined;
}

function parseProductType(value: unknown): ProductType | undefined {
  return value === "pro" || value === "verification" || value === "credit_topup" ? value : undefined;
}

function readDate(value: unknown): Date | null {
  if (typeof value !== "string" || value.length === 0) {
    return null;
  }

  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function getExtendedProExpiryIso(currentExpiryRaw: unknown): string {
  const now = new Date();
  const currentExpiry = readDate(currentExpiryRaw);
  const renewalBase =
    currentExpiry && currentExpiry.getTime() > now.getTime() ? currentExpiry : now;

  return new Date(renewalBase.getTime() + PREMIUM_SUBSCRIPTION_DAYS * DAY_IN_MS).toISOString();
}

function isMissingTableError(error: { code?: string; message?: string } | null | undefined) {
  if (!error) {
    return false;
  }

  return (
    error.code === "PGRST205" ||
    error.code === "42P01" ||
    error.message?.includes("relation") ||
    error.message?.includes("Could not find the table") ||
    false
  );
}

function isDuplicateError(error: { code?: string; message?: string } | null | undefined) {
  if (!error) {
    return false;
  }

  return error.code === "23505" || error.message?.toLowerCase().includes("duplicate") || false;
}

function extractMetadata(payload: WebhookPayload) {
  const eventData = payload.data?.attributes?.data;
  const eventDataAttrs = toObject(eventData?.attributes);
  const source = toObject(eventDataAttrs.source);
  const sourceAttrs = toObject(source.attributes);

  const candidates = [
    eventDataAttrs.metadata,
    sourceAttrs.metadata,
  ];

  for (const candidate of candidates) {
    const obj = toObject(candidate);
    const userId = readString(obj.user_id);
    const productType = parseProductType(obj.product_type);

    if (userId || productType) {
      return { userId, productType };
    }
  }

  return { userId: undefined, productType: undefined };
}

function resolveAction(eventType: string): PremiumAction {
  if (eventType === "checkout_session.payment.paid" || eventType === "subscription.invoice.paid") {
    return "activate";
  }

  if (
    eventType === "checkout_session.payment.failed" ||
    eventType === "subscription.invoice.payment_failed" ||
    eventType === "subscription.unpaid" ||
    eventType === "subscription.past_due" ||
    eventType === "subscription.cancelled"
  ) {
    return "deactivate";
  }

  return "ignore";
}

function resolveProStatusFromEvent(eventType: string): "inactive" | "active" | "past_due" | "cancelled" {
  if (eventType === "checkout_session.payment.paid" || eventType === "subscription.invoice.paid") {
    return "active";
  }

  if (eventType === "subscription.past_due") {
    return "past_due";
  }

  if (eventType === "subscription.cancelled") {
    return "cancelled";
  }

  return "inactive";
}

async function getCheckoutSessionById(checkoutId: string): Promise<CheckoutSessionRecord | null> {
  const { data, error } = await supabaseAdmin
    .from("paymongo_checkout_sessions")
    .select("checkout_id, user_id, product_type, status")
    .eq("checkout_id", checkoutId)
    .maybeSingle();

  if (error) {
    if (isMissingTableError(error)) {
      return null;
    }

    throw error;
  }

  if (!data) {
    return null;
  }

  const parsedProduct = parseProductType(data.product_type);

  if (!parsedProduct || !data.user_id || !data.checkout_id || !data.status) {
    return null;
  }

  return {
    checkout_id: data.checkout_id,
    user_id: data.user_id,
    product_type: parsedProduct,
    status: data.status,
  };
}

async function updateCheckoutSessionStatus(checkoutId: string, status: string) {
  const { error } = await supabaseAdmin
    .from("paymongo_checkout_sessions")
    .update({
      status,
      updated_at: new Date().toISOString(),
    })
    .eq("checkout_id", checkoutId);

  if (error && !isMissingTableError(error)) {
    throw error;
  }
}

async function activatePurchase(
  userId: string,
  productType: ProductType,
  eventType: string,
  eventId: string,
) {
  const grantProMonthlyCredits = async () => {
    if (productType !== "pro") return;

    try {
      await grantPremiumMonthlyCredits({
        userId,
        source: eventType === "subscription.invoice.paid" ? "paymongo_subscription" : "paymongo_checkout",
        idempotencyKey: `paymongo-pro-credit:${eventId}`,
        metadata: { eventType, eventId },
      });
    } catch (creditError) {
      console.error("Unable to grant premium monthly credits:", creditError);
    }
  };

  if (productType === "credit_topup") {
    try {
      await grantTopupCredits({
        userId,
        idempotencyKey: `paymongo-credit-topup:${eventId}`,
        metadata: { eventType, eventId },
      });
    } catch (creditError) {
      console.error("Unable to grant credit top-up:", creditError);
    }
    return;
  }

  const { data: existingPortfolio, error: fetchError } = await supabaseAdmin
    .from("portfolios")
    .select("id, theme_settings")
    .eq("profile_id", userId)
    .maybeSingle();

  if (fetchError && fetchError.code !== "PGRST116") {
    throw fetchError;
  }

  const currentThemeSettings =
    existingPortfolio?.theme_settings && typeof existingPortfolio.theme_settings === "object"
      ? existingPortfolio.theme_settings
      : { aesthetic: "professional", primaryColor: "#4f46e5" };

  const currentPremiumProfile =
    currentThemeSettings.premiumProfile && typeof currentThemeSettings.premiumProfile === "object"
      ? currentThemeSettings.premiumProfile
      : {};

  const nextPremiumProfile =
    productType === "pro"
      ? {
          ...currentPremiumProfile,
          tier: "pro",
          verifiedBadge: true,
          advancedPortfolio: true,
          featuredPlacement: true,
          analyticsEnabled: true,
          analytics: {
            profileViews: Number(currentPremiumProfile.analytics?.profileViews || 0),
            clientClicks: Number(currentPremiumProfile.analytics?.clientClicks || 0),
          },
          verifiedProgram: {
            enrolled: !!currentPremiumProfile.verifiedProgram?.enrolled,
            annualFee: Number(currentPremiumProfile.verifiedProgram?.annualFee || 499),
            identityVerified: !!currentPremiumProfile.verifiedProgram?.identityVerified,
            portfolioVerified: !!currentPremiumProfile.verifiedProgram?.portfolioVerified,
            higherSearchRanking: !!currentPremiumProfile.verifiedProgram?.higherSearchRanking,
            clientTrustBoost: !!currentPremiumProfile.verifiedProgram?.clientTrustBoost,
          },
          billing: {
            ...toObject(currentPremiumProfile.billing),
            proStatus: "active",
            proLocked: true,
            proLastEvent: eventType,
            proUpdatedAt: new Date().toISOString(),
            proActivatedAt: new Date().toISOString(),
            proExpiresAt: getExtendedProExpiryIso(currentPremiumProfile.billing?.proExpiresAt),
          },
        }
      : {
          ...currentPremiumProfile,
          verifiedBadge: true,
          verifiedProgram: {
            enrolled: true,
            annualFee: 499,
            identityVerified: true,
            portfolioVerified: true,
            higherSearchRanking: true,
            clientTrustBoost: true,
          },
        };

  const payload = {
    profile_id: userId,
    theme_settings: {
      ...currentThemeSettings,
      premiumProfile: nextPremiumProfile,
    },
    updated_at: new Date().toISOString(),
  };

  if (existingPortfolio?.id) {
    const { error } = await supabaseAdmin
      .from("portfolios")
      .update(payload)
      .eq("id", existingPortfolio.id);

    if (error) {
      throw error;
    }

    await grantProMonthlyCredits();

    return;
  }

  const { error } = await supabaseAdmin.from("portfolios").insert([payload]);

  if (error) {
    throw error;
  }

  await grantProMonthlyCredits();
}

async function deactivatePurchase(userId: string, productType: ProductType, eventType: string) {
  if (productType === "credit_topup") {
    return;
  }

  const { data: existingPortfolio, error: fetchError } = await supabaseAdmin
    .from("portfolios")
    .select("id, theme_settings")
    .eq("profile_id", userId)
    .maybeSingle();

  if (fetchError && fetchError.code !== "PGRST116") {
    throw fetchError;
  }

  if (!existingPortfolio?.id) {
    return;
  }

  const currentThemeSettings =
    existingPortfolio.theme_settings && typeof existingPortfolio.theme_settings === "object"
      ? existingPortfolio.theme_settings
      : { aesthetic: "professional", primaryColor: "#4f46e5" };

  const currentPremiumProfile =
    currentThemeSettings.premiumProfile && typeof currentThemeSettings.premiumProfile === "object"
      ? currentThemeSettings.premiumProfile
      : {};

  const existingVerifiedProgram = {
    enrolled: !!currentPremiumProfile.verifiedProgram?.enrolled,
    annualFee: Number(currentPremiumProfile.verifiedProgram?.annualFee || 499),
    identityVerified: !!currentPremiumProfile.verifiedProgram?.identityVerified,
    portfolioVerified: !!currentPremiumProfile.verifiedProgram?.portfolioVerified,
    higherSearchRanking: !!currentPremiumProfile.verifiedProgram?.higherSearchRanking,
    clientTrustBoost: !!currentPremiumProfile.verifiedProgram?.clientTrustBoost,
  };

  const nextPremiumProfile =
    productType === "pro"
      ? {
          ...currentPremiumProfile,
          tier: "free",
          verifiedBadge: existingVerifiedProgram.enrolled,
          advancedPortfolio: false,
          featuredPlacement: false,
          analyticsEnabled: false,
          customDomain: "",
          billing: {
            ...toObject(currentPremiumProfile.billing),
            proStatus: resolveProStatusFromEvent(eventType),
            proLocked: false,
            proLastEvent: eventType,
            proUpdatedAt: new Date().toISOString(),
            proExpiresAt: new Date().toISOString(),
          },
        }
      : {
          ...currentPremiumProfile,
          verifiedBadge: currentPremiumProfile.tier === "pro",
          verifiedProgram: {
            enrolled: false,
            annualFee: existingVerifiedProgram.annualFee,
            identityVerified: false,
            portfolioVerified: false,
            higherSearchRanking: false,
            clientTrustBoost: false,
          },
        };

  const { error } = await supabaseAdmin
    .from("portfolios")
    .update({
      theme_settings: {
        ...currentThemeSettings,
        premiumProfile: nextPremiumProfile,
      },
      updated_at: new Date().toISOString(),
    })
    .eq("id", existingPortfolio.id);

  if (error) {
    throw error;
  }
}

async function insertEventLog(params: {
  eventId: string;
  eventType: string;
  livemode: boolean;
  resourceId?: string;
  payload: WebhookPayload;
}) {
  const { error } = await supabaseAdmin.from("paymongo_events").insert([
    {
      event_id: params.eventId,
      event_type: params.eventType,
      resource_id: params.resourceId || null,
      livemode: params.livemode,
      payload: params.payload,
      received_at: new Date().toISOString(),
    },
  ]);

  if (!error) {
    return { inserted: true as const };
  }

  if (isDuplicateError(error)) {
    return { inserted: false as const, duplicate: true as const };
  }

  if (isMissingTableError(error)) {
    return { inserted: false as const, missingTable: true as const };
  }

  throw error;
}

async function updateEventLog(
  eventId: string,
  fields: {
    processed?: boolean;
    processing_error?: string | null;
    processed_at?: string | null;
    user_id?: string | null;
    product_type?: ProductType | null;
    resource_id?: string | null;
  },
) {
  const { error } = await supabaseAdmin
    .from("paymongo_events")
    .update(fields)
    .eq("event_id", eventId);

  if (error && !isMissingTableError(error)) {
    throw error;
  }
}

export async function POST(req: Request) {
  const rawBody = await req.text();
  let eventId: string | undefined;

  try {
    const payload = JSON.parse(rawBody) as WebhookPayload;
    eventId = payload.data?.id;
    const eventType = payload.data?.attributes?.type;
    const livemode = !!payload.data?.attributes?.livemode;
    const webhookSecret = process.env.PAYMONGO_WEBHOOK_SECRET;
    const resourceId = payload.data?.attributes?.data?.id;

    if (webhookSecret) {
      const isValid = verifyPaymongoSignature({
        payload: rawBody,
        signatureHeader: req.headers.get("paymongo-signature"),
        webhookSecret,
        livemode,
      });

      if (!isValid) {
        return NextResponse.json({ error: "Invalid PayMongo signature." }, { status: 401 });
      }
    }

    if (!eventId || !eventType) {
      return NextResponse.json({ error: "Invalid webhook event payload." }, { status: 400 });
    }

    const eventLog = await insertEventLog({
      eventId,
      eventType,
      livemode,
      resourceId,
      payload,
    });

    if ("duplicate" in eventLog && eventLog.duplicate) {
      return NextResponse.json({ message: "Event already processed.", eventId });
    }

    const action = resolveAction(eventType);

    if (action === "ignore") {
      await updateEventLog(eventId, {
        processed: true,
        processing_error: null,
        processed_at: new Date().toISOString(),
      });

      return NextResponse.json({ message: "Event ignored.", eventId });
    }

    const metadata = extractMetadata(payload);
    let userId = metadata.userId;
    let productType = metadata.productType;

    if ((!userId || !productType) && resourceId) {
      const checkout = await getCheckoutSessionById(resourceId);
      if (checkout) {
        userId = userId || checkout.user_id;
        productType = productType || checkout.product_type;
      }
    }

    if (!userId || !productType) {
      await updateEventLog(eventId, {
        processed: false,
        processing_error: "Missing user_id or product_type in webhook payload/session mapping.",
        processed_at: null,
        user_id: userId || null,
        product_type: productType || null,
        resource_id: resourceId || null,
      });
      return NextResponse.json({ error: "Missing payment metadata mapping." }, { status: 400 });
    }

    if (action === "activate") {
      await activatePurchase(userId, productType, eventType, eventId);
    } else if (action === "deactivate") {
      await deactivatePurchase(userId, productType, eventType);
    }

    if (resourceId && eventType.startsWith("checkout_session.payment.")) {
      await updateCheckoutSessionStatus(
        resourceId,
        eventType === "checkout_session.payment.paid" ? "paid" : "failed",
      );
    }

    await updateEventLog(eventId, {
      processed: true,
      processing_error: null,
      processed_at: new Date().toISOString(),
      user_id: userId,
      product_type: productType,
      resource_id: resourceId || null,
    });

    return NextResponse.json({
      message: action === "activate" ? "Payment applied." : "Premium access updated.",
      eventId,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Webhook handling failed.";

    if (eventId) {
      await updateEventLog(eventId, {
        processed: false,
        processing_error: message,
        processed_at: null,
      });
    }

    return NextResponse.json({ error: message }, { status: 500 });
  }
}

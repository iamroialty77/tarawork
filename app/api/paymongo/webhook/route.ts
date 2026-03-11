import { NextResponse } from "next/server";
import { supabaseAdmin } from "../../../../lib/supabase_admin";
import { verifyPaymongoSignature } from "../../../../lib/paymongo";

type WebhookPayload = {
  data?: {
    id?: string;
    attributes?: {
      livemode?: boolean;
      type?: string;
      data?: {
        id?: string;
        attributes?: {
          metadata?: {
            product_type?: "pro" | "verification";
            user_id?: string;
          };
        };
      };
    };
  };
};

async function activatePurchase(userId: string, productType: "pro" | "verification") {
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

    return;
  }

  const { error } = await supabaseAdmin.from("portfolios").insert([payload]);

  if (error) {
    throw error;
  }
}

export async function POST(req: Request) {
  const rawBody = await req.text();

  try {
    const payload = JSON.parse(rawBody) as WebhookPayload;
    const eventType = payload.data?.attributes?.type;
    const livemode = !!payload.data?.attributes?.livemode;
    const webhookSecret = process.env.PAYMONGO_WEBHOOK_SECRET;

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

    if (eventType !== "checkout_session.payment.paid") {
      return NextResponse.json({ message: "Event ignored." });
    }

    const metadata = payload.data?.attributes?.data?.attributes?.metadata;
    const userId = metadata?.user_id;
    const productType = metadata?.product_type;

    if (!userId || !productType) {
      return NextResponse.json({ error: "Missing checkout metadata." }, { status: 400 });
    }

    await activatePurchase(userId, productType);

    return NextResponse.json({
      message: "Payment applied.",
      eventId: payload.data?.id,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Webhook handling failed.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

import { NextResponse } from "next/server";
import {
  getBaseAppUrl,
  getPaymongoAuthHeader,
  getPaymongoPaymentMethods,
  getPaymongoProduct,
  type PaymongoProductType,
} from "../../../../lib/paymongo";
import { supabaseAdmin } from "../../../../lib/supabase_admin";

type CheckoutRequestBody = {
  productType?: PaymongoProductType;
  userId?: string;
  email?: string;
  name?: string;
};

function toObject(value: unknown): Record<string, unknown> {
  return typeof value === "object" && value !== null ? (value as Record<string, unknown>) : {};
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as CheckoutRequestBody;
    const { productType, userId, email, name } = body;

    if (!productType || (productType !== "pro" && productType !== "verification" && productType !== "credit_topup")) {
      return NextResponse.json({ error: "Invalid product type." }, { status: 400 });
    }

    if (!userId) {
      return NextResponse.json({ error: "Missing userId." }, { status: 400 });
    }

    if (productType === "pro") {
      const { data: existingPortfolio, error: existingPortfolioError } = await supabaseAdmin
        .from("portfolios")
        .select("theme_settings")
        .eq("profile_id", userId)
        .maybeSingle();

      if (existingPortfolioError && existingPortfolioError.code !== "PGRST116") {
        throw existingPortfolioError;
      }

      const themeSettings = toObject(existingPortfolio?.theme_settings);
      const premiumProfile = toObject(themeSettings.premiumProfile);
      const billing = toObject(premiumProfile.billing);
      const proStatus = billing.proStatus;
      const proExpiresAt = typeof billing.proExpiresAt === "string" ? new Date(billing.proExpiresAt) : null;
      const hasValidExpiry = !!proExpiresAt && !Number.isNaN(proExpiresAt.getTime());
      const isUnexpired = hasValidExpiry && proExpiresAt.getTime() > Date.now();
      const isAlreadyPaidPro =
        premiumProfile.tier === "pro" &&
        billing.proLocked === true &&
        proStatus === "active" &&
        isUnexpired;

      if (isAlreadyPaidPro) {
        return NextResponse.json(
          { error: "Your Premium Profile subscription is already active." },
          { status: 409 },
        );
      }
    }

    if (productType === "credit_topup") {
      const { data: existingPortfolio, error: existingPortfolioError } = await supabaseAdmin
        .from("portfolios")
        .select("theme_settings")
        .eq("profile_id", userId)
        .maybeSingle();

      if (existingPortfolioError && existingPortfolioError.code !== "PGRST116") {
        throw existingPortfolioError;
      }

      const themeSettings = toObject(existingPortfolio?.theme_settings);
      const premiumProfile = toObject(themeSettings.premiumProfile);

      if (premiumProfile.tier !== "pro") {
        return NextResponse.json(
          { error: "Credit top-up is available only for Pro accounts." },
          { status: 403 },
        );
      }
    }

    const product = getPaymongoProduct(productType);
    const appUrl = getBaseAppUrl();

    const paymongoResponse = await fetch("https://api.paymongo.com/v1/checkout_sessions", {
      method: "POST",
      headers: {
        Accept: "application/json",
        Authorization: getPaymongoAuthHeader(),
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        data: {
          attributes: {
            billing: email || name ? { email, name } : undefined,
            cancel_url: `${appUrl}/?payment=cancelled&product=${productType}`,
            description: product.description,
            line_items: [
              {
                amount: product.amount,
                currency: "PHP",
                description: product.description,
                name: product.name,
                quantity: 1,
              },
            ],
            metadata: {
              product_type: productType,
              user_id: userId,
            },
            payment_method_types: getPaymongoPaymentMethods(),
            send_email_receipt: true,
            show_description: true,
            show_line_items: true,
            success_url: `${appUrl}/?payment=success&product=${productType}`,
          },
        },
      }),
    });

    const paymongoPayload = await paymongoResponse.json();

    if (!paymongoResponse.ok) {
      const message =
        paymongoPayload?.errors?.[0]?.detail ||
        paymongoPayload?.errors?.[0]?.code ||
        "PayMongo checkout creation failed.";

      return NextResponse.json({ error: message }, { status: 502 });
    }

    const checkoutId = paymongoPayload?.data?.id as string | undefined;

    if (checkoutId) {
      const { error } = await supabaseAdmin.from("paymongo_checkout_sessions").upsert(
        [
          {
            checkout_id: checkoutId,
            user_id: userId,
            product_type: productType,
            status: "pending",
            livemode: !!paymongoPayload?.data?.attributes?.livemode,
            amount: product.amount,
            currency: "PHP",
            email: email || null,
            updated_at: new Date().toISOString(),
          },
        ],
        { onConflict: "checkout_id" },
      );

      if (error && error.code !== "PGRST205" && error.code !== "42P01") {
        return NextResponse.json({ error: `Checkout saved but mapping failed: ${error.message}` }, { status: 500 });
      }
    }

    return NextResponse.json({
      checkoutId: paymongoPayload.data.id,
      checkoutUrl: paymongoPayload.data.attributes.checkout_url,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Checkout creation failed.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

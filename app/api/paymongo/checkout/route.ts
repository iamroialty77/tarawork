import { NextResponse } from "next/server";
import {
  getBaseAppUrl,
  getPaymongoAuthHeader,
  getPaymongoPaymentMethods,
  getPaymongoProduct,
  type PaymongoProductType,
} from "../../../../lib/paymongo";

type CheckoutRequestBody = {
  productType?: PaymongoProductType;
  userId?: string;
  email?: string;
  name?: string;
};

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as CheckoutRequestBody;
    const { productType, userId, email, name } = body;

    if (!productType || (productType !== "pro" && productType !== "verification")) {
      return NextResponse.json({ error: "Invalid product type." }, { status: 400 });
    }

    if (!userId) {
      return NextResponse.json({ error: "Missing userId." }, { status: 400 });
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

    return NextResponse.json({
      checkoutId: paymongoPayload.data.id,
      checkoutUrl: paymongoPayload.data.attributes.checkout_url,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Checkout creation failed.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

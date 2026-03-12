import crypto from "crypto";

export type PaymongoProductType = "pro" | "verification" | "credit_topup";

type CheckoutProduct = {
  amount: number;
  description: string;
  name: string;
};

const checkoutProducts: Record<PaymongoProductType, CheckoutProduct> = {
  pro: {
    amount: 19900,
    description: "Tara Freelancer Pro monthly access",
    name: "Tara Freelancer Pro",
  },
  verification: {
    amount: 49900,
    description: "Tara Verified Freelancer annual program",
    name: "Tara Verified Freelancer",
  },
  credit_topup: {
    amount: 14900,
    description: "Tara Premium Credits top-up (+10 credits)",
    name: "Tara Credits Top-up",
  },
};

export function getPaymongoProduct(productType: PaymongoProductType): CheckoutProduct {
  return checkoutProducts[productType];
}

export function getPaymongoSecretKey() {
  const secretKey = process.env.PAYMONGO_SECRET_KEY;

  if (!secretKey) {
    throw new Error("PAYMONGO_SECRET_KEY is not configured.");
  }

  return secretKey;
}

export function getBaseAppUrl() {
  return (
    process.env.NEXT_PUBLIC_APP_URL ||
    process.env.NEXT_PUBLIC_SITE_URL ||
    "http://localhost:3000"
  ).replace(/\/$/, "");
}

export function getPaymongoPaymentMethods() {
  const rawValue = process.env.PAYMONGO_PAYMENT_METHODS;

  if (!rawValue) {
    return ["gcash"];
  }

  return rawValue
    .split(",")
    .map((method) => method.trim())
    .filter(Boolean);
}

export function getPaymongoAuthHeader() {
  const token = Buffer.from(`${getPaymongoSecretKey()}:`).toString("base64");
  return `Basic ${token}`;
}

export function verifyPaymongoSignature({
  payload,
  signatureHeader,
  webhookSecret,
  livemode,
}: {
  payload: string;
  signatureHeader: string | null;
  webhookSecret: string;
  livemode: boolean;
}) {
  if (!signatureHeader) {
    return false;
  }

  const signatureParts = Object.fromEntries(
    signatureHeader.split(",").map((part) => {
      const [key, value = ""] = part.split("=");
      return [key.trim(), value.trim()];
    }),
  );

  if (!signatureParts.t) {
    return false;
  }

  const signedPayload = `${signatureParts.t}.${payload}`;
  const computedSignature = crypto
    .createHmac("sha256", webhookSecret)
    .update(signedPayload)
    .digest("hex");

  const expectedSignature = livemode ? signatureParts.li : signatureParts.te;

  if (!expectedSignature) {
    return false;
  }

  if (computedSignature.length !== expectedSignature.length) {
    return false;
  }

  return crypto.timingSafeEqual(
    Buffer.from(computedSignature),
    Buffer.from(expectedSignature),
  );
}

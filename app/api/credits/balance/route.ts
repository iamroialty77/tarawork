import { NextRequest, NextResponse } from "next/server";
import {
  getCreditBalance,
  isUserPremiumActive,
  PREMIUM_CREDIT_COSTS,
  PREMIUM_MONTHLY_CREDITS,
} from "@/lib/credits";

export async function GET(req: NextRequest) {
  try {
    const userId = req.nextUrl.searchParams.get("userId");
    if (!userId) {
      return NextResponse.json({ error: "Missing userId." }, { status: 400 });
    }

    const [balance, premiumActive] = await Promise.all([
      getCreditBalance(userId),
      isUserPremiumActive(userId),
    ]);

    return NextResponse.json({
      balance,
      premiumActive,
      monthlyAllocation: PREMIUM_MONTHLY_CREDITS,
      costs: PREMIUM_CREDIT_COSTS,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to load credits.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

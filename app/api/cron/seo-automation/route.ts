import { NextRequest, NextResponse } from "next/server";
import { runSeoAutomation } from "@/lib/seoAutomation";

export const runtime = "nodejs";
export async function GET(req: NextRequest) {
  const secret = process.env.CRON_SECRET; if (!secret || req.headers.get("authorization") !== `Bearer ${secret}`) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  try { return NextResponse.json({ success: true, ...await runSeoAutomation("cron") }); }
  catch (error) { return NextResponse.json({ error: error instanceof Error ? error.message : "SEO automation failed." }, { status: 500 }); }
}

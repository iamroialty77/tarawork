import { NextRequest, NextResponse } from "next/server";
import { getJobMatchConfig, sendJobMatches } from "@/lib/jobMatchAutomation";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const secret = process.env.CRON_SECRET;
  if (!secret || req.headers.get("authorization") !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }
  try {
    const config = await getJobMatchConfig();
    if (!config.enabled) return NextResponse.json({ success: true, skipped: true, reason: "Automation is disabled." });
    return NextResponse.json({ success: true, ...await sendJobMatches(config, "cron") });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Job match automation failed." }, { status: 500 });
  }
}

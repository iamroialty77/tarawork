import { NextRequest, NextResponse } from "next/server";
import { getProfileReminderConfig, sendProfileReminders } from "@/lib/profileReminderAutomation";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const secret = process.env.CRON_SECRET;
  if (!secret || req.headers.get("authorization") !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }
  try {
    const config = await getProfileReminderConfig();
    if (!config.enabled) return NextResponse.json({ success: true, skipped: true, reason: "Automation is disabled." });
    const result = await sendProfileReminders(config, "cron");
    return NextResponse.json({ success: true, ...result });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Automation failed." }, { status: 500 });
  }
}

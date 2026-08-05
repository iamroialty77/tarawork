import { NextRequest, NextResponse } from "next/server";
import { ingestRssJobs } from "@/lib/rssJobIngestion";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function GET(req: NextRequest) {
  const secret = process.env.CRON_SECRET;
  if (!secret || req.headers.get("authorization") !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }
  try {
    return NextResponse.json({ success: true, ...await ingestRssJobs(undefined, "cron") });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "RSS job ingestion failed." }, { status: 500 });
  }
}

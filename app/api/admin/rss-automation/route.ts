import { NextRequest, NextResponse } from "next/server";
import { requireAdminUser } from "@/lib/authz";
import { assertSameOrigin, getClientIp, rateLimit } from "@/lib/security";
import { getRssAutomationConfig, ingestRssJobs, normalizeRssConfig, saveRssAutomationConfig } from "@/lib/rssJobIngestion";
import { getRssLocalAiStatus } from "@/lib/rssLocalAi";
import { supabaseAdmin } from "@/lib/supabase_admin";

export const runtime = "nodejs";
export const maxDuration = 60;

const message = (error: unknown) => error instanceof Error ? error.message : "Unable to process RSS automation.";

export async function GET() {
  const admin = await requireAdminUser("automation.manage");
  if (admin.error) return NextResponse.json({ error: admin.error }, { status: admin.status });
  try {
    const [config, runs, count] = await Promise.all([
      getRssAutomationConfig(),
      supabaseAdmin.from("rss_automation_runs").select("*").order("started_at", { ascending: false }).limit(10),
      supabaseAdmin.from("jobs").select("id", { count: "exact", head: true }).eq("source", "rss").eq("status", "live"),
    ]);
    if (runs.error) throw runs.error;
    if (count.error) throw count.error;
    return NextResponse.json({ config, runs: runs.data || [], activeJobCount: count.count || 0, localAi: getRssLocalAiStatus() });
  } catch (error) { return NextResponse.json({ error: message(error) }, { status: 500 }); }
}

export async function POST(req: NextRequest) {
  const originError = assertSameOrigin(req);
  if (originError) return originError;
  const admin = await requireAdminUser("automation.manage");
  if (admin.error) return NextResponse.json({ error: admin.error }, { status: admin.status });
  try {
    const body = await req.json();
    const config = normalizeRssConfig(body.config);
    if (config.enabled && !config.feeds.length) return NextResponse.json({ error: "Add at least one feed before enabling RSS automation." }, { status: 400 });
    if (body.action !== "run") {
      return NextResponse.json({ success: true, config: await saveRssAutomationConfig(config, admin.user?.id) });
    }
    const limited = rateLimit({ key: `admin:rss:${admin.user?.id || getClientIp(req)}`, limit: 4, windowMs: 60 * 60 * 1000 });
    if (limited) return limited;
    const saved = await saveRssAutomationConfig(config, admin.user?.id);
    return NextResponse.json({ success: true, config: saved, ...await ingestRssJobs(saved, "manual", admin.user?.id) });
  } catch (error) { return NextResponse.json({ error: message(error) }, { status: 500 }); }
}

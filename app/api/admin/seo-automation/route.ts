import { NextRequest, NextResponse } from "next/server";
import { requireAdminUser } from "@/lib/authz";
import { assertSameOrigin, getClientIp, rateLimit } from "@/lib/security";
import { getSeoAutomationConfig, rollbackSeoChange, runSeoAutomation, saveSeoAutomationConfig } from "@/lib/seoAutomation";
import { searchConsoleStatus } from "@/lib/googleSearchConsole";
import { saveSiteSettings } from "@/lib/siteSettings";
import { supabaseAdmin } from "@/lib/supabase_admin";

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export async function GET() {
  const admin = await requireAdminUser("site_settings.manage"); if (admin.error) return NextResponse.json({ error: admin.error }, { status: admin.status });
  try {
    const [config, integration, runs, changes, opportunities] = await Promise.all([
      getSeoAutomationConfig(), searchConsoleStatus(),
      supabaseAdmin.from("seo_automation_runs").select("id,trigger_type,mode,status,discovered_count,applied_count,summary,error_message,started_at,completed_at").order("started_at", { ascending: false }).limit(12),
      supabaseAdmin.from("seo_change_history").select("id,run_id,change_type,target_page,reason,confidence,status,after_value,applied_at,rolled_back_at").order("applied_at", { ascending: false }).limit(20),
      supabaseAdmin.from("seo_keyword_opportunities").select("id,keyword,source,intent,opportunity_score,competition,impressions,clicks,ctr,average_position,target_page,status,last_seen_at").order("opportunity_score", { ascending: false }).limit(30),
    ]);
    const error = runs.error || changes.error || opportunities.error; if (error) throw new Error(error.message);
    return NextResponse.json({ config, integration, runs: runs.data || [], changes: changes.data || [], opportunities: opportunities.data || [] });
  } catch (error) { return NextResponse.json({ error: error instanceof Error ? error.message : "Unable to load SEO automation." }, { status: 500 }); }
}

export async function PUT(req: NextRequest) {
  const originError = assertSameOrigin(req); if (originError) return originError;
  const admin = await requireAdminUser("site_settings.manage"); if (admin.error) return NextResponse.json({ error: admin.error }, { status: admin.status });
  try { return NextResponse.json({ success: true, config: await saveSeoAutomationConfig(await req.json(), admin.user!.id) }); }
  catch (error) { return NextResponse.json({ error: error instanceof Error ? error.message : "Unable to save SEO automation." }, { status: 500 }); }
}

export async function POST(req: NextRequest) {
  const originError = assertSameOrigin(req); if (originError) return originError;
  const admin = await requireAdminUser("site_settings.manage"); if (admin.error) return NextResponse.json({ error: admin.error }, { status: admin.status });
  const limited = rateLimit({ key: `admin:seo-automation:${admin.user?.id || getClientIp(req)}`, limit: 12, windowMs: 60 * 60 * 1000 }); if (limited) return limited;
  try {
    const body = await req.json(); const action = String(body.action || "run");
    if (action === "run") return NextResponse.json({ success: true, result: await runSeoAutomation("manual", admin.user!.id) });
    const changeId = String(body.changeId || ""); if (!UUID.test(changeId)) return NextResponse.json({ error: "Invalid change ID." }, { status: 400 });
    if (action === "rollback") { await rollbackSeoChange(changeId, admin.user!.id); return NextResponse.json({ success: true }); }
    if (action === "approve") {
      const { data, error } = await supabaseAdmin.from("seo_change_history").select("after_value,status").eq("id", changeId).maybeSingle(); if (error || !data) throw new Error(error?.message || "SEO proposal not found."); if (data.status !== "proposed") return NextResponse.json({ error: "Only proposed changes can be approved." }, { status: 400 });
      await saveSiteSettings(data.after_value, admin.user!.id); await supabaseAdmin.from("seo_change_history").update({ status: "applied", applied_by: admin.user!.id, applied_at: new Date().toISOString() }).eq("id", changeId); return NextResponse.json({ success: true });
    }
    if (action === "reject") { await supabaseAdmin.from("seo_change_history").update({ status: "rejected" }).eq("id", changeId).eq("status", "proposed"); return NextResponse.json({ success: true }); }
    return NextResponse.json({ error: "Invalid action." }, { status: 400 });
  } catch (error) { return NextResponse.json({ error: error instanceof Error ? error.message : "SEO automation action failed." }, { status: 500 }); }
}

import { NextRequest, NextResponse } from "next/server";
import { requireAdminUser } from "@/lib/authz";
import { assertSameOrigin, getClientIp, rateLimit } from "@/lib/security";
import { getBlogAutomationConfig, runBlogAutomation, saveBlogAutomationConfig } from "@/lib/blogAutomation";
import { supabaseAdmin } from "@/lib/supabase_admin";

export async function GET() {
  const admin = await requireAdminUser("blog.manage"); if (admin.error) return NextResponse.json({ error: admin.error }, { status: admin.status });
  try { const [config, runs, opportunities] = await Promise.all([getBlogAutomationConfig(), supabaseAdmin.from("blog_automation_runs").select("id,trigger_type,status,mode,selected_topics,created_post_ids,created_count,error_message,summary,started_at,completed_at").order("started_at", { ascending: false }).limit(12), supabaseAdmin.from("seo_keyword_opportunities").select("keyword,opportunity_score,intent,status").order("opportunity_score", { ascending: false }).limit(20)]); const error = runs.error || opportunities.error; if (error) throw new Error(error.message); return NextResponse.json({ config, runs: runs.data || [], opportunities: opportunities.data || [], aiConfigured: Boolean(process.env.OPENAI_API_KEY), model: process.env.OPENAI_MODEL || "gpt-4o-mini" }); }
  catch (error) { return NextResponse.json({ error: error instanceof Error ? error.message : "Unable to load Blog Autopilot." }, { status: 500 }); }
}

export async function PUT(req: NextRequest) {
  const originError = assertSameOrigin(req); if (originError) return originError; const admin = await requireAdminUser("blog.manage"); if (admin.error) return NextResponse.json({ error: admin.error }, { status: admin.status });
  try { return NextResponse.json({ success: true, config: await saveBlogAutomationConfig(await req.json(), admin.user!.id) }); } catch (error) { return NextResponse.json({ error: error instanceof Error ? error.message : "Unable to save Blog Autopilot." }, { status: 500 }); }
}

export async function POST(req: NextRequest) {
  const originError = assertSameOrigin(req); if (originError) return originError; const admin = await requireAdminUser("blog.manage"); if (admin.error) return NextResponse.json({ error: admin.error }, { status: admin.status }); const limited = rateLimit({ key: `admin:blog-automation:${admin.user?.id || getClientIp(req)}`, limit: 6, windowMs: 60 * 60 * 1000 }); if (limited) return limited;
  try { return NextResponse.json({ success: true, result: await runBlogAutomation("manual", admin.user!.id) }); } catch (error) { return NextResponse.json({ error: error instanceof Error ? error.message : "Blog automation failed." }, { status: 500 }); }
}

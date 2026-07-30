import { NextRequest, NextResponse } from "next/server";
import { requireAdminUser } from "@/lib/authz";
import { assertSameOrigin, getClientIp, isUuid, rateLimit } from "@/lib/security";
import { supabaseAdmin } from "@/lib/supabase_admin";

const cleanIds = (value: unknown) => Array.isArray(value)
  ? [...new Set(value.map(String).filter(isUuid))].slice(0, 50)
  : [];

export async function POST(req: NextRequest) {
  const originError = assertSameOrigin(req);
  if (originError) return originError;
  const admin = await requireAdminUser("users.manage");
  if (admin.error) return NextResponse.json({ error: admin.error }, { status: admin.status });
  const limited = rateLimit({ key: `admin:bulk-accounts:${admin.user?.id || getClientIp(req)}`, limit: 10, windowMs: 60 * 60 * 1000 });
  if (limited) return limited;

  try {
    const body = await req.json();
    const action = body.action === "delete" ? "delete" : body.action === "suspend" ? "suspend" : "";
    const userIds = cleanIds(body.userIds).filter((id) => id !== admin.user!.id);
    if (!action || !userIds.length) return NextResponse.json({ error: "Select at least one valid account." }, { status: 400 });
    if (action === "delete" && body.confirmation !== "DELETE") {
      return NextResponse.json({ error: "Bulk deletion requires explicit confirmation." }, { status: 400 });
    }

    const { data: targets, error: targetError } = await supabaseAdmin.from("profiles").select("id,role").in("id", userIds);
    if (targetError) throw new Error(targetError.message);
    const safeIds = (targets || []).filter((profile) => profile.role !== "admin").map((profile) => profile.id);
    if (!safeIds.length) return NextResponse.json({ error: "No eligible non-admin accounts were selected." }, { status: 400 });

    if (action === "suspend") {
      const { error } = await supabaseAdmin.from("profiles").update({ status: "suspended", updated_at: new Date().toISOString() }).in("id", safeIds);
      if (error) throw new Error(error.message);
    } else {
      for (const userId of safeIds) {
        await supabaseAdmin.from("applications").delete().eq("freelancer_id", userId);
        await supabaseAdmin.from("jobs").delete().eq("employer_id", userId);
        await supabaseAdmin.from("conversations").delete().or(`participant_1.eq.${userId},participant_2.eq.${userId}`);
        await supabaseAdmin.from("notifications").delete().eq("user_id", userId);
        await supabaseAdmin.from("portfolio_items").delete().eq("profile_id", userId);
        await supabaseAdmin.from("portfolios").delete().eq("profile_id", userId);
        await supabaseAdmin.from("profiles").delete().eq("id", userId);
        const { error } = await supabaseAdmin.auth.admin.deleteUser(userId);
        if (error && error.message !== "User not found") throw new Error(`Could not delete account ${userId}: ${error.message}`);
      }
    }

    await supabaseAdmin.from("admin_audit_logs").insert({
      admin_id: admin.user!.id,
      action: action === "delete" ? "bulk_delete_accounts" : "bulk_suspend_accounts",
      target_type: "profile",
      target_id: safeIds[0],
      details: { count: safeIds.length, userIds: safeIds },
    });
    return NextResponse.json({ success: true, affected: safeIds.length, action });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unable to process selected accounts." }, { status: 500 });
  }
}

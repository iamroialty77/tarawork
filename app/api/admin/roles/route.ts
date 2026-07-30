import { NextRequest, NextResponse } from "next/server";
import { ADMIN_PERMISSIONS, type AdminPermission, requireAdminUser } from "@/lib/authz";
import { assertSameOrigin, getClientIp, rateLimit } from "@/lib/security";
import { supabaseAdmin } from "@/lib/supabase_admin";

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export async function GET() {
  const admin = await requireAdminUser();
  if (admin.error) return NextResponse.json({ error: admin.error }, { status: admin.status });

  const response: Record<string, unknown> = {
    permissions: admin.permissions,
    isOwner: admin.isOwner,
    permissionOptions: ADMIN_PERMISSIONS,
  };

  if (admin.permissions?.includes("roles.manage")) {
    const [{ data: profiles, error: profilesError }, { data: assignments, error: assignmentsError }] = await Promise.all([
      supabaseAdmin.from("profiles").select("id,name,username,role,avatar_url").in("role", ["freelancer", "employer", "admin"]).order("name"),
      supabaseAdmin.from("delegated_admins").select("user_id,base_role,permissions,is_owner,created_at,updated_at,granted_by"),
    ]);
    if (profilesError || assignmentsError) {
      return NextResponse.json({ error: profilesError?.message || assignmentsError?.message }, { status: 500 });
    }
    response.users = profiles || [];
    response.assignments = assignments || [];
  }

  return NextResponse.json(response);
}

export async function POST(req: NextRequest) {
  const originError = assertSameOrigin(req);
  if (originError) return originError;
  const admin = await requireAdminUser("roles.manage");
  if (admin.error) return NextResponse.json({ error: admin.error }, { status: admin.status });
  const limited = rateLimit({ key: `admin:roles:${admin.user?.id || getClientIp(req)}`, limit: 40, windowMs: 60 * 60 * 1000 });
  if (limited) return limited;

  const body = await req.json();
  const userId = String(body.userId || "").trim();
  const action = String(body.action || "");
  if (!UUID.test(userId)) return NextResponse.json({ error: "Invalid user ID." }, { status: 400 });
  if (userId === admin.user!.id) return NextResponse.json({ error: "You cannot change your own admin access." }, { status: 400 });

  const { data: target, error: targetError } = await supabaseAdmin.from("profiles").select("id,role,name").eq("id", userId).maybeSingle();
  if (targetError || !target) return NextResponse.json({ error: targetError?.message || "User not found." }, { status: 404 });

  if (action === "revoke") {
    const { data: assignment } = await supabaseAdmin.from("delegated_admins").select("base_role,is_owner").eq("user_id", userId).maybeSingle();
    if (!assignment) return NextResponse.json({ error: "This user has no delegated admin assignment." }, { status: 400 });
    if (assignment.is_owner) return NextResponse.json({ error: "Owner access cannot be revoked from this screen." }, { status: 400 });
    const { error } = await supabaseAdmin.from("profiles").update({ role: assignment.base_role }).eq("id", userId);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    await supabaseAdmin.from("delegated_admins").delete().eq("user_id", userId);
  } else if (action === "grant") {
    const permissions = [...new Set(Array.isArray(body.permissions) ? body.permissions : [])]
      .filter((item): item is AdminPermission => ADMIN_PERMISSIONS.includes(item as AdminPermission));
    if (!permissions.length) return NextResponse.json({ error: "Select at least one permission." }, { status: 400 });
    const existing = await supabaseAdmin.from("delegated_admins").select("base_role,is_owner").eq("user_id", userId).maybeSingle();
    if (existing.data?.is_owner) return NextResponse.json({ error: "Owner permissions cannot be limited here." }, { status: 400 });
    const baseRole = existing.data?.base_role || (target.role === "employer" ? "employer" : "freelancer");
    const { error } = await supabaseAdmin.from("delegated_admins").upsert({
      user_id: userId,
      base_role: baseRole,
      permissions,
      is_owner: false,
      granted_by: admin.user!.id,
      updated_at: new Date().toISOString(),
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    const { data: promotedProfile, error: roleError } = await supabaseAdmin
      .from("profiles")
      .update({ role: "admin" })
      .eq("id", userId)
      .select("id,role")
      .maybeSingle();
    if (roleError) return NextResponse.json({ error: roleError.message }, { status: 500 });
    if (promotedProfile?.role !== "admin") {
      await supabaseAdmin.from("delegated_admins").delete().eq("user_id", userId).eq("is_owner", false);
      return NextResponse.json({
        error: "The database role-protection trigger blocked this promotion. Re-run docs/delegated_admin_roles.sql in Supabase, then try again.",
      }, { status: 409 });
    }
  } else {
    return NextResponse.json({ error: "Invalid action." }, { status: 400 });
  }

  await supabaseAdmin.from("admin_audit_logs").insert({
    admin_id: admin.user!.id,
    action: action === "grant" ? "grant_admin_access" : "revoke_admin_access",
    target_type: "profile",
    target_id: userId,
    details: { permissions: body.permissions || [], targetName: target.name },
  });
  return NextResponse.json({ success: true });
}

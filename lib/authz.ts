import { supabaseAdmin } from "@/lib/supabase_admin";
import { getAuthenticatedUser } from "@/lib/supabase_server";

export const ADMIN_PERMISSIONS = [
  "overview.view",
  "users.manage",
  "jobs.manage",
  "disputes.manage",
  "talent_requests.view",
  "email.manage",
  "automation.manage",
  "site_settings.manage",
  "blog.manage",
  "reports.view",
  "health.view",
  "roles.manage",
] as const;

export type AdminPermission = (typeof ADMIN_PERMISSIONS)[number];

export async function requireAdminUser(permission?: AdminPermission) {
  const user = await getAuthenticatedUser();
  if (!user) return { user: null, error: "Unauthorized.", status: 401 };

  const { data: profile, error } = await supabaseAdmin
    .from("profiles")
    .select("id, role")
    .eq("id", user.id)
    .maybeSingle();

  if (error) return { user: null, error: error.message, status: 500 };
  if ((profile?.role || "").toLowerCase() !== "admin") {
    return { user: null, error: "Admin access required.", status: 403 };
  }

  const { data: access, error: accessError } = await supabaseAdmin
    .from("delegated_admins")
    .select("permissions,is_owner")
    .eq("user_id", user.id)
    .maybeSingle();

  // Admins created before delegated access was introduced remain owners.
  const isOwner = !access || access.is_owner === true;
  const permissions = isOwner
    ? [...ADMIN_PERMISSIONS]
    : (Array.isArray(access.permissions) ? access.permissions : []).filter(
        (item): item is AdminPermission => ADMIN_PERMISSIONS.includes(item as AdminPermission),
      );

  if (accessError && accessError.code !== "42P01" && accessError.code !== "PGRST205") {
    return { user: null, error: accessError.message, status: 500 };
  }
  if (permission && !permissions.includes(permission)) {
    return { user: null, error: "You do not have permission to access this admin section.", status: 403 };
  }

  return { user, profile, permissions, isOwner, error: null, status: 200 };
}

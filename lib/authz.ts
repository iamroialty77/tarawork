import { supabaseAdmin } from "@/lib/supabase_admin";
import { getAuthenticatedUser } from "@/lib/supabase_server";

export async function requireAdminUser() {
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

  return { user, error: null, status: 200 };
}

import { NextRequest, NextResponse } from "next/server";
import { requireAdminUser } from "@/lib/authz";
import { assertSameOrigin, getClientIp, rateLimit } from "@/lib/security";
import { supabaseAdmin } from "@/lib/supabase_admin";

const cleanLine = (value: unknown, max: number) => String(value || "").replace(/\s+/g, " ").trim().slice(0, max);
const cleanText = (value: unknown, max: number) => String(value || "").trim().slice(0, max);
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const roles = new Set(["freelancer", "employer"]);
const statuses = new Set(["pending", "approved", "suspended"]);

export async function POST(req: NextRequest) {
  const originError = assertSameOrigin(req);
  if (originError) return originError;
  const admin = await requireAdminUser();
  if (admin.error) return NextResponse.json({ error: admin.error }, { status: admin.status });
  const limited = rateLimit({ key: `admin:update-profile:${admin.user?.id || getClientIp(req)}`, limit: 120, windowMs: 60 * 60 * 1000 });
  if (limited) return limited;

  try {
    const body = await req.json();
    const userId = cleanLine(body.userId, 80);
    const role = cleanLine(body.role, 30).toLowerCase();
    const status = cleanLine(body.status, 30).toLowerCase();
    const name = cleanLine(body.name, 160);
    const username = cleanLine(body.username, 80).toLowerCase().replace(/[^a-z0-9_-]/g, "");
    const category = cleanLine(body.category, 120) || "General";
    const bio = cleanText(body.bio, 5000);
    const avatarUrl = cleanLine(body.avatarUrl, 1000);
    const companyName = cleanLine(body.companyName, 180);
    const hourlyRate = cleanLine(body.hourlyRate, 80);
    const skills = Array.isArray(body.skills)
      ? [...new Set(body.skills.map((skill: unknown) => cleanLine(skill, 60)).filter(Boolean))].slice(0, 50)
      : [];

    if (!UUID.test(userId)) return NextResponse.json({ error: "Invalid user ID." }, { status: 400 });
    if (!name) return NextResponse.json({ error: "Full name is required." }, { status: 400 });
    if (!roles.has(role)) return NextResponse.json({ error: "Role must be freelancer or employer." }, { status: 400 });
    if (!statuses.has(status)) return NextResponse.json({ error: "Invalid verification status." }, { status: 400 });
    if (username && username.length < 3) return NextResponse.json({ error: "Username must contain at least 3 characters." }, { status: 400 });
    if (avatarUrl) {
      try {
        if (new URL(avatarUrl).protocol !== "https:") throw new Error();
      } catch {
        return NextResponse.json({ error: "Avatar URL must be a valid HTTPS URL." }, { status: 400 });
      }
    }

    const { data, error } = await supabaseAdmin.from("profiles").update({
      name,
      username: username || null,
      role,
      status,
      category,
      bio,
      avatar_url: avatarUrl || null,
      companyName: role === "employer" ? companyName : null,
      hourlyRate: role === "freelancer" ? hourlyRate : "",
      skills: role === "freelancer" ? skills : [],
      updated_at: new Date().toISOString(),
    }).eq("id", userId).select("*").maybeSingle();

    if (error) {
      const duplicate = /duplicate|unique/i.test(error.message);
      return NextResponse.json({ error: duplicate ? "That username is already in use." : error.message }, { status: duplicate ? 409 : 500 });
    }
    if (!data) return NextResponse.json({ error: "User profile was not found." }, { status: 404 });

    await supabaseAdmin.from("admin_audit_logs").insert({
      admin_id: admin.user!.id,
      action: "update_user_profile",
      target_type: "profile",
      target_id: userId,
      details: { role, status, category, username },
    });
    return NextResponse.json({ success: true, profile: data });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unable to update profile." }, { status: 500 });
  }
}

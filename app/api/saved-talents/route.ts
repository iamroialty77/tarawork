import { NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/supabase_server";
import { supabaseAdmin } from "@/lib/supabase_admin";

type SavedTalentBody = {
  freelancerId?: string;
};

const EMPLOYER_ROLES = new Set(["employer", "client", "hirer", "admin"]);

async function ensureEmployer(userId: string) {
  const { data: profile, error } = await supabaseAdmin
    .from("profiles")
    .select("id, role")
    .eq("id", userId)
    .maybeSingle();

  if (error) throw error;

  const role = (profile?.role || "").toLowerCase();
  if (!EMPLOYER_ROLES.has(role)) {
    return null;
  }

  return profile;
}

export async function GET() {
  try {
    const user = await getAuthenticatedUser();
    if (!user) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });

    const employer = await ensureEmployer(user.id);
    if (!employer) {
      return NextResponse.json({ error: "Only employers can manage saved talents." }, { status: 403 });
    }

    const { data, error } = await supabaseAdmin
      .from("saved_talents")
      .select("freelancer_id")
      .eq("employer_id", user.id)
      .order("created_at", { ascending: false });

    if (error) throw error;

    const freelancerIds = (data || [])
      .map((entry) => entry.freelancer_id)
      .filter((id): id is string => typeof id === "string" && id.length > 0);

    return NextResponse.json({ freelancerIds });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to fetch saved talents.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const user = await getAuthenticatedUser();
    if (!user) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });

    const employer = await ensureEmployer(user.id);
    if (!employer) {
      return NextResponse.json({ error: "Only employers can manage saved talents." }, { status: 403 });
    }

    const body = (await req.json()) as SavedTalentBody;
    const freelancerId = (body.freelancerId || "").trim();

    if (!freelancerId) {
      return NextResponse.json({ error: "Missing freelancer id." }, { status: 400 });
    }

    if (freelancerId === user.id) {
      return NextResponse.json({ error: "You cannot save yourself." }, { status: 400 });
    }

    const { data: freelancer, error: freelancerError } = await supabaseAdmin
      .from("profiles")
      .select("id, role")
      .eq("id", freelancerId)
      .maybeSingle();

    if (freelancerError) throw freelancerError;
    if (!freelancer) {
      return NextResponse.json({ error: "Freelancer profile not found." }, { status: 404 });
    }

    if ((freelancer.role || "").toLowerCase() !== "freelancer") {
      return NextResponse.json({ error: "Only freelancer profiles can be saved." }, { status: 400 });
    }

    const { error } = await supabaseAdmin
      .from("saved_talents")
      .upsert(
        {
          employer_id: user.id,
          freelancer_id: freelancerId,
        },
        { onConflict: "employer_id,freelancer_id" },
      );

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to save talent.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const user = await getAuthenticatedUser();
    if (!user) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });

    const employer = await ensureEmployer(user.id);
    if (!employer) {
      return NextResponse.json({ error: "Only employers can manage saved talents." }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const freelancerId = (searchParams.get("freelancerId") || "").trim();

    if (!freelancerId) {
      return NextResponse.json({ error: "Missing freelancer id." }, { status: 400 });
    }

    const { error } = await supabaseAdmin
      .from("saved_talents")
      .delete()
      .eq("employer_id", user.id)
      .eq("freelancer_id", freelancerId);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to remove saved talent.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

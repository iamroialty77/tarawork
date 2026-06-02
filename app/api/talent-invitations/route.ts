import { NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/supabase_server";
import { supabaseAdmin } from "@/lib/supabase_admin";

type InvitationBody = {
  freelancerId?: string;
  invitationId?: string;
  status?: "accepted" | "rejected" | "cancelled";
  interviewAt?: string | null;
  interviewLink?: string | null;
  message?: string;
};

const invitationSelect = `
  id,
  employer_id,
  freelancer_id,
  status,
  message,
  interview_at,
  interview_link,
  created_at,
  updated_at,
  freelancer:profiles!talent_invitations_freelancer_id_fkey(id, name, username, avatar_url, category),
  employer:profiles!talent_invitations_employer_id_fkey(id, name, username, avatar_url, companyName)
`;

export async function GET(req: Request) {
  try {
    const user = await getAuthenticatedUser();
    if (!user) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const scope = searchParams.get("scope") === "received" ? "received" : "sent";
    const column = scope === "received" ? "freelancer_id" : "employer_id";

    const { data, error } = await supabaseAdmin
      .from("talent_invitations")
      .select(invitationSelect)
      .eq(column, user.id)
      .order("created_at", { ascending: false });

    if (error) throw error;

    const invitations = data || [];
    const employerIds = [
      ...new Set(
        invitations
          .map((invitation) => invitation.employer_id)
          .filter((id): id is string => typeof id === "string" && id.length > 0),
      ),
    ];

    let latestJobsByEmployer: Record<string, { id: string; title: string }> = {};
    if (employerIds.length > 0) {
      const { data: jobs } = await supabaseAdmin
        .from("jobs")
        .select('id, title, employer_id, "createdAt"')
        .in("employer_id", employerIds)
        .eq("status", "live")
        .order("createdAt", { ascending: false });

      latestJobsByEmployer = (jobs || []).reduce(
        (acc: Record<string, { id: string; title: string }>, job: any) => {
          if (!acc[job.employer_id]) {
            acc[job.employer_id] = { id: job.id, title: job.title || "TaraWork Opportunity" };
          }
          return acc;
        },
        {},
      );
    }

    return NextResponse.json({
      invitations: invitations.map((invitation) => ({
        ...invitation,
        latestJob: latestJobsByEmployer[invitation.employer_id] || null,
      })),
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to fetch invitations.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const user = await getAuthenticatedUser();
    if (!user) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });

    const body = (await req.json()) as InvitationBody;
    const freelancerId = (body.freelancerId || "").trim();
    if (!freelancerId) {
      return NextResponse.json({ error: "Missing freelancer id." }, { status: 400 });
    }
    if (freelancerId === user.id) {
      return NextResponse.json({ error: "You cannot invite yourself." }, { status: 400 });
    }

    const [{ data: employer }, { data: freelancer }] = await Promise.all([
      supabaseAdmin
        .from("profiles")
        .select("id, name, role, companyName")
        .eq("id", user.id)
        .maybeSingle(),
      supabaseAdmin
        .from("profiles")
        .select("id, name, role")
        .eq("id", freelancerId)
        .maybeSingle(),
    ]);

    if (!freelancer) {
      return NextResponse.json({ error: "Freelancer profile not found." }, { status: 404 });
    }

    const employerRole = (employer?.role || "").toLowerCase();
    if (!["employer", "client", "hirer", "admin"].includes(employerRole)) {
      return NextResponse.json({ error: "Only employers can invite freelancers." }, { status: 403 });
    }

    const employerName = employer?.name?.trim() || user.email?.split("@")[0] || "Employer";
    const companyName = employer?.companyName?.trim() || "Independent Company";
    const message =
      body.message?.trim() ||
      `${employerName} from ${companyName} invited you to discuss an opportunity.`;

    const { data: invitation, error: inviteError } = await supabaseAdmin
      .from("talent_invitations")
      .upsert(
        {
          employer_id: user.id,
          freelancer_id: freelancerId,
          status: "pending",
          message,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "employer_id,freelancer_id" },
      )
      .select(invitationSelect)
      .single();

    if (inviteError) throw inviteError;

    await supabaseAdmin.from("notifications").insert([
      {
        user_id: freelancerId,
        title: "Official Talent Invitation",
        message,
        type: "invite",
        link: "/",
      },
    ]);

    return NextResponse.json({ invitation });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to send invitation.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const user = await getAuthenticatedUser();
    if (!user) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });

    const body = (await req.json()) as InvitationBody;
    const invitationId = (body.invitationId || "").trim();
    const nextStatus = body.status;
    const hasInterviewUpdate =
      Object.prototype.hasOwnProperty.call(body, "interviewAt") ||
      Object.prototype.hasOwnProperty.call(body, "interviewLink");
    if (!invitationId || (!nextStatus && !hasInterviewUpdate)) {
      return NextResponse.json({ error: "Missing invitation update." }, { status: 400 });
    }

    const { data: existing, error: existingError } = await supabaseAdmin
      .from("talent_invitations")
      .select("id, employer_id, freelancer_id")
      .eq("id", invitationId)
      .maybeSingle();

    if (existingError) throw existingError;
    if (!existing) return NextResponse.json({ error: "Invitation not found." }, { status: 404 });
    if (existing.employer_id !== user.id && existing.freelancer_id !== user.id) {
      return NextResponse.json({ error: "Forbidden." }, { status: 403 });
    }
    if (hasInterviewUpdate && existing.employer_id !== user.id) {
      return NextResponse.json({ error: "Only the employer can schedule interviews." }, { status: 403 });
    }

    const updatePayload: Record<string, unknown> = { updated_at: new Date().toISOString() };
    if (nextStatus) updatePayload.status = nextStatus;
    if (hasInterviewUpdate) {
      updatePayload.interview_at = body.interviewAt || null;
      updatePayload.interview_link = body.interviewLink?.trim() || null;
    }

    const { data, error } = await supabaseAdmin
      .from("talent_invitations")
      .update(updatePayload)
      .eq("id", invitationId)
      .select(invitationSelect)
      .single();

    if (error) throw error;

    if (nextStatus === "accepted") {
      await supabaseAdmin.from("notifications").insert([
        {
          user_id: existing.employer_id,
          title: "Invitation Accepted",
          message: "A freelancer accepted your invitation. You can now schedule an interview.",
          type: "success",
          link: "/",
        },
      ]);
    }

    if (hasInterviewUpdate) {
      await supabaseAdmin.from("notifications").insert([
        {
          user_id: existing.freelancer_id,
          title: "Interview Scheduled",
          message: "Your interview details have been updated by the employer.",
          type: "invite",
          link: "/",
        },
      ]);
    }

    return NextResponse.json({ invitation: data });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to update invitation.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

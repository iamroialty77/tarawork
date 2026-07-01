import { NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/supabase_server";
import { supabaseAdmin } from "@/lib/supabase_admin";
import postgres from "postgres";

type InvitationBody = {
  freelancerId?: string;
  invitationId?: string;
  status?: "accepted" | "rejected" | "cancelled";
  interviewAt?: string | null;
  interviewLink?: string | null;
  interviewRequestAt?: string | null;
  interviewRequestNote?: string | null;
  workStatus?: "completed";
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
  interview_request_at,
  interview_request_note,
  interview_request_status,
  work_status,
  completed_at,
  created_at,
  updated_at,
  freelancer:profiles!talent_invitations_freelancer_id_fkey(id, name, username, avatar_url, category),
  employer:profiles!talent_invitations_employer_id_fkey(id, name, username, avatar_url, companyName)
`;

const databaseUrl = process.env.DATABASE_URL || process.env.POSTGRES_URL;
const sql = databaseUrl
  ? postgres(databaseUrl, {
      max: 1,
      idle_timeout: 20,
      connect_timeout: 15,
    })
  : null;

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = (searchParams.get("userId") || "").trim();
    if (!userId) return NextResponse.json({ error: "Missing user id." }, { status: 400 });
    if (!sql) return NextResponse.json({ error: "Database connection is not configured." }, { status: 500 });

    const scope = searchParams.get("scope") === "received" ? "received" : "sent";
    const userColumnFilter =
      scope === "received"
        ? sql`ti.freelancer_id = ${userId}::uuid`
        : sql`ti.employer_id = ${userId}::uuid`;

    const invitations = await sql`
      select
        ti.id,
        ti.employer_id,
        ti.freelancer_id,
        ti.status,
        ti.message,
        ti.interview_at,
        ti.interview_link,
        ti.interview_request_at,
        ti.interview_request_note,
        ti.interview_request_status,
        ti.work_status,
        ti.completed_at,
        ti.created_at,
        ti.updated_at,
        jsonb_build_object(
          'id', freelancer.id,
          'name', freelancer.name,
          'username', freelancer.username,
          'avatar_url', freelancer.avatar_url,
          'category', freelancer.category
        ) as freelancer,
        jsonb_build_object(
          'id', employer.id,
          'name', employer.name,
          'username', employer.username,
          'avatar_url', employer.avatar_url,
          'companyName', employer."companyName"
        ) as employer,
        latest_job.latest_job as "latestJob"
      from public.talent_invitations ti
      left join public.profiles freelancer on freelancer.id = ti.freelancer_id
      left join public.profiles employer on employer.id = ti.employer_id
      left join lateral (
        select jsonb_build_object('id', jobs.id, 'title', coalesce(jobs.title, 'TaraWork Opportunity')) as latest_job
        from public.jobs jobs
        where jobs.employer_id = ti.employer_id
          and jobs.status = 'live'
        order by jobs."createdAt" desc
        limit 1
      ) latest_job on true
      where ${userColumnFilter}
      order by ti.created_at desc
    `;

    return NextResponse.json({
      invitations,
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
    const hasInterviewRequest =
      Object.prototype.hasOwnProperty.call(body, "interviewRequestAt") ||
      Object.prototype.hasOwnProperty.call(body, "interviewRequestNote");
    const hasWorkStatusUpdate = body.workStatus === "completed";
    if (!invitationId || (!nextStatus && !hasInterviewUpdate && !hasInterviewRequest && !hasWorkStatusUpdate)) {
      return NextResponse.json({ error: "Missing invitation update." }, { status: 400 });
    }

    const { data: existing, error: existingError } = await supabaseAdmin
      .from("talent_invitations")
      .select("id, employer_id, freelancer_id, status")
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
    if (hasInterviewRequest && existing.freelancer_id !== user.id) {
      return NextResponse.json({ error: "Only the freelancer can request another interview date." }, { status: 403 });
    }
    if (hasWorkStatusUpdate && existing.employer_id !== user.id) {
      return NextResponse.json({ error: "Only the employer can mark work as completed." }, { status: 403 });
    }
    if (hasWorkStatusUpdate && existing.status !== "accepted") {
      return NextResponse.json({ error: "The freelancer must accept the invitation before work can be completed." }, { status: 403 });
    }

    const updatePayload: Record<string, unknown> = { updated_at: new Date().toISOString() };
    if (nextStatus) updatePayload.status = nextStatus;
    if (hasInterviewUpdate) {
      updatePayload.interview_at = body.interviewAt || null;
      updatePayload.interview_link = body.interviewLink?.trim() || null;
      updatePayload.interview_request_status = "resolved";
    }
    if (hasInterviewRequest) {
      updatePayload.interview_request_at = body.interviewRequestAt || null;
      updatePayload.interview_request_note = body.interviewRequestNote?.trim() || null;
      updatePayload.interview_request_status = "pending";
    }
    if (hasWorkStatusUpdate) {
      updatePayload.work_status = "completed";
      updatePayload.completed_at = new Date().toISOString();
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

    if (hasInterviewRequest) {
      await supabaseAdmin.from("notifications").insert([
        {
          user_id: existing.employer_id,
          title: "Interview Reschedule Request",
          message: "A freelancer requested another interview date. Review it in your Talent Invitations table.",
          type: "warning",
          link: "/",
        },
      ]);
    }

    if (hasWorkStatusUpdate) {
      await supabaseAdmin.from("notifications").insert([
        {
          user_id: existing.freelancer_id,
          title: "Work Marked Completed",
          message: "An employer marked your accepted engagement as completed. Feedback can now be requested.",
          type: "success",
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

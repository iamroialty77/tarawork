import { NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/supabase_server";
import { supabaseAdmin } from "@/lib/supabase_admin";

type ApproveApplicationBody = {
  applicationId?: string;
  freelancerId?: string;
  jobId?: string;
  jobTitle?: string;
  budget?: number;
};

export async function POST(req: Request) {
  try {
    const user = await getAuthenticatedUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const body = (await req.json()) as ApproveApplicationBody;
    const applicationId = (body.applicationId || "").trim();
    const jobId = (body.jobId || "").trim();
    const fallbackFreelancerId = (body.freelancerId || "").trim();
    const jobTitle = (body.jobTitle || "").trim() || "Project";
    if (!applicationId || !jobId) {
      return NextResponse.json({ error: "Missing applicationId or jobId." }, { status: 400 });
    }

    const { data: jobData, error: jobError } = await supabaseAdmin
      .from("jobs")
      .select("id, employer_id")
      .eq("id", jobId)
      .maybeSingle();

    if (jobError) {
      throw jobError;
    }

    if (!jobData) {
      return NextResponse.json({ error: "Job not found." }, { status: 404 });
    }

    if (jobData.employer_id !== user.id) {
      return NextResponse.json({ error: "Forbidden: you do not own this job." }, { status: 403 });
    }

    const { data: appData, error: appFetchError } = await supabaseAdmin
      .from("applications")
      .select("id, job_id, freelancer_id, status")
      .eq("id", applicationId)
      .maybeSingle();

    if (appFetchError) {
      throw appFetchError;
    }

    if (!appData || appData.job_id !== jobId) {
      return NextResponse.json({ error: "Application not found for this job." }, { status: 404 });
    }

    if (appData.status === "hired") {
      return NextResponse.json({ error: "Application is already approved." }, { status: 409 });
    }

    const resolvedFreelancerId = appData.freelancer_id || fallbackFreelancerId;
    if (!resolvedFreelancerId) {
      return NextResponse.json({ error: "Missing freelancer id." }, { status: 400 });
    }

    const { error: appUpdateError } = await supabaseAdmin
      .from("applications")
      .update({ status: "hired" })
      .eq("id", applicationId);

    if (appUpdateError) {
      throw appUpdateError;
    }

    const { error: notifError } = await supabaseAdmin.from("notifications").insert([
      {
        user_id: resolvedFreelancerId,
        title: "Project Approved!",
        message: `Congratulations! You have been approved for the project: ${jobTitle}.`,
        type: "success",
        link: "/dashboard",
      },
    ]);

    if (notifError) {
      throw notifError;
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to approve application.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

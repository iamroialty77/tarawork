import { NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/supabase_server";
import { supabaseAdmin } from "@/lib/supabase_admin";

type CloseJobBody = {
  jobId?: string;
};

export async function POST(req: Request) {
  try {
    const user = await getAuthenticatedUser();
    if (!user) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });

    const body = (await req.json()) as CloseJobBody;
    const jobId = (body.jobId || "").trim();
    if (!jobId) return NextResponse.json({ error: "Missing job id." }, { status: 400 });

    const { data: job, error: jobError } = await supabaseAdmin
      .from("jobs")
      .select("id, employer_id, status")
      .eq("id", jobId)
      .maybeSingle();

    if (jobError) throw jobError;
    if (!job) return NextResponse.json({ error: "Job not found." }, { status: 404 });
    if (job.employer_id !== user.id) {
      return NextResponse.json({ error: "Forbidden: you do not own this job." }, { status: 403 });
    }

    const { error } = await supabaseAdmin
      .from("jobs")
      .update({ status: "closed" })
      .eq("id", jobId);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to close job.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

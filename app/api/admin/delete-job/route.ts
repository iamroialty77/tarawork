import { supabaseAdmin } from "@/lib/supabase_admin";
import { requireAdminUser } from "@/lib/authz";
import { assertNotLikelyBot, assertSameOrigin, getClientIp, isSafeJobId, rateLimit } from "@/lib/security";
import { NextRequest, NextResponse } from "next/server";

const isIgnorableCleanupError = (error: any) => {
  const code = error?.code;
  const message = String(error?.message || "").toLowerCase();
  return (
    code === "42P01" ||
    code === "42703" ||
    code === "PGRST205" ||
    message.includes("does not exist") ||
    message.includes("could not find")
  );
};

export async function POST(req: NextRequest) {
  try {
    const originError = assertSameOrigin(req);
    if (originError) return originError;

    const botError = assertNotLikelyBot(req);
    if (botError) return botError;

    const admin = await requireAdminUser();
    if (admin.error) {
      return NextResponse.json({ error: admin.error }, { status: admin.status });
    }

    const limited = rateLimit({
      key: `admin:delete-job:${admin.user?.id || getClientIp(req)}`,
      limit: 20,
      windowMs: 60_000,
    });
    if (limited) return limited;

    const { jobId: rawJobId } = await req.json();
    const jobId = typeof rawJobId === "string" ? rawJobId.trim() : "";

    if (!jobId) {
      return NextResponse.json({ error: "Job ID is required." }, { status: 400 });
    }
    if (!isSafeJobId(jobId)) {
      return NextResponse.json({ error: "Invalid job ID format." }, { status: 400 });
    }

    const { error: applicationsError } = await supabaseAdmin
      .from("applications")
      .delete()
      .eq("job_id", jobId);

    if (applicationsError && !isIgnorableCleanupError(applicationsError)) {
      return NextResponse.json(
        { error: `Unable to remove job applications: ${applicationsError.message}` },
        { status: 500 },
      );
    }

    const { error: escrowsError } = await supabaseAdmin
      .from("escrows")
      .update({ job_id: null })
      .eq("job_id", jobId);

    if (escrowsError && !isIgnorableCleanupError(escrowsError)) {
      return NextResponse.json(
        { error: `Unable to detach job financial records: ${escrowsError.message}` },
        { status: 500 },
      );
    }

    const { data: deletedJobs, error } = await supabaseAdmin
      .from("jobs")
      .delete()
      .eq("id", jobId)
      .select("id");

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (!deletedJobs || deletedJobs.length === 0) {
      return NextResponse.json({
        success: true,
        alreadyDeleted: true,
        message: "Job posting was already deleted.",
      });
    }

    return NextResponse.json({
      success: true,
      message: "Job posting deleted.",
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Unable to delete job posting." },
      { status: 500 },
    );
  }
}

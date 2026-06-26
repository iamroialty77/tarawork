import { supabaseAdmin } from "@/lib/supabase_admin";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { jobId } = await req.json();

    if (!jobId || typeof jobId !== "string") {
      return NextResponse.json({ error: "Job ID is required." }, { status: 400 });
    }

    await supabaseAdmin.from("applications").delete().eq("job_id", jobId);
    await supabaseAdmin.from("escrows").delete().eq("job_id", jobId);

    const { error } = await supabaseAdmin
      .from("jobs")
      .delete()
      .eq("id", jobId);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
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

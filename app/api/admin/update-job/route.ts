import { NextRequest, NextResponse } from "next/server";
import { requireAdminUser } from "@/lib/authz";
import { assertSameOrigin, getClientIp, isSafeJobId, rateLimit } from "@/lib/security";
import { supabaseAdmin } from "@/lib/supabase_admin";

const cleanLine = (value: unknown, limit: number) => String(value || "").replace(/\s+/g, " ").trim().slice(0, limit);
const allowedStatuses = new Set(["live", "draft", "flagged", "closed"]);
const allowedCurrencies = new Set(["PHP", "USD", "EUR", "GBP", "AUD", "CAD", "SGD"]);

export async function POST(req: NextRequest) {
  const originError = assertSameOrigin(req);
  if (originError) return originError;

  const admin = await requireAdminUser();
  if (admin.error) return NextResponse.json({ error: admin.error }, { status: admin.status });

  const limited = rateLimit({
    key: `admin:update-job:${admin.user?.id || getClientIp(req)}`,
    limit: 60,
    windowMs: 60 * 60 * 1000,
  });
  if (limited) return limited;

  try {
    const body = await req.json();
    const jobId = cleanLine(body.jobId, 80);
    const title = cleanLine(body.title, 140);
    const description = String(body.description || "").trim().slice(0, 12000);
    const category = cleanLine(body.category, 100) || "General";
    const company = cleanLine(body.company, 140) || "Anonymous Employer";
    const jobType = cleanLine(body.jobType, 60) || "Contract";
    const duration = cleanLine(body.duration, 100) || "1-3 months";
    const paymentMethod = cleanLine(body.paymentMethod, 60) || "Flat-Rate";
    const status = cleanLine(body.status, 30) || "live";
    const currencyCode = cleanLine(body.currencyCode, 3).toUpperCase() || "PHP";
    const budget = Number(body.budget);
    const deadline = cleanLine(body.deadline, 40) || null;
    const skills = Array.isArray(body.skills)
      ? body.skills.map((skill: unknown) => cleanLine(skill, 60)).filter(Boolean).slice(0, 30)
      : [];

    if (!jobId || !isSafeJobId(jobId)) return NextResponse.json({ error: "Invalid job ID." }, { status: 400 });
    if (!title || !description) return NextResponse.json({ error: "Title and description are required." }, { status: 400 });
    if (!allowedStatuses.has(status)) return NextResponse.json({ error: "Invalid job status." }, { status: 400 });
    if (!allowedCurrencies.has(currencyCode)) return NextResponse.json({ error: "Invalid currency." }, { status: 400 });
    if (!Number.isFinite(budget) || budget < 0 || budget > 1_000_000_000) return NextResponse.json({ error: "Invalid budget." }, { status: 400 });

    const rate = `${currencyCode} ${budget.toLocaleString("en-US")}`;
    const updatePayload = {
      title,
      description,
      category,
      company,
      skills,
      jobType,
      duration,
      paymentMethod,
      budget,
      currency_code: currencyCode,
      rate,
      deadline,
      status,
    };
    let updateResult = await supabaseAdmin
      .from("jobs")
      .update(updatePayload)
      .eq("id", jobId)
      .select("*")
      .maybeSingle();
    if (updateResult.error && /currency_code/i.test(updateResult.error.message || "")) {
      const { currency_code, ...legacyPayload } = updatePayload;
      void currency_code;
      updateResult = await supabaseAdmin.from("jobs").update(legacyPayload).eq("id", jobId).select("*").maybeSingle();
    }
    const { data, error } = updateResult;
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    if (!data) return NextResponse.json({ error: "Job post was not found." }, { status: 404 });

    await supabaseAdmin.from("admin_audit_logs").insert([{
      admin_id: admin.user?.id,
      action: "update_job_post",
      target_type: "job",
      target_id: jobId,
      details: { title, status, category, budget, currencyCode },
    }]);

    return NextResponse.json({ success: true, job: data });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unable to update job post." }, { status: 500 });
  }
}

import Link from "next/link";
import { notFound } from "next/navigation";
import { Briefcase, Clock, DollarSign, ExternalLink, MapPin } from "lucide-react";
import { extractJobIdFromShareToken } from "../../../lib/jobShare";
import { supabaseAdmin } from "../../../lib/supabase_admin";
import { formatRelativeTime } from "../../../lib/utils";
import { Job } from "../../../types";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const getPublicJob = async (shareId: string): Promise<(Job & { hirerReviewLabel?: string }) | null> => {
  const jobId = extractJobIdFromShareToken(shareId);
  if (!jobId) return null;

  const { data, error } = await supabaseAdmin
    .from("jobs")
    .select("*")
    .eq("id", jobId)
    .maybeSingle();

  if (error || !data) return null;

  let hirerReviewLabel = "No hirer reviews yet";
  if (data.employer_id) {
    const { data: employerProfile } = await supabaseAdmin
      .from("profiles")
      .select("aiInsights")
      .eq("id", data.employer_id)
      .maybeSingle();

    const aiInsights = employerProfile?.aiInsights as Record<string, unknown> | undefined;
    const reviewScore = typeof aiInsights?.hirerReviewScore === "number" ? aiInsights.hirerReviewScore : null;
    const reviewCount = typeof aiInsights?.hirerReviewCount === "number" ? aiInsights.hirerReviewCount : null;
    if (reviewScore !== null) {
      hirerReviewLabel = `${reviewScore.toFixed(1)}/5 hirer rating${reviewCount ? ` (${reviewCount} reviews)` : ""}`;
    }
  }

  return {
    ...data,
    skills: Array.isArray(data.skills) ? data.skills : [],
    energyRequirement: data.energy_requirement || "Balanced",
    paymentMethod: data.paymentMethod || "Flat-Rate",
    jobType: data.jobType || "Contract",
    hirerReviewLabel,
  };
};

export default async function PublicJobPage({
  params,
}: {
  params: Promise<{ shareId: string }>;
}) {
  const { shareId } = await params;
  const job = await getPublicJob(shareId);

  if (!job) {
    notFound();
  }

  const applyUrl = `/?apply=${encodeURIComponent(job.id)}`;

  return (
    <main className="min-h-screen bg-slate-50 py-10 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden">
          <div className="h-2 bg-slate-900" />
          <div className="p-6 sm:p-10 space-y-8">
            <header className="space-y-3">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-indigo-600">TaraWork Opportunity</p>
              <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">{job.title}</h1>
              <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                Shared via TaraWork. Discover verified remote opportunities and apply securely through the platform.
              </p>
            </header>

            <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3">
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Compensation</p>
                <p className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-emerald-600" />
                  {job.rate}
                </p>
              </div>
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3">
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Duration</p>
                <p className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-slate-600" />
                  {job.duration}
                </p>
              </div>
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3">
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Engagement</p>
                <p className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-slate-600" />
                  {job.jobType || "Contract"}
                </p>
              </div>
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3">
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Location</p>
                <p className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-slate-600" />
                  Remote
                </p>
              </div>
            </section>

            <section className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Hirer Reviews</p>
              <p className="text-sm font-bold text-slate-900">{job.hirerReviewLabel}</p>
            </section>

            <section>
              <h2 className="text-sm font-bold uppercase tracking-[0.18em] text-slate-500 mb-3">Job Description</h2>
              <p className="text-slate-700 leading-relaxed whitespace-pre-line">{job.description}</p>
            </section>

            <section>
              <h2 className="text-sm font-bold uppercase tracking-[0.18em] text-slate-500 mb-3">Required Skills</h2>
              <div className="flex flex-wrap gap-2">
                {job.skills.map((skill) => (
                  <span
                    key={skill}
                    className="px-3 py-1.5 text-[11px] font-bold uppercase tracking-widest rounded-lg border border-slate-200 bg-white text-slate-700"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </section>

            <footer className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <p className="text-xs font-semibold text-slate-500">
                Posted {formatRelativeTime(job.createdAt)} by Anonymous Hirer
              </p>
              <div className="flex gap-3">
                <Link
                  href="/"
                  className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 text-xs font-bold uppercase tracking-wider hover:bg-slate-50 transition-colors"
                >
                  Explore TaraWork
                </Link>
                <Link
                  href={applyUrl}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-bold uppercase tracking-wider hover:bg-black transition-colors"
                >
                  Apply now
                  <ExternalLink className="w-3.5 h-3.5" />
                </Link>
              </div>
            </footer>
          </div>
        </div>
      </div>
    </main>
  );
}

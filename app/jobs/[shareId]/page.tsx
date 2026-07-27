import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Briefcase, Clock, DollarSign, MapPin } from "lucide-react";
import { extractJobIdFromShareToken } from "../../../lib/jobShare";
import { absoluteUrl, siteName, truncateSeoText } from "../../../lib/seo";
import { supabaseAdmin } from "../../../lib/supabase_admin";
import { formatRelativeTime } from "../../../lib/utils";
import { Job } from "../../../types";
import PublicJobApplyButton from "../../../components/PublicJobApplyButton";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const getPublicJob = async (shareId: string): Promise<(Job & { hirerReviewLabel?: string; hiringOrganizationName?: string }) | null> => {
  const jobId = extractJobIdFromShareToken(shareId);
  if (!jobId) return null;

  const { data, error } = await supabaseAdmin
    .from("jobs")
    .select("*")
    .eq("id", jobId)
    .eq("status", "live")
    .maybeSingle();

  if (error || !data) return null;

  let hirerReviewLabel = "No hirer reviews yet";
  let hiringOrganizationName = "Confidential employer";
  if (data.employer_id) {
    const { data: employerProfile } = await supabaseAdmin
      .from("profiles")
      .select("aiInsights,name,companyName")
      .eq("id", data.employer_id)
      .maybeSingle();

    hiringOrganizationName = employerProfile?.companyName || employerProfile?.name || hiringOrganizationName;
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
    hiringOrganizationName,
  };
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ shareId: string }>;
}): Promise<Metadata> {
  const { shareId } = await params;
  const job = await getPublicJob(shareId);
  const canonical = absoluteUrl(`/jobs/${shareId}`);

  if (!job) {
    return {
      title: "Job Not Found",
      robots: { index: false, follow: false },
    };
  }

  const title = `${job.title} Remote Job`;
  const description = truncateSeoText(
    `${job.title} on ${siteName}. ${job.rate ? `${job.rate}. ` : ""}${job.description}`,
  );

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      type: "article",
      url: canonical,
      siteName,
      title,
      description,
      images: ["/tarawork-icon.png"],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/tarawork-icon.png"],
    },
  };
}

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

  const nextPath = `/jobs/${shareId}`;
  const canonical = absoluteUrl(nextPath);
  const employmentType = /full[\s-]?time/i.test(job.jobType || "")
    ? "FULL_TIME"
    : /part[\s-]?time/i.test(job.jobType || "")
      ? "PART_TIME"
      : /intern/i.test(job.jobType || "")
        ? "INTERN"
        : /temporary/i.test(job.jobType || "")
          ? "TEMPORARY"
          : "CONTRACTOR";
  const createdAt = new Date(job.createdAt);
  const datePosted = Number.isNaN(createdAt.getTime()) ? new Date().toISOString() : createdAt.toISOString();
  const jobPostingStructuredData = {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    title: job.title,
    description: job.description,
    identifier: { "@type": "PropertyValue", name: siteName, value: job.id },
    datePosted,
    employmentType,
    directApply: true,
    hiringOrganization: {
      "@type": "Organization",
      name: job.hiringOrganizationName,
      sameAs: absoluteUrl("/"),
      logo: absoluteUrl("/tarawork-logo.png"),
    },
    jobLocationType: "TELECOMMUTE",
    applicantLocationRequirements: { "@type": "Country", name: "Philippines" },
    skills: job.skills.join(", "),
    url: canonical,
  };
  const breadcrumbStructuredData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: absoluteUrl("/") },
      { "@type": "ListItem", position: 2, name: "Remote jobs", item: absoluteUrl("/remote-jobs-philippines") },
      { "@type": "ListItem", position: 3, name: job.title, item: canonical },
    ],
  };

  return (
    <main className="min-h-screen bg-slate-50 py-10 px-4">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jobPostingStructuredData).replace(/</g, "\\u003c") }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbStructuredData).replace(/</g, "\\u003c") }}
      />
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
              <PublicJobApplyButton job={job} nextPath={nextPath} />
            </footer>
          </div>
        </div>
      </div>
    </main>
  );
}

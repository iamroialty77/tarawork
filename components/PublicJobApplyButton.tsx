"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ExternalLink } from "lucide-react";
import { supabase } from "../lib/supabase";
import type { Job, UserProfile } from "../types";
import { trackConversion } from "../lib/analytics";

type PublicJobApplyButtonProps = {
  job: Job;
  nextPath: string;
};

const buildSuggestedCoverLetter = (
  job: Job,
  freelancer: Pick<UserProfile, "name" | "skills">,
  savedDefault: string,
) => {
  if (savedDefault.trim().length > 0) return savedDefault.trim();

  const firstName = (freelancer.name || "there").split(" ")[0];
  const topSkills = (freelancer.skills || []).filter(Boolean).slice(0, 3).join(", ");
  const skillsLine = topSkills ? `May experience ako sa ${topSkills}. ` : "";

  return `Hi, I'm ${firstName}. I'm interested in applying for the ${job.title} role. ${skillsLine}I'd be glad to discuss how I can help with this project.`;
};

export default function PublicJobApplyButton({ job, nextPath }: PublicJobApplyButtonProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [applicationStatus, setApplicationStatus] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [coverLetter, setCoverLetter] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [missingColumns, setMissingColumns] = useState<string[]>([]);

  const applicationProfile = useMemo(
    () => profile?.aiInsights?.applicationProfile || {},
    [profile],
  );

  useEffect(() => {
    let mounted = true;

    const loadState = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (!mounted) return;

        if (!session?.user) {
          setUserId(null);
          setProfile(null);
          setApplicationStatus(null);
          setLoading(false);
          return;
        }

        setUserId(session.user.id);

        const { data: profileData } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", session.user.id)
          .maybeSingle();

        if (!mounted) return;

        if (profileData) {
          setProfile({
            ...profileData,
            role: profileData.role === "admin" ? "admin" : profileData.role === "employer" || profileData.role === "client" ? "employer" : "freelancer",
            skills: Array.isArray(profileData.skills) ? profileData.skills : [],
            bio: profileData.bio || "",
            hourlyRate: profileData.hourlyRate || "$0",
            category: profileData.category || "General",
            name: profileData.name || session.user.email?.split("@")[0] || "User",
          });
        } else {
          setProfile({
            id: session.user.id,
            name: session.user.user_metadata?.full_name || session.user.email?.split("@")[0] || "User",
            role: session.user.user_metadata?.role === "employer" ? "employer" : "freelancer",
            category: "General",
            skills: [],
            hourlyRate: "$0",
            bio: "",
            aiInsights: {
              gapAnalysis: [],
              compatibilityScore: 0,
              cultureMatch: [],
              applicationProfile: {},
            },
          });
        }

        const { data: existingApplication } = await supabase
          .from("applications")
          .select("status")
          .eq("job_id", job.id)
          .eq("freelancer_id", session.user.id)
          .maybeSingle();

        if (!mounted) return;
        setApplicationStatus(existingApplication?.status || null);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    void loadState();
    return () => {
      mounted = false;
    };
  }, [job.id]);

  const openModal = () => {
    if (!profile) return;
    const savedDefault = String(applicationProfile.coverLetter || "");
    setCoverLetter(buildSuggestedCoverLetter(job, profile, savedDefault));
    setError(null);
    setMessage(null);
    setShowModal(true);
  };

  const closeModal = () => {
    if (submitting) return;
    setShowModal(false);
  };

  const handlePrimaryAction = () => {
    if (loading) return;
    if (!userId) {
      router.push(`/auth?next=${encodeURIComponent(nextPath)}`);
      return;
    }
    if (profile?.role !== "freelancer") {
      setError("Only freelancer accounts can apply for this job post.");
      return;
    }
    if (applicationStatus) return;
    openModal();
  };

  const submitApplication = async () => {
    if (!userId || !profile) return;

    setSubmitting(true);
    setError(null);

    try {
      const insertData: Record<string, unknown> = {
        job_id: job.id,
        freelancer_id: userId,
        status: "pending",
      };

      const resumeUrl = String(applicationProfile.resumeUrl || "").trim();
      const portfolioUrl = String(applicationProfile.portfolioUrl || "").trim();
      const interviewUrl = String(applicationProfile.interviewUrl || "").trim();
      const resolvedCoverLetter = coverLetter.trim();

      if (!missingColumns.includes("seeker_id")) insertData.seeker_id = userId;
      if (resumeUrl && !missingColumns.includes("resume_url")) insertData.resume_url = resumeUrl;
      if (portfolioUrl && !missingColumns.includes("portfolio_url")) insertData.portfolio_url = portfolioUrl;
      if (resolvedCoverLetter && !missingColumns.includes("cover_letter")) insertData.cover_letter = resolvedCoverLetter;
      if (interviewUrl && !missingColumns.includes("interview_url")) insertData.interview_url = interviewUrl;

      const { error: insertError } = await supabase.from("applications").insert([insertData]);

      if (insertError) {
        if (insertError.code === "23505") {
          setApplicationStatus("pending");
          setMessage("You already have an existing application for this job.");
          setShowModal(false);
          return;
        }

        if (insertError.code === "PGRST204" || insertError.message?.includes("column")) {
          if (insertError.message?.includes("portfolio_url")) setMissingColumns((prev) => [...new Set([...prev, "portfolio_url"])]);
          if (insertError.message?.includes("interview_url")) setMissingColumns((prev) => [...new Set([...prev, "interview_url"])]);
          if (insertError.message?.includes("resume_url")) setMissingColumns((prev) => [...new Set([...prev, "resume_url"])]);
          if (insertError.message?.includes("seeker_id")) setMissingColumns((prev) => [...new Set([...prev, "seeker_id"])]);

          const minimalData: Record<string, unknown> = {
            job_id: job.id,
            freelancer_id: userId,
            status: "pending",
          };

          if (!insertError.message?.includes("seeker_id")) minimalData.seeker_id = userId;
          if (resolvedCoverLetter && !insertError.message?.includes("cover_letter")) {
            minimalData.cover_letter = resolvedCoverLetter;
          }

          const { error: retryError } = await supabase.from("applications").insert([minimalData]);
          if (retryError) throw retryError;

          trackConversion("job_apply", { job_id: job.id, job_title: job.title });
          setApplicationStatus("pending");
          setMessage("Your application was submitted. Some optional fields were skipped because of the current database schema.");
          setShowModal(false);
          return;
        }

        throw insertError;
      }

      trackConversion("job_apply", { job_id: job.id, job_title: job.title });
      setApplicationStatus("pending");
      setMessage("Your application was submitted successfully. The hirer can now review it.");
      setShowModal(false);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Your application could not be submitted.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <div className="flex gap-3">
        <Link
          href="/?tab=jobs"
          className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 text-xs font-bold uppercase tracking-wider hover:bg-slate-50 transition-colors"
        >
          Explore TaraWork
        </Link>
        <button
          type="button"
          onClick={handlePrimaryAction}
          disabled={loading || !!applicationStatus}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-bold uppercase tracking-wider hover:bg-black transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {loading ? (
            "Loading..."
          ) : applicationStatus ? (
            applicationStatus === "hired" ? "Hired" : "Pending"
          ) : userId ? (
            <>
              Apply now
              <ExternalLink className="w-3.5 h-3.5" />
            </>
          ) : (
            <>
              Login to Apply
              <ExternalLink className="w-3.5 h-3.5" />
            </>
          )}
        </button>
      </div>

      {message && (
        <div className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm font-semibold text-emerald-800">
          {message}
        </div>
      )}

      {error && !showModal && (
        <div className="mt-4 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm font-semibold text-rose-700">
          {error}
        </div>
      )}

      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-[95] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeModal}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 16 }}
              className="relative w-full max-w-2xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl"
            >
              <div className="border-b border-slate-100 p-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-600">Review Application</p>
                    <h3 className="mt-1 text-xl font-black text-slate-900">{job.title}</h3>
                    <p className="mt-1 text-sm text-slate-500">
                      Customize your cover letter first, then confirm the submission.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={closeModal}
                    className="rounded-xl border border-slate-200 px-3 py-1.5 text-xs font-bold text-slate-600 hover:bg-slate-50"
                  >
                    Close
                  </button>
                </div>
              </div>

              <div className="space-y-5 p-6">
                <div className="grid gap-3 sm:grid-cols-3">
                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                    <p className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-400">Rate</p>
                    <p className="mt-1 text-sm font-bold text-slate-900">{job.rate}</p>
                  </div>
                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                    <p className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-400">Duration</p>
                    <p className="mt-1 text-sm font-bold text-slate-900">{job.duration}</p>
                  </div>
                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                    <p className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-400">Type</p>
                    <p className="mt-1 text-sm font-bold text-slate-900">{job.jobType || "Contract"}</p>
                  </div>
                </div>

                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-400">Required Skills</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {job.skills.length > 0 ? (
                      job.skills.map((skill) => (
                        <span
                          key={skill}
                          className="rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-slate-700"
                        >
                          {skill}
                        </span>
                      ))
                    ) : (
                      <span className="text-sm text-slate-500">No listed skills.</span>
                    )}
                  </div>
                </div>

                <div>
                  <div className="mb-2 flex items-center justify-between gap-3">
                    <label className="block text-[11px] font-bold uppercase tracking-[0.18em] text-slate-500">
                      Cover Letter
                    </label>
                    <button
                      type="button"
                      onClick={() =>
                        setCoverLetter(
                          buildSuggestedCoverLetter(
                            job,
                            profile || { name: "User", skills: [] },
                            String(applicationProfile.coverLetter || ""),
                          ),
                        )
                      }
                      className="text-[11px] font-bold text-indigo-600 hover:text-indigo-700"
                    >
                      Reset Draft
                    </button>
                  </div>
                  <textarea
                    rows={8}
                    value={coverLetter}
                    onChange={(e) => setCoverLetter(e.target.value)}
                    placeholder="Tailor your note here to explain why you are a strong fit for this job."
                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 transition-all placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-100"
                  />
                </div>

                {error && (
                  <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm font-semibold text-rose-700">
                    {error}
                  </div>
                )}

                <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                  <button
                    type="button"
                    onClick={closeModal}
                    disabled={submitting}
                    className="rounded-xl border border-slate-200 px-4 py-3 text-xs font-bold uppercase tracking-[0.18em] text-slate-600 hover:bg-slate-50 disabled:opacity-60"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={() => void submitApplication()}
                    disabled={submitting}
                    className="rounded-xl bg-slate-900 px-5 py-3 text-xs font-black uppercase tracking-[0.18em] text-white hover:bg-black disabled:opacity-60"
                  >
                    {submitting ? "Submitting..." : "Confirm and Submit"}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}

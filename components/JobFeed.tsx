"use client";

import { useState, useMemo, useEffect } from "react";
import type { CurrencyCode, Job, FreelancerProfile, PaymentMethod, JobDuration, FreelancerCategory, SmartMatchResult, SmartMatchResponse } from "../types";
import JobCard from "./JobCard";
import AIAgent from "./AIAgent";

import { Search, Filter, Sparkles, Loader2 } from "lucide-react";
import { energyScore } from "../lib/utils";
import { heuristicSmartMatchMany } from "../lib/smartMatch";
import { FALLBACK_WEEKLY_USD_RATES, convertAmount, formatCurrencyAmount, isCurrencyCode } from "@/lib/currency";

interface JobFeedProps {
  jobs: Job[];
  profile: FreelancerProfile;
  onApply?: (jobId: string) => void;
  appliedJobs?: Record<string, string>;
}

interface ForexRatesResponse {
  base: "USD";
  rates: Record<CurrencyCode, number>;
}

const smartMatchErrorMessage = (errorCode?: string, fallbackError?: string) => {
  switch (errorCode) {
    case "missing_key":
      return "Gemini API key missing. Add GEMINI_API_KEY in .env.local.";
    case "invalid_key":
      return "Invalid Gemini API key. Generate a new key and restart app.";
    case "quota_exceeded":
      return "Gemini free quota reached. Using local smart matching.";
    case "provider_unavailable":
      return "Gemini is temporarily unavailable. Using local smart matching.";
    case "network_error":
      return "Network issue connecting to Gemini. Using local smart matching.";
    case "missing_user_id":
      return "User session missing. Please refresh and sign in again.";
    default:
      return fallbackError || "Gemini unavailable, using local smart matching.";
  }
};

export default function JobFeed({ jobs, profile, onApply, appliedJobs = {} }: JobFeedProps) {
  const JOBS_PER_PAGE = 8;
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [showAIAgent, setShowAIAgent] = useState(false);
  const [selectedJobForAI, setSelectedJobForAI] = useState<Job | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);
  const [paymentFilter, setPaymentFilter] = useState<PaymentMethod | "All">("All");
  const [durationFilter, setDurationFilter] = useState<JobDuration | "All">("All");
  const [categoryFilter, setCategoryFilter] = useState<FreelancerCategory | "All">("All");
  const [savedOnlyFilter, setSavedOnlyFilter] = useState(false);
  const [appliedOnlyFilter, setAppliedOnlyFilter] = useState(false);
  const [verifiedOnlyFilter, setVerifiedOnlyFilter] = useState(false);
  const [minSalaryFilter, setMinSalaryFilter] = useState("");
  const [maxSalaryFilter, setMaxSalaryFilter] = useState("");
  const [savedJobIds, setSavedJobIds] = useState<string[]>([]);
  const [useSmartMatching, setUseSmartMatching] = useState(false);
  const [smartMatches, setSmartMatches] = useState<Record<string, SmartMatchResult>>({});
  const [smartMatchLoading, setSmartMatchLoading] = useState(false);
  const [smartMatchError, setSmartMatchError] = useState<string | null>(null);
  const [ratesByUsd, setRatesByUsd] = useState<Record<CurrencyCode, number>>(FALLBACK_WEEKLY_USD_RATES);

  const preferredCurrency: CurrencyCode = isCurrencyCode(profile.preferredCurrency)
    ? profile.preferredCurrency
    : isCurrencyCode(profile.aiInsights?.preferredCurrency)
      ? profile.aiInsights.preferredCurrency
      : "PHP";
  const hasCompleteApplicationProfile = Boolean(
    profile.name?.trim() &&
    profile.bio?.trim() &&
    profile.username?.trim() &&
    profile.hourlyRate?.trim() &&
    (profile.skills?.length ?? 0) > 0 &&
    (profile.portfolio?.length ?? 0) > 0,
  );

  useEffect(() => {
    let mounted = true;

    const loadForexRates = async () => {
      try {
        const response = await fetch("/api/forex/rates?base=USD", { cache: "no-store" });
        const payload = (await response.json()) as ForexRatesResponse;
        if (!response.ok || !payload?.rates) return;
        if (mounted) setRatesByUsd(payload.rates);
      } catch {
        // Keep weekly fallback rates if API is unavailable.
      }
    };

    void loadForexRates();
    return () => {
      mounted = false;
    };
  }, []);

  const handleSmartMatchingToggle = (checked: boolean) => {
    setUseSmartMatching(checked);
    if (checked) {
      setSmartMatchLoading(true);
      setSmartMatchError(null);
      return;
    }
    setSmartMatchLoading(false);
    setSmartMatchError(null);
  };

  const baseFilteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      if ((job as { status?: string }).status && (job as { status?: string }).status !== "live") {
        return false;
      }

      if (savedOnlyFilter && !savedJobIds.includes(job.id)) {
        return false;
      }

      if (appliedOnlyFilter && !appliedJobs[job.id]) {
        return false;
      }

      if (verifiedOnlyFilter && (job as { verified?: boolean }).verified === false) {
        return false;
      }

      // 1. Category Filter
      if (categoryFilter !== "All" && job.category !== categoryFilter) {
        return false;
      }

      // 2. Search Term
      const matchesSearch =
        job.title.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
        job.description.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
        job.skills.some(skill => skill.toLowerCase().includes(debouncedSearchTerm.toLowerCase()));
      if (!matchesSearch) return false;

      // 3. Payment Method Filter
      if (paymentFilter !== "All" && job.paymentMethod !== paymentFilter) {
        return false;
      }

      // 4. Duration Filter
      if (durationFilter !== "All" && job.duration !== durationFilter) {
        return false;
      }

      const minSalary = Number(minSalaryFilter);
      const maxSalary = Number(maxSalaryFilter);
      const jobBudget = Number(job.budget || 0);
      if (Number.isFinite(minSalary) && minSalary > 0 && jobBudget < minSalary) {
        return false;
      }
      if (Number.isFinite(maxSalary) && maxSalary > 0 && jobBudget > maxSalary) {
        return false;
      }

      return true;
    });
  }, [jobs, debouncedSearchTerm, paymentFilter, durationFilter, categoryFilter, savedOnlyFilter, savedJobIds, appliedOnlyFilter, appliedJobs, verifiedOnlyFilter, minSalaryFilter, maxSalaryFilter]);

  useEffect(() => {
    if (!useSmartMatching) {
      setSmartMatchLoading(false);
      setSmartMatchError(null);
      return;
    }

    if (baseFilteredJobs.length === 0) {
      setSmartMatches({});
      setSmartMatchLoading(false);
      setSmartMatchError(null);
      return;
    }

    if (!profile.skills || profile.skills.length === 0) {
      const fallback = heuristicSmartMatchMany(baseFilteredJobs, profile);
      const mapped = Object.fromEntries(fallback.map((match) => [match.jobId, match]));
      setSmartMatches(mapped);
      setSmartMatchLoading(false);
      setSmartMatchError(null);
      return;
    }

    const controller = new AbortController();
    setSmartMatchLoading(true);
    setSmartMatchError(null);

    const loadSmartMatches = async () => {
      try {
        const response = await fetch("/api/smart-match", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            profile: {
              id: profile.id,
              category: profile.category,
              skills: profile.skills,
              wellness: profile.wellness
            },
            jobs: baseFilteredJobs
          }),
          signal: controller.signal
        });

        const data = (await response.json()) as SmartMatchResponse;
        if (!response.ok) {
          throw new Error(smartMatchErrorMessage(data.errorCode, data.error || `Smart matching failed (${response.status})`));
        }
        const mapped = Object.fromEntries((data.matches || []).map((match) => [match.jobId, match]));
        setSmartMatches(mapped);

        if (data.fallback) {
          setSmartMatchError(smartMatchErrorMessage(data.errorCode, data.error));
        }
      } catch (error: unknown) {
        if (controller.signal.aborted) return;
        const fallback = heuristicSmartMatchMany(baseFilteredJobs, profile);
        const mapped = Object.fromEntries(fallback.map((match) => [match.jobId, match]));
        setSmartMatches(mapped);
        setSmartMatchError(error instanceof Error ? error.message : "Smart matching failed. Using local fallback.");
      } finally {
        if (!controller.signal.aborted) setSmartMatchLoading(false);
      }
    };

    loadSmartMatches();
    return () => controller.abort();
  }, [useSmartMatching, baseFilteredJobs, profile.category, profile.skills, profile.wellness]);

  const filteredJobs = useMemo(() => {
    if (!useSmartMatching) return baseFilteredJobs;

    return [...baseFilteredJobs].sort((a, b) => {
      const aScore = smartMatches[a.id]?.score ?? 0;
      const bScore = smartMatches[b.id]?.score ?? 0;
      if (bScore !== aScore) return bScore - aScore;

      const eScoreA = energyScore(profile.wellness?.energyRating, a.energyRequirement);
      const eScoreB = energyScore(profile.wellness?.energyRating, b.energyRequirement);
      if (eScoreB !== eScoreA) return eScoreB - eScoreA;

      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }, [baseFilteredJobs, useSmartMatching, smartMatches, profile.wellness]);

  const totalPages = Math.max(1, Math.ceil(filteredJobs.length / JOBS_PER_PAGE));
  const paginatedJobs = useMemo(() => {
    const startIndex = (currentPage - 1) * JOBS_PER_PAGE;
    return filteredJobs.slice(startIndex, startIndex + JOBS_PER_PAGE);
  }, [currentPage, filteredJobs]);

  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearchTerm, paymentFilter, durationFilter, categoryFilter, savedOnlyFilter, appliedOnlyFilter, verifiedOnlyFilter, minSalaryFilter, maxSalaryFilter, useSmartMatching]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  return (
    <div className="grid gap-6 lg:grid-cols-[300px_minmax(0,1fr)]">
      <aside className="self-start rounded-2xl border border-blue-100 bg-blue-50/80 p-5 shadow-sm">
        <div className="mb-5 border-b border-gray-100 pb-4">
          <p className="text-[11px] font-black uppercase tracking-[0.18em] text-slate-400">Filters</p>
          <h3 className="mt-1 text-lg font-bold text-slate-950">Find Jobs</h3>
          <p className="mt-1 text-xs font-medium text-slate-500">{filteredJobs.length} jobs found</p>
        </div>

        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search for jobs (e.g. React, UI/UX)..."
              className="w-full rounded-xl border border-gray-200 pl-10 pr-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-hidden text-gray-900"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="space-y-3">
            <div className="relative w-full">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              <select
                className="w-full appearance-none rounded-xl border border-gray-200 pl-10 pr-8 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-hidden bg-white text-gray-700 cursor-pointer"
                value={paymentFilter}
                onChange={(e) => setPaymentFilter(e.target.value as any)}
              >
                <option value="All">All Budget Types</option>
                <option value="Hourly">Hourly</option>
                <option value="Flat-Rate">Flat-Rate</option>
              </select>
            </div>

            <select
              className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-hidden bg-white text-gray-700 cursor-pointer"
              value={durationFilter}
              onChange={(e) => setDurationFilter(e.target.value as any)}
            >
              <option value="All">All Durations</option>
              <option value="1-2 weeks">1-2 weeks</option>
              <option value="1-3 months">1-3 months</option>
              <option value="Ongoing">Ongoing</option>
            </select>

            <select
              className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-hidden bg-white text-gray-700 cursor-pointer"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value as any)}
            >
              <option value="All">All Categories</option>
              <option value="General">General</option>
              <option value="Developer">Developer</option>
              <option value="Designer">Designer</option>
              <option value="Graphic Design">Graphic Design</option>
              <option value="Writer">Writer</option>
              <option value="Marketing Specialist">Marketing Specialist</option>
              <option value="Marketing">Marketing</option>
              <option value="Virtual Assistant">Virtual Assistant</option>
              <option value="Admin/VA">Admin/VA</option>
              <option value="Customer Support">Customer Support</option>
              <option value="Sales">Sales</option>
              <option value="Project Management">Project Management</option>
              <option value="QA/Testing">QA/Testing</option>
              <option value="Data Entry">Data Entry</option>
              <option value="Finance/Accounting">Finance/Accounting</option>
              <option value="IT & Networking">IT & Networking</option>
              <option value="Writing & Content">Writing & Content</option>
              <option value="Data & Automation">Data & Automation</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <input
              type="number"
              min={0}
              className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-700 outline-hidden transition-all focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
              placeholder="Min salary"
              value={minSalaryFilter}
              onChange={(e) => setMinSalaryFilter(e.target.value)}
            />
            <input
              type="number"
              min={0}
              className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-700 outline-hidden transition-all focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
              placeholder="Max salary"
              value={maxSalaryFilter}
              onChange={(e) => setMaxSalaryFilter(e.target.value)}
            />
          </div>

          <div className="space-y-2 rounded-xl border border-gray-100 bg-gray-50 p-3">
            <label className="flex items-center justify-between gap-3 text-sm font-semibold text-gray-700">
              <span>Bookmarked jobs</span>
              <input
                type="checkbox"
                checked={savedOnlyFilter}
                onChange={(e) => setSavedOnlyFilter(e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
            </label>
            <label className="flex items-center justify-between gap-3 text-sm font-semibold text-gray-700">
              <span>Applied jobs ({Object.keys(appliedJobs).length})</span>
              <input
                type="checkbox"
                checked={appliedOnlyFilter}
                onChange={(e) => setAppliedOnlyFilter(e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
            </label>
            <label className="flex items-center justify-between gap-3 text-sm font-semibold text-gray-700">
              <span>Verified only</span>
              <input
                type="checkbox"
                checked={verifiedOnlyFilter}
                onChange={(e) => setVerifiedOnlyFilter(e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
            </label>
          </div>
        </div>

        <div className="space-y-3 pt-2">
          <div className="flex flex-wrap items-center gap-2">
            <label htmlFor="smart-matching" className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                id="smart-matching"
                checked={useSmartMatching}
                onChange={(e) => handleSmartMatchingToggle(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-hidden peer-focus:ring-4 peer-focus:ring-indigo-100 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
              <span className="ml-3 text-sm font-semibold text-gray-700 cursor-pointer flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-indigo-500" />
                Smart Matching
              </span>
            </label>
            <span className="hidden max-w-full truncate text-xs text-gray-400 bg-gray-50 px-2 py-1 rounded-md border border-gray-100 sm:inline-flex" title={`Skills: ${profile.skills.join(", ") || "None yet"}`}>
              Skills: {profile.skills.join(", ") || "None yet"}
            </span>
            {useSmartMatching && smartMatchLoading && (
              <span className="text-xs text-indigo-700 bg-indigo-50 px-2 py-1 rounded-md border border-indigo-100 inline-flex items-center gap-1.5">
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                Gemini is matching jobs...
              </span>
            )}
            {useSmartMatching && smartMatchError && (
              <span className="text-xs text-amber-700 bg-amber-50 px-2 py-1 rounded-md border border-amber-100">
                {smartMatchError}
              </span>
            )}
          </div>
        </div>
      </aside>

      <section className="min-w-0 space-y-6">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
        {filteredJobs.length > 0 ? (
          paginatedJobs.map((job, index) => {
            const smartMatch = smartMatches[job.id];
            const localMatchedSkills = job.skills.filter(s => profile.skills.some(us => us.toLowerCase() === s.toLowerCase()));
            const localMissingSkills = job.skills.filter(s => !profile.skills.some(us => us.toLowerCase() === s.toLowerCase()));
            const matchedSkills = useSmartMatching ? (smartMatch?.matchedSkills ?? localMatchedSkills) : localMatchedSkills;
            const missingSkills = useSmartMatching ? (smartMatch?.missingSkills ?? localMissingSkills) : localMissingSkills;
            const matchScore = useSmartMatching
              ? (smartMatch?.score ?? 0)
              : profile.skills.length > 0
                ? Math.round((matchedSkills.length / Math.max(job.skills.length, 1)) * 100)
                : 0;
            const eScore = energyScore(profile.wellness?.energyRating, job.energyRequirement);
            let sustainabilityMatch = Math.round(0.6 * matchScore + 0.4 * eScore);
            if (profile.wellness?.verifiedSustainable) sustainabilityMatch = Math.min(100, sustainabilityMatch + 5);

            const sourceCurrency: CurrencyCode = isCurrencyCode(job.currencyCode) ? job.currencyCode : "PHP";
            const sourceBudget = Number(job.budget || 0);
            const convertedBudget =
              Number.isFinite(sourceBudget) && sourceBudget > 0
                ? convertAmount(sourceBudget, sourceCurrency, preferredCurrency, ratesByUsd)
                : null;

            const rateLabel =
              convertedBudget !== null
                ? formatCurrencyAmount(convertedBudget, preferredCurrency)
                : job.rate;
            const rateSubLabel =
              convertedBudget !== null && sourceCurrency !== preferredCurrency
                ? `${formatCurrencyAmount(sourceBudget, sourceCurrency)} original`
                : undefined;

            return (
              <JobCard 
                key={job.id} 
                job={job} 
                index={(currentPage - 1) * JOBS_PER_PAGE + index} 
                matchScore={matchScore} 
                matchedSkills={matchedSkills}
                missingSkills={missingSkills}
                onApply={onApply}
                applicationStatus={appliedJobs[job.id]}
                sustainabilityMatch={sustainabilityMatch}
                energyRequirement={job.energyRequirement}
                rateLabel={rateLabel}
                rateSubLabel={rateSubLabel}
                isSaved={savedJobIds.includes(job.id)}
                onToggleSave={(jobId) =>
                  setSavedJobIds((current) =>
                    current.includes(jobId)
                      ? current.filter((id) => id !== jobId)
                      : [jobId, ...current],
                  )
                }
                onViewSmartMatch={(j) => {
                  setSelectedJobForAI(j);
                  setShowAIAgent(true);
                }}
                isApplyLocked={!hasCompleteApplicationProfile}
                applyLockedReason="Copy public job link"
              />
            );
          })
        ) : (
          <div className="text-center py-20 bg-white rounded-2xl border-2 border-dashed border-gray-100">
            <div className="mx-auto w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
              <Search className="w-8 h-8 text-gray-300" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-1">No Results Found</h3>
            <p className="text-gray-500 max-w-xs mx-auto">
              Try different keywords or remove some filters.
            </p>
          </div>
        )}
      </div>

      {filteredJobs.length > JOBS_PER_PAGE && (
        <div className="flex flex-col gap-3 rounded-2xl border border-gray-100 bg-white px-4 py-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-gray-500">
            Page {currentPage} of {totalPages}
          </p>
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
              disabled={currentPage === 1}
              className="rounded-xl border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 transition-all hover:border-gray-300 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Previous
            </button>
            {Array.from({ length: totalPages }, (_, pageIndex) => pageIndex + 1).map((page) => (
              <button
                key={page}
                type="button"
                onClick={() => setCurrentPage(page)}
                className={`h-10 min-w-10 rounded-xl px-3 text-sm font-semibold transition-all ${
                  currentPage === page
                    ? "bg-slate-900 text-white"
                    : "border border-gray-200 text-gray-700 hover:border-gray-300 hover:bg-gray-50"
                }`}
              >
                {page}
              </button>
            ))}
            <button
              type="button"
              onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
              disabled={currentPage === totalPages}
              className="rounded-xl border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 transition-all hover:border-gray-300 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      )}
      </section>
      
      {/* AI Agent Modal */}
      <AIAgent 
        isOpen={showAIAgent}
        onClose={() => setShowAIAgent(false)}
        mode="smart-match"
        targetData={{ job: selectedJobForAI, profile }}
      />
    </div>
  );
}

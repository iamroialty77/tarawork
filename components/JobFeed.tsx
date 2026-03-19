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
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [showAIAgent, setShowAIAgent] = useState(false);
  const [selectedJobForAI, setSelectedJobForAI] = useState<Job | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);
  const [paymentFilter, setPaymentFilter] = useState<PaymentMethod | "All">("All");
  const [durationFilter, setDurationFilter] = useState<JobDuration | "All">("All");
  const [categoryFilter, setCategoryFilter] = useState<FreelancerCategory | "All">("All");
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

      return true;
    });
  }, [jobs, debouncedSearchTerm, paymentFilter, durationFilter, categoryFilter]);

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

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-5">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search for jobs (e.g. React, UI/UX)..."
              className="w-full rounded-xl border border-gray-200 pl-10 pr-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-hidden text-gray-900"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="grid w-full grid-cols-1 gap-2 sm:grid-cols-2 lg:flex lg:w-auto">
            <div className="relative w-full sm:min-w-0 lg:w-44">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              <select
                className="w-full appearance-none rounded-xl border border-gray-200 pl-10 pr-8 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-hidden bg-white text-gray-700 cursor-pointer"
                value={paymentFilter}
                onChange={(e) => setPaymentFilter(e.target.value as any)}
              >
                <option value="All">All Payments</option>
                <option value="Hourly">Hourly</option>
                <option value="Flat-Rate">Flat-Rate</option>
              </select>
            </div>

            <select
              className="w-full sm:min-w-0 rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-hidden bg-white text-gray-700 cursor-pointer lg:w-44"
              value={durationFilter}
              onChange={(e) => setDurationFilter(e.target.value as any)}
            >
              <option value="All">All Durations</option>
              <option value="1-2 weeks">1-2 weeks</option>
              <option value="1-3 months">1-3 months</option>
              <option value="Ongoing">Ongoing</option>
            </select>

            <select
              className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-hidden bg-white text-gray-700 cursor-pointer lg:w-52"
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
        </div>

        <div className="flex flex-col gap-3 pt-2 lg:flex-row lg:items-center lg:justify-between">
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
          
          <span className="text-xs font-medium text-gray-500">
            {filteredJobs.length} jobs found
          </span>
        </div>
      </div>

      <div className="grid gap-6">
        {filteredJobs.length > 0 ? (
          filteredJobs.map((job, index) => {
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
                index={index} 
                matchScore={matchScore} 
                matchedSkills={matchedSkills}
                missingSkills={missingSkills}
                onApply={onApply}
                applicationStatus={appliedJobs[job.id]}
                sustainabilityMatch={sustainabilityMatch}
                energyRequirement={job.energyRequirement}
                rateLabel={rateLabel}
                rateSubLabel={rateSubLabel}
                onViewSmartMatch={(j) => {
                  setSelectedJobForAI(j);
                  setShowAIAgent(true);
                }}
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

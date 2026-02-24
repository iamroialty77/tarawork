"use client";

import { useState, useMemo } from "react";
import { Job, FreelancerProfile, PaymentMethod, JobDuration, FreelancerCategory } from "../types";
import JobCard from "./JobCard";

import { Search, Filter, Sparkles } from "lucide-react";

interface JobFeedProps {
  jobs: Job[];
  profile: FreelancerProfile;
}

export default function JobFeed({ jobs, profile }: JobFeedProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [paymentFilter, setPaymentFilter] = useState<PaymentMethod | "All">("All");
  const [durationFilter, setDurationFilter] = useState<JobDuration | "All">("All");
  const [categoryFilter, setCategoryFilter] = useState<FreelancerCategory | "All">(profile.category || "All");
  const [useSmartMatching, setUseSmartMatching] = useState(true);

  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      // 1. Smart Matching (Skills)
      if (useSmartMatching && profile.skills.length > 0) {
        const hasMatchingSkill = job.skills.some((skill) =>
          profile.skills.some(
            (userSkill) => userSkill.toLowerCase() === skill.toLowerCase()
          )
        );
        if (!hasMatchingSkill) return false;
      }

      // 2. Category Filter
      if (categoryFilter !== "All" && job.category !== categoryFilter) {
        return false;
      }

      // 3. Search Term
      const matchesSearch =
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.description.toLowerCase().includes(searchTerm.toLowerCase());
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
  }, [jobs, profile.skills, searchTerm, paymentFilter, durationFilter, useSmartMatching, categoryFilter]);

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
          
          <div className="flex gap-2">
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              <select
                className="appearance-none rounded-xl border border-gray-200 pl-10 pr-8 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-hidden bg-white text-gray-700 cursor-pointer"
                value={paymentFilter}
                onChange={(e) => setPaymentFilter(e.target.value as any)}
              >
                <option value="All">All Payments</option>
                <option value="Hourly">Hourly</option>
                <option value="Flat-Rate">Flat-Rate</option>
              </select>
            </div>

            <select
              className="rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-hidden bg-white text-gray-700 cursor-pointer"
              value={durationFilter}
              onChange={(e) => setDurationFilter(e.target.value as any)}
            >
              <option value="All">All Durations</option>
              <option value="1-2 weeks">1-2 weeks</option>
              <option value="1-3 months">1-3 months</option>
              <option value="Ongoing">Ongoing</option>
            </select>

            <select
              className="rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-hidden bg-white text-gray-700 cursor-pointer"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value as any)}
            >
              <option value="All">All Categories</option>
              <option value="Developer">Developer</option>
              <option value="Virtual Assistant">Virtual Assistant</option>
              <option value="Designer">Designer</option>
              <option value="Writer">Writer</option>
              <option value="Marketing Specialist">Marketing Specialist</option>
            </select>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center gap-3">
            <div className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                id="smart-matching"
                checked={useSmartMatching}
                onChange={(e) => setUseSmartMatching(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-hidden peer-focus:ring-4 peer-focus:ring-indigo-100 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
              <label htmlFor="smart-matching" className="ml-3 text-sm font-semibold text-gray-700 cursor-pointer flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-indigo-500" />
                Smart Matching
              </label>
            </div>
            <span className="text-xs text-gray-400 bg-gray-50 px-2 py-1 rounded-md border border-gray-100">
              Skills: {profile.skills.join(", ") || "None yet"}
            </span>
          </div>
          
          <span className="text-xs font-medium text-gray-500">
            {filteredJobs.length} jobs found
          </span>
        </div>
      </div>

      <div className="grid gap-6">
        {filteredJobs.length > 0 ? (
          filteredJobs.map((job, index) => (
            <JobCard key={job.id} job={job} index={index} />
          ))
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
    </div>
  );
}

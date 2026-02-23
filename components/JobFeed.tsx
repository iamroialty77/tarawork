"use client";

import { useState, useMemo } from "react";
import { Job, FreelancerProfile, PaymentMethod, JobDuration } from "../types";
import JobCard from "./JobCard";

interface JobFeedProps {
  jobs: Job[];
  profile: FreelancerProfile;
}

export default function JobFeed({ jobs, profile }: JobFeedProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [paymentFilter, setPaymentFilter] = useState<PaymentMethod | "All">("All");
  const [durationFilter, setDurationFilter] = useState<JobDuration | "All">("All");
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

      // 2. Search Term
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
  }, [jobs, profile.skills, searchTerm, paymentFilter, durationFilter, useSmartMatching]);

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg border border-gray-200 space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          <input
            type="text"
            placeholder="Search jobs..."
            className="flex-1 rounded-md border border-gray-300 px-4 py-2 text-black"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select
            className="rounded-md border border-gray-300 px-4 py-2 text-black"
            value={paymentFilter}
            onChange={(e) => setPaymentFilter(e.target.value as any)}
          >
            <option value="All">All Payment Types</option>
            <option value="Hourly">Hourly</option>
            <option value="Flat-Rate">Flat-Rate</option>
          </select>
          <select
            className="rounded-md border border-gray-300 px-4 py-2 text-black"
            value={durationFilter}
            onChange={(e) => setDurationFilter(e.target.value as any)}
          >
            <option value="All">All Durations</option>
            <option value="Short-term">Short-term</option>
            <option value="Long-term">Long-term</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="smart-matching"
            checked={useSmartMatching}
            onChange={(e) => setUseSmartMatching(e.target.checked)}
            className="h-4 w-4 text-indigo-600 border-gray-300 rounded"
          />
          <label htmlFor="smart-matching" className="text-sm font-medium text-gray-700">
            Smart Matching (Batas sa iyong skills: {profile.skills.join(", ") || "Wala pa"})
          </label>
        </div>
      </div>

      <div className="grid gap-4">
        {filteredJobs.length > 0 ? (
          filteredJobs.map((job) => <JobCard key={job.id} job={job} />)
        ) : (
          <div className="text-center py-12 bg-white rounded-lg border border-dashed border-gray-300">
            <p className="text-gray-500">Walang nahanap na trabaho na tumutugma sa iyong criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
}

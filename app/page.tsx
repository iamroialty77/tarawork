"use client";

import { useState } from "react";
import { MOCK_JOBS } from "../lib/mockData";
import { FreelancerProfile } from "../types";
import JobFeed from "../components/JobFeed";
import ProfileForm from "../components/ProfileForm";
import SkillAssessment from "../components/SkillAssessment";
import ProjectManager from "../components/ProjectManager";
import JobPostingForm from "../components/JobPostingForm";

export default function Home() {
  const [view, setView] = useState<"freelancer" | "client">("freelancer");
  const [profile, setProfile] = useState<FreelancerProfile>({
    name: "Juan Dela Cruz",
    skills: ["React"],
    verifiedSkills: [
      { name: "React Framework", score: 92, lastAssessment: "2024-02-15", isVerified: true },
      { name: "TypeScript", score: 85, lastAssessment: "2024-02-10", isVerified: true }
    ],
    hourlyRate: "$20",
    bio: "I am a passionate developer with experience in React and Next.js.",
    activeProjects: [
      { id: "1", title: "E-commerce Redesign", client: "TechCorp", status: "Active", hoursLogged: 12, budget: "$500" }
    ],
  });

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-indigo-600">Tara Dashboard</h1>
          <div className="flex gap-4 items-center">
            <div className="bg-gray-100 p-1 rounded-lg flex">
              <button
                onClick={() => setView("freelancer")}
                className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${
                  view === "freelancer" ? "bg-white shadow-sm text-indigo-600" : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Freelancer
              </button>
              <button
                onClick={() => setView("client")}
                className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${
                  view === "client" ? "bg-white shadow-sm text-indigo-600" : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Client / Hirer
              </button>
            </div>
            <span className="text-xs font-semibold px-2 py-1 bg-yellow-100 text-yellow-800 rounded">Phase 2 Ready</span>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {view === "freelancer" ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column: Profile & Assessment */}
            <div className="lg:col-span-1 space-y-6">
              <div className="sticky top-8">
                <ProfileForm initialProfile={profile} onUpdate={setProfile} />
                
                <SkillAssessment verifiedSkills={profile.verifiedSkills || []} />

                <div className="mt-6 p-4 bg-indigo-50 rounded-lg border border-indigo-100">
                  <h3 className="text-sm font-semibold text-indigo-800 mb-2">Phase 2 Roadmap</h3>
                  <p className="text-xs text-indigo-600">
                    Nag-set up na tayo ng placeholders para sa AI Vetting at Time Tracking na konektado sa Escrow.
                  </p>
                </div>
              </div>
            </div>

            {/* Right Column: Job Feed & Project Manager */}
            <div className="lg:col-span-2 space-y-8">
              <ProjectManager projects={profile.activeProjects || []} />

              <div className="pt-4 border-t border-gray-200">
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">Available Jobs</h2>
                  <p className="text-gray-600">Tingnan ang mga trabahong swak sa iyong skills.</p>
                </div>
                
                <JobFeed jobs={MOCK_JOBS} profile={profile} />
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            <div className="text-center max-w-2xl mx-auto mb-10">
              <h2 className="text-3xl font-extrabold text-gray-900">Mag-post ng Bagong Trabaho</h2>
              <p className="mt-4 text-lg text-gray-600">
                Hanapin ang pinakamahusay na freelancer para sa iyong proyekto sa loob lamang ng ilang minuto.
              </p>
            </div>
            <JobPostingForm />
          </div>
        )}
      </main>
    </div>
  );
}

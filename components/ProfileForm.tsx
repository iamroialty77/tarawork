"use client";

import { FreelancerProfile, FreelancerCategory } from "../types";
import { useState, useEffect } from "react";

interface ProfileFormProps {
  initialProfile: FreelancerProfile;
  onUpdate: (profile: FreelancerProfile) => void;
  isSaving?: boolean;
}

export default function ProfileForm({ initialProfile, onUpdate, isSaving = false }: ProfileFormProps) {
  const [profile, setProfile] = useState(initialProfile);
  const [skillInput, setSkillInput] = useState("");

  // Sync internal state when prop changes (after fetch)
  useEffect(() => {
    setProfile(initialProfile);
  }, [initialProfile]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate(profile);
  };

  const addSkill = () => {
    if (skillInput && !profile.skills.includes(skillInput)) {
      const newProfile = { ...profile, skills: [...profile.skills, skillInput] };
      setProfile(newProfile);
      setSkillInput("");
      onUpdate(newProfile);
    }
  };

  const removeSkill = (skillToRemove: string) => {
    const newProfile = {
      ...profile,
      skills: profile.skills.filter((s) => s !== skillToRemove),
    };
    setProfile(newProfile);
    onUpdate(newProfile);
  };

  return (
    <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
      <h2 className="text-xl font-bold mb-6 text-slate-900">User Profile</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Account Role</label>
            <select
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 transition-all text-slate-900 bg-slate-50 font-bold"
              value={profile.role}
              onChange={(e) => setProfile({ ...profile, role: e.target.value as any })}
            >
              <option value="jobseeker">Jobseeker (Freelancer)</option>
              <option value="hirer">Hirer (Client)</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Full Name</label>
            <input
              type="text"
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 transition-all text-slate-900"
              value={profile.name}
              onChange={(e) => setProfile({ ...profile, name: e.target.value })}
            />
          </div>
        </div>

        {profile.role === "hirer" && (
          <div>
            <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Company Name</label>
            <input
              type="text"
              placeholder="e.g. TechCorp Solutions"
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 transition-all text-slate-900"
              value={profile.companyName || ""}
              onChange={(e) => setProfile({ ...profile, companyName: e.target.value })}
            />
          </div>
        )}

        {profile.role === "jobseeker" && (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Category</label>
              <select
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 transition-all text-slate-900"
                value={profile.category}
                onChange={(e) => setProfile({ ...profile, category: e.target.value as FreelancerCategory })}
              >
                <option value="Developer">Developer</option>
                <option value="Virtual Assistant">Virtual Assistant</option>
                <option value="Designer">Designer</option>
                <option value="Writer">Writer</option>
                <option value="Marketing Specialist">Marketing Specialist</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Hourly Rate</label>
              <input
                type="text"
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 transition-all text-slate-900"
                value={profile.hourlyRate}
                onChange={(e) => setProfile({ ...profile, hourlyRate: e.target.value })}
              />
            </div>
          </div>
        )}

        <div>
          <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Short Bio</label>
          <textarea
            className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 transition-all text-slate-900"
            rows={3}
            value={profile.bio}
            onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
          />
        </div>

        {profile.role === "jobseeker" && (
          <div>
            <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Skills</label>
            <div className="flex gap-2 mt-1">
              <input
                type="text"
                className="flex-1 rounded-xl border border-slate-200 px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 transition-all text-slate-900"
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                placeholder="e.g. React"
                onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addSkill())}
              />
              <button
                type="button"
                onClick={addSkill}
                className="bg-slate-900 text-white px-4 py-2 rounded-xl hover:bg-black font-bold text-xs"
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2 mt-3">
              {profile.skills.map((skill) => (
                <span
                  key={skill}
                  className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-indigo-50 text-indigo-700 text-[11px] font-bold border border-indigo-100"
                >
                  {skill}
                  <button
                    type="button"
                    onClick={() => removeSkill(skill)}
                    className="text-indigo-400 hover:text-indigo-600"
                  >
                    &times;
                  </button>
                </span>
              ))}
            </div>
          </div>
        )}

        <button
          type="submit"
          disabled={isSaving}
          className={`w-full py-3 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 ${
            isSaving 
              ? "bg-slate-100 text-slate-400 cursor-not-allowed" 
              : "bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-100 active:scale-95"
          }`}
        >
          {isSaving ? (
            <>
              <div className="w-4 h-4 border-2 border-slate-300 border-t-slate-500 rounded-full animate-spin"></div>
              Saving...
            </>
          ) : (
            "Save Profile Changes"
          )}
        </button>
      </form>
    </div>
  );
}

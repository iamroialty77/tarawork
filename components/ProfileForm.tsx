"use client";

import { FreelancerProfile, FreelancerCategory, PortfolioItem } from "../types";
import { useState, useEffect, useRef } from "react";
import { Camera, Globe, Github, Linkedin, Link as LinkIcon, User, Briefcase, Mail } from "lucide-react";
import PortfolioManager from "./PortfolioManager";

interface ProfileFormProps {
  initialProfile: FreelancerProfile;
  onUpdate: (profile: FreelancerProfile) => void;
  onAddPortfolio?: (item: Partial<PortfolioItem>) => void;
  onRemovePortfolio?: (id: string) => void;
  isSaving?: boolean;
}

export default function ProfileForm({ 
  initialProfile, 
  onUpdate, 
  onAddPortfolio,
  onRemovePortfolio,
  isSaving = false 
}: ProfileFormProps) {
  const [profile, setProfile] = useState(initialProfile);
  const [skillInput, setSkillInput] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const addPortfolioItem = (item: Partial<PortfolioItem>) => {
    if (onAddPortfolio) {
      onAddPortfolio(item);
      return;
    }
    const newItem: PortfolioItem = {
      id: Math.random().toString(36).substr(2, 9),
      profile_id: profile.id || "",
      title: item.title || "",
      description: item.description || "",
      project_url: item.project_url || "",
      technologies: item.technologies || [],
      created_at: new Date().toISOString(),
    };
    const newProfile = {
      ...profile,
      portfolio: [...(profile.portfolio || []), newItem],
    };
    setProfile(newProfile);
    onUpdate(newProfile);
  };

  const removePortfolioItem = (id: string) => {
    if (onRemovePortfolio) {
      onRemovePortfolio(id);
      return;
    }
    const newProfile = {
      ...profile,
      portfolio: (profile.portfolio || []).filter((item) => item.id !== id),
    };
    setProfile(newProfile);
    onUpdate(newProfile);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // In a real app, you'd upload to Supabase Storage here
      // For now, we'll use a local URL or just simulate
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfile({ ...profile, avatar_url: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/50">
      <div className="flex flex-col items-center mb-8">
        <div className="relative group">
          <div className="w-24 h-24 rounded-3xl bg-gradient-to-tr from-indigo-500 to-purple-500 p-1 shadow-lg group-hover:shadow-indigo-200 transition-all overflow-hidden">
            {profile.avatar_url ? (
              <img 
                src={profile.avatar_url} 
                alt="Profile" 
                className="w-full h-full object-cover rounded-2xl"
              />
            ) : (
              <div className="w-full h-full bg-slate-50 rounded-2xl flex items-center justify-center">
                <User className="w-10 h-10 text-slate-300" />
              </div>
            )}
          </div>
          <button 
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="absolute -bottom-2 -right-2 w-10 h-10 bg-white rounded-xl shadow-lg border border-slate-100 flex items-center justify-center text-slate-600 hover:text-indigo-600 hover:scale-110 transition-all cursor-pointer"
          >
            <Camera className="w-5 h-5" />
          </button>
          <input 
            type="file" 
            ref={fileInputRef} 
            className="hidden" 
            accept="image/*"
            onChange={handleImageUpload}
          />
        </div>
        <h2 className="text-xl font-bold mt-4 text-slate-900">{profile.name || "Set your profile"}</h2>
        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">{profile.role === 'jobseeker' ? 'Freelancer' : 'Hirer'}</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
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

        {profile.role === "jobseeker" && (
          <div className="pt-6 border-t border-slate-100">
            <PortfolioManager
              items={profile.portfolio || []}
              onAdd={addPortfolioItem}
              onRemove={removePortfolioItem}
              isOwner={true}
            />
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

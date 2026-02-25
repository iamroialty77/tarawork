"use client";

import { FreelancerProfile, FreelancerCategory, PortfolioItem } from "../types";
import { useState, useEffect, useRef } from "react";
import { Camera, Globe, Github, Linkedin, Link as LinkIcon, User, Briefcase, Mail, FileText, Sparkles, Loader2 } from "lucide-react";
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
  const [isParsing, setIsParsing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const resumeInputRef = useRef<HTMLInputElement>(null);

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

  const handleResumeUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsParsing(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('/api/parse-resume', {
        method: 'POST',
        body: formData,
      });

      // Basahin muna bilang text para maiwasan ang JSON parse error sa empty response
      const responseText = await response.text();
      let data;
      
      try {
        data = JSON.parse(responseText);
      } catch (e) {
        console.error('Failed to parse response as JSON:', responseText);
        throw new Error('Ang server ay nagbigay ng hindi wastong response. Pakisubukang muli.');
      }

      if (!response.ok) {
        throw new Error(data.error || 'Failed to parse resume');
      }

      const updatedProfile = {
        ...profile,
        name: data.name || profile.name,
        bio: data.bio || profile.bio,
        skills: Array.from(new Set([...profile.skills, ...(data.skills || [])])),
        category: data.category || profile.category,
      };
      
      setProfile(updatedProfile);
      onUpdate(updatedProfile);
      alert('Resume parsed successfully! AI has updated your profile.');
    } catch (error: any) {
      console.error('Error:', error);
      alert(`Error parsing resume: ${error.message}`);
    } finally {
      setIsParsing(false);
      if (resumeInputRef.current) resumeInputRef.current.value = '';
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
          <div className="p-4 bg-indigo-50 rounded-2xl border border-indigo-100 border-dashed">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-indigo-500 flex items-center justify-center text-white">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">AI Resume Parser</h4>
                  <p className="text-xs text-indigo-600/70 font-medium">Upload PDF to auto-fill your profile</p>
                </div>
              </div>
              <button
                type="button"
                disabled={isParsing}
                onClick={() => resumeInputRef.current?.click()}
                className="px-4 py-2 bg-indigo-600 text-white text-xs font-bold rounded-xl hover:bg-indigo-700 transition-all shadow-md shadow-indigo-200 flex items-center gap-2 disabled:opacity-50"
              >
                {isParsing ? (
                  <>
                    <Loader2 className="w-3 h-3 animate-spin" />
                    Parsing...
                  </>
                ) : (
                  <>
                    <FileText className="w-3 h-3" />
                    Upload PDF
                  </>
                )}
              </button>
            </div>
            <input
              type="file"
              ref={resumeInputRef}
              className="hidden"
              accept=".pdf"
              onChange={handleResumeUpload}
            />
          </div>
        )}

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

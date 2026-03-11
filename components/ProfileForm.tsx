"use client";

import { UserProfile, FreelancerCategory, PortfolioItem } from "../types";
import { useState, useEffect, useRef } from "react";
import { Camera, User, FileText, Sparkles, ShieldCheck, Globe, BarChart3, Video, Star } from "lucide-react";
import PortfolioManager from "./PortfolioManager";
import AIAgent from "./AIAgent";

interface ProfileFormProps {
  initialProfile: UserProfile;
  onUpdate: (profile: UserProfile) => void;
  onAddPortfolio?: (item: Partial<PortfolioItem>) => void;
  onUpdatePortfolio?: (item: PortfolioItem) => void;
  onRemovePortfolio?: (id: string) => void;
  isSaving?: boolean;
}

export default function ProfileForm({ 
  initialProfile, 
  onUpdate, 
  onAddPortfolio,
  onUpdatePortfolio,
  onRemovePortfolio,
  isSaving = false 
}: ProfileFormProps) {
  const [profile, setProfile] = useState(initialProfile);
  const [skillInput, setSkillInput] = useState("");
  const [showAIAgent, setShowAIAgent] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const resumeInputRef = useRef<HTMLInputElement>(null);

  const premiumProfile = profile.premiumProfile || {
    tier: "free" as const,
    analytics: {
      profileViews: 0,
      clientClicks: 0,
    },
    verifiedProgram: {
      enrolled: false,
      annualFee: 499,
      identityVerified: false,
      portfolioVerified: false,
      higherSearchRanking: false,
      clientTrustBoost: false,
    },
  };
  const isPro = premiumProfile.tier === "pro";

  // Sync internal state when prop changes (after fetch)
  useEffect(() => {
    setProfile(initialProfile);
  }, [initialProfile]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate(profile);
  };

  const handleFieldChange = (updates: Partial<UserProfile>) => {
    const newProfile = { ...profile, ...updates };
    setProfile(newProfile);
    // Note: We don't call onUpdate here for every keystroke, 
    // only for definitive actions or on submit
  };

  const addSkill = () => {
    if (skillInput && !profile.skills.includes(skillInput)) {
      setProfile({ ...profile, skills: [...profile.skills, skillInput] });
      setSkillInput("");
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setProfile({
      ...profile,
      skills: profile.skills.filter((s) => s !== skillToRemove),
    });
  };

  const addPortfolioItemLocal = (item: Partial<PortfolioItem>) => {
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
    setProfile({
      ...profile,
      portfolio: [...(profile.portfolio || []), newItem],
    });
  };

  const updatePortfolioItemLocal = (item: PortfolioItem) => {
    if (onUpdatePortfolio) {
      onUpdatePortfolio(item);
      return;
    }
    setProfile({
      ...profile,
      portfolio: (profile.portfolio || []).map((i) => (i.id === item.id ? item : i)),
    });
  };

  const removePortfolioItemLocal = (id: string) => {
    if (onRemovePortfolio) {
      onRemovePortfolio(id);
      return;
    }
    setProfile({
      ...profile,
      portfolio: (profile.portfolio || []).filter((item) => item.id !== id),
    });
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

  const handleResumeUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Use AI Agent for professional parsing experience
    setShowAIAgent(true);
    if (resumeInputRef.current) resumeInputRef.current.value = "";
  };

  const handlePremiumChange = (updates: Partial<typeof premiumProfile>) => {
    setProfile({
      ...profile,
      premiumProfile: {
        ...premiumProfile,
        ...updates,
        analytics: {
          profileViews: premiumProfile.analytics?.profileViews || 0,
          clientClicks: premiumProfile.analytics?.clientClicks || 0,
          ...(updates.analytics || {}),
        },
      },
    });
  };

  const handleAIParseComplete = (data: { 
    name?: string; 
    bio?: string; 
    skills?: string[]; 
    category?: FreelancerCategory; 
    portfolio?: PortfolioItem[] 
  }) => {
    const existingPortfolioIds = new Set((profile.portfolio || []).map(item => item.id));
    const newPortfolioItems = (data.portfolio || []).filter((item: PortfolioItem) => !existingPortfolioIds.has(item.id));

    const updatedProfile = {
      ...profile,
      name: data.name || profile.name,
      bio: data.bio || profile.bio,
      skills: Array.from(new Set([...profile.skills, ...(data.skills || [])])),
      category: data.category || profile.category,
      portfolio: [...(profile.portfolio || []), ...newPortfolioItems]
    };
    
    setProfile(updatedProfile);
    onUpdate(updatedProfile);
    
    // Also notify if there are parent handlers for individual portfolio additions
    if (newPortfolioItems.length > 0 && onAddPortfolio) {
      newPortfolioItems.forEach((item: PortfolioItem) => onAddPortfolio(item));
    }
    
    setShowAIAgent(false);
  };

  return (
    <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-xl shadow-slate-200/50">
      <div className="flex flex-col items-center mb-8">
        <div className="relative group">
          <div className="w-24 h-24 rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-500 p-1 shadow-lg group-hover:shadow-indigo-200 transition-all overflow-hidden">
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
        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">{profile.role === "freelancer" ? "Freelancer" : "employer"}</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="sm:col-span-2">
            <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Portfolio Username</label>
            <div className="flex items-center">
              <span className="bg-slate-100 px-3 py-2 border border-r-0 border-slate-200 rounded-l-xl text-slate-500 text-sm font-medium">
                {typeof window !== 'undefined' ? window.location.host : 'tarawork.network'}/
              </span>
              <input
                type="text"
                placeholder="username"
                className="flex-1 rounded-r-xl border border-slate-200 px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 transition-all text-slate-900 font-bold"
                value={profile.username || ""}
                onChange={(e) => setProfile({ ...profile, username: e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, '') })}
              />
            </div>
            <p className="text-[10px] text-slate-400 mt-1 italic">This is your professional URL identifier.</p>
          </div>
          <div>
            <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Account Role</label>
              <select
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 transition-all text-slate-900 bg-slate-50 font-bold"
                value={profile.role}
                onChange={(e) => handleFieldChange({ role: e.target.value as "freelancer" | "employer" })}
              >
                <option value="freelancer">freelancer (Freelancer)</option>
                <option value="employer">employer (Client)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Full Name</label>
              <input
                type="text"
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 transition-all text-slate-900"
                value={profile.name}
                onChange={(e) => handleFieldChange({ name: e.target.value })}
              />
            </div>
          </div>

          {profile.role === "employer" && (
            <div>
              <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Company Name</label>
              <input
                type="text"
                placeholder="e.g. TechCorp Solutions"
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 transition-all text-slate-900"
                value={profile.companyName || ""}
                onChange={(e) => handleFieldChange({ companyName: e.target.value })}
              />
            </div>
          )}

        {profile.role === "freelancer" && (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Category</label>
              <select
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 transition-all text-slate-900"
                value={profile.category}
                onChange={(e) => setProfile({ ...profile, category: e.target.value as FreelancerCategory })}
              >
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

        {profile.role === "freelancer" && (
          <div className={`rounded-[2rem] border p-6 transition-all duration-300 ${isPro ? "border-slate-900 bg-gradient-to-br from-slate-950 via-slate-900 to-amber-950 text-white shadow-2xl shadow-slate-900/20" : "border-amber-200 bg-gradient-to-br from-amber-50 via-white to-orange-50 shadow-lg shadow-amber-100/50"}`}>
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
              <div className="space-y-2">
                <div className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-[0.25em] ${isPro ? "border border-white/10 bg-white/10 text-amber-300" : "border border-amber-200 bg-white text-amber-700"}`}>
                  <Star className="h-3.5 w-3.5" />
                  {isPro ? "Freelancer Pro Active" : "Freelancer Pro"}
                </div>
                <h3 className={`text-xl font-black ${isPro ? "text-white" : "text-slate-900"}`}>Turn your profile into a premium sales page</h3>
                <p className={`max-w-2xl text-sm leading-relaxed ${isPro ? "text-slate-300" : "text-slate-600"}`}>
                  Keep your basic profile free, then unlock credibility signals that help clients trust you faster and click more often.
                </p>
              </div>
              <div className={`rounded-2xl px-4 py-3 ${isPro ? "bg-white/10 border border-white/10" : "bg-slate-950 text-white"}`}>
                <p className={`text-[10px] font-black uppercase tracking-[0.25em] ${isPro ? "text-slate-300" : "text-amber-300"}`}>Suggested Price</p>
                <p className="mt-1 text-lg font-black">P199-P399/mo</p>
              </div>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <div className={`rounded-2xl border p-4 ${premiumProfile.tier === "free" ? "border-slate-900 bg-slate-900 text-white" : "border-slate-200 bg-white"}`}>
                <p className="text-[10px] font-black uppercase tracking-[0.25em]">Free Profile</p>
                <ul className="mt-3 space-y-2 text-sm">
                  <li>Basic portfolio</li>
                  <li>Skills and experience</li>
                  <li>Contact info</li>
                  <li>Limited media uploads</li>
                </ul>
                <button
                  type="button"
                  onClick={() => handlePremiumChange({ tier: "free" })}
                  className={`mt-4 w-full rounded-xl px-4 py-2 text-xs font-black uppercase tracking-[0.2em] transition-all ${premiumProfile.tier === "free" ? "bg-white text-slate-900" : "bg-slate-100 text-slate-700 hover:bg-slate-200"}`}
                >
                  Current: Free
                </button>
              </div>

              <div className={`rounded-2xl border p-4 ${premiumProfile.tier === "pro" ? "border-amber-300 bg-gradient-to-br from-slate-950 via-slate-900 to-amber-950 text-white shadow-xl shadow-amber-200/40" : "border-slate-200 bg-white"}`}>
                <p className="text-[10px] font-black uppercase tracking-[0.25em] text-amber-300">Premium Profile</p>
                <ul className="mt-3 space-y-2 text-sm">
                  <li>Verified badge</li>
                  <li>Custom domain</li>
                  <li>Advanced portfolio sections</li>
                  <li>Featured placement</li>
                  <li>Analytics and video intro</li>
                </ul>
                <button
                  type="button"
                  onClick={() =>
                    handlePremiumChange({
                      tier: "pro",
                      verifiedBadge: true,
                      advancedPortfolio: true,
                      featuredPlacement: true,
                      analyticsEnabled: true,
                    })
                  }
                  className={`mt-4 w-full rounded-xl px-4 py-2 text-xs font-black uppercase tracking-[0.2em] transition-all ${premiumProfile.tier === "pro" ? "bg-white text-slate-950" : "bg-amber-500 text-slate-950 hover:bg-amber-400"}`}
                >
                  {premiumProfile.tier === "pro" ? "Current: Pro" : "Switch to Pro"}
                </button>
              </div>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {[
                { icon: ShieldCheck, title: "Verified badge", desc: "Adds an immediate trust signal beside your name.", enabled: !!premiumProfile.verifiedBadge },
                { icon: Globe, title: "Custom domain", desc: "Use a cleaner branded URL like roi.tarawork.ph.", enabled: !!premiumProfile.customDomain },
                { icon: BarChart3, title: "Analytics", desc: "Track profile views and client clicks from your page.", enabled: !!premiumProfile.analyticsEnabled },
                { icon: Video, title: "Video intro", desc: "Let clients hear your value proposition in seconds.", enabled: !!premiumProfile.videoIntroUrl },
              ].map((item) => (
                <div key={item.title} className="rounded-2xl border border-slate-200 bg-white p-4">
                  <div className="flex items-start gap-3">
                    <div className="rounded-xl bg-slate-100 p-2.5">
                      <item.icon className="h-4 w-4 text-slate-700" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-bold text-slate-900">{item.title}</h4>
                        <span className={`rounded-full px-2 py-0.5 text-[10px] font-black uppercase tracking-[0.2em] ${item.enabled ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-500"}`}>
                          {item.enabled ? "On" : "Off"}
                        </span>
                      </div>
                      <p className="mt-1 text-xs leading-relaxed text-slate-500">{item.desc}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {isPro && (
              <div className="mt-6 rounded-[1.75rem] border border-white/10 bg-white/5 p-5">
                <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.25em] text-amber-300">Live Pro Preview</p>
                    <h4 className="mt-3 text-2xl font-black text-white">
                      {premiumProfile.introHeadline || "Position yourself like a top freelancer clients can trust immediately."}
                    </h4>
                    <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-300">
                      Verified visual identity, richer portfolio narrative, and measurable demand signals in one profile.
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-slate-900">
                    <div className="rounded-2xl bg-white p-4">
                      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Profile Views</p>
                      <p className="mt-2 text-2xl font-black">{premiumProfile.analytics?.profileViews || 0}</p>
                    </div>
                    <div className="rounded-2xl bg-white p-4">
                      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Client Clicks</p>
                      <p className="mt-2 text-2xl font-black">{premiumProfile.analytics?.clientClicks || 0}</p>
                    </div>
                  </div>
                </div>

                <div className="mt-5 grid gap-3 md:grid-cols-3">
                  <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Domain</p>
                    <p className="mt-2 text-sm font-bold text-white">{premiumProfile.customDomain || "roi.tarawork.ph"}</p>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Badge</p>
                    <p className="mt-2 text-sm font-bold text-white">{premiumProfile.verifiedBadge ? "Verified Professional" : "Not enabled"}</p>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Video Intro</p>
                    <p className="mt-2 text-sm font-bold text-white">{premiumProfile.videoIntroUrl ? "Ready for client viewing" : "Add a Loom intro to complete the page"}</p>
                  </div>
                </div>
              </div>
            )}

            {premiumProfile.tier === "pro" && (
              <div className="mt-6 grid gap-4 md:grid-cols-2">
                <div>
                  <label className={`mb-1 block text-xs font-black uppercase tracking-widest ${isPro ? "text-slate-400" : "text-slate-400"}`}>Custom Domain</label>
                  <input
                    type="text"
                    placeholder="roi.tarawork.ph"
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-900 transition-all focus:ring-2 focus:ring-indigo-500"
                    value={premiumProfile.customDomain || ""}
                    onChange={(e) => handlePremiumChange({ customDomain: e.target.value })}
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-black uppercase tracking-widest text-slate-400">Intro Headline</label>
                  <input
                    type="text"
                    placeholder="Helping founders launch polished digital products."
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-900 transition-all focus:ring-2 focus:ring-indigo-500"
                    value={premiumProfile.introHeadline || ""}
                    onChange={(e) => handlePremiumChange({ introHeadline: e.target.value })}
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="mb-1 block text-xs font-black uppercase tracking-widest text-slate-400">Video Intro URL</label>
                  <input
                    type="url"
                    placeholder="https://www.loom.com/share/your-intro"
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-900 transition-all focus:ring-2 focus:ring-indigo-500"
                    value={premiumProfile.videoIntroUrl || ""}
                    onChange={(e) => handlePremiumChange({ videoIntroUrl: e.target.value })}
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-black uppercase tracking-widest text-slate-400">Profile Views</label>
                  <input
                    type="number"
                    min="0"
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-900 transition-all focus:ring-2 focus:ring-indigo-500"
                    value={premiumProfile.analytics?.profileViews || 0}
                    onChange={(e) =>
                      handlePremiumChange({
                        analytics: {
                          profileViews: Number(e.target.value || 0),
                          clientClicks: premiumProfile.analytics?.clientClicks || 0,
                        },
                      })
                    }
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-black uppercase tracking-widest text-slate-400">Client Clicks</label>
                  <input
                    type="number"
                    min="0"
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-900 transition-all focus:ring-2 focus:ring-indigo-500"
                    value={premiumProfile.analytics?.clientClicks || 0}
                    onChange={(e) =>
                      handlePremiumChange({
                        analytics: {
                          profileViews: premiumProfile.analytics?.profileViews || 0,
                          clientClicks: Number(e.target.value || 0),
                        },
                      })
                    }
                  />
                </div>
              </div>
            )}
          </div>
        )}

        {profile.role === "freelancer" && (
          <div className={`rounded-[2rem] border p-6 transition-all duration-300 ${premiumProfile.verifiedProgram?.enrolled ? "border-emerald-300 bg-gradient-to-br from-emerald-950 via-slate-950 to-slate-900 text-white shadow-2xl shadow-emerald-900/20" : "border-emerald-200 bg-gradient-to-br from-emerald-50 via-white to-teal-50"}`}>
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
              <div className="space-y-2">
                <div className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-[0.25em] ${premiumProfile.verifiedProgram?.enrolled ? "border border-white/10 bg-white/10 text-emerald-300" : "border border-emerald-200 bg-white text-emerald-700"}`}>
                  <ShieldCheck className="h-3.5 w-3.5" />
                  {premiumProfile.verifiedProgram?.enrolled ? "Verified Program Active" : "Verified Freelancer Program"}
                </div>
                <h3 className={`text-xl font-black ${premiumProfile.verifiedProgram?.enrolled ? "text-white" : "text-slate-900"}`}>Earn a TaraWork Verified badge</h3>
                <p className={`max-w-2xl text-sm leading-relaxed ${premiumProfile.verifiedProgram?.enrolled ? "text-slate-300" : "text-slate-600"}`}>
                  Reduce fake profiles, prove legitimacy, and increase buyer confidence with identity and portfolio verification.
                </p>
              </div>
              <div className={`rounded-2xl px-4 py-3 ${premiumProfile.verifiedProgram?.enrolled ? "bg-white/10 border border-white/10" : "bg-emerald-600 text-white"}`}>
                <p className="text-[10px] font-black uppercase tracking-[0.25em] text-emerald-200">Annual Fee</p>
                <p className="mt-1 text-lg font-black">P499/year</p>
              </div>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {[
                { title: "Verified identity", key: "identityVerified" as const },
                { title: "Verified portfolio", key: "portfolioVerified" as const },
                { title: "Higher search ranking", key: "higherSearchRanking" as const },
                { title: "Client trust boost", key: "clientTrustBoost" as const },
              ].map((item) => (
                <div key={item.title} className={`rounded-2xl border p-4 ${premiumProfile.verifiedProgram?.enrolled ? "border-white/10 bg-white/5" : "border-slate-200 bg-white"}`}>
                  <div className="flex items-start gap-3">
                    <div className={`rounded-xl p-2.5 ${premiumProfile.verifiedProgram?.enrolled ? "bg-white/10" : "bg-emerald-50"}`}>
                      <ShieldCheck className={`h-4 w-4 ${premiumProfile.verifiedProgram?.enrolled ? "text-emerald-300" : "text-emerald-700"}`} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className={`text-sm font-bold ${premiumProfile.verifiedProgram?.enrolled ? "text-white" : "text-slate-900"}`}>{item.title}</h4>
                        <span className={`rounded-full px-2 py-0.5 text-[10px] font-black uppercase tracking-[0.2em] ${(premiumProfile.verifiedProgram?.[item.key]) ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-500"}`}>
                          {premiumProfile.verifiedProgram?.[item.key] ? "Approved" : "Pending"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 flex flex-col gap-4 md:flex-row">
              <button
                type="button"
                onClick={() =>
                  handlePremiumChange({
                    verifiedBadge: true,
                    verifiedProgram: {
                      enrolled: true,
                      annualFee: 499,
                      identityVerified: true,
                      portfolioVerified: true,
                      higherSearchRanking: true,
                      clientTrustBoost: true,
                    },
                  })
                }
                className={`rounded-2xl px-5 py-3 text-xs font-black uppercase tracking-[0.2em] transition-all ${premiumProfile.verifiedProgram?.enrolled ? "bg-white text-slate-950" : "bg-emerald-600 text-white hover:bg-emerald-700"}`}
              >
                {premiumProfile.verifiedProgram?.enrolled ? "Verified Enrolled" : "Activate Verification"}
              </button>
              {premiumProfile.verifiedProgram?.enrolled && (
                <button
                  type="button"
                  onClick={() =>
                    handlePremiumChange({
                      verifiedBadge: false,
                      verifiedProgram: {
                        enrolled: false,
                        annualFee: 499,
                        identityVerified: false,
                        portfolioVerified: false,
                        higherSearchRanking: false,
                        clientTrustBoost: false,
                      },
                    })
                  }
                  className="rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-xs font-black uppercase tracking-[0.2em] text-white transition-all hover:bg-white/10"
                >
                  Remove Verification
                </button>
              )}
            </div>
          </div>
        )}

        {profile.role === "freelancer" && (
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
                onClick={() => resumeInputRef.current?.click()}
                className="px-4 py-2 bg-indigo-600 text-white text-xs font-bold rounded-xl hover:bg-indigo-700 transition-all shadow-md shadow-indigo-200 flex items-center gap-2"
              >
                <FileText className="w-3 h-3" />
                Upload PDF
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

        {profile.role === "freelancer" && (
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

        {profile.role === "freelancer" && (
          <div className="pt-6 border-t border-slate-100">
            <PortfolioManager
              items={profile.portfolio || []}
              onAdd={addPortfolioItemLocal}
              onUpdate={updatePortfolioItemLocal}
              onRemove={removePortfolioItemLocal}
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

      <AIAgent 
        isOpen={showAIAgent}
        onClose={() => setShowAIAgent(false)}
        mode="resume-parse"
        targetData={{}}
        onComplete={handleAIParseComplete}
      />
    </div>
  );
}

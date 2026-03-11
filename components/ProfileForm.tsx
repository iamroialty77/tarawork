"use client";

import { UserProfile, FreelancerCategory, PortfolioItem } from "../types";
import { useState, useEffect, useRef } from "react";
import {
  Camera,
  User,
  FileText,
  Sparkles,
  ShieldCheck,
  Globe,
  BarChart3,
  Video,
  Star,
  FolderKanban,
  Crown,
  Briefcase,
  Settings2,
} from "lucide-react";
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

type TabKey = "basics" | "professional" | "premium" | "portfolio";

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
  const [activeTab, setActiveTab] = useState<TabKey>("basics");
  const [checkoutLoading, setCheckoutLoading] = useState<"pro" | "verification" | null>(null);
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
  const isFreelancer = profile.role === "freelancer";

  // Sync internal state when prop changes (after fetch)
  useEffect(() => {
    setProfile(initialProfile);
  }, [initialProfile]);

  useEffect(() => {
    if (!isFreelancer && (activeTab === "premium" || activeTab === "portfolio")) {
      setActiveTab("professional");
    }
  }, [activeTab, isFreelancer]);

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

  const startCheckout = async (productType: "pro" | "verification") => {
    if (!profile.id) {
      window.alert("Save your profile first so the payment can be linked to your account.");
      return;
    }

    setCheckoutLoading(productType);

    try {
      const response = await fetch("/api/paymongo/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productType,
          userId: profile.id,
          email: undefined,
          name: profile.name,
        }),
      });

      const payload = await response.json();

      if (!response.ok || !payload.checkoutUrl) {
        throw new Error(payload.error || "Unable to start checkout.");
      }

      window.location.href = payload.checkoutUrl;
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to start checkout.";
      window.alert(message);
    } finally {
      setCheckoutLoading(null);
    }
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

  const tabs: Array<{ key: TabKey; label: string; icon: typeof User }> = isFreelancer
    ? [
        { key: "basics", label: "Basics", icon: User },
        { key: "professional", label: "Professional", icon: Briefcase },
        { key: "premium", label: "Premium", icon: Crown },
        { key: "portfolio", label: "Portfolio", icon: FolderKanban },
      ]
    : [
        { key: "basics", label: "Basics", icon: User },
        { key: "professional", label: "Company", icon: Settings2 },
      ];

  const inputClassName =
    "w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 transition-all placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-100";
  const labelClassName =
    "mb-2 block text-[11px] font-bold uppercase tracking-[0.18em] text-slate-500";

  return (
    <div className="rounded-[2rem] border border-slate-200 bg-white p-4 shadow-xl shadow-slate-200/40 sm:p-6">
      <div className="rounded-[1.75rem] border border-slate-200 bg-gradient-to-br from-slate-50 via-white to-indigo-50/40 p-5 sm:p-6">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-start gap-4">
            <div className="relative shrink-0">
              <div className="h-20 w-20 overflow-hidden rounded-3xl bg-gradient-to-tr from-indigo-500 to-sky-500 p-1 shadow-lg">
                {profile.avatar_url ? (
                  <img src={profile.avatar_url} alt="Profile" className="h-full w-full rounded-[1.15rem] object-cover" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center rounded-[1.15rem] bg-white">
                    <User className="h-8 w-8 text-slate-300" />
                  </div>
                )}
              </div>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute -bottom-1 -right-1 flex h-9 w-9 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-600 shadow-md transition-all hover:scale-105 hover:text-indigo-600"
              >
                <Camera className="h-4 w-4" />
              </button>
              <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageUpload} />
            </div>

            <div className="space-y-2">
              <div className="inline-flex items-center rounded-full border border-slate-200 bg-white px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                {isFreelancer ? "Freelancer profile" : "Client profile"}
              </div>
              <div>
                <h2 className="text-2xl font-bold tracking-tight text-slate-950">{profile.name || "Set your profile"}</h2>
                <p className="mt-1 max-w-xl text-sm leading-6 text-slate-600">
                  Mas malinis na editor na hiwalay ang bawat group ng details para hindi crowded.
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:min-w-[280px]">
            <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3">
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400">Profile URL</p>
              <p className="mt-2 truncate text-sm font-semibold text-slate-800">
                {(typeof window !== "undefined" ? window.location.host : "tarawork.network")}/{profile.username || "username"}
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3">
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400">Status</p>
              <p className="mt-2 text-sm font-semibold text-slate-800">
                {isSaving ? "Saving..." : isFreelancer ? "Open to work" : "Ready to hire"}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key)}
              className={`inline-flex items-center gap-2 rounded-2xl px-4 py-2.5 text-sm font-semibold transition-all ${
                isActive
                  ? "bg-slate-900 text-white shadow-lg shadow-slate-900/15"
                  : "border border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:text-slate-900"
              }`}
            >
              <Icon className="h-4 w-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      <form onSubmit={handleSubmit} className="mt-5 space-y-5">
        {activeTab === "basics" && (
          <div className="rounded-3xl border border-slate-200 bg-slate-50/70 p-5 sm:p-6">
            <div className="mb-5">
              <h3 className="text-lg font-bold text-slate-950">Basic information</h3>
              <p className="text-sm text-slate-500">Core details na unang makikita sa profile mo.</p>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className={labelClassName}>Portfolio Username</label>
                <div className="flex overflow-hidden rounded-2xl border border-slate-200 bg-white">
                  <span className="border-r border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-500">
                    {typeof window !== "undefined" ? window.location.host : "tarawork.network"}/
                  </span>
                  <input
                    type="text"
                    placeholder="username"
                    className="min-w-0 flex-1 px-4 py-3 text-sm text-slate-900 outline-none"
                    value={profile.username || ""}
                    onChange={(e) => setProfile({ ...profile, username: e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, "") })}
                  />
                </div>
              </div>

              <div>
                <label className={labelClassName}>Account Role</label>
                <select
                  className={inputClassName}
                  value={profile.role}
                  onChange={(e) => handleFieldChange({ role: e.target.value as "freelancer" | "employer" })}
                >
                  <option value="freelancer">Freelancer</option>
                  <option value="employer">Client</option>
                </select>
              </div>

              <div>
                <label className={labelClassName}>Full Name</label>
                <input
                  type="text"
                  className={inputClassName}
                  value={profile.name}
                  onChange={(e) => handleFieldChange({ name: e.target.value })}
                />
              </div>

              <div className="sm:col-span-2">
                <label className={labelClassName}>Short Bio</label>
                <textarea
                  className={inputClassName}
                  rows={4}
                  value={profile.bio}
                  onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === "professional" && (
          <div className="space-y-5">
            <div className="rounded-3xl border border-slate-200 bg-slate-50/70 p-5 sm:p-6">
              <div className="mb-5">
                <h3 className="text-lg font-bold text-slate-950">{isFreelancer ? "Professional details" : "Company details"}</h3>
                <p className="text-sm text-slate-500">
                  {isFreelancer
                    ? "Skills, category, at work identity na mas important sa hiring."
                    : "Impormasyon ng business para mas credible at presentable tingnan."}
                </p>
              </div>

              {profile.role === "employer" ? (
                <div>
                  <label className={labelClassName}>Company Name</label>
                  <input
                    type="text"
                    placeholder="e.g. TechCorp Solutions"
                    className={inputClassName}
                    value={profile.companyName || ""}
                    onChange={(e) => handleFieldChange({ companyName: e.target.value })}
                  />
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className={labelClassName}>Category</label>
                    <select
                      className={inputClassName}
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
                    <label className={labelClassName}>Hourly Rate</label>
                    <input
                      type="text"
                      className={inputClassName}
                      value={profile.hourlyRate}
                      onChange={(e) => setProfile({ ...profile, hourlyRate: e.target.value })}
                    />
                  </div>
                </div>
              )}
            </div>

            {isFreelancer && (
              <>
                <div className="rounded-3xl border border-indigo-200 bg-gradient-to-br from-indigo-50 via-white to-sky-50 p-5 sm:p-6">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-start gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-md shadow-indigo-200">
                        <Sparkles className="h-5 w-5" />
                      </div>
                      <div>
                        <h4 className="text-base font-bold text-slate-950">AI Resume Parser</h4>
                        <p className="text-sm text-slate-600">Upload PDF para auto-fill ang profile at skills mo.</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => resumeInputRef.current?.click()}
                      className="inline-flex items-center gap-2 rounded-2xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white transition-all hover:bg-indigo-700"
                    >
                      <FileText className="h-4 w-4" />
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

                <div className="rounded-3xl border border-slate-200 bg-slate-50/70 p-5 sm:p-6">
                  <div className="mb-4">
                    <h4 className="text-base font-bold text-slate-950">Skills</h4>
                    <p className="text-sm text-slate-500">Panatilihing concise at relevant ang listahan.</p>
                  </div>
                  <div className="flex flex-col gap-3 sm:flex-row">
                    <input
                      type="text"
                      className={inputClassName}
                      value={skillInput}
                      onChange={(e) => setSkillInput(e.target.value)}
                      placeholder="e.g. React"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          addSkill();
                        }
                      }}
                    />
                    <button
                      type="button"
                      onClick={addSkill}
                      className="rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition-all hover:bg-black"
                    >
                      Add Skill
                    </button>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {profile.skills.map((skill) => (
                      <span
                        key={skill}
                        className="inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-white px-3 py-1.5 text-xs font-semibold text-indigo-700"
                      >
                        {skill}
                        <button
                          type="button"
                          onClick={() => removeSkill(skill)}
                          className="text-indigo-400 transition-colors hover:text-indigo-700"
                        >
                          &times;
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {activeTab === "premium" && isFreelancer && (
          <div className={`rounded-[2rem] border p-6 transition-all duration-300 ${isPro ? "border-slate-900 bg-gradient-to-br from-slate-950 via-slate-900 to-amber-950 text-white shadow-2xl shadow-slate-900/20" : "border-amber-200 bg-gradient-to-br from-amber-50 via-white to-orange-50 shadow-lg shadow-amber-100/50"}`}>
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
              <div className="space-y-2">
                <div className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-[0.25em] ${isPro ? "border border-white/10 bg-white/10 text-amber-300" : "border border-amber-200 bg-white text-amber-700"}`}>
                  <Star className="h-3.5 w-3.5" />
                  {isPro ? "Freelancer Pro Active" : "Freelancer Pro"}
                </div>
                <h3 className={`text-xl font-black ${isPro ? "text-white" : "text-slate-900"}`}>Profile upgrade</h3>
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
                  onClick={() => {
                    if (premiumProfile.tier !== "pro") {
                      void startCheckout("pro");
                    }
                  }}
                  disabled={premiumProfile.tier === "pro" || checkoutLoading === "pro"}
                  className={`mt-4 w-full rounded-xl px-4 py-2 text-xs font-black uppercase tracking-[0.2em] transition-all disabled:cursor-not-allowed disabled:opacity-70 ${premiumProfile.tier === "pro" ? "bg-white text-slate-950" : "bg-amber-500 text-slate-950 hover:bg-amber-400"}`}
                >
                  {premiumProfile.tier === "pro" ? "Current: Pro" : checkoutLoading === "pro" ? "Redirecting..." : "Pay with PayMongo"}
                </button>
              </div>
            </div>

            <div className="mt-6 grid gap-3 md:grid-cols-4">
              {[
                { icon: ShieldCheck, title: "Badge", enabled: !!premiumProfile.verifiedBadge },
                { icon: Globe, title: "Domain", enabled: !!premiumProfile.customDomain },
                { icon: BarChart3, title: "Analytics", enabled: !!premiumProfile.analyticsEnabled },
                { icon: Video, title: "Video", enabled: !!premiumProfile.videoIntroUrl },
              ].map((item) => (
                <div key={item.title} className={`rounded-2xl border px-4 py-4 ${isPro ? "border-white/10 bg-white/5" : "border-slate-200 bg-white"}`}>
                  <item.icon className={`h-4 w-4 mb-3 ${isPro ? "text-amber-300" : "text-slate-700"}`} />
                  <div className="flex items-center justify-between gap-2">
                    <h4 className={`text-sm font-bold ${isPro ? "text-white" : "text-slate-900"}`}>{item.title}</h4>
                    <span className={`rounded-full px-2 py-0.5 text-[10px] font-black uppercase tracking-[0.2em] ${item.enabled ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-500"}`}>
                      {item.enabled ? "On" : "Off"}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {isPro && (
              <div className="mt-6 grid grid-cols-3 gap-3">
                <div className="rounded-2xl bg-white p-4 text-slate-900">
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Views</p>
                  <p className="mt-2 text-2xl font-black">{premiumProfile.analytics?.profileViews || 0}</p>
                </div>
                <div className="rounded-2xl bg-white p-4 text-slate-900">
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Clicks</p>
                  <p className="mt-2 text-2xl font-black">{premiumProfile.analytics?.clientClicks || 0}</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-white">
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Domain</p>
                  <p className="mt-2 text-sm font-bold truncate">{premiumProfile.customDomain || "roi.tarawork.ph"}</p>
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

            {premiumProfile.tier !== "pro" && (
              <p className="mt-6 text-sm text-slate-600">
                Pro activation now happens after a successful PayMongo payment and webhook confirmation.
              </p>
            )}
          </div>
        )}

        {activeTab === "premium" && isFreelancer && (
          <div className={`rounded-[2rem] border p-6 transition-all duration-300 ${premiumProfile.verifiedProgram?.enrolled ? "border-emerald-300 bg-gradient-to-br from-emerald-950 via-slate-950 to-slate-900 text-white shadow-2xl shadow-emerald-900/20" : "border-emerald-200 bg-gradient-to-br from-emerald-50 via-white to-teal-50"}`}>
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
              <div className="space-y-2">
                <div className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-[0.25em] ${premiumProfile.verifiedProgram?.enrolled ? "border border-white/10 bg-white/10 text-emerald-300" : "border border-emerald-200 bg-white text-emerald-700"}`}>
                  <ShieldCheck className="h-3.5 w-3.5" />
                  {premiumProfile.verifiedProgram?.enrolled ? "Verified Program Active" : "Verified Freelancer Program"}
                </div>
                <h3 className={`text-xl font-black ${premiumProfile.verifiedProgram?.enrolled ? "text-white" : "text-slate-900"}`}>Verification</h3>
              </div>
              <div className={`rounded-2xl px-4 py-3 ${premiumProfile.verifiedProgram?.enrolled ? "bg-white/10 border border-white/10" : "bg-emerald-600 text-white"}`}>
                <p className="text-[10px] font-black uppercase tracking-[0.25em] text-emerald-200">Annual Fee</p>
                <p className="mt-1 text-lg font-black">P499/year</p>
              </div>
            </div>

            <div className="mt-6 grid gap-3 md:grid-cols-4">
              {[
                { title: "Verified identity", key: "identityVerified" as const },
                { title: "Verified portfolio", key: "portfolioVerified" as const },
                { title: "Higher search ranking", key: "higherSearchRanking" as const },
                { title: "Client trust boost", key: "clientTrustBoost" as const },
              ].map((item) => (
                <div key={item.title} className={`rounded-2xl border p-4 ${premiumProfile.verifiedProgram?.enrolled ? "border-white/10 bg-white/5" : "border-slate-200 bg-white"}`}>
                  <ShieldCheck className={`h-4 w-4 mb-3 ${premiumProfile.verifiedProgram?.enrolled ? "text-emerald-300" : "text-emerald-700"}`} />
                  <h4 className={`text-sm font-bold ${premiumProfile.verifiedProgram?.enrolled ? "text-white" : "text-slate-900"}`}>{item.title}</h4>
                </div>
              ))}
            </div>

            <div className="mt-6 flex flex-col gap-4 md:flex-row">
              <button
                type="button"
                onClick={() => {
                  if (!premiumProfile.verifiedProgram?.enrolled) {
                    void startCheckout("verification");
                  }
                }}
                disabled={!!premiumProfile.verifiedProgram?.enrolled || checkoutLoading === "verification"}
                className={`rounded-2xl px-5 py-3 text-xs font-black uppercase tracking-[0.2em] transition-all disabled:cursor-not-allowed disabled:opacity-70 ${premiumProfile.verifiedProgram?.enrolled ? "bg-white text-slate-950" : "bg-emerald-600 text-white hover:bg-emerald-700"}`}
              >
                {premiumProfile.verifiedProgram?.enrolled ? "Verified Enrolled" : checkoutLoading === "verification" ? "Redirecting..." : "Pay for Verification"}
              </button>
            </div>
            {!premiumProfile.verifiedProgram?.enrolled && (
              <p className="text-sm text-slate-600">
                Verification status is updated only after PayMongo confirms payment through your webhook endpoint.
              </p>
            )}
          </div>
        )}

        {activeTab === "portfolio" && isFreelancer && (
          <div className="rounded-3xl border border-slate-200 bg-slate-50/70 p-5 sm:p-6">
            <div className="mb-5">
              <h3 className="text-lg font-bold text-slate-950">Portfolio</h3>
              <p className="text-sm text-slate-500">Projects at work samples sa hiwalay na panel para mas malinis ang page.</p>
            </div>
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

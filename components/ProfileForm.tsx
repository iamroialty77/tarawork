"use client";

import { UserProfile, FreelancerCategory, PortfolioItem, ExperienceItem, ServiceOffering } from "../types";
import { useState, useEffect, useRef } from "react";
import {
  User,
  FileText,
  Sparkles,
  FolderKanban,
  Briefcase,
  Settings2,
} from "lucide-react";
import PortfolioManager from "./PortfolioManager";
import AIAgent from "./AIAgent";
import TooltipAction from "@/components/ui/TooltipAction";

interface ProfileFormProps {
  initialProfile: UserProfile;
  onUpdate: (profile: UserProfile) => void;
  onAddPortfolio?: (item: Partial<PortfolioItem>) => void;
  onUpdatePortfolio?: (item: PortfolioItem) => void;
  onRemovePortfolio?: (id: string) => void;
  isSaving?: boolean;
}

type TabKey = "basics" | "professional" | "portfolio";

const ABOUT_SECTION_MAX = 200;
const MAX_SERVICES = 6;
const EMPTY_ABOUT_SECTIONS = {
  whoIHelp: "",
  whatISpecializeIn: "",
  resultsIHaveDelivered: "",
  howIWork: "",
};
const DEFAULT_SERVICE_ENTRY: ServiceOffering = {
  serviceName: "",
  startingPrice: 0,
  currency: "PHP",
  typicalTurnaround: "",
};
const SERVICE_CURRENCIES = ["PHP", "USD", "EUR", "SGD", "AUD"];

const normalizeAboutSections = (profile: UserProfile) => {
  const sections = profile.aboutSections || EMPTY_ABOUT_SECTIONS;
  return {
    whoIHelp: (sections.whoIHelp || "").slice(0, ABOUT_SECTION_MAX),
    whatISpecializeIn: (sections.whatISpecializeIn || profile.bio || "").slice(0, ABOUT_SECTION_MAX),
    resultsIHaveDelivered: (sections.resultsIHaveDelivered || "").slice(0, ABOUT_SECTION_MAX),
    howIWork: (sections.howIWork || "").slice(0, ABOUT_SECTION_MAX),
  };
};

const normalizeServices = (services: ServiceOffering[] | undefined): ServiceOffering[] => {
  if (!Array.isArray(services)) return [];
  return services
    .map((service) => {
      const serviceName = (service?.serviceName || "").trim();
      if (!serviceName) return null;
      const currency = (service?.currency || "PHP").trim() || "PHP";
      const startingPrice = Number.isFinite(service?.startingPrice)
        ? Math.max(0, Number(service.startingPrice))
        : 0;
      return {
        serviceName,
        startingPrice,
        currency,
        typicalTurnaround: (service?.typicalTurnaround || "").trim(),
      };
    })
    .filter((service): service is ServiceOffering => !!service)
    .slice(0, MAX_SERVICES);
};

export default function ProfileForm({ 
  initialProfile, 
  onUpdate, 
  onAddPortfolio,
  onUpdatePortfolio,
  onRemovePortfolio,
  isSaving = false 
}: ProfileFormProps) {
  const [profile, setProfile] = useState<UserProfile>(() => {
    const aboutSections = normalizeAboutSections(initialProfile);
    return {
      ...initialProfile,
      aboutSections,
      servicesOffered: normalizeServices(initialProfile.servicesOffered),
      bio: aboutSections.whatISpecializeIn || initialProfile.bio,
    };
  });
  const [skillInput, setSkillInput] = useState("");
  const [showAIAgent, setShowAIAgent] = useState(false);
  const [resumeParseFile, setResumeParseFile] = useState<File | null>(null);
  const [experienceInput, setExperienceInput] = useState({
    company: "",
    role: "",
    duration: "",
    description: "",
  });
  const [activeTab, setActiveTab] = useState<TabKey>("basics");
  const [serviceInput, setServiceInput] = useState<ServiceOffering>(DEFAULT_SERVICE_ENTRY);
  const resumeInputRef = useRef<HTMLInputElement>(null);
  const isFreelancer = profile.role === "freelancer";

  // Sync internal state when prop changes (after fetch)
  useEffect(() => {
    const aboutSections = normalizeAboutSections(initialProfile);
    setProfile({
      ...initialProfile,
      aboutSections,
      servicesOffered: normalizeServices(initialProfile.servicesOffered),
      bio: aboutSections.whatISpecializeIn || initialProfile.bio,
    });
  }, [initialProfile]);

  useEffect(() => {
    if (!isFreelancer && activeTab === "portfolio") {
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

  const addExperience = () => {
    const role = experienceInput.role.trim();
    const description = experienceInput.description.trim();
    if (!role || !description) return;

    const newExperience: ExperienceItem = {
      id: `exp-${Math.random().toString(36).slice(2, 9)}`,
      company: experienceInput.company.trim() || "Company",
      role,
      duration: experienceInput.duration.trim() || "Not specified",
      description,
    };

    setProfile({
      ...profile,
      experience: [...(profile.experience || []), newExperience],
    });

    setExperienceInput({
      company: "",
      role: "",
      duration: "",
      description: "",
    });
  };

  const removeExperience = (id: string) => {
    setProfile({
      ...profile,
      experience: (profile.experience || []).filter((item) => item.id !== id),
    });
  };

  const handleBioChange = (value: string) => {
    const trimmed = value.slice(0, ABOUT_SECTION_MAX * 3);
    setProfile({
      ...profile,
      bio: trimmed,
      aboutSections: {
        ...(profile.aboutSections || EMPTY_ABOUT_SECTIONS),
        whatISpecializeIn: trimmed,
      },
    });
  };

  const addServiceEntry = () => {
    const serviceName = serviceInput.serviceName.trim();
    const typicalTurnaround = serviceInput.typicalTurnaround.trim();
    const startingPrice = Number.isFinite(serviceInput.startingPrice)
      ? Math.max(0, Number(serviceInput.startingPrice))
      : 0;
    if (!serviceName) return;

    const currentServices = normalizeServices(profile.servicesOffered);
    if (currentServices.length >= MAX_SERVICES) return;

    setProfile({
      ...profile,
      servicesOffered: [
        ...currentServices,
        {
          serviceName,
          startingPrice,
          currency: serviceInput.currency || "PHP",
          typicalTurnaround,
        },
      ],
    });
    setServiceInput(DEFAULT_SERVICE_ENTRY);
  };

  const updateServiceEntry = (
    index: number,
    field: keyof ServiceOffering,
    value: string | number,
  ) => {
    const currentServices = normalizeServices(profile.servicesOffered);
    if (!currentServices[index]) return;

    const nextServices = currentServices.map((service, idx) => {
      if (idx !== index) return service;
      if (field === "startingPrice") {
        const parsed = typeof value === "number" ? value : Number(value);
        return {
          ...service,
          startingPrice: Number.isFinite(parsed) ? Math.max(0, parsed) : 0,
        };
      }
      return {
        ...service,
        [field]: String(value),
      };
    });
    setProfile({ ...profile, servicesOffered: nextServices });
  };

  const removeServiceEntry = (index: number) => {
    const currentServices = normalizeServices(profile.servicesOffered);
    setProfile({
      ...profile,
      servicesOffered: currentServices.filter((_, idx) => idx !== index),
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

  const handleResumeUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Use AI Agent for professional parsing experience
    setResumeParseFile(file);
    setShowAIAgent(true);
    if (resumeInputRef.current) resumeInputRef.current.value = "";
  };

  const handleAIParseComplete = (data: { 
    name?: string; 
    bio?: string; 
    skills?: string[]; 
    category?: FreelancerCategory; 
    experience?: Array<Partial<ExperienceItem>>;
    portfolio?: Array<Partial<PortfolioItem>>
  }) => {
    const existingPortfolioKeys = new Set(
      (profile.portfolio || []).map(
        (item) =>
          `${(item.title || "").trim().toLowerCase()}::${(item.description || "").trim().toLowerCase()}`,
      ),
    );

    const normalizedPortfolioItems: PortfolioItem[] = (data.portfolio || [])
      .reduce<PortfolioItem[]>((acc, item) => {
        const title = (item.title || "").trim();
        const description = (item.description || "").trim();
        if (!title || !description) return acc;

        const normalizedItem: PortfolioItem = {
          id: item.id && String(item.id).trim() ? String(item.id).trim() : `p-${Math.random().toString(36).slice(2, 10)}`,
          profile_id: profile.id || item.profile_id || "",
          title,
          description,
          technologies: Array.isArray(item.technologies)
            ? Array.from(new Set(item.technologies.map((tech) => String(tech).trim()).filter(Boolean))).slice(0, 12)
            : [],
          created_at: item.created_at && String(item.created_at).trim()
            ? String(item.created_at)
            : new Date().toISOString(),
        };
        const projectUrl = (item.project_url || "").trim();
        if (projectUrl) {
          normalizedItem.project_url = projectUrl;
        }
        acc.push(normalizedItem);
        return acc;
      }, []);

    const newPortfolioItems = normalizedPortfolioItems.filter((item) => {
      const dedupeKey = `${item.title.trim().toLowerCase()}::${item.description.trim().toLowerCase()}`;
      return !existingPortfolioKeys.has(dedupeKey);
    });

    const existingExperienceKeys = new Set(
      (profile.experience || []).map(
        (item) =>
          `${(item.role || "").trim().toLowerCase()}::${(item.company || "").trim().toLowerCase()}::${(item.description || "")
            .trim()
            .toLowerCase()}`,
      ),
    );

    const normalizedExperienceItems: ExperienceItem[] = (data.experience || [])
      .reduce<ExperienceItem[]>((acc, item) => {
        const role = (item.role || "").trim();
        const description = (item.description || "").trim();
        if (!role || !description) return acc;

        acc.push({
          id: item.id && String(item.id).trim() ? String(item.id).trim() : `exp-${Math.random().toString(36).slice(2, 10)}`,
          company: (item.company || "").trim() || "Company",
          role,
          duration: (item.duration || "").trim() || "Not specified",
          description,
        });
        return acc;
      }, []);

    const newExperienceItems = normalizedExperienceItems.filter((item) => {
      const dedupeKey = `${item.role.trim().toLowerCase()}::${item.company.trim().toLowerCase()}::${item.description
        .trim()
        .toLowerCase()}`;
      return !existingExperienceKeys.has(dedupeKey);
    });

    const updatedProfile = {
      ...profile,
      name: data.name || profile.name,
      bio: data.bio || profile.bio,
      aboutSections: {
        ...(profile.aboutSections || EMPTY_ABOUT_SECTIONS),
        whatISpecializeIn: (data.bio || profile.aboutSections?.whatISpecializeIn || profile.bio || "").slice(0, ABOUT_SECTION_MAX),
      },
      skills: Array.from(new Set([...profile.skills, ...(data.skills || []).map((skill) => String(skill).trim()).filter(Boolean)])),
      category: data.category || profile.category,
      experience: [...(profile.experience || []), ...newExperienceItems],
      portfolio: [...(profile.portfolio || []), ...newPortfolioItems]
    };
    
    setProfile(updatedProfile);
    onUpdate(updatedProfile);
    
    // Also notify if there are parent handlers for individual portfolio additions
    if (newPortfolioItems.length > 0 && onAddPortfolio) {
      newPortfolioItems.forEach((item: PortfolioItem) => onAddPortfolio(item));
    }
    
    setResumeParseFile(null);
    setShowAIAgent(false);
  };

  const tabs: Array<{ key: TabKey; label: string; icon: typeof User }> = isFreelancer
    ? [
        { key: "basics", label: "Basics", icon: User },
        { key: "portfolio", label: "Portfolio", icon: FolderKanban },
        { key: "professional", label: "Professional", icon: Briefcase },
      ]
    : [
        { key: "basics", label: "Basics", icon: User },
        { key: "professional", label: "Company", icon: Settings2 },
      ];

  const inputClassName =
    "w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 transition-all placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-100";
  const labelClassName =
    "mb-2 block text-[11px] font-bold uppercase tracking-[0.18em] text-slate-500";
  const servicesOffered = normalizeServices(profile.servicesOffered);
  const applicationProfile = profile.aiInsights?.applicationProfile || {};
  const sectionCardClassName = "rounded-3xl border border-slate-200 bg-slate-50/70 p-5 sm:p-6";

  const handleApplicationProfileChange = (
    field: "resumeUrl" | "portfolioUrl" | "interviewUrl" | "coverLetter",
    value: string,
  ) => {
    setProfile({
      ...profile,
      aiInsights: {
        ...(profile.aiInsights || {
          gapAnalysis: [],
          compatibilityScore: 0,
          cultureMatch: [],
        }),
        applicationProfile: {
          ...applicationProfile,
          [field]: value,
        },
      },
    });
  };

  return (
    <div className="rounded-[2rem] border border-slate-200 bg-white p-4 shadow-xl shadow-slate-200/40 sm:p-6">
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
            <div className="mb-5 flex items-center justify-between gap-3">
              <h3 className="text-lg font-bold text-slate-950">Basic information</h3>
              <TooltipAction label="Basic information help" tooltip="These are the main details shown first on your profile." />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <div className="mb-2 flex items-center justify-between gap-3">
                  <label className={labelClassName}>Professional Profile URL</label>
                  {isFreelancer && (
                    <button
                      type="button"
                      onClick={() => setActiveTab("portfolio")}
                      className="text-[11px] font-bold text-indigo-600 hover:text-indigo-700"
                    >
                      Open Portfolio
                    </button>
                  )}
                </div>
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
                <div className="mt-2 text-sm font-medium text-slate-600">
                  /{profile.username || "your-name"}
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
                <div className="mb-2 flex items-center justify-between gap-3">
                  <label className={labelClassName}>Bio</label>
                  <span className="text-[11px] font-bold text-slate-400">
                    {(profile.bio || "").length}/{ABOUT_SECTION_MAX * 3}
                  </span>
                </div>
                <textarea
                  className={inputClassName}
                  rows={5}
                  maxLength={ABOUT_SECTION_MAX * 3}
                  placeholder="Write a clear professional summary: who you help, what you do well, and the kind of work you want."
                  value={profile.bio || ""}
                  onChange={(e) => handleBioChange(e.target.value)}
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === "professional" && (
          <div className="space-y-5">
            <div className={sectionCardClassName}>
              <div className="mb-5 flex items-center justify-between gap-3">
                <h3 className="text-lg font-bold text-slate-950">{isFreelancer ? "Professional details" : "Company details"}</h3>
                <TooltipAction
                  label="Professional details help"
                  tooltip={
                    isFreelancer
                      ? "Use this area for hiring-facing details such as category, rate, skills, experience, and saved application extras."
                      : "Use this area for core company information and business presentation details."
                  }
                />
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
                      </div>
                    </div>
                    <TooltipAction label="Resume parser help" tooltip="Upload a PDF resume to extract profile details, skills, experience, and portfolio drafts." />
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

                <div className={sectionCardClassName}>
                  <div className="mb-4 flex items-center justify-between gap-3">
                    <h4 className="text-base font-bold text-slate-950">Application Extras</h4>
                    <TooltipAction label="Application extras help" tooltip="These optional links can be attached to applications when available. They do not block applying." />
                  </div>
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <label className={labelClassName}>Resume URL (Optional)</label>
                      <input
                        type="url"
                        placeholder="https://drive.google.com/your-resume"
                        className={inputClassName}
                        value={applicationProfile.resumeUrl || ""}
                        onChange={(e) => handleApplicationProfileChange("resumeUrl", e.target.value)}
                      />
                    </div>
                    <div>
                      <label className={labelClassName}>Portfolio URL (Optional)</label>
                      <input
                        type="url"
                        placeholder="https://github.com/your-portfolio"
                        className={inputClassName}
                        value={applicationProfile.portfolioUrl || ""}
                        onChange={(e) => handleApplicationProfileChange("portfolioUrl", e.target.value)}
                      />
                    </div>
                    <div>
                      <label className={labelClassName}>Interview Link (Optional)</label>
                      <input
                        type="url"
                        placeholder="https://loom.com/your-intro"
                        className={inputClassName}
                        value={applicationProfile.interviewUrl || ""}
                        onChange={(e) => handleApplicationProfileChange("interviewUrl", e.target.value)}
                      />
                    </div>
                    <div>
                      <label className={labelClassName}>Default Cover Letter (Optional)</label>
                      <textarea
                        rows={3}
                        placeholder="Short intro na automatic kasama sa applications mo."
                        className={inputClassName}
                        value={applicationProfile.coverLetter || ""}
                        onChange={(e) => handleApplicationProfileChange("coverLetter", e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                <div className={sectionCardClassName}>
                  <div className="mb-4 flex items-center justify-between gap-3">
                    <h4 className="text-base font-bold text-slate-950">Skills</h4>
                    <TooltipAction label="Skills help" tooltip="Add the skills you want employers to see and that jobs should match against." />
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

                <div className={sectionCardClassName}>
                  <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <h4 className="text-base font-bold text-slate-950">Services Offered</h4>
                      <TooltipAction label="Services help" tooltip="Add up to 6 service packages with a starting price and typical turnaround." />
                    </div>
                    <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-[11px] font-bold uppercase tracking-[0.16em] text-slate-500">
                      {servicesOffered.length}/{MAX_SERVICES}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 gap-3 md:grid-cols-6">
                    <div className="md:col-span-2">
                      <input
                        type="text"
                        className={inputClassName}
                        placeholder="Service Name (e.g. Landing Page Build)"
                        value={serviceInput.serviceName}
                        onChange={(e) => setServiceInput((prev) => ({ ...prev, serviceName: e.target.value }))}
                      />
                    </div>
                    <div>
                      <input
                        type="number"
                        min={0}
                        className={inputClassName}
                        placeholder="Starting Price"
                        value={serviceInput.startingPrice}
                        onChange={(e) => setServiceInput((prev) => ({ ...prev, startingPrice: Number(e.target.value) || 0 }))}
                      />
                    </div>
                    <div>
                      <select
                        className={inputClassName}
                        value={serviceInput.currency}
                        onChange={(e) => setServiceInput((prev) => ({ ...prev, currency: e.target.value }))}
                      >
                        {SERVICE_CURRENCIES.map((currency) => (
                          <option key={currency} value={currency}>
                            {currency}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="md:col-span-2">
                      <input
                        type="text"
                        className={inputClassName}
                        placeholder="Typical Turnaround (e.g. 3-5 days)"
                        value={serviceInput.typicalTurnaround}
                        onChange={(e) => setServiceInput((prev) => ({ ...prev, typicalTurnaround: e.target.value }))}
                      />
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={addServiceEntry}
                    disabled={servicesOffered.length >= MAX_SERVICES}
                    className="mt-3 rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition-all hover:bg-black disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Add Service
                  </button>

                  <div className="mt-4 space-y-3">
                    {servicesOffered.length === 0 && (
                      <div className="rounded-2xl border border-dashed border-slate-200 bg-white px-4 py-5 text-sm font-medium text-slate-500">
                        No services added.
                      </div>
                    )}
                    {servicesOffered.map((service, index) => (
                      <div key={`${service.serviceName}-${index}`} className="rounded-2xl border border-slate-200 bg-white p-4">
                        <div className="grid grid-cols-1 gap-3 md:grid-cols-6">
                          <div className="md:col-span-2">
                            <label className={labelClassName}>Service Name</label>
                            <input
                              type="text"
                              className={inputClassName}
                              value={service.serviceName}
                              onChange={(e) => updateServiceEntry(index, "serviceName", e.target.value)}
                            />
                          </div>
                          <div>
                            <label className={labelClassName}>Starting Price</label>
                            <input
                              type="number"
                              min={0}
                              className={inputClassName}
                              value={service.startingPrice}
                              onChange={(e) => updateServiceEntry(index, "startingPrice", e.target.value)}
                            />
                          </div>
                          <div>
                            <label className={labelClassName}>Currency</label>
                            <select
                              className={inputClassName}
                              value={service.currency}
                              onChange={(e) => updateServiceEntry(index, "currency", e.target.value)}
                            >
                              {SERVICE_CURRENCIES.map((currency) => (
                                <option key={currency} value={currency}>
                                  {currency}
                                </option>
                              ))}
                            </select>
                          </div>
                          <div className="md:col-span-2">
                            <label className={labelClassName}>Typical Turnaround</label>
                            <input
                              type="text"
                              className={inputClassName}
                              value={service.typicalTurnaround}
                              onChange={(e) => updateServiceEntry(index, "typicalTurnaround", e.target.value)}
                            />
                          </div>
                        </div>
                        <div className="mt-3 flex justify-end">
                          <button
                            type="button"
                            onClick={() => removeServiceEntry(index)}
                            className="text-xs font-semibold text-rose-600 hover:text-rose-700"
                          >
                            Delete Service
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className={sectionCardClassName}>
                  <div className="mb-4 flex items-center justify-between gap-3">
                    <h4 className="text-base font-bold text-slate-950">Experience</h4>
                    <TooltipAction label="Experience help" tooltip="Add the strongest roles, outcomes, tools, and scope you want clients to review." />
                  </div>
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <input
                      type="text"
                      className={inputClassName}
                      placeholder="Company"
                      value={experienceInput.company}
                      onChange={(e) => setExperienceInput((prev) => ({ ...prev, company: e.target.value }))}
                    />
                    <input
                      type="text"
                      className={inputClassName}
                      placeholder="Role / Position"
                      value={experienceInput.role}
                      onChange={(e) => setExperienceInput((prev) => ({ ...prev, role: e.target.value }))}
                    />
                    <input
                      type="text"
                      className={inputClassName}
                      placeholder="Duration (e.g. Jan 2023 - Dec 2024)"
                      value={experienceInput.duration}
                      onChange={(e) => setExperienceInput((prev) => ({ ...prev, duration: e.target.value }))}
                    />
                    <button
                      type="button"
                      onClick={addExperience}
                      className="rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition-all hover:bg-black"
                    >
                      Add Experience
                    </button>
                    <div className="sm:col-span-2">
                      <textarea
                        className={inputClassName}
                        rows={3}
                        placeholder="What did you do? Results, scope, tools, and impact."
                        value={experienceInput.description}
                        onChange={(e) => setExperienceInput((prev) => ({ ...prev, description: e.target.value }))}
                      />
                    </div>
                  </div>
                  <div className="mt-4 space-y-2">
                    {(profile.experience || []).length === 0 && (
                      <div className="rounded-2xl border border-dashed border-slate-200 bg-white px-4 py-5 text-sm font-medium text-slate-500">
                        No experience added.
                      </div>
                    )}
                    {(profile.experience || []).map((item) => (
                      <div key={item.id} className="rounded-2xl border border-slate-200 bg-white p-4">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="text-sm font-bold text-slate-900">{item.role}</p>
                            <p className="text-xs font-medium text-slate-500">
                              {item.company} - {item.duration}
                            </p>
                            <p className="mt-2 text-sm text-slate-700">{item.description}</p>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeExperience(item.id)}
                            className="text-xs font-semibold text-rose-600 hover:text-rose-700"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {activeTab === "portfolio" && isFreelancer && (
          <div className="space-y-5">
            <div className="rounded-3xl border border-indigo-200 bg-gradient-to-br from-indigo-50 via-white to-sky-50 p-5 sm:p-6">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="flex items-center gap-3">
                  <h3 className="text-lg font-bold text-slate-950">Portfolio</h3>
                  <TooltipAction label="Portfolio help" tooltip="Keep your public profile link and project samples in one place for employers to review." />
                </div>
                <div className="rounded-2xl border border-indigo-100 bg-white px-4 py-3">
                  <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-slate-500">Public Profile</p>
                  <p className="mt-1 break-all text-sm font-semibold text-slate-900">
                    {typeof window !== "undefined" ? `${window.location.origin}/${profile.username || "your-name"}` : `tarawork.network/${profile.username || "your-name"}`}
                  </p>
                </div>
              </div>
            </div>
            <div className={sectionCardClassName}>
              <div className="mb-5 flex items-center justify-between gap-3">
                <h3 className="text-lg font-bold text-slate-950">Portfolio Projects</h3>
                <TooltipAction label="Portfolio projects help" tooltip="Add, edit, and organize project samples that support your applications and public profile." />
              </div>
              <PortfolioManager
                items={profile.portfolio || []}
                onAdd={addPortfolioItemLocal}
                onUpdate={updatePortfolioItemLocal}
                onRemove={removePortfolioItemLocal}
                isOwner={true}
              />
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

      <AIAgent 
        isOpen={showAIAgent}
        onClose={() => {
          setShowAIAgent(false);
          setResumeParseFile(null);
        }}
        mode="resume-parse"
        targetData={{ file: resumeParseFile }}
        onComplete={handleAIParseComplete}
      />
    </div>
  );
}

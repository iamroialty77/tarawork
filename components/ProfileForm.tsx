"use client";

import { UserProfile, FreelancerCategory, PortfolioItem, ExperienceItem, ServiceOffering } from "../types";
import { useState, useEffect, useRef } from "react";
import {
  User,
  FileText,
  Sparkles,
  FolderKanban,
  MessageSquareText,
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

type TabKey = "basics" | "portfolio" | "reviews";
type BasicsSubTabKey = "overview" | "application" | "skills" | "services" | "experience";

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
  description: "",
  startingPrice: 0,
  currency: "PHP",
  typicalTurnaround: "",
};
const SERVICE_CURRENCIES = ["PHP", "USD", "EUR", "SGD", "AUD"];

type ClientReview = {
  id: string;
  clientName: string;
  projectTitle: string;
  rating: number;
  comment: string;
  date: string;
};

const normalizeClientReviews = (reviews: unknown): ClientReview[] => {
  if (!Array.isArray(reviews)) return [];

  return reviews
    .map((review, index) => {
      if (!review || typeof review !== "object") return null;
      const source = review as Record<string, unknown>;
      const clientName = typeof source.clientName === "string" ? source.clientName.trim() : "";
      const projectTitle = typeof source.projectTitle === "string" ? source.projectTitle.trim() : "";
      const comment = typeof source.comment === "string" ? source.comment.trim() : "";
      const ratingRaw =
        typeof source.rating === "number"
          ? source.rating
          : typeof source.rating === "string"
            ? Number(source.rating)
            : 0;
      const rating = Number.isFinite(ratingRaw) ? Math.min(5, Math.max(0, ratingRaw)) : 0;
      if (!clientName && !projectTitle && !comment && rating === 0) return null;

      return {
        id: typeof source.id === "string" && source.id.trim() ? source.id.trim() : `review-${index}`,
        clientName: clientName || "Client",
        projectTitle: projectTitle || "Completed project",
        rating,
        comment: comment || "No written comment provided.",
        date: typeof source.date === "string" && source.date.trim() ? source.date.trim() : "",
      };
    })
    .filter((review): review is ClientReview => !!review);
};

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
    .map((service): ServiceOffering | null => {
      const serviceName = (service?.serviceName || "").trim();
      if (!serviceName) return null;
      const currency = (service?.currency || "PHP").trim() || "PHP";
      const startingPrice = Number.isFinite(service?.startingPrice)
        ? Math.max(0, Number(service.startingPrice))
        : 0;
      return {
        serviceName,
        description: (service?.description || "").trim() || undefined,
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
  const [editingExperienceId, setEditingExperienceId] = useState<string | null>(null);
  const [editingServiceIndex, setEditingServiceIndex] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<TabKey>("basics");
  const [activeBasicsSubTab, setActiveBasicsSubTab] = useState<BasicsSubTabKey>("overview");
  const [serviceInput, setServiceInput] = useState<ServiceOffering>(DEFAULT_SERVICE_ENTRY);
  const resumeInputRef = useRef<HTMLInputElement>(null);
  const hasLocalEditsRef = useRef(false);
  const syncedProfileIdRef = useRef(initialProfile.id || "");
  const isFreelancer = profile.role === "freelancer";

  // Sync internal state when prop changes (after fetch)
  useEffect(() => {
    const nextProfileId = initialProfile.id || "";
    const isDifferentProfile = nextProfileId !== syncedProfileIdRef.current;
    if (hasLocalEditsRef.current && !isDifferentProfile) return;

    const aboutSections = normalizeAboutSections(initialProfile);
    setProfile({
      ...initialProfile,
      aboutSections,
      servicesOffered: normalizeServices(initialProfile.servicesOffered),
      bio: aboutSections.whatISpecializeIn || initialProfile.bio,
    });
    syncedProfileIdRef.current = nextProfileId;
    hasLocalEditsRef.current = false;
  }, [initialProfile]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate(profile);
  };

  const updateLocalProfile = (nextProfile: UserProfile) => {
    hasLocalEditsRef.current = true;
    setProfile(nextProfile);
  };

  const handleFieldChange = (updates: Partial<UserProfile>) => {
    const newProfile = { ...profile, ...updates };
    updateLocalProfile(newProfile);
    // Note: We don't call onUpdate here for every keystroke, 
    // only for definitive actions or on submit
  };

  const addSkill = () => {
    if (skillInput && !profile.skills.includes(skillInput)) {
      updateLocalProfile({ ...profile, skills: [...profile.skills, skillInput] });
      setSkillInput("");
    }
  };

  const removeSkill = (skillToRemove: string) => {
    updateLocalProfile({
      ...profile,
      skills: profile.skills.filter((s) => s !== skillToRemove),
    });
  };

  const addExperience = () => {
    const role = experienceInput.role.trim();
    const description = experienceInput.description.trim();
    if (!role || !description) return;

    if (editingExperienceId) {
      updateLocalProfile({
        ...profile,
        experience: (profile.experience || []).map((item) =>
          item.id === editingExperienceId
            ? {
                ...item,
                company: experienceInput.company.trim() || "Company",
                role,
                duration: experienceInput.duration.trim() || "Not specified",
                description,
              }
            : item,
        ),
      });
      setEditingExperienceId(null);
      setExperienceInput({
        company: "",
        role: "",
        duration: "",
        description: "",
      });
      return;
    }

    const newExperience: ExperienceItem = {
      id: `exp-${Math.random().toString(36).slice(2, 9)}`,
      company: experienceInput.company.trim() || "Company",
      role,
      duration: experienceInput.duration.trim() || "Not specified",
      description,
    };

    updateLocalProfile({
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
    updateLocalProfile({
      ...profile,
      experience: (profile.experience || []).filter((item) => item.id !== id),
    });
    if (editingExperienceId === id) setEditingExperienceId(null);
  };

  const startEditExperience = (item: ExperienceItem) => {
    setEditingExperienceId(item.id);
    setExperienceInput({
      company: item.company || "",
      role: item.role || "",
      duration: item.duration || "",
      description: item.description || "",
    });
  };

  const handleBioChange = (value: string) => {
    const trimmed = value.slice(0, ABOUT_SECTION_MAX * 3);
    updateLocalProfile({
      ...profile,
      bio: trimmed,
      aboutSections: {
        ...(profile.aboutSections || EMPTY_ABOUT_SECTIONS),
        whatISpecializeIn: trimmed,
      },
    });
  };

  const persistProfile = (nextProfile: UserProfile) => {
    updateLocalProfile(nextProfile);
    onUpdate(nextProfile);
  };

  const addServiceEntry = () => {
    const serviceName = serviceInput.serviceName.trim();
    const description = (serviceInput.description || "").trim();
    const typicalTurnaround = serviceInput.typicalTurnaround.trim();
    const startingPrice = Number.isFinite(serviceInput.startingPrice)
      ? Math.max(0, Number(serviceInput.startingPrice))
      : 0;
    if (!serviceName) return;

    const currentServices = normalizeServices(profile.servicesOffered);
    if (editingServiceIndex === null && currentServices.length >= MAX_SERVICES) return;

    const nextService: ServiceOffering = {
      serviceName,
      description,
      startingPrice,
      currency: serviceInput.currency || "PHP",
      typicalTurnaround,
    };

    if (editingServiceIndex !== null) {
      persistProfile({
        ...profile,
        servicesOffered: currentServices.map((service, index) =>
          index === editingServiceIndex ? nextService : service,
        ),
      });
      setEditingServiceIndex(null);
      setServiceInput(DEFAULT_SERVICE_ENTRY);
      return;
    }

    persistProfile({
      ...profile,
      servicesOffered: [...currentServices, nextService],
    });
    setServiceInput(DEFAULT_SERVICE_ENTRY);
  };

  const startEditService = (index: number) => {
    const currentServices = normalizeServices(profile.servicesOffered);
    const service = currentServices[index];
    if (!service) return;
    setEditingServiceIndex(index);
    setServiceInput(service);
  };

  const removeServiceEntry = (index: number) => {
    const currentServices = normalizeServices(profile.servicesOffered);
    persistProfile({
      ...profile,
      servicesOffered: currentServices.filter((_, idx) => idx !== index),
    });
    if (editingServiceIndex === index) setEditingServiceIndex(null);
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
    updateLocalProfile({
      ...profile,
      portfolio: [...(profile.portfolio || []), newItem],
    });
  };

  const updatePortfolioItemLocal = (item: PortfolioItem) => {
    if (onUpdatePortfolio) {
      onUpdatePortfolio(item);
      return;
    }
    updateLocalProfile({
      ...profile,
      portfolio: (profile.portfolio || []).map((i) => (i.id === item.id ? item : i)),
    });
  };

  const removePortfolioItemLocal = (id: string) => {
    if (onRemovePortfolio) {
      onRemovePortfolio(id);
      return;
    }
    updateLocalProfile({
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
    
    updateLocalProfile(updatedProfile);
    onUpdate(updatedProfile);
    
    // Also notify if there are parent handlers for individual portfolio additions
    if (newPortfolioItems.length > 0 && onAddPortfolio) {
      newPortfolioItems.forEach((item: PortfolioItem) => onAddPortfolio(item));
    }
    
    setResumeParseFile(null);
    setShowAIAgent(false);
  };

  const inputClassName =
    "w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 transition-all placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-100";
  const labelClassName =
    "mb-2 block text-[11px] font-bold uppercase tracking-[0.18em] text-slate-500";
  const servicesOffered = normalizeServices(profile.servicesOffered);
  const applicationProfile = profile.aiInsights?.applicationProfile || {};
  const clientReviews = normalizeClientReviews((profile.aiInsights as Record<string, unknown> | undefined)?.clientReviews);
  const sectionCardClassName = "rounded-3xl border border-slate-200 bg-slate-50/70 p-5 sm:p-6";
  const visibleActiveTab: TabKey = !isFreelancer && activeTab === "portfolio" ? "basics" : activeTab;
  const sectionNavItems: Array<{ key: string; label: string; icon: typeof User; onClick: () => void; isActive: boolean }> = [
    {
      key: "overview",
      label: "Basic Information",
      icon: User,
      onClick: () => {
        setActiveTab("basics");
        setActiveBasicsSubTab("overview");
      },
      isActive: visibleActiveTab === "basics" && activeBasicsSubTab === "overview",
    },
    {
      key: "application",
      label: "Application Extras",
      icon: FileText,
      onClick: () => {
        setActiveTab("basics");
        setActiveBasicsSubTab("application");
      },
      isActive: visibleActiveTab === "basics" && activeBasicsSubTab === "application",
    },
    {
      key: "skills",
      label: "Skills",
      icon: Sparkles,
      onClick: () => {
        setActiveTab("basics");
        setActiveBasicsSubTab("skills");
      },
      isActive: visibleActiveTab === "basics" && activeBasicsSubTab === "skills",
    },
    {
      key: "services",
      label: "Services Offered",
      icon: FolderKanban,
      onClick: () => {
        setActiveTab("basics");
        setActiveBasicsSubTab("services");
      },
      isActive: visibleActiveTab === "basics" && activeBasicsSubTab === "services",
    },
    {
      key: "experience",
      label: "Experience",
      icon: MessageSquareText,
      onClick: () => {
        setActiveTab("basics");
        setActiveBasicsSubTab("experience");
      },
      isActive: visibleActiveTab === "basics" && activeBasicsSubTab === "experience",
    },
    ...(isFreelancer
      ? [
          {
            key: "portfolio",
            label: "Portfolio",
            icon: FolderKanban,
            onClick: () => setActiveTab("portfolio"),
            isActive: visibleActiveTab === "portfolio",
          },
        ]
      : []),
    {
      key: "reviews",
      label: "Reviews",
      icon: MessageSquareText,
      onClick: () => setActiveTab("reviews"),
      isActive: visibleActiveTab === "reviews",
    },
  ];
  const saveProfileButton = (
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
  );

  const handleApplicationProfileChange = (
    field: "contactEmail" | "contactPhone" | "resumeUrl" | "portfolioUrl" | "interviewUrl" | "coverLetter",
    value: string,
  ) => {
    updateLocalProfile({
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
      <form onSubmit={handleSubmit} className="grid gap-5 lg:grid-cols-[240px_minmax(0,1fr)]">
        <aside className="rounded-3xl border border-slate-200 bg-slate-50 p-2 lg:sticky lg:top-24 lg:self-start">
          <nav className="flex gap-2 overflow-x-auto lg:flex-col lg:overflow-visible">
            {sectionNavItems.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.key}
              type="button"
                  onClick={tab.onClick}
                  className={`inline-flex min-w-max items-center gap-2 rounded-2xl px-4 py-3 text-left text-sm font-semibold transition-all lg:min-w-0 ${
                tab.isActive
                  ? "bg-slate-900 text-white shadow-lg shadow-slate-900/15"
                      : "text-slate-600 hover:bg-white hover:text-slate-900"
              }`}
            >
              <Icon className="h-4 w-4" />
              {tab.label}
            </button>
          );
        })}
          </nav>
        </aside>

        <div className="space-y-5">
        {visibleActiveTab === "basics" && (
          <div className="space-y-5">
            {activeBasicsSubTab === "overview" && (
            <div className="grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1.05fr)_minmax(360px,0.95fr)]">
              <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm ring-1 ring-slate-100 sm:p-6">
                <div className="mb-5 flex items-start justify-between gap-3 border-b border-slate-100 pb-4">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-500">Profile</p>
                    <h3 className="mt-1 text-lg font-bold text-slate-950">Basic Information</h3>
                  </div>
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
                    <div className="flex overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                      <span className="border-r border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-500">
                        {typeof window !== "undefined" ? window.location.host : "tarawork.network"}/
                      </span>
                      <input
                        type="text"
                        placeholder="username"
                        className="min-w-0 flex-1 px-4 py-3 text-sm text-slate-900 outline-none"
                        value={profile.username || ""}
                        onChange={(e) => updateLocalProfile({ ...profile, username: e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, "") })}
                      />
                    </div>
                    <div className="mt-2 text-sm font-medium text-slate-600">
                      /{profile.username || "your-name"}
                    </div>
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

              <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm ring-1 ring-slate-100 sm:p-6">
                <div className="mb-5 flex items-start justify-between gap-3 border-b border-slate-100 pb-4">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-600">Work Details</p>
                    <h3 className="mt-1 text-lg font-bold text-slate-950">{isFreelancer ? "Professional Details" : "Company Details"}</h3>
                  </div>
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
                <div className="space-y-4">
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
                  {saveProfileButton}
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className={labelClassName}>Category</label>
                    <select
                      className={inputClassName}
                      value={profile.category}
                      onChange={(e) => updateLocalProfile({ ...profile, category: e.target.value as FreelancerCategory })}
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
                      onChange={(e) => updateLocalProfile({ ...profile, hourlyRate: e.target.value })}
                    />
                  </div>
                </div>
              )}
            </div>
            </div>
            )}

            {isFreelancer && (
              <>
                {activeBasicsSubTab === "application" && (
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
                  <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                    <div className="space-y-3">
                      <div>
                        <label className={labelClassName}>Contact Email</label>
                        <input
                          type="email"
                          placeholder="you@email.com"
                          className={inputClassName}
                          value={applicationProfile.contactEmail || ""}
                          onChange={(e) => handleApplicationProfileChange("contactEmail", e.target.value)}
                        />
                      </div>
                      <div>
                        <label className={labelClassName}>Contact Phone</label>
                        <input
                          type="tel"
                          placeholder="+63 900 000 0000"
                          className={inputClassName}
                          value={applicationProfile.contactPhone || ""}
                          onChange={(e) => handleApplicationProfileChange("contactPhone", e.target.value)}
                        />
                      </div>
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
                    </div>
                    <div>
                      <label className={labelClassName}>Default Cover Letter (Optional)</label>
                      <textarea
                        rows={8}
                        placeholder="Short intro na automatic kasama sa applications mo."
                        className={`${inputClassName} min-h-[214px]`}
                        value={applicationProfile.coverLetter || ""}
                        onChange={(e) => handleApplicationProfileChange("coverLetter", e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                {saveProfileButton}
                </>
                )}

                {activeBasicsSubTab === "skills" && (
                <div className={sectionCardClassName}>
                  <div className="mb-4 flex items-center justify-between gap-3">
                    <h4 className="text-base font-bold text-slate-950">Skills</h4>
                    <TooltipAction label="Skills help" tooltip="Add the skills you want employers to see and that jobs should match against." />
                  </div>
                  <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                    <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
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
                    <div className="max-h-40 overflow-y-auto rounded-2xl border border-slate-200 bg-white p-3">
                      {profile.skills.length === 0 ? (
                        <div className="flex h-full min-h-24 items-center justify-center text-sm font-medium text-slate-500">
                          No skills added.
                        </div>
                      ) : (
                        <div className="flex flex-wrap gap-2">
                          {profile.skills.map((skill) => (
                            <span
                              key={skill}
                              className="inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-indigo-50 px-3 py-1.5 text-xs font-semibold text-indigo-700"
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
                      )}
                    </div>
                  </div>
                </div>
                )}

                {activeBasicsSubTab === "services" && (
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

                  <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                    <div className="space-y-3">
                      <input
                        type="text"
                        className={inputClassName}
                        placeholder="Service Name (e.g. Landing Page Build)"
                        value={serviceInput.serviceName}
                        onChange={(e) => setServiceInput((prev) => ({ ...prev, serviceName: e.target.value }))}
                      />
                      <textarea
                        className={inputClassName}
                        rows={3}
                        placeholder="Service Description (scope, deliverables, or what clients get)"
                        value={serviceInput.description || ""}
                        onChange={(e) => setServiceInput((prev) => ({ ...prev, description: e.target.value }))}
                      />
                      <div className="grid grid-cols-2 gap-3">
                        <input
                          type="number"
                          min={0}
                          className={inputClassName}
                          placeholder="Starting Price"
                          value={serviceInput.startingPrice}
                          onChange={(e) => setServiceInput((prev) => ({ ...prev, startingPrice: Number(e.target.value) || 0 }))}
                        />
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
                      <input
                        type="text"
                        className={inputClassName}
                        placeholder="Typical Turnaround (e.g. 3-5 days)"
                        value={serviceInput.typicalTurnaround}
                        onChange={(e) => setServiceInput((prev) => ({ ...prev, typicalTurnaround: e.target.value }))}
                      />
                      <button
                        type="button"
                        onClick={addServiceEntry}
                        disabled={editingServiceIndex === null && servicesOffered.length >= MAX_SERVICES}
                        className="w-full rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition-all hover:bg-black disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {editingServiceIndex === null ? "Add Service" : "Update Service"}
                      </button>
                      {editingServiceIndex !== null && (
                        <button
                          type="button"
                          onClick={() => {
                            setEditingServiceIndex(null);
                            setServiceInput(DEFAULT_SERVICE_ENTRY);
                          }}
                          className="w-full rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition-all hover:border-slate-300 hover:text-slate-950"
                        >
                          Cancel Edit
                        </button>
                      )}
                    </div>
                    <div className="max-h-72 space-y-3 overflow-y-auto rounded-2xl border border-slate-200 bg-white p-3">
                      {servicesOffered.length === 0 && (
                        <div className="flex min-h-32 items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-4 py-5 text-sm font-medium text-slate-500">
                        No services added.
                        </div>
                      )}
                      {servicesOffered.map((service, index) => (
                        <div key={`${service.serviceName}-${index}`} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <p className="text-sm font-bold text-slate-900">{service.serviceName}</p>
                              <p className="mt-1 text-xs font-semibold text-slate-500">
                                {service.currency} {service.startingPrice} starting price
                              </p>
                              {service.description && (
                                <p className="mt-2 text-sm text-slate-700">{service.description}</p>
                              )}
                              {service.typicalTurnaround && (
                                <p className="mt-2 text-xs font-semibold text-slate-500">{service.typicalTurnaround}</p>
                              )}
                            </div>
                            <div className="flex shrink-0 gap-3">
                              <button
                                type="button"
                                onClick={() => startEditService(index)}
                                className="text-xs font-semibold text-indigo-600 hover:text-indigo-700"
                              >
                                Edit
                              </button>
                              <button
                                type="button"
                                onClick={() => removeServiceEntry(index)}
                                className="text-xs font-semibold text-rose-600 hover:text-rose-700"
                              >
                                Delete
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                )}

                {activeBasicsSubTab === "experience" && (
                <div className={sectionCardClassName}>
                  <div className="mb-4 flex items-center justify-between gap-3">
                    <h4 className="text-base font-bold text-slate-950">Experience</h4>
                    <TooltipAction label="Experience help" tooltip="Add the strongest roles, outcomes, tools, and scope you want clients to review." />
                  </div>
                  <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                    <div className="space-y-3">
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
                      </div>
                      <input
                        type="text"
                        className={inputClassName}
                        placeholder="Duration (e.g. Jan 2023 - Dec 2024)"
                        value={experienceInput.duration}
                        onChange={(e) => setExperienceInput((prev) => ({ ...prev, duration: e.target.value }))}
                      />
                      <textarea
                        className={inputClassName}
                        rows={3}
                        placeholder="What did you do? Results, scope, tools, and impact."
                        value={experienceInput.description}
                        onChange={(e) => setExperienceInput((prev) => ({ ...prev, description: e.target.value }))}
                      />
                      <button
                        type="button"
                        onClick={addExperience}
                        className="w-full rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition-all hover:bg-black"
                      >
                        {editingExperienceId ? "Update Experience" : "Add Experience"}
                      </button>
                      {editingExperienceId && (
                        <button
                          type="button"
                          onClick={() => {
                            setEditingExperienceId(null);
                            setExperienceInput({
                              company: "",
                              role: "",
                              duration: "",
                              description: "",
                            });
                          }}
                          className="w-full rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition-all hover:border-slate-300 hover:text-slate-950"
                        >
                          Cancel Edit
                        </button>
                      )}
                    </div>
                    <div className="max-h-72 space-y-2 overflow-y-auto rounded-2xl border border-slate-200 bg-white p-3">
                      {(profile.experience || []).length === 0 && (
                        <div className="flex min-h-32 items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-4 py-5 text-sm font-medium text-slate-500">
                        No experience added.
                        </div>
                      )}
                      {(profile.experience || []).map((item) => (
                        <div key={item.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <p className="text-sm font-bold text-slate-900">{item.role}</p>
                              <p className="text-xs font-medium text-slate-500">
                                {item.company} - {item.duration}
                              </p>
                              <p className="mt-2 text-sm text-slate-700">{item.description}</p>
                            </div>
                            <div className="flex shrink-0 gap-3">
                              <button
                                type="button"
                                onClick={() => startEditExperience(item)}
                                className="text-xs font-semibold text-indigo-600 hover:text-indigo-700"
                              >
                                Edit
                              </button>
                              <button
                                type="button"
                                onClick={() => removeExperience(item.id)}
                                className="text-xs font-semibold text-rose-600 hover:text-rose-700"
                              >
                                Remove
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                )}
              </>
            )}
          </div>
        )}

        {visibleActiveTab === "portfolio" && isFreelancer && (
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

        {visibleActiveTab === "reviews" && (
          <div className="space-y-5">
            <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm ring-1 ring-slate-100 sm:p-6">
              <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-amber-600">Client Feedback</p>
                  <h3 className="mt-1 text-xl font-bold text-slate-950">Reviews</h3>
                </div>
                <div className="grid grid-cols-1 gap-3 sm:min-w-[220px]">
                  <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                    <p className="text-[10px] font-black uppercase tracking-[0.16em] text-slate-500">Total Reviews</p>
                    <p className="mt-2 text-2xl font-black text-slate-950">{clientReviews.length}</p>
                  </div>
                </div>
              </div>
            </div>

            {clientReviews.length > 0 ? (
              <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                {clientReviews.map((review) => (
                  <div key={review.id} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm ring-1 ring-slate-100">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h4 className="text-base font-bold text-slate-950">{review.clientName}</h4>
                        <p className="mt-1 text-sm font-medium text-slate-500">{review.projectTitle}</p>
                      </div>
                    </div>
                    <p className="mt-4 text-sm leading-relaxed text-slate-700">{review.comment}</p>
                    {review.date && (
                      <p className="mt-4 text-[11px] font-bold uppercase tracking-[0.16em] text-slate-400">{review.date}</p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-indigo-500 shadow-sm">
                  <MessageSquareText className="h-5 w-5" />
                </div>
                <h4 className="mt-4 text-lg font-bold text-slate-950">No client reviews yet</h4>
                <p className="mx-auto mt-2 max-w-xl text-sm leading-relaxed text-slate-500">
                  Client comments will appear here after completed work is reviewed.
                </p>
              </div>
            )}
          </div>
        )}

        </div>
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

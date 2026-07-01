"use client";

import { Fragment, useState, useEffect, useRef, useMemo, useCallback } from "react";
import { CurrencyCode, UserProfile, Job, PortfolioItem, Squad, Project, ProfileAboutSections, ServiceOffering } from "../types";
import JobFeed from "../components/JobFeed";
import ProfileForm from "../components/ProfileForm";
import JobPostingForm from "../components/JobPostingForm";
import AdminDashboard from "../components/AdminDashboard";
import { supabase } from "../lib/supabase";
import { cn } from "../lib/utils";
import { useRouter } from "next/navigation";
import { 
  Briefcase, 
  Users, 
  LayoutDashboard, 
  Bell, 
  Settings,
  Lightbulb,
  Star,
  Search as SearchIcon,
  TrendingUp,
  Award,
  Shield,
  ShieldCheck,
  ArrowUpRight,
  Clock,
  LogIn,
  Mail,
  Phone,
  Facebook,
  Linkedin,
  Github,
  CheckCircle2,
  AlertCircle,
  XCircle, 
  Code, 
  FileText, 
  ExternalLink, 
  Copy,
  DollarSign, 
  Lock, 
  Scale, 
  PlusCircle, 
  User, 
  Layout, 
  PieChart, 
  ChevronRight,
  Sparkles,
  Brain,
  Medal,
  Verified,
  Trophy,
  Coins,
  Bookmark,
  Building2,
  Menu,
  UserPlus,
  X,
  Pencil,
  MoreHorizontal
} from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import AIAgent from "../components/AIAgent";
import LandingPage from "../components/LandingPage";
import { buildPublicProfileUrl, getProfileSlug } from "../lib/profileUrl";
import { getJobSharePath, getJobShareUrl } from "../lib/jobShare";
import TooltipAction from "@/components/ui/TooltipAction";

const SUPPORTED_JOB_CURRENCIES: CurrencyCode[] = ["USD", "AUD", "GBP", "PHP"];

const normalizeCurrencyCode = (value: unknown): CurrencyCode =>
  typeof value === "string" && SUPPORTED_JOB_CURRENCIES.includes(value as CurrencyCode)
    ? (value as CurrencyCode)
    : "PHP";

const emptyAboutSections = (): ProfileAboutSections => ({
  whoIHelp: "",
  whatISpecializeIn: "",
  resultsIHaveDelivered: "",
  howIWork: "",
});

const normalizeAboutSections = (
  sections: unknown,
  fallbackBio = "",
): ProfileAboutSections => {
  const source = sections && typeof sections === "object" ? (sections as Record<string, unknown>) : {};

  return {
    whoIHelp: typeof source.whoIHelp === "string" ? source.whoIHelp : "",
    whatISpecializeIn:
      typeof source.whatISpecializeIn === "string"
        ? source.whatISpecializeIn
        : fallbackBio || "",
    resultsIHaveDelivered: typeof source.resultsIHaveDelivered === "string" ? source.resultsIHaveDelivered : "",
    howIWork: typeof source.howIWork === "string" ? source.howIWork : "",
  };
};

const normalizeServicesOffered = (services: unknown): ServiceOffering[] => {
  if (!Array.isArray(services)) return [];
  return services
    .map((service) => {
      if (!service || typeof service !== "object") return null;
      const source = service as Record<string, unknown>;
      const serviceName = typeof source.serviceName === "string" ? source.serviceName.trim() : "";
      const description = typeof source.description === "string" ? source.description.trim() : "";
      const typicalTurnaround = typeof source.typicalTurnaround === "string" ? source.typicalTurnaround.trim() : "";
      const currency = typeof source.currency === "string" && source.currency.trim().length > 0 ? source.currency.trim() : "PHP";
      const startingPriceRaw =
        typeof source.startingPrice === "number"
          ? source.startingPrice
          : typeof source.startingPrice === "string"
            ? Number(source.startingPrice)
            : 0;
      const startingPrice = Number.isFinite(startingPriceRaw) ? Math.max(0, startingPriceRaw) : 0;

      if (!serviceName) return null;
      return {
        serviceName,
        description,
        startingPrice,
        currency,
        typicalTurnaround,
      } as ServiceOffering;
    })
    .filter((service): service is ServiceOffering => !!service)
    .slice(0, 6);
};

const normalizeUserRole = (
  value: unknown,
  fallback: UserProfile["role"] = "freelancer",
): UserProfile["role"] => {
  if (typeof value !== "string") return fallback;
  const normalized = value.trim().toLowerCase();
  if (normalized === "admin") return "admin";
  if (normalized === "employer" || normalized === "client") return "employer";
  if (normalized === "freelancer") return "freelancer";
  return fallback;
};

const normalizeSignupRole = (value: unknown): "freelancer" | "employer" => {
  if (typeof value !== "string") return "freelancer";
  const normalized = value.trim().toLowerCase();
  return normalized === "employer" || normalized === "client" ? "employer" : "freelancer";
};

const buildSuggestedCoverLetter = (
  job: Job | null,
  freelancer: UserProfile,
  savedDefault: string,
) => {
  if (savedDefault.trim().length > 0) return savedDefault.trim();
  if (!job) return "";

  const firstName = (freelancer.name || "there").split(" ")[0];
  const topSkills = (freelancer.skills || []).filter(Boolean).slice(0, 3).join(", ");
  const skillsLine = topSkills
    ? `My relevant skills include ${topSkills}. `
    : "";

  return `Hi, I’m ${firstName}. I’m applying for the ${job.title} role. ${skillsLine}I’d be glad to discuss how I can help with this project.`;
};

type AppNotification = {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: string;
  link?: string | null;
  is_read?: boolean;
  created_at: string;
};

type TalentInvitation = {
  id: string;
  employer_id: string;
  freelancer_id: string;
  status: "pending" | "accepted" | "rejected" | "cancelled";
  message?: string | null;
  interview_at?: string | null;
  interview_link?: string | null;
  interview_request_at?: string | null;
  interview_request_note?: string | null;
  interview_request_status?: "none" | "pending" | "resolved" | "declined" | null;
  work_status?: "not_started" | "in_progress" | "completed" | null;
  completed_at?: string | null;
  created_at: string;
  updated_at?: string | null;
  freelancer?: {
    id: string;
    name?: string | null;
    username?: string | null;
    avatar_url?: string | null;
    category?: string | null;
  } | null;
  employer?: {
    id: string;
    name?: string | null;
    username?: string | null;
    avatar_url?: string | null;
    companyName?: string | null;
  } | null;
  latestJob?: {
    id: string;
    title: string;
  } | null;
};

export default function Home() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMsg, setToastMsg] = useState("");
  const [view, setView] = useState<"freelancer" | "client" | "admin">("freelancer");
  const [adminViewMode, setAdminViewMode] = useState<"admin" | "freelancer" | "client">("admin");
  const [jobs, setJobs] = useState<Job[]>([]);
  const [employerJobs, setemployerJobs] = useState<Job[]>([]);
  const [editingJob, setEditingJob] = useState<Job | null>(null);
  const [employerJobFilter, setEmployerJobFilter] = useState<"all" | "live" | "closed">("all");
  const [openJobActionsId, setOpenJobActionsId] = useState<string | null>(null);
  const [appliedJobs, setAppliedJobs] = useState<Record<string, string>>({});
  const [freelancers, setFreelancers] = useState<UserProfile[]>([]);
  const [dbError, setDbError] = useState<boolean>(false);
  const [missingTables, setMissingTables] = useState<string[]>([]);
  const [portfolioInquiries, setPortfolioInquiries] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [freelancerSearchTerm, setFreelancerSearchTerm] = useState("");
  const [debouncedFreelancerSearchTerm, setDebouncedFreelancerSearchTerm] = useState("");
  const [talentsFilter, setTalentsFilter] = useState<"all" | "saved">("all");
  const [serviceTypeFilter, setServiceTypeFilter] = useState<string>("all");
  const [talentsSort, setTalentsSort] = useState<"recommended" | "rate_low" | "rate_high">("recommended");
  const [talentRatingFilter, setTalentRatingFilter] = useState<"all" | "4" | "4.5" | "5">("all");
  const [visibleTalentsCount, setVisibleTalentsCount] = useState(12);
  const [selectedFreelancer, setSelectedFreelancer] = useState<UserProfile | null>(null);
  const [activeFreelancerProfileTab, setActiveFreelancerProfileTab] = useState<"overview" | "portfolio" | "feedback">("overview");
  const [contactUnlockTalentId, setContactUnlockTalentId] = useState<string | null>(null);
  const [showFreelancerModal, setShowFreelancerModal] = useState(false);
  const [showApplicantsModal, setShowApplicantsModal] = useState(false);
  const [pendingApplyJobId, setPendingApplyJobId] = useState<string | null>(null);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [sentTalentInvitations, setSentTalentInvitations] = useState<TalentInvitation[]>([]);
  const [receivedTalentInvitations, setReceivedTalentInvitations] = useState<TalentInvitation[]>([]);
  const [interviewDrafts, setInterviewDrafts] = useState<Record<string, { interviewAt: string; interviewLink: string }>>({});
  const [visibleInterviewIds, setVisibleInterviewIds] = useState<string[]>([]);
  const [expandedInvitationIds, setExpandedInvitationIds] = useState<string[]>([]);
  const [rescheduleDrafts, setRescheduleDrafts] = useState<Record<string, { requestAt: string; note: string }>>({});
  const [savedTalentIds, setSavedTalentIds] = useState<string[]>([]);
  const [invitedTalentIds, setInvitedTalentIds] = useState<string[]>([]);
  const [userFollows, setUserFollows] = useState<string[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [selectedJobApplicants, setSelectedJobApplicants] = useState<any[]>([]);
  const [selectedJobTitle, setSelectedJobTitle] = useState("");
  const [applicationDraftJobId, setApplicationDraftJobId] = useState<string | null>(null);
  const [applicationDraftCoverLetter, setApplicationDraftCoverLetter] = useState("");
  const [showApplicationModal, setShowApplicationModal] = useState(false);
  const [isSubmittingApplication, setIsSubmittingApplication] = useState(false);
  const jobsRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  const jobPostingFormRef = useRef<HTMLDivElement>(null);
  const loadedSessionIdRef = useRef<string | null>(null);

  const [profile, setProfile] = useState<UserProfile>({
    name: "User",
    role: "freelancer",
    category: "General",
    skills: [],
    verifiedSkills: [],
    softSkills: [
      { name: "Strategic Thinker", badge: "🧠", level: "Expert", count: 12 },
      { name: "Resilient Leader", badge: "🛡️", level: "Master", count: 8 },
      { name: "Empathetic Speaker", badge: "📢", level: "Beginner", count: 4 },
    ],
    aiInsights: {
      gapAnalysis: [],
      compatibilityScore: 0,
      cultureMatch: [],
      preferredCurrency: "PHP",
    },
    preferredCurrency: "PHP",
    ranking: 15,
    hourlyRate: "$0",
    bio: "",
    aboutSections: emptyAboutSections(),
    servicesOffered: [],
    experience: [],
    activeProjects: [],
    premiumProfile: {
      tier: "free",
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
    },
  });

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [settingsLoading, setSettingsLoading] = useState(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [feedbackType, setFeedbackType] = useState<"feature" | "bug" | "rating">("feature");
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const [isSubmittingFeedback, setIsSubmittingFeedback] = useState(false);
  const [freelancerFeedbackRating, setFreelancerFeedbackRating] = useState(5);
  const [freelancerFeedbackComment, setFreelancerFeedbackComment] = useState("");
  const [freelancerFeedbackProjectTitle, setFreelancerFeedbackProjectTitle] = useState("");
  const [isSubmittingFreelancerFeedback, setIsSubmittingFreelancerFeedback] = useState(false);
  const [isMarkingTalentWorkComplete, setIsMarkingTalentWorkComplete] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);
  const effectiveView = profile.role === "admin" ? adminViewMode : view;
  const isEmployerView = effectiveView === "client" || profile.role === "employer";
  const invitedTalentsStorageKey = user?.id ? `tarawork:invited-talents:${user.id}` : "";
  const savedTalents = useMemo(
    () =>
      freelancers.filter(
        (freelancer) => !!freelancer.id && savedTalentIds.includes(freelancer.id),
      ),
    [freelancers, savedTalentIds],
  );
  const filteredEmployerJobs = useMemo(() => {
    if (employerJobFilter === "all") return employerJobs;
    return employerJobs.filter((job) => ((job as any).status || "live") === employerJobFilter);
  }, [employerJobFilter, employerJobs]);
  const selectedApplicationJob = useMemo(
    () => jobs.find((job) => job.id === applicationDraftJobId) || null,
    [applicationDraftJobId, jobs],
  );
  const feedbackMeta = useMemo(() => {
    const map = {
      feature: {
        title: "Suggest Feature",
        subject: "TaraWork Feature Suggestion",
      },
      bug: {
        title: "Report Bug",
        subject: "TaraWork Bug Report",
      },
      rating: {
        title: "Rate TaraWork",
        subject: "TaraWork Product Feedback",
      },
    } as const;
    return map[feedbackType];
  }, [feedbackType]);
  const profileCompletion = useMemo(() => {
    const checkpoints = [
      profile.bio?.trim(),
      (profile.skills?.length ?? 0) > 0,
      profile.username?.trim(),
      (profile.portfolio?.length ?? 0) > 0,
      profile.hourlyRate?.trim(),
    ];
    const completed = checkpoints.filter(Boolean).length;
    return Math.round((completed / checkpoints.length) * 100);
  }, [profile.bio, profile.skills, profile.username, profile.portfolio, profile.hourlyRate]);
  const categoryJobsCount = useMemo(
    () => jobs.filter((job) => job.category === profile.category).length,
    [jobs, profile.category],
  );
  const openFeedbackModal = (type: "feature" | "bug" | "rating") => {
    setFeedbackType(type);
    setFeedbackMessage("");
    setShowFeedbackModal(true);
  };
  const handleFeedbackEmail = () => {
    const body = [
      `Type: ${feedbackMeta.title}`,
      `User: ${profile.name || "User"}`,
      `Role: ${profile.role || "freelancer"}`,
      "",
      feedbackMessage.trim() || "Add your feedback here.",
    ].join("\n");
    window.location.href = `mailto:?subject=${encodeURIComponent(feedbackMeta.subject)}&body=${encodeURIComponent(body)}`;
  };
  const submitFeedback = async () => {
    const message = feedbackMessage.trim();

    if (!user) {
      setToastMsg("Please sign in to send product feedback.");
      setShowToast(true);
      return;
    }

    if (!message) {
      setToastMsg("Please enter your feedback before submitting.");
      setShowToast(true);
      return;
    }

    setIsSubmittingFeedback(true);

    try {
      const payload = {
        user_id: user.id,
        feedback_type: feedbackType,
        message,
        status: "new",
        metadata: {
          name: profile.name || null,
          role: profile.role || "freelancer",
          username: profile.username || null,
          email: user.email || null,
          source: "profile_feedback_modal",
        },
      };

      const { error } = await supabase.from("product_feedback").insert([payload]);

      if (error) {
        if (error.code === "PGRST205" || error.message?.includes("relation \"product_feedback\" does not exist")) {
          setMissingTables((prev) => [...new Set([...prev, "product_feedback"])]);
          setToastMsg("Feedback table is not set up yet. Run the latest Supabase schema, then try again.");
          setShowToast(true);
          return;
        }
        throw error;
      }

      setShowFeedbackModal(false);
      setFeedbackMessage("");
      setToastMsg("Feedback submitted successfully. Thank you.");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to submit feedback.";
      setToastMsg(message);
      setShowToast(true);
    } finally {
      setIsSubmittingFeedback(false);
    }
  };

  const handleViewSwitch = (nextView: "freelancer" | "client" | "admin") => {
    setView(nextView);
    if (profile.role === "admin") {
      setAdminViewMode(nextView);
      if (typeof window !== "undefined") {
        sessionStorage.setItem("admin_view_mode", nextView);
      }
    }
  };

  useEffect(() => {
    if (!invitedTalentsStorageKey) return;
    if (typeof window === "undefined") return;
    try {
      const raw = window.localStorage.getItem(invitedTalentsStorageKey);
      if (!raw) {
        setInvitedTalentIds([]);
        return;
      }
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        setInvitedTalentIds(parsed.filter((entry): entry is string => typeof entry === "string"));
      } else {
        setInvitedTalentIds([]);
      }
    } catch {
      setInvitedTalentIds([]);
    }
  }, [invitedTalentsStorageKey]);

  useEffect(() => {
    if (!invitedTalentsStorageKey) return;
    if (typeof window === "undefined") return;
    window.localStorage.setItem(invitedTalentsStorageKey, JSON.stringify(invitedTalentIds));
  }, [invitedTalentIds, invitedTalentsStorageKey]);

  useEffect(() => {
    // Handle email confirmation success message
    const params = new URLSearchParams(window.location.search);
    if (params.get('confirmed') === 'true') {
      setToastMsg("Email verified successfully! Welcome to TaraWork.");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 5000);
      
      // Clean up the URL
      const newUrl = window.location.pathname;
      window.history.replaceState({}, document.title, newUrl);
    }
  }, []);

  useEffect(() => {
    if (profile.role !== "admin" || typeof window === "undefined") return;
    const stored = sessionStorage.getItem("admin_view_mode");
    if (stored === "admin" || stored === "freelancer" || stored === "client") {
      setAdminViewMode(stored);
      setView(stored);
    }
  }, [profile.role]);

  const [isSaving, setIsSaving] = useState(false);

  const [isVetting, setIsVetting] = useState(false);
  const [vettingData, setVettingData] = useState<any>(null);

  const [freelancerTab, setFreelancerTab] = useState<"overview" | "jobs" | "profile">("jobs");
  const [clientTab, setClientTab] = useState<"overview" | "jobs" | "talents" | "profile">("overview");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const applyId = params.get("apply");
    if (params.get("tab") === "jobs") {
      setFreelancerTab("jobs");
    }
    if (!applyId) return;
    setFreelancerTab("jobs");
    setPendingApplyJobId(applyId);
  }, []);

  useEffect(() => {
    if (!pendingApplyJobId || user || typeof window === "undefined") return;
    const next = `${window.location.pathname}${window.location.search}`;
    router.replace(`/auth?next=${encodeURIComponent(next)}`);
  }, [pendingApplyJobId, router, user]);

  const fetchProfile = async (userId: string, userAuth?: any, prevProfile?: UserProfile) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        if (error.message.includes("relation \"profiles\" does not exist") || error.code === 'PGRST205' || error.message.includes("Could not find the table")) {
          setDbError(true);
          setMissingTables(prev => [...new Set([...prev, "profiles"])]);
          setToastMsg("⚠️ Database Setup Required: The 'profiles' table is missing. Go to Admin tab for setup SQL.");
          setShowToast(true);
          return;
        }
        throw error;
      }

      if (data) {
        const fallbackRole = prevProfile?.role || normalizeSignupRole(userAuth?.user_metadata?.role);
        const resolvedRole = normalizeUserRole(data.role, fallbackRole);

        // Normalize profile data to ensure arrays are not null/undefined
        const normalizedData: UserProfile = {
          ...data,
          role: resolvedRole,
          skills: Array.isArray(data.skills) ? data.skills : [],
          experience:
            Array.isArray(data.experience)
              ? data.experience
              : Array.isArray(data.aiInsights?.resumeExperience)
                ? data.aiInsights.resumeExperience
                : [],
          verifiedSkills: Array.isArray(data.verifiedSkills) ? data.verifiedSkills : [],
          softSkills: Array.isArray(data.softSkills) ? data.softSkills : (prevProfile ? prevProfile.softSkills : []),
          activeProjects: Array.isArray(data.activeProjects) ? data.activeProjects : [],
          workflows: Array.isArray(data.workflows) ? data.workflows : [],
          aboutSections: normalizeAboutSections(
            data.aiInsights?.aboutSections,
            typeof data.bio === "string" ? data.bio : "",
          ),
          servicesOffered: normalizeServicesOffered(data.aiInsights?.servicesOffered),
          preferredCurrency: normalizeCurrencyCode(data.aiInsights?.preferredCurrency),
          premiumProfile: prevProfile?.premiumProfile || {
            tier: "free",
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
          },
        };

        if (data.role !== resolvedRole) {
          void supabase
            .from("profiles")
            .update({ role: resolvedRole, updated_at: new Date().toISOString() })
            .eq("id", userId);
        }

        // --- SMART PORTFOLIO FETCHING ---
        const previousPortfolioItems =
          prevProfile?.id === userId && Array.isArray(prevProfile.portfolio)
            ? prevProfile.portfolio
            : [];
        let portfolioItems: PortfolioItem[] = previousPortfolioItems;
        let portfolioItemsLoaded = false;
        
        try {
          // 1. Try fetching from new schema: portfolios -> portfolio_projects
          const { data: pData, error: pErr } = await supabase
            .from('portfolios')
            .select(`
              id,
              about_me,
              tagline,
              custom_domain,
              theme_settings,
              portfolio_projects (*)
            `)
            .eq('profile_id', userId)
            .maybeSingle();
          
          if (!pErr && pData) {
            if (Array.isArray(pData.portfolio_projects)) {
              portfolioItems = pData.portfolio_projects.map((proj: any) => ({
                id: proj.id,
                profile_id: userId,
                title: proj.title,
                description: proj.description,
                image_url: proj.image_url,
                project_url: proj.project_url,
                technologies: Array.isArray(proj.technologies) ? proj.technologies : [],
                created_at: proj.created_at
              }));
              portfolioItemsLoaded = true;
            }

            const themeSettings = pData.theme_settings && typeof pData.theme_settings === "object"
              ? pData.theme_settings
              : {};
            const premiumProfile = themeSettings.premiumProfile && typeof themeSettings.premiumProfile === "object"
              ? themeSettings.premiumProfile
              : {};
            const proExpiryRaw =
              typeof premiumProfile.billing?.proExpiresAt === "string"
                ? premiumProfile.billing.proExpiresAt
                : "";
            const proExpiryDate = proExpiryRaw ? new Date(proExpiryRaw) : null;
            const hasValidProExpiry =
              !!proExpiryDate && !Number.isNaN(proExpiryDate.getTime());
            const isProExpired =
              premiumProfile.tier === "pro" &&
              hasValidProExpiry &&
              !!proExpiryDate &&
              proExpiryDate.getTime() <= Date.now();
            const isActivePro = premiumProfile.tier === "pro" && !isProExpired;

            const aboutSectionsFromTheme = normalizeAboutSections(
              themeSettings.aboutSections,
              typeof pData.about_me === "string" ? pData.about_me : normalizedData.bio,
            );
            const servicesFromTheme = normalizeServicesOffered(
              themeSettings.servicesOffered || normalizedData.servicesOffered,
            );
            normalizedData.aboutSections = aboutSectionsFromTheme;
            normalizedData.servicesOffered = servicesFromTheme;
            normalizedData.bio = aboutSectionsFromTheme.whatISpecializeIn || normalizedData.bio;
            normalizedData.premiumProfile = {
              tier: isActivePro ? "pro" : "free",
              verifiedBadge: premiumProfile.verifiedBadge ?? isActivePro,
              advancedPortfolio: premiumProfile.advancedPortfolio ?? isActivePro,
              featuredPlacement: isActivePro ? premiumProfile.featuredPlacement ?? false : false,
              analyticsEnabled: isActivePro ? premiumProfile.analyticsEnabled ?? false : false,
              customDomain:
                isActivePro
                  ? pData.custom_domain || premiumProfile.customDomain || buildPublicProfileUrl({ username: normalizedData.username, id: normalizedData.id })
                  : "",
              videoIntroUrl: isActivePro ? premiumProfile.videoIntroUrl || "" : "",
              introHeadline: premiumProfile.introHeadline || pData.tagline || "",
              billing: {
                proStatus:
                  isProExpired
                    ? "inactive"
                    : premiumProfile.billing?.proStatus === "active" ||
                        premiumProfile.billing?.proStatus === "past_due" ||
                        premiumProfile.billing?.proStatus === "cancelled"
                      ? premiumProfile.billing.proStatus
                      : "inactive",
                proLocked: isProExpired ? false : !!premiumProfile.billing?.proLocked,
                proLastEvent: premiumProfile.billing?.proLastEvent || "",
                proUpdatedAt: premiumProfile.billing?.proUpdatedAt || "",
                proActivatedAt: premiumProfile.billing?.proActivatedAt || "",
                proExpiresAt: proExpiryRaw,
              },
              analytics: {
                profileViews: Number(premiumProfile.analytics?.profileViews || 0),
                clientClicks: Number(premiumProfile.analytics?.clientClicks || 0),
              },
              verifiedProgram: {
                enrolled: !!premiumProfile.verifiedProgram?.enrolled,
                annualFee: Number(premiumProfile.verifiedProgram?.annualFee || 499),
                identityVerified: !!premiumProfile.verifiedProgram?.identityVerified,
                portfolioVerified: !!premiumProfile.verifiedProgram?.portfolioVerified,
                higherSearchRanking: !!premiumProfile.verifiedProgram?.higherSearchRanking,
                clientTrustBoost: !!premiumProfile.verifiedProgram?.clientTrustBoost,
              },
            };
          }

          if (!portfolioItemsLoaded) {
            if (pErr) console.warn("Note: Portfolios table might be missing or empty, falling back:", pErr.message);
            // 2. Fallback to old portfolio_items table if new one is empty or errors
            const { data: oldData } = await supabase
              .from('portfolio_items')
              .select('*')
              .eq('profile_id', userId);
            
            if (Array.isArray(oldData)) {
              portfolioItems = oldData;
              portfolioItemsLoaded = true;
            }
          }
        } catch (pFetchErr) {
          console.error("New portfolio fetch error, falling back:", pFetchErr);
          // 3. Last resort fallback
          const { data: lastResort } = await supabase
            .from('portfolio_items')
            .select('*')
            .eq('profile_id', userId);
          if (Array.isArray(lastResort)) {
            portfolioItems = lastResort;
          }
        }

        setProfile({ ...normalizedData, portfolio: portfolioItems });
        
        if (normalizedData.role === 'employer') {
          setView('client');
        } else if (normalizedData.role === 'admin') {
          setView('admin');
        } else {
          setView('freelancer');
        }
      } else {
        // Create initial profile if it doesn't exist
        const role = normalizeSignupRole(userAuth?.user_metadata?.role);
        const initialData: UserProfile = {
          id: userId,
          name: userAuth?.user_metadata?.full_name || userAuth?.email?.split('@')[0] || "User",
          role,
          category: "Developer" as const,
          skills: [],
          experience: [],
          hourlyRate: "$0",
          bio: "",
          preferredCurrency: "PHP",
          aboutSections: emptyAboutSections(),
          servicesOffered: [],
          premiumProfile: {
            tier: "free",
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
          },
        };
        const initialInsertData = { ...initialData } as Record<string, unknown>;
        delete initialInsertData.experience;
        const { error: insertError } = await supabase.from('profiles').insert([initialInsertData]);
        if (insertError) {
           if (insertError.code === 'PGRST205' || insertError.message.includes('relation')) {
             setDbError(true);
             setMissingTables(prev => [...new Set([...prev, "profiles"])]);
           } else {
             console.error("Error creating profile:", insertError);
           }
        }
        setProfile(prev => ({ ...prev, ...initialData }));
        if (role === 'employer') setView('client');
        else setView('freelancer');
      }
    } catch (err: any) {
      if (err?.code !== 'PGRST205') {
        console.warn("Profile fetch issue:", err);
      }
    }
  };

  const uploadProfilePhoto = async (file: File) => {
    if (!user) throw new Error("Please sign in before uploading a profile photo.");

    const extension = file.name.split(".").pop()?.toLowerCase() || "jpg";
    const objectPath = `avatars/${user.id}/${Date.now()}.${extension}`;
    const { error: uploadError } = await supabase.storage
      .from("attachments")
      .upload(objectPath, file, {
        cacheControl: "3600",
        contentType: file.type || "image/jpeg",
        upsert: true,
      });

    if (uploadError) {
      throw new Error(uploadError.message || "Unable to upload profile photo.");
    }

    const { data } = supabase.storage.from("attachments").getPublicUrl(objectPath);
    if (!data.publicUrl) throw new Error("Unable to create public profile photo URL.");

    const nextProfile = { ...profile, avatar_url: data.publicUrl };
    setProfile(nextProfile);
    return data.publicUrl;
  };

  const handleProfileSave = async (updatedProfile: UserProfile) => {
    if (!user) return;
    setIsSaving(true);
    try {
      let nextProfile = updatedProfile;
      const resolvedAboutSections = normalizeAboutSections(
        updatedProfile.aboutSections,
        updatedProfile.bio || "",
      );
      const resolvedServices = normalizeServicesOffered(updatedProfile.servicesOffered);
      nextProfile = {
        ...updatedProfile,
        aboutSections: resolvedAboutSections,
        servicesOffered: resolvedServices,
        bio: resolvedAboutSections.whatISpecializeIn || updatedProfile.bio || "",
      };

      // List of columns that definitely exist in the profiles table base on supabase_schema.sql
      const dbColumns = [
        'id', 'name', 'category', 'skills', 'hourlyRate', 'bio', 
        'avatar_url', 'companyName', 'verifiedSkills', 'softSkills', 
        'activeProjects', 'squad', 'aiInsights', 'ranking', 'status', 
        'verification_documents', 'wellness', 'updated_at', 'username', 
        'referring_freelancer_id', 'workflows'
      ];

      // Create a clean object with only database-compatible fields
      const profileToSave: any = {};

      // Only copy properties that are in our dbColumns list
      Object.keys(nextProfile).forEach(key => {
        if (dbColumns.includes(key) && (nextProfile as any)[key] !== undefined) {
          profileToSave[key] = (nextProfile as any)[key];
        }
      });

      if (Array.isArray(nextProfile.experience)) {
        profileToSave.aiInsights = {
          ...(profileToSave.aiInsights || {}),
          resumeExperience: nextProfile.experience,
        };
      }
      profileToSave.bio = nextProfile.aboutSections?.whatISpecializeIn || nextProfile.bio || "";
      profileToSave.aiInsights = {
        ...(profileToSave.aiInsights || {}),
        aboutSections: nextProfile.aboutSections || emptyAboutSections(),
        servicesOffered: nextProfile.servicesOffered || [],
        preferredCurrency: normalizeCurrencyCode(nextProfile.preferredCurrency || nextProfile.aiInsights?.preferredCurrency),
      };
      
      // Always add updated_at
      profileToSave.updated_at = new Date().toISOString();

      const savePayload = {
        userId: user.id,
        profile: {
          id: user.id,
          ...profileToSave,
        },
        portfolio: {
          customDomain: buildPublicProfileUrl({ username: nextProfile.username, id: nextProfile.id || user.id }),
          themeSettings: {
            aboutSections: nextProfile.aboutSections || emptyAboutSections(),
            servicesOffered: nextProfile.servicesOffered || [],
            aesthetic: "professional",
            primaryColor: "#4f46e5",
          },
        },
      };
      const saveProfileRequest = async () => {
        const currentOrigin = typeof window !== "undefined" ? window.location.origin : "";
        const candidateUrls = [
          "/api/profile/save",
          currentOrigin ? `${currentOrigin}/api/profile/save` : "",
          "http://localhost:3000/api/profile/save",
          "http://127.0.0.1:3000/api/profile/save",
        ].filter((url, index, urls) => url && urls.indexOf(url) === index);

        let lastError: unknown = null;
        for (const url of candidateUrls) {
          try {
            return await fetch(url, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(savePayload),
              cache: "no-store",
            });
          } catch (requestError) {
            lastError = requestError;
          }
        }

        return new Response(
          JSON.stringify({
            error:
              lastError instanceof Error && lastError.message
                ? `Profile save API request failed: ${lastError.message}`
                : "Profile save API request failed.",
          }),
          {
            status: 503,
            headers: { "Content-Type": "application/json" },
          },
        );
      };

      let response: Response;
      response = await saveProfileRequest();

      const payload = await response.json().catch(() => ({}));

      if (!response.ok) {
        setToastMsg(`Error: ${payload?.error || "Failed to save profile."}`);
        setShowToast(true);
        setTimeout(() => setShowToast(false), 6000);
        return;
      }
      
      setProfile(nextProfile);
      if (nextProfile.role === 'employer') {
        setView('client');
      } else if (nextProfile.role === 'admin') {
        setView('admin');
      } else {
        setView('freelancer');
      }
      setToastMsg("Profile saved successfully to database!");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    } catch (err: any) {
      if (err.code === '23505') {
        setToastMsg("⚠️ Error: Username is already taken. Please choose another one.");
      } else if (err.code === 'PGRST205' || err.message?.includes("relation \"profiles\" does not exist")) {
        setToastMsg("⚠️ Database Error: 'profiles' table not found. Go to Admin tab for setup instructions.");
      } else {
        setToastMsg(`Error: ${err.message || "Failed to save profile"}`);
      }
      setShowToast(true);
      setTimeout(() => setShowToast(false), 6000);
    } finally {
      setIsSaving(false);
    }
  };

  const handleUpdateProject = async (updatedProject: Project) => {
    if (!profile.activeProjects || !user) return;
    
    const updatedProjects = profile.activeProjects.map(p => 
      p.id === updatedProject.id ? updatedProject : p
    );
    
    // Update local state immediately (Optimistic)
    setProfile(prev => ({ ...prev, activeProjects: updatedProjects }));
    
    // Save ONLY the activeProjects column to DB to prevent race conditions with other profile fields
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ 
          activeProjects: updatedProjects,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);
        
      if (error) throw error;
    } catch (err: any) {
      console.error("Error updating project:", err);
      setToastMsg("Failed to sync project update to database.");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    }
  };

  const handleCreateProject = async (newProject: Project) => {
    if (!profile || !user) return;
    
    const updatedProjects = [...(profile.activeProjects || []), newProject];
    
    setProfile(prev => ({ ...prev, activeProjects: updatedProjects }));
    
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ 
          activeProjects: updatedProjects,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);
        
      if (error) throw error;
      setToastMsg("Project initialized successfully!");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    } catch (err: any) {
      console.error("Error creating project:", err);
      setToastMsg("Failed to sync new project to database.");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    }
  };

  const handleCreateSquad = async (newSquad: Squad) => {
    if (!profile || !user) return;
    
    setProfile(prev => ({ ...prev, squad: newSquad }));
    
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ 
          squad: newSquad,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);
        
      if (error) throw error;
      setToastMsg("Squad formed successfully!");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    } catch (err: any) {
      console.error("Error creating squad:", err);
      setToastMsg("Failed to sync squad to database.");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    }
  };

  const handleUpdateSquad = async (updatedSquad: Squad) => {
    if (!profile || !user) return;

    setProfile(prev => ({ ...prev, squad: updatedSquad }));

    try {
      const { error } = await supabase
        .from('profiles')
        .update({ 
          squad: updatedSquad,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);

      if (error) throw error;
      setToastMsg("Squad updated successfully!");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    } catch (err: any) {
      console.error("Error updating squad:", err);
      setToastMsg("Failed to update squad in database.");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    }
  };

  const handleUpdateWorkflows = async (updatedWorkflows: any[]) => {
    if (!profile || !user) return;
    
    setProfile(prev => ({ ...prev, workflows: updatedWorkflows }));
    
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ 
          workflows: updatedWorkflows,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);
        
      if (error) {
        if (error.message?.includes("'workflows' column") || error.code === 'PGRST204') {
          console.warn("Skipping workflows sync as column doesn't exist in DB");
          return;
        }
        throw error;
      }
    } catch (err: any) {
      console.error("Error updating workflows:", err);
      setToastMsg("Failed to sync workflows to database.");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    }
  };

  const fetchJobs = async () => {
    try {
      const { data, error } = await supabase
        .from('jobs')
        .select('*')
        .eq('status', 'live')
        .order('createdAt', { ascending: false });

      if (error) {
        if (error.message.includes("relation \"jobs\" does not exist") || error.code === 'PGRST205' || error.message.includes("Could not find the table")) {
          setDbError(true);
          setMissingTables(prev => [...new Set([...prev, "jobs"])]);
          console.warn("Table 'jobs' not found. Please run the SQL setup script.");
        } else if (error.code !== 'PGRST116') {
          console.warn("Jobs fetch issue:", error);
        }
        return;
      }

      if (data && data.length > 0) {
        const formattedJobs = data.map((job: any) => ({
          ...job,
          budget: Number.isFinite(Number(job.budget)) ? Number(job.budget) : 0,
          currencyCode: normalizeCurrencyCode(job.currency_code || job.currencyCode),
          rate:
            typeof job.rate === "string" && job.rate.trim().length > 0
              ? job.rate
              : `${normalizeCurrencyCode(job.currency_code || job.currencyCode)} ${Number.isFinite(Number(job.budget)) ? Number(job.budget).toLocaleString() : "0"}`,
          energyRequirement: job.energy_requirement || "Balanced",
          paymentMethod: job.paymentMethod || "Flat-Rate",
          jobType: job.jobType || "Contract"
        }));
        setJobs(formattedJobs);
      } else {
        setJobs([]);
      }
    } catch (err: any) {
      if (err?.code !== 'PGRST205') {
        console.warn("Jobs fetch issue:", err);
      }
    }
  };

  const fetchEmployerJobs = async (userId: string) => {
    try {
      // Fetch jobs along with their application counts
      const { data, error } = await supabase
        .from('jobs')
        .select('*, applications(count)')
        .eq('employer_id', userId)
        .order('createdAt', { ascending: false });

      if (error) {
        console.warn("Employer jobs fetch issue:", error);
        return;
      }

      if (data) {
        const formattedJobs = data.map((job: any) => ({
          ...job,
          budget: Number.isFinite(Number(job.budget)) ? Number(job.budget) : 0,
          currencyCode: normalizeCurrencyCode(job.currency_code || job.currencyCode),
          rate:
            typeof job.rate === "string" && job.rate.trim().length > 0
              ? job.rate
              : `${normalizeCurrencyCode(job.currency_code || job.currencyCode)} ${Number.isFinite(Number(job.budget)) ? Number(job.budget).toLocaleString() : "0"}`,
          applicantCount: job.applications?.[0]?.count || 0,
          energyRequirement: job.energy_requirement || "Balanced",
          paymentMethod: job.paymentMethod || "Flat-Rate",
          jobType: job.jobType || "Contract"
        }));
        setemployerJobs(formattedJobs);
      }
    } catch (err) {
      console.warn("Unexpected employer jobs fetch issue:", err);
    }
  };

  const closeJob = async (jobId: string) => {
    if (!user) return;
    try {
      const response = await fetch("/api/employer/close-job", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobId }),
      });
      const payload = await response.json().catch(() => ({}));

      if (!response.ok) throw new Error(payload?.error || "Unable to close job.");

      setemployerJobs((prev) => prev.map((job) => job.id === jobId ? { ...job, status: "closed" } as Job : job));
      setJobs((prev) => prev.filter((job) => job.id !== jobId));
      setEmployerJobFilter("closed");
      setToastMsg("Job closed.");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 2200);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to close job.";
      setToastMsg(`Error: ${message}`);
      setShowToast(true);
    }
  };

  // Tracking missing columns to avoid future errors
  const [missingColumns, setMissingColumns] = useState<string[]>([]);

  const fetchApplicants = async (jobId: string, jobTitle: string) => {
    setSelectedJobTitle(jobTitle);
    try {
      // Build select string based on known missing columns
      let selectString = '*';
      if (missingColumns.length > 0) {
        // If we know some columns are missing, we should probably just use a safe list
        // but for now, let's try to be specific if we can or just use the fallback logic
        selectString = 'id, job_id, freelancer_id, status, created_at';
        if (!missingColumns.includes('resume_url')) selectString += ', resume_url';
        if (!missingColumns.includes('portfolio_url')) selectString += ', portfolio_url';
        if (!missingColumns.includes('interview_url')) selectString += ', interview_url';
        if (!missingColumns.includes('cover_letter')) selectString += ', cover_letter';
      }

      const { data, error } = await supabase
        .from('applications')
        .select(selectString)
        .eq('job_id', jobId)
        .order('created_at', { ascending: false });

      if (error) {
        // More generic check for column-related errors (PostgREST code PGRST204)
        if (error.code === 'PGRST204' || error.message?.includes('column')) {
          console.warn("Schema mismatch detected, attempting fallback fetch for applications:", error.message);
          
          // Identify missing column from error message if possible
          if (error.message?.includes('portfolio_url')) setMissingColumns(prev => [...new Set([...prev, 'portfolio_url'])]);
          if (error.message?.includes('interview_url')) setMissingColumns(prev => [...new Set([...prev, 'interview_url'])]);
          if (error.message?.includes('resume_url')) setMissingColumns(prev => [...new Set([...prev, 'resume_url'])]);
          if (error.message?.includes('seeker_id')) setMissingColumns(prev => [...new Set([...prev, 'seeker_id'])]);
          
          // Fallback if some columns are missing
          // Try with only basic columns first
          const { data: fallbackData, error: fallbackError } = await supabase
            .from('applications')
            .select('id, job_id, freelancer_id, status, created_at')
            .eq('job_id', jobId)
            .order('created_at', { ascending: false });
          
          if (fallbackError) {
            // If even first fallback fails, try the bare minimum
            const { data: bareData, error: bareError } = await supabase
              .from('applications')
              .select('id, job_id, freelancer_id, status, created_at')
              .eq('job_id', jobId)
              .order('created_at', { ascending: false });
            
            if (bareError) throw bareError;
            const bareApplicants = bareData || [];
            const bareFreelancerIds = [...new Set(bareApplicants.map((item: any) => item.freelancer_id).filter(Boolean))];
            let bareProfilesMap: Record<string, any> = {};
            if (bareFreelancerIds.length > 0) {
              const { data: bareProfiles } = await supabase
                .from('profiles')
                .select('*')
                .in('id', bareFreelancerIds);
              if (bareProfiles) {
                bareProfilesMap = bareProfiles.reduce((acc: Record<string, any>, row: any) => {
                  acc[row.id] = row;
                  return acc;
                }, {});
              }
            }
            setSelectedJobApplicants(
              bareApplicants.map((item: any) => ({
                ...item,
                freelancer_profile: bareProfilesMap[item.freelancer_id] || null,
              }))
            );
          } else {
            const fallbackApplicants = fallbackData || [];
            const fallbackFreelancerIds = [...new Set(fallbackApplicants.map((item: any) => item.freelancer_id).filter(Boolean))];
            let fallbackProfilesMap: Record<string, any> = {};
            if (fallbackFreelancerIds.length > 0) {
              const { data: fallbackProfiles } = await supabase
                .from('profiles')
                .select('*')
                .in('id', fallbackFreelancerIds);
              if (fallbackProfiles) {
                fallbackProfilesMap = fallbackProfiles.reduce((acc: Record<string, any>, row: any) => {
                  acc[row.id] = row;
                  return acc;
                }, {});
              }
            }
            setSelectedJobApplicants(
              fallbackApplicants.map((item: any) => ({
                ...item,
                freelancer_profile: fallbackProfilesMap[item.freelancer_id] || null,
              }))
            );
          }
        } else {
          throw error;
        }
      } else {
        const applications = data || [];
        const freelancerIds = [...new Set(applications.map((item: any) => item.freelancer_id).filter(Boolean))];
        let profilesMap: Record<string, any> = {};
        if (freelancerIds.length > 0) {
          const { data: profilesData } = await supabase
            .from('profiles')
            .select('*')
            .in('id', freelancerIds);
          if (profilesData) {
            profilesMap = profilesData.reduce((acc: Record<string, any>, row: any) => {
              acc[row.id] = row;
              return acc;
            }, {});
          }
        }
        setSelectedJobApplicants(
          applications.map((item: any) => ({
            ...item,
            freelancer_profile: profilesMap[item.freelancer_id] || null,
          }))
        );
      }
      setShowApplicantsModal(true);
    } catch (err: any) {
      console.error("Error fetching applicants:", err);
      setToastMsg(`Failed to load applicants: ${err.message}`);
      setShowToast(true);
    }
  };

  const fetchAppliedJobs = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('applications')
        .select('job_id, status')
        .eq('freelancer_id', userId);
      
      if (!error && data) {
        const apps = data.reduce((acc: any, app: any) => {
          acc[app.job_id] = app.status;
          return acc;
        }, {});
        setAppliedJobs(apps);
      }
    } catch (err) {
      console.error("Error fetching applied jobs:", err);
    }
  };

  const getApplicationProfileData = (source: UserProfile) => {
    const applicationProfile = source.aiInsights?.applicationProfile || {};
    return {
      resumeUrl: (applicationProfile.resumeUrl || "").trim(),
      portfolioUrl: (applicationProfile.portfolioUrl || "").trim(),
      interviewUrl: (applicationProfile.interviewUrl || "").trim(),
      coverLetter: (applicationProfile.coverLetter || "").trim(),
    };
  };

  const openApplicationModal = (jobId: string) => {
    const applicationProfile = getApplicationProfileData(profile);
    const nextJob = jobs.find((job) => job.id === jobId) || null;
    setApplicationDraftJobId(jobId);
    setApplicationDraftCoverLetter(
      buildSuggestedCoverLetter(nextJob, profile, applicationProfile.coverLetter || ""),
    );
    setShowApplicationModal(true);
  };

  const closeApplicationModal = () => {
    if (isSubmittingApplication) return;
    setShowApplicationModal(false);
    setApplicationDraftJobId(null);
    setApplicationDraftCoverLetter("");
  };

  const handleApply = async (jobId: string) => {
    if (!user) {
      setToastMsg("Please login to apply for jobs.");
      setShowToast(true);
      if (typeof window !== "undefined") {
        router.push(`/auth?next=${encodeURIComponent(`/?apply=${jobId}`)}`);
      }
      return;
    }

    openApplicationModal(jobId);
  };

  const handlePasswordUpdate = async () => {
    if (newPassword.length < 8) {
      setToastMsg("Password must be at least 8 characters.");
      setShowToast(true);
      return;
    }

    if (newPassword !== confirmPassword) {
      setToastMsg("Passwords do not match.");
      setShowToast(true);
      return;
    }

    setSettingsLoading(true);

    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) throw error;

      setToastMsg("Password updated successfully.");
      setShowToast(true);
      setShowSettingsModal(false);
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to update password.";
      setToastMsg(message);
      setShowToast(true);
    } finally {
      setSettingsLoading(false);
    }
  };

  useEffect(() => {
    if (!showProfileMenu) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (!profileMenuRef.current?.contains(event.target as Node)) {
        setShowProfileMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showProfileMenu]);

  useEffect(() => {
    if (!pendingApplyJobId || jobs.length === 0) return;

    const selectedJob = jobs.find((job) => job.id === pendingApplyJobId);
    if (!selectedJob) {
      setPendingApplyJobId(null);
      return;
    }

    setFreelancerTab("jobs");

    if (profile.role !== "freelancer") {
      setToastMsg("Only freelancer accounts can apply for jobs.");
      setShowToast(true);
    } else {
      openApplicationModal(selectedJob.id);
    }

    const url = new URL(window.location.href);
    url.searchParams.delete("apply");
    window.history.replaceState({}, document.title, url.toString());
    setPendingApplyJobId(null);
  }, [pendingApplyJobId, jobs, profile.role]);

  const submitApplication = async (jobId: string, coverLetterOverride?: string) => {
    if (!user) return;

    const applicationProfile = getApplicationProfileData(profile);
    const resolvedCoverLetter = (coverLetterOverride ?? applicationProfile.coverLetter).trim();

    try {
      setIsSubmittingApplication(true);
      const insertData: any = { 
        job_id: jobId,
        freelancer_id: user.id,
        status: 'pending'
      };

      // Conditionally add columns based on whether we suspect they are missing
      if (!missingColumns.includes('seeker_id')) insertData.seeker_id = user.id;
      if (applicationProfile.resumeUrl && !missingColumns.includes('resume_url')) insertData.resume_url = applicationProfile.resumeUrl;
      if (applicationProfile.portfolioUrl && !missingColumns.includes('portfolio_url')) insertData.portfolio_url = applicationProfile.portfolioUrl;
      if (resolvedCoverLetter && !missingColumns.includes('cover_letter')) insertData.cover_letter = resolvedCoverLetter;

      // Only add interview_url if it's provided and not known to be missing
      if (applicationProfile.interviewUrl && !missingColumns.includes('interview_url')) {
        insertData.interview_url = applicationProfile.interviewUrl;
      }

      const { error } = await supabase
        .from('applications')
        .insert([insertData]);

      if (error) {
        if (error.code === '23505') {
          setAppliedJobs(prev => ({ ...prev, [jobId]: 'pending' }));
          setToastMsg("You have already applied for this job!");
        } else if (error.code === 'PGRST204' || error.message?.includes('column')) {
          console.warn("Schema mismatch detected, attempting fallback insert for applications:", error.message);
          
          // Identify missing column from error message
          if (error.message?.includes('portfolio_url')) setMissingColumns(prev => [...new Set([...prev, 'portfolio_url'])]);
          if (error.message?.includes('interview_url')) setMissingColumns(prev => [...new Set([...prev, 'interview_url'])]);
          if (error.message?.includes('resume_url')) setMissingColumns(prev => [...new Set([...prev, 'resume_url'])]);
          if (error.message?.includes('seeker_id')) setMissingColumns(prev => [...new Set([...prev, 'seeker_id'])]);

          // Retry with absolute minimal columns
          const minimalData: any = { 
            job_id: jobId,
            freelancer_id: user.id,
            status: 'pending'
          };
          
          // Add seeker_id only if not the one causing issues
          if (!error.message?.includes('seeker_id')) minimalData.seeker_id = user.id;

          // Only add cover_letter if provided and not causing issues
          if (resolvedCoverLetter && !error.message?.includes('cover_letter')) {
            minimalData.cover_letter = resolvedCoverLetter;
          }

          const { error: retryError } = await supabase
            .from('applications')
            .insert([minimalData]);
          
          if (retryError) throw retryError;
          
          setAppliedJobs(prev => ({ ...prev, [jobId]: 'pending' }));
          setToastMsg("Application submitted. Some optional fields were skipped because your database schema is out of date.");
        } else {
          throw error;
        }
      } else {
        setAppliedJobs(prev => ({ ...prev, [jobId]: 'pending' }));
        setToastMsg("Application submitted successfully. The hirer can now review your application.");
      }
      setShowApplicationModal(false);
      setApplicationDraftJobId(null);
      setApplicationDraftCoverLetter("");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    } catch (err: any) {
      console.error("Error applying for job:", err);
      setToastMsg(`Error: ${err.message || "Failed to submit application"}`);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 5000);
    } finally {
      setIsSubmittingApplication(false);
    }
  };

  const approveApplication = async (applicationId: string, freelancerId: string, jobId: string, jobTitle: string, budget: number) => {
    if (!user) return;
    try {
      setIsSaving(true);

      const response = await fetch("/api/employer/approve-application", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          applicationId,
          freelancerId,
          jobId,
          jobTitle,
          budget,
        }),
      });

      const payload = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(payload?.error || "Failed to approve application");
      }

      setToastMsg("Freelancer approved successfully.");
      setShowToast(true);
      
      // Refresh applicants list locally
      setSelectedJobApplicants(prev => prev.map(app => 
        app.id === applicationId ? { ...app, status: 'hired' } : app
      ));

    } catch (err: any) {
      console.error("Error approving application:", err);
      setToastMsg(`Error: ${err.message || "Failed to approve application"}`);
      setShowToast(true);
    } finally {
      setIsSaving(false);
    }
  };

  const rejectApplication = async (applicationId: string) => {
    if (!user) return;
    try {
      setIsSaving(true);
      const { error } = await supabase
        .from("applications")
        .update({ status: "rejected" })
        .eq("id", applicationId);

      if (error) throw error;

      setSelectedJobApplicants((prev) =>
        prev.map((app) => (app.id === applicationId ? { ...app, status: "rejected" } : app)),
      );
      setToastMsg("Applicant rejected.");
      setShowToast(true);
    } catch (err: any) {
      console.error("Error rejecting application:", err);
      setToastMsg(`Error: ${err.message || "Failed to reject applicant"}`);
      setShowToast(true);
    } finally {
      setIsSaving(false);
    }
  };

  const fetchFreelancers = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select(`
          *,
          portfolio_items(*)
        `)
        .eq('role', 'freelancer')
        .order('ranking', { ascending: true });

      if (error) {
        console.warn("Freelancer list fetch issue:", error);
        return;
      }

      if (data) {
        const normalizedFreelancers = data.map((f: any) => {
          const normalizedAbout = normalizeAboutSections(f.aiInsights?.aboutSections, f.bio || "");
          const normalizedServices = normalizeServicesOffered(f.aiInsights?.servicesOffered);
          return {
            ...f,
            aboutSections: normalizedAbout,
            servicesOffered: normalizedServices,
            clientReviews: Array.isArray(f.aiInsights?.clientReviews) ? f.aiInsights.clientReviews : [],
            bio: normalizedAbout.whatISpecializeIn || f.bio || "",
            portfolio: f.portfolio_items || []
          };
        });
        setFreelancers(normalizedFreelancers);
      }
    } catch (err) {
      console.warn("Unexpected freelancer list fetch issue:", err);
    }
  };

  const fetchPortfolioInquiries = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('portfolio_inquiries')
        .select('*')
        .eq('freelancer_id', userId)
        .order('created_at', { ascending: false });
      
      if (!error && data) {
        const sanitized = data
          .filter(Boolean)
          .map((inquiry: any) => {
            const senderName =
              typeof inquiry?.sender_name === "string" && inquiry.sender_name.trim().length > 0
                ? inquiry.sender_name
                : "Unknown Sender";
            const senderEmail =
              typeof inquiry?.sender_email === "string" && inquiry.sender_email.trim().length > 0
                ? inquiry.sender_email
                : "";
            const message =
              typeof inquiry?.message === "string" && inquiry.message.trim().length > 0
                ? inquiry.message
                : "No message provided.";
            return {
              ...inquiry,
              sender_name: senderName,
              sender_email: senderEmail,
              message,
            };
          });
        setPortfolioInquiries(sanitized);
      }
    } catch (err) {
      console.error("Error fetching portfolio inquiries:", err);
    }
  };

  const fetchNotifications = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
      
      if (!error && data) {
        setNotifications(data);
      }
    } catch (err) {
      console.error("Error fetching notifications:", err);
    }
  };

  const fetchTalentInvitations = async (userId = user?.id) => {
    if (!userId) {
      setSentTalentInvitations([]);
      setReceivedTalentInvitations([]);
      return;
    }

    try {
      const fetchInvitationScope = async (scope: "sent" | "received") => {
        const controller = new AbortController();
        const timeout = window.setTimeout(() => controller.abort(), 10000);
        try {
          return await fetch(`/api/talent-invitations?scope=${scope}&userId=${encodeURIComponent(userId)}`, {
            cache: "no-store",
            signal: controller.signal,
          });
        } catch {
          await new Promise((resolve) => setTimeout(resolve, 700));
          return fetch(`/api/talent-invitations?scope=${scope}&userId=${encodeURIComponent(userId)}`, {
            cache: "no-store",
          });
        } finally {
          window.clearTimeout(timeout);
        }
      };
      const [sentResult, receivedResult] = await Promise.allSettled([
        fetchInvitationScope("sent"),
        fetchInvitationScope("received"),
      ]);
      const sentResponse = sentResult.status === "fulfilled" ? sentResult.value : null;
      const receivedResponse = receivedResult.status === "fulfilled" ? receivedResult.value : null;
      const sentPayload = sentResponse ? await sentResponse.json().catch(() => ({})) : {};
      const receivedPayload = receivedResponse ? await receivedResponse.json().catch(() => ({})) : {};

      if (sentResponse?.ok) {
        setSentTalentInvitations(Array.isArray(sentPayload.invitations) ? sentPayload.invitations : []);
      }
      if (receivedResponse?.ok) {
        setReceivedTalentInvitations(Array.isArray(receivedPayload.invitations) ? receivedPayload.invitations : []);
      }
    } catch (err) {
      console.warn("Talent invitations are temporarily unavailable.");
    }
  };

  const fetchSavedTalents = useCallback(async (userId = user?.id) => {
    if (!userId) {
      setSavedTalentIds([]);
      return;
    }

    try {
      const response = await fetch("/api/saved-talents", { cache: "no-store" });
      const payload = await response.json().catch(() => ({}));

      if (!response.ok) {
        console.warn("Saved talents fetch issue:", payload?.error || response.statusText);
        return;
      }

      setSavedTalentIds(
        Array.isArray(payload.freelancerIds)
          ? payload.freelancerIds.filter((entry: unknown): entry is string => typeof entry === "string")
          : [],
      );
    } catch (err) {
      console.warn("Unexpected saved talents fetch issue:", err);
    }
  }, [user]);
  
  const fetchFollows = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('follows')
        .select('following_id')
        .eq('follower_id', userId);
      
      if (!error && data) {
        setUserFollows(data.map(f => f.following_id));
      }
    } catch (err) {
      console.error("Error fetching follows:", err);
    }
  };

  const toggleFollow = async (targetId: string) => {
    if (!user) return;
    
    const isFollowing = userFollows.includes(targetId);
    
    if (isFollowing) {
      const { error } = await supabase
        .from('follows')
        .delete()
        .eq('follower_id', user.id)
        .eq('following_id', targetId);
      
      if (!error) {
        setUserFollows(prev => prev.filter(id => id !== targetId));
      }
    } else {
      const { error } = await supabase
        .from('follows')
        .insert({ follower_id: user.id, following_id: targetId });
      
      if (!error) {
        setUserFollows(prev => [...prev, targetId]);
      }
    }
  };

  const toggleSavedTalent = async (freelancerId?: string) => {
    if (!freelancerId || !user) return;
    const isSaved = savedTalentIds.includes(freelancerId);
    const previousIds = savedTalentIds;
    const nextIds = isSaved
      ? previousIds.filter((id) => id !== freelancerId)
      : [freelancerId, ...previousIds.filter((id) => id !== freelancerId)];

    setSavedTalentIds(nextIds);

    try {
      const response = await fetch(
        isSaved ? `/api/saved-talents?freelancerId=${encodeURIComponent(freelancerId)}` : "/api/saved-talents",
        isSaved
          ? { method: "DELETE" }
          : {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ freelancerId }),
            },
      );
      const payload = await response.json().catch(() => ({}));

      if (!response.ok) {
        setSavedTalentIds(previousIds);
        setToastMsg(`Error: ${payload?.error || "Failed to update saved talent."}`);
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3200);
        return;
      }

      if (!isSaved) {
        setContactUnlockTalentId(freelancerId);
        window.setTimeout(() => setContactUnlockTalentId((current) => (current === freelancerId ? null : current)), 1600);
      }
      setToastMsg(isSaved ? "Talent removed from saved list." : "Talent saved to your hiring shortlist.");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 2200);
    } catch (error) {
      setSavedTalentIds(previousIds);
      const message = error instanceof Error ? error.message : "Failed to update saved talent.";
      setToastMsg(`Error: ${message}`);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3200);
    }
  };

  const sendTalentInvite = async (freelancer: UserProfile) => {
    if (!user || !freelancer.id) return;
    const freelancerId = freelancer.id;
    if (
      invitedTalentIds.includes(freelancerId) ||
      sentTalentInvitations.some((invitation) => invitation.freelancer_id === freelancerId)
    ) {
      setToastMsg("Invitation already sent to this freelancer.");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 2200);
      return;
    }

    const response = await fetch("/api/talent-invitations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ freelancerId }),
    });
    const payload = await response.json().catch(() => ({}));

    if (!response.ok) {
      setToastMsg(`Error: ${payload?.error || "Failed to send invitation."}`);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3500);
      return;
    }

    setInvitedTalentIds((prev) => [freelancerId, ...prev]);
    if (payload.invitation) {
      setSentTalentInvitations((prev) => [
        payload.invitation,
        ...prev.filter((item) => item.id !== payload.invitation.id),
      ]);
    }
    setContactUnlockTalentId(freelancerId);
    window.setTimeout(() => setContactUnlockTalentId((current) => (current === freelancerId ? null : current)), 1600);
    setToastMsg(`Invitation sent to ${freelancer.name}.`);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2500);
  };

  const updateTalentInvitationStatus = async (
    invitationId: string,
    status: "accepted" | "rejected" | "cancelled",
  ) => {
    try {
      const response = await fetch("/api/talent-invitations", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ invitationId, status }),
      });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(payload?.error || "Unable to update invitation.");

      if (payload.invitation) {
        const nextInvitation = payload.invitation as TalentInvitation;
        setReceivedTalentInvitations((prev) =>
          prev.map((item) => (item.id === nextInvitation.id ? nextInvitation : item)),
        );
        setSentTalentInvitations((prev) =>
          prev.map((item) => (item.id === nextInvitation.id ? nextInvitation : item)),
        );
      }

      setToastMsg(status === "accepted" ? "Invitation accepted." : "Invitation updated.");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 2500);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to update invitation.";
      setToastMsg(`Error: ${message}`);
      setShowToast(true);
    }
  };

  const scheduleTalentInterview = async (invitation: TalentInvitation) => {
    const draft = interviewDrafts[invitation.id] || {
      interviewAt:
        invitation.interview_at ||
        (invitation.interview_request_status === "pending" ? invitation.interview_request_at || "" : ""),
      interviewLink: invitation.interview_link || "",
    };

    if (!draft.interviewAt || !draft.interviewLink.trim()) {
      setToastMsg("Please add interview date/time and meeting link.");
      setShowToast(true);
      return;
    }

    try {
      const response = await fetch("/api/talent-invitations", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          invitationId: invitation.id,
          interviewAt: draft.interviewAt,
          interviewLink: draft.interviewLink.trim(),
        }),
      });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(payload?.error || "Unable to schedule interview.");

      if (payload.invitation) {
        const nextInvitation = payload.invitation as TalentInvitation;
        setSentTalentInvitations((prev) =>
          prev.map((item) => (item.id === nextInvitation.id ? nextInvitation : item)),
        );
      }
      setToastMsg("Interview details saved and sent to freelancer.");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 2500);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to schedule interview.";
      setToastMsg(`Error: ${message}`);
      setShowToast(true);
    }
  };

  const markTalentWorkCompleted = async (invitation: TalentInvitation) => {
    if (!invitation?.id) return;
    try {
      setIsMarkingTalentWorkComplete(true);
      const response = await fetch("/api/talent-invitations", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          invitationId: invitation.id,
          workStatus: "completed",
        }),
      });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(payload?.error || "Unable to mark work completed.");

      if (payload.invitation) {
        const nextInvitation = payload.invitation as TalentInvitation;
        setSentTalentInvitations((prev) =>
          prev.map((item) => (item.id === nextInvitation.id ? nextInvitation : item)),
        );
      }

      setToastMsg("Work marked completed. Feedback is now unlocked.");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 2600);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to mark work completed.";
      setToastMsg(`Error: ${message}`);
      setShowToast(true);
    } finally {
      setIsMarkingTalentWorkComplete(false);
    }
  };

  const submitFreelancerReview = async () => {
    if (!selectedFreelancer?.id || !selectedFreelancerAcceptedInvitation) return;
    try {
      setIsSubmittingFreelancerFeedback(true);
      const response = await fetch("/api/freelancer-reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          freelancerId: selectedFreelancer.id,
          invitationId: selectedFreelancerAcceptedInvitation.id,
          rating: freelancerFeedbackRating,
          comment: freelancerFeedbackComment,
          projectTitle:
            freelancerFeedbackProjectTitle.trim() ||
            selectedFreelancerAcceptedInvitation.latestJob?.title ||
            "Completed TaraWork engagement",
        }),
      });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(payload?.error || "Unable to submit freelancer feedback.");

      if (payload.review) {
        const review = payload.review;
        const updateReviews = (freelancer: UserProfile) => ({
          ...freelancer,
          clientReviews: [review, ...(Array.isArray((freelancer as any).clientReviews) ? (freelancer as any).clientReviews : [])],
          aiInsights: {
            ...(freelancer.aiInsights || { gapAnalysis: [], compatibilityScore: 0, cultureMatch: [] }),
            clientReviews: [review, ...(Array.isArray((freelancer as any).clientReviews) ? (freelancer as any).clientReviews : [])],
          },
        });

        setSelectedFreelancer((prev) => (prev ? updateReviews(prev) : prev));
        setFreelancers((prev) =>
          prev.map((freelancer) => (freelancer.id === selectedFreelancer.id ? updateReviews(freelancer) : freelancer)),
        );
      }

      setFreelancerFeedbackComment("");
      setFreelancerFeedbackProjectTitle("");
      setFreelancerFeedbackRating(5);
      setToastMsg("Feedback submitted for completed work.");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 2600);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to submit freelancer feedback.";
      setToastMsg(`Error: ${message}`);
      setShowToast(true);
    } finally {
      setIsSubmittingFreelancerFeedback(false);
    }
  };

  const requestInterviewReschedule = async (invitation: TalentInvitation) => {
    const draft = rescheduleDrafts[invitation.id] || { requestAt: "", note: "" };
    if (!draft.requestAt) {
      setToastMsg("Please choose your preferred interview date/time.");
      setShowToast(true);
      return;
    }

    try {
      const response = await fetch("/api/talent-invitations", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          invitationId: invitation.id,
          interviewRequestAt: draft.requestAt,
          interviewRequestNote: draft.note.trim(),
        }),
      });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(payload?.error || "Unable to request another date.");

      if (payload.invitation) {
        const nextInvitation = payload.invitation as TalentInvitation;
        setReceivedTalentInvitations((prev) =>
          prev.map((item) => (item.id === nextInvitation.id ? nextInvitation : item)),
        );
      }
      setToastMsg("Reschedule request sent to employer.");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 2500);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to request another date.";
      setToastMsg(`Error: ${message}`);
      setShowToast(true);
    }
  };

  const markNotificationRead = async (id: string) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('id', id);
      
      if (!error) {
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n));
      }
    } catch (err) {
      console.error("Error marking notification read:", err);
    }
  };

  const fetchUnreadCount = async (userId: string) => {
    try {
      const { count, error } = await supabase
        .from('messages')
        .select('*', { count: 'exact', head: true })
        .eq('is_read', false)
        .neq('sender_id', userId);
      
      if (!error) {
        setUnreadCount(count || 0);
      }
    } catch (err) {
      console.error("Error fetching unread count:", err);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedFreelancerSearchTerm(freelancerSearchTerm);
    }, 500);
    return () => clearTimeout(timer);
  }, [freelancerSearchTerm]);

  const parseHourlyRate = (hourlyRate: string): number => {
    const parsedRate = Number.parseFloat(hourlyRate.replace(/[^0-9.]/g, ""));
    return Number.isFinite(parsedRate) ? parsedRate : 0;
  };

  const getFreelancerTrustSignals = (freelancer: UserProfile) => {
    return {
      isPremium: false,
      isVerified: !!freelancer.wellness?.verifiedSustainable,
      completionRate: 92,
      onTimeDeliveryRate: 93,
      repeatClientRate: 28,
      inviteRate: 38,
      inviteResponseHours: 4,
    };
  };

  const getFreelancerRating = (freelancer: UserProfile) => {
    const reviews = Array.isArray((freelancer as any).clientReviews)
      ? (freelancer as any).clientReviews
      : [];
    const validRatings = reviews
      .map((review: any) => Number(review?.rating))
      .filter((rating: number) => Number.isFinite(rating) && rating > 0);
    const average =
      validRatings.length > 0
        ? validRatings.reduce((total: number, rating: number) => total + rating, 0) / validRatings.length
        : 0;

    return {
      average,
      count: validRatings.length,
    };
  };

  const selectedFreelancerAcceptedInvitation = useMemo(() => {
    if (!selectedFreelancer?.id) return null;
    return (
      sentTalentInvitations.find(
        (invitation) =>
          invitation.freelancer_id === selectedFreelancer.id && invitation.status === "accepted",
      ) || null
    );
  }, [selectedFreelancer?.id, sentTalentInvitations]);

  const selectedFreelancerWorkCompleted = Boolean(
    selectedFreelancerAcceptedInvitation &&
      (selectedFreelancerAcceptedInvitation.work_status === "completed" ||
        selectedFreelancerAcceptedInvitation.completed_at),
  );

  const selectedFreelancerAlreadyReviewed = useMemo(() => {
    if (!selectedFreelancerAcceptedInvitation || !user?.id || !selectedFreelancer) return false;
    const reviews = Array.isArray((selectedFreelancer as any).clientReviews)
      ? (selectedFreelancer as any).clientReviews
      : [];
    return reviews.some(
      (review: any) =>
        review?.invitationId === selectedFreelancerAcceptedInvitation.id ||
        review?.employerId === user.id,
    );
  }, [selectedFreelancer, selectedFreelancerAcceptedInvitation, user?.id]);

  const openTalentProfile = (freelancerLike: Partial<UserProfile> & { id?: string | null }) => {
    const freelancerId = freelancerLike.id || "";
    const fullProfile = freelancers.find((freelancer) => freelancer.id === freelancerId);
    const nextProfile =
      fullProfile ||
      ({
        ...freelancerLike,
        id: freelancerId,
        name: freelancerLike.name || "Freelancer",
        role: "freelancer",
        category: freelancerLike.category || "General",
        skills: freelancerLike.skills || [],
        hourlyRate: freelancerLike.hourlyRate || "$0",
        bio: freelancerLike.bio || "",
        portfolio: freelancerLike.portfolio || [],
        aboutSections: freelancerLike.aboutSections || emptyAboutSections(),
        servicesOffered: freelancerLike.servicesOffered || [],
        clientReviews: Array.isArray((freelancerLike as any).clientReviews) ? (freelancerLike as any).clientReviews : [],
      } as UserProfile);

    setSelectedFreelancer(nextProfile);
    setActiveFreelancerProfileTab("overview");
    setFreelancerFeedbackComment("");
    setFreelancerFeedbackProjectTitle("");
    setFreelancerFeedbackRating(5);
    setShowFreelancerModal(true);
  };

  const searchedFreelancers = useMemo(() => {
    const normalizedSearch = debouncedFreelancerSearchTerm.toLowerCase();
    return freelancers.filter((freelancer) =>
      freelancer.name.toLowerCase().includes(normalizedSearch) ||
      freelancer.category.toLowerCase().includes(normalizedSearch) ||
      freelancer.skills.some((skill) => skill.toLowerCase().includes(normalizedSearch)) ||
      (freelancer.servicesOffered || []).some((service) =>
        service.serviceName.toLowerCase().includes(normalizedSearch),
      ),
    );
  }, [freelancers, debouncedFreelancerSearchTerm]);

  const serviceTypeOptions = useMemo(() => {
    const uniqueServices = new Set<string>();
    freelancers.forEach((freelancer) => {
      (freelancer.servicesOffered || []).forEach((service) => {
        const serviceName = service.serviceName.trim();
        if (serviceName) uniqueServices.add(serviceName);
      });
    });
    return Array.from(uniqueServices).sort((a, b) => a.localeCompare(b));
  }, [freelancers]);

  const filteredFreelancers = useMemo(() => {
    return searchedFreelancers
      .filter((freelancer) => {
        const trustSignals = getFreelancerTrustSignals(freelancer);
        const matchesServiceType =
          serviceTypeFilter === "all" ||
          (freelancer.servicesOffered || []).some(
            (service) => service.serviceName.toLowerCase() === serviceTypeFilter.toLowerCase(),
          );
        const matchesSavedFilter =
          talentsFilter === "all" ||
          (!!freelancer.id && savedTalentIds.includes(freelancer.id));
        const rating = getFreelancerRating(freelancer);
        const matchesRating =
          talentRatingFilter === "all" ||
          (rating.count > 0 && rating.average >= Number(talentRatingFilter));

        return matchesServiceType && matchesSavedFilter && matchesRating;
      })
      .sort((a, b) => {
        if (talentsSort === "rate_low") {
          return parseHourlyRate(a.hourlyRate) - parseHourlyRate(b.hourlyRate);
        }

        if (talentsSort === "rate_high") {
          return parseHourlyRate(b.hourlyRate) - parseHourlyRate(a.hourlyRate);
        }

        const aSignals = getFreelancerTrustSignals(a);
        const bSignals = getFreelancerTrustSignals(b);

        const aScore =
          (aSignals.isVerified ? 12 : 0) +
          aSignals.completionRate * 0.2 +
          aSignals.onTimeDeliveryRate * 0.2 +
          aSignals.repeatClientRate * 0.25 +
          aSignals.inviteRate * 0.1 +
          Math.max(0, 12 - aSignals.inviteResponseHours);

        const bScore =
          (bSignals.isVerified ? 12 : 0) +
          bSignals.completionRate * 0.2 +
          bSignals.onTimeDeliveryRate * 0.2 +
          bSignals.repeatClientRate * 0.25 +
          bSignals.inviteRate * 0.1 +
          Math.max(0, 12 - bSignals.inviteResponseHours);

        return bScore - aScore;
      });
  }, [searchedFreelancers, talentsFilter, talentsSort, serviceTypeFilter, savedTalentIds, talentRatingFilter]);

  const visibleFreelancers = useMemo(
    () => filteredFreelancers.slice(0, visibleTalentsCount),
    [filteredFreelancers, visibleTalentsCount],
  );

  const hasMoreFreelancers = visibleTalentsCount < filteredFreelancers.length;

  useEffect(() => {
    setVisibleTalentsCount(12);
  }, [debouncedFreelancerSearchTerm, serviceTypeFilter, talentsSort, talentsFilter, talentRatingFilter]);

  useEffect(() => {
    async function checkUser() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        setLoading(false);
      } else {
        setUser(session.user);
        loadedSessionIdRef.current = session.user.id;
        
        // Fetch real profile from DB
        const currentProfile = profile;
        await fetchProfile(session.user.id, session.user, currentProfile);
        
        // Fetch jobs from DB
        await fetchJobs();
        await fetchAppliedJobs(session.user.id);
        await fetchEmployerJobs(session.user.id);
        await fetchFreelancers();
        await fetchUnreadCount(session.user.id);
        await fetchNotifications(session.user.id);
        await fetchTalentInvitations(session.user.id);
        await fetchSavedTalents(session.user.id);
        await fetchFollows(session.user.id);
        await fetchPortfolioInquiries(session.user.id);
        
        // Subscribe to notifications
        const notifChannel = supabase
          .channel('notifications-changes')
          .on('postgres_changes', { 
            event: '*', 
            schema: 'public', 
            table: 'notifications',
            filter: `user_id=eq.${session.user.id}`
          }, () => {
            fetchNotifications(session.user.id);
          })
          .subscribe();

        // Subscribe to portfolio inquiries
        const inquiryChannel = supabase
          .channel('inquiry-changes')
          .on('postgres_changes', { 
            event: '*', 
            schema: 'public', 
            table: 'portfolio_inquiries',
            filter: `freelancer_id=eq.${session.user.id}`
          }, () => {
            fetchPortfolioInquiries(session.user.id);
          })
          .subscribe();

        // Subscribe to messages for unread count
        const channel = supabase
          .channel('unread-count')
          .on('postgres_changes', { 
            event: '*', 
            schema: 'public', 
            table: 'messages' 
          }, () => {
            fetchUnreadCount(session.user.id);
          })
          .subscribe();

        // Subscribe to profile changes for real-time projects
        const profileChannel = supabase
          .channel('profile-changes')
          .on('postgres_changes', { 
            event: 'UPDATE', 
            schema: 'public', 
            table: 'profiles',
            filter: `id=eq.${session.user.id}`
          }, (payload) => {
            setProfile(prev => {
              const newData = payload.new as any;
              const normalizedAboutSections = normalizeAboutSections(
                newData.aiInsights?.aboutSections,
                typeof newData.bio === "string" ? newData.bio : prev.bio,
              );
              return {
                ...prev,
                ...newData,
                skills: Array.isArray(newData.skills) ? newData.skills : (prev.skills || []),
                experience: Array.isArray(newData.experience)
                  ? newData.experience
                  : Array.isArray(newData.aiInsights?.resumeExperience)
                    ? newData.aiInsights.resumeExperience
                    : (prev.experience || []),
                verifiedSkills: Array.isArray(newData.verifiedSkills) ? newData.verifiedSkills : (prev.verifiedSkills || []),
                softSkills: Array.isArray(newData.softSkills) ? newData.softSkills : (prev.softSkills || []),
                activeProjects: Array.isArray(newData.activeProjects) ? newData.activeProjects : (prev.activeProjects || []),
                workflows: Array.isArray(newData.workflows) ? newData.workflows : (prev.workflows || []),
                aboutSections: normalizedAboutSections,
                servicesOffered: normalizeServicesOffered(newData.aiInsights?.servicesOffered || prev.servicesOffered),
                bio: normalizedAboutSections.whatISpecializeIn || prev.bio,
                preferredCurrency: normalizeCurrencyCode(newData.aiInsights?.preferredCurrency || prev.preferredCurrency),
              };
            });
          })
          .subscribe();

        // Subscribe to applications for realtime updates
        const applicationsChannel = supabase
          .channel('applications-changes')
          .on('postgres_changes', { 
            event: '*', 
            schema: 'public', 
            table: 'applications' 
          }, () => {
            fetchEmployerJobs(session.user.id);
            fetchAppliedJobs(session.user.id);
          })
          .subscribe();

        // Subscribe to jobs for realtime updates
        const jobsChannel = supabase
          .channel('jobs-changes')
          .on('postgres_changes', { 
            event: '*', 
            schema: 'public', 
            table: 'jobs' 
          }, () => {
            fetchJobs();
            fetchEmployerJobs(session.user.id);
          })
          .subscribe();
        
        // Check for first-time social login to show notification
        const isNewSocial = typeof window !== 'undefined' ? sessionStorage.getItem('social_login_pending') : null;
        if (isNewSocial) {
          setToastMsg(`Connection Successful! A confirmation notification has been sent to your ${isNewSocial} account.`);
          setShowToast(true);
          sessionStorage.removeItem('social_login_pending');
          setTimeout(() => setShowToast(false), 5000);
        }
        setLoading(false);
      }
    }
    checkUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        setUser(null);
        loadedSessionIdRef.current = null;
        setLoading(false);
      } else {
        setUser(session.user);
        if (loadedSessionIdRef.current === session.user.id) {
          setLoading(false);
          return;
        }
        loadedSessionIdRef.current = session.user.id;
        fetchProfile(session.user.id, session.user);
        fetchTalentInvitations(session.user.id);
        fetchSavedTalents(session.user.id);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-500 font-bold animate-pulse uppercase tracking-widest text-xs">Authenticating...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <LandingPage />;
  }

  const addPortfolioItem = async (item: Partial<PortfolioItem>) => {
    if (!user) return;
    try {
      const response = await fetch("/api/portfolio/items", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(item),
      });
      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload?.error || "Unable to save portfolio item.");
      }

      setProfile(prev => ({
        ...prev,
        portfolio: [...(prev.portfolio || []), payload.item]
      }));
      setToastMsg("Portfolio item added!");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    } catch (err: any) {
      console.error("Error adding portfolio item:", err);
      setToastMsg(`Error: ${err.message}`);
      setShowToast(true);
    }
  };

  const updatePortfolioItem = async (item: PortfolioItem) => {
    try {
      const response = await fetch("/api/portfolio/items", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(item),
      });
      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload?.error || "Unable to update portfolio item.");
      }

      setProfile(prev => ({
        ...prev,
        portfolio: (prev.portfolio || []).map(i => i.id === item.id ? payload.item : i)
      }));
      setToastMsg("Portfolio item updated!");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    } catch (err: any) {
      console.error("Error updating portfolio item:", err);
      setToastMsg(`Error: ${err.message}`);
      setShowToast(true);
    }
  };

  const removePortfolioItem = async (id: string) => {
    try {
      const response = await fetch(`/api/portfolio/items?id=${encodeURIComponent(id)}`, {
        method: "DELETE",
      });
      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload?.error || "Unable to delete portfolio item.");
      }

      setProfile(prev => ({
        ...prev,
        portfolio: (prev.portfolio || []).filter(item => item.id !== id)
      }));
      setToastMsg("Portfolio item removed.");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    } catch (err: any) {
      console.error("Error removing portfolio item:", err);
      setToastMsg(`Error: ${err.message}`);
      setShowToast(true);
    }
  };

  const toastLabel =
    toastMsg.startsWith("Error:") || toastMsg.startsWith("Connection error:") || toastMsg.includes("Error:")
      ? "Action Required"
      : toastMsg.includes("success") || toastMsg.includes("Success") || toastMsg.includes("saved")
        ? "Update Complete"
        : "Notification";

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans">
      {/* AI Vetting Agent */}
      <AIAgent 
        isOpen={isVetting} 
        onClose={() => setIsVetting(false)} 
        mode="vetting" 
        targetData={vettingData} 
      />

      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-slate-200">
        {dbError && (
          <div className="bg-indigo-600 text-white text-[10px] sm:text-xs font-bold py-2.5 px-4 text-center animate-in fade-in slide-in-from-top-2 duration-500 flex items-center justify-center gap-3 shadow-lg">
            <div className="flex items-center gap-2">
              <Shield className="w-3.5 h-3.5 text-indigo-200" />
              <span className="uppercase tracking-widest">Platform Status: Initialization Required</span>
            </div>
            <div className="h-4 w-px bg-white/20 hidden sm:block"></div>
            <span className="opacity-90 font-medium">Some database tables ({missingTables.join(", ")}) need to be set up for full functionality.</span>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => handleViewSwitch("admin")}
                className="bg-white text-indigo-600 px-3 py-1 rounded-full text-[10px] font-black hover:bg-indigo-50 transition-all cursor-pointer uppercase tracking-tighter"
              >
                Setup Database
              </button>
            </div>
          </div>
        )}
        <div className="max-w-full px-4 sm:px-10">
          <div className="relative flex items-center h-16 py-4">
            <div className="flex shrink-0 items-center gap-6">
              <button
                type="button"
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                className="flex items-center hover:opacity-85 transition-opacity"
              >
                <img
                  src="/tarawork-removebg-preview.png"
                  alt="TaraWork Logo"
                  className="h-12 w-auto object-contain"
                />
              </button>
              <div className="hidden lg:flex items-center gap-6">
                {profile.role === "admin" ? (
                  <div className="flex items-center gap-2">
                    {[
                      { id: "admin", label: "Admin" },
                      { id: "freelancer", label: "Freelancer" },
                      { id: "client", label: "Hirer" },
                    ].map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => handleViewSwitch(item.id as "admin" | "freelancer" | "client")}
                        className={`rounded-xl px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.16em] transition-all ${
                          effectiveView === item.id
                            ? "bg-slate-900 text-white"
                            : "bg-white text-slate-500 border border-slate-200 hover:text-slate-800 hover:border-slate-300"
                        }`}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                ) : null}
              </div>
            </div>

            {effectiveView === "freelancer" && (
              <div className="absolute left-1/2 hidden -translate-x-1/2 lg:flex items-center">
                <div className="flex items-center gap-2">
                  {[
                    { id: "overview", label: "Dashboard", icon: LayoutDashboard },
                    { id: "jobs", label: "Find Jobs", icon: Briefcase },
                    { id: "profile", label: "My Profile", icon: User },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setFreelancerTab(tab.id as "overview" | "jobs" | "profile")}
                      className={`flex shrink-0 items-center gap-2 rounded-lg px-3.5 py-2 text-sm font-bold transition-all ${
                        freelancerTab === tab.id
                          ? "bg-slate-900 text-white shadow-sm"
                          : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                      }`}
                    >
                      <span>{tab.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {effectiveView === "client" && (
              <div className="absolute left-1/2 hidden -translate-x-1/2 lg:flex items-center">
                <div className="flex items-center gap-2">
                  {[
                    { id: "overview", label: "Overview", icon: LayoutDashboard },
                    { id: "jobs", label: "Jobs", icon: Briefcase },
                    { id: "talents", label: "Find Talents", icon: Users },
                    { id: "profile", label: "Company Profile", icon: User },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setClientTab(tab.id as "overview" | "jobs" | "talents" | "profile")}
                      className={`flex shrink-0 items-center gap-2 rounded-lg px-3.5 py-2 text-sm font-bold transition-all ${
                        clientTab === tab.id
                          ? "bg-slate-900 text-white shadow-sm"
                          : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                      }`}
                    >
                      <span>{tab.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="ml-auto flex shrink-0 items-center gap-4">
              <button 
                className="lg:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
              <div className="relative">
                <button 
                  onClick={() => {
                    setShowProfileMenu(false);
                    setShowNotifications(!showNotifications);
                  }}
                  className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-full transition-colors relative"
                >
                  <Bell className="w-5 h-5" />
                  {notifications.filter(n => !n.is_read).length > 0 && (
                    <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] flex items-center justify-center bg-red-600 text-white text-[9px] font-black rounded-full border-2 border-white px-1 shadow-sm animate-bounce">
                      {notifications.filter(n => !n.is_read).length > 9 ? '9+' : notifications.filter(n => !n.is_read).length}
                    </span>
                  )}
                </button>
                
                <AnimatePresence>
                  {showNotifications && (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.95, y: 10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: 10 }}
                      className="absolute top-full right-0 mt-3 w-80 bg-white rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-slate-100 overflow-hidden z-[60]"
                    >
                      <div className="p-5 border-b border-slate-50 flex justify-between items-center bg-slate-50/50 backdrop-blur-sm">
                        <h4 className="text-[10px] font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
                          <Bell className="w-3 h-3 text-indigo-600" />
                          Notifications
                        </h4>
                        <span className="text-[10px] font-black text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-lg border border-indigo-100">
                          {notifications.filter(n => !n.is_read).length} Unread
                        </span>
                      </div>
                      <div className="max-h-[400px] overflow-y-auto">
                        {notifications.length > 0 ? (
                          notifications.map((n) => (
                            <div 
                              key={n.id} 
                              onClick={() => {
                                markNotificationRead(n.id);
                                setShowNotifications(false);
                                if (n.link) setFreelancerTab('overview');
                              }}
                              className={`p-5 border-b border-slate-50 hover:bg-slate-50/80 cursor-pointer transition-all ${!n.is_read ? 'bg-indigo-50/20' : ''} group`}
                            >
                              <div className="flex gap-3">
                                <div className={`w-8 h-8 rounded-xl shrink-0 flex items-center justify-center ${
                                  n.type === 'success' ? 'bg-emerald-50 text-emerald-500' :
                                  n.type === 'warning' ? 'bg-amber-50 text-amber-500' :
                                  'bg-indigo-50 text-indigo-500'
                                }`}>
                                  {n.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <ShieldCheck className="w-4 h-4" />}
                                </div>
                                <div className="min-w-0">
                                  <h5 className="text-[11px] font-black text-slate-900 mb-1 group-hover:text-indigo-600 transition-colors">{n.title}</h5>
                                  <p className="text-[11px] text-slate-500 leading-relaxed font-medium line-clamp-2">{n.message}</p>
                                  <span className="text-[9px] text-slate-400 mt-2 block font-black uppercase tracking-widest">
                                    {new Date(n.created_at).toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                  </span>
                                </div>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="p-10 text-center">
                            <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-slate-100">
                              <Bell className="w-6 h-6 text-slate-200" />
                            </div>
                            <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">No notifications yet.</p>
                          </div>
                        )}
                      </div>
                      {notifications.length > 0 && (
                        <div className="p-4 bg-slate-50/30 text-center border-t border-slate-50">
                          <button className="text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-indigo-600 transition-colors">Clear All Notifications</button>
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              <Link
                href="/messages"
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-full transition-colors relative"
              >
                <Mail className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 min-w-[18px] h-[18px] flex items-center justify-center bg-indigo-600 text-white text-[10px] font-black rounded-full border-2 border-white px-1">
                    {unreadCount > 99 ? '99+' : unreadCount}
                  </span>
                )}
              </Link>
              <div ref={profileMenuRef} className="relative">
                <button
                  type="button"
                  onClick={() => {
                    setShowNotifications(false);
                    setShowProfileMenu((current) => !current);
                  }}
                  className="w-9 h-9 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 border-2 border-white shadow-sm cursor-pointer hover:ring-4 hover:ring-indigo-100 transition-all overflow-hidden"
                  title="Profile Image"
                >
                  {profile.avatar_url && (
                    <img src={profile.avatar_url} alt="Profile" className="w-full h-full object-cover" />
                  )}
                  {!profile.avatar_url && <User className="m-auto h-5 w-5 text-white" />}
                </button>

                <AnimatePresence>
                  {showProfileMenu && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.96, y: 8 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.96, y: 8 }}
                      transition={{ duration: 0.16 }}
                      className="absolute right-0 top-full z-[70] mt-3 w-72 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-[0_18px_45px_rgba(15,23,42,0.14)]"
                    >
                      <button
                        type="button"
                        onClick={() => {
                          setShowProfileMenu(false);
                          profileRef.current?.scrollIntoView({ behavior: "smooth" });
                        }}
                        className="flex w-full items-center gap-3 border-b border-slate-100 px-4 py-4 text-left hover:bg-slate-50"
                      >
                        <span className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 text-white">
                          {profile.avatar_url ? (
                            <img src={profile.avatar_url} alt="Profile" className="h-full w-full object-cover" />
                          ) : (
                            <User className="h-5 w-5" />
                          )}
                        </span>
                        <span className="min-w-0">
                          <span className="block truncate text-sm font-black text-slate-900">{profile.name || "User"}</span>
                          <span className="block truncate text-xs font-semibold text-slate-500">
                            View profile
                          </span>
                        </span>
                      </button>

                      <div className="p-2">
                        <button
                          type="button"
                          onClick={() => {
                            setShowProfileMenu(false);
                            setShowSettingsModal(true);
                          }}
                          className="flex w-full items-center gap-3 rounded-lg px-3 py-3 text-sm font-bold text-slate-700 hover:bg-slate-50"
                        >
                          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-600">
                            <Settings className="h-5 w-5" />
                          </span>
                          Settings
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setShowProfileMenu(false);
                            openFeedbackModal("feature");
                          }}
                          className="flex w-full items-center gap-3 rounded-lg px-3 py-3 text-sm font-bold text-slate-700 hover:bg-slate-50"
                        >
                          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-amber-50 text-amber-600">
                            <Lightbulb className="h-5 w-5" />
                          </span>
                          Product Feedback
                        </button>
                        <button
                          type="button"
                          onClick={async () => {
                            setShowProfileMenu(false);
                            await supabase.auth.signOut();
                            router.push("/auth");
                          }}
                          className="flex w-full items-center gap-3 rounded-lg px-3 py-3 text-sm font-bold text-rose-600 hover:bg-rose-50"
                        >
                          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-rose-50 text-rose-600">
                            <LogIn className="h-5 w-5 rotate-180" />
                          </span>
                          Logout
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-white border-b border-slate-200 overflow-hidden sticky top-[65px] z-40"
          >
            <div className="p-4 space-y-4">
              <div className="grid grid-cols-1 gap-2">
                <button 
                  onClick={() => { handleViewSwitch('freelancer'); setIsMenuOpen(false); }}
                  className={`flex items-center gap-3 p-3 rounded-xl font-bold text-sm ${effectiveView === 'freelancer' ? 'bg-indigo-50 text-indigo-600' : 'text-slate-600 hover:bg-slate-50'}`}
                >
                  <Briefcase className="w-5 h-5" />
                  Freelancer Workspace
                </button>
                <button 
                  onClick={() => { handleViewSwitch('client'); setIsMenuOpen(false); }}
                  className={`flex items-center gap-3 p-3 rounded-xl font-bold text-sm ${effectiveView === 'client' ? 'bg-indigo-50 text-indigo-600' : 'text-slate-600 hover:bg-slate-50'}`}
                >
                  <Users className="w-5 h-5" />
                  Employer Dashboard
                </button>
                {profile.role === 'admin' && (
                  <button 
                    onClick={() => { handleViewSwitch('admin'); setIsMenuOpen(false); }}
                    className={`flex items-center gap-3 p-3 rounded-xl font-bold text-sm ${effectiveView === 'admin' ? 'bg-indigo-50 text-indigo-600' : 'text-slate-600 hover:bg-slate-50'}`}
                  >
                    <ShieldCheck className="w-5 h-5" />
                    Admin Portal
                  </button>
                )}
              </div>
              <div className="pt-4 border-t border-slate-100 flex flex-col gap-2">
                <Link 
                  href="/messages" 
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center gap-3 p-3 rounded-xl font-bold text-sm text-slate-600 hover:bg-slate-50"
                >
                  <Mail className="w-5 h-5" />
                  Messages {unreadCount > 0 && `(${unreadCount})`}
                </Link>
                <button 
                  onClick={async () => {
                    await supabase.auth.signOut();
                    router.push("/auth");
                  }}
                  className="flex items-center gap-3 p-3 rounded-xl font-bold text-sm text-rose-600 hover:bg-rose-50"
                >
                  <LogIn className="w-5 h-5 rotate-180" />
                  Logout
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="max-w-full h-[calc(100vh-5rem)] overflow-y-auto px-4 py-8 sm:px-10">
        {effectiveView === "freelancer" ? (
          <div className="space-y-8">
            {/* Freelancer Tab Navigation */}
            <div className="sticky top-20 z-40 flex items-center gap-2 overflow-x-auto rounded-2xl border border-slate-200 bg-white p-1.5 shadow-sm [-ms-overflow-style:none] [scrollbar-width:none] lg:hidden">
              {[
                { id: "overview", label: "Dashboard", icon: LayoutDashboard },
                { id: "jobs", label: "Find Jobs", icon: Briefcase },
                { id: "profile", label: "My Profile", icon: User },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setFreelancerTab(tab.id as any)}
                  className={`shrink-0 flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${
                    freelancerTab === tab.id 
                      ? "bg-slate-900 text-white shadow-lg" 
                      : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>

            <AnimatePresence mode="wait">
              {freelancerTab === "overview" && (
                <motion.div
                  key="overview"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-8"
                >
                  <div className="grid gap-6 xl:grid-cols-[minmax(0,1.7fr)_minmax(320px,0.9fr)]">
                    <div className="space-y-6">
                      <div className="rounded-2xl bg-slate-900 p-6 text-white shadow-xl">
                        <div className="flex flex-wrap items-start justify-between gap-4">
                          <div className="max-w-2xl">
                            <p className="text-[11px] font-black uppercase tracking-[0.22em] text-indigo-300">
                              Freelancer Dashboard
                            </p>
                            <h2 className="mt-2 text-2xl font-black tracking-tight md:text-3xl">
                              Welcome back, {(profile.name || "User").split(" ")[0]}.
                            </h2>
                            <p className="mt-3 text-sm text-slate-300">
                              {categoryJobsCount} open jobs in {profile.category || "your category"}.
                            </p>
                          </div>
                          <div className="flex flex-wrap gap-3">
                            <button
                              onClick={() => setFreelancerTab("jobs")}
                              className="rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-bold text-white transition-all hover:bg-indigo-500"
                            >
                              Find Jobs
                            </button>
                            <button
                              onClick={() => setFreelancerTab("profile")}
                              className="rounded-xl border border-white/10 bg-white/5 px-5 py-2.5 text-sm font-bold text-white transition-all hover:bg-white/10"
                            >
                              Edit Profile
                            </button>
                          </div>
                        </div>
                      </div>

                      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                          <p className="text-[11px] font-black uppercase tracking-[0.18em] text-slate-400">Applied</p>
                          <p className="mt-3 text-3xl font-black text-slate-900">{Object.keys(appliedJobs).length}</p>
                        </div>
                        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                          <p className="text-[11px] font-black uppercase tracking-[0.18em] text-slate-400">Invites</p>
                          <p className="mt-3 text-3xl font-black text-slate-900">{receivedTalentInvitations.length}</p>
                        </div>
                        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                          <p className="text-[11px] font-black uppercase tracking-[0.18em] text-slate-400">Inquiries</p>
                          <p className="mt-3 text-3xl font-black text-slate-900">{portfolioInquiries.length}</p>
                        </div>
                        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                          <p className="text-[11px] font-black uppercase tracking-[0.18em] text-slate-400">Profile</p>
                          <p className="mt-3 text-3xl font-black text-slate-900">{profileCompletion}%</p>
                        </div>
                      </div>

                      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                          <div className="min-w-0">
                            <h3 className="text-lg font-black text-slate-900">Professional Profile URL</h3>
                            <div className="mt-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 font-mono text-sm text-indigo-700">
                              {buildPublicProfileUrl({
                                tier: "free",
                                username: profile.username,
                                id: profile.id,
                              })}
                            </div>
                          </div>
                          <div className="flex flex-wrap gap-3">
                            <button
                              onClick={() => {
                                const url = buildPublicProfileUrl({
                                  tier: "free",
                                  username: profile.username,
                                  id: profile.id,
                                });
                                navigator.clipboard.writeText(url);
                                setToastMsg("Professional profile URL copied.");
                                setShowToast(true);
                                setTimeout(() => setShowToast(false), 2000);
                              }}
                              className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-bold text-white transition-all hover:bg-black"
                            >
                              <Copy className="h-4 w-4" />
                              Copy URL
                            </button>
                            <Link
                              href={buildPublicProfileUrl({
                                tier: "free",
                                username: profile.username,
                                id: profile.id,
                              })}
                              target="_blank"
                              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-bold text-slate-700 transition-all hover:bg-slate-50"
                            >
                              <ExternalLink className="h-4 w-4" />
                              Open Profile
                            </Link>
                          </div>
                        </div>
                      </div>

                      <div className="grid gap-6 xl:grid-cols-2">
                        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                          <div className="mb-4 flex items-center justify-between gap-3">
                            <h3 className="text-lg font-black text-slate-900">Invitation Inbox</h3>
                            <span className="rounded-full bg-indigo-50 px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-indigo-600">
                              {receivedTalentInvitations.length}
                            </span>
                          </div>
                          {receivedTalentInvitations.length === 0 ? (
                            <div className="rounded-2xl border border-dashed border-slate-200 px-4 py-8 text-center text-sm text-slate-500">
                              No invitations yet.
                            </div>
                          ) : (
                            <div className="space-y-3">
                              {receivedTalentInvitations.slice(0, 3).map((invitation) => (
                                  <div key={invitation.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                                    <div className="flex items-start justify-between gap-3">
                                      <div>
                                        <p className="text-sm font-black text-slate-900">{invitation.employer?.name || "Employer"}</p>
                                        <p className="mt-1 inline-flex items-center gap-1 text-xs text-slate-500">
                                          <Building2 className="h-3.5 w-3.5" />
                                          {invitation.employer?.companyName || "Independent Company"}
                                        </p>
                                      </div>
                                      <span className={cn(
                                        "rounded-full px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.16em]",
                                        invitation.status === "accepted"
                                          ? "bg-emerald-50 text-emerald-700"
                                          : invitation.status === "rejected"
                                            ? "bg-rose-50 text-rose-700"
                                            : "bg-amber-50 text-amber-700",
                                      )}>
                                        {invitation.status}
                                      </span>
                                    </div>
                                    <p className="mt-3 line-clamp-2 text-sm text-slate-600">{invitation.message}</p>
                                    <div className="mt-4 flex flex-wrap gap-2">
                                      <Link
                                        href={
                                          invitation.latestJob
                                            ? getJobSharePath(invitation.latestJob)
                                            : `/${getProfileSlug(invitation.employer?.username, invitation.employer?.id)}`
                                        }
                                        className="rounded-lg border border-indigo-100 bg-indigo-50 px-3 py-2 text-xs font-bold text-indigo-700 hover:bg-indigo-100"
                                      >
                                        View Jobs
                                      </Link>
                                      {invitation.status === "pending" && (
                                        <>
                                        <button
                                          type="button"
                                          onClick={() => void updateTalentInvitationStatus(invitation.id, "accepted")}
                                          className="rounded-lg bg-slate-900 px-3 py-2 text-xs font-bold text-white hover:bg-black"
                                        >
                                          Accept
                                        </button>
                                        <button
                                          type="button"
                                          onClick={() => void updateTalentInvitationStatus(invitation.id, "rejected")}
                                          className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100"
                                        >
                                          Reject
                                        </button>
                                        </>
                                      )}
                                      {invitation.status === "accepted" && (
                                        <button
                                          type="button"
                                          onClick={() =>
                                            setVisibleInterviewIds((prev) =>
                                              prev.includes(invitation.id)
                                                ? prev.filter((id) => id !== invitation.id)
                                                : [...prev, invitation.id],
                                            )
                                          }
                                          className="rounded-lg bg-slate-900 px-3 py-2 text-xs font-bold text-white hover:bg-black"
                                        >
                                          View Date Interview
                                        </button>
                                      )}
                                    </div>
                                    {invitation.status === "accepted" && visibleInterviewIds.includes(invitation.id) ? (
                                      <div className="mt-4 rounded-xl border border-emerald-100 bg-emerald-50 p-3 text-xs text-emerald-800">
                                        <p className="font-black uppercase tracking-widest">Interview Details</p>
                                        {invitation.interview_at ? (
                                          <p className="mt-1 font-semibold">
                                            {new Date(invitation.interview_at).toLocaleString()}
                                          </p>
                                        ) : (
                                          <p className="mt-1 font-semibold">No interview date set yet.</p>
                                        )}
                                        {invitation.interview_link ? (
                                          <a
                                            href={invitation.interview_link}
                                            target="_blank"
                                            className="mt-2 inline-flex font-bold text-emerald-700 underline"
                                          >
                                            Open meeting link
                                          </a>
                                        ) : (
                                          <p className="mt-2 font-semibold">No meeting link set yet.</p>
                                        )}
                                        <div className="mt-4 rounded-lg border border-emerald-200 bg-white/70 p-3">
                                          <p className="font-black uppercase tracking-widest text-emerald-900">
                                            Request Another Date
                                          </p>
                                          {invitation.interview_request_status === "pending" ? (
                                            <p className="mt-2 font-semibold">
                                              Request pending:{" "}
                                              {invitation.interview_request_at
                                                ? new Date(invitation.interview_request_at).toLocaleString()
                                                : "Preferred date not set"}
                                            </p>
                                          ) : (
                                            <div className="mt-3 grid gap-2">
                                              <input
                                                type="datetime-local"
                                                value={rescheduleDrafts[invitation.id]?.requestAt || ""}
                                                onChange={(event) =>
                                                  setRescheduleDrafts((prev) => ({
                                                    ...prev,
                                                    [invitation.id]: {
                                                      requestAt: event.target.value,
                                                      note: prev[invitation.id]?.note || "",
                                                    },
                                                  }))
                                                }
                                                className="rounded-lg border border-emerald-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 outline-none"
                                              />
                                              <textarea
                                                rows={2}
                                                value={rescheduleDrafts[invitation.id]?.note || ""}
                                                onChange={(event) =>
                                                  setRescheduleDrafts((prev) => ({
                                                    ...prev,
                                                    [invitation.id]: {
                                                      requestAt: prev[invitation.id]?.requestAt || "",
                                                      note: event.target.value,
                                                    },
                                                  }))
                                                }
                                                placeholder="Optional note for employer"
                                                className="rounded-lg border border-emerald-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 outline-none"
                                              />
                                              <button
                                                type="button"
                                                onClick={() => void requestInterviewReschedule(invitation)}
                                                className="rounded-lg bg-emerald-700 px-3 py-2 text-xs font-bold text-white hover:bg-emerald-800"
                                              >
                                                Send Request
                                              </button>
                                            </div>
                                          )}
                                        </div>
                                      </div>
                                    ) : null}
                                  </div>
                              ))}
                            </div>
                          )}
                        </div>

                        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                          <div className="mb-4 flex items-center justify-between gap-3">
                            <h3 className="text-lg font-black text-slate-900">Portfolio Inquiries</h3>
                            <span className="rounded-full bg-indigo-50 px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-indigo-600">
                              {portfolioInquiries.length}
                            </span>
                          </div>
                          {portfolioInquiries.length === 0 ? (
                            <div className="rounded-2xl border border-dashed border-slate-200 px-4 py-8 text-center text-sm text-slate-500">
                              No inquiries yet.
                            </div>
                          ) : (
                            <div className="space-y-3">
                              {portfolioInquiries.slice(0, 3).map((inquiry) => {
                                const senderName =
                                  typeof inquiry?.sender_name === "string" && inquiry.sender_name.trim().length > 0
                                    ? inquiry.sender_name
                                    : "Unknown Sender";
                                const senderEmail = typeof inquiry?.sender_email === "string" ? inquiry.sender_email : "";
                                return (
                                  <div key={inquiry.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                                    <div className="flex items-start justify-between gap-3">
                                      <div>
                                        <p className="text-sm font-black text-slate-900">{senderName}</p>
                                        <p className="mt-1 text-xs text-slate-500">{senderEmail || "No email provided"}</p>
                                      </div>
                                      <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">
                                        {inquiry?.created_at ? new Date(inquiry.created_at).toLocaleDateString() : "Unknown"}
                                      </span>
                                    </div>
                                    <p className="mt-3 line-clamp-3 text-sm text-slate-600">{inquiry.message}</p>
                                    {senderEmail && (
                                      <a
                                        href={`mailto:${senderEmail}`}
                                        className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-indigo-600 hover:text-indigo-700"
                                      >
                                        Reply by Email
                                        <ChevronRight className="h-4 w-4" />
                                      </a>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-6">
                      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                        <div className="flex items-center gap-3">
                          <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-full bg-slate-900 text-white">
                            {profile.avatar_url ? <img src={profile.avatar_url} alt="Profile" className="h-full w-full object-cover" /> : <User className="h-5 w-5" />}
                          </div>
                          <div className="min-w-0">
                            <p className="truncate text-lg font-black text-slate-900">{profile.name || "User"}</p>
                            <p className="text-sm text-slate-500">{profile.category || "Freelancer"}</p>
                          </div>
                        </div>
                        <div className="mt-5 space-y-4">
                          <div>
                            <div className="mb-2 flex items-center justify-between text-[11px] font-black uppercase tracking-[0.18em] text-slate-400">
                              <span>Profile completion</span>
                              <span className="text-slate-900">{profileCompletion}%</span>
                            </div>
                            <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                              <div className="h-full rounded-full bg-indigo-600" style={{ width: `${profileCompletion}%` }} />
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-3">
                            <div className="rounded-xl bg-slate-50 px-4 py-3">
                              <p className="text-[10px] font-black uppercase tracking-[0.16em] text-slate-400">Ranking</p>
                              <p className="mt-2 text-lg font-black text-slate-900">{profile.ranking ? `Top ${profile.ranking}%` : "Unranked"}</p>
                            </div>
                            <div className="rounded-xl bg-slate-50 px-4 py-3">
                              <p className="text-[10px] font-black uppercase tracking-[0.16em] text-slate-400">Skills</p>
                              <p className="mt-2 text-lg font-black text-slate-900">{profile.skills?.length || 0}</p>
                            </div>
                          </div>
                          <button
                            onClick={() => setFreelancerTab("profile")}
                            className="w-full rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-bold text-white transition-all hover:bg-black"
                          >
                            Complete Profile
                          </button>
                        </div>
                      </div>

                      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                        <h3 className="text-lg font-black text-slate-900">Quick Actions</h3>
                        <div className="mt-4 grid gap-3">
                          <button
                            onClick={() => setFreelancerTab("jobs")}
                            className="flex items-center justify-between rounded-xl border border-slate-200 px-4 py-3 text-left transition-all hover:border-slate-300 hover:bg-slate-50"
                          >
                            <div>
                              <p className="text-sm font-black text-slate-900">Review matching jobs</p>
                              <p className="text-xs text-slate-500">{jobs.length} jobs available now</p>
                            </div>
                            <ChevronRight className="h-4 w-4 text-slate-400" />
                          </button>
                          <button
                            onClick={() => setFreelancerTab("profile")}
                            className="flex items-center justify-between rounded-xl border border-slate-200 px-4 py-3 text-left transition-all hover:border-slate-300 hover:bg-slate-50"
                          >
                            <div>
                              <p className="text-sm font-black text-slate-900">Update skills and bio</p>
                              <p className="text-xs text-slate-500">Keep your profile ready for applications</p>
                            </div>
                            <ChevronRight className="h-4 w-4 text-slate-400" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {freelancerTab === "jobs" && (
                <motion.div
                  key="jobs"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <JobFeed 
                    jobs={jobs} 
                    profile={profile} 
                    onApply={handleApply}
                    appliedJobs={appliedJobs}
                  />
                </motion.div>
              )}

              {freelancerTab === "profile" && (
                <motion.div
                  key="profile"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="space-y-6">
                    <ProfileForm 
                      initialProfile={profile} 
                      onUpdate={handleProfileSave} 
                      onAddPortfolio={addPortfolioItem}
                      onUpdatePortfolio={updatePortfolioItem}
                      onRemovePortfolio={removePortfolioItem}
                      onUploadAvatar={uploadProfilePhoto}
                      isSaving={isSaving}
                    />
                  </div>
                  <div className="grid gap-6 xl:grid-cols-3">
                    {false && profile.role === 'freelancer' && (
                      <div className="relative overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm transition-all">
                        <div className="absolute right-0 top-0 h-24 w-24 translate-x-1/2 -translate-y-1/2 rounded-full bg-indigo-50 blur-2xl"></div>
                        <div className="relative">
                          <h3 className="mb-4 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
                            <Layout className="h-4 w-4 text-indigo-600" />
                            Public Portfolio
                          </h3>
                          <div className="space-y-4">
                            <div className="flex items-center justify-between break-all rounded-xl border border-slate-100 bg-slate-50 p-3 font-mono text-[10px]">
                              <div className="flex flex-col gap-1">
                                <span className="text-slate-600">
                                  {buildPublicProfileUrl({
                                    tier: "free",
                                    username: profile.username,
                                    id: profile.id,
                                  })}
                                </span>
                                {!profile.username && (
                                  <span className="text-[9px] text-amber-600 font-medium">⚠️ No username set. Using ID as fallback.</span>
                                )}
                              </div>
                              {!profile.username && (
                                <span className="text-[9px] bg-amber-50 text-amber-600 px-1.5 py-0.5 rounded-lg font-bold border border-amber-100 shrink-0">SET USERNAME</span>
                              )}
                            </div>
                            
                            <div className="rounded-xl border border-indigo-100 bg-indigo-50/50 p-4">
                              <h4 className="mb-2 text-[9px] font-bold uppercase text-indigo-700">Portfolio Status</h4>
                              <div className="flex items-center gap-2">
                                <div className={cn("w-2 h-2 rounded-full", profile.username ? "bg-emerald-500" : "bg-amber-500")}></div>
                              <span className="text-[10px] text-slate-600">
                                {profile.username ? `URL Identifier: @${profile.username}` : "Using temporary ID link"}
                              </span>
                            </div>
                            <div className="mt-3 flex flex-wrap gap-2">
                              <button
                                onClick={() => {
                                  const url = buildPublicProfileUrl({
                                    tier: "free",
                                    username: profile.username,
                                    id: profile.id,
                                  });
                                  navigator.clipboard.writeText(url);
                                  setToastMsg("Portfolio link copied to clipboard!");
                                    setShowToast(true);
                                    setTimeout(() => setShowToast(false), 3000);
                                  }}
                                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 text-white text-xs font-bold rounded-xl hover:bg-indigo-700 transition-all shadow-md shadow-indigo-100"
                                >
                                  <Copy className="w-3.5 h-3.5" />
                                  Copy Link
                                </button>
                                <Link 
                                  href={buildPublicProfileUrl({
                                    tier: "free",
                                    username: profile.username,
                                    id: profile.id,
                                  })}
                                  target="_blank"
                                  className="flex items-center justify-center p-2 bg-slate-100 text-slate-600 rounded-xl hover:bg-slate-200 transition-all"
                                >
                                  <ExternalLink className="w-4 h-4" />
                                </Link>
                              </div>
                              <p className="text-[10px] text-slate-400 font-medium italic">
                                Professional URL: share this with employers to showcase your work for free.
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {false && (
                    <div className="bg-slate-900 p-6 rounded-2xl border border-white/10 shadow-xl overflow-hidden relative group">
                      {/* Background decorative elements */}
                      <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-indigo-500/20 transition-all duration-500"></div>
                      
                      <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                        <Award className="w-4 h-4 text-indigo-400" />
                        Career Credentials
                      </h3>

                      <div className="space-y-6">
                        {/* Verified Technical Badges */}
                        {(profile.verifiedSkills?.length ?? 0) > 0 && (
                          <div className="space-y-2">
                            <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Technical Mastery</span>
                            <div className="flex flex-wrap gap-2">
                              {profile.verifiedSkills?.map((skill) => (
                                <div key={skill.name} className="flex items-center gap-2 px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-lg shadow-inner">
                                  <Verified className="w-3.5 h-3.5 text-emerald-400" />
                                  <span className="text-[10px] font-bold text-emerald-100 tracking-tight">{skill.name}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Soft Skill Badges */}
                        <div className="space-y-2">
                          <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Behavioral Excellence</span>
                          <div className="grid grid-cols-1 gap-2.5">
                            {profile.softSkills?.map((skill) => (
                              <motion.div 
                                key={skill.name} 
                                whileHover={{ scale: 1.02, x: 4 }}
                                className="group relative flex items-center justify-between p-3 bg-white/5 border border-white/10 rounded-xl hover:border-indigo-500/30 hover:bg-white/10 transition-all cursor-default"
                              >
                                <div className="flex items-center gap-3">
                                  <div className="w-9 h-9 flex items-center justify-center bg-slate-800/80 rounded-lg border border-white/5 text-lg shadow-sm">
                                    {skill.badge}
                                  </div>
                                  <div>
                                    <h4 className="text-[11px] font-bold text-slate-200">{skill.name}</h4>
                                    <div className="flex items-center gap-1.5 mt-0.5">
                                      <Medal className={cn("w-3 h-3", 
                                        skill.level === "Master" ? "text-amber-400" : 
                                        skill.level === "Expert" ? "text-slate-300" : "text-orange-400"
                                      )} />
                                      <span className="text-[9px] font-bold text-slate-500 uppercase tracking-tighter group-hover:text-slate-400 transition-colors">{skill.level}</span>
                                    </div>
                                  </div>
                                </div>
                                <div className="text-[9px] font-black text-slate-500 bg-slate-800 px-1.5 py-0.5 rounded border border-white/5 group-hover:text-indigo-400 transition-colors">
                                  {skill.count}x
                                </div>
                              </motion.div>
                            ))}
                          </div>
                        </div>

                        {/* Achievement Status */}
                        {profile.ranking ? (
                          <div className="mt-4 pt-4 border-t border-white/5">
                            <div className="flex items-center justify-between px-3 py-2.5 bg-indigo-500/10 rounded-xl border border-indigo-500/20">
                              <div className="flex items-center gap-2">
                                <Trophy className="w-3.5 h-3.5 text-indigo-400" />
                                <span className="text-[10px] font-bold text-indigo-100 uppercase tracking-widest">Elite Tier • Top {profile.ranking}%</span>
                              </div>
                              <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-pulse shadow-[0_0_8px_rgba(129,140,248,0.8)]"></div>
                            </div>
                          </div>
                        ) : null}
                      </div>
                    </div>
                    )}

                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ) : effectiveView === "client" ? (
          <div className="space-y-8">
            {/* Client Tab Navigation */}
            <div className="sticky top-20 z-40 flex items-center gap-2 overflow-x-auto rounded-2xl border border-slate-200 bg-white p-1.5 shadow-sm [-ms-overflow-style:none] [scrollbar-width:none] lg:hidden">
              {[
                { id: "overview", label: "Overview", icon: LayoutDashboard, tooltip: "View your hiring dashboard summary" },
                { id: "jobs", label: "Jobs", icon: Briefcase, tooltip: "Post and manage your job listings" },
                { id: "talents", label: "Find Talents", icon: Users, tooltip: "Browse freelancers by skills" },
                { id: "profile", label: "Company Profile", icon: User, tooltip: "Edit your company profile" },
              ].map((tab) => (
                <TooltipAction key={tab.id} text={tab.tooltip}>
                  <button
                    onClick={() => setClientTab(tab.id as "overview" | "jobs" | "talents" | "profile")}
                    className={`shrink-0 flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${
                      clientTab === tab.id 
                        ? "bg-slate-900 text-white shadow-lg" 
                        : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                    }`}
                  >
                    <tab.icon className="w-4 h-4" />
                    <span>{tab.label}</span>
                  </button>
                </TooltipAction>
              ))}
            </div>

            <AnimatePresence mode="wait">
              {clientTab === "overview" && (
                <motion.div
                  key="overview"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-8"
                >
                  <div className="relative overflow-hidden rounded-2xl bg-slate-900 p-8 md:p-12 text-white shadow-xl">
              <div className="relative z-10 max-w-2xl">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/10 text-slate-300 text-[10px] font-bold mb-6 uppercase tracking-wider">
                  <Shield className="w-3.5 h-3.5" />
                  Verified Employer
                </div>
                <h2 className="text-3xl md:text-4xl font-bold mb-4 leading-tight tracking-tight">
                  Hire top talent for <span className="text-indigo-400">{profile.companyName || "your company"}</span>
                </h2>
                <p className="text-slate-300 text-lg mb-8 opacity-90 font-medium">
                  Ready to scale your team? Post a job and get matches in minutes.
                </p>
                <div className="flex gap-4">
                  <div className="flex flex-col">
                    <span className="text-2xl font-bold text-white">{employerJobs.length}</span>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Active Posts</span>
                  </div>
                  <div className="w-px h-10 bg-white/10 mx-2"></div>
                  <div className="flex flex-col">
                    <span className="text-2xl font-bold text-white">₱0</span>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Total Spent</span>
                  </div>
                </div>
              </div>
              <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-[120px]"></div>
            </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                    <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-indigo-600" />
                      Employer Stats
                    </h3>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Active Postings</span>
                        <span className="text-sm font-bold text-slate-900">{employerJobs.length}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Total Spent</span>
                        <span className="text-sm font-bold text-emerald-600">₱0</span>
                      </div>
                    </div>
                  </div>

                  <div className="lg:col-span-2 bg-slate-900 p-6 rounded-2xl text-white shadow-lg overflow-hidden relative">
                    <div className="relative z-10">
                      <h3 className="text-lg font-bold mb-2">Team Management</h3>
                      <p className="text-sm text-slate-400 mb-4 leading-relaxed">
                        Invite teammates to review applications and manage projects together.
                      </p>
                      <TooltipAction text="Manage your hiring team settings">
                        <button 
                          onClick={() => alert("Squad management for Employers coming soon!")}
                          className="text-xs font-bold text-indigo-400 hover:text-indigo-300 transition-colors flex items-center gap-1"
                        >
                          Configure Team <ArrowUpRight className="w-3 h-3" />
                        </button>
                      </TooltipAction>
                    </div>
                    <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-indigo-600/10 rounded-full blur-xl"></div>
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                  <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <h3 className="text-xl font-black text-slate-900">Talent Invitations</h3>
                      <p className="mt-1 text-sm text-slate-500">Freelancers you invited from public profiles.</p>
                    </div>
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-slate-600">
                      {sentTalentInvitations.length} Invited
                    </span>
                  </div>

                  {sentTalentInvitations.length === 0 ? (
                    <div className="rounded-2xl border border-dashed border-slate-200 px-4 py-10 text-center text-sm text-slate-500">
                      No invited freelancers yet.
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full min-w-[620px] text-left">
                        <thead>
                          <tr className="border-b border-slate-100 text-[10px] font-black uppercase tracking-[0.18em] text-slate-400">
                            <th className="py-3 pr-4">Freelancer</th>
                            <th className="px-4 py-3">Category</th>
                            <th className="px-4 py-3">Status</th>
                            <th className="px-4 py-3">Invited</th>
                            <th className="py-3 pl-4 text-right">Profile</th>
                          </tr>
                        </thead>
                        <tbody>
                          {sentTalentInvitations.map((invitation) => {
                            const freelancer = invitation.freelancer;
                            const interviewTime = invitation.interview_at ? new Date(invitation.interview_at).getTime() : null;
                            const invitationDisplayStatus =
                              invitation.status === "accepted" && interviewTime
                                ? interviewTime <= Date.now()
                                  ? "Done"
                                  : "Ongoing Interview"
                                : invitation.status;
                            const draft = interviewDrafts[invitation.id] || {
                              interviewAt: invitation.interview_at || "",
                              interviewLink: invitation.interview_link || "",
                            };
                            return (
                              <Fragment key={invitation.id}>
                              <tr
                                onClick={() =>
                                  invitation.status === "accepted"
                                    ? setExpandedInvitationIds((prev) =>
                                        prev.includes(invitation.id)
                                          ? prev.filter((id) => id !== invitation.id)
                                          : [...prev, invitation.id],
                                      )
                                    : undefined
                                }
                                className={cn(
                                  "border-b border-slate-50 last:border-0",
                                  invitation.status === "accepted" && "cursor-pointer hover:bg-slate-50",
                                )}
                              >
                                <td className="py-4 pr-4">
                                  <div className="flex items-center gap-3">
                                    <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-slate-100">
                                      {freelancer?.avatar_url ? (
                                        <img src={freelancer.avatar_url} alt="" className="h-full w-full object-cover" />
                                      ) : (
                                        <User className="h-4 w-4 text-slate-400" />
                                      )}
                                    </div>
                                    <div>
                                      <p className="text-sm font-black text-slate-900">{freelancer?.name || "Freelancer"}</p>
                                      <p className="text-xs text-slate-500">@{getProfileSlug(freelancer?.username, freelancer?.id)}</p>
                                    </div>
                                  </div>
                                </td>
                                <td className="px-4 py-4 text-sm font-semibold text-slate-600">{freelancer?.category || "General"}</td>
                                <td className="px-4 py-4">
                                  <span className={cn(
                                    "rounded-full px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.16em]",
                                    invitationDisplayStatus === "Ongoing Interview"
                                      ? "bg-indigo-50 text-indigo-700"
                                      : invitationDisplayStatus === "Done"
                                        ? "bg-slate-100 text-slate-600"
                                        : invitation.status === "accepted"
                                      ? "bg-emerald-50 text-emerald-700"
                                      : invitation.status === "rejected"
                                        ? "bg-rose-50 text-rose-700"
                                        : "bg-amber-50 text-amber-700",
                                  )}>
                                    {invitationDisplayStatus}
                                  </span>
                                </td>
                                <td className="px-4 py-4 text-sm text-slate-500">
                                  {new Date(invitation.created_at).toLocaleDateString()}
                                </td>
                                <td className="py-4 pl-4 text-right">
                                  <button
                                    type="button"
                                    onClick={(event) => {
                                      event.stopPropagation();
                                      if (freelancer?.id) openTalentProfile(freelancer as Partial<UserProfile>);
                                    }}
                                    className="text-xs font-bold text-indigo-600 hover:text-indigo-700"
                                  >
                                    Open Talent Profile
                                  </button>
                                </td>
                              </tr>
                              {invitation.status === "accepted" && expandedInvitationIds.includes(invitation.id) ? (
                                <tr key={`${invitation.id}-schedule`} className="border-b border-slate-100">
                                  <td colSpan={5} className="pb-5">
                                    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                                        Interview Schedule
                                      </p>
                                      {invitation.interview_request_status === "pending" ? (
                                        <div className="mt-3 rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
                                          <p className="text-[10px] font-black uppercase tracking-widest text-amber-700">
                                            Freelancer requested another date
                                          </p>
                                          <p className="mt-1 font-bold">
                                            {invitation.interview_request_at
                                              ? new Date(invitation.interview_request_at).toLocaleString()
                                              : "No preferred date provided"}
                                          </p>
                                          {invitation.interview_request_note ? (
                                            <p className="mt-2 text-xs font-semibold">{invitation.interview_request_note}</p>
                                          ) : null}
                                        </div>
                                      ) : null}
                                      <div className="mt-3 grid gap-3 md:grid-cols-[minmax(0,220px)_minmax(0,1fr)_auto]">
                                        <input
                                          type="datetime-local"
                                          value={
                                            draft.interviewAt
                                              ? draft.interviewAt.slice(0, 16)
                                              : invitation.interview_request_at && invitation.interview_request_status === "pending"
                                                ? invitation.interview_request_at.slice(0, 16)
                                                : ""
                                          }
                                          onChange={(event) =>
                                            setInterviewDrafts((prev) => ({
                                              ...prev,
                                              [invitation.id]: {
                                                ...draft,
                                                interviewAt: event.target.value,
                                              },
                                            }))
                                          }
                                          className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 outline-none focus:border-indigo-400"
                                        />
                                        <input
                                          type="url"
                                          value={draft.interviewLink}
                                          onChange={(event) =>
                                            setInterviewDrafts((prev) => ({
                                              ...prev,
                                              [invitation.id]: {
                                                ...draft,
                                                interviewLink: event.target.value,
                                              },
                                            }))
                                          }
                                          placeholder="Google Meet, Zoom, Teams, or other meeting link"
                                          className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 outline-none focus:border-indigo-400"
                                        />
                                        <button
                                          type="button"
                                          onClick={() => void scheduleTalentInterview(invitation)}
                                          className="rounded-lg bg-slate-900 px-4 py-2 text-xs font-black uppercase tracking-widest text-white hover:bg-black"
                                        >
                                          Save
                                        </button>
                                      </div>
                                      {invitation.interview_at || invitation.interview_link ? (
                                        <p className="mt-3 text-xs font-semibold text-slate-500">
                                          Current: {invitation.interview_at ? new Date(invitation.interview_at).toLocaleString() : "No date"} {invitation.interview_link ? `- ${invitation.interview_link}` : ""}
                                        </p>
                                      ) : null}
                                    </div>
                                  </td>
                                </tr>
                              ) : null}
                              </Fragment>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {clientTab === "jobs" && (
              <motion.div
                key="jobs"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="grid gap-8 xl:grid-cols-12">
                  <div className="xl:col-span-7">
                <div ref={jobPostingFormRef} className="bg-white rounded-xl border border-slate-200 shadow-xl shadow-slate-200/20 p-8 w-full">
                  <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center border border-slate-100">
                        <Briefcase className="w-6 h-6 text-slate-600" />
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold text-slate-900">Post a New Job</h2>
                        <p className="text-slate-500 font-medium">
                          {editingJob ? "Update the selected job post before saving changes." : "Find the perfect talent for your project."}
                        </p>
                      </div>
                    </div>
                  </div>
                  <JobPostingForm
                    editingJob={editingJob}
                    onCancelEdit={() => setEditingJob(null)}
                    preferredCurrency={profile.preferredCurrency || "PHP"}
                    onCurrencyPreferenceChange={(currency) => {
                      setProfile((prev) => ({
                        ...prev,
                        preferredCurrency: currency,
                        aiInsights: {
                          ...(prev.aiInsights || { gapAnalysis: [], compatibilityScore: 0, cultureMatch: [] }),
                          preferredCurrency: currency,
                        },
                      }));
                    }}
                    onPublish={() => { setEditingJob(null); fetchEmployerJobs(user.id); setClientTab("jobs"); }}
                  />
                </div>
                  </div>
                  <div className="xl:col-span-5">
                    <div className="sticky top-24 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                      <div className="mb-5">
                        <h2 className="text-2xl font-bold text-slate-900">Your Job Postings</h2>
                        <p className="text-slate-500 mt-1">Manage and track all jobs you have posted.</p>
                        <div className="mt-4 grid grid-cols-3 gap-2 rounded-xl border border-slate-200 bg-slate-50 p-1">
                          {[
                            { id: "all", label: "All Posts", count: employerJobs.length },
                            { id: "live", label: "Live", count: employerJobs.filter((job) => ((job as any).status || "live") === "live").length },
                            { id: "closed", label: "Closed", count: employerJobs.filter((job) => ((job as any).status || "live") === "closed").length },
                          ].map((tab) => (
                            <button
                              key={tab.id}
                              type="button"
                              onClick={() => setEmployerJobFilter(tab.id as "all" | "live" | "closed")}
                              className={cn(
                                "rounded-lg px-2 py-2 text-[10px] font-black uppercase tracking-widest transition-all",
                                employerJobFilter === tab.id
                                  ? "bg-slate-900 text-white shadow-sm"
                                  : "text-slate-500 hover:bg-white hover:text-slate-900",
                              )}
                            >
                              {tab.label} <span className="opacity-70">({tab.count})</span>
                            </button>
                          ))}
                        </div>
                      </div>

                {filteredEmployerJobs.length > 0 ? (
                  <div className="grid max-h-[720px] gap-4 overflow-y-auto pr-1">
                    {filteredEmployerJobs.map((job) => (
                      <div key={job.id} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:border-indigo-100 transition-all">
                        <div className="flex justify-between items-start gap-4 mb-4">
                          <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-3 mb-1">
                              <h3 className="text-lg font-bold text-slate-900">{job.title}</h3>
                              <span className="text-[10px] font-bold bg-slate-100 text-slate-600 px-2 py-0.5 rounded border border-slate-200 uppercase tracking-widest">{job.category}</span>
                              <span className={cn(
                                "text-[10px] font-bold px-2 py-0.5 rounded border uppercase tracking-widest",
                                (job as any).status === "closed"
                                  ? "bg-rose-50 text-rose-600 border-rose-100"
                                  : "bg-emerald-50 text-emerald-600 border-emerald-100",
                              )}>
                                {(job as any).status === "closed" ? "Closed" : "Live"}
                              </span>
                            </div>
                            <p className="text-xs text-slate-500 font-medium">Posted on {new Date(job.createdAt).toLocaleDateString()}</p>
                            <p className="mt-2 inline-flex items-center rounded-full border border-indigo-100 bg-indigo-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-indigo-700">
                              Duration: {job.duration || "Not specified"}
                            </p>
                          </div>
                          <div className="flex shrink-0 items-start gap-2">
                            <div className="text-right">
                              <p className="text-lg font-bold text-slate-900">{job.rate || (job.budget ? `PHP ${job.budget}` : "Not specified")}</p>
                            </div>
                            <div className="relative">
                              <button
                                type="button"
                                onClick={() => setOpenJobActionsId((current) => current === job.id ? null : job.id)}
                                className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 transition-all hover:bg-slate-50 hover:text-slate-900"
                                aria-label={`Actions for ${job.title}`}
                                aria-expanded={openJobActionsId === job.id}
                              >
                                <MoreHorizontal className="h-4 w-4" />
                              </button>
                              {openJobActionsId === job.id && (
                                <div className="absolute right-0 top-full z-30 mt-2 w-48 rounded-xl border border-slate-200 bg-white p-1.5 shadow-xl">
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setOpenJobActionsId(null);
                                      setEditingJob(job);
                                      jobPostingFormRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
                                    }}
                                    className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-xs font-bold text-slate-700 hover:bg-slate-50"
                                  >
                                    <Pencil className="h-3.5 w-3.5 text-slate-500" />
                                    Edit
                                  </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setOpenJobActionsId(null);
                                    const shareUrl = getJobShareUrl(job);
                                    navigator.clipboard.writeText(shareUrl);
                                    setToastMsg("Job share link copied.");
                                    setShowToast(true);
                                    setTimeout(() => setShowToast(false), 2500);
                                  }}
                                  className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-xs font-bold text-slate-700 hover:bg-slate-50"
                                >
                                  <Copy className="h-3.5 w-3.5 text-indigo-600" />
                                  Share Link
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setOpenJobActionsId(null);
                                    fetchApplicants(job.id, job.title);
                                  }}
                                  className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-xs font-bold text-slate-700 hover:bg-slate-50"
                                >
                                  <Users className="h-3.5 w-3.5 text-slate-500" />
                                  View Applicants
                                </button>
                              {(job as any).status !== "closed" && (
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setOpenJobActionsId(null);
                                      void closeJob(job.id);
                                    }}
                                    className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-xs font-bold text-rose-600 hover:bg-rose-50"
                                  >
                                    <XCircle className="h-3.5 w-3.5" />
                                    Close Job
                                  </button>
                              )}
                                </div>
                              )}
                            </div>

                          </div>
                        </div>
                        
                        <div className="flex justify-between items-center pt-4 border-t border-slate-50">
                          <div className="flex gap-4">
                            <div className="flex flex-col">
                              <span className="text-sm font-bold text-slate-900">{(job as any).applicantCount || 0}</span>
                              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Proposals</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-16 bg-white rounded-xl border-2 border-dashed border-slate-100">
                    <p className="text-slate-500 text-sm">
                      {employerJobs.length === 0 ? "No jobs posted yet." : "No jobs found in this tab."}
                    </p>
                  </div>
                )}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {clientTab === "talents" && (
              <motion.div
                key="talents"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900">Find Talents</h2>
                    <p className="text-slate-500 mt-1">Discover freelancers based on role, skills, services, and portfolio fit.</p>
                  </div>
                </div>

                <div className="grid gap-6 xl:grid-cols-[280px_minmax(0,1fr)]">
                  <aside className="xl:sticky xl:top-24 xl:self-start">
                    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                      <div className="mb-5">
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-600">Filters</p>
                        <h3 className="mt-1 text-lg font-black text-slate-900">Talent Search</h3>
                      </div>
                      <div className="space-y-5">
                        <div>
                          <label className="mb-2 block text-[10px] font-black uppercase tracking-[0.18em] text-slate-400">
                            Search
                          </label>
                    <div className="relative w-full">
                      <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        type="text"
                        placeholder="Search name, category, skills..."
                        className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                        value={freelancerSearchTerm}
                        onChange={(e) => setFreelancerSearchTerm(e.target.value)}
                      />
                    </div>
                        </div>
                        <div>
                          <label className="mb-2 block text-[10px] font-black uppercase tracking-[0.18em] text-slate-400">
                            View
                          </label>
                          <div className="grid grid-cols-2 gap-2 rounded-xl border border-slate-200 bg-slate-50 p-1">
                            {[
                              { id: "all", label: "All", count: freelancers.length },
                              { id: "saved", label: "Saved", count: savedTalents.length },
                            ].map((option) => (
                              <button
                                key={option.id}
                                type="button"
                                onClick={() => setTalentsFilter(option.id as "all" | "saved")}
                                className={cn(
                                  "rounded-lg px-3 py-2 text-[10px] font-black uppercase tracking-widest transition-all",
                                  talentsFilter === option.id
                                    ? "bg-slate-900 text-white shadow-sm"
                                    : "text-slate-500 hover:bg-white hover:text-slate-900",
                                )}
                              >
                                {option.label} ({option.count})
                              </button>
                            ))}
                          </div>
                        </div>
                        <div>
                          <label className="mb-2 block text-[10px] font-black uppercase tracking-[0.18em] text-slate-400">
                            Service
                          </label>
                    <select
                      className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-xs font-bold uppercase tracking-widest text-slate-600 outline-none focus:ring-2 focus:ring-indigo-500"
                      value={serviceTypeFilter}
                      onChange={(e) => setServiceTypeFilter(e.target.value)}
                    >
                      <option value="all">All Services</option>
                      {serviceTypeOptions.map((serviceType) => (
                        <option key={serviceType} value={serviceType}>
                          {serviceType}
                        </option>
                      ))}
                    </select>
                        </div>
                        <div>
                          <label className="mb-2 block text-[10px] font-black uppercase tracking-[0.18em] text-slate-400">
                            Rating
                          </label>
                          <select
                            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-xs font-bold uppercase tracking-widest text-slate-600 outline-none focus:ring-2 focus:ring-indigo-500"
                            value={talentRatingFilter}
                            onChange={(e) => setTalentRatingFilter(e.target.value as "all" | "4" | "4.5" | "5")}
                          >
                            <option value="all">Any Rating</option>
                            <option value="4">4.0+ Stars</option>
                            <option value="4.5">4.5+ Stars</option>
                            <option value="5">5.0 Stars</option>
                          </select>
                        </div>
                        <div>
                          <label className="mb-2 block text-[10px] font-black uppercase tracking-[0.18em] text-slate-400">
                            Sort
                          </label>
                    <select
                      className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-xs font-bold uppercase tracking-widest text-slate-600 outline-none focus:ring-2 focus:ring-indigo-500"
                      value={talentsSort}
                      onChange={(e) => setTalentsSort(e.target.value as "recommended" | "rate_low" | "rate_high")}
                    >
                      <option value="recommended">Sort: Best Match</option>
                      <option value="rate_low">Sort: Rate Low-High</option>
                      <option value="rate_high">Sort: Rate High-Low</option>
                    </select>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            setFreelancerSearchTerm("");
                            setServiceTypeFilter("all");
                            setTalentsSort("recommended");
                            setTalentsFilter("all");
                            setTalentRatingFilter("all");
                          }}
                          className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-[10px] font-black uppercase tracking-widest text-slate-500 hover:bg-slate-50"
                        >
                          Reset Filters
                        </button>
                      </div>
                    </div>
                  </aside>

                  <div className="space-y-6">

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div className="rounded-xl border border-slate-200 bg-white p-4">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Matches</p>
                    <p className="mt-2 text-2xl font-black text-slate-900">{filteredFreelancers.length}</p>
                  </div>
                  <div className="rounded-xl border border-slate-200 bg-white p-4">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Total Users</p>
                    <p className="mt-2 text-2xl font-black text-slate-900">{freelancers.length}</p>
                  </div>
                </div>

                {savedTalents.length > 0 && (
                  <div className="rounded-2xl border border-indigo-100 bg-gradient-to-r from-indigo-50 via-white to-cyan-50 p-5">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-600">Saved Talents</p>
                        <p className="mt-1 text-sm font-semibold text-slate-600">Your hiring shortlist for quick follow-up.</p>
                      </div>
                      <span className="rounded-full border border-indigo-200 bg-white px-3 py-1 text-[10px] font-black uppercase tracking-widest text-indigo-700">
                        {savedTalents.length} Saved
                      </span>
                    </div>
                    <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
                      {savedTalents.slice(0, 4).map((freelancer) => (
                        <div key={freelancer.id} className="rounded-xl border border-indigo-100 bg-white p-4">
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <p className="text-sm font-black text-slate-900">{freelancer.name}</p>
                              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">{freelancer.category}</p>
                            </div>
                            <button
                              onClick={() => toggleSavedTalent(freelancer.id)}
                              className="rounded-lg border border-slate-200 px-2.5 py-1.5 text-[10px] font-black uppercase tracking-widest text-slate-500 hover:bg-slate-50"
                            >
                              Remove
                            </button>
                          </div>
                          <button
                            onClick={() => openTalentProfile(freelancer)}
                            className="mt-3 inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-indigo-600 hover:text-indigo-700"
                          >
                            Open Talent Profile
                            <ArrowUpRight className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {visibleFreelancers.map((freelancer) => {
                    const trustSignals = getFreelancerTrustSignals(freelancer);
                    const rating = getFreelancerRating(freelancer);
                    const highlightedPortfolio = freelancer.portfolio?.[0];
                    const displayedServices = (freelancer.servicesOffered || []).slice(0, 2);

                    return (
                      <div key={freelancer.id} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:border-indigo-100 transition-all group">
                        <div className="flex items-start gap-4 mb-4">
                          <div className="w-14 h-14 rounded-2xl bg-indigo-50 border border-indigo-100 overflow-hidden flex items-center justify-center shrink-0">
                            {freelancer.avatar_url ? (
                              <img src={freelancer.avatar_url} alt={freelancer.name} className="w-full h-full object-cover" />
                            ) : (
                              <Users className="w-6 h-6 text-indigo-400" />
                            )}
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap items-center gap-2">
                              <h3 className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">{freelancer.name}</h3>
                              <span className={cn(
                                "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[9px] font-black uppercase tracking-widest",
                                rating.count > 0
                                  ? "border-amber-200 bg-amber-50 text-amber-700"
                                  : "border-slate-200 bg-slate-50 text-slate-400",
                              )}>
                                <Star className={cn("h-3 w-3", rating.count > 0 && "fill-amber-400 text-amber-400")} />
                                {rating.count > 0 ? `${rating.average.toFixed(1)} (${rating.count})` : "No rating"}
                              </span>
                              {savedTalentIds.includes(freelancer.id || "") && (
                                <span className="inline-flex items-center gap-1 text-[9px] font-black text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100 uppercase tracking-widest">
                                  <Bookmark className="w-3 h-3" />
                                  Saved
                                </span>
                              )}
                            </div>
                            <div className="mt-1 flex flex-wrap items-center gap-2">
                              <span className="text-[10px] font-bold bg-slate-100 text-slate-600 px-2 py-0.5 rounded uppercase tracking-widest">{freelancer.category}</span>
                              {freelancer.wellness?.verifiedSustainable && (
                                <span className="inline-flex items-center gap-1 text-[9px] font-black text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100 uppercase tracking-widest" title="Verified Sustainable Performer">
                                  <ShieldCheck className="w-3 h-3" />
                                  Sustainable
                                </span>
                              )}
                            </div>
                            <p className="mt-3 line-clamp-2 text-xs font-medium text-slate-500">
                              {freelancer.aboutSections?.whatISpecializeIn || freelancer.bio || "Profile headline not set yet."}
                            </p>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2 rounded-xl border border-slate-100 bg-slate-50/60 p-3">
                          <div className="rounded-lg bg-white p-2 border border-slate-100">
                            <p className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400">Completion</p>
                            <p className="mt-1 text-sm font-black text-slate-900">{Math.round(trustSignals.completionRate)}%</p>
                          </div>
                          <div className="rounded-lg bg-white p-2 border border-slate-100">
                            <p className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400">On-Time</p>
                            <p className="mt-1 text-sm font-black text-slate-900">{Math.round(trustSignals.onTimeDeliveryRate)}%</p>
                          </div>
                          <div className="rounded-lg bg-white p-2 border border-slate-100">
                            <p className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400">Repeat Clients</p>
                            <p className="mt-1 text-sm font-black text-slate-900">{Math.round(trustSignals.repeatClientRate)}%</p>
                          </div>
                          <div className="rounded-lg bg-white p-2 border border-slate-100">
                            <p className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400">Invite Reply</p>
                            <p className="mt-1 text-sm font-black text-slate-900">
                              {trustSignals.inviteResponseHours < 2 ? "< 2h" : `${Math.round(trustSignals.inviteResponseHours)}h`}
                            </p>
                          </div>
                        </div>

                        <div className="mt-3 rounded-xl border border-slate-100 bg-white p-3">
                          <p className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400">Services</p>
                          {displayedServices.length > 0 ? (
                            <div className="mt-2 flex flex-wrap gap-2">
                              {displayedServices.map((service, index) => (
                                <span
                                  key={`${service.serviceName}-${index}`}
                                  className="inline-flex items-center gap-1 rounded-full border border-indigo-100 bg-indigo-50 px-2 py-1 text-[10px] font-bold text-indigo-700"
                                >
                                  {service.serviceName}
                                  <span className="text-indigo-500">
                                    from {service.currency} {Number(service.startingPrice || 0).toLocaleString()}
                                  </span>
                                </span>
                              ))}
                            </div>
                          ) : (
                            <p className="mt-1 text-xs font-semibold text-slate-500">No services listed yet.</p>
                          )}
                        </div>

                        <div className="mt-3 rounded-xl border border-slate-100 bg-white p-3">
                          <p className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400">Portfolio Highlight</p>
                          <p className="mt-1 text-xs font-semibold text-slate-700 line-clamp-2">
                            {highlightedPortfolio?.title || "No highlight yet"}
                          </p>
                        </div>

                        <div className="flex justify-between items-center pt-4 border-t border-slate-50 mt-4">
                          <div>
                            <span className="text-sm font-bold text-slate-900">{freelancer.hourlyRate}/hr</span>
                            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mt-1 inline-flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              Fast response eligible
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => toggleSavedTalent(freelancer.id)}
                              className="px-3 py-2 border border-slate-200 bg-white text-slate-600 text-[10px] font-bold rounded-lg hover:bg-slate-50 transition-all uppercase tracking-widest inline-flex items-center gap-1.5"
                            >
                              <Bookmark className={cn("w-3.5 h-3.5", savedTalentIds.includes(freelancer.id || "") && "fill-current text-indigo-600")} />
                              {savedTalentIds.includes(freelancer.id || "") ? "Saved" : "Save"}
                            </button>
                            <TooltipAction text="Open freelancer profile details">
                              <button
                                onClick={() => {
                                  openTalentProfile(freelancer);
                                }}
                                className="px-4 py-2 bg-slate-900 text-white text-[10px] font-bold rounded-lg hover:bg-black transition-all uppercase tracking-widest"
                              >
                                Open Profile
                              </button>
                            </TooltipAction>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
                {filteredFreelancers.length > 0 && (
                  <div className="flex flex-col items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white px-4 py-5 text-center sm:flex-row sm:text-left">
                    <div>
                      <p className="text-sm font-bold text-slate-900">
                        Showing {Math.min(visibleFreelancers.length, filteredFreelancers.length)} of {filteredFreelancers.length} talents
                      </p>
                      <p className="mt-1 text-xs text-slate-500">
                        Results update automatically when search, service, or sort changes.
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      {visibleTalentsCount > 12 && (
                        <button
                          onClick={() => setVisibleTalentsCount(12)}
                          className="rounded-lg border border-slate-200 px-4 py-2 text-[10px] font-black uppercase tracking-widest text-slate-600 hover:bg-slate-50"
                        >
                          Reset View
                        </button>
                      )}
                      {hasMoreFreelancers && (
                        <button
                          onClick={() => setVisibleTalentsCount((prev) => prev + 12)}
                          className="rounded-lg bg-slate-900 px-4 py-2 text-[10px] font-black uppercase tracking-widest text-white hover:bg-black"
                        >
                          Load More
                        </button>
                      )}
                    </div>
                  </div>
                )}
                {filteredFreelancers.length === 0 && (
                  <div className="rounded-xl border-2 border-dashed border-slate-200 bg-white p-10 text-center">
                    <p className="text-sm font-semibold text-slate-600">No talents found for this filter yet.</p>
                    <p className="mt-1 text-xs text-slate-400">Try changing search keywords or filter settings.</p>
                  </div>
                )}
                  </div>
                </div>
              </motion.div>
            )}

            {clientTab === "profile" && (
              <motion.div
                key="profile"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="mx-auto w-full max-w-6xl"
              >
                <ProfileForm 
                  initialProfile={profile} 
                  onUpdate={handleProfileSave} 
                  onUploadAvatar={uploadProfilePhoto}
                  isSaving={isSaving}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ) : (
          <AdminDashboard viewAs={adminViewMode} onViewAsChange={handleViewSwitch} />
        )}
      </main>

      {/* Freelancer Profile Modal */}
      <AnimatePresence>
        {showFreelancerModal && selectedFreelancer && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowFreelancerModal(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
            >
              <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-white sticky top-0 z-10">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center overflow-hidden border border-indigo-100">
                    {selectedFreelancer.avatar_url ? (
                      <img src={selectedFreelancer.avatar_url} className="w-full h-full object-cover" alt="" />
                    ) : (
                      <Users className="w-6 h-6 text-indigo-400" />
                    )}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900">{selectedFreelancer.name}</h3>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold bg-slate-100 text-slate-600 px-2 py-0.5 rounded uppercase tracking-widest">{selectedFreelancer.category}</span>
                      <span className="text-[10px] font-bold text-emerald-600">{selectedFreelancer.hourlyRate}/hr</span>
                    </div>
                  </div>
                </div>
                <button 
                  onClick={() => setShowFreelancerModal(false)}
                  className="p-2 hover:bg-slate-50 rounded-xl transition-all"
                >
                  <XCircle className="w-6 h-6 text-slate-300 hover:text-slate-500" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-8 space-y-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-1 space-y-6">
                    {isEmployerView && (
                    <div className={cn(
                      "rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-500",
                      contactUnlockTalentId === selectedFreelancer.id && "border-emerald-300 ring-4 ring-emerald-100 shadow-lg shadow-emerald-100",
                    )}>
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Contact Details</h4>
                          <p className="mt-1 text-xs font-semibold text-slate-500">
                            Direct outreach unlocks after you save or invite this talent.
                          </p>
                        </div>
                        {(savedTalentIds.includes(selectedFreelancer.id || "") ||
                          invitedTalentIds.includes(selectedFreelancer.id || "") ||
                          sentTalentInvitations.some((invitation) => invitation.freelancer_id === selectedFreelancer.id)) && (
                          <span className={cn(
                            "inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[9px] font-black uppercase tracking-widest text-emerald-700 transition-all duration-500",
                            contactUnlockTalentId === selectedFreelancer.id && "scale-105 shadow-sm shadow-emerald-200",
                          )}>
                            <ShieldCheck className="h-3 w-3" />
                            Verified Contact
                          </span>
                        )}
                      </div>
                      <div className="mt-4 space-y-3">
                        {(savedTalentIds.includes(selectedFreelancer.id || "") ||
                          invitedTalentIds.includes(selectedFreelancer.id || "") ||
                          sentTalentInvitations.some((invitation) => invitation.freelancer_id === selectedFreelancer.id)) ? (
                          <>
                        <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
                          <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">Email</p>
                          {selectedFreelancer.aiInsights?.applicationProfile?.contactEmail?.trim() ? (
                            <div className="mt-1 flex items-center justify-between gap-3">
                              <a
                                href={`mailto:${selectedFreelancer.aiInsights.applicationProfile.contactEmail.trim()}`}
                                className="inline-flex items-center gap-2 text-sm font-bold text-indigo-600 hover:text-indigo-700 break-all"
                              >
                                <Mail className="h-4 w-4" />
                                {selectedFreelancer.aiInsights.applicationProfile.contactEmail.trim()}
                              </a>
                              <button
                                onClick={() => {
                                  navigator.clipboard.writeText(selectedFreelancer.aiInsights?.applicationProfile?.contactEmail?.trim() || "");
                                  setToastMsg("Email copied.");
                                  setShowToast(true);
                                }}
                                className="inline-flex shrink-0 items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-[10px] font-black uppercase tracking-widest text-slate-600 hover:bg-slate-50"
                              >
                                <Copy className="h-3.5 w-3.5" />
                                Copy
                              </button>
                            </div>
                          ) : (
                            <p className="mt-1 text-sm font-semibold text-slate-500">Not provided</p>
                          )}
                        </div>
                        <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
                          <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">Contact Number</p>
                          {selectedFreelancer.aiInsights?.applicationProfile?.contactPhone?.trim() ? (
                            <div className="mt-1 flex items-center justify-between gap-3">
                              <a
                                href={`tel:${selectedFreelancer.aiInsights.applicationProfile.contactPhone.trim()}`}
                                className="inline-flex items-center gap-2 text-sm font-bold text-indigo-600 hover:text-indigo-700 break-all"
                              >
                                <Phone className="h-4 w-4" />
                                {selectedFreelancer.aiInsights.applicationProfile.contactPhone.trim()}
                              </a>
                              <button
                                onClick={() => {
                                  navigator.clipboard.writeText(selectedFreelancer.aiInsights?.applicationProfile?.contactPhone?.trim() || "");
                                  setToastMsg("Contact number copied.");
                                  setShowToast(true);
                                }}
                                className="inline-flex shrink-0 items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-[10px] font-black uppercase tracking-widest text-slate-600 hover:bg-slate-50"
                              >
                                <Copy className="h-3.5 w-3.5" />
                                Copy
                              </button>
                            </div>
                          ) : (
                            <p className="mt-1 text-sm font-semibold text-slate-500">Not provided</p>
                          )}
                        </div>
                          </>
                        ) : (
                          <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 px-4 py-5">
                            <div className="flex items-start gap-3">
                              <div className="rounded-xl bg-slate-900 p-2 text-white">
                                <Lock className="h-4 w-4" />
                              </div>
                              <div>
                                <p className="text-sm font-black text-slate-900">Contact details are locked</p>
                                <p className="mt-1 text-xs font-semibold leading-relaxed text-slate-500">
                                  Save this talent or send an invite first to unlock email and contact number for direct outreach.
                                </p>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                    )}

                    {/* Follow/Save Interaction */}
                    <div className="bg-slate-950 p-6 rounded-2xl border border-white/10 text-white shadow-2xl overflow-hidden relative group">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/20 blur-3xl -z-10 group-hover:bg-indigo-500/30 transition-all duration-700" />
                      <h4 className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                        <Users className="w-3 h-3" />
                        Network Action
                      </h4>
                      <div className="flex flex-col gap-3">
                        {isEmployerView && (
                          <button
                            onClick={() => void sendTalentInvite(selectedFreelancer)}
                            disabled={
                              invitedTalentIds.includes(selectedFreelancer.id || "") ||
                              sentTalentInvitations.some((invitation) => invitation.freelancer_id === selectedFreelancer.id)
                            }
                            className="w-full py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 bg-indigo-600 text-white hover:bg-indigo-500 shadow-lg shadow-indigo-600/20 disabled:bg-indigo-900/40 disabled:text-indigo-200 disabled:cursor-not-allowed"
                          >
                            <UserPlus className="w-4 h-4" />
                            {invitedTalentIds.includes(selectedFreelancer.id || "") ||
                            sentTalentInvitations.some((invitation) => invitation.freelancer_id === selectedFreelancer.id)
                              ? "Invited"
                              : "Invite"}
                          </button>
                        )}
                        {isEmployerView && (
                          <button
                            onClick={() => toggleSavedTalent(selectedFreelancer.id)}
                            className="w-full py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 bg-white text-slate-900 hover:bg-slate-50"
                          >
                            <Bookmark className={cn("w-4 h-4", savedTalentIds.includes(selectedFreelancer.id || "") && "fill-current text-indigo-600")} />
                            {savedTalentIds.includes(selectedFreelancer.id || "") ? "Saved Talent" : "Save Talent"}
                          </button>
                        )}
                        <button 
                          onClick={() => toggleFollow(selectedFreelancer.id!)}
                          className={`w-full py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${
                            userFollows.includes(selectedFreelancer.id!)
                            ? 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                            : 'bg-indigo-600 text-white hover:bg-indigo-500 shadow-lg shadow-indigo-600/20'
                          }`}
                        >
                          {userFollows.includes(selectedFreelancer.id!) ? (
                            <>
                              <CheckCircle2 className="w-4 h-4" />
                              Following
                            </>
                          ) : (
                            <>
                              <PlusCircle className="w-4 h-4" />
                              Follow
                            </>
                          )}
                        </button>
                        <p className="text-[9px] text-slate-500 text-center font-bold uppercase tracking-widest mt-2">
                          {isEmployerView
                            ? "Invite appears in freelancer notifications and dashboard inbox."
                            : "Save profiles to build your shortlist."}
                        </p>
                      </div>
                    </div>

                    <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                      <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Hiring Signals</h4>
                      <div className="grid grid-cols-2 gap-2 mb-5">
                        <div className="rounded-xl border border-slate-200 bg-white p-3">
                          <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">Completion</p>
                          <p className="mt-1 text-sm font-black text-slate-900">
                            92%
                          </p>
                        </div>
                        <div className="rounded-xl border border-slate-200 bg-white p-3">
                          <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">On-Time</p>
                          <p className="mt-1 text-sm font-black text-slate-900">
                            93%
                          </p>
                        </div>
                        <div className="rounded-xl border border-slate-200 bg-white p-3">
                          <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">Repeat</p>
                          <p className="mt-1 text-sm font-black text-slate-900">
                            28%
                          </p>
                        </div>
                        <div className="rounded-xl border border-slate-200 bg-white p-3">
                          <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">Invite Reply</p>
                          <p className="mt-1 text-sm font-black text-slate-900">
                            4h
                          </p>
                        </div>
                      </div>

                      <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Top Skills</h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedFreelancer.skills.map(skill => (
                          <span key={skill} className="px-3 py-1 bg-white border border-slate-200 rounded-lg text-[10px] font-bold text-slate-600">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>

                    {false && <div className="bg-indigo-900 p-6 rounded-2xl text-white shadow-lg">
                      <h4 className="text-sm font-bold mb-2">Quick Action</h4>
                      <p className="text-xs text-indigo-200 mb-6 leading-relaxed">Ready to discuss your project with {(selectedFreelancer?.name || "User").split(' ')[0]}?</p>
                      <Link 
                        href={
                          isEmployerView
                            ? `/messages?with=${selectedFreelancer?.id || ""}&official=1`
                            : `/messages?with=${selectedFreelancer?.id || ""}`
                        }
                        className="w-full bg-white text-indigo-600 py-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 hover:bg-indigo-50 transition-all uppercase tracking-widest"
                      >
                        <Mail className="w-4 h-4" />
                        Send a Message
                      </Link>
                    </div>}
                  </div>

                    <div className="lg:col-span-2 space-y-6">
                      <div className="flex flex-wrap gap-2 rounded-2xl border border-slate-200 bg-slate-50 p-1.5">
                        {[
                          { id: "overview", label: "Profile" },
                          { id: "portfolio", label: "Portfolio" },
                          { id: "feedback", label: "Reviews" },
                        ].map((tab) => (
                          <button
                            key={tab.id}
                            type="button"
                            onClick={() => setActiveFreelancerProfileTab(tab.id as "overview" | "portfolio" | "feedback")}
                            className={cn(
                              "rounded-xl px-4 py-2 text-xs font-black uppercase tracking-widest transition-all",
                              activeFreelancerProfileTab === tab.id
                                ? "bg-slate-900 text-white shadow-sm"
                                : "text-slate-500 hover:bg-white hover:text-slate-900",
                            )}
                          >
                            {tab.label}
                          </button>
                        ))}
                      </div>

                      {activeFreelancerProfileTab === "overview" && (
                        <div>
                          <h4 className="text-sm font-bold text-slate-900 mb-3 uppercase tracking-widest">About</h4>
                          {(selectedFreelancer.bio || selectedFreelancer.aboutSections?.whatISpecializeIn || "").trim().length > 0 ? (
                            <div className="rounded-xl border border-slate-200 bg-white p-4">
                              <p className="mt-1 text-sm font-medium leading-relaxed text-slate-700">
                                {selectedFreelancer.bio || selectedFreelancer.aboutSections?.whatISpecializeIn}
                              </p>
                            </div>
                          ) : (
                            <p className="text-slate-600 leading-relaxed font-medium">No bio provided yet.</p>
                          )}
                        </div>
                      )}

                      {activeFreelancerProfileTab === "portfolio" && (
                        <div>
                          <h4 className="text-sm font-bold text-slate-900 mb-6 uppercase tracking-widest">Portfolio Showcase</h4>
                          <div className="grid grid-cols-1 gap-4">
                            {selectedFreelancer.portfolio && selectedFreelancer.portfolio.length > 0 ? (
                              selectedFreelancer.portfolio.slice(0, 3).map((item) => (
                                <div key={item.id} className="p-5 border border-slate-100 rounded-2xl bg-slate-50/50 hover:bg-white hover:shadow-xl hover:shadow-indigo-500/5 transition-all group">
                                  <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 bg-white rounded-xl border border-slate-100 flex items-center justify-center shrink-0">
                                      <Code className="w-6 h-6 text-indigo-500" />
                                    </div>
                                    <div className="flex-1">
                                      <h5 className="font-bold text-slate-900 mb-1">{item.title}</h5>
                                      <p className="text-xs text-slate-500 leading-relaxed mb-4">{item.description}</p>
                                      <div className="flex flex-wrap gap-2">
                                        {item.technologies.map(t => (
                                          <span key={t} className="px-2 py-0.5 bg-white border border-slate-100 rounded text-[9px] font-bold text-slate-400">
                                            {t}
                                          </span>
                                        ))}
                                      </div>
                                      {item.project_url && (
                                        <a 
                                          href={item.project_url} 
                                          target="_blank" 
                                          className="inline-flex items-center gap-1.5 text-indigo-600 text-[10px] font-bold mt-4 hover:underline"
                                        >
                                          View Project <ExternalLink className="w-3 h-3" />
                                        </a>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              ))
                            ) : (
                              <div className="py-12 text-center border-2 border-dashed border-slate-100 rounded-2xl">
                                <p className="text-slate-400 text-sm">No portfolio items shown.</p>
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {activeFreelancerProfileTab === "feedback" && (() => {
                        const reviews = Array.isArray((selectedFreelancer as any).clientReviews)
                          ? (selectedFreelancer as any).clientReviews
                          : [];
                        const rating = getFreelancerRating(selectedFreelancer);
                        const canLeaveFeedback =
                          isEmployerView &&
                          Boolean(selectedFreelancerAcceptedInvitation) &&
                          selectedFreelancerWorkCompleted &&
                          !selectedFreelancerAlreadyReviewed;

                        return (
                          <div>
                            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                              <div>
                                <h4 className="text-sm font-bold text-slate-900 uppercase tracking-widest">Reviews & Employer Feedback</h4>
                                <p className="mt-1 text-xs font-semibold text-slate-500">Public reviews are shown here. New feedback is only unlocked after verified completed work.</p>
                              </div>
                              <span className="inline-flex items-center gap-1 rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-black text-amber-700">
                                <Star className={cn("h-3.5 w-3.5", rating.count > 0 && "fill-amber-400 text-amber-400")} />
                                {rating.count > 0 ? `${rating.average.toFixed(1)} average` : "No rating yet"}
                              </span>
                            </div>
                            {isEmployerView && (
                              <div className="mb-5 rounded-2xl border border-slate-200 bg-slate-50 p-5">
                                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                                  <div>
                                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Employer Review Controls</p>
                                    <h5 className="mt-2 text-sm font-black text-slate-900">
                                      {selectedFreelancerAlreadyReviewed
                                        ? "Feedback already submitted"
                                        : canLeaveFeedback
                                          ? "Completed work verified"
                                          : selectedFreelancerWorkCompleted
                                            ? "Ready for feedback"
                                            : selectedFreelancerAcceptedInvitation
                                              ? "Accepted invitation found"
                                              : "Invite must be accepted first"}
                                    </h5>
                                    <p className="mt-1 text-xs font-semibold leading-relaxed text-slate-500">
                                      Employers can only leave feedback after the freelancer accepts the invitation and the engagement is marked completed.
                                    </p>
                                  </div>
                                  {selectedFreelancerAcceptedInvitation && !selectedFreelancerWorkCompleted && (
                                    <button
                                      type="button"
                                      onClick={() => void markTalentWorkCompleted(selectedFreelancerAcceptedInvitation)}
                                      disabled={isMarkingTalentWorkComplete}
                                      className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-xs font-black uppercase tracking-widest text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-300"
                                    >
                                      <CheckCircle2 className="h-4 w-4" />
                                      {isMarkingTalentWorkComplete ? "Saving..." : "Mark Work Completed"}
                                    </button>
                                  )}
                                </div>

                                {canLeaveFeedback && (
                                  <div className="mt-5 grid gap-3 border-t border-slate-200 pt-5">
                                    <input
                                      value={freelancerFeedbackProjectTitle}
                                      onChange={(event) => setFreelancerFeedbackProjectTitle(event.target.value)}
                                      placeholder={selectedFreelancerAcceptedInvitation?.latestJob?.title || "Project title"}
                                      className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-900 outline-none transition focus:border-indigo-300 focus:ring-4 focus:ring-indigo-50"
                                    />
                                    <div className="flex flex-wrap items-center gap-2">
                                      {[1, 2, 3, 4, 5].map((value) => (
                                        <button
                                          key={value}
                                          type="button"
                                          onClick={() => setFreelancerFeedbackRating(value)}
                                          className={cn(
                                            "inline-flex h-10 w-10 items-center justify-center rounded-xl border text-sm font-black transition",
                                            freelancerFeedbackRating >= value
                                              ? "border-amber-200 bg-amber-50 text-amber-600"
                                              : "border-slate-200 bg-white text-slate-300 hover:text-amber-500",
                                          )}
                                          aria-label={`${value} star rating`}
                                        >
                                          <Star className={cn("h-4 w-4", freelancerFeedbackRating >= value && "fill-amber-400 text-amber-400")} />
                                        </button>
                                      ))}
                                    </div>
                                    <textarea
                                      value={freelancerFeedbackComment}
                                      onChange={(event) => setFreelancerFeedbackComment(event.target.value)}
                                      placeholder="Write a fair, specific comment about the completed work."
                                      rows={4}
                                      className="w-full resize-none rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-900 outline-none transition focus:border-indigo-300 focus:ring-4 focus:ring-indigo-50"
                                    />
                                    <button
                                      type="button"
                                      onClick={() => void submitFreelancerReview()}
                                      disabled={isSubmittingFreelancerFeedback || freelancerFeedbackComment.trim().length < 10}
                                      className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-xs font-black uppercase tracking-widest text-white transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:bg-slate-300"
                                    >
                                      <Star className="h-4 w-4" />
                                      {isSubmittingFreelancerFeedback ? "Submitting..." : "Submit Feedback"}
                                    </button>
                                  </div>
                                )}
                              </div>
                            )}
                            {reviews.length > 0 ? (
                              <div className="space-y-4">
                                {reviews.map((review: any, index: number) => (
                                  <article key={review.id || `${review.clientName || "review"}-${index}`} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                                    <div className="flex flex-wrap items-start justify-between gap-3">
                                      <div>
                                        <h5 className="text-sm font-black text-slate-900">{review.clientName || "Client"}</h5>
                                        <p className="mt-1 text-xs font-semibold text-slate-500">{review.projectTitle || "Completed project"}</p>
                                      </div>
                                      <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-black text-amber-700">
                                        <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                                        {Number(review.rating || 0).toFixed(1)}
                                      </span>
                                    </div>
                                    <p className="mt-4 text-sm leading-relaxed text-slate-700">{review.comment || "No written comment provided."}</p>
                                    {review.date && (
                                      <p className="mt-4 text-[10px] font-black uppercase tracking-widest text-slate-400">{review.date}</p>
                                    )}
                                  </article>
                                ))}
                              </div>
                            ) : (
                              <div className="rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 p-10 text-center">
                                <Star className="mx-auto h-8 w-8 text-slate-300" />
                                <p className="mt-4 text-sm font-black text-slate-700">No feedback yet</p>
                                <p className="mt-1 text-xs font-semibold text-slate-500">Client feedback and comments will appear here after completed work is reviewed.</p>
                              </div>
                            )}
                          </div>
                        );
                      })()}
                    </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Job Applicants Modal */}
      <AnimatePresence>
        {showApplicantsModal && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowApplicantsModal(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden max-h-[85vh] flex flex-col"
            >
              <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-white sticky top-0 z-10">
                <div>
                  <h3 className="text-xl font-bold text-slate-900">Applicants for</h3>
                  <p className="text-sm font-medium text-indigo-600 truncate max-w-md">{selectedJobTitle}</p>
                </div>
                <button 
                  onClick={() => setShowApplicantsModal(false)}
                  className="p-2 hover:bg-slate-50 rounded-xl transition-all"
                >
                  <XCircle className="w-6 h-6 text-slate-300 hover:text-slate-500" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {selectedJobApplicants.length > 0 ? (
                  selectedJobApplicants.map((app: any) => (
                    <div key={app.id} className="p-6 bg-slate-50 rounded-2xl border border-slate-100 hover:border-indigo-200 hover:bg-white hover:shadow-2xl hover:shadow-indigo-500/5 transition-all group">
                      <div className="flex flex-col md:flex-row items-start gap-6">
                        <div className="w-16 h-16 rounded-2xl bg-indigo-50 border border-indigo-100 overflow-hidden flex items-center justify-center shrink-0 shadow-sm">
                          {(app.freelancer_profile || app.profiles)?.avatar_url ? (
                            <img src={(app.freelancer_profile || app.profiles).avatar_url} className="w-full h-full object-cover" alt="" />
                          ) : (
                            <Users className="w-8 h-8 text-indigo-400" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0 space-y-4">
                          <div className="flex flex-wrap justify-between items-start gap-4">
                            <div>
                              <h4 className="font-black text-slate-900 text-xl tracking-tight">{(app.freelancer_profile || app.profiles)?.name || "Unknown Freelancer"}</h4>
                              <div className="flex items-center gap-2 mt-1">
                                <span className="text-[10px] font-bold bg-white text-indigo-600 px-2.5 py-1 rounded-lg border border-indigo-100 uppercase tracking-widest">{(app.freelancer_profile || app.profiles)?.category}</span>
                                <span className={cn(
                                  "text-[10px] font-bold px-2.5 py-1 rounded-lg border uppercase tracking-widest",
                                  app.status === 'hired' ? "bg-emerald-50 text-emerald-600 border-emerald-100" :
                                  app.status === 'rejected' ? "bg-rose-50 text-rose-600 border-rose-100" :
                                  "bg-amber-50 text-amber-600 border-amber-100"
                                )}>
                                  {app.status}
                                </span>
                              </div>
                            </div>
                            <div className="text-right">
                              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Applied Date</span>
                              <p className="text-xs font-black text-slate-900">{new Date(app.created_at).toLocaleDateString()}</p>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {app.resume_url && (
                              <a href={app.resume_url} target="_blank" className="flex items-center gap-3 p-3.5 bg-white border border-slate-200 rounded-2xl text-[11px] font-bold text-slate-700 hover:border-indigo-500 hover:text-indigo-600 hover:shadow-lg transition-all">
                                <div className="w-8 h-8 rounded-lg bg-rose-50 flex items-center justify-center">
                                  <FileText className="w-4 h-4 text-rose-500" />
                                </div>
                                Professional Resume
                                <ExternalLink className="w-3 h-3 ml-auto opacity-40" />
                              </a>
                            )}
                            {app.portfolio_url && (
                              <a href={app.portfolio_url} target="_blank" className="flex items-center gap-3 p-3.5 bg-white border border-slate-200 rounded-2xl text-[11px] font-bold text-slate-700 hover:border-indigo-500 hover:text-indigo-600 hover:shadow-lg transition-all">
                                <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center">
                                  <Code className="w-4 h-4 text-indigo-500" />
                                </div>
                                Project Portfolio
                                <ExternalLink className="w-3 h-3 ml-auto opacity-40" />
                              </a>
                            )}
                          </div>

                          <div className="flex flex-wrap gap-3 pt-2">
                            <TooltipAction text="Open employer talent profile with hiring and review controls">
                              <button
                                type="button"
                                onClick={() =>
                                  openTalentProfile({
                                    ...((app.freelancer_profile || app.profiles) || {}),
                                    id: (app.freelancer_profile || app.profiles)?.id || app.freelancer_id,
                                  } as Partial<UserProfile>)
                                }
                                className="px-6 py-3 bg-white text-slate-700 text-[10px] font-bold rounded-xl hover:bg-slate-50 transition-all uppercase tracking-widest flex items-center gap-2 border border-slate-200 active:scale-95"
                              >
                                <User className="w-4 h-4" />
                                Open Talent Profile
                              </button>
                            </TooltipAction>
                            {app.status === 'pending' && (
                              <TooltipAction text="Add this applicant to your candidates">
                                <button 
                                  onClick={() => {
                                    const job = employerJobs.find(j => j.title === selectedJobTitle);
                                    approveApplication(app.id, app.freelancer_id, app.job_id, selectedJobTitle, job?.budget || 0);
                                  }}
                                  disabled={isSaving}
                                  className="px-6 py-3 bg-indigo-600 text-white text-[10px] font-bold rounded-xl hover:bg-indigo-700 transition-all uppercase tracking-widest flex items-center gap-2 shadow-xl shadow-indigo-500/20 active:scale-95"
                                >
                                  <CheckCircle2 className="w-4 h-4" />
                                  Add Candidate
                                </button>
                              </TooltipAction>
                            )}
                            {app.status !== 'rejected' && (
                              <TooltipAction text="Reject this applicant">
                                <button
                                  type="button"
                                  onClick={() => rejectApplication(app.id)}
                                  disabled={isSaving}
                                  className="px-6 py-3 bg-rose-50 text-rose-600 text-[10px] font-bold rounded-xl hover:bg-rose-100 transition-all uppercase tracking-widest flex items-center gap-2 border border-rose-100 active:scale-95"
                                >
                                  <XCircle className="w-4 h-4" />
                                  Reject
                                </button>
                              </TooltipAction>
                            )}
                            {app.status !== 'pending' && app.status !== 'rejected' && (
                              <span
                                className="px-6 py-3 bg-emerald-50 text-emerald-600 text-[10px] font-bold rounded-xl uppercase tracking-widest flex items-center gap-2 border border-emerald-100"
                              >
                                <CheckCircle2 className="w-4 h-4" />
                                Added
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Users className="w-8 h-8 text-slate-200" />
                    </div>
                    <p className="text-slate-500 font-medium">No applications for this job yet.</p>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Application Confirmation Modal */}
      <AnimatePresence>
        {showApplicationModal && selectedApplicationJob && (
          <div className="fixed inset-0 z-[95] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeApplicationModal}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 16 }}
              className="relative w-full max-w-2xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl"
            >
              <div className="border-b border-slate-100 p-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-600">Review Application</p>
                    <h3 className="mt-1 text-xl font-black text-slate-900">{selectedApplicationJob.title}</h3>
                    <p className="mt-1 text-sm text-slate-500">
                      Confirm your application details before submitting. Status will stay unchanged until you confirm.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={closeApplicationModal}
                    className="rounded-xl border border-slate-200 px-3 py-1.5 text-xs font-bold text-slate-600 hover:bg-slate-50"
                  >
                    Close
                  </button>
                </div>
              </div>

              <div className="space-y-5 p-6">
                <div className="grid gap-3 sm:grid-cols-3">
                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                    <p className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-400">Rate</p>
                    <p className="mt-1 text-sm font-bold text-slate-900">{selectedApplicationJob.rate}</p>
                  </div>
                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                    <p className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-400">Duration</p>
                    <p className="mt-1 text-sm font-bold text-slate-900">{selectedApplicationJob.duration}</p>
                  </div>
                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                    <p className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-400">Type</p>
                    <p className="mt-1 text-sm font-bold text-slate-900">{selectedApplicationJob.jobType || "Contract"}</p>
                  </div>
                </div>

                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-400">Required Skills</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {selectedApplicationJob.skills.length > 0 ? (
                      selectedApplicationJob.skills.map((skill) => (
                        <span
                          key={skill}
                          className="rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-slate-700"
                        >
                          {skill}
                        </span>
                      ))
                    ) : (
                      <span className="text-sm text-slate-500">No skills listed.</span>
                    )}
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-3">
                  <div className={cn(
                    "rounded-xl border p-4",
                    getApplicationProfileData(profile).resumeUrl
                      ? "border-emerald-200 bg-emerald-50"
                      : "border-amber-200 bg-amber-50",
                  )}>
                    <p className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-400">Resume</p>
                    <p className="mt-1 text-sm font-semibold text-slate-900">
                      {getApplicationProfileData(profile).resumeUrl ? "Attached from profile" : "Not attached"}
                    </p>
                  </div>
                  <div className={cn(
                    "rounded-xl border p-4",
                    getApplicationProfileData(profile).portfolioUrl
                      ? "border-emerald-200 bg-emerald-50"
                      : "border-amber-200 bg-amber-50",
                  )}>
                    <p className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-400">Portfolio Link</p>
                    <p className="mt-1 text-sm font-semibold text-slate-900">
                      {getApplicationProfileData(profile).portfolioUrl ? "Attached from profile" : "Not attached"}
                    </p>
                  </div>
                  <div className={cn(
                    "rounded-xl border p-4",
                    getApplicationProfileData(profile).interviewUrl
                      ? "border-emerald-200 bg-emerald-50"
                      : "border-amber-200 bg-amber-50",
                  )}>
                    <p className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-400">Interview Link</p>
                    <p className="mt-1 text-sm font-semibold text-slate-900">
                      {getApplicationProfileData(profile).interviewUrl ? "Attached from profile" : "Not attached"}
                    </p>
                  </div>
                </div>

                <div>
                  <div className="mb-2 flex items-center justify-between gap-3">
                    <label className="block text-[11px] font-bold uppercase tracking-[0.18em] text-slate-500">
                      Cover Letter
                    </label>
                    <button
                      type="button"
                      onClick={() =>
                        setApplicationDraftCoverLetter(
                          buildSuggestedCoverLetter(
                            selectedApplicationJob,
                            profile,
                            getApplicationProfileData(profile).coverLetter || "",
                          ),
                        )
                      }
                      className="text-[11px] font-bold text-indigo-600 hover:text-indigo-700"
                    >
                      Reset Draft
                    </button>
                  </div>
                  <textarea
                    rows={8}
                    value={applicationDraftCoverLetter}
                    onChange={(e) => setApplicationDraftCoverLetter(e.target.value)}
                    placeholder="Write a short, job-specific note explaining why you are a strong fit for this role."
                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 transition-all placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-100"
                  />
                  <p className="mt-2 text-sm text-slate-500">
                    Start from your saved default and tailor it to this specific job before you submit.
                  </p>
                </div>

                <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                  <button
                    type="button"
                    onClick={closeApplicationModal}
                    disabled={isSubmittingApplication}
                    className="rounded-xl border border-slate-200 px-4 py-3 text-xs font-bold uppercase tracking-[0.18em] text-slate-600 hover:bg-slate-50 disabled:opacity-60"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={() => void submitApplication(selectedApplicationJob.id, applicationDraftCoverLetter)}
                    disabled={isSubmittingApplication}
                    className="rounded-xl bg-slate-900 px-5 py-3 text-xs font-black uppercase tracking-[0.18em] text-white hover:bg-black disabled:opacity-60"
                  >
                    {isSubmittingApplication ? "Submitting..." : "Confirm and Submit"}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Settings Modal */}
      <AnimatePresence>
        {showSettingsModal && (
          <div className="fixed inset-0 z-[90] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowSettingsModal(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 16 }}
              className="relative w-full max-w-lg rounded-2xl border border-slate-200 bg-white shadow-2xl overflow-hidden"
            >
              <div className="border-b border-slate-100 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Settings</p>
                    <h3 className="mt-1 text-xl font-black text-slate-900">Account Security</h3>
                    <p className="mt-1 text-sm text-slate-500">Change your password securely.</p>
                  </div>
                  <button
                    onClick={() => setShowSettingsModal(false)}
                    className="rounded-xl border border-slate-200 px-3 py-1.5 text-xs font-bold text-slate-600 hover:bg-slate-50"
                  >
                    Close
                  </button>
                </div>
              </div>

              <div className="space-y-5 p-6">
                <div className="rounded-xl border border-indigo-100 bg-indigo-50/60 p-4">
                  <p className="inline-flex items-center gap-2 text-[11px] font-bold text-indigo-700">
                    <Lock className="h-4 w-4" />
                    Password must be at least 8 characters.
                  </p>
                </div>

                <div>
                  <label className="mb-1 block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                    New Password
                  </label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password"
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-800 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm new password"
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-800 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                  />
                </div>

                <button
                  type="button"
                  onClick={() => void handlePasswordUpdate()}
                  disabled={settingsLoading}
                  className="w-full rounded-xl bg-slate-900 px-4 py-3 text-xs font-black uppercase tracking-[0.18em] text-white hover:bg-black disabled:opacity-60"
                >
                  {settingsLoading ? "Updating..." : "Change Password"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showFeedbackModal && (
          <div className="fixed inset-0 z-[95] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowFeedbackModal(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 16 }}
              className="relative w-full max-w-xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl"
            >
              <div className="border-b border-slate-100 px-6 py-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Product Feedback</p>
                    <h3 className="mt-1 text-xl font-black text-slate-900">{feedbackMeta.title}</h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowFeedbackModal(false)}
                    className="rounded-xl border border-slate-200 px-3 py-1.5 text-xs font-bold text-slate-600 hover:bg-slate-50"
                  >
                    Close
                  </button>
                </div>
              </div>
              <div className="space-y-5 px-6 py-5">
                <textarea
                  rows={7}
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
                  placeholder={
                    feedbackType === "feature"
                      ? "Describe the feature, the problem it solves, and where you expect to use it."
                      : feedbackType === "bug"
                        ? "Describe what happened, what you expected, and the steps to reproduce it."
                        : "Share your rating and what is working well or needs improvement."
                  }
                  value={feedbackMessage}
                  onChange={(e) => setFeedbackMessage(e.target.value)}
                />
                <div className="flex flex-wrap justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      const text = [
                        `${feedbackMeta.title}`,
                        `User: ${profile.name || "User"}`,
                        `Role: ${profile.role || "freelancer"}`,
                        "",
                        feedbackMessage.trim() || "Add your feedback here.",
                      ].join("\n");
                      navigator.clipboard.writeText(text);
                      setToastMsg("Feedback draft copied.");
                      setShowToast(true);
                      setTimeout(() => setShowToast(false), 2000);
                    }}
                    className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-bold text-slate-700 hover:bg-slate-50"
                  >
                    Copy Draft
                  </button>
                  <button
                    type="button"
                    onClick={() => void submitFeedback()}
                    disabled={isSubmittingFeedback}
                    className="rounded-xl border border-indigo-200 bg-indigo-50 px-4 py-2.5 text-sm font-bold text-indigo-700 hover:bg-indigo-100 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {isSubmittingFeedback ? "Submitting..." : "Submit Feedback"}
                  </button>
                  <button
                    type="button"
                    onClick={handleFeedbackEmail}
                    className="rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-bold text-white hover:bg-black"
                  >
                    Open Email Draft
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Toast Notification */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: 50, x: "-50%" }}
            animate={{ opacity: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, y: 20, x: "-50%" }}
            className="fixed bottom-8 left-1/2 z-50 w-full max-w-md px-4"
          >
            <div className="bg-slate-900 text-white p-4 rounded-2xl shadow-2xl border border-slate-800 flex items-center gap-4">
              <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shrink-0">
                <Bell className="w-5 h-5 text-white animate-ring" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-bold tracking-tight">{toastMsg}</p>
                <p className="text-[10px] text-slate-400 mt-1 uppercase font-bold tracking-widest">{toastLabel}</p>
              </div>
              <button onClick={() => setShowToast(false)} className="text-slate-500 hover:text-white transition-colors">
                &times;
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {false && (
      <footer className="bg-slate-50 border-t border-slate-200 py-16 mt-20">
        <div className="max-w-full px-4 sm:px-10 text-center">
          <button 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="flex items-center justify-center gap-2 mb-6 mx-auto hover:opacity-80 transition-opacity"
          >
            <img 
              src="/tarawork-removebg-preview.png" 
              alt="Tara Logo" 
              className="h-10 w-auto grayscale opacity-40"
            />
          </button>
          <p className="text-slate-400 text-xs font-medium uppercase tracking-widest">© 2024 Tara Marketplace. All rights reserved.</p>
        </div>
      </footer>
      )}
    </div>
  );
}

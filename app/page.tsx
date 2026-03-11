"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { UserProfile, Job, PortfolioItem, Squad, Project } from "../types";
import JobFeed from "../components/JobFeed";
import ProfileForm from "../components/ProfileForm";
import SkillAssessment from "../components/SkillAssessment";
import Workspace from "../components/Workspace";
import TeamManager from "../components/TeamManager";
import CareerPath from "../components/CareerPath";
import JobPostingForm from "../components/JobPostingForm";
import AdminDashboard from "../components/AdminDashboard";
import { supabase } from "../lib/supabase";
import { cn, energyScore } from "../lib/utils";
import { useRouter } from "next/navigation";
import { 
  Briefcase, 
  Users, 
  Zap, 
  LayoutDashboard, 
  Bell, 
  Settings,
  Search as SearchIcon,
  TrendingUp,
  Award,
  Shield,
  ShieldCheck,
  ArrowUpRight,
  Clock,
  LogIn,
  Mail,
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
  Menu,
  X
} from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import AIAgent from "../components/AIAgent";
import LandingPage from "../components/LandingPage";

export default function Home() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMsg, setToastMsg] = useState("");
  const [view, setView] = useState<"freelancer" | "client" | "admin">("freelancer");
  const [jobs, setJobs] = useState<Job[]>([]);
  const [employerJobs, setemployerJobs] = useState<Job[]>([]);
  const [appliedJobs, setAppliedJobs] = useState<Record<string, string>>({});
  const [freelancers, setFreelancers] = useState<UserProfile[]>([]);
  const [dbError, setDbError] = useState<boolean>(false);
  const [missingTables, setMissingTables] = useState<string[]>([]);
  const [portfolioInquiries, setPortfolioInquiries] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [freelancerSearchTerm, setFreelancerSearchTerm] = useState("");
  const [debouncedFreelancerSearchTerm, setDebouncedFreelancerSearchTerm] = useState("");
  const [selectedFreelancer, setSelectedFreelancer] = useState<UserProfile | null>(null);
  const [showEscrowModal, setShowEscrowModal] = useState(false);
  const [showFreelancerModal, setShowFreelancerModal] = useState(false);
  const [showApplicantsModal, setShowApplicantsModal] = useState(false);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [selectedJobIdForApply, setSelectedJobIdForApply] = useState<string | null>(null);
  const [pendingApplyJobId, setPendingApplyJobId] = useState<string | null>(null);
  const [applyData, setApplyData] = useState({
    resumeUrl: "",
    portfolioUrl: "",
    interviewUrl: "",
    coverLetter: ""
  });
  const [notifications, setNotifications] = useState<any[]>([]);
  const [userFollows, setUserFollows] = useState<string[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [userEscrows, setUserEscrows] = useState<any[]>([]);
  const [selectedJobApplicants, setSelectedJobApplicants] = useState<any[]>([]);
  const [selectedJobTitle, setSelectedJobTitle] = useState("");
  const jobsRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

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
      cultureMatch: []
    },
    ranking: 15,
    hourlyRate: "$0",
    bio: "",
    activeProjects: [],
    premiumProfile: {
      tier: "free",
      analytics: {
        profileViews: 0,
        clientClicks: 0,
      },
    },
  });

  const [isMenuOpen, setIsMenuOpen] = useState(false);

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

  const [isSaving, setIsSaving] = useState(false);

  const [isVetting, setIsVetting] = useState(false);
  const [vettingData, setVettingData] = useState<any>(null);

  const [freelancerTab, setFreelancerTab] = useState<"overview" | "jobs" | "workspace" | "career" | "profile">("overview");
  const [clientTab, setClientTab] = useState<"overview" | "post" | "postings" | "talents" | "profile">("overview");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const applyId = params.get("apply");
    if (!applyId) return;
    setFreelancerTab("jobs");
    setPendingApplyJobId(applyId);
  }, []);

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
        // Normalize profile data to ensure arrays are not null/undefined
        const normalizedData: UserProfile = {
          ...data,
          skills: Array.isArray(data.skills) ? data.skills : [],
          verifiedSkills: Array.isArray(data.verifiedSkills) ? data.verifiedSkills : [],
          softSkills: Array.isArray(data.softSkills) ? data.softSkills : (prevProfile ? prevProfile.softSkills : []),
          activeProjects: Array.isArray(data.activeProjects) ? data.activeProjects : [],
          workflows: Array.isArray(data.workflows) ? data.workflows : [],
          premiumProfile: prevProfile?.premiumProfile || {
            tier: "free",
            analytics: {
              profileViews: 0,
              clientClicks: 0,
            },
          },
        };

        // --- SMART PORTFOLIO FETCHING ---
        let portfolioItems: PortfolioItem[] = [];
        
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
            if (Array.isArray(pData.portfolio_projects) && pData.portfolio_projects.length > 0) {
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
            }

            const themeSettings = pData.theme_settings && typeof pData.theme_settings === "object"
              ? pData.theme_settings
              : {};
            const premiumProfile = themeSettings.premiumProfile && typeof themeSettings.premiumProfile === "object"
              ? themeSettings.premiumProfile
              : {};

            normalizedData.bio = pData.about_me || normalizedData.bio;
            normalizedData.premiumProfile = {
              tier: premiumProfile.tier === "pro" ? "pro" : "free",
              verifiedBadge: premiumProfile.verifiedBadge ?? premiumProfile.tier === "pro",
              advancedPortfolio: premiumProfile.advancedPortfolio ?? premiumProfile.tier === "pro",
              featuredPlacement: premiumProfile.featuredPlacement ?? false,
              analyticsEnabled: premiumProfile.analyticsEnabled ?? false,
              customDomain: pData.custom_domain || premiumProfile.customDomain || "",
              videoIntroUrl: premiumProfile.videoIntroUrl || "",
              introHeadline: premiumProfile.introHeadline || pData.tagline || "",
              analytics: {
                profileViews: Number(premiumProfile.analytics?.profileViews || 0),
                clientClicks: Number(premiumProfile.analytics?.clientClicks || 0),
              },
            };
          } else {
            if (pErr) console.warn("Note: Portfolios table might be missing or empty, falling back:", pErr.message);
            // 2. Fallback to old portfolio_items table if new one is empty or errors
            const { data: oldData } = await supabase
              .from('portfolio_items')
              .select('*')
              .eq('profile_id', userId);
            
            if (oldData && oldData.length > 0) {
              portfolioItems = oldData;
            }
          }
        } catch (pFetchErr) {
          console.error("New portfolio fetch error, falling back:", pFetchErr);
          // 3. Last resort fallback
          const { data: lastResort } = await supabase
            .from('portfolio_items')
            .select('*')
            .eq('profile_id', userId);
          portfolioItems = lastResort || [];
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
        const role = userAuth?.user_metadata?.role || "freelancer";
        const initialData: UserProfile = {
          id: userId,
          name: userAuth?.user_metadata?.full_name || userAuth?.email?.split('@')[0] || "User",
          role: role as any,
          category: "Developer" as const,
          skills: [],
          hourlyRate: "$0",
          bio: "",
          premiumProfile: {
            tier: "free",
            analytics: {
              profileViews: 0,
              clientClicks: 0,
            },
          },
        };
        const { error: insertError } = await supabase.from('profiles').insert([initialData]);
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
        else if (role === 'admin') setView('admin');
        else setView('freelancer');
      }
    } catch (err: any) {
      if (err.code !== 'PGRST205') {
        console.error("Error fetching profile:", err);
      }
    }
  };

  const handleProfileSave = async (updatedProfile: UserProfile) => {
    if (!user) return;
    setIsSaving(true);
    try {
      // List of columns that definitely exist in the profiles table base on supabase_schema.sql
      const dbColumns = [
        'id', 'name', 'role', 'category', 'skills', 'hourlyRate', 'bio', 
        'avatar_url', 'companyName', 'verifiedSkills', 'softSkills', 
        'activeProjects', 'squad', 'aiInsights', 'ranking', 'status', 
        'verification_documents', 'wellness', 'updated_at', 'username', 
        'referring_freelancer_id', 'workflows'
      ];

      // Create a clean object with only database-compatible fields
      const profileToSave: any = {};

      // Only copy properties that are in our dbColumns list
      Object.keys(updatedProfile).forEach(key => {
        if (dbColumns.includes(key) && (updatedProfile as any)[key] !== undefined) {
          profileToSave[key] = (updatedProfile as any)[key];
        }
      });
      
      // Always add updated_at
      profileToSave.updated_at = new Date().toISOString();

      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          ...profileToSave,
        });

      if (error) {
        // If error is about missing workflows column, try one more time without it
        if (error.message?.includes("'workflows' column") || error.code === 'PGRST204') {
          console.warn("Retrying profile save without workflows column...");
          const { workflows, ...profileWithoutWorkflows } = profileToSave;
          const { error: retryError } = await supabase
            .from('profiles')
            .upsert({
              id: user.id,
              ...profileWithoutWorkflows,
            });
          if (retryError) throw retryError;
        } else {
          throw error;
        }
      }

      if (updatedProfile.role === "freelancer") {
        const premiumProfile = updatedProfile.premiumProfile || {
          tier: "free",
          analytics: {
            profileViews: 0,
            clientClicks: 0,
          },
        };

        const existingPortfolio = await supabase
          .from("portfolios")
          .select("id, theme_settings")
          .eq("profile_id", user.id)
          .maybeSingle();

        if (existingPortfolio.error && existingPortfolio.error.code !== "PGRST116") {
          throw existingPortfolio.error;
        }

        const currentThemeSettings =
          existingPortfolio.data?.theme_settings && typeof existingPortfolio.data.theme_settings === "object"
            ? existingPortfolio.data.theme_settings
            : { aesthetic: "professional", primaryColor: "#4f46e5" };

        const portfolioPayload = {
          profile_id: user.id,
          about_me: updatedProfile.bio,
          tagline: premiumProfile.introHeadline || null,
          custom_domain: premiumProfile.tier === "pro" ? premiumProfile.customDomain || null : null,
          theme_settings: {
            ...currentThemeSettings,
            aesthetic: currentThemeSettings.aesthetic || "professional",
            primaryColor: currentThemeSettings.primaryColor || "#4f46e5",
            premiumProfile: {
              tier: premiumProfile.tier,
              verifiedBadge: premiumProfile.tier === "pro" ? premiumProfile.verifiedBadge !== false : false,
              advancedPortfolio: premiumProfile.tier === "pro" ? premiumProfile.advancedPortfolio !== false : false,
              featuredPlacement: premiumProfile.tier === "pro" ? !!premiumProfile.featuredPlacement : false,
              analyticsEnabled: premiumProfile.tier === "pro" ? !!premiumProfile.analyticsEnabled : false,
              customDomain: premiumProfile.tier === "pro" ? premiumProfile.customDomain || "" : "",
              videoIntroUrl: premiumProfile.tier === "pro" ? premiumProfile.videoIntroUrl || "" : "",
              introHeadline: premiumProfile.introHeadline || "",
              analytics: {
                profileViews: Number(premiumProfile.analytics?.profileViews || 0),
                clientClicks: Number(premiumProfile.analytics?.clientClicks || 0),
              },
            },
          },
          updated_at: new Date().toISOString(),
        };

        if (existingPortfolio.data?.id) {
          const { error: portfolioUpdateError } = await supabase
            .from("portfolios")
            .update(portfolioPayload)
            .eq("id", existingPortfolio.data.id);
          if (portfolioUpdateError) {
            throw portfolioUpdateError;
          }
        } else {
          const { error: portfolioInsertError } = await supabase
            .from("portfolios")
            .insert([portfolioPayload]);
          if (portfolioInsertError) {
            throw portfolioInsertError;
          }
        }
      }
      
      setProfile(updatedProfile);
      if (updatedProfile.role === 'employer') {
        setView('client');
      } else if (updatedProfile.role === 'admin') {
        setView('admin');
      } else {
        setView('freelancer');
      }
      setToastMsg("Profile saved successfully to database!");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    } catch (err: any) {
      console.error("Error saving profile:", err);
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
        .order('createdAt', { ascending: false });

      if (error) {
        if (error.message.includes("relation \"jobs\" does not exist") || error.code === 'PGRST205' || error.message.includes("Could not find the table")) {
          setDbError(true);
          setMissingTables(prev => [...new Set([...prev, "jobs"])]);
          console.warn("Table 'jobs' not found. Please run the SQL setup script.");
        } else if (error.code !== 'PGRST116') {
          console.error("Error fetching jobs:", error);
        }
        return;
      }

      if (data && data.length > 0) {
        const formattedJobs = data.map((job: any) => ({
          ...job,
          energyRequirement: job.energy_requirement || "Balanced",
          paymentMethod: job.paymentMethod || "Flat-Rate",
          jobType: job.jobType || "Contract"
        }));
        setJobs(formattedJobs);
      } else {
        setJobs([]);
      }
    } catch (err: any) {
      if (err.code !== 'PGRST205') {
        console.error("Error fetching jobs:", err);
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
        console.error("Error fetching employer jobs:", error);
        return;
      }

      if (data) {
        const formattedJobs = data.map((job: any) => ({
          ...job,
          applicantCount: job.applications?.[0]?.count || 0,
          energyRequirement: job.energy_requirement || "Balanced",
          paymentMethod: job.paymentMethod || "Flat-Rate",
          jobType: job.jobType || "Contract"
        }));
        setemployerJobs(formattedJobs);
      }
    } catch (err) {
      console.error("Unexpected error fetching employer jobs:", err);
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
        selectString = 'id, job_id, freelancer_id, status, created_at, profiles(*)';
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
            .select('id, job_id, freelancer_id, status, created_at, profiles(*)')
            .eq('job_id', jobId)
            .order('created_at', { ascending: false });
          
          if (fallbackError) {
            // If even profiles join fails, try the bare minimum without join
            const { data: bareData, error: bareError } = await supabase
              .from('applications')
              .select('id, job_id, freelancer_id, status, created_at')
              .eq('job_id', jobId)
              .order('created_at', { ascending: false });
            
            if (bareError) throw bareError;
            setSelectedJobApplicants(bareData || []);
          } else {
            setSelectedJobApplicants(fallbackData || []);
          }
        } else {
          throw error;
        }
      } else {
        setSelectedJobApplicants(data || []);
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

  const handleApply = (jobId: string) => {
    if (!user) {
      setToastMsg("Please login to apply for jobs.");
      setShowToast(true);
      return;
    }
    
    setSelectedJobIdForApply(jobId);
    setShowApplyModal(true);
  };

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
      handleApply(selectedJob.id);
    }

    const url = new URL(window.location.href);
    url.searchParams.delete("apply");
    window.history.replaceState({}, document.title, url.toString());
    setPendingApplyJobId(null);
  }, [pendingApplyJobId, jobs, profile.role]);

  const submitApplication = async () => {
    if (!user || !selectedJobIdForApply) return;
    
    if (!applyData.resumeUrl || !applyData.portfolioUrl) {
      setToastMsg("Please provide both Resume and Portfolio links to proceed.");
      setShowToast(true);
      return;
    }

    try {
      setIsSaving(true);
      const insertData: any = { 
        job_id: selectedJobIdForApply,
        freelancer_id: user.id,
        status: 'pending'
      };

      // Conditionally add columns based on whether we suspect they are missing
      if (!missingColumns.includes('seeker_id')) insertData.seeker_id = user.id;
      if (!missingColumns.includes('resume_url')) insertData.resume_url = applyData.resumeUrl;
      if (!missingColumns.includes('portfolio_url')) insertData.portfolio_url = applyData.portfolioUrl;
      if (!missingColumns.includes('cover_letter')) insertData.cover_letter = applyData.coverLetter;

      // Only add interview_url if it's provided and not known to be missing
      if (applyData.interviewUrl && !missingColumns.includes('interview_url')) {
        insertData.interview_url = applyData.interviewUrl;
      }

      const { error } = await supabase
        .from('applications')
        .insert([insertData]);

      if (error) {
        if (error.code === '23505') {
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
            job_id: selectedJobIdForApply,
            freelancer_id: user.id,
            status: 'pending'
          };
          
          // Add seeker_id only if not the one causing issues
          if (!error.message?.includes('seeker_id')) minimalData.seeker_id = user.id;

          // Only add cover_letter if provided and not causing issues
          if (applyData.coverLetter && !error.message?.includes('cover_letter')) {
            minimalData.cover_letter = applyData.coverLetter;
          }

          const { error: retryError } = await supabase
            .from('applications')
            .insert([minimalData]);
          
          if (retryError) throw retryError;
          
          setAppliedJobs(prev => ({ ...prev, [selectedJobIdForApply]: 'pending' }));
          setToastMsg("Application submitted! (Note: Some advanced fields were skipped because your database schema is not up-to-date)");
          setShowApplyModal(false);
          setApplyData({ resumeUrl: "", portfolioUrl: "", interviewUrl: "", coverLetter: "" });
        } else {
          throw error;
        }
      } else {
        setAppliedJobs(prev => ({ ...prev, [selectedJobIdForApply]: 'pending' }));
        setToastMsg("Application submitted! employer will review your credentials.");
        setShowApplyModal(false);
        setApplyData({ resumeUrl: "", portfolioUrl: "", interviewUrl: "", coverLetter: "" });
      }
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    } catch (err: any) {
      console.error("Error applying for job:", err);
    } finally {
      setIsSaving(false);
    }
  };

  const approveApplication = async (applicationId: string, freelancerId: string, jobId: string, jobTitle: string, budget: number) => {
    if (!user) return;
    try {
      setIsSaving(true);
      
      // 1. Update application status
      const { error: appError } = await supabase
        .from('applications')
        .update({ status: 'hired' })
        .eq('id', applicationId);
      
      if (appError) throw appError;

      // 2. Create Escrow entry
      const { error: escrowError } = await supabase
        .from('escrows')
        .insert([{
          job_id: jobId,
          employer_id: user.id,
          freelancer_id: freelancerId,
          amount: budget,
          status: 'funded',
          description: `Budget for ${jobTitle}`
        }]);
      
      if (escrowError) throw escrowError;

      // 3. Send Notification to freelancer
      const { error: notifError } = await supabase
        .from('notifications')
        .insert([{
          user_id: freelancerId,
          title: 'Project Approved!',
          message: `Congratulations! You have been approved for the project: ${jobTitle}. Budget is now in escrow.`,
          type: 'success',
          link: '/dashboard'
        }]);
      
      if (notifError) throw notifError;

      setToastMsg("freelancer approved and budget funded in escrow!");
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

  const fetchFreelancers = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select(`
          *,
          portfolio_items(*)
        `)
        .eq('role', 'freelancer')
        .order('ranking', { ascending: true })
        .limit(10);

      if (error) {
        console.error("Error fetching freelancers:", error);
        return;
      }

      if (data) {
        const formatted = data.map((f: any) => ({
          ...f,
          portfolio: f.portfolio_items || []
        }));
        setFreelancers(formatted);
      }
    } catch (err) {
      console.error("Unexpected error fetching freelancers:", err);
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

  const fetchUserEscrows = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('escrows')
        .select('*, jobs(*)')
        .eq('freelancer_id', userId);
      
      if (!error && data) {
        setUserEscrows(data);
      }
    } catch (err) {
      console.error("Error fetching user escrows:", err);
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

  const filteredFreelancers = useMemo(() => {
    return freelancers.filter(f => 
      f.name.toLowerCase().includes(debouncedFreelancerSearchTerm.toLowerCase()) ||
      f.category.toLowerCase().includes(debouncedFreelancerSearchTerm.toLowerCase()) ||
      f.skills.some(s => s.toLowerCase().includes(debouncedFreelancerSearchTerm.toLowerCase()))
    );
  }, [freelancers, debouncedFreelancerSearchTerm]);

  useEffect(() => {
    async function checkUser() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        setLoading(false);
      } else {
        setUser(session.user);
        
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
        await fetchFollows(session.user.id);
        await fetchUserEscrows(session.user.id);
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

        // Subscribe to escrows
        const escrowChannel = supabase
          .channel('escrow-changes')
          .on('postgres_changes', { 
            event: '*', 
            schema: 'public', 
            table: 'escrows' 
          }, () => {
            fetchUserEscrows(session.user.id);
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
              return {
                ...prev,
                ...newData,
                skills: Array.isArray(newData.skills) ? newData.skills : (prev.skills || []),
                verifiedSkills: Array.isArray(newData.verifiedSkills) ? newData.verifiedSkills : (prev.verifiedSkills || []),
                softSkills: Array.isArray(newData.softSkills) ? newData.softSkills : (prev.softSkills || []),
                activeProjects: Array.isArray(newData.activeProjects) ? newData.activeProjects : (prev.activeProjects || []),
                workflows: Array.isArray(newData.workflows) ? newData.workflows : (prev.workflows || []),
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
        setLoading(false);
      } else {
        setUser(session.user);
        fetchProfile(session.user.id, session.user);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, [router]);

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

  const ensurePortfolioExists = async (userId: string) => {
    // 1. Check if portfolio exists
    const { data, error } = await supabase
      .from('portfolios')
      .select('id')
      .eq('profile_id', userId)
      .maybeSingle();
    
    if (data) return data.id;
    
    // 2. Create one if it doesn't exist
    const { data: newPortfolio, error: createError } = await supabase
      .from('portfolios')
      .insert([{ 
        profile_id: userId,
        theme_settings: { aesthetic: "professional", primaryColor: "#4f46e5" }
      }])
      .select('id')
      .single();
    
    if (createError) throw createError;
    return newPortfolio.id;
  };

  const reloadWholePage = () => {
    if (typeof window !== "undefined") {
      window.location.reload();
    }
  };

  const addPortfolioItem = async (item: Partial<PortfolioItem>) => {
    if (!user) return;
    try {
      // 1. Ensure a professional portfolio record exists
      const portfolioId = await ensurePortfolioExists(user.id);

      // 2. Add to the new portfolio_projects table
      const { data, error } = await supabase
        .from('portfolio_projects')
        .insert([{
          portfolio_id: portfolioId,
          title: item.title,
          description: item.description,
          project_url: item.project_url,
          technologies: item.technologies,
          created_at: new Date().toISOString(),
        }])
        .select()
        .single();

      if (error) {
        // Fallback to old table if new table is missing
        const { data: oldData, error: oldError } = await supabase
          .from('portfolio_items')
          .insert([{
            profile_id: user.id,
            title: item.title,
            description: item.description,
            project_url: item.project_url,
            technologies: item.technologies,
            created_at: new Date().toISOString(),
          }])
          .select()
          .single();
        
        if (oldError) throw oldError;
        
        if (oldData) {
          setProfile(prev => ({
            ...prev,
            portfolio: [...(prev.portfolio || []), oldData]
          }));
        }
      } else if (data) {
        setProfile(prev => ({
          ...prev,
          portfolio: [...(prev.portfolio || []), { ...data, profile_id: user.id }]
        }));
      }

      setToastMsg("Portfolio item added!");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
      setTimeout(reloadWholePage, 250);
    } catch (err: any) {
      console.error("Error adding portfolio item:", err);
      setToastMsg(`Error: ${err.message}`);
      setShowToast(true);
    }
  };

  const updatePortfolioItem = async (item: PortfolioItem) => {
    try {
      // Try updating in portfolio_projects first
      const { data: projectRows, error } = await supabase
        .from('portfolio_projects')
        .update({
          title: item.title,
          description: item.description,
          project_url: item.project_url,
          technologies: item.technologies,
        })
        .eq('id', item.id)
        .select('id');

      if (error || !projectRows || projectRows.length === 0) {
        // Fallback to old table
        const { data: oldRows, error: oldError } = await supabase
          .from('portfolio_items')
          .update({
            title: item.title,
            description: item.description,
            project_url: item.project_url,
            technologies: item.technologies,
          })
          .eq('id', item.id)
          .select('id');
        
        if (oldError) throw oldError;
        if (!oldRows || oldRows.length === 0) {
          throw new Error("Portfolio item was not found for update.");
        }
      }

      setProfile(prev => ({
        ...prev,
        portfolio: (prev.portfolio || []).map(i => i.id === item.id ? item : i)
      }));
      setToastMsg("Portfolio item updated!");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
      setTimeout(reloadWholePage, 250);
    } catch (err: any) {
      console.error("Error updating portfolio item:", err);
      setToastMsg(`Error: ${err.message}`);
      setShowToast(true);
    }
  };

  const removePortfolioItem = async (id: string) => {
    try {
      // Try deleting from portfolio_projects
      const { data: projectRows, error } = await supabase
        .from('portfolio_projects')
        .delete()
        .eq('id', id)
        .select('id');

      if (error || !projectRows || projectRows.length === 0) {
        // Fallback to old table
        const { data: oldRows, error: oldError } = await supabase
          .from('portfolio_items')
          .delete()
          .eq('id', id)
          .select('id');
        
        if (oldError) throw oldError;
        if (!oldRows || oldRows.length === 0) {
          throw new Error("Portfolio item was not found for delete.");
        }
      }

      setProfile(prev => ({
        ...prev,
        portfolio: (prev.portfolio || []).filter(item => item.id !== id)
      }));
      setToastMsg("Portfolio item removed.");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
      setTimeout(reloadWholePage, 250);
    } catch (err: any) {
      console.error("Error removing portfolio item:", err);
      setToastMsg(`Error: ${err.message}`);
      setShowToast(true);
    }
  };

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
                onClick={() => setView("admin")}
                className="bg-white text-indigo-600 px-3 py-1 rounded-full text-[10px] font-black hover:bg-indigo-50 transition-all cursor-pointer uppercase tracking-tighter"
              >
                Setup Database
              </button>
            </div>
          </div>
        )}
        <div className="max-w-full px-4 sm:px-10">
          <div className="flex justify-between items-center h-16 py-4">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <img 
                  src="/tarawork-removebg-preview.png" 
                  alt="Tara Logo" 
                  className="h-10 w-auto object-contain"
                />
                <div className="hidden sm:flex items-center gap-1.5 px-2 py-1 bg-emerald-50 text-emerald-600 rounded-lg text-[9px] font-black border border-emerald-100 uppercase tracking-tighter cursor-help group relative">
                  <ShieldCheck className="w-3 h-3" />
                  SSL Secure
                  <div className="absolute top-full left-0 mt-2 w-48 p-2 bg-slate-900 text-white text-[8px] rounded-2xl shadow-xl opacity-0 group-hover:opacity-100 transition-opacity z-50 pointer-events-none font-medium leading-relaxed border border-white/10">
                    <p className="font-black text-indigo-400 mb-1">Status: Active</p>
                    Tara verifies SSL status internally. Browser "Not Secure" warnings may occur during ACME cert challenges.
                  </div>
                </div>
              </div>
              
              <div className="hidden lg:flex items-center gap-6">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">
                  {view === 'admin' ? 'Admin Portal' : view === 'client' ? 'Client Dashboard' : 'Freelancer Workspace'}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <button 
                className="lg:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
              <button 
                onClick={async () => {
                  await supabase.auth.signOut();
                  router.push("/auth");
                }}
                className="hidden sm:flex items-center gap-2 px-4 py-2 bg-slate-50 text-slate-600 rounded-lg text-sm font-semibold hover:bg-slate-100 transition-all"
              >
                Logout
              </button>
              <div className="relative">
                <button 
                  onClick={() => setShowNotifications(!showNotifications)}
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
              <button 
                onClick={() => alert("Settings module coming soon! You can update your profile below for now.")}
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-full transition-colors"
              >
                <Settings className="w-5 h-5" />
              </button>
              <div 
                onClick={() => profileRef.current?.scrollIntoView({ behavior: 'smooth' })}
                className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 border-2 border-white shadow-sm cursor-pointer hover:ring-2 hover:ring-indigo-100 transition-all overflow-hidden"
              >
                {profile.avatar_url && (
                  <img src={profile.avatar_url} alt="Profile" className="w-full h-full object-cover" />
                )}
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
                  onClick={() => { setView('freelancer'); setIsMenuOpen(false); }}
                  className={`flex items-center gap-3 p-3 rounded-xl font-bold text-sm ${view === 'freelancer' ? 'bg-indigo-50 text-indigo-600' : 'text-slate-600 hover:bg-slate-50'}`}
                >
                  <Briefcase className="w-5 h-5" />
                  Freelancer Workspace
                </button>
                <button 
                  onClick={() => { setView('client'); setIsMenuOpen(false); }}
                  className={`flex items-center gap-3 p-3 rounded-xl font-bold text-sm ${view === 'client' ? 'bg-indigo-50 text-indigo-600' : 'text-slate-600 hover:bg-slate-50'}`}
                >
                  <Users className="w-5 h-5" />
                  Employer Dashboard
                </button>
                {profile.role === 'admin' && (
                  <button 
                    onClick={() => { setView('admin'); setIsMenuOpen(false); }}
                    className={`flex items-center gap-3 p-3 rounded-xl font-bold text-sm ${view === 'admin' ? 'bg-indigo-50 text-indigo-600' : 'text-slate-600 hover:bg-slate-50'}`}
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

      <main className="max-w-full px-4 sm:px-10 py-8">
        {view === "freelancer" ? (
          <div className="space-y-8">
            {/* Freelancer Tab Navigation */}
            <div className="flex items-center gap-2 bg-white p-1.5 rounded-2xl border border-slate-200 shadow-sm overflow-x-auto sticky top-20 z-40">
              {[
                { id: "overview", label: "Dashboard", icon: LayoutDashboard },
                { id: "jobs", label: "Find Jobs", icon: Briefcase },
                { id: "workspace", label: "Workspace", icon: Zap },
                { id: "career", label: "Growth", icon: Award },
                { id: "profile", label: "My Profile", icon: User },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setFreelancerTab(tab.id as any)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${
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
                  {/* Hero / Welcome Section */}
            <div className="relative overflow-hidden rounded-2xl bg-slate-900 p-8 md:p-12 text-white shadow-xl">
              <div className="relative z-10 max-w-2xl">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/10 text-slate-300 text-[10px] font-bold mb-6 uppercase tracking-wider">
                  <Award className="w-3.5 h-3.5" />
                  Top Rated Freelancer
                </div>
                <h2 className="text-3xl md:text-4xl font-bold mb-4 leading-tight tracking-tight">
                  Welcome back, <span className="text-indigo-400">{(profile.name || "User").split(' ')[0]}!</span>
                </h2>
                <p className="text-slate-300 text-lg mb-8 opacity-90 font-medium">
                  {profile.category === "Developer" && (
                    <>We found <span className="font-bold text-white">{jobs.filter(j => j.category === "Developer").length} development opportunities</span> for you today.</>
                  )}
                  {profile.category === "Virtual Assistant" && (
                    <>There are <span className="font-bold text-white">{jobs.filter(j => j.category === "Virtual Assistant").length} assistant roles</span> available right now.</>
                  )}
                  {profile.category === "Designer" && (
                    <>Explore <span className="font-bold text-white">{jobs.filter(j => j.category === "Designer").length} creative projects</span> in your category.</>
                  )}
                  {profile.category === "Writer" && (
                    <>We found <span className="font-bold text-white">{jobs.filter(j => j.category === "Writer").length} writing gigs</span> tailored to your skills.</>
                  )}
                  {profile.category === "Marketing Specialist" && (
                    <>Discover <span className="font-bold text-white">{jobs.filter(j => j.category === "Marketing Specialist").length} marketing campaigns</span> you can lead.</>
                  )}
                  {!["Developer","Virtual Assistant","Designer","Writer","Marketing Specialist"].includes(profile.category as any) && (
                    <>We found <span className="font-bold text-white">{jobs.filter(j => j.category === profile.category).length} opportunities</span> in your category.</>
                  )}
                </p>
                <div className="flex flex-wrap gap-4">
                  <button 
                    onClick={() => jobsRef.current?.scrollIntoView({ behavior: 'smooth' })}
                    className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-600/20 cursor-pointer active:scale-95"
                  >
                    Browse Jobs
                  </button>
                  <button 
                    onClick={() => profileRef.current?.scrollIntoView({ behavior: 'smooth' })}
                    className="bg-white/10 text-white border border-white/10 px-6 py-3 rounded-lg font-bold hover:bg-white/20 transition-all cursor-pointer"
                  >
                    Update Profile
                  </button>
                </div>
              </div>
              
              {/* Decorative elements - Subtler */}
              <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-[120px]"></div>
              <div className="hidden lg:block absolute right-12 bottom-12 w-48 h-48 opacity-5 pointer-events-none">
                <Zap className="w-full h-full text-white" />
              </div>
            </div>

            {/* --- NEW PROFESSIONAL PORTFOLIO LINK CARD --- */}
            {profile.role === 'freelancer' && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white p-5 rounded-2xl border-2 border-indigo-50/50 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-5 relative overflow-hidden group"
              >
                <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-indigo-50 rounded-full blur-2xl group-hover:bg-indigo-100 transition-all duration-500"></div>
                <div className="flex items-center gap-4 relative">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-200">
                    <Layout className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-base font-black text-slate-900 tracking-tight leading-none mb-1">Your Professional Portfolio is Live! 🚀</h4>
                    <p className="text-[11px] text-slate-500 font-bold uppercase tracking-widest opacity-70">Share this link for frictionless hiring</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 w-full sm:w-auto relative">
                  <div className="flex-1 sm:flex-none px-4 py-2.5 bg-slate-50 rounded-xl border border-slate-100 font-mono text-xs text-indigo-700 font-black truncate min-w-[150px] shadow-inner">
                    {profile.username || (profile.id ? profile.id.substring(0, 8) : 'user')}
                  </div>
                  <button 
                    onClick={() => {
                      const url = `${window.location.origin}/${profile.username || profile.id || 'user'}`;
                      navigator.clipboard.writeText(url);
                      setToastMsg("Professional portfolio URL copied! 📋");
                      setShowToast(true);
                      setTimeout(() => setShowToast(false), 2000);
                    }}
                    className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white text-xs font-black rounded-xl hover:bg-indigo-700 transition-all shadow-md shadow-indigo-100 active:scale-95 whitespace-nowrap"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    Copy Professional URL
                  </button>
                  <Link 
                    href={`/${profile.username || profile.id || 'user'}`}
                    target="_blank"
                    className="flex items-center justify-center p-2.5 bg-slate-100 text-slate-600 rounded-xl hover:bg-slate-200 transition-all"
                  >
                    <ExternalLink className="w-5 h-5" />
                  </Link>
                </div>
              </motion.div>
            )}

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="md:col-span-2 lg:col-span-3 space-y-6">
                      <div className="bg-indigo-600 rounded-2xl p-8 text-white relative overflow-hidden shadow-xl shadow-indigo-200">
                        <div className="relative z-10">
                          <h3 className="text-2xl font-black mb-2 tracking-tight">Focus on your workspace</h3>
                          <p className="text-indigo-100 font-medium mb-6 opacity-90 max-w-md">You have {userEscrows.length} approved projects with funds in escrow.</p>
                          <div className="flex flex-wrap gap-3">
                            <button 
                              onClick={() => setFreelancerTab("workspace")}
                              className="bg-white text-indigo-600 px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-indigo-50 transition-all flex items-center gap-2"
                            >
                              Go to Workspace
                              <ArrowUpRight className="w-4 h-4" />
                            </button>
                            {userEscrows.length > 0 && (
                              <div className="bg-indigo-500/30 px-4 py-2 rounded-xl border border-white/10 flex items-center gap-2">
                                <DollarSign className="w-4 h-4 text-emerald-400" />
                                <span className="text-xs font-bold text-white">
                                  ${userEscrows.reduce((sum, e) => sum + Number(e.amount), 0).toLocaleString()} Total Escrow
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                        <Zap className="absolute -right-8 -bottom-8 w-48 h-48 text-white/10 rotate-12" />
                      </div>

                      {userEscrows.length > 0 && (
                        <div className="bg-white rounded-2xl p-8 border border-slate-100 shadow-sm">
                          <div className="flex justify-between items-center mb-6">
                            <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight flex items-center gap-2">
                              <ShieldCheck className="w-5 h-5 text-indigo-600" />
                              Approved Projects & Escrow
                            </h3>
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Budget Visibility</span>
                          </div>
                          <div className="space-y-4">
                            {userEscrows.map((escrow) => (
                              <div key={escrow.id} className="p-5 bg-slate-50 rounded-2xl border border-slate-100 flex flex-wrap justify-between items-center gap-4 hover:bg-white hover:border-indigo-100 hover:shadow-xl hover:shadow-indigo-500/5 transition-all">
                                <div className="flex items-center gap-4">
                                  <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center border border-slate-100 shadow-sm">
                                    <Briefcase className="w-6 h-6 text-indigo-500" />
                                  </div>
                                  <div>
                                    <h4 className="font-bold text-slate-900">{escrow.jobs?.title || "Project Title"}</h4>
                                    <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest flex items-center gap-1 mt-1">
                                      <Lock className="w-3 h-3" />
                                      Funds in Escrow: ${Number(escrow.amount).toLocaleString()}
                                    </p>
                                  </div>
                                </div>
                                <div className="flex items-center gap-3">
                                  <span className="px-3 py-1 bg-white border border-slate-200 rounded-lg text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                    Status: {escrow.status}
                                  </span>
                                  <button className="px-4 py-2 bg-slate-900 text-white text-[10px] font-black rounded-lg uppercase tracking-widest hover:bg-black transition-all">
                                    Submit Work
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* --- PORTFOLIO INQUIRIES SECTION --- */}
                      <div className="bg-white rounded-2xl p-8 border border-slate-100 shadow-sm">
                        <div className="flex justify-between items-center mb-6">
                          <div className="space-y-1">
                            <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight flex items-center gap-2">
                              <Mail className="w-5 h-5 text-indigo-600" />
                              Portfolio Inquiries
                            </h3>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Direct messages from your public portfolio</p>
                          </div>
                          <span className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-[10px] font-black uppercase tracking-widest">
                            {portfolioInquiries.length} Messages
                          </span>
                        </div>
                        
                        {portfolioInquiries.length === 0 ? (
                          <div className="py-12 flex flex-col items-center justify-center text-center space-y-4 border-2 border-dashed border-slate-50 rounded-2xl">
                            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-slate-300">
                              <Mail className="w-8 h-8" />
                            </div>
                            <div className="space-y-1">
                              <p className="font-bold text-slate-900">No inquiries yet</p>
                              <p className="text-xs text-slate-500 max-w-[200px]">Share your professional portfolio URL to start receiving inquiries from employers.</p>
                            </div>
                          </div>
                        ) : (
                          <div className="space-y-4">
                            {portfolioInquiries.slice(0, 5).map((inquiry) => {
                              const senderName =
                                typeof inquiry?.sender_name === "string" && inquiry.sender_name.trim().length > 0
                                  ? inquiry.sender_name
                                  : "Unknown Sender";
                              const senderEmail =
                                typeof inquiry?.sender_email === "string" ? inquiry.sender_email : "";
                              const senderInitial = senderName.slice(0, 1).toUpperCase() || "U";
                              const inquiryDate = inquiry?.created_at ? new Date(inquiry.created_at) : null;
                              const inquiryDateLabel =
                                inquiryDate && !Number.isNaN(inquiryDate.getTime())
                                  ? inquiryDate.toLocaleDateString()
                                  : "Unknown date";

                              return (
                              <div key={inquiry.id} className="p-5 bg-slate-50 rounded-2xl border border-slate-100 hover:bg-white hover:border-indigo-100 hover:shadow-xl transition-all group">
                                <div className="flex justify-between items-start mb-3">
                                  <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-bold text-sm">
                                      {senderInitial}
                                    </div>
                                    <div>
                                      <h4 className="font-bold text-slate-900 leading-none mb-1">{senderName}</h4>
                                      <p className="text-[10px] font-medium text-slate-500">{senderEmail || "No email provided"}</p>
                                    </div>
                                  </div>
                                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                                    {inquiryDateLabel}
                                  </span>
                                </div>
                                <div className="bg-white p-4 rounded-xl border border-slate-100 text-sm text-slate-600 italic leading-relaxed relative">
                                  <span className="absolute -top-2 -left-2 text-2xl text-indigo-200 font-serif leading-none">"</span>
                                  {inquiry.message}
                                  <span className="absolute -bottom-4 -right-2 text-2xl text-indigo-200 font-serif leading-none">"</span>
                                </div>
                                <div className="mt-4 flex justify-end gap-2">
                                  <button 
                                    onClick={async () => {
                                      // Try to find if user exists by name/email approximation or just let them try mailto
                                      // Professional approach: link them to messages if we can find a user
                                      const { data: profileData } = await supabase
                                        .from('profiles')
                                        .select('id')
                                        .ilike('name', `%${senderName}%`)
                                        .limit(1)
                                        .maybeSingle();

                                      if (profileData) {
                                        router.push(`/messages?with=${profileData.id}`);
                                      } else {
                                        window.location.href = `mailto:${senderEmail}?subject=Reply to your TaraWork inquiry`;
                                      }
                                    }}
                                    className="px-4 py-2 bg-indigo-600 text-white text-[10px] font-black rounded-lg uppercase tracking-widest hover:bg-indigo-700 transition-all flex items-center gap-2 shadow-sm"
                                  >
                                    Reply to Inquiry
                                    <ArrowUpRight className="w-3 h-3" />
                                  </button>
                                  <a 
                                    href={`mailto:${senderEmail}`}
                                    className="px-4 py-2 bg-white text-slate-600 border border-slate-200 text-[10px] font-black rounded-lg uppercase tracking-widest hover:bg-slate-50 transition-all flex items-center gap-2"
                                  >
                                    Email Direct
                                    <Mail className="w-3 h-3" />
                                  </a>
                                </div>
                              </div>
                            )})}
                            {portfolioInquiries.length > 5 && (
                              <button className="w-full py-3 text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-indigo-600 transition-colors">
                                View all inquiries
                              </button>
                            )}
                          </div>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between">
                          <div>
                            <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center mb-4">
                              <TrendingUp className="w-5 h-5 text-emerald-600" />
                            </div>
                            <h4 className="font-bold text-slate-900">Career Insights</h4>
                            <p className="text-xs text-slate-500 mt-1">Check how your skills match the market demand.</p>
                          </div>
                          <button 
                            onClick={() => setFreelancerTab("career")}
                            className="text-xs font-bold text-indigo-600 hover:text-indigo-700 mt-4 flex items-center gap-1"
                          >
                            View Analysis <ChevronRight className="w-3 h-3" />
                          </button>
                        </div>
                        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between">
                          <div>
                            <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center mb-4">
                              <Briefcase className="w-5 h-5 text-amber-600" />
                            </div>
                            <h4 className="font-bold text-slate-900">Recommended Jobs</h4>
                            <p className="text-xs text-slate-500 mt-1">We found {jobs.length} new jobs that match your profile.</p>
                          </div>
                          <button 
                            onClick={() => setFreelancerTab("jobs")}
                            className="text-xs font-bold text-indigo-600 hover:text-indigo-700 mt-4 flex items-center gap-1"
                          >
                            Browse Jobs <ChevronRight className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-6">
                      <div className="bg-slate-900 rounded-2xl p-6 text-white shadow-xl">
                        <div className="flex items-center gap-3 mb-6">
                          <div className="w-10 h-10 rounded-full bg-indigo-500 flex items-center justify-center overflow-hidden border-2 border-white/10">
                            {profile.avatar_url ? <img src={profile.avatar_url} className="w-full h-full object-cover" /> : <User className="w-5 h-5" />}
                          </div>
                          <div>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Profile Score</p>
                            <p className="text-lg font-black">{profile.ranking ? `Top ${profile.ranking}%` : "Not Ranked"}</p>
                          </div>
                        </div>
                        <div className="space-y-4">
                          <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest text-slate-500">
                            <span>Completeness</span>
                            <span className="text-indigo-400">85%</span>
                          </div>
                          <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                            <div className="h-full bg-indigo-500 w-[85%] rounded-full shadow-sm" />
                          </div>
                          <button 
                            onClick={() => setFreelancerTab("profile")}
                            className="w-full py-2 bg-white/10 hover:bg-white/20 border border-white/10 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all"
                          >
                            Optimize Profile
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Trust & Safety Section for freelancer */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-emerald-50 border border-emerald-100 p-6 rounded-2xl flex gap-4">
                      <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center shrink-0">
                        <ShieldCheck className="w-6 h-6 text-emerald-600" />
                      </div>
                      <div>
                        <h4 className="font-bold text-emerald-900">Safe-Vault Protection</h4>
                        <p className="text-xs text-emerald-700 mt-1 leading-relaxed">Your payment is protected. Funds are kept in our secure vault before work begins.</p>
                      </div>
                    </div>
                    <div className="bg-indigo-50 border border-indigo-100 p-6 rounded-2xl flex gap-4">
                      <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center shrink-0">
                        <DollarSign className="w-6 h-6 text-indigo-600" />
                      </div>
                      <div>
                        <h4 className="font-bold text-indigo-900">Escrow Milestone</h4>
                        <p className="text-xs text-indigo-700 mt-1 leading-relaxed">We ensure that each milestone has corresponding funds reserved for you.</p>
                      </div>
                    </div>
                    <div className="bg-slate-900 p-6 rounded-2xl flex gap-4 text-white">
                      <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center shrink-0">
                        <Zap className="w-6 h-6 text-indigo-400" />
                      </div>
                      <div>
                        <h4 className="font-bold">24/7 Support</h4>
                        <p className="text-xs text-slate-400 mt-1 leading-relaxed">Have a dispute? Our admin team is ready to help resolve any issues.</p>
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
                  <div className="flex justify-between items-end mb-6">
                    <div>
                      <h2 className="text-2xl font-bold text-slate-900">Available Jobs</h2>
                      <p className="text-slate-500 mt-1">Browse opportunities that match your expertise.</p>
                    </div>
                  </div>
                  <JobFeed 
                    jobs={jobs} 
                    profile={profile} 
                    onApply={handleApply}
                    appliedJobs={appliedJobs}
                  />
                </motion.div>
              )}

              {freelancerTab === "workspace" && (
                <motion.div
                  key="workspace"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-8"
                >
                  <Workspace 
                    projects={profile.activeProjects || []} 
                    onUpdateProject={handleUpdateProject}
                    onCreateProject={handleCreateProject}
                    workflows={profile.workflows || []}
                    onUpdateWorkflows={handleUpdateWorkflows}
                  />
                  <TeamManager 
                    squad={profile.squad} 
                    onCreateSquad={handleCreateSquad}
                    onUpdateSquad={handleUpdateSquad}
                  />
                </motion.div>
              )}

              {freelancerTab === "career" && (
                <motion.div
                  key="career"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-8"
                >
                  <CareerPath profile={profile} allJobs={jobs} />
                  <div className="max-w-2xl">
                    <SkillAssessment 
                      verifiedSkills={profile.verifiedSkills || []} 
                      aiInsights={profile.aiInsights}
                    />
                  </div>
                </motion.div>
              )}

              {freelancerTab === "profile" && (
                <motion.div
                  key="profile"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="grid grid-cols-1 lg:grid-cols-12 gap-8"
                >
                  <div className="lg:col-span-8 space-y-6">
                    <ProfileForm 
                      initialProfile={profile} 
                      onUpdate={handleProfileSave} 
                      onAddPortfolio={addPortfolioItem}
                      onUpdatePortfolio={updatePortfolioItem}
                      onRemovePortfolio={removePortfolioItem}
                      isSaving={isSaving}
                    />
                  </div>
                  <div className="lg:col-span-4 space-y-6">
                    {profile.role === 'freelancer' && (
                      <div className={cn(
                        "p-6 rounded-[1.75rem] border shadow-sm relative overflow-hidden group transition-all",
                        profile.premiumProfile?.tier === "pro"
                          ? "bg-gradient-to-br from-slate-950 via-slate-900 to-amber-950 border-slate-800 shadow-2xl shadow-slate-900/20"
                          : "bg-white border-slate-200"
                      )}>
                        <div className={cn(
                          "absolute top-0 right-0 w-24 h-24 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2",
                          profile.premiumProfile?.tier === "pro" ? "bg-amber-400/20" : "bg-indigo-50"
                        )}></div>
                        <div className="relative">
                          <h3 className={cn(
                            "text-[10px] font-bold uppercase tracking-[0.2em] mb-4 flex items-center gap-2",
                            profile.premiumProfile?.tier === "pro" ? "text-slate-400" : "text-slate-400"
                          )}>
                            <Layout className={cn("w-4 h-4", profile.premiumProfile?.tier === "pro" ? "text-amber-300" : "text-indigo-600")} />
                            Public Portfolio
                          </h3>
                          <div className="space-y-4">
                            <div className={cn(
                              "p-3 rounded-xl font-mono text-[10px] break-all flex items-center justify-between border",
                              profile.premiumProfile?.tier === "pro"
                                ? "bg-white/5 border-white/10 text-white"
                                : "bg-slate-50 border-slate-100"
                            )}>
                              <div className="flex flex-col gap-1">
                                <span className={cn(profile.premiumProfile?.tier === "pro" ? "text-white" : "text-slate-600")}>
                                  {profile.premiumProfile?.tier === "pro" && profile.premiumProfile.customDomain
                                    ? profile.premiumProfile.customDomain
                                    : typeof window !== 'undefined'
                                      ? `${window.location.origin}/${profile.username || profile.id || 'user'}`
                                      : `tarawork.network/${profile.username || 'username'}`}
                                </span>
                                {!profile.username && (
                                  <span className="text-[9px] text-amber-600 font-medium">⚠️ No username set. Using ID as fallback.</span>
                                )}
                              </div>
                              {!profile.username && (
                                <span className="text-[9px] bg-amber-50 text-amber-600 px-1.5 py-0.5 rounded-lg font-bold border border-amber-100 shrink-0">SET USERNAME</span>
                              )}
                            </div>
                            
                            <div className={cn(
                              "p-4 rounded-xl border",
                              profile.premiumProfile?.tier === "pro"
                                ? "bg-white/5 border-white/10"
                                : "bg-indigo-50/50 border-indigo-100"
                            )}>
                              <h4 className={cn(
                                "text-[9px] font-bold uppercase mb-2",
                                profile.premiumProfile?.tier === "pro" ? "text-amber-300" : "text-indigo-700"
                              )}>Portfolio Status</h4>
                              <div className="flex items-center gap-2">
                                <div className={cn("w-2 h-2 rounded-full", profile.username ? "bg-emerald-500" : "bg-amber-500")}></div>
                                <span className={cn("text-[10px]", profile.premiumProfile?.tier === "pro" ? "text-slate-300" : "text-slate-600")}>
                                  {profile.username ? `URL Identifier: @${profile.username}` : "Using temporary ID link"}
                                </span>
                              </div>
                              <div className="mt-3 flex flex-wrap gap-2">
                                <span className={cn(
                                  "rounded-full px-2 py-1 text-[9px] font-black uppercase tracking-[0.2em]",
                                  profile.premiumProfile?.tier === "pro" ? "bg-slate-900 text-white" : "bg-white text-slate-500 border border-slate-200"
                                )}>
                                  {profile.premiumProfile?.tier === "pro" ? "Freelancer Pro" : "Free Profile"}
                                </span>
                                {profile.premiumProfile?.verifiedBadge && (
                                  <span className="rounded-full bg-emerald-50 px-2 py-1 text-[9px] font-black uppercase tracking-[0.2em] text-emerald-700">
                                    Verified Badge
                                  </span>
                                )}
                                {profile.premiumProfile?.analyticsEnabled && (
                                  <span className="rounded-full bg-indigo-50 px-2 py-1 text-[9px] font-black uppercase tracking-[0.2em] text-indigo-700">
                                    {profile.premiumProfile.analytics?.profileViews || 0} Views
                                  </span>
                                )}
                              </div>
                              {profile.premiumProfile?.tier === "pro" && (
                                <div className="mt-4 grid grid-cols-2 gap-3">
                                  <div className="rounded-2xl bg-white px-3 py-3 text-slate-900">
                                    <p className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400">Client Clicks</p>
                                    <p className="mt-1 text-lg font-black">{profile.premiumProfile.analytics?.clientClicks || 0}</p>
                                  </div>
                                  <div className="rounded-2xl bg-white/10 px-3 py-3 text-white border border-white/10">
                                    <p className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400">Conversion Tools</p>
                                    <p className="mt-1 text-sm font-black">{profile.premiumProfile.videoIntroUrl ? "Video Ready" : "Add Intro"}</p>
                                  </div>
                                </div>
                              )}
                            </div>
                            {profile.premiumProfile?.tier === "pro" && (
                              <div className="rounded-xl border border-amber-300/20 bg-amber-400/10 p-4">
                                <p className="text-[9px] font-black uppercase tracking-[0.2em] text-amber-300">Freelancer Pro Impact</p>
                                <h4 className="mt-2 text-base font-black text-white">
                                  {profile.premiumProfile.introHeadline || "Premium portfolio experience is now active."}
                                </h4>
                                <p className="mt-2 text-xs leading-relaxed text-slate-300">
                                  Clients will see a stronger hero section, premium badge treatment, analytics proof, and video intro prompts on your public page.
                                </p>
                              </div>
                            )}
                            <div className="flex gap-2">
                              <button 
                                onClick={() => {
                                  const url = profile.premiumProfile?.tier === "pro" && profile.premiumProfile.customDomain
                                    ? `https://${profile.premiumProfile.customDomain}`
                                    : `${window.location.origin}/${profile.username || profile.id || 'user'}`;
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
                                href={`/${profile.username || profile.id || 'user'}`}
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
                    )}

                    <div className="bg-slate-900 p-6 rounded-2xl border border-white/10 shadow-xl overflow-hidden relative group">
                      {/* Background decorative elements */}
                      <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-indigo-500/20 transition-all duration-500"></div>
                      
                      <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                        <Award className="w-4 h-4 text-indigo-400" />
                        Career Credentials
                      </h3>

                      <div className="space-y-6">
                        {/* Verified Technical Badges */}
                        {profile.verifiedSkills && profile.verifiedSkills.length > 0 && (
                          <div className="space-y-2">
                            <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Technical Mastery</span>
                            <div className="flex flex-wrap gap-2">
                              {profile.verifiedSkills.map((skill) => (
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

                    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                      <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                        <Shield className="w-4 h-4 text-indigo-600" />
                        Connected Accounts
                      </h3>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-100">
                          <div className="flex items-center gap-3">
                            <Mail className="w-4 h-4 text-red-500" />
                            <span className="text-xs font-bold text-slate-700">Google / Gmail</span>
                          </div>
                          <span className="text-[10px] font-bold text-emerald-600">Active</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ) : view === "client" ? (
          <div className="space-y-8">
            {/* Client Tab Navigation */}
            <div className="flex items-center gap-2 bg-white p-1.5 rounded-2xl border border-slate-200 shadow-sm overflow-x-auto sticky top-20 z-40">
              {[
                { id: "overview", label: "Overview", icon: LayoutDashboard },
                { id: "post", label: "Post a Job", icon: PlusCircle },
                { id: "postings", label: "My Postings", icon: FileText },
                { id: "talents", label: "Find Talents", icon: Users },
                { id: "profile", label: "Company Profile", icon: User },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setClientTab(tab.id as any)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${
                    clientTab === tab.id 
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
                      <button 
                        onClick={() => alert("Squad management for Employers coming soon!")}
                        className="text-xs font-bold text-indigo-400 hover:text-indigo-300 transition-colors flex items-center gap-1"
                      >
                        Configure Team <ArrowUpRight className="w-3 h-3" />
                      </button>
                    </div>
                    <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-indigo-600/10 rounded-full blur-xl"></div>
                  </div>
                </div>
              </motion.div>
            )}

            {clientTab === "post" && (
              <motion.div
                key="post"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="max-w-5xl"
              >
                <div className="bg-white rounded-xl border border-slate-200 shadow-xl shadow-slate-200/20 p-8">
                  <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center border border-slate-100">
                        <Briefcase className="w-6 h-6 text-slate-600" />
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold text-slate-900">Post a New Job</h2>
                        <p className="text-slate-500 font-medium">Find the perfect talent for your project.</p>
                      </div>
                    </div>
                  </div>
                  <JobPostingForm onPublish={() => { fetchEmployerJobs(user.id); setClientTab("postings"); }} />
                </div>
              </motion.div>
            )}

            {clientTab === "postings" && (
              <motion.div
                key="postings"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="flex justify-between items-end">
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900">Your Job Postings</h2>
                    <p className="text-slate-500 mt-1">Manage and track your active opportunities.</p>
                  </div>
                </div>

                {employerJobs.length > 0 ? (
                  <div className="grid gap-4">
                    {employerJobs.map((job) => (
                      <div key={job.id} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:border-indigo-100 transition-all">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <div className="flex items-center gap-3 mb-1">
                              <h3 className="text-lg font-bold text-slate-900">{job.title}</h3>
                              <span className="text-[10px] font-bold bg-slate-100 text-slate-600 px-2 py-0.5 rounded border border-slate-200 uppercase tracking-widest">{job.category}</span>
                            </div>
                            <p className="text-xs text-slate-500 font-medium">Posted on {new Date(job.createdAt).toLocaleDateString()}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-lg font-bold text-slate-900">{job.rate || (job.budget ? `₱${job.budget}` : "Not specified")}</p>
                          </div>
                        </div>
                        
                        <div className="flex justify-between items-center pt-4 border-t border-slate-50">
                          <div className="flex gap-4">
                            <div className="flex flex-col">
                              <span className="text-sm font-bold text-slate-900">{(job as any).applicantCount || 0}</span>
                              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Proposals</span>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <button 
                              onClick={() => fetchApplicants(job.id, job.title)}
                              className="px-4 py-2 text-[10px] font-bold text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-all uppercase tracking-wider"
                            >
                              View Applicants
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-16 bg-white rounded-xl border-2 border-dashed border-slate-100">
                    <p className="text-slate-500 text-sm">No jobs posted yet.</p>
                  </div>
                )}
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
                <div className="flex flex-col md:flex-row justify-between items-end gap-4">
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900">Top Rated Freelancers</h2>
                    <p className="text-slate-500 mt-1">Discover world-class talent to scale your project.</p>
                  </div>
                  <div className="relative w-full md:w-64">
                    <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input 
                      type="text" 
                      placeholder="Search skills..." 
                      className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                      value={freelancerSearchTerm}
                      onChange={(e) => setFreelancerSearchTerm(e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredFreelancers.map((freelancer) => (
                    <div key={freelancer.id} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:border-indigo-100 transition-all group">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="w-14 h-14 rounded-2xl bg-indigo-50 border border-indigo-100 overflow-hidden flex items-center justify-center shrink-0">
                          {freelancer.avatar_url ? (
                            <img src={freelancer.avatar_url} alt={freelancer.name} className="w-full h-full object-cover" />
                          ) : (
                            <Users className="w-6 h-6 text-indigo-400" />
                          )}
                        </div>
                        <div>
                          <h3 className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">{freelancer.name}</h3>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-bold bg-slate-100 text-slate-600 px-2 py-0.5 rounded uppercase tracking-widest">{freelancer.category}</span>
                            {freelancer.wellness?.verifiedSustainable && (
                              <span className="inline-flex items-center gap-1 text-[9px] font-black text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100 uppercase tracking-widest" title="Verified Sustainable Performer">
                                <ShieldCheck className="w-3 h-3" />
                                Sustainable
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex justify-between items-center pt-4 border-t border-slate-50">
                        <span className="text-sm font-bold text-slate-900">{freelancer.hourlyRate}/hr</span>
                        <button 
                          onClick={() => {
                            setSelectedFreelancer(freelancer);
                            setShowFreelancerModal(true);
                          }}
                          className="px-4 py-2 bg-slate-900 text-white text-[10px] font-bold rounded-lg hover:bg-black transition-all uppercase tracking-widest"
                        >
                          View Profile
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {clientTab === "profile" && (
              <motion.div
                key="profile"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="max-w-4xl"
              >
                <ProfileForm 
                  initialProfile={profile} 
                  onUpdate={handleProfileSave} 
                  isSaving={isSaving}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ) : (
          <AdminDashboard />
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
                    {/* Follow/Message Interaction */}
                    <div className="bg-slate-950 p-6 rounded-2xl border border-white/10 text-white shadow-2xl overflow-hidden relative group">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/20 blur-3xl -z-10 group-hover:bg-indigo-500/30 transition-all duration-700" />
                      <h4 className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                        <Users className="w-3 h-3" />
                        Network Action
                      </h4>
                      <div className="flex flex-col gap-3">
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
                        <button 
                          onClick={() => {
                            router.push(`/messages?with=${selectedFreelancer.id!}`);
                          }}
                          className="w-full py-3 bg-white text-slate-900 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-slate-50 transition-all flex items-center justify-center gap-2"
                        >
                          <Mail className="w-4 h-4" />
                          Message
                        </button>
                        <p className="text-[9px] text-slate-500 text-center font-bold uppercase tracking-widest mt-2">
                          Note: Mutual follows are required for networking messages.
                        </p>
                      </div>
                    </div>

                    <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                      <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Top Skills</h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedFreelancer.skills.map(skill => (
                          <span key={skill} className="px-3 py-1 bg-white border border-slate-200 rounded-lg text-[10px] font-bold text-slate-600">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="bg-indigo-900 p-6 rounded-2xl text-white shadow-lg">
                      <h4 className="text-sm font-bold mb-2">Quick Action</h4>
                      <p className="text-xs text-indigo-200 mb-6 leading-relaxed">Ready to discuss your project with {(selectedFreelancer.name || "User").split(' ')[0]}?</p>
                      <Link 
                        href={`/messages?with=${selectedFreelancer.id!}`}
                        className="w-full bg-white text-indigo-600 py-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 hover:bg-indigo-50 transition-all uppercase tracking-widest"
                      >
                        <Mail className="w-4 h-4" />
                        Send a Message
                      </Link>
                    </div>
                  </div>

                  <div className="lg:col-span-2 space-y-8">
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 mb-3 uppercase tracking-widest">About</h4>
                      <p className="text-slate-600 leading-relaxed font-medium">
                        {selectedFreelancer.bio || "No detailed bio provided yet."}
                      </p>
                    </div>

                    <div className="pt-6 border-t border-slate-100">
                      <h4 className="text-sm font-bold text-slate-900 mb-6 uppercase tracking-widest">Portfolio Showcase</h4>
                      <div className="grid grid-cols-1 gap-4">
                        {selectedFreelancer.portfolio && selectedFreelancer.portfolio.length > 0 ? (
                          selectedFreelancer.portfolio.map((item) => (
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
                          {app.profiles?.avatar_url ? (
                            <img src={app.profiles.avatar_url} className="w-full h-full object-cover" alt="" />
                          ) : (
                            <Users className="w-8 h-8 text-indigo-400" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0 space-y-4">
                          <div className="flex flex-wrap justify-between items-start gap-4">
                            <div>
                              <h4 className="font-black text-slate-900 text-xl tracking-tight">{app.profiles?.name || "Unknown Freelancer"}</h4>
                              <div className="flex items-center gap-2 mt-1">
                                <span className="text-[10px] font-bold bg-white text-indigo-600 px-2.5 py-1 rounded-lg border border-indigo-100 uppercase tracking-widest">{app.profiles?.category}</span>
                                {app.profiles?.wellness && (
                                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg border bg-amber-50 border-amber-100">
                                    <Zap className="w-3 h-3 text-amber-500" />
                                    <span className="text-[10px] font-bold text-amber-700 uppercase tracking-widest">
                                      {energyScore(app.profiles.wellness.energyRating, employerJobs.find(j => j.title === selectedJobTitle)?.energyRequirement)}% Compatibility
                                    </span>
                                  </div>
                                )}
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

                          <div className="bg-white/80 backdrop-blur-sm p-5 rounded-2xl border border-slate-100 shadow-sm">
                            <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-2.5 flex items-center gap-2">
                              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                              freelancer&apos;s Message
                            </p>
                            <p className="text-sm text-slate-600 leading-relaxed font-medium italic">
                              &quot;{app.cover_letter || "No cover letter provided."}&quot;
                            </p>
                          </div>

                          <div className="flex flex-wrap gap-3 pt-2">
                            <button 
                              onClick={() => {
                                setVettingData(app);
                                setIsVetting(true);
                              }}
                              className="px-6 py-3 bg-slate-900 text-white text-[10px] font-bold rounded-xl hover:bg-slate-800 transition-all uppercase tracking-widest flex items-center gap-2 border border-slate-800 shadow-xl shadow-slate-900/10 active:scale-95"
                            >
                              <Brain className="w-3.5 h-3.5 text-indigo-400" />
                              Start AI Vetting
                            </button>
                            {app.status === 'pending' && (
                              <button 
                                onClick={() => {
                                  const job = employerJobs.find(j => j.title === selectedJobTitle);
                                  approveApplication(app.id, app.freelancer_id, app.job_id, selectedJobTitle, job?.budget || 0);
                                }}
                                disabled={isSaving}
                                className="px-6 py-3 bg-indigo-600 text-white text-[10px] font-bold rounded-xl hover:bg-indigo-700 transition-all uppercase tracking-widest flex items-center gap-2 shadow-xl shadow-indigo-500/20 active:scale-95"
                              >
                                <CheckCircle2 className="w-4 h-4" />
                                Approve & Fund Budget
                              </button>
                            )}
                            <button 
                              onClick={() => {
                                setSelectedFreelancer(app.profiles);
                                setShowFreelancerModal(true);
                              }}
                              className="px-5 py-3 bg-white text-slate-900 border border-slate-200 text-[10px] font-bold rounded-xl hover:bg-slate-50 transition-all uppercase tracking-widest"
                            >
                              Profile Details
                            </button>
                            <Link 
                              href={`/messages?with=${app.freelancer_id}`}
                              className="px-5 py-3 bg-slate-900 text-white text-[10px] font-bold rounded-xl hover:bg-black transition-all uppercase tracking-widest flex items-center gap-2"
                            >
                              <Mail className="w-4 h-4 text-indigo-400" />
                              Interview Chat
                            </Link>
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

      {/* Apply for Job Modal */}
      <AnimatePresence>
        {showApplyModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowApplyModal(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-100"
            >
              <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-white sticky top-0 z-10">
                <div>
                  <h3 className="text-xl font-black text-slate-900 tracking-tight">Prove Your Legitimacy</h3>
                  <p className="text-sm font-medium text-slate-500">Provide your credentials to the employer.</p>
                </div>
                <button 
                  onClick={() => setShowApplyModal(false)}
                  className="p-2 hover:bg-slate-50 rounded-xl transition-all"
                >
                  <XCircle className="w-6 h-6 text-slate-300 hover:text-slate-500" />
                </button>
              </div>

              <div className="p-8 space-y-6 overflow-y-auto max-h-[70vh]">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                    <FileText className="w-3.5 h-3.5" />
                    Resume URL (PDF/Drive)
                  </label>
                  <input 
                    type="url"
                    placeholder="https://drive.google.com/your-resume"
                    className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                    value={applyData.resumeUrl}
                    onChange={(e) => setApplyData({...applyData, resumeUrl: e.target.value})}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                    <Code className="w-3.5 h-3.5" />
                    Portfolio URL (GitHub/Behance)
                  </label>
                  <input 
                    type="url"
                    placeholder="https://github.com/your-portfolio"
                    className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                    value={applyData.portfolioUrl}
                    onChange={(e) => setApplyData({...applyData, portfolioUrl: e.target.value})}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                    <ExternalLink className="w-3.5 h-3.5" />
                    Interview Video/Link (Optional)
                  </label>
                  <input 
                    type="url"
                    placeholder="https://loom.com/your-intro"
                    className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                    value={applyData.interviewUrl}
                    onChange={(e) => setApplyData({...applyData, interviewUrl: e.target.value})}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                    <Sparkles className="w-3.5 h-3.5" />
                    Short Message to employer
                  </label>
                  <textarea 
                    rows={4}
                    placeholder="Tell the employer why you're a good fit..."
                    className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all resize-none"
                    value={applyData.coverLetter}
                    onChange={(e) => setApplyData({...applyData, coverLetter: e.target.value})}
                  />
                </div>

                <button 
                  onClick={submitApplication}
                  disabled={isSaving}
                  className="w-full bg-slate-900 text-white py-4 rounded-2xl text-sm font-bold hover:bg-black transition-all shadow-xl shadow-slate-900/20 active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isSaving ? "Submitting..." : "Submit My Application"}
                  {!isSaving && <ArrowUpRight className="w-4 h-4" />}
                </button>
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
                <p className="text-[10px] text-slate-400 mt-1 uppercase font-bold tracking-widest">Security Notification</p>
              </div>
              <button onClick={() => setShowToast(false)} className="text-slate-500 hover:text-white transition-colors">
                &times;
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Escrow How it Works Modal */}
      <AnimatePresence>
        {showEscrowModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowEscrowModal(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-100"
            >
              <div className="bg-slate-900 p-8 text-white relative">
                <div className="relative z-10">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/10 text-indigo-400 text-[10px] font-bold mb-4 uppercase tracking-wider">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    Trust & Safety
                  </div>
                  <h3 className="text-2xl font-black tracking-tight">Tara Safe-Vault System</h3>
                  <p className="text-slate-400 text-sm mt-2 font-medium">How we protect your payments and work.</p>
                </div>
                <div className="absolute -right-12 -top-12 w-48 h-48 bg-indigo-600/20 rounded-full blur-3xl"></div>
              </div>
              
              <div className="p-8 space-y-6">
                {[
                  { 
                    title: "Funds are Locked", 
                    desc: "When a project starts, the employer deposits funds into Tara's secure Escrow account. This confirms the budget is ready.",
                    icon: Lock
                  },
                  { 
                    title: "Work is Verified", 
                    desc: "The freelancer submits milestones. employers review the work before any payment is released.",
                    icon: CheckCircle2
                  },
                  { 
                    title: "Secure Release", 
                    desc: "Once approved, funds move from Escrow to the freelancer's wallet instantly. No delays.",
                    icon: DollarSign
                  },
                  { 
                    title: "Dispute Protection", 
                    desc: "If something goes wrong, our Admin team reviews the Chat Logs and Evidence to ensure a fair resolution.",
                    icon: Scale
                  }
                ].map((step, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center shrink-0 border border-slate-100">
                      <step.icon className="w-5 h-5 text-indigo-600" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">{step.title}</h4>
                      <p className="text-xs text-slate-500 mt-1 leading-relaxed font-medium">{step.desc}</p>
                    </div>
                  </div>
                ))}

                <button 
                  onClick={() => setShowEscrowModal(false)}
                  className="w-full bg-slate-900 text-white py-4 rounded-2xl text-sm font-bold hover:bg-slate-800 transition-all shadow-lg active:scale-[0.98]"
                >
                  Understood, Got it!
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

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
    </div>
  );
}

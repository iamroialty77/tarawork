"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { UserProfile, Job, PortfolioItem } from "../types";
import JobFeed from "../components/JobFeed";
import ProfileForm from "../components/ProfileForm";
import SkillAssessment from "../components/SkillAssessment";
import Workspace from "../components/Workspace";
import TeamManager from "../components/TeamManager";
import CareerPath from "../components/CareerPath";
import JobPostingForm from "../components/JobPostingForm";
import AdminDashboard from "../components/AdminDashboard";
import { supabase } from "../lib/supabase";
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
  ExternalLink,
  DollarSign,
  Lock,
  Scale
} from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

export default function Home() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMsg, setToastMsg] = useState("");
  const [view, setView] = useState<"freelancer" | "client" | "admin">("freelancer");
  const [jobs, setJobs] = useState<Job[]>([]);
  const [hirerJobs, setHirerJobs] = useState<Job[]>([]);
  const [freelancers, setFreelancers] = useState<UserProfile[]>([]);
  const [dbError, setDbError] = useState<boolean>(false);
  const [missingTables, setMissingTables] = useState<string[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [freelancerSearchTerm, setFreelancerSearchTerm] = useState("");
  const [debouncedFreelancerSearchTerm, setDebouncedFreelancerSearchTerm] = useState("");
  const [selectedFreelancer, setSelectedFreelancer] = useState<UserProfile | null>(null);
  const [showEscrowModal, setShowEscrowModal] = useState(false);
  const [showFreelancerModal, setShowFreelancerModal] = useState(false);
  const jobsRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  const [profile, setProfile] = useState<UserProfile>({
    name: "User",
    role: "jobseeker",
    category: "Developer",
    skills: [],
    verifiedSkills: [],
    softSkills: [],
    aiInsights: {
      gapAnalysis: [],
      compatibilityScore: 0,
      cultureMatch: []
    },
    ranking: 0,
    hourlyRate: "$0",
    bio: "",
    activeProjects: [],
  });

  const [isSaving, setIsSaving] = useState(false);

  const fetchProfile = async (userId: string, userAuth?: any) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error && error.code !== 'PGRST116') {
        if (error.message.includes("relation \"profiles\" does not exist") || error.code === 'PGRST205' || error.message.includes("Could not find the table")) {
          setDbError(true);
          setMissingTables(prev => [...new Set([...prev, "profiles"])]);
          setToastMsg("⚠️ Database Setup Required: The 'profiles' table is missing. Go to Admin tab for setup SQL.");
          setShowToast(true);
          return; // Stop here to avoid further errors
        }
        throw error;
      }

      if (data) {
        // Fetch portfolio items separately
        const { data: portfolioData } = await supabase
          .from('portfolio_items')
          .select('*')
          .eq('profile_id', userId);
        
        setProfile({ ...data, portfolio: portfolioData || [] });
        if (data.role === 'hirer') {
          setView('client');
        } else if (data.role === 'admin') {
          setView('admin');
        } else {
          setView('freelancer');
        }
      } else {
        // Create initial profile if it doesn't exist
        const role = userAuth?.user_metadata?.role || "jobseeker";
        const initialData: UserProfile = {
          id: userId,
          name: userAuth?.user_metadata?.full_name || userAuth?.email?.split('@')[0] || "User",
          role: role as any,
          category: "Developer" as const,
          skills: [],
          hourlyRate: "$0",
          bio: "",
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
        if (role === 'hirer') setView('client');
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
      // Remove portfolio from the profile object before saving to 'profiles' table
      const { portfolio, ...profileToSave } = updatedProfile;

      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          ...profileToSave,
          updated_at: new Date().toISOString(),
        });

      if (error) throw error;
      
      setProfile(updatedProfile);
      if (updatedProfile.role === 'hirer') {
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
      if (err.code === 'PGRST205' || err.message?.includes("relation \"profiles\" does not exist")) {
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

  const handleUpdateProject = async (updatedProject: any) => {
    if (!profile.activeProjects) return;
    
    const updatedProjects = profile.activeProjects.map(p => 
      p.id === updatedProject.id ? updatedProject : p
    );
    
    const updatedProfile = { ...profile, activeProjects: updatedProjects };
    setProfile(updatedProfile);
    
    // Save to DB
    await handleProfileSave(updatedProfile);
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
        setJobs(data);
      } else {
        setJobs([]);
      }
    } catch (err: any) {
      if (err.code !== 'PGRST205') {
        console.error("Error fetching jobs:", err);
      }
    }
  };

  const fetchHirerJobs = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('jobs')
        .select('*')
        .eq('hirer_id', userId)
        .order('createdAt', { ascending: false });

      if (error) {
        console.error("Error fetching hirer jobs:", error);
        return;
      }

      if (data) {
        setHirerJobs(data);
      }
    } catch (err) {
      console.error("Unexpected error fetching hirer jobs:", err);
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
        .eq('role', 'jobseeker')
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
        router.push("/auth");
      } else {
        setUser(session.user);
        
        // Fetch real profile from DB
        await fetchProfile(session.user.id, session.user);
        
        // Fetch jobs from DB
        await fetchJobs();
        await fetchHirerJobs(session.user.id);
        await fetchFreelancers();
        await fetchUnreadCount(session.user.id);
        
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
            setProfile(prev => ({ ...prev, ...payload.new }));
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
        router.push("/auth");
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

  const addPortfolioItem = async (item: Partial<PortfolioItem>) => {
    if (!user) return;
    try {
      const { data, error } = await supabase
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

      if (error) throw error;

      if (data) {
        setProfile(prev => ({
          ...prev,
          portfolio: [...(prev.portfolio || []), data]
        }));
        setToastMsg("Portfolio item added!");
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
      }
    } catch (err: any) {
      console.error("Error adding portfolio item:", err);
      setToastMsg(`Error: ${err.message}`);
      setShowToast(true);
    }
  };

  const removePortfolioItem = async (id: string) => {
    try {
      const { error } = await supabase
        .from('portfolio_items')
        .delete()
        .eq('id', id);

      if (error) throw error;

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

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-slate-200">
        {dbError && (
          <div className="bg-indigo-600 text-white text-[10px] sm:text-xs font-bold py-2.5 px-4 text-center animate-in fade-in slide-in-from-top-2 duration-500 flex items-center justify-center gap-3 shadow-lg">
            <div className="flex items-center gap-2">
              <Shield className="w-3.5 h-3.5 text-indigo-200" />
              <span className="uppercase tracking-widest">Platform Status: Initialization Required</span>
            </div>
            <div className="h-4 w-px bg-white/20 hidden sm:block"></div>
            <span className="opacity-90 font-medium">Ang ilang database tables ({missingTables.join(", ")}) ay kailangang i-setup para sa full functionality.</span>
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
                onClick={async () => {
                  await supabase.auth.signOut();
                  router.push("/auth");
                }}
                className="hidden sm:flex items-center gap-2 px-4 py-2 bg-slate-50 text-slate-600 rounded-lg text-sm font-semibold hover:bg-slate-100 transition-all"
              >
                Logout
              </button>
              <button 
                onClick={() => alert("You have 3 new notifications:\n1. Project 'E-commerce API' Milestone released.\n2. New match: Senior React Developer.\n3. Profile audit complete.")}
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-full transition-colors relative"
              >
                <Bell className="w-5 h-5" />
                <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
              </button>
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

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {view === "freelancer" ? (
          <div className="space-y-8">
            {/* Hero / Welcome Section */}
            <div className="relative overflow-hidden rounded-2xl bg-slate-900 p-8 md:p-12 text-white shadow-xl">
              <div className="relative z-10 max-w-2xl">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/10 text-slate-300 text-[10px] font-bold mb-6 uppercase tracking-wider">
                  <Award className="w-3.5 h-3.5" />
                  Top Rated Freelancer
                </div>
                <h2 className="text-3xl md:text-4xl font-bold mb-4 leading-tight tracking-tight">
                  Welcome back, <span className="text-indigo-400">{profile.name.split(' ')[0]}!</span>
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

            {/* Dashboard Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { label: "Total Earnings", value: "₱0", icon: DollarSign, color: "text-slate-600", bg: "bg-slate-50" },
                { label: "Active Projects", value: profile.activeProjects?.length.toString() || "0", icon: Briefcase, color: "text-slate-600", bg: "bg-slate-50" },
                { label: "Escrow Protected", value: "₱0", icon: ShieldCheck, color: "text-emerald-600", bg: "bg-emerald-50" },
                { label: "Profile Views", value: "0", icon: Users, color: "text-slate-600", bg: "bg-slate-50" },
              ].map((stat, i) => (
                <div key={i} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4 hover:border-indigo-100 transition-colors">
                  <div className={`w-12 h-12 ${stat.bg} rounded-lg flex items-center justify-center`}>
                    <stat.icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{stat.label}</p>
                    <p className="text-xl font-bold text-slate-900">{stat.value}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Trust & Safety Section for Seekers */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-emerald-50 border border-emerald-100 p-6 rounded-2xl flex gap-4">
                <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-6 h-6 text-emerald-600" />
                </div>
                <div>
                  <h4 className="font-bold text-emerald-900">Safe-Vault Protection</h4>
                  <p className="text-xs text-emerald-700 mt-1 leading-relaxed">Ang iyong bayad ay protektado. Ang pondo ay itinatabi sa aming secure vault bago magsimula ang trabaho.</p>
                </div>
              </div>
              <div className="bg-indigo-50 border border-indigo-100 p-6 rounded-2xl flex gap-4">
                <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center shrink-0">
                  <DollarSign className="w-6 h-6 text-indigo-600" />
                </div>
                <div>
                  <h4 className="font-bold text-indigo-900">Escrow Milestone</h4>
                  <p className="text-xs text-indigo-700 mt-1 leading-relaxed">Sinisiguro namin na ang bawat milestone ay may katumbas na pondo na nakareserba para sa iyo.</p>
                </div>
              </div>
              <div className="bg-slate-900 p-6 rounded-2xl flex gap-4 text-white">
                <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center shrink-0">
                  <Zap className="w-6 h-6 text-indigo-400" />
                </div>
                <div>
                  <h4 className="font-bold">24/7 Support</h4>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">May dispute? Ang aming admin team ay handang tumulong sa pag-resolve ng anumang isyu.</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Left Column */}
              <div className="lg:col-span-4 space-y-6" ref={profileRef}>
                <div className="sticky top-24 space-y-6">
                  <ProfileForm 
                    initialProfile={profile} 
                    onUpdate={handleProfileSave} 
                    onAddPortfolio={addPortfolioItem}
                    onRemovePortfolio={removePortfolioItem}
                    isSaving={isSaving}
                  />
                  
                  {/* Soft Skills & Badges */}
                  <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                    <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                      <Award className="w-4 h-4 text-indigo-600" />
                      Career Badges
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {profile.softSkills?.map((skill) => (
                        <div key={skill.name} className="group relative flex items-center gap-2 px-3 py-1.5 bg-slate-50 border border-slate-100 rounded-lg hover:border-indigo-200 hover:bg-indigo-50 transition-all cursor-help">
                          <span className="text-lg">{skill.badge}</span>
                          <span className="text-[10px] font-bold text-slate-600">{skill.name}</span>
                          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-32 p-2 bg-slate-900 text-white text-[9px] rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20">
                            {skill.level} Level. Endorsed {skill.count} times.
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <SkillAssessment 
                    verifiedSkills={profile.verifiedSkills || []} 
                    aiInsights={profile.aiInsights}
                  />

                  {/* Connected Accounts Section */}
                  <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                    <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                      <Shield className="w-4 h-4 text-indigo-600" />
                      Connected Accounts
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-100">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center border border-slate-100">
                            <Mail className="w-4 h-4 text-red-500" />
                          </div>
                          <div>
                            <p className="text-xs font-bold text-slate-700">Google / Gmail</p>
                            <p className="text-[10px] text-slate-400">Connected via OAuth</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-1.5 px-2 py-1 bg-emerald-50 text-emerald-600 rounded-lg text-[10px] font-bold border border-emerald-100">
                          <CheckCircle2 className="w-3 h-3" />
                          Active
                        </div>
                      </div>

                      <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-100 opacity-60">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center border border-slate-100">
                            <Facebook className="w-4 h-4 text-blue-600" />
                          </div>
                          <div>
                            <p className="text-xs font-bold text-slate-700">Facebook</p>
                            <p className="text-[10px] text-slate-400">Not connected</p>
                          </div>
                        </div>
                        <button className="text-[10px] font-bold text-indigo-600 hover:underline">Link Now</button>
                      </div>

                      <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-100 opacity-60">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center border border-slate-100">
                            <Linkedin className="w-4 h-4 text-blue-700" />
                          </div>
                          <div>
                            <p className="text-xs font-bold text-slate-700">LinkedIn</p>
                            <p className="text-[10px] text-slate-400">Not connected</p>
                          </div>
                        </div>
                        <button className="text-[10px] font-bold text-indigo-600 hover:underline">Link Now</button>
                      </div>
                    </div>
                    <p className="mt-4 text-[10px] text-slate-400 leading-relaxed italic">
                      Notifications are automatically sent to your linked social accounts upon every successful secure connection.
                    </p>
                  </div>
                  
                  <div className="p-6 bg-slate-900 rounded-xl text-white relative overflow-hidden shadow-lg">
                    <div className="relative z-10">
                      <h3 className="text-lg font-bold mb-2">Pro Perks Locked</h3>
                      <p className="text-sm text-slate-400 mb-4 leading-relaxed">
                        You're in the <span className="text-white font-bold">Top 2%</span>. Early access to high-budget projects is now active.
                      </p>
                      <button className="text-xs font-bold text-indigo-400 hover:text-indigo-300 transition-colors flex items-center gap-1">
                        View Ranking Leaderboard <Zap className="w-3 h-3" />
                      </button>
                    </div>
                    <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-indigo-600/10 rounded-full blur-xl"></div>
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div className="lg:col-span-8 space-y-8">
                <Workspace 
                  projects={profile.activeProjects || []} 
                  onUpdateProject={handleUpdateProject}
                />
                
                <CareerPath profile={profile} allJobs={jobs} />

                <TeamManager squad={profile.squad} />

                <div className="pt-2" ref={jobsRef}>
                  <div className="flex justify-between items-end mb-6">
                    <div>
                      <h2 className="text-2xl font-bold text-slate-900">Available Jobs</h2>
                      <p className="text-slate-500 mt-1">Browse opportunities that match your expertise.</p>
                    </div>
                    <div className="flex gap-2">
                      <button 
                        onClick={fetchJobs}
                        className="p-2 bg-white border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 transition-all cursor-pointer group"
                      >
                        <LayoutDashboard className="w-4 h-4 group-hover:text-indigo-600 transition-colors" />
                      </button>
                    </div>
                  </div>
                  
                  <JobFeed jobs={jobs} profile={profile} />
                </div>
              </div>
            </div>
          </div>
        ) : view === "client" ? (
          <div className="space-y-8">
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
                    <span className="text-2xl font-bold text-white">{hirerJobs.length}</span>
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

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              <div className="lg:col-span-4 space-y-6">
                <ProfileForm 
                  initialProfile={profile} 
                  onUpdate={handleProfileSave} 
                  isSaving={isSaving}
                />
                
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                  <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-indigo-600" />
                    Hirer Stats
                  </h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Active Postings</span>
                      <span className="text-sm font-bold text-slate-900">{hirerJobs.length}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Total Spent</span>
                      <span className="text-sm font-bold text-emerald-600">₱0</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Hired Freelancers</span>
                      <span className="text-sm font-bold text-slate-900">0</span>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-900 p-6 rounded-xl text-white shadow-lg overflow-hidden relative">
                  <div className="relative z-10">
                    <h3 className="text-lg font-bold mb-2">Team Management</h3>
                    <p className="text-sm text-slate-400 mb-4 leading-relaxed">
                      Invite teammates to review applications and manage projects together.
                    </p>
                    <button 
                      onClick={() => alert("Squad management for Hirers coming soon!")}
                      className="text-xs font-bold text-indigo-400 hover:text-indigo-300 transition-colors flex items-center gap-1"
                    >
                      Configure Team <ArrowUpRight className="w-3 h-3" />
                    </button>
                  </div>
                  <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-indigo-600/10 rounded-full blur-xl"></div>
                </div>
              </div>

              <div className="lg:col-span-8 space-y-8">
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
                    <div 
                      onClick={() => setShowEscrowModal(true)}
                      className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-indigo-50 text-indigo-600 rounded-lg text-[10px] font-black border border-indigo-100 uppercase tracking-tighter cursor-pointer hover:bg-indigo-100 transition-all"
                    >
                      <ShieldCheck className="w-3.5 h-3.5" />
                      Escrow Protected
                    </div>
                  </div>
                  <JobPostingForm onPublish={() => fetchHirerJobs(user.id)} />
                </div>

                <div className="space-y-6">
                  <div className="flex flex-col md:flex-row justify-between items-end gap-4">
                    <div>
                      <h2 className="text-2xl font-bold text-slate-900">Top Rated Freelancers</h2>
                      <p className="text-slate-500 mt-1">Discover world-class talent to scale your project.</p>
                    </div>
                    <div className="flex gap-2 w-full md:w-auto">
                      <div className="relative flex-1 md:w-64">
                        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input 
                          type="text" 
                          placeholder="Search skills (e.g. React)..." 
                          className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                          value={freelancerSearchTerm}
                          onChange={(e) => setFreelancerSearchTerm(e.target.value)}
                        />
                      </div>
                      <button 
                        onClick={fetchFreelancers}
                        className="p-2 bg-white border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 transition-all cursor-pointer group"
                      >
                        <Zap className="w-4 h-4 group-hover:text-indigo-600 transition-colors" />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {filteredFreelancers.length > 0 ? (
                      filteredFreelancers.map((freelancer) => (
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
                                {freelancer.ranking && (
                                  <span className="text-[10px] font-bold text-amber-600 flex items-center gap-1">
                                    <Award className="w-3 h-3" />
                                    Top {freelancer.ranking}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                          
                          <p className="text-xs text-slate-500 line-clamp-2 mb-4 h-8">
                            {freelancer.bio || "No bio provided yet."}
                          </p>

                          <div className="flex flex-wrap gap-1.5 mb-4">
                            {freelancer.skills.slice(0, 3).map(skill => (
                              <span key={skill} className="text-[9px] font-bold bg-slate-50 text-slate-500 border border-slate-100 px-2 py-0.5 rounded uppercase">{skill}</span>
                            ))}
                          </div>

                            <div className="flex justify-between items-center pt-4 border-t border-slate-50">
                            <div className="flex gap-2">
                              <span className="text-sm font-bold text-slate-900">{freelancer.hourlyRate || "₱0"}/hr</span>
                            </div>
                            <div className="flex gap-2">
                              <button 
                                onClick={() => {
                                  setSelectedFreelancer(freelancer);
                                  setShowFreelancerModal(true);
                                }}
                                className="px-4 py-2 bg-white text-slate-900 border border-slate-200 text-[10px] font-bold rounded-lg hover:bg-slate-50 transition-all uppercase tracking-widest"
                              >
                                View Profile
                              </button>
                              <Link 
                                href={`/messages?with=${freelancer.id}`}
                                className="px-4 py-2 bg-slate-900 text-white text-[10px] font-bold rounded-lg hover:bg-black transition-all uppercase tracking-widest flex items-center gap-2"
                              >
                                <Mail className="w-3.5 h-3.5" />
                                Message
                              </Link>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="col-span-full text-center py-12 bg-white rounded-xl border-2 border-dashed border-slate-100">
                        <p className="text-slate-500 text-sm">No freelancers found.</p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="flex justify-between items-end">
                    <div>
                      <h2 className="text-2xl font-bold text-slate-900">Your Job Postings</h2>
                      <p className="text-slate-500 mt-1">Manage and track your active opportunities.</p>
                    </div>
                    <button 
                      onClick={() => fetchHirerJobs(user.id)}
                      className="p-2 bg-white border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 transition-all cursor-pointer group"
                    >
                      <LayoutDashboard className="w-4 h-4 group-hover:text-indigo-600 transition-colors" />
                    </button>
                  </div>

                  {hirerJobs.length > 0 ? (
                    <div className="grid gap-4">
                      {hirerJobs.map((job, idx) => (
                        <div key={job.id} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:border-indigo-100 transition-all">
                          <div className="flex justify-between items-start mb-4">
                            <div>
                              <div className="flex items-center gap-3 mb-1">
                                <h3 className="text-lg font-bold text-slate-900">{job.title}</h3>
                                <span className="text-[10px] font-bold bg-slate-100 text-slate-600 px-2 py-0.5 rounded border border-slate-200 uppercase tracking-widest">{job.category}</span>
                                <span className="text-[10px] font-bold bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded border border-indigo-100 uppercase tracking-widest">{job.jobType}</span>
                              </div>
                              <p className="text-xs text-slate-500 font-medium">Posted on {new Date(job.createdAt).toLocaleDateString()}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-lg font-bold text-slate-900">{job.rate || (job.budget ? `₱${job.budget}` : "Not specified")}</p>
                              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{job.paymentMethod}</p>
                            </div>
                          </div>
                          
                          <div className="flex justify-between items-center pt-4 border-t border-slate-50">
                            <div className="flex gap-4">
                              <div className="flex flex-col">
                                <span className="text-sm font-bold text-slate-900">0</span>
                                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Proposals</span>
                              </div>
                              <div className="flex flex-col">
                                <span className="text-sm font-bold text-slate-900">0</span>
                                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Interviews</span>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <button className="px-4 py-2 text-[10px] font-bold text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-all uppercase tracking-wider">
                                View Applicants
                              </button>
                              <button className="px-4 py-2 text-[10px] font-bold text-white bg-slate-900 rounded-lg hover:bg-black transition-all uppercase tracking-wider">
                                Edit Post
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-16 bg-white rounded-xl border-2 border-dashed border-slate-100">
                      <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Briefcase className="w-8 h-8 text-slate-300" />
                      </div>
                      <h3 className="text-slate-900 font-bold">No jobs posted yet</h3>
                      <p className="text-slate-500 text-sm max-w-xs mx-auto mt-1">Start by posting your first job to find world-class freelancers.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
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
              className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
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
                      <p className="text-xs text-indigo-200 mb-6 leading-relaxed">Ready to discuss your project with {selectedFreelancer.name.split(' ')[0]}?</p>
                      <Link 
                        href={`/messages?with=${selectedFreelancer.id}`}
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
                            <p className="text-slate-400 text-sm">Walang portfolio items na ipinakita.</p>
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
              className="relative w-full max-w-lg bg-white rounded-[32px] shadow-2xl overflow-hidden border border-slate-100"
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
                    desc: "When a project starts, the hirer deposits funds into Tara's secure Escrow account. This confirms the budget is ready.",
                    icon: Lock
                  },
                  { 
                    title: "Work is Verified", 
                    desc: "The freelancer submits milestones. Hirers review the work before any payment is released.",
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
        <div className="max-w-7xl mx-auto px-4 text-center">
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

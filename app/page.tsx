"use client";

import { useState, useEffect, useRef } from "react";
import { FreelancerProfile, Job } from "../types";
import JobFeed from "../components/JobFeed";
import ProfileForm from "../components/ProfileForm";
import SkillAssessment from "../components/SkillAssessment";
import Workspace from "../components/Workspace";
import TeamManager from "../components/TeamManager";
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
  Clock,
  LogIn,
  Mail,
  Facebook,
  Linkedin,
  Github,
  CheckCircle2,
  AlertCircle,
  DollarSign
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
  const [dbError, setDbError] = useState<boolean>(false);
  const [missingTables, setMissingTables] = useState<string[]>([]);
  const jobsRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  const [profile, setProfile] = useState<FreelancerProfile>({
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
        setProfile(data);
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
        const initialData = {
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

  const handleProfileSave = async (updatedProfile: FreelancerProfile) => {
    if (!user) return;
    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          ...updatedProfile,
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

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-slate-200">
        {dbError && (
          <div className="bg-red-600 text-white text-[10px] sm:text-xs font-bold py-2 px-4 text-center animate-in fade-in slide-in-from-top-2 duration-500 flex items-center justify-center gap-2">
            <AlertCircle className="w-3.5 h-3.5" />
            <span>ACTION REQUIRED: Your Supabase database tables are missing ({missingTables.join(", ")}).</span>
            <button 
              onClick={() => setView("admin")}
              className="ml-1 underline hover:bg-white/30 transition-all font-black bg-white/20 px-2 py-0.5 rounded cursor-pointer"
            >
              FIX NOW IN ADMIN
            </button>
          </div>
        )}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <img 
                  src="/tarawork-removebg-preview.png" 
                  alt="Tara Logo" 
                  className="h-9 w-auto object-contain"
                />
              </div>
              
              <div className="hidden lg:flex items-center gap-6">
                <span className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">
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
                className="hidden sm:flex items-center gap-2 px-4 py-2 bg-slate-50 text-slate-600 rounded-xl text-sm font-bold hover:bg-slate-100 transition-all"
              >
                Logout
              </button>
              <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-full transition-colors relative">
                <Bell className="w-5 h-5" />
                <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
              </button>
              <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-full transition-colors">
                <Settings className="w-5 h-5" />
              </button>
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 border-2 border-white shadow-sm cursor-pointer hover:ring-2 hover:ring-indigo-100 transition-all"></div>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {view === "freelancer" ? (
          <div className="space-y-8">
            {/* Hero / Welcome Section */}
            <div className="relative overflow-hidden rounded-3xl bg-indigo-900 p-8 md:p-12 text-white">
              <div className="relative z-10 max-w-2xl">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-800/50 border border-indigo-700/50 text-indigo-200 text-xs font-bold mb-6">
                  <Award className="w-3.5 h-3.5" />
                  Top Rated Freelancer
                </div>
                <h2 className="text-3xl md:text-4xl font-bold mb-4 leading-tight">
                  Welcome back, <span className="text-indigo-400">{profile.name.split(' ')[0]}!</span>
                </h2>
                <p className="text-indigo-100 text-lg mb-8 opacity-90">
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
                    className="bg-white text-indigo-900 px-6 py-3 rounded-xl font-bold hover:bg-indigo-50 transition-colors shadow-lg cursor-pointer"
                  >
                    Browse Jobs
                  </button>
                  <button 
                    onClick={() => profileRef.current?.scrollIntoView({ behavior: 'smooth' })}
                    className="bg-indigo-800/50 text-white border border-indigo-700 px-6 py-3 rounded-xl font-bold hover:bg-indigo-800 transition-colors cursor-pointer"
                  >
                    Update Profile
                  </button>
                </div>
              </div>
              
              {/* Decorative elements */}
              <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-96 h-96 bg-indigo-500 rounded-full blur-3xl opacity-20"></div>
              <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/4 w-64 h-64 bg-purple-500 rounded-full blur-3xl opacity-20"></div>
              <div className="hidden lg:block absolute right-12 bottom-12 w-64 h-64 opacity-10 pointer-events-none">
                <Zap className="w-full h-full text-white" />
              </div>
            </div>

            {/* Dashboard Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { label: "Total Earnings", value: "₱0", icon: DollarSign, color: "text-emerald-600", bg: "bg-emerald-50" },
                { label: "Active Projects", value: profile.activeProjects?.length.toString() || "0", icon: Briefcase, color: "text-blue-600", bg: "bg-blue-50" },
                { label: "Success Rate", value: "0%", icon: Award, color: "text-amber-600", bg: "bg-amber-50" },
                { label: "Profile Views", value: "0", icon: Users, color: "text-purple-600", bg: "bg-purple-50" },
              ].map((stat, i) => (
                <div key={i} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
                  <div className={`w-12 h-12 ${stat.bg} rounded-xl flex items-center justify-center`}>
                    <stat.icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-500">{stat.label}</p>
                    <p className="text-xl font-bold text-slate-900">{stat.value}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Left Column */}
              <div className="lg:col-span-4 space-y-6" ref={profileRef}>
                <div className="sticky top-24 space-y-6">
                  <ProfileForm 
                    initialProfile={profile} 
                    onUpdate={handleProfileSave} 
                    isSaving={isSaving}
                  />
                  
                  {/* Soft Skills & Badges */}
                  <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                    <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-4 flex items-center gap-2">
                      <Award className="w-4 h-4 text-indigo-600" />
                      Career Badges
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {profile.softSkills?.map((skill) => (
                        <div key={skill.name} className="group relative flex items-center gap-2 px-3 py-1.5 bg-slate-50 border border-slate-100 rounded-xl hover:border-indigo-200 hover:bg-indigo-50 transition-all cursor-help">
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
                  <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                    <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-4 flex items-center gap-2">
                      <Shield className="w-4 h-4 text-indigo-600" />
                      Connected Accounts
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 bg-slate-50 rounded-2xl border border-slate-100">
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

                      <div className="flex items-center justify-between p-3 bg-slate-50 rounded-2xl border border-slate-100 opacity-60">
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

                      <div className="flex items-center justify-between p-3 bg-slate-50 rounded-2xl border border-slate-100 opacity-60">
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
                  
                  <div className="p-6 bg-slate-900 rounded-2xl text-white relative overflow-hidden">
                    <div className="relative z-10">
                      <h3 className="text-lg font-bold mb-2">Pro Perks Locked</h3>
                      <p className="text-sm text-slate-400 mb-4 leading-relaxed">
                        You're in the <span className="text-white font-bold">Top 2%</span>. Early access to high-budget projects is now active.
                      </p>
                      <button className="text-xs font-bold text-indigo-400 hover:text-indigo-300 transition-colors flex items-center gap-1">
                        View Ranking Leaderboard <Zap className="w-3 h-3" />
                      </button>
                    </div>
                    <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-indigo-600/20 rounded-full blur-xl"></div>
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div className="lg:col-span-8 space-y-8">
                <Workspace projects={profile.activeProjects || []} />
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
            <div className="relative overflow-hidden rounded-3xl bg-slate-900 p-8 md:p-12 text-white">
              <div className="relative z-10 max-w-2xl">
                <h2 className="text-3xl md:text-4xl font-bold mb-4 leading-tight">
                  Hire top talent for <span className="text-indigo-400">{profile.companyName || "your company"}</span>
                </h2>
                <p className="text-slate-300 text-lg mb-8 opacity-90">
                  Ready to scale your team? Post a job and get matches in minutes.
                </p>
              </div>
              <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-96 h-96 bg-indigo-500 rounded-full blur-3xl opacity-10"></div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              <div className="lg:col-span-4 space-y-6">
                <ProfileForm 
                  initialProfile={profile} 
                  onUpdate={handleProfileSave} 
                  isSaving={isSaving}
                />
                
                <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                  <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-4 flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-indigo-600" />
                    Hirer Stats
                  </h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-slate-500 font-medium">Active Postings</span>
                      <span className="text-sm font-bold text-slate-900">2</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-slate-500 font-medium">Total Spent</span>
                      <span className="text-sm font-bold text-emerald-600">₱45,200</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-slate-500 font-medium">Hired Freelancers</span>
                      <span className="text-sm font-bold text-slate-900">5</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-8">
                <div className="bg-white rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/50 p-8">
                  <div className="flex items-center gap-4 mb-8">
                    <div className="w-12 h-12 bg-indigo-100 rounded-2xl flex items-center justify-center">
                      <Briefcase className="w-6 h-6 text-indigo-600" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-slate-900">Post a New Job</h2>
                      <p className="text-slate-500">Find the perfect talent for your project.</p>
                    </div>
                  </div>
                  <JobPostingForm />
                </div>
              </div>
            </div>
          </div>
        ) : (
          <AdminDashboard />
        )}
      </main>

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

      <footer className="bg-white border-t border-slate-200 py-12 mt-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <img 
              src="/tarawork-removebg-preview.png" 
              alt="Tara Logo" 
              className="h-8 w-auto grayscale opacity-50"
            />
          </div>
          <p className="text-slate-400 text-sm">© 2024 Tara Marketplace. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

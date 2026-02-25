"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import { 
  Users, 
  Briefcase, 
  ShieldCheck, 
  AlertTriangle, 
  TrendingUp, 
  DollarSign,
  Search,
  MoreVertical,
  ArrowUpRight,
  Filter,
  Database,
  CheckCircle2,
  XCircle,
  Code,
  Copy,
  LayoutDashboard,
  UserCheck,
  FileText,
  Activity,
  ChevronRight,
  Clock,
  ExternalLink,
  Shield,
  Eye,
  Flag,
  Check,
  BarChart3
} from "lucide-react";

type TabType = "overview" | "users" | "jobs" | "system";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<TabType>("overview");
  const [dbStatus, setDbStatus] = useState<"connecting" | "connected" | "error">("connecting");
  const [counts, setCounts] = useState({ users: 0, jobs: 0, hirers: 0, seekers: 0 });
  const [recentActivities, setRecentActivities] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [tableStatus, setTableStatus] = useState<{
    profiles: boolean;
    jobs: boolean;
    messages: boolean;
    conversations: boolean;
    portfolio_items: boolean;
    messagingColumns: boolean;
    _test: boolean;
  }>({ profiles: false, jobs: false, messages: false, conversations: false, portfolio_items: false, messagingColumns: false, _test: false });
  
  const [showSql, setShowSql] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMsg, setToastMsg] = useState("");

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        // Check Connection & Tables
        const { error: testError } = await supabase.from('_test_connection').select('*').limit(1);
        const { error: profilesError } = await supabase.from('profiles').select('id').limit(1);
        const { error: jobsError } = await supabase.from('jobs').select('id').limit(1);
        const { error: convsError } = await supabase.from('conversations').select('id').limit(1);
        const { error: messagesError } = await supabase.from('messages').select('id').limit(1);
        const { error: portfolioError } = await supabase.from('portfolio_items').select('id').limit(1);
        const { error: msgColsError } = await supabase.from('messages').select('attachment_url').limit(1);

        setTableStatus({
          _test: !testError || (testError.code !== 'PGRST205' && !testError.message.includes('relation')),
          profiles: !profilesError || (profilesError.code !== 'PGRST205' && !profilesError.message.includes('relation')),
          jobs: !jobsError || (jobsError.code !== 'PGRST205' && !jobsError.message.includes('relation')),
          conversations: !convsError || (convsError.code !== 'PGRST205' && !convsError.message.includes('relation')),
          messages: !messagesError || (messagesError.code !== 'PGRST205' && !messagesError.message.includes('relation')),
          portfolio_items: !portfolioError || (portfolioError.code !== 'PGRST205' && !portfolioError.message.includes('relation')),
          messagingColumns: !msgColsError,
        });

        setDbStatus("connected");

        // Fetch Stats
        const { count: userCount } = await supabase.from('profiles').select('*', { count: 'exact', head: true });
        const { count: hirerCount } = await supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'hirer');
        const { count: seekerCount } = await supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'jobseeker');
        const { count: jobCount } = await supabase.from('jobs').select('*', { count: 'exact', head: true });

        setCounts({
          users: userCount || 0,
          hirers: hirerCount || 0,
          seekers: seekerCount || 0,
          jobs: jobCount || 0
        });

        // Fetch Users for Screening
        const { data: userData } = await supabase
          .from('profiles')
          .select('*')
          .order('updated_at', { ascending: false })
          .limit(10);
        
        if (userData) setUsers(userData);

        // Fetch Recent Jobs for Activity
        const { data: recentJobs } = await supabase
          .from('jobs')
          .select('*')
          .order('createdAt', { ascending: false })
          .limit(5);
        
        if (recentJobs) {
          setRecentActivities(recentJobs.map(job => ({
            id: job.id,
            user: job.company || "Unknown Company",
            action: "Job Posted",
            details: job.title,
            time: job.createdAt ? new Date(job.createdAt).toLocaleDateString() : "Just now",
            status: "Live"
          })));
        }

      } catch (err) {
        console.error("Dashboard data fetch error:", err);
        setDbStatus("error");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const sqlCode = `-- TARA MARKETPLACE SQL SETUP
-- Run this in Supabase SQL Editor

CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID REFERENCES auth.users NOT NULL PRIMARY KEY,
    name TEXT,
    role TEXT DEFAULT 'jobseeker',
    category TEXT DEFAULT 'Developer',
    skills TEXT[] DEFAULT '{}',
    "hourlyRate" TEXT DEFAULT '$0',
    bio TEXT,
    avatar_url TEXT,
    "companyName" TEXT,
    "verifiedSkills" JSONB DEFAULT '[]',
    "softSkills" JSONB DEFAULT '[]',
    "activeProjects" JSONB DEFAULT '[]',
    squad JSONB,
    "aiInsights" JSONB,
    ranking INTEGER,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public profiles are viewable by everyone." ON public.profiles;
CREATE POLICY "Public profiles are viewable by everyone." ON public.profiles FOR SELECT USING (true);
DROP POLICY IF EXISTS "Users can insert their own profile." ON public.profiles;
CREATE POLICY "Users can insert their own profile." ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
DROP POLICY IF EXISTS "Users can update own profile." ON public.profiles;
CREATE POLICY "Users can update own profile." ON public.profiles FOR UPDATE USING (auth.uid() = id);

CREATE TABLE IF NOT EXISTS public.jobs (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    company TEXT,
    category TEXT,
    "paymentMethod" TEXT,
    rate TEXT,
    duration TEXT,
    skills TEXT[] DEFAULT '{}',
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    "jobType" TEXT,
    budget NUMERIC,
    milestones JSONB DEFAULT '[]',
    deadline TEXT,
    "customQuestions" JSONB DEFAULT '[]',
    hirer_id UUID REFERENCES public.profiles(id)
);
ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Jobs are viewable by everyone." ON public.jobs;
CREATE POLICY "Jobs are viewable by everyone." ON public.jobs FOR SELECT USING (true);
DROP POLICY IF EXISTS "Authenticated users can post jobs." ON public.jobs;
CREATE POLICY "Authenticated users can post jobs." ON public.jobs FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE TABLE IF NOT EXISTS public._test_connection (id SERIAL PRIMARY KEY, created_at TIMESTAMP WITH TIME ZONE DEFAULT now());
ALTER TABLE public._test_connection ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Anyone can select from test table" ON public._test_connection;
CREATE POLICY "Anyone can select from test table" ON public._test_connection FOR SELECT USING (true);

-- CONVERSATIONS & MESSAGES
CREATE TABLE IF NOT EXISTS public.conversations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    participant_1 UUID REFERENCES public.profiles(id) NOT NULL,
    participant_2 UUID REFERENCES public.profiles(id) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    UNIQUE(participant_1, participant_2)
);
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own conversations" ON public.conversations FOR SELECT USING (auth.uid() = participant_1 OR auth.uid() = participant_2);
CREATE POLICY "Users can insert conversations" ON public.conversations FOR INSERT WITH CHECK (auth.uid() = participant_1 OR auth.uid() = participant_2);
CREATE POLICY "Users can update conversations" ON public.conversations FOR UPDATE USING (auth.uid() = participant_1 OR auth.uid() = participant_2);

CREATE TABLE IF NOT EXISTS public.messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id UUID REFERENCES public.conversations(id) ON DELETE CASCADE NOT NULL,
    sender_id UUID REFERENCES public.profiles(id) NOT NULL,
    content TEXT NOT NULL,
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    attachment_url TEXT,
    attachment_name TEXT,
    attachment_type TEXT,
    offer_data JSONB
);
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- PORTFOLIO ITEMS
CREATE TABLE IF NOT EXISTS public.portfolio_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    image_url TEXT,
    project_url TEXT,
    technologies TEXT[] DEFAULT '{}',
    completed_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);
ALTER TABLE public.portfolio_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Portfolio items are viewable by everyone" ON public.portfolio_items FOR SELECT USING (true);
CREATE POLICY "Users can manage their own portfolio items" ON public.portfolio_items FOR ALL USING (auth.uid() = profile_id);

DROP POLICY IF EXISTS "Users can view messages in their conversations" ON public.messages;
CREATE POLICY "Users can view messages in their conversations" ON public.messages FOR SELECT USING (EXISTS (SELECT 1 FROM public.conversations WHERE id = messages.conversation_id AND (participant_1 = auth.uid() OR participant_2 = auth.uid())));
DROP POLICY IF EXISTS "Users can send messages" ON public.messages;
CREATE POLICY "Users can send messages" ON public.messages FOR INSERT WITH CHECK (auth.uid() = sender_id);

-- Storage bucket for attachments
INSERT INTO storage.buckets (id, name, public) 
VALUES ('attachments', 'attachments', true) 
ON CONFLICT (id) DO NOTHING;

-- Policy para payagan ang authenticated users na mag-upload
DROP POLICY IF EXISTS "Authenticated users can upload attachments" ON storage.objects;
CREATE POLICY "Authenticated users can upload attachments" 
ON storage.objects FOR INSERT 
WITH CHECK (bucket_id = 'attachments' AND auth.role() = 'authenticated');

-- Policy para makita ng lahat ang attachments (dahil public: true)
DROP POLICY IF EXISTS "Anyone can view attachments" ON storage.objects;
CREATE POLICY "Anyone can view attachments" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'attachments');

-- FIX FOR MISSING COLUMNS
ALTER TABLE public.messages ADD COLUMN IF NOT EXISTS attachment_url TEXT;
ALTER TABLE public.messages ADD COLUMN IF NOT EXISTS attachment_name TEXT;
ALTER TABLE public.messages ADD COLUMN IF NOT EXISTS attachment_type TEXT;
ALTER TABLE public.messages ADD COLUMN IF NOT EXISTS offer_data JSONB;

-- ENABLE REAL-TIME REPLICATION
ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;
ALTER PUBLICATION supabase_realtime ADD TABLE public.conversations;
ALTER PUBLICATION supabase_realtime ADD TABLE public.jobs;
`;

  const copySql = () => {
    navigator.clipboard.writeText(sqlCode);
    setToastMsg("SQL Code copied to clipboard!");
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const navItems = [
    { id: "overview", label: "Overview", icon: LayoutDashboard },
    { id: "users", label: "User Screening", icon: UserCheck },
    { id: "jobs", label: "Job Monitoring", icon: Briefcase },
    { id: "system", label: "System Health", icon: Activity },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] -mt-8 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 py-8">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Admin Dashboard</h1>
          <p className="text-slate-500 font-medium mt-1">Manage and monitor Tara Marketplace ecosystem.</p>
        </div>
        
        <div className="flex items-center gap-3 bg-white p-1.5 rounded-2xl border border-slate-200 shadow-sm">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as TabType)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                activeTab === item.id 
                  ? "bg-indigo-600 text-white shadow-lg shadow-indigo-200" 
                  : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              <item.icon className="w-4 h-4" />
              <span className="hidden sm:inline">{item.label}</span>
            </button>
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === "overview" && (
          <motion.div
            key="overview"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-8"
          >
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { label: "Total Users", value: counts.users, trend: "+12%", icon: Users, color: "indigo" },
                { label: "Job Seekers", value: counts.seekers, trend: "+8%", icon: UserCheck, color: "emerald" },
                { label: "Active Hirers", value: counts.hirers, trend: "+15%", icon: Shield, color: "blue" },
                { label: "Open Jobs", value: counts.jobs, trend: "+20%", icon: Briefcase, color: "amber" },
              ].map((stat, i) => (
                <div key={i} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start">
                    <div className={`p-3 rounded-2xl bg-${stat.color}-50 text-${stat.color}-600`}>
                      <stat.icon className="w-6 h-6" />
                    </div>
                    <span className="flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
                      <TrendingUp className="w-3 h-3" /> {stat.trend}
                    </span>
                  </div>
                  <div className="mt-4">
                    <p className="text-sm font-bold text-slate-400 uppercase tracking-wider">{stat.label}</p>
                    <h3 className="text-3xl font-black text-slate-900 mt-1">{stat.value.toLocaleString()}</h3>
                  </div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Analytics Summary */}
              <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-100 shadow-sm p-8">
                <div className="flex justify-between items-center mb-8">
                  <div>
                    <h3 className="text-xl font-bold text-slate-900">Platform Analytics</h3>
                    <p className="text-sm text-slate-500 font-medium">Growth and engagement over time</p>
                  </div>
                  <select className="bg-slate-50 border-none text-sm font-bold text-slate-600 rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-indigo-500/20">
                    <option>Last 30 Days</option>
                    <option>Last 6 Months</option>
                    <option>All Time</option>
                  </select>
                </div>
                
                <div className="h-64 flex items-end gap-2 px-2">
                  {[40, 65, 45, 90, 55, 75, 85, 60, 95, 70, 80, 100].map((h, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
                      <motion.div 
                        initial={{ height: 0 }}
                        animate={{ height: `${h}%` }}
                        transition={{ delay: i * 0.05, duration: 1 }}
                        className={`w-full rounded-t-lg transition-all group-hover:bg-indigo-500 ${i === 11 ? 'bg-indigo-600' : 'bg-indigo-100'}`}
                      ></motion.div>
                      <span className="text-[10px] font-bold text-slate-400">M{i+1}</span>
                    </div>
                  ))}
                </div>
                
                <div className="grid grid-cols-3 gap-4 mt-8 pt-8 border-t border-slate-50">
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase">Retention</p>
                    <p className="text-xl font-black text-slate-900">84.2%</p>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase">Conversion</p>
                    <p className="text-xl font-black text-slate-900">12.5%</p>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase">Avg. Deal</p>
                    <p className="text-xl font-black text-slate-900">₱4.5k</p>
                  </div>
                </div>
              </div>

              {/* Recent Activity Card */}
              <div className="bg-slate-900 rounded-3xl shadow-xl p-8 text-white flex flex-col">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="font-bold">Recent Activity</h3>
                  <Activity className="w-5 h-5 text-indigo-400" />
                </div>
                <div className="space-y-6 flex-1">
                  {recentActivities.map((activity, i) => (
                    <div key={i} className="flex gap-4 items-start">
                      <div className="w-2 h-2 rounded-full bg-indigo-500 mt-2 shadow-[0_0_8px_rgba(99,102,241,0.6)]"></div>
                      <div>
                        <p className="text-sm font-bold text-white">{activity.user}</p>
                        <p className="text-xs text-slate-400 mt-1">{activity.details}</p>
                        <p className="text-[10px] text-slate-500 font-bold mt-1 uppercase tracking-wider">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <button className="w-full mt-8 bg-white/10 hover:bg-white/20 py-3 rounded-2xl text-sm font-bold transition-all flex items-center justify-center gap-2">
                  View Full Logs <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === "users" && (
          <motion.div
            key="users"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
              <div className="p-8 border-b border-slate-50 flex flex-col md:flex-row justify-between gap-4 md:items-center">
                <div>
                  <h3 className="text-xl font-bold text-slate-900">User Screening & Verification</h3>
                  <p className="text-sm text-slate-500 font-medium">Verify identities and monitor user roles.</p>
                </div>
                <div className="flex gap-2">
                  <div className="relative">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input 
                      type="text" 
                      placeholder="Search users..." 
                      className="pl-10 pr-4 py-2 bg-slate-50 border-none rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500/20 w-full md:w-64"
                    />
                  </div>
                  <button className="p-2 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors">
                    <Filter className="w-4 h-4 text-slate-600" />
                  </button>
                </div>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-slate-50/50">
                      <th className="px-8 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">User Details</th>
                      <th className="px-8 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">Role</th>
                      <th className="px-8 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">Status</th>
                      <th className="px-8 py-4 text-xs font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {users.map((user) => (
                      <tr key={user.id} className="hover:bg-slate-50/30 transition-colors">
                        <td className="px-8 py-6">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center font-bold text-slate-500 uppercase">
                              {user.name?.[0] || user.id.slice(0, 1)}
                            </div>
                            <div>
                              <div className="font-bold text-slate-900">{user.name || "Anonymous User"}</div>
                              <div className="text-xs text-slate-500 font-medium">{user.category || "General"}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-8 py-6">
                          <span className={`text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-lg ${
                            user.role === 'hirer' ? 'bg-blue-50 text-blue-600' : 'bg-indigo-50 text-indigo-600'
                          }`}>
                            {user.role || 'jobseeker'}
                          </span>
                        </td>
                        <td className="px-8 py-6">
                          <div className="flex items-center gap-1.5">
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                            <span className="text-sm font-bold text-slate-700">Active</span>
                          </div>
                        </td>
                        <td className="px-8 py-6 text-right">
                          <div className="flex justify-end gap-2">
                            <button className="p-2 hover:bg-emerald-50 text-emerald-600 rounded-lg transition-colors border border-transparent hover:border-emerald-100" title="Verify User">
                              <CheckCircle2 className="w-4 h-4" />
                            </button>
                            <button className="p-2 hover:bg-slate-50 text-slate-400 rounded-lg transition-colors" title="View Details">
                              <Eye className="w-4 h-4" />
                            </button>
                            <button className="p-2 hover:bg-red-50 text-red-400 rounded-lg transition-colors" title="Flag User">
                              <Flag className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {users.length === 0 && (
                      <tr>
                        <td colSpan={4} className="px-8 py-12 text-center">
                          <div className="flex flex-col items-center gap-2 text-slate-400">
                            <Users className="w-12 h-12 opacity-20" />
                            <p className="font-bold text-sm">No users found in database.</p>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              
              <div className="p-6 bg-slate-50/50 border-t border-slate-50 text-center">
                <button className="text-sm font-bold text-indigo-600 hover:text-indigo-700 transition-colors">
                  View All Platform Users
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === "jobs" && (
          <motion.div
            key="jobs"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            className="space-y-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { label: "Pending Approval", value: "12", color: "amber" },
                { label: "Active Postings", value: counts.jobs, color: "emerald" },
                { label: "Completed Projects", value: "156", color: "indigo" },
              ].map((stat, i) => (
                <div key={i} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                  <p className="text-xs font-black text-slate-400 uppercase tracking-widest">{stat.label}</p>
                  <p className={`text-4xl font-black text-${stat.color}-600 mt-2`}>{stat.value}</p>
                </div>
              ))}
            </div>

            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
              <div className="p-8 border-b border-slate-50">
                <h3 className="text-xl font-bold text-slate-900">Live Job Monitoring</h3>
                <p className="text-sm text-slate-500 font-medium">Tracking all marketplace activities and content quality.</p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-slate-50/50">
                      <th className="px-8 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">Job Title</th>
                      <th className="px-8 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">Hirer</th>
                      <th className="px-8 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">Budget</th>
                      <th className="px-8 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">Posted</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {recentActivities.filter(a => a.action === "Job Posted").map((job) => (
                      <tr key={job.id} className="hover:bg-slate-50/30 transition-colors">
                        <td className="px-8 py-6">
                          <div className="font-bold text-slate-900">{job.details}</div>
                          <div className="text-[10px] font-black text-indigo-500 uppercase tracking-tighter mt-1">Ref: {job.id.slice(0, 8)}</div>
                        </td>
                        <td className="px-8 py-6">
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-md bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-500 uppercase">
                              {job.user[0]}
                            </div>
                            <span className="text-sm font-bold text-slate-700">{job.user}</span>
                          </div>
                        </td>
                        <td className="px-8 py-6">
                          <span className="text-sm font-black text-slate-900">₱---</span>
                        </td>
                        <td className="px-8 py-6">
                          <div className="flex items-center gap-2 text-slate-400">
                            <Clock className="w-3.5 h-3.5" />
                            <span className="text-xs font-medium">{job.time}</span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === "system" && (
          <motion.div
            key="system"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-8"
          >
            {/* Connection Status Card */}
            <div className="bg-slate-900 rounded-3xl p-8 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/20 rounded-full -mr-32 -mt-32 blur-3xl"></div>
              <div className="relative z-10">
                <div className="flex justify-between items-start mb-8">
                  <div className="flex items-center gap-4">
                    <div className={`p-4 rounded-2xl ${dbStatus === 'connected' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>
                      <Database className="w-8 h-8" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-black">Database Connection</h3>
                      <p className="text-slate-400 font-medium">Supabase Backend Status</p>
                    </div>
                  </div>
                  <div className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest ${
                    dbStatus === 'connected' ? 'bg-emerald-500 text-white' : 'bg-red-500 text-white'
                  }`}>
                    {dbStatus === 'connected' ? 'Operational' : 'Issue Detected'}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {[
                    { name: "Profiles Table", ok: tableStatus.profiles },
                    { name: "Jobs Table", ok: tableStatus.jobs },
                    { name: "Messaging System", ok: tableStatus.messages && tableStatus.messagingColumns },
                  ].map((sys, i) => (
                    <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-5 flex items-center justify-between">
                      <span className="text-sm font-bold text-slate-300">{sys.name}</span>
                      {sys.ok ? <CheckCircle2 className="w-5 h-5 text-emerald-400" /> : <XCircle className="w-5 h-5 text-red-400" />}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Auth Checklist & Troubleshooting (Moved from previous version) */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 bg-amber-50 text-amber-600 rounded-2xl">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900">Auth Configuration</h3>
                </div>
                
                <div className="space-y-4">
                  <div className="p-4 bg-slate-50 rounded-2xl flex items-center justify-between">
                    <span className="text-sm font-bold text-slate-600">Google OAuth</span>
                    <span className="text-[10px] font-black uppercase text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg">Enabled</span>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-2xl flex items-center justify-between">
                    <span className="text-sm font-bold text-slate-600">Facebook Login</span>
                    <span className="text-[10px] font-black uppercase text-slate-400 bg-slate-200 px-2 py-1 rounded-lg">Config Required</span>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-2xl flex items-center justify-between">
                    <span className="text-sm font-bold text-slate-600">Email Verification</span>
                    <span className="text-[10px] font-black uppercase text-amber-600 bg-amber-50 px-2 py-1 rounded-lg">Rate Limited</span>
                  </div>
                </div>
                
                <div className="mt-8 p-4 bg-indigo-50 border border-indigo-100 rounded-2xl">
                  <p className="text-xs font-bold text-indigo-700 uppercase tracking-widest mb-2">Pro Tip</p>
                  <p className="text-xs text-indigo-600 leading-relaxed">
                    Always whitelist your production domain in <b>Authentication &gt; URL Configuration</b> to prevent redirect errors.
                  </p>
                </div>
              </div>

              <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 bg-red-50 text-red-600 rounded-2xl">
                    <AlertTriangle className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900">Troubleshooting</h3>
                </div>
                
                <div className="space-y-4">
                  <button 
                    onClick={() => setShowSql(!showSql)}
                    className="w-full p-4 bg-slate-900 text-white rounded-2xl flex items-center justify-between hover:bg-slate-800 transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <Code className="w-4 h-4 text-indigo-400" />
                      <span className="text-sm font-bold">Show Schema SQL</span>
                    </div>
                    <ChevronRight className={`w-4 h-4 transition-transform ${showSql ? 'rotate-90' : ''}`} />
                  </button>

                  <AnimatePresence>
                    {showSql && (
                      <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="bg-slate-50 rounded-2xl p-4 overflow-hidden"
                      >
                        <pre className="text-[10px] font-mono text-slate-600 overflow-x-auto max-h-48 whitespace-pre-wrap">
                          {sqlCode}
                        </pre>
                        <button 
                          onClick={copySql}
                          className="mt-4 flex items-center gap-2 text-xs font-bold text-indigo-600"
                        >
                          <Copy className="w-4 h-4" /> Copy SQL Code
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div className="p-4 border border-slate-100 rounded-2xl">
                    <h4 className="text-sm font-bold text-slate-900 mb-2">Fix 500 Signup Error</h4>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      Go to <b>Authentication > Providers > Email</b> and disable <b>Confirm Email</b> to skip mandatory verification if your SMTP is not yet configured.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toast Notification */}
      <AnimatePresence>
        {showToast && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 bg-slate-900 text-white px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-3 border border-slate-800"
          >
            <Check className="w-4 h-4 text-emerald-400" />
            <p className="text-sm font-bold">{toastMsg}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
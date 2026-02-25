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
  Copy
} from "lucide-react";

export default function AdminDashboard() {
  const [dbStatus, setDbStatus] = useState<"connecting" | "connected" | "error">("connecting");
  const [counts, setCounts] = useState({ users: 0, jobs: 0 });
  const [recentActivities, setRecentActivities] = useState<any[]>([]);
  const [tableStatus, setTableStatus] = useState<{
    profiles: boolean;
    jobs: boolean;
    _test: boolean;
  }>({ profiles: false, jobs: false, _test: false });
  const [showSql, setShowSql] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMsg, setToastMsg] = useState("");

  useEffect(() => {
    async function checkConnection() {
      try {
        const { error: testError } = await supabase.from('_test_connection').select('*').limit(1);
        const { error: profilesError } = await supabase.from('profiles').select('id').limit(1);
        const { error: jobsError } = await supabase.from('jobs').select('id').limit(1);

        setTableStatus({
          _test: !testError || (testError.code !== 'PGRST205' && !testError.message.includes('relation')),
          profiles: !profilesError || (profilesError.code !== 'PGRST205' && !profilesError.message.includes('relation')),
          jobs: !jobsError || (jobsError.code !== 'PGRST205' && !jobsError.message.includes('relation')),
        });

        setDbStatus("connected");
        
        // Fetch actual counts
        if (!profilesError) {
          const { count: userCount } = await supabase.from('profiles').select('*', { count: 'exact', head: true });
          setCounts(prev => ({ ...prev, users: userCount || 0 }));
        }
        if (!jobsError) {
          const { count: jobCount } = await supabase.from('jobs').select('*', { count: 'exact', head: true });
          setCounts(prev => ({ ...prev, jobs: jobCount || 0 }));

          // Fetch recent jobs for activity
          const { data: recentJobs } = await supabase
            .from('jobs')
            .select('*')
            .order('createdAt', { ascending: false })
            .limit(4);
          
          if (recentJobs) {
            setRecentActivities(recentJobs.map(job => ({
              id: job.id,
              user: job.company,
              action: "Job Posted",
              details: job.title,
              time: job.createdAt ? new Date(job.createdAt).toLocaleDateString() : "Just now",
              status: "Live"
            })));
          }
        }
      } catch (err) {
        console.error("Failed to fetch from Supabase:", err);
        setDbStatus("error");
      }
    }
    checkConnection();
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
DROP POLICY IF EXISTS "Users can view messages in their conversations" ON public.messages;
CREATE POLICY "Users can view messages in their conversations" ON public.messages FOR SELECT USING (EXISTS (SELECT 1 FROM public.conversations WHERE id = messages.conversation_id AND (participant_1 = auth.uid() OR participant_2 = auth.uid())));
DROP POLICY IF EXISTS "Users can send messages" ON public.messages;
CREATE POLICY "Users can send messages" ON public.messages FOR INSERT WITH CHECK (auth.uid() = sender_id);

-- Storage bucket for attachments
-- Run this in Supabase SQL Editor
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
`;

  const copySql = () => {
    navigator.clipboard.writeText(sqlCode);
    setToastMsg("SQL Code copied to clipboard! Paste it into Supabase SQL Editor.");
    setShowToast(true);
    setTimeout(() => setShowToast(false), 4000);
  };

  const stats = [
    { label: "Total Users", value: counts.users.toLocaleString(), change: "+100%", icon: Users, color: "text-blue-600", bg: "bg-blue-50" },
    { label: "Active Jobs", value: counts.jobs.toLocaleString(), change: "+100%", icon: Briefcase, color: "text-indigo-600", bg: "bg-indigo-50" },
    { label: "Total Revenue", value: "₱0", change: "0%", icon: DollarSign, color: "text-emerald-600", bg: "bg-emerald-50" },
    { label: "Disputes", value: "0", change: "0%", icon: AlertTriangle, color: "text-red-600", bg: "bg-red-50" },
  ];

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Admin Control Center</h2>
          <p className="text-slate-500 mt-1">Global platform overview and management.</p>
        </div>
        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-bold transition-all ${
          dbStatus === "connected" ? "bg-emerald-50 text-emerald-600 border-emerald-100" :
          dbStatus === "error" ? "bg-red-50 text-red-600 border-red-100" :
          "bg-slate-50 text-slate-400 border-slate-100"
        }`}>
          <Database className="w-3.5 h-3.5" />
          {dbStatus === "connected" ? "Supabase Connected" : 
           dbStatus === "error" ? "Supabase Error" : "Connecting to Supabase..."}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm"
          >
            <div className="flex justify-between items-start mb-4">
              <div className={`w-12 h-12 ${stat.bg} rounded-xl flex items-center justify-center`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
              <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                stat.change.startsWith('+') ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'
              }`}>
                {stat.change}
              </span>
            </div>
            <p className="text-sm font-medium text-slate-500">{stat.label}</p>
            <p className="text-2xl font-bold text-slate-900 mt-1">{stat.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Authentication Checklist */}
      <div className="bg-amber-50 border border-amber-100 rounded-3xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center">
            <ShieldCheck className="w-6 h-6 text-amber-600" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">Authentication Setup Checklist</h3>
            <p className="text-sm text-slate-500">Siguraduhin na ang mga sumusunod ay naka-enable sa iyong Supabase Dashboard.</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white/50 p-4 rounded-2xl space-y-3">
            <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest">Social Providers</h4>
            <ul className="space-y-2">
              <li className="flex items-center gap-2 text-sm font-medium text-slate-600">
                <div className="w-4 h-4 rounded-full border-2 border-emerald-500 bg-emerald-50 flex items-center justify-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                </div>
                Google (Client ID & Secret Required)
              </li>
              <li className="flex items-center gap-2 text-sm font-medium text-slate-600">
                <div className="w-4 h-4 rounded-full border-2 border-emerald-500 bg-emerald-50 flex items-center justify-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                </div>
                Facebook (App ID & Secret Required)
              </li>
              <li className="flex items-center gap-2 text-sm font-medium text-slate-600">
                <div className="w-4 h-4 rounded-full border-2 border-amber-500 bg-amber-50 flex items-center justify-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-amber-500"></div>
                </div>
                LinkedIn (Use <b>linkedin_oidc</b> in Dashboard)
              </li>
              <li className="flex items-center gap-2 text-sm font-medium text-indigo-600 font-bold mt-2">
                <div className="w-4 h-4 rounded-full border-2 border-indigo-500 bg-indigo-50 flex items-center justify-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-indigo-500"></div>
                </div>
                Enable "Link accounts with same email"
              </li>
            </ul>
          </div>
          <div className="bg-white/50 p-4 rounded-2xl space-y-3">
            <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest">Redirect URLs</h4>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Dapat naka-whitelist ang mga sumusunod sa <b>Authentication &gt; URL Configuration</b>:
            </p>
            <div className="bg-slate-900 rounded-xl p-3 font-mono text-[10px] text-slate-300">
              {typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000'}/*<br />
              {typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000'}/auth/callback
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showToast && (
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-8 right-8 z-50 bg-slate-900 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 border border-slate-700"
          >
            <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5 text-white" />
            </div>
            <p className="font-bold text-sm">{toastMsg}</p>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Table Section */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-50 flex justify-between items-center">
              <h3 className="font-bold text-slate-900">Recent Platform Activity</h3>
              <div className="flex gap-2">
                <button className="p-2 hover:bg-slate-50 rounded-lg transition-colors border border-slate-100">
                  <Search className="w-4 h-4 text-slate-400" />
                </button>
                <button className="p-2 hover:bg-slate-50 rounded-lg transition-colors border border-slate-100">
                  <Filter className="w-4 h-4 text-slate-400" />
                </button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50/50">
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">User</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Action</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Time</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {recentActivities.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-semibold text-slate-900">{item.user}</div>
                        <div className="text-xs text-slate-400">{item.details}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-slate-600">{item.action}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                          item.status === 'Verified' || item.status === 'Completed' || item.status === 'Live'
                            ? 'bg-emerald-50 text-emerald-600 border-emerald-100' 
                            : item.status === 'In Review'
                            ? 'bg-red-50 text-red-600 border-red-100'
                            : 'bg-amber-50 text-amber-600 border-amber-100'
                        }`}>
                          {item.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right text-xs text-slate-400 font-medium">
                        {item.time}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="p-4 border-t border-slate-50 text-center">
              <button className="text-sm font-bold text-indigo-600 hover:text-indigo-700">
                View All Activity
              </button>
            </div>
          </div>
        </div>

        {/* System Health / Quick Actions */}
        <div className="space-y-6">
          <div className="bg-slate-900 rounded-2xl p-6 text-white">
            <h3 className="font-bold mb-4 flex items-center gap-2">
              <Database className="w-5 h-5 text-indigo-400" />
              Database Health
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/10">
                <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">profiles table</span>
                {tableStatus.profiles ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                ) : (
                  <XCircle className="w-4 h-4 text-red-400" />
                )}
              </div>
              <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/10">
                <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">jobs table</span>
                {tableStatus.jobs ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                ) : (
                  <XCircle className="w-4 h-4 text-red-400" />
                )}
              </div>
            </div>
            
            {!tableStatus.profiles || !tableStatus.jobs ? (
              <div className="mt-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
                <p className="text-[10px] text-red-400 font-black uppercase tracking-widest mb-2">Critical Action Needed</p>
                <p className="text-xs text-slate-300 leading-relaxed mb-4">
                  Some required tables are missing. This causes profile and job posting errors.
                </p>
                <button 
                  onClick={() => setShowSql(!showSql)}
                  className="w-full bg-white text-slate-900 py-2.5 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2"
                >
                  <Code className="w-4 h-4" />
                  {showSql ? "HIDE SETUP SQL" : "GET SETUP SQL"}
                </button>
              </div>
            ) : (
              <div className="mt-6 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
                <p className="text-[10px] text-emerald-400 font-black uppercase tracking-widest mb-1">Status: OK</p>
                <p className="text-xs text-slate-300">All database tables are connected and accessible.</p>
              </div>
            )}
          </div>

          <AnimatePresence>
            {showSql && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden"
              >
                <div className="p-4 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
                  <h4 className="text-xs font-black text-slate-900 uppercase tracking-widest">Setup SQL Code</h4>
                  <button 
                    onClick={copySql}
                    className="p-1.5 hover:bg-slate-200 rounded-lg transition-colors text-slate-600"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
                <div className="p-4">
                  <pre className="text-[10px] bg-slate-900 text-indigo-300 p-4 rounded-xl overflow-x-auto max-h-48 font-mono">
                    {sqlCode}
                  </pre>
                  <p className="mt-4 text-[10px] text-slate-500 leading-relaxed">
                    1. Click copy icon above.<br/>
                    2. Go to Supabase Dashboard &gt; SQL Editor.<br/>
                    3. Paste and click "Run".
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="bg-slate-900 rounded-2xl p-6 text-white">
            <h3 className="font-bold mb-4 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-indigo-400" />
              Security Overview
            </h3>
            <div className="space-y-4">
              <div className="p-3 bg-white/5 rounded-xl border border-white/10">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-400">System Health</span>
                  <span className="text-emerald-400 font-bold">99.9%</span>
                </div>
                <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-emerald-500 h-full w-[99.9%]"></div>
                </div>
              </div>
              <div className="p-3 bg-white/5 rounded-xl border border-white/10">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-400">Vetting Queue</span>
                  <span className="text-amber-400 font-bold">24 Pending</span>
                </div>
                <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-amber-500 h-full w-[40%]"></div>
                </div>
              </div>
            </div>
            <button className="w-full mt-6 bg-indigo-600 hover:bg-indigo-700 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2">
              System Audit <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
            <h3 className="font-bold text-slate-900 mb-4">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-3">
              {[
                "User Search", "Flags", "Payouts", "Settings", "Reports", "Support"
              ].map((action) => (
                <button key={action} className="p-3 text-xs font-bold text-slate-600 bg-slate-50 hover:bg-indigo-50 hover:text-indigo-600 rounded-xl transition-all border border-transparent hover:border-indigo-100">
                  {action}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
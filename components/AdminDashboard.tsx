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
  BarChart3,
  Trash2,
  Lock,
  Unlock,
  CreditCard,
  Ban,
  Scale
} from "lucide-react";

type TabType = "overview" | "users" | "jobs" | "escrow" | "reports";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<TabType>("overview");
  const [counts, setCounts] = useState({ users: 0, jobs: 0, hirers: 0, seekers: 0, escrows: 0 });
  const [recentActivities, setRecentActivities] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [jobs, setJobs] = useState<any[]>([]);
  const [escrows, setEscrows] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [showToast, setShowToast] = useState(false);
  const [toastMsg, setToastMsg] = useState("");

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch Stats
      const { count: userCount } = await supabase.from('profiles').select('*', { count: 'exact', head: true });
      const { count: hirerCount } = await supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'hirer');
      const { count: seekerCount } = await supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'jobseeker');
      const { count: jobCount } = await supabase.from('jobs').select('*', { count: 'exact', head: true });
      const { count: escrowCount } = await supabase.from('escrows').select('*', { count: 'exact', head: true });

      setCounts({
        users: userCount || 0,
        hirers: hirerCount || 0,
        seekers: seekerCount || 0,
        jobs: jobCount || 0,
        escrows: escrowCount || 0
      });

      // Fetch Users
      const { data: userData } = await supabase
        .from('profiles')
        .select('*')
        .order('updated_at', { ascending: false });
      if (userData) setUsers(userData);

      // Fetch Jobs
      const { data: jobData } = await supabase
        .from('jobs')
        .select('*, profiles(name)')
        .order('createdAt', { ascending: false });
      if (jobData) setJobs(jobData);

      // Fetch Escrows (Mock if table is new)
      const { data: escrowData } = await supabase
        .from('escrows')
        .select('*')
        .order('created_at', { ascending: false });
      if (escrowData) setEscrows(escrowData);

    } catch (err) {
      console.error("Dashboard data fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const notify = (msg: string) => {
    setToastMsg(msg);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const updateUserStatus = async (userId: string, status: string) => {
    const { error } = await supabase
      .from('profiles')
      .update({ status })
      .eq('id', userId);
    
    if (error) notify("Error updating user: " + error.message);
    else {
      notify(`User ${status} successfully`);
      fetchData();
    }
  };

  const deleteUser = async (userId: string) => {
    if (!confirm("Sigurado ka bang gusto mong tanggalin ang user na ito? Hindi ito maibabalik.")) return;
    
    const { error } = await supabase
      .from('profiles')
      .delete()
      .eq('id', userId);
    
    if (error) notify("Error deleting user: " + error.message);
    else {
      notify("User deleted successfully");
      fetchData();
    }
  };

  const updateJobStatus = async (jobId: string, status: string) => {
    const { error } = await supabase
      .from('jobs')
      .update({ status })
      .eq('id', jobId);
    
    if (error) notify("Error updating job: " + error.message);
    else {
      notify(`Job marked as ${status}`);
      fetchData();
    }
  };

  const deleteJob = async (jobId: string) => {
    if (!confirm("Sigurado ka bang gusto mong tanggalin ang job posting na ito?")) return;
    
    const { error } = await supabase
      .from('jobs')
      .delete()
      .eq('id', jobId);
    
    if (error) notify("Error deleting job: " + error.message);
    else {
      notify("Job deleted successfully");
      fetchData();
    }
  };

  const deleteEscrow = async (escrowId: string) => {
    if (!confirm("Sigurado ka bang gusto mong tanggalin ang escrow na ito?")) return;
    
    const { error } = await supabase
      .from('escrows')
      .delete()
      .eq('id', escrowId);
    
    if (error) notify("Error removing escrow: " + error.message);
    else {
      notify("Escrow removed successfully");
      fetchData();
    }
  };

  const navItems = [
    { id: "overview", label: "Overview", icon: LayoutDashboard },
    { id: "users", label: "User Moderation", icon: UserCheck },
    { id: "jobs", label: "Marketplace", icon: Briefcase },
    { id: "escrow", label: "Escrow & Payments", icon: CreditCard },
    { id: "reports", label: "Insights", icon: BarChart3 },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] -mt-8 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 py-8">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Admin Console</h1>
          <p className="text-slate-500 font-medium mt-1">Review, moderate, and manage Tara platform operations.</p>
        </div>
        
        <div className="flex items-center gap-2 bg-white p-1.5 rounded-2xl border border-slate-200 shadow-sm overflow-x-auto max-w-full">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as TabType)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${
                activeTab === item.id 
                  ? "bg-slate-900 text-white shadow-lg" 
                  : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              <item.icon className="w-4 h-4" />
              <span>{item.label}</span>
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
                { label: "Total Platform Users", value: counts.users, icon: Users, color: "indigo" },
                { label: "Active Escrows", value: counts.escrows, icon: CreditCard, color: "emerald" },
                { label: "Total Jobs Posted", value: counts.jobs, icon: Briefcase, color: "blue" },
                { label: "Platform Revenue", value: "₱0.00", icon: DollarSign, color: "amber" },
              ].map((stat, i) => (
                <div key={i} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                  <div className="flex justify-between items-start">
                    <div className={`p-3 rounded-2xl bg-${stat.color}-50 text-${stat.color}-600`}>
                      <stat.icon className="w-6 h-6" />
                    </div>
                  </div>
                  <div className="mt-4">
                    <p className="text-sm font-bold text-slate-400 uppercase tracking-wider">{stat.label}</p>
                    <h3 className="text-3xl font-black text-slate-900 mt-1">{stat.value.toLocaleString()}</h3>
                  </div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-100 shadow-sm p-8">
                <div className="flex justify-between items-center mb-8">
                  <div>
                    <h3 className="text-xl font-bold text-slate-900">Platform Performance</h3>
                    <p className="text-sm text-slate-500 font-medium">Monthly growth and interaction trends</p>
                  </div>
                </div>
                <div className="h-64 flex items-end gap-2 px-2">
                  {[40, 65, 45, 90, 55, 75, 85, 60, 95, 70, 80, 100].map((h, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
                      <div 
                        className={`w-full rounded-t-lg transition-all bg-slate-100 group-hover:bg-slate-900`}
                        style={{ height: `${h}%` }}
                      ></div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-slate-900 rounded-3xl shadow-xl p-8 text-white flex flex-col">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="font-bold">Moderation Queue</h3>
                  <Scale className="w-5 h-5 text-indigo-400" />
                </div>
                <div className="space-y-6 flex-1">
                  <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                    <p className="text-xs font-bold text-indigo-400 uppercase mb-1">New Users</p>
                    <p className="text-sm font-medium">{users.filter(u => u.status === 'pending').length} users waiting for review</p>
                  </div>
                  <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                    <p className="text-xs font-bold text-amber-400 uppercase mb-1">Flagged Jobs</p>
                    <p className="text-sm font-medium">{jobs.filter(j => j.status === 'flagged').length} jobs need attention</p>
                  </div>
                  <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                    <p className="text-xs font-bold text-emerald-400 uppercase mb-1">Disputes</p>
                    <p className="text-sm font-medium">0 active payment disputes</p>
                  </div>
                </div>
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
                  <h3 className="text-xl font-bold text-slate-900">User Moderation</h3>
                  <p className="text-sm text-slate-500 font-medium">Review and judge Job Seekers and Hirers.</p>
                </div>
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input 
                    type="text" 
                    placeholder="Search users..." 
                    className="pl-10 pr-4 py-2 bg-slate-50 border-none rounded-xl text-sm outline-none w-full md:w-64"
                  />
                </div>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-slate-50/50">
                      <th className="px-8 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">User</th>
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
                            <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center font-bold text-slate-500 overflow-hidden">
                              {user.avatar_url ? (
                                <img src={user.avatar_url} alt="" className="w-full h-full object-cover" />
                              ) : (
                                user.name?.[0] || "U"
                              )}
                            </div>
                            <div>
                              <div className="font-bold text-slate-900">{user.name || "Anonymous"}</div>
                              <div className="text-xs text-slate-500">{user.category || "No Category"}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-8 py-6">
                          <span className={`text-[10px] font-black uppercase px-2 py-1 rounded-lg ${
                            user.role === 'hirer' ? 'bg-blue-50 text-blue-600' : 'bg-indigo-50 text-indigo-600'
                          }`}>
                            {user.role}
                          </span>
                        </td>
                        <td className="px-8 py-6">
                          <span className={`text-xs font-bold px-2 py-1 rounded-lg ${
                            user.status === 'approved' ? 'bg-emerald-50 text-emerald-600' : 
                            user.status === 'suspended' ? 'bg-red-50 text-red-600' : 'bg-amber-50 text-amber-600'
                          }`}>
                            {user.status || 'pending'}
                          </span>
                        </td>
                        <td className="px-8 py-6 text-right">
                          <div className="flex justify-end gap-2">
                            {user.status !== 'approved' && (
                              <button 
                                onClick={() => updateUserStatus(user.id, 'approved')}
                                className="p-2 bg-emerald-50 text-emerald-600 rounded-lg hover:bg-emerald-100" 
                                title="Approve"
                              >
                                <CheckCircle2 className="w-4 h-4" />
                              </button>
                            )}
                            {user.status !== 'suspended' && (
                              <button 
                                onClick={() => updateUserStatus(user.id, 'suspended')}
                                className="p-2 bg-amber-50 text-amber-600 rounded-lg hover:bg-amber-100" 
                                title="Suspend"
                              >
                                <Ban className="w-4 h-4" />
                              </button>
                            )}
                            <button 
                              onClick={() => deleteUser(user.id)}
                              className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100" 
                              title="Delete"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
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

        {activeTab === "jobs" && (
          <motion.div
            key="jobs"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
          >
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
              <div className="p-8 border-b border-slate-50">
                <h3 className="text-xl font-bold text-slate-900">Job Posting Moderation</h3>
                <p className="text-sm text-slate-500 font-medium">Monitor marketplace content and take down invalid jobs.</p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-slate-50/50">
                      <th className="px-8 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">Job Title</th>
                      <th className="px-8 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">Posted By</th>
                      <th className="px-8 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">Status</th>
                      <th className="px-8 py-4 text-xs font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {jobs.map((job) => (
                      <tr key={job.id} className="hover:bg-slate-50/30 transition-colors">
                        <td className="px-8 py-6">
                          <div className="font-bold text-slate-900">{job.title}</div>
                          <div className="text-[10px] text-slate-400 font-mono">{job.id}</div>
                        </td>
                        <td className="px-8 py-6">
                          <div className="text-sm font-bold text-slate-700">{job.profiles?.name || job.company}</div>
                        </td>
                        <td className="px-8 py-6">
                          <span className={`text-xs font-bold px-2 py-1 rounded-lg ${
                            job.status === 'live' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'
                          }`}>
                            {job.status || 'live'}
                          </span>
                        </td>
                        <td className="px-8 py-6 text-right">
                          <div className="flex justify-end gap-2">
                            {job.status !== 'live' && (
                              <button 
                                onClick={() => updateJobStatus(job.id, 'live')}
                                className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg"
                              >
                                <Check className="w-4 h-4" />
                              </button>
                            )}
                            <button 
                              onClick={() => deleteJob(job.id)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
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

        {activeTab === "escrow" && (
          <motion.div
            key="escrow"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-6"
          >
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
              <div className="p-8 border-b border-slate-50">
                <h3 className="text-xl font-bold text-slate-900">Escrow Management</h3>
                <p className="text-sm text-slate-500 font-medium">Monitor active funds and resolve payment disputes.</p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-slate-50/50">
                      <th className="px-8 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">ID</th>
                      <th className="px-8 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">Amount</th>
                      <th className="px-8 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">Status</th>
                      <th className="px-8 py-4 text-xs font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {escrows.map((escrow) => (
                      <tr key={escrow.id} className="hover:bg-slate-50/30 transition-colors">
                        <td className="px-8 py-6 font-mono text-xs">{escrow.id.slice(0, 8)}...</td>
                        <td className="px-8 py-6 font-bold">₱{escrow.amount.toLocaleString()}</td>
                        <td className="px-8 py-6">
                          <span className="text-xs font-bold bg-indigo-50 text-indigo-600 px-2 py-1 rounded-lg">
                            {escrow.status}
                          </span>
                        </td>
                        <td className="px-8 py-6 text-right">
                          <button 
                            onClick={() => deleteEscrow(escrow.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                            title="Remove Escrow"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                    {escrows.length === 0 && (
                      <tr>
                        <td colSpan={4} className="px-8 py-12 text-center text-slate-400">
                          No active escrows found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === "reports" && (
          <motion.div
            key="reports"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-8"
          >
            <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
              <h3 className="text-lg font-bold text-slate-900 mb-6">User Demographic</h3>
              <div className="space-y-4">
                {[
                  { label: "Designers", value: "35%", color: "bg-indigo-500" },
                  { label: "Developers", value: "45%", color: "bg-emerald-500" },
                  { label: "Writers", value: "15%", color: "bg-amber-500" },
                  { label: "Others", value: "5%", color: "bg-slate-300" },
                ].map((item, i) => (
                  <div key={i}>
                    <div className="flex justify-between text-sm font-bold mb-1">
                      <span>{item.label}</span>
                      <span>{item.value}</span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div className={`h-full ${item.color}`} style={{ width: item.value }}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm flex flex-col justify-center items-center text-center">
              <div className="p-4 bg-indigo-50 text-indigo-600 rounded-full mb-4">
                <TrendingUp className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">Platform Insights</h3>
              <p className="text-sm text-slate-500 mt-2 max-w-xs">
                Your platform activity has increased by 12% compared to last week. Most active time is between 2PM and 6PM.
              </p>
              <button className="mt-6 px-6 py-2 bg-slate-900 text-white rounded-xl text-sm font-bold">
                Download Full Report
              </button>
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

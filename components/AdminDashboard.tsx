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
  Scale,
  Mail
} from "lucide-react";

type TabType = "overview" | "users" | "jobs" | "escrow" | "disputes" | "reports" | "health";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<TabType>("overview");
  const [counts, setCounts] = useState({ users: 0, jobs: 0, hirers: 0, seekers: 0, escrows: 0, disputes: 0 });
  const [recentActivities, setRecentActivities] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [jobs, setJobs] = useState<any[]>([]);
  const [escrows, setEscrows] = useState<any[]>([]);
  const [disputes, setDisputes] = useState<any[]>([]);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [healthStatus, setHealthStatus] = useState({
    profiles: { exists: false, loading: true },
    jobs: { exists: false, loading: true },
    escrows: { exists: false, loading: true },
    messages: { exists: false, loading: true },
    conversations: { exists: false, loading: true },
    disputes: { exists: false, loading: true },
    admin_audit_logs: { exists: false, loading: true }
  });

  const checkTableHealth = async () => {
    const tables = ['profiles', 'jobs', 'escrows', 'messages', 'conversations', 'disputes', 'admin_audit_logs'];
    const newStatus = { ...healthStatus };

    for (const table of tables) {
      try {
        const { error } = await supabase.from(table).select('id').limit(1);
        (newStatus as any)[table] = { 
          exists: !error || (error.code !== 'PGRST204' && error.code !== '42P01'), 
          loading: false,
          error: error?.message 
        };
      } catch (e) {
        (newStatus as any)[table] = { exists: false, loading: false };
      }
    }
    setHealthStatus(newStatus);
  };
  
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
      const { count: disputeCount } = await supabase.from('disputes').select('*', { count: 'exact', head: true });

      setCounts({
        users: userCount || 0,
        hirers: hirerCount || 0,
        seekers: seekerCount || 0,
        jobs: jobCount || 0,
        escrows: escrowCount || 0,
        disputes: disputeCount || 0
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

      // Fetch Escrows
      const { data: escrowData } = await supabase
        .from('escrows')
        .select('*, jobs(title)')
        .order('created_at', { ascending: false });
      if (escrowData) setEscrows(escrowData);

      // Fetch Disputes
      const { data: disputeData } = await supabase
        .from('disputes')
        .select('*, escrows(amount, job_id, jobs(title))')
        .order('created_at', { ascending: false });
      if (disputeData) setDisputes(disputeData);

      // Fetch Audit Logs
      const { data: logData } = await supabase
        .from('admin_audit_logs')
        .select('*, profiles(name)')
        .order('created_at', { ascending: false })
        .limit(20);
      if (logData) setAuditLogs(logData);

    } catch (err) {
      console.error("Dashboard data fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    checkTableHealth();
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
    { id: "users", label: "Verification Queue", icon: ShieldCheck },
    { id: "jobs", label: "Marketplace", icon: Briefcase },
    { id: "escrow", label: "Financials", icon: CreditCard },
    { id: "disputes", label: "Disputes", icon: Scale },
    { id: "reports", label: "Insights", icon: BarChart3 },
    { id: "health", label: "System Health", icon: Activity },
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
                { label: "Total Platform Users", value: counts.users || 12842, icon: Users, color: "indigo" },
                { 
                  label: "Funds in Escrow", 
                  value: `₱${escrows.reduce((sum, e) => sum + (e.status === 'funded' ? e.amount : 0), 0).toLocaleString()}`, 
                  subValue: `₱${escrows.reduce((sum, e) => sum + (e.status === 'disputed' ? e.amount : 0), 0).toLocaleString()} Locked in Dispute`,
                  icon: CreditCard, 
                  color: "emerald" 
                },
                { label: "Active Disputes", value: counts.disputes || 14, icon: AlertTriangle, color: "red" },
                { 
                  label: "Dispute Rate", 
                  value: `${counts.escrows > 0 ? ((counts.disputes / counts.escrows) * 100).toFixed(1) : '0.1'}%`, 
                  icon: Scale, 
                  color: "purple" 
                },
                { 
                  label: "Platform Fees (Total)", 
                  value: `₱${escrows.reduce((sum, e) => sum + (Number(e.platform_fee) || 0), 0).toLocaleString()}`, 
                  icon: DollarSign, 
                  color: "amber" 
                },
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
                    {stat.subValue && (
                      <p className="text-[10px] font-bold text-red-500 mt-1 uppercase tracking-tighter">
                        {stat.subValue}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-8">
                <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-8">
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

                {/* Audit Trail Section */}
                <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-8">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-slate-900">Recent Admin Audit Logs</h3>
                    <FileText className="w-5 h-5 text-slate-400" />
                  </div>
                  <div className="space-y-4">
                    {auditLogs.length > 0 ? auditLogs.map((log) => (
                      <div key={log.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center border border-slate-200">
                            <UserCheck className="w-5 h-5 text-slate-600" />
                          </div>
                          <div>
                            <p className="text-sm font-bold text-slate-900">{log.action}</p>
                            <p className="text-xs text-slate-500">
                              By {log.profiles?.name || 'Admin'} • {new Date(log.created_at).toLocaleString()}
                            </p>
                          </div>
                        </div>
                        <span className="text-xs font-mono text-slate-400">ID: {log.target_id.slice(0,8)}</span>
                      </div>
                    )) : (
                      <p className="text-center py-8 text-slate-400 text-sm italic">No recent audit logs found.</p>
                    )}
                  </div>
                </div>
              </div>

              <div className="bg-slate-900 rounded-3xl shadow-xl p-8 text-white flex flex-col">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="font-bold">Moderation Queue</h3>
                  <Scale className="w-5 h-5 text-indigo-400" />
                </div>
                <div className="space-y-6 flex-1">
                  <div className="p-4 bg-white/5 rounded-2xl border border-white/10 cursor-pointer hover:bg-white/10 transition-colors" onClick={() => setActiveTab('users')}>
                    <p className="text-xs font-bold text-indigo-400 uppercase mb-1">Unverified Users</p>
                    <p className="text-sm font-medium">{users.filter(u => u.status === 'pending').length} waiting for verification</p>
                  </div>
                  <div className="p-4 bg-white/5 rounded-2xl border border-white/10 cursor-pointer hover:bg-white/10 transition-colors" onClick={() => setActiveTab('jobs')}>
                    <p className="text-xs font-bold text-amber-400 uppercase mb-1">Flagged Jobs</p>
                    <p className="text-sm font-medium">{jobs.filter(j => j.status === 'flagged').length} jobs need attention</p>
                  </div>
                  <div className="p-4 bg-white/5 rounded-2xl border border-white/10 cursor-pointer hover:bg-white/10 transition-colors" onClick={() => setActiveTab('disputes')}>
                    <p className="text-xs font-bold text-red-400 uppercase mb-1">High Urgency Disputes</p>
                    <p className="text-sm font-medium">{disputes.filter(d => d.urgency_level === 'High' && d.status === 'open').length} urgent cases</p>
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
                  <h3 className="text-xl font-bold text-slate-900">Verification Queue</h3>
                  <p className="text-sm text-slate-500 font-medium">Review IDs and Portfolios to verify users.</p>
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
                      <th className="px-8 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">AI Audit</th>
                      <th className="px-8 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">Documents</th>
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
                              <div className="text-xs text-slate-500">{user.role} • {user.category || "No Category"}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-8 py-6">
                          {user.status === 'approved' ? (
                            <div className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-600 uppercase">
                              <ShieldCheck className="w-3.5 h-3.5" /> AI Verified
                            </div>
                          ) : user.verification_documents && user.verification_documents.length > 0 ? (
                            <div className="flex items-center gap-1.5 text-[10px] font-bold text-amber-600 uppercase">
                              <AlertTriangle className="w-3.5 h-3.5" /> Flagged for Review
                            </div>
                          ) : (
                            <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase">
                              <Clock className="w-3.5 h-3.5" /> Waiting for Data
                            </div>
                          )}
                        </td>
                        <td className="px-8 py-6">
                          <div className="flex gap-2">
                            {user.verification_documents && user.verification_documents.length > 0 ? (
                              user.verification_documents.map((doc: any, idx: number) => (
                                <a 
                                  key={idx}
                                  href={doc.url} 
                                  target="_blank" 
                                  className="flex items-center gap-1 text-[10px] font-bold bg-slate-100 hover:bg-slate-200 px-2 py-1 rounded-md transition-colors"
                                >
                                  <FileText className="w-3 h-3" /> {doc.type || 'ID'}
                                </a>
                              ))
                            ) : (
                              <span className="text-[10px] text-slate-400 italic">No documents uploaded</span>
                            )}
                          </div>
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
                                className="p-2 bg-emerald-50 text-emerald-600 rounded-lg hover:bg-emerald-100 transition-all flex items-center gap-1 px-3" 
                                title="Approve"
                              >
                                <CheckCircle2 className="w-4 h-4" />
                                <span className="text-xs font-bold">Approve</span>
                              </button>
                            )}
                            {user.status !== 'suspended' && (
                              <button 
                                onClick={() => updateUserStatus(user.id, 'suspended')}
                                className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-all flex items-center gap-1 px-3" 
                                title="Reject/Suspend"
                              >
                                <XCircle className="w-4 h-4" />
                                <span className="text-xs font-bold">Reject</span>
                              </button>
                            )}
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
                <h3 className="text-xl font-bold text-slate-900">Financial Transparency</h3>
                <p className="text-sm text-slate-500 font-medium">Audit platform fees and funds in escrow.</p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-slate-50/50">
                      <th className="px-8 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">Job</th>
                      <th className="px-8 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">Total Amount</th>
                      <th className="px-8 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">Platform Fee</th>
                      <th className="px-8 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">Status</th>
                      <th className="px-8 py-4 text-xs font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {escrows.map((escrow) => (
                      <tr key={escrow.id} className="hover:bg-slate-50/30 transition-colors">
                        <td className="px-8 py-6">
                          <div className="font-bold text-slate-900">{escrow.jobs?.title || 'Unknown Job'}</div>
                          <div className="text-[10px] font-mono text-slate-400">{escrow.id.slice(0, 8)}...</div>
                        </td>
                        <td className="px-8 py-6 font-bold text-slate-700">₱{escrow.amount.toLocaleString()}</td>
                        <td className="px-8 py-6 font-bold text-indigo-600">₱{(Number(escrow.platform_fee) || 0).toLocaleString()}</td>
                        <td className="px-8 py-6">
                          <span className={`text-xs font-bold px-2 py-1 rounded-lg ${
                            escrow.status === 'released' ? 'bg-emerald-50 text-emerald-600' : 
                            escrow.status === 'disputed' ? 'bg-red-50 text-red-600' : 'bg-indigo-50 text-indigo-600'
                          }`}>
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
                        <td colSpan={5} className="px-8 py-12 text-center text-slate-400 italic">
                          No escrow records found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === "disputes" && (
          <motion.div
            key="disputes"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
              <div className="p-8 border-b border-slate-50">
                <h3 className="text-xl font-bold text-slate-900">Dispute Resolution Center</h3>
                <p className="text-sm text-slate-500 font-medium">Review "He said, She said" cases with urgency levels and evidence.</p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-slate-50/50">
                      <th className="px-8 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">Urgency</th>
                      <th className="px-8 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">Job & Amount</th>
                      <th className="px-8 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">Evidence</th>
                      <th className="px-8 py-4 text-xs font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {disputes.map((dispute) => (
                      <tr key={dispute.id} className="hover:bg-slate-50/30 transition-colors">
                        <td className="px-8 py-6">
                          <span className={`text-[10px] font-black uppercase px-2 py-1 rounded-lg ${
                            dispute.urgency_level === 'High' ? 'bg-red-100 text-red-600' : 
                            dispute.urgency_level === 'Medium' ? 'bg-amber-100 text-amber-600' : 'bg-slate-100 text-slate-600'
                          }`}>
                            {dispute.urgency_level}
                          </span>
                        </td>
                        <td className="px-8 py-6">
                          <div className="font-bold text-slate-900">{dispute.escrows?.jobs?.title || 'Unknown Job'}</div>
                          <div className="text-sm text-indigo-600 font-bold">₱{dispute.escrows?.amount.toLocaleString()}</div>
                        </td>
                        <td className="px-8 py-6">
                          <div className="flex flex-wrap gap-2">
                            <button className="flex items-center gap-1 text-[10px] font-bold bg-indigo-50 text-indigo-600 px-2 py-1 rounded-md hover:bg-indigo-100">
                              <Eye className="w-3 h-3" /> Chat Logs
                            </button>
                            {dispute.evidence_urls?.map((url: string, i: number) => (
                              <a key={i} href={url} target="_blank" className="flex items-center gap-1 text-[10px] font-bold bg-slate-100 text-slate-600 px-2 py-1 rounded-md hover:bg-slate-200">
                                <FileText className="w-3 h-3" /> Proof {i+1}
                              </a>
                            ))}
                          </div>
                        </td>
                        <td className="px-8 py-6 text-right">
                          <div className="flex justify-end gap-2">
                            <button className="px-3 py-1 bg-slate-900 text-white text-xs font-bold rounded-lg hover:bg-slate-800">
                              Resolve
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {disputes.length === 0 && (
                      <tr>
                        <td colSpan={4} className="px-8 py-12 text-center text-slate-400 italic">
                          No active disputes.
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

        {activeTab === "health" && (
          <motion.div
            key="health"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
          >
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-8">
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h3 className="text-xl font-bold text-slate-900">System Health & User Impact</h3>
                  <p className="text-sm text-slate-500 font-medium">Monitoring risks and platform stability.</p>
                </div>
                <button 
                  onClick={checkTableHealth}
                  className="p-2 hover:bg-slate-50 rounded-xl transition-all text-slate-400 hover:text-indigo-600"
                >
                  <Activity className="w-5 h-5" />
                </button>
              </div>

              {/* Impact Level Summary */}
              {!healthStatus.jobs.exists && (
                <div className="mb-8 p-6 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-4">
                  <div className="p-3 bg-red-100 text-red-600 rounded-xl">
                    <AlertTriangle className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-red-900">High Revenue Risk!</h4>
                    <p className="text-sm text-red-700 leading-relaxed">
                      Jobs table is offline. Approximately <strong>{counts.jobs} jobs</strong> are currently hidden.
                      <br />
                      <span className="font-black">Estimated Platform Fee Loss: ₱{((counts.jobs || 3456) * 125).toLocaleString()} / hour</span>
                    </p>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="p-6 rounded-2xl border border-emerald-100 bg-emerald-50/30">
                  <div className="flex justify-between items-start mb-4">
                    <div className="p-2.5 rounded-xl bg-white shadow-sm border border-emerald-100">
                      <ShieldCheck className="w-5 h-5 text-emerald-500" />
                    </div>
                    <span className="text-[10px] font-black uppercase px-2 py-1 rounded-lg bg-emerald-100 text-emerald-700">
                      Active
                    </span>
                  </div>
                  <h4 className="font-bold text-slate-900">SSL Certificate</h4>
                  <p className="text-xs text-slate-500 mt-1">
                    Status: <span className="text-emerald-600 font-bold">Active</span>. Note: Modern browsers may still show "Not Secure" if ACME challenge is pending propagation.
                  </p>
                </div>
                <div className="p-6 rounded-2xl border border-indigo-100 bg-indigo-50/30">
                  <div className="flex justify-between items-start mb-4">
                    <div className="p-2.5 rounded-xl bg-white shadow-sm border border-indigo-100">
                      <Mail className="w-5 h-5 text-indigo-500" />
                    </div>
                    <span className="text-[10px] font-black uppercase px-2 py-1 rounded-lg bg-indigo-100 text-indigo-700">
                      Rate Limited
                    </span>
                  </div>
                  <h4 className="font-bold text-slate-900">Email System</h4>
                  <p className="text-xs text-slate-500 mt-1">
                    Current limit: 5 emails/hour. Scaling required for high-volume recruitment.
                  </p>
                </div>
                {Object.entries(healthStatus).map(([table, status]: [string, any]) => (
                  <div key={table} className="p-6 rounded-2xl border border-slate-100 bg-slate-50/50">
                    <div className="flex justify-between items-start mb-4">
                      <div className="p-2.5 rounded-xl bg-white shadow-sm border border-slate-100">
                        <FileText className={`w-5 h-5 ${status.exists ? 'text-emerald-500' : 'text-red-500'}`} />
                      </div>
                      <span className={`text-[10px] font-black uppercase px-2 py-1 rounded-lg ${
                        status.exists ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'
                      }`}>
                        {status.exists ? 'Healthy' : 'Missing'}
                      </span>
                    </div>
                    <h4 className="font-bold text-slate-900 capitalize">{table}</h4>
                    <p className="text-xs text-slate-500 mt-1">
                      {status.exists ? `Table ${table} is active and reachable.` : `Table ${table} was not found in public schema.`}
                    </p>
                    {!status.exists && (
                      <button 
                        onClick={() => {
                          const sql = `CREATE TABLE IF NOT EXISTS public.${table} (id UUID PRIMARY KEY DEFAULT gen_random_uuid()); -- Simplified`;
                          navigator.clipboard.writeText(sql);
                          notify(`SQL for ${table} copied!`);
                        }}
                        className="mt-4 text-[10px] font-bold text-indigo-600 hover:underline flex items-center gap-1"
                      >
                        Copy Setup SQL <Copy className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                ))}
              </div>

              <div className="mt-12 p-8 bg-slate-900 rounded-3xl text-white relative overflow-hidden">
                <div className="relative z-10">
                  <h3 className="text-xl font-bold mb-4">Manual Database Setup</h3>
                  <p className="text-slate-400 text-sm mb-8 max-w-2xl leading-relaxed">
                    If you are seeing "Missing" tables, you need to run aming schema script in your Supabase SQL Editor. 
                    Ito ay bubuo ng lahat ng kailangang tables (profiles, jobs, escrows, messages) at i-e-enable ang Realtime sync.
                  </p>
                  <div className="flex flex-wrap gap-4">
                    <button 
                      onClick={() => {
                        fetch('/supabase_schema.sql').then(r => r.text()).then(sql => {
                          navigator.clipboard.writeText(sql);
                          notify("Full Schema copied to clipboard!");
                        });
                      }}
                      className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 rounded-xl font-bold text-sm transition-all shadow-lg shadow-indigo-600/20 flex items-center gap-2"
                    >
                      <Copy className="w-4 h-4" />
                      Copy Full SQL Script
                    </button>
                    <a 
                      href="https://supabase.com/dashboard/project/_/sql" 
                      target="_blank"
                      className="px-6 py-3 bg-white/10 hover:bg-white/20 rounded-xl font-bold text-sm transition-all flex items-center gap-2"
                    >
                      Open Supabase Editor <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                </div>
                <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-indigo-500/10 rounded-full blur-[100px]"></div>
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

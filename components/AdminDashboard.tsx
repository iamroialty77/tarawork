"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import RichTextEditor from "./RichTextEditor";
import { 
  Users, 
  Briefcase, 
  ShieldCheck, 
  AlertTriangle, 
  TrendingUp,
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
  Ban,
  Scale,
  Mail,
  Paperclip,
  X,
  BookOpen
} from "lucide-react";

type TabType = "overview" | "users" | "jobs" | "disputes" | "talent_requests" | "email_messages" | "blog" | "marketing" | "reports" | "health";
type AdminViewMode = "admin" | "freelancer" | "client";

type MarketingAttachment = {
  filename: string;
  contentType: string;
  contentBase64: string;
  size: number;
};

interface AdminDashboardProps {
  viewAs?: AdminViewMode;
  onViewAsChange?: (mode: AdminViewMode) => void;
}

export default function AdminDashboard({ viewAs = "admin", onViewAsChange }: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<TabType>("overview");
  const [counts, setCounts] = useState({ users: 0, jobs: 0, employers: 0, freelancers: 0, disputes: 0 });
  const [recentActivities, setRecentActivities] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [jobs, setJobs] = useState<any[]>([]);
  const [disputes, setDisputes] = useState<any[]>([]);
  const [talentRequests, setTalentRequests] = useState<any[]>([]);
  const [emailMessages, setEmailMessages] = useState<any[]>([]);
  const [blogPostsAdmin, setBlogPostsAdmin] = useState<any[]>([]);
  const [blogDraft, setBlogDraft] = useState({
    title: "",
    excerpt: "",
    category: "Employer Hiring Guides",
    imageUrl: "",
    imageAlt: "",
    keyword: "",
    readTime: "5 min read",
    publishedAt: new Date().toISOString().slice(0, 10),
    status: "published",
    content: "",
  });
  const [editingBlogPostId, setEditingBlogPostId] = useState<string | null>(null);
  const [blogLoading, setBlogLoading] = useState(false);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [jobCategories, setJobCategories] = useState<string[]>([]);
  const [newCategory, setNewCategory] = useState("");
  const [categoryLoading, setCategoryLoading] = useState(false);
  const [marketingSubject, setMarketingSubject] = useState("");
  const [marketingMessage, setMarketingMessage] = useState("");
  const [marketingLoading, setMarketingLoading] = useState(false);
  const [marketingPreview, setMarketingPreview] = useState<any>(null);
  const [marketingAttachment, setMarketingAttachment] = useState<MarketingAttachment | null>(null);
  const [loading, setLoading] = useState(true);
  
  const [healthStatus, setHealthStatus] = useState({
    profiles: { exists: false, loading: true },
    jobs: { exists: false, loading: true },
    messages: { exists: false, loading: true },
    conversations: { exists: false, loading: true },
    disputes: { exists: false, loading: true },
    admin_audit_logs: { exists: false, loading: true },
    talent_requests: { exists: false, loading: true },
    email_messages: { exists: false, loading: true },
    blog_posts: { exists: false, loading: true }
  });

  const checkTableHealth = async () => {
    const tables = ['profiles', 'jobs', 'messages', 'conversations', 'disputes', 'admin_audit_logs', 'talent_requests', 'email_messages', 'blog_posts'];
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
      const { count: employerCount } = await supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'employer');
      const { count: freelancerCount } = await supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'freelancer');
      const { count: jobCount } = await supabase.from('jobs').select('*', { count: 'exact', head: true });
      const { count: disputeCount } = await supabase.from('disputes').select('*', { count: 'exact', head: true });

      setCounts({
        users: userCount || 0,
        employers: employerCount || 0,
        freelancers: freelancerCount || 0,
        jobs: jobCount || 0,
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
        .select('*, hirer_profile:profiles!jobs_employer_id_fkey(name)')
        .order('createdAt', { ascending: false });
      if (jobData) setJobs(jobData);

      // Fetch Disputes
      const { data: disputeData } = await supabase
        .from('disputes')
        .select('*, escrows(amount, job_id, jobs(title))')
        .order('created_at', { ascending: false });
      if (disputeData) setDisputes(disputeData);

      const { data: requestData } = await supabase
        .from('talent_requests')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);
      if (requestData) setTalentRequests(requestData);

      const { data: emailData } = await supabase
        .from('email_messages')
        .select('id,type,direction,from_email,from_name,to_email,reply_to,subject,text_body,status,related_table,related_id,metadata,created_at')
        .order('created_at', { ascending: false })
        .limit(50);
      if (emailData) setEmailMessages(emailData);

      const blogResponse = await fetch("/api/admin/blog-posts", { cache: "no-store" });
      if (blogResponse.ok) {
        const payload = await blogResponse.json();
        setBlogPostsAdmin(Array.isArray(payload.posts) ? payload.posts : []);
      }

      // Fetch Audit Logs
      const { data: logData } = await supabase
        .from('admin_audit_logs')
        .select('*, profiles(name)')
        .order('created_at', { ascending: false })
        .limit(20);
      if (logData) setAuditLogs(logData);

      const { data: categoryData } = await supabase
        .from("job_categories")
        .select("name")
        .order("name", { ascending: true });
      if (categoryData) {
        setJobCategories(
          categoryData
            .map((item: any) => item.name)
            .filter((name: string) => !!name)
        );
      }

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
    if (!confirm("Are you sure you want to delete this user? ALL data (messages, jobs, profiles) will be permanently deleted. This cannot be undone.")) return;
    
    setLoading(true);
    try {
      const response = await fetch('/api/admin/delete-user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to delete user');
      }

      notify("User and all associated data deleted successfully");
      fetchData();
    } catch (err: any) {
      console.error("Delete error:", err);
      notify("Error deleting user: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const editUserProfile = async (targetUser: any) => {
    const nextName = prompt("Update full name:", targetUser.name || "")?.trim();
    if (!nextName) return;

    const nextRole = prompt("Update role (freelancer / employer / admin):", targetUser.role || "freelancer")?.trim();
    if (!nextRole || !["freelancer", "employer", "admin"].includes(nextRole)) {
      notify("Profile update cancelled: invalid role.");
      return;
    }

    const nextCategory = prompt("Update category:", targetUser.category || "General")?.trim() || "General";

    const { error } = await supabase
      .from("profiles")
      .update({
        name: nextName,
        role: nextRole,
        category: nextCategory,
        updated_at: new Date().toISOString(),
      })
      .eq("id", targetUser.id);

    if (error) {
      notify("Error updating profile: " + error.message);
      return;
    }

    notify("Profile updated successfully.");
    fetchData();
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
    if (!confirm("Are you sure you want to delete this job posting?")) return;
    setLoading(true);

    try {
      const response = await fetch("/api/admin/delete-job", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ jobId }),
      });
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to delete job posting.");
      }

      setJobs((currentJobs) => currentJobs.filter((job) => job.id !== jobId));
      setCounts((currentCounts) => ({
        ...currentCounts,
        jobs: Math.max(0, currentCounts.jobs - 1),
      }));
      notify("Job deleted successfully");
      await fetchData();
    } catch (err: any) {
      notify("Error deleting job: " + (err?.message || "Unknown error"));
    } finally {
      setLoading(false);
    }
  };

  const addJobCategory = async () => {
    const name = newCategory.trim();
    if (!name) return;
    setCategoryLoading(true);
    const { error } = await supabase.from("job_categories").upsert({ name }, { onConflict: "name" });
    setCategoryLoading(false);
    if (error) {
      notify("Error adding category: " + error.message);
      return;
    }
    setNewCategory("");
    notify("Category added.");
    fetchData();
  };

  const removeJobCategory = async (name: string) => {
    const { error } = await supabase.from("job_categories").delete().eq("name", name);
    if (error) {
      notify("Error removing category: " + error.message);
      return;
    }
    notify("Category removed.");
    fetchData();
  };

  const submitMarketingEmail = async (dryRun: boolean) => {
    const subject = marketingSubject.trim();
    const message = marketingMessage.trim();

    if (!subject || !message) {
      notify("Add a subject and message first.");
      return;
    }

    if (!dryRun && !confirm("Send this announcement to all freelancers with email addresses?")) return;

    setMarketingLoading(true);
    try {
      const response = await fetch("/api/admin/email-freelancers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ subject, message, dryRun, attachment: marketingAttachment }),
      });
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Unable to process marketing email.");
      }

      if (dryRun) {
        setMarketingPreview(result);
        notify(`Preview ready: ${result.recipientCount || 0} freelancers found.`);
      } else {
        notify(`Announcement sent to ${result.recipientCount || 0} freelancers.`);
        setMarketingPreview(result);
      }
    } catch (err: any) {
      notify("Email error: " + (err?.message || "Unknown error"));
    } finally {
      setMarketingLoading(false);
    }
  };

  const handleMarketingAttachmentChange = async (file: File | null) => {
    if (!file) return;

    const allowedTypes = new Set(["application/pdf", "image/jpeg", "image/png", "image/webp", "image/gif"]);
    const maxBytes = 5 * 1024 * 1024;

    if (!allowedTypes.has(file.type)) {
      notify("Only PDF, JPG, PNG, WEBP, and GIF attachments are allowed.");
      return;
    }

    if (file.size > maxBytes) {
      notify("Attachment must be 5MB or smaller.");
      return;
    }

    const dataUrl = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result || ""));
      reader.onerror = () => reject(new Error("Unable to read attachment."));
      reader.readAsDataURL(file);
    });

    const contentBase64 = dataUrl.split(",")[1] || "";
    if (!contentBase64) {
      notify("Unable to read attachment.");
      return;
    }

    setMarketingAttachment({
      filename: file.name,
      contentType: file.type,
      contentBase64,
      size: file.size,
    });
    setMarketingPreview(null);
    notify("Attachment added.");
  };

  const submitBlogPost = async () => {
    if (!blogDraft.title.trim() || !blogDraft.excerpt.trim() || !blogDraft.content.trim()) {
      notify("Title, excerpt, and content are required.");
      return;
    }

    setBlogLoading(true);
    try {
      const response = await fetch("/api/admin/blog-posts", {
        method: editingBlogPostId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...blogDraft, id: editingBlogPostId }),
      });
      const payload = await response.json();

      if (!response.ok) throw new Error(payload?.error || "Unable to publish blog post.");

      notify(editingBlogPostId ? "Blog post updated." : "Blog post saved.");
      setBlogDraft({
        title: "",
        excerpt: "",
        category: "Employer Hiring Guides",
        imageUrl: "",
        imageAlt: "",
        keyword: "",
        readTime: "5 min read",
        publishedAt: new Date().toISOString().slice(0, 10),
        status: "published",
        content: "",
      });
      setEditingBlogPostId(null);
      fetchData();
    } catch (error: any) {
      notify(error?.message || "Unable to publish blog post.");
    } finally {
      setBlogLoading(false);
    }
  };

  const editBlogPost = (post: any) => {
    setEditingBlogPostId(post.id);
    setBlogDraft({
      title: post.title || "",
      excerpt: post.excerpt || "",
      category: post.category || "Employer Hiring Guides",
      imageUrl: post.image_url || "",
      imageAlt: post.image_alt || "",
      keyword: post.keyword || "",
      readTime: post.read_time || "5 min read",
      publishedAt: post.published_at ? new Date(post.published_at).toISOString().slice(0, 10) : new Date().toISOString().slice(0, 10),
      status: post.status || "published",
      content: post.content_text || "",
    });
    notify("Blog post loaded for editing.");
  };

  const deleteBlogPost = async (postId: string) => {
    if (!confirm("Delete this blog post permanently?")) return;

    setBlogLoading(true);
    try {
      const response = await fetch(`/api/admin/blog-posts?id=${encodeURIComponent(postId)}`, {
        method: "DELETE",
      });
      const payload = await response.json();

      if (!response.ok) throw new Error(payload?.error || "Unable to delete blog post.");

      notify("Blog post deleted.");
      if (editingBlogPostId === postId) setEditingBlogPostId(null);
      fetchData();
    } catch (error: any) {
      notify(error?.message || "Unable to delete blog post.");
    } finally {
      setBlogLoading(false);
    }
  };

  const navItems = [
    { id: "overview", label: "Overview", icon: LayoutDashboard },
    { id: "users", label: "Verification Queue", icon: ShieldCheck },
    { id: "jobs", label: "Marketplace", icon: Briefcase },
    { id: "disputes", label: "Disputes", icon: Scale },
    { id: "talent_requests", label: "Talent Requests", icon: Users },
    { id: "email_messages", label: "Email Inbox", icon: Mail },
    { id: "blog", label: "Blog Studio", icon: BookOpen },
    { id: "marketing", label: "Marketing Email", icon: Mail },
    { id: "reports", label: "Insights", icon: BarChart3 },
    { id: "health", label: "System Health", icon: Activity },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-8 px-4 sm:px-6 lg:px-10">
      {/* Top Header */}
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-6 mb-8">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Admin Console</h1>
          <p className="text-slate-500 font-medium mt-1">Review, moderate, and manage Tara platform operations.</p>
        </div>

        <div className="flex w-full flex-col gap-3 xl:w-auto xl:items-end">
          {onViewAsChange && (
            <div className="flex w-full flex-wrap items-center gap-2 rounded-2xl border border-indigo-100 bg-indigo-50/60 p-2 xl:w-auto">
              <span className="px-2 text-[10px] font-black uppercase tracking-[0.2em] text-indigo-700">View As</span>
              <button
                type="button"
                onClick={() => onViewAsChange("freelancer")}
                className={`rounded-xl px-3 py-1.5 text-xs font-black uppercase tracking-[0.15em] transition-all ${
                  viewAs === "freelancer" ? "bg-indigo-600 text-white" : "bg-white text-indigo-700 border border-indigo-100"
                }`}
              >
                Freelancer Mode
              </button>
              <button
                type="button"
                onClick={() => onViewAsChange("client")}
                className={`rounded-xl px-3 py-1.5 text-xs font-black uppercase tracking-[0.15em] transition-all ${
                  viewAs === "client" ? "bg-indigo-600 text-white" : "bg-white text-indigo-700 border border-indigo-100"
                }`}
              >
                Hirer Mode
              </button>
              <button
                type="button"
                onClick={() => onViewAsChange("admin")}
                className={`rounded-xl px-3 py-1.5 text-xs font-black uppercase tracking-[0.15em] transition-all ${
                  viewAs === "admin" ? "bg-slate-900 text-white" : "bg-white text-slate-700 border border-slate-200"
                }`}
              >
                Admin Mode
              </button>
            </div>
          )}

          <div className="flex w-full flex-wrap items-center gap-2 rounded-2xl border border-slate-200 bg-white p-1.5 shadow-sm xl:w-auto">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as TabType)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${
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
                { label: "Job Posts", value: counts.jobs, icon: Briefcase, color: "emerald" },
                { label: "Employers", value: counts.employers, icon: UserCheck, color: "amber" },
                { label: "Freelancers", value: counts.freelancers, icon: ShieldCheck, color: "purple" },
                { label: "Active Disputes", value: counts.disputes, icon: AlertTriangle, color: "red" },
              ].map((stat, i) => (
                <div key={i} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
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
              <div className="lg:col-span-2 space-y-8">
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8">
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
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8">
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

              <div className="bg-slate-900 rounded-2xl shadow-xl p-8 text-white flex flex-col">
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
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
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
                            <button
                              onClick={() => editUserProfile(user)}
                              className="p-2 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition-all flex items-center gap-1 px-3"
                              title="Edit Profile"
                            >
                              <UserCheck className="w-4 h-4" />
                              <span className="text-xs font-bold">Edit</span>
                            </button>
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
                            <button 
                              onClick={() => deleteUser(user.id)}
                              className="p-2 bg-slate-100 text-slate-400 hover:bg-red-500 hover:text-white rounded-lg transition-all" 
                              title="Delete Account Permanently"
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
            <div className="grid gap-4 md:grid-cols-3">
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-400">Total Posts</p>
                <p className="mt-2 text-3xl font-black text-slate-900">{jobs.length}</p>
              </div>
              <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-5 shadow-sm">
                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-emerald-700">Live</p>
                <p className="mt-2 text-3xl font-black text-emerald-800">{jobs.filter((job) => (job.status || "live") === "live").length}</p>
              </div>
              <div className="rounded-2xl border border-rose-100 bg-rose-50 p-5 shadow-sm">
                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-rose-700">Needs Review</p>
                <p className="mt-2 text-3xl font-black text-rose-800">{jobs.filter((job) => (job.status || "live") !== "live").length}</p>
              </div>
            </div>

            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="border-b border-slate-100 p-8">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-600">Marketplace Operations</p>
                    <h3 className="mt-1 text-2xl font-black text-slate-900">Job Posting Moderation</h3>
                    <p className="mt-1 text-sm font-medium text-slate-500">Review live marketplace content and remove invalid or duplicate job posts.</p>
                  </div>
                </div>
                <div className="mt-5 rounded-xl border border-indigo-100 bg-indigo-50/60 p-4">
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-700">Job Categories</p>
                  <p className="mt-1 text-xs font-medium text-indigo-700/80">Admins can manage the list used by the hirer job form.</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {jobCategories.map((category) => (
                      <div key={category} className="inline-flex items-center gap-2 rounded-lg border border-indigo-200 bg-white px-2 py-1">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-700">{category}</span>
                        <button
                          onClick={() => removeJobCategory(category)}
                          className="text-[10px] font-bold text-rose-600 hover:text-rose-700"
                          title={`Remove ${category}`}
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                  <div className="mt-3 flex flex-col gap-2 sm:flex-row">
                    <input
                      type="text"
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value)}
                      placeholder="Add category (e.g. SEO VA)"
                      className="w-full rounded-lg border border-indigo-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 outline-none focus:ring-2 focus:ring-indigo-400"
                    />
                    <button
                      onClick={addJobCategory}
                      disabled={categoryLoading || !newCategory.trim()}
                      className="rounded-lg bg-indigo-600 px-4 py-2 text-xs font-black uppercase tracking-widest text-white hover:bg-indigo-700 disabled:opacity-50"
                    >
                      {categoryLoading ? "Saving..." : "Add"}
                    </button>
                  </div>
                </div>
              </div>
              {jobs.length === 0 ? (
                <div className="p-10 text-center">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
                    <Briefcase className="h-6 w-6" />
                  </div>
                  <p className="mt-4 text-sm font-black text-slate-900">No job posts found.</p>
                  <p className="mt-1 text-xs font-semibold text-slate-500">New marketplace posts will appear here for moderation.</p>
                </div>
              ) : (
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
                          <div className="text-sm font-bold text-slate-700">{job.hirer_profile?.name || job.company}</div>
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
                                className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-[10px] font-black uppercase tracking-widest text-emerald-700 hover:bg-emerald-100"
                              >
                                <Check className="w-4 h-4" />
                                Restore
                              </button>
                            )}
                            <button 
                              onClick={() => deleteJob(job.id)}
                              className="inline-flex items-center gap-1.5 rounded-lg border border-rose-200 bg-white px-3 py-2 text-[10px] font-black uppercase tracking-widest text-rose-600 hover:bg-rose-50"
                            >
                              <Trash2 className="w-4 h-4" />
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              )}
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
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
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

        {activeTab === "talent_requests" && (
          <motion.div
            key="talent_requests"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            <div className="rounded-2xl border border-slate-100 bg-white p-8 shadow-sm">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <h3 className="text-xl font-bold text-slate-900">Employer Talent Requests</h3>
                  <p className="text-sm font-medium text-slate-500">Concierge hiring leads from the free shortlist form.</p>
                </div>
                <div className="rounded-xl bg-teal-50 px-4 py-3 text-sm font-black text-teal-800">
                  {talentRequests.length} requests loaded
                </div>
              </div>
            </div>

            <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-slate-50/70">
                      <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-slate-400">Employer</th>
                      <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-slate-400">Need</th>
                      <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-slate-400">Budget</th>
                      <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-slate-400">Notes</th>
                      <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-slate-400">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {talentRequests.length ? (
                      talentRequests.map((request) => (
                        <tr key={request.id} className="align-top hover:bg-slate-50/50">
                          <td className="px-6 py-5">
                            <p className="font-black text-slate-900">{request.name || "Unknown"}</p>
                            <a href={`mailto:${request.email}`} className="break-all text-xs font-semibold text-indigo-600 hover:underline">
                              {request.email}
                            </a>
                            {request.company ? <p className="mt-1 text-xs font-semibold text-slate-500">{request.company}</p> : null}
                          </td>
                          <td className="px-6 py-5">
                            <p className="font-bold text-slate-900">{request.role_needed}</p>
                            <p className="mt-1 text-xs font-semibold text-slate-500">{request.start_date || "No start date"}</p>
                          </td>
                          <td className="px-6 py-5">
                            <p className="text-sm font-bold text-slate-800">{request.budget || "Not sure"}</p>
                            <p className="mt-1 text-xs font-semibold text-slate-500">{request.hours_per_week || "Hours not set"}</p>
                          </td>
                          <td className="max-w-md px-6 py-5">
                            <p className="line-clamp-4 text-sm leading-6 text-slate-600">{request.notes}</p>
                          </td>
                          <td className="px-6 py-5">
                            <span className="rounded-lg bg-amber-50 px-2 py-1 text-xs font-black uppercase text-amber-700">
                              {request.status || "new"}
                            </span>
                            <p className="mt-2 text-xs font-semibold text-slate-400">
                              {request.created_at ? new Date(request.created_at).toLocaleString() : ""}
                            </p>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={5} className="px-6 py-12 text-center text-sm font-semibold text-slate-400">
                          No talent requests found yet. If the table is missing, run docs/talent_requests.sql in Supabase.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === "email_messages" && (
          <motion.div
            key="email_messages"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="grid grid-cols-1 gap-6 xl:grid-cols-[360px_minmax(0,1fr)]"
          >
            <aside className="space-y-4">
              <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
                <p className="text-xs font-black uppercase tracking-widest text-slate-400">Email Activity</p>
                <p className="mt-2 text-4xl font-black text-slate-900">{emailMessages.length}</p>
                <p className="mt-2 text-sm font-semibold text-slate-500">Latest SMTP messages saved in the app.</p>
              </div>
              <div className="rounded-2xl border border-indigo-100 bg-indigo-50 p-6">
                <h4 className="text-sm font-black text-indigo-950">Tracked message types</h4>
                <div className="mt-4 space-y-2 text-sm font-semibold text-indigo-800">
                  <p>Contact form inquiries</p>
                  <p>Talent shortlist requests</p>
                  <p>Employer confirmations</p>
                  <p>Freelancer announcements</p>
                </div>
              </div>
            </aside>

            <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
              <div className="border-b border-slate-100 p-6">
                <h3 className="text-xl font-bold text-slate-900">Email Inbox</h3>
                <p className="text-sm font-medium text-slate-500">Messages sent through SMTP are logged here for admin follow-up.</p>
              </div>
              <div className="divide-y divide-slate-100">
                {emailMessages.length ? (
                  emailMessages.map((message) => (
                    <article key={message.id} className="p-6 transition hover:bg-slate-50/70">
                      <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className={`rounded-lg px-2 py-1 text-[10px] font-black uppercase tracking-widest ${
                              message.direction === "outbound"
                                ? "bg-indigo-50 text-indigo-700"
                                : "bg-teal-50 text-teal-700"
                            }`}>
                              {message.direction || "inbound"}
                            </span>
                            <span className="rounded-lg bg-slate-100 px-2 py-1 text-[10px] font-black uppercase tracking-widest text-slate-500">
                              {String(message.type || "email").replace(/_/g, " ")}
                            </span>
                            <span className="text-xs font-semibold text-slate-400">
                              {message.created_at ? new Date(message.created_at).toLocaleString() : ""}
                            </span>
                          </div>
                          <h4 className="mt-3 text-lg font-black text-slate-900">{message.subject}</h4>
                          <p className="mt-1 text-xs font-semibold text-slate-500">
                            From: {message.from_name ? `${message.from_name} ` : ""}{message.from_email || "unknown"} · To: {message.to_email || "unknown"}
                          </p>
                        </div>
                        {message.reply_to || message.from_email ? (
                          <a
                            href={`mailto:${message.reply_to || message.from_email}`}
                            className="inline-flex shrink-0 items-center justify-center rounded-xl bg-slate-900 px-4 py-2 text-xs font-black uppercase tracking-widest text-white hover:bg-slate-800"
                          >
                            Reply
                          </a>
                        ) : null}
                      </div>
                      <p className="mt-4 whitespace-pre-line rounded-xl border border-slate-100 bg-slate-50 p-4 text-sm font-medium leading-7 text-slate-700">
                        {message.text_body}
                      </p>
                    </article>
                  ))
                ) : (
                  <div className="p-12 text-center">
                    <Mail className="mx-auto h-10 w-10 text-slate-300" />
                    <p className="mt-4 text-sm font-semibold text-slate-400">
                      No email messages found yet. Run the email_messages SQL setup if this table is not created.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === "blog" && (
          <motion.div
            key="blog"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="grid grid-cols-1 gap-8 xl:grid-cols-[minmax(0,1fr)_380px]"
          >
            <div className="rounded-2xl border border-slate-100 bg-white shadow-sm">
              <div className="border-b border-slate-100 p-8">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-teal-50 text-teal-700">
                    <BookOpen className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900">Blog Studio</h3>
                    <p className="text-sm font-medium text-slate-500">
                      {editingBlogPostId ? "Edit the selected public article." : "Create publishable articles for the public blog section."}
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid gap-5 p-8">
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="text-xs font-black uppercase tracking-widest text-slate-500">Title</label>
                    <input
                      value={blogDraft.title}
                      onChange={(event) => setBlogDraft((draft) => ({ ...draft, title: event.target.value }))}
                      className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
                      placeholder="Example: How to Hire a Filipino Virtual Assistant"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-black uppercase tracking-widest text-slate-500">Category</label>
                    <select
                      value={blogDraft.category}
                      onChange={(event) => setBlogDraft((draft) => ({ ...draft, category: event.target.value }))}
                      className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
                    >
                      {["Employer Hiring Guides", "Remote Jobs for Filipinos", "Virtual Assistant Guides", "Freelancer Career Tips"].map((category) => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-black uppercase tracking-widest text-slate-500">Excerpt</label>
                  <textarea
                    value={blogDraft.excerpt}
                    onChange={(event) => setBlogDraft((draft) => ({ ...draft, excerpt: event.target.value }))}
                    rows={3}
                    className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold leading-relaxed outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
                    placeholder="Short summary that appears on the blog card and social preview."
                  />
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="text-xs font-black uppercase tracking-widest text-slate-500">Google Drive Image Link</label>
                    <input
                      value={blogDraft.imageUrl}
                      onChange={(event) => setBlogDraft((draft) => ({ ...draft, imageUrl: event.target.value }))}
                      className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
                      placeholder="https://drive.google.com/file/d/.../view"
                    />
                    <p className="mt-2 text-xs font-semibold text-slate-400">Paste a Google Drive sharing link. Set the file access to “Anyone with the link” so the image can appear publicly.</p>
                  </div>
                  <div>
                    <label className="text-xs font-black uppercase tracking-widest text-slate-500">Image Description</label>
                    <input
                      value={blogDraft.imageAlt}
                      onChange={(event) => setBlogDraft((draft) => ({ ...draft, imageAlt: event.target.value }))}
                      className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
                      placeholder="Describe the blog image"
                    />
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                  <div>
                    <label className="text-xs font-black uppercase tracking-widest text-slate-500">Topic Keyword</label>
                    <input
                      value={blogDraft.keyword}
                      onChange={(event) => setBlogDraft((draft) => ({ ...draft, keyword: event.target.value }))}
                      className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
                      placeholder="remote jobs for Filipinos"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-black uppercase tracking-widest text-slate-500">Publish Date</label>
                    <input
                      type="date"
                      value={blogDraft.publishedAt}
                      onChange={(event) => setBlogDraft((draft) => ({ ...draft, publishedAt: event.target.value }))}
                      className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-black uppercase tracking-widest text-slate-500">Status</label>
                    <select
                      value={blogDraft.status}
                      onChange={(event) => setBlogDraft((draft) => ({ ...draft, status: event.target.value }))}
                      className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
                    >
                      <option value="published">Published</option>
                      <option value="draft">Draft</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-black uppercase tracking-widest text-slate-500">Article Content</label>
                  <RichTextEditor
                    value={blogDraft.content}
                    onChange={(content) => setBlogDraft((draft) => ({ ...draft, content }))}
                  />
                  <p className="mt-2 text-xs font-semibold text-slate-400">Format the article using headings, lists, links, tables, alignment, and other tools above.</p>
                </div>

                <button
                  type="button"
                  onClick={submitBlogPost}
                  disabled={blogLoading}
                  className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-5 py-3 text-xs font-black uppercase tracking-widest text-white hover:bg-slate-800 disabled:opacity-50"
                >
                  {blogLoading ? "Saving..." : editingBlogPostId ? "Update Blog Post" : "Save Blog Post"}
                </button>
                {editingBlogPostId && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditingBlogPostId(null);
                      setBlogDraft({
                        title: "",
                        excerpt: "",
                        category: "Employer Hiring Guides",
                        imageUrl: "",
                        imageAlt: "",
                        keyword: "",
                        readTime: "5 min read",
                        publishedAt: new Date().toISOString().slice(0, 10),
                        status: "published",
                        content: "",
                      });
                    }}
                    className="inline-flex items-center justify-center rounded-xl border border-slate-200 px-5 py-3 text-xs font-black uppercase tracking-widest text-slate-500 hover:bg-slate-50"
                  >
                    Cancel Edit
                  </button>
                )}
              </div>
            </div>

            <aside className="space-y-5">
              <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
                <h4 className="text-sm font-black uppercase tracking-widest text-slate-500">Published Flow</h4>
                <p className="mt-3 text-sm font-semibold leading-7 text-slate-600">
                  Published posts appear on the Blog page, landing page blog cards, and share previews.
                </p>
              </div>
              <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
                <h4 className="text-sm font-black uppercase tracking-widest text-slate-500">Recent Posts</h4>
                <div className="mt-4 space-y-3">
                  {blogPostsAdmin.length ? (
                    blogPostsAdmin.slice(0, 8).map((post) => (
                      <div key={post.id} className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                        <p className="text-sm font-black text-slate-900">{post.title}</p>
                        <p className="mt-1 text-xs font-semibold text-slate-500">{post.status} · {post.published_at ? new Date(post.published_at).toLocaleDateString() : ""}</p>
                        {post.status === "published" ? (
                          <a href={`/blog/${post.slug}`} target="_blank" className="mt-3 inline-flex text-xs font-black text-teal-700 hover:underline">
                            Open public post
                          </a>
                        ) : null}
                        <div className="mt-3 flex gap-2">
                          <button
                            type="button"
                            onClick={() => editBlogPost(post)}
                            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-[10px] font-black uppercase tracking-widest text-slate-600 hover:bg-slate-100"
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => deleteBlogPost(post.id)}
                            className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-[10px] font-black uppercase tracking-widest text-rose-700 hover:bg-rose-100"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="rounded-xl bg-slate-50 p-4 text-xs font-semibold text-slate-500">
                      No database posts yet. Run docs/blog_posts.sql if the table is missing.
                    </p>
                  )}
                </div>
              </div>
            </aside>
          </motion.div>
        )}

        {activeTab === "marketing" && (
          <motion.div
            key="marketing"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="grid grid-cols-1 gap-8 xl:grid-cols-[minmax(0,1fr)_360px]"
          >
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
              <div className="border-b border-slate-100 p-8">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
                    <Mail className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900">Freelancer Announcement</h3>
                    <p className="text-sm font-medium text-slate-500">Email all freelancers about website updates, launches, and notices.</p>
                  </div>
                </div>
              </div>

              <div className="space-y-6 p-8">
                <div>
                  <label className="text-xs font-black uppercase tracking-widest text-slate-500">Subject</label>
                  <input
                    type="text"
                    value={marketingSubject}
                    onChange={(event) => setMarketingSubject(event.target.value)}
                    maxLength={140}
                    placeholder="Example: New TaraWork profile features are live"
                    className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-800 outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                  />
                </div>

                <div>
                  <label className="text-xs font-black uppercase tracking-widest text-slate-500">Message</label>
                  <textarea
                    value={marketingMessage}
                    onChange={(event) => setMarketingMessage(event.target.value)}
                    rows={12}
                    maxLength={8000}
                    placeholder={"Hi freelancers,\n\nWe have an update about TaraWork..."}
                    className="mt-2 w-full resize-y rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold leading-relaxed text-slate-800 outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                  />
                  <p className="mt-2 text-xs font-semibold text-slate-400">{marketingMessage.length.toLocaleString()} / 8,000 characters</p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-xs font-black uppercase tracking-widest text-slate-500">Attachment</p>
                      <p className="mt-1 text-xs font-semibold text-slate-500">Optional. PDF or image only, up to 5MB.</p>
                    </div>
                    <label className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-black uppercase tracking-widest text-slate-700 transition hover:bg-slate-100">
                      <Paperclip className="h-4 w-4" />
                      Choose File
                      <input
                        type="file"
                        accept="application/pdf,image/jpeg,image/png,image/webp,image/gif"
                        className="hidden"
                        onChange={(event) => {
                          void handleMarketingAttachmentChange(event.target.files?.[0] || null);
                          event.currentTarget.value = "";
                        }}
                      />
                    </label>
                  </div>

                  {marketingAttachment && (
                    <div className="mt-4 flex flex-col gap-3 rounded-xl border border-indigo-100 bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-black text-slate-900">{marketingAttachment.filename}</p>
                        <p className="mt-1 text-xs font-semibold text-slate-500">
                          {marketingAttachment.contentType} - {(marketingAttachment.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setMarketingAttachment(null);
                          setMarketingPreview(null);
                        }}
                        className="inline-flex items-center justify-center gap-2 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-[10px] font-black uppercase tracking-widest text-rose-700 hover:bg-rose-100"
                      >
                        <X className="h-3.5 w-3.5" />
                        Remove
                      </button>
                    </div>
                  )}
                </div>

                <div className="flex flex-col gap-3 border-t border-slate-100 pt-6 sm:flex-row">
                  <button
                    type="button"
                    onClick={() => submitMarketingEmail(true)}
                    disabled={marketingLoading || !marketingSubject.trim() || !marketingMessage.trim()}
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-indigo-200 bg-white px-5 py-3 text-xs font-black uppercase tracking-widest text-indigo-700 transition hover:bg-indigo-50 disabled:opacity-50"
                  >
                    <Eye className="h-4 w-4" />
                    Preview Recipients
                  </button>
                  <button
                    type="button"
                    onClick={() => submitMarketingEmail(false)}
                    disabled={marketingLoading || !marketingSubject.trim() || !marketingMessage.trim()}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-xs font-black uppercase tracking-widest text-white transition hover:bg-slate-800 disabled:opacity-50"
                  >
                    <Mail className="h-4 w-4" />
                    {marketingLoading ? "Working..." : "Send Announcement"}
                  </button>
                </div>
              </div>
            </div>

            <aside className="space-y-6">
              <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
                <h4 className="text-sm font-black uppercase tracking-widest text-slate-500">Audience</h4>
                <div className="mt-5 grid grid-cols-2 gap-3">
                  <div className="rounded-xl bg-slate-50 p-4">
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Freelancers</p>
                    <p className="mt-1 text-2xl font-black text-slate-900">{counts.freelancers.toLocaleString()}</p>
                  </div>
                  <div className="rounded-xl bg-indigo-50 p-4">
                    <p className="text-[10px] font-black uppercase tracking-widest text-indigo-500">Recipients</p>
                    <p className="mt-1 text-2xl font-black text-indigo-700">{marketingPreview?.recipientCount?.toLocaleString?.() || "..."}</p>
                  </div>
                </div>
                {marketingPreview && (
                  <p className="mt-4 text-xs font-semibold leading-relaxed text-slate-500">
                    {marketingPreview.missingEmailCount || 0} freelancer profiles were skipped because no valid email address was found.
                    {marketingPreview.attachment ? ` Attachment: ${marketingPreview.attachment.filename}.` : ""}
                  </p>
                )}
              </div>

              <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
                <h4 className="text-sm font-black uppercase tracking-widest text-slate-500">Sample Recipients</h4>
                <div className="mt-4 space-y-3">
                  {marketingPreview?.sampleRecipients?.length ? (
                    marketingPreview.sampleRecipients.map((recipient: any) => (
                      <div key={recipient.email} className="rounded-xl border border-slate-100 bg-slate-50 p-3">
                        <p className="text-sm font-black text-slate-900">{recipient.name}</p>
                        <p className="break-words text-xs font-semibold text-slate-500">{recipient.email}</p>
                      </div>
                    ))
                  ) : (
                    <p className="rounded-xl bg-slate-50 p-4 text-xs font-semibold leading-relaxed text-slate-500">
                      Run a preview to verify the reachable freelancer list before sending.
                    </p>
                  )}
                </div>
              </div>
            </aside>
          </motion.div>
        )}

        {activeTab === "reports" && (
          <motion.div
            key="reports"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-8"
          >
            <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm">
              <h3 className="text-lg font-bold text-slate-900 mb-6">User Demographic</h3>
              <div className="space-y-4">
                {[
                  { label: "Developers", value: "35%", color: "bg-emerald-500" },
                  { label: "Designers / Graphic Design", value: "25%", color: "bg-indigo-500" },
                  { label: "Virtual Assistants / Admin", value: "20%", color: "bg-purple-500" },
                  { label: "Marketing", value: "15%", color: "bg-amber-500" },
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

            <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-center items-center text-center">
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
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8">
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

              <div className="mt-12 p-8 bg-slate-900 rounded-2xl text-white relative overflow-hidden">
                <div className="relative z-10">
                  <h3 className="text-xl font-bold mb-4">Manual Database Setup</h3>
                  <p className="text-slate-400 text-sm mb-8 max-w-2xl leading-relaxed">
                    If you are seeing "Missing" tables, you need to run our schema script in your Supabase SQL Editor. 
                    This will create the necessary core tables (profiles, jobs, messages) and enable Realtime sync.
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

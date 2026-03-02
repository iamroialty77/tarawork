"use client";

import { Project, Milestone, WorkspaceType } from "../types";
import { 
  Code2, 
  BarChart3,
  Activity,
  Trello,
  Layout, 
  LayoutDashboard,
  Video, 
  Github, 
  FileText, 
  CheckCircle2, 
  Clock, 
  ChevronRight,
  AlertTriangle,
  MessageSquare,
  ExternalLink,
  Link as LinkIcon,
  Lock,
  Smile,
  Meh,
  Frown,
  TrendingUp,
  Award,
  Shield,
  ShieldCheck,
  Zap, 
  Globe,
  DollarSign, 
  Loader2,
  Plus,
  Brain,
  ArrowUpRight
} from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { cn } from "../lib/utils";
import VideoCall from "./VideoCall";
import WellnessDashboard from "./WellnessDashboard";
import FocusMode from "./FocusMode";
import AIAgent from "./AIAgent";
import { UserWellness } from "../types/wellness";

interface WorkspaceProps {
  projects: Project[];
  onUpdateProject?: (project: Project) => void;
  onCreateProject?: (project: Project) => void;
  workflows?: any[];
  onUpdateWorkflows?: (workflows: any[]) => void;
}

export default function Workspace({ 
  projects, 
  onUpdateProject, 
  onCreateProject,
  workflows = [],
  onUpdateWorkflows
}: WorkspaceProps) {
  const [activeTab, setActiveTab] = useState<"dashboard" | "active" | "warroom" | "pulse" | "reviews" | "calls" | "wellness" | "contract">("dashboard");
  const [selectedProject, setSelectedProject] = useState<Project | null>(projects[0] || null);
  const [editingLink, setEditingLink] = useState<string | null>(null);
  const [tempLink, setTempLink] = useState("");
  const [showWarRoom, setShowWarRoom] = useState(false);
  const [showContractManager, setShowContractManager] = useState(false);
  const [activeCall, setActiveCall] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [showFocusMode, setShowFocusMode] = useState(false);
  const [isCreatingProject, setIsCreatingProject] = useState(false);
  const [newProject, setNewProject] = useState({ title: "", client: "", workspaceType: "General" as WorkspaceType });
  const [isCreatingWorkflow, setIsCreatingWorkflow] = useState(false);
  const [newWorkflow, setNewWorkflow] = useState({ trigger: "", action: "", name: "", icon: "Zap" });
  const [showAIClauseAudit, setShowAIClauseAudit] = useState(false);

  const selectedMilestones = selectedProject?.milestones || [];

  // Mock wellness data - in a real app this would come from the user profile/wellness service
  const wellnessData: UserWellness = {
    weeklyCapacity: 35,
    currentWorkload: 28,
    energyRating: "Balanced",
    focusHours: 12,
    burnoutRiskScore: 35,
    workToRestRatio: 4.2,
    consecutiveHighLoadDays: 2,
    sustainabilityIndex: 86,
    energyEfficiency: 95, // $/focus hour
    verifiedSustainable: true
  };

  // Sync selected project when projects prop changes from DB
  useEffect(() => {
    if (selectedProject) {
      const updated = projects.find(p => p.id === selectedProject.id);
      if (updated) {
        // Source of truth (DB) takes precedence if there's a desync
        // but we only update if it's actually different to avoid unnecessary re-renders
        const isDifferent = JSON.stringify(updated.milestones) !== JSON.stringify(selectedProject.milestones);
        if (isDifferent) {
          setSelectedProject(updated);
        }
      }
    } else if (projects.length > 0) {
      setSelectedProject(projects[0]);
    }
  }, [projects]);

  const handleSaveLink = async (project: Project) => {
    if (onUpdateProject) {
      setIsSyncing(true);
      await onUpdateProject({ ...project, projectLink: tempLink });
      setEditingLink(null);
      setIsSyncing(false);
    }
  };

  const handleCreateProject = () => {
    if (!newProject.title || !newProject.client || !onUpdateProject) return;
    
    const project: Project = {
      id: Math.random().toString(36).substr(2, 9),
      title: newProject.title,
      client: newProject.client,
      workspaceType: newProject.workspaceType,
      status: "In Progress",
      hoursLogged: 0,
      budget: "$0",
      milestones: [],
      progress: 0,
      clientId: "mock-client-id"
    };

    // We use onUpdateProject by passing the new list but it's cleaner if parent supports creation
    // For now, we'll assume we can push it if we had access to the full list, 
    // but since we only have onUpdateProject(oneProject), we might need a new prop.
    // Let's assume onUpdateProject can take a new project if the id doesn't exist? 
    // No, handleUpdateProject in page.tsx only replaces existing.
    
    // I'll add onCreateProject prop to Workspace.
    if (onCreateProject) {
      onCreateProject(project);
    }
    
    setIsCreatingProject(false);
    setNewProject({ title: "", client: "", workspaceType: "General" });
  };

  const handleCreateWorkflow = () => {
    if (!newWorkflow.name || !newWorkflow.trigger || !newWorkflow.action) return;
    
    const workflow = {
      id: Math.random().toString(36).substr(2, 9),
      name: newWorkflow.name,
      trigger: newWorkflow.trigger,
      action: newWorkflow.action,
      icon: "Zap",
      color: "bg-purple-500",
      active: true
    };

    if (onUpdateWorkflows) {
      onUpdateWorkflows([...workflows, workflow]);
    }
    setIsCreatingWorkflow(false);
    setNewWorkflow({ trigger: "", action: "", name: "", icon: "Zap" });
  };

  const handleUpdateMilestone = async (projectId: string, milestoneId: string, status: Milestone["status"]) => {
    if (!onUpdateProject || !selectedProject) return;

    setIsSyncing(true);
    // Optimistic Update
    const updatedMilestones = (selectedProject.milestones || []).map(m => 
      m.id === milestoneId ? { ...m, status } : m
    );
    const updatedProject = { ...selectedProject, milestones: updatedMilestones };
    
    // Update local state immediately
    setSelectedProject(updatedProject);
    
    // Call parent update and wait for DB
    try {
      await onUpdateProject(updatedProject);
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden mt-6">
      {activeCall && (
        <VideoCall 
          projectId={selectedProject?.id} 
          onLeave={() => setActiveCall(false)} 
        />
      )}
      <FocusMode 
        isOpen={showFocusMode} 
        onClose={() => setShowFocusMode(false)}
        tasks={(selectedProject?.milestones || []).map(m => ({
          id: m.id,
          title: m.title,
          completed: m.status === 'Completed'
        }))}
      />
      {/* Workspace Header */}
      <div className="bg-slate-900 p-6 text-white">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center border border-white/10">
              <Layout className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold tracking-tight">Collaborative Workspace</h3>
              <p className="text-slate-400 text-[10px] font-medium uppercase tracking-widest mt-0.5">Projects • Reviews • AI Notes</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={() => setActiveTab("dashboard")}
              className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/10 rounded-lg text-xs font-bold transition-all uppercase tracking-wider"
            >
              <LayoutDashboard className="w-3.5 h-3.5 text-indigo-400" />
              Open Full Dashboard
            </button>
            <button 
              onClick={() => setActiveCall(true)}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg text-xs font-bold transition-all shadow-lg shadow-indigo-600/20 uppercase tracking-wider"
            >
              <Video className="w-3.5 h-3.5" />
              Start Meeting
            </button>
          </div>
        </div>

        <div className="flex gap-1 p-1 bg-slate-800/50 rounded-lg w-fit border border-white/5">
          {[
            { id: "dashboard", label: "Full Dashboard", icon: LayoutDashboard },
            { id: "active", label: "Active Projects", icon: Clock },
            { id: "pulse", label: "AI Pulse Board", icon: Activity },
            { id: "warroom", label: "Project War Room", icon: Shield },
            { id: "wellness", label: "Sustainable Performance", icon: Zap },
            { id: "contract", label: "Manage Contract", icon: FileText },
            { id: "reviews", label: "Project Tools", icon: Layout },
            { id: "calls", label: "AI Meeting Notes", icon: MessageSquare },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id as any);
                if (tab.id === 'warroom') setShowWarRoom(true);
                else setShowWarRoom(false);
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-md text-[10px] font-bold uppercase tracking-wider transition-all ${
                activeTab === tab.id ? "bg-slate-700 text-white shadow-sm" : "text-slate-400 hover:text-slate-200"
              }`}
            >
              {tab.id === 'warroom' ? <Shield className="w-3.5 h-3.5" /> : <tab.icon className="w-3.5 h-3.5" />}
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="p-6">
        <AnimatePresence mode="wait">
          {activeTab === "dashboard" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              {/* Top Stats Bar */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[
                  { label: "Total Revenue", value: "$12,450", icon: DollarSign, color: "text-emerald-500", bg: "bg-emerald-50" },
                  { label: "Active Projects", value: projects.length.toString(), icon: Layout, color: "text-indigo-500", bg: "bg-indigo-50" },
                  { label: "Avg. Velocity", value: "94%", icon: TrendingUp, color: "text-amber-500", bg: "bg-amber-50" },
                  { label: "Sustainability Index", value: `${wellnessData.sustainabilityIndex}%`, icon: Zap, color: "text-purple-500", bg: "bg-purple-50" },
                ].map((stat, i) => (
                  <div key={i} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-md transition-all group">
                    <div className="flex justify-between items-start mb-4">
                      <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110", stat.bg)}>
                        <stat.icon className={cn("w-6 h-6", stat.color)} />
                      </div>
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Live</span>
                    </div>
                    <h3 className="text-2xl font-black text-slate-900 tracking-tighter">{stat.value}</h3>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-tight mt-1">{stat.label}</p>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Insight Card */}
                <div className="lg:col-span-2 space-y-8">
                  <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-2xl">
                    <div className="relative z-10">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="px-3 py-1 bg-indigo-500/20 border border-indigo-500/30 rounded-full">
                          <span className="text-[10px] font-black text-indigo-300 uppercase tracking-widest">AI Intelligence Report</span>
                        </div>
                        <div className="px-3 py-1 bg-emerald-500/20 border border-emerald-500/30 rounded-full">
                          <span className="text-[10px] font-black text-emerald-300 uppercase tracking-widest">Optimal Performance</span>
                        </div>
                      </div>
                      
                      <h2 className="text-4xl font-black tracking-tight mb-4">Your workspace is <span className="text-indigo-400">operating at peak efficiency.</span></h2>
                      <p className="text-slate-400 text-lg font-medium max-w-xl mb-8">AI analysis shows that your current squad configuration and wellness levels are perfectly aligned for the upcoming milestones.</p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-white/5 border border-white/10 rounded-2xl p-5 hover:bg-white/10 transition-colors cursor-pointer group">
                          <div className="flex items-center gap-3 mb-3">
                            <ShieldCheck className="w-5 h-5 text-indigo-400" />
                            <h4 className="text-sm font-black uppercase tracking-wider">Burnout Protection</h4>
                          </div>
                          <p className="text-xs text-slate-400 leading-relaxed">Risk score is <span className="text-white font-bold">low ({wellnessData.burnoutRiskScore}%)</span>. Recommended focus block: 2 hours this afternoon.</p>
                        </div>
                        <div className="bg-white/5 border border-white/10 rounded-2xl p-5 hover:bg-white/10 transition-colors cursor-pointer group">
                          <div className="flex items-center gap-3 mb-3">
                            <Zap className="w-5 h-5 text-amber-400" />
                            <h4 className="text-sm font-black uppercase tracking-wider">Energy Forecasting</h4>
                          </div>
                          <p className="text-xs text-slate-400 leading-relaxed">Next week&apos;s predicted capacity: <span className="text-white font-bold">38.5 hours</span>. Ideal for high-intensity tasks.</p>
                        </div>
                      </div>
                    </div>
                    <Brain className="absolute -right-12 -bottom-12 w-64 h-64 text-white/5 rotate-12" />
                  </div>

                  {/* Project Quick View */}
                  <div className="bg-white rounded-[2.5rem] border border-slate-100 p-8 shadow-sm">
                    <div className="flex justify-between items-center mb-8">
                      <div>
                        <h3 className="text-xl font-black text-slate-900 tracking-tight">Active Projects Insight</h3>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Real-time delivery status</p>
                      </div>
                      <button className="text-xs font-black text-indigo-600 uppercase tracking-widest hover:underline">View All Projects</button>
                    </div>

                    <div className="space-y-4">
                      {projects.length > 0 ? projects.slice(0, 3).map((project, i) => (
                        <div key={project.id} className="flex items-center justify-between p-4 rounded-2xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100 group">
                          <div className="flex items-center gap-4">
                            <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center font-black text-white shadow-lg", i === 0 ? "bg-indigo-600" : i === 1 ? "bg-slate-800" : "bg-purple-600")}>
                              {project.title[0]}
                            </div>
                            <div>
                              <h4 className="text-sm font-black text-slate-900">{project.title}</h4>
                              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">{project.client} • {project.workspaceType}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-8">
                            <div className="hidden md:block">
                              <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Progress</div>
                              <div className="w-32 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                <motion.div 
                                  initial={{ width: 0 }}
                                  animate={{ width: `${project.progress || 0}%` }}
                                  className="h-full bg-indigo-600"
                                />
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Status</div>
                              <span className="text-[10px] font-black px-2 py-1 rounded-md bg-indigo-50 text-indigo-600 uppercase tracking-wider">{project.status}</span>
                            </div>
                            <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-slate-900 transition-colors" />
                          </div>
                        </div>
                      )) : (
                        <div className="text-center py-12 bg-slate-50 rounded-3xl border border-dashed border-slate-200">
                          <Layout className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                          <p className="text-sm font-bold text-slate-400">No active projects found.</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Sidebar Analytics */}
                <div className="space-y-8">
                  {/* Wellness Gauge */}
                  <div className="bg-white rounded-[2.5rem] border border-slate-100 p-8 shadow-sm">
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-6">Performance Index</h4>
                    <div className="relative flex justify-center items-center mb-6">
                      <svg className="w-40 h-40">
                        <circle cx="80" cy="80" r="70" className="fill-none stroke-slate-100 stroke-[12]" />
                        <motion.circle 
                          cx="80" cy="80" r="70" 
                          className="fill-none stroke-indigo-600 stroke-[12]" 
                          strokeDasharray="440"
                          initial={{ strokeDashoffset: 440 }}
                          animate={{ strokeDashoffset: 440 - (440 * wellnessData.sustainabilityIndex) / 100 }}
                          strokeLinecap="round"
                        />
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-3xl font-black text-slate-900">{wellnessData.sustainabilityIndex}%</span>
                        <span className="text-[10px] font-bold text-slate-400 uppercase">Sustainable</span>
                      </div>
                    </div>
                    <p className="text-center text-[10px] text-slate-500 font-medium px-4">Your current workload vs energy levels is <span className="text-indigo-600 font-bold">Highly Optimized</span>.</p>
                  </div>

                  {/* Quick Actions */}
                  <div className="bg-indigo-600 rounded-[2.5rem] p-8 text-white shadow-xl shadow-indigo-200">
                    <h3 className="text-xl font-black mb-6">Quick Actions</h3>
                    <div className="space-y-3">
                      {[
                        { label: "Launch War Room", icon: Shield, tab: "warroom" },
                        { label: "Manage Contract", icon: FileText, tab: "contract" },
                        { label: "New Project", icon: Plus, action: () => setIsCreatingProject(true) },
                        { label: "Check AI Pulse", icon: Activity, tab: "pulse" },
                        { label: "Open Focus Mode", icon: Brain, action: () => setShowFocusMode(true) },
                      ].map((action, i) => (
                        <button 
                          key={i} 
                          onClick={() => {
                            if (action.tab) setActiveTab(action.tab as any);
                            if (action.action) action.action();
                          }}
                          className="w-full flex items-center justify-between p-4 bg-white/10 hover:bg-white/20 border border-white/10 rounded-2xl transition-all group"
                        >
                          <div className="flex items-center gap-3">
                            <action.icon className="w-5 h-5 text-indigo-200" />
                            <span className="text-sm font-bold uppercase tracking-wide">{action.label}</span>
                          </div>
                          <ArrowUpRight className="w-4 h-4 text-indigo-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Upcoming Schedule */}
                  <div className="bg-white rounded-[2.5rem] border border-slate-100 p-8 shadow-sm">
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-6">Upcoming Milestones</h4>
                    <div className="space-y-6">
                      {selectedMilestones.length > 0 ? selectedMilestones.slice(0, 2).map((m, i) => (
                        <div key={m.id || i} className="flex gap-4">
                          <div className="flex flex-col items-center">
                            <div className="w-2 h-2 bg-indigo-600 rounded-full" />
                            <div className="w-0.5 h-full bg-slate-100" />
                          </div>
                          <div>
                            <h5 className="text-sm font-black text-slate-900 leading-none mb-1">{m.title}</h5>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight mb-2">{m.dueDate || 'Mar 15, 2024'}</p>
                            <span className="text-[10px] font-black px-2 py-0.5 bg-slate-100 rounded text-slate-600 uppercase tracking-widest">Pending</span>
                          </div>
                        </div>
                      )) : (
                        <p className="text-xs font-bold text-slate-400 uppercase text-center py-4">No upcoming milestones.</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === "wellness" && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <WellnessDashboard 
                wellness={wellnessData} 
                revenuePerHour={85} 
              />
              <div className="mt-8 flex justify-center">
                <button 
                  onClick={() => setShowFocusMode(true)}
                  className="flex items-center gap-2 px-8 py-4 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/20"
                >
                  <Brain className="w-5 h-5" />
                  Enter Focus Environment
                </button>
              </div>
            </motion.div>
          )}

          {activeTab === "pulse" && (
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="space-y-6"
            >
              {selectedProject ? (
                <div className="space-y-6">
                  {/* AI Health Nudge */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    <div className="md:col-span-2 bg-gradient-to-r from-slate-900 to-indigo-900 border border-slate-800 p-6 rounded-3xl flex items-center justify-between shadow-xl relative overflow-hidden group">
                      <div className="relative z-10">
                        <h4 className="text-[10px] font-black text-indigo-300 uppercase tracking-[0.2em] mb-1">AI Velocity Prediction</h4>
                        <div className="flex items-end gap-2">
                          <span className="text-3xl font-black text-white tracking-tighter">On Track</span>
                          <span className="text-xs font-bold text-emerald-400 mb-1.5 flex items-center gap-1">
                            <TrendingUp className="w-3 h-3" />
                            +12% vs last week
                          </span>
                        </div>
                        <p className="text-[10px] text-indigo-200/60 mt-2 font-medium">Predicted Completion: <span className="text-white font-bold">March 14, 2024</span></p>
                      </div>
                      <BarChart3 className="absolute -right-4 -bottom-4 w-24 h-24 text-white/5 group-hover:text-white/10 transition-colors" />
                    </div>

                    <div className="bg-white border border-slate-100 p-5 rounded-3xl shadow-sm flex flex-col justify-center items-center text-center">
                      <div className="w-10 h-10 bg-amber-50 rounded-full flex items-center justify-center mb-2">
                        <Zap className="w-5 h-5 text-amber-500" />
                      </div>
                      <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Energy Burn Rate</span>
                      <span className="text-xl font-black text-slate-900">2.4<span className="text-[10px] text-slate-400 font-bold ml-1">pts/hr</span></span>
                    </div>

                    <div className="bg-white border border-slate-100 p-5 rounded-3xl shadow-sm flex flex-col justify-center items-center text-center">
                      <div className="w-10 h-10 bg-indigo-50 rounded-full flex items-center justify-center mb-2">
                        <Smile className="w-5 h-5 text-indigo-500" />
                      </div>
                      <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Sentiment Health</span>
                      <span className="text-xl font-black text-slate-900">Positive</span>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-100 p-4 rounded-2xl flex items-center justify-between shadow-sm">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-white rounded-xl shadow-sm border border-amber-100 flex items-center justify-center">
                        <Activity className="w-6 h-6 text-amber-500 animate-pulse" />
                      </div>
                      <div>
                        <h4 className="text-sm font-black text-amber-900 uppercase tracking-tight">AI Project Pulse</h4>
                        <p className="text-xs text-amber-700 font-medium">
                          {wellnessData.energyRating === "Low" 
                            ? "CRITICAL: Worker energy is Low. AI predicts 20% slower velocity this week." 
                            : "HEALTHY: Current energy levels match project requirements. On track for Mar 15."}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-black bg-amber-500 text-white px-3 py-1.5 rounded-lg uppercase tracking-widest shadow-lg shadow-amber-200">
                        {wellnessData.energyRating} Energy Match
                      </span>
                    </div>
                  </div>

                  {/* Kanban Board */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {["Todo", "In-Progress", "Done"].map((col) => (
                      <div key={col} className="bg-slate-50/50 rounded-2xl p-4 border border-slate-100 min-h-[400px]">
                        <div className="flex justify-between items-center mb-4 px-2">
                          <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{col}</h5>
                          <span className="w-5 h-5 bg-slate-200 rounded-full flex items-center justify-center text-[10px] font-bold text-slate-500">
                            {(selectedProject.tasks || [
                              { id: 't1', title: 'Design Auth Flow', status: 'Todo', energyCost: 'Medium' },
                              { id: 't2', title: 'Fix API Bug', status: 'In-Progress', energyCost: 'High' },
                              { id: 't3', title: 'Setup DB Schema', status: 'Done', energyCost: 'Low' }
                            ]).filter(t => t.status === col).length}
                          </span>
                        </div>
                        
                        <div className="space-y-3">
                          {(selectedProject.tasks || [
                            { id: 't1', title: 'Design Auth Flow', status: 'Todo', energyCost: 'Medium' },
                            { id: 't2', title: 'Fix API Bug', status: 'In-Progress', energyCost: 'High' },
                            { id: 't3', title: 'Setup DB Schema', status: 'Done', energyCost: 'Low' }
                          ]).filter(t => t.status === col).map((task) => (
                            <motion.div 
                              key={task.id}
                              whileHover={{ y: -2, scale: 1.02 }}
                              className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm hover:border-indigo-200 transition-all cursor-grab active:cursor-grabbing"
                            >
                              <h6 className="text-sm font-bold text-slate-900 mb-2">{task.title}</h6>
                              <div className="flex justify-between items-center mt-3">
                                <div className="flex items-center gap-1.5">
                                  <div className={cn(
                                    "w-1.5 h-1.5 rounded-full",
                                    task.energyCost === 'High' ? "bg-rose-500" : task.energyCost === 'Medium' ? "bg-amber-500" : "bg-emerald-500"
                                  )} />
                                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{task.energyCost} Energy</span>
                                </div>
                                <div className="w-6 h-6 rounded-full bg-slate-100 border border-white flex items-center justify-center">
                                  <Smile className="w-3.5 h-3.5 text-slate-400" />
                                </div>
                              </div>
                            </motion.div>
                          ))}
                          <button className="w-full py-3 border-2 border-dashed border-slate-200 rounded-xl text-[10px] font-black text-slate-400 uppercase tracking-widest hover:border-indigo-200 hover:text-indigo-400 transition-all mt-2">
                            + New Task
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* TARA Smart Automations */}
                  <div className="mt-8 border-t border-slate-100 pt-8">
                    <div className="flex items-center justify-between mb-4 px-2">
                      <div className="flex items-center gap-2">
                        <Zap className="w-4 h-4 text-indigo-600" />
                        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">TARA Smart Workflows</h4>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded">{workflows.length} Active Automations</span>
                        <button 
                          onClick={() => setIsCreatingWorkflow(true)}
                          className="flex items-center gap-1 text-[10px] font-black text-indigo-600 hover:underline uppercase tracking-widest"
                        >
                          <Plus className="w-3 h-3" /> Add Workflow
                        </button>
                      </div>
                    </div>

                    {isCreatingWorkflow && (
                      <div className="p-5 bg-white border-2 border-indigo-100 rounded-3xl mb-4 shadow-xl">
                        <h4 className="text-xs font-black text-slate-900 uppercase tracking-tight mb-4">Build New Automation</h4>
                        <div className="space-y-4 mb-4">
                          <div>
                            <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-1">Workflow Name</label>
                            <input 
                              type="text" 
                              value={newWorkflow.name}
                              onChange={(e) => setNewWorkflow({...newWorkflow, name: e.target.value})}
                              className="w-full p-2.5 bg-slate-50 border border-slate-100 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500 outline-none"
                              placeholder="e.g. Weekly Status Update"
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-1">Trigger (IF...)</label>
                              <input 
                                type="text" 
                                value={newWorkflow.trigger}
                                onChange={(e) => setNewWorkflow({...newWorkflow, trigger: e.target.value})}
                                className="w-full p-2.5 bg-slate-50 border border-slate-100 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500 outline-none"
                                placeholder="IF task is done"
                              />
                            </div>
                            <div>
                              <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-1">Action (THEN...)</label>
                              <input 
                                type="text" 
                                value={newWorkflow.action}
                                onChange={(e) => setNewWorkflow({...newWorkflow, action: e.target.value})}
                                className="w-full p-2.5 bg-slate-50 border border-slate-100 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500 outline-none"
                                placeholder="THEN notify client"
                              />
                            </div>
                          </div>
                        </div>
                        <div className="flex justify-end gap-2">
                          <button 
                            onClick={() => setIsCreatingWorkflow(false)}
                            className="px-3 py-1.5 text-[10px] font-bold text-slate-500 uppercase"
                          >
                            Cancel
                          </button>
                          <button 
                            onClick={handleCreateWorkflow}
                            className="px-4 py-1.5 bg-indigo-600 text-white rounded-lg text-[10px] font-bold hover:bg-indigo-700"
                          >
                            ACTIVATE WORKFLOW
                          </button>
                        </div>
                      </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {workflows.map((wf) => (
                        <div key={wf.id} className="p-5 bg-slate-50/50 rounded-3xl border border-slate-100 flex items-start gap-4 group hover:bg-white hover:border-indigo-100 transition-all cursor-pointer shadow-sm hover:shadow-md">
                          <div className={`w-10 h-10 ${wf.color} text-white rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                            {wf.icon === 'Zap' ? <Zap className="w-5 h-5" /> : <Activity className="w-5 h-5" />}
                          </div>
                          <div>
                            <p className="text-xs font-black text-slate-900 uppercase tracking-tight">{wf.name}</p>
                            <p className="text-[10px] text-slate-500 mt-1 leading-relaxed">{wf.trigger} THEN <span className="text-indigo-600 font-bold">{wf.action}</span>.</p>
                          </div>
                          <div className="ml-auto">
                            <div className={`w-8 h-4 ${wf.active ? 'bg-emerald-500' : 'bg-slate-300'} rounded-full p-1 flex ${wf.active ? 'justify-end' : 'justify-start'} shadow-inner`}>
                              <div className="w-2 h-2 bg-white rounded-full"></div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-slate-100">
                  <Activity className="w-12 h-12 text-slate-200 mx-auto mb-4" />
                  <h4 className="font-bold text-slate-900">Project Pulse requires a project</h4>
                  <p className="text-sm text-slate-500 mt-1">Select a project to see real-time performance and task visualizer.</p>
                </div>
              )}
            </motion.div>
          )}

          {activeTab === "active" && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-black text-slate-900 uppercase tracking-tighter">My Active Workspaces</h3>
                <button 
                  onClick={() => setIsCreatingProject(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100"
                >
                  <Plus className="w-4 h-4" />
                  NEW WORKSPACE
                </button>
              </div>

              {isCreatingProject && (
                <div className="p-6 border-2 border-indigo-500 bg-indigo-50/30 rounded-2xl mb-6">
                  <h4 className="text-sm font-black text-slate-900 uppercase tracking-tight mb-4">Initialize New Workspace</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Project Name</label>
                      <input 
                        type="text" 
                        value={newProject.title}
                        onChange={(e) => setNewProject({...newProject, title: e.target.value})}
                        className="w-full p-3 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                        placeholder="e.g. Next.js SaaS Platform"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Client Name</label>
                      <input 
                        type="text" 
                        value={newProject.client}
                        onChange={(e) => setNewProject({...newProject, client: e.target.value})}
                        className="w-full p-3 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                        placeholder="e.g. Acme Corp"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Workspace Type</label>
                      <select 
                        value={newProject.workspaceType}
                        onChange={(e) => setNewProject({...newProject, workspaceType: e.target.value as WorkspaceType})}
                        className="w-full p-3 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none appearance-none"
                      >
                        <option value="General">General</option>
                        <option value="Code">Software Development</option>
                        <option value="Design">Graphic & UI/UX Design</option>
                        <option value="Marketing">Marketing & Social Media</option>
                        <option value="Admin/VA">Administrative / VA</option>
                        <option value="Writing">Writing & Content</option>
                        <option value="Data & Automation">Data & Automation</option>
                      </select>
                    </div>
                  </div>
                  <div className="flex justify-end gap-3">
                    <button 
                      onClick={() => setIsCreatingProject(false)}
                      className="px-4 py-2 text-xs font-bold text-slate-500 hover:text-slate-700 uppercase tracking-wider"
                    >
                      Cancel
                    </button>
                    <button 
                      onClick={handleCreateProject}
                      className="px-6 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-700 transition-all shadow-lg"
                    >
                      CREATE WORKSPACE
                    </button>
                  </div>
                </div>
              )}

              {projects.length > 0 ? (
                projects.map((project) => (
                  <div 
                    key={project.id} 
                    className={cn(
                      "group p-5 border rounded-xl transition-all cursor-pointer",
                      selectedProject?.id === project.id ? "border-indigo-500 bg-indigo-50/50" : "border-slate-100 hover:border-indigo-100 hover:bg-indigo-50/30"
                    )}
                    onClick={() => setSelectedProject(project)}
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex gap-4">
                        <div className={`w-12 h-12 rounded-lg flex items-center justify-center border border-transparent group-hover:border-indigo-100 transition-colors ${
                          project.workspaceType === "Code" ? "bg-blue-50 text-blue-600" : 
                          project.workspaceType === "Design" ? "bg-purple-50 text-purple-600" :
                          project.workspaceType === "Marketing" ? "bg-orange-50 text-orange-600" :
                          project.workspaceType === "Admin/VA" ? "bg-emerald-50 text-emerald-600" :
                          project.workspaceType === "Writing" ? "bg-amber-50 text-amber-600" :
                          project.workspaceType === "Data & Automation" ? "bg-cyan-50 text-cyan-600" :
                          "bg-slate-50 text-slate-600"
                        }`}>
                          {project.workspaceType === "Code" && <Github className="w-6 h-6" />}
                          {project.workspaceType === "Design" && <Layout className="w-6 h-6" />}
                          {project.workspaceType === "Marketing" && <BarChart3 className="w-6 h-6" />}
                          {project.workspaceType === "Admin/VA" && <Trello className="w-6 h-6" />}
                          {project.workspaceType === "Writing" && <FileText className="w-6 h-6" />}
                          {project.workspaceType === "Data & Automation" && <Zap className="w-6 h-6" />}
                          {project.workspaceType === "General" && <LayoutDashboard className="w-6 h-6" />}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="text-base font-bold text-slate-900 group-hover:text-indigo-600 transition-colors tracking-tight">
                              {project.title}
                            </h4>
                            {selectedProject?.id === project.id && (
                              <span className="bg-indigo-600 text-white text-[8px] font-black px-1.5 py-0.5 rounded uppercase tracking-tighter">Selected</span>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            <p className="text-xs text-slate-500 font-medium">Client: <span className="font-bold text-slate-700 uppercase tracking-tight">{project.client}</span></p>
                            <Link 
                              href={project.clientId ? `/messages?with=${project.clientId}` : "/messages"} 
                              onClick={(e) => e.stopPropagation()}
                              className="text-slate-300 hover:text-indigo-600 transition-colors"
                              title={`Message ${project.client}`}
                            >
                              <MessageSquare className="w-3.5 h-3.5" />
                            </Link>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <span className="text-[10px] font-bold uppercase tracking-widest bg-emerald-50 text-emerald-700 px-2 py-1 rounded-lg border border-emerald-100">
                          {project.status}
                        </span>
                        <div className="flex flex-col items-end gap-1">
                          <div className="flex items-center gap-1 text-[9px] font-bold text-slate-400 uppercase tracking-wider">
                            <Lock className="w-3 h-3" />
                            Escrow Active
                          </div>
                          {wellnessData.currentWorkload > wellnessData.weeklyCapacity * 0.9 && (
                            <div className="flex items-center gap-1 text-[9px] font-black text-rose-600 bg-rose-50 px-1.5 py-0.5 rounded border border-rose-100 uppercase tracking-tighter animate-pulse">
                              <AlertTriangle className="w-2.5 h-2.5" />
                              Overcommitment Risk
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-slate-100 group-hover:border-indigo-100">
                      <div className="flex flex-col">
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Logged Hours</span>
                        <span className="text-sm font-bold text-slate-900">{project.hoursLogged}h / 40h</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Next Milestone</span>
                        <span className="text-sm font-bold text-slate-900">{project.budget} Due Mar 15</span>
                      </div>
                      <div className="flex items-center justify-end gap-3">
                        <button 
                          onClick={(e) => { e.stopPropagation(); setSelectedProject(project); setActiveTab("warroom"); }}
                          className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-[10px] font-bold hover:bg-indigo-700 transition-all shadow-md shadow-indigo-100 uppercase tracking-wider flex items-center gap-2"
                        >
                          <Zap className="w-3 h-3" />
                          War Room
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12 border-2 border-dashed border-slate-100 rounded-3xl">
                  <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Clock className="w-8 h-8 text-slate-300" />
                  </div>
                  <h4 className="text-slate-900 font-bold">No Active Projects</h4>
                  <p className="text-slate-500 text-sm max-w-xs mx-auto mt-1">Start applying for jobs to begin collaborating in your workspace.</p>
                </div>
              )}
            </motion.div>
          )}

          {activeTab === "warroom" && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="space-y-6"
            >
              {selectedProject ? (
                <div className="bg-slate-50 rounded-3xl border border-slate-200 p-8">
                  <div className="flex justify-between items-start mb-8">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-200">
                          <Shield className="w-5 h-5" />
                        </div>
                        <h3 className="text-2xl font-black text-slate-900 tracking-tight">{selectedProject.title}</h3>
                      </div>
                      <p className="text-slate-500 font-medium">Collaborating with <span className="text-slate-900 font-bold">{selectedProject.client}</span></p>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-black text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100 uppercase tracking-widest">Live War Room</span>
                      <div className="flex items-center justify-end gap-2 mt-2">
                        {isSyncing ? (
                          <>
                            <Loader2 className="w-2.5 h-2.5 animate-spin text-indigo-600" />
                            <p className="text-[10px] text-indigo-600 font-bold uppercase tracking-widest">Syncing to DB...</p>
                          </>
                        ) : (
                          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Optimistic UI Enabled</p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Progress Section */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <div className="md:col-span-3 space-y-3">
                      <div className="flex justify-between items-center text-xs font-bold uppercase tracking-widest text-slate-500">
                        <span>Project Completion</span>
                        <span className="text-indigo-600">
                          {Math.round(((selectedProject.milestones?.filter(m => m.status === 'Completed' || m.status === 'Released').length || 0) / Math.max(selectedProject.milestones?.length || 1, 1)) * 100)}%
                        </span>
                      </div>
                      <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden p-0.5">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${((selectedProject.milestones?.filter(m => m.status === 'Completed' || m.status === 'Released').length || 0) / Math.max(selectedProject.milestones?.length || 1, 1)) * 100}%` }}
                          className="h-full bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-full shadow-sm"
                        />
                      </div>
                    </div>
                    <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-center">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Budget</span>
                      <span className="text-xl font-black text-slate-900">{selectedProject.budget}</span>
                    </div>
                  </div>

                  {/* Milestones Grid */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest">Milestones Tracking</h4>
                      <div className="flex items-center gap-2 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg">
                        <Zap className="w-3 h-3" />
                        Real-time Sync Active
                      </div>
                    </div>
                    
                    <div className="grid gap-3">
                      {(selectedProject.milestones || [
                        { id: '1', title: 'Initial Project Setup', dueDate: 'Mar 1', amount: 5000, status: 'Released' },
                        { id: '2', title: 'Core Functionality', dueDate: 'Mar 15', amount: 10000, status: 'In-Progress' },
                        { id: '3', title: 'Final Review & Handover', dueDate: 'Apr 1', amount: 5000, status: 'Pending' }
                      ]).map((milestone) => (
                        <div 
                          key={milestone.id} 
                          className={cn(
                            "p-5 rounded-2xl border transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 relative overflow-hidden",
                            milestone.status === 'Released' ? "bg-white border-emerald-100" :
                            milestone.status === 'Completed' ? "bg-white border-indigo-100" :
                            "bg-white border-slate-100 hover:border-indigo-100",
                            isSyncing && "opacity-70"
                          )}
                        >
                          {isSyncing && (
                            <div className="absolute inset-0 bg-white/10 backdrop-blur-[1px] z-10 flex items-center justify-center pointer-events-none" />
                          )}
                          <div className="flex items-center gap-4">
                            <div className={cn(
                              "w-10 h-10 rounded-xl flex items-center justify-center transition-colors",
                              milestone.status === 'Released' ? "bg-emerald-500 text-white" :
                              milestone.status === 'Completed' ? "bg-indigo-500 text-white" :
                              milestone.status === 'In-Progress' ? "bg-amber-500 text-white" :
                              "bg-slate-100 text-slate-400"
                            )}>
                              {milestone.status === 'Released' ? <CheckCircle2 className="w-6 h-6" /> : 
                               milestone.status === 'Completed' ? <CheckCircle2 className="w-6 h-6" /> : 
                               milestone.status === 'In-Progress' ? <Clock className="w-6 h-6" /> : 
                               <Lock className="w-5 h-5" />}
                            </div>
                            <div>
                              <p className="font-bold text-slate-900">{milestone.title}</p>
                              <div className="flex items-center gap-3 mt-0.5">
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
                                  <Clock className="w-3 h-3" />
                                  Due {milestone.dueDate}
                                </span>
                                {milestone.status === 'In-Progress' && wellnessData.currentWorkload > wellnessData.weeklyCapacity * 0.8 && (
                                  <span className="text-[10px] font-black text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-100 uppercase tracking-tighter flex items-center gap-1">
                                    <Zap className="w-2.5 h-2.5" />
                                    Healthy Suggestion: Mar 18
                                  </span>
                                )}
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
                                  <DollarSign className="w-3 h-3" />
                                  ₱{milestone.amount}
                                </span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-3">
                            <div className="flex flex-col items-end mr-2">
                              <span className={cn(
                                "text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-lg border",
                                milestone.status === 'Released' ? "bg-emerald-50 text-emerald-700 border-emerald-100" :
                                milestone.status === 'Completed' ? "bg-indigo-50 text-indigo-700 border-indigo-100" :
                                milestone.status === 'In-Progress' ? "bg-amber-50 text-amber-700 border-amber-100" :
                                "bg-slate-50 text-slate-500 border-slate-100"
                              )}>
                                {milestone.status}
                              </span>
                            </div>
                            <select 
                              value={milestone.status}
                              disabled={isSyncing}
                              onChange={(e) => handleUpdateMilestone(selectedProject.id, milestone.id, e.target.value as any)}
                              className="text-[10px] font-bold uppercase tracking-wider bg-slate-900 text-white rounded-xl px-4 py-2 hover:bg-black transition-all cursor-pointer outline-none border-none disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              <option value="Pending">Pending</option>
                              <option value="In-Progress">In-Progress</option>
                              <option value="Completed">Completed</option>
                              <option value="Released">Released</option>
                            </select>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-slate-100">
                  <Shield className="w-12 h-12 text-slate-200 mx-auto mb-4" />
                  <h4 className="font-bold text-slate-900">Select a project to enter War Room</h4>
                  <p className="text-sm text-slate-500 mt-1">Real-time collaboration is just a click away.</p>
                </div>
              )}
            </motion.div>
          )}
          {activeTab === "contract" && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-8"
            >
              {selectedProject ? (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-2 space-y-6">
                    {/* Contract Header */}
                    <div className="bg-white border border-slate-100 p-8 rounded-[2.5rem] shadow-sm relative overflow-hidden">
                      <div className="flex justify-between items-start mb-8 relative z-10">
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-[10px] font-black bg-emerald-100 text-emerald-700 px-2 py-1 rounded uppercase tracking-widest">Active Agreement</span>
                            <span className="text-[10px] font-black bg-slate-100 text-slate-500 px-2 py-1 rounded uppercase tracking-widest">ID: CON-{(selectedProject.id || "001").slice(0, 8)}</span>
                          </div>
                          <h3 className="text-2xl font-black text-slate-900 tracking-tight">Professional Services Agreement</h3>
                          <p className="text-sm text-slate-500 mt-1">Between <span className="font-bold text-slate-900">You</span> and <span className="font-bold text-slate-900">{selectedProject.client}</span></p>
                        </div>
                        <div className="text-right">
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Contract Value</p>
                          <h4 className="text-2xl font-black text-emerald-600 tracking-tighter">{selectedProject.budget}</h4>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 relative z-10">
                        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                          <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Effective Date</p>
                          <p className="text-sm font-bold text-slate-900">Jan 12, 2024</p>
                        </div>
                        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                          <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Payment Type</p>
                          <p className="text-sm font-bold text-slate-900">Milestone-based</p>
                        </div>
                        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                          <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Jurisdiction</p>
                          <p className="text-sm font-bold text-slate-900">Republic of the Philippines</p>
                        </div>
                      </div>

                      <div className="bg-indigo-50 border border-indigo-100 p-6 rounded-3xl relative z-10 group/audit cursor-pointer hover:bg-indigo-100/50 transition-all"
                           onClick={() => setShowAIClauseAudit(true)}>
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center">
                              <ShieldCheck className="w-5 h-5 text-white" />
                            </div>
                            <div>
                              <h4 className="text-sm font-black text-indigo-900 uppercase tracking-tight">AI Clause Audit</h4>
                              <p className="text-[10px] text-indigo-700 font-medium">Last audited: Today at 2:45 PM</p>
                            </div>
                          </div>
                          <button className="px-3 py-1 bg-indigo-600 text-white rounded-lg text-[9px] font-black uppercase tracking-widest hover:bg-indigo-700 shadow-lg shadow-indigo-200 opacity-0 group-hover/audit:opacity-100 transition-opacity">
                            Re-Run Audit
                          </button>
                        </div>
                        <div className="space-y-3">
                          {[
                            { title: "Intellectual Property", status: "Protected", desc: "All work product is owned by Client upon payment.", color: "text-emerald-600" },
                            { title: "Termination Notice", status: "Fair (14 Days)", desc: "Mutual 14-day notice required for contract exit.", color: "text-indigo-600" },
                            { title: "Liability Cap", status: "Secured", desc: "Liability limited to 100% of the total contract fee.", color: "text-emerald-600" },
                          ].map((clause, i) => (
                            <div key={i} className="flex items-start justify-between p-3 bg-white/60 rounded-xl border border-indigo-200/50 hover:bg-white transition-all">
                              <div>
                                <h5 className="text-xs font-bold text-slate-900">{clause.title}</h5>
                                <p className="text-[10px] text-slate-500 mt-0.5">{clause.desc}</p>
                              </div>
                              <span className={cn("text-[9px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded bg-indigo-50", clause.color)}>{clause.status}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      <FileText className="absolute -right-8 -bottom-8 w-40 h-40 text-slate-50 rotate-12" />
                    </div>

                    {/* Milestones & Payout Schedule */}
                    <div className="bg-white border border-slate-100 p-8 rounded-[2.5rem] shadow-sm">
                      <div className="flex justify-between items-center mb-6">
                        <h3 className="text-lg font-black text-slate-900 tracking-tight uppercase">Payment Schedule</h3>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold text-slate-400">Total Milestones:</span>
                          <span className="text-sm font-black text-slate-900">{(selectedProject.milestones || []).length}</span>
                        </div>
                      </div>
                      <div className="space-y-4">
                        {(selectedProject.milestones || []).map((milestone, idx) => (
                          <div key={milestone.id || idx} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100 hover:border-indigo-200 transition-all">
                            <div className="flex items-center gap-4">
                              <div className="w-10 h-10 bg-white rounded-xl border border-slate-200 flex items-center justify-center font-black text-slate-400">
                                0{idx + 1}
                              </div>
                              <div>
                                <p className="text-sm font-bold text-slate-900">{milestone.title}</p>
                                <p className="text-[10px] text-slate-400 font-medium">Due: {milestone.dueDate}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-6">
                              <div className="text-right">
                                <p className="text-sm font-black text-slate-900">₱{milestone.amount.toLocaleString()}</p>
                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{milestone.status}</p>
                              </div>
                              <div className={cn(
                                "w-2.5 h-2.5 rounded-full",
                                milestone.status === 'Released' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 
                                milestone.status === 'Completed' ? 'bg-indigo-500' : 'bg-slate-300'
                              )} />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Sidebar Actions */}
                  <div className="space-y-6">
                    <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white shadow-xl">
                      <h4 className="text-[10px] font-black text-indigo-300 uppercase tracking-[0.2em] mb-6">Contract Governance</h4>
                      <div className="space-y-3">
                        <button className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 rounded-2xl text-xs font-black uppercase tracking-widest transition-all shadow-lg shadow-indigo-500/20">
                          Request Amendment
                        </button>
                        <button className="w-full py-4 bg-white/10 hover:bg-white/20 border border-white/10 rounded-2xl text-xs font-black uppercase tracking-widest transition-all">
                          Download PDF
                        </button>
                        <button className="w-full py-4 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 text-rose-400 rounded-2xl text-xs font-black uppercase tracking-widest transition-all">
                          Termination Notice
                        </button>
                      </div>
                    </div>

                    <div className="bg-emerald-50 border border-emerald-100 rounded-[2.5rem] p-8">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center">
                          <DollarSign className="w-5 h-5 text-white" />
                        </div>
                        <h4 className="text-sm font-black text-emerald-900 uppercase tracking-tight">Payout Security</h4>
                      </div>
                      <p className="text-xs text-emerald-800 leading-relaxed mb-6">
                        Funds for the current milestone are <span className="font-black">Secured in TARA Escrow</span>. Payment will be released automatically upon milestone approval.
                      </p>
                      <div className="p-4 bg-white/60 rounded-2xl border border-emerald-200">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-[10px] font-bold text-emerald-700 uppercase">Escrow Status</span>
                          <span className="text-[10px] font-black text-emerald-600">100% FUNDED</span>
                        </div>
                        <div className="w-full h-1.5 bg-emerald-200 rounded-full overflow-hidden">
                          <div className="w-full h-full bg-emerald-500" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-20 bg-slate-50 rounded-[3rem] border-2 border-dashed border-slate-200">
                  <FileText className="w-16 h-16 text-slate-200 mx-auto mb-4" />
                  <h4 className="text-xl font-black text-slate-900 tracking-tight">No Contract Selected</h4>
                  <p className="text-slate-500 text-sm mt-2 max-w-xs mx-auto">Please select a project from the dashboard to view and manage its legal agreement.</p>
                </div>
              )}
            </motion.div>
          )}

          {activeTab === "reviews" && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              {selectedProject ? (
                <>
                  {/* Dedicated Workspace Content based on Type */}
                  {selectedProject.workspaceType === "Code" && (
                    <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="font-bold flex items-center gap-2">
                          <Github className="w-5 h-5 text-slate-900" />
                          GitHub Sync & Auto-Escrow
                        </h4>
                        <span className="text-[10px] font-black bg-indigo-600 text-white px-2 py-1 rounded">DEV MODE</span>
                      </div>
                      <p className="text-sm text-slate-600 mb-6">
                        Milestones are automatically marked as &quot;In-Review&quot; nang i-merge ang code sa <code className="bg-slate-200 px-1 rounded">main</code> branch.
                      </p>
                      <div className="space-y-3">
                        {[
                          { title: "Frontend Implementation", status: "Merged", branch: "main", amount: "₱15,000", color: "bg-emerald-500" },
                          { title: "API Integration", status: "Pending Merge", branch: "dev", amount: "₱10,000", color: "bg-amber-500" },
                        ].map((m, i) => (
                          <div key={i} className="flex items-center justify-between p-4 bg-white rounded-xl border border-slate-100">
                            <div className="flex items-center gap-3">
                              <div className={`w-2 h-2 rounded-full ${m.color}`}></div>
                              <div>
                                <p className="text-sm font-bold text-slate-900">{m.title}</p>
                                <p className="text-[10px] text-slate-400 font-mono">{m.branch}</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-sm font-bold text-slate-900">{m.amount}</p>
                              <p className={`text-[10px] font-bold ${m.status === 'Merged' ? 'text-emerald-600' : 'text-amber-600'}`}>
                                {m.status === 'Merged' ? '✓ ESCROW RELEASED' : 'PENDING AUTO-RELEASE'}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {selectedProject.workspaceType === "Design" && (
                    <div className="p-6 bg-purple-50 rounded-2xl border border-purple-100">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="font-bold flex items-center gap-2 text-purple-900">
                          <Layout className="w-5 h-5" />
                          Design Asset Hub
                        </h4>
                        <span className="text-[10px] font-black bg-purple-600 text-white px-2 py-1 rounded">DESIGN MODE</span>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {['Logo_Final.svg', 'Brand_Guide.pdf', 'Mobile_UI.fig', 'Banner_Ads.zip'].map((file, i) => (
                          <div key={i} className="bg-white p-4 rounded-xl border border-purple-100 flex flex-col items-center text-center group cursor-pointer hover:shadow-md transition-all">
                            <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                              <FileText className="w-5 h-5 text-purple-600" />
                            </div>
                            <span className="text-[10px] font-bold text-slate-700 truncate w-full">{file}</span>
                            <span className="text-[8px] text-slate-400 mt-1 uppercase tracking-tighter">Ready for Review</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {selectedProject.workspaceType === "Marketing" && (
                    <div className="p-6 bg-orange-50 rounded-2xl border border-orange-100">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="font-bold flex items-center gap-2 text-orange-900">
                          <BarChart3 className="w-5 h-5" />
                          Campaign Performance Board
                        </h4>
                        <span className="text-[10px] font-black bg-orange-600 text-white px-2 py-1 rounded">MARKETING MODE</span>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {[
                          { label: 'Avg. CTR', value: '4.2%', color: 'text-orange-600' },
                          { label: 'Total Reach', value: '12.5k', color: 'text-orange-600' },
                          { label: 'Conversions', value: '342', color: 'text-orange-600' },
                        ].map((stat, i) => (
                          <div key={i} className="bg-white p-4 rounded-xl border border-orange-100 text-center">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</p>
                            <p className={cn("text-2xl font-black mt-1", stat.color)}>{stat.value}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {selectedProject.workspaceType === "Writing" && (
                    <div className="p-6 bg-amber-50 rounded-2xl border border-amber-100">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="font-bold flex items-center gap-2 text-amber-900">
                          <FileText className="w-5 h-5" />
                          Content Editor & SEO Audit
                        </h4>
                        <span className="text-[10px] font-black bg-amber-600 text-white px-2 py-1 rounded">WRITING MODE</span>
                      </div>
                      <div className="bg-white p-4 rounded-xl border border-amber-100">
                        <div className="flex items-center justify-between mb-3 border-b border-slate-100 pb-2">
                          <span className="text-xs font-bold text-slate-600">Draft: blog-post-v1.docx</span>
                          <div className="flex gap-2">
                            <span className="text-[9px] font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">SEO: 92/100</span>
                            <span className="text-[9px] font-black text-amber-600 bg-amber-50 px-2 py-0.5 rounded">Readability: Easy</span>
                          </div>
                        </div>
                        <p className="text-sm text-slate-400 italic">&quot;The future of remote work is not just about tools, but about sustainable energy management...&quot;</p>
                      </div>
                    </div>
                  )}

                  {selectedProject.workspaceType === "Admin/VA" && (
                    <div className="p-6 bg-emerald-50 rounded-2xl border border-emerald-100">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="font-bold flex items-center gap-2 text-emerald-900">
                          <Trello className="w-5 h-5" />
                          Administrative Operations Hub
                        </h4>
                        <span className="text-[10px] font-black bg-emerald-600 text-white px-2 py-1 rounded">ADMIN MODE</span>
                      </div>
                      <div className="space-y-2">
                        {[
                          { task: 'Schedule Board Meeting', due: 'Today', priority: 'High' },
                          { task: 'Process Monthly Invoices', due: 'Tomorrow', priority: 'Medium' },
                          { task: 'Email Management (Inbox Zero)', due: 'Ongoing', priority: 'Low' },
                        ].map((t, i) => (
                          <div key={i} className="flex items-center justify-between p-3 bg-white rounded-lg border border-emerald-100">
                            <div className="flex items-center gap-3">
                              <input type="checkbox" className="rounded text-emerald-600 focus:ring-emerald-500" />
                              <span className="text-xs font-medium text-slate-700">{t.task}</span>
                            </div>
                            <span className={cn(
                              "text-[8px] font-black px-2 py-0.5 rounded uppercase tracking-tighter",
                              t.priority === 'High' ? 'bg-rose-50 text-rose-600' : 'bg-slate-50 text-slate-400'
                            )}>{t.due}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {selectedProject.workspaceType === "Data & Automation" && (
                    <div className="p-6 bg-cyan-50 rounded-2xl border border-cyan-100">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="font-bold flex items-center gap-2 text-cyan-900">
                          <Zap className="w-5 h-5" />
                          Automation Pipelines
                        </h4>
                        <span className="text-[10px] font-black bg-cyan-600 text-white px-2 py-1 rounded">AUTO MODE</span>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {[
                          { name: 'Lead Gen Flow', status: 'Running', success: '99.2%' },
                          { name: 'Auto-Reporting', status: 'Scheduled', success: '100%' },
                        ].map((p, i) => (
                          <div key={i} className="p-4 bg-white rounded-xl border border-cyan-100">
                            <div className="flex justify-between items-center mb-2">
                              <span className="text-xs font-bold text-slate-700">{p.name}</span>
                              <span className="text-[8px] font-black text-cyan-600 uppercase">{p.status}</span>
                            </div>
                            <div className="w-full bg-slate-100 h-1 rounded-full overflow-hidden">
                              <div className="bg-cyan-500 h-full w-[95%]"></div>
                            </div>
                            <p className="text-[9px] text-slate-400 mt-2 font-bold">Uptime: {p.success}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {selectedProject.workspaceType === "General" && (
                    <div className="p-12 text-center bg-slate-50 rounded-3xl border border-slate-200">
                      <LayoutDashboard className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                      <h4 className="text-slate-900 font-bold tracking-tight">Standard Workspace</h4>
                      <p className="text-slate-500 text-sm max-w-xs mx-auto mt-2">Ito ay ang general-purpose workspace. Maaari kang gumamit ng War Room at Pulse tabs para sa advanced project management.</p>
                    </div>
                  )}

                  {/* General tools for all types */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-6 bg-indigo-900 rounded-3xl text-white relative overflow-hidden group">
                      <div className="relative z-10">
                        <Code2 className="w-8 h-8 mb-4 text-indigo-300" />
                        <h5 className="font-bold mb-1">Collaborative Sandbox</h5>
                        <p className="text-xs text-indigo-200 mb-4 opacity-80">Share snippets and live previews with the client.</p>
                        <button className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-xl text-xs font-bold transition-all">
                          Open Sandbox
                        </button>
                      </div>
                      <div className="absolute -right-4 -bottom-4 w-32 h-32 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
                    </div>
                    <div className="p-6 bg-slate-900 rounded-3xl text-white relative overflow-hidden group">
                      <div className="relative z-10">
                        <Activity className="w-8 h-8 mb-4 text-purple-300" />
                        <h5 className="font-bold mb-1">AI Project Audit</h5>
                        <p className="text-xs text-slate-400 mb-4 opacity-80">Get real-time feedback from AI on your current project progress.</p>
                        <button className="px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-xl text-xs font-bold transition-all border border-slate-700">
                          Run Audit
                        </button>
                      </div>
                      <div className="absolute -right-4 -bottom-4 w-32 h-32 bg-purple-500/20 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
                    </div>
                  </div>

                  {/* 3rd Party Integrations Hub */}
                  <div className="mt-8 border-t border-slate-100 pt-8">
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <h5 className="text-sm font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
                          <LinkIcon className="w-4 h-4 text-indigo-600" />
                          Partnerships & Integrations
                        </h5>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight mt-1">Connect your favorite tools to automate your workflow</p>
                      </div>
                      <span className="text-[10px] font-black bg-slate-100 text-slate-400 px-3 py-1 rounded-full">POWERED BY TARA CONNECT</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {(() => {
                        const integrations = {
                          "Data & Automation": [
                            { name: "n8n", description: "Self-hosted workflow automation", icon: Zap, color: "text-orange-500", bg: "bg-orange-50" },
                            { name: "Zapier", description: "Connect apps and automate tasks", icon: Zap, color: "text-orange-600", bg: "bg-orange-100" },
                            { name: "Make.com", description: "Visual automation platform", icon: Activity, color: "text-purple-600", bg: "bg-purple-50" },
                          ],
                          "Marketing": [
                            { name: "HubSpot", description: "CRM & Marketing tools", icon: BarChart3, color: "text-orange-500", bg: "bg-orange-50" },
                            { name: "Mailchimp", description: "Email marketing automation", icon: MessageSquare, color: "text-yellow-600", bg: "bg-yellow-50" },
                            { name: "Meta Ads", description: "Facebook & Instagram advertising", icon: ExternalLink, color: "text-blue-600", bg: "bg-blue-50" },
                          ],
                          "Code": [
                            { name: "GitHub", description: "Source control & CI/CD", icon: Github, color: "text-slate-900", bg: "bg-slate-100" },
                            { name: "Vercel", description: "Deployment & Hosting", icon: ExternalLink, color: "text-black", bg: "bg-slate-200" },
                            { name: "Railway", description: "Infrastructure platform", icon: Activity, color: "text-indigo-600", bg: "bg-indigo-50" },
                          ],
                          "Design": [
                            { name: "Figma", description: "Collaborative interface design", icon: Layout, color: "text-purple-600", bg: "bg-purple-50" },
                            { name: "Canva", description: "Online graphic design tool", icon: Layout, color: "text-cyan-500", bg: "bg-cyan-50" },
                            { name: "Adobe CC", description: "Creative Cloud integration", icon: FileText, color: "text-red-600", bg: "bg-red-50" },
                          ],
                          "Admin/VA": [
                            { name: "Google Workspace", description: "Docs, Sheets, & Calendar", icon: Globe, color: "text-blue-500", bg: "bg-blue-50" },
                            { name: "Slack", description: "Team communication", icon: MessageSquare, color: "text-purple-600", bg: "bg-purple-50" },
                            { name: "Notion", description: "All-in-one workspace", icon: FileText, color: "text-slate-900", bg: "bg-slate-100" },
                          ],
                          "Writing": [
                            { name: "WordPress", description: "Content management system", icon: Globe, color: "text-blue-700", bg: "bg-blue-50" },
                            { name: "Grammarly", description: "Writing assistant", icon: CheckCircle2, color: "text-emerald-600", bg: "bg-emerald-50" },
                            { name: "Ghost", description: "Professional publishing", icon: Activity, color: "text-slate-900", bg: "bg-slate-50" },
                          ],
                          "General": [
                            { name: "Slack", description: "Communication", icon: MessageSquare, color: "text-purple-600", bg: "bg-purple-50" },
                            { name: "Trello", description: "Project management", icon: Trello, color: "text-blue-600", bg: "bg-blue-50" },
                            { name: "Google Drive", description: "Cloud storage", icon: Globe, color: "text-emerald-600", bg: "bg-emerald-50" },
                          ]
                        };

                        const currentIntegrations = integrations[selectedProject.workspaceType as keyof typeof integrations] || integrations["General"];

                        return currentIntegrations.map((app, i) => (
                          <div key={i} className="bg-white p-4 rounded-2xl border border-slate-100 hover:border-indigo-200 hover:shadow-md transition-all group cursor-pointer">
                            <div className="flex items-center gap-3 mb-4">
                              <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110", app.bg)}>
                                <app.icon className={cn("w-5 h-5", app.color)} />
                              </div>
                              <div>
                                <h6 className="text-xs font-black text-slate-900 tracking-tight">{app.name}</h6>
                                <p className="text-[9px] text-slate-400 font-bold uppercase tracking-tighter">{app.description}</p>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <button className="flex-1 py-2 bg-slate-50 group-hover:bg-indigo-600 group-hover:text-white rounded-xl text-[9px] font-black uppercase tracking-widest transition-all">
                                Connect
                              </button>
                              <button className="w-10 h-10 bg-slate-50 flex items-center justify-center rounded-xl text-slate-400 hover:text-slate-600 transition-colors">
                                <ExternalLink className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        ));
                      })()}
                    </div>
                    
                    <div className="mt-6 p-4 bg-indigo-50 rounded-2xl border border-indigo-100 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                          <Plus className="w-4 h-4 text-white" />
                        </div>
                        <div>
                          <p className="text-[10px] font-black text-indigo-900 uppercase tracking-widest">Missing an integration?</p>
                          <p className="text-[9px] text-indigo-600 font-medium">Request a new partnership or use our API.</p>
                        </div>
                      </div>
                      <button className="px-4 py-1.5 bg-white text-indigo-600 border border-indigo-200 rounded-lg text-[9px] font-black uppercase tracking-widest hover:bg-indigo-50 transition-all">
                        Request Tool
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="text-center py-12 border-2 border-dashed border-slate-100 rounded-3xl">
                  <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Layout className="w-8 h-8 text-slate-300" />
                  </div>
                  <h4 className="text-slate-900 font-bold">No Active Workspace</h4>
                  <p className="text-slate-500 text-sm max-w-xs mx-auto mt-1">Mangyaring pumili ng proyekto sa dashboard para makita ang workspace tools.</p>
                </div>
              )}
            </motion.div>
          )}

          {activeTab === "calls" && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4"
            >
              {projects.length > 0 ? (
                <>
                  <div className="flex items-center justify-between p-4 bg-indigo-50 border border-indigo-100 rounded-2xl">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center">
                        <Video className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-indigo-900">In-App Video Calling</h4>
                        <p className="text-xs text-indigo-700">No more Zoom links. Everything stays here.</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => setActiveCall(true)}
                      className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-100"
                    >
                      New Call
                    </button>
                  </div>

                  <div className="space-y-3">
                    <h5 className="text-xs font-black text-slate-400 uppercase tracking-widest px-1">Recent Meeting Minutes (AI Generated)</h5>
                    {[
                      { title: "Sprint 4 Planning", date: "Today, 10:30 AM", notes: "Agreed on API spec; Client requested dark mode preview by Friday.", sentiment: "Positive" },
                      { title: "Initial Discovery Call", date: "Feb 22, 2024", notes: "Budget confirmed at $1500; Project timeline: 3 months.", sentiment: "Neutral" },
                    ].map((call, i) => (
                      <div key={i} className="p-4 bg-white border border-slate-100 rounded-2xl hover:bg-slate-50 transition-all group">
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex items-center gap-2">
                            <FileText className="w-4 h-4 text-slate-400" />
                            <span className="text-sm font-bold text-slate-900">{call.title}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold ${
                              call.sentiment === "Positive" ? "bg-emerald-50 text-emerald-600" : "bg-slate-50 text-slate-500"
                            }`}>
                              {call.sentiment === "Positive" ? <Smile className="w-2.5 h-2.5" /> : <Meh className="w-2.5 h-2.5" />}
                              {call.sentiment} Sentiment
                            </div>
                            <span className="text-[10px] font-bold text-slate-400">{call.date}</span>
                          </div>
                        </div>
                        <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed italic">&quot;{call.notes}&quot;</p>
                        <div className="mt-3 flex justify-between items-center">
                          <div className="flex items-center gap-1.5">
                            <Award className="w-3 h-3 text-amber-500" />
                            <span className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">AI Performance Tip: </span>
                            <span className="text-[9px] font-bold text-slate-500">Fast bug resolution detected (+5 score)</span>
                          </div>
                          <button className="text-[10px] font-bold text-indigo-600 hover:underline group-hover:translate-x-1 transition-transform">
                            Read Full Minutes →
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div className="text-center py-12 border-2 border-dashed border-slate-100 rounded-3xl">
                  <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Video className="w-8 h-8 text-slate-300" />
                  </div>
                  <h4 className="text-slate-900 font-bold">No AI Meeting Notes</h4>
                  <p className="text-slate-500 text-sm max-w-xs mx-auto mt-1">Video calls and AI meeting summaries will appear here once you have active projects.</p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="bg-slate-50 p-4 border-t border-slate-100 flex justify-between items-center">
        <div className="flex items-center gap-2">
          {projects.length > 0 ? (
            <>
              <div className="flex -space-x-2">
                {projects.slice(0, 3).map((_, i) => (
                  <div key={i} className="w-6 h-6 rounded-full bg-indigo-100 border-2 border-white flex items-center justify-center text-[8px] font-bold text-indigo-600">
                    {i + 1}
                  </div>
                ))}
              </div>
              <span className="text-[10px] font-bold text-slate-500 uppercase">{projects.length} Active Project{projects.length > 1 ? 's' : ''}</span>
            </>
          ) : (
            <span className="text-[10px] font-bold text-slate-400 uppercase italic tracking-wider">Workspace Standby</span>
          )}
        </div>
        <button className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1">
          Open Full Dashboard <ChevronRight className="w-4 h-4" />
        </button>
      </div>
      <AIAgent 
        isOpen={showAIClauseAudit} 
        onClose={() => setShowAIClauseAudit(false)} 
        mode="audit-contract" 
        targetData={selectedProject} 
      />
    </div>
  );
}

"use client";

import { Project, Milestone } from "../types";
import { 
  Code2, 
  BarChart3,
  Activity,
  Trello,
  Layout, 
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
  Zap,
  DollarSign,
  Loader2,
  Plus,
  Brain
} from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { cn } from "../lib/utils";
import VideoCall from "./VideoCall";
import WellnessDashboard from "./WellnessDashboard";
import FocusMode from "./FocusMode";
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
  const [activeTab, setActiveTab] = useState<"active" | "warroom" | "pulse" | "reviews" | "calls" | "wellness">("active");
  const [selectedProject, setSelectedProject] = useState<Project | null>(projects[0] || null);
  const [editingLink, setEditingLink] = useState<string | null>(null);
  const [tempLink, setTempLink] = useState("");
  const [showWarRoom, setShowWarRoom] = useState(false);
  const [activeCall, setActiveCall] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [showFocusMode, setShowFocusMode] = useState(false);
  const [isCreatingProject, setIsCreatingProject] = useState(false);
  const [newProject, setNewProject] = useState({ title: "", client: "", workspaceType: "Code" as "Code" | "Design" });
  const [isCreatingWorkflow, setIsCreatingWorkflow] = useState(false);
  const [newWorkflow, setNewWorkflow] = useState({ trigger: "", action: "", name: "", icon: "Zap" });

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
    setNewProject({ title: "", client: "", workspaceType: "Code" });
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
            { id: "active", label: "Active Projects", icon: Clock },
            { id: "pulse", label: "AI Pulse Board", icon: Activity },
            { id: "warroom", label: "Project War Room", icon: Shield },
            { id: "wellness", label: "Sustainable Performance", icon: Zap },
            { id: "reviews", label: "Code & Design", icon: Code2 },
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
                          project.workspaceType === "Code" ? "bg-blue-50 text-blue-600" : "bg-purple-50 text-purple-600"
                        }`}>
                          {project.workspaceType === "Code" ? <Github className="w-6 h-6" /> : <Layout className="w-6 h-6" />}
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
          {activeTab === "reviews" && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              {projects.length > 0 ? (
                <>
                  <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-bold flex items-center gap-2">
                        <Github className="w-5 h-5 text-slate-900" />
                        GitHub Sync & Auto-Escrow
                      </h4>
                      <span className="text-[10px] font-black bg-indigo-600 text-white px-2 py-1 rounded">PRO FEATURE</span>
                    </div>
                    <p className="text-sm text-slate-600 mb-6">
                      Milestones are automatically marked as "In-Review" when you merge code to the <code className="bg-slate-200 px-1 rounded">main</code> branch.
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

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-6 bg-indigo-900 rounded-3xl text-white relative overflow-hidden group">
                      <div className="relative z-10">
                        <Code2 className="w-8 h-8 mb-4 text-indigo-300" />
                        <h5 className="font-bold mb-1">Mini-IDE Review</h5>
                        <p className="text-xs text-indigo-200 mb-4 opacity-80">Review snippets with the client directly in the chat.</p>
                        <button className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-xl text-xs font-bold transition-all">
                          Open Sandbox
                        </button>
                      </div>
                      <div className="absolute -right-4 -bottom-4 w-32 h-32 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
                    </div>
                    <div className="p-6 bg-slate-900 rounded-3xl text-white relative overflow-hidden group">
                      <div className="relative z-10">
                        <Layout className="w-8 h-8 mb-4 text-purple-300" />
                        <h5 className="font-bold mb-1">Design Markup</h5>
                        <p className="text-xs text-slate-400 mb-4 opacity-80">Connected to Figma. Get instant feedback on your design components.</p>
                        <button className="px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-xl text-xs font-bold transition-all border border-slate-700">
                          View Figma Files
                        </button>
                      </div>
                      <div className="absolute -right-4 -bottom-4 w-32 h-32 bg-purple-500/20 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
                    </div>
                  </div>
                </>
              ) : (
                <div className="text-center py-12 border-2 border-dashed border-slate-100 rounded-3xl">
                  <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Github className="w-8 h-8 text-slate-300" />
                  </div>
                  <h4 className="text-slate-900 font-bold">No Active Reviews</h4>
                  <p className="text-slate-500 text-sm max-w-xs mx-auto mt-1">Reviewing code and designs requires an active project connection.</p>
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
                        <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed italic">"{call.notes}"</p>
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
    </div>
  );
}

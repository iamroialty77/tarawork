"use client";

import { Project, Milestone } from "../types";
import { 
  Code2, 
  Layout, 
  Video, 
  Github, 
  FileText, 
  CheckCircle2, 
  Clock, 
  ChevronRight,
  MessageSquare,
  ExternalLink,
  Link as LinkIcon,
  Lock,
  Smile,
  Meh,
  Frown,
  TrendingUp,
  Award
} from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

interface WorkspaceProps {
  projects: Project[];
  onUpdateProject?: (project: Project) => void;
}

export default function Workspace({ projects, onUpdateProject }: WorkspaceProps) {
  const [activeTab, setActiveTab] = useState<"active" | "reviews" | "calls">("active");
  const [selectedProject, setSelectedProject] = useState<Project | null>(projects[0] || null);
  const [editingLink, setEditingLink] = useState<string | null>(null);
  const [tempLink, setTempLink] = useState("");

  const handleSaveLink = (project: Project) => {
    if (onUpdateProject) {
      onUpdateProject({ ...project, projectLink: tempLink });
      setEditingLink(null);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden mt-6">
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
              onClick={() => alert("Meeting module is initializing... Please wait for other participants.")}
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
            { id: "reviews", label: "Code & Design", icon: Code2 },
            { id: "calls", label: "AI Meeting Notes", icon: MessageSquare },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2 rounded-md text-[10px] font-bold uppercase tracking-wider transition-all ${
                activeTab === tab.id ? "bg-slate-700 text-white shadow-sm" : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <tab.icon className="w-3.5 h-3.5" />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="p-6">
        <AnimatePresence mode="wait">
          {activeTab === "active" && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4"
            >
              {projects.length > 0 ? (
                projects.map((project) => (
                  <div 
                    key={project.id} 
                    className="group p-5 border border-slate-100 rounded-xl hover:border-indigo-100 hover:bg-indigo-50/30 transition-all cursor-pointer"
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
                          <h4 className="text-base font-bold text-slate-900 group-hover:text-indigo-600 transition-colors tracking-tight">
                            {project.title}
                          </h4>
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
                        <div className="flex items-center gap-1 text-[9px] font-bold text-slate-400 uppercase tracking-wider">
                          <Lock className="w-3 h-3" />
                          Escrow Active
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
                        {editingLink === project.id ? (
                          <div className="flex items-center gap-2 bg-white border border-indigo-200 rounded-lg px-2 py-1 shadow-sm">
                            <input 
                              type="text" 
                              className="text-xs focus:outline-none w-32" 
                              placeholder="https://..."
                              value={tempLink}
                              onChange={(e) => setTempLink(e.target.value)}
                              autoFocus
                            />
                            <button 
                              onClick={(e) => { e.stopPropagation(); handleSaveLink(project); }}
                              className="text-[10px] font-bold text-indigo-600 hover:text-indigo-800"
                            >
                              Save
                            </button>
                          </div>
                        ) : (
                          <button 
                            onClick={(e) => { 
                              e.stopPropagation(); 
                              setEditingLink(project.id); 
                              setTempLink(project.projectLink || ""); 
                            }}
                            className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all flex items-center gap-1"
                            title="Edit Project Link"
                          >
                            <LinkIcon className="w-4 h-4" />
                          </button>
                        )}
                        <Link
                          href={project.clientId ? `/messages?with=${project.clientId}` : "/messages"}
                          onClick={(e) => e.stopPropagation()}
                          className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                          title="Message Party"
                        >
                          <MessageSquare className="w-4 h-4" />
                        </Link>
                        <button 
                          onClick={(e) => { e.stopPropagation(); alert("Work log submitted for " + project.title); }}
                          className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-[10px] font-bold text-slate-600 hover:bg-slate-50 transition-all shadow-sm uppercase tracking-wider"
                        >
                          Log Work
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
                    <button className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-100">
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

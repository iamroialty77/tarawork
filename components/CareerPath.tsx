"use client";

import { useState } from 'react';
import { UserProfile, Job } from "../types";
import { 
  Sparkles, 
  TrendingUp, 
  BookOpen, 
  ChevronRight, 
  Award, 
  Zap, 
  Star, 
  ShieldCheck, 
  Lock, 
  Trophy, 
  CheckCircle,
  ArrowRight,
  Target
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import AIAgent from "./AIAgent";

interface CareerPathProps {
  profile: UserProfile;
  allJobs: Job[];
  onGenerateRoadmap?: () => void;
}

export default function CareerPath({ profile, allJobs, onGenerateRoadmap }: CareerPathProps) {
  const [showPath, setShowPath] = useState(false);
  const [showAIAgent, setShowAIAgent] = useState(false);
  const [roadmapData, setRoadmapData] = useState<any>(null);

  // 1. Calculate Skill Demand from allJobs
  const skillDemand: Record<string, number> = {};
  allJobs.forEach(job => {
    job.skills?.forEach(skill => {
      skillDemand[skill] = (skillDemand[skill] || 0) + 1;
    });
  });

  const sortedDemand = Object.entries(skillDemand)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 6);

  // 2. Find Missing In-Demand Skills
  const missingSkills = sortedDemand
    .filter(([skill]) => !profile.skills.some(s => s.toLowerCase() === skill.toLowerCase()))
    .map(([skill]) => skill);

  return (
    <div className="space-y-8 mt-8">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Career Recommendations */}
        <div className="flex-1 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-slate-900 p-8 rounded-2xl text-white relative overflow-hidden">
               <div className="relative z-10">
                  <TrendingUp className="w-10 h-10 text-emerald-400 mb-6" />
                  <h4 className="font-black text-2xl mb-2 uppercase tracking-tight">Market Insight</h4>
                  <p className="text-sm text-slate-400 font-medium mb-6 leading-relaxed">
                    Analyzing active <span className="text-white font-bold">{allJobs.length.toLocaleString()} jobs</span> in the ecosystem. 
                    The industry is currently pivoting towards <span className="text-white font-bold">{sortedDemand[0]?.[0]}</span>. 
                    This represents a <span className="text-emerald-400 font-bold">+24% surge</span> in demand since last quarter.
                  </p>
                  <div className="flex items-center gap-2 text-emerald-400 font-black text-xs uppercase tracking-widest bg-emerald-400/10 w-fit px-3 py-1 rounded-full border border-emerald-400/20">
                      <Zap className="w-3 h-3 fill-current" />
                      High Growth Sector
                  </div>
               </div>
               <div className="absolute -right-12 -bottom-12 w-64 h-64 bg-emerald-500/10 rounded-full blur-[100px]"></div>
            </div>

            <div className="bg-indigo-600 p-8 rounded-2xl text-white relative overflow-hidden">
               <div className="relative z-10">
                  <Target className="w-10 h-10 text-indigo-200 mb-6" />
                  <h4 className="font-black text-2xl mb-2 uppercase tracking-tight">Career Alignment</h4>
                  <p className="text-sm text-indigo-100 font-medium mb-6 leading-relaxed">
                    Your current skills are <span className="text-white font-bold">82% aligned</span> with high-paying roles in TARA. 
                    Acquiring the remaining <span className="text-white font-bold">{missingSkills.length} core skills</span> could increase your hiring probability by <span className="text-white font-bold">45%</span>.
                  </p>
                  <div className="flex items-center gap-2 text-indigo-200 font-black text-xs uppercase tracking-widest bg-white/10 w-fit px-3 py-1 rounded-full border border-white/20">
                      <Sparkles className="w-3 h-3 fill-current" />
                      Strategic Path Available
                  </div>
               </div>
               <div className="absolute -left-12 -bottom-12 w-64 h-64 bg-white/10 rounded-full blur-[100px]"></div>
            </div>
          </div>

          <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-xl shadow-slate-200/50">
             <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-6 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-indigo-600" />
                Recommended Skills & Strategic Gap Analysis
             </h4>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {missingSkills.length > 0 ? missingSkills.map((skill, i) => (
                    <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100 group cursor-pointer hover:border-indigo-300 hover:bg-white hover:shadow-lg transition-all">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-sm uppercase">
                                {skill[0]}
                            </div>
                            <div>
                                <p className="text-sm font-bold text-slate-900">{skill}</p>
                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">Gap Analysis: <span className="text-indigo-600">High Priority</span></p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest hidden group-hover:block transition-all">Start Learning</span>
                            <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-indigo-600 transition-colors" />
                        </div>
                    </div>
                )) : (
                    <div className="col-span-2 text-center py-12">
                        <Award className="w-12 h-12 text-indigo-400 mx-auto mb-4" />
                        <h5 className="text-lg font-bold text-slate-900 mb-1 uppercase tracking-tight">Elite Profile Status</h5>
                        <p className="text-sm text-slate-500 font-medium uppercase tracking-widest">All Top Market-Demand Skills Acquired!</p>
                    </div>
                )}
             </div>
             <button 
                onClick={onGenerateRoadmap || (() => setShowAIAgent(true))}
                className={`w-full mt-8 py-4 rounded-2xl text-xs font-black uppercase tracking-widest transition-all shadow-xl flex items-center justify-center gap-3 ${
                    showPath 
                    ? "bg-slate-100 text-slate-600 hover:bg-slate-200 shadow-slate-100" 
                    : "bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-100 shadow-[0_10px_30px_-10px_rgba(79,70,229,0.3)]"
                }`}
             >
                {showPath ? "Hide Detailed Roadmap" : "Unlock Full AI Roadmap"}
                {showPath ? null : <Lock className="w-4 h-4" />}
             </button>
          </div>
        </div>
      </div>

      <AIAgent 
        isOpen={showAIAgent}
        onClose={() => setShowAIAgent(false)}
        mode="career-roadmap"
        targetData={{
          profile,
          marketContext: {
            topDemandSkills: sortedDemand.map(([skill]) => skill),
            missingSkills
          }
        }}
        onComplete={(data) => {
          setRoadmapData(data);
          setShowPath(true);
          setShowAIAgent(false);
        }}
      />

      <AnimatePresence>
        {showPath && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-8"
          >
            {/* Professional Section */}
            <div className="bg-gradient-to-br from-indigo-900 via-slate-900 to-slate-900 rounded-2xl p-8 md:p-12 text-white relative overflow-hidden border border-white/10 shadow-2xl">
                {/* Visual Flair */}
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2"></div>
                <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-purple-500/10 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2"></div>
                
                <div className="relative z-10">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                        <div className="max-w-xl">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-[10px] font-black uppercase tracking-[0.2em] mb-6">
                                <Star className="w-3 h-3 fill-current" />
                                Career Path
                            </div>
                            <h2 className="text-4xl md:text-5xl font-black mb-6 tracking-tight leading-[1.1]">
                                AI Engineered <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">Roadmap</span>
                                {roadmapData?.roadmapId && (
                                    <span className="block text-xs font-mono text-slate-500 mt-4 uppercase tracking-[0.3em]">ID: {roadmapData.roadmapId}</span>
                                )}
                            </h2>
                            <p className="text-slate-400 text-lg font-medium leading-relaxed">
                                Hand-picked specialized learning paths and certification modules designed to transform you into a top-tier industry expert.
                            </p>
                        </div>
                        <div className="flex gap-4">
                            <div className="bg-white/5 backdrop-blur-md border border-white/10 p-4 rounded-2xl text-center min-w-[100px]">
                                <p className="text-2xl font-black text-white">12</p>
                                <p className="text-[10px] font-bold text-slate-500 uppercase">Expert Modules</p>
                            </div>
                            <div className="bg-white/5 backdrop-blur-md border border-white/10 p-4 rounded-2xl text-center min-w-[100px]">
                                <p className="text-2xl font-black text-indigo-400">4.9</p>
                                <p className="text-[10px] font-bold text-slate-500 uppercase">Success Rate</p>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Certification Card */}
                        <motion.div 
                            whileHover={{ y: -5 }}
                            className="bg-white/5 backdrop-blur-sm border border-white/10 p-6 rounded-2xl group cursor-pointer hover:bg-white/10 transition-all"
                        >
                            <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <ShieldCheck className="w-6 h-6 text-indigo-400" />
                            </div>
                            <h4 className="text-xl font-bold mb-3 tracking-tight">Verified Professional Certification</h4>
                            <p className="text-sm text-slate-400 mb-6 leading-relaxed">Earn an ecosystem-wide badge that proves your seniority and expertise to global clients.</p>
                            <div className="flex items-center gap-2 text-indigo-400 font-bold text-xs group-hover:gap-3 transition-all">
                                Get Certified <ArrowRight className="w-4 h-4" />
                            </div>
                        </motion.div>

                        {/* Expert Mentorship Card */}
                        <motion.div 
                            whileHover={{ y: -5 }}
                            className="bg-white/5 backdrop-blur-sm border border-white/10 p-6 rounded-2xl group cursor-pointer hover:bg-white/10 transition-all"
                        >
                            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <Trophy className="w-6 h-6 text-emerald-400" />
                            </div>
                            <h4 className="text-xl font-bold mb-3 tracking-tight">Expert-Led Workshops</h4>
                            <p className="text-sm text-slate-400 mb-6 leading-relaxed">Join exclusive live sessions from industry veterans who have worked at Fortune 500 companies.</p>
                            <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs group-hover:gap-3 transition-all">
                                Join Workshops <ArrowRight className="w-4 h-4" />
                            </div>
                        </motion.div>

                        {/* Simulation Card */}
                        <motion.div 
                            whileHover={{ y: -5 }}
                            className="bg-white/5 backdrop-blur-sm border border-white/10 p-6 rounded-2xl group cursor-pointer hover:bg-white/10 transition-all"
                        >
                            <div className="w-12 h-12 rounded-2xl bg-purple-500/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <Zap className="w-6 h-6 text-purple-400" />
                            </div>
                            <h4 className="text-xl font-bold mb-3 tracking-tight">High-Stakes Simulations</h4>
                            <p className="text-sm text-slate-400 mb-6 leading-relaxed">Practice in real-world high-pressure scenarios with AI-powered performance feedback.</p>
                            <div className="flex items-center gap-2 text-purple-400 font-bold text-xs group-hover:gap-3 transition-all">
                                Start Simulation <ArrowRight className="w-4 h-4" />
                            </div>
                        </motion.div>
                    </div>

                    <div className="mt-12 p-8 bg-indigo-500/10 border border-indigo-400/20 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-8">
                        <div className="flex items-center gap-6">
                            <div className="relative">
                                <div className="w-16 h-16 rounded-full bg-slate-800 border-4 border-indigo-500/30 overflow-hidden shadow-xl">
                                    <div className="w-full h-full bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white text-xl font-black">AI</div>
                                </div>
                                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-emerald-500 rounded-full border-2 border-slate-900 flex items-center justify-center">
                                    <CheckCircle className="w-3.5 h-3.5 text-white" />
                                </div>
                            </div>
                            <div>
                                <h5 className="font-bold text-white mb-1">
                                    {roadmapData?.nextMilestone ? `Next: ${roadmapData.nextMilestone}` : "Personalized Path Ready"}
                                </h5>
                                <p className="text-xs text-slate-400">Based on your current profile, we have prepared a customized mastery roadmap for you.</p>
                            </div>
                        </div>
                        <button 
                            onClick={() => {
                                const el = document.getElementById('professional-roadmap-steps');
                                el?.scrollIntoView({ behavior: 'smooth' });
                            }}
                            className="bg-white text-slate-900 px-8 py-3 rounded-2xl font-black text-sm hover:bg-indigo-50 transition-all flex items-center gap-2 whitespace-nowrap active:scale-95 shadow-xl"
                        >
                            View Your Modules
                            <ArrowRight className="w-4 h-4" />
                        </button>
                    </div>

                    {/* New Professional Roadmap Steps Section */}
                    {roadmapData?.modules && (
                        <div id="professional-roadmap-steps" className="mt-20 space-y-12">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="text-2xl font-black text-white mb-2 uppercase tracking-tight">Professional Mastery Curriculum</h3>
                                    <p className="text-slate-400 text-sm font-medium">Step-by-step professional path engineered for your category.</p>
                                </div>
                                <div className="hidden md:flex items-center gap-4">
                                    <div className="flex items-center gap-2">
                                        <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                                        <span className="text-[10px] font-bold text-slate-400 uppercase">Available</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-3 h-3 rounded-full bg-slate-700"></div>
                                        <span className="text-[10px] font-bold text-slate-400 uppercase">Upcoming</span>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 gap-6">
                                {roadmapData.modules.map((module: any, index: number) => (
                                    <motion.div 
                                        key={module.id}
                                        initial={{ opacity: 0, x: -20 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                        viewport={{ once: true }}
                                        className="relative group"
                                    >
                                        {/* Connector Line */}
                                        {index !== roadmapData.modules.length - 1 && (
                                            <div className="absolute left-[2.25rem] top-16 bottom-[-1.5rem] w-0.5 bg-gradient-to-b from-indigo-500/50 to-transparent z-0"></div>
                                        )}

                                        <div className="relative z-10 flex gap-6">
                                            <div className="flex-shrink-0">
                                                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-lg shadow-lg transition-all group-hover:scale-110 ${
                                                    index === 0 
                                                    ? "bg-indigo-500 text-white shadow-indigo-500/20" 
                                                    : "bg-slate-800 text-slate-400 border border-white/5"
                                                }`}>
                                                    {index + 1}
                                                </div>
                                            </div>

                                            <div className={`flex-1 p-6 rounded-2xl border transition-all ${
                                                index === 0
                                                ? "bg-white/10 border-indigo-500/30 backdrop-blur-md"
                                                : "bg-white/5 border-white/5 hover:bg-white/10"
                                            }`}>
                                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                                                    <div>
                                                        <div className="flex items-center gap-3 mb-1">
                                                            <h4 className="text-xl font-bold text-white tracking-tight">{module.title}</h4>
                                                            <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-widest ${
                                                                module.level === "Expert" ? "bg-purple-500/20 text-purple-400" :
                                                                module.level === "Advanced" ? "bg-blue-500/20 text-blue-400" :
                                                                "bg-emerald-500/20 text-emerald-400"
                                                            }`}>
                                                                {module.level}
                                                            </span>
                                                        </div>
                                                        <div className="flex items-center gap-4 text-slate-500 text-[11px] font-bold uppercase tracking-wider">
                                                            <div className="flex items-center gap-1.5">
                                                                <BookOpen className="w-3.5 h-3.5" />
                                                                {module.duration}
                                                            </div>
                                                            <div className="flex items-center gap-1.5">
                                                                <Zap className="w-3.5 h-3.5" />
                                                                Interactive Lab Included
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <button className={`px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                                                        index === 0
                                                        ? "bg-indigo-500 text-white hover:bg-indigo-600 shadow-lg shadow-indigo-500/20"
                                                        : "bg-white/10 text-slate-300 hover:bg-white/20 border border-white/10"
                                                    }`}>
                                                        {index === 0 ? "Start Module" : "Locked"}
                                                    </button>
                                                </div>
                                                <p className="text-slate-400 text-sm leading-relaxed max-w-2xl">
                                                    {module.description}
                                                </p>
                                                
                                                {/* Skill Tags */}
                                                <div className="mt-6 flex flex-wrap gap-2">
                                                    {["Certification", "Assessment", "Practical Project"].map((tag) => (
                                                        <span key={tag} className="text-[9px] font-bold text-slate-500 border border-white/5 bg-white/5 px-2 py-1 rounded-lg">
                                                            {tag}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

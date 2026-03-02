"use client";

import { useState } from 'react';
import { 
  Radar, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell
} from 'recharts';
import { UserProfile, Job } from "../types";
import { 
  Sparkles, 
  TrendingUp, 
  BookOpen, 
  ChevronRight, 
  Award, 
  Zap, 
  GraduationCap, 
  Star, 
  ShieldCheck, 
  Lock, 
  Trophy, 
  CheckCircle,
  ArrowRight 
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface CareerPathProps {
  profile: UserProfile;
  allJobs: Job[];
}

export default function CareerPath({ profile, allJobs }: CareerPathProps) {
  const [showPath, setShowPath] = useState(false);
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

  // 2. Prepare data for Radar Chart (User Skills vs Market Demand)
  const radarData = sortedDemand.map(([skill, demand]) => {
    const hasSkill = profile.skills.some(s => s.toLowerCase() === skill.toLowerCase());
    return {
      subject: skill,
      A: hasSkill ? 80 + Math.random() * 20 : 20 + Math.random() * 20, // User Skill level (mocked)
      B: (demand / allJobs.length) * 100 + 40, // Market Demand
      fullMark: 150,
    };
  });

  // 3. Find Missing In-Demand Skills
  const missingSkills = sortedDemand
    .filter(([skill]) => !profile.skills.some(s => s.toLowerCase() === skill.toLowerCase()))
    .map(([skill]) => skill);

  return (
    <div className="space-y-8 mt-8">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Radar Chart Section */}
        <div className="flex-1 bg-white p-8 rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/50">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-indigo-600" />
                Skills Radar
              </h3>
              <p className="text-sm text-slate-500 font-medium">Your skills vs. Market demand</p>
            </div>
            <div className="flex flex-col items-end">
                <div className="flex items-center gap-2 mb-1">
                    <div className="w-3 h-3 rounded-full bg-indigo-500"></div>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Your Level</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-slate-200"></div>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Market Demand</span>
                </div>
            </div>
          </div>

          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                <PolarGrid stroke="#e2e8f0" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 10, fontWeight: 800 }} />
                <Radar
                  name="You"
                  dataKey="A"
                  stroke="#4f46e5"
                  fill="#4f46e5"
                  fillOpacity={0.5}
                />
                <Radar
                  name="Market"
                  dataKey="B"
                  stroke="#cbd5e1"
                  fill="#cbd5e1"
                  fillOpacity={0.3}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Career Recommendations */}
        <div className="w-full md:w-80 space-y-4">
          <div className="bg-slate-900 p-6 rounded-3xl text-white relative overflow-hidden">
             <div className="relative z-10">
                <TrendingUp className="w-8 h-8 text-emerald-400 mb-4" />
                <h4 className="font-black text-lg mb-1 uppercase tracking-tight">Market Insight</h4>
                <p className="text-xs text-slate-400 font-medium mb-4">Base sa active <span className="text-white font-bold">{allJobs.length.toLocaleString()} jobs</span> sa ecosystem, ang <span className="text-white font-bold">{sortedDemand[0]?.[0]}</span> ay ang pinaka-in-demand na skill ngayong buwan.</p>
                <div className="flex items-center gap-2 text-emerald-400 font-black text-xs uppercase tracking-widest">
                    <Zap className="w-3 h-3 fill-current" />
                    High Growth Sector
                </div>
             </div>
             <div className="absolute -right-4 -bottom-4 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl"></div>
          </div>

          <div className="bg-indigo-50 p-6 rounded-3xl border border-indigo-100">
             <h4 className="text-xs font-black text-indigo-900 uppercase tracking-widest mb-4 flex items-center gap-2">
                <BookOpen className="w-4 h-4" />
                Recommended Skills
             </h4>
             <div className="space-y-3">
                {missingSkills.length > 0 ? missingSkills.map((skill, i) => (
                    <div key={i} className="flex items-center justify-between p-3 bg-white rounded-xl border border-indigo-100 shadow-sm group cursor-pointer hover:border-indigo-300 transition-all">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold text-xs uppercase">
                                {skill[0]}
                            </div>
                            <div>
                                <p className="text-xs font-bold text-slate-900">{skill}</p>
                                <p className="text-[9px] text-slate-400 font-bold uppercase tracking-tighter">Gap Analysis: High</p>
                            </div>
                        </div>
                        <ChevronRight className="w-3 h-3 text-slate-300 group-hover:text-indigo-600 transition-colors" />
                    </div>
                )) : (
                    <div className="text-center py-4">
                        <Award className="w-8 h-8 text-indigo-300 mx-auto mb-2" />
                        <p className="text-xs text-indigo-600 font-bold uppercase tracking-widest">All Top Skills Acquired!</p>
                    </div>
                )}
             </div>
             <button 
                onClick={() => setShowPath(!showPath)}
                className={`w-full mt-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg ${
                    showPath 
                    ? "bg-slate-100 text-slate-600 hover:bg-slate-200 shadow-slate-100" 
                    : "bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-100"
                }`}
             >
                {showPath ? "Hide Path" : "View Learning Path"}
             </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showPath && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-8"
          >
            {/* Professional Section */}
            <div className="bg-gradient-to-br from-indigo-900 via-slate-900 to-slate-900 rounded-[2.5rem] p-8 md:p-12 text-white relative overflow-hidden border border-white/10 shadow-2xl">
                {/* Visual Flair */}
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2"></div>
                <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-purple-500/10 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2"></div>
                
                <div className="relative z-10">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                        <div className="max-w-xl">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-[10px] font-black uppercase tracking-[0.2em] mb-6">
                                <Star className="w-3 h-3 fill-current" />
                                Premium Career Path
                            </div>
                            <h2 className="text-4xl md:text-5xl font-black mb-6 tracking-tight leading-[1.1]">
                                Professional Mastery <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">Section</span>
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
                            className="bg-white/5 backdrop-blur-sm border border-white/10 p-6 rounded-3xl group cursor-pointer hover:bg-white/10 transition-all"
                        >
                            <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <ShieldCheck className="w-6 h-6 text-indigo-400" />
                            </div>
                            <h4 className="text-xl font-bold mb-3 tracking-tight">Verified Professional Certification</h4>
                            <p className="text-sm text-slate-400 mb-6 leading-relaxed">Makuha ang ecosystem-wide badge na nagpapatunay sa iyong seniority at expertise sa mga global clients.</p>
                            <div className="flex items-center gap-2 text-indigo-400 font-bold text-xs group-hover:gap-3 transition-all">
                                Get Certified <ArrowRight className="w-4 h-4" />
                            </div>
                        </motion.div>

                        {/* Expert Mentorship Card */}
                        <motion.div 
                            whileHover={{ y: -5 }}
                            className="bg-white/5 backdrop-blur-sm border border-white/10 p-6 rounded-3xl group cursor-pointer hover:bg-white/10 transition-all"
                        >
                            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <Trophy className="w-6 h-6 text-emerald-400" />
                            </div>
                            <h4 className="text-xl font-bold mb-3 tracking-tight">Expert-Led Workshops</h4>
                            <p className="text-sm text-slate-400 mb-6 leading-relaxed">Sumali sa exclusive live sessions mula sa mga industry veterans na nagtrabaho na sa Fortune 500 companies.</p>
                            <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs group-hover:gap-3 transition-all">
                                Join Workshops <ArrowRight className="w-4 h-4" />
                            </div>
                        </motion.div>

                        {/* Simulation Card */}
                        <motion.div 
                            whileHover={{ y: -5 }}
                            className="bg-white/5 backdrop-blur-sm border border-white/10 p-6 rounded-3xl group cursor-pointer hover:bg-white/10 transition-all"
                        >
                            <div className="w-12 h-12 rounded-2xl bg-purple-500/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <Zap className="w-6 h-6 text-purple-400" />
                            </div>
                            <h4 className="text-xl font-bold mb-3 tracking-tight">High-Stakes Simulations</h4>
                            <p className="text-sm text-slate-400 mb-6 leading-relaxed">Mag-ensayo sa mga real-world high-pressure scenarios na may AI-powered performance feedback.</p>
                            <div className="flex items-center gap-2 text-purple-400 font-bold text-xs group-hover:gap-3 transition-all">
                                Start Simulation <ArrowRight className="w-4 h-4" />
                            </div>
                        </motion.div>
                    </div>

                    <div className="mt-12 p-8 bg-indigo-500/10 border border-indigo-400/20 rounded-[2rem] flex flex-col md:flex-row items-center justify-between gap-8">
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
                                <h5 className="font-bold text-white mb-1">Personalized Path Ready</h5>
                                <p className="text-xs text-slate-400">Based sa iyong current profile, mayroon kaming inihandang customized mastery roadmap para sa iyo.</p>
                            </div>
                        </div>
                        <button className="bg-white text-slate-900 px-8 py-3 rounded-2xl font-black text-sm hover:bg-indigo-50 transition-all flex items-center gap-2 whitespace-nowrap active:scale-95 shadow-xl">
                            Unlock Your Path
                            <Lock className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

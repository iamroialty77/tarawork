"use client";

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
import { Sparkles, TrendingUp, BookOpen, ChevronRight, Award, Zap } from "lucide-react";
import { motion } from "framer-motion";

interface CareerPathProps {
  profile: UserProfile;
  allJobs: Job[];
}

export default function CareerPath({ profile, allJobs }: CareerPathProps) {
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
             <button className="w-full mt-4 py-2 bg-indigo-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100">
                View Learning Path
             </button>
          </div>
        </div>
      </div>
    </div>
  );
}

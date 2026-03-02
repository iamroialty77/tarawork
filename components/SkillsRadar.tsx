"use client";

import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { UserProfile } from '../types';
import { Brain, TrendingUp, Target, Sparkles, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';

interface RadarData {
  subject: string;
  User: number;
  Market: number;
  fullMark: number;
}

interface SkillsRadarProps {
  profile: UserProfile;
  onGenerateRoadmap?: () => void;
}

export default function SkillsRadar({ profile, onGenerateRoadmap }: SkillsRadarProps) {
  const [isAnalyzing, setIsAnalyzing] = useState(true);
  const [data, setData] = useState<RadarData[]>([]);

  useEffect(() => {
    // Simulate AI deep-scan of market data
    const timer = setTimeout(() => {
      const topSkills = profile.skills.length > 0 ? profile.skills.slice(0, 5) : ['Technical', 'Communication', 'Execution', 'Planning', 'Research'];
      
      const chartData = topSkills.map(skill => {
        // Mocking user skill level (0-100) vs Market demand (0-100)
        // In a real app, this would come from a backend analyzing current job postings
        const userLevel = profile.verifiedSkills?.find(vs => vs.name.toLowerCase() === skill.toLowerCase())?.score || 
                         (Math.floor(Math.random() * 40) + 50); // 50-90 range if not verified
        
        const marketDemand = Math.floor(Math.random() * 30) + 65; // 65-95 range
        
        return {
          subject: skill,
          User: userLevel,
          Market: marketDemand,
          fullMark: 100,
        };
      });
      
      setData(chartData);
      setIsAnalyzing(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, [profile]);

  if (isAnalyzing) {
    return (
      <div className="bg-slate-900 rounded-2xl p-8 flex flex-col items-center justify-center min-h-[300px] border border-white/5 shadow-2xl relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-transparent"></div>
        <Loader2 className="w-10 h-10 text-indigo-400 animate-spin mb-4" />
        <div className="space-y-2 text-center relative z-10">
          <p className="text-indigo-100 font-bold text-sm tracking-widest uppercase">AI Neural Mapping</p>
          <p className="text-slate-400 text-xs italic">Syncing your profile with real-time market signals...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-900 rounded-2xl p-6 border border-white/5 shadow-2xl relative overflow-hidden group">
      {/* Background Glow */}
      <div className="absolute -top-24 -right-24 w-48 h-48 bg-indigo-500/10 rounded-full blur-[100px] group-hover:bg-indigo-500/20 transition-all duration-700"></div>
      
      <div className="flex items-center justify-between mb-8 relative z-10">
        <div>
          <h3 className="text-white font-bold flex items-center gap-2 tracking-tight">
            <Brain className="w-5 h-5 text-indigo-400" />
            Skills Radar
          </h3>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.1em] mt-1">AI vs. Market Demand Analysis</p>
        </div>
        <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.6)]"></div>
                <span className="text-[9px] font-bold text-slate-300">YOU</span>
            </div>
            <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-slate-500"></div>
                <span className="text-[9px] font-bold text-slate-300">MARKET</span>
            </div>
        </div>
      </div>

      <div className="h-[260px] w-full mb-6">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data}>
            <PolarGrid stroke="#334155" />
            <PolarAngleAxis 
              dataKey="subject" 
              tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 700 }}
            />
            <Tooltip 
              contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px', fontSize: '11px', fontWeight: 'bold' }}
              itemStyle={{ color: '#f1f5f9' }}
            />
            <Radar
              name="Market Demand"
              dataKey="Market"
              stroke="#64748b"
              fill="#64748b"
              fillOpacity={0.1}
            />
            <Radar
              name="Your Skill"
              dataKey="User"
              stroke="#818cf8"
              fill="#818cf8"
              fillOpacity={0.4}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-2 gap-4 relative z-10">
        <div className="p-3 bg-white/5 border border-white/5 rounded-xl hover:bg-white/10 transition-all">
          <div className="flex items-center gap-2 mb-1.5">
            <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-[10px] font-bold text-slate-300 uppercase tracking-tighter">Gap Analysis</span>
          </div>
          <p className="text-[11px] text-slate-400 font-medium leading-relaxed">
            High demand for <span className="text-white font-bold">{data[0]?.subject}</span>. Focus on upskilling here to increase market value.
          </p>
        </div>
        <div className="p-3 bg-white/5 border border-white/5 rounded-xl hover:bg-white/10 transition-all">
          <div className="flex items-center gap-2 mb-1.5">
            <Target className="w-3.5 h-3.5 text-indigo-400" />
            <span className="text-[10px] font-bold text-slate-300 uppercase tracking-tighter">Elite Match</span>
          </div>
          <p className="text-[11px] text-slate-400 font-medium leading-relaxed">
            Your <span className="text-white font-bold">{data[2]?.subject}</span> score exceeds market average by 12%. You are in top 5%.
          </p>
        </div>
      </div>

      <button 
        onClick={onGenerateRoadmap}
        className="w-full mt-6 py-2.5 bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/20 rounded-xl flex items-center justify-center gap-2 group/btn transition-all active:scale-[0.98]"
      >
        <Sparkles className="w-3.5 h-3.5 text-indigo-400 group-hover/btn:rotate-12 transition-transform" />
        <span className="text-[11px] font-bold text-indigo-200">Generate Full AI Career Roadmap</span>
      </button>
    </div>
  );
}

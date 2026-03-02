"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Zap, 
  Battery, 
  ShieldAlert, 
  TrendingUp, 
  Clock, 
  CheckCircle2, 
  AlertTriangle,
  Smile,
  Meh,
  Frown,
  Coffee,
  Brain,
  Timer
} from "lucide-react";
import { UserWellness, EnergyLevel, WorkloadStatus, TeamWellness } from "../types/wellness";
import { cn } from "../lib/utils";

interface WellnessDashboardProps {
  wellness: UserWellness;
  revenuePerHour: number;
  teamWellness?: TeamWellness;
}

export default function WellnessDashboard({ wellness, revenuePerHour, teamWellness }: WellnessDashboardProps) {
  const [showFocusMode, setShowFocusMode] = useState(false);

  const getWorkloadStatus = (workload: number, capacity: number): WorkloadStatus => {
    const ratio = workload / capacity;
    if (ratio > 1.1) return "Overloaded";
    if (ratio < 0.6) return "Underutilized";
    return "Balanced";
  };

  const workloadStatus = getWorkloadStatus(wellness.currentWorkload, wellness.weeklyCapacity);

  const statusColors = {
    Overloaded: "text-rose-600 bg-rose-50 border-rose-100",
    Balanced: "text-emerald-600 bg-emerald-50 border-emerald-100",
    Underutilized: "text-blue-600 bg-blue-50 border-blue-100",
  };

  const energyIcons = {
    High: <Smile className="w-6 h-6 text-emerald-500" />,
    Balanced: <Meh className="w-6 h-6 text-blue-500" />,
    Low: <Frown className="w-6 h-6 text-amber-500" />,
    Exhausted: <Battery className="w-6 h-6 text-rose-500 animate-pulse" />,
  };

  return (
    <div className="space-y-6">
      {/* Top Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
          <div className="flex justify-between items-start mb-2">
            <div className="p-2 bg-indigo-50 rounded-lg">
              <Clock className="w-5 h-5 text-indigo-600" />
            </div>
            <span className={cn("text-[10px] font-bold px-2 py-1 rounded-full border uppercase tracking-wider", statusColors[workloadStatus])}>
              {workloadStatus}
            </span>
          </div>
          <h4 className="text-slate-500 text-xs font-bold uppercase tracking-widest">Weekly Capacity</h4>
          <div className="flex items-end gap-2 mt-1">
            <span className="text-2xl font-black text-slate-900">{wellness.currentWorkload}h</span>
            <span className="text-slate-400 font-medium mb-1">/ {wellness.weeklyCapacity}h</span>
          </div>
          <div className="w-full bg-slate-100 h-1.5 rounded-full mt-3 overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${Math.min((wellness.currentWorkload / wellness.weeklyCapacity) * 100, 100)}%` }}
              className={cn("h-full rounded-full", workloadStatus === "Overloaded" ? "bg-rose-500" : "bg-indigo-600")}
            />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
          <div className="flex justify-between items-start mb-2">
            <div className="p-2 bg-emerald-50 rounded-lg">
              <TrendingUp className="w-5 h-5 text-emerald-600" />
            </div>
          </div>
          <h4 className="text-slate-500 text-xs font-bold uppercase tracking-widest">Revenue/Hour</h4>
          <div className="flex items-end gap-1 mt-1">
            <span className="text-2xl font-black text-slate-900">${revenuePerHour}</span>
            <span className="text-slate-400 font-medium mb-1 text-xs">avg</span>
          </div>
          <p className="text-[10px] text-slate-400 mt-3 font-medium flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3 text-emerald-500" />
            Sustainable Growth Pattern
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
          <div className="flex justify-between items-start mb-2">
            <div className="p-2 bg-rose-50 rounded-lg">
              <ShieldAlert className="w-5 h-5 text-rose-600" />
            </div>
            {wellness.burnoutRiskScore > 70 && (
              <span className="animate-ping absolute top-0 right-0 h-2 w-2 rounded-full bg-rose-400 opacity-75"></span>
            )}
          </div>
          <h4 className="text-slate-500 text-xs font-bold uppercase tracking-widest">Burnout Risk</h4>
          <div className="flex items-end gap-1 mt-1">
            <span className={cn("text-2xl font-black", wellness.burnoutRiskScore > 70 ? "text-rose-600" : "text-slate-900")}>
              {wellness.burnoutRiskScore}%
            </span>
          </div>
          <div className="flex gap-1 mt-4">
            {[...Array(5)].map((_, i) => (
              <div 
                key={i} 
                className={cn(
                  "h-1 flex-1 rounded-full",
                  i < (wellness.burnoutRiskScore / 20) 
                    ? (wellness.burnoutRiskScore > 70 ? "bg-rose-500" : "bg-indigo-500") 
                    : "bg-slate-100"
                )} 
              />
            ))}
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
          <div className="flex justify-between items-start mb-2">
            <div className="p-2 bg-amber-50 rounded-lg">
              <Zap className="w-5 h-5 text-amber-600" />
            </div>
            {energyIcons[wellness.energyRating]}
          </div>
          <h4 className="text-slate-500 text-xs font-bold uppercase tracking-widest">Team Energy</h4>
          <div className="flex items-end gap-1 mt-1">
            <span className="text-2xl font-black text-slate-900">{wellness.energyRating}</span>
          </div>
          <p className="text-[10px] text-slate-400 mt-3 font-medium">
            Based on recent output & focus hours
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Deep Work & Rest Controls */}
        <div className="md:col-span-2 bg-slate-900 rounded-2xl p-6 text-white overflow-hidden relative">
          <div className="relative z-10">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-xl font-black tracking-tight">Focus Session</h3>
                <p className="text-slate-400 text-xs mt-1">Enter deep work mode to maximize quality output.</p>
              </div>
              <button 
                onClick={() => setShowFocusMode(true)}
                className="bg-indigo-600 hover:bg-indigo-500 px-6 py-3 rounded-xl font-bold transition-all flex items-center gap-2 shadow-lg shadow-indigo-600/20"
              >
                <Brain className="w-4 h-4" />
                Start Focus Mode
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/5 border border-white/10 p-4 rounded-xl">
                <div className="flex items-center gap-3 mb-2">
                  <Timer className="w-4 h-4 text-indigo-400" />
                  <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Today's Focus</span>
                </div>
                <div className="text-xl font-black">{wellness.focusHours}h / 4h goal</div>
              </div>
              <div className="bg-white/5 border border-white/10 p-4 rounded-xl">
                <div className="flex items-center gap-3 mb-2">
                  <Coffee className="w-4 h-4 text-emerald-400" />
                  <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Rest Cycles</span>
                </div>
                <div className="text-xl font-black">{wellness.workToRestRatio.toFixed(1)}:1 Ratio</div>
              </div>
            </div>
          </div>
          
          {/* Decorative background element */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/10 blur-[100px] -mr-32 -mt-32 rounded-full" />
        </div>

        {/* Recovery Suggestion Card */}
        <div className={cn(
          "rounded-2xl p-6 border transition-all",
          wellness.consecutiveHighLoadDays >= 3 
            ? "bg-amber-50 border-amber-200" 
            : "bg-indigo-50 border-indigo-100"
        )}>
          <div className="flex items-center gap-3 mb-4">
            <div className={cn(
              "p-2 rounded-lg",
              wellness.consecutiveHighLoadDays >= 3 ? "bg-amber-100" : "bg-indigo-100"
            )}>
              <AlertTriangle className={cn(
                "w-5 h-5",
                wellness.consecutiveHighLoadDays >= 3 ? "text-amber-600" : "text-indigo-600"
              )} />
            </div>
            <h3 className="font-black text-slate-900 tracking-tight uppercase text-xs tracking-widest">Pacing Intelligence</h3>
          </div>
          
          {wellness.consecutiveHighLoadDays >= 3 ? (
            <div className="space-y-4">
              <p className="text-sm text-slate-700 font-medium leading-relaxed">
                You've logged 8+ hours for <span className="font-bold text-amber-600">{wellness.consecutiveHighLoadDays} consecutive days</span>.
              </p>
              <div className="p-3 bg-white/60 border border-amber-200 rounded-xl text-xs text-amber-800 font-semibold leading-snug">
                "Schedule a 2-hour recovery block this Friday to prevent output degradation next week."
              </div>
              <button className="w-full py-2.5 bg-amber-600 text-white rounded-lg text-xs font-bold hover:bg-amber-700 transition-colors">
                Schedule Recovery Block
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-sm text-slate-700 font-medium leading-relaxed">
                Your current load is <span className="font-bold text-emerald-600">optimal</span>. Maintain this pace for consistent performance.
              </p>
              <div className="flex gap-2">
                <span className="px-2 py-1 bg-white border border-indigo-100 rounded-md text-[10px] font-bold text-indigo-600">IDEAL PACE</span>
                <span className="px-2 py-1 bg-white border border-indigo-100 rounded-md text-[10px] font-bold text-indigo-600">BALANCED</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Team Wellness Layer */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-50 rounded-lg">
              <ShieldAlert className="w-5 h-5 text-indigo-600" />
            </div>
            <div>
              <h3 className="font-black text-slate-900 tracking-tight text-sm uppercase tracking-widest">Team Sustainability Layer</h3>
              <p className="text-slate-500 text-xs">AI insights to protect your remote squad's long-term performance.</p>
            </div>
          </div>
          <button className="text-[10px] font-black text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full uppercase tracking-widest hover:bg-indigo-100 transition-colors">
            Team Health Report
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
            <h4 className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-3">Energy Balance</h4>
            <div className="flex items-center gap-3">
              <div className="flex -space-x-2">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-slate-200 flex items-center justify-center overflow-hidden">
                    <img src={`https://i.pravatar.cc/100?img=${i + 10}`} alt="member" className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
              <div className="text-sm font-bold text-slate-700">+ {teamWellness?.energyBalance || 84}%</div>
            </div>
            <p className="text-[10px] text-slate-500 mt-3 italic">"Squad is maintaining a high-performance rhythm."</p>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
            <h4 className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-3">Burnout Prevention</h4>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500" />
              <span className="text-xs font-bold text-slate-700">0 Overworked Members</span>
            </div>
            <div className="flex items-center gap-2 mt-2">
              <div className="w-2 h-2 rounded-full bg-indigo-500" />
              <span className="text-xs font-bold text-slate-700">Healthy Distribution</span>
            </div>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
            <h4 className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-3">Chronic Overtime</h4>
            <div className="text-xs font-bold text-emerald-600 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              No Patterns Detected
            </div>
            <p className="text-[10px] text-slate-500 mt-2 leading-tight">
              Teams with stable hours have 40% higher retention in 2026.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

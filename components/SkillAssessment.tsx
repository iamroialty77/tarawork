import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import { VerifiedSkill, AIAnalysis } from "../types";
import { 
  ShieldCheck, 
  TrendingUp, 
  Lightbulb, 
  ExternalLink,
  Target,
  ChevronRight,
  Sparkles,
  Loader2,
  Cpu,
  Globe,
  Database,
  CheckCircle2,
  X,
  Zap,
  Fingerprint,
  ArrowRight
} from "lucide-react";

interface SkillAssessmentProps {
  verifiedSkills: VerifiedSkill[];
  aiInsights?: AIAnalysis;
}

export default function SkillAssessment({ verifiedSkills, aiInsights }: SkillAssessmentProps) {
  const [isVetting, setIsVetting] = useState(false);
  const [vettingStep, setVettingStep] = useState(0);

  const steps = [
    { label: "Initializing Neural Interface", icon: Cpu, color: "text-indigo-400" },
    { label: "Scanning Portfolio Artifacts", icon: Database, color: "text-purple-400" },
    { label: "Benchmarking against Top 1%", icon: Globe, color: "text-emerald-400" },
    { label: "Finalizing Identity Verification", icon: Fingerprint, color: "text-blue-400" },
    { label: "Verification Complete", icon: CheckCircle2, color: "text-emerald-500" }
  ];

  useEffect(() => {
    if (isVetting && vettingStep < steps.length - 1) {
      const timer = setTimeout(() => {
        setVettingStep(prev => prev + 1);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [isVetting, vettingStep]);

  const startVetting = () => {
    setIsVetting(true);
    setVettingStep(0);
  };
  return (
    <div className="space-y-6 mt-6">
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-sm font-bold text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
            <div className="p-2 bg-slate-50 rounded-lg border border-slate-100">
              <ShieldCheck className="w-4 h-4 text-slate-600" />
            </div>
            AI Skill-Mapping
          </h3>
          <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-lg border border-indigo-100 uppercase tracking-widest">
            Deep Analysis Live
          </span>
        </div>

        <div className="space-y-5">
          {verifiedSkills.length > 0 ? (
            verifiedSkills.map((skill) => (
              <div key={skill.name} className="group">
                <div className="flex justify-between text-sm mb-2">
                  <span className="font-bold text-slate-700 group-hover:text-indigo-600 transition-colors">{skill.name}</span>
                  <span className="text-slate-500 font-bold bg-slate-50 px-2 rounded-md">{skill.score}%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                  <div 
                    className="bg-indigo-600 h-full rounded-full transition-all duration-1000 ease-out" 
                    style={{ width: `${skill.score}%` }}
                  ></div>
                </div>
                <div className="flex justify-between items-center mt-1.5">
                  <p className="text-[10px] text-slate-400 font-medium italic">Last Vetted: {new Date(skill.lastAssessment).toLocaleDateString()}</p>
                  <TrendingUp className="w-3 h-3 text-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 border-2 border-dashed border-slate-100 rounded-xl relative overflow-hidden group">
              <p className="text-xs text-slate-400 font-medium">No technical data yet.</p>
              <button 
                onClick={startVetting}
                className="mt-2 text-[10px] text-indigo-600 font-bold hover:text-indigo-700 uppercase tracking-widest flex items-center justify-center gap-2 mx-auto transition-all active:scale-95"
              >
                <Zap className="w-3 h-3 fill-current" />
                Start AI Vetting
              </button>
            </div>
          )}
        </div>

        <button 
          onClick={startVetting}
          className="w-full mt-6 py-3 bg-slate-900 text-white text-[10px] font-bold rounded-lg hover:bg-black transition-all shadow-lg shadow-slate-200 uppercase tracking-widest flex items-center justify-center gap-2"
        >
          <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
          Retake Assessments
        </button>
      </div>

      <AnimatePresence>
        {isVetting && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-slate-950/90 backdrop-blur-xl flex items-center justify-center p-4"
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="max-w-md w-full bg-slate-900 border border-white/10 rounded-[2.5rem] p-10 text-center relative overflow-hidden shadow-2xl"
            >
              {/* Decorative elements */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2"></div>
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-500/10 rounded-full blur-[60px] translate-y-1/2 -translate-x-1/2"></div>

              <button 
                onClick={() => setIsVetting(false)}
                className="absolute top-6 right-6 text-slate-500 hover:text-white transition-colors p-2 bg-white/5 rounded-full"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="relative z-10">
                <div className="mb-8 relative">
                   <div className="w-24 h-24 bg-indigo-500/10 rounded-3xl mx-auto flex items-center justify-center relative border border-indigo-500/20 group">
                      <div className="absolute inset-0 bg-indigo-500/20 rounded-3xl blur-xl opacity-50 group-hover:opacity-100 transition-opacity"></div>
                      <motion.div
                        animate={{ 
                          rotate: vettingStep === steps.length - 1 ? 0 : 360,
                          scale: [1, 1.1, 1]
                        }}
                        transition={{ 
                          rotate: { duration: 4, repeat: Infinity, ease: "linear" },
                          scale: { duration: 2, repeat: Infinity, ease: "easeInOut" }
                        }}
                      >
                         {vettingStep === steps.length - 1 ? (
                           <CheckCircle2 className="w-10 h-10 text-emerald-400" />
                         ) : (
                           <Loader2 className="w-10 h-10 text-indigo-400" />
                         )}
                      </motion.div>
                   </div>
                </div>

                <h3 className="text-2xl font-black text-white mb-2 tracking-tight">
                  {vettingStep === steps.length - 1 ? "Vetting Complete!" : "AI Vetting in Progress"}
                </h3>
                <p className="text-slate-400 text-sm font-medium mb-10">
                  {vettingStep === steps.length - 1 
                    ? "Congratulations! Your skills have been verified by our advanced neural models." 
                    : "Wait while our AI evaluates your technical proficiency across global benchmarks."}
                </p>

                <div className="space-y-4 mb-10">
                   {steps.map((step, idx) => {
                     const Icon = step.icon;
                     const isActive = idx === vettingStep;
                     const isDone = idx < vettingStep;
                     
                     return (
                       <div key={idx} className="flex items-center gap-4 text-left">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center border transition-all duration-500 ${
                            isActive ? "bg-white/10 border-indigo-400 shadow-[0_0_15px_rgba(129,140,248,0.3)]" : 
                            isDone ? "bg-emerald-500/10 border-emerald-500/30" : "bg-white/5 border-white/5"
                          }`}>
                             {isDone ? (
                               <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                             ) : (
                               <Icon className={`w-4 h-4 ${isActive ? step.color : "text-slate-600"}`} />
                             )}
                          </div>
                          <div className="flex-1">
                             <p className={`text-[11px] font-bold uppercase tracking-widest transition-colors ${
                               isActive ? "text-white" : isDone ? "text-slate-400" : "text-slate-600"
                             }`}>
                                {step.label}
                             </p>
                             {isActive && (
                               <motion.div 
                                 initial={{ width: 0 }}
                                 animate={{ width: "100%" }}
                                 className="h-0.5 bg-indigo-500 mt-1 rounded-full shadow-[0_0_10px_rgba(129,140,248,0.5)]"
                               />
                             )}
                          </div>
                       </div>
                     );
                   })}
                </div>

                {vettingStep === steps.length - 1 && (
                  <motion.button
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    onClick={() => setIsVetting(false)}
                    className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-black text-sm hover:bg-indigo-700 transition-all flex items-center justify-center gap-2 shadow-xl shadow-indigo-600/20 active:scale-95"
                  >
                    View Verified Badges
                    <ArrowRight className="w-4 h-4" />
                  </motion.button>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Skill Gap Analysis Section */}
      <div className="bg-slate-900 rounded-xl p-6 text-white relative overflow-hidden shadow-xl">
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center border border-white/10">
              <Target className="w-4 h-4 text-indigo-300" />
            </div>
            <h4 className="font-bold text-[10px] uppercase tracking-[0.2em] text-slate-300">Automated Gap Analysis</h4>
          </div>

          <div className="space-y-4">
            {aiInsights && aiInsights.gapAnalysis && aiInsights.gapAnalysis.length > 0 ? (
              aiInsights.gapAnalysis.map((gap, i) => (
                <div key={i} className="p-4 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-all group">
                  <p className="text-[10px] font-bold text-indigo-300 mb-1 uppercase tracking-widest">{gap.topic}</p>
                  <p className="text-[11px] text-slate-300 leading-relaxed mb-3 font-medium">
                    {gap.suggestion}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex gap-1">
                      {gap.missingSkills.map(s => (
                        <span key={s} className="text-[9px] px-2 py-0.5 bg-indigo-500/20 rounded-md font-bold uppercase tracking-wider">{s}</span>
                      ))}
                    </div>
                    <button 
                      onClick={() => gap.learningResourceUrl ? window.open(gap.learningResourceUrl, '_blank') : alert("Opening suggested learning resource...")}
                      className="p-1.5 bg-white/10 rounded-lg group-hover:bg-indigo-600 transition-all"
                    >
                      <ExternalLink className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="space-y-3">
                <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                  <p className="text-[10px] font-bold text-indigo-300 mb-1 tracking-[0.2em] uppercase">Ready for Analysis</p>
                  <p className="text-[11px] text-slate-400 leading-relaxed font-medium">
                    Complete your profile and start vetting to unlock automated skill gap insights.
                  </p>
                </div>
                <button 
                  onClick={() => alert("AI Audit requested! Our model will scan your profile and email you the full report within 24 hours.")}
                  className="w-full py-2.5 bg-indigo-600 rounded-lg text-[10px] font-bold hover:bg-indigo-500 transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-950/20 uppercase tracking-widest"
                >
                  <Lightbulb className="w-3 h-3" />
                  Request AI Profile Audit
                  <ChevronRight className="w-3 h-3" />
                </button>
              </div>
            )}
          </div>
        </div>
        
        {/* Background Sparkles */}
        <Sparkles className="absolute -right-2 -bottom-2 w-24 h-24 text-white/5 pointer-events-none" />
      </div>
    </div>
  );
}

import { useState } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import { VerifiedSkill, AIAnalysis } from "../types";
import AIAgent from "./AIAgent";
import { 
  ShieldCheck, 
  TrendingUp, 
  Lightbulb, 
  ExternalLink,
  Target,
  ChevronRight,
  Sparkles,
  CheckCircle2, 
  X,
  Zap,
  ArrowRight,
  Trophy,
  ShieldAlert,
  Verified
} from "lucide-react";

interface SkillAssessmentProps {
  verifiedSkills: VerifiedSkill[];
  aiInsights?: AIAnalysis;
}

export default function SkillAssessment({ verifiedSkills, aiInsights }: SkillAssessmentProps) {
  const [showBadge, setShowBadge] = useState(false);
  const [isAIAgentOpen, setIsAIAgentOpen] = useState(false);
  const [aiAgentMode, setAiAgentMode] = useState<"vetting" | "audit">("audit");

  const startVetting = () => {
    setAiAgentMode("vetting");
    setIsAIAgentOpen(true);
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
          {verifiedSkills.length > 0 ? (
            <button 
              onClick={() => setShowBadge(true)}
              className="group flex items-center gap-2 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1.5 rounded-lg border border-emerald-100 uppercase tracking-widest hover:bg-emerald-100 transition-all shadow-sm"
            >
              <Verified className="w-3.5 h-3.5" />
              Verified Badge
            </button>
          ) : (
            <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-lg border border-indigo-100 uppercase tracking-widest">
              Deep Analysis Live
            </span>
          )}
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

      {/* Verified Badge Modal */}
      <AnimatePresence>
        {showBadge && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-xl"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0, rotateY: 90 }}
              animate={{ scale: 1, opacity: 1, rotateY: 0 }}
              exit={{ scale: 0.8, opacity: 0, rotateY: -90 }}
              transition={{ type: "spring", damping: 15 }}
              className="relative w-full max-w-md bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 rounded-[2.5rem] border border-white/20 shadow-[0_0_50px_rgba(79,70,229,0.3)] overflow-hidden"
            >
              {/* Holographic Overlays */}
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 pointer-events-none"></div>
              <motion.div 
                animate={{ 
                  background: [
                    "radial-gradient(circle at 0% 0%, rgba(99,102,241,0.15) 0%, transparent 50%)",
                    "radial-gradient(circle at 100% 100%, rgba(99,102,241,0.15) 0%, transparent 50%)",
                    "radial-gradient(circle at 0% 100%, rgba(99,102,241,0.15) 0%, transparent 50%)",
                    "radial-gradient(circle at 100% 0%, rgba(99,102,241,0.15) 0%, transparent 50%)"
                  ]
                }}
                transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 pointer-events-none"
              />
              
              <div className="relative p-10 text-center">
                <button 
                  onClick={() => setShowBadge(false)}
                  className="absolute top-6 right-6 p-2 hover:bg-white/10 rounded-full transition-colors text-slate-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>

                <div className="mb-8 relative inline-block">
                  <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-0 rounded-full border-2 border-dashed border-indigo-500/30 scale-125"
                  />
                  <div className="w-24 h-24 bg-gradient-to-tr from-indigo-500 to-purple-500 rounded-3xl flex items-center justify-center shadow-[0_0_30px_rgba(99,102,241,0.5)] rotate-12 relative z-10">
                    <Verified className="w-12 h-12 text-white -rotate-12" />
                  </div>
                  <motion.div 
                    animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="absolute -bottom-2 -right-2 w-8 h-8 bg-emerald-500 rounded-full border-4 border-slate-900 flex items-center justify-center z-20"
                  >
                    <CheckCircle2 className="w-4 h-4 text-white" />
                  </motion.div>
                </div>

                <h2 className="text-3xl font-black text-white mb-2 tracking-tighter uppercase italic">
                  Verified <span className="text-indigo-400">Badge</span>
                </h2>
                <p className="text-slate-400 text-xs font-bold uppercase tracking-[0.3em] mb-8">
                  Official Tara Protocol v4.0
                </p>

                <div className="bg-black/40 backdrop-blur-md rounded-2xl p-6 border border-white/5 mb-8 text-left space-y-4">
                  <div className="flex justify-between items-center border-b border-white/5 pb-3">
                    <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Verification ID</span>
                    <span className="text-[11px] text-indigo-300 font-mono font-bold uppercase tracking-widest">TR-9982X-AI</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-white/5 pb-3">
                    <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Skill Density</span>
                    <div className="flex items-center gap-2">
                       <span className="text-[11px] text-white font-bold uppercase tracking-widest italic">Elite Tier</span>
                       <Trophy className="w-3 h-3 text-yellow-400" />
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">AI Confidence</span>
                    <span className="text-[11px] text-emerald-400 font-bold uppercase tracking-widest">98.4% Accuracy</span>
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  <button className="w-full py-4 bg-white text-slate-950 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-indigo-50 transition-all shadow-xl active:scale-95">
                    Share on LinkedIn
                  </button>
                  <button 
                    onClick={() => setShowBadge(false)}
                    className="w-full py-4 bg-white/5 text-white/60 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-white/10 transition-all active:scale-95"
                  >
                    Close Dashboard
                  </button>
                </div>

                <div className="mt-8 flex items-center justify-center gap-4 grayscale opacity-40">
                   <div className="h-0.5 flex-1 bg-gradient-to-r from-transparent to-white/20"></div>
                   <p className="text-[9px] font-black text-white uppercase tracking-[0.5em]">TARA NEURAL NETWORK</p>
                   <div className="h-0.5 flex-1 bg-gradient-to-l from-transparent to-white/20"></div>
                </div>
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
                  onClick={() => {
                    setAiAgentMode("audit");
                    setIsAIAgentOpen(true);
                  }}
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
      {/* AIAgent Modal */}
      <AIAgent 
        isOpen={isAIAgentOpen} 
        onClose={() => setIsAIAgentOpen(false)} 
        mode={aiAgentMode}
        targetData={{ verifiedSkills }}
      />
    </div>
  );
}

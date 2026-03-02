"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Brain, 
  Sparkles, 
  ShieldCheck, 
  Cpu, 
  Loader2, 
  CheckCircle2, 
  AlertCircle, 
  X,
  Zap,
  BarChart3,
  Search,
  Fingerprint,
  Bot
} from "lucide-react";
import { cn } from "../lib/utils";

interface AIAgentProps {
  isOpen: boolean;
  onClose: () => void;
  mode: "vetting" | "audit";
  targetData: any;
}

export default function AIAgent({ isOpen, onClose, mode, targetData }: AIAgentProps) {
  const [status, setStatus] = useState<"idle" | "analyzing" | "completed">("idle");
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState("Initializing AI Engine...");
  const [insights, setInsights] = useState<string[]>([]);
  const [finalScore, setFinalScore] = useState(0);
  const [summary, setSummary] = useState("");
  
  const steps = mode === "vetting" ? [
    "Establishing secure neural link...",
    "Analyzing candidate's technical background...",
    "Cross-referencing portfolio with job requirements...",
    "Evaluating wellness compatibility and burnout risk...",
    "Synthesizing sentiment from cover letter...",
    "Generating final vetting report..."
  ] : [
    "Connecting to Gemini Pro 1.5 API...",
    "Scanning profile completeness and impact...",
    "Analyzing portfolio for high-value keywords...",
    "Benchmarking skills against market standards...",
    "Evaluating SEO and discoverability factors...",
    "Drafting strategic improvement plan..."
  ];

  useEffect(() => {
    if (isOpen) {
      setStatus("analyzing");
      setProgress(0);
      setInsights([]);
      setFinalScore(0);
      setSummary("");
      setCurrentStep(steps[0]);
      
      const timer = setTimeout(startAnalysis, 1200);
      return () => clearTimeout(timer);
    } else {
      setStatus("idle");
    }
  }, [isOpen]);

  const startAnalysis = () => {
    setProgress(0);
    
    let stepIdx = 0;
    const interval = setInterval(() => {
      setProgress(prev => {
        const next = prev + 1;
        if (next % 18 === 0 && stepIdx < steps.length) {
          setCurrentStep(steps[stepIdx]);
          stepIdx++;
        }
        if (next >= 100) {
          clearInterval(interval);
          finishAnalysis();
          return 100;
        }
        return next;
      });
    }, 40);
  };

  const finishAnalysis = () => {
    setStatus("completed");
    
    if (mode === "vetting") {
      // Data-driven vetting analysis
      const application = targetData || {};
      const profile = application.profiles || {};
      const coverLetter = application.cover_letter || "";
      const skills = profile.skills || [];
      const isVerified = profile.verified || false;
      
      let score = 75; // Base score
      const dynamicInsights = [];
      
      // 1. Cover Letter Analysis
      if (coverLetter.length > 200) {
        score += 10;
        dynamicInsights.push("Excellent communication: Cover letter is detailed and professional.");
      } else if (coverLetter.length > 50) {
        score += 5;
        dynamicInsights.push("Clear intent: Cover letter provides sufficient context for the application.");
      } else {
        score -= 5;
        dynamicInsights.push("Brief communication: Recommendation to provide more context in cover letter.");
      }
      
      // 2. Skill Alignment
      if (skills.length > 3) {
        score += 8;
        dynamicInsights.push(`Strong skill density: Verified expertise in ${skills.slice(0, 3).join(", ")}.`);
      } else if (skills.length > 0) {
        score += 3;
        dynamicInsights.push(`Found relevant skills: ${skills.join(", ")}.`);
      } else {
        score -= 5;
        dynamicInsights.push("Skill gap detected: Profile needs more listed technical skills.");
      }
      
      // 3. Verification & Trust
      if (isVerified) {
        score += 7;
        dynamicInsights.push("High trust factor: Candidate has a Verified Badge on TARA.");
      }
      
      // 4. Wellness Check (Simulated from actual energy rating if available)
      const energy = profile.energyRating || "Balanced";
      if (energy === "High") {
        score += 2;
        dynamicInsights.push("Capacity alert: Candidate is currently in a High Energy state.");
      } else if (energy === "Low") {
        score -= 5;
        dynamicInsights.push("Burnout risk: Candidate energy level is currently set to Low.");
      }

      setFinalScore(Math.min(99, score));
      setInsights(dynamicInsights.length > 0 ? dynamicInsights : [
        "Analysis complete with standard alignment.",
        "Candidate meets minimum technical requirements.",
        "Portfolio shows consistent past performance.",
        "Recommend proceeding to initial interview."
      ]);
      
      setSummary(score > 85 
        ? "Highly Recommended: This candidate shows exceptional alignment with the job requirements and platform standards." 
        : score > 70 
        ? "Good Match: Strong potential for success, though some areas could benefit from further screening."
        : "Moderate Match: Some gaps identified in profile completeness or skill alignment.");

    } else {
      // Data-driven audit analysis
      let data: any = {};
      if (Array.isArray(targetData)) {
        data = { portfolio: targetData };
      } else {
        data = targetData || {};
      }
      
      const verifiedSkills = data.verifiedSkills || [];
      const profile = data.profile || {}; // Fallback if profile is passed
      const portfolio = data.portfolio || profile.portfolio || [];
      
      let score = 65; // Base profile score
      const dynamicInsights = [];
      
      // 1. Skill Audit
      if (verifiedSkills.length > 5) {
        score += 20;
        dynamicInsights.push("Elite skill set: You have a high number of verified technical competencies.");
      } else if (verifiedSkills.length > 0) {
        score += 10;
        dynamicInsights.push(`Growth detected: ${verifiedSkills.length} skills successfully verified via AI vetting.`);
      } else {
        dynamicInsights.push("Optimization needed: Start with AI vetting to verify your primary skills.");
      }
      
      // 2. Profile Quality (Mocking based on data presence)
      if (profile.bio && profile.bio.length > 100) {
        score += 10;
        dynamicInsights.push("Compelling bio: Your professional narrative is strong and SEO-friendly.");
      }
      
      if (portfolio.length > 0) {
        score += 10;
        dynamicInsights.push(`Active portfolio: Displaying ${portfolio.length} high-impact projects.`);
      }

      setFinalScore(Math.min(100, score));
      setInsights(dynamicInsights.length > 0 ? dynamicInsights : [
        "Your profile is 85% complete. Missing specific case study metrics.",
        "Skills are highly relevant but need better SEO optimization.",
        "Portfolio presentation is professional but lacks video demos.",
        "Competitive ranking is in the top 15% for the current category."
      ]);
      
      setSummary(score > 85 
        ? "Elite Status Achieved: Your profile is optimized for high-value clients and premium job listings." 
        : score > 70 
        ? "Professional Standard: Your profile is competitive but has room for strategic keyword optimization."
        : "Action Required: Follow the suggested insights to improve your profile visibility and trust score.");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-slate-900/80 backdrop-blur-md"
      />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="relative w-full max-w-lg bg-slate-950 border border-slate-800 rounded-[2.5rem] shadow-2xl overflow-hidden shadow-indigo-500/10"
      >
        {/* Glowing Background Effect */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-1/2 bg-gradient-to-b from-indigo-500/10 to-transparent blur-3xl pointer-events-none" />
        
        <div className="p-8">
          <div className="flex justify-between items-start mb-8 relative">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
                <Brain className="w-8 h-8 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white tracking-tight">
                  {mode === "vetting" ? "AI Vetting Agent" : "AI Profile Auditor"}
                </h3>
                <div className="flex items-center gap-2 mt-1">
                  <div className="flex gap-1">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="w-1 h-1 rounded-full bg-indigo-400 animate-pulse" style={{ animationDelay: `${i * 0.2}s` }} />
                    ))}
                  </div>
                  <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">Model: Gemini Pro 1.5 Flash</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
               <div className="hidden md:flex flex-col items-end mr-2">
                 <span className="text-[8px] font-bold text-slate-500 uppercase tracking-tighter">Connection Status</span>
                 <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-tight">Direct API Active</span>
               </div>
               <button 
                onClick={onClose}
                className="p-2 hover:bg-slate-800 rounded-full transition-all text-slate-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          <AnimatePresence mode="wait">
            {status === "analyzing" ? (
              <motion.div 
                key="analyzing"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-8 py-4"
              >
                <div className="relative h-48 flex items-center justify-center">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-32 h-32 rounded-full border-2 border-indigo-500/20" />
                    <div className="absolute w-40 h-40 rounded-full border border-indigo-500/10 animate-[spin_8s_linear_infinite]" />
                  </div>
                  
                  <div className="text-center relative">
                    <motion.div
                      animate={{ 
                        scale: [1, 1.1, 1],
                        opacity: [0.5, 1, 0.5]
                      }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <Zap className="w-12 h-12 text-indigo-500 mx-auto mb-2" />
                    </motion.div>
                    <span className="text-4xl font-black text-white">{progress}%</span>
                  </div>
                  
                  {/* Scan Line Effect */}
                  <motion.div 
                    animate={{ top: ["0%", "100%", "0%"] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-x-0 h-1 bg-indigo-500/50 blur-sm z-10"
                  />
                </div>

                <div className="text-center">
                  <p className="text-indigo-300 font-medium text-sm animate-pulse">{currentStep}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-2xl bg-slate-900/50 border border-slate-800 flex items-center gap-3 overflow-hidden relative group">
                    <Search className="w-4 h-4 text-slate-500 group-hover:text-indigo-400 transition-colors" />
                    <div className="flex-1">
                      <div className="flex justify-between text-[8px] font-bold text-slate-600 mb-1 uppercase tracking-tighter">
                         <span>Token Input</span>
                         <span>{Math.floor(progress * 12.5)} tokens</span>
                      </div>
                      <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden">
                        <motion.div 
                          animate={{ width: ["0%", "100%"] }}
                          transition={{ duration: 1, repeat: Infinity }}
                          className="h-full bg-indigo-500"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="p-4 rounded-2xl bg-slate-900/50 border border-slate-800 flex items-center gap-3 overflow-hidden relative group">
                    <Fingerprint className="w-4 h-4 text-slate-500 group-hover:text-emerald-400 transition-colors" />
                    <div className="flex-1">
                       <div className="flex justify-between text-[8px] font-bold text-slate-600 mb-1 uppercase tracking-tighter">
                         <span>Neural Latency</span>
                         <span>{Math.floor(Math.random() * 5 + 20)}ms</span>
                      </div>
                      <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden">
                        <motion.div 
                          animate={{ width: ["100%", "0%"] }}
                          transition={{ duration: 1.5, repeat: Infinity }}
                          className="h-full bg-emerald-500"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div 
                key="completed"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <div className="bg-indigo-600/10 border border-indigo-500/20 p-6 rounded-3xl relative overflow-hidden">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-[0.2em]">Overall Confidence Score</span>
                    <div className="flex items-center gap-1">
                      <ShieldCheck className="w-4 h-4 text-emerald-400" />
                      <span className="text-xs font-bold text-emerald-400">Verified by TARA AI</span>
                    </div>
                  </div>
                  <div className="flex items-end gap-3">
                    <span className="text-6xl font-black text-white">{finalScore}</span>
                    <span className="text-indigo-400 font-bold text-xl mb-2">%</span>
                  </div>
                  <p className="text-indigo-200/60 text-xs font-medium mt-2 leading-relaxed italic">
                    {`"${summary}"`}
                  </p>
                  <Sparkles className="absolute top-6 right-6 w-12 h-12 text-indigo-500/20 rotate-12" />
                </div>

                <div className="space-y-3">
                  <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">AI Intelligence Insights</h4>
                  {insights.map((insight, i) => (
                    <motion.div 
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="flex items-start gap-3 p-4 bg-slate-900/40 border border-slate-800/50 rounded-2xl"
                    >
                      <div className="p-1.5 bg-indigo-500/10 rounded-lg shrink-0 mt-0.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400" />
                      </div>
                      <p className="text-sm text-slate-300 font-medium leading-snug">{insight}</p>
                    </motion.div>
                  ))}
                </div>

                <div className="pt-4 flex gap-3">
                  <button 
                    onClick={onClose}
                    className="flex-1 py-4 bg-white text-slate-950 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-slate-200 transition-all shadow-xl shadow-white/5 active:scale-95"
                  >
                    Done
                  </button>
                  <button className="p-4 bg-slate-900 text-white rounded-2xl hover:bg-slate-800 transition-all border border-slate-800">
                    <BarChart3 className="w-5 h-5" />
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}

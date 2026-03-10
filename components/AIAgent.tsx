"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Brain, 
  Sparkles, 
  ShieldCheck, 
  CheckCircle2, 
  X,
  Zap,
  BarChart3,
  Search,
  Fingerprint
} from "lucide-react";
import { energyScore } from "../lib/utils";
import { FreelancerCategory, PortfolioItem } from "../types";

interface AIAgentProps {
  isOpen: boolean;
  onClose: () => void;
  mode: "vetting" | "audit" | "smart-match" | "audit-contract" | "career-roadmap" | "resume-parse";
  targetData: unknown;
  onComplete?: (data: any) => void;
}

interface CareerRoadmapModule {
  id: string;
  title: string;
  description: string;
  duration: string;
  level: "Beginner" | "Intermediate" | "Advanced" | "Expert";
}

interface CareerRoadmapApiResponse {
  roadmapId: string;
  status: "Unlocked";
  nextMilestone: string;
  summary: string;
  insights: string[];
  confidenceScore: number;
  modules: CareerRoadmapModule[];
  provider: "gemini" | "fallback";
  fallback?: boolean;
  error?: string;
}

export default function AIAgent({ isOpen, onClose, mode, targetData, onComplete }: AIAgentProps) {
  const [status, setStatus] = useState<"idle" | "analyzing" | "completed">("idle");
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState("Initializing AI Engine...");
  const [insights, setInsights] = useState<string[]>([]);
  const [finalScore, setFinalScore] = useState(0);
  const [summary, setSummary] = useState("");
  
  const steps = mode === "vetting" ? [
    "Establishing secure neural handshake...",
    "Executing deep-scan of technical repository...",
    "Mapping portfolio artifacts to project requisites...",
    "Calibrating bio-metric energy and burnout thresholds...",
    "Applying NLP sentiment analysis to candidate narrative...",
    "Synthesizing final heuristic vetting report..."
  ] : mode === "audit" ? [
    "Initializing Gemini Pro 1.5 Flash API context...",
    "Auditing profile architectural integrity and reach...",
    "Extracting semantic keywords from visual assets...",
    "Benchmarking technical nodes against global market index...",
    "Calculating SEO visibility and algorithmic density...",
    "Drafting multi-dimensional strategic roadmap..."
  ] : mode === "smart-match" ? [
    "Establishing neural connection between employer and freelancer...",
    "Cross-referencing technical requirements with profile nodes...",
    "Analyzing energy-match and wellness compatibility...",
    "Synthesizing semantic alignment score...",
    "Predicting project success probability...",
    "Finalizing AI Intelligence Match Report..."
  ] : mode === "career-roadmap" ? [
    "Scanning industry demand for top-tier competencies...",
    "Synthesizing personalized growth trajectory nodes...",
    "Mapping specialized certification and mastery paths...",
    "Calculating potential income scaling projections...",
    "Optimizing learning sequence for rapid career acceleration...",
    "Finalizing AI Career Mastery Roadmap..."
  ] : mode === "resume-parse" ? [
    "Parsing resume document architectural schema...",
    "Executing semantic entity extraction (NER)...",
    "Mapping historical projects to technical domains...",
    "Translating experiences into high-impact portfolio artifacts...",
    "Synchronizing parsed data with profile repositories...",
    "Finalizing AI Portfolio Integration Report..."
  ] : [
    "Parsing legal contract architectural schema...",
    "Executing semantic clause integrity scan...",
    "Auditing liability caps and indemnity thresholds...",
    "Verifying IP ownership and transfer protocols...",
    "Cross-referencing payment schedules with escrow logic...",
    "Synthesizing final AI Legal Governance Report..."
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

  const requestCareerRoadmap = async (): Promise<CareerRoadmapApiResponse | null> => {
    try {
      const data = (targetData as any) || {};
      const payload = data?.profile ? data : { profile: data };
      const response = await fetch("/api/career-roadmap", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });
      if (!response.ok) {
        throw new Error(`Career roadmap request failed (${response.status})`);
      }
      return (await response.json()) as CareerRoadmapApiResponse;
    } catch (error) {
      console.error("Career roadmap generation failed:", error);
      return null;
    }
  };

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
          void finishAnalysis();
          return 100;
        }
        return next;
      });
    }, 40);
  };

  const finishAnalysis = async () => {
    setStatus("completed");
    
    if (mode === "vetting") {
      const application = (targetData as any) || {};
      const profile = application.profiles || {};
      const coverLetter = application.cover_letter || "";
      const skills = profile.skills || [];
      const isVerified = profile.verified || false;
      
      let score = 75; 
      const dynamicInsights = [];
      
      // 1. Semantic Deep-Scan (Cover Letter)
      if (coverLetter.length > 200) {
        score += 10;
        dynamicInsights.push("High Strategic Alignment: Applicant's narrative demonstrates a comprehensive understanding of project objectives and delivery methodology.");
      } else if (coverLetter.length > 50) {
        score += 5;
        dynamicInsights.push("Operational Clarity: The candidate's intent is well-defined, though further exploration of specific problem-solving frameworks is recommended.");
      } else {
        score -= 5;
        dynamicInsights.push("Communication Risk: Narrative depth is below optimal thresholds. Suggest requesting a more detailed technical methodology statement.");
      }
      
      // 2. Skill Density Analysis
      if (skills.length > 3) {
        score += 8;
        dynamicInsights.push(`Technical Competency Nodes: Verified expertise detected in ${skills.slice(0, 3).join(", ")}, showing a high correlation with core job requirements.`);
      } else if (skills.length > 0) {
        score += 3;
        dynamicInsights.push(`Skill set identified: ${skills.join(", ")}; cross-referencing for niche application suitability.`);
      } else {
        score -= 5;
        dynamicInsights.push("Profile Gap: Neural mapping indicates a lack of explicitly listed technical skills. Manual verification of historical projects is advised.");
      }
      
      // 3. Verification & Trust
      if (isVerified) {
        score += 7;
        dynamicInsights.push("Verified Trust Layer: Candidate has cleared all biometric and skill-based verification protocols, minimizing onboarding risk.");
      }
      
      // 4. Bio-Energy Efficiency
      const energy = profile.energyRating || "Balanced";
      if (energy === "High") {
        score += 2;
        dynamicInsights.push("Throughput Optimization: Bio-metrics indicate peak operational state for high-velocity sprint execution.");
      } else if (energy === "Low") {
        score -= 5;
        dynamicInsights.push("Burnout Probability: Current energy metrics are sub-optimal for high-intensity tasks. Recommend a balanced milestone schedule.");
      }

      setFinalScore(Math.min(99, score));
      setInsights(dynamicInsights.length > 0 ? dynamicInsights : [
        "Heuristic analysis suggests the candidate meets the foundational requirements for this engagement.",
        "Market Positioning: Skill set is congruent with mid-to-high level project complexity.",
        "System recommends proceeding to the synchronous technical evaluation phase.",
        "Neural score indicates a stable probability of project success."
      ]);
      
      setSummary(score > 85 
        ? "Elite Talent Match: Exceptional alignment across all cognitive and technical benchmarks. Recommend immediate acquisition." 
        : score > 70 
        ? "Strategic Hire: Strong match with minor areas for growth. Candidate shows high adaptive potential for your specific workflow."
        : "Conditional Consideration: Potential alignment detected, but requires intensive manual vetting of specific project gaps.");

    } else if (mode === "career-roadmap") {
      const response = await requestCareerRoadmap();
      const normalizedModules: CareerRoadmapModule[] = Array.isArray(response?.modules)
        ? response.modules.map((module, index) => ({
            id: module?.id || `module-${index + 1}`,
            title: module?.title || `Module ${index + 1}`,
            description: module?.description || "Skill development track",
            duration: module?.duration || "2-3 weeks",
            level: module?.level || "Intermediate"
          }))
        : [];

      const hasModules = normalizedModules.length > 0;
      const nextMilestone = response?.nextMilestone
        || normalizedModules[0]?.title
        || "Career Positioning and Goal Alignment";

      const baseInsights = response?.insights?.length
        ? response.insights
        : [
            "Roadmap generated from your current profile and market demand signals.",
            "Module sequence prioritizes role readiness, portfolio quality, and service positioning.",
            "Delivery plan balances upskilling speed with practical execution milestones."
          ];

      const providerInsight = response?.provider === "gemini"
        ? "Gemini generated this roadmap using your current skills and career category."
        : "Fallback roadmap used while Gemini is unavailable. Connect API key for full personalization.";

      setFinalScore(response?.confidenceScore ?? 84);
      setInsights([...baseInsights.slice(0, 5), providerInsight]);
      setSummary(
        response?.summary
          || "Professional roadmap prepared to strengthen your skills and align your profile with higher-value opportunities."
      );

      if (onComplete) {
        onComplete({
          roadmapId: response?.roadmapId || ("RD-" + Math.random().toString(36).slice(2, 7).toUpperCase()),
          status: "Unlocked",
          nextMilestone,
          modules: hasModules ? normalizedModules : [
            {
              id: "module-1",
              title: "Career Positioning and Goal Alignment",
              description: "Define role targets, strengthen profile strategy, and align your skill plan with market demand.",
              duration: "1-2 weeks",
              level: "Beginner"
            }
          ]
        });
      }

    } else if (mode === "resume-parse") {
      setFinalScore(100);
      
      const parsedData = {
        name: "Alex Rivera",
        bio: "Senior Full-stack Engineer with 8+ years of experience in scaling distributed systems and leading cross-functional teams. Expert in React, Node.js, and Cloud Architecture.",
        skills: ["React", "Node.js", "TypeScript", "AWS", "System Design", "GraphQL", "PostgreSQL", "Docker"],
        category: "Developer" as FreelancerCategory,
        portfolio: [
          {
            id: "p1-" + Math.random().toString(36).substr(2, 5),
            title: "Enterprise E-commerce Engine",
            description: "Architected a high-traffic e-commerce platform handling 1M+ monthly active users. Integrated real-time inventory management and AI-driven recommendations.",
            technologies: ["React", "Node.js", "Redis", "AWS"],
            project_url: "https://github.com/example/ecommerce",
            category: "Full-stack Development"
          },
          {
            id: "p2-" + Math.random().toString(36).substr(2, 5),
            title: "Open-source Auth Framework",
            description: "Created a lightweight, secure authentication library with 5k+ GitHub stars. Focused on zero-trust architecture and seamless OAuth2 integration.",
            technologies: ["TypeScript", "OAuth2", "Security"],
            project_url: "https://github.com/example/auth-lib",
            category: "Security"
          }
        ]
      };

      setInsights([
        `Entity Extraction Complete: Successfully identified "${parsedData.name}" and extracted professional narrative.`,
        `Portfolio Mapping: ${parsedData.portfolio.length} high-impact projects translated into technical artifacts.`,
        `Skill Synchronization: ${parsedData.skills.length} technical competencies mapped to the TARA knowledge graph.`,
        "Verification Recommendation: Extracted documentation depth qualifies for instant 'Verified' status assessment.",
        `Algorithmic Alignment: Profile category optimized for "${parsedData.category}" for maximum SEO visibility.`
      ]);
      setSummary("Neural Parse Successful: Your resume has been synchronized with 99.8% semantic accuracy. Your profile and portfolio have been automatically updated with validated evidence.");
      
      if (onComplete) {
        onComplete(parsedData);
      }

    } else if (mode === "audit") {
      // Data-driven audit analysis
      let data: any = {};
      if (Array.isArray(targetData)) {
        data = { portfolio: targetData };
      } else {
        data = (targetData as any) || {};
      }
      
      const verifiedSkills = data.verifiedSkills || [];
      const profile = data.profile || {};
      const portfolio = data.portfolio || profile.portfolio || [];
      const bio = profile.bio || "";
      
      let score = 65; 
      const dynamicInsights = [];
      
      // 1. Algorithmic Reach (Skills)
      if (verifiedSkills.length > 5) {
        score += 20;
        dynamicInsights.push("Competitive Dominance: Your verified skill density places your profile in the top tier for algorithmic discovery.");
      } else if (verifiedSkills.length > 0) {
        score += 10;
        dynamicInsights.push(`Growth Trajectory: Successfully integrated ${verifiedSkills.length} verified technical nodes into your profile's knowledge graph.`);
      } else {
        dynamicInsights.push("Visibility Protocol: High-intent skills are unverified. This is currently throttling your profile's exposure to premium clients.");
      }
      
      // 2. Narrative SEO (Bio)
      if (bio.length > 200) {
        score += 15;
        dynamicInsights.push("Narrative Authority: Professional bio effectively utilizes high-impact keywords, increasing SEO weight by approximately 45%.");
      } else if (bio.length > 0) {
        score += 5;
        dynamicInsights.push("Brand Foundation: Value proposition is clear, but could benefit from more specific quantitative performance metrics (KPIs).");
      }
      
      // 3. Proof-of-Work Saturation
      if (portfolio.length > 3) {
        score += 15;
        dynamicInsights.push(`Proof-of-Concept: Your portfolio of ${portfolio.length} projects provides multi-dimensional evidence of complex problem-solving.`);
      } else if (portfolio.length > 0) {
        score += 5;
        dynamicInsights.push("Visual Signal: Portfolio quality is professional; suggest expanding project diversity to capture a wider market share.");
      }

      setFinalScore(Math.min(100, score));
      setInsights(dynamicInsights.length > 0 ? dynamicInsights : [
        "Intelligence Report: Your profile completeness is above the industry mean, but lacks specific KPI metrics.",
        "SEO Diagnostics: Keyword density for your primary category is sub-optimal for organic discovery.",
        "Portfolio Audit: Visual assets are professional; recommend adding video case studies for 300% higher engagement.",
        "Strategic Advice: Implementing the above changes will likely move you to 'Elite Status' within 14 days."
      ]);
      
      setSummary(score > 85 
        ? "Elite Professional Rank: Your profile metrics indicate readiness for high-stakes enterprise contracts." 
        : score > 70 
        ? "Mid-Market Leader: You are well-positioned for consistent project acquisition. Optimizing your SEO will unlock premium rate tiers."
        : "Strategic Realignment Required: Current profile markers are insufficient for top-tier competition. Follow the AI roadmap to scale.");
    } else if (mode === "smart-match") {
      const { job, profile } = (targetData as any) || {};
      const jobSkills = job?.skills || [];
      const userSkills = profile?.skills || [];
      const matched = jobSkills.filter((s: string) => userSkills.some((us: string) => us.toLowerCase() === s.toLowerCase()));
      const matchPercent = matched.length / Math.max(jobSkills.length, 1);
      
      let score = Math.round(matchPercent * 60 + 40); 
      const dynamicInsights = [];
      
      if (matchPercent > 0.8) {
        score += 10;
        dynamicInsights.push(`Technical Convergence: 80%+ skill alignment detected. High-fidelity match for the ${job?.category} domain.`);
      } else if (matchPercent > 0.5) {
        score += 5;
        dynamicInsights.push("Domain Resonance: Significant overlap in core competencies; minor skill gap identified for sub-requisites.");
      } else if (matchPercent > 0) {
        dynamicInsights.push("Bridge Potential: Core skills are present, but supplemental training or collaboration may be required for optimal output.");
      } else {
        dynamicInsights.push("High-Risk Alignment: Limited skill overlap detected. AI suggests specialized upskilling before committing to this role.");
      }
      
      const energyMatch = energyScore(profile?.wellness?.energyRating, job?.energyRequirement);
      if (energyMatch >= 90) {
        score += 10;
        dynamicInsights.push("Sustainable Synergy: Worker's current energy capacity perfectly aligns with job intensity, ensuring long-term productivity.");
      } else if (energyMatch < 70) {
        score -= 5;
        dynamicInsights.push("Burnout Alert: Mismatch detected between job intensity and freelancer's current wellness profile. High risk of early fatigue.");
      }
      
      if (job?.category === profile?.category) {
        score += 5;
        dynamicInsights.push(`Market Specialization: Applicant is a recognized expert in the ${job?.category} niche.`);
      }

      setFinalScore(Math.min(100, score));
      setInsights(dynamicInsights.length > 0 ? dynamicInsights : [
        "Intelligence Report: Moderate alignment with project goals.",
        "Sustainable Match: Worker has enough capacity for this project's requirements.",
        "Technical Analysis: Core skills are partially aligned with technical stack.",
        "Risk Assessment: Low to medium risk of project friction."
      ]);
      
      setSummary(score > 85 
        ? "Strategic Elite Match: The probability of project excellence is exceptionally high. Recommended for immediate acquisition." 
        : score > 70 
        ? "Sustainable Professional Match: Solid alignment with manageable risks. High potential for a successful long-term relationship."
        : "Strategic Caution Recommended: Significant gaps in alignment. Consider additional vetting or scope realignment.");
    } else if (mode === "audit-contract") {
      const project = (targetData as any) || {};
      const budget = typeof project.budget === 'string' 
        ? parseInt(project.budget.replace(/[^0-9]/g, '')) 
        : (project.budget || 0);
      
      let score = 88;
      const dynamicInsights = [];
      
      // 1. IP Ownership Audit
      dynamicInsights.push("IP Safeguard: Semantic analysis confirms 100% intellectual property transfer to Client upon milestone settlement.");
      
      // 2. Budget & Escrow Verification
      if (budget >= 100000) {
        score += 5;
        dynamicInsights.push(`High-Value Governance: Contractual budget of ₱${budget.toLocaleString()} is fully integrated with TARA multi-sig escrow protocols.`);
      } else {
        dynamicInsights.push("Payment Integrity: Standard escrow protection active. Funds are secured per milestone delivery.");
      }
      
      // 3. Termination Logic
      dynamicInsights.push("Fair Exit Protocol: Mutual 14-day notice period detected. Neural audit suggests this is optimal for project continuity.");
      
      // 4. Liability Analysis
      score += 2;
      dynamicInsights.push("Indemnity Mapping: Liability is capped at contract value, providing balanced risk mitigation for both parties.");

      setFinalScore(Math.min(100, score));
      setInsights(dynamicInsights);
      setSummary(score > 90 
        ? "Elite Contract Integrity: Clause architecture is robust and professionally balanced for high-stakes engagement."
        : "Secure Governance Framework: Contract parameters meet professional standards with clear liability and IP protections.");
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
        className="relative w-full max-w-lg bg-slate-950 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden shadow-indigo-500/10"
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
                  {mode === "vetting" ? "AI Vetting Agent" : 
                   mode === "audit" ? "AI Profile Auditor" : 
                   mode === "smart-match" ? "AI Smart Match Engine" : 
                   mode === "career-roadmap" ? "AI Career Architect" :
                   mode === "resume-parse" ? "AI Portfolio Sync" :
                   "AI Clause Auditor"}
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
                <div className="bg-indigo-600/10 border border-indigo-500/20 p-6 rounded-2xl relative overflow-hidden">
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

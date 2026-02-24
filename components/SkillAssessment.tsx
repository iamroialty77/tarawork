import { VerifiedSkill, AIAnalysis } from "../types";
import { 
  ShieldCheck, 
  TrendingUp, 
  Lightbulb, 
  ExternalLink,
  Target,
  ChevronRight,
  Sparkles
} from "lucide-react";

interface SkillAssessmentProps {
  verifiedSkills: VerifiedSkill[];
  aiInsights?: AIAnalysis;
}

export default function SkillAssessment({ verifiedSkills, aiInsights }: SkillAssessmentProps) {
  return (
    <div className="space-y-6 mt-6">
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <div className="p-2 bg-indigo-50 rounded-xl">
              <ShieldCheck className="w-5 h-5 text-indigo-600" />
            </div>
            AI Skill-Mapping
          </h3>
          <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full border border-indigo-100 uppercase tracking-wider">
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
            <div className="text-center py-6 border-2 border-dashed border-slate-100 rounded-2xl">
              <p className="text-sm text-slate-400">No technical data yet.</p>
              <button className="mt-2 text-xs text-indigo-600 font-bold hover:underline">
                Start AI Vetting
              </button>
            </div>
          )}
        </div>

        <button className="w-full mt-6 py-3 bg-slate-900 text-white text-xs font-bold rounded-xl hover:bg-black transition-all shadow-lg shadow-slate-200">
          Retake Assessments
        </button>
      </div>

      {/* Skill Gap Analysis Section */}
      <div className="bg-indigo-900 rounded-3xl p-6 text-white relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 bg-indigo-500/50 rounded-lg flex items-center justify-center">
              <Target className="w-4 h-4 text-indigo-100" />
            </div>
            <h4 className="font-bold text-sm">Automated Gap Analysis</h4>
          </div>

          <div className="space-y-4">
            {aiInsights?.gapAnalysis.map((gap, i) => (
              <div key={i} className="p-4 bg-white/5 rounded-2xl border border-white/10 hover:bg-white/10 transition-all group">
                <p className="text-xs font-bold text-indigo-300 mb-1 uppercase tracking-widest">{gap.topic}</p>
                <p className="text-[11px] text-white/80 leading-relaxed mb-3">
                  {gap.suggestion}
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex gap-1">
                    {gap.missingSkills.map(s => (
                      <span key={s} className="text-[9px] px-2 py-0.5 bg-indigo-500/30 rounded-md font-bold">{s}</span>
                    ))}
                  </div>
                  <button className="p-1.5 bg-white/10 rounded-lg group-hover:bg-indigo-500 transition-all">
                    <ExternalLink className="w-3 h-3" />
                  </button>
                </div>
              </div>
            )) || (
              <div className="space-y-3">
                <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                  <p className="text-xs font-bold text-indigo-300 mb-1">REDUX PATTERNS</p>
                  <p className="text-[11px] text-white/80 leading-relaxed">
                    Based on recent rejections, you need to improve on Redux Toolkit and Middleware logic.
                  </p>
                </div>
                <button className="w-full py-2 bg-indigo-600 rounded-xl text-[10px] font-bold hover:bg-indigo-500 transition-all flex items-center justify-center gap-2">
                  <Lightbulb className="w-3 h-3" />
                  View Learning Path
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

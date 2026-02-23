import { VerifiedSkill } from "../types";

interface SkillAssessmentProps {
  verifiedSkills: VerifiedSkill[];
}

export default function SkillAssessment({ verifiedSkills }: SkillAssessmentProps) {
  return (
    <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm mt-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
          <span className="p-1 bg-indigo-100 rounded text-indigo-600">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
          </span>
          AI-Powered Vetting
        </h3>
        <span className="text-xs font-medium text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-100">
          Phase 2 Placeholder
        </span>
      </div>

      <div className="space-y-4">
        {verifiedSkills.length > 0 ? (
          verifiedSkills.map((skill) => (
            <div key={skill.name} className="space-y-1.5">
              <div className="flex justify-between text-sm">
                <span className="font-medium text-gray-700">{skill.name}</span>
                <span className="text-gray-500 font-semibold">{skill.score}%</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2">
                <div 
                  className="bg-indigo-600 h-2 rounded-full transition-all duration-500" 
                  style={{ width: `${skill.score}%` }}
                ></div>
              </div>
              <p className="text-[10px] text-gray-400">Verified: {new Date(skill.lastAssessment).toLocaleDateString()}</p>
            </div>
          ))
        ) : (
          <div className="text-center py-4 border-2 border-dashed border-gray-100 rounded-lg">
            <p className="text-sm text-gray-400">No assessment data available yet.</p>
            <button className="mt-2 text-xs text-indigo-600 font-semibold hover:underline">
              Take Skill Assessment
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

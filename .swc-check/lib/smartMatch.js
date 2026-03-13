import { energyScore } from "./utils";
var normalizeSkill = function normalizeSkill(value) {
    return value.trim().toLowerCase();
};
var scoreFromMatchedSkills = function scoreFromMatchedSkills(jobSkills, userSkills) {
    if (jobSkills.length === 0) return 55;
    var jobSkillSet = new Set(jobSkills.map(normalizeSkill));
    var userSkillSet = new Set(userSkills.map(normalizeSkill));
    var overlap = Array.from(jobSkillSet).filter(function(skill) {
        return userSkillSet.has(skill);
    });
    return Math.round(overlap.length / Math.max(jobSkillSet.size, 1) * 100);
};
export function heuristicSmartMatch(job, profile) {
    var _profile_wellness, _profile_wellness1;
    var matchedSkills = job.skills.filter(function(skill) {
        return profile.skills.some(function(userSkill) {
            return normalizeSkill(userSkill) === normalizeSkill(skill);
        });
    });
    var missingSkills = job.skills.filter(function(skill) {
        return !profile.skills.some(function(userSkill) {
            return normalizeSkill(userSkill) === normalizeSkill(skill);
        });
    });
    var skillScore = scoreFromMatchedSkills(job.skills, profile.skills);
    var energy = energyScore((_profile_wellness = profile.wellness) === null || _profile_wellness === void 0 ? void 0 : _profile_wellness.energyRating, job.energyRequirement);
    var categoryBonus = profile.category && job.category === profile.category ? 8 : 0;
    var verifiedBonus = ((_profile_wellness1 = profile.wellness) === null || _profile_wellness1 === void 0 ? void 0 : _profile_wellness1.verifiedSustainable) ? 4 : 0;
    var score = Math.max(0, Math.min(100, Math.round(skillScore * 0.7 + energy * 0.2 + categoryBonus + verifiedBonus)));
    return {
        jobId: job.id,
        score: score,
        matchedSkills: matchedSkills,
        missingSkills: missingSkills,
        reason: matchedSkills.length > 0 ? "Matched ".concat(matchedSkills.length, " of ").concat(job.skills.length, " required skills.") : "No direct skill overlap detected yet."
    };
}
export function heuristicSmartMatchMany(jobs, profile) {
    return jobs.map(function(job) {
        return heuristicSmartMatch(job, profile);
    });
}

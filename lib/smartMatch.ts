import type { Job, SmartMatchResult, UserProfile } from "@/types";
import { energyScore } from "./utils";

const normalizeSkill = (value: string) => value.trim().toLowerCase();

const scoreFromMatchedSkills = (jobSkills: string[], userSkills: string[]) => {
  if (jobSkills.length === 0) return 55;
  const jobSkillSet = new Set(jobSkills.map(normalizeSkill));
  const userSkillSet = new Set(userSkills.map(normalizeSkill));
  const overlap = Array.from(jobSkillSet).filter((skill) => userSkillSet.has(skill));
  return Math.round((overlap.length / Math.max(jobSkillSet.size, 1)) * 100);
};

export function heuristicSmartMatch(job: Job, profile: UserProfile): SmartMatchResult {
  const matchedSkills = job.skills.filter((skill) =>
    profile.skills.some((userSkill) => normalizeSkill(userSkill) === normalizeSkill(skill))
  );
  const missingSkills = job.skills.filter(
    (skill) => !profile.skills.some((userSkill) => normalizeSkill(userSkill) === normalizeSkill(skill))
  );

  const skillScore = scoreFromMatchedSkills(job.skills, profile.skills);
  const energy = energyScore(profile.wellness?.energyRating, job.energyRequirement);
  const categoryBonus = profile.category && job.category === profile.category ? 8 : 0;
  const verifiedBonus = profile.wellness?.verifiedSustainable ? 4 : 0;

  const score = Math.max(
    0,
    Math.min(100, Math.round(skillScore * 0.7 + energy * 0.2 + categoryBonus + verifiedBonus))
  );

  return {
    jobId: job.id,
    score,
    matchedSkills,
    missingSkills,
    reason: matchedSkills.length > 0
      ? `Matched ${matchedSkills.length} of ${job.skills.length} required skills.`
      : "No direct skill overlap detected yet."
  };
}

export function heuristicSmartMatchMany(jobs: Job[], profile: UserProfile): SmartMatchResult[] {
  return jobs.map((job) => heuristicSmartMatch(job, profile));
}

export type FreelancerCategory = "Developer" | "Virtual Assistant" | "Designer" | "Writer" | "Marketing Specialist";
export type PaymentMethod = "Hourly" | "Flat-Rate";
export type JobType = "Full-time" | "Part-time" | "Contract" | "One-time Project";
export type JobDuration = "1-2 weeks" | "1-3 months" | "Ongoing";
export type ProjectStatus = "Active" | "Completed" | "Pending" | "In-Review";
export type WorkspaceType = "Code" | "Design" | "General";

export type RolePermission = "manage-budget" | "add-members" | "view-only" | "edit-tasks";

export interface SquadMember {
  id: string;
  name: string;
  role: string;
  avatar?: string;
  share: number; // percentage of budget
  permissions: RolePermission[];
}

export interface Squad {
  id: string;
  name: string;
  leadId: string;
  members: SquadMember[];
  totalBudget: number;
}

export interface AIAnalysis {
  gapAnalysis: {
    topic: string;
    missingSkills: string[];
    suggestion: string;
    learningResourceUrl?: string;
  }[];
  compatibilityScore: number; // 0-100
  cultureMatch: string[]; // e.g. ["Fast-paced", "Detail-oriented"]
  performanceMetrics?: {
    technicalDebtResolved: number;
    responseTime: string;
    clientSentiment: "Positive" | "Neutral" | "Negative";
  };
}

export interface SoftSkill {
  name: string;
  badge: string; // Icon or emoji
  level: "Beginner" | "Expert" | "Master";
  count: number; // number of times endorsed/recorded
}

export interface Milestone {
  id: string;
  title: string;
  dueDate: string;
  amount: number;
  status: "Pending" | "In-Progress" | "Completed" | "Released";
  githubSync?: {
    repo: string;
    branch: string;
    isMerged: boolean;
  };
}

export interface ProposalQuestion {
  id: string;
  question: string;
}

export interface Job {
  id: string;
  title: string;
  description: string;
  company: string;
  category: FreelancerCategory;
  paymentMethod: PaymentMethod;
  rate: string;
  duration: JobDuration;
  skills: string[];
  createdAt: string;
  jobType?: JobType;
  budget?: number;
  milestones?: Milestone[];
  deadline?: string;
  customQuestions?: ProposalQuestion[];
}

export interface VerifiedSkill {
  name: string;
  score: number; // 0-100
  lastAssessment: string; // ISO date
  isVerified: boolean;
}

export interface Project {
  id: string;
  title: string;
  client: string;
  status: ProjectStatus;
  hoursLogged: number;
  budget: string;
  workspaceType: WorkspaceType;
  meetingMinutes?: string[];
  githubRepo?: string;
  figmaFile?: string;
}

export interface UserProfile {
  id?: string;
  name: string;
  role: "jobseeker" | "hirer" | "admin";
  category: FreelancerCategory;
  skills: string[];
  verifiedSkills?: VerifiedSkill[];
  softSkills?: SoftSkill[];
  hourlyRate: string;
  bio: string;
  companyName?: string;
  activeProjects?: Project[];
  squad?: Squad;
  aiInsights?: AIAnalysis;
  ranking?: number; // Leaderboard position
}

export interface FreelancerProfile extends UserProfile {} // Deprecated, use UserProfile

import { UserWellness, FocusSession, TeamWellness } from "./wellness";

export type FreelancerCategory =
  | "Developer"
  | "Designer"
  | "Writer"
  | "Virtual Assistant"
  | "Marketing Specialist"
  | "Admin/VA"
  | "Marketing"
  | "Graphic Design"
  | "Customer Support"
  | "Sales"
  | "Project Management"
  | "QA/Testing"
  | "Data Entry"
  | "Finance/Accounting"
  | "IT & Networking"
  | "Writing & Content"
  | "Data & Automation"
  | "General"
  | "Other";
export type PaymentMethod = "Hourly" | "Flat-Rate";
export type JobType = "Full-time" | "Part-time" | "Contract" | "One-time Project";
export type JobDuration = "1-2 weeks" | "1-3 months" | "Ongoing";
export type ProjectStatus = "Active" | "Completed" | "Pending" | "In-Review" | "In Progress";
export type WorkspaceType =
  | "Code"
  | "Design"
  | "Marketing"
  | "Admin/VA"
  | "Writing"
  | "Data & Automation"
  | "General";

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
  status?: string;
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
  hirer_id?: string;
  applicantCount?: number;
  energyRequirement?: "High" | "Balanced" | "Low"; // Energy requirement of the job
  sustainabilityMatchScore?: number; // 0-100: Calculated compatibility
}

export interface VerifiedSkill {
  name: string;
  score: number; // 0-100
  lastAssessment: string; // ISO date
  isVerified: boolean;
}

export interface ProjectTask {
  id: string;
  title: string;
  status: "Todo" | "In-Progress" | "Done";
  energyCost: "Low" | "Medium" | "High";
  assigneeId?: string;
  dueDate?: string;
}

export interface Contract {
  id: string;
  projectId: string;
  status: "Active" | "Pending" | "Draft" | "Terminated";
  signedDate?: string;
  expiryDate?: string;
  terms: string;
  clauses: {
    id: string;
    title: string;
    description: string;
    aiAnalysis?: string; // AI explanation of the clause
    isAgreed: boolean;
  }[];
  paymentSchedule: "Milestone-based" | "Lump-sum" | "Monthly";
  budget: number;
  currency: string;
  legalJurisdiction?: string;
  lastAuditAt?: string; // AI Audit timestamp
}

export interface Project {
  id: string;
  title: string;
  client: string;
  clientId?: string;
  status: ProjectStatus;
  hoursLogged: number;
  budget: string;
  progress: number;
  workspaceType: WorkspaceType;
  meetingMinutes?: string[];
  githubRepo?: string;
  figmaFile?: string;
  projectLink?: string;
  milestones?: Milestone[];
  tasks?: ProjectTask[];
  contractId?: string; // Link to Contract
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
  avatar_url?: string;
  companyName?: string;
  activeProjects?: Project[];
  squad?: Squad;
  workflows?: any[];
  aiInsights?: AIAnalysis;
  ranking?: number; // Leaderboard position
  portfolio?: PortfolioItem[];
  wellness?: UserWellness;
}

export interface PortfolioItem {
  id: string;
  profile_id: string;
  title: string;
  description: string;
  image_url?: string;
  project_url?: string;
  technologies: string[];
  completed_date?: string;
  created_at: string;
}

export interface Conversation {
  id: string;
  participant_1: string;
  participant_2: string;
  created_at: string;
  updated_at: string;
  last_message?: Message;
  other_participant?: UserProfile;
}

export interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  content: string;
  is_read: boolean;
  created_at: string;
  attachment_url?: string;
  attachment_name?: string;
  attachment_type?: string;
  offer_data?: any;
}

export interface FreelancerProfile extends UserProfile {} // Deprecated, use UserProfile

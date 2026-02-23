export type PaymentMethod = "Hourly" | "Flat-Rate";
export type JobType = "Full-time" | "Part-time" | "Contract" | "One-time Project";
export type JobDuration = "1-2 weeks" | "1-3 months" | "Ongoing";
export type ProjectStatus = "Active" | "Completed" | "Pending";

export interface Milestone {
  id: string;
  title: string;
  dueDate: string;
  amount: number;
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
}

export interface FreelancerProfile {
  name: string;
  skills: string[];
  verifiedSkills?: VerifiedSkill[];
  hourlyRate: string;
  bio: string;
  activeProjects?: Project[];
}

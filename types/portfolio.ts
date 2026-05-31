import { PremiumProfile } from "./index";

export interface ProfileAboutSections {
  whoIHelp: string;
  whatISpecializeIn: string;
  resultsIHaveDelivered: string;
  howIWork: string;
}

export interface ServiceOffering {
  serviceName: string;
  startingPrice: number;
  currency: string;
  typicalTurnaround: string;
}

export interface PortfolioProject {
  id: string;
  title: string;
  description: string;
  image_url: string;
  project_url?: string;
  github_url?: string;
  technologies: string[];
}

export interface PortfolioSkill {
  id: string;
  name: string;
  level?: string;
  category?: string;
}

export interface PortfolioLink {
  id: string;
  label: string;
  url: string;
  icon?: string;
}

export interface ClientReview {
  id: string;
  clientName: string;
  projectTitle: string;
  rating: number;
  comment: string;
  date?: string;
}

export interface Portfolio {
  id: string;
  profile_id: string;
  about_me: string;
  tagline: string;
  custom_domain?: string;
  projects: PortfolioProject[];
  skills: PortfolioSkill[];
  links: PortfolioLink[];
  theme_settings: {
    aesthetic: 'minimalist' | 'modern' | 'classic' | 'professional';
    primaryColor: string;
    premiumProfile?: PremiumProfile;
  };
}

export interface FreelancerProfile {
  id: string;
  name: string;
  role: string;
  avatar_url?: string;
  bio?: string;
  skills?: string[];
  aboutSections?: ProfileAboutSections;
  servicesOffered?: ServiceOffering[];
  clientReviews?: ClientReview[];
  hourlyRate?: string;
  category?: string;
  contactEmail?: string;
  contactPhone?: string;
  resumeUrl?: string;
  premiumProfile?: PremiumProfile;
  portfolio?: Portfolio;
}

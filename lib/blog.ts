export type BlogCategory =
  | "Employer Hiring Guides"
  | "Remote Jobs for Filipinos"
  | "Virtual Assistant Guides"
  | "Freelancer Career Tips";

export type BlogPost = {
  title: string;
  excerpt: string;
  href: string;
  category: BlogCategory;
  readTime: string;
  keyword: string;
};

export const blogPosts: BlogPost[] = [
  {
    title: "How to Hire Online Filipino Talent",
    excerpt:
      "A practical hiring guide for employers who want to compare Filipino freelancers, review profiles, and start remote work with clearer expectations.",
    href: "/how-to-hire-online-filipino-talent-safely",
    category: "Employer Hiring Guides",
    readTime: "6 min read",
    keyword: "hire online Filipino talent",
  },
  {
    title: "Hire Filipino Freelancers for Remote Work",
    excerpt:
      "Learn what to check before hiring Filipino freelancers for virtual assistance, development, design, support, writing, and operations work.",
    href: "/hire-filipino-freelancers",
    category: "Employer Hiring Guides",
    readTime: "7 min read",
    keyword: "hire Filipino freelancers",
  },
  {
    title: "Remote Jobs for Filipinos",
    excerpt:
      "A search-friendly guide for Filipino professionals looking for online jobs, remote work categories, and better public profile visibility.",
    href: "/remote-jobs-philippines",
    category: "Remote Jobs for Filipinos",
    readTime: "5 min read",
    keyword: "remote jobs for Filipinos",
  },
  {
    title: "Top Remote Jobs for Filipinos in 2026",
    excerpt:
      "Compare high-demand remote roles for Filipino talent, from virtual assistance and customer support to web development and ecommerce support.",
    href: "/top-remote-jobs-for-filipinos-2026",
    category: "Remote Jobs for Filipinos",
    readTime: "6 min read",
    keyword: "top remote jobs for Filipinos",
  },
  {
    title: "Virtual Assistant Philippines Hiring Guide",
    excerpt:
      "Understand what Filipino virtual assistants can handle, what employers should review, and how to set scope and communication expectations.",
    href: "/virtual-assistant-philippines",
    category: "Virtual Assistant Guides",
    readTime: "6 min read",
    keyword: "virtual assistant Philippines",
  },
  {
    title: "Virtual Assistant Rates in the Philippines",
    excerpt:
      "Learn what affects VA rates, how to compare value beyond hourly price, and how to set realistic hiring budgets.",
    href: "/virtual-assistant-rates-philippines",
    category: "Virtual Assistant Guides",
    readTime: "5 min read",
    keyword: "virtual assistant rates Philippines",
  },
  {
    title: "Best Freelance Niche in the Philippines",
    excerpt:
      "A guide for Filipino freelancers choosing profitable niches in virtual assistance, support, design, development, writing, ecommerce, and automation.",
    href: "/best-freelance-niche-philippines",
    category: "Freelancer Career Tips",
    readTime: "6 min read",
    keyword: "best freelance niche Philippines",
  },
  {
    title: "Flexible Remote Jobs for Filipino Students",
    excerpt:
      "Explore beginner-friendly online work options for Filipino students and how to present availability, skills, and sample work professionally.",
    href: "/flexible-remote-jobs-for-filipino-students",
    category: "Freelancer Career Tips",
    readTime: "5 min read",
    keyword: "flexible remote jobs for Filipino students",
  },
];

export const blogCategories: BlogCategory[] = [
  "Employer Hiring Guides",
  "Remote Jobs for Filipinos",
  "Virtual Assistant Guides",
  "Freelancer Career Tips",
];

export const featuredBlogPosts = blogPosts.slice(0, 3);

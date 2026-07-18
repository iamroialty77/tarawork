export type BlogCategory =
  | "Employer Hiring Guides"
  | "Remote Jobs for Filipinos"
  | "Virtual Assistant Guides"
  | "Freelancer Career Tips";

export type BlogPost = {
  title: string;
  excerpt: string;
  slug: string;
  href: string;
  sourceHref: string;
  image: string;
  imageAlt: string;
  category: BlogCategory;
  readTime: string;
  keyword: string;
  publishedAt?: string;
  content: {
    heading: string;
    body: string;
    format?: "html";
  }[];
};

export const blogPosts: BlogPost[] = [
  {
    title: "How to Hire Online Filipino Talent",
    excerpt:
      "A practical hiring guide for employers who want to compare Filipino freelancers, review profiles, and start remote work with clearer expectations.",
    slug: "how-to-hire-online-filipino-talent",
    href: "/blog/how-to-hire-online-filipino-talent",
    sourceHref: "/how-to-hire-online-filipino-talent-safely",
    image: "/landing/filipino-collaboration.png",
    imageAlt: "Filipino professionals discussing remote hiring requirements",
    category: "Employer Hiring Guides",
    readTime: "6 min read",
    keyword: "hire online Filipino talent",
    content: [
      {
        heading: "Start with a specific hiring brief",
        body: "A strong hiring process begins with a clear role, budget, expected hours, tools, communication rhythm, and success criteria. This helps Filipino freelancers understand the work before they apply or accept an interview.",
      },
      {
        heading: "Compare proof, not only price",
        body: "Review portfolio samples, service descriptions, previous roles, tool experience, and client-facing communication. A lower rate is not always better if the freelancer needs more training or unclear supervision.",
      },
      {
        heading: "Use TaraWork to reduce friction",
        body: "Employers can use TaraWork profiles and shortlist requests to organize hiring context before sending invitations. This creates a cleaner path from role requirements to qualified Filipino remote talent.",
      },
    ],
  },
  {
    title: "Hire Filipino Freelancers for Remote Work",
    excerpt:
      "Learn what to check before hiring Filipino freelancers for virtual assistance, development, design, support, writing, and operations work.",
    slug: "hire-filipino-freelancers-for-remote-work",
    href: "/blog/hire-filipino-freelancers-for-remote-work",
    sourceHref: "/hire-filipino-freelancers",
    image: "/landing/filipino-hero.png",
    imageAlt: "Filipino freelancers collaborating online",
    category: "Employer Hiring Guides",
    readTime: "7 min read",
    keyword: "hire Filipino freelancers",
    content: [
      {
        heading: "Why Filipino freelancers are hired for remote work",
        body: "Many employers look for Filipino freelancers because of communication strength, service experience, adaptability, and familiarity with remote collaboration. Common roles include virtual assistance, customer support, design, development, writing, ecommerce, and operations.",
      },
      {
        heading: "What to check before hiring",
        body: "Review the freelancer's niche, rate expectations, portfolio, tools, work style, and availability. A professional profile should make it easy to understand where the freelancer fits and what type of work they can own.",
      },
      {
        heading: "Move from browsing to shortlist",
        body: "Instead of asking every candidate the same basic questions, use the profile details to build a shortlist first. Then interviews can focus on fit, workflow, expectations, and next steps.",
      },
    ],
  },
  {
    title: "Remote Jobs for Filipinos",
    excerpt:
      "A search-friendly guide for Filipino professionals looking for online jobs, remote work categories, and better public profile visibility.",
    slug: "remote-jobs-for-filipinos",
    href: "/blog/remote-jobs-for-filipinos",
    sourceHref: "/remote-jobs-philippines",
    image: "/landing/filipino-remote-work.png",
    imageAlt: "Filipino remote worker using a laptop",
    category: "Remote Jobs for Filipinos",
    readTime: "5 min read",
    keyword: "remote jobs for Filipinos",
    content: [
      {
        heading: "Remote jobs Filipino professionals can target",
        body: "Popular remote work categories include virtual assistance, customer support, content writing, web development, social media, design, data entry, ecommerce support, bookkeeping, and project coordination.",
      },
      {
        heading: "How to improve visibility",
        body: "Freelancers should build a profile with a clear headline, skill category, services, sample work, tools, rate expectations, and a short explanation of the client problems they solve.",
      },
      {
        heading: "Why public profiles matter",
        body: "A public profile helps employers review your experience before starting a conversation. It also gives search engines better context around your skills, services, and role category.",
      },
    ],
  },
  {
    title: "Top Remote Jobs for Filipinos in 2026",
    excerpt:
      "Compare high-demand remote roles for Filipino talent, from virtual assistance and customer support to web development and ecommerce support.",
    slug: "top-remote-jobs-for-filipinos-2026",
    href: "/blog/top-remote-jobs-for-filipinos-2026",
    sourceHref: "/top-remote-jobs-for-filipinos-2026",
    image: "/landing/filipino-remote-work.png",
    imageAlt: "Filipino online professional working remotely",
    category: "Remote Jobs for Filipinos",
    readTime: "6 min read",
    keyword: "top remote jobs for Filipinos",
    content: [
      {
        heading: "High-demand remote roles",
        body: "Virtual assistants, customer support specialists, web developers, social media managers, designers, writers, ecommerce assistants, bookkeepers, and data entry specialists remain practical remote job paths for Filipino professionals.",
      },
      {
        heading: "Choose a role based on proof",
        body: "The best role is the one where you can show proof: sample work, tool familiarity, previous projects, or a clear service offer. Employers need confidence that you can handle the role without guessing.",
      },
      {
        heading: "Build a profile around one primary offer",
        body: "A focused service offer is easier to remember than a generic freelancer profile. Start with one strong category, then add supporting skills and examples.",
      },
    ],
  },
  {
    title: "Virtual Assistant Philippines Hiring Guide",
    excerpt:
      "Understand what Filipino virtual assistants can handle, what employers should review, and how to set scope and communication expectations.",
    slug: "virtual-assistant-philippines-hiring-guide",
    href: "/blog/virtual-assistant-philippines-hiring-guide",
    sourceHref: "/virtual-assistant-philippines",
    image: "/landing/filipino-collaboration.png",
    imageAlt: "Filipino virtual assistant supporting remote business work",
    category: "Virtual Assistant Guides",
    readTime: "6 min read",
    keyword: "virtual assistant Philippines",
    content: [
      {
        heading: "What Filipino virtual assistants can support",
        body: "Virtual assistants can help with admin work, inbox management, scheduling, customer support, ecommerce tasks, research, lead generation, social media coordination, and daily operations.",
      },
      {
        heading: "Set the scope before hiring",
        body: "Employers should define tools, weekly hours, communication expectations, task priority, reporting cadence, and success measures. This helps the assistant work independently and reduces confusion.",
      },
      {
        heading: "Review fit beyond availability",
        body: "Availability matters, but so do communication style, reliability, relevant tools, past work, and ability to organize recurring tasks.",
      },
    ],
  },
  {
    title: "Virtual Assistant Rates in the Philippines",
    excerpt:
      "Learn what affects VA rates, how to compare value beyond hourly price, and how to set realistic hiring budgets.",
    slug: "virtual-assistant-rates-philippines",
    href: "/blog/virtual-assistant-rates-philippines",
    sourceHref: "/virtual-assistant-rates-philippines",
    image: "/landing/filipino-remote-work.png",
    imageAlt: "Filipino virtual assistant reviewing online work",
    category: "Virtual Assistant Guides",
    readTime: "5 min read",
    keyword: "virtual assistant rates Philippines",
    content: [
      {
        heading: "What affects VA rates",
        body: "Virtual assistant rates depend on task complexity, experience, tools, schedule, industry knowledge, and whether the work is general admin or specialist support.",
      },
      {
        heading: "Compare value, not only hourly price",
        body: "A slightly higher rate can be more cost-effective if the assistant communicates clearly, needs less training, documents work, and completes tasks reliably.",
      },
      {
        heading: "Use rate clarity in profiles and job posts",
        body: "Clear rate expectations help both employers and freelancers avoid mismatched conversations. TaraWork profiles and job posts can show rate context alongside skills and services.",
      },
    ],
  },
  {
    title: "Best Freelance Niche in the Philippines",
    excerpt:
      "A guide for Filipino freelancers choosing profitable niches in virtual assistance, support, design, development, writing, ecommerce, and automation.",
    slug: "best-freelance-niche-philippines",
    href: "/blog/best-freelance-niche-philippines",
    sourceHref: "/best-freelance-niche-philippines",
    image: "/landing/filipino-hero.png",
    imageAlt: "Filipino freelancer planning a remote work niche",
    category: "Freelancer Career Tips",
    readTime: "6 min read",
    keyword: "best freelance niche Philippines",
    content: [
      {
        heading: "Popular niches in the Philippines",
        body: "Strong freelance niches include virtual assistance, customer support, social media, design, web development, writing, bookkeeping, ecommerce operations, appointment setting, video editing, and automation.",
      },
      {
        heading: "Choose a niche you can prove",
        body: "A profitable niche should match your skills, portfolio, communication strength, and market demand. The clearer your offer, the easier it is for clients to understand why they should hire you.",
      },
      {
        heading: "Test your niche with a public profile",
        body: "Use a focused profile headline, service package, sample work, tools, and rate expectations. A specific offer usually performs better than a broad profile that tries to cover everything.",
      },
    ],
  },
  {
    title: "Flexible Remote Jobs for Filipino Students",
    excerpt:
      "Explore beginner-friendly online work options for Filipino students and how to present availability, skills, and sample work professionally.",
    slug: "flexible-remote-jobs-for-filipino-students",
    href: "/blog/flexible-remote-jobs-for-filipino-students",
    sourceHref: "/flexible-remote-jobs-for-filipino-students",
    image: "/landing/filipino-remote-work.png",
    imageAlt: "Filipino student working online from a laptop",
    category: "Freelancer Career Tips",
    readTime: "5 min read",
    keyword: "flexible remote jobs for Filipino students",
    content: [
      {
        heading: "Beginner-friendly remote work options",
        body: "Students can start with data entry, research, basic admin support, content assistance, social media scheduling, chat support, simple design tasks, and ecommerce listing support.",
      },
      {
        heading: "Be clear about availability",
        body: "Student freelancers should communicate class schedules, weekly capacity, deadlines, and task limits. Predictable communication is more professional than overpromising.",
      },
      {
        heading: "Build sample work early",
        body: "Even without long experience, students can show sample spreadsheets, captions, designs, research summaries, or small project examples to help clients judge fit.",
      },
    ],
  },
];

export const blogCategories: BlogCategory[] = [
  "Employer Hiring Guides",
  "Remote Jobs for Filipinos",
  "Virtual Assistant Guides",
  "Freelancer Career Tips",
];

export const featuredBlogPosts = blogPosts.slice(0, 3);

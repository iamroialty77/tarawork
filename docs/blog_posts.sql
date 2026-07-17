-- TaraWork admin-managed blog posts
-- Run this in Supabase SQL Editor so admins can create posts from the app.

CREATE TABLE IF NOT EXISTS public.blog_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  excerpt TEXT NOT NULL,
  category TEXT NOT NULL,
  image_url TEXT NOT NULL DEFAULT '/landing/filipino-hero.png',
  image_alt TEXT,
  keyword TEXT,
  read_time TEXT NOT NULL DEFAULT '5 min read',
  content JSONB NOT NULL DEFAULT '[]'::jsonb,
  status TEXT NOT NULL DEFAULT 'draft',
  published_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  author_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Published blog posts are public." ON public.blog_posts;
CREATE POLICY "Published blog posts are public." ON public.blog_posts
  FOR SELECT USING (
    status = 'published'
    AND published_at <= timezone('utc'::text, now())
  );

DROP POLICY IF EXISTS "Admins can manage blog posts." ON public.blog_posts;
CREATE POLICY "Admins can manage blog posts." ON public.blog_posts
  FOR ALL
  USING (
    EXISTS (
      SELECT 1
      FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1
      FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

CREATE INDEX IF NOT EXISTS blog_posts_status_published_at_idx
  ON public.blog_posts (status, published_at DESC);

CREATE INDEX IF NOT EXISTS blog_posts_category_published_at_idx
  ON public.blog_posts (category, published_at DESC);

-- Optional seed posts. Safe to run more than once.
INSERT INTO public.blog_posts (
  title,
  slug,
  excerpt,
  category,
  image_url,
  image_alt,
  keyword,
  read_time,
  content,
  status,
  published_at
) VALUES
(
  'How to Hire Online Filipino Talent',
  'how-to-hire-online-filipino-talent',
  'A practical hiring guide for employers who want to compare Filipino freelancers, review profiles, and start remote work with clearer expectations.',
  'Employer Hiring Guides',
  '/landing/filipino-collaboration.png',
  'Filipino professionals discussing remote hiring requirements',
  'hire online Filipino talent',
  '6 min read',
  $json$
  [
    {
      "heading": "Start with a specific hiring brief",
      "body": "A strong hiring process begins with a clear role, budget, expected hours, tools, communication rhythm, and success criteria. This helps **Filipino freelancers** understand the work before they apply or accept an interview.\n\n### Define the role before reviewing profiles\nBefore posting a role, write down the main output you expect, the tools required, the working schedule, and the approval process. For remote arrangements in the Philippines, it also helps to understand the country context around flexible work through the [Telecommuting Act](https://lawphil.net/statutes/repacts/ra2018/ra_11165_2018.html)."
    },
    {
      "heading": "Compare proof, not only price",
      "body": "Review portfolio samples, service descriptions, previous roles, tool experience, and client-facing communication. **A lower rate is not always better** if the freelancer needs more training, unclear supervision, or repeated revisions.\n\n### Look for signals of professional fit\nStrong candidates usually explain what they can own, how they communicate progress, and what type of clients or projects they handle best. This makes it easier to compare talent fairly instead of choosing based only on rate."
    },
    {
      "heading": "Use TaraWork to reduce friction",
      "body": "Employers can use TaraWork profiles and shortlist requests to organize hiring context before sending invitations. This creates a cleaner path from role requirements to qualified **Filipino remote talent**.\n\n### Move from browsing to shortlist\nShortlisting works best when every candidate is measured against the same role requirements: skills, availability, communication, budget, and sample work."
    }
  ]
  $json$::jsonb,
  'published',
  timezone('utc'::text, now()) - interval '4 days'
),
(
  'Remote Jobs for Filipinos',
  'remote-jobs-for-filipinos',
  'A focused guide for Filipino professionals looking for remote work opportunities, stronger profiles, and clearer application positioning.',
  'Remote Jobs for Filipinos',
  '/landing/filipino-remote-work.png',
  'Filipino professional working remotely from a laptop',
  'remote jobs for Filipinos',
  '5 min read',
  $json$
  [
    {
      "heading": "Choose roles that match your current strengths",
      "body": "Remote work becomes easier to pursue when your profile is focused. Instead of applying to every opening, identify roles where your experience already matches the expected output, tools, and communication style.\n\n### Common remote roles for Filipino professionals\nMany Filipino applicants pursue virtual assistance, customer support, social media management, design, writing, ecommerce operations, web development, and project coordination. The [DICT](https://dict.gov.ph/) also continues to support digital development efforts across the Philippines."
    },
    {
      "heading": "Make your profile easy to evaluate",
      "body": "A strong freelancer profile should quickly answer three questions: **what you do**, **who you help**, and **what proof you can show**. Employers usually scan profiles fast, so your headline, services, portfolio, and rate should be clear.\n\n### Keep the first screen useful\nPlace your strongest niche, tools, sample work, and availability near the top of the profile. Avoid vague descriptions that make employers guess what kind of work you can handle."
    },
    {
      "heading": "Apply with context, not generic messages",
      "body": "A short, specific application can perform better than a long generic one. Mention the role requirement, connect it to your experience, and explain what you can deliver first.\n\n### Be direct about availability\nRemote teams value reliability. If you have timezone limits, preferred hours, or current workload, state it clearly so expectations are aligned before the interview."
    }
  ]
  $json$::jsonb,
  'published',
  timezone('utc'::text, now()) - interval '3 days'
),
(
  'Virtual Assistant Philippines Hiring Guide',
  'virtual-assistant-philippines-hiring-guide',
  'A professional guide for employers hiring virtual assistants in the Philippines for admin, customer support, operations, and online business tasks.',
  'Virtual Assistant Guides',
  '/landing/filipino-hero.png',
  'Filipino virtual assistant working with online business tools',
  'virtual assistant Philippines',
  '7 min read',
  $json$
  [
    {
      "heading": "Clarify the assistant role before hiring",
      "body": "The title **virtual assistant** can mean many things. Some assistants focus on admin support, while others handle customer service, ecommerce operations, social media, lead research, inbox management, or reporting.\n\n### Separate daily tasks from project tasks\nDaily tasks need consistency and process discipline. Project tasks need judgment, ownership, and clearer deliverables. Defining both helps you hire the right assistant for the workload."
    },
    {
      "heading": "Create a realistic scope and rate range",
      "body": "A professional hiring brief should include expected hours, core tools, communication channels, training requirements, and rate range. If you need someone to handle sensitive business information, include your access and approval process.\n\n### Consider compliance and work setup\nFor formal remote work arrangements, employers can review Philippine telecommuting references such as [Republic Act No. 11165](https://lawphil.net/statutes/repacts/ra2018/ra_11165_2018.html) and related labor guidance from official sources."
    },
    {
      "heading": "Evaluate communication and ownership",
      "body": "The best virtual assistants do more than complete assigned tasks. They clarify priorities, flag blockers, document repeatable processes, and communicate progress. **Clear communication is often the strongest hiring signal** for remote support roles."
    }
  ]
  $json$::jsonb,
  'published',
  timezone('utc'::text, now()) - interval '2 days'
),
(
  'Best Freelance Niche in the Philippines',
  'best-freelance-niche-philippines',
  'A practical guide for Filipino freelancers choosing a niche based on skills, demand, proof of work, and long-term positioning.',
  'Freelancer Career Tips',
  '/landing/filipino-collaboration.png',
  'Filipino freelancers planning their service niche',
  'best freelance niche Philippines',
  '6 min read',
  $json$
  [
    {
      "heading": "Pick a niche that connects skill and demand",
      "body": "The best freelance niche is not always the trendiest option. It is the area where your current skills, proof of work, market demand, and preferred work style overlap.\n\n### Start with work you can prove\nIf you can show samples, results, tools used, or completed projects, your profile becomes easier to trust. **Proof makes your niche more credible** than a long list of unrelated skills."
    },
    {
      "heading": "Avoid positioning that is too broad",
      "body": "General profiles can be hard to remember. Instead of saying you can do everything, focus on a specific buyer and problem. For example, a freelancer can position around ecommerce support, short-form video editing, bookkeeping assistance, WordPress maintenance, or customer support operations.\n\n### Make the offer clear\nA clear offer tells employers what they can hire you for, what result to expect, and what kind of workflow you can support."
    },
    {
      "heading": "Build trust with professional details",
      "body": "Freelancers in the Philippines may also need to understand business registration and tax obligations depending on how they operate. Official government sites such as [DTI](https://www.dti.gov.ph/) and [BIR](https://www.bir.gov.ph/) are useful starting points for checking current requirements.\n\n### Keep improving your profile\nAs you complete more work, update your profile with better samples, clearer rates, stronger descriptions, and more specific service packages."
    }
  ]
  $json$::jsonb,
  'published',
  timezone('utc'::text, now()) - interval '1 day'
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  excerpt = EXCLUDED.excerpt,
  category = EXCLUDED.category,
  image_url = EXCLUDED.image_url,
  image_alt = EXCLUDED.image_alt,
  keyword = EXCLUDED.keyword,
  read_time = EXCLUDED.read_time,
  content = EXCLUDED.content,
  status = EXCLUDED.status,
  published_at = EXCLUDED.published_at,
  updated_at = timezone('utc'::text, now());

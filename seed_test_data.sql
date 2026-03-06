-- TARA MARKETPLACE - TEST DATA SEED SCRIPT
-- Copy and run this script in your Supabase SQL Editor (https://supabase.com/dashboard/project/_/sql)

-- 1. Ensure 'username' column exists (Fallback)
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS username TEXT UNIQUE;

-- 2. Update Reggie Ambrocio's profile with a professional username
-- This will fix the 404 for tarawork.online/reggieambrocio1993
UPDATE public.profiles 
SET username = 'reggieambrocio1993', 
    name = 'Reggie Ambrocio', 
    bio = 'Senior Fullstack Developer & Platform Architect specializing in Next.js, Go, and Enterprise systems.'
WHERE id = '2e0bbc94-84f4-47b8-a403-8841c4a00414';

-- 3. Create Portfolios for existing users
-- REGGIE AMBROCIO (ID: 2e0bbc94-84f4-47b8-a403-8841c4a00414)
INSERT INTO public.portfolios (profile_id, about_me, tagline, theme_settings, is_public)
VALUES (
    '2e0bbc94-84f4-47b8-a403-8841c4a00414',
    'I build scalable digital solutions for the modern web. With over a decade of experience in software architecture, I focus on performance, security, and developer productivity. Leading the technical vision at TaraWork.',
    'Senior Fullstack Developer | Platform Architect | Go & Next.js Expert',
    '{"aesthetic": "professional", "primaryColor": "#007bff"}',
    true
) ON CONFLICT (profile_id) DO UPDATE 
SET about_me = EXCLUDED.about_me, tagline = EXCLUDED.tagline, theme_settings = EXCLUDED.theme_settings;

-- ALLEN LARA (ID: 39fd5f8c-362a-4ad5-957a-e6f4e607a7e2)
INSERT INTO public.portfolios (profile_id, about_me, tagline, theme_settings, is_public)
VALUES (
    '39fd5f8c-362a-4ad5-957a-e6f4e607a7e2',
    'Creative Frontend Developer with a passion for building beautiful and intuitive user interfaces. Specializing in React and Tailwind CSS.',
    'Frontend Specialist | UI/UX Enthusiast',
    '{"aesthetic": "minimalist", "primaryColor": "#10b981"}',
    true
) ON CONFLICT (profile_id) DO UPDATE 
SET about_me = EXCLUDED.about_me, tagline = EXCLUDED.tagline, theme_settings = EXCLUDED.theme_settings;

-- 4. Create Projects (Migration from old portfolio_items where possible)
-- Using a temporary CTE to migrate Reggie's projects
DO $$
DECLARE
    reg_portfolio_id UUID;
    all_portfolio_id UUID;
BEGIN
    SELECT id INTO reg_portfolio_id FROM public.portfolios WHERE profile_id = '2e0bbc94-84f4-47b8-a403-8841c4a00414';
    SELECT id INTO all_portfolio_id FROM public.portfolios WHERE profile_id = '39fd5f8c-362a-4ad5-957a-e6f4e607a7e2';

    -- Reggie's Projects (Migrate from old table)
    INSERT INTO public.portfolio_projects (portfolio_id, title, description, project_url, technologies)
    SELECT reg_portfolio_id, title, description, project_url, technologies
    FROM public.portfolio_items
    WHERE profile_id = '2e0bbc94-84f4-47b8-a403-8841c4a00414'
    AND NOT EXISTS (SELECT 1 FROM public.portfolio_projects WHERE portfolio_id = reg_portfolio_id AND title = portfolio_items.title);

    -- Allen's Projects (New Sample Data)
    INSERT INTO public.portfolio_projects (portfolio_id, title, description, project_url, technologies)
    VALUES 
    (all_portfolio_id, 'Modern Dashboard', 'A clean and responsive admin dashboard with real-time analytics.', 'https://github.com/example/dashboard', ARRAY['React', 'Tailwind', 'Recharts']),
    (all_portfolio_id, 'E-commerce UI', 'Mobile-first e-commerce frontend with focus on performance.', 'https://github.com/example/ui', ARRAY['Next.js', 'Framer Motion']);
END $$;

-- 5. Add Skills
DO $$
DECLARE
    reg_portfolio_id UUID;
    all_portfolio_id UUID;
BEGIN
    SELECT id INTO reg_portfolio_id FROM public.portfolios WHERE profile_id = '2e0bbc94-84f4-47b8-a403-8841c4a00414';
    SELECT id INTO all_portfolio_id FROM public.portfolios WHERE profile_id = '39fd5f8c-362a-4ad5-957a-e6f4e607a7e2';

    -- Reggie's Skills
    INSERT INTO public.portfolio_skills (portfolio_id, name, level, category)
    VALUES 
    (reg_portfolio_id, 'Go (Golang)', 'Expert', 'Backend'),
    (reg_portfolio_id, 'Next.js', 'Expert', 'Frontend'),
    (reg_portfolio_id, 'PostgreSQL', 'Expert', 'Database'),
    (reg_portfolio_id, 'Docker & K8s', 'Advanced', 'DevOps'),
    (reg_portfolio_id, 'Supabase', 'Expert', 'Backend')
    ON CONFLICT DO NOTHING;

    -- Allen's Skills
    INSERT INTO public.portfolio_skills (portfolio_id, name, level, category)
    VALUES 
    (all_portfolio_id, 'React', 'Expert', 'Frontend'),
    (all_portfolio_id, 'TypeScript', 'Advanced', 'Frontend'),
    (all_portfolio_id, 'Tailwind CSS', 'Expert', 'Design'),
    (all_portfolio_id, 'Figma', 'Intermediate', 'Design')
    ON CONFLICT DO NOTHING;
END $$;

-- 6. Add Social Links
DO $$
DECLARE
    reg_portfolio_id UUID;
    all_portfolio_id UUID;
BEGIN
    SELECT id INTO reg_portfolio_id FROM public.portfolios WHERE profile_id = '2e0bbc94-84f4-47b8-a403-8841c4a00414';
    SELECT id INTO all_portfolio_id FROM public.portfolios WHERE profile_id = '39fd5f8c-362a-4ad5-957a-e6f4e607a7e2';

    -- Reggie's Links
    INSERT INTO public.portfolio_links (portfolio_id, label, url, icon)
    VALUES 
    (reg_portfolio_id, 'GitHub', 'https://github.com/reggie', 'Github'),
    (reg_portfolio_id, 'LinkedIn', 'https://linkedin.com/in/reggie', 'Linkedin'),
    (reg_portfolio_id, 'Portfolio', 'https://www.tarawork.online/reggieambrocio1993', 'ExternalLink')
    ON CONFLICT DO NOTHING;

    -- Allen's Links
    INSERT INTO public.portfolio_links (portfolio_id, label, url, icon)
    VALUES 
    (all_portfolio_id, 'GitHub', 'https://github.com/allen', 'Github'),
    (all_portfolio_id, 'Twitter', 'https://twitter.com/allen', 'Twitter')
    ON CONFLICT DO NOTHING;
END $$;

-- 7. Add sample jobs (if needed)
INSERT INTO public.jobs (id, title, description, hirer_id, category, rate, budget, status)
VALUES 
('job-001', 'Experienced Go Developer', 'Looking for someone to help with microservices architecture.', '11272cc5-378f-4db1-b52d-ba41a53a1aee', 'Developer', '$50/hr', 5000, 'live'),
('job-002', 'Product UI Designer', 'Designing a new marketplace mobile app.', '11272cc5-378f-4db1-b52d-ba41a53a1aee', 'Designer', 'Flat-rate', 1500, 'live')
ON CONFLICT (id) DO NOTHING;

-- 8. Add sample inquiries (to test the Hire Me flow)
INSERT INTO public.portfolio_inquiries (freelancer_id, sender_name, sender_email, message)
VALUES 
('2e0bbc94-84f4-47b8-a403-8841c4a00414', 'John Smith', 'john@example.com', 'I saw your portfolio and would love to discuss a potential project for my startup.'),
('2e0bbc94-84f4-47b8-a403-8841c4a00414', 'Sarah Miller', 'sarah@design.co', 'Are you available for freelance work next month?')
ON CONFLICT DO NOTHING;

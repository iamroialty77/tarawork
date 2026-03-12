-- TARA MARKETPLACE - SUPABASE DATABASE SCHEMA
-- Copy and run this script in your Supabase SQL Editor (https://supabase.com/dashboard/project/_/sql)

-- 1. Create PROFILES table
-- This table stores user profile information for both freelancers and employers.
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL PRIMARY KEY,
    name TEXT,
    role TEXT DEFAULT 'freelancer',
    category TEXT DEFAULT 'General',
    skills TEXT[] DEFAULT '{}',
    "hourlyRate" TEXT DEFAULT '$0',
    bio TEXT,
    avatar_url TEXT,
    "companyName" TEXT,
    "verifiedSkills" JSONB DEFAULT '[]',
    "softSkills" JSONB DEFAULT '[]',
    "activeProjects" JSONB DEFAULT '[]',
    squad JSONB,
    workflows JSONB DEFAULT '[]',
    "aiInsights" JSONB,
    ranking INTEGER,
    status TEXT DEFAULT 'pending', -- pending, approved, suspended
    "verification_documents" JSONB DEFAULT '[]', -- { type, url, name }
    wellness JSONB DEFAULT '{"weeklyCapacity": 40, "currentWorkload": 0, "energyRating": "Balanced", "focusHours": 0, "burnoutRiskScore": 0, "workToRestRatio": 0, "consecutiveHighLoadDays": 0, "sustainabilityIndex": 85, "energyEfficiency": 0, "verifiedSustainable": false}',
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 1.1 Create PROJECT_TASKS table
CREATE TABLE IF NOT EXISTS public.project_tasks (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    project_id TEXT NOT NULL,
    title TEXT NOT NULL,
    status TEXT DEFAULT 'Todo', -- Todo, In-Progress, Done
    energy_cost TEXT DEFAULT 'Medium', -- Low, Medium, High
    assignee_id UUID REFERENCES public.profiles(id),
    due_date TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Enable RLS for PROJECT_TASKS
ALTER TABLE public.project_tasks ENABLE ROW LEVEL SECURITY;

-- Policies for PROJECT_TASKS
DROP POLICY IF EXISTS "Users can view tasks for their projects." ON public.project_tasks;
CREATE POLICY "Users can view tasks for their projects." ON public.project_tasks
    FOR SELECT USING (true); -- Simplified for demo

DROP POLICY IF EXISTS "Users can manage tasks for their projects." ON public.project_tasks;
CREATE POLICY "Users can manage tasks for their projects." ON public.project_tasks
    FOR ALL USING (true);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Policies for PROFILES
-- Anyone can view profiles (to see freelancer/client details)
DROP POLICY IF EXISTS "Public profiles are viewable by everyone." ON public.profiles;
CREATE POLICY "Public profiles are viewable by everyone." ON public.profiles
    FOR SELECT USING (true);

-- Only the owner can insert their own profile
DROP POLICY IF EXISTS "Users can insert their own profile." ON public.profiles;
CREATE POLICY "Users can insert their own profile." ON public.profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

-- Only the owner can update their own profile
DROP POLICY IF EXISTS "Users can update own profile." ON public.profiles;
CREATE POLICY "Users can update own profile." ON public.profiles
    FOR UPDATE USING (auth.uid() = id);


-- 2. Create JOBS table
-- This table stores all job postings in the marketplace.
CREATE TABLE IF NOT EXISTS public.jobs (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    company TEXT,
    category TEXT,
    "paymentMethod" TEXT,
    rate TEXT,
    duration TEXT,
    skills TEXT[] DEFAULT '{}',
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    "jobType" TEXT,
    budget NUMERIC,
    milestones JSONB DEFAULT '[]',
    deadline TEXT,
    "customQuestions" JSONB DEFAULT '[]',
    employer_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    status TEXT DEFAULT 'live', -- live, closed, flagged, pending
    "energy_requirement" TEXT DEFAULT 'Balanced' -- High, Balanced, Low
);

-- Enable Row Level Security
ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;

-- Policies for JOBS
-- Anyone can view jobs
DROP POLICY IF EXISTS "Jobs are viewable by everyone." ON public.jobs;
CREATE POLICY "Jobs are viewable by everyone." ON public.jobs
    FOR SELECT USING (true);

-- Any authenticated user can post a job
DROP POLICY IF EXISTS "Authenticated users can post jobs." ON public.jobs;
CREATE POLICY "Authenticated users can post jobs." ON public.jobs
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');


-- 3. Create CONVERSATIONS table
CREATE TABLE IF NOT EXISTS public.conversations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    participant_1 UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    participant_2 UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    UNIQUE(participant_1, participant_2)
);

-- 4. Create MESSAGES table
CREATE TABLE IF NOT EXISTS public.messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id UUID REFERENCES public.conversations(id) ON DELETE CASCADE NOT NULL,
    sender_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    content TEXT NOT NULL,
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    attachment_url TEXT,
    attachment_name TEXT,
    attachment_type TEXT,
    offer_data JSONB
);

-- 5. Create PORTFOLIO_ITEMS table
CREATE TABLE IF NOT EXISTS public.portfolio_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    image_url TEXT,
    project_url TEXT,
    technologies TEXT[] DEFAULT '{}',
    completed_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 6. Create ESCROWS table
CREATE TABLE IF NOT EXISTS public.escrows (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    job_id TEXT REFERENCES public.jobs(id) ON DELETE SET NULL,
    employer_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    freelancer_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    amount NUMERIC NOT NULL,
    platform_fee NUMERIC DEFAULT 0,
    status TEXT DEFAULT 'pending', -- pending, funded, released, disputed, refunded
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 7. Create DISPUTES table
CREATE TABLE IF NOT EXISTS public.disputes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    escrow_id UUID REFERENCES public.escrows(id) ON DELETE CASCADE NOT NULL,
    raised_by UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    reason TEXT NOT NULL,
    urgency_level TEXT DEFAULT 'Medium', -- High, Medium, Low
    status TEXT DEFAULT 'open', -- open, resolved, closed
    evidence_urls JSONB DEFAULT '[]',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 8. Create ADMIN_AUDIT_LOGS table
CREATE TABLE IF NOT EXISTS public.admin_audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    admin_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    action TEXT NOT NULL,
    target_type TEXT NOT NULL, -- profile, job, escrow, dispute
    target_id TEXT NOT NULL,
    details JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 6. Storage bucket for attachments
INSERT INTO storage.buckets (id, name, public) 
VALUES ('attachments', 'attachments', true) 
ON CONFLICT (id) DO NOTHING;

-- Policy to allow authenticated users to upload
DROP POLICY IF EXISTS "Authenticated users can upload attachments" ON storage.objects;
CREATE POLICY "Authenticated users can upload attachments" 
ON storage.objects FOR INSERT 
WITH CHECK (bucket_id = 'attachments' AND auth.role() = 'authenticated');

-- Policy to allow everyone to see attachments (since public: true)
DROP POLICY IF EXISTS "Anyone can view attachments" ON storage.objects;
CREATE POLICY "Anyone can view attachments" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'attachments');

-- 7. Enable RLS for new tables
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portfolio_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.escrows ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.disputes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_audit_logs ENABLE ROW LEVEL SECURITY;

-- 8. Policies for ESCROWS
DROP POLICY IF EXISTS "Admins can view all escrows" ON public.escrows;
CREATE POLICY "Admins can view all escrows" ON public.escrows
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Policies for DISPUTES
DROP POLICY IF EXISTS "Admins can view all disputes" ON public.disputes;
CREATE POLICY "Admins can view all disputes" ON public.disputes
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Policies for ADMIN_AUDIT_LOGS
DROP POLICY IF EXISTS "Admins can view all audit logs" ON public.admin_audit_logs;
CREATE POLICY "Admins can view all audit logs" ON public.admin_audit_logs
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- IMMUTABILITY: Only allow INSERT, no UPDATE or DELETE for audit logs
DROP POLICY IF EXISTS "Admins can insert audit logs" ON public.admin_audit_logs;
CREATE POLICY "Admins can insert audit logs" ON public.admin_audit_logs
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- 8. FIX FOR MISSING COLUMNS (Run if you have existing tables)
ALTER TABLE public.messages ADD COLUMN IF NOT EXISTS attachment_url TEXT;
ALTER TABLE public.messages ADD COLUMN IF NOT EXISTS attachment_name TEXT;
ALTER TABLE public.messages ADD COLUMN IF NOT EXISTS attachment_type TEXT;
ALTER TABLE public.messages ADD COLUMN IF NOT EXISTS offer_data JSONB;
ALTER TABLE public.jobs ADD COLUMN IF NOT EXISTS "energy_requirement" TEXT DEFAULT 'Balanced';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS username TEXT UNIQUE;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS referring_freelancer_id UUID REFERENCES public.profiles(id);
ALTER TABLE public.applications ADD COLUMN IF NOT EXISTS freelancer_id UUID REFERENCES public.profiles(id);
ALTER TABLE public.portfolio_inquiries ADD COLUMN IF NOT EXISTS freelancer_id UUID REFERENCES public.profiles(id);
ALTER TABLE public.jobs ADD COLUMN IF NOT EXISTS employer_id UUID REFERENCES public.profiles(id);
ALTER TABLE public.escrows ADD COLUMN IF NOT EXISTS freelancer_id UUID REFERENCES public.profiles(id);
ALTER TABLE public.escrows ADD COLUMN IF NOT EXISTS employer_id UUID REFERENCES public.profiles(id);

-- 9. ENABLE REAL-TIME REPLICATION
-- This allows the app to show new messages instantly without reloading.
-- Make publication additions idempotent to avoid errors on repeated execution.
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_publication WHERE pubname = 'supabase_realtime') THEN
        CREATE PUBLICATION supabase_realtime;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_publication_tables WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'messages') THEN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_publication_tables WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'conversations') THEN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.conversations;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_publication_tables WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'jobs') THEN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.jobs;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_publication_tables WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'profiles') THEN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.profiles;
    END IF;
END $$;

-- 10. Create APPLICATIONS table
CREATE TABLE IF NOT EXISTS public.applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    job_id TEXT REFERENCES public.jobs(id) ON DELETE CASCADE NOT NULL,
    freelancer_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    status TEXT DEFAULT 'pending', -- pending, interviewing, hired, rejected
    cover_letter TEXT,
    resume_url TEXT,
    portfolio_url TEXT,
    interview_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    UNIQUE(job_id, freelancer_id)
);

-- Enable Row Level Security
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;

-- Policies for APPLICATIONS
-- freelancer can view their own applications
DROP POLICY IF EXISTS "Users can view their own applications" ON public.applications;
CREATE POLICY "Users can view their own applications" ON public.applications
    FOR SELECT USING (auth.uid() = freelancer_id);

-- employer can view applications for their own jobs
DROP POLICY IF EXISTS "employers can view applications for their jobs" ON public.applications;
CREATE POLICY "employers can view applications for their jobs" ON public.applications
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.jobs
            WHERE jobs.id = applications.job_id
            AND jobs.employer_id = auth.uid()
        )
    );

-- freelancer can insert their own application
DROP POLICY IF EXISTS "Users can insert their own applications" ON public.applications;
CREATE POLICY "Users can insert their own applications" ON public.applications
    FOR INSERT WITH CHECK (auth.uid() = freelancer_id);

-- Add to Realtime
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_publication_tables WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'applications') THEN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.applications;
    END IF;
END $$;

-- Table for Portfolio Inquiries (Guest Hire Me flow)
CREATE TABLE IF NOT EXISTS public.portfolio_inquiries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    freelancer_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    sender_name TEXT NOT NULL,
    sender_email TEXT NOT NULL,
    message TEXT NOT NULL,
    status TEXT DEFAULT 'pending', -- pending, responded, archived
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Enable RLS
ALTER TABLE public.portfolio_inquiries ENABLE ROW LEVEL SECURITY;

-- Policies
DROP POLICY IF EXISTS "Freelancers can view their own inquiries." ON public.portfolio_inquiries;
CREATE POLICY "Freelancers can view their own inquiries." ON public.portfolio_inquiries
    FOR SELECT USING (auth.uid() = freelancer_id);

DROP POLICY IF EXISTS "Anyone can insert an inquiry." ON public.portfolio_inquiries;
CREATE POLICY "Anyone can insert an inquiry." ON public.portfolio_inquiries
    FOR INSERT WITH CHECK (true);

-- 11. Create NOTIFICATIONS table
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    type TEXT DEFAULT 'info', -- info, success, warning, error
    is_read BOOLEAN DEFAULT false,
    link TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Enable Row Level Security
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Policies for NOTIFICATIONS
DROP POLICY IF EXISTS "Users can view their own notifications" ON public.notifications;
CREATE POLICY "Users can view their own notifications" ON public.notifications
    FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own notifications" ON public.notifications;
CREATE POLICY "Users can update their own notifications" ON public.notifications
    FOR UPDATE USING (auth.uid() = user_id);

-- 12. Create FOLLOWS table
CREATE TABLE IF NOT EXISTS public.follows (
    follower_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    following_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    PRIMARY KEY (follower_id, following_id)
);

-- Enable RLS for FOLLOWS
ALTER TABLE public.follows ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public follows are viewable by everyone." ON public.follows;
CREATE POLICY "Public follows are viewable by everyone." ON public.follows FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can follow others." ON public.follows;
CREATE POLICY "Users can follow others." ON public.follows FOR INSERT WITH CHECK (auth.uid() = follower_id);

DROP POLICY IF EXISTS "Users can unfollow others." ON public.follows;
CREATE POLICY "Users can unfollow others." ON public.follows FOR DELETE USING (auth.uid() = follower_id);

-- 13. Create TRIGGERS for Automatic Notifications

-- Trigger for NOTIFICATIONS when a new PORTFOLIO INQUIRY is created
CREATE OR REPLACE FUNCTION public.create_inquiry_notification() 
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.notifications (user_id, title, message, type, link)
    VALUES (
        NEW.freelancer_id,
        'New Portfolio Inquiry',
        NEW.sender_name || ' just inquired about hiring you via your portfolio!',
        'success',
        '/' -- Or a specific inquiries view in dashboard
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_portfolio_inquiry_created ON public.portfolio_inquiries;
CREATE TRIGGER on_portfolio_inquiry_created
    AFTER INSERT ON public.portfolio_inquiries
    FOR EACH ROW EXECUTE FUNCTION public.create_inquiry_notification();

-- Trigger for NOTIFICATIONS when a user gets a new FOLLOWER
CREATE OR REPLACE FUNCTION public.create_follow_notification() 
RETURNS TRIGGER AS $$
DECLARE
    follower_name TEXT;
BEGIN
    SELECT name INTO follower_name FROM public.profiles WHERE id = NEW.follower_id;
    
    INSERT INTO public.notifications (user_id, title, message, type)
    VALUES (
        NEW.following_id,
        'New Follower',
        COALESCE(follower_name, 'Someone') || ' is now following you.',
        'info'
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_follow_created ON public.follows;
CREATE TRIGGER on_follow_created
    AFTER INSERT ON public.follows
    FOR EACH ROW EXECUTE FUNCTION public.create_follow_notification();

-- 14. Add to Realtime
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_publication_tables WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'follows') THEN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.follows;
    END IF;
END $$;

-- Policies for CONVERSATIONS
DROP POLICY IF EXISTS "Users can view their own conversations" ON public.conversations;
CREATE POLICY "Users can view their own conversations" ON public.conversations
    FOR SELECT USING (auth.uid() = participant_1 OR auth.uid() = participant_2);

DROP POLICY IF EXISTS "Users can create conversations" ON public.conversations;
CREATE POLICY "Users can create conversations" ON public.conversations
    FOR INSERT WITH CHECK (auth.uid() = participant_1 OR auth.uid() = participant_2);

DROP POLICY IF EXISTS "Users can update their own conversations" ON public.conversations;
CREATE POLICY "Users can update their own conversations" ON public.conversations
    FOR UPDATE USING (auth.uid() = participant_1 OR auth.uid() = participant_2);

-- Policies for MESSAGES
DROP POLICY IF EXISTS "Users can view messages in their conversations" ON public.messages;
CREATE POLICY "Users can view messages in their conversations" ON public.messages
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.conversations 
            WHERE id = messages.conversation_id 
            AND (participant_1 = auth.uid() OR participant_2 = auth.uid())
        )
    );

DROP POLICY IF EXISTS "Users can send messages to their conversations" ON public.messages;
CREATE POLICY "Users can send messages to their conversations" ON public.messages
    FOR INSERT WITH CHECK (
        auth.uid() = sender_id AND
        EXISTS (
            SELECT 1 FROM public.conversations 
            WHERE id = messages.conversation_id 
            AND (participant_1 = auth.uid() OR participant_2 = auth.uid())
        )
    );

-- Policies for PORTFOLIO_ITEMS
DROP POLICY IF EXISTS "Portfolio items are viewable by everyone" ON public.portfolio_items;
CREATE POLICY "Portfolio items are viewable by everyone" ON public.portfolio_items
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can manage their own portfolio items" ON public.portfolio_items;
CREATE POLICY "Users can manage their own portfolio items" ON public.portfolio_items
    FOR ALL USING (auth.uid() = profile_id);

-- 6. Connection Test Table (Optional)
CREATE TABLE IF NOT EXISTS public._test_connection (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);
ALTER TABLE public._test_connection ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Anyone can select from test table" ON public._test_connection;
CREATE POLICY "Anyone can select from test table" ON public._test_connection FOR SELECT USING (true);

-- 12. Trigger to handle new user registration from Auth
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, name, avatar_url, role, username, referring_freelancer_id)
  VALUES (
    new.id, 
    new.raw_user_meta_data->>'full_name', 
    new.raw_user_meta_data->>'avatar_url',
    COALESCE(new.raw_user_meta_data->>'role', 'freelancer'),
    COALESCE(new.raw_user_meta_data->>'username', split_part(new.email, '@', 1)),
    CASE WHEN (new.raw_user_meta_data->>'referring_freelancer_id') IS NOT NULL 
         THEN (new.raw_user_meta_data->>'referring_freelancer_id')::uuid 
         ELSE NULL END
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Safe trigger creation
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'on_auth_user_created') THEN
        CREATE TRIGGER on_auth_user_created
          AFTER INSERT ON auth.users
          FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
    END IF;
END $$;

-- 11. Portfolio Builder Tables
CREATE TABLE IF NOT EXISTS public.portfolios (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL UNIQUE,
    about_me TEXT,
    tagline TEXT,
    custom_domain TEXT,
    theme_settings JSONB DEFAULT '{"aesthetic": "minimalist", "primaryColor": "#000000"}',
    is_public BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS public.portfolio_projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    portfolio_id UUID REFERENCES public.portfolios(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    image_url TEXT,
    project_url TEXT,
    github_url TEXT,
    technologies TEXT[] DEFAULT '{}',
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS public.portfolio_skills (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    portfolio_id UUID REFERENCES public.portfolios(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    level TEXT,
    category TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS public.portfolio_links (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    portfolio_id UUID REFERENCES public.portfolios(id) ON DELETE CASCADE NOT NULL,
    label TEXT NOT NULL,
    url TEXT NOT NULL,
    icon TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 12. PayMongo tracking tables for webhook idempotency + payment mapping
CREATE TABLE IF NOT EXISTS public.paymongo_checkout_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    checkout_id TEXT NOT NULL UNIQUE,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    product_type TEXT NOT NULL CHECK (product_type IN ('pro', 'verification', 'credit_topup')),
    status TEXT NOT NULL DEFAULT 'pending',
    livemode BOOLEAN DEFAULT false,
    amount INTEGER,
    currency TEXT DEFAULT 'PHP',
    email TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS public.paymongo_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id TEXT NOT NULL UNIQUE,
    event_type TEXT NOT NULL,
    resource_id TEXT,
    user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    product_type TEXT CHECK (product_type IN ('pro', 'verification', 'credit_topup')),
    livemode BOOLEAN DEFAULT false,
    processed BOOLEAN DEFAULT false,
    processing_error TEXT,
    payload JSONB,
    received_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    processed_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX IF NOT EXISTS idx_paymongo_events_user_id ON public.paymongo_events (user_id);
CREATE INDEX IF NOT EXISTS idx_paymongo_events_received_at ON public.paymongo_events (received_at DESC);

ALTER TABLE public.paymongo_checkout_sessions
    DROP CONSTRAINT IF EXISTS paymongo_checkout_sessions_product_type_check;
ALTER TABLE public.paymongo_checkout_sessions
    ADD CONSTRAINT paymongo_checkout_sessions_product_type_check
    CHECK (product_type IN ('pro', 'verification', 'credit_topup'));

ALTER TABLE public.paymongo_events
    DROP CONSTRAINT IF EXISTS paymongo_events_product_type_check;
ALTER TABLE public.paymongo_events
    ADD CONSTRAINT paymongo_events_product_type_check
    CHECK (product_type IN ('pro', 'verification', 'credit_topup'));

-- Enable RLS for Portfolio tables
ALTER TABLE public.portfolios ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portfolio_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portfolio_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portfolio_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.paymongo_checkout_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.paymongo_events ENABLE ROW LEVEL SECURITY;

-- Policies for Portfolios
DROP POLICY IF EXISTS "Portfolios are viewable by everyone." ON public.portfolios;
CREATE POLICY "Portfolios are viewable by everyone." ON public.portfolios FOR SELECT USING (is_public = true OR auth.uid() = profile_id);

DROP POLICY IF EXISTS "Users can manage their own portfolio." ON public.portfolios;
CREATE POLICY "Users can manage their own portfolio." ON public.portfolios FOR ALL USING (auth.uid() = profile_id);

-- Policies for Projects, Skills, Links
DROP POLICY IF EXISTS "Portfolio content is viewable by everyone." ON public.portfolio_projects;
CREATE POLICY "Portfolio content is viewable by everyone." ON public.portfolio_projects FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can manage their own projects." ON public.portfolio_projects;
CREATE POLICY "Users can manage their own projects." ON public.portfolio_projects FOR ALL USING (
    EXISTS (SELECT 1 FROM public.portfolios WHERE id = portfolio_id AND profile_id = auth.uid())
);

DROP POLICY IF EXISTS "Portfolio skills are viewable by everyone." ON public.portfolio_skills;
CREATE POLICY "Portfolio skills are viewable by everyone." ON public.portfolio_skills FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can manage their own skills." ON public.portfolio_skills;
CREATE POLICY "Users can manage their own skills." ON public.portfolio_skills FOR ALL USING (
    EXISTS (SELECT 1 FROM public.portfolios WHERE id = portfolio_id AND profile_id = auth.uid())
);

DROP POLICY IF EXISTS "Portfolio links are viewable by everyone." ON public.portfolio_links;
CREATE POLICY "Portfolio links are viewable by everyone." ON public.portfolio_links FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can manage their own links." ON public.portfolio_links;
CREATE POLICY "Users can manage their own links." ON public.portfolio_links FOR ALL USING (
    EXISTS (SELECT 1 FROM public.portfolios WHERE id = portfolio_id AND profile_id = auth.uid())
);

-- 13. Premium Credits (for paid AI features)
CREATE TABLE IF NOT EXISTS public.user_credit_wallets (
    user_id UUID PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
    balance INTEGER NOT NULL DEFAULT 0 CHECK (balance >= 0),
    lifetime_earned INTEGER NOT NULL DEFAULT 0 CHECK (lifetime_earned >= 0),
    lifetime_spent INTEGER NOT NULL DEFAULT 0 CHECK (lifetime_spent >= 0),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS public.credit_ledger (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    action TEXT NOT NULL,
    delta INTEGER NOT NULL CHECK (delta <> 0),
    balance_after INTEGER NOT NULL CHECK (balance_after >= 0),
    metadata JSONB DEFAULT '{}'::jsonb,
    idempotency_key TEXT UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_credit_ledger_user_created ON public.credit_ledger (user_id, created_at DESC);

CREATE OR REPLACE FUNCTION public.grant_user_credits(
    p_user_id UUID,
    p_amount INTEGER,
    p_action TEXT,
    p_metadata JSONB DEFAULT '{}'::jsonb,
    p_idempotency_key TEXT DEFAULT NULL
)
RETURNS TABLE(success BOOLEAN, balance INTEGER, error TEXT, transaction_id UUID)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_wallet public.user_credit_wallets%ROWTYPE;
    v_existing public.credit_ledger%ROWTYPE;
BEGIN
    IF p_user_id IS NULL THEN
        RETURN QUERY SELECT false, 0, 'missing_user_id', NULL::uuid;
        RETURN;
    END IF;

    IF p_amount IS NULL OR p_amount <= 0 THEN
        RETURN QUERY SELECT false, 0, 'invalid_amount', NULL::uuid;
        RETURN;
    END IF;

    IF p_idempotency_key IS NOT NULL THEN
        SELECT * INTO v_existing
        FROM public.credit_ledger
        WHERE idempotency_key = p_idempotency_key
        LIMIT 1;

        IF v_existing.id IS NOT NULL THEN
            RETURN QUERY SELECT true, v_existing.balance_after, NULL::text, v_existing.id;
            RETURN;
        END IF;
    END IF;

    INSERT INTO public.user_credit_wallets (user_id)
    VALUES (p_user_id)
    ON CONFLICT (user_id) DO NOTHING;

    SELECT * INTO v_wallet
    FROM public.user_credit_wallets
    WHERE user_id = p_user_id
    FOR UPDATE;

    UPDATE public.user_credit_wallets
    SET
        balance = v_wallet.balance + p_amount,
        lifetime_earned = v_wallet.lifetime_earned + p_amount,
        updated_at = timezone('utc'::text, now())
    WHERE user_id = p_user_id
    RETURNING * INTO v_wallet;

    INSERT INTO public.credit_ledger (
        user_id,
        action,
        delta,
        balance_after,
        metadata,
        idempotency_key
    )
    VALUES (
        p_user_id,
        p_action,
        p_amount,
        v_wallet.balance,
        COALESCE(p_metadata, '{}'::jsonb),
        p_idempotency_key
    )
    RETURNING id INTO transaction_id;

    RETURN QUERY SELECT true, v_wallet.balance, NULL::text, transaction_id;
EXCEPTION
    WHEN unique_violation THEN
        IF p_idempotency_key IS NOT NULL THEN
            SELECT * INTO v_existing
            FROM public.credit_ledger
            WHERE idempotency_key = p_idempotency_key
            LIMIT 1;

            IF v_existing.id IS NOT NULL THEN
                RETURN QUERY SELECT true, v_existing.balance_after, NULL::text, v_existing.id;
                RETURN;
            END IF;
        END IF;

        RETURN QUERY SELECT false, COALESCE(v_wallet.balance, 0), 'duplicate_error', NULL::uuid;
END;
$$;

CREATE OR REPLACE FUNCTION public.consume_user_credits(
    p_user_id UUID,
    p_action TEXT,
    p_amount INTEGER,
    p_metadata JSONB DEFAULT '{}'::jsonb,
    p_idempotency_key TEXT DEFAULT NULL
)
RETURNS TABLE(success BOOLEAN, balance INTEGER, error TEXT, transaction_id UUID)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_wallet public.user_credit_wallets%ROWTYPE;
    v_existing public.credit_ledger%ROWTYPE;
BEGIN
    IF p_user_id IS NULL THEN
        RETURN QUERY SELECT false, 0, 'missing_user_id', NULL::uuid;
        RETURN;
    END IF;

    IF p_amount IS NULL OR p_amount <= 0 THEN
        RETURN QUERY SELECT false, 0, 'invalid_amount', NULL::uuid;
        RETURN;
    END IF;

    IF p_idempotency_key IS NOT NULL THEN
        SELECT * INTO v_existing
        FROM public.credit_ledger
        WHERE idempotency_key = p_idempotency_key
        LIMIT 1;

        IF v_existing.id IS NOT NULL THEN
            RETURN QUERY SELECT true, v_existing.balance_after, NULL::text, v_existing.id;
            RETURN;
        END IF;
    END IF;

    SELECT * INTO v_wallet
    FROM public.user_credit_wallets
    WHERE user_id = p_user_id
    FOR UPDATE;

    IF v_wallet.user_id IS NULL THEN
        RETURN QUERY SELECT false, 0, 'insufficient_credits', NULL::uuid;
        RETURN;
    END IF;

    IF v_wallet.balance < p_amount THEN
        RETURN QUERY SELECT false, v_wallet.balance, 'insufficient_credits', NULL::uuid;
        RETURN;
    END IF;

    UPDATE public.user_credit_wallets
    SET
        balance = v_wallet.balance - p_amount,
        lifetime_spent = v_wallet.lifetime_spent + p_amount,
        updated_at = timezone('utc'::text, now())
    WHERE user_id = p_user_id
    RETURNING * INTO v_wallet;

    INSERT INTO public.credit_ledger (
        user_id,
        action,
        delta,
        balance_after,
        metadata,
        idempotency_key
    )
    VALUES (
        p_user_id,
        p_action,
        -p_amount,
        v_wallet.balance,
        COALESCE(p_metadata, '{}'::jsonb),
        p_idempotency_key
    )
    RETURNING id INTO transaction_id;

    RETURN QUERY SELECT true, v_wallet.balance, NULL::text, transaction_id;
EXCEPTION
    WHEN unique_violation THEN
        IF p_idempotency_key IS NOT NULL THEN
            SELECT * INTO v_existing
            FROM public.credit_ledger
            WHERE idempotency_key = p_idempotency_key
            LIMIT 1;

            IF v_existing.id IS NOT NULL THEN
                RETURN QUERY SELECT true, v_existing.balance_after, NULL::text, v_existing.id;
                RETURN;
            END IF;
        END IF;

        RETURN QUERY SELECT false, COALESCE(v_wallet.balance, 0), 'duplicate_error', NULL::uuid;
END;
$$;

ALTER TABLE public.user_credit_wallets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.credit_ledger ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own credit wallet." ON public.user_credit_wallets;
CREATE POLICY "Users can view their own credit wallet." ON public.user_credit_wallets
    FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can view their own credit ledger." ON public.credit_ledger;
CREATE POLICY "Users can view their own credit ledger." ON public.credit_ledger
    FOR SELECT USING (auth.uid() = user_id);

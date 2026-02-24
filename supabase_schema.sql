-- TARA MARKETPLACE - SUPABASE DATABASE SCHEMA
-- Copy and run this script in your Supabase SQL Editor (https://supabase.com/dashboard/project/_/sql)

-- 1. Create PROFILES table
-- This table stores user profile information for both Jobseekers and Hirers.
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID REFERENCES auth.users NOT NULL PRIMARY KEY,
    name TEXT,
    role TEXT DEFAULT 'jobseeker',
    category TEXT DEFAULT 'Developer',
    skills TEXT[] DEFAULT '{}',
    "hourlyRate" TEXT DEFAULT '$0',
    bio TEXT,
    avatar_url TEXT,
    "companyName" TEXT,
    "verifiedSkills" JSONB DEFAULT '[]',
    "softSkills" JSONB DEFAULT '[]',
    "activeProjects" JSONB DEFAULT '[]',
    squad JSONB,
    "aiInsights" JSONB,
    ranking INTEGER,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

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
    "customQuestions" JSONB DEFAULT '[]'
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
    participant_1 UUID REFERENCES public.profiles(id) NOT NULL,
    participant_2 UUID REFERENCES public.profiles(id) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    UNIQUE(participant_1, participant_2)
);

-- 4. Create MESSAGES table
CREATE TABLE IF NOT EXISTS public.messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id UUID REFERENCES public.conversations(id) ON DELETE CASCADE NOT NULL,
    sender_id UUID REFERENCES public.profiles(id) NOT NULL,
    content TEXT NOT NULL,
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
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

-- Enable RLS for new tables
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portfolio_items ENABLE ROW LEVEL SECURITY;

-- Policies for CONVERSATIONS
DROP POLICY IF EXISTS "Users can view their own conversations" ON public.conversations;
CREATE POLICY "Users can view their own conversations" ON public.conversations
    FOR SELECT USING (auth.uid() = participant_1 OR auth.uid() = participant_2);

DROP POLICY IF EXISTS "Users can create conversations" ON public.conversations;
CREATE POLICY "Users can create conversations" ON public.conversations
    FOR INSERT WITH CHECK (auth.uid() = participant_1 OR auth.uid() = participant_2);

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

-- FINAL STEP: If you still see errors, try running "RELOAD SCHEMA" in Supabase settings or refresh your app.

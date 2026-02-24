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
CREATE POLICY "Public profiles are viewable by everyone." ON public.profiles
    FOR SELECT USING (true);

-- Only the owner can insert their own profile
CREATE POLICY "Users can insert their own profile." ON public.profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

-- Only the owner can update their own profile
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
CREATE POLICY "Jobs are viewable by everyone." ON public.jobs
    FOR SELECT USING (true);

-- Any authenticated user can post a job
CREATE POLICY "Authenticated users can post jobs." ON public.jobs
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');


-- 3. Connection Test Table (Optional)
CREATE TABLE IF NOT EXISTS public._test_connection (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);
ALTER TABLE public._test_connection ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can select from test table" ON public._test_connection FOR SELECT USING (true);

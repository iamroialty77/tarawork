-- Run this in Supabase SQL Editor before using per-user Trello connection flow.
CREATE TABLE IF NOT EXISTS public.user_trello_connections (
    user_id UUID PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
    trello_member_id TEXT NOT NULL,
    trello_username TEXT,
    trello_full_name TEXT,
    access_token_encrypted TEXT NOT NULL,
    token_scope TEXT DEFAULT 'read,write,account',
    token_expires_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_user_trello_connections_member_id
    ON public.user_trello_connections (trello_member_id);

ALTER TABLE public.user_trello_connections ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own Trello connection." ON public.user_trello_connections;
CREATE POLICY "Users can view their own Trello connection." ON public.user_trello_connections
    FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can create their own Trello connection." ON public.user_trello_connections;
CREATE POLICY "Users can create their own Trello connection." ON public.user_trello_connections
    FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own Trello connection." ON public.user_trello_connections;
CREATE POLICY "Users can update their own Trello connection." ON public.user_trello_connections
    FOR UPDATE USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own Trello connection." ON public.user_trello_connections;
CREATE POLICY "Users can delete their own Trello connection." ON public.user_trello_connections
    FOR DELETE USING (auth.uid() = user_id);

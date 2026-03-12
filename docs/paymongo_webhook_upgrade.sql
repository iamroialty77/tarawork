-- PayMongo webhook upgrade (idempotent)
-- Run this in Supabase SQL Editor if your database is already live.

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

ALTER TABLE public.paymongo_checkout_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.paymongo_events ENABLE ROW LEVEL SECURITY;

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

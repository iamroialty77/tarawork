-- Premium credits upgrade (idempotent)
-- Run this in Supabase SQL Editor if your database is already live.

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

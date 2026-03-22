-- Optional but recommended: store incoming Trello webhook events for sync audit/retry.
CREATE TABLE IF NOT EXISTS public.trello_webhook_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    webhook_id TEXT,
    action_id TEXT,
    action_type TEXT,
    model_id TEXT,
    payload JSONB NOT NULL DEFAULT '{}'::jsonb,
    received_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_trello_webhook_events_user_id
    ON public.trello_webhook_events (user_id);

CREATE INDEX IF NOT EXISTS idx_trello_webhook_events_action_type
    ON public.trello_webhook_events (action_type);

CREATE INDEX IF NOT EXISTS idx_trello_webhook_events_received_at
    ON public.trello_webhook_events (received_at DESC);

ALTER TABLE public.trello_webhook_events ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own Trello webhook events." ON public.trello_webhook_events;
CREATE POLICY "Users can view their own Trello webhook events." ON public.trello_webhook_events
    FOR SELECT USING (auth.uid() = user_id);

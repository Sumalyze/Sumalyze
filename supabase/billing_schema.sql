-- Sumalyze — Supabase Billing Schema Setup
-- Purpose: Setup database schema for subscriptions and Paddle event logging.

-- 1. Create subscriptions table
CREATE TABLE IF NOT EXISTS public.subscriptions (
    id uuid primary key default gen_random_uuid(),
    user_id uuid not null unique references auth.users(id) on delete cascade,
    plan text not null default 'free' constraint check_plan check (plan in ('free', 'starter', 'pro', 'max')),
    status text not null default 'free' constraint check_status check (status in ('free', 'trialing', 'active', 'past_due', 'canceled', 'paused', 'inactive')),
    billing_interval text constraint check_billing_interval check (billing_interval in ('monthly', 'annual') or billing_interval is null),
    paddle_customer_id text,
    paddle_subscription_id text,
    paddle_price_id text,
    current_period_start timestamptz,
    current_period_end timestamptz,
    trial_ends_at timestamptz,
    cancel_at_period_end boolean default false,
    created_at timestamptz default now(),
    updated_at timestamptz default now()
);

-- Indexing for lookup performance
CREATE INDEX IF NOT EXISTS subscriptions_paddle_customer_id_idx ON public.subscriptions (paddle_customer_id);
CREATE INDEX IF NOT EXISTS subscriptions_paddle_subscription_id_idx ON public.subscriptions (paddle_subscription_id);

-- 2. Create paddle_events table (Webhook idempotency & audit logs)
CREATE TABLE IF NOT EXISTS public.paddle_events (
    id uuid primary key default gen_random_uuid(),
    event_id text not null unique,
    event_type text not null,
    processed_at timestamptz,
    payload jsonb not null,
    created_at timestamptz default now()
);

-- Indexing for events logs
CREATE INDEX IF NOT EXISTS paddle_events_event_type_idx ON public.paddle_events (event_type);
CREATE INDEX IF NOT EXISTS paddle_events_created_at_idx ON public.paddle_events (created_at);

-- 3. Enable Row Level Security (RLS)
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.paddle_events ENABLE ROW LEVEL SECURITY;

-- 4. Set RLS Policies
-- Subscriptions policies:
-- Users can view only their own subscription row. Normal users cannot insert, update, or delete.
CREATE POLICY select_subscription_policy ON public.subscriptions
    FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);

-- Note: By leaving INSERT, UPDATE, and DELETE policies undefined for public/authenticated,
-- only superusers (service role, Netlify functions running backend code, database administrators) can write.

-- Paddle events policies:
-- No public/client read/write access. Service role only.
-- (By enabling RLS and not defining any policies, select/insert/update/delete is blocked for all normal clients).

-- 5. Trigger to automatically update subscriptions.updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = now();
   RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER set_subscriptions_updated_at
BEFORE UPDATE ON public.subscriptions
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

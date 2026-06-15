-- SQL Schema Update: Account Deletion Grace Period
-- Run this in your Supabase project's SQL Editor to enable pending deletion status.

-- 1. Add pending deletion state columns to public.user_profiles
ALTER TABLE public.user_profiles 
ADD COLUMN IF NOT EXISTS pending_deletion boolean DEFAULT false;

ALTER TABLE public.user_profiles 
ADD COLUMN IF NOT EXISTS deletion_requested_at timestamptz DEFAULT NULL;

-- 2. Indexes for efficient lookup (e.g. for background/scheduled cleanup functions)
CREATE INDEX IF NOT EXISTS user_profiles_pending_deletion_idx ON public.user_profiles (pending_deletion);
CREATE INDEX IF NOT EXISTS user_profiles_deletion_requested_at_idx ON public.user_profiles (deletion_requested_at);

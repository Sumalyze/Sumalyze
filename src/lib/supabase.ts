import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

// Helper to check if Supabase is configured
const isConfigured = 
  !!supabaseUrl && 
  supabaseUrl !== 'https://placeholder.supabase.co' && 
  supabaseUrl.trim() !== '' &&
  !!supabaseAnonKey &&
  supabaseAnonKey !== 'placeholder-anon-key' &&
  supabaseAnonKey.trim() !== '';

if (import.meta.env.DEV && !isConfigured) {
  console.warn(
    '[Sumalyze] Development Warning: Supabase client is not fully configured. ' +
    'Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your local .env or .env.local file.'
  );
}

export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-anon-key'
);

export type { User, Session } from '@supabase/supabase-js';


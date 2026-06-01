// src/utils/authError.ts

/**
 * Checks if Supabase client variables are configured (not empty and not placeholders).
 */
export function isSupabaseConfigured(): boolean {
  const url = import.meta.env.VITE_SUPABASE_URL;
  const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
  return (
    !!url &&
    url !== 'https://placeholder.supabase.co' &&
    url.trim() !== '' &&
    !!anonKey &&
    anonKey !== 'placeholder-anon-key' &&
    anonKey.trim() !== ''
  );
}

/**
 * Maps Supabase authentication errors and exceptions to user-friendly messages,
 * avoiding generic browser errors (like "Failed to fetch") or raw stack traces.
 */
export function mapAuthError(error: any): string {
  if (!isSupabaseConfigured()) {
    return 'Authentication is unavailable. Supabase environment variables are missing or incorrectly configured in the local setup. Please check VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.';
  }

  if (!error) {
    return 'An unknown authentication error occurred.';
  }

  // Retrieve message from error object or string
  const message = (typeof error === 'string' ? error : error.message || '').trim();
  const name = error.name || '';

  // 1. Network/CORS/Fetch failures
  if (
    message.toLowerCase().includes('failed to fetch') ||
    message.toLowerCase().includes('networkerror') ||
    name === 'TypeError'
  ) {
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
    if (supabaseUrl.includes('placeholder.supabase.co') || !supabaseUrl.startsWith('https://')) {
      return 'Supabase URL configuration is invalid. Please configure a valid VITE_SUPABASE_URL (e.g., https://your-project-id.supabase.co).';
    }
    return 'Connection to Supabase authentication server failed. Please check your internet connection or verify that CORS rules allow requests from this host.';
  }

  // 2. Invalid Supabase URL/key / JWT errors
  if (
    message.toLowerCase().includes('jwt') ||
    message.toLowerCase().includes('anon') ||
    message.toLowerCase().includes('api key') ||
    message.toLowerCase().includes('bad jwt') ||
    message.toLowerCase().includes('invalid api key')
  ) {
    return 'Invalid Supabase API key configuration. Please verify VITE_SUPABASE_ANON_KEY in your local settings.';
  }

  // 3. Email confirmation required or validation issues
  if (
    message.toLowerCase().includes('confirm') ||
    message.toLowerCase().includes('verified') ||
    message.toLowerCase().includes('verification')
  ) {
    return 'Email confirmation is required. Please check your inbox for the verification link.';
  }

  // 4. Invalid credentials
  if (
    message.toLowerCase().includes('invalid grant') ||
    message.toLowerCase().includes('invalid login credentials') ||
    message.toLowerCase().includes('invalid credentials')
  ) {
    return 'Invalid email address or password.';
  }

  // 5. Signup rate limit
  if (message.toLowerCase().includes('rate limit') || message.toLowerCase().includes('too many requests')) {
    return 'Too many authentication attempts. Please wait a moment and try again.';
  }

  // Safe fallback without raw stack traces
  return message || 'Authentication failed. Please check your credentials and try again.';
}

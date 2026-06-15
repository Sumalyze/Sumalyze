import { createClient } from '@supabase/supabase-js';

interface NLEvent {
  httpMethod: string;
  body: string | null;
  headers: Record<string, string | undefined>;
}

interface NLResponse {
  statusCode: number;
  headers: Record<string, string>;
  body: string;
}

const json = (statusCode: number, data: unknown): NLResponse => ({
  statusCode,
  headers: { 
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'POST, OPTIONS'
  },
  body: JSON.stringify(data),
});

export const handler = async (event: NLEvent): Promise<NLResponse> => {
  // Handle preflight OPTIONS request
  if (event.httpMethod === 'OPTIONS') {
    return json(200, { ok: true });
  }

  if (event.httpMethod !== 'POST') {
    return json(405, { error: 'Method not allowed' });
  }

  // Retrieve environment variables
  const supabaseUrl = process.env.VITE_SUPABASE_URL;
  const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey || !supabaseServiceKey) {
    console.error('[request-account-deletion] Missing Supabase environment variables on server.');
    return json(500, { error: 'Database service is misconfigured on the server' });
  }

  // Parse JWT Authorization Header
  const authHeader = event.headers.authorization || event.headers.Authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return json(401, { error: 'Unauthorized: Missing session token' });
  }
  const token = authHeader.split(' ')[1];

  try {
    // 1. Initialize client-safe Supabase client to verify user token
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      auth: { persistSession: false },
    });

    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    if (authError || !user) {
      console.warn('[request-account-deletion] JWT validation failed:', authError?.message);
      return json(401, { error: 'Unauthorized: Invalid token' });
    }

    const userId = user.id;

    // 2. Initialize admin Supabase client with service_role key to update profile
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
      auth: { persistSession: false },
    });

    // 3. Update public.user_profiles table to flag deletion request and timestamp
    const { error: updateError } = await supabaseAdmin
      .from('user_profiles')
      .update({
        pending_deletion: true,
        deletion_requested_at: new Date().toISOString(),
      })
      .eq('id', userId);

    if (updateError) {
      console.error('[request-account-deletion] Database update error:', updateError);
      return json(500, { error: 'Failed to request account deletion in database' });
    }

    // Return success
    return json(200, {
      success: true,
      message: 'Account scheduled for deletion successfully.',
      deletionRequestedAt: new Date().toISOString(),
      gracePeriodHours: 24,
    });

  } catch (err: unknown) {
    console.error('[request-account-deletion] Exception caught:', err);
    return json(500, { error: 'An unexpected internal error occurred' });
  }
};

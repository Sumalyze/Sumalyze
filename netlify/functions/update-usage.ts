import { createClient } from '@supabase/supabase-js';

// ─── Inline types (avoids @netlify/functions dependency) ──────────────────
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
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseAnonKey || !supabaseServiceKey) {
    console.error('[update-usage] Missing Supabase environment variables on server.');
    return json(500, { error: 'Database service is misconfigured on the server' });
  }

  // Parse JWT Authorization Header
  const authHeader = event.headers.authorization || event.headers.Authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return json(401, { error: 'Unauthorized: Missing session token' });
  }
  const token = authHeader.split(' ')[1];

  // Parse Action from body
  let body: { action?: unknown };
  try {
    body = JSON.parse(event.body || '{}');
  } catch {
    return json(400, { error: 'Invalid JSON body' });
  }

  const action = body.action;
  if (action !== 'get_limits' && action !== 'increment_tool' && action !== 'increment_agent') {
    return json(400, { error: 'Invalid action. Must be get_limits, increment_tool, or increment_agent' });
  }

  try {
    // 1. Initialize client-safe Supabase client to verify user token
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      auth: { persistSession: false },
    });

    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    if (authError || !user) {
      console.warn('[update-usage] JWT validation failed:', authError?.message);
      return json(401, { error: 'Unauthorized: Invalid token' });
    }

    const userId = user.id;

    // 2. Initialize admin Supabase client with service_role key to manage limits
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
      auth: { persistSession: false },
    });

    // 3. Fetch current limits row
    let { data: limits, error: selectError } = await supabaseAdmin
      .from('usage_limits')
      .select('*')
      .eq('user_id', userId)
      .single();

    // 4. Fallback check: Initialize limits row if it is missing
    if (selectError && selectError.code === 'PGRST116') {
      console.log(`[update-usage] Limits row missing for user ${userId}. Creating default...`);
      const { data: newLimits, error: insertError } = await supabaseAdmin
        .from('usage_limits')
        .insert({ user_id: userId })
        .select('*')
        .single();

      if (insertError) {
        console.error('[update-usage] Failed to create default limits row:', insertError);
        return json(500, { error: 'Failed to initialize usage limits' });
      }
      limits = newLimits;
    } else if (selectError) {
      console.error('[update-usage] Database fetch error:', selectError);
      return json(500, { error: 'Database fetch error' });
    }

    // 5. Daily reset check
    const todayStr = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    const lastResetStr = limits.last_reset_date;

    const needsReset = todayStr !== lastResetStr;
    let dailyTool = needsReset ? 0 : limits.daily_tool_runs;
    let dailyAgent = needsReset ? 0 : limits.daily_agent_runs;

    // 6. Update counts if requested
    if (action === 'increment_tool') {
      dailyTool += 1;
      limits.monthly_tool_runs += 1;
    } else if (action === 'increment_agent') {
      dailyAgent += 1;
      limits.monthly_agent_runs += 1;
    }

    // 7. Save updates back to database
    const { data: updatedLimits, error: updateError } = await supabaseAdmin
      .from('usage_limits')
      .update({
        daily_tool_runs: dailyTool,
        daily_agent_runs: dailyAgent,
        monthly_tool_runs: limits.monthly_tool_runs,
        monthly_agent_runs: limits.monthly_agent_runs,
        last_reset_date: todayStr,
      })
      .eq('user_id', userId)
      .select('*')
      .single();

    if (updateError) {
      console.error('[update-usage] Failed to update usage limits:', updateError);
      return json(500, { error: 'Failed to update usage limits' });
    }

    return json(200, {
      daily_tool_runs: updatedLimits.daily_tool_runs,
      daily_agent_runs: updatedLimits.daily_agent_runs,
      monthly_tool_runs: updatedLimits.monthly_tool_runs,
      monthly_agent_runs: updatedLimits.monthly_agent_runs,
      last_reset_date: updatedLimits.last_reset_date,
    });

  } catch (err: unknown) {
    console.error('[update-usage] Exception caught:', err);
    return json(500, { error: 'An unexpected internal error occurred' });
  }
};

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

  // Retrieve environment variables
  const supabaseUrl = process.env.VITE_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseServiceKey) {
    console.error('[cleanup-deleted-accounts] Missing Supabase environment variables on server.');
    return json(500, { error: 'Database service is misconfigured on the server' });
  }

  // 1. Authorization check
  const cronSecret = process.env.ADMIN_CRON_SECRET;
  const authHeader = event.headers.authorization || event.headers.Authorization || '';
  const secretHeader = event.headers['x-admin-cron-secret'] || '';

  const hasValidToken = cronSecret && (
    authHeader === `Bearer ${cronSecret}` || 
    secretHeader === cronSecret
  );

  // Scheduled functions on Netlify receive next_run in body
  let isScheduledRun = false;
  try {
    if (event.body) {
      const parsedBody = JSON.parse(event.body);
      if (parsedBody && parsedBody.next_run) {
        isScheduledRun = true;
      }
    }
  } catch (e) {
    // Ignore JSON parsing errors
  }

  // Require authorization if it is not an internal scheduled cron execution
  if (!isScheduledRun && !hasValidToken) {
    console.warn('[cleanup-deleted-accounts] Unauthorized access attempt blocked.');
    return json(401, { error: 'Unauthorized: Invalid cron secret or scheduled payload' });
  }

  try {
    // 2. Initialize admin client
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
      auth: { persistSession: false },
    });

    // 3. Find profiles marked for deletion that have passed the 24-hour grace period
    const cutoffTime = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
    console.log(`[cleanup-deleted-accounts] Checking for deletion requests older than: ${cutoffTime}`);

    const { data: usersToClean, error: fetchError } = await supabaseAdmin
      .from('user_profiles')
      .select('id')
      .eq('pending_deletion', true)
      .lte('deletion_requested_at', cutoffTime);

    if (fetchError) {
      console.error('[cleanup-deleted-accounts] Error querying pending deletions:', fetchError.message);
      return json(500, { error: 'Failed to fetch pending deletions' });
    }

    const totalAccounts = usersToClean?.length || 0;
    console.log(`[cleanup-deleted-accounts] Found ${totalAccounts} accounts pending hard-delete.`);

    let successCount = 0;
    let failCount = 0;

    if (totalAccounts > 0 && usersToClean) {
      const tablesToClean = [
        { name: 'usage_limits', key: 'user_id' },
        { name: 'analysis_history', key: 'user_id' },
        { name: 'saved_outputs', key: 'user_id' },
        { name: 'agent_runs', key: 'user_id' },
        { name: 'user_feedback', key: 'user_id' },
        { name: 'subscriptions', key: 'user_id' }
      ];

      for (const targetUser of usersToClean) {
        const userId = targetUser.id;
        const maskedId = userId.substring(0, 8) + '...';
        console.log(`[cleanup-deleted-accounts] Processing deletion for user: ${maskedId}`);

        try {
          // A. Clean up associated tables one by one (fail-safe)
          for (const table of tablesToClean) {
            try {
              const { error: tableError } = await supabaseAdmin
                .from(table.name)
                .delete()
                .eq(table.key, userId);

              if (tableError) {
                console.warn(`[cleanup-deleted-accounts] Table ${table.name} skipped/failed for user ${maskedId}:`, tableError.message);
              }
            } catch (tableExc: any) {
              console.warn(`[cleanup-deleted-accounts] Exception in table ${table.name} delete for user ${maskedId}:`, tableExc.message || tableExc);
            }
          }

          // B. Delete the user profile row
          try {
            const { error: profileError } = await supabaseAdmin
              .from('user_profiles')
              .delete()
              .eq('id', userId);

            if (profileError) {
              console.warn(`[cleanup-deleted-accounts] Failed to delete user_profile row for user ${maskedId}:`, profileError.message);
            }
          } catch (profileExc: any) {
            console.warn(`[cleanup-deleted-accounts] Exception in user_profiles delete for user ${maskedId}:`, profileExc.message || profileExc);
          }

          // C. Delete the Supabase auth user
          const { error: authDeleteError } = await supabaseAdmin.auth.admin.deleteUser(userId);
          if (authDeleteError) {
            console.error(`[cleanup-deleted-accounts] Failed to delete auth user ${maskedId}:`, authDeleteError.message);
            failCount++;
          } else {
            console.log(`[cleanup-deleted-accounts] Successfully deleted auth user ${maskedId}`);
            successCount++;
          }

        } catch (userCleanExc: any) {
          console.error(`[cleanup-deleted-accounts] Fatal error processing user ${maskedId}:`, userCleanExc.message || userCleanExc);
          failCount++;
        }
      }
    }

    return json(200, {
      success: true,
      processed: totalAccounts,
      successful: successCount,
      failed: failCount,
    });

  } catch (err: unknown) {
    console.error('[cleanup-deleted-accounts] Fatal internal exception:', err);
    return json(500, { error: 'An unexpected internal error occurred during cleanup' });
  }
};

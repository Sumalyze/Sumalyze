import { supabase } from '../lib/supabase';
import type { User } from '../lib/supabase';
import { fetchAndCacheLimits } from './limits';

// ─── User Profile Fallback Initialization ───────────────────────────────

/**
 * Checks if the user profile and usage limits exist in the database.
 * If the profile is missing, it will initialize it client-side.
 * It will also call the serverless endpoint to ensure usage limits are initialized.
 */
export async function checkAndInitializeProfile(user: User): Promise<void> {
  try {
    // 1. Check & Initialize public.user_profiles
    const { data: profile, error: profileSelectError } = await supabase
      .from('user_profiles')
      .select('id')
      .eq('id', user.id)
      .maybeSingle();

    if (profileSelectError) {
      console.error('[database] Error selecting user profile:', profileSelectError);
    }

    if (!profile) {
      console.log('[database] Profile missing for user. Initializing client-side fallback...');
      const { error: profileInsertError } = await supabase
        .from('user_profiles')
        .insert({
          id: user.id,
          email: user.email,
          full_name: user.user_metadata?.full_name || null,
          avatar_url: user.user_metadata?.avatar_url || null,
          plan: 'free',
        });

      if (profileInsertError) {
        console.error('[database] Client fallback profile initialization failed:', profileInsertError);
      } else {
        console.log('[database] Client fallback profile initialized successfully.');
      }
    }

    // 2. Trigger serverless limits initialization by getting limits
    await fetchAndCacheLimits();
  } catch (err) {
    console.error('[database] checkAndInitializeProfile exception:', err);
  }
}


// ─── Analysis History ───────────────────────────────────────────────────

export async function saveAnalysisHistory(
  inputText: string,
  analysisType: string,
  results: any
): Promise<{ data: any; error: Error | null }> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { data: null, error: new Error('User not logged in') };

    const { data, error } = await supabase
      .from('analysis_history')
      .insert({
        user_id: user.id,
        input_text: inputText,
        analysis_type: analysisType,
        results: results,
      })
      .select('*')
      .single();

    return { data, error: error ? new Error(error.message) : null };
  } catch (err) {
    return { data: null, error: err instanceof Error ? err : new Error('Unknown error saving history') };
  }
}

export async function getAnalysisHistory(): Promise<{ data: any[] | null; error: Error | null }> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { data: null, error: new Error('User not logged in') };

    const { data, error } = await supabase
      .from('analysis_history')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    return { data, error: error ? new Error(error.message) : null };
  } catch (err) {
    return { data: null, error: err instanceof Error ? err : new Error('Unknown error getting history') };
  }
}

export async function deleteAnalysisHistory(id: string): Promise<{ error: Error | null }> {
  try {
    const { error } = await supabase
      .from('analysis_history')
      .delete()
      .eq('id', id);

    return { error: error ? new Error(error.message) : null };
  } catch (err) {
    return { error: err instanceof Error ? err : new Error('Unknown error deleting history') };
  }
}


// ─── Agent Runs ─────────────────────────────────────────────────────────

export async function saveAgentRun(
  goal: string,
  executionLog: any,
  finalSummary: string | null,
  status: string
): Promise<{ data: any; error: Error | null }> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { data: null, error: new Error('User not logged in') };

    const { data, error } = await supabase
      .from('agent_runs')
      .insert({
        user_id: user.id,
        goal,
        execution_log: executionLog,
        final_summary: finalSummary,
        status,
      })
      .select('*')
      .single();

    return { data, error: error ? new Error(error.message) : null };
  } catch (err) {
    return { data: null, error: err instanceof Error ? err : new Error('Unknown error saving agent run') };
  }
}

export async function getAgentRuns(): Promise<{ data: any[] | null; error: Error | null }> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { data: null, error: new Error('User not logged in') };

    const { data, error } = await supabase
      .from('agent_runs')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    return { data, error: error ? new Error(error.message) : null };
  } catch (err) {
    return { data: null, error: err instanceof Error ? err : new Error('Unknown error getting agent runs') };
  }
}

export async function deleteAgentRun(id: string): Promise<{ error: Error | null }> {
  try {
    const { error } = await supabase
      .from('agent_runs')
      .delete()
      .eq('id', id);

    return { error: error ? new Error(error.message) : null };
  } catch (err) {
    return { error: err instanceof Error ? err : new Error('Unknown error deleting agent run') };
  }
}


// ─── Saved Outputs ───────────────────────────────────────────────────────

export async function saveOutput(
  title: string,
  content: string,
  outputType: string,
  metaData: any = {}
): Promise<{ data: any; error: Error | null }> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { data: null, error: new Error('User not logged in') };

    const { data, error } = await supabase
      .from('saved_outputs')
      .insert({
        user_id: user.id,
        title,
        content,
        output_type: outputType,
        meta_data: metaData,
      })
      .select('*')
      .single();

    return { data, error: error ? new Error(error.message) : null };
  } catch (err) {
    return { data: null, error: err instanceof Error ? err : new Error('Unknown error saving output') };
  }
}

export async function getSavedOutputs(): Promise<{ data: any[] | null; error: Error | null }> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { data: null, error: new Error('User not logged in') };

    const { data, error } = await supabase
      .from('saved_outputs')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    return { data, error: error ? new Error(error.message) : null };
  } catch (err) {
    return { data: null, error: err instanceof Error ? err : new Error('Unknown error getting saved outputs') };
  }
}

export async function deleteSavedOutput(id: string): Promise<{ error: Error | null }> {
  try {
    const { error } = await supabase
      .from('saved_outputs')
      .delete()
      .eq('id', id);

    return { error: error ? new Error(error.message) : null };
  } catch (err) {
    return { error: err instanceof Error ? err : new Error('Unknown error deleting saved output') };
  }
}

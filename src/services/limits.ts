/**
 * Sumalyze — Usage Limit Service
 * ─────────────────────────────────────────────────────────────
 * Tracks daily analysis counts per feature per guest user (localStorage)
 * and logged-in user (Supabase usage_limits table via serverless endpoints).
 */

import { supabase } from '../lib/supabase';
import { getDailyLimit, getAnalysisLimit } from '../lib/plans';

export const GUEST_LIMITS = {
  demo:      10,  // guest daily limit for the main demo analyzer
  tools:     15,  // guest daily limit for individual tools
  agent:      3,  // guest daily limit for agent mode
} as const;

export const LOGGED_IN_LIMITS = {
  tools:     50,  // logged-in daily limit for individual tools
  agent:     10,  // logged-in daily limit for agent mode
} as const;

export type LimitFeature = keyof typeof GUEST_LIMITS;

export interface ServerLimits {
  daily_tool_runs: number;
  daily_agent_runs: number;
  monthly_tool_runs: number;
  monthly_agent_runs: number;
  last_reset_date: string;
}

// ─── Server limits synchronization (async) ──────────────────────────────

/**
 * Fetches current limits from Netlify Function and caches them in sessionStorage
 */
export async function fetchAndCacheLimits(): Promise<ServerLimits | null> {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return null;

    const res = await fetch('/api/update-usage', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session.access_token}`,
      },
      body: JSON.stringify({ action: 'get_limits' }),
    });

    if (res.ok) {
      const data: ServerLimits = await res.json();
      sessionStorage.setItem('sz_supabase_limits', JSON.stringify(data));
      return data;
    }
  } catch (err) {
    console.error('[limits] Failed to fetch server limits:', err);
  }
  return null;
}

/**
 * Increments limits via Netlify Function and caches the updated counts
 */
export async function incrementServerUsage(
  action: 'increment_tool' | 'increment_agent'
): Promise<ServerLimits | null> {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return null;

    const res = await fetch('/api/update-usage', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session.access_token}`,
      },
      body: JSON.stringify({ action }),
    });

    if (res.ok) {
      const data: ServerLimits = await res.json();
      sessionStorage.setItem('sz_supabase_limits', JSON.stringify(data));
      return data;
    }
  } catch (err) {
    console.error('[limits] Failed to increment server limits:', err);
  }
  return null;
}


// ─── LocalStorage helpers for Guest tracking ────────────────────────────

function guestStorageKey(feature: LimitFeature): string {
  return `sz_usage_${feature}_${new Date().toDateString()}`;
}

export function getGuestUsageToday(feature: LimitFeature): number {
  try {
    return parseInt(localStorage.getItem(guestStorageKey(feature)) ?? '0', 10);
  } catch {
    return 0;
  }
}

export function incrementGuestUsage(feature: LimitFeature): void {
  try {
    const key = guestStorageKey(feature);
    const current = parseInt(localStorage.getItem(key) ?? '0', 10);
    localStorage.setItem(key, String(current + 1));
  } catch {}
}


// ─── Synchronous Client-side API ─────────────────────────────────────────

export function getUsageToday(feature: LimitFeature, isLoggedIn: boolean): number {
  if (isLoggedIn) {
    if (feature === 'demo') return 0;
    try {
      const cached = sessionStorage.getItem('sz_supabase_limits');
      if (cached) {
        const parsed: ServerLimits = JSON.parse(cached);
        return feature === 'agent' ? parsed.daily_agent_runs : parsed.daily_tool_runs;
      }
    } catch {}
    return 0;
  } else {
    return getGuestUsageToday(feature);
  }
}

export function incrementUsage(feature: LimitFeature, isLoggedIn: boolean): void {
  if (isLoggedIn) {
    // Logged in user updates are asynchronous and triggered inside page actions
    // via incrementServerUsage() to ensure database synchronization
  } else {
    incrementGuestUsage(feature);
  }
}

export function isLimitReached(feature: LimitFeature, isLoggedIn: boolean, plan: string = 'free'): boolean {
  const p = plan.toLowerCase();

  if (isLoggedIn) {
    if (feature === 'demo') return false;
    if (feature === 'agent' && p === 'free') return true;

    try {
      const cached = sessionStorage.getItem('sz_supabase_limits');
      if (cached) {
        const parsed: ServerLimits = JSON.parse(cached);
        const dailyTool = parsed.daily_tool_runs || 0;
        const dailyAgent = parsed.daily_agent_runs || 0;
        const totalDaily = dailyTool + dailyAgent;
        const dailyLimit = getDailyLimit(p);

        // 1. Enforce Daily Limit (total of tool + agent runs)
        if (totalDaily >= dailyLimit) {
          return true;
        }

        // 2. Enforce Monthly Limit (total of tool + agent runs)
        const monthlyTool = parsed.monthly_tool_runs || 0;
        const monthlyAgent = parsed.monthly_agent_runs || 0;
        const totalMonthly = monthlyTool + monthlyAgent;
        const monthlyLimit = getAnalysisLimit(p);
        if (totalMonthly >= monthlyLimit) {
          return true;
        }

        // TODO: Enforce monthly agent limit (e.g. Starter: 3, Pro: 50, Max: 150) once server supports resetting monthly counter.
      }
    } catch (err) {
      console.error('[limits] Failed to parse cached limits:', err);
    }
    return false;
  } else {
    // Guest is on Free plan
    if (feature === 'agent') return true;
    
    // Guest allows up to 3 analyses/day total (demo + tools)
    const demoUsage = getGuestUsageToday('demo');
    const toolsUsage = getGuestUsageToday('tools');
    const totalGuestUsage = demoUsage + toolsUsage;
    
    return totalGuestUsage >= GUEST_DAILY_LIMIT;
  }
}

export const GUEST_DAILY_LIMIT = 3;

export function getRemainingUses(feature: LimitFeature, isLoggedIn: boolean, plan: string = 'free'): number {
  const p = plan.toLowerCase();

  if (isLoggedIn) {
    if (feature === 'demo') return 999;
    if (feature === 'agent' && p === 'free') return 0;

    try {
      const cached = sessionStorage.getItem('sz_supabase_limits');
      if (cached) {
        const parsed: ServerLimits = JSON.parse(cached);
        const dailyTool = parsed.daily_tool_runs || 0;
        const dailyAgent = parsed.daily_agent_runs || 0;
        const totalDaily = dailyTool + dailyAgent;
        const dailyLimit = getDailyLimit(p);

        const monthlyTool = parsed.monthly_tool_runs || 0;
        const monthlyAgent = parsed.monthly_agent_runs || 0;
        const totalMonthly = monthlyTool + monthlyAgent;
        const monthlyLimit = getAnalysisLimit(p);

        const remainingDaily = Math.max(0, dailyLimit - totalDaily);
        const remainingMonthly = Math.max(0, monthlyLimit - totalMonthly);

        return Math.min(remainingDaily, remainingMonthly);
      }
    } catch {}
    return getDailyLimit(p);
  } else {
    if (feature === 'agent') return 0;
    
    const demoUsage = getGuestUsageToday('demo');
    const toolsUsage = getGuestUsageToday('tools');
    const totalGuestUsage = demoUsage + toolsUsage;
    
    return Math.max(0, GUEST_DAILY_LIMIT - totalGuestUsage);
  }
}

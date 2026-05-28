/**
 * Sumalyze — Usage Limit Service
 * ─────────────────────────────────────────────────────────────
 * Tracks daily analysis counts per feature per guest user (localStorage)
 * and logged-in user (Supabase usage_limits table via serverless endpoints).
 */

import { supabase } from '../lib/supabase';

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

export function isLimitReached(feature: LimitFeature, isLoggedIn: boolean): boolean {
  if (isLoggedIn) {
    if (feature === 'demo') return false;
    const limit = feature === 'agent' ? LOGGED_IN_LIMITS.agent : LOGGED_IN_LIMITS.tools;
    return getUsageToday(feature, true) >= limit;
  }
  return getGuestUsageToday(feature) >= GUEST_LIMITS[feature];
}

export function getRemainingUses(feature: LimitFeature, isLoggedIn: boolean): number {
  if (isLoggedIn) {
    if (feature === 'demo') return 999;
    const limit = feature === 'agent' ? LOGGED_IN_LIMITS.agent : LOGGED_IN_LIMITS.tools;
    return Math.max(0, limit - getUsageToday(feature, true));
  }
  return Math.max(0, GUEST_LIMITS[feature] - getGuestUsageToday(feature));
}

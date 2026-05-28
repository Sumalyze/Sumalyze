/**
 * Sumalyze — Usage Limit Service
 * ─────────────────────────────────────────────────────────────
 * Tracks daily analysis counts per feature per guest user.
 * Logged-in users get higher limits (enforced server-side later).
 *
 * Storage key format: `sz_usage_{feature}_{dateString}`
 * Example: `sz_usage_demo_Thu May 28 2026`
 */

export const LIMITS = {
  demo:      10,  // guest daily limit for the main demo analyzer
  tools:     15,  // guest daily limit for individual tools
  agent:      3,  // guest daily limit for agent mode
  loggedIn: 999,  // effectively unlimited for now
} as const;

export type LimitFeature = keyof typeof LIMITS;

function storageKey(feature: LimitFeature): string {
  return `sz_usage_${feature}_${new Date().toDateString()}`;
}

export function getUsageToday(feature: LimitFeature): number {
  try {
    return parseInt(localStorage.getItem(storageKey(feature)) ?? '0', 10);
  } catch {
    return 0;
  }
}

export function incrementUsage(feature: LimitFeature): void {
  try {
    const key = storageKey(feature);
    const current = parseInt(localStorage.getItem(key) ?? '0', 10);
    localStorage.setItem(key, String(current + 1));
  } catch {}
}

export function isLimitReached(feature: LimitFeature, isLoggedIn: boolean): boolean {
  if (isLoggedIn) return false;
  return getUsageToday(feature) >= LIMITS[feature];
}

export function getRemainingUses(feature: LimitFeature, isLoggedIn: boolean): number {
  if (isLoggedIn) return LIMITS.loggedIn;
  return Math.max(0, LIMITS[feature] - getUsageToday(feature));
}

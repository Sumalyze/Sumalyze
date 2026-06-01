// Sumalyze — Cookie Consent Utility
// src/lib/cookieConsent.ts

export interface CookieConsent {
  necessary: boolean;
  preferences: boolean;
  analytics: boolean;
  marketing: boolean;
}

const STORAGE_KEY = 'sumalyze_cookie_consent';

export const DEFAULT_CONSENT: CookieConsent = {
  necessary: true,
  preferences: false,
  analytics: false,
  marketing: false,
};

/**
 * Retrieves the saved cookie consent from local storage.
 * Returns null if the user has not made a decision yet.
 */
export function getCookieConsent(): CookieConsent | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return null;
    const parsed = JSON.parse(stored);
    return {
      necessary: true, // Always true
      preferences: !!parsed.preferences,
      analytics: !!parsed.analytics,
      marketing: !!parsed.marketing,
    };
  } catch (err) {
    console.error('[CookieConsent] Failed to parse stored consent:', err);
    return null;
  }
}

/**
 * Saves cookie consent to local storage and dispatches a change event.
 */
export function saveCookieConsent(consent: CookieConsent) {
  try {
    const valueToStore = {
      necessary: true, // Always true
      preferences: !!consent.preferences,
      analytics: !!consent.analytics,
      marketing: !!consent.marketing,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(valueToStore));
    
    // Dispatch custom event for real-time reactivity (e.g., initializing PostHog)
    window.dispatchEvent(new CustomEvent('sumalyze-cookie-consent-changed', {
      detail: valueToStore
    }));
  } catch (err) {
    console.error('[CookieConsent] Failed to save consent:', err);
  }
}

/**
 * Checks if analytics consent has been explicitly granted.
 */
export function hasAnalyticsConsent(): boolean {
  const consent = getCookieConsent();
  return consent ? consent.analytics : false;
}

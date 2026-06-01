// Sumalyze — PostHog Analytics Utility
// src/lib/analytics.ts

import posthog from 'posthog-js';
import { hasAnalyticsConsent } from './cookieConsent';

const ENABLE_ANALYTICS = import.meta.env.VITE_ENABLE_ANALYTICS === 'true';
const POSTHOG_KEY = import.meta.env.VITE_POSTHOG_KEY || '';
const POSTHOG_HOST = import.meta.env.VITE_POSTHOG_HOST || 'https://eu.i.posthog.com';

const isEnvConfigured = ENABLE_ANALYTICS && !!POSTHOG_KEY;
let initialized = false;

/**
 * Checks dynamically if analytics is both configured in env and consented to by the user.
 */
function isAnalyticsActive(): boolean {
  return isEnvConfigured && hasAnalyticsConsent();
}

/**
 * Initializes the PostHog client if consent is given.
 * Enforces strict privacy rules: autocapture off, session recording off, manual pageviews only.
 */
export function initAnalytics() {
  if (!isAnalyticsActive()) {
    if (import.meta.env.DEV) {
      console.log('[Analytics] PostHog is disabled or lacks user consent.');
    }
    return;
  }

  if (initialized) return;

  try {
    posthog.init(POSTHOG_KEY, {
      api_host: POSTHOG_HOST,
      autocapture: false,
      capture_pageview: false, // Manually handled by capturePageView
      disable_session_recording: true,
      persistence: 'localStorage',
    });
    initialized = true;

    if (import.meta.env.DEV) {
      console.log('[Analytics] PostHog initialized successfully.');
    }
  } catch (err) {
    console.error('[Analytics] Failed to initialize PostHog:', err);
  }
}

interface UserIdentifyInfo {
  id: string;
  email?: string | null;
  createdAt?: string | null;
  plan?: string | null;
}

/**
 * Identifies a logged-in user securely.
 * To protect user privacy, it does NOT track the full email address; only the domain name is recorded.
 */
export function identifyUser(user: UserIdentifyInfo) {
  if (!isAnalyticsActive()) return;
  if (!initialized) initAnalytics();

  try {
    const domain = user.email && user.email.includes('@') 
      ? user.email.split('@')[1] 
      : undefined;

    const traits: Record<string, any> = {
      plan: user.plan || 'free',
    };

    if (domain) {
      traits.email_domain = domain;
    }
    if (user.createdAt) {
      traits.created_at = user.createdAt;
    }

    posthog.identify(user.id, traits);

    if (import.meta.env.DEV) {
      console.log('[Analytics] User identified:', user.id, traits);
    }
  } catch (err) {
    console.error('[Analytics] Failed to identify user in PostHog:', err);
  }
}

/**
 * Resets user identification on logout.
 */
export function resetAnalytics() {
  if (!isAnalyticsActive()) return;

  try {
    posthog.reset();
    if (import.meta.env.DEV) {
      console.log('[Analytics] PostHog reset.');
    }
  } catch (err) {
    console.error('[Analytics] Failed to reset PostHog:', err);
  }
}

/**
 * Captures a custom tracking event safely.
 */
export function captureEvent(name: string, properties?: Record<string, any>) {
  if (!isAnalyticsActive()) return;
  if (!initialized) initAnalytics();

  try {
    // Filter undefined or null values to prevent sending noisy properties
    const cleanProps: Record<string, any> = {};
    if (properties) {
      for (const [key, value] of Object.entries(properties)) {
        if (value !== undefined && value !== null) {
          cleanProps[key] = value;
        }
      }
    }

    posthog.capture(name, cleanProps);

    if (import.meta.env.DEV) {
      console.log(`[Analytics] Event captured: ${name}`, cleanProps);
    }
  } catch (err) {
    console.error(`[Analytics] Failed to capture event "${name}":`, err);
  }
}

/**
 * Captures page view event.
 */
export function capturePageView(path: string, title?: string) {
  if (!isAnalyticsActive()) return;
  if (!initialized) initAnalytics();

  try {
    posthog.capture('$pageview', {
      $current_url: window.location.href,
      $pathname: path,
      $title: title,
    });

    if (import.meta.env.DEV) {
      console.log(`[Analytics] PageView captured: ${path} (${title})`);
    }
  } catch (err) {
    console.error('[Analytics] Failed to capture pageview:', err);
  }
}

// ─── Privacy-safe Bucket Helpers ─────────────────────────────────────────────

/**
 * Buckets text length to protect raw content sizes.
 */
export function getInputLengthBucket(length: number): string {
  if (length <= 500) return '0–500';
  if (length <= 2000) return '501–2k';
  if (length <= 10000) return '2k–10k';
  return '10k+';
}

/**
 * Buckets file size to protect raw document metrics.
 */
export function getFileSizeBucket(bytes: number): string {
  if (bytes < 10240) return '<10KB';
  if (bytes < 102400) return '10KB-100KB';
  if (bytes < 1048576) return '100KB-1MB';
  if (bytes < 5242880) return '1MB-5MB';
  return '>5MB';
}

/**
 * Buckets task execution duration.
 */
export function getDurationBucket(ms: number): string {
  const seconds = ms / 1000;
  if (seconds < 1) return '<1s';
  if (seconds < 3) return '1s-3s';
  if (seconds < 7) return '3s-7s';
  if (seconds < 15) return '7s-15s';
  return '>15s';
}

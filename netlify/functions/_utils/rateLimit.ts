import { Redis } from '@upstash/redis';
import { Ratelimit } from '@upstash/ratelimit';

interface NLEvent {
  headers: Record<string, string | undefined>;
  [key: string]: any;
}

export interface RateLimitResult {
  allowed: boolean;
  limit?: number;
  remaining?: number;
  reset?: number;
  error?: string;
  statusCode?: number;
}

let redis: Redis | null = null;
let feedbackLimiter: Ratelimit | null = null;
let guestAnalyzeLimiter: Ratelimit | null = null;
let userAnalyzeLimiter: Ratelimit | null = null;
let teamWaitlistLimiter: Ratelimit | null = null;

/**
 * Initializes Upstash Redis clients and rate limiters.
 * Returns true if successful, false if credentials are missing.
 */
function initLimiters(): boolean {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (!url || !token) {
    return false;
  }

  if (!redis) {
    try {
      redis = new Redis({
        url,
        token,
      });

      // Feedback submission rate limiter: 5 submissions per 10 minutes per IP
      feedbackLimiter = new Ratelimit({
        redis,
        limiter: Ratelimit.slidingWindow(5, '10 m'),
        prefix: 'sumalyze:feedback:ip',
      });

      // Guest AI Analysis rate limiter: 3 requests per 1 hour per IP
      guestAnalyzeLimiter = new Ratelimit({
        redis,
        limiter: Ratelimit.slidingWindow(3, '1 h'),
        prefix: 'sumalyze:analyze:ip',
      });

      // Logged-in User AI Analysis rate limiter: 20 requests per 24 hours per User ID
      userAnalyzeLimiter = new Ratelimit({
        redis,
        limiter: Ratelimit.slidingWindow(20, '24 h'),
        prefix: 'sumalyze:analyze:user',
      });

      // Team Waitlist rate limiter: 5 submissions per 10 minutes per IP
      teamWaitlistLimiter = new Ratelimit({
        redis,
        limiter: Ratelimit.slidingWindow(5, '10 m'),
        prefix: 'sumalyze:teamwaitlist:ip',
      });
    } catch (err) {
      console.error('[RateLimit] Failed to initialize Upstash Redis clients:', err);
      return false;
    }
  }

  return true;
}

/**
 * Extracts the client IP from Netlify request headers.
 */
export function getClientIp(event: NLEvent): string {
  const headers = event.headers || {};

  // 1. x-nf-client-connection-ip
  let ip = headers['x-nf-client-connection-ip'];
  if (ip && ip.trim()) return ip.trim();

  // 2. x-forwarded-for (pick the first IP from comma-separated list)
  const xForwardedFor = headers['x-forwarded-for'];
  if (xForwardedFor && xForwardedFor.trim()) {
    const parts = xForwardedFor.split(',');
    if (parts.length > 0 && parts[0]) {
      return parts[0].trim();
    }
  }

  // 3. client-ip
  ip = headers['client-ip'];
  if (ip && ip.trim()) return ip.trim();

  return 'unknown';
}

/**
 * Checks rate limits for feedback submissions.
 */
export async function rateLimitFeedback(event: NLEvent): Promise<RateLimitResult> {
  const enableRateLimits = process.env.ENABLE_RATE_LIMITS === 'true';

  if (!enableRateLimits) {
    return { allowed: true };
  }

  const initialized = initLimiters();
  if (!initialized || !feedbackLimiter) {
    console.error('[RateLimit] Upstash Redis environment variables are missing while ENABLE_RATE_LIMITS=true.');
    return {
      allowed: false,
      error: 'Rate limiting service is not configured on the server.',
      statusCode: 500,
    };
  }

  const ip = getClientIp(event);
  try {
    const { success, limit, remaining, reset } = await feedbackLimiter.limit(ip);
    return {
      allowed: success,
      limit,
      remaining,
      reset,
    };
  } catch (err: any) {
    console.error('[RateLimit] Upstash Redis feedback check failed:', err.message || err);
    // Graceful fail-open on transient Redis network/server errors
    return { allowed: true };
  }
}

/**
 * Prepares rate limit check for AI endpoints.
 *
 * TODO/Future AI Limiter Wiring:
 * - Wire this helper inside `netlify/functions/ai-analyze.ts` (around lines 440-455)
 * - Pass guest events directly: `await rateLimitAnalyze(event)`
 * - Pass logged-in free user runs: `await rateLimitAnalyze(event, user.id)`
 */
export async function rateLimitAnalyze(
  event: NLEvent,
  userId?: string
): Promise<RateLimitResult> {
  const enableRateLimits = process.env.ENABLE_RATE_LIMITS === 'true';

  if (!enableRateLimits) {
    return { allowed: true };
  }

  const initialized = initLimiters();
  if (!initialized || !guestAnalyzeLimiter || !userAnalyzeLimiter) {
    console.error('[RateLimit] Upstash Redis environment variables are missing while ENABLE_RATE_LIMITS=true.');
    return {
      allowed: false,
      error: 'Rate limiting service is not configured on the server.',
      statusCode: 500,
    };
  }

  try {
    if (userId) {
      const { success, limit, remaining, reset } = await userAnalyzeLimiter.limit(userId);
      return {
        allowed: success,
        limit,
        remaining,
        reset,
      };
    } else {
      const ip = getClientIp(event);
      const { success, limit, remaining, reset } = await guestAnalyzeLimiter.limit(ip);
      return {
        allowed: success,
        limit,
        remaining,
        reset,
      };
    }
  } catch (err: any) {
    console.error('[RateLimit] Upstash Redis AI check failed:', err.message || err);
    // Graceful fail-open on transient Redis network/server errors
    return { allowed: true };
  }
}

/**
 * Checks rate limits for Team Waitlist submissions.
 */
export async function rateLimitTeamWaitlist(event: NLEvent): Promise<RateLimitResult> {
  const enableRateLimits = process.env.ENABLE_RATE_LIMITS === 'true';

  if (!enableRateLimits) {
    return { allowed: true };
  }

  const initialized = initLimiters();
  if (!initialized || !teamWaitlistLimiter) {
    console.error('[RateLimit] Upstash Redis environment variables are missing while ENABLE_RATE_LIMITS=true.');
    return {
      allowed: false,
      error: 'Rate limiting service is not configured on the server.',
      statusCode: 500,
    };
  }

  const ip = getClientIp(event);
  try {
    const { success, limit, remaining, reset } = await teamWaitlistLimiter.limit(ip);
    return {
      allowed: success,
      limit,
      remaining,
      reset,
    };
  } catch (err: any) {
    console.error('[RateLimit] Upstash Redis team waitlist check failed:', err.message || err);
    // Graceful fail-open on transient Redis network/server errors
    return { allowed: true };
  }
}

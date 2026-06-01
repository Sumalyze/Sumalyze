// src/lib/billing.ts
import type { PlanId, SubscriptionStatus, UserSubscription } from '../types/billing';

/**
 * Normalizes any value into a valid PlanId, falling back to 'free'.
 */
export function normalizePlan(plan: unknown): PlanId {
  if (typeof plan !== 'string') return 'free';
  const p = plan.toLowerCase().trim();
  if (p === 'starter' || p === 'pro' || p === 'max') {
    return p as PlanId;
  }
  return 'free';
}

/**
 * Checks if a normalized plan is a paid tier.
 */
export function isPaidPlan(plan: unknown): boolean {
  const normalized = normalizePlan(plan);
  return normalized !== 'free';
}

/**
 * Returns true if a subscription status represents an active or trialing membership.
 */
export function isActiveSubscription(status: unknown): boolean {
  if (typeof status !== 'string') return false;
  const s = status.toLowerCase().trim();
  return s === 'active' || s === 'trialing';
}

/**
 * Evaluates the effective active plan of a user subscription.
 * Handles checks for status logic, trialing periods, grace warnings for past_due,
 * and falls back to 'free' for inactive, paused, or canceled plans.
 */
export function getEffectivePlan(subscription: UserSubscription | null | undefined): PlanId {
  if (!subscription) return 'free';

  const plan = normalizePlan(subscription.plan);
  const status: SubscriptionStatus = subscription.status;

  // 1. Fully active or trialing
  if (status === 'active' || status === 'trialing') {
    return plan;
  }

  // 2. Past due billing
  if (status === 'past_due') {
    // TODO: Define soft grace period policy (e.g., allow Pro features for 3 days after fail)
    // For now, warn in logs but let features remain active in fallback
    console.warn(`[Billing] Subscription for user ${subscription.user_id} is past due. Retaining ${plan} tier during grace period.`);
    return plan;
  }

  // 3. Canceled, paused, inactive, free, or unknown fallback
  return 'free';
}

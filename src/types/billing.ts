// src/types/billing.ts

export type PlanId = 'free' | 'starter' | 'pro' | 'max';

export type BillingInterval = 'monthly' | 'annual';

export type SubscriptionStatus =
  | 'free'
  | 'trialing'
  | 'active'
  | 'past_due'
  | 'canceled'
  | 'paused'
  | 'inactive';

export interface UserSubscription {
  id: string;
  user_id: string;
  plan: PlanId;
  status: SubscriptionStatus;
  billing_interval: BillingInterval | null;
  paddle_customer_id: string | null;
  paddle_subscription_id: string | null;
  paddle_price_id: string | null;
  current_period_start: string | null;
  current_period_end: string | null;
  trial_ends_at: string | null;
  cancel_at_period_end: boolean;
  created_at: string;
  updated_at: string;
}

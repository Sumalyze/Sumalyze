# Sumalyze — Billing Foundation Architecture

This document describes the foundation laid out in the database and codebase to prepare Sumalyze for recurring billing via Paddle.

## Database Schema (`supabase/billing_schema.sql`)

### 1. `subscriptions` Table
* **Purpose:** Stores the current, active subscription state for each user. It maps user profiles to active plans.
* **Security:** Row Level Security (RLS) is enabled. Normal frontend clients are permitted to read (`SELECT`) their own subscription record only (`auth.uid() = user_id`). No client-side write permissions (`INSERT`, `UPDATE`, or `DELETE`) are allowed, which prevents malicious tier spoofing. Writes must occur server-side.

### 2. `paddle_events` Table
* **Purpose:** Acts as a webhook audit log and deduplication ledger. Each incoming webhook event from Paddle will be recorded here to ensure idempotency.
* **Security:** Row Level Security (RLS) is enabled with zero public/client policies. Normal frontend clients cannot read or write to this table. Access is restricted to superuser / service role credentials.

## Code Integration

### TypeScript Types (`src/types/billing.ts`)
* Defines `PlanId = 'free' | 'starter' | 'pro' | 'max'`
* Defines `SubscriptionStatus` states matching the check constraints in SQL.
* Exports `UserSubscription` interface for safe, typed properties.

### Billing Utilities (`src/lib/billing.ts`)
* `normalizePlan(plan)`: Normalizes dynamic inputs to a valid `PlanId`.
* `isPaidPlan(plan)`: Checks if a plan requires active payment.
* `isActiveSubscription(status)`: Verifies if a subscription status allows workspace tools to run.
* `getEffectivePlan(subscription)`: Computes actual tier status with fallback to Free for canceled/inactive accounts, and manages warnings for past_due billing grace periods.

### Frontend Integration (`src/pages/SettingsPage.tsx`)
* Queries `subscriptions` table. If the database tables have not been created yet or the select throws a PostgreSQL error, it falls back gracefully to `user_profiles` table, showing the default `Free / Active` state without crashing the settings module.

---

## Future Implementation Roadmap

When ready to go live with Paddle payments, follow these steps:

1. **Configure Paddle Dashboard:** Establish products and price IDs in the Paddle sandbox/production dashboard and map them to Starter, Pro, and Max plans.
2. **Add Client Checkout:** Integrate Paddle.js or SDK on the `/pricing` page, passing user emails, customer IDs, and metadata.
3. **Deploy Webhook Handler:** Implement a serverless endpoint `/api/paddle-webhook` to verify Paddle signatures using `PADDLE_WEBHOOK_SECRET`.
4. **Process Webhook Events:**
   - Verify if `event_id` exists in `paddle_events` to prevent duplicate operations.
   - Update user rows in `subscriptions` (or create them) on subscription lifecycle events (`subscription.created`, `subscription.updated`, `subscription.canceled`, etc.).
5. **Enable Customer Portal:** Map customer manage links so users can update cards, view invoices, or cancel plans.

// src/hooks/useCurrentPlan.ts
import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { supabase } from '../lib/supabase';
import type { PlanId, UserSubscription } from '../types/billing';
import { getEffectivePlan } from '../lib/billing';

export function useCurrentPlan() {
  const { user } = useAuth();
  const [plan, setPlan] = useState<PlanId>('free');
  const [loading, setLoading] = useState<boolean>(true);
  const [subscription, setSubscription] = useState<UserSubscription | null>(null);

  useEffect(() => {
    let isMounted = true;
    if (!user) {
      setPlan('free');
      setSubscription(null);
      setLoading(false);
      return;
    }

    const userId = user.id;

    async function fetchSubscription() {
      try {
        const { data, error } = await supabase
          .from('subscriptions')
          .select('*')
          .eq('user_id', userId)
          .maybeSingle();

        if (!isMounted) return;

        if (error) {
          console.error('[useCurrentPlan] Failed to query subscriptions:', error);
          setPlan('free');
          setSubscription(null);
        } else if (data) {
          const typedSub = data as UserSubscription;
          setSubscription(typedSub);
          
          if (typedSub.status === 'past_due') {
            // Keep conservative behavior: fallback to Free for past_due
            // TODO: Implement a soft grace period (e.g. 3 days) where users keep access
            setPlan('free');
          } else {
            setPlan(getEffectivePlan(typedSub));
          }
        } else {
          setPlan('free');
          setSubscription(null);
        }
      } catch (err) {
        console.error('[useCurrentPlan] Unexpected error fetching subscription:', err);
        if (isMounted) {
          setPlan('free');
          setSubscription(null);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    fetchSubscription();

    return () => {
      isMounted = false;
    };
  }, [user]);

  return { plan, loading, subscription };
}

'use client';

import type { Plan } from './pricing.types';
import { PricingPlanCard } from './pricing-plan-card';

export const PricingPlans = ({ plans }: { plans: Plan[] }) => {
  return (
    <div className='mt-8 grid gap-6 md:grid-cols-3'>
      {plans.map((p) => (
        <PricingPlanCard key={p.slug} plan={p} />
      ))}
    </div>
  );
};

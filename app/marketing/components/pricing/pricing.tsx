'use client';

import React from 'react';

import { Section } from '../section';
import { PLANS_MARKETING } from './pricing.data';
import type { Plan, PricingApiResponse } from './pricing.types';
import { PricingHeader } from './pricing-header';
import { PricingNote } from './pricing-note';
import { PricingPlans } from './pricing-plans';

export const Pricing = () => {
  const [plans, setPlans] = React.useState<Plan[]>([]);

  React.useEffect(() => {
    let alive = true;

    const load = async () => {
      const res = await fetch('/api/pricing', { cache: 'no-store' });
      const json = (await res.json()) as PricingApiResponse;

      const merged: Plan[] = PLANS_MARKETING.map((m) => {
        const apiItem = json.data.find((x) => x.slug === m.slug);
        const price = apiItem?.price;

        return {
          slug: m.slug,
          name: apiItem?.name ?? m.name,
          subtitle: m.subtitle,
          forWho: m.forWho,
          features: m.features,
          priceHint: m.priceHint,
          highlight: m.highlight,
          badge: m.badge,

          unitAmount: price?.unitAmount ?? 0,
          stripePriceId: price?.stripePriceId ?? '',
        };
      });

      if (alive) setPlans(merged);
    };

    load().catch(console.error);

    return () => {
      alive = false;
    };
  }, []);
  return (
    <Section id='precos' className='bg-primary py-12 md:py-16'>
      <div className='mx-auto max-w-6xl px-6'>
        <PricingHeader />
        <PricingPlans plans={plans} />
        <PricingNote />
      </div>
    </Section>
  );
};

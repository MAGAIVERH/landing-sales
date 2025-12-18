'use client';

import { Section } from '../section';

import { PLANS } from './pricing.data';
import { PricingHeader } from './pricing-header';
import { PricingPlans } from './pricing-plans';
import { PricingNote } from './pricing-note';

export const Pricing = () => {
  return (
    <Section id='precos' className='bg-primary py-12 md:py-16'>
      <div className='mx-auto max-w-6xl px-6'>
        <PricingHeader />
        <PricingPlans plans={PLANS} />
        <PricingNote />
      </div>
    </Section>
  );
};

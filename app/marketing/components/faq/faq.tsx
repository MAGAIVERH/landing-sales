'use client';

import { Section } from '../section';
import { FAQ_ITEMS } from './faq.data';
import { FaqAccordion } from './faq-accordion';
import { FaqCta } from './faq-cta';
import { FaqHeader } from './faq-header';

export const FAQ = () => {
  return (
    <Section id='faq' className='bg-background py-4 md:py-8'>
      <div className='mx-auto max-w-6xl px-6'>
        <FaqHeader />

        <div className='mx-auto mt-10 max-w-3xl'>
          <div className='relative'>
            <div className='absolute -inset-6 -z-10 rounded-3xl bg-primary/15 blur-2xl' />

            <div className='rounded-3xl border bg-background p-2 shadow-sm md:p-3'>
              <div className='rounded-2xl border bg-card p-2 md:p-3'>
                <FaqAccordion items={FAQ_ITEMS} />
              </div>

              <FaqCta />
            </div>
          </div>

          <p className='mt-3 text-center text-xs text-muted-foreground'>
            Transparência total: se algo não fizer sentido para o seu caso, a
            gente te orienta antes de qualquer decisão.
          </p>
        </div>
      </div>
    </Section>
  );
};

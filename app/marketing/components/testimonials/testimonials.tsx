'use client';

import { Section } from '../section';
import { TESTIMONIAL_ITEMS } from './testimonials.data';
import { TestimonialsCard } from './testimonials-card';
import { TestimonialsCopy } from './testimonials-copy';

export const Testimonials = () => {
  return (
    <Section id='depoimentos' className='bg-primary py-12 md:py-14'>
      <div className='mx-auto max-w-6xl px-6'>
        <div className='grid gap-10 lg:grid-cols-2 lg:items-center'>
          {/* Copy */}
          <TestimonialsCopy />

          {/* Card */}
          <TestimonialsCard items={TESTIMONIAL_ITEMS} />
        </div>
      </div>
    </Section>
  );
};

'use client';

import { Avatar } from './avatar';
import type { Testimonial } from './social-proof.types';

export const SocialProofTestimonials = ({
  testimonials,
}: {
  testimonials: Testimonial[];
}) => {
  return (
    <div className='relative mt-10 grid gap-6 md:grid-cols-3'>
      {testimonials.map((t) => (
        <div
          key={t.name}
          className='rounded-3xl bg-background text-foreground shadow-sm ring-1 ring-background/20'
        >
          <div className='p-6'>
            <p className='text-sm leading-relaxed text-muted-foreground'>
              “{t.quote}”
            </p>

            <div className='mt-6 flex items-center gap-3'>
              <Avatar src={t.imageSrc} alt={t.name} initials={t.initials} />

              <div className='leading-tight'>
                <p className='text-sm font-semibold'>{t.name}</p>
                <p className='text-xs text-muted-foreground'>{t.role}</p>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

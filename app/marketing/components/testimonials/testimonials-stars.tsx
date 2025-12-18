'use client';

import { Star } from 'lucide-react';

export const TestimonialsStars = ({ value = 5 }: { value?: number }) => {
  return (
    <div className='flex items-center gap-1'>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={String(i)}
          className='h-4 w-4 text-primary'
          fill={i < value ? 'currentColor' : 'none'}
        />
      ))}
    </div>
  );
};

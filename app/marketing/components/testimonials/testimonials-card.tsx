'use client';

import Image from 'next/image';
import * as React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';

import type { TestimonialItem } from './testimonials.types';
import { TestimonialsStars } from './testimonials-stars';

export const TestimonialsCard = ({ items }: { items: TestimonialItem[] }) => {
  const [index, setIndex] = React.useState(0);
  const current = items[index];

  const handlePrev = () =>
    setIndex((prev) => (prev === 0 ? items.length - 1 : prev - 1));

  const handleNext = () =>
    setIndex((prev) => (prev === items.length - 1 ? 0 : prev + 1));

  return (
    <div className='relative'>
      <div className='absolute -inset-6 -z-10 rounded-3xl bg-primary-foreground/10 blur-2xl' />

      <Card className='overflow-hidden rounded-3xl border-primary-foreground/15 bg-background p-5 shadow-sm md:p-7'>
        <div className='flex items-start justify-between gap-4'>
          <div className='min-w-0'>
            <p className='text-sm font-semibold'>Resultados na prática</p>
            <p className='mt-1 text-sm text-muted-foreground'>
              O que muda no dia a dia após a implantação.
            </p>
          </div>

          <Badge className='shrink-0 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary'>
            Avaliação alta
          </Badge>
        </div>

        {/* Conteúdo com transição ao trocar index */}
        <div
          key={index}
          className='mt-2 grid gap-5 animate-in fade-in duration-200'
        >
          <div className='flex items-center gap-4'>
            <div className='relative h-14 w-14 overflow-hidden rounded-4xl border bg-muted'>
              <Image
                src={current.avatar}
                alt={current.name}
                fill
                className='object-cover'
              />
            </div>

            <div className='min-w-0'>
              <p className='text-sm font-semibold leading-none'>
                {current.name}
              </p>
              <p className='mt-1 text-sm text-muted-foreground'>
                {current.role}
              </p>
            </div>

            <div className='ml-auto hidden sm:block'>
              <TestimonialsStars value={5} />
            </div>
          </div>

          <div className='rounded-2xl border bg-card p-4 md:p-5'>
            <p className='text-sm leading-relaxed text-muted-foreground'>
              <span className='mr-1 font-semibold text-foreground'>“</span>
              {current.text}
              <span className='ml-1 font-semibold text-foreground'>”</span>
            </p>
          </div>

          <div className='flex items-center gap-2'>
            <Button
              variant='outline'
              size='icon'
              onClick={handlePrev}
              aria-label='Ver depoimento anterior'
            >
              <ChevronLeft className='h-4 w-4' />
            </Button>

            <Button
              variant='outline'
              size='icon'
              onClick={handleNext}
              aria-label='Ver próximo depoimento'
            >
              <ChevronRight className='h-4 w-4' />
            </Button>

            <div className='ml-auto flex items-center gap-1.5'>
              {items.map((_, i) => (
                <span
                  key={String(i)}
                  className={[
                    'h-2 w-2 rounded-full transition',
                    i === index ? 'bg-primary' : 'bg-muted',
                  ].join(' ')}
                />
              ))}
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

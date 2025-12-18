'use client';

import { Card } from '@/components/ui/card';
import type { Step } from './how-it-works.types';

export const HowItWorksSteps = ({ steps }: { steps: Step[] }) => {
  return (
    <div className='mt-8 grid gap-6 md:grid-cols-3 md:gap-6'>
      {steps.map((s) => (
        <Card
          key={s.number}
          className='rounded-2xl border-border bg-background/95 p-4 shadow-sm backdrop-blur md:p-4 '
        >
          <div className='flex items-start justify-between gap-2'>
            <div className='inline-flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary'>
              <s.icon className='h-5 w-5' />
            </div>

            <span className='text-xs font-semibold tracking-wide text-muted-foreground'>
              {s.number}
            </span>
          </div>

          <h3 className=' text-lg font-semibold tracking-tight'>{s.title}</h3>
          <p className=' text-sm text-muted-foreground'>{s.desc}</p>
        </Card>
      ))}
    </div>
  );
};

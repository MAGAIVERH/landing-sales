'use client';

import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';

import type { ShowcaseSegment } from './showcase.types';
import { ShowcaseTabs } from './showcase-tabs';

export const ShowcasePreview = ({
  segments,
}: {
  segments: ShowcaseSegment[];
}) => {
  return (
    <div className='relative'>
      <div className='absolute -inset-6 -z-10 rounded-3xl bg-primary/15 blur-2xl' />

      <Card className='overflow-hidden rounded-3xl border bg-background p-2 shadow-sm md:p-6'>
        <div className='flex items-center justify-between gap-3'>
          <div className='min-w-0'>
            <p className='text-sm font-semibold'>Preview da experiência</p>
            <p className='mt-1 text-sm text-muted-foreground'>
              Prints reais (mobile). Arraste para o lado para ver as telas.
            </p>
          </div>

          <Badge className='shrink-0 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary'>
            Mobile-first
          </Badge>
        </div>

        <ShowcaseTabs segments={segments} />
      </Card>
    </div>
  );
};

import * as React from 'react';
import type { ElementType } from 'react';

import { Card } from '@/components/ui/card';

type Props = {
  label: string;
  value: string;
  helper?: string;
  icon: ElementType;
  tone: 'c1' | 'c2' | 'c3' | 'c4';
};

export const DashboardHomeKpiCard = ({
  label,
  value,
  helper,
  icon: Icon,
  tone,
}: Props) => {
  const toneStyles = {
    c1: {
      border: 'border-chart-1/35',
      bar: 'bg-chart-1',
      iconBg: 'bg-chart-1/15',
      iconFg: 'text-chart-1',
    },
    c2: {
      border: 'border-chart-2/35',
      bar: 'bg-chart-2',
      iconBg: 'bg-chart-2/15',
      iconFg: 'text-chart-2',
    },
    c3: {
      border: 'border-chart-3/35',
      bar: 'bg-chart-3',
      iconBg: 'bg-chart-3/15',
      iconFg: 'text-chart-3',
    },
    c4: {
      border: 'border-chart-4/35',
      bar: 'bg-chart-4',
      iconBg: 'bg-chart-4/15',
      iconFg: 'text-chart-4',
    },
  }[tone];

  return (
    <Card
      className={[
        'relative overflow-hidden rounded-2xl border p-4 shadow-sm',
        'sm:p-4',
        toneStyles.border,
      ].join(' ')}
    >
      <div
        className={['absolute left-0 top-0 h-full w-1.5', toneStyles.bar].join(
          ' ',
        )}
      />

      <div className='flex items-start justify-between gap-3'>
        <div className='min-w-0'>
          <p className='text-sm text-muted-foreground'>{label}</p>
          <p className='mt-1 text-xl font-semibold leading-none sm:text-2xl'>
            {value}
          </p>
          {helper ? (
            <p className='mt-2 text-xs text-muted-foreground'>{helper}</p>
          ) : null}
        </div>

        <div
          className={[
            'grid h-10 w-10 shrink-0 place-items-center rounded-xl',
            toneStyles.iconBg,
          ].join(' ')}
        >
          <Icon className={['h-5 w-5', toneStyles.iconFg].join(' ')} />
        </div>
      </div>
    </Card>
  );
};

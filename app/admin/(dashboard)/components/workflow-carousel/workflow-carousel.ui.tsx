'use client';

import * as React from 'react';

import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

export const Pill = ({
  active,
  onClick,
  icon: Icon,
  title,
  count,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ElementType;
  title: string;
  count: number;
}) => {
  return (
    <button
      type='button'
      onClick={onClick}
      className={[
        'flex items-center gap-2 rounded-full border px-3 py-2 text-sm transition-colors',
        'outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
        'focus-visible:ring-offset-background',
        'active:translate-y-0',
        'disabled:pointer-events-none disabled:opacity-50',
        active
          ? 'bg-primary text-primary-foreground border-primary/30 hover:bg-primary/90 active:bg-primary/90 focus:bg-primary/90'
          : 'bg-background hover:bg-muted/40 active:bg-muted/40 focus:bg-muted/40',
        '[-webkit-tap-highlight-color:transparent]',
      ].join(' ')}
    >
      <Icon className='h-4 w-4' />
      <span className='font-medium'>{title}</span>
      <Badge
        variant={active ? 'secondary' : 'outline'}
        className={active ? 'bg-background/15 text-primary-foreground' : ''}
      >
        {count}
      </Badge>
    </button>
  );
};

export const ListShell = ({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}) => {
  return (
    <Card className='rounded-2xl border bg-card shadow-sm'>
      <div className='px-4 py-2 sm:px-5 sm:py-2'>
        <div className='flex items-start justify-between gap-3'>
          <div>
            <p className='text-sm font-semibold'>{title}</p>
            <p className='mt-1 text-xs text-muted-foreground'>{subtitle}</p>
          </div>
        </div>
      </div>

      <Separator />

      <div className='px-4 py-2 sm:px-5 '>
        {children}
        {footer ? <div className='mt-4 flex justify-end'>{footer}</div> : null}
      </div>
    </Card>
  );
};

export const Row = ({
  title,
  subtitle,
  right,
}: {
  title: string;
  subtitle: string;
  right: React.ReactNode;
}) => {
  return (
    <div className='flex items-start justify-between gap-3 rounded-xl border bg-background px-3 py-3'>
      <div className='min-w-0 flex-1'>
        <p className='truncate text-sm font-medium'>{title}</p>

        <p className='mt-0.5 line-clamp-2 text-xs text-muted-foreground wrap-break-word '>
          {subtitle}
        </p>
      </div>

      <div className='shrink-0'>{right}</div>
    </div>
  );
};

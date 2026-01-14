import * as React from 'react';

import { Badge } from '@/components/ui/badge';

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
        'outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
        'active:translate-y-0 disabled:pointer-events-none disabled:opacity-50',
        active
          ? 'bg-primary text-primary-foreground border-primary/30 hover:bg-primary/90 active:bg-primary/90'
          : 'bg-background hover:bg-muted/40 active:bg-muted/40',
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

export const Row = ({
  left,
  right,
  muted,
}: {
  left: React.ReactNode;
  right: React.ReactNode;
  muted?: boolean;
}) => {
  return (
    <div
      className={[
        'flex items-start justify-between gap-3 rounded-xl border px-4 py-3',
        muted ? 'opacity-70' : '',
      ].join(' ')}
    >
      <div className='min-w-0 flex-1'>{left}</div>
      <div className='shrink-0'>{right}</div>
    </div>
  );
};

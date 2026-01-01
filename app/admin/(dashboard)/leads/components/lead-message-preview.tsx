'use client';

import * as React from 'react';

import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card';

type Props = {
  message: string;
};

export const LeadMessagePreview = ({ message }: Props) => {
  const hasMessage = Boolean(message?.trim());

  if (!hasMessage) {
    return <p className='text-muted-foreground'>Sem mensagem</p>;
  }

  return (
    <HoverCard openDelay={200} closeDelay={100}>
      <HoverCardTrigger asChild>
        <button
          type='button'
          className='w-full min-w-0 text-left text-muted-foreground hover:underline focus:underline'
          aria-label='Ver mensagem completa'
        >
          <span
            className='block max-w-[320px] overflow-hidden text-ellipsis'
            style={{
              display: '-webkit-box',
              WebkitBoxOrient: 'vertical',
              WebkitLineClamp: 2,
              lineHeight: '1.2rem',
              maxHeight: '2.4rem', // 2 linhas * lineHeight
            }}
          >
            {message}
          </span>
        </button>
      </HoverCardTrigger>

      <HoverCardContent
        align='start'
        className='w-130 max-w-[calc(100vw-2rem)] rounded-xl p-4'
      >
        <p className='text-sm font-medium'>Mensagem completa</p>
        <p className='mt-2 whitespace-pre-wrap wrap-break-word text-sm text-muted-foreground'>
          {message}
        </p>
      </HoverCardContent>
    </HoverCard>
  );
};

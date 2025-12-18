'use client';

import Image from 'next/image';
import type { Segment } from './social-proof.types';

export const SocialProofSegments = ({
  segments,
  activeKey,
  onSelect,
}: {
  segments: Segment[];
  activeKey: string;
  onSelect: (key: string) => void;
}) => {
  return (
    <>
      {/* MOBILE: botões em scroll horizontal (somente mobile) */}
      <div className='md:hidden'>
        <div className='flex w-full gap-2 overflow-x-auto  pr-2 [-webkit-overflow-scrolling:touch] [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden'>
          {segments.map((s) => {
            const isActive = s.key === activeKey;

            return (
              <button
                key={s.key}
                type='button'
                onClick={() => onSelect(s.key)}
                className={[
                  'shrink-0 w-45',
                  'group text-left rounded-2xl border bg-background p-4 transition',
                  'hover:ring-2 hover:ring-inset hover:ring-primary',
                  isActive ? 'ring-2 ring-inset ring-primary' : '',
                ].join(' ')}
              >
                <div className='flex items-center gap-4'>
                  <div className='relative h-12 w-12 overflow-hidden rounded-xl bg-muted ring-1 ring-border'>
                    <Image
                      src={s.imageSrc}
                      alt={s.title}
                      fill
                      sizes='48px'
                      className='object-cover'
                    />
                  </div>

                  <div className='min-w-0'>
                    <p className='truncate text-sm font-semibold'>{s.title}</p>
                    <p className='truncate text-xs text-muted-foreground'>
                      {s.subtitle}
                    </p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* DESKTOP: grid normal (somente desktop) */}
      <div className='hidden md:grid md:grid-cols-3 md:gap-4 '>
        {segments.map((s) => {
          const isActive = s.key === activeKey;

          return (
            <button
              key={s.key}
              type='button'
              onClick={() => onSelect(s.key)}
              className={[
                'group w-full text-left rounded-2xl border bg-background p-4 mt-2 transition',
                'hover:-translate-y-0.5 hover:shadow-sm',
                'hover:ring-2 hover:ring-inset hover:ring-primary',
                isActive ? 'ring-2 ring-inset ring-primary' : '',
              ].join(' ')}
            >
              <div className='flex items-center gap-4 '>
                <div className='relative h-12 w-12 overflow-hidden rounded-xl bg-muted ring-1 ring-border'>
                  <Image
                    src={s.imageSrc}
                    alt={s.title}
                    fill
                    sizes='48px'
                    className='object-cover'
                  />
                </div>

                <div className='min-w-0'>
                  <p className='truncate text-sm font-semibold'>{s.title}</p>
                  <p className='truncate text-xs text-muted-foreground'>
                    {s.subtitle}
                  </p>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </>
  );
};

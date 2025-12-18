'use client';

import Image from 'next/image';
import type { Segment } from './social-proof.types';

export const SocialProofPreview = ({
  activeSegment,
  platformPreviewSrc,
}: {
  activeSegment?: Segment;
  platformPreviewSrc: string;
}) => {
  return (
    <div className='mt-6 rounded-3xl border bg-background p-4 shadow-sm md:p-5'>
      <div className='flex items-center justify-between gap-3'>
        <div className='min-w-0'>
          <p className='text-sm font-semibold leading-tight md:truncate'>
            <span className='block md:inline'>Prévia da plataforma</span>
            <span className='block md:inline'>— {activeSegment?.title}</span>
          </p>

          <p className='truncate text-xs text-muted-foreground'>
            Exemplo visual do produto.
          </p>
        </div>

        <span className='w-fit max-w-[120px] rounded-full bg-muted px-3 py-2 text-center text-xs font-medium leading-tight md:max-w-none'>
          Clique nos segmentos
        </span>
      </div>

      <div className='mt-4 overflow-hidden rounded-2xl ring-1 ring-border'>
        {activeSegment?.previewVariant !== 'mobile' ? (
          <div className='relative h-65 w-full md:h-105 lg:h-97'>
            <Image
              src={activeSegment?.previewSrc ?? platformPreviewSrc}
              alt={`Plataforma — ${activeSegment?.title}`}
              fill
              sizes='(min-width: 768px) 700px, 100vw'
              className='object-cover'
              priority={false}
            />
          </div>
        ) : (
          <div className='flex w-full items-center justify-center p-4 md:p-6 '>
            <div className='w-full max-w-[320px] md:w-65 md:max-w-full h-115'>
              <div className='relative mx-auto aspect-[9/19.5] h-full rounded-[2.2rem] border bg-muted/30 p-2 shadow-sm'>
                <div className='relative h-full w-full overflow-hidden rounded-[1.7rem] bg-black '>
                  <Image
                    src={activeSegment?.previewSrc ?? platformPreviewSrc}
                    alt={`Plataforma — ${activeSegment?.title}`}
                    fill
                    sizes='260px'
                    className='object-cover'
                    priority={false}
                  />
                </div>

                <div className='absolute left-1/2 top-2 h-4 w-20 -translate-x-1/2 rounded-full bg-black/70' />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

'use client';

import Image from 'next/image';

import type { ShowcaseSlide } from './showcase.types';

export const ShowcasePhoneCarousel = ({
  slides,
}: {
  slides: ShowcaseSlide[];
}) => {
  return (
    <div className='mx-auto w-full max-w-64'>
      <div className='relative overflow-hidden rounded-3xl '>
        {/* carrossel 1 por vez */}
        <div className='flex snap-x snap-mandatory overflow-x-auto scroll-smooth [-webkit-overflow-scrolling:touch] [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden'>
          {slides.map((item, idx) => (
            <div
              key={item.src}
              className='relative w-full shrink-0 snap-center p-4'
            >
              {/* ✅ Mock de celular (igual ao SocialProof) */}
              <div className='mx-auto w-full max-w-140'>
                <div className='relative rounded-[2.5rem] border bg-background p-3 shadow-sm'>
                  {/* “bezel” */}
                  <div className='absolute left-1/2 top-2 h-5 w-24 -translate-x-1/2 rounded-full bg-muted' />

                  {/* label */}
                  <div className='absolute left-6 top-6 z-10'>
                    <span className='rounded-full bg-primary px-2.5 py-1 text-[11px] font-medium text-primary-foreground'>
                      {item.label}
                    </span>
                  </div>

                  {/* tela do celular */}
                  <div className='relative overflow-hidden rounded-4xl bg-black'>
                    {/* Aqui é o ponto que padroniza: a “tela” é estreita e alta */}
                    <div className='relative aspect-9/20 w-full'>
                      <Image
                        src={item.src}
                        alt={item.label}
                        fill
                        sizes='(min-width: 768px) 420px, 100vw'
                        className='object-cover'
                        priority={idx === 0}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <p className='mt-2 text-center text-xs text-muted-foreground'>
        Arraste para o lado para ver as próximas telas.
      </p>
    </div>
  );
};

'use client';

import Link from 'next/link';

import { Button } from '@/components/ui/button';

export const FaqCta = () => {
  return (
    <div className='mt-3 rounded-2xl border bg-primary/5 p-4 md:p-5'>
      <div className='flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between'>
        <div>
          <p className='text-sm font-semibold'>
            Quer que eu recomende o plano ideal?
          </p>
          <p className='mt-1 text-sm text-muted-foreground'>
            A gente te mostra como fica no seu segmento e qual plano faz mais
            sentido.
          </p>
        </div>

        <div className='flex flex-col gap-2 sm:flex-row'>
          <Button
            asChild
            className='bg-primary text-primary-foreground hover:bg-primary/90'
          >
            <Link href='#precos'>Ver planos</Link>
          </Button>

          <Button asChild variant='outline'>
            <Link href='/budget'>Solicitar proposta</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

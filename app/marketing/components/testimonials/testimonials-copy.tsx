'use client';

import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { HowItWorksSolutionsDialog } from '../how-it-works-solutions-dialog';

export const TestimonialsCopy = () => {
  return (
    <div className='text-center text-primary-foreground md:text-left'>
      <Badge className='rounded-full bg-primary-foreground/10 px-3 py-1 text-xs font-medium text-primary-foreground'>
        Depoimentos reais
      </Badge>

      <h2 className='mt-4 text-3xl font-semibold tracking-tight md:text-4xl'>
        Profissionais de diversas áreas já usam e compartilham resultados
      </h2>

      <p className='mt-4 max-w-xl text-sm text-primary-foreground/80 md:text-base'>
        Depoimentos reais aumentam confiança e reduzem objeções. Quando o
        cliente vê resultados na prática, a decisão de pedir proposta fica muito
        mais fácil.
      </p>

      <div className='mt-6 flex flex-col items-center gap-2 text-xs text-primary-foreground/80 md:flex-row md:flex-wrap md:items-center md:gap-2 md:justify-start'>
        <span className='inline-flex items-center gap-2 rounded-full border border-primary-foreground/15 bg-primary-foreground/5 px-3 py-2 '>
          <span className='h-1.5 w-1.5 rounded-full bg-primary-foreground/60' />
          Mobile-first
        </span>
        <span className='inline-flex items-center gap-2 rounded-full border border-primary-foreground/15 bg-primary-foreground/5 px-3 py-2'>
          <span className='h-1.5 w-1.5 rounded-full bg-primary-foreground/60' />
          Implantação guiada
        </span>
        <span className='inline-flex items-center gap-2 rounded-full border border-primary-foreground/15 bg-primary-foreground/5 px-3 py-2'>
          <span className='h-1.5 w-1.5 rounded-full bg-primary-foreground/60' />
          Sem fidelidade
        </span>
      </div>

      <div className='mt-8 flex flex-col gap-3 sm:flex-row sm:items-center'>
        <HowItWorksSolutionsDialog
          triggerLabel='Quero esses resultados'
          triggerVariant='outline'
          triggerClassName='text-white border-white/30 bg-transparent hover:bg-white/10 hover:text-white shadow-none'
        />

        <Button
          asChild
          variant='outline'
          className='bg-white text-black  hover:bg-muted/80'
        >
          <Link href='#precos'>Ver planos</Link>
        </Button>
      </div>
    </div>
  );
};

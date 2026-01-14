'use client';

import { ArrowRight, Check } from 'lucide-react';
import Link from 'next/link';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

import { HowItWorksSolutionsDialog } from '../how-it-works-solutions-dialog';

export const ShowcaseCopy = ({ bullets }: { bullets: string[] }) => {
  return (
    <div className='text-center md:text-left'>
      <Badge className='rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary'>
        Veja por dentro
      </Badge>

      <h2 className='mt-4 text-3xl font-semibold tracking-tight md:text-4xl'>
        Veja como uma plataforma profissional funciona na prática
      </h2>

      <p className='mt-4 text-muted-foreground'>
        Para cada segmento, usamos uma narrativa clara: serviço → prova → CTA. O
        cliente entende rápido e toma decisão com menos dúvida.
      </p>

      <div className='mt-6 space-y-3'>
        {bullets.map((b) => (
          <div key={b} className='flex items-start gap-3 text-sm'>
            <span className='mt-0.5 inline-flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-primary'>
              <Check className='h-4 w-4' />
            </span>
            <span className='text-muted-foreground'>{b}</span>
          </div>
        ))}
      </div>

      <div className='mt-8 flex flex-col gap-3 sm:flex-row sm:items-center'>
        <Button
          asChild
          className='bg-primary text-primary-foreground hover:bg-primary/90'
        >
          <Link href='#precos'>
            Ver planos
            <ArrowRight className=' h-4 w-4' />
          </Link>
        </Button>

        <Button asChild variant='outline'>
          <HowItWorksSolutionsDialog triggerLabel='Ver soluções' />
        </Button>
      </div>
    </div>
  );
};

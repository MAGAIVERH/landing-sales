'use client';

import { Check } from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';

import { HowItWorksSolutionsDialog } from '../how-it-works-solutions-dialog';
import { HowItWorksPreview } from './how-it-works-preview';

export const HowItWorksPractice = ({ bullets }: { bullets: string[] }) => {
  return (
    <div className='mt-10 grid items-start gap-6 md:mt-14 md:grid-cols-2 md:gap-10'>
      {/* Texto */}
      <div>
        <h3 className='text-2xl font-semibold tracking-tight'>
          Veja como uma plataforma profissional funciona na prática
        </h3>

        <p className='mt-3 text-sm text-muted-foreground md:text-base'>
          Cada segmento tem suas particularidades, mas a lógica é sempre a
          mesma: reduzir fricção para o cliente, padronizar sua rotina e
          facilitar a decisão.
        </p>

        <div className='mt-6 space-y-3'>
          {bullets.map((b) => (
            <div key={b} className='flex items-start gap-3'>
              <span className='mt-0.5 inline-flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-primary'>
                <Check className='h-4 w-4' />
              </span>
              <p className='text-sm text-foreground/90'>{b}</p>
            </div>
          ))}
        </div>

        <div className='mt-8 flex flex-col gap-3 sm:flex-row'>
          <Button
            asChild
            className='bg-primary text-primary-foreground hover:bg-primary/90'
          >
            <Link href='#precos'>Quero ver planos</Link>
          </Button>

          <HowItWorksSolutionsDialog triggerLabel='Ver soluções' />
        </div>
      </div>

      {/* “Preview” (sem imagens quebradas) */}
      <HowItWorksPreview />
    </div>
  );
};

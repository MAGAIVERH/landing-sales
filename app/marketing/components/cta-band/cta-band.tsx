'use client';

import Link from 'next/link';

import { ArrowRight, Check } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Section } from '../section';
import { HowItWorksSolutionsDialog } from '../how-it-works-solutions-dialog';

export const CtaBand = () => {
  return (
    <Section className='bg-primary py-10 md:py-12'>
      <div className='mx-auto max-w-6xl px-6 text-center text-primary-foreground'>
        <h2 className='text-3xl font-semibold tracking-tight md:text-4xl'>
          Chega de perder tempo com sistemas complicados
        </h2>

        <p className='mx-auto mt-4 max-w-2xl text-primary-foreground/80 md:text-base'>
          Veja uma demo no seu segmento e receba a recomendação do plano ideal
          <br className='hidden md:block' />
          (Sage Base, Sage Pay ou Sage AI).
        </p>

        {/* “redução de risco” perto do CTA */}
        <div className='mx-auto mt-6 flex max-w-3xl flex-col items-center gap-2 text-xs text-primary-foreground/80 md:flex-row md:flex-wrap md:justify-center'>
          <span className='inline-flex items-center gap-2 rounded-full border border-primary-foreground/15 bg-primary-foreground/5 px-3 py-2'>
            <span className='inline-flex h-5 w-5 items-center justify-center rounded-full bg-primary-foreground/10 text-primary-foreground'>
              <Check className='h-3.5 w-3.5' />
            </span>
            Sem fidelidade
          </span>

          <span className='inline-flex items-center gap-2 rounded-full border border-primary-foreground/15 bg-primary-foreground/5 px-3 py-2'>
            <span className='inline-flex h-5 w-5 items-center justify-center rounded-full bg-primary-foreground/10 text-primary-foreground'>
              <Check className='h-3.5 w-3.5' />
            </span>
            Implantação guiada
          </span>

          <span className='inline-flex items-center gap-2 rounded-full border border-primary-foreground/15 bg-primary-foreground/5 px-3 py-2'>
            <span className='inline-flex h-5 w-5 items-center justify-center rounded-full bg-primary-foreground/10 text-primary-foreground'>
              <Check className='h-3.5 w-3.5' />
            </span>
            Mobile-first
          </span>
        </div>

        {/* CTAs */}
        <div className='mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row'>
          <HowItWorksSolutionsDialog
            triggerLabel='Ver meu segmento'
            triggerVariant='outline'
            triggerClassName='text-white border-white/30 bg-transparent hover:bg-white/10 hover:text-white shadow-none'
          />

          <Button
            asChild
            variant='outline'
            className='bg-background text-foreground hover:bg-muted/80 border-0    '
          >
            <Link href='#precos'>Ver planos</Link>
          </Button>
        </div>

        {/* microcopy pós-CTA */}
        <p className='mx-auto mt-4 max-w-2xl text-xs text-primary-foreground/70'>
          Você vê como fica no seu caso (segmento + prints) e recebe uma
          proposta clara com hospedagem e suporte descritos.
        </p>
      </div>
    </Section>
  );
};

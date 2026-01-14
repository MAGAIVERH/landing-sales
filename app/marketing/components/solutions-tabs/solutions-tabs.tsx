'use client';

import { Sparkles } from 'lucide-react';

import { Badge } from '@/components/ui/badge';

import { Section } from '../section';
import { DesktopSolutions } from './desktop-solutions';
import { MobileSolutions } from './mobile-solutions';
import { USE_CASES } from './solutions-tabs.data';

export const SolutionsTabs = () => {
  const first = USE_CASES[0]?.id ?? 'agenda';

  return (
    <Section id='solucoes' className='bg-primary py-14 md:py-16'>
      <div className='mx-auto max-w-6xl px-6'>
        <div className='text-center text-primary-foreground'>
          <Badge className='rounded-full bg-primary-foreground/10 px-3 py-1 text-xs font-medium text-primary-foreground'>
            <span className='inline-flex items-center gap-2'>
              <Sparkles className='h-3.5 w-3.5' />
              Plataforma pensada para rotina real
            </span>
          </Badge>

          <h2 className='mt-4 text-3xl font-semibold tracking-tight md:text-4xl'>
            Plataforma que resolve problemas reais da operação
          </h2>

          <p className='mx-auto mt-3 max-w-2xl text-sm text-primary-foreground/80 md:text-base'>
            A estrutura muda por segmento, mas a lógica é a mesma: reduzir
            fricção, aumentar conversão e organizar a rotina — com implantação
            guiada.
          </p>
        </div>

        {/* Mobile: experiência “incrível” (lista -> drawer) */}
        <MobileSolutions first={first} />

        {/* Desktop: mantém como está */}
        <DesktopSolutions first={first} />
      </div>
    </Section>
  );
};

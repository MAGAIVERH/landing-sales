'use client';

import { Check } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

import { HowItWorksDialog } from '../how-it-works-dialog';
import { Section } from '../section';
import { HeroLeadForm } from './hero-lead-form';
import { SegmentsDialog } from './SegmentsDialog';

export const Hero = () => {
  return (
    <section className='relative overflow-hidden'>
      {/* background institucional */}
      <div className='absolute inset-0 -z-10 bg-linear-to-b from-primary/10 via-background to-background' />

      <Section>
        {/* CONTAINER CENTRAL */}
        <div className='mx-auto w-full max-w-6xl px-4 sm:px-6'>
          <div className='grid items-start gap-14 md:grid-cols-2 md:gap-20'>
            {/* BLOCO DE TEXTO */}
            <div>
              {/* Badge superior */}
              <div className='flex justify-center md:justify-start'>
                <span className='inline-flex max-w-[90%] items-center justify-center rounded-full border bg-background px-4 py-1 text-center text-xs font-medium text-primary'>
                  Plataformas digitais para profissionais e empresas de serviços
                </span>
              </div>

              <h1 className='mt-4 text-4xl font-semibold leading-tight tracking-tight md:text-5xl text-center md:text-left'>
                Plataformas completas para profissionais que precisam{' '}
                <span className='text-primary'>
                  organizar, vender e escalar
                </span>{' '}
                seus serviços
              </h1>

              <p className='mt-6 max-w-xl text-base text-muted-foreground md:text-lg text-center md:text-left'>
                Em até <strong>7 dias</strong> você tem uma plataforma no ar com{' '}
                <strong>agendamentos</strong>, <strong>confirmações</strong> e{' '}
                <strong>automações</strong> — pronta para{' '}
                <strong>organizar</strong>, <strong>vender</strong> e{' '}
                <strong>escalar</strong>.
              </p>

              <div className='mt-6 grid gap-3 text-sm text-muted-foreground'>
                {[
                  'Implantação rápida com suporte técnico especializado',
                  'Estrutura pronta para agenda, pagamentos e automações',
                  'Plataforma escalável: comece simples e evolua conforme o crescimento do negócio',
                ].map((item) => (
                  <div key={item} className='flex items-start gap-3'>
                    <span className='mt-0.5 inline-flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 text-primary'>
                      <Check className='h-3.5 w-3.5' />
                    </span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>

              <div className='mt-6 flex flex-col gap-3 sm:flex-row'>
                <HowItWorksDialog triggerLabel='Ver como funciona' />
                <SegmentsDialog />
              </div>
            </div>

            {/* BLOCO DE AVALIAÇÃO */}
            <Card className='rounded-2xl border bg-card p-6 shadow-sm md:p-8 mt-4 md:mt-14'>
              <div className='flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between'>
                <div>
                  <h3 className='text-lg font-semibold tracking-tight sm:text-xl'>
                    Receba uma demo do seu segmento + recomendação do plano
                    ideal
                  </h3>

                  {/* Badge mobile */}
                  <span className='mt-2 inline-flex w-fit rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary sm:hidden'>
                    Implantação em até 7 dias
                  </span>

                  <p className='mt-2 text-sm text-muted-foreground'>
                    Em 1 minuto, você envia seus dados e recebe um retorno em
                    até 24h úteis.
                  </p>
                </div>

                {/* Badge desktop */}
                <Badge className='hidden shrink-0 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary sm:inline-flex'>
                  7 dias
                </Badge>
              </div>

              <div className='mt-6 space-y-4'>
                {/* FORM SHADCN + ZOD */}
                <HeroLeadForm />

                <div className='flex items-center justify-between gap-3 text-xs text-muted-foreground'>
                  <span>Avaliação sem compromisso</span>
                  <span>Sem fidelidade</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </Section>
    </section>
  );
};

'use client';

import Image from 'next/image';
import Link from 'next/link';
import * as React from 'react';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Section } from './section';

const items = [
  {
    name: 'Marcia Orback',
    role: 'Tatuadora',
    text: 'Agora eu consigo organizar a agenda e atender pelo celular sem virar bagunça. Ficou tudo mais simples, rápido e com uma cara bem profissional.',
    avatar: '/profissional-tatuadora.png',
  },
  {
    name: 'Rafael Almeida',
    role: 'Barbearia',
    text: 'A plataforma ficou com cara de negócio sério e bem profissional. Na primeira semana, aumentaram as mensagens no WhatsApp e os pedidos de orçamento.',
    avatar: '/profissional-barbeiro.png',
  },
  {
    name: 'Camila Souza',
    role: 'Personal Trainer',
    text: 'Agora eu preencho melhor meus horários e parei de ter “buracos” na agenda. O aluno agenda pelo celular e eu consigo planejar minha semana com antecedência.',
    avatar: '/profissional-personal.png',
  },
];

const Stars = ({ value = 5 }: { value?: number }) => {
  return (
    <div className='flex items-center gap-1'>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={String(i)}
          className='h-4 w-4 text-primary'
          fill={i < value ? 'currentColor' : 'none'}
        />
      ))}
    </div>
  );
};

export const Testimonials = () => {
  const [index, setIndex] = React.useState(0);
  const current = items[index];

  const handlePrev = () =>
    setIndex((prev) => (prev === 0 ? items.length - 1 : prev - 1));

  const handleNext = () =>
    setIndex((prev) => (prev === items.length - 1 ? 0 : prev + 1));

  return (
    <Section id='depoimentos' className='bg-primary py-16 md:py-16'>
      <div className='mx-auto max-w-6xl px-6'>
        <div className='grid gap-10 lg:grid-cols-2 lg:items-center'>
          {/* Copy */}
          <div className='text-primary-foreground'>
            <Badge className='rounded-full bg-primary-foreground/10 px-3 py-1 text-xs font-medium text-primary-foreground'>
              Depoimentos reais
            </Badge>

            <h2 className='mt-4 text-3xl font-semibold tracking-tight md:text-4xl'>
              Profissionais de diversas áreas já usam e compartilham resultados
            </h2>

            <p className='mt-4 max-w-xl text-sm text-primary-foreground/80 md:text-base'>
              Depoimentos reais aumentam confiança e reduzem objeções. Quando o
              cliente vê resultados na prática, a decisão de pedir proposta fica
              muito mais fácil.
            </p>

            <div className='mt-6 flex flex-wrap items-center gap-2 text-xs text-primary-foreground/80'>
              <span className='inline-flex items-center gap-2 rounded-full border border-primary-foreground/15 bg-primary-foreground/5 px-3 py-2'>
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
              <Button
                asChild
                className='bg-primary-foreground text-primary hover:bg-primary-foreground/90'
              >
                <Link href='#precos'>Quero esses resultados</Link>
              </Button>

              <Button
                asChild
                variant='outline'
                className='border-primary-foreground/30 bg-transparent text-primary-foreground hover:bg-primary-foreground/10'
              >
                <Link href='#precos'>Ver planos</Link>
              </Button>
            </div>
          </div>

          {/* Card */}
          <div className='relative'>
            <div className='absolute -inset-6 -z-10 rounded-3xl bg-primary-foreground/10 blur-2xl' />

            <Card className='overflow-hidden rounded-3xl border-primary-foreground/15 bg-background p-5 shadow-sm md:p-7'>
              <div className='flex items-start justify-between gap-4'>
                <div className='min-w-0'>
                  <p className='text-sm font-semibold'>Resultados na prática</p>
                  <p className='mt-1 text-sm text-muted-foreground'>
                    O que muda no dia a dia após a implantação.
                  </p>
                </div>

                <Badge className='shrink-0 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary'>
                  Avaliação alta
                </Badge>
              </div>

              {/* Conteúdo com transição ao trocar index */}
              <div
                key={index}
                className='mt-2 grid gap-5 animate-in fade-in duration-200'
              >
                <div className='flex items-center gap-4'>
                  <div className='relative h-14 w-14 overflow-hidden rounded-2xl border bg-muted'>
                    <Image
                      src={current.avatar}
                      alt={current.name}
                      fill
                      className='object-cover'
                    />
                  </div>

                  <div className='min-w-0'>
                    <p className='text-sm font-semibold leading-none'>
                      {current.name}
                    </p>
                    <p className='mt-1 text-sm text-muted-foreground'>
                      {current.role}
                    </p>
                  </div>

                  <div className='ml-auto hidden sm:block'>
                    <Stars value={5} />
                  </div>
                </div>

                <div className='rounded-2xl border bg-card p-4 md:p-5'>
                  <p className='text-sm leading-relaxed text-muted-foreground'>
                    <span className='mr-1 font-semibold text-foreground'>
                      “
                    </span>
                    {current.text}
                    <span className='ml-1 font-semibold text-foreground'>
                      ”
                    </span>
                  </p>
                </div>

                <div className='flex items-center gap-2'>
                  <Button
                    variant='outline'
                    size='icon'
                    onClick={handlePrev}
                    aria-label='Ver depoimento anterior'
                  >
                    <ChevronLeft className='h-4 w-4' />
                  </Button>

                  <Button
                    variant='outline'
                    size='icon'
                    onClick={handleNext}
                    aria-label='Ver próximo depoimento'
                  >
                    <ChevronRight className='h-4 w-4' />
                  </Button>

                  <div className='ml-auto flex items-center gap-1.5'>
                    {items.map((_, i) => (
                      <span
                        key={String(i)}
                        className={[
                          'h-2 w-2 rounded-full transition',
                          i === index ? 'bg-primary' : 'bg-muted',
                        ].join(' ')}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </Section>
  );
};

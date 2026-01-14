'use client';

import {
  BadgeCheck,
  ChevronRight,
  ClipboardList,
  Rocket,
  Sparkles,
  Timer,
} from 'lucide-react';
import Link from 'next/link';
import * as React from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';

import type { ShowcaseSlide } from './showcase/showcase.types';
import { ShowcasePhoneCarousel } from './showcase/showcase-phone-carousel';

type HowItWorksDialogProps = {
  slides?: ShowcaseSlide[];
  triggerLabel?: string;
};

export const HowItWorksDialog = ({
  slides,
  triggerLabel = 'Ver como funciona',
}: HowItWorksDialogProps) => {
  const [open, setOpen] = React.useState(false);

  const safeSlides: ShowcaseSlide[] =
    slides && slides.length
      ? slides
      : [
          { src: '/personal-tela-inicial.jpg', label: 'Tela inicial' },
          { src: '/personal-agendamentos.jpg', label: 'Agendamento' },
          { src: '/personal-confirmacao.jpg', label: 'Pagamento' },
        ];

  const handleScrollToPrices = () => {
    setOpen(false);
    window.setTimeout(() => {
      document
        .getElementById('precos')
        ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 120);
  };

  const steps = [
    {
      icon: ClipboardList,
      title: 'Diagnóstico rápido',
      desc: 'Você descreve seu segmento e o fluxo ideal (agenda, pagamentos, automações).',
      meta: '10–15 min',
    },
    {
      icon: BadgeCheck,
      title: 'Proposta clara',
      desc: 'Você recebe escopo, prazo e investimento — com prioridades e sem surpresa.',
      meta: 'até 24h úteis',
    },
    {
      icon: Rocket,
      title: 'Implantação guiada',
      desc: 'Setup, ajustes e entrega no ar com acompanhamento para operar com segurança.',
      meta: 'até 7 dias*',
    },
  ] as const;

  const wins = [
    'Preview real antes de decidir',
    'Escopo e 1ª entrega definidos',
    'Recomendação do “próximo passo” (sem empurrar)',
    'Prazo e investimento alinhados antes de começar',
  ] as const;

  const faqs = [
    {
      q: 'Isso é “pronto” ou sob medida?',
      a: 'Base pronta + ajustes no seu fluxo. Você evolui sem refazer tudo.',
    },
    {
      q: 'E depois da entrega?',
      a: 'Você recebe orientação do que faz sentido melhorar depois (sem empurrão).',
    },
    {
      q: 'Vai funcionar no celular?',
      a: 'Sim. A experiência é mobile-first e adaptada ao seu segmento.',
    },
  ] as const;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className='bg-primary text-primary-foreground hover:bg-primary/90'>
          Ver como funciona
        </Button>
      </DialogTrigger>

      <DialogContent
        className='
          p-0 overflow-hidden
          w-[calc(100vw-1rem)]
          sm:w-[calc(100vw-2rem)]
          lg:w-[min(1200px,calc(100vw-4rem))]
          max-w-300
        '
      >
        <div
          className='max-h-[85vh] overflow-y-auto overflow-x-hidden pr-2
  [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden
'
        >
          {/* HEADER */}
          <div className='border-b bg-muted/30 p-5 sm:p-6'>
            <DialogHeader className='space-y-4'>
              {/* Título "Como funciona" + badges abaixo em linha */}
              <div className='space-y-3'>
                <div className='flex items-center gap-2'>
                  <Sparkles className='h-4 w-4 text-muted-foreground' />
                  <span className='text-sm font-semibold'> {triggerLabel}</span>
                </div>

                <div className='-mx-1 flex gap-2 overflow-x-auto px-1 pb-1 [-webkit-overflow-scrolling:touch] lg:mx-0 lg:overflow-visible lg:px-0 lg:pb-0 lg:flex-nowrap'>
                  <Badge className='shrink-0 whitespace-nowrap bg-primary/10 text-primary'>
                    3 passos
                  </Badge>

                  <Badge
                    variant='secondary'
                    className='shrink-0 whitespace-nowrap gap-1'
                  >
                    <Timer className='h-3.5 w-3.5' />
                    Retorno em 24h úteis
                  </Badge>

                  <Badge
                    variant='secondary'
                    className='shrink-0 whitespace-nowrap'
                  >
                    Sem fidelidade
                  </Badge>
                </div>
              </div>

              <DialogTitle className='text-xl font-semibold tracking-tight sm:text-2xl lg:text-3xl'>
                Veja a experiência, entenda o processo e avance com segurança
              </DialogTitle>

              <DialogDescription className='text-sm sm:text-base'>
                Você sai daqui com clareza: como funciona, o que você ganha e
                qual é o próximo passo ideal para o seu segmento.
              </DialogDescription>
            </DialogHeader>
          </div>

          {/* BODY */}
          <div className='space-y-6 p-5 sm:p-6'>
            {/* 1) PREVIEW */}
            <Card className='p-4 sm:p-6'>
              <div className='grid gap-6 lg:grid-cols-2 lg:items-start'>
                {/* Texto */}
                <div className='min-w-0'>
                  <p className='text-xs font-medium text-muted-foreground'>
                    Preview real (mobile)
                  </p>

                  <h3 className='mt-1 text-lg font-semibold leading-tight sm:text-xl'>
                    Veja como o cliente usa na prática
                  </h3>

                  <p className='mt-2 max-w-[56ch] text-sm leading-relaxed text-muted-foreground sm:text-base'>
                    Prints reais do fluxo. Você entende a experiência antes de
                    investir.
                  </p>

                  <Separator className='my-5' />

                  <div className='grid gap-3 text-sm text-muted-foreground'>
                    <div className='flex items-start gap-2'>
                      <span className='mt-0.5 inline-flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 text-primary'>
                        <BadgeCheck className='h-3.5 w-3.5' />
                      </span>
                      <span>
                        Fluxo pensado para conversão (do interesse ao pedido)
                      </span>
                    </div>

                    <div className='flex items-start gap-2'>
                      <span className='mt-0.5 inline-flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 text-primary'>
                        <BadgeCheck className='h-3.5 w-3.5' />
                      </span>
                      <span>
                        Pronto para evoluir com automações e pagamentos
                      </span>
                    </div>

                    <div className='flex items-start gap-2'>
                      <span className='mt-0.5 inline-flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 text-primary'>
                        <BadgeCheck className='h-3.5 w-3.5' />
                      </span>
                      <span>
                        Entrega objetiva com próximo passo recomendado
                      </span>
                    </div>
                  </div>
                </div>

                {/* Carousel */}
                <div className='min-w-0'>
                  <div className='pointer-events-none flex justify-center'>
                    <Badge className='bg-primary/10 text-primary'>
                      Mobile-first
                    </Badge>
                  </div>

                  <div className='relative mx-auto w-full max-w-140 lg:max-w-140'>
                    <ShowcasePhoneCarousel slides={safeSlides} />
                  </div>
                </div>
              </div>
            </Card>

            {/* 2) PROCESSO + CTA (ATUALIZADO APENAS AQUI) */}
            <div className='grid gap-6 lg:grid-cols-[1.15fr_0.85fr] lg:items-start'>
              {/* Processo (esquerda) */}
              <div>
                <div className='flex items-end justify-between gap-3'>
                  <div>
                    <p className='text-xs font-medium text-muted-foreground'>
                      Processo em 3 etapas
                    </p>
                    <h3 className='mt-1 text-sm font-semibold'>
                      Objetivo → proposta → implantação
                    </h3>
                  </div>
                  <Badge variant='secondary'>Fluxo direto</Badge>
                </div>

                <div className='mt-6 grid gap-3'>
                  {steps.map((step, idx) => {
                    const Icon = step.icon;
                    return (
                      <Card key={step.title} className='p-4 sm:p-5'>
                        <div className='flex items-start gap-3'>
                          <span className='mt-0.5 inline-flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary'>
                            <Icon className='h-5 w-5' />
                          </span>

                          <div className='min-w-0'>
                            <div className='flex flex-wrap items-center gap-2'>
                              <span className='text-xs font-medium text-muted-foreground'>
                                Passo {idx + 1}
                              </span>
                              <Badge variant='secondary' className='h-6 px-2'>
                                {step.meta}
                              </Badge>
                            </div>

                            <p className='mt-1 text-sm font-semibold'>
                              {step.title}
                            </p>
                            <p className='mt-1 text-sm text-muted-foreground'>
                              {step.desc}
                            </p>
                          </div>
                        </div>
                      </Card>
                    );
                  })}
                </div>

                <p className='mt-6 text-xs text-muted-foreground'>
                  *Prazo varia conforme escopo, integrações e volume de telas.
                </p>
              </div>

              {/* CTA (direita) */}
              <div className='lg:sticky lg:top-6'>
                <Card className='p-4 sm:p-5'>
                  <div className='space-y-2'>
                    <div className='flex items-center justify-between gap-3'>
                      <p className='text-xs font-medium text-muted-foreground'>
                        Resultado
                      </p>

                      <Badge className='shrink-0 bg-primary/10 text-primary'>
                        Sem fidelidade
                      </Badge>
                    </div>

                    <h3 className='text-sm font-semibold leading-tight'>
                      O que você leva daqui
                    </h3>
                  </div>

                  <div className='mt-4 grid gap-3'>
                    {wins.map((w) => (
                      <div key={w} className='flex items-start gap-2'>
                        <span className='mt-0.5 inline-flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 text-primary'>
                          <BadgeCheck className='h-3.5 w-3.5' />
                        </span>
                        <span className='text-sm text-muted-foreground'>
                          {w}
                        </span>
                      </div>
                    ))}
                  </div>

                  <Separator className='my-5' />

                  <div className='grid gap-3'>
                    <Button asChild className='h-11 w-full'>
                      <Link href='/budget'>
                        Solicitar orçamento{' '}
                        <ChevronRight className='ml-1 h-4 w-4' />
                      </Link>
                    </Button>

                    <Button
                      type='button'
                      variant='outline'
                      className='h-11 w-full'
                      onClick={handleScrollToPrices}
                    >
                      Ver preços
                    </Button>
                  </div>

                  <div className='mt-5 rounded-xl border bg-muted/30 p-4'>
                    <p className='text-sm font-semibold'>Risco reduzido</p>
                    <p className='mt-1 text-sm text-muted-foreground'>
                      Você recebe retorno em até{' '}
                      <span className='font-medium'>24h úteis</span> com
                      proposta objetiva e alinhada ao seu cenário.
                    </p>
                  </div>
                </Card>
              </div>
            </div>

            {/* FAQ (full width abaixo do grid) */}
            <Card className='p-4 sm:p-6'>
              <div>
                <p className='text-xs font-medium text-muted-foreground'>
                  Dúvidas comuns
                </p>
                <h3 className='mt-1 text-sm font-semibold'>
                  Perguntas rápidas
                </h3>
              </div>

              <div className=' grid gap-3 sm:grid-cols-2 lg:grid-cols-3'>
                {faqs.map((item) => (
                  <Card key={item.q} className='p-4'>
                    <p className='text-sm font-semibold'>{item.q}</p>
                    <p className='mt-1 text-sm text-muted-foreground'>
                      {item.a}
                    </p>
                  </Card>
                ))}
              </div>
            </Card>
          </div>

          {/* 3) FAQ (REMOVIDO para não duplicar) */}
        </div>
      </DialogContent>
    </Dialog>
  );
};

'use client';

import Link from 'next/link';
import { Check, Rocket, Settings2, ShieldCheck } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Section } from './section';

export const HowItWorks = () => {
  const steps = [
    {
      number: '01',
      title: 'Diagnóstico do seu segmento',
      desc: 'Entendemos seu serviço, oferta e rotina para montar a estrutura certa.',
      icon: <Settings2 className='h-5 w-5' />,
    },
    {
      number: '02',
      title: 'Personalização + conteúdo',
      desc: 'Ajustamos textos, serviços, regras e layout para converter melhor no mobile.',
      icon: <Rocket className='h-5 w-5' />,
    },
    {
      number: '03',
      title: 'Publicação com checklist',
      desc: 'Deploy, SSL, domínio e validação final — com acompanhamento na implantação.',
      icon: <ShieldCheck className='h-5 w-5' />,
    },
  ];

  const bullets = [
    'Sem fidelidade contratual',
    'Suporte dedicado na implantação e ajustes',
    'Base pronta para evoluir (pagamentos, automações, integrações)',
  ];

  return (
    <Section id='como-funciona' className='bg-background py-16 md:py-20'>
      <div className='mx-auto max-w-6xl px-6'>
        {/* Cabeçalho */}
        <div className='text-center'>
          <Badge className='rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary'>
            Processo claro, entrega rápida
          </Badge>

          <h2 className='mt-4 text-3xl font-semibold tracking-tight md:text-4xl'>
            Como funciona, do briefing à plataforma no ar
          </h2>

          <p className='mx-auto mt-3 max-w-2xl text-sm text-muted-foreground md:text-base'>
            Você não compra “um site”. Você contrata um processo que organiza
            sua operação, melhora a experiência do cliente e aumenta conversão.
          </p>
        </div>

        {/* Etapas */}
        <div className='mt-10 grid gap-4 md:grid-cols-3 md:gap-6'>
          {steps.map((s) => (
            <Card
              key={s.number}
              className='rounded-2xl border-border bg-background/95 p-5 shadow-sm backdrop-blur md:p-6'
            >
              <div className='flex items-start justify-between gap-4'>
                <div className='inline-flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary'>
                  {s.icon}
                </div>

                <span className='text-xs font-semibold tracking-wide text-muted-foreground'>
                  {s.number}
                </span>
              </div>

              <h3 className='mt-4 text-lg font-semibold tracking-tight'>
                {s.title}
              </h3>
              <p className='mt-2 text-sm text-muted-foreground'>{s.desc}</p>
            </Card>
          ))}
        </div>

        {/* Bloco “na prática” */}
        <div className='mt-10 grid items-start gap-6 md:mt-14 md:grid-cols-2 md:gap-10'>
          {/* Texto */}
          <div>
            <h3 className='text-2xl font-semibold tracking-tight'>
              Veja como uma plataforma profissional funciona na prática
            </h3>

            <p className='mt-3 text-sm text-muted-foreground md:text-base'>
              Cada segmento tem suas particularidades — mas a lógica é sempre a
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

              <Button
                asChild
                variant='outline'
                className='border-border bg-transparent text-foreground hover:bg-muted'
              >
                <Link href='#solucoes'>Ver soluções</Link>
              </Button>
            </div>
          </div>

          {/* “Preview” (sem imagens quebradas) */}
          <Card className='rounded-2xl border-border bg-background p-5 shadow-sm md:p-6'>
            <div className='flex items-start justify-between gap-4'>
              <div>
                <p className='text-sm font-semibold'>Exemplo de estrutura</p>
                <p className='mt-1 text-sm text-muted-foreground'>
                  Uma visão rápida do que o cliente enxerga e do que você
                  controla.
                </p>
              </div>

              <Badge className='shrink-0 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary'>
                Pronto para converter
              </Badge>
            </div>

            <div className='mt-2 grid gap-4'>
              <div className='rounded-xl border bg-card p-4'>
                <p className='text-sm font-semibold'>
                  Portal do Cliente (front de aquisição + conversão)
                </p>
                <p className='mt-1 text-sm text-muted-foreground'>
                  Oferta clara, prova social e CTA direto para
                  orçamento/agendamento.
                </p>
              </div>

              <div className='grid gap-4 sm:grid-cols-2'>
                <div className='rounded-xl border bg-card p-4'>
                  <p className='text-sm font-semibold'>
                    Plataforma de Atendimento (agenda/fluxo/pagamentos)
                  </p>
                  <p className='mt-1 text-sm text-muted-foreground'>
                    Horários, confirmação e regras do seu atendimento.
                  </p>
                </div>

                <div className='rounded-xl border bg-card p-4'>
                  <p className='text-sm font-semibold'>
                    Painel Administrativo (gestão)
                  </p>
                  <p className='mt-1 text-sm text-muted-foreground'>
                    Conteúdos, serviços, preços e configuração do funil.
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </Section>
  );
};

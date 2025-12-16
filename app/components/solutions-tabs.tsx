'use client';

import * as React from 'react';
import Link from 'next/link';
import {
  Calendar,
  CreditCard,
  Headset,
  LineChart,
  Server,
  Sparkles,
  ChevronRight,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet';
import { Section } from './section';

type UseCase = {
  id: string;
  icon: React.ReactNode;
  painTitle: string;
  painDesc: string;
  solutionTitle: string;
  solutionDesc: string;
  bullets: string[];
  outcomes: string[];
};

const USE_CASES: UseCase[] = [
  {
    id: 'agenda',
    icon: <Calendar className='h-5 w-5' />,
    painTitle: 'Agenda no WhatsApp e horários ociosos',
    painDesc:
      'Os pedidos chegam por mensagem, você perde tempo confirmando horário e a agenda acaba com buracos e confusão.',
    solutionTitle: 'Agendamento online com confirmação automática',
    solutionDesc:
      'O cliente escolhe o horário, confirma sozinho e você recebe tudo organizado — com menos retrabalho e mais previsibilidade.',
    bullets: [
      'Agenda em tempo real com bloqueio de horários',
      'Confirmação automática e lembretes para reduzir faltas',
      'Página de agendamento focada em conversão no celular',
    ],
    outcomes: [
      'Mais horários preenchidos',
      'Menos faltas e remarcações',
      'Rotina previsível',
    ],
  },
  {
    id: 'vendas',
    icon: <LineChart className='h-5 w-5' />,
    painTitle: 'Muitos acessos, poucas conversões',
    painDesc:
      'Você até atrai pessoas, mas o cliente não entende o próximo passo e a compra não acontece.',
    solutionTitle: 'Jornada de venda clara, do interesse ao pedido',
    solutionDesc:
      'Estruturamos oferta, prova e CTA para o cliente decidir com segurança sem fricção e sem dúvidas.',
    bullets: [
      'Oferta e diferenciais com copy e hierarquia visual',
      'CTAs estratégicos (WhatsApp, orçamento, agendamento',
      'Seções de prova: depoimentos, antes/depois, resultados',
    ],
    outcomes: [
      'Mais solicitações de orçamento',
      'Mais vendas',
      'Melhor aproveitamento do tráfego',
    ],
  },
  {
    id: 'pagamentos',
    icon: <CreditCard className='h-5 w-5' />,
    painTitle: 'Cobrança manual, atrasos e confirmações confusas',
    painDesc:
      'Você perde tempo cobrando no WhatsApp, fica esperando comprovante e o caixa vira incerteza.',
    solutionTitle: 'Pagamentos online com confirmação automática',
    solutionDesc:
      'Checkout integrado (Stripe) com status do pagamento e registro do pedido sem “me manda o comprovante”.',
    bullets: [
      'Checkout Stripe por link ou página de pagamento',
      'Confirmação automática + registro do pedido/serviço',
      'Base pronta para planos e recorrência para você',
    ],
    outcomes: [
      'Recebimento mais previsível',
      'Menos tempo em cobrança',
      'Operação mais profissional e escalável',
    ],
  },
  {
    id: 'infra',
    icon: <Server className='h-5 w-5' />,
    painTitle: 'Medo de instabilidade, queda e “dar problema no servidor”',
    painDesc:
      'Quando a infra não tem padrão, qualquer ajuste vira risco e você fica refém de urgências.',
    solutionTitle: 'Implantação guiada com checklist e padrão de produção',
    solutionDesc:
      'Publicação com boas práticas: domínio, SSL, ambiente configurado e validação final com acompanhamento.',
    bullets: [
      'Domínio + SSL + deploy com ambiente pronto',
      'Checklist de produção e testes antes de publicar',
      'Base preparada para evoluir sem “refazer do zero”',
    ],
    outcomes: [
      'Menos risco e mais confiabilidade',
      'Mais segurança',
      'Entrega consistente',
    ],
  },
  {
    id: 'suporte',
    icon: <Headset className='h-5 w-5' />,
    painTitle: 'Falta de suporte e “sumiram depois que entregaram”',
    painDesc:
      'Quando aparece um ajuste ou dúvida, você fica sem resposta e a operação trava.',
    solutionTitle: 'Suporte de implantação com acompanhamento de verdade',
    solutionDesc:
      'A gente entra junto com você na operação: orienta, ajusta e garante que a plataforma funcione no dia a dia.',
    bullets: [
      'Acompanhamento na implantação e pós-publicação',
      'Ajustes rápidos de UX, fluxo e textos para conversão',
      'Orientação prática para operar e vender com a plataforma',
    ],
    outcomes: [
      'Mais segurança',
      'Menos dor de cabeça',
      'Mais resultado e conversões',
    ],
  },
];

const MobileSolutions = ({ first }: { first: string }) => {
  const [open, setOpen] = React.useState(false);
  const [activeId, setActiveId] = React.useState(first);

  const active = React.useMemo(
    () => USE_CASES.find((u) => u.id === activeId) ?? USE_CASES[0],
    [activeId],
  );

  return (
    <div className='md:hidden'>
      <div className='mt-10 overflow-hidden rounded-2xl border bg-card p-4 shadow-sm'>
        <div className='grid gap-3'>
          <div className='rounded-xl border bg-background p-4'>
            <p className='text-sm font-semibold'>Você enfrenta isso?</p>
            <p className='mt-1 text-sm text-muted-foreground'>
              Toque em uma dor. A solução abre na hora.
            </p>
          </div>

          <div className='grid gap-2'>
            {USE_CASES.map((item) => (
              <button
                key={item.id}
                type='button'
                onClick={() => {
                  setActiveId(item.id);
                  setOpen(true);
                }}
                className='w-full rounded-xl border bg-background px-4 py-4 text-left transition hover:bg-muted/40'
              >
                <div className='flex w-full items-start gap-3'>
                  <span className='mt-0.5 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary'>
                    {item.icon}
                  </span>

                  <div className='min-w-0 flex-1'>
                    <p className='text-sm font-semibold leading-snug wrap-break-word'>
                      {item.painTitle}
                    </p>
                    <p className='mt-1 text-sm leading-snug text-muted-foreground wrap-break-word'>
                      {item.painDesc}
                    </p>
                  </div>

                  <span className='mt-1 inline-flex shrink-0 items-center text-muted-foreground'>
                    <ChevronRight className='h-4 w-4' />
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side='bottom' className='rounded-t-2xl p-0'>
          <div className='mx-auto w-full max-w-2xl p-6'>
            <SheetHeader className='space-y-2'>
              <div className='flex items-start justify-between gap-4'>
                <div className='min-w-0'>
                  <SheetTitle className='text-lg font-semibold tracking-tight'>
                    {active.solutionTitle}
                  </SheetTitle>
                  <SheetDescription className='mt-2 text-sm text-muted-foreground'>
                    {active.solutionDesc}
                  </SheetDescription>
                </div>

                <Badge className='shrink-0 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary'>
                  Resultado prático
                </Badge>
              </div>
            </SheetHeader>

            <div className='mt-5 grid gap-4'>
              <div className='rounded-xl border bg-card p-4'>
                <p className='text-sm font-semibold'>
                  O que entra na plataforma
                </p>
                <ul className='mt-3 space-y-2 text-sm text-muted-foreground'>
                  {active.bullets.map((b) => (
                    <li key={b} className='flex items-start gap-2'>
                      <span className='mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary'>
                        <span className='block h-1.5 w-1.5 rounded-full bg-primary' />
                      </span>
                      <span className='wrap-break-word'>{b}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className='rounded-xl border bg-card p-4'>
                <p className='text-sm font-semibold'>O que você ganha</p>
                <div className='mt-3 flex flex-wrap gap-2'>
                  {active.outcomes.map((o) => (
                    <Badge
                      key={o}
                      className='rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary'
                    >
                      {o}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className='grid gap-2'>
                <Button
                  asChild
                  className='w-full bg-primary text-primary-foreground hover:bg-primary/90'
                >
                  <Link href='#precos' onClick={() => setOpen(false)}>
                    Solicitar proposta
                  </Link>
                </Button>

                <p className='text-center text-xs text-muted-foreground'>
                  Queremos mostrar exatamente como fica no seu segmento.
                </p>
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

const DesktopSolutions = ({ first }: { first: string }) => {
  return (
    <div className='hidden md:block'>
      <Card className='mt-10 overflow-x-hidden rounded-2xl border bg-card p-4 shadow-sm md:p-6'>
        <Tabs defaultValue={first} className='w-full'>
          <div className='mb-5 grid gap-3 md:grid-cols-2 md:gap-6'>
            <div className='rounded-xl border bg-background p-4'>
              <p className='text-sm font-semibold'>Você enfrenta isso?</p>
              <p className='mt-1 text-sm text-muted-foreground'>
                Selecione uma dor comum do dia a dia.
              </p>
            </div>

            <div className='rounded-xl border bg-background p-4'>
              <p className='text-sm font-semibold'>Nós resolvemos assim</p>
              <p className='mt-1 text-sm text-muted-foreground'>
                Veja como a plataforma entra na rotina e destrava resultado.
              </p>
            </div>
          </div>

          <div className='grid gap-6 md:grid-cols-2'>
            <div className='min-w-0'>
              <TabsList className='flex h-auto w-full flex-col gap-2 bg-transparent p-0'>
                {USE_CASES.map((item) => (
                  <TabsTrigger
                    key={item.id}
                    value={item.id}
                    className='
                      flex w-full justify-start rounded-xl border bg-background px-4 py-4 text-left
                      whitespace-normal wrap-break-word overflow-hidden
                      data-[state=active]:border-primary/30 data-[state=active]:bg-primary/5
                    '
                  >
                    <div className='flex w-full min-w-0 items-start gap-3'>
                      <span className='mt-0.5 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary'>
                        {item.icon}
                      </span>

                      <div className='min-w-0 flex-1'>
                        <p className='text-sm font-semibold leading-snug wrap-break-word'>
                          {item.painTitle}
                        </p>
                        <p className='mt-1 text-sm leading-snug text-muted-foreground wrap-break-word'>
                          {item.painDesc}
                        </p>
                      </div>
                    </div>
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>

            <div className='min-w-0 rounded-2xl border bg-background p-5 md:p-6'>
              {USE_CASES.map((item) => (
                <TabsContent key={item.id} value={item.id} className='m-0'>
                  <div className='flex items-start justify-between gap-4'>
                    <div className='min-w-0'>
                      <h3 className='text-lg font-semibold tracking-tight md:text-xl'>
                        {item.solutionTitle}
                      </h3>
                      <p className='mt-2 text-sm text-muted-foreground wrap-break-word'>
                        {item.solutionDesc}
                      </p>
                    </div>

                    <Badge className='shrink-0 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary'>
                      Resultado prático
                    </Badge>
                  </div>

                  <div className='mt-5 grid gap-5'>
                    <div className='rounded-xl border bg-card p-4'>
                      <p className='text-sm font-semibold'>
                        O que entra na plataforma
                      </p>
                      <ul className='mt-3 space-y-2 text-sm text-muted-foreground'>
                        {item.bullets.map((b) => (
                          <li key={b} className='flex items-start gap-2'>
                            <span className='mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary'>
                              <span className='block h-1.5 w-1.5 rounded-full bg-primary' />
                            </span>
                            <span className='wrap-break-word'>{b}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className='rounded-xl border bg-card p-4'>
                      <p className='text-sm font-semibold'>O que você ganha</p>
                      <div className='mt-3 flex flex-wrap gap-2'>
                        {item.outcomes.map((o) => (
                          <Badge
                            key={o}
                            className='rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary'
                          >
                            {o}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className='flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between'>
                      <p className='text-xs text-muted-foreground'>
                        Quer ver como fica no seu segmento?
                      </p>

                      <Button
                        asChild
                        className='bg-primary text-primary-foreground hover:bg-primary/90'
                      >
                        <Link href='#precos'>Solicitar proposta</Link>
                      </Button>
                    </div>
                  </div>
                </TabsContent>
              ))}
            </div>
          </div>
        </Tabs>
      </Card>
    </div>
  );
};

export const SolutionsTabs = () => {
  const first = USE_CASES[0]?.id ?? 'agenda';

  return (
    <Section id='solucoes' className='bg-primary py-14 md:py-20'>
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

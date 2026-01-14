'use client';

import {
  BadgeCheck,
  ChevronRight,
  ClipboardList,
  Dumbbell,
  Hand,
  HeartPulse,
  Mic,
  Scale,
  Scissors,
  Sparkles,
  Stethoscope,
  SyringeIcon,
  Timer,
  UtensilsCrossed,
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
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

type SegmentId =
  | 'medicos'
  | 'clinicas'
  | 'barbearias'
  | 'advogados'
  | 'restaurantes'
  | 'personal'
  | 'dentistas'
  | 'fisioterapeutas'
  | 'tatuadores'
  | 'fonoaudiologos';

type Segment = {
  id: SegmentId;
  label: string;
  pillLabel: string;
  icon: React.ElementType;
  short: string;

  overview: string;
  firstDelivery: string[];
  nextStep: string;

  eta: string;
};

const SEGMENTS: Segment[] = [
  {
    id: 'medicos',
    label: 'Médicos',
    pillLabel: 'Médicos',
    icon: Stethoscope,
    short: 'Agendamentos, confirmação e pagamentos com fluxo simples.',
    overview:
      'Estrutura focada em reduzir atrito: o paciente entende o serviço, agenda em poucos cliques e recebe confirmação automática.',
    firstDelivery: [
      'Página do profissional com CTA direto (WhatsApp/agenda)',
      'Agenda + confirmação automática por WhatsApp/e-mail',
      'Formulário de pré-triagem (opcional) e histórico básico',
      'Checkout simples (quando fizer sentido)',
    ],
    nextStep:
      'Definir especialidade + tipo de agenda (online/presencial) e formas de pagamento.',
    eta: 'até 7 dias*',
  },
  {
    id: 'clinicas',
    label: 'Clínicas e consultórios',
    pillLabel: 'Clínicas',
    icon: HeartPulse,
    short: 'Fluxo multi-serviço: captação, agenda, confirmação e gestão.',
    overview:
      'Ideal para múltiplos serviços/profissionais. Organiza rotina, centraliza pedidos e padroniza a operação.',
    firstDelivery: [
      'Catálogo de serviços e profissionais',
      'Agendamento por serviço/profissional + confirmação',
      'Painel simples para gestão (serviços, horários, preços)',
      'Relatórios básicos (agendamentos, origem e conversão)',
    ],
    nextStep:
      'Mapear serviços + horários e alinhar regras de confirmação/cancelamento.',
    eta: 'até 7 dias*',
  },
  {
    id: 'barbearias',
    label: 'Barbearias',
    pillLabel: 'Barbearias',
    icon: Scissors,
    short: 'Agenda por barbeiro/serviço + confirmação automática.',
    overview:
      'Fluxo pronto para conversão: vitrine do serviço → escolha de horário → confirmação e lembrete automático.',
    firstDelivery: [
      'Página de serviços + preços',
      'Agenda por barbeiro/serviço',
      'Confirmação + lembretes automáticos',
      'Checkout (quando fizer sentido) e automações básicas',
    ],
    nextStep: 'Definir serviços, duração média e disponibilidade por barbeiro.',
    eta: 'até 7 dias*',
  },
  {
    id: 'advogados',
    label: 'Advogados',
    pillLabel: 'Advogados',
    icon: Scale,
    short: 'Triagem, agenda e acompanhamento com fluxo de atendimento.',
    overview:
      'Organiza entrada de novos casos e reduz vai-e-volta. O cliente solicita, você triage e agenda com clareza.',
    firstDelivery: [
      'Página por área de atuação + CTA',
      'Formulário de triagem (documentos e contexto)',
      'Agenda + confirmação automática',
      'Painel simples de solicitações',
    ],
    nextStep:
      'Definir áreas, perguntas de triagem e formato da consultoria (online/presencial).',
    eta: 'até 7 dias*',
  },
  {
    id: 'restaurantes',
    label: 'Restaurantes',
    pillLabel: 'Restaurantes',
    icon: UtensilsCrossed,
    short: 'Cardápio, pedidos e automações para reduzir erros e filas.',
    overview:
      'Uma estrutura clara para o cliente pedir com menos atrito e para você operar com menos confusão.',
    firstDelivery: [
      'Cardápio por categorias + promoções',
      'Pedido via WhatsApp (ou checkout) com dados completos',
      'Automação de confirmação do pedido',
      'Painel simples de itens/valores',
    ],
    nextStep:
      'Definir formato do pedido (retirada/entrega) e meios de pagamento.',
    eta: 'até 7 dias*',
  },
  {
    id: 'personal',
    label: 'Personal trainers',
    pillLabel: 'Personal',
    icon: Dumbbell,
    short: 'Captação, agendamento e pagamentos para planos.',
    overview:
      'Fluxo otimizado para fechar: prova social + oferta clara + agendamento de avaliação + pagamento de plano.',
    firstDelivery: [
      'Página de planos/serviços + CTA',
      'Agendamento de avaliação/treino',
      'Pagamento (quando fizer sentido) e confirmação',
      'Área básica para acompanhar alunos (opcional)',
    ],
    nextStep: 'Definir planos, preço e como será a avaliação inicial.',
    eta: 'até 7 dias*',
  },
  {
    id: 'dentistas',
    label: 'Dentistas',
    pillLabel: 'Dentistas',
    icon: SyringeIcon,
    short: 'Agendamento e confirmação com foco em retorno e recorrência.',
    overview:
      'Mais previsibilidade: paciente agenda, confirma e recebe lembretes — reduz faltas e melhora retorno.',
    firstDelivery: [
      'Página de procedimentos + CTA',
      'Agenda + confirmação automática',
      'Formulário de anamnese (opcional)',
      'Follow-up simples (retorno/lembrete)',
    ],
    nextStep: 'Definir procedimentos, regras de retorno e horários.',
    eta: 'até 7 dias*',
  },
  {
    id: 'fisioterapeutas',
    label: 'Fisioterapeutas',
    pillLabel: 'Fisioterapia',
    icon: Hand,
    short: 'Agenda, confirmação e acompanhamento do tratamento.',
    overview:
      'Estrutura pensada para plano de sessões: agendamento claro, confirmação e acompanhamento básico.',
    firstDelivery: [
      'Página do serviço + CTA',
      'Agenda + confirmação automática',
      'Controle simples de sessões (opcional)',
      'Pagamento (quando fizer sentido)',
    ],
    nextStep:
      'Definir formato (sessões avulsas/pacotes) e regras de confirmação.',
    eta: 'até 7 dias*',
  },
  {
    id: 'tatuadores',
    label: 'Tatuadores',
    pillLabel: 'Tatuador',
    icon: ClipboardList,
    short: 'Orçamento, agenda e sinal para reservar horário.',
    overview:
      'Fluxo para reduzir curiosos: formulário de orçamento → triagem → agenda → sinal para confirmar.',
    firstDelivery: [
      'Portfólio + formulário de orçamento',
      'Triagem de referências e tamanho/estilo',
      'Agenda + confirmação',
      'Pagamento de sinal (quando fizer sentido)',
    ],
    nextStep:
      'Definir como você cobra sinal e quais campos precisa na triagem.',
    eta: 'até 7 dias*',
  },
  {
    id: 'fonoaudiologos',
    label: 'Fonoaudiólogos',
    pillLabel: 'Fono',
    icon: Mic,
    short: 'Captação, agenda e acompanhamento de sessões.',
    overview:
      'Organiza o início do atendimento e reduz atrito com responsáveis/pacientes, com confirmação e lembretes.',
    firstDelivery: [
      'Página do serviço + CTA',
      'Agenda + confirmação automática',
      'Triagem inicial (opcional)',
      'Acompanhamento básico de sessões (opcional)',
    ],
    nextStep: 'Definir público-alvo e fluxo de triagem (se necessário).',
    eta: 'até 7 dias*',
  },
];

type HowItWorksSolutionsDialogProps = {
  triggerLabel?: string;
  pricesSectionId?: string; // ex: "precos"
  triggerVariant?:
    | 'default'
    | 'outline'
    | 'secondary'
    | 'destructive'
    | 'ghost'
    | 'link';
  triggerClassName?: string;
};

export const HowItWorksSolutionsDialog = ({
  triggerLabel = 'Ver segmentos atendidos',
  pricesSectionId = 'precos',
  triggerVariant = 'outline',
  triggerClassName,
}: HowItWorksSolutionsDialogProps) => {
  const [open, setOpen] = React.useState(false);
  const [activeId, setActiveId] = React.useState<SegmentId | null>(null);
  const [query, setQuery] = React.useState('');

  React.useEffect(() => {
    if (!open) return;

    // sempre que abrir o dialog, começa tudo fechado e sem busca
    setQuery('');
    setActiveId(null);
  }, [open]);

  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return SEGMENTS;

    return SEGMENTS.filter((s) => {
      const hay = `${s.label} ${s.short} ${s.overview}`.toLowerCase();
      return hay.includes(q);
    });
  }, [query]);

  const handleScrollToPrices = () => {
    setOpen(false);
    window.setTimeout(() => {
      document
        .getElementById(pricesSectionId)
        ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 120);
  };

  const budgetHref = (segment: SegmentId) =>
    `/budget?segment=${encodeURIComponent(segment)}`;

  // garante que o ativo sempre esteja visível no filtro
  React.useEffect(() => {
    if (!open) return;
    const q = query.trim();
    if (!q) return; // sem busca: fica tudo fechado
    if (!filtered.length) return;

    // se já tem um ativo e ele ainda está no filtro, mantém
    if (activeId && filtered.some((s) => s.id === activeId)) return;

    // busca ativa: abre o primeiro resultado
    setActiveId(filtered[0].id);
  }, [filtered, activeId, open, query]);

  const scrollToSegment = (id: SegmentId) => {
    window.setTimeout(() => {
      document.getElementById(`segment-${id}`)?.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
      });
    }, 0);
  };

  const selectSegment = (id: SegmentId) => {
    const next = activeId === id ? null : id; // se clicar no mesmo, fecha
    setActiveId(next);

    // só faz scroll quando estiver ABRINDO (não quando estiver fechando)
    if (next) scrollToSegment(next);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant={triggerVariant}
          className={cn(
            'border-border bg-transparent text-foreground hover:bg-muted',
            triggerClassName,
          )}
        >
          {triggerLabel}
        </Button>
      </DialogTrigger>

      <DialogContent className='w-[calc(100vw-1rem)] max-w-280 p-0 overflow-hidden'>
        <div
          className='max-h-[85vh] overflow-y-auto overflow-x-hidden
          [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden'
        >
          {/* HEADER */}
          <div className='border-b bg-muted/30 p-5 sm:p-6'>
            <DialogHeader className='space-y-3'>
              <DialogTitle className='flex items-center gap-2 text-lg font-semibold tracking-tight sm:text-xl'>
                <span className='inline-flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary'>
                  <Sparkles className='h-4 w-4' />
                </span>
                Segmentos atendidos
              </DialogTitle>

              <DialogDescription className='text-sm sm:text-base'>
                Escolha seu segmento e veja exemplos de funcionalidades e fluxos
                que costumam entrar na 1ª entrega.
              </DialogDescription>

              <div className='flex flex-wrap items-center gap-2 pt-1'>
                <Badge className='bg-primary/10 text-primary'>
                  Mobile-first
                </Badge>
                <Badge variant='secondary' className='gap-1'>
                  <Timer className='h-3.5 w-3.5' />
                  Retorno em 24h úteis
                </Badge>
                <Badge variant='secondary'>Sem fidelidade</Badge>
              </div>
            </DialogHeader>
          </div>

          {/* BODY */}
          <div className='space-y-4 p-5 sm:p-6'>
            {/* SEARCH */}
            <div className='grid gap-2'>
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder='Buscar segmento (ex: médico, barbearia, advogado...)'
                className='h-11'
              />
            </div>

            {/* PILLS (rolável horizontal invisível) */}
            <div
              className='-mx-1 flex gap-2 overflow-x-auto px-1 pb-1
              [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden'
            >
              {SEGMENTS.map((s) => {
                const isActive = activeId === s.id;
                const Icon = s.icon;

                return (
                  <button
                    key={s.id}
                    type='button'
                    onClick={() => selectSegment(s.id)}
                    className={[
                      'shrink-0 rounded-full border px-3 py-1.5 text-sm transition',
                      'inline-flex items-center gap-2',
                      isActive
                        ? 'border-primary/30 bg-primary/10 text-primary'
                        : 'border-border bg-background text-foreground hover:bg-muted',
                    ].join(' ')}
                  >
                    <Icon className='h-4 w-4' />
                    {s.pillLabel}
                  </button>
                );
              })}
            </div>

            {/* LISTA + DETALHE INLINE (efeito FAQ) */}
            <Card className='p-4 sm:p-5'>
              <div className='flex items-start justify-between gap-3'>
                <div className='min-w-0'>
                  <p className='text-xs font-medium text-muted-foreground'>
                    Segmentos
                  </p>
                  <p className='mt-1 text-sm font-semibold'>
                    {query.trim() ? 'Resultados' : 'Todos os segmentos'}
                  </p>
                </div>

                <Badge variant='secondary' className='shrink-0'>
                  {filtered.length}
                </Badge>
              </div>

              <Separator />

              <div className='grid gap-3'>
                {filtered.length ? (
                  filtered.map((s) => {
                    const Icon = s.icon;
                    const isActive = s.id === activeId;

                    return (
                      <div
                        key={s.id}
                        id={`segment-${s.id}`}
                        className={[
                          'group rounded-2xl border transition-colors',
                          isActive
                            ? 'border-primary/30 bg-primary/5 hover:bg-primary/10'
                            : 'border-border bg-background hover:bg-muted/40',
                        ].join(' ')}
                      >
                        {/* header clicável */}
                        <button
                          type='button'
                          onClick={() => selectSegment(s.id)}
                          className={[
                            'w-full rounded-2xl bg-transparent p-4 text-left',
                          ].join(' ')}
                          aria-expanded={isActive}
                        >
                          <div className='flex items-start gap-3'>
                            <span className='mt-0.5 inline-flex h-10 w-10 items-center justify-center rounded-full bg-muted text-foreground'>
                              <Icon className='h-5 w-5 opacity-70' />
                            </span>

                            <div className='min-w-0 flex-1'>
                              <div className='flex items-start justify-between gap-3'>
                                <div className='min-w-0'>
                                  <p className='truncate text-sm font-semibold'>
                                    {s.label}
                                  </p>
                                </div>

                                <span className='text-xs text-muted-foreground'>
                                  ›
                                </span>
                              </div>

                              <p className='mt-1 text-sm text-muted-foreground'>
                                {s.short}
                              </p>
                            </div>
                          </div>
                        </button>

                        {/* detalhe abre logo abaixo (FAQ effect) */}
                        {isActive && (
                          <div className='px-4 pb-4 pt-3'>
                            <div className=' rounded-xl border bg-background p-4'>
                              <div className='flex items-start justify-between gap-3'>
                                <div className='min-w-0'>
                                  <p className='text-xs font-medium text-muted-foreground'>
                                    Segmento selecionado
                                  </p>
                                  <p className='mt-1 text-sm font-semibold'>
                                    {s.label}
                                  </p>
                                </div>

                                <Badge className='shrink-0 bg-primary/10 text-primary'>
                                  {s.eta}
                                </Badge>
                              </div>

                              <p className='mt-2 text-sm text-muted-foreground'>
                                {s.overview}
                              </p>

                              <Separator className='my-3' />

                              <p className='text-sm font-semibold'>
                                O que costuma entrar
                              </p>

                              <div className='mt-3 grid gap-2'>
                                {s.firstDelivery.map((item) => (
                                  <div
                                    key={item}
                                    className='flex items-start gap-2'
                                  >
                                    <span className='mt-0.5 inline-flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 text-primary'>
                                      <BadgeCheck className='h-3.5 w-3.5' />
                                    </span>
                                    <span className='text-sm text-muted-foreground'>
                                      {item}
                                    </span>
                                  </div>
                                ))}
                              </div>

                              <div className='mt-4 rounded-xl border bg-background p-4'>
                                <p className='text-sm font-semibold'>
                                  Próximo passo
                                </p>
                                <p className='mt-1 text-sm text-muted-foreground'>
                                  {s.nextStep}
                                </p>
                              </div>

                              {/* CTAs (não ficam sticky, não cobrem conteúdo) */}
                              <div className='mt-4 grid gap-2'>
                                <Button
                                  type='button'
                                  variant='outline'
                                  className='h-11 w-full'
                                  onClick={handleScrollToPrices}
                                >
                                  Ver preços
                                </Button>

                                <Button asChild className='h-11 w-full'>
                                  <Link
                                    href={budgetHref(s.id)}
                                    onClick={() => setOpen(false)}
                                  >
                                    Solicitar orçamento{' '}
                                    <ChevronRight className='ml-1 h-4 w-4' />
                                  </Link>
                                </Button>

                                <p className='text-center text-[11px] text-muted-foreground'>
                                  Próximo passo: solicitar proposta para{' '}
                                  <span className='font-medium text-foreground'>
                                    {s.label}
                                  </span>
                                  .
                                </p>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })
                ) : (
                  <div className='rounded-xl border bg-muted/30 p-4 text-sm text-muted-foreground'>
                    Nenhum segmento encontrado para “{query}”.
                  </div>
                )}
              </div>
            </Card>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

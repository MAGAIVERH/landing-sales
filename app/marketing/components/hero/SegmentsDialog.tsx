'use client';

import * as React from 'react';
import Link from 'next/link';
import {
  Building2,
  CheckCircle2,
  ChevronRight,
  Dumbbell,
  HeartPulse,
  Mic2,
  Scale,
  Scissors,
  Search,
  Sparkles,
  Stethoscope,
  Timer,
  UtensilsCrossed,
} from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

type Segment = {
  id: string;
  title: string;
  pillLabel: string; // ✅ novo: label curto para o chip
  icon: React.ElementType;
  badge?: string;
  eta?: string;
  tagline: string;
  bullets: string[];
  outcomes: string[];
  integrations: string[];
};

type SegmentsDialogProps = {
  segments?: Segment[];
};

const DEFAULT_SEGMENTS: Segment[] = [
  {
    id: 'barbearias',
    title: 'Barbearias',
    pillLabel: 'Barbearias',
    icon: Scissors,
    badge: 'Alta conversão',
    eta: 'até 7 dias*',
    tagline: 'Agenda, serviços e checkout com fluxo pronto.',
    bullets: [
      'Agenda por barbeiro/serviço',
      'Confirmação e lembretes',
      'Pagamento e controle de pedidos',
    ],
    outcomes: [
      'Mais agendamentos confirmados',
      'Menos no-show',
      'Operação padronizada',
    ],
    integrations: ['WhatsApp', 'Calendar', 'Pagamentos', 'Chat AI'],
  },
  {
    id: 'medicos',
    title: 'Médicos',
    pillLabel: 'Médicos',
    icon: Stethoscope,
    eta: 'até 7 dias*',
    tagline: 'Organize agenda e atendimento com experiência mobile-first.',
    bullets: [
      'Agendamento e confirmação',
      'Organização de pacientes e retornos',
      'Pagamentos e status',
    ],
    outcomes: [
      'Agenda organizada',
      'Processo mais fluido',
      'Menos tarefas manuais',
    ],
    integrations: ['WhatsApp', 'Pagamentos', 'Calendar', 'Chat AI'],
  },
  {
    id: 'clinicas',
    title: 'Clínicas e consultórios',
    pillLabel: 'Clínicas',
    icon: Building2,
    badge: 'Mais procurado',
    eta: 'até 7 dias*',
    tagline: 'Agendamentos, confirmação e pagamentos com fluxo simples.',
    bullets: [
      'Agenda + confirmação automática',
      'Cadastro de pacientes e histórico',
      'Pagamento online e controle de status',
    ],
    outcomes: [
      'Menos faltas',
      'Atendimento organizado',
      'Operação pronta para escalar',
    ],
    integrations: ['WhatsApp', 'Pagamentos', 'Calendar', 'Chat AI'],
  },
  {
    id: 'fisioterapeutas',
    title: 'Fisioterapeutas',
    pillLabel: 'Fisio',
    icon: HeartPulse,
    eta: 'até 7 dias*',
    tagline: 'Sessões, agenda e cobrança em um único fluxo.',
    bullets: [
      'Agenda por sessão/recorrência',
      'Controle de pacotes e pagamentos',
      'Mensagens de confirmação',
    ],
    outcomes: ['Rotina previsível', 'Menos faltas', 'Operação organizada'],
    integrations: ['WhatsApp', 'Pagamentos', 'Calendar', 'Chat AI'],
  },
  {
    id: 'fonoaudiologos',
    title: 'Fonoaudiólogos',
    pillLabel: 'Fono',
    icon: Mic2,
    eta: 'até 7 dias*',
    tagline: 'Agendamento e acompanhamento com operação simples.',
    bullets: [
      'Agenda e confirmação',
      'Cadastro e acompanhamento',
      'Pagamentos e status',
    ],
    outcomes: ['Mais organização', 'Fluxo claro', 'Menos retrabalho'],
    integrations: ['WhatsApp', 'Pagamentos', 'Calendar', 'Chat AI'],
  },
  {
    id: 'advogados',
    title: 'Advogados',
    pillLabel: 'Advogados',
    icon: Scale,
    eta: 'até 7 dias*',
    tagline: 'Triagem, agenda e acompanhamento com fluxo de atendimento.',
    bullets: [
      'Captação e triagem do cliente',
      'Agenda e acompanhamento',
      'Organização por status e prioridade',
    ],
    outcomes: [
      'Mais conversão no primeiro contato',
      'Atendimento padronizado',
      'Operação organizada',
    ],
    integrations: ['WhatsApp', 'Agendamentos', 'Pagamentos', 'Chat AI'],
  },
  {
    id: 'personal-trainers',
    title: 'Personal trainers',
    pillLabel: 'Personal',
    icon: Dumbbell,
    eta: 'até 7 dias*',
    tagline: 'Planos, agenda e pagamentos com jornada objetiva.',
    bullets: [
      'Agendamentos e sessões',
      'Planos e renovação',
      'Pagamento online e status',
    ],
    outcomes: [
      'Mais retenção',
      'Menos trabalho manual',
      'Experiência profissional',
    ],
    integrations: ['WhatsApp', 'Pagamentos', 'Agenda', 'Chat AI'],
  },
  {
    id: 'restaurantes',
    title: 'Restaurantes',
    pillLabel: 'Restaurantes',
    icon: UtensilsCrossed,
    eta: 'até 7 dias*',
    tagline: 'Reservas/pedidos e automações de atendimento.',
    bullets: [
      'Fluxo de reserva/solicitação',
      'Automação de confirmações',
      'Organização por status e horários',
    ],
    outcomes: [
      'Atendimento mais rápido',
      'Mais previsibilidade',
      'Menos confusão operacional',
    ],
    integrations: ['WhatsApp', 'Agendamentos', 'Pagamentos', 'Chat AI'],
  },
];

const scrollInvisible =
  '[-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden';

export const SegmentsDialog = ({ segments }: SegmentsDialogProps) => {
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState('');

  const allSegments = segments?.length ? segments : DEFAULT_SEGMENTS;

  const [activeId, setActiveId] = React.useState<string>(() => {
    const preferred = allSegments.find((s) => s.badge)?.id;
    return preferred ?? allSegments[0]?.id ?? 'medicos';
  });

  const filteredChips = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return allSegments;

    return allSegments.filter((s) => {
      const hay = [
        s.title,
        s.tagline,
        s.pillLabel,
        ...s.bullets,
        ...s.outcomes,
        ...s.integrations,
      ]
        .join(' ')
        .toLowerCase();
      return hay.includes(q);
    });
  }, [allSegments, query]);

  React.useEffect(() => {
    if (filteredChips.length === 0) return;
    const stillExists = filteredChips.some((s) => s.id === activeId);
    if (!stillExists) setActiveId(filteredChips[0].id);
  }, [filteredChips, activeId]);

  const active = React.useMemo(() => {
    return allSegments.find((s) => s.id === activeId) ?? allSegments[0];
  }, [allSegments, activeId]);

  const handleScrollToPrices = () => {
    setOpen(false);
    window.setTimeout(() => {
      document
        .getElementById('precos')
        ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 120);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant='outline'>Ver segmentos atendidos</Button>
      </DialogTrigger>

      <DialogContent className='w-[calc(100vw-1rem)] max-w-280 p-0 overflow-hidden'>
        <div
          className={`max-h-[85vh] overflow-y-auto overflow-x-hidden ${scrollInvisible}`}
        >
          {/* HEADER */}
          <div className='border-b bg-muted/30 p-5 sm:p-6'>
            <DialogHeader className='space-y-3'>
              <DialogTitle className='text-xl font-semibold tracking-tight sm:text-2xl'>
                Segmentos atendidos
              </DialogTitle>

              <DialogDescription className='text-sm sm:text-base'>
                Escolha seu segmento e veja exemplos de funcionalidades e fluxos
                que costumam entrar na 1ª entrega.
              </DialogDescription>

              <div className='flex flex-wrap items-center gap-2'>
                <Badge className='bg-primary/10 text-primary'>
                  Mobile-first
                </Badge>
                <Badge variant='secondary' className='gap-1'>
                  <Timer className='h-3.5 w-3.5' />
                  Retorno em 24h úteis
                </Badge>
                <Badge variant='secondary'>Sem fidelidade</Badge>
              </div>

              {/* BUSCA */}
              <div className='relative w-full'>
                <Search className='pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground' />
                <Input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder='Buscar profissão ou segmento...'
                  className='w-full pl-9'
                />
              </div>

              {/* CHIPS COM ÍCONE ✅ */}
              <div
                className={`-mx-1 flex w-[calc(100%+0.5rem)] gap-2 overflow-x-auto px-1 pb-1 ${scrollInvisible} [-webkit-overflow-scrolling:touch]`}
              >
                {(filteredChips.length ? filteredChips : allSegments).map(
                  (s) => {
                    const isActive = s.id === activeId;
                    const Icon = s.icon;

                    return (
                      <button
                        key={s.id}
                        type='button'
                        onClick={() => setActiveId(s.id)}
                        className={[
                          'h-9 shrink-0 rounded-full border px-3 text-sm font-medium transition',
                          'inline-flex items-center gap-2',
                          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
                          isActive
                            ? 'border-primary/30 bg-primary text-primary-foreground shadow-sm'
                            : 'bg-background hover:bg-muted/40',
                        ].join(' ')}
                      >
                        <Icon className='h-4 w-4' />
                        {s.pillLabel}
                      </button>
                    );
                  },
                )}
              </div>
            </DialogHeader>
          </div>

          {/* BODY */}
          <div className='space-y-6 p-5 sm:p-6'>
            {/* RESUMO */}
            <Card className='p-4 sm:p-5'>
              <div className='flex items-start justify-between gap-3'>
                <div className='min-w-0'>
                  <p className='text-xs font-medium text-muted-foreground'>
                    Segmento selecionado
                  </p>
                  <div className='mt-1 flex flex-wrap items-center gap-2'>
                    <p className='text-base font-semibold sm:text-lg'>
                      {active.title}
                    </p>
                    {active.badge ? (
                      <Badge className='bg-primary/10 text-primary'>
                        {active.badge}
                      </Badge>
                    ) : null}
                  </div>
                  <p className='mt-1 text-sm text-muted-foreground'>
                    {active.tagline}
                  </p>
                </div>

                {active.eta ? (
                  <Badge className='shrink-0 bg-primary/10 text-primary'>
                    {active.eta}
                  </Badge>
                ) : null}
              </div>
            </Card>

            {/* O QUE ENTRA */}
            <Card className='p-4 sm:p-5'>
              <p className='text-xs font-medium text-muted-foreground'>
                O que costuma entrar na 1ª entrega
              </p>
              <Separator className='my-2' />

              <div className='grid gap-3 sm:grid-cols-2'>
                {active.bullets.map((b) => (
                  <div key={b} className='flex items-start gap-2'>
                    <span className='mt-0.5 inline-flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 text-primary'>
                      <CheckCircle2 className='h-3.5 w-3.5' />
                    </span>
                    <span className='text-sm text-muted-foreground'>{b}</span>
                  </div>
                ))}
              </div>
            </Card>

            {/* GANHOS + CTA */}
            <Card className='p-4 sm:p-5'>
              <div className='flex items-start justify-between gap-3'>
                <div>
                  <p className='text-xs font-medium text-muted-foreground'>
                    O que você ganha
                  </p>
                  <p className='mt-1 text-sm font-semibold'>
                    Resultado esperado
                  </p>
                </div>
                <Badge variant='secondary' className='shrink-0'>
                  Sem fidelidade
                </Badge>
              </div>

              <div className='mt-4 grid gap-3 sm:grid-cols-2'>
                {active.outcomes.map((o) => (
                  <div key={o} className='flex items-start gap-2'>
                    <span className='mt-0.5 inline-flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 text-primary'>
                      <Sparkles className='h-3.5 w-3.5' />
                    </span>
                    <span className='text-sm text-muted-foreground'>{o}</span>
                  </div>
                ))}
              </div>

              <Separator className='my-2' />

              <div>
                <p className='text-xs font-medium text-muted-foreground'>
                  Integrações comuns
                </p>
                <div className='mt-2 flex flex-wrap gap-2'>
                  {active.integrations.map((i) => (
                    <Badge key={i} variant='secondary'>
                      {i}
                    </Badge>
                  ))}
                </div>
              </div>

              <Separator className='my-2' />

              <div className='grid gap-3 sm:grid-cols-2'>
                <Button asChild className='h-11 w-full'>
                  <Link href={`/budget?segment=${active.id}`}>
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

              <p className='mt-4 text-xs text-muted-foreground'>
                Retorno em até 24h úteis. *Prazo varia conforme escopo e
                integrações.
              </p>
            </Card>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

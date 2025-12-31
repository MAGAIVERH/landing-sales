import type { ElementType } from 'react';
import Link from 'next/link';
import {
  MessageCircle,
  ArrowRight,
  Clock,
  CheckCircle2,
  TrendingUp,
  Users,
} from 'lucide-react';

import { prisma } from '@/lib/prisma';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { WorkflowCarousel } from './components/workflow-carousel';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const formatBRL = (cents: number) => {
  const value = cents / 100;
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
};

const startOfUTCDay = (d: Date) =>
  new Date(
    Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate(), 0, 0, 0),
  );

const addDaysUTC = (d: Date, days: number) => {
  const x = new Date(d);
  x.setUTCDate(x.getUTCDate() + days);
  return x;
};

const onlyDigits = (value?: string | null) => (value ?? '').replace(/\D/g, '');

const buildWhatsAppLink = (phone: string, text: string) => {
  const digits = onlyDigits(phone);
  if (!digits) return null;
  return `https://wa.me/${digits}?text=${encodeURIComponent(text)}`;
};

export default async function AdminPage() {
  const now = new Date();
  const today = startOfUTCDay(now);
  const tomorrow = addDaysUTC(today, 1);
  const start7 = addDaysUTC(today, -6);

  // Promise.all só com as queries que realmente estão no array
  const [
    leadsToday,
    leads7,
    paidOrdersToday,
    paidOrders7,
    revenue7,
    onboardingPending,
    onboardingsStarted7,
    recentLeads,
    readyForProduction,
    stalledBriefings,
    pendingUpsells,
  ] = await Promise.all([
    prisma.lead.count({ where: { createdAt: { gte: today, lt: tomorrow } } }),
    prisma.lead.count({ where: { createdAt: { gte: start7, lt: tomorrow } } }),

    prisma.order.count({
      where: { status: 'PAID', paidAt: { gte: today, lt: tomorrow } },
    }),
    prisma.order.count({
      where: { status: 'PAID', paidAt: { gte: start7, lt: tomorrow } },
    }),

    prisma.order.aggregate({
      where: { status: 'PAID', paidAt: { gte: start7, lt: tomorrow } },
      _sum: { amountTotal: true },
    }),

    prisma.briefing.count({ where: { status: 'DRAFT' } }),
    prisma.briefing.count({
      where: { createdAt: { gte: start7, lt: tomorrow } },
    }),

    prisma.lead.findMany({
      take: 12,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        message: true,
        landingPath: true,
        createdAt: true,
      },
    }),

    // 1) PRONTOS PARA PRODUÇÃO: pedido pago + briefing SUBMITTED
    prisma.order.findMany({
      take: 12,
      orderBy: { paidAt: 'desc' },
      where: {
        status: 'PAID',
        briefing: { status: 'SUBMITTED' },
      },
      include: {
        lead: true,
        price: { include: { product: true } },
        briefing: true,
      },
    }),

    // 2) PARADOS: briefing DRAFT atualizado há 2+ dias
    prisma.briefing.findMany({
      take: 12,
      orderBy: { updatedAt: 'asc' },
      where: {
        status: 'DRAFT',
        updatedAt: { lt: addDaysUTC(today, -2) },
      },
      include: {
        order: {
          include: {
            lead: true,
            price: { include: { product: true } },
          },
        },
      },
    }),

    // 3) UPSELL PENDENTE (tentou comprar e parou)
    prisma.upsellPurchase.findMany({
      take: 12,
      orderBy: { createdAt: 'desc' },
      where: { kind: 'hosting', status: 'PENDING' },
      include: {
        order: {
          include: {
            lead: true,
            price: { include: { product: true } },
          },
        },
      },
    }),
  ]);

  // 4) NÃO CONTRATOU HOSTING: pedido PAID sem nenhum registro de upsellPurchase kind=hosting
  // (sem depender de relation "upsellPurchases" no Order, porque no meu schema não existe)
  const hostingUpsellOrderIds = await prisma.upsellPurchase.findMany({
    where: { kind: 'hosting' }, // qualquer status (PENDING ou PAID)
    select: { orderId: true },
  });

  const hostingIds = hostingUpsellOrderIds.map((x) => x.orderId);

  const notContractedHostingOrders = await prisma.order.findMany({
    take: 12,
    orderBy: { paidAt: 'desc' },
    where: {
      status: 'PAID',
      paidAt: { gte: start7, lt: tomorrow },
      ...(hostingIds.length ? { id: { notIn: hostingIds } } : {}),
    },
    include: {
      lead: true,
      price: { include: { product: true } },
    },
  });

  const revenue7Cents = revenue7._sum.amountTotal ?? 0;
  const conversion7 = leads7 > 0 ? Math.round((paidOrders7 / leads7) * 100) : 0;

  // props serializáveis para o client component
  const ready = readyForProduction.map((o) => ({
    orderId: o.id,
    email: o.customerEmail ?? o.lead?.email ?? 'sem email',
    product: o.price.product.name,
    total: formatBRL(o.amountTotal),
  }));

  const stalled = stalledBriefings.map((b) => {
    const phone = b.order.lead?.phone ?? '';
    const msg =
      `Olá! Vi que seu briefing ainda não foi concluído.\n\n` +
      `Pode finalizar quando possível? Se preferir, posso te ajudar por aqui.\n\n` +
      `Pedido: ${b.orderId}`;

    return {
      orderId: b.orderId,
      email: b.order.customerEmail ?? b.order.lead?.email ?? 'sem email',
      product: b.order.price.product.name,
      updatedAt: b.updatedAt.toISOString().slice(0, 10),
      whatsappLink: buildWhatsAppLink(phone, msg),
    };
  });

  // Upsell com 2 categorias (badge forte)
  const pending = pendingUpsells.map((u) => ({
    orderId: u.orderId,
    email: u.order.customerEmail ?? u.order.lead?.email ?? 'sem email',
    product: u.order.price.product.name,
    createdAt: u.createdAt.toISOString().slice(0, 10),
    tag: 'PENDING' as const, // tentou e parou
  }));

  const notContracted = notContractedHostingOrders.map((o) => ({
    orderId: o.id,
    email: o.customerEmail ?? o.lead?.email ?? 'sem email',
    product: o.price.product.name,
    createdAt: (o.paidAt ?? o.createdAt).toISOString().slice(0, 10),
    tag: 'NOT_CONTRACTED' as const, // nunca tentou
  }));

  const upsells = [...pending, ...notContracted];

  const leads = recentLeads.map((l) => {
    const msg =
      `Olá! Vi sua solicitação e vou te enviar os próximos passos.\n\n` +
      `Nome: ${l.name ?? '-'}\n` +
      `E-mail: ${l.email ?? '-'}\n` +
      `WhatsApp: ${l.phone ?? '-'}\n\n` +
      `Pode me confirmar o segmento e o principal objetivo da sua plataforma?`;

    return {
      id: l.id,
      name: l.name ?? 'Sem nome',
      email: l.email ?? 'sem e-mail',
      message: l.message ?? '',
      landingPath: l.landingPath ?? '-',
      whatsappLink: buildWhatsAppLink(l.phone ?? '', msg),
    };
  });

  const KpiCard = ({
    label,
    value,
    helper,
    icon: Icon,
    tone,
  }: {
    label: string;
    value: string;
    helper?: string;
    icon: ElementType;
    tone: 'c1' | 'c2' | 'c3' | 'c4';
  }) => {
    const toneStyles = {
      c1: {
        border: 'border-chart-1/35',
        bar: 'bg-chart-1',
        iconBg: 'bg-chart-1/15',
        iconFg: 'text-chart-1',
      },
      c2: {
        border: 'border-chart-2/35',
        bar: 'bg-chart-2',
        iconBg: 'bg-chart-2/15',
        iconFg: 'text-chart-2',
      },
      c3: {
        border: 'border-chart-3/35',
        bar: 'bg-chart-3',
        iconBg: 'bg-chart-3/15',
        iconFg: 'text-chart-3',
      },
      c4: {
        border: 'border-chart-4/35',
        bar: 'bg-chart-4',
        iconBg: 'bg-chart-4/15',
        iconFg: 'text-chart-4',
      },
    }[tone];

    return (
      <Card
        className={[
          'relative overflow-hidden rounded-2xl border p-4 shadow-sm',
          'sm:p-4',
          toneStyles.border,
        ].join(' ')}
      >
        <div
          className={[
            'absolute left-0 top-0 h-full w-1.5',
            toneStyles.bar,
          ].join(' ')}
        />

        <div className='flex items-start justify-between gap-3'>
          <div className='min-w-0'>
            <p className='text-sm text-muted-foreground'>{label}</p>

            <p className='mt-1 text-xl font-semibold leading-none sm:text-2xl'>
              {value}
            </p>

            {helper ? (
              <p className='mt-2 text-xs text-muted-foreground'>{helper}</p>
            ) : null}
          </div>

          <div
            className={[
              'grid h-10 w-10 shrink-0 place-items-center rounded-xl',
              toneStyles.iconBg,
            ].join(' ')}
          >
            <Icon className={['h-5 w-5', toneStyles.iconFg].join(' ')} />
          </div>
        </div>
      </Card>
    );
  };

  return (
    <div className='grid gap-6'>
      {/* Header */}
      <div className='flex flex-col gap-2'>
        <div className='flex items-center justify-between gap-3'>
          <div>
            <h1 className='text-xl font-semibold'>Visão geral</h1>
            <p className='text-sm text-muted-foreground'>
              KPIs e operação em filas para entrega rápida.
            </p>
          </div>

          <div className='flex items-center gap-2'>
            <Badge variant='secondary'>Últimos 7 dias</Badge>
            <Link href='/admin/workboard'>
              <Button variant='outline' className='h-9 gap-2'>
                Abrir fila prioritária <ArrowRight className='h-4 w-4' />
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <Separator />

      {/* KPIs */}
      <div className='grid gap-3 sm:grid-cols-2 lg:grid-cols-4'>
        <KpiCard
          label='Receita (7 dias)'
          value={formatBRL(revenue7Cents)}
          helper={`Hoje: ${paidOrdersToday} pedido(s) pago(s)`}
          icon={TrendingUp}
          tone='c1'
        />

        <KpiCard
          label='Leads (7 dias)'
          value={`${leads7}`}
          helper={`Hoje: ${leadsToday}`}
          icon={Users}
          tone='c2'
        />

        <KpiCard
          label='Pedidos pagos (7 dias)'
          value={`${paidOrders7}`}
          helper={`Conversão: ${conversion7}%`}
          icon={CheckCircle2}
          tone='c3'
        />

        <KpiCard
          label='Onboarding pendente'
          value={`${onboardingPending}`}
          helper={`Iniciados 7d: ${onboardingsStarted7}`}
          icon={Clock}
          tone='c4'
        />
      </div>

      {/* Filas */}
      <WorkflowCarousel
        ready={ready}
        stalled={stalled}
        upsells={upsells}
        leads={leads}
      />

      {/* Atalhos */}
      <Card className='p-4'>
        <div className='flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between'>
          <div>
            <p className='text-sm font-semibold'>Atalhos</p>
            <p className='mt-1 text-xs text-muted-foreground'>
              Acesse rápido triagem e pedidos.
            </p>
          </div>

          <div className='flex flex-wrap items-center gap-2'>
            <Link href='/admin/orders'>
              <Button variant='outline' className='h-9'>
                Pedidos
              </Button>
            </Link>
            <Link href='/admin/leads'>
              <Button variant='outline' className='h-9 gap-2'>
                <MessageCircle className='h-4 w-4' />
                Leads
              </Button>
            </Link>
          </div>
        </div>
      </Card>
    </div>
  );
}

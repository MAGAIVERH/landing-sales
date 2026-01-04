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

const normalizeWhatsAppNumber = (value?: string | null) => {
  let digits = onlyDigits(value);
  if (!digits) return null;

  if (digits.startsWith('55')) return digits;
  if (digits.length === 10 || digits.length === 11) return `55${digits}`;
  return digits;
};

const buildWhatsAppLink = (phone: string, text: string) => {
  const digits = normalizeWhatsAppNumber(phone);
  if (!digits) return null;
  return `https://wa.me/${digits}?text=${encodeURIComponent(text)}`;
};

const buildEmailLink = (to: string, subject: string, body: string) => {
  if (!to) return null;
  const mailto =
    `mailto:${encodeURIComponent(to)}` +
    `?subject=${encodeURIComponent(subject)}` +
    `&body=${encodeURIComponent(body)}`;

  return mailto;
};

export default async function AdminPage() {
  const now = new Date();
  const today = startOfUTCDay(now);
  const tomorrow = addDaysUTC(today, 1);
  const start7 = addDaysUTC(today, -6);

  const READY_PAGE_SIZE = 20;
  const READY_PREFETCH = 60;

  const [
    leadsToday,
    leads7,
    paidOrdersToday,
    paidOrders7,
    revenue7,
    onboardingPending,
    onboardingsStarted7,
    recentLeads,
    readyForProductionRaw,
    stalledBriefings,
    notStartedOrders,
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

    prisma.order.findMany({
      take: READY_PREFETCH,
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
    // ✅ NOVO: pedidos pagos sem briefing (NOT_STARTED)
    prisma.order.findMany({
      take: 12,
      orderBy: { paidAt: 'desc' },
      where: {
        status: 'PAID',
        briefing: null,
        paidAt: { gte: start7, lt: tomorrow }, // mantém em 7 dias, como o resto do dashboard
      },
      include: {
        lead: true,
        price: { include: { product: true } },
      },
    }),
  ]);

  const recentLeadIds = recentLeads.map((l) => l.id);

  const leadWorkItems = recentLeadIds.length
    ? await prisma.adminWorkItem.findMany({
        where: { kind: 'LEAD', refId: { in: recentLeadIds } },
        select: { refId: true, status: true },
      })
    : [];

  const leadWorkStatusById = new Map(
    leadWorkItems.map((w) => [w.refId, w.status]),
  );

  const activeRecentLeads = recentLeads.filter(
    (l) => (leadWorkStatusById.get(l.id) ?? 'TODO') !== 'DONE',
  );

  const readyIdsRaw = readyForProductionRaw.map((o) => o.id);

  const readyDoneRows = readyIdsRaw.length
    ? await prisma.adminWorkItem.findMany({
        where: {
          kind: 'READY',
          refId: { in: readyIdsRaw },
          status: 'DONE',
        },
        select: { refId: true },
      })
    : [];

  const readyDoneSet = new Set(readyDoneRows.map((w) => w.refId));

  const readyForProduction = readyForProductionRaw
    .filter((o) => !readyDoneSet.has(o.id))
    .slice(0, READY_PAGE_SIZE);

  // =========================
  // ✅ UPSSELL (VISÃO GERAL) — CONECTADO COM OPERAÇÃO
  // - Busca tentativas reais (PENDING) + "não contratou"
  // - Filtra itens marcados como DONE em AdminWorkItem (kind UPSELL)
  // - Prefetch maior para permitir paginação (20 por página no client)
  // =========================

  const UPSSELL_PREFETCH = 60; // para ter volume e permitir páginas
  const pendingUpsellRows = await prisma.upsellPurchase.findMany({
    take: UPSSELL_PREFETCH,
    orderBy: { createdAt: 'desc' },
    where: {
      kind: 'hosting',
      status: 'PENDING',
    },
    distinct: ['orderId'],
    include: {
      order: {
        include: {
          lead: true,
          price: { include: { product: true } },
        },
      },
    },
  });

  const pending = pendingUpsellRows.map((u) => ({
    orderId: u.orderId,
    email: u.order.customerEmail ?? u.order.lead?.email ?? 'sem email',
    product: u.order.price.product.name,
    createdAt: u.createdAt.toISOString().slice(0, 10),
    tag: 'PENDING' as const,
  }));

  const remaining = Math.max(0, UPSSELL_PREFETCH - pending.length);

  const notContractedHostingOrders = remaining
    ? await prisma.order.findMany({
        take: remaining,
        orderBy: { paidAt: 'desc' },
        where: {
          status: 'PAID',
          paidAt: { gte: start7, lt: tomorrow },
          upsells: {
            none: { kind: 'hosting' },
          },
        },
        include: {
          lead: true,
          price: { include: { product: true } },
        },
      })
    : [];

  const notContracted = notContractedHostingOrders.map((o) => ({
    orderId: o.id,
    email: o.customerEmail ?? o.lead?.email ?? 'sem email',
    product: o.price.product.name,
    createdAt: (o.paidAt ?? o.createdAt).toISOString().slice(0, 10),
    tag: 'NOT_CONTRACTED' as const,
  }));

  const upsellsRaw = [...pending, ...notContracted];

  // 🔗 conexão com a tela Operação: se estiver DONE lá, some/atualiza aqui
  const upsellIds = upsellsRaw.map((u) => u.orderId);

  const upsellWorkItems = upsellIds.length
    ? await prisma.adminWorkItem.findMany({
        where: { kind: 'UPSELL', refId: { in: upsellIds } },
        select: { refId: true, status: true },
      })
    : [];

  const upsellStatusById = new Map(
    upsellWorkItems.map((w) => [w.refId, w.status]),
  );

  const upsells = upsellsRaw.filter(
    (u) => (upsellStatusById.get(u.orderId) ?? 'TODO') !== 'DONE',
  );

  // =========================

  const revenue7Cents = revenue7._sum.amountTotal ?? 0;
  const conversion7 = leads7 > 0 ? Math.round((paidOrders7 / leads7) * 100) : 0;

  const ready = readyForProduction.map((o) => ({
    orderId: o.id,
    email: o.customerEmail ?? o.lead?.email ?? 'sem email',
    product: o.price.product.name,
    total: formatBRL(o.amountTotal),
  }));

  const stalledNotStarted = notStartedOrders.map((o) => {
    const appUrl =
      process.env.NEXT_PUBLIC_APP_URL ||
      process.env.APP_URL ||
      'http://localhost:3000';

    const onboardingLink = `${appUrl}/onboarding?orderId=${o.id}`;
    const to = (o.customerEmail ?? o.lead?.email ?? '').trim();

    const subject = `Ação necessária: inicie seu briefing (pedido ${o.id})`;

    const body =
      `Olá! Tudo bem?\n\n` +
      `Seu pedido foi confirmado, e precisamos que você inicie o briefing para começarmos a produção da sua plataforma.\n\n` +
      `Para iniciar agora, acesse o link abaixo:\n` +
      `${onboardingLink}\n\n` +
      `Se tiver qualquer dúvida, é só responder este e-mail.\n\n` +
      `Pedido: ${o.id}`;

    return {
      orderId: o.id,
      email: to || 'sem email',
      product: o.price.product.name,
      updatedAt: `Não iniciou • Pago em: ${(o.paidAt ?? o.createdAt)
        .toISOString()
        .slice(0, 10)}`,
      whatsappLink: buildEmailLink(to, subject, body),
    };
  });

  const stalledDraft = stalledBriefings.map((b) => {
    const appUrl =
      process.env.NEXT_PUBLIC_APP_URL ||
      process.env.APP_URL ||
      'http://localhost:3000';

    const onboardingLink = `${appUrl}/onboarding?orderId=${b.orderId}`;
    const to = (b.order.customerEmail ?? b.order.lead?.email ?? '').trim();

    const subject = `Ação necessária: finalize seu briefing (pedido ${b.orderId})`;

    const body =
      `Olá! Tudo bem?\n\n` +
      `Identificamos que o briefing do seu pedido ainda não foi finalizado. Ele é necessário para iniciarmos a produção da sua plataforma.\n\n` +
      `Para concluir agora, acesse o link abaixo:\n` +
      `${onboardingLink}\n\n` +
      `Se tiver qualquer dúvida, é só responder este e-mail.\n\n` +
      `Pedido: ${b.orderId}`;

    return {
      orderId: b.orderId,
      email: to || 'sem email',
      product: b.order.price.product.name,
      updatedAt: `Parado desde: ${b.updatedAt.toISOString().slice(0, 10)}`,
      whatsappLink: buildEmailLink(to, subject, body),
    };
  });

  const stalled = [...stalledNotStarted, ...stalledDraft];

  const leads = activeRecentLeads.map((l) => {
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

      <WorkflowCarousel
        ready={ready}
        stalled={stalled}
        upsells={upsells}
        leads={leads}
      />

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

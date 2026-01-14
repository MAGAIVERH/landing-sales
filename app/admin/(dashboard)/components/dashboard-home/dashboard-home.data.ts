import { prisma } from '@/lib/prisma';

import type { DashboardHomeData } from './dashboard-home.types';
import {
  addDaysUTC,
  buildEmailLink,
  buildWhatsAppLink,
  formatBRL,
  startOfUTCDay,
} from './dashboard-home.utils';

const READY_PAGE_SIZE = 20;
const READY_PREFETCH = 60;

const UPSSELL_PREFETCH = 60;

export const getDashboardHomeData = async (): Promise<DashboardHomeData> => {
  const now = new Date();
  const today = startOfUTCDay(now);
  const tomorrow = addDaysUTC(today, 1);
  const start7 = addDaysUTC(today, -6);

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

    prisma.order.findMany({
      take: 12,
      orderBy: { paidAt: 'desc' },
      where: {
        status: 'PAID',
        briefing: null,
        paidAt: { gte: start7, lt: tomorrow },
      },
      include: {
        lead: true,
        price: { include: { product: true } },
      },
    }),
  ]);

  const recentLeadIds = recentLeads.map((l: { id: string }) => l.id);

  const leadWorkItems = recentLeadIds.length
    ? await prisma.adminWorkItem.findMany({
        where: { kind: 'LEAD', refId: { in: recentLeadIds } },
        select: { refId: true, status: true },
      })
    : [];

  const leadWorkStatusById = new Map(
    leadWorkItems.map((w: { refId: string; status: string }) => [
      w.refId,
      w.status,
    ]),
  );

  const activeRecentLeads = recentLeads.filter(
    (l: { id: string }) => (leadWorkStatusById.get(l.id) ?? 'TODO') !== 'DONE',
  );

  const readyIdsRaw = readyForProductionRaw.map((o: { id: string }) => o.id);

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

  const readyDoneSet = new Set(
    readyDoneRows.map((w: { refId: string }) => w.refId),
  );

  const readyForProduction = readyForProductionRaw
    .filter((o: { id: string }) => !readyDoneSet.has(o.id))
    .slice(0, READY_PAGE_SIZE);

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

  const pending = pendingUpsellRows.map(
    (u: {
      orderId: string;
      createdAt: Date;
      order: {
        customerEmail: string | null;
        lead: { email: string | null } | null;
        price: { product: { name: string } };
      };
    }) => ({
      orderId: u.orderId,
      email: u.order.customerEmail ?? u.order.lead?.email ?? 'sem email',
      product: u.order.price.product.name,
      createdAt: u.createdAt.toISOString().slice(0, 10),
      tag: 'PENDING' as const,
    }),
  );

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

  const upsellIds = upsellsRaw.map((u) => u.orderId);

  const upsellWorkItems = upsellIds.length
    ? await prisma.adminWorkItem.findMany({
        where: { kind: 'UPSELL', refId: { in: upsellIds } },
        select: { refId: true, status: true },
      })
    : [];

  const upsellStatusById = new Map(
    upsellWorkItems.map((w: { refId: string; status: string }) => [
      w.refId,
      w.status,
    ]),
  );

  const upsells = upsellsRaw.filter(
    (u: { orderId: string }) =>
      (upsellStatusById.get(u.orderId) ?? 'TODO') !== 'DONE',
  );

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

  return {
    kpis: {
      revenue7Cents,
      paidOrdersToday,
      leads7,
      leadsToday,
      paidOrders7,
      conversion7,
      onboardingPending,
      onboardingsStarted7,
    },
    ready,
    stalled,
    upsells,
    leads,
  };
};

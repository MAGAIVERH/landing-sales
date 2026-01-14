import { prisma } from '@/lib/prisma';

import type { WorkboardData } from './workboard.types';
import {
  addDaysUTC,
  buildEmailLink,
  buildWhatsAppLink,
  formatISODate,
  scheduleDaysByAttempts,
  startOfUTCDay,
  toPlain,
} from './workboard.utils';

type Status = WorkboardData['ready'][number]['status'];
type WorkItemKind = 'READY' | 'STALLED' | 'LEAD';
type BriefingPlain = WorkboardData['ready'][number]['briefing'];

type WorkItemRow = {
  kind: WorkItemKind;
  refId: string;
  status: Status;
};

type ReadyOrderRow = {
  id: string;
  status: string;
  customerEmail: string | null;
  paidAt: Date | null;
  createdAt: Date;
  lead: { email: string | null; phone: string | null } | null;
  briefing: unknown | null;
  price: { product: { name: string } };
};

type DraftBriefingRow = {
  orderId: string;
  updatedAt: Date;
  order: {
    customerEmail: string | null;
    paidAt: Date | null;
    createdAt: Date;
    lead: { email: string | null; phone: string | null } | null;
    price: { product: { name: string } };
  };
};

type PendingUpsellRow = {
  orderId: string;
  createdAt: Date;
  order: {
    customerEmail: string | null;
    lead: { email: string | null } | null;
    price: { product: { name: string } };
  };
};

type FollowupRow = {
  orderId: string;
  attempts: number;
  lastSentAt: Date | null;
  closeAt: Date | null;
};

type LeadStatus = WorkboardData['leads'][number]['leadStatus'];

type LeadRow = {
  id: string;
  name: string | null;
  email: string | null;
  phone: string | null;
  message: string | null;
  landingPath: string | null;
  createdAt: Date;
  status: LeadStatus;
};

export const getWorkboardData = async (): Promise<WorkboardData> => {
  const now = new Date();
  const today = startOfUTCDay(now);
  const dueSince = addDaysUTC(today, -2);

  const [
    readyOrders,
    stalledDraftBriefings,
    notStartedOrders,
    pendingUpsellsRaw,
    recentLeads,
  ] = await Promise.all([
    prisma.order.findMany({
      take: 30,
      orderBy: { paidAt: 'desc' },
      where: {
        status: 'PAID',
        briefing: { status: 'SUBMITTED' },
      },
      include: {
        lead: true,
        briefing: true,
        price: { include: { product: true } },
      },
    }),

    prisma.briefing.findMany({
      take: 30,
      orderBy: { updatedAt: 'asc' },
      where: {
        status: 'DRAFT',
        order: {
          status: 'PAID',
          paidAt: { lt: dueSince },
        },
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
      take: 30,
      orderBy: { paidAt: 'asc' },
      where: {
        status: 'PAID',
        paidAt: { lt: dueSince },
        briefing: { is: null },
      },
      include: {
        lead: true,
        briefing: true,
        price: { include: { product: true } },
      },
    }),

    prisma.upsellPurchase.findMany({
      take: 60,
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

    prisma.lead.findMany({
      take: 30,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        message: true,
        landingPath: true,
        createdAt: true,
        status: true,
      },
    }),
  ]);

  const upsellOrderIds = (pendingUpsellsRaw as PendingUpsellRow[]).map(
    (u: PendingUpsellRow) => u.orderId,
  );

  const followups = upsellOrderIds.length
    ? await prisma.upsellFollowup.findMany({
        where: {
          orderId: { in: upsellOrderIds },
          kind: 'hosting',
        },
      })
    : [];

  const followupByOrderId = new Map(
    (followups as FollowupRow[]).map((f: FollowupRow) => [f.orderId, f]),
  );

  const isDueNow = (
    attempts: number,
    lastSentAt: Date | null,
    closeAt: Date | null,
  ) => {
    if (closeAt && closeAt <= today) return false;
    if (attempts <= 0) return true;
    if (attempts >= 3) return false;

    const days = scheduleDaysByAttempts(attempts);
    if (!lastSentAt) return true;

    const last = startOfUTCDay(lastSentAt);
    const dueAt = addDaysUTC(last, days);

    return dueAt <= today;
  };

  const pendingUpsells: WorkboardData['upsells'] = (
    pendingUpsellsRaw as PendingUpsellRow[]
  ).map((u: PendingUpsellRow) => {
    const f = followupByOrderId.get(u.orderId);

    const attempts = f?.attempts ?? 0;
    const lastSentAt = f?.lastSentAt ?? null;
    const closeAt = f?.closeAt ?? null;

    return {
      kind: 'UPSELL' as const,
      refId: u.orderId,

      email: u.order.customerEmail ?? u.order.lead?.email ?? 'sem email',
      product: u.order.price.product.name,

      status: 'TODO' as const,

      createdAt: u.createdAt.toISOString().slice(0, 10),

      attempts,
      lastSentAt: formatISODate(lastSentAt),
      closeAt: formatISODate(closeAt),
      dueNow: isDueNow(attempts, lastSentAt, closeAt),

      href: `/admin/orders/${u.orderId}`,
    };
  });

  const readyIds = (readyOrders as ReadyOrderRow[]).map(
    (o: ReadyOrderRow) => o.id,
  );

  const stalledIdsDraft = (stalledDraftBriefings as DraftBriefingRow[]).map(
    (b: DraftBriefingRow) => b.orderId,
  );
  const stalledIdsNotStarted = (notStartedOrders as ReadyOrderRow[]).map(
    (o: ReadyOrderRow) => o.id,
  );
  const stalledIds = Array.from(
    new Set([...stalledIdsDraft, ...stalledIdsNotStarted]),
  );

  const leadIds = (recentLeads as LeadRow[]).map((l: LeadRow) => l.id);

  const or: Array<{ kind: WorkItemKind; refId: { in: string[] } }> = [];

  if (readyIds.length) {
    or.push({ kind: 'READY', refId: { in: readyIds } });
  }

  if (stalledIds.length) {
    or.push({ kind: 'STALLED', refId: { in: stalledIds } });
  }

  if (leadIds.length) {
    or.push({ kind: 'LEAD', refId: { in: leadIds } });
  }

  const workItems = or.length
    ? await prisma.adminWorkItem.findMany({ where: { OR: or as any } })
    : [];

  const key = (kind: string, refId: string) => `${kind}:${refId}`;

  const statusMap = new Map<string, Status>(
    (workItems as WorkItemRow[]).map((w: WorkItemRow) => [
      key(w.kind, w.refId),
      w.status,
    ]),
  );

  const getStatus = (kind: WorkItemKind, refId: string) =>
    (statusMap.get(key(kind, refId)) ?? 'TODO') as Status;

  const ready: WorkboardData['ready'] = (readyOrders as ReadyOrderRow[]).map(
    (o: ReadyOrderRow) => ({
      kind: 'READY' as const,
      refId: o.id,
      email: o.customerEmail ?? o.lead?.email ?? 'sem email',
      product: o.price.product.name,
      status: getStatus('READY', o.id),
      href: `/admin/orders/${o.id}`,
      briefingHref: `/admin/orders/${o.id}/briefing`,
      briefing: o.briefing ? (toPlain(o.briefing) as BriefingPlain) : null,
    }),
  );

  const appUrl =
    process.env.NEXT_PUBLIC_APP_URL ||
    process.env.APP_URL ||
    'http://localhost:3000';

  const stalledFromDraft = (stalledDraftBriefings as DraftBriefingRow[]).map(
    (b: DraftBriefingRow) => {
      const to = (b.order.customerEmail ?? b.order.lead?.email ?? '').trim();
      const phone = b.order.lead?.phone ?? '';

      const onboardingLink = `${appUrl}/onboarding?orderId=${b.orderId}`;

      const subject = `Ação necessária: finalize seu briefing (pedido ${b.orderId})`;
      const body =
        `Olá! Tudo bem?\n\n` +
        `Identificamos que o briefing do seu pedido ainda não foi finalizado. Ele é necessário para iniciarmos a produção da sua plataforma.\n\n` +
        `Para concluir agora, acesse o link abaixo:\n` +
        `${onboardingLink}\n\n` +
        `Se tiver qualquer dúvida, é só responder este e-mail.\n\n` +
        `Pedido: ${b.orderId}`;

      const waMsg =
        `Olá! Vi que seu briefing ainda não foi concluído.\n\n` +
        `Você consegue finalizar agora pra gente dar continuidade?\n` +
        `Link: ${onboardingLink}`;

      return {
        kind: 'STALLED' as const,
        refId: b.orderId,
        email: to || 'sem email',
        product: b.order.price.product.name,
        status: getStatus('STALLED', b.orderId),
        updatedAt: b.updatedAt.toISOString().slice(0, 10),
        whatsappLink: buildWhatsAppLink(phone, waMsg),
        emailLink: buildEmailLink(to, subject, body),
        href: `/admin/orders/${b.orderId}`,
        _sortAt: b.order.paidAt ?? b.order.createdAt,
      };
    },
  );

  const stalledFromNotStarted = (notStartedOrders as ReadyOrderRow[]).map(
    (o: ReadyOrderRow) => {
      const to = (o.customerEmail ?? o.lead?.email ?? '').trim();
      const phone = o.lead?.phone ?? '';

      const onboardingLink = `${appUrl}/onboarding?orderId=${o.id}`;

      const subject = `Ação necessária: inicie seu briefing (pedido ${o.id})`;
      const body =
        `Olá! Tudo bem?\n\n` +
        `Seu pedido foi confirmado, e precisamos que você inicie o briefing para começarmos a produção da sua plataforma.\n\n` +
        `Para iniciar agora, acesse:\n` +
        `${onboardingLink}\n\n` +
        `Pedido: ${o.id}`;

      const waMsg =
        `Olá! Seu pedido foi confirmado.\n\n` +
        `Para começarmos a produção, preciso que você inicie o briefing.\n` +
        `Link: ${onboardingLink}`;

      return {
        kind: 'STALLED' as const,
        refId: o.id,
        email: to || 'sem email',
        product: o.price.product.name,
        status: getStatus('STALLED', o.id),
        updatedAt: `Não iniciou • Pago em: ${(o.paidAt ?? o.createdAt)
          .toISOString()
          .slice(0, 10)}`,
        whatsappLink: buildWhatsAppLink(phone, waMsg),
        emailLink: buildEmailLink(to, subject, body),
        href: `/admin/orders/${o.id}`,
        _sortAt: o.paidAt ?? o.createdAt,
      };
    },
  );

  const stalled: WorkboardData['stalled'] = [
    ...stalledFromDraft,
    ...stalledFromNotStarted,
  ]
    .sort((a, b) => {
      const aT = a._sortAt?.getTime?.() ?? 0;
      const bT = b._sortAt?.getTime?.() ?? 0;
      return aT - bT;
    })
    .slice(0, 30)
    .map(({ _sortAt, ...rest }) => rest);

  const leads: WorkboardData['leads'] = (recentLeads as LeadRow[]).map(
    (l: LeadRow) => {
      const msg =
        `Olá! Vi sua solicitação e vou te enviar os próximos passos.\n\n` +
        `Nome: ${l.name ?? '-'}\n` +
        `E-mail: ${l.email ?? '-'}\n` +
        `WhatsApp: ${l.phone ?? '-'}\n\n` +
        `Pode me confirmar o segmento e o principal objetivo da sua plataforma?`;

      return {
        kind: 'LEAD' as const,
        refId: l.id,
        name: l.name ?? 'Sem nome',
        email: l.email ?? 'sem e-mail',
        message: l.message ?? 'Sem mensagem',
        landingPath: l.landingPath ?? '-',
        leadStatus: l.status,
        status: getStatus('LEAD', l.id),
        whatsappLink: buildWhatsAppLink(l.phone ?? '', msg),
        href: `/admin/leads`,
      };
    },
  );

  return {
    ready,
    stalled,
    upsells: pendingUpsells,
    leads,
  };
};

import { prisma } from '@/lib/prisma';

import type {
  OrdersPageData,
  OrdersSearchParamsRecord,
  OrderVM,
} from './orders.types';
import {
  extractOnboardingPhone,
  formatBRL,
  formatDateParts,
  pick,
  statusLabelPT,
  statusVariant,
} from './orders.utils';

const PAGE_SIZE = 20;

type OrderUpsellRow = {
  kind: string;
  status: string;
};

type OrderRow = {
  id: string;
  status: string;
  customerEmail: string | null;
  amountTotal: number | null;
  createdAt: Date;
  paidAt: Date | null;

  price: { product: { name: string } | null } | null;
  lead: { email: string | null } | null;
  briefing: { status: string; data?: unknown } | null;
  upsells: OrderUpsellRow[];
};

export const getOrdersPageData = async (
  sp: OrdersSearchParamsRecord,
): Promise<OrdersPageData> => {
  const q = pick(sp, 'q');
  const status = (pick(sp, 'status') || 'ALL').toUpperCase();

  const pageRaw = pick(sp, 'page');
  const page = Math.max(1, Number.parseInt(pageRaw || '1', 10) || 1);

  const skip = (page - 1) * PAGE_SIZE;

  const where = {
    ...(status !== 'ALL' ? { status: status as any } : {}),
    ...(q
      ? {
          OR: [
            { id: { contains: q } },
            { customerEmail: { contains: q, mode: 'insensitive' as const } },
            {
              stripeCheckoutSessionId: {
                contains: q,
                mode: 'insensitive' as const,
              },
            },
            {
              stripePaymentIntentId: {
                contains: q,
                mode: 'insensitive' as const,
              },
            },
          ],
        }
      : {}),
  };

  const [totalCount, orders] = await Promise.all([
    prisma.order.count({ where }),
    prisma.order.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: PAGE_SIZE,
      skip,
      include: {
        price: { include: { product: true } },
        lead: true,
        briefing: true,
        upsells: true,
      },
    }),
  ]);

  const rows: OrderVM[] = (orders as OrderRow[]).map((order) => {
    const planName = order.price?.product?.name ?? '—';
    const totalLabel = formatBRL(order.amountTotal ?? 0);

    const onboardingStatus: OrderVM['onboardingStatus'] =
      order.briefing?.status === 'SUBMITTED'
        ? 'SUBMITTED'
        : order.briefing
        ? 'DRAFT'
        : 'NOT_STARTED';

    const hosting = order.upsells.find(
      (u: OrderUpsellRow) => u.kind === 'hosting',
    );
    const hostingBadge =
      hosting?.status === 'PAID'
        ? 'Hospedagem: Paga'
        : hosting?.status === 'PENDING'
        ? 'Hospedagem: Pendente'
        : null;

    const dateISO = (order.paidAt ?? order.createdAt).toISOString();
    const { date: dateLabel, time: timeLabel } = formatDateParts(dateISO);

    const customerEmail = order.customerEmail ?? order.lead?.email ?? null;

    const onboardingPhone = extractOnboardingPhone(order.briefing);

    return {
      id: order.id,
      customerLabel: customerEmail ?? '—',
      customerEmail,
      leadPhone: onboardingPhone,
      planName,
      status: statusLabelPT(order.status),
      statusBadgeVariant: statusVariant(order.status),
      totalLabel,
      onboardingStatus,
      hostingBadge,
      dateLabel,
      timeLabel,
      createdAtISO: order.createdAt.toISOString(),
    };
  });

  const hasPrev = page > 1;
  const hasNext = page * PAGE_SIZE < totalCount;

  return {
    rows,
    q,
    status,
    page,
    hasPrev,
    hasNext,
    pageSize: PAGE_SIZE,
    totalCount,
  };
};

import { NextResponse } from 'next/server';

import { prisma } from '@/lib/prisma';

export const runtime = 'nodejs';

const parseDay = (value: string | null) => {
  if (!value) return null;
  // Espera "YYYY-MM-DD"
  const [y, m, d] = value.split('-').map((x) => Number(x));
  if (!y || !m || !d) return null;

  // Usa UTC pra evitar drift de fuso no servidor
  const dt = new Date(Date.UTC(y, m - 1, d, 0, 0, 0));
  if (Number.isNaN(dt.getTime())) return null;
  return dt;
};

const addDaysUTC = (date: Date, days: number) => {
  const dt = new Date(date);
  dt.setUTCDate(dt.getUTCDate() + days);
  return dt;
};

const getDefaultRangeUTC = () => {
  // default: últimos 30 dias (inclui hoje)
  const now = new Date();
  const end = new Date(
    Date.UTC(
      now.getUTCFullYear(),
      now.getUTCMonth(),
      now.getUTCDate(),
      0,
      0,
      0,
    ),
  );
  const start = addDaysUTC(end, -29);
  return { from: start, toExclusive: addDaysUTC(end, 1) };
};

export const GET = async (req: Request) => {
  // TODO: proteger com auth (somente ADMIN)
  // Ex.: validar sessão, checar user.role === 'ADMIN'

  const { searchParams } = new URL(req.url);

  const fromParam = parseDay(searchParams.get('from'));
  const toParam = parseDay(searchParams.get('to'));
  const statusParam = (searchParams.get('status') ?? 'PAID').toUpperCase();

  const { from, toExclusive } = (() => {
    if (!fromParam || !toParam) return getDefaultRangeUTC();

    // "to" deve incluir o dia selecionado, então usamos toExclusive = to + 1
    return { from: fromParam, toExclusive: addDaysUTC(toParam, 1) };
  })();

  const status = statusParam as
    | 'PAID'
    | 'PENDING'
    | 'CANCELED'
    | 'REFUNDED'
    | 'FAILED';

  // 1) Totais (Orders)
  const ordersTotals = await prisma.order.aggregate({
    where: {
      status,
      paidAt: {
        gte: from,
        lt: toExclusive,
      },
    },
    _sum: {
      amountTotal: true,
      amountDiscount: true,
      amountSubtotal: true,
    },
    _count: {
      _all: true,
    },
  });

  const revenueCents = ordersTotals._sum.amountTotal ?? 0;
  const discountCents = ordersTotals._sum.amountDiscount ?? 0;
  const ordersCount = ordersTotals._count._all ?? 0;
  const avgTicketCents =
    ordersCount > 0 ? Math.round(revenueCents / ordersCount) : 0;

  // 2) Totais (Upsell hosting)
  const upsellTotals = await prisma.upsellPurchase.aggregate({
    where: {
      kind: 'hosting',
      status: 'PAID',
      createdAt: {
        gte: from,
        lt: toExclusive,
      },
    },
    _sum: {
      amountTotal: true,
    },
    _count: {
      _all: true,
    },
  });

  const upsellRevenueCents = upsellTotals._sum.amountTotal ?? 0;
  const upsellCount = upsellTotals._count._all ?? 0;

  // 3) Série diária (Orders) via SQL, porque Prisma não faz date_trunc bem
  const daily = await prisma.$queryRaw<
    Array<{ day: Date; revenue_cents: bigint; orders_count: bigint }>
  >`
    SELECT
      date_trunc('day', "paidAt") AS day,
      COALESCE(SUM("amountTotal"), 0) AS revenue_cents,
      COUNT(*) AS orders_count
    FROM "Order"
    WHERE "status" = ${status}
      AND "paidAt" >= ${from}
      AND "paidAt" < ${toExclusive}
    GROUP BY 1
    ORDER BY 1 ASC;
  `;

  return NextResponse.json({
    range: {
      from: from.toISOString(),
      toExclusive: toExclusive.toISOString(),
      status,
    },
    revenueCents,
    discountCents,
    ordersCount,
    avgTicketCents,
    upsellRevenueCents,
    upsellCount,
    daily: daily.map((d) => ({
      date: d.day.toISOString().slice(0, 10),
      revenueCents: Number(d.revenue_cents),
      ordersCount: Number(d.orders_count),
    })),
  });
};

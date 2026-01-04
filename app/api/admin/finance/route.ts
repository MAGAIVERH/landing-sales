import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const runtime = 'nodejs';

type OrderStatus =
  | 'PENDING'
  | 'PAID'
  | 'CANCELED'
  | 'REFUNDED'
  | 'FAILED'
  | 'ALL';

type SourceFilter = 'ALL' | 'ORDER' | 'UPSELL';

const parseISODateUTC = (value: string) => {
  // value: YYYY-MM-DD
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!m) return null;
  const y = Number(m[1]);
  const mo = Number(m[2]);
  const d = Number(m[3]);
  if (!y || mo < 1 || mo > 12 || d < 1 || d > 31) return null;
  return new Date(Date.UTC(y, mo - 1, d));
};

const toISODateUTC = (d: Date) => {
  const yyyy = d.getUTCFullYear();
  const mm = String(d.getUTCMonth() + 1).padStart(2, '0');
  const dd = String(d.getUTCDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
};

const addDaysUTC = (d: Date, days: number) => {
  const next = new Date(d);
  next.setUTCDate(next.getUTCDate() + days);
  return next;
};

const clampRange = (from: Date, to: Date, maxDays = 180) => {
  const diffDays = Math.floor(
    (to.getTime() - from.getTime()) / (1000 * 60 * 60 * 24),
  );
  if (diffDays < 0) return null;
  if (diffDays > maxDays) return null;
  return diffDays;
};

export const GET = async (req: Request) => {
  try {
    const { searchParams } = new URL(req.url);

    const fromRaw = searchParams.get('from') ?? '';
    const toRaw = searchParams.get('to') ?? '';
    const statusRaw = (searchParams.get('status') ?? 'ALL').toUpperCase();
    const sourceRaw = (searchParams.get('source') ?? 'ALL').toUpperCase();
    const planId = searchParams.get('plan') ?? 'ALL';

    const fromUTC = parseISODateUTC(fromRaw);
    const toUTC = parseISODateUTC(toRaw);

    if (!fromUTC || !toUTC) {
      return NextResponse.json(
        { error: 'Invalid date range. Use from/to as YYYY-MM-DD.' },
        { status: 400 },
      );
    }

    const diff = clampRange(fromUTC, toUTC, 365);
    if (diff === null) {
      return NextResponse.json(
        { error: 'Invalid date range.' },
        { status: 400 },
      );
    }

    const status = (statusRaw || 'ALL') as OrderStatus;
    const source = (sourceRaw || 'ALL') as SourceFilter;

    const endExclusive = addDaysUTC(toUTC, 1);

    const products = await prisma.product.findMany({
      where: { active: true },
      orderBy: { createdAt: 'asc' },
      select: { id: true, name: true },
    });

    const orderWhere: any = {
      createdAt: { gte: fromUTC, lt: endExclusive },
      ...(status !== 'ALL' ? { status } : {}),
      ...(planId !== 'ALL' ? { price: { productId: planId } } : {}),
    };

    const upsellWhere: any = {
      createdAt: { gte: fromUTC, lt: endExclusive },
      ...(planId !== 'ALL' ? { order: { price: { productId: planId } } } : {}),
    };

    const [orders, upsells] = await Promise.all([
      source === 'UPSELL'
        ? Promise.resolve([])
        : prisma.order.findMany({
            where: orderWhere,
            orderBy: { createdAt: 'desc' },
            include: {
              price: { include: { product: true } },
              user: true,
              lead: true,
            },
            take: 5000,
          }),
      source === 'ORDER'
        ? Promise.resolve([])
        : prisma.upsellPurchase.findMany({
            where: upsellWhere,
            orderBy: { createdAt: 'desc' },
            include: {
              order: {
                include: {
                  price: { include: { product: true } },
                  user: true,
                  lead: true,
                },
              },
            },
            take: 5000,
          }),
    ]);

    // buckets por dia (UTC)
    const days: string[] = [];
    for (let i = 0; i <= diff; i++) {
      days.push(toISODateUTC(addDaysUTC(fromUTC, i)));
    }

    const revenuePaidByDay = new Map<string, number>();
    const volumePaidByDay = new Map<string, number>();
    const volumePendingByDay = new Map<string, number>();

    days.forEach((d) => {
      revenuePaidByDay.set(d, 0);
      volumePaidByDay.set(d, 0);
      volumePendingByDay.set(d, 0);
    });

    // KPIs
    let paidRevenueCents = 0;
    let paidCount = 0;

    let pendingCents = 0;
    let pendingCount = 0;

    let totalCentsAllStatuses = 0;

    let refundedCents = 0;
    let refundedCount = 0;

    let canceledFailedCents = 0;
    let canceledFailedCount = 0;

    // distribuição por plano (pago)
    const planAgg = new Map<
      string,
      { planName: string; cents: number; count: number }
    >();

    // orders
    for (const o of orders) {
      const amount = o.amountTotal ?? 0;
      totalCentsAllStatuses += amount;

      const planName = o.price?.product?.name ?? '—';

      if (o.status === 'PAID') {
        paidRevenueCents += amount;
        paidCount += 1;

        const paidAt = o.paidAt ?? o.createdAt;
        const day = toISODateUTC(paidAt);
        revenuePaidByDay.set(day, (revenuePaidByDay.get(day) ?? 0) + amount);
        volumePaidByDay.set(day, (volumePaidByDay.get(day) ?? 0) + 1);

        const k = o.price?.product?.id ?? planName;
        const prev = planAgg.get(k) ?? { planName, cents: 0, count: 0 };
        planAgg.set(k, {
          planName,
          cents: prev.cents + amount,
          count: prev.count + 1,
        });
      }

      if (o.status === 'PENDING') {
        pendingCents += amount;
        pendingCount += 1;
        const day = toISODateUTC(o.createdAt);
        volumePendingByDay.set(day, (volumePendingByDay.get(day) ?? 0) + 1);
      }

      if (o.status === 'REFUNDED') {
        refundedCents += amount;
        refundedCount += 1;
      }

      if (o.status === 'CANCELED' || o.status === 'FAILED') {
        canceledFailedCents += amount;
        canceledFailedCount += 1;
      }
    }

    // upsells
    let upsellPaidCents = 0;
    let upsellPaidCount = 0;
    let upsellPendingCents = 0;

    const upsellTransactions = [];

    for (const u of upsells) {
      const amount = u.amountTotal ?? 0;

      if (u.status === 'PAID') {
        upsellPaidCents += amount;
        upsellPaidCount += 1;
      } else if (u.status === 'PENDING') {
        upsellPendingCents += amount;
      }

      upsellTransactions.push(u);
    }

    const avgTicketCents =
      paidCount > 0 ? Math.round(paidRevenueCents / paidCount) : 0;

    const statusLabel = (s: string) => {
      const up = s.toUpperCase();
      if (up === 'PAID') return 'Pago';
      if (up === 'PENDING') return 'Pendente';
      if (up === 'REFUNDED') return 'Reembolsado';
      if (up === 'CANCELED') return 'Cancelado';
      if (up === 'FAILED') return 'Falhou';
      return up;
    };

    // charts payload
    const charts = {
      revenuePaidByDay: days.map((d) => ({
        date: d,
        cents: revenuePaidByDay.get(d) ?? 0,
      })),
      volumeByDay: days.map((d) => ({
        date: d,
        paid: volumePaidByDay.get(d) ?? 0,
        pending: volumePendingByDay.get(d) ?? 0,
      })),
      planDistribution: Array.from(planAgg.values()).sort(
        (a, b) => b.cents - a.cents,
      ),
    };

    // transactions list (orders + upsells)
    const transactions: Array<{
      id: string;
      kind: 'order' | 'upsell';
      email: string;
      planName: string;
      status: string;
      statusLabel: string;
      amountCents: number;
      dateISO: string;
      subtitle: string;
    }> = [];

    for (const o of orders) {
      const email = o.customerEmail ?? o.user?.email ?? o.lead?.email ?? '—';
      const planName = o.price?.product?.name ?? '—';
      const dateISO = (o.paidAt ?? o.createdAt).toISOString();

      transactions.push({
        id: o.id,
        kind: 'order',
        email,
        planName,
        status: o.status,
        statusLabel: statusLabel(o.status),
        amountCents: o.amountTotal ?? 0,
        dateISO,
        subtitle: 'Pedido',
      });
    }

    for (const u of upsellTransactions) {
      const o = u.order;
      const email = o?.customerEmail ?? o?.user?.email ?? o?.lead?.email ?? '—';
      const planName = o?.price?.product?.name ?? '—';
      const dateISO = u.createdAt.toISOString();

      transactions.push({
        id: u.id,
        kind: 'upsell',
        email,
        planName,
        status: u.status,
        statusLabel: statusLabel(u.status),
        amountCents: u.amountTotal ?? 0,
        dateISO,
        subtitle: `Upsell: ${u.kind}`,
      });
    }

    transactions.sort((a, b) => b.dateISO.localeCompare(a.dateISO));

    return NextResponse.json({
      meta: {
        from: fromRaw,
        to: toRaw,
        status,
        source,
        plan: planId,
        generatedAt: new Date().toISOString(),
      },
      filters: {
        plans: products,
      },
      kpis: {
        paidRevenueCents,
        paidCount,
        avgTicketCents,
        pendingCents,
        pendingCount,
        totalCentsAllStatuses,
        upsellPaidCents,
        upsellPaidCount,
        upsellPendingCents,
        refundedCents,
        refundedCount,
        canceledFailedCents,
        canceledFailedCount,
      },
      charts,
      transactions: transactions.slice(0, 200),
    });
  } catch (err) {
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
};

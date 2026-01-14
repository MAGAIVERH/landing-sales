import { NextResponse } from 'next/server';

import { prisma } from '@/lib/prisma';

export const runtime = 'nodejs'; // Prisma não roda em Edge

type PriceRow = {
  id: string;
  stripePriceId: string;
  billingType: string;
  currency: string;
  unitAmount: number;
  interval: string | null;
};

type ProductRow = {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  prices: PriceRow[];
};

type PricingItem = {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  price: {
    id: string;
    stripePriceId: string;
    billingType: string;
    currency: string;
    unitAmount: number;
    interval: string | null;
  };
};

const isNotNull = <T>(v: T | null): v is T => v !== null;

export const GET = async () => {
  try {
    const products = (await prisma.product.findMany({
      where: { active: true },
      orderBy: { createdAt: 'asc' },
      include: {
        prices: {
          where: { active: true },
          orderBy: { createdAt: 'desc' },
        },
      },
    })) as ProductRow[];

    const data = products
      .map((p: ProductRow): PricingItem | null => {
        const price = p.prices[0]; // pega o mais recente ativo (no seed é 1 por produto)
        if (!price) return null;

        return {
          id: p.id,
          slug: p.slug,
          name: p.name,
          description: p.description,
          price: {
            id: price.id,
            stripePriceId: price.stripePriceId,
            billingType: price.billingType,
            currency: price.currency,
            unitAmount: price.unitAmount,
            interval: price.interval,
          },
        };
      })
      .filter(isNotNull);

    return NextResponse.json({ data }, { status: 200 });
  } catch (error) {
    console.error('[GET /api/pricing] error:', error);
    return NextResponse.json(
      { error: 'Failed to load pricing.' },
      { status: 500 },
    );
  }
};

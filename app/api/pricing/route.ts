import { NextResponse } from 'next/server';

import { prisma } from '@/lib/prisma';

export const runtime = 'nodejs'; // Prisma não roda em Edge

export const GET = async () => {
  try {
    const products = await prisma.product.findMany({
      where: { active: true },
      orderBy: { createdAt: 'asc' },
      include: {
        prices: {
          where: { active: true },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    const data = products
      .map((p) => {
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
      .filter(Boolean);

    return NextResponse.json({ data }, { status: 200 });
  } catch (error) {
    console.error('[GET /api/pricing] error:', error);
    return NextResponse.json(
      { error: 'Failed to load pricing.' },
      { status: 500 },
    );
  }
};

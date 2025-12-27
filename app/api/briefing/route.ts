import { NextResponse } from 'next/server';

import { prisma } from '@/lib/prisma';

export const runtime = 'nodejs';

export const GET = async (req: Request) => {
  try {
    const { searchParams } = new URL(req.url);
    const orderId = searchParams.get('orderId');

    if (!orderId) {
      return NextResponse.json({ error: 'Missing orderId' }, { status: 400 });
    }

    const briefing = await prisma.briefing.findUnique({
      where: { orderId },
    });

    if (!briefing) {
      return NextResponse.json({ found: false });
    }

    return NextResponse.json({ found: true, briefing });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: 'Failed to fetch briefing' },
      { status: 500 },
    );
  }
};

export const PUT = async (req: Request) => {
  try {
    const body = (await req.json()) as {
      orderId?: string;
      data?: unknown;
    };

    if (!body.orderId) {
      return NextResponse.json({ error: 'Missing orderId' }, { status: 400 });
    }

    const briefing = await prisma.briefing.upsert({
      where: { orderId: body.orderId },
      create: {
        orderId: body.orderId,
        status: 'DRAFT',
        data: (body.data ?? {}) as any,
      },
      update: {
        data: (body.data ?? {}) as any,
      },
    });

    return NextResponse.json({ ok: true, briefing });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: 'Failed to save briefing' },
      { status: 500 },
    );
  }
};

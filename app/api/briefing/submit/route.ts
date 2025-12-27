import { NextResponse } from 'next/server';

import { prisma } from '@/lib/prisma';

export const runtime = 'nodejs';

export const POST = async (req: Request) => {
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
        status: 'SUBMITTED',
        data: (body.data ?? {}) as any,
        submittedAt: new Date(),
      },
      update: {
        status: 'SUBMITTED',
        data: (body.data ?? {}) as any,
        submittedAt: new Date(),
      },
    });

    // Opcional: você pode também atualizar uma flag no Order depois (se quiser)
    // await prisma.order.update({ where: { id: body.orderId }, data: { briefingStatus: "submitted" } })

    return NextResponse.json({ ok: true, briefing });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: 'Failed to submit briefing' },
      { status: 500 },
    );
  }
};

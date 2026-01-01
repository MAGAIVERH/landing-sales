import { NextResponse } from 'next/server';

import { prisma } from '@/lib/prisma';

export const runtime = 'nodejs';

export const POST = async (
  req: Request,
  ctx: { params: Promise<{ id: string }> },
) => {
  try {
    const { id } = await ctx.params; // ✅ obrigatório na sua versão
    const body = await req.json().catch(() => null);

    const done = Boolean(body?.done);

    if (!id) {
      return NextResponse.json(
        { ok: false, error: 'Missing id' },
        { status: 400 },
      );
    }

    await prisma.adminWorkItem.upsert({
      where: {
        kind_refId: {
          kind: 'LEAD',
          refId: id,
        },
      },
      create: {
        kind: 'LEAD',
        refId: id,
        status: done ? 'DONE' : 'TODO',
        doneAt: done ? new Date() : null,
      },
      update: {
        status: done ? 'DONE' : 'TODO',
        doneAt: done ? new Date() : null,
        snoozeUntil: null,
      },
    });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { ok: false, error: 'Internal error' },
      { status: 500 },
    );
  }
};

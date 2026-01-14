import { NextResponse } from 'next/server';

import { prisma } from '@/lib/prisma';

export const runtime = 'nodejs';

type Kind = 'READY' | 'STALLED' | 'LEAD' | 'UPSELL';
type Status = 'TODO' | 'IN_PROGRESS' | 'DONE' | 'SNOOZED';

const isKind = (v: unknown): v is Kind =>
  v === 'READY' || v === 'STALLED' || v === 'LEAD' || v === 'UPSELL';

const isStatus = (v: unknown): v is Status =>
  v === 'TODO' || v === 'IN_PROGRESS' || v === 'DONE' || v === 'SNOOZED';

export const POST = async (req: Request) => {
  try {
    const body = await req.json();

    const kind = body?.kind;
    const refId = body?.refId;
    const status = body?.status;
    const note = typeof body?.note === 'string' ? body.note : null;

    if (!isKind(kind)) {
      return NextResponse.json({ error: 'Invalid kind' }, { status: 400 });
    }

    if (typeof refId !== 'string' || !refId) {
      return NextResponse.json({ error: 'Invalid refId' }, { status: 400 });
    }

    if (!isStatus(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
    }

    const doneAt = status === 'DONE' ? new Date() : null;

    const item = await prisma.adminWorkItem.upsert({
      where: { kind_refId: { kind, refId } },
      create: { kind, refId, status, note, doneAt },
      update: { status, note, doneAt },
    });

    return NextResponse.json({ ok: true, item });
  } catch (err) {
    return NextResponse.json({ error: 'Unexpected error' }, { status: 500 });
  }
};

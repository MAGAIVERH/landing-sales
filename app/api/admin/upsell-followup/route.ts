// src/app/api/admin/upsell-followup/route.ts
import { NextResponse } from 'next/server';

import { prisma } from '@/lib/prisma';

export const runtime = 'nodejs';

const startOfUTCDay = (d: Date) =>
  new Date(
    Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate(), 0, 0, 0),
  );

const addDaysUTC = (d: Date, days: number) => {
  const x = new Date(d);
  x.setUTCDate(x.getUTCDate() + days);
  return x;
};

const scheduleDaysByAttempt = (attempt: number) => {
  // attempt 1 -> volta em 5 dias
  // attempt 2 -> volta em 15 dias
  // attempt 3 -> volta em 30 dias (ciclo final) e depois encerra
  if (attempt === 1) return 5;
  if (attempt === 2) return 15;
  return 30;
};

type Body = {
  orderId: string;
  kind?: string; // default: 'hosting'
  action: 'done' | 'undo';
};

export const POST = async (req: Request) => {
  try {
    const body = (await req.json()) as Body;

    const orderId = (body.orderId ?? '').trim();
    if (!orderId) {
      return NextResponse.json({ error: 'Missing orderId' }, { status: 400 });
    }

    const kind = (body.kind ?? 'hosting').trim() || 'hosting';
    const action = body.action;

    if (action !== 'done' && action !== 'undo') {
      return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

    const now = new Date();
    const today = startOfUTCDay(now);

    const current = await prisma.upsellFollowup.findUnique({
      where: { orderId },
    });

    // Se já encerrou (closeAt no passado ou hoje), não altera mais
    if (current?.closeAt && startOfUTCDay(current.closeAt) <= today) {
      return NextResponse.json({
        ok: true,
        state: current,
        meta: { closed: true },
      });
    }

    if (action === 'done') {
      const nextAttempts = (current?.attempts ?? 0) + 1;

      const days = scheduleDaysByAttempt(nextAttempts);
      const nextDueAt = addDaysUTC(today, days);

      // No 3º envio entra no ciclo final e será encerrado após 30 dias
      const closeAt = nextAttempts >= 3 ? addDaysUTC(today, 30) : null;

      const updated = await prisma.upsellFollowup.upsert({
        where: { orderId },
        create: {
          orderId,
          kind,
          attempts: nextAttempts,
          lastSentAt: now,
          closeAt,
          // Se você tiver o campo nextDueAt no schema, descomente:
          // nextDueAt,
        },
        update: {
          kind,
          attempts: nextAttempts,
          lastSentAt: now,
          closeAt,
          // Se você tiver o campo nextDueAt no schema, descomente:
          // nextDueAt,
        },
      });

      return NextResponse.json({
        ok: true,
        state: updated,
        meta: {
          attempts: nextAttempts,
          nextDueAt: nextAttempts < 3 ? nextDueAt : null,
          closeAt,
        },
      });
    }

    // action === 'undo'
    {
      const nextAttempts = Math.max(0, (current?.attempts ?? 0) - 1);

      // Se voltou para 0, limpa datas para sair do ciclo
      const lastSentAt =
        nextAttempts === 0 ? null : current?.lastSentAt ?? null;

      const updated = await prisma.upsellFollowup.upsert({
        where: { orderId },
        create: {
          orderId,
          kind,
          attempts: nextAttempts,
          lastSentAt,
          closeAt: null,
          // Se você tiver o campo nextDueAt no schema, descomente:
          // nextDueAt: nextAttempts === 0 ? null : (current as any)?.nextDueAt ?? null,
        },
        update: {
          kind,
          attempts: nextAttempts,
          lastSentAt,
          closeAt: null,
          // Se você tiver o campo nextDueAt no schema, descomente:
          // nextDueAt: nextAttempts === 0 ? null : (current as any)?.nextDueAt ?? null,
        },
      });

      return NextResponse.json({
        ok: true,
        state: updated,
        meta: { attempts: nextAttempts },
      });
    }
  } catch (e) {
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
};

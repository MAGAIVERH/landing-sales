import { NextResponse } from 'next/server';

import { prisma } from '@/lib/prisma';

export const runtime = 'nodejs';

const normalizeLeadStatus = (raw: unknown) => {
  const v = String(raw ?? '').trim();
  if (!v) return null;

  const lower = v.toLowerCase();
  if (lower === 'novo') return 'NEW';
  if (lower === 'contatado') return 'CONTACTED';
  if (lower === 'qualificado') return 'QUALIFIED';
  if (lower === 'ganhou') return 'WON';
  if (lower === 'perdido') return 'LOST';

  const upper = v.toUpperCase();
  if (
    upper === 'NEW' ||
    upper === 'CONTACTED' ||
    upper === 'QUALIFIED' ||
    upper === 'WON' ||
    upper === 'LOST'
  ) {
    return upper;
  }

  return null;
};

export const PATCH = async (
  req: Request,
  ctx: { params: Promise<{ id: string }> },
) => {
  try {
    const { id } = await ctx.params; // ✅ obrigatório na sua versão
    const body = await req.json().catch(() => null);

    const status = normalizeLeadStatus(body?.status);

    if (!id) {
      return NextResponse.json(
        { ok: false, error: 'Missing id' },
        { status: 400 },
      );
    }

    if (!status) {
      return NextResponse.json(
        { ok: false, error: 'Invalid status' },
        { status: 400 },
      );
    }

    await prisma.lead.update({
      where: { id },
      data: { status: status as any },
    });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { ok: false, error: 'Internal error' },
      { status: 500 },
    );
  }
};

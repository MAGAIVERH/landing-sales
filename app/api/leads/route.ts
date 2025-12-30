import { NextResponse } from 'next/server';
import { z } from 'zod';

import { prisma } from '@/lib/prisma';

export const runtime = 'nodejs';

const toNullIfEmpty = (value?: string | null) => {
  const v = (value ?? '').trim();
  return v.length > 0 ? v : null;
};

const leadSchema = z.object({
  name: z.string().trim().min(2).max(80),
  email: z.string().trim().email().max(120),
  phone: z.string().trim().max(30).optional().or(z.literal('')),
  segment: z.string().trim().min(2).max(80),
  message: z.string().trim().min(10).max(2000),

  // opcionais (se amanhã eu quiser preencher via query/utm)
  utmSource: z.string().trim().optional().or(z.literal('')),
  utmMedium: z.string().trim().optional().or(z.literal('')),
  utmCampaign: z.string().trim().optional().or(z.literal('')),
  utmContent: z.string().trim().optional().or(z.literal('')),
  utmTerm: z.string().trim().optional().or(z.literal('')),
  referrer: z.string().trim().optional().or(z.literal('')),
  landingPath: z.string().trim().optional().or(z.literal('')),
});

export const POST = async (req: Request) => {
  try {
    const body = await req.json();
    const data = leadSchema.parse(body);

    const combinedMessage = `Segmento: ${data.segment}\n\n${data.message}`;

    const lead = await prisma.lead.create({
      data: {
        name: toNullIfEmpty(data.name),
        email: toNullIfEmpty(data.email),
        phone: toNullIfEmpty(data.phone),
        message: combinedMessage,
        source: 'budget-form',
        status: 'NEW',

        utmSource: toNullIfEmpty(data.utmSource),
        utmMedium: toNullIfEmpty(data.utmMedium),
        utmCampaign: toNullIfEmpty(data.utmCampaign),
        utmContent: toNullIfEmpty(data.utmContent),
        utmTerm: toNullIfEmpty(data.utmTerm),
        referrer: toNullIfEmpty(data.referrer),
        landingPath: toNullIfEmpty(data.landingPath) ?? '/budget',
      },
      select: { id: true, createdAt: true },
    });

    return NextResponse.json({ ok: true, leadId: lead.id }, { status: 201 });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json(
        { ok: false, error: 'INVALID_INPUT', issues: err.issues },
        { status: 400 },
      );
    }

    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json(
      { ok: false, error: 'INTERNAL_ERROR', message },
      { status: 500 },
    );
  }
};

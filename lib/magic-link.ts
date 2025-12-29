import crypto from 'crypto';

import { prisma } from '@/lib/prisma';

const MAGIC_LINK_BYTES = 32; // 256-bit
const MAGIC_LINK_TTL_DAYS = 30;

const addDays = (date: Date, days: number) => {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
};

export const generateMagicToken = () => {
  // URL-safe token
  return crypto.randomBytes(MAGIC_LINK_BYTES).toString('base64url');
};

export const hashMagicToken = (token: string) => {
  return crypto.createHash('sha256').update(token).digest('hex');
};

type CreateOrRotateArgs = {
  orderId: string;
  destinationEmail?: string | null;
  destinationPhone?: string | null;
  ttlDays?: number;
  revokeExisting?: boolean;
};

export const createOrRotateOrderAccessLink = async ({
  orderId,
  destinationEmail,
  destinationPhone,
  ttlDays = MAGIC_LINK_TTL_DAYS,
  revokeExisting = false,
}: CreateOrRotateArgs) => {
  const token = generateMagicToken();
  const tokenHash = hashMagicToken(token);

  const now = new Date();
  const expiresAt = addDays(now, ttlDays);

  // Revoga links anteriores ainda ativos (boa prática de segurança)
  if (revokeExisting) {
    await prisma.orderAccessLink.updateMany({
      where: {
        orderId,
        revokedAt: null,
        expiresAt: { gt: now },
      },
      data: {
        revokedAt: now,
      },
    });
  }

  const link = await prisma.orderAccessLink.create({
    data: {
      orderId,
      tokenHash,
      expiresAt,
      destinationEmail: destinationEmail ?? undefined,
      destinationPhone: destinationPhone ?? undefined,
      lastSentAt: now,
      sendCount: 1,
    },
    select: {
      id: true,
      expiresAt: true,
    },
  });

  return {
    token, // ⚠️ só retorna aqui. Nunca salvar em DB.
    tokenHash,
    linkId: link.id,
    expiresAt: link.expiresAt,
  };
};

export const validateOrderAccessToken = async (token: string) => {
  const now = new Date();
  const tokenHash = hashMagicToken(token);

  const link = await prisma.orderAccessLink.findUnique({
    where: { tokenHash },
    select: {
      id: true,
      orderId: true,
      expiresAt: true,
      revokedAt: true,
    },
  });

  if (!link) {
    return { ok: false as const, reason: 'NOT_FOUND' as const };
  }

  if (link.revokedAt) {
    return { ok: false as const, reason: 'REVOKED' as const };
  }

  if (link.expiresAt <= now) {
    return { ok: false as const, reason: 'EXPIRED' as const };
  }

  // Auditoria de uso
  await prisma.orderAccessLink.update({
    where: { id: link.id },
    data: {
      lastUsedAt: now,
      useCount: { increment: 1 },
    },
  });

  return { ok: true as const, orderId: link.orderId };
};

import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

import {
  createAdminSessionCookieValue,
  getAdminCookieName,
} from '@/lib/admin-session';

export const runtime = 'nodejs';

type Body = {
  password?: string;
};

export const POST = async (req: Request) => {
  const body = (await req.json().catch(() => null)) as Body | null;

  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminPassword) {
    return NextResponse.json(
      { error: 'Missing ADMIN_PASSWORD' },
      { status: 500 },
    );
  }

  if (!body?.password || body.password !== adminPassword) {
    return NextResponse.json({ error: 'Invalid password' }, { status: 401 });
  }

  // ✅ JWT (cookie value) é async
  const value = await createAdminSessionCookieValue(12);

  // ✅ cookies() no seu Next é async
  const jar = await cookies();

  jar.set(getAdminCookieName(), value, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 12,
  });

  return NextResponse.json({ ok: true });
};

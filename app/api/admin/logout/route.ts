import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

import { getAdminCookieName } from '@/lib/admin-session';

export const runtime = 'nodejs';

export const POST = async () => {
  const jar = await cookies();

  jar.set(getAdminCookieName(), '', {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 0,
  });

  return NextResponse.json({ ok: true });
};

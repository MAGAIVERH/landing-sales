import { jwtVerify,SignJWT } from 'jose';

const COOKIE_NAME = 'admin_session';

type SessionPayload = {
  iat: number; // issued at (ms)
  exp: number; // expires at (ms)
};

export const getAdminCookieName = () => COOKIE_NAME;

const getJwtSecret = () => {
  const secret =
    process.env.ADMIN_JWT_SECRET ?? process.env.ADMIN_SESSION_SECRET;

  if (!secret) {
    throw new Error('Missing ADMIN_JWT_SECRET');
  }

  return new TextEncoder().encode(secret);
};

export const createAdminSessionCookieValue = async (ttlHours = 12) => {
  const secret = getJwtSecret();

  const nowMs = Date.now();
  const nowSec = Math.floor(nowMs / 1000);
  const expSec = nowSec + ttlHours * 60 * 60;

  const token = await new SignJWT({
    typ: 'admin_session',
    v: 1,
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt(nowSec)
    .setExpirationTime(expSec)
    .sign(secret);

  return token;
};

export const verifyAdminSessionCookieValue = async (
  cookieValue?: string | null,
) => {
  try {
    if (!cookieValue) return { ok: false as const };

    const secret = getJwtSecret();

    const { payload } = await jwtVerify(cookieValue, secret, {
      algorithms: ['HS256'],
    });

    const iatSec = typeof payload.iat === 'number' ? payload.iat : null;
    const expSec = typeof payload.exp === 'number' ? payload.exp : null;

    if (!iatSec || !expSec) return { ok: false as const };

    const session: SessionPayload = {
      iat: iatSec * 1000,
      exp: expSec * 1000,
    };

    return { ok: true as const, payload: session };
  } catch {
    return { ok: false as const };
  }
};

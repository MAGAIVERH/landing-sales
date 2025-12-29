import { redirect } from 'next/navigation';

import { validateOrderAccessToken } from '@/lib/magic-link';

type PageProps = {
  params: Promise<{ token?: string }>;
};

export default async function AccessTokenPage({ params }: PageProps) {
  const { token } = await params;

  if (!token) {
    redirect('/access/invalid?reason=MISSING');
  }

  const result = await validateOrderAccessToken(token);

  if (!result.ok) {
    redirect(`/access/invalid?reason=${result.reason}`);
  }

  redirect(`/onboarding?orderId=${encodeURIComponent(result.orderId)}`);
}

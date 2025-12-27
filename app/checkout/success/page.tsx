import { CheckoutSuccessClient } from './success-client';

type PageProps = {
  searchParams: Promise<{ session_id?: string }>;
};

export default async function CheckoutSucessoPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const sessionId = params.session_id ?? '';

  return <CheckoutSuccessClient sessionId={sessionId} />;
}

import { HostingSuccessClient } from './success-client';

type PageProps = {
  searchParams: Promise<{ session_id?: string }>;
};

export default async function HostingSuccessPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const sessionId = params.session_id ?? '';

  return <HostingSuccessClient sessionId={sessionId} />;
}

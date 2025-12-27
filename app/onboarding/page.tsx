import { OnboardingWizard } from './wizard';

type PageProps = {
  searchParams: Promise<{ orderId?: string }>;
};

export default async function OnboardingPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const orderId = params.orderId ?? '';

  return <OnboardingWizard orderId={orderId} />;
}

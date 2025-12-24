export type PlanSlug =
  | 'sage-base'
  | 'sage-pay'
  | 'sage-ai'
  | 'deploy-hosting-12m';

export type Plan = {
  slug: PlanSlug;

  name: string;
  subtitle: string;
  forWho: string;
  features: string[];

  priceHint: string;
  unitAmount: number; // em centavos (vem do banco)
  stripePriceId: string; // vem do banco

  highlight?: boolean;
  badge?: string;
};

export type PricingApiResponse = {
  data: Array<{
    id: string;
    slug: PlanSlug;
    name: string;
    description: string | null;
    price: {
      id: string;
      stripePriceId: string;
      billingType: 'ONE_TIME' | 'RECURRING';
      currency: string;
      unitAmount: number;
      interval: string | null;
    } | null;
  }>;
};

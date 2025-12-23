export type PlanId = 'sage_base' | 'sage_pay' | 'sage_ai';

export type Plan = {
  id: PlanId;
  name: string;
  price: string;
  priceHint: string;
  subtitle: string;
  forWho: string;
  features: string[];
  highlight?: boolean;
  badge?: string;
};

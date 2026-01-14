export type ReadyItem = {
  orderId: string;
  email: string;
  product: string;
  total: string;
};

export type StalledItem = {
  orderId: string;
  email: string;
  product: string;
  updatedAt: string;
  whatsappLink: string | null;
};

export type UpsellItem = {
  orderId: string;
  email: string;
  product: string;
  createdAt: string;
  tag: 'PENDING' | 'NOT_CONTRACTED';
};

export type LeadItem = {
  id: string;
  name: string;
  email: string;
  message: string;
  landingPath: string;
  whatsappLink: string | null;
};

export type DashboardHomeKpis = {
  revenue7Cents: number;
  paidOrdersToday: number;
  leads7: number;
  leadsToday: number;
  paidOrders7: number;
  conversion7: number;
  onboardingPending: number;
  onboardingsStarted7: number;
};

export type DashboardHomeData = {
  kpis: DashboardHomeKpis;
  ready: ReadyItem[];
  stalled: StalledItem[];
  upsells: UpsellItem[];
  leads: LeadItem[];
};

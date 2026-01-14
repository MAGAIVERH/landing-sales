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
  whatsappLink?: string | null;
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
  whatsappLink?: string | null;
};

export type Props = {
  ready: ReadyItem[];
  stalled: StalledItem[];
  upsells: UpsellItem[];
  leads: LeadItem[];
};

export type TabKey = 'ready' | 'stalled' | 'upsell' | 'leads';

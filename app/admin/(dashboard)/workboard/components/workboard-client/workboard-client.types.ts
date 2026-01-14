import type * as React from 'react';

export type Status = 'TODO' | 'IN_PROGRESS' | 'DONE' | 'SNOOZED';
export type TabKey = 'ready' | 'stalled' | 'leads' | 'upsells';

export type BriefingPlain = Record<string, unknown> | null;

export type LeadStatus = 'NEW' | 'CONTACTED' | 'QUALIFIED' | 'WON' | 'LOST';

export type ReadyItem = {
  kind: 'READY';
  refId: string;
  email: string;
  product: string;
  status: Status;
  href: string;
  briefingHref: string;
  briefing: BriefingPlain;
};

export type StalledItem = {
  kind: 'STALLED';
  refId: string;
  email: string;
  product: string;
  status: Status;
  updatedAt: string;
  whatsappLink?: string | null;
  emailLink?: string | null;
  href: string;
};

export type UpsellItem = {
  kind: 'UPSELL';
  refId: string;
  email: string;
  product: string;
  status: Status;
  createdAt: string;
  href: string;

  attempts?: number;
  lastSentAt?: string | null;
};

export type LeadItem = {
  kind: 'LEAD';
  refId: string;
  name: string;
  email: string;
  message: string;
  landingPath: string;

  leadStatus: LeadStatus;
  status: Status;

  whatsappLink?: string | null;
  href: string;
};

export type Props = {
  ready: ReadyItem[];
  stalled: StalledItem[];
  upsells: UpsellItem[];
  leads: LeadItem[];
};

export type TabMeta = {
  key: TabKey;
  title: string;
  icon: React.ElementType;
  count: number;
};

export type Split<T> = {
  active: T[];
  done: T[];
};

export type UpdateStatusFn = (
  kind: 'READY' | 'STALLED' | 'UPSELL' | 'LEAD',
  refId: string,
  status: Status,
) => Promise<void>;

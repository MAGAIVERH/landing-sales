export type PlanOption = { id: string; name: string };

export type FinanceResponse = {
  meta: {
    from: string;
    to: string;
    status: string;
    source: string;
    plan: string;
    generatedAt: string;
  };
  filters: {
    plans: PlanOption[];
  };
  kpis: {
    paidRevenueCents: number;
    paidCount: number;
    avgTicketCents: number;

    pendingCents: number;
    pendingCount: number;

    totalCentsAllStatuses: number;

    upsellPaidCents: number;
    upsellPaidCount: number;
    upsellPendingCents: number;

    refundedCents: number;
    refundedCount: number;

    canceledFailedCents: number;
    canceledFailedCount: number;
  };
  charts: {
    revenuePaidByDay: Array<{ date: string; cents: number }>;
    volumeByDay: Array<{ date: string; paid: number; pending: number }>;
    planDistribution: Array<{ planName: string; cents: number; count: number }>;
  };
  transactions: Array<{
    id: string;
    kind: 'order' | 'upsell';
    email: string;
    planName: string;
    status: string;
    statusLabel: string;
    amountCents: number;
    dateISO: string;
    subtitle: string;
  }>;
};

export type Props = {
  defaultFrom: string;
  defaultTo: string;
};

export type DisplayTransaction = {
  id: string;
  email: string;
  planName: string;
  dateISO: string;

  platformCents: number;

  hostingValueLabel: string;
  hostingCentsForTotal: number;

  totalCents: number;
};

export type OrdersSearchParamsRecord = Record<
  string,
  string | string[] | undefined
>;

export type StatusBadgeVariant = 'default' | 'secondary' | 'outline';

export type OrderVM = {
  id: string;
  customerLabel: string;
  customerEmail: string | null;
  leadPhone: string | null; // WhatsApp do onboarding (briefing.data)
  planName: string;
  status: string; // visual
  statusBadgeVariant: StatusBadgeVariant;
  totalLabel: string;
  onboardingStatus: 'SUBMITTED' | 'DRAFT' | 'NOT_STARTED'; // técnico
  hostingBadge: string | null; // visual
  dateLabel: string;
  timeLabel: string;
  createdAtISO: string;
};

export type OrdersPageData = {
  rows: OrderVM[];
  q: string;
  status: string;
  page: number;
  hasPrev: boolean;
  hasNext: boolean;
  pageSize: number;
  totalCount: number;
};

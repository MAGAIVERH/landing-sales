export type AdminSearchParamsRecord = Record<
  string,
  string | string[] | undefined
>;

export type LeadStatusNormalized =
  | ''
  | 'NEW'
  | 'CONTACTED'
  | 'QUALIFIED'
  | 'WON'
  | 'LOST';

export type LeadRow = {
  id: string;
  name: string | null;
  email: string | null;
  phone: string | null;
  message: string | null;
  landingPath: string | null;
  source: string | null;
  status: string;
  createdAt: Date;
};

export type LeadsPageData = {
  q: string;
  status: LeadStatusNormalized;
  openLeads: LeadRow[];
  doneLeads: LeadRow[];
};

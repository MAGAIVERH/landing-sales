// lib/admin-workflow.ts
export type TabKey = 'ready' | 'stalled' | 'upsell' | 'leads';

export const isTabKey = (v?: string | null): v is TabKey => {
  return v === 'ready' || v === 'stalled' || v === 'upsell' || v === 'leads';
};

export const getPriorityTab = (counts: {
  ready: number;
  stalled: number;
  leads: number;
  upsell: number;
}): TabKey => {
  if (counts.ready > 0) return 'ready';
  if (counts.stalled > 0) return 'stalled';
  if (counts.leads > 0) return 'leads';
  return 'upsell';
};

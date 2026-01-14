import type { LeadStatus, Status } from './workboard-client.types';

export const statusLabel: Record<Status, string> = {
  TODO: 'Pendente',
  IN_PROGRESS: 'Em andamento',
  DONE: 'Concluído',
  SNOOZED: 'Snooze',
};

export const statusBadgeClass = (s: Status) => {
  if (s === 'TODO') return 'border-amber-200 bg-amber-50 text-amber-900';
  if (s === 'DONE') return 'border-emerald-200 bg-emerald-50 text-emerald-900';
  if (s === 'IN_PROGRESS') return 'border-sky-200 bg-sky-50 text-sky-900';
  return 'border-muted bg-muted/40 text-muted-foreground';
};

export const leadStatusLabel: Record<LeadStatus, string> = {
  NEW: 'Novo',
  CONTACTED: 'Contatado',
  QUALIFIED: 'Qualificado',
  WON: 'Vendido',
  LOST: 'Perdido',
};

export const leadStatusBadgeClass = (s: LeadStatus) => {
  if (s === 'NEW') return 'border-slate-200 bg-slate-50 text-slate-900';
  if (s === 'CONTACTED') return 'border-sky-200 bg-sky-50 text-sky-900';
  if (s === 'QUALIFIED')
    return 'border-violet-200 bg-violet-50 text-violet-900';
  if (s === 'WON') return 'border-emerald-200 bg-emerald-50 text-emerald-900';
  return 'border-rose-200 bg-rose-50 text-rose-900';
};

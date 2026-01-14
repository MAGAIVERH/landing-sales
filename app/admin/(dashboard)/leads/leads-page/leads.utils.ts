import type {
  AdminSearchParamsRecord,
  LeadStatusNormalized,
} from './leads.types';

export const pick = (sp: AdminSearchParamsRecord, key: string) => {
  const v = (sp as any)?.[key];
  if (Array.isArray(v)) return v[0] ?? '';
  return v ?? '';
};

export const formatDateTime = (value: Date) => {
  return new Intl.DateTimeFormat('pt-BR', {
    dateStyle: 'short',
    timeStyle: 'short',
  }).format(value);
};

export const normalizeLeadStatus = (raw: string): LeadStatusNormalized => {
  const v = (raw ?? '').trim();
  if (!v) return '';

  const lower = v.toLowerCase();
  if (lower === 'todos') return '';

  const upper = v.toUpperCase();

  if (
    upper === 'NEW' ||
    upper === 'CONTACTED' ||
    upper === 'QUALIFIED' ||
    upper === 'WON' ||
    upper === 'LOST'
  ) {
    return upper as LeadStatusNormalized;
  }

  if (lower === 'novo') return 'NEW';
  if (lower === 'contatado') return 'CONTACTED';
  if (lower === 'qualificado') return 'QUALIFIED';
  if (lower === 'vendido') return 'WON';
  if (lower === 'perdido') return 'LOST';

  return '';
};

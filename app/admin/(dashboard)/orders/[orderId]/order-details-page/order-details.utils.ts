export const formatBRL = (cents: number) => {
  const value = cents / 100;
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
};

export const isoDate = (d?: Date | null) =>
  d ? d.toISOString().slice(0, 10) : '-';

export const isPlainObject = (v: unknown): v is Record<string, unknown> => {
  if (!v) return false;
  if (Array.isArray(v)) return false;
  return typeof v === 'object';
};

export const getBriefingPayload = (briefing: unknown) => {
  const b = briefing as any;
  if (!b) return null;

  return (
    b.data ??
    b.payload ??
    b.answers ??
    b.form ??
    b.content ??
    b.snapshot ??
    b.fields ??
    b
  );
};

export const normalizeUrl = (value?: string) => {
  if (!value) return null;
  const v = value.trim();
  if (!v) return null;
  if (v.startsWith('http://') || v.startsWith('https://')) return v;
  return `https://${v}`;
};

export const clean = (v: unknown) => {
  if (v === null || v === undefined) return null;
  if (typeof v === 'string') {
    const x = v.trim();
    return x.length ? x : null;
  }
  if (typeof v === 'number') return Number.isFinite(v) ? v : null;
  if (typeof v === 'boolean') return v;
  if (Array.isArray(v)) return v.length ? v : null;
  if (isPlainObject(v)) return Object.keys(v).length ? v : null;
  return v;
};

export const pick = (obj: Record<string, unknown>, keys: string[]) => {
  for (const k of keys) {
    const v = clean(obj[k]);
    if (v !== null) return v;
  }
  return null;
};

export const normalizeStatusKey = (value?: string | null) => {
  if (!value) return '';
  return value
    .trim()
    .toUpperCase()
    .replace(/[-\s]+/g, '_');
};

export const humanizeStatusFallback = (value?: string | null) => {
  if (!value) return '-';
  const key = normalizeStatusKey(value);
  if (!key) return '-';

  const text = key.replace(/_/g, ' ').toLowerCase();
  return text.charAt(0).toUpperCase() + text.slice(1);
};

export const getOrderStatusLabel = (status?: string | null) => {
  const key = normalizeStatusKey(status);

  const map: Record<string, string> = {
    PAID: 'Pago',
    PENDING: 'Pendente',
    UNPAID: 'Não pago',
    CANCELED: 'Cancelado',
    CANCELLED: 'Cancelado',
    REFUNDED: 'Reembolsado',
    PARTIALLY_REFUNDED: 'Reembolso parcial',
  };

  return map[key] ?? humanizeStatusFallback(status);
};

export const getBriefingStatusLabel = (status?: string | null) => {
  const key = normalizeStatusKey(status);

  const map: Record<string, string> = {
    SUBMITTED: 'Entregue',
    OK: 'Entregue',
    DRAFT: 'Rascunho',
    IN_PROGRESS: 'Em andamento',
    COMPLETED: 'Concluído',
  };

  return map[key] ?? humanizeStatusFallback(status);
};

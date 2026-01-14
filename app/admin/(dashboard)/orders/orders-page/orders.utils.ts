import type {
  OrdersSearchParamsRecord,
  StatusBadgeVariant,
} from './orders.types';

export const pick = (sp: OrdersSearchParamsRecord, key: string) => {
  const v = sp?.[key];
  if (Array.isArray(v)) return v[0] ?? '';
  return v ?? '';
};

export const formatBRL = (cents: number) => {
  const value = cents / 100;
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
};

export const formatDateParts = (iso?: string | null) => {
  if (!iso) return { date: '-', time: '' };
  const dt = new Date(iso);
  if (Number.isNaN(dt.getTime())) return { date: '-', time: '' };

  const date = dt.toLocaleDateString('pt-BR');
  const time = dt.toLocaleTimeString('pt-BR');
  return { date, time };
};

export const statusVariant = (status: string): StatusBadgeVariant => {
  const s = status.toUpperCase();
  if (s === 'PAID') return 'default';
  if (s === 'PENDING') return 'secondary';
  return 'outline';
};

export const statusLabelPT = (status: string) => {
  const s = status.toUpperCase();
  if (s === 'PAID') return 'Pago';
  if (s === 'PENDING') return 'Pendente';
  if (s === 'CANCELED') return 'Cancelado';
  if (s === 'REFUNDED') return 'Reembolsado';
  if (s === 'PARTIALLY_REFUNDED') return 'Reembolso';
  if (s === 'FAILED') return 'Falhou';
  return status;
};

const onlyDigits = (value?: string | null) => (value ?? '').replace(/\D/g, '');

const normalizePhoneCandidate = (value?: string | null) => {
  const digits = onlyDigits(value);
  if (!digits) return null;

  // Aceita números comuns (10-13 dígitos)
  if (digits.length >= 10 && digits.length <= 13) return digits;

  return null;
};

const isRecord = (v: unknown): v is Record<string, unknown> =>
  typeof v === 'object' && v !== null && !Array.isArray(v);

const findPhoneInObject = (obj: unknown, depth: number): string | null => {
  if (!obj || depth < 0) return null;

  if (typeof obj === 'string') return normalizePhoneCandidate(obj);

  if (Array.isArray(obj)) {
    for (const item of obj) {
      const found = findPhoneInObject(item, depth - 1);
      if (found) return found;
    }
    return null;
  }

  if (!isRecord(obj)) return null;

  // chaves prováveis do onboarding
  const preferredKeys = [
    'whatsapp',
    'whatsApp',
    'whatsappNumber',
    'phone',
    'phoneNumber',
    'telefone',
    'celular',
    'mobile',
    'contatoWhatsapp',
    'contatoTelefone',
  ];

  for (const k of preferredKeys) {
    const v = obj[k];
    const found = findPhoneInObject(v, depth - 1);
    if (found) return found;
  }

  // fallback: varrer chaves que parecem relevantes
  for (const [k, v] of Object.entries(obj)) {
    const keyLooksRelevant = /whats|phone|tel|cel|mobile/i.test(k);
    if (!keyLooksRelevant) continue;

    const found = findPhoneInObject(v, depth - 1);
    if (found) return found;
  }

  return null;
};

export const extractOnboardingPhone = (briefing: unknown) => {
  if (!isRecord(briefing)) return null;

  // briefing.data costuma ser Json no Prisma
  const data = briefing['data'];
  return findPhoneInObject(data, 3);
};

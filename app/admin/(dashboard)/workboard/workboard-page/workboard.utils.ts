export const startOfUTCDay = (d: Date) =>
  new Date(
    Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate(), 0, 0, 0),
  );

export const addDaysUTC = (d: Date, days: number) => {
  const x = new Date(d);
  x.setUTCDate(x.getUTCDate() + days);
  return x;
};

export const onlyDigits = (value?: string | null) =>
  (value ?? '').replace(/\D/g, '');

export const normalizeWhatsAppNumber = (value?: string | null) => {
  const digits = onlyDigits(value);
  if (!digits) return null;

  if (digits.startsWith('55')) return digits;
  if (digits.length === 10 || digits.length === 11) return `55${digits}`;
  return digits;
};

export const buildWhatsAppLink = (phone: string, text: string) => {
  const digits = normalizeWhatsAppNumber(phone);
  if (!digits) return null;
  return `https://wa.me/${digits}?text=${encodeURIComponent(text)}`;
};

export const buildEmailLink = (to: string, subject: string, body: string) => {
  const trimmed = (to ?? '').trim();
  if (!trimmed) return null;

  return (
    `mailto:${encodeURIComponent(trimmed)}` +
    `?subject=${encodeURIComponent(subject)}` +
    `&body=${encodeURIComponent(body)}`
  );
};

export const toPlain = <T>(value: T) => {
  return JSON.parse(
    JSON.stringify(value, (_, v) => (typeof v === 'bigint' ? v.toString() : v)),
  ) as T;
};

export const scheduleDaysByAttempts = (attempts: number) => {
  if (attempts <= 0) return 0;
  if (attempts === 1) return 5;
  if (attempts === 2) return 15;
  return 999999;
};

export const formatISODate = (d?: Date | null) => {
  if (!d) return null;
  return d.toISOString().slice(0, 10);
};

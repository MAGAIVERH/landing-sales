export const formatBRL = (cents: number) => {
  const value = cents / 100;
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
};

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
  if (!to) return null;

  const mailto =
    `mailto:${encodeURIComponent(to)}` +
    `?subject=${encodeURIComponent(subject)}` +
    `&body=${encodeURIComponent(body)}`;

  return mailto;
};

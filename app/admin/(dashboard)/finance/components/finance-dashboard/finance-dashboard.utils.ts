export const formatBRL = (cents: number) => {
  const value = (cents ?? 0) / 100;
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
};

export const compactBRL = (cents: number) => {
  const value = (cents ?? 0) / 100;
  return value.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    notation: 'compact',
    maximumFractionDigits: 1,
  });
};

export const shortDate = (iso: string) => {
  const [y, m, d] = iso.split('-');
  return `${d}/${m}/${y}`;
};

export const formatDateTimeBR = (iso: string) => {
  const dt = new Date(iso);
  if (Number.isNaN(dt.getTime())) return '-';
  return dt.toLocaleString('pt-BR');
};

export const isHostingUpsell = (subtitle: string) => {
  const s = (subtitle ?? '').toLowerCase();
  return s.includes('hosting');
};

export const keyOf = (email: string, planName: string) =>
  `${email}::${planName}`;

export const toISODateUTC = (d: Date) => {
  const yyyy = d.getUTCFullYear();
  const mm = String(d.getUTCMonth() + 1).padStart(2, '0');
  const dd = String(d.getUTCDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
};

export const addDaysUTC = (d: Date, days: number) => {
  const next = new Date(d);
  next.setUTCDate(next.getUTCDate() + days);
  return next;
};

export const startOfTodayUTC = () => {
  const now = new Date();
  return new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()),
  );
};

export const getDefaultRangeUTC = () => {
  const todayUTC = startOfTodayUTC();
  const fromUTC = addDaysUTC(todayUTC, -29);

  const defaultFrom = toISODateUTC(fromUTC);
  const defaultTo = toISODateUTC(todayUTC);

  return { defaultFrom, defaultTo };
};

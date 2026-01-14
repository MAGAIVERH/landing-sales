type FormField = {
  key: string;
  label: string;
  value: unknown;
  empty: boolean;
  wide?: boolean;
};

export type BriefingView = {
  fields: FormField[];
  missing: number;
  total: number;
};

const isEmptyScalar = (v: unknown) => {
  if (v === null || v === undefined) return true;
  if (typeof v === 'string') return v.trim().length === 0;
  if (Array.isArray(v)) return v.length === 0;
  return false;
};

export const formatValue = (v: unknown) => {
  if (v === null || v === undefined) return '';
  if (typeof v === 'string') return v;
  if (typeof v === 'number' || typeof v === 'boolean') return String(v);
  try {
    return JSON.stringify(v, null, 2);
  } catch {
    return String(v);
  }
};

const labelFromKey = (key: string) => {
  return key
    .replace(/^data\./, '')
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .replace(/[_-]+/g, ' ')
    .trim();
};

export const buildBriefingView = (
  briefing: Record<string, unknown>,
): BriefingView => {
  const metaKeys = new Set([
    'id',
    'orderId',
    'createdAt',
    'updatedAt',
    'status',
    'submittedAt',
  ]);

  const fields: FormField[] = [];

  for (const [k, v] of Object.entries(briefing)) {
    if (metaKeys.has(k)) continue;

    if (k === 'data' && v && typeof v === 'object' && !Array.isArray(v)) {
      for (const [dk, dv] of Object.entries(v as Record<string, unknown>)) {
        const empty = isEmptyScalar(dv);
        fields.push({
          key: `data.${dk}`,
          label: labelFromKey(`data.${dk}`),
          value: dv,
          empty,
          wide: dk === 'extraNotes',
        });
      }
      continue;
    }

    const empty = isEmptyScalar(v);
    fields.push({
      key: k,
      label: labelFromKey(k),
      value: v,
      empty,
    });
  }

  fields.sort((a, b) => Number(b.empty) - Number(a.empty));

  const missing = fields.filter((f) => f.empty).length;

  return {
    fields,
    missing,
    total: fields.length,
  };
};

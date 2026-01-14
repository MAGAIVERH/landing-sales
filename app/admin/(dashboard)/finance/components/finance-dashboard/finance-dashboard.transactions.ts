import type {
  DisplayTransaction,
  FinanceResponse,
} from './finance-dashboard.types';
import { formatBRL, isHostingUpsell, keyOf } from './finance-dashboard.utils';

type Tx = FinanceResponse['transactions'][number];

export const mergeTransactions = (
  data: FinanceResponse,
): DisplayTransaction[] => {
  const orders = data.transactions.filter((t) => t.kind === 'order');

  const hostingUpsells = data.transactions
    .filter((t) => t.kind === 'upsell' && isHostingUpsell(t.subtitle))
    .sort((a, b) => b.dateISO.localeCompare(a.dateISO));

  const hostingByKey = new Map<string, Tx>();
  for (const u of hostingUpsells) {
    const k = keyOf(u.email, u.planName);
    if (!hostingByKey.has(k)) hostingByKey.set(k, u);
  }

  return orders.map((o) => {
    const k = keyOf(o.email, o.planName);
    const hosting = hostingByKey.get(k);

    const platformCents = o.amountCents ?? 0;

    let hostingValueLabel = 'Pendente';
    let hostingCentsForTotal = 0;

    if (hosting) {
      if (hosting.status === 'PAID') {
        hostingValueLabel = formatBRL(hosting.amountCents ?? 0);
        hostingCentsForTotal = hosting.amountCents ?? 0;
      } else {
        hostingValueLabel = hosting.statusLabel || 'Pendente';
        hostingCentsForTotal = Math.max(0, hosting.amountCents ?? 0);
      }
    }

    const totalCents = platformCents + hostingCentsForTotal;

    return {
      id: o.id,
      email: o.email,
      planName: o.planName,
      dateISO: o.dateISO,
      platformCents,
      hostingValueLabel,
      hostingCentsForTotal,
      totalCents,
    };
  });
};

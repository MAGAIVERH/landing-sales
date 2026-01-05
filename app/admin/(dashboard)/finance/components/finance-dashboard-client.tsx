// 'use client';

// import * as React from 'react';
// import {
//   Bar,
//   BarChart,
//   CartesianGrid,
//   Line,
//   LineChart,
//   ResponsiveContainer,
//   Tooltip,
//   XAxis,
//   YAxis,
// } from 'recharts';

// import { Badge } from '@/components/ui/badge';
// import { Button } from '@/components/ui/button';
// import { Card } from '@/components/ui/card';
// import { Separator } from '@/components/ui/separator';

// type PlanOption = { id: string; name: string };

// type FinanceResponse = {
//   meta: {
//     from: string;
//     to: string;
//     status: string;
//     source: string;
//     plan: string;
//     generatedAt: string;
//   };
//   filters: {
//     plans: PlanOption[];
//   };
//   kpis: {
//     paidRevenueCents: number;
//     paidCount: number;
//     avgTicketCents: number;

//     pendingCents: number;
//     pendingCount: number;

//     totalCentsAllStatuses: number;

//     upsellPaidCents: number;
//     upsellPaidCount: number;
//     upsellPendingCents: number;

//     refundedCents: number;
//     refundedCount: number;

//     canceledFailedCents: number;
//     canceledFailedCount: number;
//   };
//   charts: {
//     revenuePaidByDay: Array<{ date: string; cents: number }>;
//     volumeByDay: Array<{ date: string; paid: number; pending: number }>;
//     planDistribution: Array<{ planName: string; cents: number; count: number }>;
//   };
//   transactions: Array<{
//     id: string;
//     kind: 'order' | 'upsell';
//     email: string;
//     planName: string;
//     status: string;
//     statusLabel: string;
//     amountCents: number;
//     dateISO: string;
//     subtitle: string;
//   }>;
// };

// type Props = {
//   defaultFrom: string; // YYYY-MM-DD
//   defaultTo: string; // YYYY-MM-DD
// };

// const formatBRL = (cents: number) => {
//   const value = (cents ?? 0) / 100;
//   return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
// };

// const compactBRL = (cents: number) => {
//   const value = (cents ?? 0) / 100;
//   return value.toLocaleString('pt-BR', {
//     style: 'currency',
//     currency: 'BRL',
//     notation: 'compact',
//     maximumFractionDigits: 1,
//   });
// };

// const shortDate = (iso: string) => {
//   const [y, m, d] = iso.split('-');
//   return `${d}/${m}/${y}`;
// };

// const formatDateTimeBR = (iso: string) => {
//   const dt = new Date(iso);
//   if (Number.isNaN(dt.getTime())) return '-';
//   return dt.toLocaleString('pt-BR');
// };

// const CHART_PRIMARY = 'var(--primary)';

// export const FinanceDashboardClient = ({ defaultFrom, defaultTo }: Props) => {
//   const [loading, setLoading] = React.useState(true);
//   const [error, setError] = React.useState<string | null>(null);

//   const [data, setData] = React.useState<FinanceResponse | null>(null);

//   const [from, setFrom] = React.useState(defaultFrom);
//   const [to, setTo] = React.useState(defaultTo);
//   const [status, setStatus] = React.useState('ALL');
//   const [source, setSource] = React.useState('ALL');
//   const [plan, setPlan] = React.useState('ALL');

//   const fetchFinance = React.useCallback(async () => {
//     setLoading(true);
//     setError(null);

//     const qs = new URLSearchParams();
//     qs.set('from', from);
//     qs.set('to', to);
//     qs.set('status', status);
//     qs.set('source', source);
//     qs.set('plan', plan);

//     const res = await fetch(`/api/admin/finance?${qs.toString()}`, {
//       method: 'GET',
//       headers: { 'content-type': 'application/json' },
//     });

//     if (!res.ok) {
//       const payload = (await res.json().catch(() => null)) as any;
//       setError(payload?.error ?? 'Falha ao carregar financeiro.');
//       setLoading(false);
//       return;
//     }

//     const json = (await res.json()) as FinanceResponse;
//     setData(json);
//     setLoading(false);
//   }, [from, to, status, source, plan]);

//   React.useEffect(() => {
//     void fetchFinance();
//   }, [fetchFinance]);

//   const clear = () => {
//     setFrom(defaultFrom);
//     setTo(defaultTo);
//     setStatus('ALL');
//     setSource('ALL');
//     setPlan('ALL');
//     window.setTimeout(() => void fetchFinance(), 0);
//   };

//   return (
//     <div className='flex flex-col gap-6'>
//       <Card className='p-4'>
//         <div className='flex items-start justify-between gap-4'>
//           <div className='flex flex-col gap-1'>
//             <p className='text-sm font-semibold'>Resumo do período</p>
//             <p className='text-xs text-muted-foreground'>
//               Período: {shortDate(from)} até {shortDate(to)} • Fonte: {source} •
//               Status: {status}
//             </p>
//           </div>

//           <Badge variant='secondary'>Admin</Badge>
//         </div>
//       </Card>

//       <Card className='p-4'>
//         <div className='grid gap-4 md:grid-cols-6'>
//           <div className='grid gap-2 md:col-span-2'>
//             <span className='text-sm font-medium'>De</span>
//             <input
//               type='date'
//               value={from}
//               onChange={(e) => setFrom(e.target.value)}
//               className='h-10 rounded-md border bg-background px-3 text-sm'
//             />
//           </div>

//           <div className='grid gap-2 md:col-span-2'>
//             <span className='text-sm font-medium'>Até</span>
//             <input
//               type='date'
//               value={to}
//               onChange={(e) => setTo(e.target.value)}
//               className='h-10 rounded-md border bg-background px-3 text-sm'
//             />
//           </div>

//           <div className='grid gap-2'>
//             <span className='text-sm font-medium'>Status</span>
//             <select
//               value={status}
//               onChange={(e) => setStatus(e.target.value)}
//               className='h-10 rounded-md border bg-background px-3 text-sm'
//             >
//               <option value='ALL'>Todos</option>
//               <option value='PAID'>Pago</option>
//               <option value='PENDING'>Pendente</option>
//               <option value='CANCELED'>Cancelado</option>
//               <option value='REFUNDED'>Reembolsado</option>
//               <option value='FAILED'>Falhou</option>
//             </select>
//           </div>

//           <div className='grid gap-2'>
//             <span className='text-sm font-medium'>Fonte</span>
//             <select
//               value={source}
//               onChange={(e) => setSource(e.target.value)}
//               className='h-10 rounded-md border bg-background px-3 text-sm'
//             >
//               <option value='ALL'>Tudo</option>
//               <option value='ORDER'>Pedidos</option>
//               <option value='UPSELL'>Upsells</option>
//             </select>
//           </div>

//           <div className='grid gap-2 md:col-span-3'>
//             <span className='text-sm font-medium'>Plano</span>
//             <select
//               value={plan}
//               onChange={(e) => setPlan(e.target.value)}
//               className='h-10 rounded-md border bg-background px-3 text-sm'
//             >
//               <option value='ALL'>Todos</option>
//               {(data?.filters.plans ?? []).map((p) => (
//                 <option key={p.id} value={p.id}>
//                   {p.name}
//                 </option>
//               ))}
//             </select>
//           </div>

//           <div className='grid items-end gap-2 md:col-span-3 sm:grid-cols-2'>
//             <Button
//               className='h-10 w-full'
//               onClick={() => void fetchFinance()}
//               disabled={loading}
//             >
//               Aplicar
//             </Button>
//             <Button
//               className='h-10 w-full'
//               variant='outline'
//               onClick={clear}
//               disabled={loading}
//             >
//               Limpar
//             </Button>
//           </div>
//         </div>
//       </Card>

//       {error ? (
//         <Card className='p-4'>
//           <p className='text-sm font-semibold'>Erro</p>
//           <p className='text-sm text-muted-foreground'>{error}</p>
//         </Card>
//       ) : null}

//       {loading || !data ? (
//         <Card className='p-4'>
//           <p className='text-sm text-muted-foreground'>
//             Carregando dados financeiros…
//           </p>
//         </Card>
//       ) : (
//         <>
//           {/* KPIs */}
//           <div className='grid gap-4 md:grid-cols-4'>
//             <Card className='p-4 border-l-4 border-primary bg-primary/5'>
//               <p className='text-xs text-muted-foreground'>
//                 Receita paga (período)
//               </p>
//               <p className='mt-2 text-xl font-semibold'>
//                 {formatBRL(data.kpis.paidRevenueCents)}
//               </p>
//               <p className='mt-2 text-xs text-muted-foreground'>
//                 {data.kpis.paidCount} pedidos pagos
//               </p>
//             </Card>

//             <Card className='p-4 border-l-4 border-muted bg-muted/20'>
//               <p className='text-xs text-muted-foreground'>
//                 Ticket médio (pagos)
//               </p>
//               <p className='mt-2 text-xl font-semibold'>
//                 {formatBRL(data.kpis.avgTicketCents)}
//               </p>
//               <p className='mt-2 text-xs text-muted-foreground'>
//                 Receita paga / pedidos pagos
//               </p>
//             </Card>

//             <Card className='p-4 border-l-4 border-secondary bg-secondary/15'>
//               <p className='text-xs text-muted-foreground'>
//                 Pendente (período)
//               </p>
//               <p className='mt-2 text-xl font-semibold'>
//                 {formatBRL(data.kpis.pendingCents)}
//               </p>
//               <p className='mt-2 text-xs text-muted-foreground'>
//                 {data.kpis.pendingCount} pedidos pendentes
//               </p>
//             </Card>

//             <Card className='p-4 border-l-4 border-muted bg-muted/20'>
//               <p className='text-xs text-muted-foreground'>
//                 Receita total (todos status)
//               </p>
//               <p className='mt-2 text-xl font-semibold'>
//                 {formatBRL(data.kpis.totalCentsAllStatuses)}
//               </p>
//               <p className='mt-2 text-xs text-muted-foreground'>
//                 Inclui pendentes, cancelados e reembolsos
//               </p>
//             </Card>

//             <Card className='p-4 border-l-4 border-primary bg-primary/5'>
//               <p className='text-xs text-muted-foreground'>Upsell pago</p>
//               <p className='mt-2 text-xl font-semibold'>
//                 {formatBRL(data.kpis.upsellPaidCents)}
//               </p>
//               <p className='mt-2 text-xs text-muted-foreground'>
//                 {data.kpis.upsellPaidCount} upsells pagos
//               </p>
//             </Card>

//             <Card className='p-4 border-l-4 border-secondary bg-secondary/15'>
//               <p className='text-xs text-muted-foreground'>Upsell pendente</p>
//               <p className='mt-2 text-xl font-semibold'>
//                 {formatBRL(data.kpis.upsellPendingCents)}
//               </p>
//               <p className='mt-2 text-xs text-muted-foreground'>
//                 Aguardando pagamento
//               </p>
//             </Card>

//             <Card className='p-4 border-l-4 border-destructive bg-destructive/5'>
//               <p className='text-xs text-muted-foreground'>Reembolsado</p>
//               <p className='mt-2 text-xl font-semibold'>
//                 {formatBRL(data.kpis.refundedCents)}
//               </p>
//               <p className='mt-2 text-xs text-muted-foreground'>
//                 {data.kpis.refundedCount} pedidos
//               </p>
//             </Card>

//             <Card className='p-4 border-l-4 border-destructive bg-destructive/5'>
//               <p className='text-xs text-muted-foreground'>
//                 Cancelado / Falhou
//               </p>
//               <p className='mt-2 text-xl font-semibold'>
//                 {formatBRL(data.kpis.canceledFailedCents)}
//               </p>
//               <p className='mt-2 text-xs text-muted-foreground'>
//                 {data.kpis.canceledFailedCount} pedidos
//               </p>
//             </Card>
//           </div>

//           {/* Charts */}
//           <div className='grid gap-4 md:grid-cols-2'>
//             <Card className='p-4'>
//               <div className='flex items-start justify-between gap-3'>
//                 <div>
//                   <p className='text-sm font-semibold'>Receita paga por dia</p>
//                   <p className='text-xs text-muted-foreground'>
//                     Últimos dias do período.
//                   </p>
//                 </div>
//                 <Badge variant='secondary'>
//                   {compactBRL(data.kpis.paidRevenueCents)}
//                 </Badge>
//               </div>

//               <Separator className='my-4' />

//               <div className='h-72 w-full'>
//                 <ResponsiveContainer width='100%' height='100%'>
//                   <LineChart data={data.charts.revenuePaidByDay}>
//                     <CartesianGrid strokeDasharray='3 3' />
//                     <XAxis
//                       dataKey='date'
//                       tickFormatter={(v) => shortDate(String(v))}
//                     />
//                     <YAxis tickFormatter={(v) => `${Number(v) / 100}`} />
//                     <Tooltip
//                       formatter={(value) => formatBRL(Number(value))}
//                       labelFormatter={(label) =>
//                         `Dia ${shortDate(String(label))}`
//                       }
//                     />
//                     <Line
//                       type='monotone'
//                       dataKey='cents'
//                       stroke={CHART_PRIMARY}
//                       strokeWidth={2}
//                       dot={false}
//                     />
//                   </LineChart>
//                 </ResponsiveContainer>
//               </div>
//             </Card>

//             <Card className='p-4'>
//               <div className='flex items-start justify-between gap-3'>
//                 <div>
//                   <p className='text-sm font-semibold'>Volume de pedidos</p>
//                   <p className='text-xs text-muted-foreground'>
//                     Pagos e pendentes por dia.
//                   </p>
//                 </div>
//                 <Badge variant='secondary'>{data.kpis.paidCount} pagos</Badge>
//               </div>

//               <Separator className='my-4' />

//               <div className='h-72 w-full'>
//                 <ResponsiveContainer width='100%' height='100%'>
//                   <BarChart data={data.charts.volumeByDay}>
//                     <CartesianGrid strokeDasharray='3 3' />
//                     <XAxis
//                       dataKey='date'
//                       tickFormatter={(v) => shortDate(String(v))}
//                     />
//                     <YAxis allowDecimals={false} />
//                     <Tooltip
//                       labelFormatter={(label) =>
//                         `Dia ${shortDate(String(label))}`
//                       }
//                     />
//                     <Bar dataKey='paid' name='Pagos' fill={CHART_PRIMARY} />
//                     <Bar
//                       dataKey='pending'
//                       name='Pendentes'
//                       fill={CHART_PRIMARY}
//                       fillOpacity={0.35}
//                     />
//                   </BarChart>
//                 </ResponsiveContainer>
//               </div>

//               <p className='mt-2 text-xs text-muted-foreground'>
//                 Pagos: {data.kpis.paidCount} • Pendentes:{' '}
//                 {data.kpis.pendingCount}
//               </p>
//             </Card>

//             <Card className='p-4 md:col-span-2'>
//               <div className='flex items-start justify-between gap-3'>
//                 <div>
//                   <p className='text-sm font-semibold'>
//                     Distribuição por plano
//                   </p>
//                   <p className='text-xs text-muted-foreground'>
//                     Participação na receita paga do período.
//                   </p>
//                 </div>
//                 <Badge variant='secondary'>
//                   {data.charts.planDistribution.length} planos
//                 </Badge>
//               </div>

//               <Separator className='my-4' />

//               <div className='grid gap-3'>
//                 {data.charts.planDistribution.length === 0 ? (
//                   <p className='text-sm text-muted-foreground'>
//                     Sem dados no período.
//                   </p>
//                 ) : (
//                   data.charts.planDistribution.map((p) => {
//                     const pct =
//                       data.kpis.paidRevenueCents > 0
//                         ? Math.round(
//                             (p.cents / data.kpis.paidRevenueCents) * 100,
//                           )
//                         : 0;

//                     return (
//                       <div key={p.planName} className='rounded-xl border p-3'>
//                         <div className='flex items-center justify-between gap-3'>
//                           <div className='min-w-0'>
//                             <p className='text-sm font-medium'>{p.planName}</p>
//                             <p className='text-xs text-muted-foreground'>
//                               {formatBRL(p.cents)} • {p.count} pagos
//                             </p>
//                           </div>
//                           <Badge variant='secondary'>{pct}%</Badge>
//                         </div>

//                         <div className='mt-3 h-2 w-full rounded-full bg-muted'>
//                           <div
//                             className='h-2 rounded-full bg-primary'
//                             style={{
//                               width: `${Math.min(100, Math.max(0, pct))}%`,
//                             }}
//                           />
//                         </div>
//                       </div>
//                     );
//                   })
//                 )}
//               </div>
//             </Card>
//           </div>

//           {/* Transactions */}
//           <Card className='p-4'>
//             <div className='flex items-start justify-between gap-3'>
//               <div>
//                 <p className='text-sm font-semibold'>Transações</p>
//                 <p className='text-xs text-muted-foreground'>
//                   Pedidos e upsells do período.
//                 </p>
//               </div>
//               <Badge variant='secondary'>
//                 {data.transactions.length} itens
//               </Badge>
//             </div>

//             <Separator className='my-4' />

//             <div className='grid gap-2'>
//               {data.transactions.length === 0 ? (
//                 <p className='text-sm text-muted-foreground'>
//                   Nenhuma transação encontrada.
//                 </p>
//               ) : (
//                 data.transactions.map((t) => (
//                   <div
//                     key={`${t.kind}-${t.id}`}
//                     className='flex items-center justify-between gap-3 rounded-xl border p-3'
//                   >
//                     <div className='min-w-0'>
//                       <p className='truncate text-sm font-medium'>
//                         {t.email} • {t.planName} ({t.subtitle})
//                       </p>
//                       <p className='text-xs text-muted-foreground'>
//                         {formatDateTimeBR(t.dateISO)}
//                       </p>
//                     </div>

//                     <div className='flex items-center gap-2'>
//                       <Badge variant='outline'>{t.statusLabel}</Badge>
//                       <Badge variant='secondary'>
//                         {formatBRL(t.amountCents)}
//                       </Badge>
//                     </div>
//                   </div>
//                 ))
//               )}
//             </div>
//           </Card>
//         </>
//       )}
//     </div>
//   );
// };

'use client';

import * as React from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

type PlanOption = { id: string; name: string };

type FinanceResponse = {
  meta: {
    from: string;
    to: string;
    status: string;
    source: string;
    plan: string;
    generatedAt: string;
  };
  filters: {
    plans: PlanOption[];
  };
  kpis: {
    paidRevenueCents: number;
    paidCount: number;
    avgTicketCents: number;

    pendingCents: number;
    pendingCount: number;

    totalCentsAllStatuses: number;

    upsellPaidCents: number;
    upsellPaidCount: number;
    upsellPendingCents: number;

    refundedCents: number;
    refundedCount: number;

    canceledFailedCents: number;
    canceledFailedCount: number;
  };
  charts: {
    revenuePaidByDay: Array<{ date: string; cents: number }>;
    volumeByDay: Array<{ date: string; paid: number; pending: number }>;
    planDistribution: Array<{ planName: string; cents: number; count: number }>;
  };
  transactions: Array<{
    id: string;
    kind: 'order' | 'upsell';
    email: string;
    planName: string;
    status: string;
    statusLabel: string;
    amountCents: number;
    dateISO: string;
    subtitle: string;
  }>;
};

type Props = {
  defaultFrom: string; // YYYY-MM-DD
  defaultTo: string; // YYYY-MM-DD
};

const formatBRL = (cents: number) => {
  const value = (cents ?? 0) / 100;
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
};

const compactBRL = (cents: number) => {
  const value = (cents ?? 0) / 100;
  return value.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    notation: 'compact',
    maximumFractionDigits: 1,
  });
};

const shortDate = (iso: string) => {
  const [y, m, d] = iso.split('-');
  return `${d}/${m}/${y}`;
};

const formatDateTimeBR = (iso: string) => {
  const dt = new Date(iso);
  if (Number.isNaN(dt.getTime())) return '-';
  return dt.toLocaleString('pt-BR');
};

const CHART_PRIMARY = 'var(--primary)';

const TX_INITIAL = 4;
const TX_STEP = 4;
const TX_PAGE_SIZE = 20;

type DisplayTransaction = {
  id: string;
  email: string;
  planName: string;
  dateISO: string;

  platformCents: number;

  hostingValueLabel: string; // valor em BRL ou "Pendente"/"Cancelado"/etc.
  hostingCentsForTotal: number; // 0 quando não tiver valor

  totalCents: number;
};

const isHostingUpsell = (subtitle: string) => {
  const s = (subtitle ?? '').toLowerCase();
  return s.includes('hosting');
};

export const FinanceDashboardClient = ({ defaultFrom, defaultTo }: Props) => {
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  const [data, setData] = React.useState<FinanceResponse | null>(null);

  const [from, setFrom] = React.useState(defaultFrom);
  const [to, setTo] = React.useState(defaultTo);
  const [status, setStatus] = React.useState('ALL');
  const [source, setSource] = React.useState('ALL');
  const [plan, setPlan] = React.useState('ALL');

  const fetchFinance = React.useCallback(async () => {
    setLoading(true);
    setError(null);

    const qs = new URLSearchParams();
    qs.set('from', from);
    qs.set('to', to);
    qs.set('status', status);
    qs.set('source', source);
    qs.set('plan', plan);

    const res = await fetch(`/api/admin/finance?${qs.toString()}`, {
      method: 'GET',
      headers: { 'content-type': 'application/json' },
    });

    if (!res.ok) {
      const payload = (await res.json().catch(() => null)) as any;
      setError(payload?.error ?? 'Falha ao carregar financeiro.');
      setLoading(false);
      return;
    }

    const json = (await res.json()) as FinanceResponse;
    setData(json);
    setLoading(false);
  }, [from, to, status, source, plan]);

  React.useEffect(() => {
    void fetchFinance();
  }, [fetchFinance]);

  const clear = () => {
    setFrom(defaultFrom);
    setTo(defaultTo);
    setStatus('ALL');
    setSource('ALL');
    setPlan('ALL');
    window.setTimeout(() => void fetchFinance(), 0);
  };

  const transactionsRef = React.useRef<HTMLDivElement | null>(null);

  const mergedTransactions = React.useMemo<DisplayTransaction[]>(() => {
    if (!data) return [];

    const orders = data.transactions.filter((t) => t.kind === 'order');
    const hostingUpsells = data.transactions
      .filter((t) => t.kind === 'upsell' && isHostingUpsell(t.subtitle))
      .sort((a, b) => b.dateISO.localeCompare(a.dateISO));

    const keyOf = (email: string, planName: string) => `${email}::${planName}`;

    const hostingByKey = new Map<string, (typeof data.transactions)[number]>();
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
  }, [data]);

  const [txPage, setTxPage] = React.useState(0);
  const [txVisible, setTxVisible] = React.useState(TX_INITIAL);

  React.useEffect(() => {
    setTxPage(0);
    setTxVisible(TX_INITIAL);
  }, [from, to, status, source, plan, data?.meta?.generatedAt]);

  const txTotal = mergedTransactions.length;
  const txPageCount = Math.max(1, Math.ceil(txTotal / TX_PAGE_SIZE));

  const txPageStart = txPage * TX_PAGE_SIZE;
  const txPageEnd = txPageStart + TX_PAGE_SIZE;
  const txPageItems = mergedTransactions.slice(txPageStart, txPageEnd);

  const txVisibleItems = txPageItems.slice(
    0,
    Math.min(txVisible, txPageItems.length),
  );

  const canShowMore = txPageItems.length > txVisible;
  const canShowLess = txVisible > TX_INITIAL;

  const showMore = () => {
    setTxVisible((prev) => Math.min(txPageItems.length, prev + TX_STEP));
  };

  const showLess = () => {
    setTxVisible(TX_INITIAL);
    transactionsRef.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  };

  const goPrev = () => {
    setTxPage((prev) => Math.max(0, prev - 1));
    setTxVisible(TX_INITIAL);
    window.setTimeout(() => {
      transactionsRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }, 0);
  };

  const goNext = () => {
    setTxPage((prev) => Math.min(txPageCount - 1, prev + 1));
    setTxVisible(TX_INITIAL);
    window.setTimeout(() => {
      transactionsRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }, 0);
  };

  return (
    <div className='flex flex-col gap-6'>
      <Card className='p-4'>
        <div className='flex items-start justify-between gap-4'>
          <div className='flex flex-col gap-1'>
            <p className='text-sm font-semibold'>Resumo do período</p>
            <p className='text-xs text-muted-foreground'>
              Período: {shortDate(from)} até {shortDate(to)} • Fonte: {source} •
              Status: {status}
            </p>
          </div>

          <Badge variant='secondary'>Admin</Badge>
        </div>
      </Card>

      <Card className='p-4'>
        <div className='grid gap-4 md:grid-cols-6'>
          <div className='grid gap-2 md:col-span-2'>
            <span className='text-sm font-medium'>De</span>
            <input
              type='date'
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              className='h-10 rounded-md border bg-background px-3 text-sm'
            />
          </div>

          <div className='grid gap-2 md:col-span-2'>
            <span className='text-sm font-medium'>Até</span>
            <input
              type='date'
              value={to}
              onChange={(e) => setTo(e.target.value)}
              className='h-10 rounded-md border bg-background px-3 text-sm'
            />
          </div>

          <div className='grid gap-2'>
            <span className='text-sm font-medium'>Status</span>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className='h-10 rounded-md border bg-background px-3 text-sm'
            >
              <option value='ALL'>Todos</option>
              <option value='PAID'>Pago</option>
              <option value='PENDING'>Pendente</option>
              <option value='CANCELED'>Cancelado</option>
              <option value='REFUNDED'>Reembolsado</option>
              <option value='FAILED'>Falhou</option>
            </select>
          </div>

          <div className='grid gap-2'>
            <span className='text-sm font-medium'>Fonte</span>
            <select
              value={source}
              onChange={(e) => setSource(e.target.value)}
              className='h-10 rounded-md border bg-background px-3 text-sm'
            >
              <option value='ALL'>Tudo</option>
              <option value='ORDER'>Pedidos</option>
              <option value='UPSELL'>Upsells</option>
            </select>
          </div>

          <div className='grid gap-2 md:col-span-3'>
            <span className='text-sm font-medium'>Plano</span>
            <select
              value={plan}
              onChange={(e) => setPlan(e.target.value)}
              className='h-10 rounded-md border bg-background px-3 text-sm'
            >
              <option value='ALL'>Todos</option>
              {(data?.filters.plans ?? []).map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          <div className='grid items-end gap-2 md:col-span-3 sm:grid-cols-2'>
            <Button
              className='h-10 w-full'
              onClick={() => void fetchFinance()}
              disabled={loading}
            >
              Aplicar
            </Button>
            <Button
              className='h-10 w-full'
              variant='outline'
              onClick={clear}
              disabled={loading}
            >
              Limpar
            </Button>
          </div>
        </div>
      </Card>

      {error ? (
        <Card className='p-4'>
          <p className='text-sm font-semibold'>Erro</p>
          <p className='text-sm text-muted-foreground'>{error}</p>
        </Card>
      ) : null}

      {loading || !data ? (
        <Card className='p-4'>
          <p className='text-sm text-muted-foreground'>
            Carregando dados financeiros…
          </p>
        </Card>
      ) : (
        <>
          <div className='grid gap-4 md:grid-cols-4'>
            <Card className='p-4 border-l-4 border-primary bg-primary/5'>
              <p className='text-xs text-muted-foreground'>
                Receita paga (período)
              </p>
              <p className='mt-2 text-xl font-semibold'>
                {formatBRL(data.kpis.paidRevenueCents)}
              </p>
              <p className='mt-2 text-xs text-muted-foreground'>
                {data.kpis.paidCount} pedidos pagos
              </p>
            </Card>

            <Card className='p-4 border-l-4 border-muted bg-muted/20'>
              <p className='text-xs text-muted-foreground'>
                Ticket médio (pagos)
              </p>
              <p className='mt-2 text-xl font-semibold'>
                {formatBRL(data.kpis.avgTicketCents)}
              </p>
              <p className='mt-2 text-xs text-muted-foreground'>
                Receita paga / pedidos pagos
              </p>
            </Card>

            <Card className='p-4 border-l-4 border-secondary bg-secondary/15'>
              <p className='text-xs text-muted-foreground'>
                Pendente (período)
              </p>
              <p className='mt-2 text-xl font-semibold'>
                {formatBRL(data.kpis.pendingCents)}
              </p>
              <p className='mt-2 text-xs text-muted-foreground'>
                {data.kpis.pendingCount} pedidos pendentes
              </p>
            </Card>

            <Card className='p-4 border-l-4 border-muted bg-muted/20'>
              <p className='text-xs text-muted-foreground'>
                Receita total (todos status)
              </p>
              <p className='mt-2 text-xl font-semibold'>
                {formatBRL(data.kpis.totalCentsAllStatuses)}
              </p>
              <p className='mt-2 text-xs text-muted-foreground'>
                Inclui pendentes, cancelados e reembolsos
              </p>
            </Card>

            <Card className='p-4 border-l-4 border-primary bg-primary/5'>
              <p className='text-xs text-muted-foreground'>Upsell pago</p>
              <p className='mt-2 text-xl font-semibold'>
                {formatBRL(data.kpis.upsellPaidCents)}
              </p>
              <p className='mt-2 text-xs text-muted-foreground'>
                {data.kpis.upsellPaidCount} upsells pagos
              </p>
            </Card>

            <Card className='p-4 border-l-4 border-secondary bg-secondary/15'>
              <p className='text-xs text-muted-foreground'>Upsell pendente</p>
              <p className='mt-2 text-xl font-semibold'>
                {formatBRL(data.kpis.upsellPendingCents)}
              </p>
              <p className='mt-2 text-xs text-muted-foreground'>
                Aguardando pagamento
              </p>
            </Card>

            <Card className='p-4 border-l-4 border-destructive bg-destructive/5'>
              <p className='text-xs text-muted-foreground'>Reembolsado</p>
              <p className='mt-2 text-xl font-semibold'>
                {formatBRL(data.kpis.refundedCents)}
              </p>
              <p className='mt-2 text-xs text-muted-foreground'>
                {data.kpis.refundedCount} pedidos
              </p>
            </Card>

            <Card className='p-4 border-l-4 border-destructive bg-destructive/5'>
              <p className='text-xs text-muted-foreground'>
                Cancelado / Falhou
              </p>
              <p className='mt-2 text-xl font-semibold'>
                {formatBRL(data.kpis.canceledFailedCents)}
              </p>
              <p className='mt-2 text-xs text-muted-foreground'>
                {data.kpis.canceledFailedCount} pedidos
              </p>
            </Card>
          </div>

          <div className='grid gap-4 md:grid-cols-2'>
            <Card className='p-4'>
              <div className='flex items-start justify-between gap-3'>
                <div>
                  <p className='text-sm font-semibold'>Receita paga por dia</p>
                  <p className='text-xs text-muted-foreground'>
                    Últimos dias do período.
                  </p>
                </div>
                <Badge variant='secondary'>
                  {compactBRL(data.kpis.paidRevenueCents)}
                </Badge>
              </div>

              <Separator className='my-4' />

              <div className='h-72 w-full'>
                <ResponsiveContainer width='100%' height='100%'>
                  <LineChart data={data.charts.revenuePaidByDay}>
                    <CartesianGrid strokeDasharray='3 3' />
                    <XAxis
                      dataKey='date'
                      tickFormatter={(v) => shortDate(String(v))}
                    />
                    <YAxis tickFormatter={(v) => `${Number(v) / 100}`} />
                    <Tooltip
                      formatter={(value) => formatBRL(Number(value))}
                      labelFormatter={(label) =>
                        `Dia ${shortDate(String(label))}`
                      }
                    />
                    <Line
                      type='monotone'
                      dataKey='cents'
                      stroke={CHART_PRIMARY}
                      strokeWidth={2}
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </Card>

            <Card className='p-4'>
              <div className='flex items-start justify-between gap-3'>
                <div>
                  <p className='text-sm font-semibold'>Volume de pedidos</p>
                  <p className='text-xs text-muted-foreground'>
                    Pagos e pendentes por dia.
                  </p>
                </div>
                <Badge variant='secondary'>{data.kpis.paidCount} pagos</Badge>
              </div>

              <Separator className='my-4' />

              <div className='h-72 w-full'>
                <ResponsiveContainer width='100%' height='100%'>
                  <BarChart data={data.charts.volumeByDay}>
                    <CartesianGrid strokeDasharray='3 3' />
                    <XAxis
                      dataKey='date'
                      tickFormatter={(v) => shortDate(String(v))}
                    />
                    <YAxis allowDecimals={false} />
                    <Tooltip
                      labelFormatter={(label) =>
                        `Dia ${shortDate(String(label))}`
                      }
                    />
                    <Bar dataKey='paid' name='Pagos' fill={CHART_PRIMARY} />
                    <Bar
                      dataKey='pending'
                      name='Pendentes'
                      fill={CHART_PRIMARY}
                      fillOpacity={0.35}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <p className='mt-2 text-xs text-muted-foreground'>
                Pagos: {data.kpis.paidCount} • Pendentes:{' '}
                {data.kpis.pendingCount}
              </p>
            </Card>

            <Card className='p-4 md:col-span-2'>
              <div className='flex items-start justify-between gap-3'>
                <div>
                  <p className='text-sm font-semibold'>
                    Distribuição por plano
                  </p>
                  <p className='text-xs text-muted-foreground'>
                    Participação na receita paga do período.
                  </p>
                </div>
                <Badge variant='secondary'>
                  {data.charts.planDistribution.length} planos
                </Badge>
              </div>

              <Separator className='my-4' />

              <div className='grid gap-3'>
                {data.charts.planDistribution.length === 0 ? (
                  <p className='text-sm text-muted-foreground'>
                    Sem dados no período.
                  </p>
                ) : (
                  data.charts.planDistribution.map((p) => {
                    const pct =
                      data.kpis.paidRevenueCents > 0
                        ? Math.round(
                            (p.cents / data.kpis.paidRevenueCents) * 100,
                          )
                        : 0;

                    return (
                      <div key={p.planName} className='rounded-xl border p-3'>
                        <div className='flex items-center justify-between gap-3'>
                          <div className='min-w-0'>
                            <p className='text-sm font-medium'>{p.planName}</p>
                            <p className='text-xs text-muted-foreground'>
                              {formatBRL(p.cents)} • {p.count} pagos
                            </p>
                          </div>
                          <Badge variant='secondary'>{pct}%</Badge>
                        </div>

                        <div className='mt-3 h-2 w-full rounded-full bg-muted'>
                          <div
                            className='h-2 rounded-full bg-primary'
                            style={{
                              width: `${Math.min(100, Math.max(0, pct))}%`,
                            }}
                          />
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </Card>
          </div>

          <Card className='p-4'>
            <div
              ref={transactionsRef}
              className='flex items-start justify-between gap-3'
            >
              <div>
                <p className='text-sm font-semibold'>Transações</p>
                <p className='text-xs text-muted-foreground'>
                  Pedidos e upsells do período.
                </p>
              </div>
              <Badge variant='secondary'>{txTotal} itens</Badge>
            </div>

            <Separator className='my-4' />

            <div className='grid gap-2'>
              {txTotal === 0 ? (
                <p className='text-sm text-muted-foreground'>
                  Nenhuma transação encontrada.
                </p>
              ) : (
                txVisibleItems.map((t) => (
                  <div
                    key={t.id}
                    className='flex items-center justify-between gap-4 rounded-xl border p-3'
                  >
                    <div className='min-w-0'>
                      <p className='truncate text-sm font-medium'>
                        {t.email} • {t.planName}
                      </p>
                      <p className='text-xs text-muted-foreground'>
                        {formatDateTimeBR(t.dateISO)}
                      </p>
                    </div>

                    <div className='grid w-[320px] grid-cols-3 gap-3 text-center'>
                      <div className='grid gap-1'>
                        <span className='text-[11px] leading-none text-muted-foreground'>
                          Plataforma
                        </span>
                        <span className='font-mono text-sm font-semibold tabular-nums leading-none'>
                          {formatBRL(t.platformCents)}
                        </span>
                      </div>

                      <div className='grid gap-1'>
                        <span className='text-[11px] leading-none text-muted-foreground'>
                          Hospedagem
                        </span>

                        {t.hostingValueLabel.startsWith('R$') ? (
                          <span className='font-mono text-sm font-semibold tabular-nums leading-none'>
                            {t.hostingValueLabel}
                          </span>
                        ) : (
                          <span className='inline-flex justify-end'>
                            <Badge
                              variant='secondary'
                              className='h-6 px-2 text-xs'
                            >
                              {t.hostingValueLabel}
                            </Badge>
                          </span>
                        )}
                      </div>

                      <div className='grid gap-1'>
                        <span className='text-[11px] leading-none text-muted-foreground'>
                          Total
                        </span>
                        <span className='font-mono text-sm font-semibold tabular-nums leading-none'>
                          {formatBRL(t.totalCents)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {txTotal > 0 ? (
              <div className='mt-4 flex flex-wrap items-center justify-end gap-2'>
                {canShowLess ? (
                  <Button variant='outline' onClick={showLess} className='h-9'>
                    Ver menos
                  </Button>
                ) : null}

                {canShowMore ? (
                  <Button onClick={showMore} className='h-9'>
                    Ver todos
                  </Button>
                ) : null}

                {txTotal > TX_PAGE_SIZE ? (
                  <>
                    <Button
                      variant='outline'
                      onClick={goPrev}
                      disabled={txPage === 0}
                      className='h-9'
                    >
                      Anterior
                    </Button>
                    <Button
                      variant='outline'
                      onClick={goNext}
                      disabled={txPage >= txPageCount - 1}
                      className='h-9'
                    >
                      Próximo
                    </Button>
                  </>
                ) : null}
              </div>
            ) : null}
          </Card>
        </>
      )}
    </div>
  );
};

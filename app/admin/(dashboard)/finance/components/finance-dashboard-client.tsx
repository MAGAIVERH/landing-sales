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
//                       stroke='currentColor'
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
//                     <Bar dataKey='paid' name='Pagos' fill='currentColor' />
//                     <Bar
//                       dataKey='pending'
//                       name='Pendentes'
//                       fill='currentColor'
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
import { cn } from '@/lib/utils';

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

export const FinanceDashboardClient = ({ defaultFrom, defaultTo }: Props) => {
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  const [data, setData] = React.useState<FinanceResponse | null>(null);

  // filtros
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

  // === Estilo dos KPIs (cores) ===
  const kpiPositive = 'border-primary/40 bg-primary/5';
  const kpiNegative = 'border-destructive/50 bg-destructive/5';

  // === Cores dos gráficos por tokens do tema ===
  const chartPrimary = 'hsl(var(--primary))';
  const chartPrimarySoft = 'hsl(var(--primary) / 0.35)';
  const chartAxisStroke = 'hsl(var(--primary) / 0.35)';
  const chartTickFill = 'hsl(var(--primary))';
  const chartGrid = 'hsl(var(--primary) / 0.15)';

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
          {/* KPIs */}
          <div className='grid gap-4 md:grid-cols-4'>
            <Card className={cn('p-4', kpiPositive)}>
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

            <Card className='p-4'>
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

            <Card className='p-4'>
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

            <Card className='p-4'>
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

            <Card className={cn('p-4', kpiPositive)}>
              <p className='text-xs text-muted-foreground'>Upsell pago</p>
              <p className='mt-2 text-xl font-semibold'>
                {formatBRL(data.kpis.upsellPaidCents)}
              </p>
              <p className='mt-2 text-xs text-muted-foreground'>
                {data.kpis.upsellPaidCount} upsells pagos
              </p>
            </Card>

            <Card className='p-4'>
              <p className='text-xs text-muted-foreground'>Upsell pendente</p>
              <p className='mt-2 text-xl font-semibold'>
                {formatBRL(data.kpis.upsellPendingCents)}
              </p>
              <p className='mt-2 text-xs text-muted-foreground'>
                Aguardando pagamento
              </p>
            </Card>

            <Card className={cn('p-4', kpiNegative)}>
              <p className='text-xs text-muted-foreground'>Reembolsado</p>
              <p className='mt-2 text-xl font-semibold'>
                {formatBRL(data.kpis.refundedCents)}
              </p>
              <p className='mt-2 text-xs text-muted-foreground'>
                {data.kpis.refundedCount} pedidos
              </p>
            </Card>

            <Card className={cn('p-4', kpiNegative)}>
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

          {/* Charts */}
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
                    <CartesianGrid stroke={chartGrid} strokeDasharray='3 3' />
                    <XAxis
                      dataKey='date'
                      tickFormatter={(v) => shortDate(String(v))}
                      stroke={chartAxisStroke}
                      tick={{ fill: chartTickFill, fontSize: 12 }}
                      axisLine={{ stroke: chartAxisStroke }}
                      tickLine={{ stroke: chartAxisStroke }}
                    />
                    <YAxis
                      tickFormatter={(v) => `${Number(v) / 100}`}
                      stroke={chartAxisStroke}
                      tick={{ fill: chartTickFill, fontSize: 12 }}
                      axisLine={{ stroke: chartAxisStroke }}
                      tickLine={{ stroke: chartAxisStroke }}
                    />
                    <Tooltip
                      formatter={(value) => formatBRL(Number(value))}
                      labelFormatter={(label) =>
                        `Dia ${shortDate(String(label))}`
                      }
                    />
                    <Line
                      type='monotone'
                      dataKey='cents'
                      stroke={chartPrimary}
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
                    <CartesianGrid stroke={chartGrid} strokeDasharray='3 3' />
                    <XAxis
                      dataKey='date'
                      tickFormatter={(v) => shortDate(String(v))}
                      stroke={chartAxisStroke}
                      tick={{ fill: chartTickFill, fontSize: 12 }}
                      axisLine={{ stroke: chartAxisStroke }}
                      tickLine={{ stroke: chartAxisStroke }}
                    />
                    <YAxis
                      allowDecimals={false}
                      stroke={chartAxisStroke}
                      tick={{ fill: chartTickFill, fontSize: 12 }}
                      axisLine={{ stroke: chartAxisStroke }}
                      tickLine={{ stroke: chartAxisStroke }}
                    />
                    <Tooltip
                      labelFormatter={(label) =>
                        `Dia ${shortDate(String(label))}`
                      }
                    />
                    <Bar dataKey='paid' name='Pagos' fill={chartPrimary} />
                    <Bar
                      dataKey='pending'
                      name='Pendentes'
                      fill={chartPrimarySoft}
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

          {/* Transactions */}
          <Card className='p-4'>
            <div className='flex items-start justify-between gap-3'>
              <div>
                <p className='text-sm font-semibold'>Transações</p>
                <p className='text-xs text-muted-foreground'>
                  Pedidos e upsells do período.
                </p>
              </div>
              <Badge variant='secondary'>
                {data.transactions.length} itens
              </Badge>
            </div>

            <Separator className='my-4' />

            <div className='grid gap-2'>
              {data.transactions.length === 0 ? (
                <p className='text-sm text-muted-foreground'>
                  Nenhuma transação encontrada.
                </p>
              ) : (
                data.transactions.map((t) => (
                  <div
                    key={`${t.kind}-${t.id}`}
                    className='flex items-center justify-between gap-3 rounded-xl border p-3'
                  >
                    <div className='min-w-0'>
                      <p className='truncate text-sm font-medium'>
                        {t.email} • {t.planName} ({t.subtitle})
                      </p>
                      <p className='text-xs text-muted-foreground'>
                        {formatDateTimeBR(t.dateISO)}
                      </p>
                    </div>

                    <div className='flex items-center gap-2'>
                      <Badge variant='outline'>{t.statusLabel}</Badge>
                      <Badge variant='secondary'>
                        {formatBRL(t.amountCents)}
                      </Badge>
                    </div>
                  </div>
                ))
              )}
            </div>
          </Card>
        </>
      )}
    </div>
  );
};

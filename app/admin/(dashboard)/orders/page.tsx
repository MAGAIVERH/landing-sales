// import { prisma } from '@/lib/prisma';

// import { Badge } from '@/components/ui/badge';
// import { Button } from '@/components/ui/button';
// import { Card } from '@/components/ui/card';
// import { Input } from '@/components/ui/input';
// import { Separator } from '@/components/ui/separator';
// import { OrdersTableClient } from './components/orders-table-client';

// export const dynamic = 'force-dynamic';

// type OrdersSearchParams = Promise<
//   Record<string, string | string[] | undefined>
// >;

// const pick = (sp: Record<string, any>, key: string) => {
//   const v = sp?.[key];
//   if (Array.isArray(v)) return v[0] ?? '';
//   return v ?? '';
// };

// const formatBRL = (cents: number) => {
//   const value = cents / 100;
//   return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
// };

// const formatDateParts = (iso?: string | null) => {
//   if (!iso) return { date: '-', time: '' };
//   const dt = new Date(iso);
//   if (Number.isNaN(dt.getTime())) return { date: '-', time: '' };

//   const date = dt.toLocaleDateString('pt-BR');
//   const time = dt.toLocaleTimeString('pt-BR');
//   return { date, time };
// };

// const statusVariant = (status: string) => {
//   const s = status.toUpperCase();
//   if (s === 'PAID') return 'default';
//   if (s === 'PENDING') return 'secondary';
//   return 'outline';
// };

// // ✅ labels prontos para a UI (vamos usar no OrdersTableClient depois)
// const statusLabelPT = (status: string) => {
//   const s = status.toUpperCase();
//   if (s === 'PAID') return 'Pago';
//   if (s === 'PENDING') return 'Pendente';
//   if (s === 'CANCELED') return 'Cancelado';
//   if (s === 'REFUNDED') return 'Reembolsado';
//   if (s === 'FAILED') return 'Falhou';
//   return status;
// };

// type HostingStatus = 'PAID' | 'PENDING' | null;

// type OrderVM = {
//   id: string;
//   customerLabel: string;
//   customerEmail: string | null;
//   leadPhone: string | null;
//   planName: string;
//   status: string;
//   statusBadgeVariant: 'default' | 'secondary' | 'outline';
//   totalLabel: string;
//   onboardingStatus: 'SUBMITTED' | 'DRAFT' | 'NOT_STARTED';
//   hostingBadge: string | null;
//   dateLabel: string;
//   timeLabel: string;
//   createdAtISO: string;

//   // ✅ novos campos (não quebram nada; serão usados no OrdersTableClient)
//   statusLabelPT: string;
//   hostingStatus: HostingStatus;
// };

// export default async function AdminOrdersPage({
//   searchParams,
// }: {
//   searchParams: OrdersSearchParams;
// }) {
//   const sp = await searchParams;

//   const q = pick(sp, 'q');
//   const status = (pick(sp, 'status') || 'ALL').toUpperCase();

//   const pageRaw = pick(sp, 'page');
//   const page = Math.max(1, Number.parseInt(pageRaw || '1', 10) || 1);

//   const TAKE = 20;
//   const skip = (page - 1) * TAKE;

//   const where = {
//     ...(status !== 'ALL' ? { status } : {}),
//     ...(q
//       ? {
//           OR: [
//             { id: { contains: q } },
//             { customerEmail: { contains: q, mode: 'insensitive' as const } },
//             {
//               stripeCheckoutSessionId: {
//                 contains: q,
//                 mode: 'insensitive' as const,
//               },
//             },
//             {
//               stripePaymentIntentId: {
//                 contains: q,
//                 mode: 'insensitive' as const,
//               },
//             },
//           ],
//         }
//       : {}),
//   };

//   const [totalCount, orders] = await Promise.all([
//     prisma.order.count({ where }),
//     prisma.order.findMany({
//       where,
//       orderBy: { createdAt: 'desc' },
//       take: TAKE,
//       skip,
//       include: {
//         price: { include: { product: true } },
//         lead: true,
//         briefing: true,
//         upsells: true,
//       },
//     }),
//   ]);

//   const rows: OrderVM[] = orders.map((order) => {
//     const planName = order.price?.product?.name ?? '—';
//     const totalLabel = formatBRL(order.amountTotal ?? 0);

//     const onboardingStatus =
//       order.briefing?.status === 'SUBMITTED'
//         ? 'SUBMITTED'
//         : order.briefing
//         ? 'DRAFT'
//         : 'NOT_STARTED';

//     const hosting = order.upsells.find((u) => u.kind === 'hosting');

//     const hostingStatus: HostingStatus =
//       hosting?.status === 'PAID'
//         ? 'PAID'
//         : hosting?.status === 'PENDING'
//         ? 'PENDING'
//         : null;

//     // mantém o comportamento atual (string) para não quebrar a tabela antes da 2ª parte
//     const hostingBadge =
//       hostingStatus === 'PAID'
//         ? 'HOSTING: PAID'
//         : hostingStatus === 'PENDING'
//         ? 'HOSTING: PENDING'
//         : null;

//     const dateISO = (order.paidAt ?? order.createdAt).toISOString();
//     const { date: dateLabel, time: timeLabel } = formatDateParts(dateISO);

//     const customerEmail = order.customerEmail ?? order.lead?.email ?? null;

//     return {
//       id: order.id,
//       customerLabel: customerEmail ?? '—',
//       customerEmail,
//       leadPhone: order.lead?.phone ?? null,
//       planName,
//       status: order.status,
//       statusBadgeVariant: statusVariant(order.status),
//       totalLabel,
//       onboardingStatus,
//       hostingBadge,
//       dateLabel,
//       timeLabel,
//       createdAtISO: order.createdAt.toISOString(),

//       statusLabelPT: statusLabelPT(order.status),
//       hostingStatus,
//     };
//   });

//   const hasPrev = page > 1;
//   const hasNext = page * TAKE < totalCount;

//   return (
//     <main className='mx-auto w-full max-w-6xl'>
//       <div className='flex flex-col gap-2'>
//         <h1 className='text-xl font-semibold'>Pedidos</h1>
//         <p className='text-sm text-muted-foreground'>
//           Triagem para entrega, onboarding e financeiro.
//         </p>
//       </div>

//       <Separator className='my-6' />

//       <Card className='p-4'>
//         <form className='grid gap-4 md:grid-cols-6' method='GET'>
//           <div className='md:col-span-3 grid gap-2'>
//             <span className='text-sm font-medium'>Buscar</span>
//             <Input
//               name='q'
//               defaultValue={q}
//               placeholder='Email, orderId, sessionId...'
//               className='h-10'
//             />
//           </div>

//           <div className='md:col-span-2 grid gap-2'>
//             <span className='text-sm font-medium'>Status</span>
//             <select
//               name='status'
//               defaultValue={status}
//               className='h-10 rounded-md border bg-background px-3 text-sm'
//             >
//               <option value='ALL'>ALL</option>
//               <option value='PAID'>PAID</option>
//               <option value='PENDING'>PENDING</option>
//               <option value='CANCELED'>CANCELED</option>
//               <option value='REFUNDED'>REFUNDED</option>
//               <option value='FAILED'>FAILED</option>
//             </select>
//           </div>

//           <div className='grid items-end gap-2 sm:grid-cols-2'>
//             <Button type='submit' className='h-10 w-full'>
//               Filtrar
//             </Button>

//             <Button
//               type='button'
//               variant='outline'
//               className='h-10 w-full'
//               asChild
//             >
//               <a href='/admin/orders'>Limpar</a>
//             </Button>
//           </div>

//           <input type='hidden' name='page' value='1' />
//         </form>
//       </Card>

//       <div className='mt-6'>
//         <Card className='overflow-hidden'>
//           <div className='px-4  flex items-center justify-between'>
//             <div className='flex flex-col'>
//               <p className='text-sm font-semibold'>Últimos pedidos</p>
//               <span className='text-xs text-muted-foreground'>
//                 Página {page}
//               </span>
//             </div>

//             <Badge variant='secondary'>{totalCount} resultados</Badge>
//           </div>

//           <Separator />

//           <OrdersTableClient
//             rows={rows}
//             q={q}
//             status={status}
//             page={page}
//             hasPrev={hasPrev}
//             hasNext={hasNext}
//             pageSize={TAKE}
//           />
//         </Card>
//       </div>
//     </main>
//   );
// }

import { prisma } from '@/lib/prisma';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { OrdersTableClient } from './components/orders-table-client';

export const dynamic = 'force-dynamic';

type OrdersSearchParams = Promise<
  Record<string, string | string[] | undefined>
>;

const pick = (sp: Record<string, any>, key: string) => {
  const v = sp?.[key];
  if (Array.isArray(v)) return v[0] ?? '';
  return v ?? '';
};

const formatBRL = (cents: number) => {
  const value = cents / 100;
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
};

const formatDateParts = (iso?: string | null) => {
  if (!iso) return { date: '-', time: '' };
  const dt = new Date(iso);
  if (Number.isNaN(dt.getTime())) return { date: '-', time: '' };

  const date = dt.toLocaleDateString('pt-BR');
  const time = dt.toLocaleTimeString('pt-BR');
  return { date, time };
};

const statusVariant = (status: string) => {
  const s = status.toUpperCase();
  if (s === 'PAID') return 'default';
  if (s === 'PENDING') return 'secondary';
  return 'outline';
};

const statusLabelPT = (status: string) => {
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

const extractOnboardingPhone = (briefing: unknown) => {
  if (!isRecord(briefing)) return null;

  // briefing.data costuma ser Json no Prisma
  const data = briefing['data'];
  return findPhoneInObject(data, 3);
};

type OrderVM = {
  id: string;
  customerLabel: string;
  customerEmail: string | null;
  leadPhone: string | null; // aqui vai o WhatsApp do onboarding
  planName: string;
  status: string; // visual
  statusBadgeVariant: 'default' | 'secondary' | 'outline';
  totalLabel: string;
  onboardingStatus: 'SUBMITTED' | 'DRAFT' | 'NOT_STARTED'; // valor técnico
  hostingBadge: string | null; // visual
  dateLabel: string;
  timeLabel: string;
  createdAtISO: string;
};

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: OrdersSearchParams;
}) {
  const sp = await searchParams;

  const q = pick(sp, 'q');
  const status = (pick(sp, 'status') || 'ALL').toUpperCase();

  const pageRaw = pick(sp, 'page');
  const page = Math.max(1, Number.parseInt(pageRaw || '1', 10) || 1);

  const TAKE = 20;
  const skip = (page - 1) * TAKE;

  const where = {
    ...(status !== 'ALL' ? { status } : {}),
    ...(q
      ? {
          OR: [
            { id: { contains: q } },
            { customerEmail: { contains: q, mode: 'insensitive' as const } },
            {
              stripeCheckoutSessionId: {
                contains: q,
                mode: 'insensitive' as const,
              },
            },
            {
              stripePaymentIntentId: {
                contains: q,
                mode: 'insensitive' as const,
              },
            },
          ],
        }
      : {}),
  };

  const [totalCount, orders] = await Promise.all([
    prisma.order.count({ where }),
    prisma.order.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: TAKE,
      skip,
      include: {
        price: { include: { product: true } },
        lead: true,
        briefing: true,
        upsells: true,
      },
    }),
  ]);

  const rows: OrderVM[] = orders.map((order) => {
    const planName = order.price?.product?.name ?? '—';
    const totalLabel = formatBRL(order.amountTotal ?? 0);

    // ✅ mantém o valor técnico para não quebrar tipagem
    const onboardingStatus: OrderVM['onboardingStatus'] =
      order.briefing?.status === 'SUBMITTED'
        ? 'SUBMITTED'
        : order.briefing
        ? 'DRAFT'
        : 'NOT_STARTED';

    const hosting = order.upsells.find((u) => u.kind === 'hosting');
    const hostingBadge =
      hosting?.status === 'PAID'
        ? 'Hospedagem: Paga'
        : hosting?.status === 'PENDING'
        ? 'Hospedagem: Pendente'
        : null;

    const dateISO = (order.paidAt ?? order.createdAt).toISOString();
    const { date: dateLabel, time: timeLabel } = formatDateParts(dateISO);

    const customerEmail = order.customerEmail ?? order.lead?.email ?? null;

    // ✅ WhatsApp vem do onboarding (briefing.data), não do lead
    const onboardingPhone = extractOnboardingPhone(order.briefing);

    return {
      id: order.id,
      customerLabel: customerEmail ?? '—',
      customerEmail,
      leadPhone: onboardingPhone,
      planName,
      status: statusLabelPT(order.status),
      statusBadgeVariant: statusVariant(order.status),
      totalLabel,
      onboardingStatus,
      hostingBadge,
      dateLabel,
      timeLabel,
      createdAtISO: order.createdAt.toISOString(),
    };
  });

  const hasPrev = page > 1;
  const hasNext = page * TAKE < totalCount;

  return (
    <main className='mx-auto w-full max-w-6xl'>
      <div className='flex flex-col gap-2'>
        <h1 className='text-xl font-semibold'>Pedidos</h1>
        <p className='text-sm text-muted-foreground'>
          Triagem para entrega, onboarding e financeiro.
        </p>
      </div>

      <Separator className='my-6' />

      <Card className='p-4'>
        <form className='grid gap-4 md:grid-cols-6' method='GET'>
          <div className='md:col-span-3 grid gap-2'>
            <span className='text-sm font-medium'>Buscar</span>
            <Input
              name='q'
              defaultValue={q}
              placeholder='Email, orderId, sessionId...'
              className='h-10'
            />
          </div>

          <div className='md:col-span-2 grid gap-2'>
            <span className='text-sm font-medium'>Status</span>
            <select
              name='status'
              defaultValue={status}
              className='h-10 rounded-md border bg-background px-3 text-sm'
            >
              <option value='ALL'>ALL</option>
              <option value='PAID'>PAID</option>
              <option value='PENDING'>PENDING</option>
              <option value='CANCELED'>CANCELED</option>
              <option value='PARTIALLY_REFUNDED'>PARTIALLY_REFUNDED</option>
              <option value='REFUNDED'>REFUNDED</option>
              <option value='FAILED'>FAILED</option>
            </select>
          </div>

          <div className='grid items-end gap-2 sm:grid-cols-2'>
            <Button type='submit' className='h-10 w-full'>
              Filtrar
            </Button>

            <Button
              type='button'
              variant='outline'
              className='h-10 w-full'
              asChild
            >
              <a href='/admin/orders'>Limpar</a>
            </Button>
          </div>

          <input type='hidden' name='page' value='1' />
        </form>
      </Card>

      <div className='mt-6'>
        <Card className='overflow-hidden'>
          <div className='px-4  flex items-center justify-between'>
            <div className='flex flex-col'>
              <p className='text-sm font-semibold'>Últimos pedidos</p>
              <span className='text-xs text-muted-foreground'>
                Página {page}
              </span>
            </div>

            <Badge variant='secondary'>{totalCount} resultados</Badge>
          </div>

          <Separator />

          <OrdersTableClient
            rows={rows}
            q={q}
            status={status}
            page={page}
            hasPrev={hasPrev}
            hasNext={hasNext}
            pageSize={TAKE}
          />
        </Card>
      </div>
    </main>
  );
}

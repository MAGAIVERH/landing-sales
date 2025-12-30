import { prisma } from '@/lib/prisma';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';

import { OrderRowActions } from './components/order-row-actions';

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

const formatDateTime = (iso?: string | null) => {
  if (!iso) return '-';
  const dt = new Date(iso);
  if (Number.isNaN(dt.getTime())) return '-';
  return dt.toLocaleString('pt-BR');
};

const statusVariant = (status: string) => {
  const s = status.toUpperCase();
  if (s === 'PAID') return 'default';
  if (s === 'PENDING') return 'secondary';
  return 'outline';
};

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: OrdersSearchParams;
}) {
  const sp = await searchParams;

  const q = pick(sp, 'q'); // busca livre (email, orderId, sessionId)
  const status = (pick(sp, 'status') || 'ALL').toUpperCase();

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

  const orders = await prisma.order.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    take: 50,
    include: {
      price: { include: { product: true } },
      lead: true,
      briefing: true,
      upsells: true,
    },
  });

  return (
    <main className='mx-auto w-full max-w-6xl px-4 py-10 md:px-10'>
      <div className='flex flex-col gap-2'>
        <h1 className='text-2xl font-semibold'>Pedidos</h1>
        <p className='text-sm text-muted-foreground'>
          Triagem para entrega, onboarding e financeiro.
        </p>
      </div>

      <Separator className='my-6' />

      <Card className='p-4'>
        <form className='grid gap-4 md:grid-cols-5' method='GET'>
          <div className='md:col-span-3 grid gap-2'>
            <span className='text-sm font-medium'>Buscar</span>
            <Input
              name='q'
              defaultValue={q}
              placeholder='Email, orderId, sessionId...'
              className='h-10'
            />
          </div>

          <div className='grid gap-2'>
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
              <option value='REFUNDED'>REFUNDED</option>
              <option value='FAILED'>FAILED</option>
            </select>
          </div>

          <div className='flex items-end'>
            <Button type='submit' className='h-10 w-full'>
              Filtrar
            </Button>
          </div>
        </form>
      </Card>

      <div className='mt-6'>
        <Card className='overflow-hidden'>
          <div className='p-4 flex items-center justify-between'>
            <p className='text-sm font-semibold'>Últimos pedidos</p>
            <Badge variant='secondary'>{orders.length} resultados</Badge>
          </div>

          <Separator />

          <div className='w-full overflow-auto'>
            <table className='w-full text-sm'>
              <thead className='bg-muted/40 text-muted-foreground'>
                <tr>
                  <th className='px-4 py-3 text-left font-medium'>Cliente</th>
                  <th className='px-4 py-3 text-left font-medium'>Plano</th>
                  <th className='px-4 py-3 text-left font-medium'>Status</th>
                  <th className='px-4 py-3 text-left font-medium'>Total</th>
                  <th className='px-4 py-3 text-left font-medium'>
                    Onboarding
                  </th>
                  <th className='px-4 py-3 text-left font-medium'>Data</th>
                  <th className='px-4 py-3 text-right font-medium'>Ações</th>
                </tr>
              </thead>

              <tbody>
                {orders.length === 0 ? (
                  <tr>
                    <td className='px-4 py-6 text-muted-foreground' colSpan={7}>
                      Nenhum pedido encontrado.
                    </td>
                  </tr>
                ) : (
                  orders.map((order) => {
                    const planName = order.price?.product?.name ?? '—';
                    const total = formatBRL(order.amountTotal ?? 0);

                    const onboardingStatus =
                      order.briefing?.status === 'SUBMITTED'
                        ? 'SUBMITTED'
                        : order.briefing
                        ? 'DRAFT'
                        : 'NOT_STARTED';

                    const hosting = order.upsells.find(
                      (u) => u.kind === 'hosting',
                    );
                    const hostingBadge =
                      hosting?.status === 'PAID'
                        ? 'HOSTING: PAID'
                        : hosting?.status === 'PENDING'
                        ? 'HOSTING: PENDING'
                        : null;

                    const dateISO = (
                      order.paidAt ?? order.createdAt
                    ).toISOString();

                    return (
                      <tr key={order.id} className='border-t'>
                        <td className='px-4 py-3'>
                          <div className='font-medium'>
                            {order.customerEmail ?? order.lead?.email ?? '—'}
                          </div>
                          <div className='text-xs text-muted-foreground'>
                            {order.id}
                          </div>
                        </td>

                        <td className='px-4 py-3'>
                          <div className='font-medium'>{planName}</div>
                          {hostingBadge ? (
                            <div className='mt-1'>
                              <Badge variant='secondary'>{hostingBadge}</Badge>
                            </div>
                          ) : null}
                        </td>

                        <td className='px-4 py-3'>
                          <Badge variant={statusVariant(order.status)}>
                            {order.status}
                          </Badge>
                        </td>

                        <td className='px-4 py-3'>
                          <span className='font-medium'>{total}</span>
                        </td>

                        <td className='px-4 py-3'>
                          <Badge variant='outline'>{onboardingStatus}</Badge>
                        </td>

                        <td className='px-4 py-3 text-muted-foreground'>
                          {formatDateTime(dateISO)}
                        </td>

                        <td className='px-4 py-3'>
                          <OrderRowActions
                            order={{
                              id: order.id,
                              customerEmail:
                                order.customerEmail ??
                                order.lead?.email ??
                                null,
                              leadPhone: order.lead?.phone ?? null,
                              status: order.status,
                              createdAtISO: order.createdAt.toISOString(),
                            }}
                          />
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </main>
  );
}

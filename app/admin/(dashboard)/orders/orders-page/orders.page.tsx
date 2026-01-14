import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';

import { OrdersTableClient } from '../components/orders-table-client';
import type { OrdersPageData } from './orders.types';

export const OrdersPage = (props: OrdersPageData) => {
  const { rows, q, status, page, hasPrev, hasNext, pageSize, totalCount } =
    props;

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
          <div className='px-4 flex items-center justify-between'>
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
            pageSize={pageSize}
          />
        </Card>
      </div>
    </main>
  );
};

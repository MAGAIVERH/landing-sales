import { Separator } from '@/components/ui/separator';

import { getDefaultRangeUTC } from './finance.utils';
import { FinanceDashboardClient } from '../components/finance-dashboard-client';

export const FinancePage = () => {
  const { defaultFrom, defaultTo } = getDefaultRangeUTC();

  return (
    <main className='mx-auto w-full max-w-6xl'>
      <div className='flex flex-col gap-2'>
        <h1 className='text-xl font-semibold'>Financeiro</h1>
        <p className='text-sm text-muted-foreground'>
          Visão executiva, filtros, gráficos e transações do período.
        </p>
      </div>

      <Separator className='my-6' />

      <FinanceDashboardClient defaultFrom={defaultFrom} defaultTo={defaultTo} />
    </main>
  );
};

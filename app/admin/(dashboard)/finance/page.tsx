// import { Separator } from '@/components/ui/separator';
// import { FinanceDashboardClient } from './components/finance-dashboard-client';

// export const dynamic = 'force-dynamic';

// const toISODate = (d: Date) => {
//   const yyyy = d.getUTCFullYear();
//   const mm = String(d.getUTCMonth() + 1).padStart(2, '0');
//   const dd = String(d.getUTCDate()).padStart(2, '0');
//   return `${yyyy}-${mm}-${dd}`;
// };

// const addDaysUTC = (d: Date, days: number) => {
//   const next = new Date(d);
//   next.setUTCDate(next.getUTCDate() + days);
//   return next;
// };

// export default function AdminFinancePage() {
//   // default: últimos 30 dias (UTC)
//   const todayUTC = new Date(
//     Date.UTC(
//       new Date().getUTCFullYear(),
//       new Date().getUTCMonth(),
//       new Date().getUTCDate(),
//     ),
//   );

//   const fromUTC = addDaysUTC(todayUTC, -29);

//   const defaultFrom = toISODate(fromUTC);
//   const defaultTo = toISODate(todayUTC);

//   return (
//     <main className='mx-auto w-full max-w-6xl'>
//       <div className='flex flex-col gap-2'>
//         <h1 className='text-xl font-semibold'>Financeiro</h1>
//         <p className='text-sm text-muted-foreground'>
//           Visão executiva, filtros, gráficos e transações do período.
//         </p>
//       </div>

//       <Separator className='my-6' />

//       <FinanceDashboardClient defaultFrom={defaultFrom} defaultTo={defaultTo} />
//     </main>
//   );
// }

import { FinancePage } from './finance-page/finance.page';

export const dynamic = 'force-dynamic';

const Page = () => {
  return <FinancePage />;
};

export default Page;

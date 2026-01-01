'use client';

import * as React from 'react';
import Link from 'next/link';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

import { OrderRowActions } from './order-row-actions';
import { OrderDetailsSheet } from './order-details-sheet';

type Row = {
  id: string;
  customerLabel: string;
  customerEmail: string | null;
  leadPhone: string | null;
  planName: string;
  status: string;
  statusBadgeVariant: 'default' | 'secondary' | 'outline';
  totalLabel: string;
  onboardingStatus: 'SUBMITTED' | 'DRAFT' | 'NOT_STARTED';
  hostingBadge: string | null;
  dateLabel: string;
  timeLabel: string;
  createdAtISO: string;
};

type Props = {
  rows: Row[];
  q: string;
  status: string;
  page: number;
  hasPrev: boolean;
  hasNext: boolean;
  pageSize: number;
};

const buildHref = (q: string, status: string, page: number) => {
  const params = new URLSearchParams();
  if (q) params.set('q', q);
  if (status && status !== 'ALL') params.set('status', status);
  params.set('page', String(page));
  return `/admin/orders?${params.toString()}`;
};

const shortId = (id: string) => {
  if (!id) return '—';
  if (id.length <= 12) return id;
  return `${id.slice(0, 12)}…`;
};

export const OrdersTableClient = ({
  rows,
  q,
  status,
  page,
  hasPrev,
  hasNext,
  pageSize,
}: Props) => {
  const INITIAL = 4;
  const STEP = 4;

  const [visible, setVisible] = React.useState(INITIAL);
  const [open, setOpen] = React.useState(false);
  const [active, setActive] = React.useState<Row | null>(null);

  const canShowLess = visible > INITIAL;

  const showLess = () => {
    // volta direto para o estado “limpo” (4 visíveis)
    setVisible(INITIAL);
  };

  React.useEffect(() => {
    setVisible(INITIAL);
    setOpen(false);
    setActive(null);
  }, [q, status, page]);

  const capped = rows.slice(0, pageSize);
  const visibleRows = capped.slice(0, Math.min(visible, capped.length));
  const canShowMore = visibleRows.length < capped.length;

  const showMore = () => {
    setVisible((v) => Math.min(v + STEP, capped.length));
  };

  const openDetails = (row: Row) => {
    setActive(row);
    setOpen(true);
  };

  return (
    <div>
      <TooltipProvider>
        <div className='w-full overflow-x-auto'>
          <table className='w-full table-fixed text-sm'>
            <colgroup>
              <col className='w-55' /> {/* Cliente */}
              <col className='w-40' /> {/* Plano */}
              <col className='w-20' /> {/* Status */}
              <col className='w-30' /> {/* Total */}
              <col className='w-35' /> {/* Onboarding */}
              <col className='w-35' /> {/* Data */}
              <col className='w-45' /> {/* Ações */}
            </colgroup>

            <thead className='text-muted-foreground'>
              <tr className='sticky top-0 z-10 bg-muted/40 backdrop-blur supports-backdrop-filter:bg-muted/30'>
                <th className='px-4 py-3 text-left font-medium'>Cliente</th>
                <th className='px-4 py-3 text-left font-medium'>Plano</th>
                <th className='px-4 py-3 text-left font-medium'>Status</th>
                <th className='px-4 py-3 text-right font-medium'>Total</th>
                <th className='px-4 py-3 text-left font-medium'>Onboarding</th>
                <th className='px-4 py-3 text-left font-medium'>Data</th>
                <th className='px-4 py-3 text-right font-medium lg:sticky lg:right-0 lg:bg-muted/40'>
                  Ações
                </th>
              </tr>
            </thead>

            <tbody>
              {rows.length === 0 ? (
                <tr>
                  <td className='px-4 py-6 text-muted-foreground' colSpan={7}>
                    Nenhum pedido encontrado.
                  </td>
                </tr>
              ) : (
                visibleRows.map((row) => (
                  <tr
                    key={row.id}
                    className='border-t transition-colors hover:bg-muted/30 cursor-pointer'
                    onClick={() => openDetails(row)}
                  >
                    <td className='px-4 py-3'>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <span className='block w-full truncate font-medium'>
                            {row.customerLabel}
                          </span>
                        </TooltipTrigger>
                        <TooltipContent className='max-w-105 break-all'>
                          {row.customerLabel}
                        </TooltipContent>
                      </Tooltip>

                      <div className='text-xs text-muted-foreground flex items-center gap-2'>
                        <span className='tabular-nums' title={row.id}>
                          {shortId(row.id)}
                        </span>
                        <span className='hidden md:inline'>•</span>
                        <span className='hidden md:inline'>ID</span>
                      </div>
                    </td>

                    <td className='px-4 py-3'>
                      <div className='font-medium whitespace-nowrap'>
                        {row.planName}
                      </div>
                      {row.hostingBadge ? (
                        <div className='mt-1'>
                          <Badge variant='secondary' className='text-xs'>
                            {row.hostingBadge}
                          </Badge>
                        </div>
                      ) : null}
                    </td>

                    <td className='px-4 py-3'>
                      <Badge variant={row.statusBadgeVariant}>
                        {row.status}
                      </Badge>
                    </td>

                    <td className='px-4 py-3 text-right tabular-nums'>
                      <span className='font-medium'>{row.totalLabel}</span>
                    </td>

                    <td className='px-4 py-3'>
                      <Badge variant='outline'>{row.onboardingStatus}</Badge>
                    </td>

                    <td className='px-4 py-3 text-muted-foreground tabular-nums whitespace-nowrap'>
                      <div>{row.dateLabel}</div>
                      <div className='text-xs'>{row.timeLabel}</div>
                    </td>

                    <td
                      className={cn(
                        'px-4 py-3',
                        'lg:sticky lg:right-0 lg:bg-background/80 lg:backdrop-blur supports-backdrop-filter:lg:bg-background/60',
                      )}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <OrderRowActions
                        order={{
                          id: row.id,
                          customerEmail: row.customerEmail,
                          leadPhone: row.leadPhone,
                          status: row.status,
                          createdAtISO: row.createdAtISO,
                        }}
                      />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </TooltipProvider>

      <div className='px-4 py-3 flex flex-col gap-3'>
        <div className='flex items-center justify-between gap-3'>
          <p className='text-xs text-muted-foreground'>
            Mostrando {visibleRows.length} de {capped.length} nesta página
          </p>

          <div className='flex items-center gap-2'>
            {canShowLess ? (
              <Button variant='outline' className='h-9' onClick={showLess}>
                Mostrar menos
              </Button>
            ) : null}

            {canShowMore ? (
              <Button variant='outline' className='h-9' onClick={showMore}>
                Mostrar mais
              </Button>
            ) : null}
          </div>
        </div>

        <Separator />

        <div className='flex items-center justify-between'>
          <p className='text-xs text-muted-foreground'>
            Máximo de {pageSize} por página
          </p>

          <div className='flex items-center gap-2'>
            {hasPrev ? (
              <Button asChild variant='outline' className='h-9'>
                <Link href={buildHref(q, status, page - 1)}>Anterior</Link>
              </Button>
            ) : (
              <Button variant='outline' className='h-9' disabled>
                Anterior
              </Button>
            )}

            {hasNext ? (
              <Button asChild variant='outline' className='h-9'>
                <Link href={buildHref(q, status, page + 1)}>Próxima</Link>
              </Button>
            ) : (
              <Button variant='outline' className='h-9' disabled>
                Próxima
              </Button>
            )}
          </div>
        </div>
      </div>

      <OrderDetailsSheet open={open} onOpenChange={setOpen} row={active} />
    </div>
  );
};

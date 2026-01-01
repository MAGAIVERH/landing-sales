'use client';

import * as React from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';

import { OrderRowActions } from './order-row-actions';

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
  open: boolean;
  onOpenChange: (open: boolean) => void;
  row: Row | null;
};

const copyText = async (text: string) => {
  await navigator.clipboard.writeText(text);
};

export const OrderDetailsSheet = ({ open, onOpenChange, row }: Props) => {
  const [copied, setCopied] = React.useState(false);

  React.useEffect(() => {
    setCopied(false);
  }, [row?.id]);

  if (!row) {
    return (
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent side='right' className='w-full sm:max-w-xl' />
      </Sheet>
    );
  }

  const quickCopy = async () => {
    const text =
      `Pedido: ${row.id}\n` +
      `Cliente: ${row.customerLabel}\n` +
      `Plano: ${row.planName}\n` +
      `Status: ${row.status}\n` +
      `Total: ${row.totalLabel}\n` +
      `Onboarding: ${row.onboardingStatus}\n` +
      `Data: ${row.dateLabel} ${row.timeLabel}`;

    await copyText(text);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1200);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side='right' className='w-full sm:max-w-xl'>
        <SheetHeader>
          <SheetTitle>Detalhes do pedido</SheetTitle>
          <SheetDescription className='wrap-break-word'>
            {row.customerLabel}
          </SheetDescription>
        </SheetHeader>

        <div className='mt-6 space-y-4'>
          <div className='flex flex-wrap items-center gap-2'>
            <Badge variant={row.statusBadgeVariant}>{row.status}</Badge>
            <Badge variant='outline'>{row.onboardingStatus}</Badge>
            {row.hostingBadge ? (
              <Badge variant='secondary'>{row.hostingBadge}</Badge>
            ) : null}
          </div>

          <div className='grid gap-3 text-sm'>
            <div className='flex items-center justify-between gap-3'>
              <span className='text-muted-foreground'>Pedido</span>
              <span className='font-medium break-all text-right'>{row.id}</span>
            </div>

            <div className='flex items-center justify-between gap-3'>
              <span className='text-muted-foreground'>Plano</span>
              <span className='font-medium text-right'>{row.planName}</span>
            </div>

            <div className='flex items-center justify-between gap-3'>
              <span className='text-muted-foreground'>Total</span>
              <span className='font-medium tabular-nums text-right'>
                {row.totalLabel}
              </span>
            </div>

            <div className='flex items-center justify-between gap-3'>
              <span className='text-muted-foreground'>Data</span>
              <span className='font-medium tabular-nums text-right'>
                {row.dateLabel} {row.timeLabel}
              </span>
            </div>
          </div>

          <Separator />

          <div className='flex items-center justify-between gap-2'>
            <Button variant='outline' className='h-9' onClick={quickCopy}>
              {copied ? 'Copiado' : 'Copiar resumo'}
            </Button>

            <OrderRowActions
              order={{
                id: row.id,
                customerEmail: row.customerEmail,
                leadPhone: row.leadPhone,
                status: row.status,
                createdAtISO: row.createdAtISO,
              }}
            />
          </div>

          <Separator />

          <div className='text-xs text-muted-foreground'>
            Dica: clique em “Onboarding” para abrir o formulário do cliente e
            use o menu para WhatsApp ou copiar detalhes.
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

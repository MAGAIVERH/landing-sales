'use client';

import * as React from 'react';

import { Button } from '@/components/ui/button';

type Props = {
  orderId: string;
  disabled: boolean;
};

export const RefundAction = ({ orderId, disabled }: Props) => {
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [okMsg, setOkMsg] = React.useState<string | null>(null);

  const onRefund = async () => {
    setError(null);
    setOkMsg(null);
    setIsLoading(true);

    try {
      const res = await fetch(
        `/api/admin/orders/${orderId}/cancel-and-refund`,
        {
          method: 'POST',
        },
      );

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setError(data?.error ?? 'Falha ao processar reembolso.');
        return;
      }

      setOkMsg(
        'Reembolso processado. Atualize a página para ver o novo status.',
      );
    } catch {
      setError('Erro de rede ao processar reembolso.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='grid gap-2'>
      <Button
        className='h-9 w-full'
        variant='destructive'
        disabled={disabled || isLoading}
        onClick={onRefund}
      >
        {isLoading ? 'Processando...' : 'Cancelar e processar reembolso'}
      </Button>

      {error ? (
        <p className='text-xs text-destructive'>{error}</p>
      ) : okMsg ? (
        <p className='text-xs text-muted-foreground'>{okMsg}</p>
      ) : null}
    </div>
  );
};

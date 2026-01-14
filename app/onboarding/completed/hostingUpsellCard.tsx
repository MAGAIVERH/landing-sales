'use client';

import { Loader2, Server } from 'lucide-react';
import * as React from 'react';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

type Props = {
  orderId: string;
};

export const HostingUpsellCard = ({ orderId }: Props) => {
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const handleBuy = async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await fetch('/api/stripe/hosting-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId }),
      });

      const data = (await res.json()) as { url?: string; error?: string };

      if (!res.ok || !data.url) {
        throw new Error(data.error ?? 'Failed to create checkout session');
      }

      window.location.href = data.url;
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Unknown error');
    } finally {
      // se redirecionar, não importa; se der erro, garante que volta ao normal
      setLoading(false);
    }
  };

  return (
    <Card className='p-6 space-y-4'>
      <div className='flex items-start gap-3'>
        <span className='mt-0.5 inline-flex h-9 w-9 items-center justify-center rounded-lg border bg-background'>
          <Server className='h-5 w-5' />
        </span>

        <div className='space-y-1'>
          <p className='font-semibold'>Hospedagem com a nossa equipe</p>
          <p className='text-sm text-muted-foreground'>
            Publicação, domínio/SSL, monitoramento e suporte — para você não se
            preocupar com infraestrutura.
          </p>
        </div>
      </div>

      {error ? <p className='text-sm text-destructive'>{error}</p> : null}

      <Button onClick={handleBuy} disabled={loading} className='h-11 w-full'>
        {loading ? (
          <span className='inline-flex items-center justify-center gap-2'>
            <Loader2 className='h-4 w-4 animate-spin' />
            Abrindo checkout…
          </span>
        ) : (
          'Contratar hospedagem'
        )}
      </Button>
    </Card>
  );
};

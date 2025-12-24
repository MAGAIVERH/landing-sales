'use client';

import * as React from 'react';
import { Check } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

import type { Plan } from './pricing.types';

const formatBRL = (unitAmountInCents: number) => {
  const value = unitAmountInCents / 100;
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

export const PricingPlanCard = ({ plan }: { plan: Plan }) => {
  const [loadingSlug, setLoadingSlug] = React.useState<string | null>(null);

  const handlePayNow = async () => {
    console.log('[PAY_NOW]', {
      slug: plan.slug,
      stripePriceId: plan.stripePriceId,
    });
    try {
      if (!plan.stripePriceId) return;

      setLoadingSlug(plan.slug);

      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          stripePriceId: plan.stripePriceId,
          slug: plan.slug,
        }),
      });

      const data = (await res.json()) as { url?: string; error?: string };

      if (!res.ok || !data.url) {
        console.error(data.error ?? 'Checkout error');
        return;
      }

      window.location.assign(data.url);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingSlug(null);
    }
  };

  const isLoading = loadingSlug === plan.slug;
  const canPay = Boolean(plan.stripePriceId);

  return (
    <Card
      className={[
        'relative overflow-hidden rounded-2xl border bg-card p-6 shadow-sm md:p-8',
        plan.highlight
          ? 'border-primary/30 ring-2 ring-primary/20'
          : 'border-border',
      ].join(' ')}
    >
      {plan.badge && (
        <span className='absolute right-6 top-6 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary'>
          {plan.badge}
        </span>
      )}

      <div className='flex items-start justify-between gap-4'>
        <div className='min-w-0'>
          <h3 className='text-xl font-semibold tracking-tight'>{plan.name}</h3>
          <p className='mt-2 text-sm text-muted-foreground'>{plan.subtitle}</p>
        </div>
      </div>

      <div className='flex items-end gap-2'>
        <div className='text-4xl font-semibold tracking-tight'>
          {formatBRL(plan.unitAmount)}
        </div>
        <span className='pb-1 text-xs text-muted-foreground'>
          {plan.priceHint}
        </span>
      </div>

      <p className='text-sm text-muted-foreground'>{plan.forWho}</p>

      <div className='mt-5 space-y-3'>
        {plan.features.map((f) => (
          <div key={f} className='flex items-start gap-3 text-sm'>
            <span className='mt-0.5 inline-flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 text-primary'>
              <Check className='h-3.5 w-3.5' />
            </span>
            <span className='text-muted-foreground'>{f}</span>
          </div>
        ))}
      </div>

      <div className='grid gap-3'>
        <Button
          type='button'
          className='w-full bg-primary text-primary-foreground hover:bg-primary/90'
          onClick={handlePayNow}
          disabled={isLoading || !canPay}
        >
          {isLoading ? 'Redirecionando…' : 'Pagar agora'}
        </Button>

        <Button type='button' variant='outline' className='w-full'>
          Falar no WhatsApp
        </Button>

        <p className='text-center text-xs text-muted-foreground'>
          Queremos mostrar exatamente como fica no seu segmento.
        </p>
      </div>
    </Card>
  );
};

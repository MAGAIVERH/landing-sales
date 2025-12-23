'use client';

import React from 'react';
import { Check } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

import type { Plan } from './pricing.types';

type PlanId = 'sage_base' | 'sage_pay' | 'sage_ai';

export const PricingPlanCard = ({ plan }: { plan: Plan }) => {
  const [loadingPlan, setLoadingPlan] = React.useState<PlanId | null>(null);

  const handlePayNow = async (planId: PlanId) => {
    try {
      setLoadingPlan(planId);

      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan: planId }),
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
      setLoadingPlan(null);
    }
  };

  const isLoading = loadingPlan === (plan.id as PlanId);

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

      <div className=' flex items-end gap-2'>
        <div className='text-4xl font-semibold tracking-tight'>
          {plan.price}
        </div>
        <span className='pb-1 text-xs text-muted-foreground'>
          {plan.priceHint}
        </span>
      </div>

      <p className=' text-sm text-muted-foreground'>{plan.forWho}</p>

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

      <div className=' grid gap-3'>
        <Button
          type='button'
          className='w-full bg-primary text-primary-foreground hover:bg-primary/90'
          onClick={() => handlePayNow(plan.id as PlanId)}
          disabled={isLoading}
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

'use client';

import { Check, ShieldCheck, Sparkles, Zap } from 'lucide-react';

import { Badge } from '@/components/ui/badge';

export const PricingHeader = () => {
  return (
    <div className='text-center text-primary-foreground'>
      <Badge className='rounded-full bg-primary-foreground/10 px-3 py-1 text-xs font-medium text-primary-foreground'>
        <span className='inline-flex items-center gap-2'>
          <Sparkles className='h-3.5 w-3.5' />
          Escolha o nível de automação
        </span>
      </Badge>

      <h2 className='mt-4 text-3xl font-semibold tracking-tight md:text-4xl'>
        Planos de plataforma para vender e agendar todos os dias
      </h2>

      <p className='mx-auto mt-3 max-w-2xl text-sm text-primary-foreground/80 md:text-base'>
        Você começa com a base (Sage), evolui para pagamento obrigatório (menos
        cancelamentos), e escala com IA (mais conversas viram agendamentos que
        viram mais dinheiro para você).
      </p>

      <div className='mx-auto mt-6 flex max-w-3xl flex-wrap items-center justify-center gap-2 text-xs text-primary-foreground/80'>
        <span className='inline-flex items-center gap-2 rounded-full border border-primary-foreground/15 bg-primary-foreground/5 px-3 py-2'>
          <ShieldCheck className='h-4 w-4' />
          Implantação guiada
        </span>
        <span className='inline-flex items-center gap-2 rounded-full border border-primary-foreground/15 bg-primary-foreground/5 px-3 py-2'>
          <Zap className='h-4 w-4' />
          Foco em conversão no mobile
        </span>
        <span className='inline-flex items-center gap-2 rounded-full border border-primary-foreground/15 bg-primary-foreground/5 px-3 py-2'>
          <Check className='h-4 w-4' />
          Sem fidelidade contratual
        </span>
      </div>
    </div>
  );
};

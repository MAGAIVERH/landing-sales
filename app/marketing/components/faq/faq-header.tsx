'use client';

import { Badge } from '@/components/ui/badge';

export const FaqHeader = () => {
  return (
    <div className='mx-auto max-w-3xl text-center'>
      <Badge className='rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary'>
        Dúvidas frequentes
      </Badge>

      <h2 className='mt-4 text-3xl font-semibold tracking-tight md:text-4xl'>
        Tire suas dúvidas antes de pedir proposta
      </h2>

      <p className='mx-auto mt-3 max-w-2xl text-sm text-muted-foreground md:text-base'>
        Respostas objetivas sobre prazo, planos, hospedagem, pagamento e suporte
        — para você avançar com segurança.
      </p>
    </div>
  );
};

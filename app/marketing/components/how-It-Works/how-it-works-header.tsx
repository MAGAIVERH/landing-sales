'use client';

import { Badge } from '@/components/ui/badge';

export const HowItWorksHeader = () => {
  return (
    <div className='text-center'>
      <Badge className='rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary'>
        Processo claro, entrega rápida
      </Badge>

      <h2 className='mt-4 text-3xl font-semibold tracking-tight md:text-4xl'>
        Como funciona, do briefing à plataforma no ar
      </h2>

      <p className='mx-auto mt-3 max-w-2xl text-sm text-muted-foreground md:text-base'>
        Você não compra “um site”. Você contrata um processo que organiza sua
        operação, melhora a experiência do cliente e aumenta conversão.
      </p>
    </div>
  );
};

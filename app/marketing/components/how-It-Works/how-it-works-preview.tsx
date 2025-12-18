'use client';

import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export const HowItWorksPreview = () => {
  return (
    <Card className='rounded-2xl border-border bg-background p-5 shadow-sm md:p-6'>
      <div className='flex items-start justify-between gap-4'>
        <div>
          <p className='text-sm font-semibold'>Exemplo de estrutura</p>
          <p className='mt-1 text-sm text-muted-foreground'>
            Uma visão rápida do que o cliente enxerga e do que você controla.
          </p>
        </div>

        <Badge className='shrink-0 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary'>
          Pronto para converter
        </Badge>
      </div>

      <div className='mt-2 grid gap-4'>
        <div className='rounded-xl border bg-card p-4'>
          <p className='text-sm font-semibold'>
            Portal do Cliente (front de aquisição + conversão)
          </p>
          <p className='mt-1 text-sm text-muted-foreground'>
            Oferta clara, prova social e CTA direto para orçamento/agendamento.
          </p>
        </div>

        <div className='grid gap-4 sm:grid-cols-2'>
          <div className='rounded-xl border bg-card p-4'>
            <p className='text-sm font-semibold'>
              Plataforma de Atendimento (agenda/fluxo/pagamentos)
            </p>
            <p className='mt-1 text-sm text-muted-foreground'>
              Horários, confirmação e regras do seu atendimento.
            </p>
          </div>

          <div className='rounded-xl border bg-card p-4'>
            <p className='text-sm font-semibold'>
              Painel Administrativo (gestão)
            </p>
            <p className='mt-1 text-sm text-muted-foreground'>
              Conteúdos, serviços, preços e configuração do funil.
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
};

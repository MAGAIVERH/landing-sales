'use client';

import { Check } from 'lucide-react';

export const PricingNote = () => {
  return (
    <div className='mx-auto mt-10 max-w-3xl rounded-2xl border border-primary-foreground/15 bg-primary-foreground/5 p-5 text-sm text-primary-foreground/80 md:p-6'>
      <p className='font-medium text-primary-foreground'>
        Observação sobre os planos
      </p>

      <ul className='mt-3 space-y-2'>
        <li className='flex items-start gap-3'>
          <span className='mt-0.5 inline-flex h-5 w-5 items-center justify-center rounded-full bg-primary-foreground/10 text-primary-foreground'>
            <Check className='h-3.5 w-3.5' />
          </span>
          <span>
            <span className='font-medium text-primary-foreground'>
              Sage Base:
            </span>{' '}
            agendamento + dashboard para acompanhar os agendamentos.
          </span>
        </li>

        <li className='flex items-start gap-3'>
          <span className='mt-0.5 inline-flex h-5 w-5 items-center justify-center rounded-full bg-primary-foreground/10 text-primary-foreground'>
            <Check className='h-3.5 w-3.5' />
          </span>
          <span>
            <span className='font-medium text-primary-foreground'>
              Sage Pay:
            </span>{' '}
            tudo do Base + pagamento integrado (Stripe). O horário só é
            confirmado com pagamento.
          </span>
        </li>

        <li className='flex items-start gap-3'>
          <span className='mt-0.5 inline-flex h-5 w-5 items-center justify-center rounded-full bg-primary-foreground/10 text-primary-foreground'>
            <Check className='h-3.5 w-3.5' />
          </span>
          <span>
            <span className='font-medium text-primary-foreground'>
              Sage AI:
            </span>{' '}
            tudo do Pay + IA de atendimento para conduzir o cliente até o
            agendamento.
          </span>
        </li>
      </ul>

      <p className='mt-4'>
        <span className='font-medium text-primary-foreground'>
          Hospedagem e domínio:
        </span>{' '}
        opcionais. Você pode usar os seus ou contratar hospedagem gerenciada com
        a gente.{' '}
        <span className='font-medium text-primary-foreground'>
          Suporte e melhorias:
        </span>{' '}
        após a entrega, você pode contratar acompanhamento mensal (opcional) ou
        solicitar ajustes sob demanda.
      </p>
    </div>
  );
};

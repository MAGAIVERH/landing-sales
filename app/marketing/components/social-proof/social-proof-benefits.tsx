'use client';

import { CalendarCheck2, Check, CreditCard, Gauge } from 'lucide-react';

import { HowItWorksDialog } from '../how-it-works-dialog';
import type { Segment } from './social-proof.types';

export const SocialProofBenefits = ({
  activeSegment,
}: {
  activeSegment?: Segment;
}) => {
  return (
    <div className='order-2 md:order-1'>
      <p className='text-sm font-semibold text-foreground md:text-base'>
        O que você ganha na prática
      </p>

      <ul className='mt-4 space-y-3 text-xs text-muted-foreground'>
        <li className='flex gap-2'>
          <span className='mt-0.5 inline-flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 text-primary'>
            <Check className='h-3.5 w-3.5' />
          </span>
          <span>Redução de fricção no atendimento e no fechamento</span>
        </li>

        <li className='flex gap-2'>
          <span className='mt-0.5 inline-flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 text-primary'>
            <Check className='h-3.5 w-3.5' />
          </span>
          <span>Agenda e confirmação automáticas com fluxo previsível</span>
        </li>

        <li className='flex gap-2'>
          <span className='mt-0.5 inline-flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 text-primary'>
            <Check className='h-3.5 w-3.5' />
          </span>
          <span>Pagamentos e operação prontos para escalar</span>
        </li>
      </ul>

      <div className='mt-6 rounded-2xl border bg-background p-4 shadow-sm'>
        <p className='text-sm font-semibold text-foreground'>
          Resultados percebidos
        </p>
        <p className='mt-1 text-xs text-muted-foreground'>
          Sem “promessas mágicas”. São ganhos típicos quando o fluxo fica
          previsível.
        </p>

        <div className='mt-4 grid gap-3 sm:grid-cols-2'>
          <div className='rounded-xl border bg-muted/40 p-3'>
            <div className='flex items-center gap-2'>
              <span className='inline-flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary'>
                <Gauge className='h-4 w-4' />
              </span>
              <p className='text-sm font-semibold'>Mais conversão</p>
            </div>
            <p className='mt-2 text-xs text-muted-foreground'>
              Menos fricção no atendimento e no fechamento.
            </p>
          </div>

          <div className='rounded-xl border bg-muted/40 p-3'>
            <div className='flex items-center gap-2'>
              <span className='inline-flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary'>
                <CalendarCheck2 className='h-4 w-4' />
              </span>
              <p className='text-sm font-semibold'>Menos faltas</p>
            </div>
            <p className='mt-2 text-xs text-muted-foreground'>
              Confirmação e lembretes com rotina organizada.
            </p>
          </div>

          <div className='rounded-xl border bg-muted/40 p-3 sm:col-span-2'>
            <div className='flex items-center gap-2'>
              <span className='inline-flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary'>
                <CreditCard className='h-4 w-4' />
              </span>
              <p className='text-sm font-semibold'>Operação previsível</p>
            </div>
            <p className='mt-2 text-xs text-muted-foreground'>
              Pagamento e processo claros para o cliente, sem retrabalho.
            </p>
          </div>
        </div>

        {activeSegment?.previewVariant === 'mobile' && (
          <div className='mt-5   rounded-xl border bg-background p-3'>
            <p className='text-sm font-semibold'>O que está incluso</p>
            <ul className='mt-3 space-y-2 text-xs text-muted-foreground'>
              <li className='flex gap-2'>
                <span className='mt-0.5 inline-flex h-4 w-4 items-center justify-center rounded-full bg-primary/10 text-primary'>
                  <Check className='h-3 w-3' />
                </span>
                <span>
                  Fluxo pronto: atendimento → agendamento → confirmação (sem
                  ruído)
                </span>
              </li>
              <li className='flex gap-2'>
                <span className='mt-0.5 inline-flex h-4 w-4 items-center justify-center rounded-full bg-primary/10 text-primary'>
                  <Check className='h-3 w-3' />
                </span>
                <span>
                  Página e checkout alinhados ao seu serviço (sem gambiarra)
                </span>
              </li>
              <li className='flex gap-2'>
                <span className='mt-0.5 inline-flex h-4 w-4 items-center justify-center rounded-full bg-primary/10 text-primary'>
                  <Check className='h-3 w-3' />
                </span>
                <span>
                  Diagnóstico do seu cenário + roteiro do fluxo completo (sem
                  enrolação)
                </span>
              </li>
              <li className='flex gap-2'>
                <span className='mt-0.5 inline-flex h-4 w-4 items-center justify-center rounded-full bg-primary/10 text-primary'>
                  <Check className='h-3 w-3' />
                </span>
                <span>
                  <span>
                    Implantação guiada + suporte até a operação ficar redonda
                  </span>
                </span>
              </li>
              <li className='flex gap-2'>
                <span className='mt-0.5 inline-flex h-4 w-4 items-center justify-center rounded-full bg-primary/10 text-primary'>
                  <Check className='h-3 w-3' />
                </span>
                <span>
                  <span>
                    Mensagens e follow-up automáticos para reduzir faltas e
                    retrabalho
                  </span>
                </span>
              </li>
              <li className='flex gap-2'>
                <span className='mt-0.5 inline-flex h-4 w-4 items-center justify-center rounded-full bg-primary/10 text-primary'>
                  <Check className='h-3 w-3' />
                </span>
                <span>
                  <span>
                    Estrutura escalável para você crescer sem refazer tudo
                    depois
                  </span>
                </span>
              </li>
            </ul>

            <div className='mt-2 inline-flex w-full items-center justify-center rounded-sm bg-primary  text-xs font-semibold text-primary-foreground hover:opacity-95'>
              <HowItWorksDialog triggerLabel='Ver demonstração' />
            </div>

            <p className='mt-2 text-center text-[11px] text-muted-foreground'>
              Sem compromisso. Foco em previsibilidade e operação.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

'use client';

import { Check, Sparkles, ShieldCheck, Zap } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Section } from './section';

type Plan = {
  name: string;
  price: string;
  priceHint: string;
  subtitle: string;
  forWho: string;
  features: string[];
  highlight?: boolean;
  badge?: string;
};

const plans: Plan[] = [
  {
    name: 'Sage Base',
    price: 'R$ 997',
    priceHint: 'implantação única',
    subtitle: 'Plataforma simples, rápida e pronta para agendar',
    forWho:
      'Ideal para começar com operação organizada e conversão no celular.',
    features: [
      'Página de agendamento focada em mobile',
      'Serviços + horários + regras de agenda',
      'Confirmação automática (fluxo de agendamento)',
      'Integração com WhatsApp (CTA estratégico)',
      'SEO básico e estrutura profissional',
    ],
  },
  {
    name: 'Sage Pay',
    price: 'R$ 1.497',
    priceHint: 'implantação única',
    subtitle:
      'Agendamento só com pagamento (menos risco, mais previsibilidade)',
    forWho: 'Perfeito para reduzir faltas: o cliente só reserva quando paga.',
    features: [
      'Tudo do Sage Base',
      'Gateway de pagamento (Stripe) integrado',
      'Pagamento obrigatório para confirmar o horário',
      'Status de pagamento + registro do pedido/serviço',
      'Base pronta para recorrência/planos (quando você quiser)',
    ],
    highlight: true,
    badge: 'Mais vendido',
  },
  {
    name: 'Sage AI',
    price: 'R$ 2.497',
    priceHint: 'implantação única',
    subtitle: 'Pay + IA para atendimento (conversa, qualifica e direciona)',
    forWho:
      'Para escalar atendimento: mais conversas viram agenda, sem virar caos.',
    features: [
      'Tudo do Sage Pay',
      'Chat de atendimento com IA (fluxo guiado)',
      'Qualificação + direcionamento para agendar',
      'Respostas rápidas para dúvidas comuns (FAQ operacional)',
      'Base pronta para evoluir automações e integrações',
    ],
  },
];

export const Pricing = () => {
  return (
    <Section id='precos' className='bg-primary py-16 md:py-20'>
      <div className='mx-auto max-w-6xl px-6'>
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
            Você começa com a base (Sage), evolui para pagamento obrigatório
            (menos cancelamentos), e escala com IA (mais conversas viram
            agendamentos que viram mais dinheiro para você).
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

        <div className='mt-12 grid gap-6 md:grid-cols-3'>
          {plans.map((p) => (
            <Card
              key={p.name}
              className={[
                'relative overflow-hidden rounded-2xl border bg-card p-6 shadow-sm md:p-8',
                p.highlight
                  ? 'border-primary/30 ring-2 ring-primary/20'
                  : 'border-border',
              ].join(' ')}
            >
              {p.badge && (
                <span className='absolute right-6 top-6 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary'>
                  {p.badge}
                </span>
              )}

              <div className='flex items-start justify-between gap-4'>
                <div className='min-w-0'>
                  <h3 className='text-xl font-semibold tracking-tight'>
                    {p.name}
                  </h3>
                  <p className='mt-2 text-sm text-muted-foreground'>
                    {p.subtitle}
                  </p>
                </div>
              </div>

              <div className='mt-6'>
                <div className='flex items-end gap-2'>
                  <div className='text-4xl font-semibold tracking-tight'>
                    {p.price}
                  </div>
                  <span className='pb-1 text-sm text-muted-foreground'>
                    {p.priceHint}
                  </span>
                </div>

                <p className='mt-3 text-sm text-muted-foreground'>{p.forWho}</p>
              </div>

              <div className='mt-6 space-y-3'>
                {p.features.map((f) => (
                  <div key={f} className='flex items-start gap-3 text-sm'>
                    <span className='mt-0.5 inline-flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 text-primary'>
                      <Check className='h-3.5 w-3.5' />
                    </span>
                    <span className='text-muted-foreground'>{f}</span>
                  </div>
                ))}
              </div>

              <div className='mt-8 grid gap-3'>
                <Button className='w-full bg-primary text-primary-foreground hover:bg-primary/90'>
                  Solicitar proposta
                </Button>

                <Button variant='outline' className='w-full'>
                  Falar no WhatsApp
                </Button>

                <p className='text-center text-xs text-muted-foreground'>
                  Queremos mostrar exatamente como fica no seu segmento.
                </p>
              </div>
            </Card>
          ))}
        </div>

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
            opcionais. Você pode usar os seus ou contratar hospedagem gerenciada
            com a gente.{' '}
            <span className='font-medium text-primary-foreground'>
              Suporte e melhorias:
            </span>{' '}
            após a entrega, você pode contratar acompanhamento mensal (opcional)
            ou solicitar ajustes sob demanda.
          </p>
        </div>
      </div>
    </Section>
  );
};

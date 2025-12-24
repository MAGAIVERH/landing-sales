import type { PlanSlug } from './pricing.types';

export type PlanMarketing = {
  slug: PlanSlug;
  name: string;
  subtitle: string;
  forWho: string;
  features: string[];
  priceHint: string;
  highlight?: boolean;
  badge?: string;
};

export const PLANS_MARKETING: PlanMarketing[] = [
  {
    slug: 'sage-base',
    name: 'Sage Base',
    subtitle: 'Plataforma simples, rápida e pronta para agendar',
    priceHint: 'implantação única',
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
    slug: 'sage-pay',
    name: 'Sage Pay',
    subtitle:
      'Agendamento só com pagamento (menos risco, mais previsibilidade)',
    priceHint: 'implantação única',
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
    slug: 'sage-ai',
    name: 'Sage AI',
    subtitle: 'Pay + IA para atendimento (conversa, qualifica e direciona)',
    priceHint: 'implantação única',
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

import type { Plan } from './pricing.types';

export const PLANS: Plan[] = [
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

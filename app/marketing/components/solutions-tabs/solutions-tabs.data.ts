import { Calendar, CreditCard, Headset, LineChart, Server } from 'lucide-react';

import type { UseCase } from './solutions-tabs.types';

export const USE_CASES: UseCase[] = [
  {
    id: 'agenda',
    icon: Calendar,
    painTitle: 'Agenda no WhatsApp e horários ociosos',
    painDesc:
      'Os pedidos chegam por mensagem, você perde tempo confirmando horário e a agenda acaba com buracos e confusão.',
    solutionTitle: 'Agendamento online com confirmação automática',
    solutionDesc:
      'O cliente escolhe o horário, confirma sozinho e você recebe tudo organizado — com menos retrabalho e mais previsibilidade.',
    bullets: [
      'Agenda em tempo real com bloqueio de horários',
      'Confirmação automática e lembretes para reduzir faltas',
      'Página de agendamento focada em conversão no celular',
    ],
    outcomes: [
      'Mais horários preenchidos',
      'Menos faltas e remarcações',
      'Rotina previsível',
    ],
  },
  {
    id: 'vendas',
    icon: LineChart,
    painTitle: 'Muitos acessos, poucas conversões',
    painDesc:
      'Você até atrai pessoas, mas o cliente não entende o próximo passo e a compra não acontece.',
    solutionTitle: 'Jornada de venda clara, do interesse ao pedido',
    solutionDesc:
      'Estruturamos oferta, prova e CTA para o cliente decidir com segurança sem fricção e sem dúvidas.',
    bullets: [
      'Oferta e diferenciais com copy e hierarquia visual',
      'CTAs estratégicos (WhatsApp, orçamento, agendamento',
      'Seções de prova: depoimentos, antes/depois, resultados',
    ],
    outcomes: [
      'Mais solicitações de orçamento',
      'Mais vendas',
      'Melhor aproveitamento do tráfego',
    ],
  },
  {
    id: 'pagamentos',
    icon: CreditCard,
    painTitle: 'Cobrança manual, atrasos e confirmações confusas',
    painDesc:
      'Você perde tempo cobrando no WhatsApp, fica esperando comprovante e o caixa vira incerteza.',
    solutionTitle: 'Pagamentos online com confirmação automática',
    solutionDesc:
      'Checkout integrado (Stripe) com status do pagamento e registro do pedido sem “me manda o comprovante”.',
    bullets: [
      'Checkout Stripe por link ou página de pagamento',
      'Confirmação automática + registro do pedido/serviço',
      'Base pronta para planos e recorrência para você',
    ],
    outcomes: [
      'Recebimento mais previsível',
      'Menos tempo em cobrança',
      'Operação mais profissional e escalável',
    ],
  },
  {
    id: 'infra',
    icon: Server,
    painTitle: 'Medo de instabilidade, queda e “dar problema no servidor”',
    painDesc:
      'Quando a infra não tem padrão, qualquer ajuste vira risco e você fica refém de urgências.',
    solutionTitle: 'Implantação com checklist e padrão de produção',
    solutionDesc:
      'Publicação com boas práticas: domínio, SSL, ambiente configurado e validação final com acompanhamento.',
    bullets: [
      'Domínio + SSL + deploy com ambiente pronto',
      'Checklist de produção e testes antes de publicar',
      'Base preparada para evoluir sem “refazer do zero”',
    ],
    outcomes: [
      'Menos risco e mais confiabilidade',
      'Mais segurança',
      'Entrega consistente',
    ],
  },
  {
    id: 'suporte',
    icon: Headset,
    painTitle: 'Falta de suporte e “sumiram depois que entregaram”',
    painDesc:
      'Quando aparece um ajuste ou dúvida, você fica sem resposta e a operação trava.',
    solutionTitle: 'Suporte de implantação com acompanhamento de verdade',
    solutionDesc:
      'A gente entra junto com você na operação: orienta, ajusta e garante que a plataforma funcione no dia a dia.',
    bullets: [
      'Acompanhamento na implantação e pós-publicação',
      'Ajustes rápidos de UX, fluxo e textos para conversão',
      'Orientação prática para operar e vender com a plataforma',
    ],
    outcomes: [
      'Mais segurança',
      'Menos dor de cabeça',
      'Mais resultado e conversões',
    ],
  },
];

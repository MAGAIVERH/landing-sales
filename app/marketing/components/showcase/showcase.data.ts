import type { ShowcaseSegment } from './showcase.types';

export const BULLETS: string[] = [
  'Sem fidelidade contratual',
  'Suporte dedicado na implantação e migração',
  'Base segura para evoluir (pagamentos, automações, IA)',
];

export const SEGMENTS: ShowcaseSegment[] = [
  {
    id: 'barbearia',
    slides: [
      { label: 'Tela inicial', src: '/barbearia.jpg' },
      { label: 'Serviços', src: '/servicos.jpg' },
      { label: 'Agenda', src: '/agendamento.jpg' },
      { label: 'Pagamento', src: '/pagamento.jpg' },
      { label: 'IA (Chat)', src: '/ai-chat.jpg' },
    ],
  },
  {
    id: 'tattoo',
    slides: [
      { label: 'Tela inicial', src: '/tatto-tela-inicial.jpg' },
      { label: 'Serviços', src: '/tatto-servicos.jpg' },
      { label: 'Agenda', src: '/tatto-agenda.jpg' },
      { label: 'Data/Hora', src: '/tatto-agendamento.jpg' },
      { label: 'Confirmação', src: '/tatto-finalizacao-agendamento.jpg' },
    ],
  },
  {
    id: 'personal',
    slides: [
      { label: 'Tela inicial', src: '/personal-tela-inicial.jpg' },
      { label: 'Apresentacao', src: '/personal-apresentacao.jpg' },
      { label: 'Serviços', src: '/personal-servicos.jpg' },
      { label: 'Agenda', src: '/personal-agendamentos.jpg' },
      { label: 'Confirmação', src: '/personal-confirmacao.jpg' },
    ],
  },
];

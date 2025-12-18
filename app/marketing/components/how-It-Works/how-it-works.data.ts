import { Rocket, Settings2, ShieldCheck } from 'lucide-react';

import type { Step } from './how-it-works.types';

export const STEPS: Step[] = [
  {
    number: '01',
    title: 'Diagnóstico do seu segmento',
    desc: 'Entendemos seu serviço, oferta e rotina para montar a estrutura certa.',
    icon: Settings2,
  },
  {
    number: '02',
    title: 'Personalização + conteúdo',
    desc: 'Ajustamos textos, serviços, regras e layout para converter melhor no mobile.',
    icon: Rocket,
  },
  {
    number: '03',
    title: 'Publicação com checklist',
    desc: 'Deploy, SSL, domínio e validação final com acompanhamento na implantação.',
    icon: ShieldCheck,
  },
];

export const BULLETS: string[] = [
  'Sem fidelidade contratual',
  'Suporte dedicado na implantação e ajustes',
  'Base pronta para evoluir (pagamentos, automações, integrações)',
];

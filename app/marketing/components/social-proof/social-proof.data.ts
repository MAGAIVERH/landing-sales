import type { ProofChip, Segment, Testimonial } from './social-proof.types';

export const PLATFORM_PREVIEW_SRC = '/dashboard.png';

export const segments: Segment[] = [
  {
    key: 'tatto',
    title: 'Tatto',
    subtitle: 'Estética',
    imageSrc: '/tatto.jpg',
    previewSrc: '/tatto.jpg',
    previewVariant: 'mobile',
  },
  {
    key: 'barbearias',
    title: 'Barbearias',
    subtitle: 'Serviços',
    imageSrc: '/barbearia.jpg',
    previewSrc: '/barbearia.jpg',
    previewVariant: 'mobile',
  },
  {
    key: 'escritorios',
    title: 'E-commerce',
    subtitle: 'Loja online',
    imageSrc: '/ecommerce.jpg',
    previewSrc: '/ecommerce.jpg',
    previewVariant: 'mobile',
  },
  {
    key: 'personal',
    title: 'Personal',
    subtitle: 'Fitness',
    imageSrc: '/personal.jpg',
    previewSrc: '/personal.jpg',
    previewVariant: 'mobile',
  },
  {
    key: 'restaurantes',
    title: 'Restaurantes',
    subtitle: 'Food',
    imageSrc: '/restaurantes.jpg',
    previewSrc: '/restaurantes.jpg',
    previewVariant: 'mobile',
  },
  {
    key: 'medico',
    title: 'Médicos',
    subtitle: 'Saúde',
    imageSrc: '/medicos.png',
    previewSrc: '/medicos.png',
    previewVariant: 'mobile',
  },
];

export const proofChips: ProofChip[] = [
  { label: 'Implantação guiada' },
  { label: 'Suporte na entrada em operação' },
  { label: 'Estrutura escalável' },
];

export const testimonials: Testimonial[] = [
  {
    quote:
      'Em poucos dias, saímos do WhatsApp bagunçado para uma rotina com agenda organizada e confirmação automática.',
    name: 'Carla Magalhães',
    role: 'Gerencia / Clínica',
    imageSrc: '/carlamagalhaes.jpg',
    initials: 'CM',
  },
  {
    quote:
      'O cliente entende o serviço e já chega pronto para fechar. A plataforma deixou o processo de venda muito mais direto.',
    name: 'Rodrigo Zulian',
    role: 'Gestão / Barbearia',
    imageSrc: '/rodrigozulian.jpg',
    initials: 'RZ',
  },
  {
    quote:
      "Cobrança e confirmação ficaram automáticas. Parou aquela história de 'me manda o comprovante' e o fluxo ficou previsível.",
    name: 'Tiago Pierre',
    role: 'Administração / Serviços',
    imageSrc: '/tiagopierre.jpg',
    initials: 'TP',
  },
];

'use client';

import Image from 'next/image';
import { useMemo, useState } from 'react';
import { CalendarCheck2, Check, CreditCard, Gauge } from 'lucide-react';
import { Section } from './section';

type Segment = {
  key: string;
  title: string;
  subtitle: string;
  imageSrc: string;
  previewSrc?: string;
  previewVariant?: 'desktop' | 'mobile';
};

type ProofChip = {
  label: string;
};

type Testimonial = {
  quote: string;
  name: string;
  role: string;
  imageSrc: string;
  initials: string;
};

const PLATFORM_PREVIEW_SRC = '/dashboard.png';

const segments: Segment[] = [
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

const proofChips: ProofChip[] = [
  { label: 'Implantação guiada' },
  { label: 'Suporte na entrada em operação' },
  { label: 'Estrutura escalável' },
];

const testimonials: Testimonial[] = [
  {
    quote:
      'Em poucos dias, saímos do WhatsApp bagunçado para uma rotina com agenda organizada e confirmação automática.',
    name: 'Carla Magalhães',
    role: 'Operação / Clínica',
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
    role: 'Operação / Serviços',
    imageSrc: '/tiagopierre.jpg',
    initials: 'TP',
  },
];

const Avatar = ({
  src,
  alt,
  initials,
}: {
  src: string;
  alt: string;
  initials: string;
}) => {
  return (
    <div className='relative h-10 w-10 overflow-hidden rounded-full ring-1 ring-border'>
      <div className='absolute inset-0 flex items-center justify-center bg-muted text-xs font-semibold text-foreground'>
        {initials}
      </div>

      <Image
        src={src}
        alt={alt}
        fill
        sizes='40px'
        className='relative object-cover'
      />
    </div>
  );
};

export const SocialProof = () => {
  const [activeKey, setActiveKey] = useState<string>(
    segments[0]?.key ?? 'clinicas',
  );

  const activeSegment = useMemo(
    () => segments.find((s) => s.key === activeKey) ?? segments[0],
    [activeKey],
  );

  return (
    <Section
      id='social-proof'
      className='relative overflow-hidden bg-primary text-primary-foreground pt-14 pb-28 md:py-20 '
    >
      {/* decoração */}
      <div className='pointer-events-none absolute inset-0'>
        <div className='absolute -top-40 left-1/2 h-130 w-130 -translate-x-1/2 rounded-full bg-background/10 blur-3xl' />
        <div className='absolute -bottom-48 -left-40 h-130 w-130 rounded-full bg-background/10 blur-3xl' />
      </div>

      {/* header */}
      <div className='relative mx-auto flex max-w-4xl flex-col items-center text-center'>
        <span className='rounded-full bg-background/15 px-4 py-1 text-xs font-medium ring-1 ring-background/20'>
          Confiança construída na prática
        </span>

        <h2 className='mt-5 text-balance text-3xl font-semibold tracking-tight md:text-5xl'>
          Profissionais e operações de serviços escolhem uma plataforma que
          entrega previsibilidade
        </h2>

        <p className='mt-3 max-w-3xl text-balance text-sm text-primary-foreground/80 md:text-base'>
          Não é “um site”. É um processo completo: estrutura, conversão,
          agendamento, pagamentos e acompanhamento na implantação.
        </p>
      </div>

      {/* bloco principal */}
      <div className='relative mt-10 rounded-3xl bg-background/95 p-6 text-foreground shadow-sm ring-1 ring-background/20 md:p-8'>
        <div className='grid gap-8 md:grid-cols-[0.85fr_1.15fr] md:items-start'>
          {/* coluna esquerda */}
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
                <span>
                  Agenda e confirmação automáticas com fluxo previsível
                </span>
              </li>

              <li className='flex gap-2'>
                <span className='mt-0.5 inline-flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 text-primary'>
                  <Check className='h-3.5 w-3.5' />
                </span>
                <span>Pagamentos e operação prontos para escalar</span>
              </li>
            </ul>

            {/* bloco para preencher o espaço lateral esquerdo */}
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

              {/* CTA contextual — aparece só quando a prévia é MOBILE (preenche o espaço) */}
              {activeSegment?.previewVariant === 'mobile' && (
                <div className='mt-5 hidden md:block rounded-xl border bg-background p-3'>
                  <p className='text-sm font-semibold'>O que está incluso</p>
                  <ul className='mt-3 space-y-2 text-xs text-muted-foreground'>
                    <li className='flex gap-2'>
                      <span className='mt-0.5 inline-flex h-4 w-4 items-center justify-center rounded-full bg-primary/10 text-primary'>
                        <Check className='h-3 w-3' />
                      </span>
                      <span>
                        Fluxo pronto: atendimento → agendamento → confirmação
                        (sem ruído)
                      </span>
                    </li>
                    <li className='flex gap-2'>
                      <span className='mt-0.5 inline-flex h-4 w-4 items-center justify-center rounded-full bg-primary/10 text-primary'>
                        <Check className='h-3 w-3' />
                      </span>
                      <span>
                        Página e checkout alinhados ao seu serviço (sem
                        gambiarra)
                      </span>
                    </li>
                    <li className='flex gap-2'>
                      <span className='mt-0.5 inline-flex h-4 w-4 items-center justify-center rounded-full bg-primary/10 text-primary'>
                        <Check className='h-3 w-3' />
                      </span>
                      <span>
                        Diagnóstico do seu cenário + roteiro do fluxo completo
                        (sem enrolação)
                      </span>
                    </li>
                    <li className='flex gap-2'>
                      <span className='mt-0.5 inline-flex h-4 w-4 items-center justify-center rounded-full bg-primary/10 text-primary'>
                        <Check className='h-3 w-3' />
                      </span>
                      <span>
                        <span>
                          Implantação guiada + suporte até a operação ficar
                          redonda
                        </span>
                      </span>
                    </li>
                    <li className='flex gap-2'>
                      <span className='mt-0.5 inline-flex h-4 w-4 items-center justify-center rounded-full bg-primary/10 text-primary'>
                        <Check className='h-3 w-3' />
                      </span>
                      <span>
                        <span>
                          Mensagens e follow-up automáticos para reduzir faltas
                          e retrabalho
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

                  <a
                    href='#cta'
                    className='mt-4 inline-flex w-full items-center justify-center rounded-xl bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground hover:opacity-95'
                  >
                    Ver demonstração
                  </a>

                  <p className='mt-2 text-center text-[11px] text-muted-foreground'>
                    Sem compromisso. Foco em previsibilidade e operação.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* coluna direita: cards maiores + preview ao clicar */}
          <div className='order-1 md:order-2 overflow-hidden'>
            {/* MOBILE: botões em scroll horizontal (somente mobile) */}
            <div className='md:hidden'>
              <div className='flex w-full gap-3 overflow-x-auto pb-2 pr-2 [-webkit-overflow-scrolling:touch] [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden'>
                {segments.map((s) => {
                  const isActive = s.key === activeKey;

                  return (
                    <button
                      key={s.key}
                      type='button'
                      onClick={() => setActiveKey(s.key)}
                      className={[
                        'shrink-0 w-65',
                        'group text-left rounded-2xl border bg-background p-4',
                        isActive ? 'ring-2 ring-primary/30' : '',
                      ].join(' ')}
                    >
                      <div className='flex items-center gap-4'>
                        <div className='relative h-12 w-12 overflow-hidden rounded-xl bg-muted ring-1 ring-border'>
                          <Image
                            src={s.imageSrc}
                            alt={s.title}
                            fill
                            sizes='48px'
                            className='object-cover'
                          />
                        </div>

                        <div className='min-w-0'>
                          <p className='truncate text-sm font-semibold'>
                            {s.title}
                          </p>
                          <p className='truncate text-xs text-muted-foreground'>
                            {s.subtitle}
                          </p>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* DESKTOP: grid normal (somente desktop) */}
            <div className='hidden md:grid md:grid-cols-3 md:gap-4 '>
              {segments.map((s) => {
                const isActive = s.key === activeKey;

                return (
                  <button
                    key={s.key}
                    type='button'
                    onClick={() => setActiveKey(s.key)}
                    className={[
                      'group w-full text-left rounded-2xl border bg-background p-5',
                      'transition hover:-translate-y-0.5 hover:shadow-sm',
                      isActive ? 'ring-2 ring-primary/30' : '',
                    ].join(' ')}
                  >
                    <div className='flex items-center gap-4'>
                      <div className='relative h-12 w-12 overflow-hidden rounded-xl bg-muted ring-1 ring-border'>
                        <Image
                          src={s.imageSrc}
                          alt={s.title}
                          fill
                          sizes='48px'
                          className='object-cover'
                        />
                      </div>

                      <div className='min-w-0'>
                        <p className='truncate text-sm font-semibold'>
                          {s.title}
                        </p>
                        <p className='truncate text-xs text-muted-foreground'>
                          {s.subtitle}
                        </p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* preview grande ao clicar */}
            <div className='mt-6 rounded-3xl border bg-background p-4 shadow-sm md:p-5'>
              <div className='flex items-center justify-between gap-3'>
                <div className='min-w-0'>
                  <p className='truncate text-sm font-semibold'>
                    Prévia da plataforma — {activeSegment?.title}
                  </p>
                  <p className='truncate text-xs text-muted-foreground'>
                    Exemplo visual do produto. Depois você troca por imagens
                    específicas de cada segmento.
                  </p>
                </div>

                <span className='rounded-full bg-muted px-3 py-1 text-xs font-medium'>
                  Clique nos segmentos
                </span>
              </div>

              <div className='mt-4 overflow-hidden rounded-2xl ring-1 ring-border'>
                {/* DESKTOP (wide) */}
                {activeSegment?.previewVariant !== 'mobile' ? (
                  <div className='relative h-65 w-full md:h-105 lg:h-97'>
                    <Image
                      src={activeSegment?.previewSrc ?? PLATFORM_PREVIEW_SRC}
                      alt={`Plataforma — ${activeSegment?.title}`}
                      fill
                      sizes='(min-width: 768px) 700px, 100vw'
                      className='object-cover'
                      priority={false}
                    />
                  </div>
                ) : (
                  /* MOBILE (phone mock) */
                  <div className='flex w-full items-center justify-center p-4 md:p-6 '>
                    <div className='w-full max-w-[320px] md:w-65 md:max-w-full h-115'>
                      <div className='relative mx-auto aspect-[9/19.5] h-full rounded-[2.2rem] border bg-muted/30 p-2 shadow-sm'>
                        <div className='relative h-full w-full overflow-hidden rounded-[1.7rem] bg-black '>
                          <Image
                            src={
                              activeSegment?.previewSrc ?? PLATFORM_PREVIEW_SRC
                            }
                            alt={`Plataforma — ${activeSegment?.title}`}
                            fill
                            sizes='260px'
                            className='object-cover'
                            priority={false}
                          />
                        </div>

                        {/* “notch” simples (opcional, ajuda muito no visual) */}
                        <div className='absolute left-1/2 top-2 h-4 w-20 -translate-x-1/2 rounded-full bg-black/70' />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* depoimentos */}
      <div className='relative mt-10 grid gap-6 md:grid-cols-3'>
        {testimonials.map((t) => (
          <div
            key={t.name}
            className='rounded-3xl bg-background text-foreground shadow-sm ring-1 ring-background/20'
          >
            <div className='p-6'>
              <p className='text-sm leading-relaxed text-muted-foreground'>
                “{t.quote}”
              </p>

              <div className='mt-6 flex items-center gap-3'>
                <Avatar src={t.imageSrc} alt={t.name} initials={t.initials} />

                <div className='leading-tight'>
                  <p className='text-sm font-semibold'>{t.name}</p>
                  <p className='text-xs text-muted-foreground'>{t.role}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
};

import Image from 'next/image';
import Link from 'next/link';
import { Check, ArrowRight } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Section } from './section';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const bullets = [
  'Sem fidelidade contratual',
  'Suporte dedicado na implantação e migração',
  'Base segura para evoluir (pagamentos, automações, IA)',
];

export const Showcase = () => {
  return (
    <Section className='py-16 md:py-20'>
      <div className='mx-auto max-w-6xl px-6'>
        <div className='grid gap-10 md:grid-cols-2 md:items-center'>
          {/* Copy */}
          <div>
            <Badge className='rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary'>
              Veja por dentro
            </Badge>

            <h2 className='mt-4 text-3xl font-semibold tracking-tight md:text-4xl'>
              Veja como uma plataforma profissional funciona na prática
            </h2>

            <p className='mt-4 text-muted-foreground'>
              Para cada segmento, usamos uma narrativa clara: serviço → prova →
              CTA. O cliente entende rápido e toma decisão com menos dúvida.
            </p>

            <div className='mt-6 space-y-3'>
              {bullets.map((b) => (
                <div key={b} className='flex items-start gap-3 text-sm'>
                  <span className='mt-0.5 inline-flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-primary'>
                    <Check className='h-4 w-4' />
                  </span>
                  <span className='text-muted-foreground'>{b}</span>
                </div>
              ))}
            </div>

            <div className='mt-8 flex flex-col gap-3 sm:flex-row sm:items-center'>
              <Button
                asChild
                className='bg-primary text-primary-foreground hover:bg-primary/90'
              >
                <Link href='#precos'>
                  Ver planos
                  <ArrowRight className='ml-2 h-4 w-4' />
                </Link>
              </Button>

              <Button asChild variant='outline'>
                <Link href='#solucoes'>Ver soluções</Link>
              </Button>
            </div>
          </div>

          {/* Preview */}
          <div className='relative'>
            <div className='absolute -inset-6 -z-10 rounded-3xl bg-primary/15 blur-2xl' />

            <Card className='overflow-hidden rounded-3xl border bg-background p-2 shadow-sm md:p-6'>
              <div className='flex items-center justify-between gap-3'>
                <div className='min-w-0'>
                  <p className='text-sm font-semibold'>
                    Preview da experiência
                  </p>
                  <p className='mt-1 text-sm text-muted-foreground'>
                    Prints reais (mobile). Arraste para o lado para ver as
                    telas.
                  </p>
                </div>

                <Badge className='shrink-0 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary'>
                  Mobile-first
                </Badge>
              </div>

              <Tabs defaultValue='barbearia' className=' w-full'>
                <TabsList className='w-full justify-start overflow-x-auto'>
                  <TabsTrigger value='barbearia'>Barbearia</TabsTrigger>
                  <TabsTrigger value='tattoo'>Tattoo</TabsTrigger>
                  <TabsTrigger value='personal'>Personal</TabsTrigger>
                </TabsList>

                {(
                  [
                    {
                      id: 'barbearia',
                      slides: [
                        {
                          label: 'Tela inicial',
                          src: '/barbearia.jpg',
                        },
                        {
                          label: 'Serviços',
                          src: '/servicos.jpg',
                        },
                        {
                          label: 'Agenda',
                          src: '/agendamento.jpg',
                        },
                        {
                          label: 'Pagamento',
                          src: '/pagamento.jpg',
                        },
                        {
                          label: 'IA (Chat)',
                          src: '/ai-chat.jpg',
                        },
                      ],
                    },
                    {
                      id: 'tattoo',
                      slides: [
                        {
                          label: 'Tela inicial',
                          src: '/tatto-tela-inicial.jpg',
                        },
                        {
                          label: 'Serviços',
                          src: '/tatto-servicos.jpg',
                        },
                        {
                          label: 'Agenda',
                          src: '/tatto-agenda.jpg',
                        },
                        {
                          label: 'Data/Hora',
                          src: '/tatto-agendamento.jpg',
                        },
                        {
                          label: 'Confirmação',
                          src: '/tatto-finalizacao-agendamento.jpg',
                        },
                      ],
                    },
                    {
                      id: 'personal',
                      slides: [
                        {
                          label: 'Tela inicial',
                          src: '/personal-tela-inicial.jpg',
                        },
                        {
                          label: 'Apresentacao',
                          src: '/personal-apresentacao.jpg',
                        },
                        {
                          label: 'Serviços',
                          src: '/personal-servicos.jpg',
                        },
                        {
                          label: 'Agenda',
                          src: '/personal-agendamentos.jpg',
                        },
                        {
                          label: 'Confirmação',
                          src: '/personal-confirmacao.jpg',
                        },
                      ],
                    },
                  ] as const
                ).map((seg) => (
                  <TabsContent key={seg.id} value={seg.id}>
                    {/* Wrapper para manter “cara de celular” e não estourar o layout */}
                    <div className='mx-auto w-full max-w-64'>
                      <div className='relative overflow-hidden rounded-3xl '>
                        {/* carrossel 1 por vez */}
                        <div className='flex snap-x snap-mandatory overflow-x-auto scroll-smooth [-webkit-overflow-scrolling:touch] [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden'>
                          {seg.slides.map((item, idx) => (
                            <div
                              key={item.src}
                              className='relative w-full shrink-0 snap-center p-4'
                            >
                              {/* ✅ Mock de celular (igual ao SocialProof) */}
                              <div className='mx-auto w-full max-w-140'>
                                <div className='relative rounded-[2.5rem] border bg-background p-3 shadow-sm'>
                                  {/* “bezel” */}
                                  <div className='absolute left-1/2 top-2 h-5 w-24 -translate-x-1/2 rounded-full bg-muted' />

                                  {/* label */}
                                  <div className='absolute left-6 top-6 z-10'>
                                    <span className='rounded-full bg-primary px-2.5 py-1 text-[11px] font-medium text-primary-foreground'>
                                      {item.label}
                                    </span>
                                  </div>

                                  {/* tela do celular */}
                                  <div className='relative overflow-hidden rounded-4xl bg-black'>
                                    {/* Aqui é o ponto que padroniza: a “tela” é estreita e alta */}
                                    <div className='relative aspect-9/20 w-full'>
                                      <Image
                                        src={item.src}
                                        alt={item.label}
                                        fill
                                        sizes='(min-width: 768px) 420px, 100vw'
                                        className='object-cover'
                                        priority={idx === 0}
                                      />
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <p className='mt-2 text-center text-xs text-muted-foreground'>
                        Arraste para o lado para ver as próximas telas.
                      </p>
                    </div>
                  </TabsContent>
                ))}
              </Tabs>
            </Card>
          </div>
        </div>
      </div>
    </Section>
  );
};

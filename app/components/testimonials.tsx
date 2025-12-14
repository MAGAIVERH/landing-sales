'use client';

import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Section } from './section';

import { useState } from 'react';

const items = [
  {
    name: 'Marcia Orback',
    role: 'Fisioterapeuta',
    text: 'Agora eu consigo organizar agenda e atendimento pelo celular. Ficou simples, rápido e profissional.',
    avatar: '/images/professional-1.jpg',
  },
  {
    name: 'Rafael Almeida',
    role: 'Barbearia',
    text: 'A landing ficou com cara de empresa grande. Comecei a receber mais contatos no WhatsApp logo na primeira semana.',
    avatar: '/images/professional-2.jpg',
  },
  {
    name: 'Camila Souza',
    role: 'Personal Trainer',
    text: 'O fluxo de venda ficou redondo. O cliente entende o serviço e já chega pronto para fechar.',
    avatar: '/images/professional-3.jpg',
  },
];

export const Testimonials = () => {
  const [index, setIndex] = useState(0);
  const current = items[index];

  const handlePrev = () =>
    setIndex((prev) => (prev === 0 ? items.length - 1 : prev - 1));
  const handleNext = () =>
    setIndex((prev) => (prev === items.length - 1 ? 0 : prev + 1));

  return (
    <Section className='bg-primary text-primary-foreground'>
      <div className='grid gap-10 md:grid-cols-2 md:items-center'>
        <div>
          <h2 className='text-3xl font-semibold tracking-tight'>
            Profissionais de diversas áreas já usam e compartilham resultados
          </h2>
          <p className='mt-4 text-primary-foreground/80'>
            Depoimentos reais aumentam confiança e melhoram conversão. Aqui é
            onde o cliente decide.
          </p>

          <Button className='mt-8 bg-background text-foreground hover:bg-background/90'>
            Quero esses resultados
          </Button>
        </div>

        <div className='rounded-2xl bg-background p-8 text-foreground shadow-sm'>
          <div className='flex items-start gap-5'>
            <div className='relative h-20 w-20 overflow-hidden rounded-2xl'>
              <Image
                src={current.avatar}
                alt={current.name}
                fill
                className='object-cover'
              />
            </div>

            <div className='flex-1'>
              <p className='text-sm text-muted-foreground'>{current.role}</p>
              <p className='mt-1 text-lg font-semibold'>{current.name}</p>
              <p className='mt-4 text-sm text-muted-foreground'>
                {current.text}
              </p>

              <div className='mt-6 flex items-center gap-2'>
                <Button variant='outline' size='icon' onClick={handlePrev}>
                  <ChevronLeft className='h-4 w-4' />
                </Button>
                <Button variant='outline' size='icon' onClick={handleNext}>
                  <ChevronRight className='h-4 w-4' />
                </Button>

                <div className='ml-auto flex items-center gap-1'>
                  {items.map((_, i) => (
                    <span
                      key={String(i)}
                      className={[
                        'h-1.5 w-1.5 rounded-full',
                        i === index ? 'bg-primary' : 'bg-muted',
                      ].join(' ')}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
};

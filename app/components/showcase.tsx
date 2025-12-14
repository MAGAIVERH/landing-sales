import Image from 'next/image';
import { Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Section } from './section';

const bullets = [
  'Sem fidelidade contratual',
  'Suporte dedicado na implantação e migração',
  'Base segura para evoluir (pagamentos, automações, IA)',
];

export const Showcase = () => {
  return (
    <Section>
      <div className='grid gap-10 md:grid-cols-2 md:items-center'>
        <div>
          <h2 className='text-3xl font-semibold tracking-tight'>
            Veja como uma plataforma profissional funciona na prática
          </h2>
          <p className='mt-4 text-muted-foreground'>
            Para cada segmento, usamos imagens reais e uma narrativa clara:
            serviço → prova → CTA.
          </p>

          <div className='mt-6 space-y-3'>
            {bullets.map((b) => (
              <div key={b} className='flex items-start gap-2 text-sm'>
                <span className='mt-0.5 inline-flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 text-primary'>
                  <Check className='h-3.5 w-3.5' />
                </span>
                <span className='text-muted-foreground'>{b}</span>
              </div>
            ))}
          </div>

          <Button className='mt-8 bg-primary text-primary-foreground hover:bg-primary/90'>
            Quero ver como funciona na prática
          </Button>
        </div>

        <div className='relative'>
          <div className='absolute -inset-6 -z-10 rounded-3xl bg-primary/10 blur-2xl' />

          <div className='grid gap-4 rounded-2xl border bg-background p-6 shadow-sm'>
            <div className='relative aspect-16/10 overflow-hidden rounded-xl border'>
              <Image
                src='/images/professional-4.jpg'
                alt='Profissional usando o sistema'
                fill
                className='object-cover'
              />
            </div>

            <div className='grid grid-cols-2 gap-4'>
              <div className='relative aspect-4/3 overflow-hidden rounded-xl border'>
                <Image
                  src='/images/professional-5.jpg'
                  alt='Atendimento'
                  fill
                  className='object-cover'
                />
              </div>
              <div className='relative aspect-4/3 overflow-hidden rounded-xl border'>
                <Image
                  src='/images/professional-6.jpg'
                  alt='Negócio'
                  fill
                  className='object-cover'
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
};

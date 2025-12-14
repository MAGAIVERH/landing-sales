import { Button } from '@/components/ui/button';
import { Section } from './section';

export const CtaBand = () => {
  return (
    <Section className='bg-primary py-16'>
      <div className='mx-auto max-w-6xl px-6 text-center text-primary-foreground'>
        <h2 className='text-3xl font-semibold tracking-tight md:text-4xl'>
          Chega de perder tempo com sistemas complicados
        </h2>
        <p className='mx-auto mt-4 max-w-2xl text-primary-foreground/80'>
          Comece com um plano acessível e evolua para implantação, pagamentos e
          automações.
        </p>

        <Button className='mt-8 bg-background text-foreground hover:bg-background/90'>
          Quero uma demonstração gratuita
        </Button>
      </div>
    </Section>
  );
};

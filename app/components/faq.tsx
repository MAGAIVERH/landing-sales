'use client';

import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '@/components/ui/accordion';

import { Section } from './section';

export const FAQ = () => {
  return (
    <Section id='faq' className='bg-muted/40'>
      <div className='mx-auto max-w-3xl'>
        <h2 className='text-center text-3xl font-semibold tracking-tight'>
          Tire suas dúvidas
        </h2>

        <div className='mt-10 rounded-2xl border bg-background p-3 md:p-6'>
          <Accordion type='single' collapsible className='w-full'>
            <AccordionItem value='i1'>
              <AccordionTrigger>Em quanto tempo fica pronto?</AccordionTrigger>
              <AccordionContent>
                Em média 3 a 7 dias, dependendo do segmento e personalizações.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value='i2'>
              <AccordionTrigger>Vocês fazem implantação?</AccordionTrigger>
              <AccordionContent>
                Sim. Inclui servidor, SSL e checklist de produção (conforme o
                plano).
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value='i3'>
              <AccordionTrigger>
                Posso adicionar pagamento depois?
              </AccordionTrigger>
              <AccordionContent>
                Sim. Você pode iniciar com Start/Pro e evoluir para Stripe
                quando fizer sentido.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value='i4'>
              <AccordionTrigger>Tem suporte?</AccordionTrigger>
              <AccordionContent>
                Sim. Suporte na implantação e orientação para operar a
                plataforma.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>
    </Section>
  );
};

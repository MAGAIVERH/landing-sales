'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Section } from './section';

const pains = [
  {
    key: 'p1',
    left: 'Clientes faltando / baixo volume de agendamentos?',
    right:
      'Captação de leads + confirmação via WhatsApp + funil simples para transformar visita em contato.',
  },
  {
    key: 'p2',
    left: 'Processo manual e confuso para atender e vender?',
    right:
      'Plataforma organizada por etapas (serviços, horários, checkout, confirmações) e páginas com foco em conversão.',
  },
  {
    key: 'p3',
    left: 'Medo de implantar e dar problema no servidor?',
    right:
      'Implantação assistida + SSL + domínio e checklist de produção para colocar no ar com segurança.',
  },
  {
    key: 'p4',
    left: 'Quer cobrar online e automatizar pagamentos?',
    right:
      'Integração Stripe (Checkout) e base para evoluir com automações e notificações.',
  },
];

export const SolutionsTabs = () => {
  return (
    <Section id='solucoes' className='bg-muted/40'>
      <div className='text-center'>
        <h2 className='text-3xl font-semibold tracking-tight'>
          Plataforma que resolve problemas reais da rotina
        </h2>
        <p className='mx-auto mt-4 max-w-2xl text-muted-foreground'>
          A estrutura muda por segmento, mas a lógica é a mesma: reduzir fricção
          e aumentar conversão.
        </p>
      </div>

      <div className='mt-12 rounded-2xl border bg-background p-4 md:p-6'>
        <Tabs defaultValue='dor' className='w-full'>
          <TabsList className='grid w-full grid-cols-2'>
            <TabsTrigger value='dor'>Você enfrenta isso?</TabsTrigger>
            <TabsTrigger value='solucao'>Nós resolvemos assim</TabsTrigger>
          </TabsList>

          <TabsContent value='dor' className='mt-6'>
            <div className='grid gap-4'>
              {pains.map((p) => (
                <div
                  key={p.key}
                  className='rounded-xl border bg-background p-6 text-sm font-medium'
                >
                  {p.left}
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value='solucao' className='mt-6'>
            <div className='grid gap-4'>
              {pains.map((p) => (
                <div
                  key={p.key}
                  className='rounded-xl border bg-background p-6 text-sm text-muted-foreground'
                >
                  {p.right}
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Section>
  );
};

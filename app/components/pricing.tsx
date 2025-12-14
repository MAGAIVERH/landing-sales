import { Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Section } from './section';

const plans = [
  {
    name: 'Start',
    price: 'R$ 499',
    subtitle: 'Para começar com presença profissional',
    features: ['Landing profissional', 'Serviços', 'WhatsApp', 'SEO básico'],
    highlight: false,
  },
  {
    name: 'Pro',
    price: 'R$ 699',
    subtitle: 'Para vender mais com implantação e leads',
    features: [
      'Tudo do Start',
      'Implantação no servidor',
      'SSL',
      'Captação de leads',
    ],
    highlight: true,
    badge: 'Mais vendido',
  },
  {
    name: 'Premium',
    price: 'R$ 999',
    subtitle: 'Para cobrar online e automatizar pagamentos',
    features: [
      'Tudo do Pro',
      'Stripe Checkout',
      'Compra online',
      'E-mails básicos',
    ],
    highlight: false,
  },
];

export const Pricing = () => {
  return (
    <Section id='precos' className='bg-muted/40'>
      <div className='text-center'>
        <h2 className='text-3xl font-semibold tracking-tight'>
          Planos e preços
        </h2>
        <p className='mx-auto mt-4 max-w-2xl text-muted-foreground'>
          Comece com o plano ideal e aumente o ticket com add-ons quando fizer
          sentido.
        </p>
      </div>

      <div className='mt-12 grid gap-6 md:grid-cols-3'>
        {plans.map((p) => (
          <div
            key={p.name}
            className={[
              'relative rounded-2xl border bg-background p-8 shadow-sm',
              p.highlight ? 'ring-1 ring-primary' : '',
            ].join(' ')}
          >
            {p.badge && (
              <span className='absolute right-6 top-6 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary'>
                {p.badge}
              </span>
            )}

            <h3 className='text-xl font-semibold'>{p.name}</h3>
            <p className='mt-2 text-sm text-muted-foreground'>{p.subtitle}</p>

            <div className='mt-6 text-4xl font-semibold tracking-tight'>
              {p.price}
            </div>

            <div className='mt-6 space-y-3'>
              {p.features.map((f) => (
                <div key={f} className='flex items-start gap-2 text-sm'>
                  <span className='mt-0.5 inline-flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 text-primary'>
                    <Check className='h-3.5 w-3.5' />
                  </span>
                  <span className='text-muted-foreground'>{f}</span>
                </div>
              ))}
            </div>

            <Button className='mt-8 w-full bg-primary text-primary-foreground hover:bg-primary/90'>
              Quero esse plano
            </Button>
            <Button variant='outline' className='mt-3 w-full'>
              Falar no WhatsApp
            </Button>
          </div>
        ))}
      </div>
    </Section>
  );
};

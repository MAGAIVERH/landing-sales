import { Section } from './section';

const steps = [
  {
    step: '01',
    title: 'Escolha o plano',
    desc: 'Selecione Start, Pro ou Premium e o segmento.',
  },
  {
    step: '02',
    title: 'Personalização',
    desc: 'Textos, imagens, serviços e regras do seu negócio.',
  },
  {
    step: '03',
    title: 'Publicação',
    desc: 'Implantação, domínio, SSL e checklist de produção.',
  },
];

export const HowItWorks = () => {
  return (
    <Section id='como-funciona'>
      <h2 className='text-3xl font-semibold tracking-tight'>Como funciona</h2>

      <div className='mt-10 grid gap-8 md:grid-cols-3'>
        {steps.map((s) => (
          <div key={s.step} className='rounded-2xl border bg-background p-7'>
            <div className='text-sm font-semibold text-primary'>{s.step}</div>
            <div className='mt-2 text-xl font-semibold'>{s.title}</div>
            <p className='mt-3 text-sm text-muted-foreground'>{s.desc}</p>
          </div>
        ))}
      </div>
    </Section>
  );
};

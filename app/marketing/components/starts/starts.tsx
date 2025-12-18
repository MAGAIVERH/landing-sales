import { Counter } from './counter';

export const Starts = () => {
  return (
    <section className='md:py-6 py-4  text-primary-foreground'>
      <div className='mx-auto max-w-6xl px-6'>
        <div className='mb-12 text-center'>
          <h3 className='text-2xl font-semibold text-primary'>
            Nossos números refletem crescimento real
          </h3>
          <p className='mt-3 text-sm text-primary/80'>
            Resultados consistentes, evolução contínua e confiança construída no
            dia a dia.
          </p>
        </div>

        <div className='grid gap-10 text-center sm:grid-cols-2 md:grid-cols-4'>
          <div>
            <p className='text-4xl font-semibold text-primary'>99%</p>
            <p className='mt-2 text-sm text-primary/80 leading-tight min-h-8'>
              Satisfação com suporte
              <span className='block text-[11px] text-primary/70'>
                resposta rápida
              </span>
            </p>
          </div>

          <div>
            <Counter baseValue={579} />
            <p className='mt-2 text-sm text-primary/80 leading-tight min-h-8'>
              Projetos entregues
              <span className='block text-[11px] text-primary/70'>
                em múltiplos nichos
              </span>
            </p>
          </div>

          <div>
            <p className='text-4xl font-semibold text-primary'>7 dias</p>
            <p className='mt-2 text-sm text-primary/80 leading-tight min-h-8'>
              Média de entrega
              <span className='block text-[11px] text-primary/70'>
                setup acelerado
              </span>
            </p>
          </div>

          <div>
            <p className='text-4xl font-semibold text-primary'>R$ 997</p>
            <p className='mt-2 text-sm text-primary/80 leading-tight min-h-8'>
              A partir de
              <span className='block text-[11px] text-primary/70'>
                pagamento único
              </span>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

import { Counter } from './counter';

export const Stats = () => {
  return (
    <section className='mt-4 bg-primary py-14'>
      <div className='mx-auto max-w-6xl px-6'>
        <div className='mb-12 text-center'>
          <h3 className='text-2xl font-semibold text-white'>
            Nossos números refletem crescimento real
          </h3>
          <p className='mt-3 text-sm text-white/80'>
            Resultados consistentes, evolução contínua e confiança construída no
            dia a dia.
          </p>
        </div>

        <div className='grid gap-10 text-center sm:grid-cols-2 md:grid-cols-4'>
          <div>
            <p className='text-4xl font-semibold text-white'>99%</p>
            <p className='mt-2 text-sm text-white/80'>Satisfação com suporte</p>
          </div>

          <div>
            <Counter baseValue={579} />
            <p className='mt-2 text-sm text-white/80'>Projetos entregues</p>
          </div>

          <div>
            <p className='text-4xl font-semibold text-white'>7 dias</p>
            <p className='mt-2 text-sm text-white/80'>Média de entrega</p>
          </div>

          <div>
            <p className='text-4xl font-semibold text-white'>R$ 499</p>
            <p className='mt-2 text-sm text-white/80'>Plano de entrada</p>
          </div>
        </div>
      </div>
    </section>
  );
};

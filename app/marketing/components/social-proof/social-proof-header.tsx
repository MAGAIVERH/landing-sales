'use client';

export const SocialProofHeader = () => {
  return (
    <div className='relative mx-auto flex max-w-4xl flex-col items-center text-center'>
      <span className='rounded-full bg-background/15 px-4 py-1 text-xs font-medium ring-1 ring-background/20'>
        Confiança construída na prática
      </span>

      <h2 className='mt-5 text-balance text-3xl font-semibold tracking-tight md:text-5xl'>
        Profissionais e operações de serviços escolhem uma plataforma que
        entrega previsibilidade
      </h2>

      <p className='mt-3 max-w-3xl text-balance text-sm text-primary-foreground/80 md:text-base'>
        Não é “um site”. É um processo completo: estrutura, conversão,
        agendamento, pagamentos e acompanhamento na implantação.
      </p>
    </div>
  );
};

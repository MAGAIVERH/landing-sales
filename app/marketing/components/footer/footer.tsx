import Image from 'next/image';

export const Footer = () => {
  return (
    <footer className=' bg-background'>
      <div className='mx-auto max-w-6xl px-6 pb-6'>
        <div className='flex flex-col items-center justify-center gap-3 text-center'>
          <div className='flex items-center gap-3'>
            <div className='relative h-10 w-10 overflow-hidden rounded-full border-none border bg-background shadow-sm'>
              <Image
                src='/logo-icon.svg'
                alt='Minha Plataforma'
                fill
                className='object-cover'
                priority
              />
            </div>

            <div className='leading-tight'>
              <p className='text-sm font-semibold text-foreground'>
                Minha Plataforma
              </p>
              <p className='text-xs text-muted-foreground'>
                Feito por Magaiver Magalhães
              </p>
            </div>
          </div>

          <p className='text-xs text-muted-foreground'>
            © {new Date().getFullYear()} Minha Plataforma. Todos os direitos
            reservados.
          </p>
        </div>
      </div>
    </footer>
  );
};

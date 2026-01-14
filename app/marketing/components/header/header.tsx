'use client';

import Image from 'next/image';
import Link from 'next/link';

import { Button } from '@/components/ui/button';

export const Header = () => {
  return (
    <header className='sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur'>
      <div
        className='mx-auto h-16 max-w-6xl px-8 md:px-12
                   flex items-center justify-between 
                   md:grid md:grid-cols-[1fr_auto_1fr] md:gap-0'
      >
        {/* ESQUERDA */}
        <Link
          href='/'
          className='flex flex-1 items-center gap-2 min-w-0 md:flex-none md:justify-self-start'
        >
          <Image
            src='/logo-icon.svg'
            alt='Minha Plataforma'
            width={64}
            height={64}
            priority
            className='h-10 w-10 md:h-8 md:w-8 shrink-0'
          />

          <span className='truncate text-sm font-semibold md:text-base text-primary'>
            Minha <span className='font-extrabold'>Plataforma</span>
          </span>
        </Link>

        {/* CENTRO (DESKTOP) */}
        <nav className='hidden md:flex items-center gap-6 justify-self-center'>
          <Link
            href='#solucoes'
            className='text-sm text-muted-foreground hover:text-foreground'
          >
            Soluções
          </Link>
          <Link
            href='#como-funciona'
            className='text-sm text-muted-foreground hover:text-foreground'
          >
            Como funciona
          </Link>
          <Link
            href='#precos'
            className='text-sm text-muted-foreground hover:text-foreground'
          >
            Preços
          </Link>
          <Link
            href='#faq'
            className='text-sm text-muted-foreground hover:text-foreground'
          >
            FAQ
          </Link>
        </nav>

        {/* DIREITA */}
        <div className='shrink-0 md:justify-self-end'>
          <Button asChild className='shrink-0'>
            <Link href='/budget'>
              <span className='sm:hidden'>Orçamento</span>
              <span className='hidden sm:inline'>Solicitar orçamento</span>
            </Link>
          </Button>
        </div>
      </div>
    </header>
  );
};

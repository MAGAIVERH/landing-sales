'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';

export const Header = () => {
  return (
    <header className='sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur'>
      <div className='mx-auto flex h-16 max-w-6xl items-center justify-between px-6'>
        <Link href='/' className='flex items-center gap-2'>
          <Image
            src='/logo.svg'
            alt='Minha Plataforma'
            width={400}
            height={80}
            priority
          />
        </Link>

        <nav className='hidden items-center gap-6 md:flex'>
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

        <Button className='bg-primary text-primary-foreground hover:bg-primary/90'>
          Solicitar orçamento
        </Button>
      </div>
    </header>
  );
};

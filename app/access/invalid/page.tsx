import { Headset, Home } from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

type PageProps = {
  searchParams: Promise<{ reason?: string }>;
};

const getCopy = (reason?: string) => {
  if (reason === 'EXPIRED') {
    return {
      title: 'Este link expirou',
      desc: 'Para sua segurança, links de acesso têm validade. Solicite um novo link de acesso.',
    };
  }

  if (reason === 'REVOKED') {
    return {
      title: 'Este link foi substituído',
      desc: 'Parece que um novo link foi gerado. Use o link mais recente enviado para você.',
    };
  }

  if (reason === 'MISSING') {
    return {
      title: 'Este link está incompleto',
      desc: 'O link de acesso está incompleto. Verifique se você copiou o link inteiro.',
    };
  }

  return {
    title: 'Link inválido',
    desc: 'Não foi possível validar seu acesso. Verifique se você copiou o link corretamente.',
  };
};

export default async function AccessInvalidPage({ searchParams }: PageProps) {
  const { reason } = await searchParams;
  const copy = getCopy(reason);

  return (
    <main className='relative min-h-screen overflow-hidden bg-linear-to-br from-blue-100 via-white to-white'>
      <div className='pointer-events-none absolute -top-24 right-0 h-72 w-72 rounded-full bg-blue-200/30 blur-3xl' />
      <div className='pointer-events-none absolute -bottom-24 left-0 h-72 w-72 rounded-full bg-blue-200/20 blur-3xl' />

      <div className='mx-auto flex min-h-screen w-full max-w-2xl items-center justify-center px-6 py-12'>
        <Card className='w-full space-y-4 p-6'>
          <div className='space-y-1'>
            <p className='text-base font-semibold'>{copy.title}</p>
            <p className='text-sm text-muted-foreground'>{copy.desc}</p>
          </div>

          <div className='grid gap-2 sm:grid-cols-2'>
            <Button asChild className='h-11 w-full'>
              <Link
                href={`https://wa.me/5585981467094?text=${encodeURIComponent(
                  'Olá! Meu link de acesso para revisar o briefing não funcionou. Pode me reenviar, por favor?',
                )}`}
                target='_blank'
                rel='noreferrer'
              >
                <span className='inline-flex items-center justify-center gap-2'>
                  <Headset className='h-4 w-4' />
                  Falar com suporte
                </span>
              </Link>
            </Button>

            <Button variant='outline' asChild className='h-11 w-full'>
              <Link href='/'>
                <span className='inline-flex items-center justify-center gap-2'>
                  <Home className='h-4 w-4' />
                  Ir para a página inicial
                </span>
              </Link>
            </Button>
          </div>

          <p className='text-xs text-muted-foreground'>
            Dica: use o botão “Falar com suporte” para receber um novo link de
            acesso.
          </p>
        </Card>
      </div>
    </main>
  );
}

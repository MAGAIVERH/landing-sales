import Link from 'next/link';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';

export const dynamic = 'force-dynamic';

type BudgetSearchParams = Promise<
  Record<string, string | string[] | undefined>
>;

export default async function BudgetPage({
  searchParams,
}: {
  searchParams: BudgetSearchParams;
}) {
  const sp = await searchParams;

  const pick = (key: string) => {
    const value = sp?.[key];
    if (Array.isArray(value)) return value[0] ?? '';
    return value ?? '';
  };

  const name = pick('name');
  const email = pick('email');
  const phone = pick('phone');

  return (
    <main className='relative'>
      {/* fundo leve e premium */}
      <div className='pointer-events-none absolute inset-0 -z-10'>
        <div className='absolute inset-0 bg-background' />
        <div className='absolute inset-x-0 top-0 h-56 bg-linear-to-b from-primary/10 via-background to-background' />
      </div>

      <div className='mx-auto w-full max-w-6xl px-4 py-12 md:px-12 md:grid md:grid-cols-2 md:gap-10 md:items-start'>
        {/* COLUNA ESQUERDA (copy) — mobile igual, desktop em 2 colunas */}
        <div className='mx-auto max-w-2xl text-center md:mx-0 md:max-w-none md:text-left md:sticky md:top-20'>
          <Badge variant='secondary' className='mb-4'>
            Solicitação de orçamento
          </Badge>

          <h1 className='text-3xl font-semibold tracking-tight md:text-4xl'>
            Vamos montar sua plataforma sob medida
          </h1>

          <p className='mt-3 text-muted-foreground'>
            Me diga seu segmento e o que você precisa. Eu retorno com escopo,
            prazo e proposta.
          </p>

          <div className='mt-6 flex justify-center md:justify-start'>
            <Button asChild variant='outline'>
              <Link href='/'>Voltar para a página inicial</Link>
            </Button>
          </div>

          {/* Benefícios (somente desktop) */}
          <div className='mt-10 hidden md:block'>
            <div className='grid gap-3 text-sm text-muted-foreground'>
              <p>• Proposta alinhada ao seu segmento e operação</p>
              <p>• Recomendação de funcionalidades e roadmap</p>
              <p>• Prazo e investimento claros desde o início</p>
            </div>
          </div>
        </div>

        {/* COLUNA DIREITA (form) */}
        <div className='mx-auto mt-10 max-w-2xl md:mx-0 md:mt-0 md:max-w-none'>
          <Card className='overflow-hidden'>
            <div className='p-4 md:p-6'>
              <div className='flex items-center justify-between gap-4'>
                <div>
                  <h2 className='text-lg font-semibold'>Dados do contato</h2>
                  <p className='text-sm text-muted-foreground'>
                    Campos essenciais para eu te responder rápido.
                  </p>
                </div>

                <Badge className='shrink-0'>~ 1 minuto</Badge>
              </div>

              <Separator className='my-6' />

              <form className='grid gap-6'>
                {/* Nome */}
                <div className='grid gap-2'>
                  <Label htmlFor='name'>Nome</Label>
                  <Input
                    id='name'
                    name='name'
                    placeholder='Seu nome'
                    className='h-11'
                    defaultValue={name}
                  />
                </div>

                {/* Email + Whats */}
                <div className='grid gap-4 md:grid-cols-2'>
                  <div className='grid gap-2'>
                    <Label htmlFor='email'>E-mail</Label>
                    <Input
                      id='email'
                      name='email'
                      type='email'
                      placeholder='seu@email.com'
                      className='h-11'
                      defaultValue={email}
                    />
                  </div>

                  <div className='grid gap-2'>
                    <Label htmlFor='phone'>WhatsApp</Label>
                    <Input
                      id='phone'
                      name='phone'
                      placeholder='(xx) xxxxx-xxxx'
                      className='h-11'
                      defaultValue={phone}
                    />
                    <p className='text-xs text-muted-foreground'>
                      Opcional, mas acelera o retorno.
                    </p>
                  </div>
                </div>

                {/* Segmento */}
                <div className='grid gap-2'>
                  <Label htmlFor='segment'>Segmento</Label>
                  <Input
                    id='segment'
                    name='segment'
                    placeholder='Ex.: Médicos / Clínica / Consultório'
                    className='h-11'
                  />
                </div>

                {/* Descrição */}
                <div className='grid gap-2'>
                  <Label htmlFor='message'>O que você precisa?</Label>
                  <Textarea
                    id='message'
                    name='message'
                    placeholder='Explique o objetivo, funcionalidades desejadas e prazo.'
                    className='min-h-35 resize-none'
                  />
                  <p className='text-xs text-muted-foreground'>
                    Ex.: agenda online, pagamentos, automações, área do cliente,
                    etc.
                  </p>
                </div>

                {/* rodapé */}
                <div className='flex justify-end'>
                  <Button type='submit' disabled className='h-11 px-6'>
                    Enviar (na próxima fase)
                  </Button>
                </div>
              </form>
            </div>
          </Card>

          <p className='mt-6 text-center text-xs text-muted-foreground'>
            Ao enviar, você concorda em ser contatado para proposta e
            alinhamento do escopo.
          </p>
        </div>
      </div>
    </main>
  );
}

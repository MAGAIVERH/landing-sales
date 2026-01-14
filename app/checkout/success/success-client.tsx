'use client';

import { CheckCircle2, FileText, Loader2, ShieldCheck } from 'lucide-react';
import Link from 'next/link';
import * as React from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

type OrderDTO = {
  id: string;
  status: 'PENDING' | 'PAID' | 'CANCELED' | 'REFUNDED' | 'FAILED';
  amountTotal: number;
  currency: string;
  paidAt: string | null;
  product: { name: string; slug: string };
};

type Props = {
  sessionId: string;
};

const formatMoney = (amountInCents: number, currency: string) => {
  try {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: currency.toUpperCase(),
    }).format(amountInCents / 100);
  } catch {
    return `${(amountInCents / 100).toFixed(2)} ${currency.toUpperCase()}`;
  }
};

export const CheckoutSuccessClient = ({ sessionId }: Props) => {
  const [loading, setLoading] = React.useState(true);
  const [order, setOrder] = React.useState<OrderDTO | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  const retry = React.useCallback(() => {
    window.location.reload();
  }, []);

  React.useEffect(() => {
    if (!sessionId) {
      setLoading(false);
      setError('session_id ausente na URL.');
      return;
    }

    let cancelled = false;
    let tries = 0;
    let timeoutId: ReturnType<typeof setTimeout> | null = null;
    const controller = new AbortController();

    const tick = async () => {
      try {
        const res = await fetch(
          `/api/orders/by-session?session_id=${encodeURIComponent(sessionId)}`,
          { cache: 'no-store', signal: controller.signal },
        );

        if (!res.ok) {
          const data = (await res.json().catch(() => null)) as {
            error?: string;
          } | null;
          throw new Error(data?.error ?? 'Falha ao consultar o pedido.');
        }

        const data = (await res.json()) as
          | { found: false }
          | { found: true; order: OrderDTO };

        if (cancelled) return;

        if ('found' in data && data.found) {
          setOrder(data.order);
          setLoading(false);
          return;
        }

        tries += 1;

        if (tries >= 20) {
          setLoading(false);
          setError(
            'Pagamento recebido, mas ainda estamos processando a confirmação. Atualize a página em alguns segundos.',
          );
          return;
        }

        timeoutId = setTimeout(tick, 1500);
      } catch (e) {
        if (cancelled) return;
        if (e instanceof DOMException && e.name === 'AbortError') return;

        setLoading(false);
        setError(e instanceof Error ? e.message : 'Erro inesperado.');
      }
    };

    tick();

    return () => {
      cancelled = true;
      controller.abort();
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [sessionId]);

  return (
    <main className='relative min-h-screen overflow-hidden bg-linear-to-br from-blue-100 via-white to-white'>
      <div className='pointer-events-none absolute -top-24 right-0 h-72 w-72 rounded-full bg-blue-200/30 blur-3xl' />
      <div className='pointer-events-none absolute -bottom-24 left-0 h-72 w-72 rounded-full bg-blue-200/20 blur-3xl' />

      {/* ✅ Centraliza verticalmente e mantém o conteúdo com largura controlada */}
      <div className='relative z-10 mx-auto flex min-h-screen w-full max-w-3xl flex-col justify-center px-6 py-14'>
        <div className='mb-6 space-y-2'>
          {/* Badge 100% igual ao Hero */}
          <div>
            <Badge className='bg-primary/10 text-primary'>
              Finalização do pedido
            </Badge>
          </div>

          <h1 className='text-2xl font-semibold tracking-tight'>
            Confirmação de pagamento
          </h1>

          <p className='text-sm text-muted-foreground'>
            Estamos validando a transação e liberando o próximo passo do seu
            onboarding.
          </p>
        </div>

        <Card className='p-6 shadow-sm'>
          {loading ? (
            /* ✅ Loading mais “pro”: centralizado (ícone + frase) */
            <div className='flex flex-col items-center justify-center gap-3 py-8 text-center'>
              <Loader2 className='h-5 w-5 animate-spin' />
              <div className='space-y-1'>
                <p className='text-base font-semibold'>
                  Processando seu pagamento…
                </p>
                <p className='text-sm text-muted-foreground'>
                  Estamos confirmando seu pedido. Isso pode levar alguns
                  segundos.
                </p>
              </div>
            </div>
          ) : error ? (
            <div className='space-y-4'>
              <div className='space-y-1'>
                <p className='text-base font-semibold'>
                  Não foi possível confirmar agora
                </p>
                <p className='text-sm text-muted-foreground'>{error}</p>
              </div>

              <Separator />

              {/* Botões aproveitando melhor no mobile */}
              <div className='grid gap-2 sm:grid-cols-2'>
                <Button onClick={retry} className='h-11 w-full'>
                  Tentar novamente
                </Button>
                <Button variant='outline' asChild className='h-11 w-full'>
                  <Link href='/#precos'>Voltar aos preços</Link>
                </Button>
              </div>

              <p className='text-xs text-muted-foreground'>
                Dica: em ambiente local, confirme se o webhook está recebendo
                eventos.
              </p>
            </div>
          ) : (
            <div className='space-y-5'>
              <div className='flex items-start gap-3'>
                <CheckCircle2 className='mt-0.5 h-5 w-5' />
                <div className='space-y-1'>
                  <p className='text-base font-semibold'>
                    Pagamento confirmado
                  </p>
                  <p className='text-sm text-muted-foreground'>
                    Pedido:{' '}
                    <span className='font-medium'>{order?.product.name}</span>
                  </p>
                </div>
              </div>

              <Separator />

              <div className='grid gap-4 md:grid-cols-2'>
                <div className='rounded-lg border bg-background p-4'>
                  {/* ✅ Ícone ao lado do título */}
                  <div className='flex items-center gap-2'>
                    <FileText className='h-4 w-4 text-muted-foreground' />
                    <p className='text-sm font-medium'>Resumo do pedido</p>
                  </div>

                  <div className='mt-2 space-y-1 text-sm text-muted-foreground'>
                    <div className='flex items-center justify-between gap-3'>
                      <span>Valor</span>
                      <span className='font-medium text-foreground'>
                        {order
                          ? formatMoney(order.amountTotal, order.currency)
                          : '-'}
                      </span>
                    </div>

                    <div className='flex items-center justify-between gap-3'>
                      <span>Moeda</span>
                      <span className='font-medium text-foreground'>
                        {order?.currency?.toUpperCase() ?? '-'}
                      </span>
                    </div>

                    <div className='flex items-center justify-between gap-3'>
                      <span>ID do pedido</span>
                      <span className='font-mono text-xs text-foreground'>
                        {order?.id ?? '-'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className='rounded-lg border bg-background p-4'>
                  {/* ✅ Reposiciona ShieldCheck: alinhado ao título (sem “flutuar”) */}
                  <div className='flex items-start gap-3'>
                    <div className='pt-0.5'>
                      <ShieldCheck className='h-4 w-4 text-muted-foreground' />
                    </div>

                    <div className='space-y-1'>
                      <div className='flex items-center gap-2'>
                        <p className='text-sm font-medium'>Próximo passo</p>
                      </div>

                      <p className='text-sm text-muted-foreground'>
                        Preencha suas especificações para iniciarmos a entrega
                        com o máximo de precisão.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Botões melhores no mobile: full width; desktop: 2 colunas */}
              <div className='mt-2 grid gap-2 sm:grid-cols-2'>
                <Button asChild className='h-11 w-full'>
                  <Link href={`/onboarding?orderId=${order?.id ?? ''}`}>
                    Preencher especificações
                  </Link>
                </Button>

                <Button variant='outline' asChild className='h-11 w-full'>
                  <Link href='/'>Voltar para a página inicial</Link>
                </Button>
              </div>

              <p className='text-xs text-muted-foreground'>
                Você poderá revisar/atualizar o briefing depois, se necessário.
              </p>
            </div>
          )}
        </Card>
      </div>
    </main>
  );
};

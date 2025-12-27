'use client';

import * as React from 'react';
import Link from 'next/link';
import { CheckCircle2, Loader2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

type ConfirmResponse =
  | {
      ok: true;
      orderId?: string;
      checks?: {
        paymentConfirmed?: boolean;
        purchaseRegistered?: boolean;
        teamNotified?: boolean;
      };
    }
  | { ok: false; error?: string };

export const HostingSuccessClient = ({ sessionId }: { sessionId: string }) => {
  const [loading, setLoading] = React.useState(true);
  const [ok, setOk] = React.useState(false);
  const [orderId, setOrderId] = React.useState<string | null>(null);
  const [checks, setChecks] = React.useState<{
    paymentConfirmed?: boolean;
    purchaseRegistered?: boolean;
    teamNotified?: boolean;
  }>({});
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const run = async () => {
      try {
        setLoading(true);
        setError(null);

        if (!sessionId) {
          throw new Error('session_id ausente.');
        }

        const res = await fetch(
          `/api/stripe/hosting-checkout?session_id=${encodeURIComponent(
            sessionId,
          )}`,
          { cache: 'no-store' },
        );

        const data = (await res
          .json()
          .catch(() => null)) as ConfirmResponse | null;

        if (!res.ok || !data) {
          throw new Error('Falha ao confirmar hospedagem.');
        }

        if (data.ok !== true) {
          throw new Error(data.error ?? 'Falha ao confirmar hospedagem.');
        }

        setOk(true);
        setOrderId(data.orderId ?? null);
        setChecks(data.checks ?? {});
      } catch (e) {
        setOk(false);
        setError(e instanceof Error ? e.message : 'Erro inesperado.');
      } finally {
        setLoading(false);
      }
    };

    run();
  }, [sessionId]);

  // ✅ LOADING no padrão do wizard: centralizado, sem Card
  if (loading) {
    return (
      <main className='min-h-screen bg-muted/30'>
        <div className='mx-auto flex min-h-screen max-w-3xl items-center justify-center px-6'>
          <div className='flex items-center gap-3'>
            <Loader2 className='h-5 w-5 animate-spin' />
            <p className='text-sm text-muted-foreground'>
              Confirmando sua hospedagem…
            </p>
          </div>
        </div>
      </main>
    );
  }

  // erro
  if (!ok) {
    return (
      <main className='min-h-screen bg-muted/30'>
        <div className='mx-auto w-full max-w-2xl px-6 py-12'>
          <Card className='p-6 space-y-4'>
            <div className='space-y-1'>
              <p className='text-base font-semibold'>
                Não foi possível validar
              </p>
              <p className='text-sm text-muted-foreground'>
                {error ?? 'Tente novamente.'}
              </p>
            </div>

            <div className='grid gap-2 sm:grid-cols-2'>
              <Button
                onClick={() => window.location.reload()}
                className='w-full'
              >
                Tentar de novo
              </Button>

              <Button variant='outline' asChild className='w-full'>
                <Link href='/'>Voltar para a página inicial</Link>
              </Button>
            </div>
          </Card>
        </div>
      </main>
    );
  }

  // sucesso (melhorado)
  const checklist = [
    {
      label: 'Pagamento confirmado',
      done: checks.paymentConfirmed ?? true,
    },
    {
      label: 'Hospedagem vinculada ao pedido',
      done: checks.purchaseRegistered ?? true,
    },
    {
      label: 'Equipe avisada para iniciar',
      done: checks.teamNotified ?? true,
    },
  ];

  return (
    <main className='relative min-h-screen overflow-hidden bg-linear-to-br from-blue-100 via-white to-white'>
      <div className='pointer-events-none absolute -top-24 right-0 h-72 w-72 rounded-full bg-blue-200/30 blur-3xl' />
      <div className='pointer-events-none absolute -bottom-24 left-0 h-72 w-72 rounded-full bg-blue-200/20 blur-3xl' />

      <div className='mx-auto flex min-h-screen w-full max-w-2xl items-center justify-center px-6'>
        <Card className='w-full p-6 space-y-4'>
          <div className='flex items-start gap-3'>
            <CheckCircle2 className='mt-0.5 h-5 w-5' />
            <div>
              <p className='text-base font-semibold'>
                Hospedagem contratada com sucesso
              </p>
              <p className='text-sm text-muted-foreground'>
                Nossa equipe vai cuidar da publicação, SSL e suporte.
              </p>
            </div>
          </div>

          <div className='rounded-lg border bg-background p-4'>
            <p className='text-sm font-semibold'>Status</p>

            <ul className='mt-3 space-y-2'>
              {checklist.map((item) => (
                <li key={item.label} className='flex items-center gap-2'>
                  <CheckCircle2 className='h-4 w-4' />
                  <span className='text-sm text-muted-foreground'>
                    {item.label}
                  </span>
                </li>
              ))}
            </ul>

            {orderId ? (
              <p className='mt-3 text-xs text-muted-foreground'>
                Pedido: <span className='font-medium'>{orderId}</span>
              </p>
            ) : null}
          </div>

          <div className='grid gap-2 sm:grid-cols-2'>
            <Button asChild className='w-full'>
              <Link href='/'>Voltar para a página inicial</Link>
            </Button>

            {/* Só aparece se o endpoint retornar orderId */}
            {orderId ? (
              <Button variant='outline' asChild className='w-full'>
                <Link
                  href={`/onboarding?orderId=${encodeURIComponent(orderId)}`}
                >
                  Revisar briefing
                </Link>
              </Button>
            ) : (
              <Button
                variant='outline'
                className='w-full'
                onClick={() => window.location.reload()}
              >
                Atualizar status
              </Button>
            )}
          </div>
        </Card>
      </div>
    </main>
  );
};

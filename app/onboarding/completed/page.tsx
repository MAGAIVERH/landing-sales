import { CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { prisma } from '@/lib/prisma';

import { HostingUpsellCard } from './hostingUpsellCard';

type PageProps = {
  searchParams: Promise<{ orderId?: string }>;
};

export default async function OnboardingCompletedPage({
  searchParams,
}: PageProps) {
  const params = await searchParams;
  const orderId = params.orderId ?? '';

  // ✅ Se não tiver orderId, não faz sentido mostrar upsell
  const canShowHostingUpsell = Boolean(orderId)
    ? !(await prisma.upsellPurchase.findFirst({
        where: {
          orderId,
          kind: 'hosting',
          // ✅ não mostra de novo se já comprou OU está em processamento
          status: { in: ['PENDING', 'PAID'] },
        },
        select: { id: true },
      }))
    : false;

  return (
    <main className='relative min-h-screen overflow-hidden bg-linear-to-br from-blue-100 via-white to-white'>
      <div className='pointer-events-none absolute -top-24 right-0 h-72 w-72 rounded-full bg-blue-200/30 blur-3xl' />
      <div className='pointer-events-none absolute -bottom-24 left-0 h-72 w-72 rounded-full bg-blue-200/20 blur-3xl' />

      <div className='mx-auto flex min-h-screen w-full max-w-2xl items-center justify-center px-6 py-12'>
        <div className='w-full space-y-6'>
          <Card className='p-6 space-y-4'>
            <div className='flex items-start gap-3'>
              <CheckCircle2 className='mt-0.5 h-5 w-5' />
              <div>
                <p className='text-base font-semibold'>
                  Briefing enviado com sucesso
                </p>
                <p className='text-sm text-muted-foreground'>
                  Pedido: <span className='font-medium'>{orderId || '-'}</span>
                </p>
              </div>
            </div>

            <p className='text-sm text-muted-foreground'>
              Agora nossa equipe inicia a execução. Se precisar complementar
              informações, mantenha este link salvo ou use o link enviado no seu
              e-mail/WhatsApp.
            </p>

            <div className='grid gap-2 sm:grid-cols-2'>
              <Button asChild className='h-11 w-full'>
                <Link href='/'>Voltar para a página inicial</Link>
              </Button>

              <Button variant='outline' asChild className='h-11 w-full'>
                <Link
                  href={`/onboarding?orderId=${encodeURIComponent(orderId)}`}
                >
                  Revisar briefing
                </Link>
              </Button>
            </div>
          </Card>

          {/* ✅ UPSSELL: só aparece se ainda não existe hosting PENDING/PAID */}
          {canShowHostingUpsell ? (
            <HostingUpsellCard orderId={orderId} />
          ) : null}
        </div>
      </div>
    </main>
  );
}

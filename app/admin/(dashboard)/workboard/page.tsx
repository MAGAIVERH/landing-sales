import Link from 'next/link';
import {
  ArrowRight,
  CheckCircle2,
  Clock,
  CreditCard,
  Sparkles,
} from 'lucide-react';

import { prisma } from '@/lib/prisma';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';

import { WorkboardClient } from './workboard-client';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const startOfUTCDay = (d: Date) =>
  new Date(
    Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate(), 0, 0, 0),
  );

const addDaysUTC = (d: Date, days: number) => {
  const x = new Date(d);
  x.setUTCDate(x.getUTCDate() + days);
  return x;
};

const onlyDigits = (value?: string | null) => (value ?? '').replace(/\D/g, '');

const normalizeWhatsAppNumber = (value?: string | null) => {
  let digits = onlyDigits(value);
  if (!digits) return null;

  // Se já veio com DDI do Brasil
  if (digits.startsWith('55')) return digits;

  // Se veio só com DDD + número (10 ou 11 dígitos), prefixa Brasil
  if (digits.length === 10 || digits.length === 11) return `55${digits}`;

  // Caso já esteja num formato diferente, tenta usar como está
  return digits;
};

const buildWhatsAppLink = (phone: string, text: string) => {
  const digits = normalizeWhatsAppNumber(phone);
  if (!digits) return null;
  return `https://wa.me/${digits}?text=${encodeURIComponent(text)}`;
};

const toPlain = <T,>(value: T) => {
  return JSON.parse(
    JSON.stringify(value, (_, v) => (typeof v === 'bigint' ? v.toString() : v)),
  ) as T;
};

export default async function WorkboardPage() {
  const now = new Date();
  const today = startOfUTCDay(now);

  const [readyOrders, stalledBriefings, pendingUpsells, recentLeads] =
    await Promise.all([
      prisma.order.findMany({
        take: 30,
        orderBy: { paidAt: 'desc' },
        where: {
          status: 'PAID',
          briefing: {
            status: 'SUBMITTED',
          },
        },
        include: {
          lead: true,
          briefing: true,
          price: { include: { product: true } },
        },
      }),

      prisma.briefing.findMany({
        take: 30,
        orderBy: { updatedAt: 'asc' },
        where: {
          status: 'DRAFT',
          updatedAt: { lt: addDaysUTC(today, -2) },
        },
        include: {
          order: {
            include: {
              lead: true,
              price: { include: { product: true } },
            },
          },
        },
      }),

      prisma.upsellPurchase.findMany({
        take: 30,
        orderBy: { createdAt: 'desc' },
        where: { kind: 'hosting', status: 'PENDING' },
        include: {
          order: {
            include: {
              lead: true,
              price: { include: { product: true } },
            },
          },
        },
      }),

      prisma.lead.findMany({
        take: 30,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          message: true,
          landingPath: true,
          createdAt: true,
          status: true,
        },
      }),
    ]);

  const readyIds = readyOrders.map((o) => o.id);
  const stalledIds = stalledBriefings.map((b) => b.orderId);
  const upsellIds = pendingUpsells.map((u) => u.orderId);
  const leadIds = recentLeads.map((l) => l.id);

  const workItems = await prisma.adminWorkItem.findMany({
    where: {
      OR: [
        { kind: 'READY', refId: { in: readyIds } },
        { kind: 'STALLED', refId: { in: stalledIds } },
        { kind: 'UPSELL', refId: { in: upsellIds } },
        { kind: 'LEAD', refId: { in: leadIds } },
      ],
    },
  });

  const key = (kind: string, refId: string) => `${kind}:${refId}`;
  const statusMap = new Map(
    workItems.map((w) => [key(w.kind, w.refId), w.status]),
  );

  const ready = readyOrders.map((o) => ({
    kind: 'READY' as const,
    refId: o.id,
    email: o.customerEmail ?? o.lead?.email ?? 'sem email',
    product: o.price.product.name,
    status: statusMap.get(key('READY', o.id)) ?? 'TODO',
    href: `/admin/orders/${o.id}`,
    briefingHref: `/admin/orders/${o.id}/briefing`,
    briefing: o.briefing ? toPlain(o.briefing) : null,
  }));

  const stalled = stalledBriefings.map((b) => {
    const email = b.order.customerEmail ?? b.order.lead?.email ?? 'sem email';
    const phone = b.order.lead?.phone ?? '';
    const msg =
      `Olá! Vi que seu briefing ainda não foi concluído.\n\n` +
      `Você consegue finalizar agora pra gente dar continuidade?\n` +
      `Link: ${process.env.NEXT_PUBLIC_APP_URL ?? ''}/onboarding?orderId=${
        b.orderId
      }`;

    return {
      kind: 'STALLED' as const,
      refId: b.orderId,
      email,
      product: b.order.price.product.name,
      status: statusMap.get(key('STALLED', b.orderId)) ?? 'TODO',
      updatedAt: b.updatedAt.toISOString().slice(0, 10),
      whatsappLink: buildWhatsAppLink(phone, msg),
      href: `/admin/orders/${b.orderId}`,
    };
  });

  const upsells = pendingUpsells.map((u) => ({
    kind: 'UPSELL' as const,
    refId: u.orderId,
    email: u.order.customerEmail ?? u.order.lead?.email ?? 'sem email',
    product: u.order.price.product.name,
    status: statusMap.get(key('UPSELL', u.orderId)) ?? 'TODO',
    createdAt: u.createdAt.toISOString().slice(0, 10),
    href: `/admin/orders/${u.orderId}`,
  }));

  const leads = recentLeads.map((l) => {
    const msg =
      `Olá! Vi sua solicitação e vou te enviar os próximos passos.\n\n` +
      `Nome: ${l.name ?? '-'}\n` +
      `E-mail: ${l.email ?? '-'}\n` +
      `WhatsApp: ${l.phone ?? '-'}\n\n` +
      `Pode me confirmar o segmento e o principal objetivo da sua plataforma?`;

    return {
      kind: 'LEAD' as const,
      refId: l.id,
      name: l.name ?? 'Sem nome',
      email: l.email ?? 'sem e-mail',
      message: l.message ?? 'Sem mensagem',
      landingPath: l.landingPath ?? '-',
      leadStatus: l.status,
      status: statusMap.get(key('LEAD', l.id)) ?? 'TODO',
      whatsappLink: buildWhatsAppLink(l.phone ?? '', msg),
      href: `/admin/leads`,
    };
  });

  return (
    <div className='grid gap-3'>
      <Card className='rounded-2xl border bg-card p-6 shadow-sm'>
        <div className='flex items-start justify-between gap-3 '>
          <div>
            <h1 className='text-xl font-semibold tracking-tight'>
              Operação do dia
            </h1>
            <p className='mt-1 text-xs text-muted-foreground'>
              Prioridades organizadas, com controle no banco: TODO, em
              andamento, concluído.
            </p>
          </div>

          <div className='flex items-center gap-2'>
            <Badge variant='secondary'>Admin</Badge>
            <Link href='/admin'>
              <Button variant='outline' className='h-9 gap-2'>
                Voltar para Visão geral <ArrowRight className='h-4 w-4' />
              </Button>
            </Link>
          </div>
        </div>

        <Separator />

        <div className='flex flex-wrap gap-3 text-xs text-muted-foreground'>
          <div className='flex items-center gap-2'>
            <CheckCircle2 className='h-4 w-4' /> Produção
          </div>
          <div className='flex items-center gap-2'>
            <Clock className='h-4 w-4' /> Cobrar
          </div>
          <div className='flex items-center gap-2'>
            <CreditCard className='h-4 w-4' /> Leads
          </div>
          <div className='flex items-center gap-2'>
            <Sparkles className='h-4 w-4' /> Upsell
          </div>
        </div>
      </Card>

      <WorkboardClient
        ready={ready}
        stalled={stalled}
        upsells={upsells}
        leads={leads}
      />
    </div>
  );
}

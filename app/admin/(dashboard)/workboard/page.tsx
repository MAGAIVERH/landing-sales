// import Link from 'next/link';
// import {
//   ArrowRight,
//   CheckCircle2,
//   Clock,
//   CreditCard,
//   Sparkles,
// } from 'lucide-react';
// import { AdminWorkItemKind, Prisma } from '@prisma/client';

// import { prisma } from '@/lib/prisma';
// import { Card } from '@/components/ui/card';
// import { Badge } from '@/components/ui/badge';
// import { Separator } from '@/components/ui/separator';
// import { Button } from '@/components/ui/button';

// import { WorkboardClient } from './workboard-client';

// export const runtime = 'nodejs';
// export const dynamic = 'force-dynamic';

// const startOfUTCDay = (d: Date) =>
//   new Date(
//     Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate(), 0, 0, 0),
//   );

// const addDaysUTC = (d: Date, days: number) => {
//   const x = new Date(d);
//   x.setUTCDate(x.getUTCDate() + days);
//   return x;
// };

// const onlyDigits = (value?: string | null) => (value ?? '').replace(/\D/g, '');

// const normalizeWhatsAppNumber = (value?: string | null) => {
//   let digits = onlyDigits(value);
//   if (!digits) return null;

//   if (digits.startsWith('55')) return digits;
//   if (digits.length === 10 || digits.length === 11) return `55${digits}`;
//   return digits;
// };

// const buildWhatsAppLink = (phone: string, text: string) => {
//   const digits = normalizeWhatsAppNumber(phone);
//   if (!digits) return null;
//   return `https://wa.me/${digits}?text=${encodeURIComponent(text)}`;
// };

// const buildEmailLink = (to: string, subject: string, body: string) => {
//   const trimmed = (to ?? '').trim();
//   if (!trimmed) return null;

//   return (
//     `mailto:${encodeURIComponent(trimmed)}` +
//     `?subject=${encodeURIComponent(subject)}` +
//     `&body=${encodeURIComponent(body)}`
//   );
// };

// const toPlain = <T,>(value: T) => {
//   return JSON.parse(
//     JSON.stringify(value, (_, v) => (typeof v === 'bigint' ? v.toString() : v)),
//   ) as T;
// };

// const scheduleDaysByAttempts = (attempts: number) => {
//   if (attempts <= 0) return 0;
//   if (attempts === 1) return 5;
//   if (attempts === 2) return 15;
//   return 999999;
// };

// const formatISODate = (d?: Date | null) => {
//   if (!d) return null;
//   return d.toISOString().slice(0, 10);
// };

// export default async function WorkboardPage() {
//   const now = new Date();
//   const today = startOfUTCDay(now);
//   const dueSince = addDaysUTC(today, -2);

//   const [
//     readyOrders,
//     stalledDraftBriefings,
//     notStartedOrders,
//     pendingUpsellsRaw,
//     recentLeads,
//   ] = await Promise.all([
//     prisma.order.findMany({
//       take: 30,
//       orderBy: { paidAt: 'desc' },
//       where: {
//         status: 'PAID',
//         briefing: { status: 'SUBMITTED' },
//       },
//       include: {
//         lead: true,
//         briefing: true,
//         price: { include: { product: true } },
//       },
//     }),

//     // ✅ DRAFT: começou e não enviou, e já passou 2+ dias do pagamento
//     prisma.briefing.findMany({
//       take: 30,
//       orderBy: { updatedAt: 'asc' },
//       where: {
//         status: 'DRAFT',
//         order: {
//           status: 'PAID',
//           paidAt: { lt: dueSince },
//         },
//       },
//       include: {
//         order: {
//           include: {
//             lead: true,
//             price: { include: { product: true } },
//           },
//         },
//       },
//     }),

//     // ✅ NOT_STARTED ou sem briefing: não começou, e já passou 2+ dias do pagamento
//     prisma.order.findMany({
//       take: 30,
//       orderBy: { paidAt: 'asc' },
//       where: {
//         status: 'PAID',
//         paidAt: { lt: dueSince },

//         // ✅ NOT_STARTED (no seu schema) = não existe briefing ainda
//         briefing: { is: null },
//       },
//       include: {
//         lead: true,
//         briefing: true,
//         price: { include: { product: true } },
//       },
//     }),

//     // ✅ UPSell OPERACIONAL: SOMENTE checkout PENDING do hosting
//     prisma.upsellPurchase.findMany({
//       take: 60,
//       orderBy: { createdAt: 'desc' },
//       where: { kind: 'hosting', status: 'PENDING' },
//       include: {
//         order: {
//           include: {
//             lead: true,
//             price: { include: { product: true } },
//           },
//         },
//       },
//     }),

//     prisma.lead.findMany({
//       take: 30,
//       orderBy: { createdAt: 'desc' },
//       select: {
//         id: true,
//         name: true,
//         email: true,
//         phone: true,
//         message: true,
//         landingPath: true,
//         createdAt: true,
//         status: true,
//       },
//     }),
//   ]);

//   // ------------------------------------------------------------
//   // ✅ UPSell Followup (controle de tentativas e “voltar em 5/15”)
//   // ------------------------------------------------------------
//   const upsellOrderIds = pendingUpsellsRaw.map((u) => u.orderId);

//   const followups = upsellOrderIds.length
//     ? await prisma.upsellFollowup.findMany({
//         where: {
//           orderId: { in: upsellOrderIds },
//           kind: 'hosting',
//         },
//       })
//     : [];

//   const followupByOrderId = new Map(followups.map((f) => [f.orderId, f]));

//   const isDueNow = (
//     attempts: number,
//     lastSentAt: Date | null,
//     closeAt: Date | null,
//   ) => {
//     if (closeAt && closeAt <= today) return false;
//     if (attempts <= 0) return true;
//     if (attempts >= 3) return false;

//     const days = scheduleDaysByAttempts(attempts);
//     if (!lastSentAt) return true;

//     const last = startOfUTCDay(lastSentAt);
//     const dueAt = addDaysUTC(last, days);

//     return dueAt <= today;
//   };

//   const pendingUpsells = pendingUpsellsRaw.map((u) => {
//     const f = followupByOrderId.get(u.orderId);

//     const attempts = f?.attempts ?? 0;
//     const lastSentAt = f?.lastSentAt ?? null;
//     const closeAt = f?.closeAt ?? null;

//     return {
//       kind: 'UPSELL' as const,
//       refId: u.orderId,

//       email: u.order.customerEmail ?? u.order.lead?.email ?? 'sem email',
//       product: u.order.price.product.name,

//       status: 'TODO' as const,

//       createdAt: u.createdAt.toISOString().slice(0, 10),

//       attempts,
//       lastSentAt: formatISODate(lastSentAt),
//       closeAt: formatISODate(closeAt),
//       dueNow: isDueNow(attempts, lastSentAt, closeAt),

//       href: `/admin/orders/${u.orderId}`,
//     };
//   });

//   // ------------------------------------------------------------
//   // ✅ Workboard status (READY / STALLED / LEAD)
//   // ------------------------------------------------------------
//   const readyIds = readyOrders.map((o) => o.id);

//   // ✅ STALLED agora inclui DRAFT + NOT_STARTED/sem briefing
//   const stalledIdsDraft = stalledDraftBriefings.map((b) => b.orderId);
//   const stalledIdsNotStarted = notStartedOrders.map((o) => o.id);
//   const stalledIds = Array.from(
//     new Set([...stalledIdsDraft, ...stalledIdsNotStarted]),
//   );

//   const leadIds = recentLeads.map((l) => l.id);

//   const or: Prisma.AdminWorkItemWhereInput[] = [];

//   if (readyIds.length) {
//     or.push({ kind: AdminWorkItemKind.READY, refId: { in: readyIds } });
//   }

//   if (stalledIds.length) {
//     or.push({ kind: AdminWorkItemKind.STALLED, refId: { in: stalledIds } });
//   }

//   if (leadIds.length) {
//     or.push({ kind: AdminWorkItemKind.LEAD, refId: { in: leadIds } });
//   }

//   const workItems = or.length
//     ? await prisma.adminWorkItem.findMany({ where: { OR: or } })
//     : [];

//   const key = (kind: string, refId: string) => `${kind}:${refId}`;
//   const statusMap = new Map(
//     workItems.map((w) => [key(w.kind, w.refId), w.status]),
//   );

//   const ready = readyOrders.map((o) => ({
//     kind: 'READY' as const,
//     refId: o.id,
//     email: o.customerEmail ?? o.lead?.email ?? 'sem email',
//     product: o.price.product.name,
//     status: statusMap.get(key('READY', o.id)) ?? 'TODO',
//     href: `/admin/orders/${o.id}`,
//     briefingHref: `/admin/orders/${o.id}/briefing`,
//     briefing: o.briefing ? toPlain(o.briefing) : null,
//   }));

//   // ------------------------------------------------------------
//   // ✅ STALLED: DRAFT + NOT_STARTED/sem briefing (após 2 dias)
//   // - mantém WhatsApp se tiver telefone
//   // - adiciona Email (mailto) sempre que houver e-mail
//   // ------------------------------------------------------------
//   const appUrl =
//     process.env.NEXT_PUBLIC_APP_URL ||
//     process.env.APP_URL ||
//     'http://localhost:3000';

//   const stalledFromDraft = stalledDraftBriefings.map((b) => {
//     const to = (b.order.customerEmail ?? b.order.lead?.email ?? '').trim();
//     const phone = b.order.lead?.phone ?? '';

//     const onboardingLink = `${appUrl}/onboarding?orderId=${b.orderId}`;

//     const subject = `Ação necessária: finalize seu briefing (pedido ${b.orderId})`;
//     const body =
//       `Olá! Tudo bem?\n\n` +
//       `Identificamos que o briefing do seu pedido ainda não foi finalizado. Ele é necessário para iniciarmos a produção da sua plataforma.\n\n` +
//       `Para concluir agora, acesse o link abaixo:\n` +
//       `${onboardingLink}\n\n` +
//       `Se tiver qualquer dúvida, é só responder este e-mail.\n\n` +
//       `Pedido: ${b.orderId}`;

//     const waMsg =
//       `Olá! Vi que seu briefing ainda não foi concluído.\n\n` +
//       `Você consegue finalizar agora pra gente dar continuidade?\n` +
//       `Link: ${onboardingLink}`;

//     return {
//       kind: 'STALLED' as const,
//       refId: b.orderId,
//       email: to || 'sem email',
//       product: b.order.price.product.name,
//       status: statusMap.get(key('STALLED', b.orderId)) ?? 'TODO',
//       updatedAt: b.updatedAt.toISOString().slice(0, 10),
//       whatsappLink: buildWhatsAppLink(phone, waMsg),
//       emailLink: buildEmailLink(to, subject, body),
//       href: `/admin/orders/${b.orderId}`,
//       _sortAt: b.order.paidAt ?? b.order.createdAt,
//     };
//   });

//   const stalledFromNotStarted = notStartedOrders.map((o) => {
//     const to = (o.customerEmail ?? o.lead?.email ?? '').trim();
//     const phone = o.lead?.phone ?? '';

//     const onboardingLink = `${appUrl}/onboarding?orderId=${o.id}`;

//     const subject = `Ação necessária: inicie seu briefing (pedido ${o.id})`;
//     const body =
//       `Olá! Tudo bem?\n\n` +
//       `Seu pedido foi confirmado, e precisamos que você inicie o briefing para começarmos a produção da sua plataforma.\n\n` +
//       `Para iniciar agora, acesse:\n` +
//       `${onboardingLink}\n\n` +
//       `Pedido: ${o.id}`;

//     const waMsg =
//       `Olá! Seu pedido foi confirmado.\n\n` +
//       `Para começarmos a produção, preciso que você inicie o briefing.\n` +
//       `Link: ${onboardingLink}`;

//     return {
//       kind: 'STALLED' as const,
//       refId: o.id,
//       email: to || 'sem email',
//       product: o.price.product.name,
//       status: statusMap.get(key('STALLED', o.id)) ?? 'TODO',
//       updatedAt: `Não iniciou • Pago em: ${(o.paidAt ?? o.createdAt)
//         .toISOString()
//         .slice(0, 10)}`,
//       whatsappLink: buildWhatsAppLink(phone, waMsg),
//       emailLink: buildEmailLink(to, subject, body),
//       href: `/admin/orders/${o.id}`,
//       _sortAt: o.paidAt ?? o.createdAt,
//     };
//   });

//   const stalled = [...stalledFromDraft, ...stalledFromNotStarted]
//     .sort((a, b) => {
//       const aT = a._sortAt?.getTime?.() ?? 0;
//       const bT = b._sortAt?.getTime?.() ?? 0;
//       return aT - bT;
//     })
//     .slice(0, 30)
//     .map(({ _sortAt, ...rest }) => rest);

//   const leads = recentLeads.map((l) => {
//     const msg =
//       `Olá! Vi sua solicitação e vou te enviar os próximos passos.\n\n` +
//       `Nome: ${l.name ?? '-'}\n` +
//       `E-mail: ${l.email ?? '-'}\n` +
//       `WhatsApp: ${l.phone ?? '-'}\n\n` +
//       `Pode me confirmar o segmento e o principal objetivo da sua plataforma?`;

//     return {
//       kind: 'LEAD' as const,
//       refId: l.id,
//       name: l.name ?? 'Sem nome',
//       email: l.email ?? 'sem e-mail',
//       message: l.message ?? 'Sem mensagem',
//       landingPath: l.landingPath ?? '-',
//       leadStatus: l.status,
//       status: statusMap.get(key('LEAD', l.id)) ?? 'TODO',
//       whatsappLink: buildWhatsAppLink(l.phone ?? '', msg),
//       href: `/admin/leads`,
//     };
//   });

//   return (
//     <div className='grid gap-3'>
//       <Card className='rounded-2xl border bg-card p-6 shadow-sm'>
//         <div className='flex items-start justify-between gap-3'>
//           <div>
//             <h1 className='text-xl font-semibold tracking-tight'>
//               Operação do dia
//             </h1>
//             <p className='mt-1 text-xs text-muted-foreground'>
//               Prioridades organizadas, com controle no banco: TODO, em
//               andamento, concluído.
//             </p>
//           </div>

//           <div className='flex items-center gap-2'>
//             <Badge variant='secondary'>Admin</Badge>
//             <Link href='/admin'>
//               <Button variant='outline' className='h-9 gap-2'>
//                 Voltar para Visão geral <ArrowRight className='h-4 w-4' />
//               </Button>
//             </Link>
//           </div>
//         </div>

//         <Separator />

//         <div className='flex flex-wrap gap-3 text-xs text-muted-foreground'>
//           <div className='flex items-center gap-2'>
//             <CheckCircle2 className='h-4 w-4' /> Produção
//           </div>
//           <div className='flex items-center gap-2'>
//             <Clock className='h-4 w-4' /> Cobrar
//           </div>
//           <div className='flex items-center gap-2'>
//             <CreditCard className='h-4 w-4' /> Leads
//           </div>
//           <div className='flex items-center gap-2'>
//             <Sparkles className='h-4 w-4' /> Upsell
//           </div>
//         </div>
//       </Card>

//       <WorkboardClient
//         ready={ready}
//         stalled={stalled}
//         upsells={pendingUpsells}
//         leads={leads}
//       />
//     </div>
//   );
// }

import { getWorkboardData } from './workboard-page/workboard.data';
import { WorkboardPage } from './workboard-page/workboard-page';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const Page = async () => {
  const data = await getWorkboardData();
  return <WorkboardPage data={data} />;
};

export default Page;

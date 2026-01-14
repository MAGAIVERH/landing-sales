// 'use client';

// import * as React from 'react';
// import Link from 'next/link';
// import { useRouter } from 'next/navigation';
// import {
//   ArrowRight,
//   CheckCircle2,
//   Clock,
//   MessageCircle,
//   Sparkles,
//   CreditCard,
//   Mail,
// } from 'lucide-react';

// import { Card } from '@/components/ui/card';
// import { Badge } from '@/components/ui/badge';
// import { Button } from '@/components/ui/button';
// import { Separator } from '@/components/ui/separator';
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
// } from '@/components/ui/dialog';

// type Status = 'TODO' | 'IN_PROGRESS' | 'DONE' | 'SNOOZED';
// type TabKey = 'ready' | 'stalled' | 'leads' | 'upsells';

// type BriefingPlain = Record<string, unknown> | null;

// type LeadStatus = 'NEW' | 'CONTACTED' | 'QUALIFIED' | 'WON' | 'LOST';

// type ReadyItem = {
//   kind: 'READY';
//   refId: string;
//   email: string;
//   product: string;
//   status: Status;
//   href: string;
//   briefingHref: string;
//   briefing: BriefingPlain;
// };

// type StalledItem = {
//   kind: 'STALLED';
//   refId: string;
//   email: string;
//   product: string;
//   status: Status;
//   updatedAt: string;
//   whatsappLink?: string | null;
//   emailLink?: string | null;
//   href: string;
// };

// type UpsellItem = {
//   kind: 'UPSELL';
//   refId: string;
//   email: string;
//   product: string;
//   status: Status;
//   createdAt: string;
//   href: string;

//   attempts?: number;
//   lastSentAt?: string | null;
// };

// type LeadItem = {
//   kind: 'LEAD';
//   refId: string;
//   name: string;
//   email: string;
//   message: string;
//   landingPath: string;

//   leadStatus: LeadStatus;
//   status: Status;

//   whatsappLink?: string | null;
//   href: string;
// };

// type Props = {
//   ready: ReadyItem[];
//   stalled: StalledItem[];
//   upsells: UpsellItem[];
//   leads: LeadItem[];
// };

// const statusLabel: Record<Status, string> = {
//   TODO: 'Pendente',
//   IN_PROGRESS: 'Em andamento',
//   DONE: 'Concluído',
//   SNOOZED: 'Snooze',
// };

// const statusBadgeClass = (s: Status) => {
//   if (s === 'TODO') return 'border-amber-200 bg-amber-50 text-amber-900';
//   if (s === 'DONE') return 'border-emerald-200 bg-emerald-50 text-emerald-900';
//   if (s === 'IN_PROGRESS') return 'border-sky-200 bg-sky-50 text-sky-900';
//   return 'border-muted bg-muted/40 text-muted-foreground';
// };

// const leadStatusLabel: Record<LeadStatus, string> = {
//   NEW: 'Novo',
//   CONTACTED: 'Contatado',
//   QUALIFIED: 'Qualificado',
//   WON: 'Vendido',
//   LOST: 'Perdido',
// };

// const leadStatusBadgeClass = (s: LeadStatus) => {
//   if (s === 'NEW') return 'border-slate-200 bg-slate-50 text-slate-900';
//   if (s === 'CONTACTED') return 'border-sky-200 bg-sky-50 text-sky-900';
//   if (s === 'QUALIFIED')
//     return 'border-violet-200 bg-violet-50 text-violet-900';
//   if (s === 'WON') return 'border-emerald-200 bg-emerald-50 text-emerald-900';
//   return 'border-rose-200 bg-rose-50 text-rose-900';
// };

// const Pill = ({
//   active,
//   onClick,
//   icon: Icon,
//   title,
//   count,
// }: {
//   active: boolean;
//   onClick: () => void;
//   icon: React.ElementType;
//   title: string;
//   count: number;
// }) => {
//   return (
//     <button
//       type='button'
//       onClick={onClick}
//       className={[
//         'flex items-center gap-2 rounded-full border px-3 py-2 text-sm transition-colors',
//         'outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
//         'active:translate-y-0 disabled:pointer-events-none disabled:opacity-50',
//         active
//           ? 'bg-primary text-primary-foreground border-primary/30 hover:bg-primary/90 active:bg-primary/90'
//           : 'bg-background hover:bg-muted/40 active:bg-muted/40',
//         '[-webkit-tap-highlight-color:transparent]',
//       ].join(' ')}
//     >
//       <Icon className='h-4 w-4' />
//       <span className='font-medium'>{title}</span>
//       <Badge
//         variant={active ? 'secondary' : 'outline'}
//         className={active ? 'bg-background/15 text-primary-foreground' : ''}
//       >
//         {count}
//       </Badge>
//     </button>
//   );
// };

// const Row = ({
//   left,
//   right,
//   muted,
// }: {
//   left: React.ReactNode;
//   right: React.ReactNode;
//   muted?: boolean;
// }) => {
//   return (
//     <div
//       className={[
//         'flex items-start justify-between gap-3 rounded-xl border px-4 py-3',
//         muted ? 'opacity-70' : '',
//       ].join(' ')}
//     >
//       <div className='min-w-0 flex-1'>{left}</div>
//       <div className='shrink-0'>{right}</div>
//     </div>
//   );
// };

// const isEmptyScalar = (v: unknown) => {
//   if (v === null || v === undefined) return true;
//   if (typeof v === 'string') return v.trim().length === 0;
//   if (Array.isArray(v)) return v.length === 0;
//   return false;
// };

// const formatValue = (v: unknown) => {
//   if (v === null || v === undefined) return '';
//   if (typeof v === 'string') return v;
//   if (typeof v === 'number' || typeof v === 'boolean') return String(v);
//   try {
//     return JSON.stringify(v, null, 2);
//   } catch {
//     return String(v);
//   }
// };

// const labelFromKey = (key: string) => {
//   return key
//     .replace(/^data\./, '')
//     .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
//     .replace(/[_-]+/g, ' ')
//     .trim();
// };

// type FormField = {
//   key: string;
//   label: string;
//   value: unknown;
//   empty: boolean;
//   wide?: boolean;
// };

// const buildBriefingView = (briefing: Record<string, unknown>) => {
//   const metaKeys = new Set([
//     'id',
//     'orderId',
//     'createdAt',
//     'updatedAt',
//     'status',
//     'submittedAt',
//   ]);

//   const fields: FormField[] = [];

//   for (const [k, v] of Object.entries(briefing)) {
//     if (metaKeys.has(k)) continue;

//     if (k === 'data' && v && typeof v === 'object' && !Array.isArray(v)) {
//       for (const [dk, dv] of Object.entries(v as Record<string, unknown>)) {
//         const empty = isEmptyScalar(dv);
//         fields.push({
//           key: `data.${dk}`,
//           label: labelFromKey(`data.${dk}`),
//           value: dv,
//           empty,
//           wide: dk === 'extraNotes',
//         });
//       }
//       continue;
//     }

//     const empty = isEmptyScalar(v);
//     fields.push({
//       key: k,
//       label: labelFromKey(k),
//       value: v,
//       empty,
//     });
//   }

//   fields.sort((a, b) => Number(b.empty) - Number(a.empty));

//   const missing = fields.filter((f) => f.empty).length;

//   return {
//     fields,
//     missing,
//     total: fields.length,
//   };
// };

// export const WorkboardClient = ({ ready, stalled, upsells, leads }: Props) => {
//   const router = useRouter();
//   const [tab, setTab] = React.useState<TabKey>('ready');

//   const [expanded, setExpanded] = React.useState(false);
//   React.useEffect(() => {
//     setExpanded(false);
//   }, [tab]);

//   const [state, setState] = React.useState(() => ({
//     ready,
//     stalled,
//     upsells,
//     leads,
//   }));

//   const [briefingOpen, setBriefingOpen] = React.useState(false);
//   const [briefingItem, setBriefingItem] = React.useState<ReadyItem | null>(
//     null,
//   );

//   const openBriefing = (item: ReadyItem) => {
//     setBriefingItem(item);
//     setBriefingOpen(true);
//   };

//   const updateStatus = async (
//     kind: 'READY' | 'STALLED' | 'UPSELL' | 'LEAD',
//     refId: string,
//     status: Status,
//   ) => {
//     setState((prev) => {
//       const patch = <T extends { kind: string; refId: string; status: Status }>(
//         arr: T[],
//       ) =>
//         arr.map((x) =>
//           x.refId === refId && x.kind === kind ? { ...x, status } : x,
//         );

//       return {
//         ready: patch(prev.ready),
//         stalled: patch(prev.stalled),
//         upsells: patch(prev.upsells),
//         leads: patch(prev.leads),
//       };
//     });

//     await fetch('/api/admin/workboard', {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({ kind, refId, status }),
//     });

//     router.refresh();
//   };

//   const updateUpsellFollowup = async (
//     orderId: string,
//     action: 'done' | 'undo',
//   ) => {
//     await fetch('/api/admin/upsell-followup', {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({ orderId, action, kind: 'hosting' }),
//     });
//   };

//   const markUpsellDone = async (orderId: string) => {
//     const todayISO = new Date().toISOString().slice(0, 10);

//     setState((prev) => ({
//       ...prev,
//       upsells: prev.upsells.map((u) => {
//         if (u.kind !== 'UPSELL' || u.refId !== orderId) return u;
//         const nextAttempts = (u.attempts ?? 0) + 1;
//         return {
//           ...u,
//           status: 'DONE',
//           attempts: nextAttempts,
//           lastSentAt: todayISO,
//         };
//       }),
//     }));

//     await updateUpsellFollowup(orderId, 'done');
//     await updateStatus('UPSELL', orderId, 'DONE');

//     router.refresh();
//   };

//   const undoUpsellDone = async (orderId: string) => {
//     setState((prev) => ({
//       ...prev,
//       upsells: prev.upsells.map((u) => {
//         if (u.kind !== 'UPSELL' || u.refId !== orderId) return u;
//         const nextAttempts = Math.max(0, (u.attempts ?? 0) - 1);
//         return {
//           ...u,
//           status: 'TODO',
//           attempts: nextAttempts,
//           lastSentAt: nextAttempts === 0 ? null : u.lastSentAt ?? null,
//         };
//       }),
//     }));

//     await updateUpsellFollowup(orderId, 'undo');
//     await updateStatus('UPSELL', orderId, 'TODO');

//     router.refresh();
//   };

//   const splitDone = <T extends { status: Status }>(items: T[]) => {
//     const active = items.filter((i) => i.status !== 'DONE');
//     const done = items.filter((i) => i.status === 'DONE');
//     return { active, done };
//   };

//   const readySplit = splitDone(state.ready);
//   const stalledSplit = splitDone(state.stalled);
//   const leadsSplit = splitDone(state.leads);
//   const upsellSplit = splitDone(state.upsells);

//   const tabs = [
//     {
//       key: 'ready' as const,
//       title: 'Produção',
//       icon: CheckCircle2,
//       count: readySplit.active.length,
//     },
//     {
//       key: 'stalled' as const,
//       title: 'Cobrar',
//       icon: Clock,
//       count: stalledSplit.active.length,
//     },
//     {
//       key: 'leads' as const,
//       title: 'Leads',
//       icon: CreditCard,
//       count: leadsSplit.active.length,
//     },
//     {
//       key: 'upsells' as const,
//       title: 'Upsell',
//       icon: Sparkles,
//       count: upsellSplit.active.length,
//     },
//   ];

//   const activeMeta = tabs.find((t) => t.key === tab)!;

//   const MAX_COLLAPSED = 4;
//   const MAX_EXPANDED = 10;

//   const sliceForView = <T,>(items: T[]) =>
//     items.slice(0, expanded ? MAX_EXPANDED : MAX_COLLAPSED);

//   const showToggle = (len: number) => len > MAX_COLLAPSED;

//   const briefingView = React.useMemo(() => {
//     const b = briefingItem?.briefing;
//     if (!b) return null;
//     return buildBriefingView(b);
//   }, [briefingItem]);

//   return (
//     <div className='grid gap-3'>
//       <Dialog open={briefingOpen} onOpenChange={setBriefingOpen}>
//         <DialogContent className='max-w-3xl max-h-[85vh] overflow-hidden flex flex-col'>
//           <DialogHeader className='shrink-0'>
//             <DialogTitle>Briefing do cliente</DialogTitle>
//           </DialogHeader>

//           <div className='min-h-0 flex-1 overflow-y-auto pr-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden'>
//             {!briefingItem ? (
//               <p className='text-sm text-muted-foreground'>
//                 Nenhum briefing selecionado.
//               </p>
//             ) : !briefingItem.briefing ? (
//               <p className='text-sm text-muted-foreground'>
//                 Este pedido não tem briefing disponível.
//               </p>
//             ) : (
//               <div className='grid gap-4'>
//                 <div className='rounded-xl border p-4'>
//                   <p className='text-sm font-medium'>
//                     {briefingItem.email} • {briefingItem.product}
//                   </p>
//                   {briefingView ? (
//                     <p className='mt-1 text-xs text-muted-foreground'>
//                       Campos vazios: {briefingView.missing} de{' '}
//                       {briefingView.total}
//                     </p>
//                   ) : null}
//                 </div>

//                 <div className='grid gap-2'>
//                   <p className='text-xs font-medium text-muted-foreground'>
//                     Campos do formulário
//                   </p>

//                   <div className='grid gap-2 sm:grid-cols-2'>
//                     {(briefingView?.fields ?? []).map((f) => (
//                       <div
//                         key={f.key}
//                         className={[
//                           'rounded-xl border p-3',
//                           f.empty ? 'border-amber-200 bg-amber-50' : '',
//                           f.wide ? 'sm:col-span-2' : '',
//                         ].join(' ')}
//                       >
//                         <div className='flex items-start justify-between gap-3'>
//                           <p
//                             className={[
//                               'text-xs font-medium',
//                               f.empty
//                                 ? 'text-amber-900'
//                                 : 'text-muted-foreground',
//                             ].join(' ')}
//                           >
//                             {f.label}
//                           </p>

//                           {f.empty ? (
//                             <Badge
//                               variant='outline'
//                               className='border-amber-200 bg-amber-50 text-amber-900'
//                             >
//                               Vazio
//                             </Badge>
//                           ) : (
//                             <Badge
//                               variant='outline'
//                               className='border-emerald-200 bg-emerald-50 text-emerald-900'
//                             >
//                               Preenchido
//                             </Badge>
//                           )}
//                         </div>

//                         <div className='mt-2 max-h-28 overflow-auto whitespace-pre-wrap wrap-break-word text-sm'>
//                           {formatValue(f.value) || '-'}
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 </div>

//                 <div className='flex justify-end gap-2'>
//                   <Button
//                     variant='outline'
//                     className='h-9'
//                     onClick={() => setBriefingOpen(false)}
//                   >
//                     Fechar
//                   </Button>

//                   {briefingItem?.href ? (
//                     <Link href={briefingItem.href}>
//                       <Button variant='outline' className='h-9'>
//                         Ver pedido
//                       </Button>
//                     </Link>
//                   ) : null}
//                 </div>
//               </div>
//             )}
//           </div>
//         </DialogContent>
//       </Dialog>

//       <Card className='rounded-2xl border bg-card shadow-sm'>
//         <div className='px-6'>
//           <div className='flex items-start justify-between gap-3'>
//             <div>
//               <p className='text-sm font-semibold'>Filas do dia</p>
//               <p className='mt-1 text-xs text-muted-foreground'>
//                 Selecione uma fila para executar agora.
//               </p>
//             </div>

//             <Badge variant='secondary'>Ativo: {activeMeta.title}</Badge>
//           </div>
//         </div>

//         <Separator />

//         <div className='px-5'>
//           <div className='flex flex-wrap gap-2'>
//             {tabs.map((t) => (
//               <Pill
//                 key={t.key}
//                 active={tab === t.key}
//                 onClick={() => setTab(t.key)}
//                 icon={t.icon}
//                 title={t.title}
//                 count={t.count}
//               />
//             ))}
//           </div>
//         </div>
//       </Card>

//       {/* READY */}
//       {tab === 'ready' ? (
//         <Card className='rounded-2xl border bg-card shadow-sm'>
//           <div className='px-5'>
//             <div className='flex items-start justify-between gap-3'>
//               <div>
//                 <p className='text-sm font-semibold'>1) Produção</p>
//                 <p className='mt-1 text-xs text-muted-foreground'>
//                   Trabalhos que viram entrega agora.
//                 </p>
//               </div>
//               <Badge variant='secondary'>
//                 Ativos: {readySplit.active.length} • Concluídos:{' '}
//                 {readySplit.done.length}
//               </Badge>
//             </div>
//           </div>

//           <Separator />

//           <div className='px-5'>
//             <div className='grid gap-2'>
//               {readySplit.active.length === 0 ? (
//                 <p className='text-sm text-muted-foreground'>
//                   Nenhum item ativo.
//                 </p>
//               ) : (
//                 sliceForView(readySplit.active).map((o) => (
//                   <Row
//                     key={o.refId}
//                     left={
//                       <>
//                         <p className='truncate text-sm font-medium'>
//                           {o.email} • {o.product}
//                         </p>
//                         <p className='mt-1 text-xs text-muted-foreground'>
//                           Status: {statusLabel[o.status]}
//                         </p>
//                       </>
//                     }
//                     right={
//                       <div className='flex items-center gap-2'>
//                         <Badge
//                           variant='outline'
//                           className={statusBadgeClass(o.status)}
//                         >
//                           {statusLabel[o.status]}
//                         </Badge>

//                         <Button
//                           type='button'
//                           variant='outline'
//                           className='h-9 gap-2'
//                           onClick={() => openBriefing(o)}
//                         >
//                           Ver briefing <ArrowRight className='h-4 w-4' />
//                         </Button>

//                         <Button
//                           className='h-9'
//                           variant='outline'
//                           onClick={() => updateStatus('READY', o.refId, 'DONE')}
//                         >
//                           Marcar feito
//                         </Button>
//                       </div>
//                     }
//                   />
//                 ))
//               )}

//               {showToggle(readySplit.active.length) ? (
//                 <div className='flex justify-end'>
//                   <Button
//                     variant='outline'
//                     className='h-9'
//                     onClick={() => setExpanded((v) => !v)}
//                   >
//                     {expanded ? 'Ver menos' : 'Ver todos'}
//                   </Button>
//                 </div>
//               ) : null}

//               {expanded && readySplit.active.length > MAX_EXPANDED ? (
//                 <p className='text-xs text-muted-foreground'>
//                   Mostrando {MAX_EXPANDED} de {readySplit.active.length}.
//                 </p>
//               ) : null}

//               {readySplit.done.length > 0 ? (
//                 <div className='mt-3'>
//                   <p className='mb-2 text-xs font-medium text-muted-foreground'>
//                     Concluídos
//                   </p>
//                   <div className='grid gap-2'>
//                     {readySplit.done.map((o) => (
//                       <Row
//                         key={o.refId}
//                         muted
//                         left={
//                           <p className='truncate text-sm font-medium'>
//                             {o.email} • {o.product}
//                           </p>
//                         }
//                         right={
//                           <div className='flex items-center gap-2'>
//                             <Badge
//                               variant='outline'
//                               className={statusBadgeClass('DONE')}
//                             >
//                               Concluído
//                             </Badge>
//                             <Button
//                               className='h-9'
//                               variant='outline'
//                               onClick={() =>
//                                 updateStatus('READY', o.refId, 'TODO')
//                               }
//                             >
//                               Reabrir
//                             </Button>
//                           </div>
//                         }
//                       />
//                     ))}
//                   </div>
//                 </div>
//               ) : null}
//             </div>
//           </div>
//         </Card>
//       ) : null}

//       {/* STALLED */}
//       {tab === 'stalled' ? (
//         <Card className='rounded-2xl border bg-card shadow-sm'>
//           <div className='px-5'>
//             <div className='flex items-start justify-between gap-3'>
//               <div>
//                 <p className='text-sm font-semibold'>
//                   2) Onboarding parado (2+ dias)
//                 </p>
//                 <p className='mt-1 text-xs text-muted-foreground'>
//                   Briefings não enviados após 2 dias exigem contato.
//                 </p>
//               </div>
//               <Badge variant='secondary'>
//                 Ativos: {stalledSplit.active.length} • Concluídos:{' '}
//                 {stalledSplit.done.length}
//               </Badge>
//             </div>
//           </div>

//           <Separator />

//           <div className='px-5 py-2 sm:py-3'>
//             <div className='grid gap-2'>
//               {stalledSplit.active.length === 0 ? (
//                 <p className='text-sm text-muted-foreground'>
//                   Nenhum item ativo.
//                 </p>
//               ) : (
//                 sliceForView(stalledSplit.active).map((b) => (
//                   <Row
//                     key={b.refId}
//                     left={
//                       <>
//                         <p className='truncate text-sm font-medium'>
//                           {b.email} • {b.product}
//                         </p>
//                         <p className='mt-1 text-xs text-muted-foreground'>
//                           {b.updatedAt}
//                         </p>
//                       </>
//                     }
//                     right={
//                       <div className='flex items-center gap-2'>
//                         <Badge
//                           variant='outline'
//                           className={statusBadgeClass(b.status)}
//                         >
//                           {statusLabel[b.status]}
//                         </Badge>

//                         {b.emailLink ? (
//                           <a
//                             href={b.emailLink}
//                             target='_blank'
//                             rel='noreferrer'
//                           >
//                             <Button className='h-9 gap-2' variant='outline'>
//                               <Mail className='h-4 w-4' />
//                               E-mail
//                             </Button>
//                           </a>
//                         ) : (
//                           <Button
//                             className='h-9 gap-2'
//                             variant='outline'
//                             disabled
//                           >
//                             <Mail className='h-4 w-4' />
//                             E-mail
//                           </Button>
//                         )}

//                         {b.whatsappLink ? (
//                           <a
//                             href={b.whatsappLink}
//                             target='_blank'
//                             rel='noreferrer'
//                           >
//                             <Button className='h-9 gap-2' variant='outline'>
//                               <MessageCircle className='h-4 w-4' />
//                               WhatsApp
//                             </Button>
//                           </a>
//                         ) : (
//                           <Button
//                             className='h-9 gap-2'
//                             variant='outline'
//                             disabled
//                           >
//                             <MessageCircle className='h-4 w-4' />
//                             WhatsApp
//                           </Button>
//                         )}

//                         <Button
//                           className='h-9'
//                           variant='outline'
//                           onClick={() =>
//                             updateStatus('STALLED', b.refId, 'DONE')
//                           }
//                         >
//                           Marcar feito
//                         </Button>
//                       </div>
//                     }
//                   />
//                 ))
//               )}

//               {showToggle(stalledSplit.active.length) ? (
//                 <div className='flex justify-end'>
//                   <Button
//                     variant='outline'
//                     className='h-9'
//                     onClick={() => setExpanded((v) => !v)}
//                   >
//                     {expanded ? 'Ver menos' : 'Ver todos'}
//                   </Button>
//                 </div>
//               ) : null}

//               {expanded && stalledSplit.active.length > MAX_EXPANDED ? (
//                 <p className='text-xs text-muted-foreground'>
//                   Mostrando {MAX_EXPANDED} de {stalledSplit.active.length}.
//                 </p>
//               ) : null}

//               {stalledSplit.done.length > 0 ? (
//                 <div className='mt-3'>
//                   <p className='mb-2 text-xs font-medium text-muted-foreground'>
//                     Concluídos
//                   </p>

//                   <div className='grid gap-2'>
//                     {stalledSplit.done.map((b) => (
//                       <Row
//                         key={b.refId}
//                         muted
//                         left={
//                           <>
//                             <p className='truncate text-sm font-medium'>
//                               {b.email} • {b.product}
//                             </p>
//                             <p className='mt-1 text-xs text-muted-foreground'>
//                               {b.updatedAt}
//                             </p>
//                           </>
//                         }
//                         right={
//                           <div className='flex items-center gap-2'>
//                             <Badge
//                               variant='outline'
//                               className={statusBadgeClass('DONE')}
//                             >
//                               Concluído
//                             </Badge>

//                             <Button
//                               className='h-9'
//                               variant='outline'
//                               onClick={() =>
//                                 updateStatus('STALLED', b.refId, 'TODO')
//                               }
//                             >
//                               Reabrir
//                             </Button>
//                           </div>
//                         }
//                       />
//                     ))}
//                   </div>
//                 </div>
//               ) : null}
//             </div>
//           </div>
//         </Card>
//       ) : null}

//       {/* LEADS */}
//       {tab === 'leads' ? (
//         <Card className='rounded-2xl border bg-card shadow-sm'>
//           <div className='px-5 '>
//             <div className='flex items-start justify-between gap-3'>
//               <div>
//                 <p className='text-sm font-semibold'>3) Leads</p>
//                 <p className='mt-1 text-xs text-muted-foreground'>
//                   Triagem e direcionamento.
//                 </p>
//               </div>
//               <Badge variant='secondary'>
//                 Ativos: {leadsSplit.active.length} • Concluídos:{' '}
//                 {leadsSplit.done.length}
//               </Badge>
//             </div>
//           </div>

//           <Separator />

//           <div className='px-5 py-2 sm:py-3'>
//             <div className='grid gap-2'>
//               {leadsSplit.active.length === 0 ? (
//                 <p className='text-sm text-muted-foreground'>
//                   Nenhum item ativo.
//                 </p>
//               ) : (
//                 sliceForView(leadsSplit.active).map((l) => (
//                   <Row
//                     key={l.refId}
//                     left={
//                       <>
//                         <p className='truncate text-sm font-medium'>
//                           {l.name} • {l.email}
//                         </p>

//                         <p className='mt-1 line-clamp-1 text-xs text-muted-foreground wrap-break-word'>
//                           {l.message} • Origem: {l.landingPath}
//                         </p>
//                       </>
//                     }
//                     right={
//                       <div className='flex items-center gap-2'>
//                         <Badge
//                           variant='outline'
//                           className={[
//                             leadStatusBadgeClass(l.leadStatus),
//                             'min-w-26 justify-center',
//                           ].join(' ')}
//                         >
//                           {leadStatusLabel[l.leadStatus]}
//                         </Badge>

//                         {l.whatsappLink ? (
//                           <a
//                             href={l.whatsappLink}
//                             target='_blank'
//                             rel='noreferrer'
//                           >
//                             <Button className='h-9 gap-2' variant='outline'>
//                               <MessageCircle className='h-4 w-4' />
//                               WhatsApp
//                             </Button>
//                           </a>
//                         ) : (
//                           <Button
//                             className='h-9 gap-2'
//                             variant='outline'
//                             disabled
//                           >
//                             <MessageCircle className='h-4 w-4' />
//                             WhatsApp
//                           </Button>
//                         )}

//                         <Button
//                           className='h-9 gap-2'
//                           onClick={() => updateStatus('LEAD', l.refId, 'DONE')}
//                         >
//                           <CheckCircle2 className='h-4 w-4' />
//                           Feito
//                         </Button>
//                       </div>
//                     }
//                   />
//                 ))
//               )}

//               {showToggle(leadsSplit.active.length) ? (
//                 <div className='flex justify-end'>
//                   <Button
//                     variant='outline'
//                     className='h-9'
//                     onClick={() => setExpanded((v) => !v)}
//                   >
//                     {expanded ? 'Ver menos' : 'Ver todos'}
//                   </Button>
//                 </div>
//               ) : null}

//               {expanded && leadsSplit.active.length > MAX_EXPANDED ? (
//                 <p className='text-xs text-muted-foreground'>
//                   Mostrando {MAX_EXPANDED} de {leadsSplit.active.length}.
//                 </p>
//               ) : null}

//               {leadsSplit.done.length > 0 ? (
//                 <div className='mt-3'>
//                   <p className='mb-2 text-xs font-medium text-muted-foreground'>
//                     Concluídos
//                   </p>

//                   <div className='grid gap-2'>
//                     {leadsSplit.done.map((l) => (
//                       <Row
//                         key={l.refId}
//                         muted
//                         left={
//                           <>
//                             <p className='truncate text-sm font-medium'>
//                               {l.name} • {l.email}
//                             </p>
//                             <p className='mt-1 line-clamp-1 text-xs text-muted-foreground wrap-break-word'>
//                               {l.message} • Origem: {l.landingPath}
//                             </p>
//                           </>
//                         }
//                         right={
//                           <div className='flex items-center gap-2'>
//                             <Badge
//                               variant='outline'
//                               className={[
//                                 leadStatusBadgeClass(l.leadStatus),
//                                 'min-w-26 justify-center',
//                               ].join(' ')}
//                             >
//                               {leadStatusLabel[l.leadStatus]}
//                             </Badge>

//                             <Button
//                               className='h-9'
//                               variant='outline'
//                               onClick={() =>
//                                 updateStatus('LEAD', l.refId, 'TODO')
//                               }
//                             >
//                               Reabrir
//                             </Button>
//                           </div>
//                         }
//                       />
//                     ))}
//                   </div>
//                 </div>
//               ) : null}
//             </div>
//           </div>
//         </Card>
//       ) : null}

//       {/* UPSELL */}
//       {tab === 'upsells' ? (
//         <Card className='rounded-2xl border bg-card shadow-sm'>
//           <div className='px-5'>
//             <div className='flex items-start justify-between gap-3'>
//               <div>
//                 <p className='text-sm font-semibold'>4) Upsell</p>
//                 <p className='mt-1 text-xs text-muted-foreground'>
//                   Aqui aparecem apenas os upsells do checkout que estão na hora
//                   de enviar mensagem.
//                 </p>
//               </div>
//               <Badge variant='secondary'>
//                 Ativos: {upsellSplit.active.length} • Em acompanhamento:{' '}
//                 {upsellSplit.done.length}
//               </Badge>
//             </div>
//           </div>

//           <Separator />

//           <div className='px-5 py-2 sm:py-3'>
//             <div className='grid gap-2'>
//               {upsellSplit.active.length === 0 ? (
//                 <p className='text-sm text-muted-foreground'>
//                   Nenhum upsell disponível para envio agora.
//                 </p>
//               ) : (
//                 sliceForView(upsellSplit.active).map((u) => (
//                   <Row
//                     key={u.refId}
//                     left={
//                       <>
//                         <p className='truncate text-sm font-medium'>
//                           {u.email} • {u.product}
//                         </p>
//                         <p className='mt-1 text-xs text-muted-foreground'>
//                           Tentativas: {u.attempts ?? 0} • Último envio:{' '}
//                           {u.lastSentAt ?? 'nunca'} • Criado em: {u.createdAt}
//                         </p>
//                       </>
//                     }
//                     right={
//                       <div className='flex items-center gap-2'>
//                         <Badge
//                           variant='outline'
//                           className={statusBadgeClass(u.status)}
//                         >
//                           {statusLabel[u.status]}
//                         </Badge>

//                         <Link href={u.href}>
//                           <Button className='h-9' variant='outline'>
//                             Ver
//                           </Button>
//                         </Link>

//                         <Button
//                           className='h-9 gap-2'
//                           onClick={() => markUpsellDone(u.refId)}
//                         >
//                           <CheckCircle2 className='h-4 w-4' />
//                           Feito
//                         </Button>
//                       </div>
//                     }
//                   />
//                 ))
//               )}

//               {showToggle(upsellSplit.active.length) ? (
//                 <div className='flex justify-end'>
//                   <Button
//                     variant='outline'
//                     className='h-9'
//                     onClick={() => setExpanded((v) => !v)}
//                   >
//                     {expanded ? 'Ver menos' : 'Ver todos'}
//                   </Button>
//                 </div>
//               ) : null}

//               {expanded && upsellSplit.active.length > MAX_EXPANDED ? (
//                 <p className='text-xs text-muted-foreground'>
//                   Mostrando {MAX_EXPANDED} de {upsellSplit.active.length}.
//                 </p>
//               ) : null}

//               {upsellSplit.done.length > 0 ? (
//                 <div className='mt-3'>
//                   <p className='mb-2 text-xs font-medium text-muted-foreground'>
//                     Em acompanhamento
//                   </p>

//                   <div className='grid gap-2'>
//                     {upsellSplit.done.map((u) => (
//                       <Row
//                         key={u.refId}
//                         muted
//                         left={
//                           <>
//                             <p className='truncate text-sm font-medium'>
//                               {u.email} • {u.product}
//                             </p>
//                             <p className='mt-1 text-xs text-muted-foreground'>
//                               Tentativas: {u.attempts ?? 0} • Último envio:{' '}
//                               {u.lastSentAt ?? 'nunca'}
//                             </p>
//                           </>
//                         }
//                         right={
//                           <div className='flex items-center gap-2'>
//                             <Badge
//                               variant='outline'
//                               className={statusBadgeClass('DONE')}
//                             >
//                               Concluído
//                             </Badge>

//                             <Button
//                               className='h-9'
//                               variant='outline'
//                               onClick={() => undoUpsellDone(u.refId)}
//                             >
//                               Desfazer
//                             </Button>
//                           </div>
//                         }
//                       />
//                     ))}
//                   </div>
//                 </div>
//               ) : null}
//             </div>
//           </div>
//         </Card>
//       ) : null}
//     </div>
//   );
// };

'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle2, Clock, CreditCard, Sparkles } from 'lucide-react';
import {
  Props,
  ReadyItem,
  Status,
  TabKey,
  TabMeta,
} from './components/workboard-client/workboard-client.types';
import { buildBriefingView } from './components/workboard-client/workboard-client.briefing';
import { WorkboardBriefingDialog } from './components/workboard-client/workboard-briefing-dialog';
import { WorkboardTabsCard } from './components/workboard-client/workboard-tabs-card';
import { WorkboardReadySection } from './components/workboard-client/session/workboard-ready-section';
import { WorkboardStalledSection } from './components/workboard-client/session/workboard-stalled-section';
import { WorkboardLeadsSection } from './components/workboard-client/session/workboard-leads-section';
import { WorkboardUpsellsSection } from './components/workboard-client/session/workboard-upsells-section';

export const WorkboardClient = ({ ready, stalled, upsells, leads }: Props) => {
  const router = useRouter();
  const [tab, setTab] = React.useState<TabKey>('ready');

  const [expanded, setExpanded] = React.useState(false);
  React.useEffect(() => {
    setExpanded(false);
  }, [tab]);

  const [state, setState] = React.useState(() => ({
    ready,
    stalled,
    upsells,
    leads,
  }));

  const [briefingOpen, setBriefingOpen] = React.useState(false);
  const [briefingItem, setBriefingItem] = React.useState<ReadyItem | null>(
    null,
  );

  const openBriefing = (item: ReadyItem) => {
    setBriefingItem(item);
    setBriefingOpen(true);
  };

  const updateStatus = async (
    kind: 'READY' | 'STALLED' | 'UPSELL' | 'LEAD',
    refId: string,
    status: Status,
  ) => {
    setState((prev) => {
      const patch = <T extends { kind: string; refId: string; status: Status }>(
        arr: T[],
      ) =>
        arr.map((x) =>
          x.refId === refId && x.kind === kind ? { ...x, status } : x,
        );

      return {
        ready: patch(prev.ready),
        stalled: patch(prev.stalled),
        upsells: patch(prev.upsells),
        leads: patch(prev.leads),
      };
    });

    await fetch('/api/admin/workboard', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ kind, refId, status }),
    });

    router.refresh();
  };

  const updateUpsellFollowup = async (
    orderId: string,
    action: 'done' | 'undo',
  ) => {
    await fetch('/api/admin/upsell-followup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ orderId, action, kind: 'hosting' }),
    });
  };

  const markUpsellDone = async (orderId: string) => {
    const todayISO = new Date().toISOString().slice(0, 10);

    setState((prev) => ({
      ...prev,
      upsells: prev.upsells.map((u) => {
        if (u.kind !== 'UPSELL' || u.refId !== orderId) return u;
        const nextAttempts = (u.attempts ?? 0) + 1;
        return {
          ...u,
          status: 'DONE',
          attempts: nextAttempts,
          lastSentAt: todayISO,
        };
      }),
    }));

    await updateUpsellFollowup(orderId, 'done');
    await updateStatus('UPSELL', orderId, 'DONE');

    router.refresh();
  };

  const undoUpsellDone = async (orderId: string) => {
    setState((prev) => ({
      ...prev,
      upsells: prev.upsells.map((u) => {
        if (u.kind !== 'UPSELL' || u.refId !== orderId) return u;
        const nextAttempts = Math.max(0, (u.attempts ?? 0) - 1);
        return {
          ...u,
          status: 'TODO',
          attempts: nextAttempts,
          lastSentAt: nextAttempts === 0 ? null : u.lastSentAt ?? null,
        };
      }),
    }));

    await updateUpsellFollowup(orderId, 'undo');
    await updateStatus('UPSELL', orderId, 'TODO');

    router.refresh();
  };

  const splitDone = <T extends { status: Status }>(items: T[]) => {
    const active = items.filter((i) => i.status !== 'DONE');
    const done = items.filter((i) => i.status === 'DONE');
    return { active, done };
  };

  const readySplit = splitDone(state.ready);
  const stalledSplit = splitDone(state.stalled);
  const leadsSplit = splitDone(state.leads);
  const upsellSplit = splitDone(state.upsells);

  const tabs: TabMeta[] = [
    {
      key: 'ready',
      title: 'Produção',
      icon: CheckCircle2,
      count: readySplit.active.length,
    },
    {
      key: 'stalled',
      title: 'Cobrar',
      icon: Clock,
      count: stalledSplit.active.length,
    },
    {
      key: 'leads',
      title: 'Leads',
      icon: CreditCard,
      count: leadsSplit.active.length,
    },
    {
      key: 'upsells',
      title: 'Upsell',
      icon: Sparkles,
      count: upsellSplit.active.length,
    },
  ];

  const activeMeta = tabs.find((t) => t.key === tab)!;

  const MAX_COLLAPSED = 4;
  const MAX_EXPANDED = 10;

  const briefingView = React.useMemo(() => {
    const b = briefingItem?.briefing;
    if (!b) return null;
    return buildBriefingView(b);
  }, [briefingItem]);

  return (
    <div className='grid gap-3'>
      <WorkboardBriefingDialog
        open={briefingOpen}
        onOpenChange={setBriefingOpen}
        item={briefingItem}
        briefingView={briefingView}
        onClose={() => setBriefingOpen(false)}
      />

      <WorkboardTabsCard
        tab={tab}
        onTabChange={setTab}
        tabs={tabs}
        activeTitle={activeMeta.title}
      />

      {tab === 'ready' ? (
        <WorkboardReadySection
          split={readySplit}
          expanded={expanded}
          maxCollapsed={MAX_COLLAPSED}
          maxExpanded={MAX_EXPANDED}
          onToggleExpanded={() => setExpanded((v) => !v)}
          onOpenBriefing={openBriefing}
          onUpdateStatus={updateStatus}
        />
      ) : null}

      {tab === 'stalled' ? (
        <WorkboardStalledSection
          split={stalledSplit}
          expanded={expanded}
          maxCollapsed={MAX_COLLAPSED}
          maxExpanded={MAX_EXPANDED}
          onToggleExpanded={() => setExpanded((v) => !v)}
          onUpdateStatus={updateStatus}
        />
      ) : null}

      {tab === 'leads' ? (
        <WorkboardLeadsSection
          split={leadsSplit}
          expanded={expanded}
          maxCollapsed={MAX_COLLAPSED}
          maxExpanded={MAX_EXPANDED}
          onToggleExpanded={() => setExpanded((v) => !v)}
          onUpdateStatus={updateStatus}
        />
      ) : null}

      {tab === 'upsells' ? (
        <WorkboardUpsellsSection
          split={upsellSplit}
          expanded={expanded}
          maxCollapsed={MAX_COLLAPSED}
          maxExpanded={MAX_EXPANDED}
          onToggleExpanded={() => setExpanded((v) => !v)}
          onMarkDone={markUpsellDone}
          onUndoDone={undoUpsellDone}
        />
      ) : null}
    </div>
  );
};

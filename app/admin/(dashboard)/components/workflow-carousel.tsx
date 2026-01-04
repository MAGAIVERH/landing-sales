// 'use client';

// import * as React from 'react';
// import Link from 'next/link';
// import {
//   CheckCircle2,
//   Clock,
//   CreditCard,
//   Sparkles,
//   MessageCircle,
//   ArrowRight,
//   LayoutGrid,
//   Mail,
// } from 'lucide-react';

// import { Button } from '@/components/ui/button';
// import { Card } from '@/components/ui/card';
// import { Badge } from '@/components/ui/badge';
// import { Separator } from '@/components/ui/separator';
// import {
//   Sheet,
//   SheetContent,
//   SheetHeader,
//   SheetTitle,
//   SheetTrigger,
// } from '@/components/ui/sheet';

// import { useSearchParams } from 'next/navigation';
// import { isTabKey } from '@/lib/admin-workflow';

// type ReadyItem = {
//   orderId: string;
//   email: string;
//   product: string;
//   total: string;
// };

// type StalledItem = {
//   orderId: string;
//   email: string;
//   product: string;
//   updatedAt: string;
//   whatsappLink?: string | null; // mailto
// };

// type UpsellItem = {
//   orderId: string;
//   email: string;
//   product: string;
//   createdAt: string;
//   tag: 'PENDING' | 'NOT_CONTRACTED';
// };

// type LeadItem = {
//   id: string;
//   name: string;
//   email: string;
//   message: string;
//   landingPath: string;
//   whatsappLink?: string | null;
// };

// type Props = {
//   ready: ReadyItem[];
//   stalled: StalledItem[];
//   upsells: UpsellItem[];
//   leads: LeadItem[];
// };

// type TabKey = 'ready' | 'stalled' | 'upsell' | 'leads';

// const MAX_COLLAPSED = 4;

// // (mantém o comportamento antigo para as outras abas)
// const PAGE_SIZE_DEFAULT = 4;

// // ✅ apenas upsell: máximo 20 por página quando expandido
// const PAGE_SIZE_UPSELL = 20;

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
//         'outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
//         'focus-visible:ring-offset-background',
//         'active:translate-y-0',
//         'disabled:pointer-events-none disabled:opacity-50',
//         active
//           ? 'bg-primary text-primary-foreground border-primary/30 hover:bg-primary/90 active:bg-primary/90 focus:bg-primary/90'
//           : 'bg-background hover:bg-muted/40 active:bg-muted/40 focus:bg-muted/40',
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

// const ListShell = ({
//   title,
//   subtitle,
//   children,
//   footer,
// }: {
//   title: string;
//   subtitle: string;
//   children: React.ReactNode;
//   footer?: React.ReactNode;
// }) => {
//   return (
//     <Card className='rounded-2xl border bg-card shadow-sm'>
//       <div className='px-4 py-2 sm:px-5 sm:py-2'>
//         <div className='flex items-start justify-between gap-3'>
//           <div>
//             <p className='text-sm font-semibold'>{title}</p>
//             <p className='mt-1 text-xs text-muted-foreground'>{subtitle}</p>
//           </div>
//         </div>
//       </div>

//       <Separator />

//       <div className='px-4 py-2 sm:px-5 '>
//         {children}
//         {footer ? <div className='mt-4 flex justify-end'>{footer}</div> : null}
//       </div>
//     </Card>
//   );
// };

// const Row = ({
//   title,
//   subtitle,
//   right,
// }: {
//   title: string;
//   subtitle: string;
//   right: React.ReactNode;
// }) => {
//   return (
//     <div className='flex items-start justify-between gap-3 rounded-xl border bg-background px-3 py-3'>
//       <div className='min-w-0 flex-1'>
//         <p className='truncate text-sm font-medium'>{title}</p>

//         <p className='mt-0.5 line-clamp-2 text-xs text-muted-foreground wrap-break-word '>
//           {subtitle}
//         </p>
//       </div>

//       <div className='shrink-0'>{right}</div>
//     </div>
//   );
// };

// // ✅ badges do upsell no mesmo padrão visual da Operação
// const upsellBadge = (tag: UpsellItem['tag']) => {
//   if (tag === 'PENDING') {
//     return {
//       label: 'Pendente',
//       className: 'border-amber-200 bg-amber-50 text-amber-900',
//     };
//   }

//   return {
//     label: 'Não contratou',
//     className: 'border-muted bg-muted/40 text-muted-foreground',
//   };
// };

// export const WorkflowCarousel = ({ ready, stalled, upsells, leads }: Props) => {
//   const [tab, setTab] = React.useState<TabKey>('ready');
//   const [open, setOpen] = React.useState(false);
//   const [expanded, setExpanded] = React.useState(false);
//   const [page, setPage] = React.useState(0);

//   React.useEffect(() => {
//     setExpanded(false);
//     setPage(0);
//   }, [tab]);

//   const searchParams = useSearchParams();
//   const tabParam = searchParams.get('tab');

//   React.useEffect(() => {
//     if (isTabKey(tabParam)) setTab(tabParam);
//   }, [tabParam]);

//   const tabs = [
//     {
//       key: 'ready' as const,
//       title: 'Produção',
//       icon: CheckCircle2,
//       count: ready.length,
//       hint: 'Pago + briefing concluído. É o que vira entrega agora.',
//     },
//     {
//       key: 'stalled' as const,
//       title: 'Cobrar',
//       icon: Clock,
//       count: stalled.length,
//       hint: 'Briefings parados. Ação: cobrar cliente para concluir.',
//     },
//     {
//       key: 'leads' as const,
//       title: 'Leads',
//       icon: CreditCard,
//       count: leads.length,
//       hint: 'Triagem. Responder e direcionar o próximo passo.',
//     },
//     {
//       key: 'upsell' as const,
//       title: 'Upsell',
//       icon: Sparkles,
//       count: upsells.length,
//       hint: 'Visibilidade. Não é prioridade operacional diária.',
//     },
//   ];

//   const activeMeta = tabs.find((t) => t.key === tab)!;

//   const showToggle = (len: number) => len > MAX_COLLAPSED;

//   const pageSizeForTab = (t: TabKey) =>
//     t === 'upsell' ? PAGE_SIZE_UPSELL : PAGE_SIZE_DEFAULT;

//   const totalPages = (len: number, t: TabKey) =>
//     Math.max(1, Math.ceil(len / pageSizeForTab(t)));

//   const goPrev = (len: number, t: TabKey) =>
//     setPage((p) => Math.max(0, Math.min(p - 1, totalPages(len, t) - 1)));

//   const goNext = (len: number, t: TabKey) =>
//     setPage((p) => Math.max(0, Math.min(p + 1, totalPages(len, t) - 1)));

//   const sliceForView = <T,>(items: T[], t: TabKey) => {
//     if (!expanded) return items.slice(0, MAX_COLLAPSED);

//     const size = pageSizeForTab(t);
//     const start = page * size;
//     return items.slice(start, start + size);
//   };

//   const footerWithOrders = (len: number, t: TabKey) => {
//     return (
//       <div className='flex items-center justify-between gap-2'>
//         <div>
//           {showToggle(len) ? (
//             <Button
//               type='button'
//               variant='outline'
//               className='h-9'
//               onClick={() => {
//                 setExpanded((v) => !v);
//                 setPage(0);
//               }}
//             >
//               {expanded ? 'Ver menos' : 'Ver todos'}
//             </Button>
//           ) : null}
//         </div>

//         {expanded && totalPages(len, t) > 1 ? (
//           <div className='flex items-center gap-2'>
//             <Button
//               type='button'
//               variant='outline'
//               className='h-9'
//               disabled={page <= 0}
//               onClick={() => goPrev(len, t)}
//             >
//               Anterior
//             </Button>

//             <Button
//               type='button'
//               variant='outline'
//               className='h-9'
//               disabled={page >= totalPages(len, t) - 1}
//               onClick={() => goNext(len, t)}
//             >
//               Próximo
//             </Button>

//             <span className='text-xs text-muted-foreground'>
//               {page + 1}/{totalPages(len, t)}
//             </span>
//           </div>
//         ) : null}

//         <Link href='/admin/orders'>
//           <Button variant='outline' className='h-9 gap-2'>
//             Ver pedidos <ArrowRight className='h-4 w-4' />
//           </Button>
//         </Link>
//       </div>
//     );
//   };

//   const footerLeadsOnly = (len: number) => {
//     return (
//       <div className='flex justify-end'>
//         {showToggle(len) ? (
//           <Button
//             type='button'
//             variant='outline'
//             className='h-9'
//             onClick={() => setExpanded((v) => !v)}
//           >
//             {expanded ? 'Ver menos' : 'Ver todos'}
//           </Button>
//         ) : null}
//       </div>
//     );
//   };

//   const content = (
//     <div className='grid gap-3 mt-6'>
//       {tab === 'ready' ? (
//         <ListShell
//           title='Prontos para produção'
//           subtitle={activeMeta.hint}
//           footer={footerWithOrders(ready.length, 'ready')}
//         >
//           {ready.length === 0 ? (
//             <div className='rounded-xl border bg-muted/20 px-3 py-3'>
//               <p className='text-sm text-muted-foreground'>
//                 Nenhum pronto no momento.
//               </p>
//             </div>
//           ) : (
//             <div className='grid gap-2'>
//               {sliceForView(ready, 'ready').map((o) => (
//                 <Row
//                   key={o.orderId}
//                   title={`${o.email} • ${o.product}`}
//                   subtitle={`Total: ${o.total}`}
//                   right={
//                     <Link href={`/admin/orders/${o.orderId}`}>
//                       <Button className='h-9 gap-2' variant='outline'>
//                         Abrir briefing <ArrowRight className='h-4 w-4' />
//                       </Button>
//                     </Link>
//                   }
//                 />
//               ))}
//             </div>
//           )}
//         </ListShell>
//       ) : null}

//       {tab === 'stalled' ? (
//         <ListShell
//           title='Onboarding parado (2+ dias)'
//           subtitle={activeMeta.hint}
//           footer={footerWithOrders(stalled.length, 'stalled')}
//         >
//           {stalled.length === 0 ? (
//             <div className='rounded-xl border bg-muted/20 px-3 py-3'>
//               <p className='text-sm text-muted-foreground'>
//                 Nenhum onboarding parado.
//               </p>
//             </div>
//           ) : (
//             <div className='grid gap-2'>
//               {sliceForView(stalled, 'stalled').map((b) => (
//                 <Row
//                   key={b.orderId}
//                   title={`${b.email} • ${b.product}`}
//                   subtitle={b.updatedAt}
//                   right={
//                     <div className='flex items-center gap-2'>
//                       {b.whatsappLink ? (
//                         <Button
//                           type='button'
//                           className='h-9 gap-2'
//                           variant='outline'
//                           onClick={() => {
//                             window.open(
//                               b.whatsappLink!,
//                               '_blank',
//                               'noopener,noreferrer',
//                             );
//                           }}
//                         >
//                           <Mail className='h-4 w-4' />
//                           E-mail
//                         </Button>
//                       ) : (
//                         <Button
//                           type='button'
//                           className='h-9 gap-2'
//                           variant='outline'
//                           disabled
//                         >
//                           <Mail className='h-4 w-4' />
//                           E-mail
//                         </Button>
//                       )}

//                       <Link href={`/admin/orders/${b.orderId}`}>
//                         <Button className='h-9' variant='outline'>
//                           Ver
//                         </Button>
//                       </Link>
//                     </div>
//                   }
//                 />
//               ))}
//             </div>
//           )}
//         </ListShell>
//       ) : null}

//       {/* ✅ UPSSELL: badges padronizadas + 20 por página quando expandido */}
//       {tab === 'upsell' ? (
//         <ListShell
//           title='Upsell hosting (informativo)'
//           subtitle={activeMeta.hint}
//           footer={footerWithOrders(upsells.length, 'upsell')}
//         >
//           {upsells.length === 0 ? (
//             <div className='rounded-xl border bg-muted/20 px-3 py-3'>
//               <p className='text-sm text-muted-foreground'>
//                 Nenhum upsell pendente.
//               </p>
//             </div>
//           ) : (
//             <div className='grid gap-2'>
//               {sliceForView(upsells, 'upsell').map((u) => {
//                 const b = upsellBadge(u.tag);

//                 return (
//                   <Row
//                     key={u.orderId}
//                     title={`${u.email} • ${u.product}`}
//                     subtitle={`Criado em: ${u.createdAt}`}
//                     right={
//                       <div className='flex items-center gap-2'>
//                         <Badge
//                           variant='outline'
//                           className={[
//                             'inline-flex min-w-30 items-center justify-center px-2 py-1 text-[11px] font-medium',
//                             b.className,
//                           ].join(' ')}
//                         >
//                           {b.label}
//                         </Badge>

//                         <Link href={`/admin/orders/${u.orderId}`}>
//                           <Button className='h-9' variant='outline'>
//                             Ver
//                           </Button>
//                         </Link>
//                       </div>
//                     }
//                   />
//                 );
//               })}
//             </div>
//           )}
//         </ListShell>
//       ) : null}

//       {tab === 'leads' ? (
//         <ListShell
//           title='Leads novos'
//           subtitle={activeMeta.hint}
//           footer={footerLeadsOnly(leads.length)}
//         >
//           {leads.length === 0 ? (
//             <div className='rounded-xl border bg-muted/20 px-3 py-3'>
//               <p className='text-sm text-muted-foreground'>
//                 Nenhum lead ainda.
//               </p>
//             </div>
//           ) : (
//             <div className='grid gap-2'>
//               {sliceForView(leads, 'leads').map((l) => (
//                 <Row
//                   key={l.id}
//                   title={`${l.name} • ${l.email}`}
//                   subtitle={l.message || `Origem: ${l.landingPath}`}
//                   right={
//                     l.whatsappLink ? (
//                       <a href={l.whatsappLink} target='_blank' rel='noreferrer'>
//                         <Button className='h-9 gap-2' variant='outline'>
//                           <MessageCircle className='h-4 w-4' />
//                           WhatsApp
//                         </Button>
//                       </a>
//                     ) : (
//                       <Button className='h-9 gap-2' variant='outline' disabled>
//                         <MessageCircle className='h-4 w-4' />
//                         WhatsApp
//                       </Button>
//                     )
//                   }
//                 />
//               ))}
//             </div>
//           )}
//         </ListShell>
//       ) : null}
//     </div>
//   );

//   return (
//     <div className='grid gap-3'>
//       <div className='hidden md:block'>
//         <Card className='rounded-2xl border bg-card p-4 shadow-sm'>
//           <div className='flex items-start justify-between gap-3 '>
//             <div>
//               <p className='text-sm font-semibold'>Fluxo de trabalho</p>
//               <p className='mt-1 text-xs text-muted-foreground'>
//                 1) Produção, 2) Cobrança de onboarding, 3) Triagem de leads, 4)
//                 Visibilidade de upsell.
//               </p>
//             </div>

//             <div className='flex items-center gap-2'>
//               <Badge variant='secondary'>Ativo: {activeMeta.title}</Badge>
//             </div>
//           </div>

//           <Separator />

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
//         </Card>

//         {content}
//       </div>

//       <div className='md:hidden'>
//         <Card className='rounded-2xl border bg-card p-4 shadow-sm'>
//           <div className='flex items-start justify-between gap-3'>
//             <div className='min-w-0'>
//               <p className='text-sm font-semibold'>Fluxo de trabalho</p>
//               <p className='mt-1 text-xs text-muted-foreground truncate'>
//                 Ativo: {activeMeta.title} • {activeMeta.hint}
//               </p>
//             </div>

//             <Sheet open={open} onOpenChange={setOpen}>
//               <SheetTrigger asChild>
//                 <Button variant='outline' className='h-9 gap-2'>
//                   <LayoutGrid className='h-4 w-4' />
//                   Filas
//                 </Button>
//               </SheetTrigger>

//               <SheetContent side='bottom' className='rounded-t-2xl'>
//                 <SheetHeader>
//                   <SheetTitle>Filas operacionais</SheetTitle>
//                 </SheetHeader>

//                 <div className='mt-4 flex flex-wrap gap-2'>
//                   {tabs.map((t) => (
//                     <Pill
//                       key={t.key}
//                       active={tab === t.key}
//                       onClick={() => {
//                         setTab(t.key);
//                         setOpen(false);
//                       }}
//                       icon={t.icon}
//                       title={t.title}
//                       count={t.count}
//                     />
//                   ))}
//                 </div>
//               </SheetContent>
//             </Sheet>
//           </div>
//         </Card>

//         {content}
//       </div>
//     </div>
//   );
// };

'use client';

import * as React from 'react';
import Link from 'next/link';
import {
  CheckCircle2,
  Clock,
  CreditCard,
  Sparkles,
  MessageCircle,
  ArrowRight,
  LayoutGrid,
  Mail,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';

import { useSearchParams } from 'next/navigation';
import { isTabKey } from '@/lib/admin-workflow';

type ReadyItem = {
  orderId: string;
  email: string;
  product: string;
  total: string;
};

type StalledItem = {
  orderId: string;
  email: string;
  product: string;
  updatedAt: string;
  whatsappLink?: string | null; // mailto
};

type UpsellItem = {
  orderId: string;
  email: string;
  product: string;
  createdAt: string;
  tag: 'PENDING' | 'NOT_CONTRACTED';
};

type LeadItem = {
  id: string;
  name: string;
  email: string;
  message: string;
  landingPath: string;
  whatsappLink?: string | null;
};

type Props = {
  ready: ReadyItem[];
  stalled: StalledItem[];
  upsells: UpsellItem[];
  leads: LeadItem[];
};

type TabKey = 'ready' | 'stalled' | 'upsell' | 'leads';

const MAX_COLLAPSED = 4;

const STEP_DEFAULT = 4;
const MAX_VISIBLE_DEFAULT = 20;

const PAGE_SIZE_DEFAULT = 4;
const PAGE_SIZE_UPSELL = 20;

const Pill = ({
  active,
  onClick,
  icon: Icon,
  title,
  count,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ElementType;
  title: string;
  count: number;
}) => {
  return (
    <button
      type='button'
      onClick={onClick}
      className={[
        'flex items-center gap-2 rounded-full border px-3 py-2 text-sm transition-colors',
        'outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
        'focus-visible:ring-offset-background',
        'active:translate-y-0',
        'disabled:pointer-events-none disabled:opacity-50',
        active
          ? 'bg-primary text-primary-foreground border-primary/30 hover:bg-primary/90 active:bg-primary/90 focus:bg-primary/90'
          : 'bg-background hover:bg-muted/40 active:bg-muted/40 focus:bg-muted/40',
        '[-webkit-tap-highlight-color:transparent]',
      ].join(' ')}
    >
      <Icon className='h-4 w-4' />
      <span className='font-medium'>{title}</span>
      <Badge
        variant={active ? 'secondary' : 'outline'}
        className={active ? 'bg-background/15 text-primary-foreground' : ''}
      >
        {count}
      </Badge>
    </button>
  );
};

const ListShell = ({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}) => {
  return (
    <Card className='rounded-2xl border bg-card shadow-sm'>
      <div className='px-4 py-2 sm:px-5 sm:py-2'>
        <div className='flex items-start justify-between gap-3'>
          <div>
            <p className='text-sm font-semibold'>{title}</p>
            <p className='mt-1 text-xs text-muted-foreground'>{subtitle}</p>
          </div>
        </div>
      </div>

      <Separator />

      <div className='px-4 py-2 sm:px-5 '>
        {children}
        {footer ? <div className='mt-4 flex justify-end'>{footer}</div> : null}
      </div>
    </Card>
  );
};

const Row = ({
  title,
  subtitle,
  right,
}: {
  title: string;
  subtitle: string;
  right: React.ReactNode;
}) => {
  return (
    <div className='flex items-start justify-between gap-3 rounded-xl border bg-background px-3 py-3'>
      <div className='min-w-0 flex-1'>
        <p className='truncate text-sm font-medium'>{title}</p>

        <p className='mt-0.5 line-clamp-2 text-xs text-muted-foreground wrap-break-word '>
          {subtitle}
        </p>
      </div>

      <div className='shrink-0'>{right}</div>
    </div>
  );
};

const upsellBadge = (tag: UpsellItem['tag']) => {
  if (tag === 'PENDING') {
    return {
      label: 'Pendente',
      className: 'border-amber-200 bg-amber-50 text-amber-900',
    };
  }

  return {
    label: 'Não contratou',
    className: 'border-muted bg-muted/40 text-muted-foreground',
  };
};

export const WorkflowCarousel = ({ ready, stalled, upsells, leads }: Props) => {
  const [tab, setTab] = React.useState<TabKey>('ready');
  const [open, setOpen] = React.useState(false);

  const [expandedUpsell, setExpandedUpsell] = React.useState(false);
  const [pageUpsell, setPageUpsell] = React.useState(0);

  const [visibleCount, setVisibleCount] = React.useState(MAX_COLLAPSED);
  const [pageDefault, setPageDefault] = React.useState(0);

  React.useEffect(() => {
    setVisibleCount(MAX_COLLAPSED);
    setPageDefault(0);

    setExpandedUpsell(false);
    setPageUpsell(0);
  }, [tab]);

  const searchParams = useSearchParams();
  const tabParam = searchParams.get('tab');

  React.useEffect(() => {
    if (isTabKey(tabParam)) setTab(tabParam);
  }, [tabParam]);

  const tabs = [
    {
      key: 'ready' as const,
      title: 'Produção',
      icon: CheckCircle2,
      count: ready.length,
      hint: 'Pago + briefing concluído. É o que vira entrega agora.',
    },
    {
      key: 'stalled' as const,
      title: 'Cobrar',
      icon: Clock,
      count: stalled.length,
      hint: 'Briefings parados. Ação: cobrar cliente para concluir.',
    },
    {
      key: 'leads' as const,
      title: 'Leads',
      icon: CreditCard,
      count: leads.length,
      hint: 'Triagem. Responder e direcionar o próximo passo.',
    },
    {
      key: 'upsell' as const,
      title: 'Upsell',
      icon: Sparkles,
      count: upsells.length,
      hint: 'Visibilidade. Não é prioridade operacional diária.',
    },
  ];

  const activeMeta = tabs.find((t) => t.key === tab)!;

  const canPaginateDefault = (len: number) =>
    visibleCount >= MAX_VISIBLE_DEFAULT && len > MAX_VISIBLE_DEFAULT;

  const totalPagesDefault = (len: number) =>
    Math.max(1, Math.ceil(len / MAX_VISIBLE_DEFAULT));

  const sliceForDefaultTab = <T,>(items: T[]) => {
    const start = canPaginateDefault(items.length)
      ? pageDefault * MAX_VISIBLE_DEFAULT
      : 0;
    return items.slice(start, start + visibleCount);
  };

  const canShowMoreDefault = (len: number) =>
    len > visibleCount && visibleCount < MAX_VISIBLE_DEFAULT;

  const canShowLessDefault = () => visibleCount > MAX_COLLAPSED;

  const handleShowMoreDefault = () => {
    setVisibleCount((v) => Math.min(v + STEP_DEFAULT, MAX_VISIBLE_DEFAULT));
  };

  const handleShowLessDefault = () => {
    setVisibleCount((v) => Math.max(v - STEP_DEFAULT, MAX_COLLAPSED));
    setPageDefault(0);
  };

  const goPrevDefault = (len: number) =>
    setPageDefault((p) =>
      Math.max(0, Math.min(p - 1, totalPagesDefault(len) - 1)),
    );

  const goNextDefault = (len: number) =>
    setPageDefault((p) =>
      Math.max(0, Math.min(p + 1, totalPagesDefault(len) - 1)),
    );

  const footerDefaultWithOrders = (len: number) => {
    const showPager = canPaginateDefault(len) && totalPagesDefault(len) > 1;

    return (
      <div className='grid gap-2'>
        <div className='flex items-center justify-between gap-2'>
          <div className='flex items-center gap-2'>
            {len > MAX_COLLAPSED ? (
              <>
                {canShowMoreDefault(len) ? (
                  <Button
                    type='button'
                    variant='outline'
                    className='h-9'
                    onClick={handleShowMoreDefault}
                  >
                    Ver mais
                  </Button>
                ) : null}

                {canShowLessDefault() ? (
                  <Button
                    type='button'
                    variant='outline'
                    className='h-9'
                    onClick={handleShowLessDefault}
                  >
                    Ver menos
                  </Button>
                ) : null}
              </>
            ) : null}
          </div>

          <Link href='/admin/orders'>
            <Button variant='outline' className='h-9 gap-2'>
              Ver pedidos <ArrowRight className='h-4 w-4' />
            </Button>
          </Link>
        </div>

        {showPager ? (
          <div className='flex items-center justify-end gap-2'>
            <Button
              type='button'
              variant='outline'
              className='h-9'
              disabled={pageDefault <= 0}
              onClick={() => goPrevDefault(len)}
            >
              Anterior
            </Button>

            <Button
              type='button'
              variant='outline'
              className='h-9'
              disabled={pageDefault >= totalPagesDefault(len) - 1}
              onClick={() => goNextDefault(len)}
            >
              Próximo
            </Button>

            <span className='text-xs text-muted-foreground'>
              {pageDefault + 1}/{totalPagesDefault(len)}
            </span>
          </div>
        ) : null}
      </div>
    );
  };

  const footerDefaultLeadsOnly = (len: number) => {
    const showPager = canPaginateDefault(len) && totalPagesDefault(len) > 1;

    return (
      <div className='grid gap-2'>
        <div className='flex items-center justify-end gap-2'>
          {len > MAX_COLLAPSED ? (
            <>
              {canShowMoreDefault(len) ? (
                <Button
                  type='button'
                  variant='outline'
                  className='h-9'
                  onClick={handleShowMoreDefault}
                >
                  Ver mais
                </Button>
              ) : null}

              {canShowLessDefault() ? (
                <Button
                  type='button'
                  variant='outline'
                  className='h-9'
                  onClick={handleShowLessDefault}
                >
                  Ver menos
                </Button>
              ) : null}
            </>
          ) : null}
        </div>

        {showPager ? (
          <div className='flex items-center justify-end gap-2'>
            <Button
              type='button'
              variant='outline'
              className='h-9'
              disabled={pageDefault <= 0}
              onClick={() => goPrevDefault(len)}
            >
              Anterior
            </Button>

            <Button
              type='button'
              variant='outline'
              className='h-9'
              disabled={pageDefault >= totalPagesDefault(len) - 1}
              onClick={() => goNextDefault(len)}
            >
              Próximo
            </Button>

            <span className='text-xs text-muted-foreground'>
              {pageDefault + 1}/{totalPagesDefault(len)}
            </span>
          </div>
        ) : null}
      </div>
    );
  };

  const showToggleUpsell = (len: number) => len > MAX_COLLAPSED;

  const totalPagesUpsell = (len: number) =>
    Math.max(1, Math.ceil(len / PAGE_SIZE_UPSELL));

  const goPrevUpsell = (len: number) =>
    setPageUpsell((p) =>
      Math.max(0, Math.min(p - 1, totalPagesUpsell(len) - 1)),
    );

  const goNextUpsell = (len: number) =>
    setPageUpsell((p) =>
      Math.max(0, Math.min(p + 1, totalPagesUpsell(len) - 1)),
    );

  const sliceForUpsell = <T,>(items: T[]) => {
    if (!expandedUpsell) return items.slice(0, MAX_COLLAPSED);

    const start = pageUpsell * PAGE_SIZE_UPSELL;
    return items.slice(start, start + PAGE_SIZE_UPSELL);
  };

  const footerUpsell = (len: number) => {
    return (
      <div className='flex items-center justify-between gap-2'>
        <div>
          {showToggleUpsell(len) ? (
            <Button
              type='button'
              variant='outline'
              className='h-9'
              onClick={() => {
                setExpandedUpsell((v) => !v);
                setPageUpsell(0);
              }}
            >
              {expandedUpsell ? 'Ver menos' : 'Ver todos'}
            </Button>
          ) : null}
        </div>

        {expandedUpsell && totalPagesUpsell(len) > 1 ? (
          <div className='flex items-center gap-2'>
            <Button
              type='button'
              variant='outline'
              className='h-9'
              disabled={pageUpsell <= 0}
              onClick={() => goPrevUpsell(len)}
            >
              Anterior
            </Button>

            <Button
              type='button'
              variant='outline'
              className='h-9'
              disabled={pageUpsell >= totalPagesUpsell(len) - 1}
              onClick={() => goNextUpsell(len)}
            >
              Próximo
            </Button>

            <span className='text-xs text-muted-foreground'>
              {pageUpsell + 1}/{totalPagesUpsell(len)}
            </span>
          </div>
        ) : null}

        <Link href='/admin/orders'>
          <Button variant='outline' className='h-9 gap-2'>
            Ver pedidos <ArrowRight className='h-4 w-4' />
          </Button>
        </Link>
      </div>
    );
  };

  const content = (
    <div className='grid gap-3 mt-6'>
      {tab === 'ready' ? (
        <ListShell
          title='Prontos para produção'
          subtitle={activeMeta.hint}
          footer={footerDefaultWithOrders(ready.length)}
        >
          {ready.length === 0 ? (
            <div className='rounded-xl border bg-muted/20 px-3 py-3'>
              <p className='text-sm text-muted-foreground'>
                Nenhum pronto no momento.
              </p>
            </div>
          ) : (
            <div className='grid gap-2'>
              {sliceForDefaultTab(ready).map((o) => (
                <Row
                  key={o.orderId}
                  title={`${o.email} • ${o.product}`}
                  subtitle={`Total: ${o.total}`}
                  right={
                    <Link href={`/admin/orders/${o.orderId}`}>
                      <Button className='h-9 gap-2' variant='outline'>
                        Abrir briefing <ArrowRight className='h-4 w-4' />
                      </Button>
                    </Link>
                  }
                />
              ))}
            </div>
          )}
        </ListShell>
      ) : null}

      {tab === 'stalled' ? (
        <ListShell
          title='Onboarding parados ou incompletos'
          subtitle={activeMeta.hint}
          footer={footerDefaultWithOrders(stalled.length)}
        >
          {stalled.length === 0 ? (
            <div className='rounded-xl border bg-muted/20 px-3 py-3'>
              <p className='text-sm text-muted-foreground'>
                Nenhum onboarding parado.
              </p>
            </div>
          ) : (
            <div className='grid gap-2'>
              {sliceForDefaultTab(stalled).map((b) => (
                <Row
                  key={b.orderId}
                  title={`${b.email} • ${b.product}`}
                  subtitle={b.updatedAt}
                  right={
                    <div className='flex items-center gap-2'>
                      {b.whatsappLink ? (
                        <Button
                          type='button'
                          className='h-9 gap-2'
                          variant='outline'
                          onClick={() => {
                            window.open(
                              b.whatsappLink!,
                              '_blank',
                              'noopener,noreferrer',
                            );
                          }}
                        >
                          <Mail className='h-4 w-4' />
                          E-mail
                        </Button>
                      ) : (
                        <Button
                          type='button'
                          className='h-9 gap-2'
                          variant='outline'
                          disabled
                        >
                          <Mail className='h-4 w-4' />
                          E-mail
                        </Button>
                      )}

                      <Link href={`/admin/orders/${b.orderId}`}>
                        <Button className='h-9' variant='outline'>
                          Ver
                        </Button>
                      </Link>
                    </div>
                  }
                />
              ))}
            </div>
          )}
        </ListShell>
      ) : null}

      {tab === 'upsell' ? (
        <ListShell
          title='Upsell hosting (informativo)'
          subtitle={activeMeta.hint}
          footer={footerUpsell(upsells.length)}
        >
          {upsells.length === 0 ? (
            <div className='rounded-xl border bg-muted/20 px-3 py-3'>
              <p className='text-sm text-muted-foreground'>
                Nenhum upsell pendente.
              </p>
            </div>
          ) : (
            <div className='grid gap-2'>
              {sliceForUpsell(upsells).map((u) => {
                const b = upsellBadge(u.tag);

                return (
                  <Row
                    key={u.orderId}
                    title={`${u.email} • ${u.product}`}
                    subtitle={`Criado em: ${u.createdAt}`}
                    right={
                      <div className='flex items-center gap-2'>
                        <Badge
                          variant='outline'
                          className={[
                            'inline-flex min-w-30 items-center justify-center px-2 py-1 text-[11px] font-medium',
                            b.className,
                          ].join(' ')}
                        >
                          {b.label}
                        </Badge>

                        <Link href={`/admin/orders/${u.orderId}`}>
                          <Button className='h-9' variant='outline'>
                            Ver
                          </Button>
                        </Link>
                      </div>
                    }
                  />
                );
              })}
            </div>
          )}
        </ListShell>
      ) : null}

      {tab === 'leads' ? (
        <ListShell
          title='Leads novos'
          subtitle={activeMeta.hint}
          footer={footerDefaultLeadsOnly(leads.length)}
        >
          {leads.length === 0 ? (
            <div className='rounded-xl border bg-muted/20 px-3 py-3'>
              <p className='text-sm text-muted-foreground'>
                Nenhum lead ainda.
              </p>
            </div>
          ) : (
            <div className='grid gap-2'>
              {sliceForDefaultTab(leads).map((l) => (
                <Row
                  key={l.id}
                  title={`${l.name} • ${l.email}`}
                  subtitle={l.message || `Origem: ${l.landingPath}`}
                  right={
                    l.whatsappLink ? (
                      <a href={l.whatsappLink} target='_blank' rel='noreferrer'>
                        <Button className='h-9 gap-2' variant='outline'>
                          <MessageCircle className='h-4 w-4' />
                          WhatsApp
                        </Button>
                      </a>
                    ) : (
                      <Button className='h-9 gap-2' variant='outline' disabled>
                        <MessageCircle className='h-4 w-4' />
                        WhatsApp
                      </Button>
                    )
                  }
                />
              ))}
            </div>
          )}
        </ListShell>
      ) : null}
    </div>
  );

  return (
    <div className='grid gap-3'>
      <div className='hidden md:block'>
        <Card className='rounded-2xl border bg-card p-4 shadow-sm'>
          <div className='flex items-start justify-between gap-3 '>
            <div>
              <p className='text-sm font-semibold'>Fluxo de trabalho</p>
              <p className='mt-1 text-xs text-muted-foreground'>
                1) Produção, 2) Cobrança de onboarding, 3) Triagem de leads, 4)
                Visibilidade de upsell.
              </p>
            </div>

            <div className='flex items-center gap-2'>
              <Badge variant='secondary'>Ativo: {activeMeta.title}</Badge>
            </div>
          </div>

          <Separator />

          <div className='flex flex-wrap gap-2'>
            {tabs.map((t) => (
              <Pill
                key={t.key}
                active={tab === t.key}
                onClick={() => setTab(t.key)}
                icon={t.icon}
                title={t.title}
                count={t.count}
              />
            ))}
          </div>
        </Card>

        {content}
      </div>

      <div className='md:hidden'>
        <Card className='rounded-2xl border bg-card p-4 shadow-sm'>
          <div className='flex items-start justify-between gap-3'>
            <div className='min-w-0'>
              <p className='text-sm font-semibold'>Fluxo de trabalho</p>
              <p className='mt-1 text-xs text-muted-foreground truncate'>
                Ativo: {activeMeta.title} • {activeMeta.hint}
              </p>
            </div>

            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild>
                <Button variant='outline' className='h-9 gap-2'>
                  <LayoutGrid className='h-4 w-4' />
                  Filas
                </Button>
              </SheetTrigger>

              <SheetContent side='bottom' className='rounded-t-2xl'>
                <SheetHeader>
                  <SheetTitle>Filas operacionais</SheetTitle>
                </SheetHeader>

                <div className='mt-4 flex flex-wrap gap-2'>
                  {tabs.map((t) => (
                    <Pill
                      key={t.key}
                      active={tab === t.key}
                      onClick={() => {
                        setTab(t.key);
                        setOpen(false);
                      }}
                      icon={t.icon}
                      title={t.title}
                      count={t.count}
                    />
                  ))}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </Card>

        {content}
      </div>
    </div>
  );
};

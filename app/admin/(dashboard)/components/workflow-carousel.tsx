'use client';

import {
  ArrowRight,
  CheckCircle2,
  Clock,
  CreditCard,
  LayoutGrid,
  Mail,
  MessageCircle,
  Sparkles,
} from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import * as React from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { isTabKey } from '@/lib/admin-workflow';

import type {
  Props,
  TabKey,
  UpsellItem,
} from './workflow-carousel/workflow-carousel.types';
import { ListShell, Pill, Row } from './workflow-carousel/workflow-carousel.ui';
import {
  canPaginateDefault,
  canShowLessDefault,
  canShowMoreDefault,
  MAX_COLLAPSED,
  MAX_VISIBLE_DEFAULT,
  sliceForDefaultTab,
  sliceForUpsell,
  STEP_DEFAULT,
  totalPagesDefault,
  totalPagesUpsell,
  upsellBadge,
} from './workflow-carousel/workflow-carousel.utils';

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
    const showPager =
      canPaginateDefault(len, visibleCount) && totalPagesDefault(len) > 1;

    return (
      <div className='grid gap-2'>
        <div className='flex items-center justify-between gap-2'>
          <div className='flex items-center gap-2'>
            {len > MAX_COLLAPSED ? (
              <>
                {canShowMoreDefault(len, visibleCount) ? (
                  <Button
                    type='button'
                    variant='outline'
                    className='h-9'
                    onClick={handleShowMoreDefault}
                  >
                    Ver mais
                  </Button>
                ) : null}

                {canShowLessDefault(visibleCount) ? (
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
    const showPager =
      canPaginateDefault(len, visibleCount) && totalPagesDefault(len) > 1;

    return (
      <div className='grid gap-2'>
        <div className='flex items-center justify-end gap-2'>
          {len > MAX_COLLAPSED ? (
            <>
              {canShowMoreDefault(len, visibleCount) ? (
                <Button
                  type='button'
                  variant='outline'
                  className='h-9'
                  onClick={handleShowMoreDefault}
                >
                  Ver mais
                </Button>
              ) : null}

              {canShowLessDefault(visibleCount) ? (
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

  const goPrevUpsell = (len: number) =>
    setPageUpsell((p) =>
      Math.max(0, Math.min(p - 1, totalPagesUpsell(len) - 1)),
    );

  const goNextUpsell = (len: number) =>
    setPageUpsell((p) =>
      Math.max(0, Math.min(p + 1, totalPagesUpsell(len) - 1)),
    );

  const footerUpsell = (len: number) => {
    return (
      <div className='flex items-center justify-between gap-2'>
        <div>
          {len > MAX_COLLAPSED ? (
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
              {sliceForDefaultTab(ready, visibleCount, pageDefault).map((o) => (
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
              {sliceForDefaultTab(stalled, visibleCount, pageDefault).map(
                (b) => (
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
                ),
              )}
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
              {sliceForUpsell(upsells, expandedUpsell, pageUpsell).map((u) => {
                const b = upsellBadge(u.tag as UpsellItem['tag']);

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
              {sliceForDefaultTab(leads, visibleCount, pageDefault).map((l) => (
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

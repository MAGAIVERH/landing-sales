'use client';

import { ChevronRight } from 'lucide-react';
import Link from 'next/link';
import * as React from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';

import { USE_CASES } from './solutions-tabs.data';

export const MobileSolutions = ({ first }: { first: string }) => {
  const [open, setOpen] = React.useState(false);
  const [activeId, setActiveId] = React.useState(first);

  const active = React.useMemo(
    () => USE_CASES.find((u) => u.id === activeId) ?? USE_CASES[0],
    [activeId],
  );

  return (
    <div className='md:hidden'>
      <div className='mt-10 overflow-hidden rounded-2xl border bg-card p-4 shadow-sm'>
        <div className='grid gap-3'>
          <div className='rounded-xl border bg-background p-4'>
            <p className='text-sm font-semibold'>Você enfrenta isso?</p>
            <p className='mt-1 text-sm text-muted-foreground'>
              Toque em uma dor. A solução abre na hora.
            </p>
          </div>

          <div className='grid gap-2'>
            {USE_CASES.map((item) => (
              <button
                key={item.id}
                type='button'
                onClick={() => {
                  setActiveId(item.id);
                  setOpen(true);
                }}
                className='w-full rounded-xl border bg-background px-4 py-4 text-left transition hover:bg-muted/40'
              >
                <div className='flex w-full items-start gap-3'>
                  <span className='mt-0.5 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary'>
                    <item.icon className='h-5 w-5' />
                  </span>

                  <div className='min-w-0 flex-1'>
                    <p className='text-sm font-semibold leading-snug wrap-break-word'>
                      {item.painTitle}
                    </p>
                    <p className='mt-1 text-sm leading-snug text-muted-foreground wrap-break-word'>
                      {item.painDesc}
                    </p>
                  </div>

                  <span className='mt-1 inline-flex shrink-0 items-center text-muted-foreground'>
                    <ChevronRight className='h-4 w-4' />
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side='bottom' className='rounded-t-4xl p-0'>
          <div className='mx-auto w-full max-w-2xl p-6'>
            <SheetHeader className='space-y-2'>
              <div className='flex items-start justify-between gap-4'>
                <div className='min-w-0'>
                  <SheetTitle className='text-lg font-semibold tracking-tight'>
                    {active.solutionTitle}
                  </SheetTitle>
                  <SheetDescription className='mt-2 text-sm text-muted-foreground'>
                    {active.solutionDesc}
                  </SheetDescription>
                </div>

                <Badge className='shrink-0 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary'>
                  Resultado prático
                </Badge>
              </div>
            </SheetHeader>

            <div className='mt-5 grid gap-4'>
              <div className='rounded-xl border bg-card p-4'>
                <p className='text-sm font-semibold'>
                  O que entra na plataforma
                </p>
                <ul className='mt-3 space-y-2 text-sm text-muted-foreground'>
                  {active.bullets.map((b) => (
                    <li key={b} className='flex items-start gap-2'>
                      <span className='mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary'>
                        <span className='block h-1.5 w-1.5 rounded-full bg-primary' />
                      </span>
                      <span className='wrap-break-word'>{b}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className='rounded-xl border bg-card p-4'>
                <p className='text-sm font-semibold'>O que você ganha</p>
                <div className='mt-3 flex flex-wrap gap-2'>
                  {active.outcomes.map((o) => (
                    <Badge
                      key={o}
                      className='rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary'
                    >
                      {o}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className='grid gap-2'>
                <Button
                  asChild
                  className='w-full bg-primary text-primary-foreground hover:bg-primary/90'
                >
                  <Link href='/budget' onClick={() => setOpen(false)}>
                    Solicitar proposta
                  </Link>
                </Button>

                <p className='text-center text-xs text-muted-foreground'>
                  Queremos mostrar exatamente como fica no seu segmento.
                </p>
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

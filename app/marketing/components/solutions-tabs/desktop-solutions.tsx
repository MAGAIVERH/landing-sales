'use client';

import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import { USE_CASES } from './solutions-tabs.data';

export const DesktopSolutions = ({ first }: { first: string }) => {
  return (
    <div className='hidden md:block'>
      <Card className='mt-10 overflow-x-hidden rounded-2xl border bg-card p-4 shadow-sm md:p-6'>
        <Tabs defaultValue={first} className='w-full'>
          <div className='mb-5 grid gap-3 md:grid-cols-2 md:gap-6'>
            <div className='rounded-xl border bg-background p-4'>
              <p className='text-sm font-semibold'>Você enfrenta isso?</p>
              <p className='mt-1 text-sm text-muted-foreground'>
                Selecione uma dor comum do dia a dia.
              </p>
            </div>

            <div className='rounded-xl border bg-background p-4'>
              <p className='text-sm font-semibold'>Nós resolvemos assim</p>
              <p className='mt-1 text-sm text-muted-foreground'>
                Veja como a plataforma entra na rotina e destrava resultado.
              </p>
            </div>
          </div>

          <div className='grid gap-6 md:grid-cols-2'>
            <div className='min-w-0'>
              <TabsList className='flex h-auto w-full flex-col gap-2 bg-transparent p-0'>
                {USE_CASES.map((item) => (
                  <TabsTrigger
                    key={item.id}
                    value={item.id}
                    className='
                      flex w-full justify-start rounded-xl border bg-background px-4 py-4 text-left
                      whitespace-normal wrap-break-word overflow-hidden
                      data-[state=active]:border-primary/30 data-[state=active]:bg-primary/5
                    '
                  >
                    <div className='flex w-full min-w-0 items-start gap-3'>
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
                    </div>
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>

            <div className='min-w-0 rounded-2xl border bg-background p-5 md:p-6'>
              {USE_CASES.map((item) => (
                <TabsContent key={item.id} value={item.id} className='m-0'>
                  <div className='flex items-start justify-between gap-4'>
                    <div className='min-w-0'>
                      <h3 className='text-lg font-semibold tracking-tight md:text-xl'>
                        {item.solutionTitle}
                      </h3>
                      <p className='mt-2 text-sm text-muted-foreground wrap-break-word'>
                        {item.solutionDesc}
                      </p>
                    </div>

                    <Badge className='shrink-0 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary'>
                      Resultado prático
                    </Badge>
                  </div>

                  <div className='mt-5 grid gap-5'>
                    <div className='rounded-xl border bg-card p-4'>
                      <p className='text-sm font-semibold'>
                        O que entra na plataforma
                      </p>
                      <ul className='mt-3 space-y-2 text-sm text-muted-foreground'>
                        {item.bullets.map((b) => (
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
                        {item.outcomes.map((o) => (
                          <Badge
                            key={o}
                            className='rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary'
                          >
                            {o}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className='flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between'>
                      <p className='text-xs text-muted-foreground'>
                        Quer ver como fica no seu segmento?
                      </p>

                      <Button
                        asChild
                        className='bg-primary text-primary-foreground hover:bg-primary/90'
                      >
                        <Link href='#precos'>Solicitar proposta</Link>
                      </Button>
                    </div>
                  </div>
                </TabsContent>
              ))}
            </div>
          </div>
        </Tabs>
      </Card>
    </div>
  );
};

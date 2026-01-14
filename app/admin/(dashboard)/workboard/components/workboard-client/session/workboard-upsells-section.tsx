import { CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

import { statusBadgeClass, statusLabel } from '../workboard-client.styles';
import type { Split, UpsellItem } from '../workboard-client.types';
import { Row } from '../workboard-client.ui';

type Props = {
  split: Split<UpsellItem>;
  expanded: boolean;
  maxCollapsed: number;
  maxExpanded: number;
  onToggleExpanded: () => void;
  onMarkDone: (orderId: string) => Promise<void>;
  onUndoDone: (orderId: string) => Promise<void>;
};

export const WorkboardUpsellsSection = ({
  split,
  expanded,
  maxCollapsed,
  maxExpanded,
  onToggleExpanded,
  onMarkDone,
  onUndoDone,
}: Props) => {
  const sliceForView = <T,>(items: T[]) =>
    items.slice(0, expanded ? maxExpanded : maxCollapsed);

  const showToggle = (len: number) => len > maxCollapsed;

  return (
    <Card className='rounded-2xl border bg-card shadow-sm'>
      <div className='px-5'>
        <div className='flex items-start justify-between gap-3'>
          <div>
            <p className='text-sm font-semibold'>4) Upsell</p>
            <p className='mt-1 text-xs text-muted-foreground'>
              Aqui aparecem apenas os upsells do checkout que estão na hora de
              enviar mensagem.
            </p>
          </div>
          <Badge variant='secondary'>
            Ativos: {split.active.length} • Em acompanhamento:{' '}
            {split.done.length}
          </Badge>
        </div>
      </div>

      <Separator />

      <div className='px-5 py-2 sm:py-3'>
        <div className='grid gap-2'>
          {split.active.length === 0 ? (
            <p className='text-sm text-muted-foreground'>
              Nenhum upsell disponível para envio agora.
            </p>
          ) : (
            sliceForView(split.active).map((u) => (
              <Row
                key={u.refId}
                left={
                  <>
                    <p className='truncate text-sm font-medium'>
                      {u.email} • {u.product}
                    </p>
                    <p className='mt-1 text-xs text-muted-foreground'>
                      Tentativas: {u.attempts ?? 0} • Último envio:{' '}
                      {u.lastSentAt ?? 'nunca'} • Criado em: {u.createdAt}
                    </p>
                  </>
                }
                right={
                  <div className='flex items-center gap-2'>
                    <Badge
                      variant='outline'
                      className={statusBadgeClass(u.status)}
                    >
                      {statusLabel[u.status]}
                    </Badge>

                    <Link href={u.href}>
                      <Button className='h-9' variant='outline'>
                        Ver
                      </Button>
                    </Link>

                    <Button
                      className='h-9 gap-2'
                      onClick={() => onMarkDone(u.refId)}
                    >
                      <CheckCircle2 className='h-4 w-4' />
                      Feito
                    </Button>
                  </div>
                }
              />
            ))
          )}

          {showToggle(split.active.length) ? (
            <div className='flex justify-end'>
              <Button
                variant='outline'
                className='h-9'
                onClick={onToggleExpanded}
              >
                {expanded ? 'Ver menos' : 'Ver todos'}
              </Button>
            </div>
          ) : null}

          {expanded && split.active.length > maxExpanded ? (
            <p className='text-xs text-muted-foreground'>
              Mostrando {maxExpanded} de {split.active.length}.
            </p>
          ) : null}

          {split.done.length > 0 ? (
            <div className='mt-3'>
              <p className='mb-2 text-xs font-medium text-muted-foreground'>
                Em acompanhamento
              </p>

              <div className='grid gap-2'>
                {split.done.map((u) => (
                  <Row
                    key={u.refId}
                    muted
                    left={
                      <>
                        <p className='truncate text-sm font-medium'>
                          {u.email} • {u.product}
                        </p>
                        <p className='mt-1 text-xs text-muted-foreground'>
                          Tentativas: {u.attempts ?? 0} • Último envio:{' '}
                          {u.lastSentAt ?? 'nunca'}
                        </p>
                      </>
                    }
                    right={
                      <div className='flex items-center gap-2'>
                        <Badge
                          variant='outline'
                          className={statusBadgeClass('DONE')}
                        >
                          Concluído
                        </Badge>

                        <Button
                          className='h-9'
                          variant='outline'
                          onClick={() => onUndoDone(u.refId)}
                        >
                          Desfazer
                        </Button>
                      </div>
                    }
                  />
                ))}
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </Card>
  );
};

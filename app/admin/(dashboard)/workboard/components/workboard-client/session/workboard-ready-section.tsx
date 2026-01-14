import { ArrowRight } from 'lucide-react';

import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

import type {
  ReadyItem,
  Split,
  UpdateStatusFn,
} from '../workboard-client.types';
import { Row } from '../workboard-client.ui';
import { statusBadgeClass, statusLabel } from '../workboard-client.styles';

type Props = {
  split: Split<ReadyItem>;
  expanded: boolean;
  maxCollapsed: number;
  maxExpanded: number;
  onToggleExpanded: () => void;
  onOpenBriefing: (item: ReadyItem) => void;
  onUpdateStatus: UpdateStatusFn;
};

export const WorkboardReadySection = ({
  split,
  expanded,
  maxCollapsed,
  maxExpanded,
  onToggleExpanded,
  onOpenBriefing,
  onUpdateStatus,
}: Props) => {
  const sliceForView = <T,>(items: T[]) =>
    items.slice(0, expanded ? maxExpanded : maxCollapsed);

  const showToggle = (len: number) => len > maxCollapsed;

  return (
    <Card className='rounded-2xl border bg-card shadow-sm'>
      <div className='px-5'>
        <div className='flex items-start justify-between gap-3'>
          <div>
            <p className='text-sm font-semibold'>1) Produção</p>
            <p className='mt-1 text-xs text-muted-foreground'>
              Trabalhos que viram entrega agora.
            </p>
          </div>
          <Badge variant='secondary'>
            Ativos: {split.active.length} • Concluídos: {split.done.length}
          </Badge>
        </div>
      </div>

      <Separator />

      <div className='px-5'>
        <div className='grid gap-2'>
          {split.active.length === 0 ? (
            <p className='text-sm text-muted-foreground'>Nenhum item ativo.</p>
          ) : (
            sliceForView(split.active).map((o) => (
              <Row
                key={o.refId}
                left={
                  <>
                    <p className='truncate text-sm font-medium'>
                      {o.email} • {o.product}
                    </p>
                    <p className='mt-1 text-xs text-muted-foreground'>
                      Status: {statusLabel[o.status]}
                    </p>
                  </>
                }
                right={
                  <div className='flex items-center gap-2'>
                    <Badge
                      variant='outline'
                      className={statusBadgeClass(o.status)}
                    >
                      {statusLabel[o.status]}
                    </Badge>

                    <Button
                      type='button'
                      variant='outline'
                      className='h-9 gap-2'
                      onClick={() => onOpenBriefing(o)}
                    >
                      Ver briefing <ArrowRight className='h-4 w-4' />
                    </Button>

                    <Button
                      className='h-9'
                      variant='outline'
                      onClick={() => onUpdateStatus('READY', o.refId, 'DONE')}
                    >
                      Marcar feito
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
                Concluídos
              </p>
              <div className='grid gap-2'>
                {split.done.map((o) => (
                  <Row
                    key={o.refId}
                    muted
                    left={
                      <p className='truncate text-sm font-medium'>
                        {o.email} • {o.product}
                      </p>
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
                          onClick={() =>
                            onUpdateStatus('READY', o.refId, 'TODO')
                          }
                        >
                          Reabrir
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

import { Mail, MessageCircle } from 'lucide-react';

import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

import type {
  Split,
  StalledItem,
  UpdateStatusFn,
} from '../workboard-client.types';
import { Row } from '../workboard-client.ui';
import { statusBadgeClass, statusLabel } from '../workboard-client.styles';

type Props = {
  split: Split<StalledItem>;
  expanded: boolean;
  maxCollapsed: number;
  maxExpanded: number;
  onToggleExpanded: () => void;
  onUpdateStatus: UpdateStatusFn;
};

export const WorkboardStalledSection = ({
  split,
  expanded,
  maxCollapsed,
  maxExpanded,
  onToggleExpanded,
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
            <p className='text-sm font-semibold'>
              2) Onboarding parado (2+ dias)
            </p>
            <p className='mt-1 text-xs text-muted-foreground'>
              Briefings não enviados após 2 dias exigem contato.
            </p>
          </div>
          <Badge variant='secondary'>
            Ativos: {split.active.length} • Concluídos: {split.done.length}
          </Badge>
        </div>
      </div>

      <Separator />

      <div className='px-5 py-2 sm:py-3'>
        <div className='grid gap-2'>
          {split.active.length === 0 ? (
            <p className='text-sm text-muted-foreground'>Nenhum item ativo.</p>
          ) : (
            sliceForView(split.active).map((b) => (
              <Row
                key={b.refId}
                left={
                  <>
                    <p className='truncate text-sm font-medium'>
                      {b.email} • {b.product}
                    </p>
                    <p className='mt-1 text-xs text-muted-foreground'>
                      {b.updatedAt}
                    </p>
                  </>
                }
                right={
                  <div className='flex items-center gap-2'>
                    <Badge
                      variant='outline'
                      className={statusBadgeClass(b.status)}
                    >
                      {statusLabel[b.status]}
                    </Badge>

                    {b.emailLink ? (
                      <a href={b.emailLink} target='_blank' rel='noreferrer'>
                        <Button className='h-9 gap-2' variant='outline'>
                          <Mail className='h-4 w-4' />
                          E-mail
                        </Button>
                      </a>
                    ) : (
                      <Button className='h-9 gap-2' variant='outline' disabled>
                        <Mail className='h-4 w-4' />
                        E-mail
                      </Button>
                    )}

                    {b.whatsappLink ? (
                      <a href={b.whatsappLink} target='_blank' rel='noreferrer'>
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
                    )}

                    <Button
                      className='h-9'
                      variant='outline'
                      onClick={() => onUpdateStatus('STALLED', b.refId, 'DONE')}
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
                {split.done.map((b) => (
                  <Row
                    key={b.refId}
                    muted
                    left={
                      <>
                        <p className='truncate text-sm font-medium'>
                          {b.email} • {b.product}
                        </p>
                        <p className='mt-1 text-xs text-muted-foreground'>
                          {b.updatedAt}
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
                          onClick={() =>
                            onUpdateStatus('STALLED', b.refId, 'TODO')
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

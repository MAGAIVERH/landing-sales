import Link from 'next/link';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

import type { BriefingView } from './workboard-client.briefing';
import { formatValue } from './workboard-client.briefing';
import type { ReadyItem } from './workboard-client.types';

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item: ReadyItem | null;
  briefingView: BriefingView | null;
  onClose: () => void;
};

export const WorkboardBriefingDialog = ({
  open,
  onOpenChange,
  item,
  briefingView,
  onClose,
}: Props) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='max-w-3xl max-h-[85vh] overflow-hidden flex flex-col'>
        <DialogHeader className='shrink-0'>
          <DialogTitle>Briefing do cliente</DialogTitle>
        </DialogHeader>

        <div className='min-h-0 flex-1 overflow-y-auto pr-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden'>
          {!item ? (
            <p className='text-sm text-muted-foreground'>
              Nenhum briefing selecionado.
            </p>
          ) : !item.briefing ? (
            <p className='text-sm text-muted-foreground'>
              Este pedido não tem briefing disponível.
            </p>
          ) : (
            <div className='grid gap-4'>
              <div className='rounded-xl border p-4'>
                <p className='text-sm font-medium'>
                  {item.email} • {item.product}
                </p>
                {briefingView ? (
                  <p className='mt-1 text-xs text-muted-foreground'>
                    Campos vazios: {briefingView.missing} de{' '}
                    {briefingView.total}
                  </p>
                ) : null}
              </div>

              <div className='grid gap-2'>
                <p className='text-xs font-medium text-muted-foreground'>
                  Campos do formulário
                </p>

                <div className='grid gap-2 sm:grid-cols-2'>
                  {(briefingView?.fields ?? []).map((f) => (
                    <div
                      key={f.key}
                      className={[
                        'rounded-xl border p-3',
                        f.empty ? 'border-amber-200 bg-amber-50' : '',
                        f.wide ? 'sm:col-span-2' : '',
                      ].join(' ')}
                    >
                      <div className='flex items-start justify-between gap-3'>
                        <p
                          className={[
                            'text-xs font-medium',
                            f.empty
                              ? 'text-amber-900'
                              : 'text-muted-foreground',
                          ].join(' ')}
                        >
                          {f.label}
                        </p>

                        {f.empty ? (
                          <Badge
                            variant='outline'
                            className='border-amber-200 bg-amber-50 text-amber-900'
                          >
                            Vazio
                          </Badge>
                        ) : (
                          <Badge
                            variant='outline'
                            className='border-emerald-200 bg-emerald-50 text-emerald-900'
                          >
                            Preenchido
                          </Badge>
                        )}
                      </div>

                      <div className='mt-2 max-h-28 overflow-auto whitespace-pre-wrap wrap-break-word text-sm'>
                        {formatValue(f.value) || '-'}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className='flex justify-end gap-2'>
                <Button variant='outline' className='h-9' onClick={onClose}>
                  Fechar
                </Button>

                {item?.href ? (
                  <Link href={item.href}>
                    <Button variant='outline' className='h-9'>
                      Ver pedido
                    </Button>
                  </Link>
                ) : null}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

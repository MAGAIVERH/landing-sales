import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

import type { TabKey, TabMeta } from './workboard-client.types';
import { Pill } from './workboard-client.ui';

type Props = {
  tab: TabKey;
  onTabChange: (tab: TabKey) => void;
  tabs: TabMeta[];
  activeTitle: string;
};

export const WorkboardTabsCard = ({
  tab,
  onTabChange,
  tabs,
  activeTitle,
}: Props) => {
  return (
    <Card className='rounded-2xl border bg-card shadow-sm'>
      <div className='px-6'>
        <div className='flex items-start justify-between gap-3'>
          <div>
            <p className='text-sm font-semibold'>Filas do dia</p>
            <p className='mt-1 text-xs text-muted-foreground'>
              Selecione uma fila para executar agora.
            </p>
          </div>

          <Badge variant='secondary'>Ativo: {activeTitle}</Badge>
        </div>
      </div>

      <Separator />

      <div className='px-5'>
        <div className='flex flex-wrap gap-2'>
          {tabs.map((t) => (
            <Pill
              key={t.key}
              active={tab === t.key}
              onClick={() => onTabChange(t.key)}
              icon={t.icon}
              title={t.title}
              count={t.count}
            />
          ))}
        </div>
      </div>
    </Card>
  );
};

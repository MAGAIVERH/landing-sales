import * as React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export const DashboardHomeHeader = () => {
  return (
    <div className='flex flex-col gap-2'>
      <div className='flex items-center justify-between gap-3'>
        <div>
          <h1 className='text-xl font-semibold'>Visão geral</h1>
          <p className='text-sm text-muted-foreground'>
            KPIs e operação em filas para entrega rápida.
          </p>
        </div>

        <div className='flex items-center gap-2'>
          <Badge variant='secondary'>Últimos 7 dias</Badge>
          <Link href='/admin/workboard'>
            <Button variant='outline' className='h-9 gap-2'>
              Abrir fila prioritária <ArrowRight className='h-4 w-4' />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

import * as React from 'react';
import Link from 'next/link';
import { MessageCircle } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export const DashboardHomeShortcuts = () => {
  return (
    <Card className='p-4'>
      <div className='flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between'>
        <div>
          <p className='text-sm font-semibold'>Atalhos</p>
          <p className='mt-1 text-xs text-muted-foreground'>
            Acesse rápido triagem e pedidos.
          </p>
        </div>

        <div className='flex flex-wrap items-center gap-2'>
          <Link href='/admin/orders'>
            <Button variant='outline' className='h-9'>
              Pedidos
            </Button>
          </Link>

          <Link href='/admin/leads'>
            <Button variant='outline' className='h-9 gap-2'>
              <MessageCircle className='h-4 w-4' />
              Leads
            </Button>
          </Link>
        </div>
      </div>
    </Card>
  );
};

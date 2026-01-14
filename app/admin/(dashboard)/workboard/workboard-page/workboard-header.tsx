import {
  ArrowRight,
  CheckCircle2,
  Clock,
  CreditCard,
  Sparkles,
} from 'lucide-react';
import Link from 'next/link';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

export const WorkboardHeader = () => {
  return (
    <Card className='rounded-2xl border bg-card p-6 shadow-sm'>
      <div className='flex items-start justify-between gap-3'>
        <div>
          <h1 className='text-xl font-semibold tracking-tight'>
            Operação do dia
          </h1>
          <p className='mt-1 text-xs text-muted-foreground'>
            Prioridades organizadas, com controle no banco: TODO, em andamento,
            concluído.
          </p>
        </div>

        <div className='flex items-center gap-2'>
          <Badge variant='secondary'>Admin</Badge>
          <Link href='/admin'>
            <Button variant='outline' className='h-9 gap-2'>
              Voltar para Visão geral <ArrowRight className='h-4 w-4' />
            </Button>
          </Link>
        </div>
      </div>

      <Separator />

      <div className='flex flex-wrap gap-3 text-xs text-muted-foreground'>
        <div className='flex items-center gap-2'>
          <CheckCircle2 className='h-4 w-4' /> Produção
        </div>
        <div className='flex items-center gap-2'>
          <Clock className='h-4 w-4' /> Cobrar
        </div>
        <div className='flex items-center gap-2'>
          <CreditCard className='h-4 w-4' /> Leads
        </div>
        <div className='flex items-center gap-2'>
          <Sparkles className='h-4 w-4' /> Upsell
        </div>
      </div>
    </Card>
  );
};

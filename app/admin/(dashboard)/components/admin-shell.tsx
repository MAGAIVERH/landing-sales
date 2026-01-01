import { Shield, LogOut } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { AdminNav } from './admin-nav';

type AdminShellProps = {
  children: React.ReactNode;
};

export const AdminShell = ({ children }: AdminShellProps) => {
  return (
    <div className='h-dvh overflow-hidden bg-primary'>
      <div className='h-full w-full px-4 py-6 md:px-6 lg:px-8'>
        <div className='grid h-full gap-6 md:grid-cols-[260px_1fr]'>
          {/* Sidebar */}
          <aside className='no-scrollbar overflow-y-auto rounded-2xl border bg-card p-4'>
            <div className='flex items-center gap-2'>
              <span className='inline-flex h-9 w-9 items-center justify-center rounded-xl border bg-background'>
                <Shield className='h-5 w-5' />
              </span>

              <div className='leading-tight'>
                <p className='text-sm font-semibold'>Admin</p>
                <p className='text-xs text-muted-foreground'>
                  Atendimento e operações
                </p>
              </div>
            </div>

            <Separator className='my-4' />

            <AdminNav />

            <Separator className='my-4' />

            {/* Logout (server-safe) */}
            <form action='/' method='POST'>
              <Button type='submit' variant='outline' className='w-full'>
                <LogOut className='h-4 w-4' />
                Sair
              </Button>
            </form>

            <div className='mt-4 text-xs text-muted-foreground'>
              Dica: use <span className='font-medium'>/admin/leads</span> para
              triagem e <span className='font-medium'>/admin/orders</span> para
              entrega.
            </div>
          </aside>

          {/* Conteúdo */}
          <section className='no-scrollbar overflow-y-auto rounded-2xl border bg-card p-4 md:p-6'>
            {children}
          </section>
        </div>
      </div>
    </div>
  );
};

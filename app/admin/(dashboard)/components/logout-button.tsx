'use client';

import { useRouter } from 'next/navigation';
import { LogOut } from 'lucide-react';

import { Button } from '@/components/ui/button';

export const AdminLogoutButton = () => {
  const router = useRouter();

  const onLogout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' });
    router.push('/admin/login');
    router.refresh();
  };

  return (
    <Button
      variant='outline'
      className='w-full justify-start gap-2'
      onClick={onLogout}
    >
      <LogOut className='h-4 w-4' />
      Sair
    </Button>
  );
};

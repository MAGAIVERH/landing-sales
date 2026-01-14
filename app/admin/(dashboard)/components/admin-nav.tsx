'use client';

import {
  Banknote,
  CreditCard,
  LayoutDashboard,
  ListChecks,
  Users,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const isActiveHref = (pathname: string, href: string) => {
  // /admin deve ficar ativo só quando estiver exatamente em /admin
  if (href === '/admin') return pathname === '/admin';

  // demais itens: ativo para /admin/x e subrotas (/admin/orders/123 etc)
  return pathname === href || pathname.startsWith(`${href}/`);
};

const NavItem = ({
  href,
  label,
  icon: Icon,
  active,
}: {
  href: string;
  label: string;
  icon: React.ElementType;
  active: boolean;
}) => {
  return (
    <Link
      href={href}
      aria-current={active ? 'page' : undefined}
      className={[
        'flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors',
        'outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
        active
          ? 'bg-muted font-medium text-foreground'
          : 'text-foreground hover:bg-muted',
      ].join(' ')}
    >
      <Icon className='h-4 w-4' />
      {label}
    </Link>
  );
};

export const AdminNav = () => {
  const pathname = usePathname();

  return (
    <nav className='grid gap-1'>
      <NavItem
        href='/admin'
        label='Visão geral'
        icon={LayoutDashboard}
        active={isActiveHref(pathname, '/admin')}
      />
      <NavItem
        href='/admin/workboard'
        label='Operação'
        icon={ListChecks}
        active={isActiveHref(pathname, '/admin/workboard')}
      />
      <NavItem
        href='/admin/leads'
        label='Leads'
        icon={Users}
        active={isActiveHref(pathname, '/admin/leads')}
      />
      <NavItem
        href='/admin/orders'
        label='Pedidos'
        icon={CreditCard}
        active={isActiveHref(pathname, '/admin/orders')}
      />

      <NavItem
        href='/admin/finance'
        label='Financeiro'
        icon={Banknote}
        active={isActiveHref(pathname, '/admin/finance')}
      />
    </nav>
  );
};

import Link from 'next/link';
import { LayoutDashboard, Users, CreditCard } from 'lucide-react';

const NavItem = ({
  href,
  label,
  icon: Icon,
}: {
  href: string;
  label: string;
  icon: React.ElementType;
}) => {
  return (
    <Link
      href={href}
      className='flex items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-muted'
    >
      <Icon className='h-4 w-4' />
      {label}
    </Link>
  );
};

export const AdminNav = () => {
  return (
    <nav className='grid gap-1'>
      <NavItem href='/admin' label='Visão geral' icon={LayoutDashboard} />
      <NavItem href='/admin/leads' label='Leads' icon={Users} />
      <NavItem href='/admin/orders' label='Pedidos' icon={CreditCard} />
    </nav>
  );
};

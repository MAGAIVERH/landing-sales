import { CheckCircle2, Clock, TrendingUp, Users } from 'lucide-react';

import type { DashboardHomeKpis as Kpis } from './dashboard-home.types';

import { DashboardHomeKpiCard } from './dashboard-home-kpi-card';
import { formatBRL } from './dashboard-home.utils';

type Props = {
  kpis: Kpis;
};

export const DashboardHomeKpis = ({ kpis }: Props) => {
  return (
    <div className='grid gap-3 sm:grid-cols-2 lg:grid-cols-4'>
      <DashboardHomeKpiCard
        label='Receita (7 dias)'
        value={formatBRL(kpis.revenue7Cents)}
        helper={`Hoje: ${kpis.paidOrdersToday} pedido(s) pago(s)`}
        icon={TrendingUp}
        tone='c1'
      />

      <DashboardHomeKpiCard
        label='Leads (7 dias)'
        value={`${kpis.leads7}`}
        helper={`Hoje: ${kpis.leadsToday}`}
        icon={Users}
        tone='c2'
      />

      <DashboardHomeKpiCard
        label='Pedidos pagos (7 dias)'
        value={`${kpis.paidOrders7}`}
        helper={`Conversão: ${kpis.conversion7}%`}
        icon={CheckCircle2}
        tone='c3'
      />

      <DashboardHomeKpiCard
        label='Onboarding pendente'
        value={`${kpis.onboardingPending}`}
        helper={`Iniciados 7d: ${kpis.onboardingsStarted7}`}
        icon={Clock}
        tone='c4'
      />
    </div>
  );
};

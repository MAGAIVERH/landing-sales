import { Separator } from '@/components/ui/separator';

import { WorkflowCarousel } from '../workflow-carousel';
import { DashboardHomeData } from './dashboard-home.types';
import { DashboardHomeHeader } from './dashboard-home-header';
import { DashboardHomeKpis } from './dashboard-home-kpis';
import { DashboardHomeShortcuts } from './dashboard-home-shortcuts';

type Props = {
  data: DashboardHomeData;
};

export const DashboardHome = ({ data }: Props) => {
  return (
    <div className='grid gap-6'>
      <DashboardHomeHeader />

      <Separator />

      <DashboardHomeKpis kpis={data.kpis} />

      <WorkflowCarousel
        ready={data.ready}
        stalled={data.stalled}
        upsells={data.upsells}
        leads={data.leads}
      />

      <DashboardHomeShortcuts />
    </div>
  );
};

import { Separator } from '@/components/ui/separator';
import { WorkflowCarousel } from '../workflow-carousel';

import { DashboardHomeShortcuts } from './dashboard-home-shortcuts';
import { DashboardHomeKpis } from './dashboard-home-kpis';
import { DashboardHomeHeader } from './dashboard-home-header';
import { DashboardHomeData } from './dashboard-home.types';

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

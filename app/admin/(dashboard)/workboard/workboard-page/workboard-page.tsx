import type { WorkboardData } from './workboard.types';

import { WorkboardClient } from '../workboard-client';
import { WorkboardHeader } from './workboard-header';

type Props = {
  data: WorkboardData;
};

export const WorkboardPage = ({ data }: Props) => {
  return (
    <div className='grid gap-3'>
      <WorkboardHeader />

      <WorkboardClient
        ready={data.ready}
        stalled={data.stalled}
        upsells={data.upsells}
        leads={data.leads}
      />
    </div>
  );
};

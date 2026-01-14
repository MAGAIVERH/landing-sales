import type { ComponentProps } from 'react';

import type { WorkboardClient } from '../workboard-client';

type WorkboardClientProps = ComponentProps<typeof WorkboardClient>;

export type WorkboardData = Pick<
  WorkboardClientProps,
  'ready' | 'stalled' | 'upsells' | 'leads'
>;

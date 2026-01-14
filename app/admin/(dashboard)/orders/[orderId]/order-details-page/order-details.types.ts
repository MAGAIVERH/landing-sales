import type { getOrderDetailsData } from './order-details.data';

export type OrderDetailsParams = Promise<{ orderId: string }>;

export type OrderWithIncludes = NonNullable<
  Awaited<ReturnType<typeof getOrderDetailsData>>
>;

export type OrderDetailsPageProps = {
  order: OrderWithIncludes;
};

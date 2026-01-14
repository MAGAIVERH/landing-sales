import { notFound } from 'next/navigation';

import { getOrderDetailsData } from './order-details-page/order-details.data';
import type { OrderDetailsParams } from './order-details-page/order-details.types';
import { OrderDetailsPage } from './order-details-page/order-details-page';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const Page = async ({ params }: { params: OrderDetailsParams }) => {
  const { orderId } = await params;

  const order = await getOrderDetailsData(orderId);

  if (!order) notFound();

  return <OrderDetailsPage order={order} />;
};

export default Page;

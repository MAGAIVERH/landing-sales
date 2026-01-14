import { getOrdersPageData } from './orders-page/orders.data';
import { OrdersPage } from './orders-page/orders.page';

export const dynamic = 'force-dynamic';

type OrdersSearchParams = Promise<
  Record<string, string | string[] | undefined>
>;

const Page = async ({ searchParams }: { searchParams: OrdersSearchParams }) => {
  const sp = await searchParams;
  const data = await getOrdersPageData(sp);

  return <OrdersPage {...data} />;
};

export default Page;

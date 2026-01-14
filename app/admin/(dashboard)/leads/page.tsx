import { getLeadsPageData } from './leads-page/leads.data';
import { LeadsPage } from './leads-page/leads.page';
export const dynamic = 'force-dynamic';

type AdminSearchParams = Promise<Record<string, string | string[] | undefined>>;

const Page = async ({ searchParams }: { searchParams: AdminSearchParams }) => {
  const sp = await searchParams;

  const data = await getLeadsPageData(sp);

  return <LeadsPage {...data} />;
};

export default Page;

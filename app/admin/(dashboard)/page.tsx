import { DashboardHome } from './components/dashboard-home/dashboard-home';
import { getDashboardHomeData } from './components/dashboard-home/dashboard-home.data';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const AdminPage = async () => {
  const data = await getDashboardHomeData();
  return <DashboardHome data={data} />;
};

export default AdminPage;

import { Outlet } from 'react-router-dom';
import DashboardTopbar from '../components/layout/DashboardTopbar';
import BuyerSidebar from '../components/layout/BuyerSidebar';

const BuyerLayout = () => (
  <div className="flex min-h-screen flex-col bg-slate-50">
    <DashboardTopbar title="Buyer Portal" />
    <div className="flex flex-1">
      <aside className="hidden w-56 shrink-0 border-r border-slate-200 bg-white md:block">
        <BuyerSidebar />
      </aside>
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  </div>
);

export default BuyerLayout;

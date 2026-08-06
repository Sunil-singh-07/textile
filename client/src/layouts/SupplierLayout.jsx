import { Outlet } from 'react-router-dom';
import DashboardTopbar from '../components/layout/DashboardTopbar';
import SupplierSidebar from '../components/layout/SupplierSidebar';

const SupplierLayout = () => (
  <div className="flex min-h-screen flex-col bg-slate-50">
    <DashboardTopbar title="Supplier Portal" />
    <div className="flex flex-1">
      <aside className="hidden w-56 shrink-0 border-r border-slate-200 bg-white md:block">
        <SupplierSidebar />
      </aside>
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  </div>
);

export default SupplierLayout;

import { Link } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import Button from '../ui/Button';

const DashboardTopbar = ({ title }) => {
  const { user, logout } = useAuth();

  return (
    <header className="flex items-center justify-between border-b border-slate-200 bg-white px-4 py-3 sm:px-6">
      <Link to="/" className="text-base font-semibold text-brand-800">
        {title}
      </Link>

      <div className="flex items-center gap-3">
        {user?.email && <span className="hidden text-sm text-slate-500 sm:inline">{user.email}</span>}
        <Button variant="outline" size="sm" onClick={logout}>
          <LogOut className="h-4 w-4" />
          Logout
        </Button>
      </div>
    </header>
  );
};

export default DashboardTopbar;

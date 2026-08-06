import { NavLink } from 'react-router-dom';
import { LayoutDashboard, PackageSearch, ShoppingCart, UserCircle } from 'lucide-react';

const NAV_ITEMS = [
  { to: '/buyer/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/orders', label: 'My Orders', icon: PackageSearch },
  { to: '/cart', label: 'Cart', icon: ShoppingCart },
  { to: '/profile', label: 'Profile', icon: UserCircle },
];

const linkClasses = ({ isActive }) =>
  `flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
    isActive ? 'bg-brand-100 text-brand-800' : 'text-slate-600 hover:bg-slate-100'
  }`;

const BuyerSidebar = () => (
  <nav className="flex flex-col gap-1 p-4">
    {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
      <NavLink key={to} to={to} className={linkClasses}>
        <Icon className="h-4 w-4" />
        {label}
      </NavLink>
    ))}
  </nav>
);

export default BuyerSidebar;

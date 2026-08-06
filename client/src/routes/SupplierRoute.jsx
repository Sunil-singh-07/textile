import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import LoadingScreen from '../components/common/LoadingScreen';
import { ROLES } from '../utils/constants';

// Wraps routes gated behind requireAuth + requireRole('supplier') on the
// backend (e.g. /dashboard/supplier, /onboarding/supplier, product CRUD,
// incoming orders).
const SupplierRoute = () => {
  const { isAuthenticated, role, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) return <LoadingScreen />;
  if (!isAuthenticated) return <Navigate to="/login" state={{ from: location }} replace />;
  if (role !== ROLES.SUPPLIER) return <Navigate to="/" replace />;

  return <Outlet />;
};

export default SupplierRoute;

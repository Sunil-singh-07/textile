import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import LoadingScreen from '../components/common/LoadingScreen';
import { ROLES } from '../utils/constants';

// Wraps routes gated behind requireAuth + requireRole('buyer') on the
// backend (e.g. /dashboard/buyer, /onboarding/buyer, /orders).
const BuyerRoute = () => {
  const { isAuthenticated, role, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) return <LoadingScreen />;
  if (!isAuthenticated) return <Navigate to="/login" state={{ from: location }} replace />;
  if (role !== ROLES.BUYER) return <Navigate to="/" replace />;

  return <Outlet />;
};

export default BuyerRoute;

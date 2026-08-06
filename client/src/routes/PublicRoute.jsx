import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import LoadingScreen from '../components/common/LoadingScreen';
import { ROLE_HOME_ROUTE } from '../utils/constants';

// Wraps guest-only routes (login/register) — an already-logged-in user gets
// bounced straight to their role's dashboard instead of seeing the form again.
const PublicRoute = () => {
  const { isAuthenticated, role, isLoading } = useAuth();

  if (isLoading) return <LoadingScreen />;

  if (isAuthenticated) {
    return <Navigate to={ROLE_HOME_ROUTE[role] || '/'} replace />;
  }

  return <Outlet />;
};

export default PublicRoute;

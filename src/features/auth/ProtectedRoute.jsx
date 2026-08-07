import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/features/auth/useAuth';
import { getRedirectPath } from '@/utils/roleRedirect';

/**
 * Guards a route tree by authentication + role.
 * - Not logged in  -> redirect to /login (preserving intended destination)
 * - Wrong role     -> redirect to /forbidden
 * - Needs password change -> redirect to forced change-password screen
 */
export default function ProtectedRoute({ allowedRoles = [], children }) {
  const { isAuthenticated, needsPasswordChange, role } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  if (needsPasswordChange) {
    return <Navigate to="/change-password" replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(role)) {
    return <Navigate to="/forbidden" replace />;
  }

  if (location.pathname === '/login') {
    return <Navigate to={getRedirectPath(role)} replace />;
  }

  return children;
}
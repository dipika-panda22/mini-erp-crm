import {
  Navigate,
  Outlet
} from 'react-router-dom';

import { useAuth } from '../context/AuthContext';

import type { Role } from '../types';

interface ProtectedRouteProps {
  allowedRoles?: Role[];
}

export default function ProtectedRoute({
  allowedRoles
}: ProtectedRouteProps) {
  const { user, token } = useAuth();

  if (!token || !user) {
    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }

  if (
    allowedRoles &&
    !allowedRoles.includes(user.role)
  ) {
    return (
      <Navigate
        to="/"
        replace
      />
    );
  }

  return <Outlet />;
}
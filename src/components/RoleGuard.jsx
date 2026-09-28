import React from 'react';
import { Navigate, useLocation, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function RoleGuard({ allowedRoles = [], children }) {
  const { user, hasRole } = useAuth();
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  const isAllowed = hasRole(allowedRoles);

  if (!isAllowed) {
    return (
      <Navigate
        to="/unauthorized"
        state={{
          from: location,
          requiredRoles: allowedRoles,
          currentRole: user.role_id
        }}
        replace
      />
    );
  }

  return children ? children : <Outlet />;
}

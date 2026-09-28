import React from 'react';
import { Navigate, useLocation, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Loader2 } from 'lucide-react';

export default function ProtectedRoute({ children }) {
  const { user, token, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'var(--bg-primary, #0a0f1d)',
        color: 'var(--text-secondary, #94a3b8)',
        gap: '16px'
      }}>
        <Loader2 className="animate-spin" size={36} color="#38bdf8" />
        <p style={{ fontSize: '0.9rem', letterSpacing: '0.05em' }}>
          Verifying session credentials...
        </p>
      </div>
    );
  }

  if (!token || !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children ? children : <Outlet />;
}

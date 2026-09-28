import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShieldAlert, ArrowLeft, LogOut, KeyRound } from 'lucide-react';

export default function UnauthorizedPage() {
  const { user, roleMeta, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const requiredRoles = location.state?.requiredRoles || ['admin'];
  const currentRole = user?.role_id || 'unassigned';

  const handleSwitchAccount = async () => {
    await logout();
    navigate('/login', { replace: true });
  };

  return (
    <div style={{
      minHeight: '80vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px'
    }}>
      <div className="glass-card" style={{
        maxWidth: '560px',
        width: '100%',
        padding: '36px',
        textAlign: 'center',
        border: '1px solid var(--danger)',
        backgroundColor: 'var(--surface)'
      }}>
        <div style={{
          width: '64px',
          height: '64px',
          borderRadius: '50%',
          backgroundColor: 'var(--danger-tint)',
          border: '1px solid var(--danger)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 20px'
        }}>
          <ShieldAlert size={32} color="var(--danger)" />
        </div>

        <h1 style={{
          fontSize: '1.5rem',
          fontWeight: 800,
          color: 'var(--text-primary)',
          marginBottom: '10px'
        }}>
          Access Restricted (HTTP 403)
        </h1>

        <p style={{
          fontSize: '0.9rem',
          color: 'var(--text-secondary)',
          lineHeight: 1.6,
          marginBottom: '24px'
        }}>
          You do not have the necessary role permissions to access this screen. Under DineIQ Role-Based Access Control (RBAC), access is partitioned by operational responsibility.
        </p>

        {                          }
        <div style={{
          backgroundColor: 'var(--surface-secondary)',
          border: '1px solid var(--border)',
          borderRadius: '8px',
          padding: '16px',
          marginBottom: '28px',
          textAlign: 'left'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '10px',
            fontSize: '0.85rem'
          }}>
            <span style={{ color: 'var(--text-secondary)' }}>Your Authenticated Role:</span>
            <span style={{
              fontWeight: 700,
              padding: '2px 8px',
              borderRadius: '6px',
              backgroundColor: roleMeta?.bgBadge || 'var(--primary-tint)',
              color: roleMeta?.badgeColor || 'var(--primary)',
              fontSize: '0.78rem'
            }}>
              {roleMeta?.name || currentRole}
            </span>
          </div>

          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: '0.85rem'
          }}>
            <span style={{ color: 'var(--text-secondary)' }}>Required Permission:</span>
            <div style={{ display: 'flex', gap: '4px' }}>
              {requiredRoles.map((r) => (
                <span key={r} style={{
                  fontWeight: 700,
                  padding: '2px 8px',
                  borderRadius: '6px',
                  backgroundColor: 'var(--primary-tint)',
                  color: 'var(--primary)',
                  fontSize: '0.78rem'
                }}>
                  {r}
                </span>
              ))}
            </div>
          </div>
        </div>

        {                    }
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
          <button
            onClick={() => navigate('/dashboard')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 18px',
              backgroundColor: 'var(--primary)',
              border: 'none',
              borderRadius: '8px',
              color: '#ffffff',
              fontWeight: 600,
              fontSize: '0.88rem',
              cursor: 'pointer'
            }}
          >
            <ArrowLeft size={16} />
            <span>Return to Permitted View</span>
          </button>

          <button
            onClick={handleSwitchAccount}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 18px',
              backgroundColor: 'transparent',
              border: '1px solid var(--border)',
              borderRadius: '8px',
              color: 'var(--text-primary)',
              fontWeight: 600,
              fontSize: '0.88rem',
              cursor: 'pointer'
            }}
          >
            <LogOut size={16} />
            <span>Switch Role</span>
          </button>
        </div>
      </div>
    </div>
  );
}

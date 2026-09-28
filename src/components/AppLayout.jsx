import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useFilter } from '../context/FilterContext';
import { useAuth } from '../context/AuthContext';
import Sidebar from './Sidebar';
import SearchFilterModal from './SearchFilterModal';
import { HeaderSearch, HeaderNotifications, HeaderProfile } from './HeaderPanels';
import ThemeToggle from './ThemeToggle';
import '../theme/workspace.css';
import {
  Search,
  Bell,
  LogOut,
  MapPin,
  Calendar,
  PanelLeft
} from 'lucide-react';

export default function AppLayout() {
  const { user, roleMeta, logout } = useAuth();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { selectedLocation, setSelectedLocation, selectedDateRange, setSelectedDateRange, locations, dateRangeOptions } = useFilter();
  const supportsFilters = pathname === '/dashboard' || pathname === '/intelligence/locations';

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [panel, setPanel] = useState(null);
  const [signingOut, setSigningOut] = useState(false);
  const [advancedSearch, setAdvancedSearch] = useState(false);
  useEffect(() => {
    const handleKey = (event) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        setPanel(null);
        setIsSearchOpen(open => !open);
      }
      if (event.key === 'Escape') { setIsSearchOpen(false); setAdvancedSearch(false); setPanel(null); }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  const handleLogout = async () => {
    if (signingOut) return;
    setSigningOut(true);
    await logout();
    navigate('/login', { replace: true });
  };

  return (
    <div className="dineiq-workspace"
      style={{
        height: '100vh',
        width: '100vw',
        display: 'flex',
        overflow: 'hidden',
        backgroundColor: 'var(--background)'
      }}
    >
      {                                                            }
      <Sidebar collapsed={sidebarCollapsed} setCollapsed={setSidebarCollapsed} />

      {                                                             }
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          minWidth: 0,
          height: '100vh',
          overflow: 'hidden'
        }}
      >
        {                                                          }
        <header
          style={{
            height: '56px',
            backgroundColor: 'var(--surface)',
            borderBottom: '1px solid var(--border)',
            display: 'flex',
            alignItems: 'center',
            padding: '0 20px',
            gap: '12px',
            flexShrink: 0,
            zIndex: 20
          }}
        >
          {                                                  }
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            aria-label="Toggle Sidebar"
            aria-expanded={!sidebarCollapsed}
            title="Toggle Sidebar"
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--text-secondary)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '6px',
              borderRadius: '6px',
              transition: 'all 0.15s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = 'var(--text-primary)';
              e.currentTarget.style.backgroundColor = 'var(--surface-secondary)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = 'var(--text-secondary)';
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            <PanelLeft size={18} />
          </button>

          {                }
          <button
            type="button"
            aria-label="Open search"
            onClick={() => { setPanel(null); setIsSearchOpen(true); }}
            style={{
              flex: 1,
              maxWidth: '460px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              backgroundColor: 'var(--surface-secondary)',
              border: '1px solid var(--border)',
              borderRadius: '8px',
              padding: '7px 12px',
              cursor: 'pointer',
              transition: 'border-color 0.15s'
            }}
            onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'var(--primary)')}
            onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'var(--border)')}
          >
            <Search size={14} color="var(--text-muted)" />
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', flex: 1, userSelect: 'none' }}>
              Search menus, customers, locations, insights...
            </span>
            <kbd
              style={{
                fontSize: '0.62rem',
                padding: '2px 5px',
                borderRadius: '4px',
                border: '1px solid var(--border)',
                background: 'var(--surface)',
                color: 'var(--text-muted)',
                fontFamily: 'monospace'
              }}
            >
              Ctrl+K
            </kbd>
          </button>

          {            }
          <div style={{ flex: 1 }} />

          {!supportsFilters ? <span style={{ color: 'var(--text-muted)', fontSize: 12 }}>Page-specific data</span> : <>
            <label style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <Calendar size={13} />
              <select aria-label="Date range" value={selectedDateRange} onChange={e => setSelectedDateRange(e.target.value)} style={{ padding: 7, borderRadius: 7, color: 'var(--text-primary)', background: 'var(--surface)', border: '1px solid var(--border)' }}>
                {dateRangeOptions.map(option => <option key={option.value} value={option.value}>{option.label}</option>)}
              </select>
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <MapPin size={13} />
              <select aria-label="Location" value={selectedLocation} onChange={e => setSelectedLocation(e.target.value)} style={{ padding: 7, maxWidth: 210, borderRadius: 7, color: 'var(--text-primary)', background: 'var(--surface)', border: '1px solid var(--border)' }}>
                <option value="ALL">All Locations</option>
                {locations.map(location => <option key={location.location_id} value={location.location_id}>{location.name}</option>)}
              </select>
            </label>
          </>}

          {                   }
          <button
            aria-label="Notifications"
            onClick={() => setPanel('notifications')}
            style={{
              position: 'relative',
              width: '34px',
              height: '34px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '8px',
              border: '1px solid var(--border)',
              background: 'var(--surface-secondary)',
              color: 'var(--text-secondary)',
              cursor: 'pointer',
              flexShrink: 0
            }}
          >
            <Bell size={15} />
          </button>

          {                                 }
          <ThemeToggle style={{ flexShrink: 0 }} />

          {                  }
          {user && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '4px 10px 4px 5px',
                borderRadius: '24px',
                border: '1px solid var(--border)',
                background: 'var(--surface-secondary)',
                cursor: 'default',
                flexShrink: 0
              }}
            >
              <button
                aria-label="Open my profile"
                onClick={() => setPanel('profile')}
                style={{
                  border: 0, cursor: 'pointer',
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  background: roleMeta?.badgeColor || 'var(--primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.74rem',
                  fontWeight: 700,
                  color: '#ffffff',
                  flexShrink: 0
                }}
              >
                {user.full_name ? user.full_name.charAt(0).toUpperCase() : 'U'}
              </button>
              <button onClick={() => setPanel('profile')} aria-label="View profile details" style={{ lineHeight: 1.2, textAlign: 'left', background: 'transparent', border: 0, padding: 0, cursor: 'pointer' }}>
                <div style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-primary)', whiteSpace: 'nowrap' }}>
                  {user.full_name || user.username}
                </div>
                <div style={{ fontSize: '0.64rem', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
                  {roleMeta?.name || user.role_id}
                </div>
              </button>
              <button
                disabled={signingOut}
                onClick={handleLogout}
                aria-label="Sign out"
                title="Sign out"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--text-muted)',
                  cursor: 'pointer',
                  padding: '3px',
                  borderRadius: '4px',
                  marginLeft: '4px'
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--danger)')}
                onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-muted)')}
              >
                <LogOut size={14} />
              </button>
            </div>
          )}
        </header>

        {                   }
        {isSearchOpen && <HeaderSearch onClose={() => setIsSearchOpen(false)} onAdvanced={() => { setIsSearchOpen(false); setAdvancedSearch(true); }} />}
        <SearchFilterModal isOpen={advancedSearch} onClose={() => setAdvancedSearch(false)} />
        {panel === 'notifications' && <HeaderNotifications onClose={() => setPanel(null)} />}
        {panel === 'profile' && <HeaderProfile onClose={() => setPanel(null)} onLogout={handleLogout} signingOut={signingOut} />}

        {                                                          }
        <main
          style={{
            flex: 1,
            overflowY: 'auto',
            overflowX: 'hidden',
            backgroundColor: 'var(--background)',
            minWidth: 0,
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          {                    }
          <div style={{ padding: '16px 24px 32px', flex: 1 }}>
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}

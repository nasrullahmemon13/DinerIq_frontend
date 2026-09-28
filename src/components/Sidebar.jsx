import React from 'react';
import { useAuth } from '../context/AuthContext';
import SidebarItem from './SidebarItem';
import AppIcon from './AppIcon';
import {
  UtensilsCrossed,
  LayoutDashboard,
  Store,
  Users,
  ShoppingCart,
  Tag,
  Star,
  Package,
  Trash2,
  ChartNoAxesCombined,
  UserRoundSearch,
  ShoppingBasket,
  Clock3,
  TrendingUp,
  Recycle,
  BadgePercent,
  MapPinned,
  TriangleAlert,
  BrainCircuit,
  GitCompareArrows,
  Lightbulb,
  FlaskConical,
  CloudUpload,
  Database,
  ShieldCheck,
  Eraser,
  Network,
  Blocks,
  Workflow,
  FileChartColumn,
  UserCog,
  ScrollText,
  Boxes,
  Activity,
  PanelLeftClose,
  PanelLeftOpen
} from 'lucide-react';

export const NAV_SECTIONS = [
  {
    label: 'OVERVIEW',
    items: [
      { path: '/dashboard', name: 'Dashboard', icon: LayoutDashboard, exact: true, allowedRoles: ['admin', 'regional_manager', 'manager', 'analyst'] },
    ]
  },
  {
    label: 'MANAGEMENT',
    items: [
      { path: '/management/restaurants', name: 'Restaurants', icon: Store, allowedRoles: ['admin', 'regional_manager', 'manager', 'analyst'] },
      { path: '/management/menu', name: 'Menu', icon: UtensilsCrossed, allowedRoles: ['admin', 'regional_manager', 'manager', 'analyst'] },
      { path: '/management/customers', name: 'Customers', icon: Users, allowedRoles: ['admin', 'regional_manager', 'manager', 'analyst'] },
      { path: '/management/orders', name: 'Orders', icon: ShoppingCart, allowedRoles: ['admin', 'regional_manager', 'manager'] },
      { path: '/management/promotions', name: 'Promotions', icon: Tag, allowedRoles: ['admin', 'regional_manager'] },
      { path: '/management/ratings', name: 'Ratings', icon: Star, allowedRoles: ['admin', 'regional_manager', 'manager', 'analyst'] },
      { path: '/management/inventory', name: 'Inventory', icon: Package, allowedRoles: ['admin', 'regional_manager', 'manager'] },
      { path: '/management/wastage', name: 'Wastage', icon: Trash2, allowedRoles: ['admin', 'regional_manager', 'manager', 'analyst'] },
    ]
  },
  {
    label: 'INTELLIGENCE',
    items: [
      { path: '/intelligence/menu', name: 'Menu Intelligence', icon: ChartNoAxesCombined, allowedRoles: ['admin', 'regional_manager', 'manager', 'analyst'] },
      { path: '/intelligence/customer', name: 'Customer Intelligence', icon: UserRoundSearch, allowedRoles: ['admin', 'regional_manager', 'manager', 'analyst'] },
      { path: '/intelligence/basket', name: 'Basket Analysis', icon: ShoppingBasket, allowedRoles: ['admin', 'regional_manager', 'analyst'] },
      { path: '/intelligence/peak-periods', name: 'Peak Periods', icon: Clock3, allowedRoles: ['admin', 'regional_manager', 'analyst'] },
      { path: '/intelligence/forecast', name: 'Demand Forecast', icon: TrendingUp, allowedRoles: ['analyst', 'regional_manager', 'admin'] },
      { path: '/intelligence/wastage', name: 'Wastage Intelligence', icon: Recycle, allowedRoles: ['admin', 'regional_manager', 'manager', 'analyst'] },
      { path: '/intelligence/pricing', name: 'Pricing & Promotions', icon: BadgePercent, allowedRoles: ['admin', 'regional_manager', 'analyst'] },
      { path: '/intelligence/locations', name: 'Locations & Channels', icon: MapPinned, allowedRoles: ['admin', 'regional_manager', 'analyst'] },
      { path: '/intelligence/anomalies', name: 'Anomalies & Churn', icon: TriangleAlert, allowedRoles: ['admin', 'analyst'] },
    ]
  },
  {
    label: 'AI & MODELS',
    items: [
      { path: '/models/performance', name: 'Model Performance', icon: BrainCircuit, allowedRoles: ['analyst', 'admin'] },
      { path: '/models/comparison', name: 'Spark vs Python', icon: GitCompareArrows, allowedRoles: ['analyst', 'admin'] },
    ]
  },
  {
    label: 'DECISION SUPPORT',
    items: [
      { path: '/decisions/recommendations', name: 'Recommendations', icon: Lightbulb, allowedRoles: ['admin', 'regional_manager', 'analyst'] },
      { path: '/decisions/what-if', name: 'What-If Analysis', icon: FlaskConical, allowedRoles: ['analyst', 'admin'] },
    ]
  },
  {
    label: 'DATA PIPELINE',
    items: [
      { path: '/data/upload', name: 'Upload & Analyze', icon: CloudUpload, allowedRoles: ['admin', 'analyst', 'regional_manager'] },
      { path: '/data/overview', name: 'Data Overview', icon: Database, allowedRoles: ['admin', 'analyst'] },
      { path: '/data/quality', name: 'Data Quality', icon: ShieldCheck, allowedRoles: ['admin', 'analyst'] },
      { path: '/data/cleaning', name: 'Data Cleaning', icon: Eraser, allowedRoles: ['admin', 'analyst'] },
      { path: '/data/integration', name: 'Data Integration', icon: Network, allowedRoles: ['admin', 'analyst'] },
      { path: '/data/features', name: 'Feature Engineering', icon: Blocks, allowedRoles: ['admin', 'analyst'] },
      { path: '/data/spark', name: 'Spark Processing', icon: Workflow, allowedRoles: ['admin', 'analyst'] },
    ]
  },
  {
    label: 'REPORTS & ADMIN',
    items: [
      { path: '/reports', name: 'Reports & Export', icon: FileChartColumn, allowedRoles: ['admin', 'regional_manager', 'analyst'] },
      { path: '/admin/users', name: 'Users & Roles', icon: UserCog, allowedRoles: ['admin'] },
      { path: '/admin/audit', name: 'Audit Logs', icon: ScrollText, allowedRoles: ['admin'] },
      { path: '/admin/models', name: 'Model Versions', icon: Boxes, allowedRoles: ['admin', 'analyst'] },
      { path: '/system', name: 'System Jobs', icon: Activity, allowedRoles: ['admin'] },
    ]
  }
];

export default function Sidebar({ collapsed, setCollapsed }) {
  const { hasRole } = useAuth();

  return (
    <aside
      aria-label="Main Navigation"
      style={{
        width: collapsed ? '70px' : '240px',
        backgroundColor: 'var(--surface, #0d1a2b)',
        borderRight: '1px solid var(--border, #1e3048)',
        display: 'flex',
        flexDirection: 'column',
        transition: 'width 0.22s cubic-bezier(0.4, 0, 0.2, 1)',
        position: 'relative',
        flexShrink: 0,
        zIndex: 30,
        height: '100vh',
        userSelect: 'none',
        overflow: 'hidden'
      }}
    >
      {                  }
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: collapsed ? 'center' : 'space-between',
          padding: collapsed ? '16px 0' : '14px 16px',
          borderBottom: '1px solid var(--border, #1e3048)',
          minHeight: '60px',
          flexShrink: 0
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', overflow: 'hidden' }}>
          <div
            onClick={() => collapsed && setCollapsed(false)}
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '9px',
              background: 'linear-gradient(135deg, #db7542 0%, #b85e36 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              boxShadow: '0 2px 8px rgba(219, 117, 66, 0.20)',
              cursor: collapsed ? 'pointer' : 'default'
            }}
            title={collapsed ? "Expand sidebar" : undefined}
          >
            <AppIcon icon={UtensilsCrossed} size={20} color="#ffffff" />
          </div>
          {!collapsed && (
            <div style={{ overflow: 'hidden' }}>
              <div style={{ fontSize: '1.02rem', fontWeight: 800, color: 'var(--text-primary)', whiteSpace: 'nowrap', lineHeight: 1.15 }}>
                DineIQ <span style={{ color: 'var(--primary, #168cff)' }}>Analytics</span>
              </div>
              <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', whiteSpace: 'nowrap', fontWeight: 500, letterSpacing: '0.02em' }}>
                Restaurant Intelligence
              </div>
            </div>
          )}
        </div>

        {!collapsed && (
          <button
            onClick={() => setCollapsed(true)}
            aria-label="Collapse sidebar"
            title="Collapse sidebar"
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--text-muted)',
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
              e.currentTarget.style.backgroundColor = 'var(--primary-glow)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = 'var(--text-muted)';
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            <AppIcon icon={PanelLeftClose} size={18} />
          </button>
        )}
      </div>

      {collapsed && (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '6px 0', borderBottom: '1px solid var(--border)' }}>
          <button
            onClick={() => setCollapsed(false)}
            aria-label="Expand sidebar"
            title="Expand sidebar"
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              padding: '6px',
              borderRadius: '6px',
              transition: 'all 0.15s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = 'var(--text-primary)';
              e.currentTarget.style.backgroundColor = 'var(--primary-glow)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = 'var(--text-muted)';
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            <AppIcon icon={PanelLeftOpen} size={18} />
          </button>
        </div>
      )}

      {                     }
      <div
        style={{
          flex: 1,
          padding: '10px 0',
          overflowY: 'auto',
          overflowX: 'hidden',
          scrollbarWidth: 'thin',
          scrollbarColor: 'var(--border) transparent',
        }}
      >
        {NAV_SECTIONS.map((sec) => {
          const visibleItems = sec.items.filter((item) => {
            if (!item.allowedRoles || item.allowedRoles.length === 0) return true;
            return hasRole(item.allowedRoles);
          });

          if (visibleItems.length === 0) return null;

          return (
            <div key={sec.label} style={{ marginBottom: '14px' }}>
              {!collapsed && (
                <div
                  style={{
                    padding: '6px 18px 4px',
                    fontSize: '0.64rem',
                    fontWeight: 700,
                    letterSpacing: '0.08em',
                    color: 'var(--text-muted, #64748b)',
                    textTransform: 'uppercase'
                  }}
                >
                  {sec.label}
                </div>
              )}

              {visibleItems.map((item) => (
                <SidebarItem
                  key={item.name + item.path}
                  icon={item.icon}
                  label={item.name}
                  to={item.path}
                  collapsed={collapsed}
                />
              ))}
            </div>
          );
        })}
      </div>

      {            }
      <div
        style={{
          padding: collapsed ? '12px 0' : '12px 16px',
          borderTop: '1px solid var(--border)',
          flexShrink: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: collapsed ? 'center' : 'flex-start',
          gap: '4px'
        }}
      >
        {!collapsed ? (
          <>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.72rem', fontWeight: 600, color: 'var(--text-primary)' }}>
              <span style={{ width: '7px', height: '7px', borderRadius: '50%', backgroundColor: '#10b981', display: 'inline-block' }} />
              DineIQ Platform v1.0
            </div>
            <div style={{ fontSize: '0.64rem', color: 'var(--text-muted)' }}>
              Restaurant Intelligence
            </div>
          </>
        ) : (
          <span
            title="DineIQ Platform v1.0 — Online"
            style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#10b981', display: 'inline-block' }}
          />
        )}
      </div>
    </aside>
  );
}

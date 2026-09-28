import React from 'react';
import {
  LayoutDashboard,
  UtensilsCrossed,
  Users,
  Trash2,
  TrendingUp,
  GitCompare,
  Activity,
  ShieldCheck,
  Filter,
  Download
} from 'lucide-react';

const DASHBOARD_TABS = [
  { id: 'executive', name: 'Executive Dashboard (Step 42)', icon: LayoutDashboard, available: true },
  { id: 'menu', name: 'Menu Intelligence (Step 43)', icon: UtensilsCrossed, available: true },
  { id: 'customer', name: 'Customer Intelligence (Step 44)', icon: Users, available: true },
  { id: 'wastage', name: 'Wastage Dashboard (Step 45)', icon: Trash2, available: true },
  { id: 'system', name: 'System Ops & Spark (lxi-lxvi)', icon: ShieldCheck, available: true },
  { id: 'forecast', name: 'Forecast Dashboard (Step 46)', icon: TrendingUp, available: false },
  { id: 'comparison', name: 'Dual-Pipeline Comparison (Step 47)', icon: GitCompare, available: false },
];

export default function Navbar({ activeTab, setActiveTab, onOpenSearch, onOpenReports }) {
  return (
    <header style={{ background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border-color)' }}>
      {                }
      <div style={{ maxWidth: '1440px', margin: '0 auto', padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{
            background: 'linear-gradient(135deg, #0ea5e9, #6366f1)',
            width: '42px',
            height: '42px',
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(14, 165, 233, 0.3)'
          }}>
            <UtensilsCrossed size={22} color="#ffffff" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '1.25rem', fontWeight: 800, letterSpacing: '-0.02em', color: 'var(--text-primary)' }}>
                DineIQ <span style={{ color: '#38bdf8' }}>Analytics</span>
              </span>
              <span style={{ fontSize: '0.7rem', padding: '2px 8px', borderRadius: '9999px', background: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8', fontWeight: 600 }}>
                Enterprise v1.0
              </span>
            </div>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: 0 }}>
              Restaurant Big Data & Data Science Intelligence Platform
            </p>
          </div>
        </div>

        {                                         }
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button
            onClick={onOpenSearch}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              background: 'rgba(56, 189, 248, 0.1)',
              border: '1px solid rgba(56, 189, 248, 0.3)',
              color: '#38bdf8',
              padding: '6px 12px',
              borderRadius: '8px',
              fontSize: '0.8rem',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            <Filter size={14} />
            <span>Search &amp; Filter (Step 48)</span>
          </button>

          <button
            onClick={onOpenReports}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              background: 'rgba(99, 102, 241, 0.1)',
              border: '1px solid rgba(99, 102, 241, 0.3)',
              color: '#818cf8',
              padding: '6px 12px',
              borderRadius: '8px',
              fontSize: '0.8rem',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            <Download size={14} />
            <span>Reports &amp; Exports (49-50)</span>
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', color: '#34d399', background: 'rgba(16, 185, 129, 0.1)', padding: '6px 12px', borderRadius: '8px', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
            <Activity size={14} />
            <span>FastAPI (:8000)</span>
          </div>
        </div>
      </div>

      {              }
      <div style={{ maxWidth: '1440px', margin: '0 auto', padding: '0 24px' }}>
        <div className="nav-tabs" style={{ marginBottom: 0 }}>
          {DASHBOARD_TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                className={`nav-tab ${isActive ? 'active' : ''} ${!tab.available ? 'disabled' : ''}`}
                onClick={() => tab.available && setActiveTab(tab.id)}
                title={tab.available ? tab.name : 'Coming next in dashboard suite sequence'}
              >
                <Icon size={16} />
                <span>{tab.name}</span>
                {!tab.available && (
                  <span style={{ fontSize: '0.65rem', background: '#334155', color: 'var(--text-secondary)', padding: '1px 6px', borderRadius: '4px' }}>
                    Next
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
}

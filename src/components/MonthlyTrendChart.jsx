import { formatNumber } from '../utils/formatNumber';
import React, { useState } from 'react';
import { BarChart3, TrendingUp } from 'lucide-react';

export default function MonthlyTrendChart({ trends = [] }) {
  const [metric, setMetric] = useState('revenue');

  if (!trends || trends.length === 0) return null;

  const maxVal = Math.max(...trends.map(t => metric === 'revenue' ? t.revenue : t.profit));

  return (
    <div className="glass-card" style={{ padding: '24px', marginBottom: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <BarChart3 size={20} color="var(--primary)" />
            2025 Annual Performance Trajectory
          </h3>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            Monthly distribution across 20 restaurant locations
          </p>
        </div>

        <div style={{ display: 'flex', gap: '8px', background: 'var(--surface-secondary)', padding: '4px', borderRadius: '8px', border: '1px solid var(--border)' }}>
          <button
            onClick={() => setMetric('revenue')}
            style={{
              padding: '6px 12px',
              fontSize: '0.78rem',
              fontWeight: 600,
              borderRadius: '6px',
              border: 'none',
              cursor: 'pointer',
              background: metric === 'revenue' ? 'var(--primary)' : 'transparent',
              color: metric === 'revenue' ? '#ffffff' : 'var(--text-secondary)'
            }}
          >
            Gross Revenue
          </button>
          <button
            onClick={() => setMetric('profit')}
            style={{
              padding: '6px 12px',
              fontSize: '0.78rem',
              fontWeight: 600,
              borderRadius: '6px',
              border: 'none',
              cursor: 'pointer',
              background: metric === 'profit' ? 'var(--success)' : 'transparent',
              color: metric === 'profit' ? '#ffffff' : 'var(--text-secondary)'
            }}
          >
            Gross Profit
          </button>
        </div>
      </div>

      {                   }
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: '14px', height: '220px', paddingBottom: '30px', position: 'relative' }}>
        {trends.map((item, idx) => {
          const val = metric === 'revenue' ? item.revenue : item.profit;
          const heightPct = Math.round((val / maxVal) * 100);
          const barColor = metric === 'revenue' ? 'linear-gradient(180deg, var(--primary), #0284c7)' : 'linear-gradient(180deg, var(--success), #059669)';

          return (
            <div key={idx} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%', justifyContent: 'flex-end' }}>
              <div
                title={`${item.month}: $${formatNumber(val)}`}
                style={{
                  width: '100%',
                  height: `${heightPct}%`,
                  background: barColor,
                  borderRadius: '6px 6px 2px 2px',
                  transition: 'all 0.3s ease',
                  position: 'relative'
                }}
              />
              <span style={{ position: 'absolute', bottom: '6px', fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 500 }}>
                {item.month}
              </span>
            </div>
          );
        })}
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--border)', paddingTop: '12px', fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
        <span>Network Peak Month: <strong>July ($1,950,400)</strong></span>
        <span>Average Monthly Orders: <strong>7,539 orders/mo</strong></span>
        <span>Average Profit Margin: <strong>56.0%</strong></span>
      </div>
    </div>
  );
}

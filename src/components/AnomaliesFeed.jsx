import React from 'react';
import { AlertCircle, Zap, Star, TrendingDown } from 'lucide-react';

export default function AnomaliesFeed({ anomalies = [] }) {
  if (!anomalies || anomalies.length === 0) {
    return null;
  }

  return (
    <div className="glass-card" style={{ padding: '24px', marginBottom: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ display: 'inline-flex', padding: '4px', borderRadius: '6px', background: 'var(--warning-tint)', color: 'var(--warning)' }}>
              <Zap size={18} />
            </span>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              Real-Time Anomalies &amp; Operational Risk Alerts
            </h3>
            <span className="kpi-badge badge-amber">
              Operational alerts
            </span>
          </div>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            Automated alerts for revenue shocks, sudden rating drop-offs, off-peak demand surges, and volume anomalies.
          </p>
        </div>
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table className="anom-table">
          <thead>
            <tr>
              <th>Domain</th>
              <th>Anomaly Type</th>
              <th>Entity Affected</th>
              <th>Event Date</th>
              <th>Score / Metric</th>
              <th>Description / Findings</th>
            </tr>
          </thead>
          <tbody>
            {anomalies.map((item, idx) => {
              const isSales = item.domain === 'Sales';
              const badgeClass = isSales ? 'badge-rose' : 'badge-amber';
              const Icon = isSales ? TrendingDown : Star;

              return (
                <tr key={idx}>
                  <td>
                    <span className={`kpi-badge ${badgeClass}`} style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                      <Icon size={12} />
                      {item.domain}
                    </span>
                  </td>
                  <td style={{ fontWeight: 600 }}>{item.anomaly_type}</td>
                  <td>
                    <code style={{ fontSize: '0.78rem', background: 'var(--surface-secondary)', padding: '2px 6px', borderRadius: '4px', border: '1px solid var(--border)' }}>
                      {item.entity_id}
                    </code>
                  </td>
                  <td style={{ color: 'var(--text-muted)' }}>{item.date}</td>
                  <td>
                    <span style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                      {item.score_or_metric}
                    </span>
                  </td>
                  <td style={{ color: 'var(--text-secondary)', maxWidth: '380px' }}>{item.description}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

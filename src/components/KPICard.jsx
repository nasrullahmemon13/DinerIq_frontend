import React from 'react';

export default function KPICard({
  title,
  value,
  subtitle,
  icon: Icon,
  badgeText,
  badgeType = 'emerald',
  theme = 'emerald',
  secondaryStat
}) {
  return (
    <div className={`kpi-card ${theme}`}>
      <div className="kpi-header">
        <span className="kpi-title">{title}</span>
        {Icon && (
          <div className="kpi-icon">
            <Icon size={18} color="var(--text-secondary)" />
          </div>
        )}
      </div>

      <div className="kpi-value">{value}</div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div className="kpi-subtitle">
          {badgeText && (
            <span className={`kpi-badge badge-${badgeType}`}>
              {badgeText}
            </span>
          )}
          <span>{subtitle}</span>
        </div>
        {secondaryStat && (
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 500 }}>
            {secondaryStat}
          </div>
        )}
      </div>
    </div>
  );
}

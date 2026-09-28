import { formatNumber } from '../utils/formatNumber';
import React from 'react';
import { AlertTriangle, DollarSign, CheckCircle2, ArrowRight } from 'lucide-react';

export default function CriticalRecommendations({ recommendations = [] }) {
  if (!recommendations || recommendations.length === 0) {
    return (
      <div className="glass-card" style={{ padding: '24px', textAlign: 'center', color: 'var(--text-muted)' }}>
        No critical recommendations pending review.
      </div>
    );
  }

  return (
    <div className="glass-card" style={{ padding: '24px', marginBottom: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ display: 'inline-flex', padding: '4px', borderRadius: '6px', background: 'var(--danger-tint)', color: 'var(--danger)' }}>
              <AlertTriangle size={18} />
            </span>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              Critical Executive Recommendations
            </h3>
            <span className="kpi-badge badge-rose" style={{ marginLeft: '4px' }}>
              Evidence-backed actions
            </span>
          </div>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            Actions requiring executive sign-off based on quantified business impact (impact &ge; $100,000 or severe risk).
          </p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))', gap: '16px' }}>
        {recommendations.map((rec) => (
          <div key={rec.recommendation_id} className="rec-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--danger)', background: 'var(--danger-tint)', padding: '2px 8px', borderRadius: '4px' }}>
                {rec.recommendation_id} &bull; {rec.priority}
              </span>
              <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--success)', display: 'flex', alignItems: 'center', gap: '2px' }}>
                <DollarSign size={14} />
                {Number.isFinite(rec.potential_business_impact)
                  ? `${formatNumber(rec.potential_business_impact, undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })} Estimated impact`
                  : 'Impact unavailable'}
              </span>
            </div>

            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '4px', lineHeight: 1.3 }}>
              {rec.recommended_action}
            </h4>

            <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: '10px' }}>
              Target: <strong style={{ color: 'var(--text-primary)' }}>{rec.target_entity_name}</strong> ({rec.target_entity_type})
            </div>

            <div style={{ borderTop: '1px solid var(--border)', paddingTop: '10px' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Reason & Analytical Evidence:
              </div>
              <ul className="rec-bullets">
                {rec.reason_bullets && rec.reason_bullets.map((bullet, idx) => (
                  <li key={idx}>
                    <span>{bullet}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

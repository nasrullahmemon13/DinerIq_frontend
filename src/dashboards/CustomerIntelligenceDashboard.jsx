import { formatNumber } from '../utils/formatNumber';
import React, { useState, useEffect } from 'react';
import {
  Users,
  Award,
  AlertTriangle,
  Tag,
  TrendingUp,
  Activity,
  Calendar,
  DollarSign,
  Layers,
  Search,
  Filter,
  ArrowUpDown,
  Mail,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Zap,
  Sparkles
} from 'lucide-react';

export default function CustomerIntelligenceDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [activeCohortTab, setActiveCohortTab] = useState('high_value');                                                                            
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSegmentFilter, setSelectedSegmentFilter] = useState('All');

  useEffect(() => {
    fetch('/api/v1/customer-intelligence')
      .then(res => {
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        return res.json();
      })
      .then(payload => {
        setData(payload);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to load customer intelligence:', err);
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div style={{ padding: '60px 24px', textAlign: 'center' }}>
        <div className="spinner" style={{ margin: '0 auto 16px' }}></div>
        <p style={{ color: 'var(--text-secondary)' }}>Loading DineIQ Customer Intelligence Suite...</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="glass-card" style={{ padding: '40px', textAlign: 'center', borderColor: '#ef4444' }}>
        <AlertTriangle size={36} color="#ef4444" style={{ margin: '0 auto 12px' }} />
        <h3 style={{ color: 'var(--text-primary)', marginBottom: '8px' }}>Failed to Load Customer Intelligence</h3>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{error}</p>
      </div>
    );
  }

  const {
    summary_metrics,
    customer_segments,
    rfm_distribution,
    high_value_customers,
    at_risk_customers,
    promotion_sensitive_customers,
    customer_trends
  } = data;

  const formatCurrency = (val) => `$${Number(val || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {            }
      <div className="glass-card" style={{ padding: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
            <span style={{
              background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
              color: '#fff',
              fontSize: '0.75rem',
              fontWeight: 700,
              padding: '4px 10px',
              borderRadius: '6px'
            }}>
              Customer insights
            </span>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
              Customer Intelligence Dashboard
            </h1>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', margin: 0 }}>
            RFM Behavioral Clustering, VIP Lifetime Value, Step 36 Churn Risk Audits &amp; Promotional Sensitivity
          </p>
        </div>

        {                          }
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <div style={{ background: 'var(--surface-secondary)', padding: '8px 14px', borderRadius: '8px', border: '1px solid var(--border-color)', textAlign: 'center' }}>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>Total Database</div>
            <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)' }}>{formatNumber(summary_metrics?.total_customers)} Patrons</div>
          </div>
          <div style={{ background: 'rgba(16, 185, 129, 0.1)', padding: '8px 14px', borderRadius: '8px', border: '1px solid rgba(16, 185, 129, 0.3)', textAlign: 'center' }}>
            <div style={{ fontSize: '0.7rem', color: '#34d399' }}>Total Customer Spend</div>
            <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#34d399' }}>{formatCurrency(summary_metrics.total_spend)}</div>
          </div>
          <div style={{ background: 'rgba(56, 189, 248, 0.1)', padding: '8px 14px', borderRadius: '8px', border: '1px solid rgba(56, 189, 248, 0.3)', textAlign: 'center' }}>
            <div style={{ fontSize: '0.7rem', color: '#38bdf8' }}>Average Order Value</div>
            <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#38bdf8' }}>{formatCurrency(summary_metrics.average_order_value)}</div>
          </div>
        </div>
      </div>

      {                                }
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
        {                          }
        <div
          className="metric-card"
          onClick={() => setActiveCohortTab('high_value')}
          style={{
            cursor: 'pointer',
            border: activeCohortTab === 'high_value' ? '2px solid #10b981' : '1px solid var(--border-color)',
            background: activeCohortTab === 'high_value' ? 'rgba(16, 185, 129, 0.08)' : undefined
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#34d399' }}>High-Value Patrons</span>
            <Award size={18} color="#10b981" />
          </div>
          <div className="metric-value" style={{ color: '#10b981' }}>{formatNumber(summary_metrics?.high_value_count)}</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '6px' }}>
            {formatCurrency(high_value_customers.total_spend)} ({summary_metrics.high_value_spend_share_pct}% total spend)
          </div>
        </div>

        {                       }
        <div
          className="metric-card"
          onClick={() => setActiveCohortTab('at_risk')}
          style={{
            cursor: 'pointer',
            border: activeCohortTab === 'at_risk' ? '2px solid #ef4444' : '1px solid var(--border-color)',
            background: activeCohortTab === 'at_risk' ? 'rgba(239, 68, 68, 0.08)' : undefined
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#f87171' }}>At-Risk Churn Cohort</span>
            <AlertTriangle size={18} color="#ef4444" />
          </div>
          <div className="metric-value" style={{ color: '#f87171' }}>{formatNumber(summary_metrics?.at_risk_count)}</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '6px' }}>
            {formatCurrency(at_risk_customers.total_spend)} ({summary_metrics.at_risk_spend_share_pct}%) revenue at risk
          </div>
        </div>

        {                         }
        <div
          className="metric-card"
          onClick={() => setActiveCohortTab('promo_sensitive')}
          style={{
            cursor: 'pointer',
            border: activeCohortTab === 'promo_sensitive' ? '2px solid #f59e0b' : '1px solid var(--border-color)',
            background: activeCohortTab === 'promo_sensitive' ? 'rgba(245, 158, 11, 0.08)' : undefined
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#fbbf24' }}>Promotion-Sensitive</span>
            <Tag size={18} color="#f59e0b" />
          </div>
          <div className="metric-value" style={{ color: '#fbbf24' }}>{formatNumber(summary_metrics?.promotion_sensitive_count)}</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '6px' }}>
            {formatCurrency(promotion_sensitive_customers.total_spend)} ({summary_metrics.promotion_sensitive_spend_share_pct}%) deal-driven
          </div>
        </div>

        {                   }
        <div className="metric-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#38bdf8' }}>New Customers</span>
            <Sparkles size={18} color="#38bdf8" />
          </div>
          <div className="metric-value" style={{ color: '#38bdf8' }}>{formatNumber(summary_metrics?.new_customers_count)}</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '6px' }}>
            First-order onboarding phase
          </div>
        </div>

        {                          }
        <div className="metric-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#a78bfa' }}>Avg Spend per Diner</span>
            <DollarSign size={18} color="#8b5cf6" />
          </div>
          <div className="metric-value">{formatCurrency(summary_metrics.average_spend_per_customer)}</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '6px' }}>
            Lifetime cumulative spend
          </div>
        </div>

        {                             }
        <div className="metric-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#38bdf8' }}>Avg Order Frequency</span>
            <Activity size={18} color="#0284c7" />
          </div>
          <div className="metric-value">{summary_metrics.average_order_frequency} orders</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '6px' }}>
            Per registered diner account
          </div>
        </div>

        {                          }
        <div className="metric-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)' }}>Average Recency</span>
            <Clock size={18} color="#94a3b8" />
          </div>
          <div className="metric-value">{summary_metrics.average_recency_days} days</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '6px' }}>
            Since last completed order
          </div>
        </div>

        {                        }
        <div className="metric-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Occasional Diners</span>
            <Users size={18} color="#64748b" />
          </div>
          <div className="metric-value">{formatNumber(summary_metrics?.occasional_count)}</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '6px' }}>
            47.1% base with high win-back potential
          </div>
        </div>
      </div>

      {                                                                }
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))', gap: '20px' }}>
        {                                             }
        <div className="glass-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <div>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
                Customer Behavioral Portfolio Mix
              </h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: '2px 0 0' }}>
                Population distribution across 6 algorithmic RFM clusters
              </p>
            </div>
            <span style={{ fontSize: '11px', fontWeight: 600, padding: '3px 8px', borderRadius: '6px', background: 'rgba(99, 102, 241, 0.1)', color: '#818cf8' }}>
              50,000 Patrons
            </span>
          </div>

          {(() => {
            const segColors = {
              'High-Value Loyal': '#10b981',
              'Loyal': '#10b981',
              'Frequent Diners': '#0284c7',
              'Promotion Sensitive': '#f59e0b',
              'Occasional Diners': '#64748b',
              'Occasional': '#64748b',
              'At-Risk': '#ef4444',
              'New Customers': '#38bdf8'
            };

            const radius = 38;
            const circumference = 2 * Math.PI * radius;
            let accumulatedPct = 0;
            const totalCust = summary_metrics?.total_customers ?? 0;

            return (
              <div style={{ display: 'flex', alignItems: 'center', gap: '24px', flex: 1, flexWrap: 'wrap' }}>
                {               }
                <div style={{ position: 'relative', width: '130px', height: '130px', flexShrink: 0, margin: '0 auto' }}>
                  <svg width="130" height="130" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r={radius} fill="transparent" stroke="var(--border-color, rgba(255,255,255,0.1))" strokeWidth="12" />
                    {customer_segments.map((seg) => {
                      const share = (seg.share_pct ?? 0) / 100;
                      const strokeDasharray = `${share * circumference} ${circumference}`;
                      const strokeDashoffset = -accumulatedPct * circumference;
                      accumulatedPct += share;
                      const color = segColors[seg.segment_name] || '#8b5cf6';

                      return (
                        <circle
                          key={seg.segment_name}
                          cx="50"
                          cy="50"
                          r={radius}
                          fill="transparent"
                          stroke={color}
                          strokeWidth="12"
                          strokeDasharray={strokeDasharray}
                          strokeDashoffset={strokeDashoffset}
                          strokeLinecap="round"
                          style={{ transform: 'rotate(-90deg)', transformOrigin: '50px 50px' }}
                        />
                      );
                    })}
                  </svg>
                  <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center' }}>
                    <div style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1 }}>
                      {customer_segments.length}
                    </div>
                    <div style={{ fontSize: '9px', color: 'var(--text-secondary)', textTransform: 'uppercase', marginTop: '2px' }}>
                      Clusters
                    </div>
                  </div>
                </div>

                {                     }
                <div style={{ flex: 1, minWidth: '180px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {customer_segments.map((seg) => {
                    const color = segColors[seg.segment_name] || '#8b5cf6';
                    return (
                      <div key={seg.segment_name} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <div style={{ width: '9px', height: '9px', borderRadius: '3px', background: color }} />
                          <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{seg.segment_name}</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{formatNumber(seg?.customer_count)}</span>
                          <span style={{ color: 'var(--text-secondary)', fontSize: '11px' }}>({seg.share_pct}%)</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })()}
        </div>

        {                                                        }
        <div className="glass-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <div>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
                Revenue Contribution by Segment
              </h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: '2px 0 0' }}>
                Monetary impact comparison: Base size vs total wallet capture
              </p>
            </div>
            <span style={{ fontSize: '11px', fontWeight: 600, padding: '3px 8px', borderRadius: '6px', background: 'rgba(16, 185, 129, 0.1)', color: '#34d399' }}>
              Spend Drivers
            </span>
          </div>

          {                                }
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', flex: 1, justifyContent: 'center' }}>
            {customer_segments.map((seg, idx) => {
              const spendShare = seg.spend_share_pct ?? 0;
              const colors = ['#10b981', '#0284c7', '#f59e0b', '#64748b', '#ef4444', '#38bdf8'];
              const barColor = colors[idx % colors.length];

              return (
                <div key={seg.segment_name} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px' }}>
                    <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{seg.segment_name}</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ color: 'var(--text-secondary)', fontSize: '11px' }}>Avg {formatCurrency(seg.avg_monetary_value)}</span>
                      <span style={{ fontWeight: 700, color: barColor }}>{formatCurrency(seg.total_spend)} ({spendShare}%)</span>
                    </div>
                  </div>
                  <div style={{ width: '100%', height: '8px', background: 'var(--surface-secondary)', borderRadius: '4px', overflow: 'hidden' }}>
                    <div
                      style={{
                        width: `${Math.min(spendShare * 2.5, 100)}%`,
                        height: '100%',
                        background: barColor,
                        borderRadius: '4px',
                        transition: 'width 0.6s ease'
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {                                  }
      <div className="glass-card" style={{ padding: '24px' }}>
        <h2 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '6px' }}>
          Customer Segments Portfolio Breakdown
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', marginBottom: '16px' }}>
          Multi-dimensional behavioral clustering mapping spend, visit cadence, recency, and primary dining channel.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
          {customer_segments.map((seg, idx) => (
            <div
              key={idx}
              style={{
                background: 'var(--surface-secondary)',
                padding: '16px',
                borderRadius: '10px',
                border: '1px solid var(--border-color)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <span style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '0.95rem' }}>{seg.segment_name}</span>
                  <span style={{ fontSize: '0.72rem', padding: '2px 8px', borderRadius: '10px', background: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8', fontWeight: 600 }}>
                    {seg.share_pct}% Base
                  </span>
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '10px' }}>
                  {formatNumber(seg?.customer_count)} customers • Top Channel: <strong style={{ color: 'var(--text-secondary)' }}>{seg.top_channel}</strong>
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '4px' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Total Revenue:</span>
                  <span style={{ color: '#34d399', fontWeight: 700 }}>{formatCurrency(seg.total_spend)} ({seg.spend_share_pct}%)</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  <span>Avg Spend: <strong>{formatCurrency(seg.avg_monetary_value)}</strong></span>
                  <span>AOV: <strong>{formatCurrency(seg.avg_order_value)}</strong></span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {                                                     }
      <div className="glass-card" style={{ padding: '24px' }}>
        <h2 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '6px' }}>
          RFM Distribution (Recency, Frequency, Monetary Indices)
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', marginBottom: '20px' }}>
          Database-wide distribution across the 3 core dimensions of customer value.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
          {                          }
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <span style={{ fontWeight: 700, color: '#38bdf8', fontSize: '0.9rem' }}>Recency (R-Score Distribution)</span>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Avg Score: {rfm_distribution.average_r_score} / 5</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {rfm_distribution.recency_distribution.map((b, i) => {
                const pct = Math.round((b.count / summary_metrics.total_customers) * 100);
                return (
                  <div key={i}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', marginBottom: '3px' }}>
                      <span style={{ color: 'var(--text-secondary)' }}>{b.range}</span>
                      <span style={{ color: 'var(--text-secondary)', fontWeight: 600 }}>{formatNumber(b?.count)} ({pct}%)</span>
                    </div>
                    <div style={{ height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px', overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${pct}%`, background: '#38bdf8' }}></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {                            }
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <span style={{ fontWeight: 700, color: '#a78bfa', fontSize: '0.9rem' }}>Frequency (F-Score Distribution)</span>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Avg Score: {rfm_distribution.average_f_score} / 5</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {rfm_distribution.frequency_distribution.map((b, i) => {
                const pct = Math.round((b.count / summary_metrics.total_customers) * 100);
                return (
                  <div key={i}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', marginBottom: '3px' }}>
                      <span style={{ color: 'var(--text-secondary)' }}>{b.range}</span>
                      <span style={{ color: 'var(--text-secondary)', fontWeight: 600 }}>{formatNumber(b?.count)} ({pct}%)</span>
                    </div>
                    <div style={{ height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px', overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${pct}%`, background: '#8b5cf6' }}></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {                           }
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <span style={{ fontWeight: 700, color: '#34d399', fontSize: '0.9rem' }}>Monetary (M-Score Distribution)</span>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Avg Score: {rfm_distribution.average_m_score} / 5</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {rfm_distribution.monetary_distribution.map((b, i) => {
                const pct = Math.round((b.count / summary_metrics.total_customers) * 100);
                return (
                  <div key={i}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', marginBottom: '3px' }}>
                      <span style={{ color: 'var(--text-secondary)' }}>{b.range}</span>
                      <span style={{ color: 'var(--text-secondary)', fontWeight: 600 }}>{formatNumber(b?.count)} ({pct}%)</span>
                    </div>
                    <div style={{ height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px', overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${pct}%`, background: '#10b981' }}></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {                           }
      <div className="glass-card" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
          <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
            <button
              onClick={() => setActiveCohortTab('high_value')}
              style={{
                background: activeCohortTab === 'high_value' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(255,255,255,0.05)',
                border: activeCohortTab === 'high_value' ? '1px solid #10b981' : '1px solid transparent',
                color: activeCohortTab === 'high_value' ? '#34d399' : '#94a3b8',
                padding: '6px 14px',
                borderRadius: '6px',
                fontSize: '0.8rem',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              High-Value VIP Patrons ({high_value_customers.total_count})
            </button>

            <button
              onClick={() => setActiveCohortTab('at_risk')}
              style={{
                background: activeCohortTab === 'at_risk' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(255,255,255,0.05)',
                border: activeCohortTab === 'at_risk' ? '1px solid #ef4444' : '1px solid transparent',
                color: activeCohortTab === 'at_risk' ? '#f87171' : '#94a3b8',
                padding: '6px 14px',
                borderRadius: '6px',
                fontSize: '0.8rem',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              At-Risk Churn Cohort ({at_risk_customers.total_count})
            </button>

            <button
              onClick={() => setActiveCohortTab('promo_sensitive')}
              style={{
                background: activeCohortTab === 'promo_sensitive' ? 'rgba(245, 158, 11, 0.2)' : 'rgba(255,255,255,0.05)',
                border: activeCohortTab === 'promo_sensitive' ? '1px solid #f59e0b' : '1px solid transparent',
                color: activeCohortTab === 'promo_sensitive' ? '#fbbf24' : '#94a3b8',
                padding: '6px 14px',
                borderRadius: '6px',
                fontSize: '0.8rem',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              Promotion-Sensitive Diners ({promotion_sensitive_customers.total_count})
            </button>

            <button
              onClick={() => setActiveCohortTab('trends')}
              style={{
                background: activeCohortTab === 'trends' ? 'rgba(56, 189, 248, 0.2)' : 'rgba(255,255,255,0.05)',
                border: activeCohortTab === 'trends' ? '1px solid #0284c7' : '1px solid transparent',
                color: activeCohortTab === 'trends' ? '#38bdf8' : '#94a3b8',
                padding: '6px 14px',
                borderRadius: '6px',
                fontSize: '0.8rem',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              Customer Trends &amp; Growth (12 Months)
            </button>
          </div>

          {                }
          <div style={{ position: 'relative', minWidth: '220px' }}>
            <Search size={14} style={{ position: 'absolute', left: '10px', top: '10px', color: 'var(--text-secondary)' }} />
            <input
              type="text"
              placeholder="Search patron by name or ID..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              style={{
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border-color)',
                color: 'var(--text-primary)',
                padding: '6px 12px 6px 32px',
                borderRadius: '6px',
                fontSize: '0.8rem',
                outline: 'none',
                width: '100%'
              }}
            />
          </div>
        </div>

        {                                 }
        {activeCohortTab === 'high_value' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                Showing top high-value VIP patrons contributing <strong>{summary_metrics.high_value_spend_share_pct}%</strong> of restaurant spend.
              </div>
            </div>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.82rem' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-secondary)' }}>
                    <th style={{ padding: '10px 12px' }}>Patron Name / ID</th>
                    <th style={{ padding: '10px 12px' }}>Loyalty Tier</th>
                    <th style={{ padding: '10px 12px' }}>Total Spend</th>
                    <th style={{ padding: '10px 12px' }}>Orders</th>
                    <th style={{ padding: '10px 12px' }}>AOV</th>
                    <th style={{ padding: '10px 12px' }}>Recency</th>
                    <th style={{ padding: '10px 12px' }}>Favorite Category</th>
                    <th style={{ padding: '10px 12px' }}>RFM Cell</th>
                  </tr>
                </thead>
                <tbody>
                  {high_value_customers.customers
                    .filter(c => !searchQuery || c.name.toLowerCase().includes(searchQuery.toLowerCase()) || c.customer_id.toLowerCase().includes(searchQuery.toLowerCase()))
                    .map((cust) => (
                      <tr key={cust.customer_id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                        <td style={{ padding: '10px 12px' }}>
                          <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{cust.name}</div>
                          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{cust.customer_id} • {cust.email}</div>
                        </td>
                        <td style={{ padding: '10px 12px' }}>
                          <span style={{ fontSize: '0.7rem', padding: '2px 8px', borderRadius: '4px', background: 'rgba(245, 158, 11, 0.2)', color: '#fbbf24', fontWeight: 700 }}>
                            {cust.loyalty_tier}
                          </span>
                        </td>
                        <td style={{ padding: '10px 12px', fontWeight: 700, color: '#34d399' }}>{formatCurrency(cust.monetary_value)}</td>
                        <td style={{ padding: '10px 12px', color: 'var(--text-primary)' }}>{cust.frequency}</td>
                        <td style={{ padding: '10px 12px', color: '#38bdf8' }}>{formatCurrency(cust.average_order_value)}</td>
                        <td style={{ padding: '10px 12px', color: 'var(--text-secondary)' }}>{cust.recency}d ago</td>
                        <td style={{ padding: '10px 12px', color: 'var(--text-muted)' }}>{cust.favorite_category}</td>
                        <td style={{ padding: '10px 12px', color: '#a78bfa', fontWeight: 600 }}>{cust.rfm_cell}</td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {                                                    }
        {activeCohortTab === 'at_risk' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                Churn Risk Analysis across 5 factors: <strong>increasing recency, declining frequency, declining monetary, reduced category diversity, lower visit frequency</strong>.
              </div>
            </div>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.82rem' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-secondary)' }}>
                    <th style={{ padding: '10px 12px' }}>Patron / ID</th>
                    <th style={{ padding: '10px 12px' }}>Risk Tier</th>
                    <th style={{ padding: '10px 12px' }}>Risk Score</th>
                    <th style={{ padding: '10px 12px' }}>Primary Risk Driver</th>
                    <th style={{ padding: '10px 12px' }}>Recency</th>
                    <th style={{ padding: '10px 12px' }}>At-Risk Spend</th>
                    <th style={{ padding: '10px 12px' }}>Recommended Retention Action</th>
                  </tr>
                </thead>
                <tbody>
                  {at_risk_customers.customers
                    .filter(c => !searchQuery || c.name.toLowerCase().includes(searchQuery.toLowerCase()) || c.customer_id.toLowerCase().includes(searchQuery.toLowerCase()))
                    .map((cust) => (
                      <tr key={cust.customer_id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                        <td style={{ padding: '10px 12px' }}>
                          <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{cust.name}</div>
                          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{cust.customer_id}</div>
                        </td>
                        <td style={{ padding: '10px 12px' }}>
                          <span style={{ fontSize: '0.7rem', padding: '2px 8px', borderRadius: '4px', background: 'rgba(239, 68, 68, 0.2)', color: '#f87171', fontWeight: 700 }}>
                            {cust.churn_risk_tier}
                          </span>
                        </td>
                        <td style={{ padding: '10px 12px', fontWeight: 700, color: '#f87171' }}>{cust.churn_risk_score}</td>
                        <td style={{ padding: '10px 12px', color: '#fbbf24', fontWeight: 600 }}>{cust.primary_risk_driver}</td>
                        <td style={{ padding: '10px 12px', color: 'var(--text-secondary)' }}>{cust.recency_days}d ago</td>
                        <td style={{ padding: '10px 12px', color: '#34d399', fontWeight: 600 }}>{formatCurrency(cust.monetary_value)}</td>
                        <td style={{ padding: '10px 12px', color: '#38bdf8', fontSize: '0.78rem' }}>{cust.recommended_retention_action}</td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {                                          }
        {activeCohortTab === 'promo_sensitive' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                Diners exhibiting disproportionate purchasing behavior during discount activations ({promotion_sensitive_customers.total_count} patrons).
              </div>
            </div>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.82rem' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-secondary)' }}>
                    <th style={{ padding: '10px 12px' }}>Patron / ID</th>
                    <th style={{ padding: '10px 12px' }}>Promo Sensitivity</th>
                    <th style={{ padding: '10px 12px' }}>Cumulative Spend</th>
                    <th style={{ padding: '10px 12px' }}>Orders</th>
                    <th style={{ padding: '10px 12px' }}>Preferred Channel</th>
                    <th style={{ padding: '10px 12px' }}>Favorite Category</th>
                  </tr>
                </thead>
                <tbody>
                  {promotion_sensitive_customers.customers
                    .filter(c => !searchQuery || c.name.toLowerCase().includes(searchQuery.toLowerCase()) || c.customer_id.toLowerCase().includes(searchQuery.toLowerCase()))
                    .map((cust) => (
                      <tr key={cust.customer_id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                        <td style={{ padding: '10px 12px' }}>
                          <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{cust.name}</div>
                          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{cust.customer_id}</div>
                        </td>
                        <td style={{ padding: '10px 12px' }}>
                          <span style={{ fontSize: '0.72rem', padding: '2px 8px', borderRadius: '4px', background: 'rgba(245, 158, 11, 0.2)', color: '#fbbf24', fontWeight: 700 }}>
                            {cust.promotion_sensitivity}% Deal-Bound
                          </span>
                        </td>
                        <td style={{ padding: '10px 12px', color: '#34d399', fontWeight: 600 }}>{formatCurrency(cust.monetary_value)}</td>
                        <td style={{ padding: '10px 12px', color: 'var(--text-primary)' }}>{cust.frequency}</td>
                        <td style={{ padding: '10px 12px', color: '#38bdf8' }}>{cust.preferred_channel}</td>
                        <td style={{ padding: '10px 12px', color: 'var(--text-muted)' }}>{cust.favorite_category}</td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {                                               }
        {activeCohortTab === 'trends' && (
          <div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '14px' }}>
              Monthly customer onboarding, active diner volume, and repeat order retention trajectories over the fiscal calendar.
            </div>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-secondary)' }}>
                    <th style={{ padding: '10px 12px' }}>Month</th>
                    <th style={{ padding: '10px 12px' }}>New Signups</th>
                    <th style={{ padding: '10px 12px' }}>Active Customers</th>
                    <th style={{ padding: '10px 12px' }}>Repeat Orders</th>
                    <th style={{ padding: '10px 12px' }}>Monthly Spend</th>
                  </tr>
                </thead>
                <tbody>
                  {customer_trends.map((t, idx) => (
                    <tr key={idx} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                      <td style={{ padding: '10px 12px', fontWeight: 700, color: 'var(--text-primary)' }}>{t.month}</td>
                      <td style={{ padding: '10px 12px', color: '#38bdf8' }}>+{t.new_signups} signups</td>
                      <td style={{ padding: '10px 12px', color: '#a78bfa', fontWeight: 600 }}>{formatNumber(t?.active_customers)} active</td>
                      <td style={{ padding: '10px 12px', color: '#34d399' }}>{formatNumber(t?.repeat_orders)} orders</td>
                      <td style={{ padding: '10px 12px', fontWeight: 700, color: 'var(--text-primary)' }}>{formatCurrency(t.monthly_spend)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

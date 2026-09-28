import { BarChart, chartGrid } from '../components/AnalyticsCharts';
import { formatNumber } from '../utils/formatNumber';
import React, { useState, useEffect } from 'react';
import {
  AlertOctagon,
  Users,
  TrendingDown,
  Star,
  Search,
  Filter,
  RefreshCw,
  ShieldAlert,
  ArrowRight,
  UserCheck,
  DollarSign
} from 'lucide-react';

export default function AnomaliesChurnPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [activeTab, setActiveTab] = useState('churn');
  const [selectedTier, setSelectedTier] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      let url = '/api/v1/analytics/anomalies-churn';
      const params = new URLSearchParams();
      if (selectedTier !== 'All') params.append('churn_tier', selectedTier);
      if (searchQuery) params.append('search', searchQuery);
      if (params.toString()) url += `?${params.toString()}`;

      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP error ${res.status}`);
      const json = await res.json();
      setData(json);
    } catch (err) {
      console.error('Error fetching anomalies & churn data:', err);
      setError(err.message || 'Failed to load anomalies and churn intelligence');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [selectedTier, searchQuery]);

  const summary = data?.summary || {
    total_sales_anomalies: 0,
    total_rating_anomalies: 0,
    total_high_risk_customers: 0,
    high_value_revenue_at_risk: 0
  };

  const customers = data?.customers_at_risk || [];
  const salesAnomalies = data?.sales_anomalies || [];
  const ratingAnomalies = data?.rating_anomalies || [];

  const formatCurrency = (val) =>
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(val || 0);

  return (
    <div style={{ padding: '24px 32px 48px', maxWidth: '1600px', margin: '0 auto' }}>
      {                                                                }
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '16px',
          marginBottom: '24px'
        }}
      >
        <div>
          <h1
            style={{
              fontSize: '26px',
              fontWeight: 700,
              color: 'var(--text-primary)',
              letterSpacing: '-0.02em',
              marginBottom: '4px'
            }}
          >
            Anomalies & Customer Churn Watch
          </h1>
          <p style={{ fontSize: '14px', color: 'var(--text-muted)' }}>
            Stored sales and rating anomaly reports, customer risk indicators and historical spend.
          </p>
        </div>

        <button
          onClick={fetchData}
          disabled={loading}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '9px 16px',
            borderRadius: '8px',
            border: '1px solid var(--border)',
            background: 'var(--surface)',
            color: 'var(--text-secondary)',
            fontSize: '13px',
            fontWeight: 500,
            cursor: 'pointer',
            boxShadow: 'var(--shadow-sm)'
          }}
        >
          <RefreshCw size={15} className={loading ? 'animate-spin' : ''} />
          <span>Refresh Analysis</span>
        </button>
      </div>

      {!loading && !error && <div style={chartGrid}>
        <BarChart title="Risk tiers in displayed customer results" subtitle="Current filters · limited to the returned 150-customer list, not the full customer population" unit="customers" data={[...new Set(customers.map(r=>r.churn_risk_tier))].map(label=>({label:label || 'Unspecified',value:customers.filter(r=>r.churn_risk_tier===label).length}))}/>
        <BarChart title="Highest historical spend among listed customers" subtitle="Top 8 returned customers; historical spend is not a prediction of revenue loss" unit="USD" color="#fb7185" data={customers.slice().sort((a,b)=>b.total_spend-a.total_spend).slice(0,8).map(r=>({label:r.customer_id,value:r.total_spend}))}/>
      </div>}
      {                                                               }
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '16px',
          marginBottom: '28px'
        }}
      >
        {                                 }
        <div
          style={{
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            borderRadius: '12px',
            padding: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            boxShadow: 'var(--shadow-sm)'
          }}
        >
          <div
            style={{
              width: '46px',
              height: '46px',
              borderRadius: '10px',
              background: 'rgba(239, 68, 68, 0.1)',
              color: '#ef4444',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Users size={22} />
          </div>
          <div>
            <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              High-Risk VIPs
            </div>
            <div style={{ fontSize: '24px', fontWeight: 700, color: '#ef4444', marginTop: '2px' }}>
              {formatNumber(summary?.total_high_risk_customers)} Guests
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Churn Probability &gt; 70%</div>
          </div>
        </div>

        {                             }
        <div
          style={{
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            borderRadius: '12px',
            padding: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            boxShadow: 'var(--shadow-sm)'
          }}
        >
          <div
            style={{
              width: '46px',
              height: '46px',
              borderRadius: '10px',
              background: 'rgba(245, 158, 11, 0.1)',
              color: '#f59e0b',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <DollarSign size={22} />
          </div>
          <div>
            <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              Revenue at Risk
            </div>
            <div style={{ fontSize: '24px', fontWeight: 700, color: '#f59e0b', marginTop: '2px' }}>
              {formatCurrency(summary.high_value_revenue_at_risk)}
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Historical annual spend</div>
          </div>
        </div>

        {                             }
        <div
          style={{
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            borderRadius: '12px',
            padding: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            boxShadow: 'var(--shadow-sm)'
          }}
        >
          <div
            style={{
              width: '46px',
              height: '46px',
              borderRadius: '10px',
              background: 'rgba(99, 102, 241, 0.1)',
              color: '#6366f1',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <AlertOctagon size={22} />
          </div>
          <div>
            <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              Sales Anomalies
            </div>
            <div style={{ fontSize: '24px', fontWeight: 700, color: 'var(--text-primary)', marginTop: '2px' }}>
              {summary.total_sales_anomalies} Events
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Sudden spikes & drops</div>
          </div>
        </div>

        {                              }
        <div
          style={{
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            borderRadius: '12px',
            padding: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            boxShadow: 'var(--shadow-sm)'
          }}
        >
          <div
            style={{
              width: '46px',
              height: '46px',
              borderRadius: '10px',
              background: 'rgba(236, 72, 153, 0.1)',
              color: '#ec4899',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Star size={22} />
          </div>
          <div>
            <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              Rating Anomalies
            </div>
            <div style={{ fontSize: '24px', fontWeight: 700, color: '#ec4899', marginTop: '2px' }}>
              {summary.total_rating_anomalies} Reviews
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Extreme sentiment outliers</div>
          </div>
        </div>
      </div>

      {                                                                 }
      <div
        style={{
          display: 'flex',
          gap: '8px',
          borderBottom: '1px solid var(--border)',
          marginBottom: '24px',
          paddingBottom: '2px'
        }}
      >
        <button
          onClick={() => setActiveTab('churn')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 18px',
            borderRadius: '8px 8px 0 0',
            border: 'none',
            borderBottom: activeTab === 'churn' ? '2px solid #6366f1' : '2px solid transparent',
            background: activeTab === 'churn' ? 'rgba(99, 102, 241, 0.08)' : 'transparent',
            color: activeTab === 'churn' ? '#6366f1' : 'var(--text-secondary)',
            fontWeight: activeTab === 'churn' ? 600 : 500,
            fontSize: '14px',
            cursor: 'pointer'
          }}
        >
          <Users size={16} />
          <span>VIP Churn Watch ({customers.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('sales')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 18px',
            borderRadius: '8px 8px 0 0',
            border: 'none',
            borderBottom: activeTab === 'sales' ? '2px solid #6366f1' : '2px solid transparent',
            background: activeTab === 'sales' ? 'rgba(99, 102, 241, 0.08)' : 'transparent',
            color: activeTab === 'sales' ? '#6366f1' : 'var(--text-secondary)',
            fontWeight: activeTab === 'sales' ? 600 : 500,
            fontSize: '14px',
            cursor: 'pointer'
          }}
        >
          <AlertOctagon size={16} />
          <span>Sales Volume Anomalies ({salesAnomalies.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('ratings')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 18px',
            borderRadius: '8px 8px 0 0',
            border: 'none',
            borderBottom: activeTab === 'ratings' ? '2px solid #6366f1' : '2px solid transparent',
            background: activeTab === 'ratings' ? 'rgba(99, 102, 241, 0.08)' : 'transparent',
            color: activeTab === 'ratings' ? '#6366f1' : 'var(--text-secondary)',
            fontWeight: activeTab === 'ratings' ? 600 : 500,
            fontSize: '14px',
            cursor: 'pointer'
          }}
        >
          <Star size={16} />
          <span>Rating Sentiment Anomalies ({ratingAnomalies.length})</span>
        </button>
      </div>

      {                                                                }
      {activeTab === 'churn' && (
        <div>
          {                }
          <div
            style={{
              background: 'var(--surface)',
              border: '1px solid var(--border)',
              borderRadius: '12px',
              padding: '16px',
              marginBottom: '20px',
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              gap: '16px',
              boxShadow: 'var(--shadow-sm)'
            }}
          >
            <div
              style={{
                flex: '1 1 240px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                background: 'var(--bg-subtle, rgba(255,255,255,0.04))',
                border: '1px solid var(--border)',
                borderRadius: '8px',
                padding: '8px 12px'
              }}
            >
              <Search size={16} color="var(--text-muted)" />
              <input
                type="text"
                placeholder="Search by customer name or ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  outline: 'none',
                  color: 'var(--text-primary)',
                  fontSize: '13px',
                  width: '100%'
                }}
              />
            </div>

            <select
              value={selectedTier}
              onChange={(e) => setSelectedTier(e.target.value)}
              style={{
                background: 'var(--surface)',
                border: '1px solid var(--border)',
                color: 'var(--text-primary)',
                borderRadius: '8px',
                padding: '8px 12px',
                fontSize: '13px',
                outline: 'none',
                cursor: 'pointer'
              }}
            >
              <option value="All">All Risk Tiers</option>
              <option value="High Risk">High Risk (&gt; 70%)</option>
              <option value="Medium Risk">Medium Risk (40-70%)</option>
              <option value="Low Risk">Low Risk (&lt; 40%)</option>
            </select>
          </div>

          {           }
          <div
            style={{
              background: 'var(--surface)',
              border: '1px solid var(--border)',
              borderRadius: '12px',
              overflow: 'hidden',
              boxShadow: 'var(--shadow-sm)'
            }}
          >
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
                <thead>
                  <tr style={{ background: 'var(--bg-subtle, rgba(0,0,0,0.02))', borderBottom: '1px solid var(--border)' }}>
                    <th style={{ padding: '14px 16px', fontWeight: 600, color: 'var(--text-muted)' }}>Customer</th>
                    <th style={{ padding: '14px 16px', fontWeight: 600, color: 'var(--text-muted)' }}>Loyalty Tier</th>
                    <th style={{ padding: '14px 16px', fontWeight: 600, color: 'var(--text-muted)', textAlign: 'right' }}>Total Spend</th>
                    <th style={{ padding: '14px 16px', fontWeight: 600, color: 'var(--text-muted)', textAlign: 'right' }}>Orders</th>
                    <th style={{ padding: '14px 16px', fontWeight: 600, color: 'var(--text-muted)', textAlign: 'right' }}>Recency</th>
                    <th style={{ padding: '14px 16px', fontWeight: 600, color: 'var(--text-muted)', textAlign: 'center' }}>Risk Tier</th>
                    <th style={{ padding: '14px 16px', fontWeight: 600, color: 'var(--text-muted)' }}>Automated Retention Intervention</th>
                  </tr>
                </thead>
                <tbody>
                  {customers.map((c) => (
                    <tr key={c.customer_id} style={{ borderBottom: '1px solid var(--border)' }}>
                      <td style={{ padding: '14px 16px' }}>
                        <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                          {c.first_name} {c.last_name}
                        </div>
                        <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                          {c.customer_id} • {c.email}
                        </div>
                      </td>
                      <td style={{ padding: '14px 16px' }}>
                        <span
                          style={{
                            padding: '3px 8px',
                            borderRadius: '4px',
                            fontSize: '11px',
                            fontWeight: 600,
                            background:
                              c.loyalty_tier === 'Platinum'
                                ? 'rgba(236, 72, 153, 0.12)'
                                : c.loyalty_tier === 'Gold'
                                ? 'rgba(245, 158, 11, 0.12)'
                                : 'rgba(99, 102, 241, 0.12)',
                            color:
                              c.loyalty_tier === 'Platinum'
                                ? '#ec4899'
                                : c.loyalty_tier === 'Gold'
                                ? '#f59e0b'
                                : '#6366f1'
                          }}
                        >
                          {c.loyalty_tier || 'Member'}
                        </span>
                      </td>
                      <td style={{ padding: '14px 16px', textAlign: 'right', fontWeight: 600, color: 'var(--text-primary)', fontVariantNumeric: 'tabular-nums' }}>
                        {formatCurrency(c.total_spend)}
                      </td>
                      <td style={{ padding: '14px 16px', textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>
                        {c.total_orders}
                      </td>
                      <td style={{ padding: '14px 16px', textAlign: 'right', fontVariantNumeric: 'tabular-nums', color: c.recency_days > 45 ? '#ef4444' : 'var(--text-muted)' }}>
                        {c.recency_days}d ago
                      </td>
                      <td style={{ padding: '14px 16px', textAlign: 'center' }}>
                        <span
                          style={{
                            padding: '3px 8px',
                            borderRadius: '4px',
                            fontSize: '11px',
                            fontWeight: 600,
                            background:
                              c.churn_risk_tier === 'High Risk'
                                ? 'rgba(239, 68, 68, 0.15)'
                                : 'rgba(245, 158, 11, 0.15)',
                            color: c.churn_risk_tier === 'High Risk' ? '#ef4444' : '#f59e0b'
                          }}
                        >
                          {c.churn_risk_tier || 'At Risk'}
                        </span>
                      </td>
                      <td style={{ padding: '14px 16px', color: 'var(--text-secondary)', fontSize: '12.5px' }}>
                        {c.recommended_retention_action || 'Send 15% personalized re-engagement promo'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {                                                                }
      {activeTab === 'sales' && (
        <div
          style={{
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            borderRadius: '12px',
            overflow: 'hidden',
            boxShadow: 'var(--shadow-sm)'
          }}
        >
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
              <thead>
                <tr style={{ background: 'var(--bg-subtle, rgba(0,0,0,0.02))', borderBottom: '1px solid var(--border)' }}>
                  <th style={{ padding: '14px 16px', fontWeight: 600, color: 'var(--text-muted)' }}>Date / Period</th>
                  <th style={{ padding: '14px 16px', fontWeight: 600, color: 'var(--text-muted)' }}>Anomaly Category</th>
                  <th style={{ padding: '14px 16px', fontWeight: 600, color: 'var(--text-muted)' }}>Affected Location / Item</th>
                  <th style={{ padding: '14px 16px', fontWeight: 600, color: 'var(--text-muted)', textAlign: 'right' }}>Financial Impact</th>
                </tr>
              </thead>
              <tbody>
                {salesAnomalies.map((sa, idx) => (
                  <tr key={idx} style={{ borderBottom: '1px solid var(--border)' }}>
                    <td style={{ padding: '14px 16px', color: 'var(--text-muted)' }}>
                      {sa.date_or_period || sa.anomaly_date || 'Recent Period'}
                    </td>
                    <td style={{ padding: '14px 16px', fontWeight: 600, color: '#ef4444' }}>
                      {sa.anomaly_category || 'Sudden Sales Spike'}
                    </td>
                    <td style={{ padding: '14px 16px', color: 'var(--text-primary)' }}>
                      {sa.affected_entity || 'Network Level'}
                    </td>
                    <td style={{ padding: '14px 16px', textAlign: 'right', fontWeight: 600, color: '#10b981', fontVariantNumeric: 'tabular-nums' }}>
                      {formatCurrency(sa.financial_impact_or_score)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {                                                                }
      {activeTab === 'ratings' && (
        <div
          style={{
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            borderRadius: '12px',
            overflow: 'hidden',
            boxShadow: 'var(--shadow-sm)'
          }}
        >
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
              <thead>
                <tr style={{ background: 'var(--bg-subtle, rgba(0,0,0,0.02))', borderBottom: '1px solid var(--border)' }}>
                  <th style={{ padding: '14px 16px', fontWeight: 600, color: 'var(--text-muted)' }}>Review / Period</th>
                  <th style={{ padding: '14px 16px', fontWeight: 600, color: 'var(--text-muted)' }}>Domain</th>
                  <th style={{ padding: '14px 16px', fontWeight: 600, color: 'var(--text-muted)' }}>Anomaly Type</th>
                  <th style={{ padding: '14px 16px', fontWeight: 600, color: 'var(--text-muted)', textAlign: 'center' }}>Score</th>
                </tr>
              </thead>
              <tbody>
                {ratingAnomalies.map((ra, idx) => (
                  <tr key={idx} style={{ borderBottom: '1px solid var(--border)' }}>
                    <td style={{ padding: '14px 16px', color: 'var(--text-muted)' }}>
                      {ra.date_or_period || 'Logged Incident'}
                    </td>
                    <td style={{ padding: '14px 16px', fontWeight: 600, color: 'var(--text-primary)' }}>
                      {ra.domain || 'Ratings'}
                    </td>
                    <td style={{ padding: '14px 16px', color: '#ef4444' }}>
                      {ra.anomaly_type || 'Sudden Rating Drop'}
                    </td>
                    <td style={{ padding: '14px 16px', textAlign: 'center', fontWeight: 700, color: '#f59e0b' }}>
                      {ra.score_or_metric ? Number(ra.score_or_metric).toFixed(2) : '1.00'} / 5.0
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

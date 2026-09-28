import { BarChart, chartGrid } from '../components/AnalyticsCharts';
import React, { useState, useEffect } from 'react';
import {
  DollarSign,
  TrendingDown,
  TrendingUp,
  AlertTriangle,
  Layers,
  Search,
  Filter,
  RefreshCw,
  ShieldAlert,
  Percent,
  Tag,
  CheckCircle2
} from 'lucide-react';

export default function PricingPromotionsPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [activeTab, setActiveTab] = useState('items');
  const [selectedTier, setSelectedTier] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const fetchPricingData = async () => {
    setLoading(true);
    setError(null);
    try {
      let url = '/api/v1/analytics/pricing';
      const params = new URLSearchParams();
      if (selectedTier !== 'All') params.append('tier', selectedTier);
      if (searchQuery) params.append('search', searchQuery);
      if (params.toString()) url += `?${params.toString()}`;

      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP error ${res.status}`);
      const json = await res.json();
      setData(json);
    } catch (err) {
      console.error('Error fetching pricing data:', err);
      setError(err.message || 'Failed to load pricing intelligence');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPricingData();
  }, [selectedTier, searchQuery]);

  const summary = data?.summary || {
    total_analyzed_dishes: 0,
    high_elasticity_count: 0,
    balanced_count: 0,
    low_elasticity_count: 0,
    active_promotion_traps: 0,
    avg_system_margin: null
  };

  const items = data?.items || [];
  const categories = data?.categories || [];
  const traps = data?.traps || [];

  const formatCurrency = (val) =>
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 2
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
            Dynamic Pricing & Promotion Optimization
          </h1>
          <p style={{ fontSize: '14px', color: 'var(--text-muted)' }}>
            Empirical price elasticity tiers, category sensitivity benchmarks, and 5-tier promotion trap detection.
          </p>
        </div>

        <button
          onClick={fetchPricingData}
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
        <BarChart title="Item price sensitivity" subtitle="Top 8 filtered items by absolute empirical elasticity; signed values retained. Observational estimates." unit="elasticity" data={items.filter(r=>Number.isFinite(r.avg_empirical_elasticity)).slice().sort((a,b)=>Math.abs(b.avg_empirical_elasticity)-Math.abs(a.avg_empirical_elasticity)).slice(0,8).map(r=>({label:r.item_name,value:r.avg_empirical_elasticity}))}/>
        <BarChart title="Margins under pricing review" subtitle="Lowest 8 item margins in the current filter; losses remain negative" unit="% margin" color="#fbbf24" data={items.filter(r=>Number.isFinite(r.profit_margin_pct)).slice().sort((a,b)=>a.profit_margin_pct-b.profit_margin_pct).slice(0,8).map(r=>({label:r.item_name,value:r.profit_margin_pct}))}/>
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
        {                          }
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
            <Layers size={22} />
          </div>
          <div>
            <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              Analyzed Dishes
            </div>
            <div style={{ fontSize: '24px', fontWeight: 700, color: 'var(--text-primary)', marginTop: '2px' }}>
              {summary.total_analyzed_dishes} Dishes
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Avg Margin: {summary.avg_system_margin == null ? 'Unavailable' : `${summary.avg_system_margin}%`}</div>
          </div>
        </div>

        {                                        }
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
            <TrendingDown size={22} />
          </div>
          <div>
            <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              High Elasticity
            </div>
            <div style={{ fontSize: '24px', fontWeight: 700, color: '#ef4444', marginTop: '2px' }}>
              {summary.high_elasticity_count} Dishes
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Avoid price increases</div>
          </div>
        </div>

        {                                       }
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
              background: 'rgba(16, 185, 129, 0.1)',
              color: '#10b981',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <TrendingUp size={22} />
          </div>
          <div>
            <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              Low Sensitivity
            </div>
            <div style={{ fontSize: '24px', fontWeight: 700, color: '#10b981', marginTop: '2px' }}>
              {summary.low_elasticity_count} Dishes
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>3-8% pricing headroom</div>
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
            <ShieldAlert size={22} />
          </div>
          <div>
            <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              Promotion Traps
            </div>
            <div style={{ fontSize: '24px', fontWeight: 700, color: '#f59e0b', marginTop: '2px' }}>
              {summary.active_promotion_traps} Traps
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Active margin leakage</div>
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
          onClick={() => setActiveTab('items')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 18px',
            borderRadius: '8px 8px 0 0',
            border: 'none',
            borderBottom: activeTab === 'items' ? '2px solid #6366f1' : '2px solid transparent',
            background: activeTab === 'items' ? 'rgba(99, 102, 241, 0.08)' : 'transparent',
            color: activeTab === 'items' ? '#6366f1' : 'var(--text-secondary)',
            fontWeight: activeTab === 'items' ? 600 : 500,
            fontSize: '14px',
            cursor: 'pointer'
          }}
        >
          <DollarSign size={16} />
          <span>Dish Elasticity Matrix ({items.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('categories')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 18px',
            borderRadius: '8px 8px 0 0',
            border: 'none',
            borderBottom: activeTab === 'categories' ? '2px solid #6366f1' : '2px solid transparent',
            background: activeTab === 'categories' ? 'rgba(99, 102, 241, 0.08)' : 'transparent',
            color: activeTab === 'categories' ? '#6366f1' : 'var(--text-secondary)',
            fontWeight: activeTab === 'categories' ? 600 : 500,
            fontSize: '14px',
            cursor: 'pointer'
          }}
        >
          <Layers size={16} />
          <span>Category Price Sensitivity</span>
        </button>

        <button
          onClick={() => setActiveTab('traps')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 18px',
            borderRadius: '8px 8px 0 0',
            border: 'none',
            borderBottom: activeTab === 'traps' ? '2px solid #6366f1' : '2px solid transparent',
            background: activeTab === 'traps' ? 'rgba(99, 102, 241, 0.08)' : 'transparent',
            color: activeTab === 'traps' ? '#6366f1' : 'var(--text-secondary)',
            fontWeight: activeTab === 'traps' ? 600 : 500,
            fontSize: '14px',
            cursor: 'pointer'
          }}
        >
          <AlertTriangle size={16} />
          <span>Promotion Traps ({traps.length})</span>
        </button>
      </div>

      {                                                                }
      {activeTab === 'items' && (
        <div>
          {             }
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
                placeholder="Search dish name..."
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
              <option value="All">All Sensitivity Tiers</option>
              <option value="High Sensitivity">High Sensitivity (Elastic)</option>
              <option value="Balanced">Balanced</option>
              <option value="Low Sensitivity">Low Sensitivity (Inelastic)</option>
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
                    <th style={{ padding: '14px 16px', fontWeight: 600, color: 'var(--text-muted)' }}>Dish Name</th>
                    <th style={{ padding: '14px 16px', fontWeight: 600, color: 'var(--text-muted)' }}>Category</th>
                    <th style={{ padding: '14px 16px', fontWeight: 600, color: 'var(--text-muted)', textAlign: 'right' }}>Price</th>
                    <th style={{ padding: '14px 16px', fontWeight: 600, color: 'var(--text-muted)', textAlign: 'right' }}>Cost</th>
                    <th style={{ padding: '14px 16px', fontWeight: 600, color: 'var(--text-muted)', textAlign: 'center' }}>Margin %</th>
                    <th style={{ padding: '14px 16px', fontWeight: 600, color: 'var(--text-muted)', textAlign: 'center' }}>Sensitivity Tier</th>
                    <th style={{ padding: '14px 16px', fontWeight: 600, color: 'var(--text-muted)' }}>Pricing Recommendation</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((it) => (
                    <tr key={it.item_id} style={{ borderBottom: '1px solid var(--border)' }}>
                      <td style={{ padding: '14px 16px', fontWeight: 600, color: 'var(--text-primary)' }}>
                        {it.item_name}
                      </td>
                      <td style={{ padding: '14px 16px', color: 'var(--text-muted)' }}>
                        {it.category_name}
                      </td>
                      <td style={{ padding: '14px 16px', textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>
                        {formatCurrency(it.price)}
                      </td>
                      <td style={{ padding: '14px 16px', textAlign: 'right', color: 'var(--text-muted)', fontVariantNumeric: 'tabular-nums' }}>
                        {formatCurrency(it.cost_price)}
                      </td>
                      <td style={{ padding: '14px 16px', textAlign: 'center', fontWeight: 600 }}>
                        {it.profit_margin_pct}%
                      </td>
                      <td style={{ padding: '14px 16px', textAlign: 'center' }}>
                        <span
                          style={{
                            padding: '3px 8px',
                            borderRadius: '4px',
                            fontSize: '11px',
                            fontWeight: 600,
                            background:
                              it.price_sensitivity_tier === 'High Sensitivity'
                                ? 'rgba(239, 68, 68, 0.12)'
                                : it.price_sensitivity_tier === 'Low Sensitivity'
                                ? 'rgba(16, 185, 129, 0.12)'
                                : 'rgba(99, 102, 241, 0.12)',
                            color:
                              it.price_sensitivity_tier === 'High Sensitivity'
                                ? '#ef4444'
                                : it.price_sensitivity_tier === 'Low Sensitivity'
                                ? '#10b981'
                                : '#6366f1'
                          }}
                        >
                          {it.price_sensitivity_tier}
                        </span>
                      </td>
                      <td style={{ padding: '14px 16px', color: 'var(--text-secondary)', fontSize: '12.5px' }}>
                        {it.pricing_recommendation}
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
      {activeTab === 'categories' && (
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
                  <th style={{ padding: '14px 16px', fontWeight: 600, color: 'var(--text-muted)' }}>Category Name</th>
                  <th style={{ padding: '14px 16px', fontWeight: 600, color: 'var(--text-muted)', textAlign: 'right' }}>Total Dishes</th>
                  <th style={{ padding: '14px 16px', fontWeight: 600, color: 'var(--text-muted)', textAlign: 'right' }}>High Sensitivity Items</th>
                  <th style={{ padding: '14px 16px', fontWeight: 600, color: 'var(--text-muted)', textAlign: 'right' }}>Low Sensitivity Items</th>
                  <th style={{ padding: '14px 16px', fontWeight: 600, color: 'var(--text-muted)', textAlign: 'center' }}>Dominant Elasticity</th>
                </tr>
              </thead>
              <tbody>
                {categories.map((c, idx) => (
                  <tr key={idx} style={{ borderBottom: '1px solid var(--border)' }}>
                    <td style={{ padding: '14px 16px', fontWeight: 600, color: 'var(--text-primary)' }}>
                      {c.category_name}
                    </td>
                    <td style={{ padding: '14px 16px', textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>
                      {c.item_count || 10}
                    </td>
                    <td style={{ padding: '14px 16px', textAlign: 'right', color: '#ef4444', fontWeight: 600, fontVariantNumeric: 'tabular-nums' }}>
                      {c.high_sensitivity_count || 0}
                    </td>
                    <td style={{ padding: '14px 16px', textAlign: 'right', color: '#10b981', fontWeight: 600, fontVariantNumeric: 'tabular-nums' }}>
                      {c.low_sensitivity_count || 0}
                    </td>
                    <td style={{ padding: '14px 16px', textAlign: 'center' }}>
                      <span style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>
                        {c.dominant_elasticity_tier || 'Balanced'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {                                                                }
      {activeTab === 'traps' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {traps.map((tr) => (
            <div
              key={tr.promotion_id}
              style={{
                background: 'var(--surface)',
                border: '1px solid var(--border)',
                borderRadius: '12px',
                padding: '20px',
                boxShadow: 'var(--shadow-sm)'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <ShieldAlert size={18} color="#ef4444" />
                  <h3 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>
                    {tr.promotion_name} ({tr.promotion_id})
                  </h3>
                </div>
                <span
                  style={{
                    padding: '3px 8px',
                    borderRadius: '4px',
                    fontSize: '11px',
                    fontWeight: 600,
                    background: 'rgba(239, 68, 68, 0.1)',
                    color: '#ef4444'
                  }}
                >
                  {tr.trap_flags_count || 1} Traps Active
                </span>
              </div>

              <div style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.5', marginBottom: '12px' }}>
                {tr.trap_5_evidence || 'Cannibalization and margin erosion detected for this campaign.'}
              </div>

              <div style={{ fontSize: '12px', color: 'var(--text-muted)', borderTop: '1px solid var(--border)', paddingTop: '10px' }}>
                <strong>Strategic Action:</strong> Redesign discount structure into minimum order requirement ($35+) or eliminate unbundled percentage off.
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

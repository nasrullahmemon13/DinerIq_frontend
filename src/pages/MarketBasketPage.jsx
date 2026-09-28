import { BarChart, chartGrid } from '../components/AnalyticsCharts';
import { formatNumber } from '../utils/formatNumber';
import React, { useState, useEffect, useRef } from 'react';
import {
  ShoppingBag,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Percent,
  Search,
  Filter,
  Layers,
  Zap,
  HelpCircle,
  RefreshCw,
  CheckCircle,
  Tag,
  AlertCircle
} from 'lucide-react';

export default function MarketBasketPage() {
  const [data, setData] = useState(null);
  const latestRequest = useRef(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [activeTab, setActiveTab] = useState('rules');

  const [searchQuery, setSearchQuery] = useState('');
  const [minLift, setMinLift] = useState(1.0);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedAntecedent, setSelectedAntecedent] = useState(null);

  const fetchBasketData = async () => {
    const request = ++latestRequest.current;
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({min_lift:minLift,category:selectedCategory,search:searchQuery});
      const res = await fetch(`/api/v1/analytics/basket?${params}`);
      if (!res.ok) {
        throw new Error(`Failed to load Market Basket data: HTTP ${res.status}`);
      }
      const json = await res.json();
      if (request !== latestRequest.current) return;
      setData(json);
      if (json.association_rules && json.association_rules.length > 0) {
        setSelectedAntecedent(json.association_rules[0].antecedent_name);
      }
    } catch (err) {
      console.error('Market basket fetch error:', err);
      if (request === latestRequest.current) setError(err.message || 'Error loading basket intelligence data');
    } finally {
      if (request === latestRequest.current) setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(fetchBasketData, 150);
    return () => { clearTimeout(timer); latestRequest.current++; };
  }, [minLift, selectedCategory, searchQuery]);

  const summary = data?.summary || {
    total_rules: 0,
    average_lift: 0,
    max_lift: 0,
    strong_associations_count: 0
  };

  const associationRules = data?.association_rules || [];
  const bundleRecommendations = data?.bundle_recommendations || [];

  const categories = ['All', ...(data?.available_categories || [])];

  const filteredRules = associationRules.filter(rule => {
    const matchesSearch =
      !searchQuery ||
      (rule.antecedent_name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (rule.consequent_name || "").toLowerCase().includes(searchQuery.toLowerCase());
    const matchesLift = rule.lift >= minLift;
    const matchesCat =
      selectedCategory === 'All' ||
      rule.antecedent_category === selectedCategory ||
      rule.consequent_category === selectedCategory;
    return matchesSearch && matchesLift && matchesCat;
  });

  const crossSellItems = associationRules.filter(
    r => r.antecedent_name === selectedAntecedent
  );

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
            Market Basket Analysis
          </h1>
          <p style={{ fontSize: '14px', color: 'var(--text-muted)' }}>
            Discover high-affinity menu item pairings, basket associations, and bundle cross-sell opportunities.
          </p>
        </div>

        <button
          onClick={fetchBasketData}
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
        <BarChart title="Strongest item pairings" subtitle="Top 8 currently filtered rules · lift compares pairing with independent purchase likelihood" unit="× lift" data={filteredRules.slice().sort((a,b)=>b.lift-a.lift).slice(0,8).map(r=>({label:`${r.antecedent_name} → ${r.consequent_name}`,value:r.lift}))}/>
        <BarChart title="Pairing confidence" subtitle="Same top 8 rules · share of antecedent orders also containing the consequent" unit="%" color="#34d399" data={filteredRules.slice().sort((a,b)=>b.lift-a.lift).slice(0,8).map(r=>({label:`${r.antecedent_name} → ${r.consequent_name}`,value:r.confidence}))}/>
      </div>}
      {data && <p>Showing {associationRules.length} of {summary.total_rules} matching rules. Bundle suggestions use the full saved report.</p>}
      {                                                               }
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '16px',
          marginBottom: '28px'
        }}
      >
        {                         }
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
            <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Identified Rules
            </div>
            <div style={{ fontSize: '24px', fontWeight: 700, color: 'var(--text-primary)', marginTop: '2px' }}>
              {loading ? '...' : formatNumber(summary?.total_rules)}
            </div>
          </div>
        </div>

        {                                          }
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
            <Zap size={22} />
          </div>
          <div>
            <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Strong Associations
            </div>
            <div style={{ fontSize: '24px', fontWeight: 700, color: '#10b981', marginTop: '2px' }}>
              {loading ? '...' : summary.strong_associations_count}
            </div>
          </div>
        </div>

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
              background: 'rgba(245, 158, 11, 0.1)',
              color: '#f59e0b',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <TrendingUp size={22} />
          </div>
          <div>
            <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Average Lift
            </div>
            <div style={{ fontSize: '24px', fontWeight: 700, color: 'var(--text-primary)', marginTop: '2px' }}>
              {loading ? '...' : `${summary.average_lift}x`}
            </div>
          </div>
        </div>

        {                       }
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
            <Sparkles size={22} />
          </div>
          <div>
            <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Peak Affinity Lift
            </div>
            <div style={{ fontSize: '24px', fontWeight: 700, color: '#ec4899', marginTop: '2px' }}>
              {loading ? '...' : `${summary.max_lift}x`}
            </div>
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
          onClick={() => setActiveTab('rules')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 18px',
            borderRadius: '8px 8px 0 0',
            border: 'none',
            borderBottom: activeTab === 'rules' ? '2px solid #6366f1' : '2px solid transparent',
            background: activeTab === 'rules' ? 'rgba(99, 102, 241, 0.08)' : 'transparent',
            color: activeTab === 'rules' ? '#6366f1' : 'var(--text-secondary)',
            fontWeight: activeTab === 'rules' ? 600 : 500,
            fontSize: '14px',
            cursor: 'pointer'
          }}
        >
          <Layers size={16} />
          <span>Association Rules ({associationRules.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('bundles')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 18px',
            borderRadius: '8px 8px 0 0',
            border: 'none',
            borderBottom: activeTab === 'bundles' ? '2px solid #6366f1' : '2px solid transparent',
            background: activeTab === 'bundles' ? 'rgba(99, 102, 241, 0.08)' : 'transparent',
            color: activeTab === 'bundles' ? '#6366f1' : 'var(--text-secondary)',
            fontWeight: activeTab === 'bundles' ? 600 : 500,
            fontSize: '14px',
            cursor: 'pointer'
          }}
        >
          <Sparkles size={16} />
          <span>Bundle Recommendations ({bundleRecommendations.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('cross_sell')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 18px',
            borderRadius: '8px 8px 0 0',
            border: 'none',
            borderBottom: activeTab === 'cross_sell' ? '2px solid #6366f1' : '2px solid transparent',
            background: activeTab === 'cross_sell' ? 'rgba(99, 102, 241, 0.08)' : 'transparent',
            color: activeTab === 'cross_sell' ? '#6366f1' : 'var(--text-secondary)',
            fontWeight: activeTab === 'cross_sell' ? 600 : 500,
            fontSize: '14px',
            cursor: 'pointer'
          }}
        >
          <ShoppingBag size={16} />
          <span>Interactive Cross-Sell Explorer</span>
        </button>
      </div>

      {                                                                }
      {error && (
        <div
          style={{
            padding: '16px 20px',
            borderRadius: '8px',
            background: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            color: '#ef4444',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            marginBottom: '24px'
          }}
        >
          <AlertCircle size={20} />
          <div>
            <strong>Unable to load Market Basket Analysis:</strong> {error}
          </div>
        </div>
      )}

      {                                                                }
      {activeTab === 'rules' && (
        <div>
          {                     }
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
            {            }
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
                placeholder="Search dish or beverage..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
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

            {                     }
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Filter size={15} color="var(--text-muted)" />
              <select
                value={selectedCategory}
                onChange={e => setSelectedCategory(e.target.value)}
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
                {categories.map(cat => (
                  <option key={cat} value={cat}>
                    Category: {cat}
                  </option>
                ))}
              </select>
            </div>

            {                            }
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '13px', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
                Min Lift:
              </span>
              <select
                value={minLift}
                onChange={e => setMinLift(parseFloat(e.target.value))}
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
                <option value={1.0}>All (Lift &ge; 1.00x)</option>
                <option value={1.03}>Moderate (Lift &ge; 1.03x)</option>
                <option value={1.06}>High (Lift &ge; 1.06x)</option>
                <option value={1.10}>Very High (Lift &ge; 1.10x)</option>
              </select>
            </div>

            <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginLeft: 'auto' }}>
              Showing <strong>{filteredRules.length}</strong> rules
            </div>
          </div>

          {                 }
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
                    <th style={{ padding: '14px 16px', fontWeight: 600, color: 'var(--text-muted)' }}>If Guest Buys (Antecedent)</th>
                    <th style={{ padding: '14px 16px', fontWeight: 600, color: 'var(--text-muted)', width: '30px' }}></th>
                    <th style={{ padding: '14px 16px', fontWeight: 600, color: 'var(--text-muted)' }}>Also Adds (Consequent)</th>
                    <th style={{ padding: '14px 16px', fontWeight: 600, color: 'var(--text-muted)', textAlign: 'right' }}>Support %</th>
                    <th style={{ padding: '14px 16px', fontWeight: 600, color: 'var(--text-muted)', textAlign: 'right' }}>Confidence %</th>
                    <th style={{ padding: '14px 16px', fontWeight: 600, color: 'var(--text-muted)', textAlign: 'center' }}>Lift Score</th>
                    <th style={{ padding: '14px 16px', fontWeight: 600, color: 'var(--text-muted)', textAlign: 'right' }}>Orders</th>
                    <th style={{ padding: '14px 16px', fontWeight: 600, color: 'var(--text-muted)' }}>Actionable Interpretation</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRules.length === 0 ? (
                    <tr>
                      <td colSpan={8} style={{ padding: '48px', textAlign: 'center', color: 'var(--text-muted)' }}>
                        No association rules found matching your filter criteria.
                      </td>
                    </tr>
                  ) : (
                    filteredRules.map((rule, idx) => (
                      <tr
                        key={idx}
                        style={{
                          borderBottom: '1px solid var(--border)',
                          transition: 'background-color 0.15s ease'
                        }}
                      >
                        <td style={{ padding: '14px 16px' }}>
                          <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{rule.antecedent_name}</div>
                          <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>
                            {rule.antecedent_category}
                          </div>
                        </td>
                        <td style={{ padding: '14px 8px', textAlign: 'center', color: '#6366f1' }}>
                          <ArrowRight size={16} />
                        </td>
                        <td style={{ padding: '14px 16px' }}>
                          <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{rule.consequent_name}</div>
                          <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>
                            {rule.consequent_category}
                          </div>
                        </td>
                        <td style={{ padding: '14px 16px', textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>
                          {rule.support ? `${rule.support.toFixed(2)}%` : '—'}
                        </td>
                        <td style={{ padding: '14px 16px', textAlign: 'right', fontVariantNumeric: 'tabular-nums', fontWeight: 600 }}>
                          {rule.confidence ? `${rule.confidence.toFixed(1)}%` : '—'}
                        </td>
                        <td style={{ padding: '14px 16px', textAlign: 'center' }}>
                          <span
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              padding: '4px 10px',
                              borderRadius: '6px',
                              fontWeight: 700,
                              fontSize: '12px',
                              background:
                                rule.lift >= 1.10
                                  ? 'rgba(16, 185, 129, 0.15)'
                                  : rule.lift >= 1.05
                                  ? 'rgba(99, 102, 241, 0.15)'
                                  : 'rgba(148, 163, 184, 0.15)',
                              color:
                                rule.lift >= 1.10
                                  ? '#10b981'
                                  : rule.lift >= 1.05
                                  ? '#6366f1'
                                  : 'var(--text-secondary)'
                            }}
                          >
                            {rule.lift.toFixed(2)}x
                          </span>
                        </td>
                        <td style={{ padding: '14px 16px', textAlign: 'right', fontVariantNumeric: 'tabular-nums', color: 'var(--text-muted)' }}>
                          {rule.joint_orders_count?.toLocaleString() || '—'}
                        </td>
                        <td style={{ padding: '14px 16px', color: 'var(--text-secondary)', maxWidth: '360px', lineHeight: '1.4' }}>
                          {rule.business_interpretation}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {                                                                }
      {activeTab === 'bundles' && (
        <div>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))',
              gap: '20px'
            }}
          >
            {bundleRecommendations.map((bundle, idx) => (
              <div
                key={idx}
                style={{
                  background: 'var(--surface)',
                  border: '1px solid var(--border)',
                  borderRadius: '12px',
                  padding: '20px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  boxShadow: 'var(--shadow-sm)'
                }}
              >
                <div>
                  {               }
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <span
                      style={{
                        padding: '3px 8px',
                        borderRadius: '4px',
                        fontSize: '11px',
                        fontWeight: 600,
                        background: 'rgba(99, 102, 241, 0.1)',
                        color: '#6366f1',
                        textTransform: 'uppercase',
                        letterSpacing: '0.04em'
                      }}
                    >
                      {bundle.recommendation_type || 'Combo Pairing'}
                    </span>
                    <span
                      style={{
                        fontSize: '13px',
                        fontWeight: 700,
                        color: bundle.lift >= 1.10 ? '#10b981' : '#6366f1'
                      }}
                    >
                      {bundle.lift}x Lift
                    </span>
                  </div>

                  {                 }
                  <div
                    style={{
                      background: 'var(--bg-subtle, rgba(255,255,255,0.03))',
                      border: '1px solid var(--border)',
                      borderRadius: '8px',
                      padding: '12px',
                      marginBottom: '14px'
                    }}
                  >
                    <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>
                      1. {bundle.primary_item}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', margin: '4px 0 4px 16px', color: '#6366f1' }}>
                      <ArrowRight size={13} />
                      <span style={{ fontSize: '11px', fontWeight: 600, textTransform: 'uppercase' }}>Recommended Pairing</span>
                    </div>
                    <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>
                      2. {bundle.recommended_item}
                    </div>
                  </div>

                  <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '8px' }}>
                    Category Synergy: <strong>{bundle.category_pair}</strong>
                  </div>

                  <p style={{ fontSize: '12.5px', color: 'var(--text-secondary)', lineHeight: '1.4', margin: 0 }}>
                    {bundle.commercial_rationale}
                  </p>
                </div>

                <div
                  style={{
                    borderTop: '1px solid var(--border)',
                    marginTop: '16px',
                    paddingTop: '12px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    fontSize: '12px',
                    color: 'var(--text-muted)'
                  }}
                >
                  <span>Confidence: <strong>{bundle.confidence}%</strong></span>
                  <span>Support: <strong>{bundle.support}%</strong></span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {                                                                }
      {activeTab === 'cross_sell' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(280px, 340px) 1fr', gap: '24px' }}>
          {                              }
          <div
            style={{
              background: 'var(--surface)',
              border: '1px solid var(--border)',
              borderRadius: '12px',
              padding: '20px',
              height: 'fit-content',
              boxShadow: 'var(--shadow-sm)'
            }}
          >
            <h3 style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '12px' }}>
              Select Anchor Dish
            </h3>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '16px' }}>
              Choose a dish to uncover high-propensity add-ons based on PySpark basket association rules.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '520px', overflowY: 'auto' }}>
              {[...new Set(associationRules.map(r => r.antecedent_name))].slice(0, 30).map((name) => {
                const isSelected = selectedAntecedent === name;
                return (
                  <button
                    key={name}
                    onClick={() => setSelectedAntecedent(name)}
                    style={{
                      textAlign: 'left',
                      padding: '10px 14px',
                      borderRadius: '8px',
                      border: isSelected ? '1px solid #6366f1' : '1px solid var(--border)',
                      background: isSelected ? 'rgba(99, 102, 241, 0.1)' : 'var(--surface)',
                      color: isSelected ? '#6366f1' : 'var(--text-primary)',
                      fontWeight: isSelected ? 600 : 400,
                      fontSize: '13px',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    {name}
                  </button>
                );
              })}
            </div>
          </div>

          {                                   }
          <div
            style={{
              background: 'var(--surface)',
              border: '1px solid var(--border)',
              borderRadius: '12px',
              padding: '24px',
              boxShadow: 'var(--shadow-sm)'
            }}
          >
            <div style={{ marginBottom: '20px' }}>
              <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                Cross-Sell Recommendations for
              </div>
              <h2 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text-primary)', marginTop: '2px' }}>
                {selectedAntecedent || 'Select an item'}
              </h2>
            </div>

            {crossSellItems.length === 0 ? (
              <div style={{ padding: '36px', textAlign: 'center', color: 'var(--text-muted)' }}>
                No active cross-sell pairings logged above minimum threshold for this item.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {crossSellItems.map((item, idx) => (
                  <div
                    key={idx}
                    style={{
                      border: '1px solid var(--border)',
                      borderRadius: '8px',
                      padding: '16px',
                      display: 'flex',
                      flexWrap: 'wrap',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      gap: '12px',
                      background: 'var(--bg-subtle, rgba(255,255,255,0.02))'
                    }}
                  >
                    <div>
                      <div style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text-primary)' }}>
                        {item.consequent_name}
                      </div>
                      <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>
                        Category: {item.consequent_category} • {item.joint_orders_count?.toLocaleString()} co-orders
                      </div>
                      <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '6px' }}>
                        {item.business_interpretation}
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Confidence</div>
                        <div style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-primary)' }}>
                          {item.confidence}%
                        </div>
                      </div>

                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Lift</div>
                        <div
                          style={{
                            fontSize: '15px',
                            fontWeight: 700,
                            color: item.lift >= 1.10 ? '#10b981' : '#6366f1'
                          }}
                        >
                          {item.lift}x
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

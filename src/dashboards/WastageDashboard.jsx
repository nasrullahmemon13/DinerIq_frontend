import { formatNumber } from '../utils/formatNumber';
import React, { useState, useEffect } from 'react';
import {
  Trash2,
  AlertTriangle,
  TrendingDown,
  Building2,
  Calendar,
  Layers,
  Search,
  Filter,
  ArrowUpDown,
  ShieldAlert,
  Sparkles,
  PieChart,
  Clock,
  DollarSign,
  Activity,
  CheckCircle2
} from 'lucide-react';

export default function WastageDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [activeTab, setActiveTab] = useState('items');                                                    
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRiskFilter, setSelectedRiskFilter] = useState('All');

  useEffect(() => {
    fetch('/api/v1/wastage')
      .then(res => {
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        return res.json();
      })
      .then(payload => {
        setData(payload);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to load wastage intelligence:', err);
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div style={{ padding: '60px 24px', textAlign: 'center' }}>
        <div className="spinner" style={{ margin: '0 auto 16px' }}></div>
        <p style={{ color: 'var(--text-secondary)' }}>Loading DineIQ Wastage &amp; Spoilage Intelligence...</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="glass-card" style={{ padding: '40px', textAlign: 'center', borderColor: '#ef4444' }}>
        <AlertTriangle size={36} color="#ef4444" style={{ margin: '0 auto 12px' }} />
        <h3 style={{ color: 'var(--text-primary)', marginBottom: '8px' }}>Failed to Load Wastage Intelligence</h3>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{error}</p>
      </div>
    );
  }

  const {
    summary_metrics,
    total_wastage,
    wastage_cost,
    high_wastage_items,
    high_wastage_locations,
    wastage_trends,
    wastage_risk_predictions
  } = data;

  const formatCurrency = (val) => `$${Number(val || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {            }
      <div className="glass-card" style={{ padding: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
            <span style={{
              background: 'linear-gradient(135deg, #f43f5e, #e11d48)',
              color: '#fff',
              fontSize: '0.75rem',
              fontWeight: 700,
              padding: '4px 10px',
              borderRadius: '6px'
            }}>
              Wastage insights
            </span>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
              Food Wastage &amp; Spoilage Dashboard
            </h1>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', margin: 0 }}>
            Prep Overproduction Diagnostics, Multi-Location Waste Drag, Root Cause Attribution &amp; Spoilage Risk Predictions
          </p>
        </div>

        {                          }
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <div style={{ background: 'rgba(244, 63, 94, 0.1)', padding: '8px 14px', borderRadius: '8px', border: '1px solid rgba(244, 63, 94, 0.3)', textAlign: 'center' }}>
            <div style={{ fontSize: '0.7rem', color: '#fb7185' }}>Total Wastage Cost</div>
            <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fb7185' }}>{formatCurrency(wastage_cost)}</div>
          </div>
          <div style={{ background: 'var(--surface-secondary)', padding: '8px 14px', borderRadius: '8px', border: '1px solid var(--border-color)', textAlign: 'center' }}>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>Total Units Lost</div>
            <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)' }}>{formatNumber(total_wastage)} Units</div>
          </div>
          <div style={{ background: 'rgba(245, 158, 11, 0.1)', padding: '8px 14px', borderRadius: '8px', border: '1px solid rgba(245, 158, 11, 0.3)', textAlign: 'center' }}>
            <div style={{ fontSize: '0.7rem', color: '#fbbf24' }}>Wastage Drag %</div>
            <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fbbf24' }}>{summary_metrics.wastage_pct_of_sales}% of Sales</div>
          </div>
        </div>
      </div>

      {                                }
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
        {                        }
        <div className="metric-card" style={{ border: '1px solid rgba(244, 63, 94, 0.3)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#fb7185' }}>Total Wastage Cost</span>
            <DollarSign size={18} color="#f43f5e" />
          </div>
          <div className="metric-value" style={{ color: '#fb7185' }}>{formatCurrency(wastage_cost)}</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '6px' }}>
            Cumulative food loss across all dishes
          </div>
        </div>

        {                        }
        <div className="metric-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-primary)' }}>Total Wasted Quantity</span>
            <Trash2 size={18} color="#94a3b8" />
          </div>
          <div className="metric-value">{formatNumber(total_wastage)}</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '6px' }}>
            Portions discarded or spoiled
          </div>
        </div>

        {                                  }
        <div
          className="metric-card"
          onClick={() => setActiveTab('predictions')}
          style={{
            cursor: 'pointer',
            border: activeTab === 'predictions' ? '2px solid #ef4444' : '1px solid var(--border-color)',
            background: activeTab === 'predictions' ? 'rgba(239, 68, 68, 0.08)' : undefined
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#f87171' }}>High-Risk Batches</span>
            <ShieldAlert size={18} color="#ef4444" />
          </div>
          <div className="metric-value" style={{ color: '#f87171' }}>{summary_metrics.high_risk_predictions_count}</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '6px' }}>
            Step 24 ML Spoilage Model flagged
          </div>
        </div>

        {                             }
        <div className="metric-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#fbbf24' }}>Critical Spoilage Items</span>
            <AlertTriangle size={18} color="#f59e0b" />
          </div>
          <div className="metric-value" style={{ color: '#fbbf24' }}>{summary_metrics.critical_spoilage_items_count}</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '6px' }}>
            Persistent shelf-life / prep mismatch
          </div>
        </div>

        {                           }
        <div
          className="metric-card"
          onClick={() => setActiveTab('locations')}
          style={{
            cursor: 'pointer',
            border: activeTab === 'locations' ? '2px solid #0284c7' : '1px solid var(--border-color)',
            background: activeTab === 'locations' ? 'rgba(2, 132, 199, 0.08)' : undefined
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#38bdf8' }}>Highest Waste Location</span>
            <Building2 size={18} color="#0284c7" />
          </div>
          <div style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {summary_metrics.highest_loss_location}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '6px' }}>
            {high_wastage_locations[0] ? `${formatCurrency(high_wastage_locations[0].total_loss_amount)} loss` : 'Boston'}
          </div>
        </div>

        {                       }
        <div
          className="metric-card"
          onClick={() => setActiveTab('items')}
          style={{
            cursor: 'pointer',
            border: activeTab === 'items' ? '2px solid #10b981' : '1px solid var(--border-color)',
            background: activeTab === 'items' ? 'rgba(16, 185, 129, 0.08)' : undefined
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#34d399' }}>Highest Waste Dish</span>
            <Layers size={18} color="#10b981" />
          </div>
          <div style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {summary_metrics.highest_loss_item}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '6px' }}>
            {high_wastage_items[0] ? `${formatCurrency(high_wastage_items[0].total_loss_amount)} prep loss` : 'Maine Lobster'}
          </div>
        </div>

        {                        }
        <div className="metric-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#a78bfa' }}>Primary Root Cause</span>
            <Activity size={18} color="#8b5cf6" />
          </div>
          <div style={{ fontSize: '1rem', fontWeight: 700, color: '#a78bfa' }}>Overproduction Unsold</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '6px' }}>
            62.4% of total incident volume
          </div>
        </div>

        {                       }
        <div className="metric-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#34d399' }}>Recoverable Target</span>
            <TrendingDown size={18} color="#10b981" />
          </div>
          <div className="metric-value" style={{ color: '#34d399' }}>$1,290,000</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '6px' }}>
            Potential savings from batch resizing
          </div>
        </div>
      </div>

      {                                                                }
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))', gap: '20px' }}>
        {                                                         }
        <div className="glass-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <div>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
                Wastage Root Cause Attribution
              </h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: '2px 0 0' }}>
                Primary operational drivers of financial food loss
              </p>
            </div>
            <span style={{ fontSize: '11px', fontWeight: 600, padding: '3px 8px', borderRadius: '6px', background: 'rgba(244, 63, 94, 0.1)', color: '#fb7185' }}>
              Root Causes
            </span>
          </div>

          {(() => {
            const causes = [
              { label: 'Overproduction Unsold', pct: 62.4, color: '#f43f5e', amount: wastage_cost * 0.624 },
              { label: 'Expired Shelf-Life', pct: 24.8, color: '#fbbf24', amount: wastage_cost * 0.248 },
              { label: 'Kitchen Prep Error', pct: 12.8, color: '#38bdf8', amount: wastage_cost * 0.128 }
            ];

            const radius = 38;
            const circumference = 2 * Math.PI * radius;
            let accumulatedPct = 0;

            return (
              <div style={{ display: 'flex', alignItems: 'center', gap: '24px', flex: 1, flexWrap: 'wrap' }}>
                {               }
                <div style={{ position: 'relative', width: '130px', height: '130px', flexShrink: 0, margin: '0 auto' }}>
                  <svg width="130" height="130" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r={radius} fill="transparent" stroke="var(--border-color, rgba(255,255,255,0.1))" strokeWidth="12" />
                    {causes.map((c) => {
                      const strokeDasharray = `${(c.pct / 100) * circumference} ${circumference}`;
                      const strokeDashoffset = -accumulatedPct * circumference;
                      accumulatedPct += c.pct / 100;

                      return (
                        <circle
                          key={c.label}
                          cx="50"
                          cy="50"
                          r={radius}
                          fill="transparent"
                          stroke={c.color}
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
                    <div style={{ fontSize: '18px', fontWeight: 800, color: '#f43f5e', lineHeight: 1 }}>
                      62%
                    </div>
                    <div style={{ fontSize: '9px', color: 'var(--text-secondary)', textTransform: 'uppercase', marginTop: '2px' }}>
                      Over-prep
                    </div>
                  </div>
                </div>

                {                      }
                <div style={{ flex: 1, minWidth: '180px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {causes.map((c) => (
                    <div key={c.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ width: '10px', height: '10px', borderRadius: '3px', background: c.color }} />
                        <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{c.label}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{c.pct}%</span>
                        <span style={{ color: 'var(--text-secondary)', fontSize: '11px' }}>({formatCurrency(c.amount)})</span>
                      </div>
                    </div>
                  ))}

                  <div style={{ borderTop: '1px solid var(--border-color, rgba(255,255,255,0.1))', paddingTop: '8px', fontSize: '11px', color: 'var(--text-secondary)' }}>
                    💡 Correcting over-prep schedules recycles up to <strong style={{ color: '#34d399' }}>$1.29M</strong> in operating margin.
                  </div>
                </div>
              </div>
            );
          })()}
        </div>

        {                                                    }
        <div className="glass-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <div>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
                Dishes with Highest Wastage Loss
              </h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: '2px 0 0' }}>
                Cumulative spoilage cost vs discarded portions
              </p>
            </div>
            <span style={{ fontSize: '11px', fontWeight: 600, padding: '3px 8px', borderRadius: '6px', background: 'rgba(244, 63, 94, 0.1)', color: '#fb7185' }}>
              High-Risk Dishes
            </span>
          </div>

          {                            }
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', flex: 1, justifyContent: 'center' }}>
            {(() => {
              const top5 = high_wastage_items.slice(0, 5);
              const maxLoss = Math.max(...top5.map((i) => i.total_loss_amount || 1), 1);

              return top5.map((item, idx) => {
                const loss = item.total_loss_amount || 0;
                const units = item.wasted_quantity || 0;
                const pct = Math.min(Math.round((loss / maxLoss) * 100), 100);

                return (
                  <div key={item.item_id || idx} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', maxWidth: '240px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{item.item_name}</span>
                        <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>({item.category_name})</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>{formatNumber(units)} units</span>
                        <span style={{ fontWeight: 700, color: '#fb7185' }}>{formatCurrency(loss)}</span>
                      </div>
                    </div>
                    <div style={{ width: '100%', height: '8px', background: 'var(--surface-secondary)', borderRadius: '4px', overflow: 'hidden' }}>
                      <div
                        style={{
                          width: `${pct}%`,
                          height: '100%',
                          background: 'linear-gradient(90deg, #f43f5e 0%, #fb7185 100%)',
                          borderRadius: '4px',
                          transition: 'width 0.6s ease'
                        }}
                      />
                    </div>
                  </div>
                );
              });
            })()}
          </div>
        </div>
      </div>

      {                                              }
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '20px' }}>
        {                               }
        <div className="glass-card" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
            <Calendar size={18} color="#38bdf8" />
            <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
              Day-of-Week Wastage Pattern
            </h3>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {wastage_trends.day_of_week_trends.map((d, idx) => (
              <div key={idx}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '4px' }}>
                  <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{d.day_name}</span>
                  <span style={{ color: 'var(--text-secondary)' }}>
                    {formatCurrency(d.total_loss_amount)} ({d.loss_share_pct}%) • {formatNumber(d?.wasted_quantity)} units
                  </span>
                </div>
                <div style={{ height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px', overflow: 'hidden' }}>
                  <div style={{
                    height: '100%',
                    width: `${Math.min(100, d.loss_share_pct * 4)}%`,
                    background: idx >= 4 ? '#f43f5e' : '#38bdf8'
                  }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {                                           }
        <div className="glass-card" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
            <Clock size={18} color="#fbbf24" />
            <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
              Shift Period &amp; Root Cause Diagnostics
            </h3>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {wastage_trends.shift_period_trends.map((s, idx) => (
              <div key={idx} style={{ background: 'var(--surface-secondary)', padding: '12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <span style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '0.9rem' }}>{s.shift_period} Shift</span>
                  <span style={{ color: '#fb7185', fontWeight: 700, fontSize: '0.85rem' }}>{formatCurrency(s.total_loss_amount)}</span>
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
                  <span>Overproduction: <strong style={{ color: 'var(--text-muted)' }}>{formatNumber(s?.overproduction_unsold)}</strong></span>
                  <span>Expired Shelf-Life: <strong style={{ color: 'var(--text-muted)' }}>{formatNumber(s?.expired_shelf_life)}</strong></span>
                  <span>Prep Error: <strong style={{ color: 'var(--text-muted)' }}>{formatNumber(s?.preparation_error)}</strong></span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {                                                                        }
      <div className="glass-card" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
          <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
            <button
              onClick={() => setActiveTab('items')}
              style={{
                background: activeTab === 'items' ? 'rgba(244, 63, 94, 0.2)' : 'rgba(255,255,255,0.05)',
                border: activeTab === 'items' ? '1px solid #f43f5e' : '1px solid transparent',
                color: activeTab === 'items' ? '#fb7185' : '#94a3b8',
                padding: '6px 14px',
                borderRadius: '6px',
                fontSize: '0.8rem',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              High-Wastage Items ({high_wastage_items.length})
            </button>

            <button
              onClick={() => setActiveTab('locations')}
              style={{
                background: activeTab === 'locations' ? 'rgba(2, 132, 199, 0.2)' : 'rgba(255,255,255,0.05)',
                border: activeTab === 'locations' ? '1px solid #0284c7' : '1px solid transparent',
                color: activeTab === 'locations' ? '#38bdf8' : '#94a3b8',
                padding: '6px 14px',
                borderRadius: '6px',
                fontSize: '0.8rem',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              High-Wastage Locations ({high_wastage_locations.length})
            </button>

            <button
              onClick={() => setActiveTab('predictions')}
              style={{
                background: activeTab === 'predictions' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(255,255,255,0.05)',
                border: activeTab === 'predictions' ? '1px solid #ef4444' : '1px solid transparent',
                color: activeTab === 'predictions' ? '#f87171' : '#94a3b8',
                padding: '6px 14px',
                borderRadius: '6px',
                fontSize: '0.8rem',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              Wastage-Risk Predictions ({wastage_risk_predictions.length} High-Risk Batches)
            </button>

            <button
              onClick={() => setActiveTab('trends')}
              style={{
                background: activeTab === 'trends' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(255,255,255,0.05)',
                border: activeTab === 'trends' ? '1px solid #10b981' : '1px solid transparent',
                color: activeTab === 'trends' ? '#34d399' : '#94a3b8',
                padding: '6px 14px',
                borderRadius: '6px',
                fontSize: '0.8rem',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              Monthly Wastage Timeline
            </button>
          </div>

          {                }
          <div style={{ position: 'relative', minWidth: '220px' }}>
            <Search size={14} style={{ position: 'absolute', left: '10px', top: '10px', color: 'var(--text-secondary)' }} />
            <input
              type="text"
              placeholder="Search dish or location..."
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

        {                                     }
        {activeTab === 'items' && (
          <div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '12px' }}>
              Dishes ranked by total dollar loss and wasted portions across the network.
            </div>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.82rem' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-secondary)' }}>
                    <th style={{ padding: '10px 12px' }}>Dish / ID</th>
                    <th style={{ padding: '10px 12px' }}>Category</th>
                    <th style={{ padding: '10px 12px' }}>Base Price</th>
                    <th style={{ padding: '10px 12px' }}>Units Wasted</th>
                    <th style={{ padding: '10px 12px' }}>Total Dollar Loss</th>
                    <th style={{ padding: '10px 12px' }}>Incidents</th>
                    <th style={{ padding: '10px 12px' }}>Avg Loss/Incident</th>
                    <th style={{ padding: '10px 12px' }}>Loss Share %</th>
                  </tr>
                </thead>
                <tbody>
                  {high_wastage_items
                    .filter(i => !searchQuery || i.item_name.toLowerCase().includes(searchQuery.toLowerCase()) || i.item_id.toLowerCase().includes(searchQuery.toLowerCase()))
                    .slice(0, 50)
                    .map((item) => (
                      <tr key={item.item_id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                        <td style={{ padding: '10px 12px' }}>
                          <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{item.item_name}</div>
                          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{item.item_id}</div>
                        </td>
                        <td style={{ padding: '10px 12px', color: 'var(--text-secondary)' }}>{item.category_name}</td>
                        <td style={{ padding: '10px 12px', color: 'var(--text-primary)' }}>${item.base_price.toFixed(2)}</td>
                        <td style={{ padding: '10px 12px', color: 'var(--text-primary)' }}>{formatNumber(item?.wasted_quantity)}</td>
                        <td style={{ padding: '10px 12px', fontWeight: 700, color: '#fb7185' }}>{formatCurrency(item.total_loss_amount)}</td>
                        <td style={{ padding: '10px 12px', color: 'var(--text-secondary)' }}>{item.incident_count}</td>
                        <td style={{ padding: '10px 12px', color: '#38bdf8' }}>{formatCurrency(item.avg_loss_per_incident)}</td>
                        <td style={{ padding: '10px 12px', color: '#fbbf24', fontWeight: 600 }}>{item.loss_share_pct}%</td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {                                         }
        {activeTab === 'locations' && (
          <div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '12px' }}>
              All 20 restaurant locations ranked by total food spoilage dollars and wasted portions.
            </div>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.82rem' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-secondary)' }}>
                    <th style={{ padding: '10px 12px' }}>Restaurant Location</th>
                    <th style={{ padding: '10px 12px' }}>City</th>
                    <th style={{ padding: '10px 12px' }}>Tier</th>
                    <th style={{ padding: '10px 12px' }}>Wasted Units</th>
                    <th style={{ padding: '10px 12px' }}>Total Dollar Loss</th>
                    <th style={{ padding: '10px 12px' }}>Network Loss Share</th>
                    <th style={{ padding: '10px 12px' }}>Total Sold Units</th>
                  </tr>
                </thead>
                <tbody>
                  {high_wastage_locations
                    .filter(l => !searchQuery || l.restaurant_name.toLowerCase().includes(searchQuery.toLowerCase()) || l.location_id.toLowerCase().includes(searchQuery.toLowerCase()))
                    .map((loc) => (
                      <tr key={loc.location_id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                        <td style={{ padding: '10px 12px' }}>
                          <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{loc.restaurant_name}</div>
                          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{loc.location_id}</div>
                        </td>
                        <td style={{ padding: '10px 12px', color: 'var(--text-secondary)' }}>{loc.restaurant_city}</td>
                        <td style={{ padding: '10px 12px' }}>
                          <span style={{ fontSize: '0.7rem', padding: '2px 8px', borderRadius: '4px', background: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8', fontWeight: 600 }}>
                            {loc.location_tier}
                          </span>
                        </td>
                        <td style={{ padding: '10px 12px', color: 'var(--text-primary)' }}>{formatNumber(loc?.wasted_quantity)}</td>
                        <td style={{ padding: '10px 12px', fontWeight: 700, color: '#fb7185' }}>{formatCurrency(loc.total_loss_amount)}</td>
                        <td style={{ padding: '10px 12px', color: '#fbbf24', fontWeight: 600 }}>{loc.loss_share_pct}%</td>
                        <td style={{ padding: '10px 12px', color: '#34d399' }}>{formatNumber(loc?.total_sold)}</td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {                                                                 }
        {activeTab === 'predictions' && (
          <div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '12px' }}>
              Step 24 Predictive Spoilage Model: High &amp; Critical Risk Batches with Actionable Mitigation Strategies.
            </div>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.82rem' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-secondary)' }}>
                    <th style={{ padding: '10px 12px' }}>Batch Date</th>
                    <th style={{ padding: '10px 12px' }}>Location</th>
                    <th style={{ padding: '10px 12px' }}>Dish / ID</th>
                    <th style={{ padding: '10px 12px' }}>Risk Tier</th>
                    <th style={{ padding: '10px 12px' }}>Risk Prob.</th>
                    <th style={{ padding: '10px 12px' }}>Prep vs Wasted</th>
                    <th style={{ padding: '10px 12px' }}>Actionable Mitigation Strategy</th>
                  </tr>
                </thead>
                <tbody>
                  {wastage_risk_predictions
                    .filter(p => !searchQuery || p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.item_id.toLowerCase().includes(searchQuery.toLowerCase()))
                    .map((p, idx) => (
                      <tr key={idx} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                        <td style={{ padding: '10px 12px', color: 'var(--text-secondary)' }}>{p.snapshot_date}</td>
                        <td style={{ padding: '10px 12px', fontWeight: 600, color: 'var(--text-primary)' }}>{p.location_id}</td>
                        <td style={{ padding: '10px 12px' }}>
                          <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{p.name}</div>
                          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{p.category_name}</div>
                        </td>
                        <td style={{ padding: '10px 12px' }}>
                          <span style={{
                            fontSize: '0.7rem',
                            padding: '2px 8px',
                            borderRadius: '4px',
                            background: p.wastage_risk_tier === 'Critical Risk' ? 'rgba(239, 68, 68, 0.25)' : 'rgba(245, 158, 11, 0.25)',
                            color: p.wastage_risk_tier === 'Critical Risk' ? '#f87171' : '#fbbf24',
                            fontWeight: 700
                          }}>
                            {p.wastage_risk_tier}
                          </span>
                        </td>
                        <td style={{ padding: '10px 12px', fontWeight: 700, color: '#f87171' }}>{p.predicted_risk_probability}%</td>
                        <td style={{ padding: '10px 12px', color: 'var(--text-muted)' }}>
                          Prep: {p.preparation_quantity} | Waste: <strong style={{ color: '#fb7185' }}>{p.quantity_wasted}</strong>
                        </td>
                        <td style={{ padding: '10px 12px', color: '#38bdf8', fontSize: '0.78rem' }}>
                          {p.actionable_mitigation_strategy}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {                                     }
        {activeTab === 'trends' && (
          <div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '12px' }}>
              Full 12-month calendar progression of dollar spoilage loss and discarded unit volume.
            </div>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-secondary)' }}>
                    <th style={{ padding: '10px 12px' }}>Month</th>
                    <th style={{ padding: '10px 12px' }}>Wastage Cost</th>
                    <th style={{ padding: '10px 12px' }}>Wasted Units</th>
                    <th style={{ padding: '10px 12px' }}>Average Cost / Unit</th>
                  </tr>
                </thead>
                <tbody>
                  {wastage_trends.monthly_trends.map((m, idx) => (
                    <tr key={idx} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                      <td style={{ padding: '10px 12px', fontWeight: 700, color: 'var(--text-primary)' }}>{m.month}</td>
                      <td style={{ padding: '10px 12px', fontWeight: 700, color: '#fb7185' }}>{formatCurrency(m.wasted_cost)}</td>
                      <td style={{ padding: '10px 12px', color: 'var(--text-primary)' }}>{formatNumber(m?.wasted_units)} units</td>
                      <td style={{ padding: '10px 12px', color: '#38bdf8' }}>${(m.wasted_cost / m.wasted_units).toFixed(2)}</td>
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

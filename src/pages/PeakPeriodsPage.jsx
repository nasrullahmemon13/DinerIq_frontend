import { BarChart, chartGrid } from '../components/AnalyticsCharts';
import { formatNumber } from '../utils/formatNumber';
import React, { useState, useEffect } from 'react';
import {
  Clock,
  Calendar,
  Flame,
  Users,
  Sun,
  Moon,
  Coffee,
  UtensilsCrossed,
  RefreshCw,
  AlertCircle,
  TrendingUp,
  BarChart3,
  CalendarDays,
  ShieldAlert
} from 'lucide-react';

export default function PeakPeriodsPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [activeTab, setActiveTab] = useState('heatmap');
  const [hoveredCell, setHoveredCell] = useState(null);

  const fetchPeakPeriods = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/v1/analytics/peak-periods');
      if (!res.ok) {
        throw new Error(`Failed to load Peak Periods data: HTTP ${res.status}`);
      }
      const json = await res.json();
      setData(json);
    } catch (err) {
      console.error('Error fetching peak periods:', err);
      setError(err.message || 'Error loading peak operating periods data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPeakPeriods();
  }, []);

  const summary = data?.summary || {
    peak_hour: '—',
    peak_hour_orders: 0,
    peak_day: '—',
    peak_day_share_pct: 0,
    weekend_order_share_pct: 0,
    weekday_order_share_pct: 0,
    total_analyzed_orders: 0,
    max_heatmap_density: 1
  };

  const hourlyRows = data?.hourly_distribution || [];
  const hourlyTotal = hourlyRows.reduce((sum,r)=>sum+(r.order_count || 0),0);
  const hourlyDist = hourlyRows.map(r=>({...r,orders_count:r.order_count,hour_label:r.label,pct_of_day:hourlyTotal ? (r.order_count/hourlyTotal*100).toFixed(1) : '0.0'}));
  const dailyRows = data?.daily_distribution || [];
  const dailyTotal = dailyRows.reduce((sum,r)=>sum+(r.total_orders || 0),0);
  const dailyDist = dailyRows.map(r=>({...r,orders_count:r.total_orders,pct_of_week:dailyTotal ? (r.total_orders/dailyTotal*100).toFixed(1) : '0.0'}));
  const heatmapRows = data?.heatmap || [];

  const getCellColor = (intensityPct) => {
    if (intensityPct === 0) return 'rgba(99, 102, 241, 0.04)';
    if (intensityPct < 20) return 'rgba(99, 102, 241, 0.15)';
    if (intensityPct < 40) return 'rgba(99, 102, 241, 0.35)';
    if (intensityPct < 65) return 'rgba(99, 102, 241, 0.6)';
    if (intensityPct < 85) return 'rgba(239, 68, 68, 0.7)';
    return 'rgba(239, 68, 68, 0.95)';
  };

  const maxHourlyCount = Math.max(...hourlyDist.map(h => h.orders_count || 0), 1);
  const maxDailyCount = Math.max(...dailyDist.map(d => d.orders_count || 0), 1);

  return (
    <div style={{ padding: '24px 32px 48px', maxWidth: '1600px', margin: '0 auto' }}>
      {data?.heatmap_error && <p role="alert">Heatmap unavailable: {data.heatmap_error}</p>}
      {data?.excluded_timestamp_rows > 0 && <p role="status">Heatmap excludes {data.excluded_timestamp_rows} rows with invalid timestamps.</p>}
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
            Peak Operating Periods
          </h1>
          <p style={{ fontSize: '14px', color: 'var(--text-muted)' }}>
            Analyze order density across 24 hours, day-of-week heatmaps, and staffing windows.
          </p>
        </div>

        <button
          onClick={fetchPeakPeriods}
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

      {                                                                }
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '16px',
          marginBottom: '28px'
        }}
      >
        {                            }
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
            <Flame size={22} />
          </div>
          <div>
            <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Peak Rush Hour
            </div>
            <div style={{ fontSize: '24px', fontWeight: 700, color: 'var(--text-primary)', marginTop: '2px' }}>
              {loading ? '...' : summary.peak_hour}
            </div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>
              {formatNumber(summary?.peak_hour_orders)} peak orders
            </div>
          </div>
        </div>

        {                                }
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
            <Calendar size={22} />
          </div>
          <div>
            <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Busiest Day
            </div>
            <div style={{ fontSize: '24px', fontWeight: 700, color: '#6366f1', marginTop: '2px' }}>
              {loading ? '...' : summary.peak_day}
            </div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>
              {summary.peak_day_share_pct}% of total weekly volume
            </div>
          </div>
        </div>

        {                                }
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
            <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Weekend Order Share
            </div>
            <div style={{ fontSize: '24px', fontWeight: 700, color: 'var(--text-primary)', marginTop: '2px' }}>
              {loading ? '...' : `${summary.weekend_order_share_pct}%`}
            </div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>
              Weekday Share: {summary.weekday_order_share_pct}%
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
            <Clock size={22} />
          </div>
          <div>
            <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Transactions Analyzed
            </div>
            <div style={{ fontSize: '24px', fontWeight: 700, color: 'var(--text-primary)', marginTop: '2px' }}>
              {loading ? '...' : formatNumber(summary?.total_analyzed_orders)}
            </div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>
              PySpark timestamp partitioning
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
          onClick={() => setActiveTab('heatmap')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 18px',
            borderRadius: '8px 8px 0 0',
            border: 'none',
            borderBottom: activeTab === 'heatmap' ? '2px solid #6366f1' : '2px solid transparent',
            background: activeTab === 'heatmap' ? 'rgba(99, 102, 241, 0.08)' : 'transparent',
            color: activeTab === 'heatmap' ? '#6366f1' : 'var(--text-secondary)',
            fontWeight: activeTab === 'heatmap' ? 600 : 500,
            fontSize: '14px',
            cursor: 'pointer'
          }}
        >
          <Flame size={16} />
          <span>24h &times; 7d Order Heatmap</span>
        </button>

        <button
          onClick={() => setActiveTab('hourly')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 18px',
            borderRadius: '8px 8px 0 0',
            border: 'none',
            borderBottom: activeTab === 'hourly' ? '2px solid #6366f1' : '2px solid transparent',
            background: activeTab === 'hourly' ? 'rgba(99, 102, 241, 0.08)' : 'transparent',
            color: activeTab === 'hourly' ? '#6366f1' : 'var(--text-secondary)',
            fontWeight: activeTab === 'hourly' ? 600 : 500,
            fontSize: '14px',
            cursor: 'pointer'
          }}
        >
          <BarChart3 size={16} />
          <span>Hourly Daypart Distribution</span>
        </button>

        <button
          onClick={() => setActiveTab('daily')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 18px',
            borderRadius: '8px 8px 0 0',
            border: 'none',
            borderBottom: activeTab === 'daily' ? '2px solid #6366f1' : '2px solid transparent',
            background: activeTab === 'daily' ? 'rgba(99, 102, 241, 0.08)' : 'transparent',
            color: activeTab === 'daily' ? '#6366f1' : 'var(--text-secondary)',
            fontWeight: activeTab === 'daily' ? 600 : 500,
            fontSize: '14px',
            cursor: 'pointer'
          }}
        >
          <CalendarDays size={16} />
          <span>Day of Week Patterns</span>
        </button>

        <button
          onClick={() => setActiveTab('staffing')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 18px',
            borderRadius: '8px 8px 0 0',
            border: 'none',
            borderBottom: activeTab === 'staffing' ? '2px solid #6366f1' : '2px solid transparent',
            background: activeTab === 'staffing' ? 'rgba(99, 102, 241, 0.08)' : 'transparent',
            color: activeTab === 'staffing' ? '#6366f1' : 'var(--text-secondary)',
            fontWeight: activeTab === 'staffing' ? 600 : 500,
            fontSize: '14px',
            cursor: 'pointer'
          }}
        >
          <Users size={16} />
          <span>Staffing & Shift Recommendations</span>
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
            <strong>Unable to load Peak Operating Periods:</strong> {error}
          </div>
        </div>
      )}

      {                                                                }
      {activeTab === 'heatmap' && (
        <div
          style={{
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            borderRadius: '12px',
            padding: '24px',
            boxShadow: 'var(--shadow-sm)'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <div>
              <h2 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text-primary)' }}>
                Weekly Hourly Traffic Heatmap
              </h2>
              <p style={{ fontSize: '12.5px', color: 'var(--text-muted)' }}>
                Color density corresponds to aggregate transaction volume across all operating days and hours.
              </p>
            </div>

            {                    }
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: 'var(--text-muted)' }}>
              <span>Low</span>
              <div style={{ display: 'flex', gap: '3px' }}>
                {[10, 30, 50, 75, 95].map((pct, i) => (
                  <div
                    key={i}
                    style={{
                      width: '16px',
                      height: '16px',
                      borderRadius: '3px',
                      background: getCellColor(pct)
                    }}
                  />
                ))}
              </div>
              <span>Peak (Rush)</span>
            </div>
          </div>

          {                    }
          <div style={{ overflowX: 'auto', paddingBottom: '8px' }}>
            <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '4px' }}>
              <thead>
                <tr>
                  <th style={{ width: '90px', textAlign: 'left', fontSize: '12px', color: 'var(--text-muted)', padding: '6px' }}>
                    Day
                  </th>
                  {Array.from({ length: 24 }).map((_, h) => (
                    <th
                      key={h}
                      style={{
                        textAlign: 'center',
                        fontSize: '11px',
                        color: 'var(--text-muted)',
                        padding: '4px 2px',
                        minWidth: '32px'
                      }}
                    >
                      {h % 3 === 0 ? `${h}h` : ''}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {heatmapRows.map((row, rIdx) => {
                  const dayName = row.day || row.day_name || `Day ${rIdx + 1}`;
                  const dayAbbr = typeof dayName === 'string' && dayName.length >= 3 ? dayName.slice(0, 3) : dayName;
                  const cells = Array.isArray(row.hours)
                    ? row.hours
                    : Array.isArray(row.hourly_counts)
                    ? row.hourly_counts.map((cnt, h) => ({
                        hour: h,
                        hour_label: `${(h === 0 || h === 12) ? 12 : h % 12} ${h < 12 ? 'AM' : 'PM'}`,
                        count: cnt,
                        intensity_pct: summary.max_heatmap_density > 0 ? Math.round((cnt / summary.max_heatmap_density) * 100) : 0
                      }))
                    : [];

                  return (
                    <tr key={dayName || rIdx}>
                      <td style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)', padding: '6px 4px' }}>
                        {dayAbbr}
                      </td>
                      {cells.map((cell) => (
                        <td
                          key={cell.hour}
                          onMouseEnter={() => setHoveredCell({ day: dayName, ...cell })}
                          onMouseLeave={() => setHoveredCell(null)}
                          style={{
                            background: getCellColor(cell.intensity_pct),
                            height: '32px',
                            borderRadius: '4px',
                            textAlign: 'center',
                            cursor: 'pointer',
                            position: 'relative',
                            border: hoveredCell?.day === dayName && hoveredCell?.hour === cell.hour ? '2px solid #6366f1' : 'none',
                            transition: 'all 0.15s ease'
                          }}
                          title={`${dayName} ${cell.hour_label || `${cell.hour}:00`}: ${(cell.count || 0).toLocaleString()} orders (${cell.intensity_pct || 0}% peak intensity)`}
                        />
                      ))}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {                           }
          <div
            style={{
              marginTop: '16px',
              padding: '12px 16px',
              borderRadius: '8px',
              background: 'var(--bg-subtle, rgba(255,255,255,0.03))',
              border: '1px solid var(--border)',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              fontSize: '13px'
            }}
          >
            <Clock size={16} color="#6366f1" />
            {hoveredCell ? (
              <span>
                <strong>{hoveredCell.day} at {hoveredCell.hour_label}:</strong>{' '}
                <span style={{ color: '#6366f1', fontWeight: 700 }}>{formatNumber(hoveredCell?.count)} orders</span>{' '}
                ({hoveredCell.intensity_pct}% of max peak volume)
              </span>
            ) : (
              <span style={{ color: 'var(--text-muted)' }}>
                Hover over any cell above to see precise order volumes and daypart intensity.
              </span>
            )}
          </div>
        </div>
      )}

      {                                                               }
      {activeTab === 'hourly' && (
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
            <h2 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text-primary)' }}>
              24-Hour Traffic Curve & Rush Windows
            </h2>
            <p style={{ fontSize: '12.5px', color: 'var(--text-muted)' }}>
              Cumulative order volumes by hour of day highlighting distinct Lunch (11:00 - 14:00) and Dinner (17:00 - 20:00) peaks.
            </p>
          </div>

          {                             }
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {hourlyDist.map((item) => {
              const pctOfMax = (item.orders_count / maxHourlyCount) * 100;
              const isPeak = item.orders_count === summary.peak_hour_orders;
              return (
                <div
                  key={item.hour}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '70px 1fr 90px 60px',
                    alignItems: 'center',
                    gap: '14px',
                    fontSize: '13px'
                  }}
                >
                  <span style={{ fontWeight: 500, color: isPeak ? '#ef4444' : 'var(--text-secondary)' }}>
                    {item.hour_label}
                  </span>

                  <div
                    style={{
                      height: '24px',
                      background: 'var(--bg-subtle, rgba(255,255,255,0.04))',
                      borderRadius: '6px',
                      overflow: 'hidden',
                      position: 'relative'
                    }}
                  >
                    <div
                      style={{
                        height: '100%',
                        width: `${pctOfMax}%`,
                        background: isPeak
                          ? 'linear-gradient(90deg, #ef4444, #f87171)'
                          : pctOfMax > 60
                          ? 'linear-gradient(90deg, #6366f1, #818cf8)'
                          : 'rgba(99, 102, 241, 0.4)',
                        borderRadius: '6px',
                        transition: 'width 0.4s ease'
                      }}
                    />
                  </div>

                  <span style={{ textAlign: 'right', fontWeight: 600, color: 'var(--text-primary)', fontVariantNumeric: 'tabular-nums' }}>
                    {formatNumber(item?.orders_count)}
                  </span>

                  <span style={{ textAlign: 'right', color: 'var(--text-muted)', fontVariantNumeric: 'tabular-nums' }}>
                    {item.pct_of_day}%
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {                                                                }
      {activeTab === 'daily' && (
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
            <h2 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text-primary)' }}>
              Weekly Traffic Distribution
            </h2>
            <p style={{ fontSize: '12.5px', color: 'var(--text-muted)' }}>
              Relative volume comparison across days of the week.
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {dailyDist.map((item) => {
              const pctOfMax = (item.orders_count / maxDailyCount) * 100;
              const isPeakDay = item.day_name === summary.peak_day;
              return (
                <div
                  key={item.day_name}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '100px 1fr 100px 70px',
                    alignItems: 'center',
                    gap: '16px',
                    fontSize: '13px'
                  }}
                >
                  <span style={{ fontWeight: 600, color: isPeakDay ? '#6366f1' : 'var(--text-primary)' }}>
                    {item.day_name}
                  </span>

                  <div
                    style={{
                      height: '28px',
                      background: 'var(--bg-subtle, rgba(255,255,255,0.04))',
                      borderRadius: '6px',
                      overflow: 'hidden'
                    }}
                  >
                    <div
                      style={{
                        height: '100%',
                        width: `${pctOfMax}%`,
                        background: isPeakDay
                          ? 'linear-gradient(90deg, #6366f1, #a855f7)'
                          : 'rgba(99, 102, 241, 0.5)',
                        borderRadius: '6px',
                        transition: 'width 0.4s ease'
                      }}
                    />
                  </div>

                  <span style={{ textAlign: 'right', fontWeight: 700, color: 'var(--text-primary)', fontVariantNumeric: 'tabular-nums' }}>
                    {formatNumber(item?.orders_count)}
                  </span>

                  <span style={{ textAlign: 'right', color: 'var(--text-muted)', fontVariantNumeric: 'tabular-nums' }}>
                    {item.pct_of_week}%
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {activeTab === 'staffing' && <section>
        <h2>Staffing planning evidence</h2>
        <p>Peak observed hour: {summary.peak_hour}; busiest observed day: {summary.peak_day}. Review staffing capacity against these patterns; order counts alone do not determine required headcount.</p>
        <div style={chartGrid}>
          <BarChart title="Orders in planning windows" subtitle="Explicit hour boundaries; start inclusive and end exclusive" unit="orders" data={[{label:'Lunch · 11:00–15:00',value:hourlyDist.filter(r=>r.hour>=11 && r.hour<15).reduce((s,r)=>s+r.orders_count,0)},{label:'Dinner · 17:00–22:00',value:hourlyDist.filter(r=>r.hour>=17 && r.hour<22).reduce((s,r)=>s+r.orders_count,0)},{label:'Other hours',value:hourlyDist.filter(r=>!(r.hour>=11 && r.hour<15) && !(r.hour>=17 && r.hour<22)).reduce((s,r)=>s+r.orders_count,0)}]}/>
          <BarChart title="Weekday and weekend demand" subtitle="Historical order totals; not revenue" unit="orders" color="#a78bfa" data={[{label:'Weekdays',value:dailyDist.filter(r=>!r.is_weekend).reduce((s,r)=>s+r.orders_count,0)},{label:'Weekend',value:dailyDist.filter(r=>r.is_weekend).reduce((s,r)=>s+r.orders_count,0)}]}/>
        </div>
      </section>}
    </div>
  );
}

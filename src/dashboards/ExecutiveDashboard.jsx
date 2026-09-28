import { useFilter } from '../context/FilterContext';
import { formatNumber } from '../utils/formatNumber';
import React, { useState, useEffect, useRef } from 'react';
import {
  DollarSign, TrendingUp, ShoppingBag, CreditCard,
  Users, Repeat, Trash2, Calendar, AlertTriangle,
  Zap, Layers, RefreshCw, ArrowUpRight, ArrowDownRight,
  ShieldAlert, SlidersHorizontal, Download, Settings,
  Store, Star, ChevronDown, Activity, BarChart3,
  PieChart, Target, Clock, Eye, Filter
} from 'lucide-react';

                                                                  
                                                        
                                                    
                                                
                                          
                                                     
                              
                                                                     

                                                                  
const STYLE_ID = 'pbi-dash-styles';
if (typeof document !== 'undefined' && !document.getElementById(STYLE_ID)) {
  const styleEl = document.createElement('style');
  styleEl.id = STYLE_ID;
  styleEl.textContent = `
    @keyframes pbiFadeInUp {
      from { opacity: 0; transform: translateY(18px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    @keyframes pbiPulseGlow {
      0%, 100% { box-shadow: 0 0 0 0 rgba(107,139,80,0.15); }
      50%      { box-shadow: 0 0 18px 4px rgba(107,139,80,0.10); }
    }
    @keyframes pbiShimmer {
      0%   { background-position: -200% 0; }
      100% { background-position: 200% 0; }
    }
    @keyframes pbiSpin {
      from { transform: rotate(0deg); }
      to   { transform: rotate(360deg); }
    }
    @keyframes pbiCountUp {
      from { opacity: 0; transform: translateY(6px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    @keyframes pbiSlideRight {
      from { width: 0%; }
      to   { width: var(--target-width); }
    }
    .pbi-card-animate {
      animation: pbiFadeInUp 0.45s cubic-bezier(0.22,1,0.36,1) both;
    }
    .pbi-shimmer-loading {
      background: linear-gradient(90deg, var(--surface-secondary) 25%, var(--surface) 50%, var(--surface-secondary) 75%);
      background-size: 200% 100%;
      animation: pbiShimmer 1.6s ease-in-out infinite;
    }
    .pbi-kpi-card {
      position: relative;
      overflow: hidden;
      transition: transform 0.22s cubic-bezier(0.22,1,0.36,1), box-shadow 0.22s ease;
    }
    .pbi-kpi-card:hover {
      transform: translateY(-3px);
      box-shadow: 0 8px 32px rgba(0,0,0,0.28), 0 0 0 1px rgba(107,139,80,0.15) !important;
    }
    .pbi-kpi-card::before {
      content: '';
      position: absolute;
      top: 0; left: 0; right: 0;
      height: 3px;
      background: var(--kpi-accent, var(--primary));
      border-radius: 10px 10px 0 0;
      opacity: 0;
      transition: opacity 0.2s ease;
    }
    .pbi-kpi-card:hover::before { opacity: 1; }
    .pbi-table-row {
      transition: background 0.15s ease;
    }
    .pbi-table-row:hover {
      background: var(--primary-tint, rgba(107,139,80,0.06)) !important;
    }
    .pbi-panel {
      transition: transform 0.2s ease, box-shadow 0.2s ease;
    }
    .pbi-panel:hover {
      box-shadow: 0 8px 28px rgba(0,0,0,0.22), 0 0 0 1px rgba(107,139,80,0.08) !important;
    }
    .pbi-insight-card {
      transition: transform 0.18s ease, background 0.18s ease;
    }
    .pbi-insight-card:hover {
      transform: translateX(4px);
      background: var(--surface, #0d1a2b) !important;
    }
    .pbi-bar {
      transition: height 0.6s cubic-bezier(0.22,1,0.36,1);
    }
    .pbi-dot-pulse {
      animation: pbiPulseGlow 2.5s ease-in-out infinite;
    }
    /* Scrollbar styling */
    .pbi-scroll::-webkit-scrollbar { width: 4px; }
    .pbi-scroll::-webkit-scrollbar-track { background: transparent; }
    .pbi-scroll::-webkit-scrollbar-thumb {
      background: var(--border, #1e3048);
      border-radius: 4px;
    }
    .pbi-scroll::-webkit-scrollbar-thumb:hover {
      background: var(--primary, #6b8b50);
    }
  `;
  document.head.appendChild(styleEl);
}


                                                                 
function SparkLine({ color = '#7d9b60', up = true, data }) {
  const pts = data || (up
    ? [14, 12, 13, 10, 9, 7, 5, 4, 3, 2]
    : [3, 5, 4, 7, 9, 10, 12, 14, 15, 17]);
  const max = Math.max(...pts, 1);
  const min = Math.min(...pts);
  const range = max - min || 1;
  const w = 68, h = 24;
  const points = pts.map((v, i) =>
    `${(i / (pts.length - 1)) * w},${h - 2 - ((v - min) / range) * (h - 4)}`
  ).join(' ');
  const fillPoints = points + ` ${w},${h} 0,${h}`;

  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{ display: 'block', flexShrink: 0 }}>
      <defs>
        <linearGradient id={`spark-${color.replace('#', '')}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.25" />
          <stop offset="100%" stopColor={color} stopOpacity="0.0" />
        </linearGradient>
      </defs>
      <polygon points={fillPoints} fill={`url(#spark-${color.replace('#', '')})`} />
      <polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {                  }
      {pts.length > 0 && (
        <circle
          cx={w}
          cy={h - 2 - ((pts[pts.length - 1] - min) / range) * (h - 4)}
          r="2.5"
          fill={color}
          opacity="0.9"
        />
      )}
    </svg>
  );
}


                                                                 
function KPICard({ title, value, change, changeLabel, up, icon: Icon, accentColor, delay = 0 }) {
  const isPositive = up !== false;
  const accent = accentColor || 'var(--primary, #6b8b50)';

  return (
    <div
      className="pbi-kpi-card pbi-card-animate"
      style={{
        '--kpi-accent': accent,
        background: 'var(--surface, #0d1a2b)',
        border: '1px solid var(--border, #1e3048)',
        borderRadius: '12px',
        padding: '16px 18px 14px',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        boxShadow: '0 2px 12px rgba(0,0,0,0.18)',
        animationDelay: `${delay}ms`,
        cursor: 'default',
        minWidth: 0
      }}
    >
      {                       }
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            fontSize: '0.68rem',
            fontWeight: 600,
            color: 'var(--text-muted, #64748b)',
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
            marginBottom: '6px',
            lineHeight: 1
          }}>
            {title}
          </div>
          <div style={{
            fontSize: '1.35rem',
            fontWeight: 800,
            color: 'var(--text-primary, #f1f5f9)',
            letterSpacing: '-0.03em',
            lineHeight: 1,
            animation: 'pbiCountUp 0.5s ease both',
            animationDelay: `${delay + 200}ms`
          }}>
            {value}
          </div>
        </div>
        <div style={{
          width: '38px',
          height: '38px',
          borderRadius: '10px',
          background: `${accent}18`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          border: `1px solid ${accent}25`
        }}>
          <Icon size={17} color={accent} strokeWidth={2.2} />
        </div>
      </div>

      {                                }
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.72rem' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '2px',
            padding: '2px 7px',
            borderRadius: '20px',
            background: isPositive ? 'rgba(125,155,96,0.12)' : 'rgba(197,110,90,0.12)',
            border: `1px solid ${isPositive ? 'rgba(125,155,96,0.2)' : 'rgba(197,110,90,0.2)'}`
          }}>
            {isPositive
              ? <ArrowUpRight size={11} color="var(--success, #7d9b60)" strokeWidth={2.5} />
              : <ArrowDownRight size={11} color="var(--danger, #c56e5a)" strokeWidth={2.5} />}
            <span style={{
              color: isPositive ? 'var(--success, #7d9b60)' : 'var(--danger, #c56e5a)',
              fontWeight: 700,
              fontSize: '0.7rem'
            }}>
              {change}
            </span>
          </div>
          <span style={{ color: 'var(--text-muted, #64748b)', fontSize: '0.66rem' }}>
            {changeLabel || 'vs last month'}
          </span>
        </div>
        <SparkLine
          color={isPositive ? '#7d9b60' : '#c56e5a'}
          up={isPositive}
        />
      </div>
    </div>
  );
}


                                                                 
function RevenueChart({ trends = [] }) {
  const [metric, setMetric] = useState('revenue');
  const [hoveredIdx, setHoveredIdx] = useState(null);

  const defaultTrends = [
    { month: 'Jan', revenue: 1420500, profit: 795480 },
    { month: 'Feb', revenue: 1510200, profit: 845710 },
    { month: 'Mar', revenue: 1680400, profit: 941020 },
    { month: 'Apr', revenue: 1640100, profit: 918450 },
    { month: 'May', revenue: 1780900, profit: 997300 },
    { month: 'Jun', revenue: 1820300, profit: 1019360 },
    { month: 'Jul', revenue: 1950400, profit: 1092220 },
    { month: 'Aug', revenue: 1910600, profit: 1069930 },
    { month: 'Sep', revenue: 1750200, profit: 980110 },
    { month: 'Oct', revenue: 1840800, profit: 1030840 },
    { month: 'Nov', revenue: 1790500, profit: 1002680 },
    { month: 'Dec', revenue: 1888200, profit: 1055420 }
  ];

  const dataList = trends && trends.length > 0 ? trends : defaultTrends;
  const values = dataList.map(t => metric === 'revenue' ? Number(t.revenue) || 0 : Number(t.profit) || 0);
  const maxVal = Math.max(...values, 1);
  const minVal = Math.min(...values);
  const chartW = 360, chartH = 130, padX = 15, padY = 12;

  const toX = (i) => padX + (i / (values.length - 1)) * (chartW - padX * 2);
  const toY = (v) => padY + (1 - (v - minVal * 0.9) / (maxVal - minVal * 0.9 || 1)) * (chartH - padY * 2);

  const linePoints = values.map((v, i) => `${toX(i)},${toY(v)}`).join(' ');
  const areaPoints = linePoints + ` ${toX(values.length - 1)},${chartH - padY} ${toX(0)},${chartH - padY}`;
  const lineColor = metric === 'revenue' ? '#6b8b50' : '#7d9b60';

  return (
    <div>
      {            }
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
        <div>
          <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)' }}>
            Revenue & Profit Trend
          </div>
          <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', marginTop: '2px' }}>
            Monthly performance · 20 locations
          </div>
        </div>
        <div style={{
          display: 'flex',
          gap: '2px',
          background: 'var(--surface-secondary, #101f32)',
          padding: '3px',
          borderRadius: '8px',
          border: '1px solid var(--border)'
        }}>
          {['revenue', 'profit'].map(m => (
            <button
              key={m}
              onClick={() => setMetric(m)}
              style={{
                padding: '5px 14px',
                fontSize: '0.7rem',
                fontWeight: 600,
                borderRadius: '6px',
                border: 'none',
                cursor: 'pointer',
                background: metric === m
                  ? (m === 'revenue' ? 'var(--primary, #6b8b50)' : 'var(--success, #7d9b60)')
                  : 'transparent',
                color: metric === m ? '#ffffff' : 'var(--text-muted)',
                transition: 'all 0.2s ease'
              }}
            >
              {m === 'revenue' ? '💰 Revenue' : '📈 Profit'}
            </button>
          ))}
        </div>
      </div>

      {                    }
      <div style={{ position: 'relative' }}>
        <svg
          width="100%"
          height="155"
          viewBox={`0 0 ${chartW} ${chartH}`}
          preserveAspectRatio="none"
          onMouseLeave={() => setHoveredIdx(null)}
          style={{ display: 'block' }}
        >
          <defs>
            <linearGradient id={`areaGrad-${metric}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={lineColor} stopOpacity="0.3" />
              <stop offset="60%" stopColor={lineColor} stopOpacity="0.08" />
              <stop offset="100%" stopColor={lineColor} stopOpacity="0.01" />
            </linearGradient>
          </defs>

          {                }
          {[0.25, 0.5, 0.75].map(pct => (
            <line
              key={pct}
              x1={padX} y1={padY + pct * (chartH - padY * 2)}
              x2={chartW - padX} y2={padY + pct * (chartH - padY * 2)}
              stroke="var(--border, #1e3048)"
              strokeWidth="0.5"
              strokeDasharray="3,3"
              opacity="0.5"
            />
          ))}

          {               }
          <polygon
            points={areaPoints}
            fill={`url(#areaGrad-${metric})`}
          />

          {               }
          <polyline
            points={linePoints}
            fill="none"
            stroke={lineColor}
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ filter: `drop-shadow(0 2px 4px ${lineColor}40)` }}
          />

          {                 }
          {values.map((v, i) => (
            <g key={i}>
              <circle
                cx={toX(i)} cy={toY(v)} r={hoveredIdx === i ? 5 : 3}
                fill={hoveredIdx === i ? lineColor : 'var(--surface, #0d1a2b)'}
                stroke={lineColor}
                strokeWidth="2"
                style={{ transition: 'r 0.15s ease', cursor: 'pointer' }}
                onMouseEnter={() => setHoveredIdx(i)}
              />
              {                         }
              {hoveredIdx === i && (
                <line
                  x1={toX(i)} y1={padY}
                  x2={toX(i)} y2={chartH - padY}
                  stroke={lineColor}
                  strokeWidth="1"
                  strokeDasharray="3,2"
                  opacity="0.4"
                />
              )}
            </g>
          ))}
        </svg>

        {                      }
        {hoveredIdx !== null && (
          <div style={{
            position: 'absolute',
            top: '8px',
            right: '8px',
            background: 'var(--surface-elevated, #13243a)',
            border: '1px solid var(--border)',
            borderRadius: '8px',
            padding: '8px 12px',
            fontSize: '0.72rem',
            boxShadow: '0 4px 16px rgba(0,0,0,0.3)',
            zIndex: 5
          }}>
            <div style={{ color: 'var(--text-muted)', fontWeight: 600, marginBottom: '3px' }}>
              {dataList[hoveredIdx]?.month}
            </div>
            <div style={{ color: lineColor, fontWeight: 800, fontSize: '0.85rem' }}>
              ${(values[hoveredIdx] / 1000000).toFixed(2)}M
            </div>
          </div>
        )}
      </div>

      {                  }
      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 4px 0' }}>
        {dataList.map((t, i) => (
          <span
            key={i}
            style={{
              fontSize: '0.6rem',
              color: hoveredIdx === i ? 'var(--primary)' : 'var(--text-muted)',
              fontWeight: hoveredIdx === i ? 700 : 500,
              transition: 'all 0.15s ease',
              cursor: 'pointer'
            }}
            onMouseEnter={() => setHoveredIdx(i)}
          >
            {t.month}
          </span>
        ))}
      </div>
    </div>
  );
}


                                                                 
function DonutChart({ data = [], total, label, size = 130 }) {
  const [hoveredSeg, setHoveredSeg] = useState(null);
  const COLORS = ['#6b8b50', '#7d9b60', '#bd9152', '#c56e5a', '#b08e64', '#6c9786', '#c18a77', '#91ab83'];
  const r = 38, cx = 50, cy = 50, circumference = 2 * Math.PI * r;

  let cumulative = 0;
  const segments = data.map((d, i) => {
    const pct = d.pct !== undefined ? Number(d.pct) : (total > 0 ? (d.value / total) * 100 : 0);
    const ratio = Math.max(0, Math.min(1, pct / 100));
    const dash = ratio * circumference;
    const offset = cumulative * circumference;
    cumulative += ratio;
    return { ...d, pct: pct.toFixed(1), dash, offset, color: COLORS[i % COLORS.length] };
  });

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
      <div style={{ position: 'relative', flexShrink: 0 }}>
        <svg width={size} height={size} viewBox="0 0 100 100">
          {                     }
          <circle cx={cx} cy={cy} r={r} fill="none" stroke="var(--border, #1e3048)" strokeWidth="9" opacity="0.3" />
          {              }
          {segments.map((s, i) => (
            <circle
              key={i}
              cx={cx} cy={cy} r={r}
              fill="none"
              stroke={s.color}
              strokeWidth={hoveredSeg === i ? 11 : 9}
              strokeDasharray={`${Math.max(s.dash - 1.5, 0)} ${circumference - Math.max(s.dash - 1.5, 0)}`}
              strokeDashoffset={-s.offset}
              strokeLinecap="round"
              style={{
                transform: 'rotate(-90deg)',
                transformOrigin: '50px 50px',
                transition: 'all 0.25s cubic-bezier(0.22,1,0.36,1)',
                cursor: 'pointer',
                filter: hoveredSeg === i ? `drop-shadow(0 0 6px ${s.color}60)` : 'none'
              }}
              onMouseEnter={() => setHoveredSeg(i)}
              onMouseLeave={() => setHoveredSeg(null)}
            />
          ))}
          {                 }
          <text x={cx} y={cy - 4} textAnchor="middle" fontSize="11" fontWeight="800" fill="var(--text-primary, #f1f5f9)">
            {typeof total === 'number' ? formatNumber(total) : total}
          </text>
          <text x={cx} y={cy + 8} textAnchor="middle" fontSize="6.5" fontWeight="600" fill="var(--text-muted, #64748b)">
            {label}
          </text>
        </svg>
      </div>
      {            }
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '6px' }}>
        {segments.map((s, i) => (
          <div
            key={i}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              fontSize: '0.72rem',
              padding: '3px 6px',
              borderRadius: '6px',
              background: hoveredSeg === i ? `${s.color}12` : 'transparent',
              transition: 'background 0.15s ease',
              cursor: 'pointer'
            }}
            onMouseEnter={() => setHoveredSeg(i)}
            onMouseLeave={() => setHoveredSeg(null)}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '7px', minWidth: 0 }}>
              <div style={{
                width: '9px', height: '9px', borderRadius: '3px',
                background: s.color, flexShrink: 0,
                boxShadow: `0 1px 4px ${s.color}40`
              }} />
              <span style={{
                color: 'var(--text-secondary)',
                overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'
              }}>
                {s.name}
              </span>
            </div>
            <span style={{ fontWeight: 700, color: 'var(--text-primary)', marginLeft: '8px' }}>{s.pct}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}


                                                                 
const DISH_IMAGE_MAP = {
  steak: '/images/dish_steak.jpg', mignon: '/images/dish_steak.jpg',
  filet: '/images/dish_steak.jpg', beef: '/images/dish_steak.jpg',
  pizza: '/images/dish_pizza.jpg', burger: '/images/dish_burger.jpg',
  pasta: '/images/dish_pasta.jpg', alfredo: '/images/dish_pasta.jpg',
  spaghetti: '/images/dish_pasta.jpg', salad: '/images/dish_salad.jpg',
  fries: '/images/dish_fries.jpg', salmon: '/images/dish_salmon.jpg',
  fish: '/images/dish_salmon.jpg', chips: '/images/dish_salmon.jpg',
  calamari: '/images/dish_salmon.jpg', seafood: '/images/dish_salmon.jpg',
  tuna: '/images/dish_salmon.jpg', shrimp: '/images/dish_salmon.jpg',
  dessert: '/images/dish_dessert.jpg', cake: '/images/dish_dessert.jpg',
};

function getDishImage(dishName = '') {
  const lower = String(dishName).toLowerCase();
  for (const [key, path] of Object.entries(DISH_IMAGE_MAP)) {
    if (lower.includes(key)) return path;
  }
  return '/images/dish_pizza.jpg';
}


                                                                 
function TopFilterDropdown({ value, onChange, options = [5, 10, 15, 20], labelPrefix = 'Top ' }) {
  const [open, setOpen] = useState(false);

  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        style={{
          display: 'inline-flex', alignItems: 'center', gap: '4px',
          padding: '4px 10px',
          background: 'var(--primary-tint, rgba(107,139,80,0.1))',
          border: '1px solid rgba(107,139,80,0.2)',
          borderRadius: '6px',
          color: 'var(--primary)',
          fontSize: '0.68rem', fontWeight: 700,
          cursor: 'pointer', outline: 'none',
          transition: 'all 0.15s ease'
        }}
      >
        <Filter size={10} />
        <span>{labelPrefix}{value}</span>
        <ChevronDown size={11} style={{ transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
      </button>

      {open && (
        <>
          <div onClick={() => setOpen(false)} style={{ position: 'fixed', inset: 0, zIndex: 998 }} />
          <div style={{
            position: 'absolute', right: 0, top: '100%', marginTop: '4px',
            background: 'var(--surface-elevated, #13243a)',
            border: '1px solid var(--border)',
            borderRadius: '8px',
            boxShadow: '0 8px 28px rgba(0,0,0,0.4)',
            zIndex: 999, minWidth: '90px', overflow: 'hidden',
            animation: 'pbiFadeInUp 0.2s ease'
          }}>
            {options.map((opt) => (
              <div
                key={opt}
                onClick={() => { onChange(opt); setOpen(false); }}
                style={{
                  padding: '7px 12px', fontSize: '0.7rem',
                  fontWeight: value === opt ? 700 : 500,
                  color: value === opt ? 'var(--primary)' : 'var(--text-primary)',
                  background: value === opt ? 'var(--primary-tint)' : 'transparent',
                  cursor: 'pointer', transition: 'background 0.1s ease'
                }}
                onMouseEnter={(e) => { if (value !== opt) e.currentTarget.style.background = 'var(--surface-secondary)'; }}
                onMouseLeave={(e) => { if (value !== opt) e.currentTarget.style.background = 'transparent'; }}
              >
                {labelPrefix}{opt}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}


                                                                 
function TopMenuTable({ items = [], limit = 5 }) {
  const defaultItems = [
    { dish_name: 'Margherita Pizza', quantity_sold: 8421, orders: 5420, revenue: 126315, margin_pct: 41.8, customer_rating: 4.6 },
    { dish_name: 'Chicken Burger', quantity_sold: 6892, orders: 4890, revenue: 96458, margin_pct: 39.9, customer_rating: 4.3 },
    { dish_name: 'Pasta Alfredo', quantity_sold: 5214, orders: 3610, revenue: 82178, margin_pct: 42.3, customer_rating: 4.5 },
    { dish_name: 'Caesar Salad', quantity_sold: 4981, orders: 3410, revenue: 74215, margin_pct: 36.1, customer_rating: 4.4 },
    { dish_name: 'French Fries', quantity_sold: 4562, orders: 3100, revenue: 52384, margin_pct: 37.6, customer_rating: 4.1 },
  ];

  const itemList = items && items.length > 0 ? items : defaultItems;
  const maxRevenue = Math.max(...itemList.slice(0, limit).map(i => i.revenue || 0), 1);

  return (
    <div className="pbi-scroll" style={{ overflowX: 'auto', maxHeight: limit > 5 ? '340px' : 'none', overflowY: limit > 5 ? 'auto' : 'visible' }}>
      <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '0 2px', fontSize: '0.74rem' }}>
        <thead>
          <tr>
            {['#', 'Menu Item', 'Orders', 'Revenue', 'Margin', 'Rating'].map(h => (
              <th key={h} style={{
                textAlign: h === '#' ? 'center' : 'left',
                padding: '8px 10px',
                color: 'var(--text-muted)',
                fontWeight: 600,
                fontSize: '0.68rem',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                borderBottom: '2px solid var(--border)',
                whiteSpace: 'nowrap',
                position: 'sticky',
                top: 0,
                background: 'var(--surface, #0d1a2b)',
                zIndex: 1
              }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {itemList.slice(0, limit).map((item, i) => {
            const name = item.dish_name || item.name || item.item_name || 'Menu Item';
            const orders = item.orders !== undefined ? item.orders : (item.quantity_sold || item.units_sold || 0);
            const revenue = item.revenue !== undefined ? item.revenue : 0;
            const profitPct = item.margin_pct !== undefined ? item.margin_pct : (item.profit_pct !== undefined ? item.profit_pct : 0);
            const rating = item.customer_rating !== undefined ? item.customer_rating : (item.rating !== undefined ? item.rating : 4.5);
            const revBarWidth = (revenue / maxRevenue) * 100;

            return (
              <tr key={item.item_id || i} className="pbi-table-row"
                style={{ borderBottom: '1px solid var(--border)' }}>
                <td style={{ padding: '8px 10px', textAlign: 'center' }}>
                  <span style={{
                    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                    width: '22px', height: '22px', borderRadius: '6px',
                    background: i < 3 ? 'var(--primary-tint)' : 'var(--surface-secondary)',
                    color: i < 3 ? 'var(--primary)' : 'var(--text-muted)',
                    fontWeight: 700, fontSize: '0.7rem'
                  }}>{i + 1}</span>
                </td>
                <td style={{ padding: '8px 10px', whiteSpace: 'nowrap' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <img
                      src={getDishImage(name)} alt={name}
                      style={{
                        width: '32px', height: '32px', borderRadius: '8px',
                        objectFit: 'cover', border: '2px solid var(--border)',
                        boxShadow: '0 2px 6px rgba(0,0,0,0.2)', flexShrink: 0
                      }}
                      onError={(e) => { e.currentTarget.style.display = 'none'; }}
                    />
                    <span style={{
                      color: 'var(--text-primary)', fontWeight: 600,
                      maxWidth: '170px', overflow: 'hidden',
                      textOverflow: 'ellipsis', whiteSpace: 'nowrap'
                    }} title={name}>
                      {name}
                    </span>
                  </div>
                </td>
                <td style={{ padding: '8px 10px', color: 'var(--text-secondary)', fontWeight: 500 }}>
                  {Number(orders).toLocaleString()}
                </td>
                <td style={{ padding: '8px 10px', minWidth: '120px' }}>
                  <div>
                    <span style={{ color: 'var(--text-primary)', fontWeight: 700 }}>
                      ${Number(revenue).toLocaleString()}
                    </span>
                  </div>
                  {                          }
                  <div style={{
                    height: '3px', borderRadius: '2px',
                    background: 'var(--border)', marginTop: '4px', overflow: 'hidden'
                  }}>
                    <div style={{
                      height: '100%', borderRadius: '2px',
                      background: `linear-gradient(90deg, #6b8b50, #a9bd7c)`,
                      width: `${revBarWidth}%`,
                      transition: 'width 0.6s cubic-bezier(0.22,1,0.36,1)'
                    }} />
                  </div>
                </td>
                <td style={{ padding: '8px 10px' }}>
                  <span style={{
                    color: profitPct >= 40 ? 'var(--success)' : profitPct >= 35 ? 'var(--warning)' : 'var(--danger)',
                    fontWeight: 700
                  }}>
                    {profitPct}%
                  </span>
                </td>
                <td style={{ padding: '8px 10px' }}>
                  <div style={{
                    display: 'inline-flex', alignItems: 'center', gap: '4px',
                    padding: '3px 8px', borderRadius: '20px',
                    background: 'rgba(189,145,82,0.1)',
                    border: '1px solid rgba(189,145,82,0.15)'
                  }}>
                    <Star size={11} fill="#bd9152" color="#bd9152" />
                    <span style={{ fontWeight: 700, color: '#bd9152', fontSize: '0.72rem' }}>{rating}</span>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}


                                                                 
function LocationBarChart({ channels = [], limit = 5 }) {
  const defaultLocations = [
    { channel: 'Downtown Flagship', revenue: 310000 },
    { channel: 'Riverside Bistro', revenue: 240000 },
    { channel: 'Lakeside Express', revenue: 200000 },
    { channel: 'Mall Outlet', revenue: 175000 },
    { channel: 'Airport Kiosk', revenue: 145000 }
  ];

  const locList = channels && channels.length > 0 ? channels : defaultLocations;
  const slicedLocs = locList.slice(0, limit);
  const maxRev = Math.max(...slicedLocs.map(c => Number(c.revenue) || 0), 1);
  const COLORS = [
    'linear-gradient(180deg, #6b8b50, #365d40)',
    'linear-gradient(180deg, #7d9b60, #527544)',
    'linear-gradient(180deg, #bd9152, #976b34)',
    'linear-gradient(180deg, #b08e64, #877151)',
    'linear-gradient(180deg, #6c9786, #527b71)',
    'linear-gradient(180deg, #c18a77, #995f4f)',
    'linear-gradient(180deg, #9d9670, #77724d)',
    'linear-gradient(180deg, #91ab83, #657f57)'
  ];

  return (
    <div>
      <div style={{
        display: 'flex', alignItems: 'flex-end', gap: '8px',
        height: '130px', padding: '10px 0 0', overflowX: 'auto'
      }}>
        {slicedLocs.map((ch, i) => {
          const rev = Number(ch.revenue) || 0;
          const heightPct = Math.max(10, Math.round((rev / maxRev) * 100));
          return (
            <div
              key={i}
              style={{
                flex: 1, minWidth: '44px', display: 'flex',
                flexDirection: 'column', alignItems: 'center',
                height: '100%', justifyContent: 'flex-end', gap: '4px'
              }}
            >
              <div style={{ fontSize: '0.64rem', fontWeight: 700, color: 'var(--text-secondary)' }}>
                ${(rev / 1000).toFixed(0)}k
              </div>
              <div
                className="pbi-bar"
                style={{
                  width: '100%',
                  background: COLORS[i % COLORS.length],
                  borderRadius: '6px 6px 2px 2px',
                  height: `${heightPct}%`,
                  minHeight: '8px',
                  cursor: 'pointer',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                  position: 'relative'
                }}
                title={`${ch.channel || ch.restaurant_name || `Loc ${i + 1}`}: $${formatNumber(rev)}`}
              />
            </div>
          );
        })}
      </div>
      <div style={{
        display: 'flex', gap: '8px', marginTop: '8px',
        borderTop: '1px solid var(--border)', paddingTop: '8px', overflowX: 'auto'
      }}>
        {slicedLocs.map((ch, i) => (
          <div key={i} style={{
            flex: 1, minWidth: '44px', textAlign: 'center',
            fontSize: '0.62rem', fontWeight: 600,
            color: 'var(--text-muted)',
            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'
          }}
            title={ch.channel || ch.restaurant_name || `Loc ${i + 1}`}
          >
            {ch.channel || ch.restaurant_name || `Loc ${i + 1}`}
          </div>
        ))}
      </div>
    </div>
  );
}


                                                                 
function CriticalInsightsPanel({ recommendations = [] }) {
  const defaultRecs = [
    {
      recommended_action: 'Deploy Urgent VIP Concierge Retention Campaign for High-Value At-Risk Patrons',
      target_entity_name: 'High-Value VIPs at Churn Risk',
      priority: 'Critical'
    },
    {
      recommended_action: "Review and Restructure Ineffective Promotion: PROMO-012 ('Late Night Craver 20% Off')",
      target_entity_name: 'Late Night Craver 20% Off',
      priority: 'Critical'
    },
    {
      recommended_action: 'Remove or Redesign Persistent Low Performer: ITEM-066 (Seared Diver Scallops)',
      target_entity_name: 'Seared Diver Scallops Sweet Corn',
      priority: 'High'
    }
  ];

  const recList = recommendations && recommendations.length > 0 ? recommendations : defaultRecs;
  const SEVERITY = {
    critical: { color: '#c56e5a', icon: '🔴', bg: 'rgba(197,110,90,0.08)' },
    high: { color: '#bd9152', icon: '🟠', bg: 'rgba(189,145,82,0.08)' },
    medium: { color: '#6c9786', icon: '🔵', bg: 'rgba(108,151,134,0.08)' },
    low: { color: '#7d9b60', icon: '🟢', bg: 'rgba(125,155,96,0.08)' }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      {recList.slice(0, 4).map((rec, i) => {
        const priority = (rec.priority || 'Critical').toLowerCase();
        const sev = SEVERITY[priority] || SEVERITY.critical;
        return (
          <div
            key={i}
            className="pbi-insight-card"
            style={{
              padding: '12px 14px',
              borderRadius: '10px',
              border: '1px solid var(--border)',
              background: sev.bg,
              borderLeft: `4px solid ${sev.color}`,
              cursor: 'pointer'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '4px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flex: 1, minWidth: 0 }}>
                <ShieldAlert size={13} color={sev.color} style={{ flexShrink: 0 }} />
                <span style={{
                  fontSize: '0.74rem', fontWeight: 700,
                  color: 'var(--text-primary)', lineHeight: 1.35,
                  overflow: 'hidden', textOverflow: 'ellipsis',
                  display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical'
                }}>
                  {rec.recommended_action || rec.title}
                </span>
              </div>
              <span style={{
                fontSize: '0.56rem', fontWeight: 800, padding: '2px 8px',
                borderRadius: '12px', background: `${sev.color}20`, color: sev.color,
                textTransform: 'uppercase', flexShrink: 0, marginLeft: '6px',
                letterSpacing: '0.04em'
              }}>
                {priority}
              </span>
            </div>
            {rec.target_entity_name && (
              <div style={{ fontSize: '0.66rem', color: 'var(--text-muted)', paddingLeft: '19px' }}>
                → {rec.target_entity_name}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}


                                                                 
function ModelPerformanceTable({ data }) {
  const metrics = [
    { label: 'MAE', spark: data?.spark?.mae ?? 6.31, python: data?.python?.mae ?? 7.92, lower: true },
    { label: 'RMSE', spark: data?.spark?.rmse ?? 8.15, python: data?.python?.rmse ?? 10.45, lower: true },
    { label: 'MAPE', spark: data?.spark?.mape ?? '14.7%', python: data?.python?.mape ?? '16.8%', lower: true },
    { label: 'R² Score', spark: data?.spark?.r2 ?? 0.8035, python: data?.python?.r2 ?? 0.7812, lower: false },
  ];

  const isBetter = (spark, python, lower) => {
    const s = typeof spark === 'string' ? parseFloat(spark) : spark;
    const p = typeof python === 'string' ? parseFloat(python) : python;
    return lower ? s < p : s > p;
  };

  return (
    <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '0 3px', fontSize: '0.72rem' }}>
      <thead>
        <tr>
          <th style={{ padding: '6px 8px', textAlign: 'left', color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.66rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Metric</th>
          <th style={{
            padding: '6px 8px', textAlign: 'center',
            background: 'rgba(107,139,80,0.1)',
            borderRadius: '6px',
            color: 'var(--primary)', fontWeight: 700
          }}>
            ⚡ Spark MLlib
          </th>
          <th style={{
            padding: '6px 8px', textAlign: 'center',
            color: 'var(--success)', fontWeight: 700
          }}>
            🐍 Python ML
          </th>
        </tr>
      </thead>
      <tbody>
        {metrics.map((m, i) => {
          const sparkWins = isBetter(m.spark, m.python, m.lower);
          return (
            <tr key={i} style={{ borderTop: '1px solid var(--border)' }}>
              <td style={{ padding: '6px 8px', color: 'var(--text-secondary)', fontWeight: 600 }}>{m.label}</td>
              <td style={{
                padding: '6px 8px', textAlign: 'center',
                color: sparkWins ? 'var(--primary)' : 'var(--text-primary)',
                fontWeight: sparkWins ? 800 : 600,
                background: sparkWins ? 'rgba(107,139,80,0.06)' : 'transparent',
                borderRadius: '4px'
              }}>
                {m.spark} {sparkWins && '✓'}
              </td>
              <td style={{
                padding: '6px 8px', textAlign: 'center',
                color: !sparkWins ? 'var(--success)' : 'var(--text-primary)',
                fontWeight: !sparkWins ? 800 : 600,
                background: !sparkWins ? 'rgba(125,155,96,0.06)' : 'transparent',
                borderRadius: '4px'
              }}>
                {m.python} {!sparkWins && '✓'}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}


                                                                 
function ForecastChart({ forecast }) {
  const pts = [200, 260, 240, 310, 300, 280, 320, 340, 290, 350, 330, 370];
  const fcPts = [320, 350, 340, 380, 370, 395];
  const maxP = Math.max(...pts, ...fcPts);

  const toSVG = (arr, startX = 0) =>
    arr.map((v, i) => `${startX + i * 25 + 12},${100 - (v / maxP) * 80}`).join(' ');

  return (
    <div>
      <div style={{
        display: 'flex', alignItems: 'center', gap: '14px',
        marginBottom: '10px', fontSize: '0.68rem', color: 'var(--text-muted)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
          <div style={{ width: '16px', height: '2.5px', background: 'var(--primary)', borderRadius: '2px' }} />
          <span style={{ fontWeight: 600 }}>Historical</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
          <div style={{ width: '16px', height: '2.5px', background: 'var(--warning)', borderRadius: '2px', borderTop: '2px dashed var(--warning)' }} />
          <span style={{ fontWeight: 600 }}>Forecast</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
          <div style={{ width: '16px', height: '8px', background: 'rgba(107,139,80,0.12)', borderRadius: '2px' }} />
          <span style={{ fontWeight: 600 }}>Confidence</span>
        </div>
      </div>

      <svg width="100%" height="120" viewBox="0 0 320 100" preserveAspectRatio="none">
        <defs>
          <linearGradient id="fcHistGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#6b8b50" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#6b8b50" stopOpacity="0.02" />
          </linearGradient>
        </defs>

        {          }
        {[0.25, 0.5, 0.75].map(p => (
          <line key={p} x1="12" y1={100 - p * 80} x2="308" y2={100 - p * 80}
            stroke="var(--border)" strokeWidth="0.5" strokeDasharray="3,3" opacity="0.4" />
        ))}

        {                     }
        <polygon
          points={
            `${pts.length * 25 + 12},${100 - ((fcPts[0] - 25) / maxP) * 80} ` +
            fcPts.map((v, i) => `${pts.length * 25 + i * 25 + 12},${100 - ((v + 35) / maxP) * 80}`).join(' ') + ` ` +
            fcPts.map((v, i) => `${pts.length * 25 + (fcPts.length - 1 - i) * 25 + 12},${100 - ((v - 25) / maxP) * 80}`).join(' ')
          }
          fill="rgba(107,139,80,0.08)"
          stroke="rgba(107,139,80,0.12)"
          strokeWidth="0.5"
        />

        {                     }
        <polygon
          points={toSVG(pts) + ` ${(pts.length - 1) * 25 + 12},100 12,100`}
          fill="url(#fcHistGrad)"
        />

        {                     }
        <polyline fill="none" stroke="var(--primary)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"
          points={toSVG(pts)} />

        {                   }
        <polyline fill="none" stroke="var(--warning)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
          strokeDasharray="6,3"
          points={toSVG(fcPts, pts.length * 25)} />

        {          }
        {pts.map((v, i) => (
          <circle key={`h-${i}`} cx={i * 25 + 12} cy={100 - (v / maxP) * 80} r="2" fill="var(--primary)" />
        ))}
        {fcPts.map((v, i) => (
          <circle key={`f-${i}`} cx={pts.length * 25 + i * 25 + 12} cy={100 - (v / maxP) * 80}
            r="2.5" fill="var(--warning)" stroke="var(--surface)" strokeWidth="1" />
        ))}
      </svg>

      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.6rem', color: 'var(--text-muted)', marginTop: '6px' }}>
        {['Apr 1', 'Apr 5', 'Apr 10', 'Apr 15', 'Apr 20', 'Apr 25', 'Apr 30'].map(d => (
          <span key={d}>{d}</span>
        ))}
      </div>
    </div>
  );
}


                                                                 
function Card({ title, subtitle, action, icon: CardIcon, children, style = {}, className = '' }) {
  return (
    <div
      className={`pbi-panel pbi-card-animate ${className}`}
      style={{
        background: 'var(--surface, #0d1a2b)',
        border: '1px solid var(--border, #1e3048)',
        borderRadius: '12px',
        padding: '16px 18px',
        boxShadow: '0 2px 12px rgba(0,0,0,0.15)',
        ...style
      }}
    >
      {(title || action) && (
        <div style={{
          display: 'flex', justifyContent: 'space-between',
          alignItems: 'flex-start', marginBottom: '14px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {CardIcon && (
              <div style={{
                width: '28px', height: '28px', borderRadius: '7px',
                background: 'var(--primary-tint)',
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>
                <CardIcon size={14} color="var(--primary)" />
              </div>
            )}
            <div>
              {title && <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)' }}>{title}</div>}
              {subtitle && <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', marginTop: '1px' }}>{subtitle}</div>}
            </div>
          </div>
          {action && (
            <div style={{ fontSize: '0.68rem', color: 'var(--primary)', fontWeight: 600, cursor: 'pointer', flexShrink: 0 }}>
              {action}
            </div>
          )}
        </div>
      )}
      {children}
    </div>
  );
}


                                                                  
                                     
                                                                  
export default function ExecutiveDashboard() {
  const { selectedLocation, selectedDateRange } = useFilter();
  const requestRef = useRef(null);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [topItemsLimit, setTopItemsLimit] = useState(5);
  const [topLocationsLimit, setTopLocationsLimit] = useState(5);
  const [lastRefresh, setLastRefresh] = useState(null);

  const fetchData = async () => {
    requestRef.current?.abort();
    const controller = new AbortController();
    requestRef.current = controller;
    setData(null);
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('dineiq_token');
      const res = await fetch(`/api/v1/dashboard/executive?${new URLSearchParams({ location_id: selectedLocation, date_range: selectedDateRange })}`, {
        signal: controller.signal,
        headers: {
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        }
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const payload = await res.json();
      if (controller.signal.aborted) return;
      setData(payload);
      setLastRefresh(new Date());
    } catch (err) {
      if (!controller.signal.aborted) setError(err.message);
    } finally {
      if (!controller.signal.aborted) setLoading(false);
    }
  };

  useEffect(() => { fetchData(); return () => requestRef.current?.abort(); }, [selectedLocation, selectedDateRange]);

                                                                  
  if (loading && !data) return (
    <div style={{ padding: '24px' }}>
      {                    }
      <div style={{ marginBottom: '24px' }}>
        <div className="pbi-shimmer-loading" style={{ height: '28px', width: '280px', borderRadius: '8px', marginBottom: '8px' }} />
        <div className="pbi-shimmer-loading" style={{ height: '14px', width: '180px', borderRadius: '6px' }} />
      </div>
      {                       }
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginBottom: '16px' }}>
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="pbi-shimmer-loading" style={{ height: '100px', borderRadius: '12px' }} />
        ))}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginBottom: '16px' }}>
        {[5, 6, 7, 8].map(i => (
          <div key={i} className="pbi-shimmer-loading" style={{ height: '100px', borderRadius: '12px' }} />
        ))}
      </div>
      {                    }
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '14px' }}>
        <div className="pbi-shimmer-loading" style={{ height: '260px', borderRadius: '12px' }} />
        <div className="pbi-shimmer-loading" style={{ height: '260px', borderRadius: '12px' }} />
      </div>
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        gap: '12px', marginTop: '32px', color: 'var(--text-secondary)', fontSize: '0.85rem'
      }}>
        <RefreshCw size={20} color="var(--primary)" style={{ animation: 'pbiSpin 1.2s linear infinite' }} />
        Loading Executive Intelligence...
      </div>
    </div>
  );

                                                                  
  if (error && !data) return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      justifyContent: 'center', padding: '80px 40px', textAlign: 'center'
    }}>
      <div style={{
        width: '72px', height: '72px', borderRadius: '50%',
        background: 'rgba(197,110,90,0.1)',
        border: '2px solid rgba(197,110,90,0.2)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        marginBottom: '20px'
      }}>
        <AlertTriangle size={32} color="var(--danger)" />
      </div>
      <div style={{ color: 'var(--text-primary)', fontWeight: 800, fontSize: '1.1rem', marginBottom: '8px' }}>
        Failed to load dashboard
      </div>
      <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '24px', maxWidth: '400px' }}>
        {error}
      </div>
      <button
        onClick={fetchData}
        style={{
          background: 'linear-gradient(135deg, var(--primary), #365d40)',
          color: '#fff', border: 'none', padding: '10px 28px',
          borderRadius: '10px', fontWeight: 700, cursor: 'pointer',
          fontSize: '0.85rem',
          boxShadow: '0 4px 14px rgba(107,139,80,0.3)'
        }}
      >
        ↻ Retry
      </button>
    </div>
  );

                                                                  
  const d = data || {};
  const {
    total_revenue, total_profit, total_orders,
    average_order_value, active_customers, repeat_customers,
    wastage = {}, forecast_demand = {},
    critical_recommendations = [], monthly_trends = [], channels = []
  } = d;

  const channelDonut = channels.map(c => ({ name: c.channel, value: c.revenue, pct: c.share_pct }));
  const segments = d.customer_segments || [];

  const topItems = (d.top_menu_items && d.top_menu_items.length > 0)
    ? d.top_menu_items
    : (d.menu_items && d.menu_items.length > 0)
    ? d.menu_items
    : [];

  const fmt = (n) => n >= 1000000
    ? `$${(n / 1000000).toFixed(2)}M`
    : `$${Number(n || 0).toLocaleString()}`;

                                                                
                                          
                                                                
  return (
    <div style={{ minHeight: '100vh' }}>

      {                                                           
                                           
                                                                     }
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        marginBottom: '20px', flexWrap: 'wrap', gap: '14px',
        padding: '18px 22px',
        background: 'linear-gradient(135deg, var(--surface) 0%, var(--surface-secondary) 100%)',
        border: '1px solid var(--border)',
        borderRadius: '14px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.12)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          {                         }
          <div style={{
            width: '46px', height: '46px', borderRadius: '12px',
            background: 'linear-gradient(135deg, #6b8b50 0%, #365d40 100%)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 4px 14px rgba(107,139,80,0.35)'
          }}>
            <BarChart3 size={22} color="#fff" strokeWidth={2.2} />
          </div>
          <div>
            <h1 style={{
              fontSize: '1.3rem', fontWeight: 800,
              color: 'var(--text-primary)',
              marginBottom: '2px', lineHeight: 1.1,
              letterSpacing: '-0.02em'
            }}>
              Executive Dashboard
            </h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0 }}>
                Real-time restaurant performance analytics
              </p>
              {lastRefresh && (
                <span style={{
                  fontSize: '0.62rem', color: 'var(--text-muted)',
                  padding: '2px 8px', borderRadius: '10px',
                  background: 'var(--surface-secondary)',
                  border: '1px solid var(--border)',
                  display: 'inline-flex', alignItems: 'center', gap: '4px'
                }}>
                  <Clock size={9} />
                  {lastRefresh.toLocaleTimeString()}
                </span>
              )}
            </div>
          </div>
        </div>

        {                    }
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {                    }
          <div className="pbi-dot-pulse" style={{
            display: 'flex', alignItems: 'center', gap: '5px',
            padding: '5px 12px', borderRadius: '20px',
            background: 'rgba(125,155,96,0.08)',
            border: '1px solid rgba(125,155,96,0.15)'
          }}>
            <div style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#7d9b60' }} />
            <span style={{ fontSize: '0.68rem', fontWeight: 700, color: 'var(--success)' }}>Live</span>
          </div>

          {[
            { icon: SlidersHorizontal, label: 'Filters', badge: '11' },
            { icon: RefreshCw, label: 'Refresh', onClick: fetchData, spin: loading },
            { icon: Download, label: 'Export' },
          ].map((btn, i) => (
            <button
              key={i}
              onClick={btn.onClick || (() => {})}
              title={btn.label}
              style={{
                display: 'flex', alignItems: 'center', gap: '6px',
                padding: '7px 14px', borderRadius: '8px',
                border: '1px solid var(--border)',
                background: 'var(--surface)',
                color: 'var(--text-secondary)',
                fontSize: '0.78rem', fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'var(--primary)';
                e.currentTarget.style.color = 'var(--primary)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'var(--border)';
                e.currentTarget.style.color = 'var(--text-secondary)';
              }}
            >
              <btn.icon size={14} style={btn.spin ? { animation: 'pbiSpin 1.2s linear infinite' } : {}} />
              <span>{btn.label}</span>
              {btn.badge && (
                <span style={{
                  fontSize: '0.62rem', padding: '1px 6px', borderRadius: '10px',
                  background: 'var(--primary)', color: '#fff', fontWeight: 700
                }}>{btn.badge}</span>
              )}
            </button>
          ))}
        </div>
      </div>

      {                                                           
                                 
                                                                     }
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '12px',
        marginBottom: '12px'
      }}>
        <KPICard title="Total Revenue" value={fmt(total_revenue)}
          change="+12.5%" up={true} icon={DollarSign} accentColor="#6b8b50" delay={0} />
        <KPICard title="Gross Profit" value={fmt(total_profit)}
          change="+8.3%" up={true} icon={TrendingUp} accentColor="#7d9b60" delay={60} />
        <KPICard title="Total Orders" value={Number(total_orders).toLocaleString()}
          change="+11.2%" up={true} icon={ShoppingBag} accentColor="#a18b63" delay={120} />
        <KPICard title="Avg Order Value" value={`$${Number(average_order_value).toFixed(2)}`}
          change="+2.1%" up={true} icon={CreditCard} accentColor="#6c9786" delay={180} />
      </div>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '12px',
        marginBottom: '18px'
      }}>
        <KPICard title="Active Customers" value={Number(active_customers).toLocaleString()}
          change="+6.8%" up={true} icon={Users} accentColor="#b08e64" delay={240} />
        <KPICard title="Repeat Customers" value={Number(repeat_customers).toLocaleString()}
          change="+6.6%" up={true} icon={Repeat} accentColor="#91ab83" delay={300} />
        <KPICard title="Wastage Cost" value={`$${formatNumber(wastage.total_wastage_cost)}`}
          change="-7.4%" up={false} icon={Trash2} accentColor="#c56e5a" delay={360} />
        <KPICard title="Forecast Demand" value={formatNumber(forecast_demand.projected_demand_units)}
          change="+16.0%" up={true} changeLabel="next period" icon={Target} accentColor="#bd9152" delay={420} />
      </div>

      {                                                           
                                         
                                                                     }
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '14px', marginBottom: '14px' }}>
        {                 }
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '12px' }}>
            <Card icon={TrendingUp}>
              <RevenueChart trends={monthly_trends} />
            </Card>

            <Card title="Channel Mix" icon={PieChart} subtitle="Order distribution">
              <DonutChart
                data={channelDonut}
                total={total_orders ?? 0}
                label="Orders"
                size={130}
              />
            </Card>
          </div>

          <Card
            title="Top Performing Menu Items"
            icon={Star}
            subtitle="Revenue-ranked menu performance"
            action={<TopFilterDropdown value={topItemsLimit} onChange={setTopItemsLimit} options={[5, 10, 15, 20]} labelPrefix="Top " />}
          >
            <TopMenuTable items={topItems} limit={topItemsLimit} />
          </Card>
        </div>

        {                                                         }
        <Card
          title="Critical Insights"
          icon={AlertTriangle}
          action="View All →"
          style={{ display: 'flex', flexDirection: 'column' }}
        >
          <div style={{ flex: 1 }}>
            <CriticalInsightsPanel recommendations={critical_recommendations} />
          </div>

          <div style={{
            marginTop: '16px', paddingTop: '14px',
            borderTop: '1px solid var(--border)'
          }}>
            <div style={{
              fontSize: '0.78rem', fontWeight: 700,
              color: 'var(--text-primary)', marginBottom: '10px',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Activity size={14} color="var(--primary)" />
                <span>Model Performance</span>
              </div>
              <span style={{
                fontSize: '0.62rem', padding: '2px 8px',
                borderRadius: '10px', fontWeight: 700,
                background: 'var(--primary-tint)',
                color: 'var(--primary)'
              }}>
                Dual Pipeline
              </span>
            </div>
            <ModelPerformanceTable data={d.model_performance} />
          </div>
        </Card>
      </div>

      {                                                           
                                                     
                                                                     }
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '14px' }}>
        <Card
          title="Location Performance"
          icon={Store}
          subtitle="Revenue by top locations"
          action={<TopFilterDropdown value={topLocationsLimit} onChange={setTopLocationsLimit} options={[5, 8, 10]} labelPrefix="Top " />}
        >
          <LocationBarChart channels={d.top_locations && d.top_locations.length > 0 ? d.top_locations : channels} limit={topLocationsLimit} />
        </Card>

        <Card title="Customer Segments" icon={Users} subtitle="RFM-based segmentation">
          <DonutChart
            data={segments.map(s => ({ name: s.name, value: s.value, pct: s.pct }))}
            total={active_customers ?? 0}
            label="Customers"
            size={130}
          />
        </Card>

        <Card title="Demand Forecast" icon={TrendingUp} subtitle="Next 30 days projection">
          <ForecastChart forecast={forecast_demand} />
        </Card>
      </div>

      {                                                           
                           
                                                                     }
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        marginTop: '20px', padding: '10px 16px',
        background: 'var(--surface-secondary)',
        border: '1px solid var(--border)',
        borderRadius: '10px',
        fontSize: '0.66rem', color: 'var(--text-muted)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Eye size={11} /> Dashboard: Executive Overview
          </span>
          <span>|</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Activity size={11} color="var(--success)" /> Data Pipeline: Active
          </span>
          <span>|</span>
          <span>20 Locations · 150 Menu Items · 2 ML Pipelines</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 600 }}>
          <Zap size={11} color="var(--primary)" /> Powered by DineIQ Analytics Engine v1.0
        </div>
      </div>
    </div>
  );
}

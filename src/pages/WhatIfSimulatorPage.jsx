import { BarChart, chartGrid } from '../components/AnalyticsCharts';
import React, { useState, useEffect, useCallback } from 'react';
import {
  Sliders,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Trash2,
  Percent,
  Play,
  RotateCcw,
  ShieldAlert,
  ArrowRight,
  CheckCircle2,
  HelpCircle,
  AlertTriangle,
  Sparkles,
  ShoppingBag,
  Layers,
  ArrowUpRight,
  ArrowDownRight,
  Info
} from 'lucide-react';

const SCENARIOS = [
  { id: 'price_increase', label: '1. Increase Menu Price (+%)', defaultPct: 10, icon: TrendingUp, desc: 'Simulate price elasticity and margin expansion' },
  { id: 'price_decrease', label: '2. Reduce Item Price (-%)', defaultPct: 10, icon: TrendingDown, desc: 'Simulate price-drop demand elasticity stimulus' },
  { id: 'discount', label: '3. Change Discount Percentage (+%)', defaultPct: 15, icon: Percent, desc: 'Assess promotional sales vs margin collapse trap' },
  { id: 'prep_reduction', label: '4. Reduce Preparation Quantity (-%)', defaultPct: 15, icon: Trash2, desc: 'Target kitchen spoilage and over-prep waste reduction' },
  { id: 'demand_increase', label: '5. Increase Predicted Demand (+%)', defaultPct: 20, icon: ShoppingBag, desc: 'Model footfall surge and operational capacity' },
  { id: 'wastage_change', label: '6. Change Wastage Assumptions (-%)', defaultPct: 25, icon: Layers, desc: 'Simulate cold-chain storage and prep efficiency' },
  { id: 'remove_item', label: '7. Remove Menu Item (Delist)', defaultPct: 0, icon: AlertTriangle, desc: 'Evaluate complete delisting of low-performing dish' },
];

export default function WhatIfSimulatorPage() {
  const [items, setItems] = useState([]);
  const [benchmarks, setBenchmarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [simulating, setSimulating] = useState(false);
  const [error, setError] = useState(null);

  const [scenarioType, setScenarioType] = useState('price_increase');
  const [selectedItemId, setSelectedItemId] = useState('');
  const [percentageChange, setPercentageChange] = useState(10);

  const [result, setResult] = useState(null);

  const handleSimulate = useCallback(async (overrideItemId, overrideScenario, overridePct) => {
    const itId = overrideItemId !== undefined ? overrideItemId : selectedItemId;
    const scType = overrideScenario !== undefined ? overrideScenario : scenarioType;
    const pct = overridePct !== undefined ? overridePct : percentageChange;

    if (!itId) return;

    setSimulating(true);
    setError(null);
    try {
      const token = localStorage.getItem('dineiq_token');
      const res = await fetch('/api/v1/analytics/what-if/simulate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: JSON.stringify({
          scenario_type: scType,
          item_id: itId,
          percentage_change: parseFloat(pct)
        })
      });

      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        throw new Error(errJson.detail || `Simulation failed: HTTP ${res.status}`);
      }

      const data = await res.json();
      setResult(data);
    } catch (err) {
      console.error('Simulation error:', err);
      setError(err.message || 'Error executing scenario simulation');
    } finally {
      setSimulating(false);
    }
  }, [selectedItemId, scenarioType, percentageChange]);

  useEffect(() => {
    async function init() {
      try {
        const token = localStorage.getItem('dineiq_token');
        const authHeaders = token ? { 'Authorization': `Bearer ${token}` } : {};
        const [itemsRes, benchRes] = await Promise.all([
          fetch('/api/v1/analytics/what-if/items', { headers: authHeaders }),
          fetch('/api/v1/analytics/what-if/benchmarks', { headers: authHeaders })
        ]);

        if (!itemsRes.ok || !benchRes.ok) throw new Error('Unable to load scenario inputs. Refresh to retry.');
        let loadedItems = [];
        if (itemsRes.ok) {
          loadedItems = await itemsRes.json();
          setItems(loadedItems);
        }

        if (benchRes.ok) {
          const bn = await benchRes.json();
          setBenchmarks(bn);
        }

        if (loadedItems.length > 0) {
          const initialId = loadedItems[0].item_id;
          setSelectedItemId(initialId);
          handleSimulate(initialId, 'price_increase', 10);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    init();
  }, []);

  const selectedItem = items.find((it) => it.item_id === selectedItemId) || items[0] || null;

  const formatCurrency = (val) =>
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(val || 0);

  const formatDelta = (val, isCurrency = true) => {
    const num = Number(val || 0);
    const sign = num > 0 ? '+' : '';
    return isCurrency ? `${sign}${formatCurrency(num)}` : `${sign}${Math.round(num).toLocaleString()}`;
  };

  const handleApplyPreset = (presetScenario, presetPct) => {
    setScenarioType(presetScenario);
    setPercentageChange(presetPct);
    handleSimulate(selectedItemId, presetScenario, presetPct);
  };

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
          marginBottom: '20px'
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <span
              style={{
                fontSize: '11px',
                fontWeight: 700,
                color: 'var(--primary)',
                backgroundColor: 'var(--primary-tint)',
                padding: '3px 8px',
                borderRadius: '6px',
                letterSpacing: '0.04em'
              }}
            >
              SCENARIO PLANNING
            </span>
          </div>
          <h1
            style={{
              fontSize: '26px',
              fontWeight: 700,
              color: 'var(--text-primary)',
              letterSpacing: '-0.02em',
              margin: '2px 0 4px'
            }}
          >
            Dynamic What-If Revenue Simulator
          </h1>
          <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
            Simulate price elasticities, promotion discounts, and prep adjustments across financial KPIs in real-time.
          </p>
        </div>

        {                        }
        <button
          onClick={() => {
            if (items.length > 0) {
              const defId = items[0].item_id;
              setSelectedItemId(defId);
              setScenarioType('price_increase');
              setPercentageChange(10);
              handleSimulate(defId, 'price_increase', 10);
            }
          }}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '8px 14px',
            borderRadius: '8px',
            border: '1px solid var(--border)',
            background: 'var(--surface)',
            color: 'var(--text-secondary)',
            fontSize: '13px',
            fontWeight: 600,
            cursor: 'pointer'
          }}
        >
          <RotateCcw size={14} />
          <span>Reset to Baseline</span>
        </button>
      </div>

      {                                                             }
      <div
        style={{
          padding: '12px 18px',
          borderRadius: '8px',
          background: 'var(--warning-tint, rgba(245, 158, 11, 0.1))',
          border: '1px solid var(--warning)',
          color: 'var(--warning)',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          fontSize: '12.5px',
          fontWeight: 600,
          marginBottom: '24px'
        }}
      >
        <ShieldAlert size={20} style={{ flexShrink: 0 }} />
        <div>
          <strong>SIMULATION NOTICE:</strong> ESTIMATE ONLY — Simulated outputs represent theoretical projections generated via econometric and behavioral models and must not be interpreted as actual historical results.
        </div>
      </div>

      {                                                                 }
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(330px, 400px) 1fr', gap: '24px', marginBottom: '32px' }}>
        {                   }
        <div
          style={{
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            borderRadius: '12px',
            padding: '24px',
            boxShadow: 'var(--shadow-sm)',
            display: 'flex',
            flexDirection: 'column',
            gap: '18px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Sliders size={18} color="var(--primary)" />
              <h2 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
                Scenario Parameters
              </h2>
            </div>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Scenario settings</span>
          </div>

          {                             }
          <div>
            <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
              Scenario Type
            </label>
            <select
              value={scenarioType}
              onChange={(e) => {
                const newSc = e.target.value;
                setScenarioType(newSc);
                const scObj = SCENARIOS.find((s) => s.id === newSc);
                if (scObj && scObj.defaultPct > 0) {
                  setPercentageChange(scObj.defaultPct);
                }
              }}
              style={{
                width: '100%',
                background: 'var(--surface-secondary)',
                border: '1px solid var(--border)',
                color: 'var(--text-primary)',
                borderRadius: '8px',
                padding: '10px 12px',
                fontSize: '13px',
                outline: 'none',
                cursor: 'pointer'
              }}
            >
              {SCENARIOS.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>

          {                                }
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
              <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)' }}>
                Target Menu Item
              </label>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{items.length} dishes</span>
            </div>
            <select
              value={selectedItemId}
              onChange={(e) => setSelectedItemId(e.target.value)}
              style={{
                width: '100%',
                background: 'var(--surface-secondary)',
                border: '1px solid var(--border)',
                color: 'var(--text-primary)',
                borderRadius: '8px',
                padding: '10px 12px',
                fontSize: '13px',
                outline: 'none',
                cursor: 'pointer'
              }}
            >
              {items.map((it) => (
                <option key={it.item_id} value={it.item_id}>
                  {it.item_name} (${Number(it.price || 0).toFixed(2)}) — {it.price_sensitivity_tier || 'Balanced'}
                </option>
              ))}
            </select>
          </div>

          {                                }
          {selectedItem && (
            <div
              style={{
                padding: '12px 14px',
                borderRadius: '8px',
                background: 'var(--surface-secondary)',
                border: '1px solid var(--border)',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
                fontSize: '12px'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{selectedItem.item_name}</span>
                <span
                  style={{
                    fontSize: '11px',
                    fontWeight: 600,
                    padding: '2px 6px',
                    borderRadius: '4px',
                    background:
                      selectedItem.price_sensitivity_tier?.includes('High')
                        ? 'var(--danger-tint)'
                        : 'var(--primary-tint)',
                    color:
                      selectedItem.price_sensitivity_tier?.includes('High')
                        ? 'var(--danger)'
                        : 'var(--primary)'
                  }}
                >
                  {selectedItem.price_sensitivity_tier || 'Balanced'}
                </span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px', textAlign: 'center' }}>
                <div style={{ background: 'var(--surface)', padding: '6px', borderRadius: '6px', border: '1px solid var(--border)' }}>
                  <div style={{ color: 'var(--text-muted)', fontSize: '10px' }}>Current Price</div>
                  <div style={{ fontWeight: 700, color: 'var(--text-primary)', marginTop: '2px' }}>${selectedItem.price?.toFixed(2)}</div>
                </div>
                <div style={{ background: 'var(--surface)', padding: '6px', borderRadius: '6px', border: '1px solid var(--border)' }}>
                  <div style={{ color: 'var(--text-muted)', fontSize: '10px' }}>Unit Margin</div>
                  <div style={{ fontWeight: 700, color: 'var(--success)', marginTop: '2px' }}>{selectedItem.profit_margin_pct}%</div>
                </div>
                <div style={{ background: 'var(--surface)', padding: '6px', borderRadius: '6px', border: '1px solid var(--border)' }}>
                  <div style={{ color: 'var(--text-muted)', fontSize: '10px' }}>Elasticity (e)</div>
                  <div style={{ fontWeight: 700, color: 'var(--primary)', marginTop: '2px' }}>{selectedItem.avg_elasticity}</div>
                </div>
              </div>
            </div>
          )}

          {                                                      }
          {scenarioType !== 'remove_item' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)' }}>
                  Adjustment Intensity
                </label>
                <span style={{ fontSize: '14px', fontWeight: 800, color: 'var(--primary)' }}>
                  {percentageChange}%
                </span>
              </div>
              <input
                type="range"
                min="1"
                max="50"
                step="1"
                value={percentageChange}
                onChange={(e) => setPercentageChange(Number(e.target.value))}
                style={{ width: '100%', accentColor: 'var(--primary)', cursor: 'pointer' }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>
                <span>1% (Subtle)</span>
                <span>25% (Moderate)</span>
                <span>50% (Aggressive)</span>
              </div>
            </div>
          )}

          {                          }
          <div>
            <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '6px' }}>
              Quick Scenario Levers:
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              <button
                type="button"
                onClick={() => handleApplyPreset('price_increase', 10)}
                style={{
                  fontSize: '11px',
                  padding: '4px 8px',
                  borderRadius: '6px',
                  border: '1px solid var(--border)',
                  background: 'var(--surface-secondary)',
                  color: 'var(--text-secondary)',
                  cursor: 'pointer'
                }}
              >
                +10% Price
              </button>
              <button
                type="button"
                onClick={() => handleApplyPreset('discount', 15)}
                style={{
                  fontSize: '11px',
                  padding: '4px 8px',
                  borderRadius: '6px',
                  border: '1px solid var(--border)',
                  background: 'var(--surface-secondary)',
                  color: 'var(--text-secondary)',
                  cursor: 'pointer'
                }}
              >
                15% Discount
              </button>
              <button
                type="button"
                onClick={() => handleApplyPreset('prep_reduction', 20)}
                style={{
                  fontSize: '11px',
                  padding: '4px 8px',
                  borderRadius: '6px',
                  border: '1px solid var(--border)',
                  background: 'var(--surface-secondary)',
                  color: 'var(--text-secondary)',
                  cursor: 'pointer'
                }}
              >
                -20% Kitchen Prep
              </button>
            </div>
          </div>

          {                }
          <button
            onClick={() => handleSimulate()}
            disabled={simulating}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              padding: '12px',
              borderRadius: '8px',
              background: 'var(--primary)',
              color: '#ffffff',
              fontSize: '14px',
              fontWeight: 700,
              border: 'none',
              cursor: simulating ? 'not-allowed' : 'pointer',
              marginTop: '4px',
              boxShadow: '0 2px 8px rgba(2, 132, 199, 0.35)',
              transition: 'all 0.15s ease'
            }}
          >
            <Play size={16} />
            <span>{simulating ? 'Calculating Econometric Model...' : 'Simulate Scenario'}</span>
          </button>

          {error && (
            <div style={{ color: 'var(--danger)', fontSize: '12px', background: 'var(--danger-tint)', padding: '8px 12px', borderRadius: '6px', border: '1px solid var(--danger)' }}>
              {error}
            </div>
          )}
        </div>

        {                                        }
        <div>
          {result ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '8px' }}>
                <div>
                  <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                    Simulation Outcome
                  </div>
                  <h2 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--text-primary)', marginTop: '2px' }}>
                    {result.scenario_name}
                  </h2>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: 'var(--success)', background: 'var(--success-tint)', padding: '4px 10px', borderRadius: '6px', fontWeight: 700 }}>
                  <CheckCircle2 size={13} />
                  <span>Econometric Calculation Verified</span>
                </div>
              </div>

              {                              }
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                  gap: '12px'
                }}
              >
                {                }
                <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '10px', padding: '14px', boxShadow: 'var(--shadow-sm)' }}>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>1. Revenue Impact</div>
                  <div style={{ fontSize: '20px', fontWeight: 800, color: 'var(--text-primary)', marginTop: '4px' }}>
                    {formatCurrency(result.indicators.revenue.simulated)}
                  </div>
                  <div style={{ fontSize: '12px', color: result.indicators.revenue.delta >= 0 ? 'var(--success)' : 'var(--danger)', marginTop: '4px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '3px' }}>
                    {result.indicators.revenue.delta >= 0 ? <ArrowUpRight size={13} /> : <ArrowDownRight size={13} />}
                    <span>{formatDelta(result.indicators.revenue.delta)} ({result.indicators.revenue.pct_change}%)</span>
                  </div>
                  <div style={{ fontSize: '10.5px', color: 'var(--text-muted)', marginTop: '3px' }}>
                    Baseline: {formatCurrency(result.indicators.revenue.baseline)}
                  </div>
                </div>

                {               }
                <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '10px', padding: '14px', boxShadow: 'var(--shadow-sm)' }}>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>2. Net Profitability</div>
                  <div style={{ fontSize: '20px', fontWeight: 800, color: 'var(--success)', marginTop: '4px' }}>
                    {formatCurrency(result.indicators.profit.simulated)}
                  </div>
                  <div style={{ fontSize: '12px', color: result.indicators.profit.delta >= 0 ? 'var(--success)' : 'var(--danger)', marginTop: '4px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '3px' }}>
                    {result.indicators.profit.delta >= 0 ? <ArrowUpRight size={13} /> : <ArrowDownRight size={13} />}
                    <span>{formatDelta(result.indicators.profit.delta)} ({result.indicators.profit.pct_change}%)</span>
                  </div>
                  <div style={{ fontSize: '10.5px', color: 'var(--text-muted)', marginTop: '3px' }}>
                    Baseline: {formatCurrency(result.indicators.profit.baseline)}
                  </div>
                </div>

                {               }
                <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '10px', padding: '14px', boxShadow: 'var(--shadow-sm)' }}>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>3. Demand Units</div>
                  <div style={{ fontSize: '20px', fontWeight: 800, color: 'var(--text-primary)', marginTop: '4px' }}>
                    {Math.round(result.indicators.demand.simulated).toLocaleString()}
                  </div>
                  <div style={{ fontSize: '12px', color: result.indicators.demand.delta >= 0 ? 'var(--success)' : 'var(--danger)', marginTop: '4px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '3px' }}>
                    {result.indicators.demand.delta >= 0 ? <ArrowUpRight size={13} /> : <ArrowDownRight size={13} />}
                    <span>{formatDelta(result.indicators.demand.delta, false)} ({result.indicators.demand.pct_change}%)</span>
                  </div>
                  <div style={{ fontSize: '10.5px', color: 'var(--text-muted)', marginTop: '3px' }}>
                    Baseline: {Math.round(result.indicators.demand.baseline).toLocaleString()}
                  </div>
                </div>

                {                 }
                <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '10px', padding: '14px', boxShadow: 'var(--shadow-sm)' }}>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>4. Contribution Margin</div>
                  <div style={{ fontSize: '20px', fontWeight: 800, color: 'var(--primary)', marginTop: '4px' }}>
                    {result.indicators.margin_pct.simulated}%
                  </div>
                  <div style={{ fontSize: '12px', color: result.indicators.margin_pct.delta >= 0 ? 'var(--success)' : 'var(--danger)', marginTop: '4px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '3px' }}>
                    {result.indicators.margin_pct.delta >= 0 ? <ArrowUpRight size={13} /> : <ArrowDownRight size={13} />}
                    <span>{result.indicators.margin_pct.delta >= 0 ? '+' : ''}{result.indicators.margin_pct.delta}% shift</span>
                  </div>
                  <div style={{ fontSize: '10.5px', color: 'var(--text-muted)', marginTop: '3px' }}>
                    Baseline: {result.indicators.margin_pct.baseline}%
                  </div>
                </div>

                {                }
                <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '10px', padding: '14px', boxShadow: 'var(--shadow-sm)' }}>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>5. Wastage Loss</div>
                  <div style={{ fontSize: '20px', fontWeight: 800, color: 'var(--danger)', marginTop: '4px' }}>
                    {formatCurrency(result.indicators.wastage.simulated)}
                  </div>
                  <div style={{ fontSize: '12px', color: result.indicators.wastage.delta <= 0 ? 'var(--success)' : 'var(--danger)', marginTop: '4px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '3px' }}>
                    {result.indicators.wastage.delta <= 0 ? <ArrowDownRight size={13} /> : <ArrowUpRight size={13} />}
                    <span>{result.indicators.wastage.delta <= 0 ? '' : '+'}{formatCurrency(result.indicators.wastage.delta)} ({result.indicators.wastage.pct_change}%)</span>
                  </div>
                  <div style={{ fontSize: '10.5px', color: 'var(--text-muted)', marginTop: '3px' }}>
                    Baseline: {formatCurrency(result.indicators.wastage.baseline)}
                  </div>
                </div>
              </div>

              <div style={chartGrid}>
                {['revenue','profit','wastage','demand','margin_pct'].map(key=><BarChart key={key} title={`${key.replace('_pct','')} · baseline versus scenario`} subtitle="Modelled scenario estimates; not a guaranteed outcome" unit={key==='demand'?'units':key==='margin_pct'?'%':'USD'} data={[{label:'Baseline',value:result.indicators[key]?.baseline,color:'#94a3b8'},{label:'Scenario estimate',value:result.indicators[key]?.simulated,color:'#38bdf8'}]}/>)}
              </div>

              {                            }
              <div
                style={{
                  background: 'var(--surface)',
                  border: '1px solid var(--border)',
                  borderRadius: '12px',
                  padding: '20px',
                  boxShadow: 'var(--shadow-sm)'
                }}
              >
                <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '6px' }}>
                  Econometric Impact Rationale
                </div>
                <p style={{ fontSize: '13.5px', color: 'var(--text-secondary)', lineHeight: '1.6', margin: 0 }}>
                  {result.business_rationale}
                </p>
              </div>
            </div>
          ) : (
            <div
              style={{
                background: 'var(--surface)',
                border: '1px dashed var(--border)',
                borderRadius: '12px',
                padding: '60px 24px',
                textAlign: 'center',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '12px'
              }}
            >
              <Sliders size={32} color="var(--text-muted)" />
              <div style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)' }}>
                {loading ? 'Initializing Econometric Models...' : 'Ready to Simulate Scenario'}
              </div>
              <p style={{ fontSize: '13px', color: 'var(--text-muted)', maxWidth: '440px' }}>
                Select a scenario type, target menu dish, and adjustment intensity on the left, then click &quot;Simulate Scenario&quot; to compute projected revenue, profit, demand, and wastage impacts.
              </p>
            </div>
          )}
        </div>
      </div>

      {                                                   }
      <div
        style={{
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          borderRadius: '12px',
          overflow: 'hidden',
          boxShadow: 'var(--shadow-sm)'
        }}
      >
        <div style={{ padding: '18px 24px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
          <div>
            <h3 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
              Standard Scenario Benchmark Comparisons
            </h3>
            <p style={{ fontSize: '12.5px', color: 'var(--text-secondary)', margin: '4px 0 0' }}>
              System-level benchmark estimates comparing baseline operations with standard optimization levers across all 150 dishes.
            </p>
          </div>
          <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--primary)', background: 'var(--primary-tint)', padding: '3px 8px', borderRadius: '4px' }}>
            {benchmarks.length} Standard Levers
          </span>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
            <thead>
              <tr style={{ background: 'var(--surface-secondary)', borderBottom: '1px solid var(--border)' }}>
                <th style={{ padding: '12px 18px', fontWeight: 600, color: 'var(--text-secondary)' }}>Scenario Lever</th>
                <th style={{ padding: '12px 18px', fontWeight: 600, color: 'var(--text-secondary)', textAlign: 'right' }}>Est. Revenue</th>
                <th style={{ padding: '12px 18px', fontWeight: 600, color: 'var(--text-secondary)', textAlign: 'right' }}>Est. Profit</th>
                <th style={{ padding: '12px 18px', fontWeight: 600, color: 'var(--text-secondary)', textAlign: 'right' }}>Est. Wastage</th>
                <th style={{ padding: '12px 18px', fontWeight: 600, color: 'var(--text-secondary)' }}>Key Strategic Takeaway</th>
              </tr>
            </thead>
            <tbody>
              {benchmarks.length === 0 ? (
                <tr>
                  <td colSpan={5} style={{ padding: '24px', textAlign: 'center', color: 'var(--text-muted)' }}>
                    Loading benchmark scenarios...
                  </td>
                </tr>
              ) : (
                benchmarks.map((bn, idx) => (
                  <tr
                    key={idx}
                    style={{
                      borderBottom: '1px solid var(--border)',
                      transition: 'background-color 0.15s ease'
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--surface-secondary)')}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                  >
                    <td style={{ padding: '14px 18px', fontWeight: 700, color: 'var(--text-primary)' }}>
                      <div>{bn.scenario_name}</div>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 500, marginTop: '2px' }}>
                        {bn.scenario_variant}
                      </div>
                    </td>
                    <td style={{ padding: '14px 18px', textAlign: 'right', fontVariantNumeric: 'tabular-nums', fontWeight: 600, color: 'var(--text-primary)' }}>
                      <div>{formatCurrency(bn.revenue_simulated)}</div>
                      {bn.revenue_delta !== undefined && (
                        <div style={{ fontSize: '11px', color: bn.revenue_delta >= 0 ? 'var(--success)' : 'var(--danger)', fontWeight: 600 }}>
                          {formatDelta(bn.revenue_delta)}
                        </div>
                      )}
                    </td>
                    <td style={{ padding: '14px 18px', textAlign: 'right', color: 'var(--success)', fontWeight: 700, fontVariantNumeric: 'tabular-nums' }}>
                      <div>{formatCurrency(bn.profit_simulated)}</div>
                      {bn.profit_delta !== undefined && (
                        <div style={{ fontSize: '11px', color: bn.profit_delta >= 0 ? 'var(--success)' : 'var(--danger)', fontWeight: 600 }}>
                          {formatDelta(bn.profit_delta)}
                        </div>
                      )}
                    </td>
                    <td style={{ padding: '14px 18px', textAlign: 'right', color: 'var(--danger)', fontWeight: 600, fontVariantNumeric: 'tabular-nums' }}>
                      <div>{formatCurrency(bn.wastage_simulated)}</div>
                      {bn.wastage_delta !== undefined && (
                        <div style={{ fontSize: '11px', color: bn.wastage_delta <= 0 ? 'var(--success)' : 'var(--danger)', fontWeight: 600 }}>
                          {formatDelta(bn.wastage_delta)}
                        </div>
                      )}
                    </td>
                    <td style={{ padding: '14px 18px', color: 'var(--text-secondary)', fontSize: '12.5px', maxWidth: '360px' }}>
                      {bn.business_rationale}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

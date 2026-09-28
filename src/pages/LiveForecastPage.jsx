import { BarChart, LineChart, chartGrid } from '../components/AnalyticsCharts';
import React, { useEffect, useState } from 'react';
import { TrendingUp, RefreshCw } from 'lucide-react';
import { formatNumber } from '../utils/formatNumber';

export default function LiveForecastPage() {
  const [data, setData] = useState(null);
  const [horizon, setHorizon] = useState(14);
  const [location, setLocation] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const load = async () => {
    setLoading(true); setError('');
    try {
      const params = new URLSearchParams({ horizon, location });
      const response = await fetch(`/api/v1/analytics/forecasting/live?${params}`);
      const body = await response.json();
      if (!response.ok) throw new Error(body.detail || 'Unable to generate forecast');
      setData(body);
    } catch (e) { setError(e.message); setData(null); } finally { setLoading(false); }
  };
  useEffect(() => { load(); }, []);
  return <main style={{ padding: 24 }}><h1><TrendingUp /> Demand forecasting & dayparts</h1>
    <p>Forecast order counts from a trained, versioned model. Future results are estimates.</p>
    <form onSubmit={event => { event.preventDefault(); load(); }} style={{ display: 'flex', flexWrap: 'wrap', gap: 16 }}>
      <label>Location <select value={location} onChange={e => setLocation(e.target.value)}><option value="">All locations</option>{data?.locations.map(id => <option key={id}>{id}</option>)}</select></label>
      <label>Horizon (days) <input type="number" min="1" max="90" value={horizon} onChange={e => setHorizon(e.target.value)} required /></label>
      <button disabled={loading}><RefreshCw size={16} /> {loading ? 'Generating…' : 'Generate forecast'}</button>
    </form>
    {error && <p role="alert">{error}</p>}
    {!loading && !data && !error && <p>No forecast available.</p>}
    {data && <>
      <LineChart title="Observed demand and future forecast" subtitle="Last 90 observed days followed by the selected horizon. Dashed line represents estimates, not an uncertainty interval." unit="orders" data={[...data.history.map(r=>({label:r.order_date.slice(0,10),actual:r.label})),...data.forecast.map(r=>({label:r.date,forecast:r.predicted_orders}))]} series={[{key:'actual',label:'Observed',color:'#38bdf8'},{key:'forecast',label:'Forecast',color:'#a78bfa',dashed:true}]} />
      <div style={chartGrid}>
        <BarChart title="Orders by daypart" subtitle="Observed records at the selected location scope" unit="orders" data={data.dayparts.map(r=>({label:r.name,value:r.orders}))}/>
        <BarChart title="Forecast error against seasonal baseline" subtitle="Holdout RMSE · lower is better · all locations" unit="orders" data={[{label:data.model,value:data.evaluation.rmse,color:'#34d399'},{label:'Seasonal lag-7 baseline',value:data.baseline_evaluation.rmse,color:'#94a3b8'}]}/>
      </div>
      <section className="glass-card" style={{ padding: 20, marginTop: 20 }}><h2>Measured evaluation</h2>
        <p>Model: {data.model} · Version: {data.version}</p>
        <p>Training before {data.split.validation_start}; validation before {data.split.test_start}; test from {data.split.test_start}.</p>
        <p>MAE {formatNumber(data.evaluation.mae)} · RMSE {formatNumber(data.evaluation.rmse)} · R² {formatNumber(data.evaluation.r2)} · Seasonal baseline RMSE {formatNumber(data.baseline_evaluation.rmse)}</p>
        <p>{data.evaluation_scope}</p>
      </section>
      <section className="glass-card" style={{ padding: 20, marginTop: 20 }}><h2>Daypart patterns</h2><ul>{data.dayparts.map(part => <li key={part.name}>{part.name}: {formatNumber(part.orders)} orders · {part.boundary}</li>)}</ul></section>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: 20, marginTop: 20 }}>
        <section className="glass-card" style={{ padding: 20, maxHeight: 450, overflow: 'auto' }}><h2>Historical demand (last 90 days)</h2><table><thead><tr><th>Date</th><th>Actual orders</th></tr></thead><tbody>{data.history.map(row => <tr key={row.order_date}><td>{row.order_date.slice(0,10)}</td><td>{formatNumber(row.label)}</td></tr>)}</tbody></table></section>
        <section className="glass-card" style={{ padding: 20, maxHeight: 450, overflow: 'auto' }}><h2>Future estimates</h2><table><thead><tr><th>Date</th><th>Estimated orders</th></tr></thead><tbody>{data.forecast.map(row => <tr key={row.date}><td>{row.date}</td><td>{formatNumber(row.predicted_orders)}</td></tr>)}</tbody></table></section>
      </div>
      <details style={{ marginTop: 20 }}><summary>Assumptions and limitations</summary><ul>{data.assumptions.map(text => <li key={text}>{text}</li>)}</ul></details>
    </>}
  </main>;
}

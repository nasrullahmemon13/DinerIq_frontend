import { BarChart, LineChart, chartGrid } from '../components/AnalyticsCharts';
import React, { useEffect, useState } from 'react';
import { Cpu, RefreshCw, AlertTriangle } from 'lucide-react';
import { formatNumber } from '../utils/formatNumber';
import { downloadFile } from '../utils/download';
import { useAuth } from '../context/AuthContext';

export default function VerifiedModelsPage() {
  const { user } = useAuth();
  const [actionStatus, setActionStatus] = useState('');
  const [runs, setRuns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [records, setRecords] = useState(null);
  const [pending, setPending] = useState(false);
  const load = async () => {
    setLoading(true); setError('');
    try {
      const response = await fetch('/api/v1/verified-models');
      if (!response.ok) throw new Error(`Unable to load model runs (${response.status})`);
      setRuns((await response.json()).runs);
    } catch (e) { setError(e.message); } finally { setLoading(false); }
  };
  useEffect(() => { load(); }, []);
  const modelAction = async (run, engine, action) => {
    setPending(true); setActionStatus('');
    try {
      if (action === 'download') {
        await downloadFile(`/api/v1/verified-models/${run}/artifact/${engine}`, `${run}-${engine}`);
        setActionStatus('Model artifact download ready.');
      } else {
        const response = await fetch(`/api/v1/verified-models/${run}/activate`, {
          method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ engine }),
        });
        const body = await response.json();
        if (!response.ok) throw new Error(body.detail || 'Activation failed');
        setActionStatus(`Active forecast model: ${engine}, version ${run}. Select an earlier version to roll back.`);
      }
    } catch (e) { setActionStatus(e.message); } finally { setPending(false); }
  };
  const compare = async (id) => {
    setPending(true); setError(''); setRecords(null);
    try {
      const response = await fetch(`/api/v1/verified-models/${id}/comparison`);
      if (!response.ok) throw new Error('Comparison unavailable for this run');
      setRecords(await response.json());
    } catch (e) { setError(e.message); } finally { setPending(false); }
  };
  const latest = runs.find(run=>run.status === 'completed');
  return <main style={{ padding: 24 }}>
    <h1><Cpu size={24} /> Model runs & independent comparison</h1>
    <p>Chronological validation selects each model. Test metrics measure later unseen dates.</p>
    <button onClick={load} disabled={loading}><RefreshCw size={16} /> Refresh</button>
    {error && <p role="alert"><AlertTriangle size={16} /> {error}</p>}
    {actionStatus && <p role="status">{actionStatus}</p>}
    {loading && <p role="status">Loading measured runs…</p>}
    {!loading && !runs.length && <p>No training runs recorded yet.</p>}
    {latest && <div style={chartGrid}>
      <BarChart title="Independent model test error" subtitle={`Latest completed run · ${latest.run_id} · RMSE, lower is better`} unit="orders" data={[...Object.entries(latest.engines).map(([name,e])=>({label:name,value:e.test?.rmse})),{label:'Seasonal baseline',value:latest.engines.python?.baseline_test?.rmse,color:'#94a3b8'}]}/>
      <BarChart title="Independent prediction agreement" subtitle="Common holdout records · match tolerance: one order" unit="records" data={[{label:'Within tolerance',value:latest.comparison.records-latest.comparison.mismatches,color:'#34d399'},{label:'Outside tolerance',value:latest.comparison.mismatches,color:'#fb7185'}]}/>
    </div>}
    {runs.map(run => <section key={run.run_id} className="glass-card" style={{ padding: 20, marginTop: 20 }}>
      <h2>{run.task || 'Training run'} — {run.status}</h2>
      <p>Version: {run.run_id} · Created: {run.created_at || 'Unavailable'}</p>
      <details><summary>Dataset, split and assumptions</summary>
        <p style={{ overflowWrap: 'anywhere' }}>Dataset SHA-256: {run.dataset_sha256}</p>
        <p>Validation starts {run.split?.validation_start}; test starts {run.split?.test_start}. Training uses earlier dates.</p>
        <p>Features: {run.features?.join(', ')}</p>
        <ul>{run.assumptions?.map(text => <li key={text}>{text}</li>)}</ul>
      </details>
      {Object.entries(run.engines).map(([name, engine]) => <div key={name}>
        <h3>{name} — {engine.status}</h3>
        {engine.error && <pre style={{ whiteSpace: 'pre-wrap', maxHeight: 150, overflow: 'auto' }}>{engine.error}</pre>}
        {engine.status === 'completed' && <>
          {engine.artifact_error && <p role="status">Model artifact save failed: Windows Hadoop support is not configured. Predictions and metrics are available; activation is unavailable.</p>}
          <p>Selected: {engine.champion} · Artifact: {engine.artifact_available ? 'Available' : 'Unavailable'}</p>
          <button disabled={pending || !engine.artifact_available} onClick={() => modelAction(run.run_id, name, 'download')}>Download model</button>
          {user?.role_id === 'admin' && <button disabled={pending || !engine.artifact_available} onClick={() => modelAction(run.run_id, name, 'activate')}>Use this version for forecasts</button>}
          <p>Test RMSE: {formatNumber(engine.test?.rmse)} · MAE: {formatNumber(engine.test?.mae)} · R²: {formatNumber(engine.test?.r2)} · Seasonal baseline RMSE: {formatNumber(engine.baseline_test?.rmse)}</p>
          <div style={{ overflowX: 'auto' }}><table style={{ width: '100%' }}><caption>Validation results</caption><thead><tr><th>Algorithm</th><th>RMSE</th><th>Runtime (seconds)</th></tr></thead><tbody>
            {engine.models?.map(model => <tr key={model.model_name}><td>{model.model_name}<details><summary>Parameters</summary><pre>{JSON.stringify(model.parameters, null, 2)}</pre></details></td><td>{formatNumber(model.validation.rmse)}</td><td>{formatNumber(model.runtime_seconds)}</td></tr>)}
          </tbody></table></div>
        </>}
      </div>)}
      {run.comparison && <p>Agreement within one order: {formatNumber(run.comparison.agreement_pct)}% · {run.comparison.mismatches} mismatches / {run.comparison.records} records</p>}
      <button disabled={!run.comparison || pending} onClick={() => compare(run.run_id)}>{pending ? 'Loading…' : 'Inspect comparison records'}</button>
    </section>)}
    {records && <LineChart title="Holdout predictions and observed demand" subtitle="First 30 comparison records in API record order; locations may differ." unit="orders" data={records.slice(0,30).map(r=>({label:r.record_id,actual:r.label_spark,spark:r.prediction_spark,python:r.prediction_python}))} series={[{key:'actual',label:'Observed',color:'#94a3b8'},{key:'spark',label:'Spark',color:'#38bdf8'},{key:'python',label:'Python',color:'#a78bfa',dashed:true}]}/>}
    {records && <section className="glass-card" style={{ padding: 20, overflowX: 'auto' }}><h2>Independent holdout predictions (first 100)</h2><table><thead><tr><th>Record</th><th>Actual orders</th><th>Spark</th><th>Python</th><th>Difference</th><th>Match</th></tr></thead><tbody>{records.map(row => <tr key={row.record_id}><td>{row.record_id}</td><td>{row.label_spark}</td><td>{formatNumber(row.prediction_spark)}</td><td>{formatNumber(row.prediction_python)}</td><td>{formatNumber(row.difference)}</td><td>{row.match ? 'Yes' : 'No'}</td></tr>)}</tbody></table></section>}
  </main>;
}

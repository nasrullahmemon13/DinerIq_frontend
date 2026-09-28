import React, { useState } from 'react';

export default function PipelinePreview({ runId }) {
  const [dataset, setDataset] = useState('orders');
  const [stage, setStage] = useState('raw');
  const [data, setData] = useState(null);
  const [status, setStatus] = useState('');
  const load = async (offset = 0) => {
    setStatus('Loading preview…');
    try {
      const response = await fetch(`/api/v1/data-pipeline/runs/${encodeURIComponent(runId)}/preview/${dataset}?stage=${stage}&offset=${offset}`);
      const result = await response.json();
      if (!response.ok) throw new Error(result.detail || 'Preview unavailable');
      setData(result); setStatus(`${result.total_records} records · ${result.stage}`);
    } catch (error) { setData(null); setStatus(error.message); }
  };
  return <section style={{margin:'20px 0',padding:20,background:'var(--surface)',borderRadius:12}}>
    <h3>Raw and cleaned data preview</h3>
    <p>Inspect staged records. Previewing does not change uploaded files.</p>
    <select aria-label="Preview dataset" value={dataset} onChange={e=>{setDataset(e.target.value);setData(null);}}>
      {['orders','order_items','customers','menu_items','menu_categories','restaurants','ratings','promotions','pricing_history','inventory','wastage'].map(name=><option key={name}>{name}</option>)}
    </select>{' '}
    <select aria-label="Data stage" value={stage} onChange={e=>{setStage(e.target.value);setData(null);}}><option value="raw">Raw</option><option value="cleaned">Cleaned</option></select>{' '}
    <button onClick={()=>load()}>Load / retry preview</button>
    <p role="status">{status}</p>
    {data && <><div style={{overflowX:'auto',maxHeight:350}}><table><thead><tr>{data.columns.map(c=><th key={c}>{c}</th>)}</tr></thead><tbody>{data.rows.map((row,i)=><tr key={i}>{data.columns.map(c=><td key={c} style={{padding:6,whiteSpace:'nowrap'}}>{row[c] == null ? 'NULL' : String(row[c])}</td>)}</tr>)}</tbody></table></div>
    <button disabled={!data.offset} onClick={()=>load(Math.max(0,data.offset-25))}>Previous</button>{' '}
    <button disabled={data.offset+25>=data.total_records} onClick={()=>load(data.offset+25)}>Next</button></>}
  </section>;
}

import React, { useId, useState } from 'react';
import { formatNumber } from '../utils/formatNumber';

const colors = ['var(--primary)', 'var(--purple)', 'var(--success)', 'var(--warning)', 'var(--danger)'];
const finite = value => typeof value === 'number' && Number.isFinite(value);
const card = { padding: 20, border: '1px solid var(--border)', borderRadius: 14, background: 'var(--surface)', minWidth: 0 };
export const chartGrid = { display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(100%,340px),1fr))', gap: 18, margin: '20px 0' };

export function MenuScatter({ data = [] }) {
  const points = data.filter(r=>finite(r.quantity_sold) && finite(r.margin_pct));
  const maxX = Math.max(1,...points.map(r=>r.quantity_sold));
  const minY = Math.min(0,...points.map(r=>r.margin_pct));
  const maxY = Math.max(1,...points.map(r=>r.margin_pct));
  const y = v=>225-(v-minY)/(maxY-minY)*190;
  if (!points.length) return <p>No measured sales and margin values available.</p>;
  return <div style={{overflowX:'auto'}}><svg viewBox="0 0 760 285" role="img" aria-label="Menu items: units sold horizontally, margin percentage vertically, including losses" style={{width:'100%',minWidth:480}}>
    {[0,1,2,3,4].map(t=>{const value=minY+(maxY-minY)*t/4;return <g key={t}><line x1="65" x2="720" y1={y(value)} y2={y(value)} stroke="var(--border, #334155)"/><text x="55" y={y(value)+4} textAnchor="end" fill="var(--text-muted, #94a3b8)" fontSize="11">{value.toFixed(1)}%</text><text x={65+t/4*655} y="245" textAnchor="middle" fill="var(--text-muted, #94a3b8)" fontSize="11">{Math.round(maxX*t/4)}</text></g>;})}
    <line x1="65" x2="720" y1={y(0)} y2={y(0)} stroke="#94a3b8" strokeDasharray="5 4"/>
    {points.map((p,i)=><circle key={p.item_id || i} cx={65+p.quantity_sold/maxX*655} cy={y(p.margin_pct)} r="4.5" fill={p.color||colors[0]} opacity="0.85" tabIndex="0" aria-label={`${p.item_name}: ${p.quantity_sold} units; ${p.margin_pct}% margin`}><title>{`${p.item_name}: ${p.quantity_sold} units; ${p.margin_pct}% margin`}</title></circle>)}
    <text x="380" y="277" textAnchor="middle" fill="var(--text-muted, #94a3b8)" fontSize="12">Units sold · {points.length} items</text>
  </svg></div>;
}

export function BarChart({ title, subtitle, data = [], unit = '', color = colors[0] }) {
  const id = useId();
  const rows = data.filter(row => finite(row.value));
  const minimum = Math.min(0, ...rows.map(r => r.value));
  const maximum = Math.max(0, ...rows.map(r => r.value));
  const span = maximum - minimum || 1;
  const zero = -minimum / span * 100;
  return <section style={card} aria-labelledby={id}>
    <h3 id={id} style={{margin:'0 0 6px',fontSize:16}}>{title}</h3>
    {subtitle && <p style={{color:'var(--text-muted)',fontSize:12,margin:'0 0 18px'}}>{subtitle}</p>}
    {!rows.length ? <p>No measured values available.</p> : <div style={{display:'grid',gap:14}}>
      {rows.map((row,index)=><div key={`${row.label}-${index}`}>
        <div style={{display:'flex',justifyContent:'space-between',gap:12,fontSize:12,marginBottom:6}}><span style={{overflowWrap:'anywhere'}}>{row.label}</span><strong style={{whiteSpace:'nowrap'}}>{formatNumber(row.value)} {unit}</strong></div>
        <div role="img" aria-label={`${row.label}: ${row.value} ${unit}`} style={{position:'relative',height:12,background:'var(--surface-secondary, #172333)',borderRadius:4}}>
          <div style={{position:'absolute',left:`${Math.min(zero,(row.value-minimum)/span*100)}%`,width:`${Math.abs(row.value)/span*100}%`,height:'100%',borderRadius:3,background:row.color || color}} />
          {minimum < 0 && <span style={{position:'absolute',left:`${zero}%`,height:16,top:-2,borderLeft:'1px solid var(--text-muted)'}} />}
        </div>
      </div>)}
      <p style={{fontSize:11,color:'var(--text-muted)',margin:0}}>Shared scale: {formatNumber(minimum)}–{formatNumber(maximum)} {unit}. Zero values have no filled bar.</p>
    </div>}
  </section>;
}

export function LineChart({ title, subtitle, data = [], series = [], unit = '' }) {
  const id = useId();
  const [active, setActive] = useState(null);
  const values = data.flatMap(row=>series.map(s=>row[s.key])).filter(finite);
  const min = Math.min(0,...values), max = Math.max(1,...values), span = max-min || 1;
  const x = index => 65 + (data.length > 1 ? index/(data.length-1) : 0.5)*650;
  const y = value => 240-(value-min)/span*205;
  const paths = key => {
    let penDown = false;
    return data.map((row,i)=>{
      if (!finite(row[key])) { penDown=false; return ''; }
      const segment = `${penDown?'L':'M'}${x(i)},${y(row[key])}`;
      penDown=true; return segment;
    }).join(' ');
  };
  return <section style={card} aria-labelledby={id}>
    <h3 id={id} style={{margin:'0 0 6px',fontSize:16}}>{title}</h3>
    {subtitle && <p style={{fontSize:12,color:'var(--text-muted)'}}>{subtitle}</p>}
    {!values.length ? <p>No measured values available.</p> : <>
      <div style={{display:'flex',gap:18,flexWrap:'wrap',fontSize:12}}>{series.map((s,i)=><span key={s.key} style={{color:s.color||colors[i%colors.length]}}>{s.dashed?'┄':'━'} {s.label}</span>)}</div>
      <svg viewBox="0 0 750 290" role="img" aria-label={`${title}, ${unit}; exact values in the table below`} style={{display:'block',width:'100%',minHeight:200}}>
        {[0,1,2,3,4].map(t=>{const v=min+span*t/4;return <g key={t}><line x1="65" x2="715" y1={y(v)} y2={y(v)} stroke="var(--border, #26354a)"/><text x="55" y={y(v)+4} textAnchor="end" fill="var(--text-muted, #94a3b8)" fontSize="10">{formatNumber(v,undefined,{maximumFractionDigits:1})}</text></g>;})}
        {[...new Set([0,Math.floor((data.length-1)/2),data.length-1])].map(i=><text key={i} x={x(i)} y="265" textAnchor={i===0?'start':i===data.length-1?'end':'middle'} fill="var(--text-muted, #94a3b8)" fontSize="10">{data[i]?.label}</text>)}
        {series.map((s,k)=><g key={s.key}><path d={paths(s.key)} fill="none" stroke={s.color||colors[k%colors.length]} strokeWidth="2.5" strokeDasharray={s.dashed?'6 4':undefined}/>{data.map((row,i)=>finite(row[s.key]) && <circle key={i} cx={x(i)} cy={y(row[s.key])} r="3" fill={s.color||colors[k%colors.length]} tabIndex="0" aria-label={`${row.label}, ${s.label}: ${row[s.key]} ${unit}`} onFocus={()=>setActive(i)} onMouseEnter={()=>setActive(i)}><title>{`${row.label}: ${formatNumber(row[s.key])} ${unit}`}</title></circle>)}</g>)}
      </svg>
      <p role="status" style={{fontSize:12,minHeight:18}}>{active != null && data[active] ? `${data[active].label} · ${series.map(s=>`${s.label}: ${formatNumber(data[active][s.key])}`).join(' · ')}` : 'Hover or focus a point to inspect its value.'}</p>
      <details><summary>View exact chart values</summary><div style={{overflow:'auto',maxHeight:260}}><table style={{width:'100%',textAlign:'left'}}><thead><tr><th>Date / record</th>{series.map(s=><th key={s.key}>{s.label} ({unit})</th>)}</tr></thead><tbody>{data.map((r,i)=><tr key={i}><td>{r.label}</td>{series.map(s=><td key={s.key}>{formatNumber(r[s.key])}</td>)}</tr>)}</tbody></table></div></details>
    </>}
  </section>;
}

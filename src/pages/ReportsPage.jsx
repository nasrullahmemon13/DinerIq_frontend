import { BarChart } from '../components/AnalyticsCharts';
import { downloadFile } from '../utils/download';
import React, { useState, useEffect } from 'react';
import {
  FileText,
  Download,
  FileSpreadsheet,
  Layers,
  CheckCircle2,
  RefreshCw,
  Search,
  Filter,
  ArrowDownToLine,
  Lock
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function ReportsPage() {
  const { user } = useAuth();
  const [downloadStatus, setDownloadStatus] = useState('');
  const [scope, setScope] = useState({location_id:'',category_id:'',item_id:''});
  const [reports, setReports] = useState([]);
  const [datasets, setDatasets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('dossiers');

  const fetchCatalog = async () => {
    setLoading(true);
    try {
      const [resRep, resExp] = await Promise.all([
        fetch('/api/v1/reports'),
        fetch('/api/v1/export/datasets')
      ]);
      if (!resRep.ok || !resExp.ok) throw new Error('Unable to load report catalog; check session and retry.');
      if (resRep.ok) {
        const jR = await resRep.json();
        setReports(jR.reports || []);
      }
      if (resExp.ok) {
        const jE = await resExp.json();
        setDatasets(jE.datasets || []);
      }
    } catch (err) {
      setDownloadStatus(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCatalog();
  }, []);

  const download = async (url, filename) => {
    setDownloadStatus('Downloading…');
    try { await downloadFile(url, filename); setDownloadStatus('Download ready.'); }
    catch (error) { setDownloadStatus(error.message); }
  };
  const handleDownloadReport = key => download(`/api/v1/reports/${key}/download`, `${key}.md`);
  const handleExportData = (key, format) => {
    const query = new URLSearchParams({format, ...Object.fromEntries(Object.entries(scope).filter(([,v])=>v.trim()))});
    return download(`/api/v1/export/${key}?${query}`, `${key}.${format === 'csv' ? 'csv' : 'xlsx'}`);
  };

  return (
    <div style={{ padding: '24px 32px 48px', maxWidth: '1600px', margin: '0 auto' }}>
      {downloadStatus && <p role="status">{downloadStatus}</p>}
      {activeTab === 'exports' && <fieldset style={{padding:16,marginBottom:16}}><legend>Export scope</legend>
        {Object.entries(scope).map(([key,value])=><label key={key} style={{marginRight:12}}>{key.replaceAll('_',' ')} <input value={value} placeholder="All" onChange={e=>setScope({...scope,[key]:e.target.value})} /></label>)}
        <p>Blank fields export all records. Unsupported filters return an error instead of an unfiltered download.</p>
      </fieldset>}
      {!loading && activeTab === 'exports' && <BarChart title="Available export dataset sizes" subtitle="All rows in each stored source; selected export filters are applied when downloading. Aliases may refer to the same source." unit="rows" data={datasets.filter(d=>d.is_available).map(d=>({label:d.name,value:d.record_count}))}/>}
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
            Business Reports & Data Export Center
          </h1>
          <p style={{ fontSize: '14px', color: 'var(--text-muted)' }}>
            12 downloadable analytical dossiers and enterprise CSV/Excel dataset exports.
          </p>
        </div>

        <button
          onClick={fetchCatalog}
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
          <span>Refresh Catalog</span>
        </button>
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
          onClick={() => setActiveTab('dossiers')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 18px',
            borderRadius: '8px 8px 0 0',
            border: 'none',
            borderBottom: activeTab === 'dossiers' ? '2px solid #6366f1' : '2px solid transparent',
            background: activeTab === 'dossiers' ? 'rgba(99, 102, 241, 0.08)' : 'transparent',
            color: activeTab === 'dossiers' ? '#6366f1' : 'var(--text-secondary)',
            fontWeight: activeTab === 'dossiers' ? 600 : 500,
            fontSize: '14px',
            cursor: 'pointer'
          }}
        >
          <FileText size={16} />
          <span>12 Downloadable Reports</span>
        </button>

        <button
          onClick={() => setActiveTab('exports')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 18px',
            borderRadius: '8px 8px 0 0',
            border: 'none',
            borderBottom: activeTab === 'exports' ? '2px solid #6366f1' : '2px solid transparent',
            background: activeTab === 'exports' ? 'rgba(99, 102, 241, 0.08)' : 'transparent',
            color: activeTab === 'exports' ? '#6366f1' : 'var(--text-secondary)',
            fontWeight: activeTab === 'exports' ? 600 : 500,
            fontSize: '14px',
            cursor: 'pointer'
          }}
        >
          <FileSpreadsheet size={16} />
          <span>Dataset Exports (CSV / Excel)</span>
        </button>
      </div>

      {                                                                }
      {activeTab === 'dossiers' && (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))',
            gap: '20px'
          }}
        >
          {reports.map((rep) => (
            <div
              key={rep.key}
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
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                  <FileText size={18} color="#6366f1" />
                  <h3 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>
                    {rep.title}
                  </h3>
                </div>

                <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.5', marginBottom: '14px' }}>
                  {rep.description}
                </p>

                <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                  Format: <strong>Formatted Markdown Dossier</strong>
                </div>
              </div>

              <div style={{ borderTop: '1px solid var(--border)', marginTop: '16px', paddingTop: '14px' }}>
                <button
                  onClick={() => handleDownloadReport(rep.key)}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    padding: '9px',
                    borderRadius: '8px',
                    background: 'rgba(99, 102, 241, 0.1)',
                    color: '#6366f1',
                    border: '1px solid rgba(99, 102, 241, 0.2)',
                    fontSize: '13px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <ArrowDownToLine size={15} />
                  <span>Download Dossier</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {                                                                }
      {activeTab === 'exports' && (
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '12px', overflow: 'hidden' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
              <thead>
                <tr style={{ background: 'var(--bg-subtle, rgba(0,0,0,0.02))', borderBottom: '1px solid var(--border)' }}>
                  <th style={{ padding: '14px 20px', fontWeight: 600, color: 'var(--text-muted)' }}>Dataset Key</th>
                  <th style={{ padding: '14px 20px', fontWeight: 600, color: 'var(--text-muted)' }}>Dataset Description</th>
                  <th style={{ padding: '14px 20px', fontWeight: 600, color: 'var(--text-muted)' }}>Required Role</th>
                  <th style={{ padding: '14px 20px', fontWeight: 600, color: 'var(--text-muted)', textAlign: 'right' }}>Direct Export Actions</th>
                </tr>
              </thead>
              <tbody>
                {datasets.map((d) => (
                  <tr key={d.dataset_key} style={{ borderBottom: '1px solid var(--border)' }}>
                    <td style={{ padding: '16px 20px', fontFamily: 'monospace', fontWeight: 600, color: '#6366f1' }}>
                      {d.dataset_key}
                    </td>
                    <td style={{ padding: '16px 20px', fontWeight: 600, color: 'var(--text-primary)' }}>
                      {d.name}
                    </td>
                    <td style={{ padding: '16px 20px', color: 'var(--text-muted)' }}>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '11px', background: 'rgba(148, 163, 184, 0.12)', padding: '2px 8px', borderRadius: '4px' }}>
                        <Lock size={12} /> {d.required_role || 'Analyst / Admin'}
                      </span>
                    </td>
                    <td style={{ padding: '16px 20px', textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '8px' }}>
                        <button
                          onClick={() => handleExportData(d.dataset_key, 'csv')}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                            padding: '6px 12px',
                            borderRadius: '6px',
                            background: 'var(--surface)',
                            border: '1px solid var(--border)',
                            color: 'var(--text-primary)',
                            fontSize: '12px',
                            fontWeight: 600,
                            cursor: 'pointer'
                          }}
                        >
                          <Download size={13} /> CSV
                        </button>
                        <button
                          onClick={() => handleExportData(d.dataset_key, 'excel')}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                            padding: '6px 12px',
                            borderRadius: '6px',
                            background: 'rgba(16, 185, 129, 0.1)',
                            border: '1px solid rgba(16, 185, 129, 0.2)',
                            color: '#10b981',
                            fontSize: '12px',
                            fontWeight: 600,
                            cursor: 'pointer'
                          }}
                        >
                          <FileSpreadsheet size={13} /> Excel
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

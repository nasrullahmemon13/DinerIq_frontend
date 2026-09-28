import { BarChart, chartGrid } from '../components/AnalyticsCharts';
import { formatNumber } from '../utils/formatNumber';
import React, { useState, useEffect } from 'react';
import useDashboardFeeds from '../hooks/useDashboardFeeds';
import {
  Database,
  CheckCircle2,
  AlertTriangle,
  GitMerge,
  Cpu,
  RefreshCw,
  Search,
  Filter,
  Layers,
  Sparkles,
  ShieldCheck,
  FileCode,
  HardDrive
} from 'lucide-react';

export default function DataGovernancePage({ initialTab = 'overview' }) {
  const [activeTab, setActiveTab] = useState(initialTab);
  useEffect(() => { setActiveTab(initialTab); }, [initialTab]);
  const { data, errors, loading, refresh: fetchAllData } = useDashboardFeeds({
    overview: '/api/v1/data-governance/ingestion-overview',
    quality: '/api/v1/data-governance/quality-profile',
    cleaning: '/api/v1/data-governance/quarantine-manifest',
    integration: '/api/v1/data-governance/integration-joins',
    features: '/api/v1/data-governance/engineered-features',
    spark: '/api/v1/data-governance/spark-cluster',
  });
  const { overview: ingestion, quality, cleaning: quarantine, integration: joins, features, spark } = data;
  const error = errors[activeTab];

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
            Big Data Governance & Pipeline Architecture
          </h1>
          <p style={{ fontSize: '14px', color: 'var(--text-muted)' }}>
            Dataset inventory, measured quality checks, join diagnostics, and feature artifacts.
          </p>
        </div>

        <button
          onClick={fetchAllData}
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
          <span>Refresh Governance</span>
        </button>
      </div>

      {loading && <p role="status">Loading measured pipeline evidence…</p>}
      {Object.entries(errors).map(([section, message]) => <p role="alert" key={section} style={{ color: 'var(--danger, #ef4444)' }}>{section}: {message}. Use Refresh Governance to retry.</p>)}
      {!loading && !error && <div style={chartGrid}>
        {activeTab === 'overview' && <BarChart title="Stored records by dataset" subtitle="Measured Parquet row counts; shared linear scale" unit="rows" data={(ingestion?.tables || []).map(t=>({label:t.name,value:t.records}))}/>}
        {activeTab === 'quality' && <BarChart title="Checks with the most flagged values" subtitle="Top 10 checks; nullable fields may be valid. Counts can overlap and are not unique affected rows." unit="flags" color="#fbbf24" data={(quality?.checks || []).filter(c=>c.anomalies_detected>0).sort((a,b)=>b.anomalies_detected-a.anomalies_detected).slice(0,10).map(c=>({label:c.name,value:c.anomalies_detected}))}/>}
        {activeTab === 'integration' && <BarChart title="Unmatched source records by join" subtitle="Cardinality diagnostics; assess optional relationships separately" unit="rows" color="#fb7185" data={(joins?.joins || []).map(j=>({label:`${j.primary_table} → ${j.joined_table}`,value:j.unmatched_rows}))}/>}
      </div>}
      {                                                               }
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '16px',
          marginBottom: '28px'
        }}
      >
        {                               }
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '12px', padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '46px', height: '46px', borderRadius: '10px', background: 'rgba(99, 102, 241, 0.1)', color: '#6366f1', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Database size={22} />
          </div>
          <div>
            <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Ingested Volume</div>
            <div style={{ fontSize: '24px', fontWeight: 700, color: 'var(--text-primary)', marginTop: '2px' }}>
              {formatNumber(ingestion?.summary?.total_records)}
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Across {ingestion?.summary?.total_tables ?? '…'} measured tables</div>
          </div>
        </div>

        {                            }
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '12px', padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '46px', height: '46px', borderRadius: '10px', background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ShieldCheck size={22} />
          </div>
          <div>
            <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Data Quality</div>
            <div style={{ fontSize: '24px', fontWeight: 700, color: '#10b981', marginTop: '2px' }}>
              {quality ? `${quality.summary.passed_rules} / ${quality.summary.total_rules_evaluated}` : loading ? '…' : 'Unavailable'}
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Checks passed; nullable fields may be valid</div>
          </div>
        </div>

        {                                 }
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '12px', padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '46px', height: '46px', borderRadius: '10px', background: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Sparkles size={22} />
          </div>
          <div>
            <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Engineered Features</div>
            <div style={{ fontSize: '24px', fontWeight: 700, color: 'var(--text-primary)', marginTop: '2px' }}>
              {features?.available_features ?? (loading ? '…' : 'Unavailable')} Features
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Full Step 7 Specification</div>
          </div>
        </div>

        {                                 }
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '12px', padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '46px', height: '46px', borderRadius: '10px', background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <AlertTriangle size={22} />
          </div>
          <div>
            <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Quarantined Records</div>
            <div style={{ fontSize: '24px', fontWeight: 700, color: '#ef4444', marginTop: '2px' }}>
              {formatNumber(quarantine?.total_quarantined_records)}
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Preserved for auditability</div>
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
          paddingBottom: '2px',
          overflowX: 'auto'
        }}
      >
        <button
          onClick={() => setActiveTab('overview')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 18px',
            borderRadius: '8px 8px 0 0',
            border: 'none',
            borderBottom: activeTab === 'overview' ? '2px solid #6366f1' : '2px solid transparent',
            background: activeTab === 'overview' ? 'rgba(99, 102, 241, 0.08)' : 'transparent',
            color: activeTab === 'overview' ? '#6366f1' : 'var(--text-secondary)',
            fontWeight: activeTab === 'overview' ? 600 : 500,
            fontSize: '13.5px',
            cursor: 'pointer',
            whiteSpace: 'nowrap'
          }}
        >
          <Database size={15} />
          <span>Ingestion & Parquet Tables</span>
        </button>

        <button
          onClick={() => setActiveTab('quality')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 18px',
            borderRadius: '8px 8px 0 0',
            border: 'none',
            borderBottom: activeTab === 'quality' ? '2px solid #6366f1' : '2px solid transparent',
            background: activeTab === 'quality' ? 'rgba(99, 102, 241, 0.08)' : 'transparent',
            color: activeTab === 'quality' ? '#6366f1' : 'var(--text-secondary)',
            fontWeight: activeTab === 'quality' ? 600 : 500,
            fontSize: '13.5px',
            cursor: 'pointer',
            whiteSpace: 'nowrap'
          }}
        >
          <ShieldCheck size={15} />
          <span>Quality Profiling ({quality?.checks?.length ?? '…'} Checks)</span>
        </button>

        <button
          onClick={() => setActiveTab('cleaning')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 18px',
            borderRadius: '8px 8px 0 0',
            border: 'none',
            borderBottom: activeTab === 'cleaning' ? '2px solid #6366f1' : '2px solid transparent',
            background: activeTab === 'cleaning' ? 'rgba(99, 102, 241, 0.08)' : 'transparent',
            color: activeTab === 'cleaning' ? '#6366f1' : 'var(--text-secondary)',
            fontWeight: activeTab === 'cleaning' ? 600 : 500,
            fontSize: '13.5px',
            cursor: 'pointer',
            whiteSpace: 'nowrap'
          }}
        >
          <AlertTriangle size={15} />
          <span>Cleaning & Quarantine Engine</span>
        </button>

        <button
          onClick={() => setActiveTab('integration')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 18px',
            borderRadius: '8px 8px 0 0',
            border: 'none',
            borderBottom: activeTab === 'integration' ? '2px solid #6366f1' : '2px solid transparent',
            background: activeTab === 'integration' ? 'rgba(99, 102, 241, 0.08)' : 'transparent',
            color: activeTab === 'integration' ? '#6366f1' : 'var(--text-secondary)',
            fontWeight: activeTab === 'integration' ? 600 : 500,
            fontSize: '13.5px',
            cursor: 'pointer',
            whiteSpace: 'nowrap'
          }}
        >
          <GitMerge size={15} />
          <span>Integration & Joins (Step 6)</span>
        </button>

        <button
          onClick={() => setActiveTab('features')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 18px',
            borderRadius: '8px 8px 0 0',
            border: 'none',
            borderBottom: activeTab === 'features' ? '2px solid #6366f1' : '2px solid transparent',
            background: activeTab === 'features' ? 'rgba(99, 102, 241, 0.08)' : 'transparent',
            color: activeTab === 'features' ? '#6366f1' : 'var(--text-secondary)',
            fontWeight: activeTab === 'features' ? 600 : 500,
            fontSize: '13.5px',
            cursor: 'pointer',
            whiteSpace: 'nowrap'
          }}
        >
          <Sparkles size={15} />
          <span>All 22 Engineered Features</span>
        </button>

        <button
          onClick={() => setActiveTab('spark')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 18px',
            borderRadius: '8px 8px 0 0',
            border: 'none',
            borderBottom: activeTab === 'spark' ? '2px solid #6366f1' : '2px solid transparent',
            background: activeTab === 'spark' ? 'rgba(99, 102, 241, 0.08)' : 'transparent',
            color: activeTab === 'spark' ? '#6366f1' : 'var(--text-secondary)',
            fontWeight: activeTab === 'spark' ? 600 : 500,
            fontSize: '13.5px',
            cursor: 'pointer',
            whiteSpace: 'nowrap'
          }}
        >
          <Cpu size={15} />
          <span>PySpark Jobs & Partitions</span>
        </button>
      </div>

      {                                                                }
      {activeTab === 'overview' && !errors.overview && (
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '12px', overflow: 'hidden', boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
              <thead>
                <tr style={{ background: 'var(--bg-subtle, rgba(0,0,0,0.02))', borderBottom: '1px solid var(--border)' }}>
                  <th style={{ padding: '14px 16px', fontWeight: 600, color: 'var(--text-muted)' }}>Table Name</th>
                  <th style={{ padding: '14px 16px', fontWeight: 600, color: 'var(--text-muted)' }}>Storage Format</th>
                  <th style={{ padding: '14px 16px', fontWeight: 600, color: 'var(--text-muted)' }}>Schema Mode</th>
                  <th style={{ padding: '14px 16px', fontWeight: 600, color: 'var(--text-muted)', textAlign: 'right' }}>Record Count</th>
                  <th style={{ padding: '14px 16px', fontWeight: 600, color: 'var(--text-muted)', textAlign: 'center' }}>Partitions</th>
                  <th style={{ padding: '14px 16px', fontWeight: 600, color: 'var(--text-muted)', textAlign: 'right' }}>Size (MB)</th>
                </tr>
              </thead>
              <tbody>
                {ingestion?.tables?.map((t) => (
                  <tr key={t.name} style={{ borderBottom: '1px solid var(--border)' }}>
                    <td style={{ padding: '14px 16px', fontWeight: 600, color: 'var(--text-primary)' }}>
                      {t.name}
                    </td>
                    <td style={{ padding: '14px 16px', color: '#6366f1', fontWeight: 500 }}>
                      {t.format} ({t.storage_type})
                    </td>
                    <td style={{ padding: '14px 16px', color: 'var(--text-secondary)' }}>
                      {t.schema_mode}
                    </td>
                    <td style={{ padding: '14px 16px', textAlign: 'right', fontWeight: 600, fontVariantNumeric: 'tabular-nums' }}>
                      {formatNumber(t?.records)}
                    </td>
                    <td style={{ padding: '14px 16px', textAlign: 'center' }}>
                      {t.partitions}
                    </td>
                    <td style={{ padding: '14px 16px', textAlign: 'right', fontVariantNumeric: 'tabular-nums', color: 'var(--text-muted)' }}>
                      {t.size_mb} MB
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {                                                                }
      {activeTab === 'quality' && !errors.quality && (
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '12px', overflow: 'hidden', boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
              <thead>
                <tr style={{ background: 'var(--bg-subtle, rgba(0,0,0,0.02))', borderBottom: '1px solid var(--border)' }}>
                  <th style={{ padding: '14px 16px', fontWeight: 600, color: 'var(--text-muted)' }}>Check ID</th>
                  <th style={{ padding: '14px 16px', fontWeight: 600, color: 'var(--text-muted)' }}>Data Quality Rule</th>
                  <th style={{ padding: '14px 16px', fontWeight: 600, color: 'var(--text-muted)' }}>Validation Condition</th>
                  <th style={{ padding: '14px 16px', fontWeight: 600, color: 'var(--text-muted)', textAlign: 'right' }}>Anomalies Caught</th>
                  <th style={{ padding: '14px 16px', fontWeight: 600, color: 'var(--text-muted)', textAlign: 'center' }}>Pass Rate</th>
                  <th style={{ padding: '14px 16px', fontWeight: 600, color: 'var(--text-muted)' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {quality?.checks?.map((chk) => (
                  <tr key={chk.check_id} style={{ borderBottom: '1px solid var(--border)' }}>
                    <td style={{ padding: '14px 16px', fontFamily: 'monospace', fontWeight: 600, color: '#6366f1' }}>
                      {chk.check_id}
                    </td>
                    <td style={{ padding: '14px 16px', fontWeight: 600, color: 'var(--text-primary)' }}>
                      {chk.name}
                    </td>
                    <td style={{ padding: '14px 16px', color: 'var(--text-secondary)' }}>
                      {chk.rule}
                    </td>
                    <td style={{ padding: '14px 16px', textAlign: 'right', fontVariantNumeric: 'tabular-nums', color: chk.anomalies_detected > 0 ? '#ef4444' : 'var(--text-muted)' }}>
                      {formatNumber(chk?.anomalies_detected)}
                    </td>
                    <td style={{ padding: '14px 16px', textAlign: 'center', fontWeight: 600 }}>
                      {formatNumber(chk.pass_rate_pct, 'en-US', { maximumFractionDigits: 2 })}{chk.pass_rate_pct != null ? '%' : ''}
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <span
                        style={{
                          padding: '3px 8px',
                          borderRadius: '4px',
                          fontSize: '11px',
                          fontWeight: 600,
                          background:
                            chk.status === 'Passed'
                              ? 'rgba(16, 185, 129, 0.12)'
                              : chk.status === 'Cleaned'
                              ? 'rgba(99, 102, 241, 0.12)'
                              : 'rgba(239, 68, 68, 0.12)',
                          color:
                            chk.status === 'Passed'
                              ? '#10b981'
                              : chk.status === 'Cleaned'
                              ? '#6366f1'
                              : '#ef4444'
                        }}
                      >
                        {chk.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {                                                                }
      {activeTab === 'cleaning' && !errors.cleaning && (
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '12px', overflow: 'hidden', boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h3 style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>
                Quarantine Audit Manifest (Step 5 / FR-vi)
              </h3>
              <p style={{ fontSize: '12.5px', color: 'var(--text-muted)', margin: '4px 0 0' }}>
                Recorded quarantine batches and their saved artifacts; current quality checks may detect additional issues.
              </p>
            </div>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
              Generated: {quarantine?.generated_at}
            </span>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
              <thead>
                <tr style={{ background: 'var(--bg-subtle, rgba(0,0,0,0.02))', borderBottom: '1px solid var(--border)' }}>
                  <th style={{ padding: '14px 16px', fontWeight: 600, color: 'var(--text-muted)' }}>Rule ID</th>
                  <th style={{ padding: '14px 16px', fontWeight: 600, color: 'var(--text-muted)' }}>Entity</th>
                  <th style={{ padding: '14px 16px', fontWeight: 600, color: 'var(--text-muted)' }}>Reason / Violation</th>
                  <th style={{ padding: '14px 16px', fontWeight: 600, color: 'var(--text-muted)', textAlign: 'right' }}>Records Quarantined</th>
                  <th style={{ padding: '14px 16px', fontWeight: 600, color: 'var(--text-muted)' }}>Artifact Path</th>
                </tr>
              </thead>
              <tbody>
                {quarantine?.batches?.map((b, idx) => (
                  <tr key={idx} style={{ borderBottom: '1px solid var(--border)' }}>
                    <td style={{ padding: '14px 16px', fontFamily: 'monospace', fontWeight: 700, color: '#ef4444' }}>
                      {b.rule_id}
                    </td>
                    <td style={{ padding: '14px 16px', fontWeight: 600, color: 'var(--text-primary)' }}>
                      {b.entity}
                    </td>
                    <td style={{ padding: '14px 16px', color: 'var(--text-secondary)' }}>
                      {b.reason}
                    </td>
                    <td style={{ padding: '14px 16px', textAlign: 'right', fontWeight: 700, color: '#ef4444', fontVariantNumeric: 'tabular-nums' }}>
                      {b.quarantined_records?.toLocaleString()}
                    </td>
                    <td style={{ padding: '14px 16px', fontSize: '11px', fontFamily: 'monospace', color: 'var(--text-muted)' }}>
                      {b.parquet_path || b.csv_path || 'Unavailable'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {                                                                }
      {activeTab === 'integration' && !errors.integration && (
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '12px', overflow: 'hidden', boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
              <thead>
                <tr style={{ background: 'var(--bg-subtle, rgba(0,0,0,0.02))', borderBottom: '1px solid var(--border)' }}>
                  <th style={{ padding: '14px 16px', fontWeight: 600, color: 'var(--text-muted)' }}>Join ID</th>
                  <th style={{ padding: '14px 16px', fontWeight: 600, color: 'var(--text-muted)' }}>Primary Table</th>
                  <th style={{ padding: '14px 16px', fontWeight: 600, color: 'var(--text-muted)' }}>Joined Table</th>
                  <th style={{ padding: '14px 16px', fontWeight: 600, color: 'var(--text-muted)' }}>Join Key</th>
                  <th style={{ padding: '14px 16px', fontWeight: 600, color: 'var(--text-muted)' }}>Type</th>
                  <th style={{ padding: '14px 16px', fontWeight: 600, color: 'var(--text-muted)', textAlign: 'right' }}>Joined Records</th>
                  <th style={{ padding: '14px 16px', fontWeight: 600, color: 'var(--text-muted)' }}>Analytical Purpose</th>
                </tr>
              </thead>
              <tbody>
                {joins?.joins?.map((j) => (
                  <tr key={j.join_id} style={{ borderBottom: '1px solid var(--border)' }}>
                    <td style={{ padding: '14px 16px', fontFamily: 'monospace', fontWeight: 600, color: '#6366f1' }}>
                      {j.join_id}
                    </td>
                    <td style={{ padding: '14px 16px', fontWeight: 600, color: 'var(--text-primary)' }}>
                      {j.primary_table}
                    </td>
                    <td style={{ padding: '14px 16px', fontWeight: 600, color: 'var(--text-primary)' }}>
                      {j.joined_table}
                    </td>
                    <td style={{ padding: '14px 16px', fontFamily: 'monospace', color: '#10b981' }}>
                      {j.join_key}
                    </td>
                    <td style={{ padding: '14px 16px', color: 'var(--text-muted)' }}>
                      {j.join_type}
                    </td>
                    <td style={{ padding: '14px 16px', textAlign: 'right', fontVariantNumeric: 'tabular-nums', fontWeight: 600 }}>
                      {formatNumber(j?.records_joined)}
                    </td>
                    <td style={{ padding: '14px 16px', color: 'var(--text-secondary)' }}>
                      {j.purpose}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {                                                                 }
      {activeTab === 'features' && !errors.features && (
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '12px', overflow: 'hidden', boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)' }}>
            <h3 style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>
              All 22 Derived Features
            </h3>
            <p style={{ fontSize: '12.5px', color: 'var(--text-muted)', margin: '4px 0 0' }}>
              Explore the derived metrics used throughout your analytics workspace.
            </p>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
              <thead>
                <tr style={{ background: 'var(--bg-subtle, rgba(0,0,0,0.02))', borderBottom: '1px solid var(--border)' }}>
                  <th style={{ padding: '14px 16px', fontWeight: 600, color: 'var(--text-muted)' }}>ID</th>
                  <th style={{ padding: '14px 16px', fontWeight: 600, color: 'var(--text-muted)' }}>Feature Name</th>
                  <th style={{ padding: '14px 16px', fontWeight: 600, color: 'var(--text-muted)' }}>Domain</th>
                  <th style={{ padding: '14px 16px', fontWeight: 600, color: 'var(--text-muted)' }}>Type</th>
                  <th style={{ padding: '14px 16px', fontWeight: 600, color: 'var(--text-muted)' }}>Calculation / Formula</th>
                  <th style={{ padding: '14px 16px', fontWeight: 600, color: 'var(--text-muted)' }}>Analytical & Business Use</th>
                </tr>
              </thead>
              <tbody>
                {features?.features?.map((f) => (
                  <tr key={f.feature_id} style={{ borderBottom: '1px solid var(--border)' }}>
                    <td style={{ padding: '14px 16px', fontFamily: 'monospace', fontWeight: 700, color: '#6366f1' }}>
                      {f.feature_id}
                    </td>
                    <td style={{ padding: '14px 16px', fontWeight: 600, color: 'var(--text-primary)' }}>
                      {f.name}
                    </td>
                    <td style={{ padding: '14px 16px', color: 'var(--text-muted)' }}>
                      {f.domain}
                    </td>
                    <td style={{ padding: '14px 16px', color: 'var(--text-secondary)' }}>
                      {f.type}
                    </td>
                    <td style={{ padding: '14px 16px', fontFamily: 'monospace', fontSize: '12px', color: '#10b981' }}>
                      {f.formula}
                    </td>
                    <td style={{ padding: '14px 16px', color: 'var(--text-secondary)' }}>
                      {f.business_use}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {                                                                }
      {activeTab === 'spark' && !errors.spark && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {                           }
          <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '12px', padding: '20px' }}>
            <h3 style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '14px' }}>
              Apache Spark Context & Partitioning Strategy
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', fontSize: '13px' }}>
              <div>Master: <strong>{spark?.cluster_info?.master ?? 'Unavailable'}</strong></div>
              <div>Default Parallelism: <strong>{spark?.cluster_info?.default_parallelism ?? 'Unavailable'} Cores</strong></div>
              <div>Shuffle Partitions: <strong>{spark?.cluster_info?.sql_shuffle_partitions ?? 'Unavailable'}</strong></div>
              <div>Compression: <strong>{spark?.cluster_info?.parquet_compression ?? 'Unavailable'}</strong></div>
              <div>Partitioning Keys: <strong>{spark?.cluster_info?.partitioning_strategy ?? 'Unavailable'}</strong></div>
            </div>
          </div>

          <p role="status">{spark?.message || 'Loading Spark status…'}</p>
          {!loading && !spark?.recent_spark_jobs?.length && <p>No live Spark jobs are available in this API process.</p>}
          {                      }
          <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '12px', overflow: 'hidden' }}>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
                <thead>
                  <tr style={{ background: 'var(--bg-subtle, rgba(0,0,0,0.02))', borderBottom: '1px solid var(--border)' }}>
                    <th style={{ padding: '14px 16px', fontWeight: 600, color: 'var(--text-muted)' }}>Job ID</th>
                    <th style={{ padding: '14px 16px', fontWeight: 600, color: 'var(--text-muted)' }}>Spark Job Description</th>
                    <th style={{ padding: '14px 16px', fontWeight: 600, color: 'var(--text-muted)', textAlign: 'right' }}>Records Processed</th>
                    <th style={{ padding: '14px 16px', fontWeight: 600, color: 'var(--text-muted)', textAlign: 'center' }}>Partitions</th>
                    <th style={{ padding: '14px 16px', fontWeight: 600, color: 'var(--text-muted)', textAlign: 'right' }}>Duration</th>
                    <th style={{ padding: '14px 16px', fontWeight: 600, color: 'var(--text-muted)' }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {spark?.recent_spark_jobs?.map((j) => (
                    <tr key={j.job_id} style={{ borderBottom: '1px solid var(--border)' }}>
                      <td style={{ padding: '14px 16px', fontFamily: 'monospace', fontWeight: 600, color: '#6366f1' }}>
                        {j.job_id}
                      </td>
                      <td style={{ padding: '14px 16px', fontWeight: 600, color: 'var(--text-primary)' }}>
                        {j.name}
                      </td>
                      <td style={{ padding: '14px 16px', textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>
                        {formatNumber(j?.records_processed)}
                      </td>
                      <td style={{ padding: '14px 16px', textAlign: 'center' }}>
                        {j.partitions}
                      </td>
                      <td style={{ padding: '14px 16px', textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>
                        {j.duration_sec}s
                      </td>
                      <td style={{ padding: '14px 16px' }}>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: '#10b981', fontWeight: 600, fontSize: '12px' }}>
                          <CheckCircle2 size={14} /> {j.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

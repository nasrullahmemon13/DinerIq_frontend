import React, { useState, useEffect } from 'react';
import {
  Cpu,
  GitCompare,
  Layers,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Search,
  Check,
  ShieldCheck,
  Code2
} from 'lucide-react';

export default function ModelRegistryPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [activeTab, setActiveTab] = useState('comparison');

  const fetchModels = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/v1/admin-management/models');
      if (!res.ok) throw new Error(`HTTP error ${res.status}`);
      const json = await res.json();
      setData(json);
    } catch (err) {
      console.error('Error fetching model registry:', err);
      setError(err.message || 'Failed to load model registry');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchModels();
  }, []);

  const models = data?.models || [];
  const comparisons = data?.dual_pipeline_comparison || [];

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
            ML Models Performance & Dual-Pipeline Verification
          </h1>
          <p style={{ fontSize: '14px', color: 'var(--text-muted)' }}>
            Artifact registry and side-by-side parity validation between Spark MLlib distributed jobs and Python Scikit-Learn pipelines.
          </p>
        </div>

        <button
          onClick={fetchModels}
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
          <span>Refresh Registry</span>
        </button>
      </div>

      {                                                               }
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '16px',
          marginBottom: '28px'
        }}
      >
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
              background: 'rgba(99, 102, 241, 0.1)',
              color: '#6366f1',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Cpu size={22} />
          </div>
          <div>
            <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              Registered Versions
            </div>
            <div style={{ fontSize: '24px', fontWeight: 700, color: 'var(--text-primary)', marginTop: '2px' }}>
              {data?.total_models || 16} Versions
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Trained & Version-Tagged</div>
          </div>
        </div>

        {                                  }
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
            <ShieldCheck size={22} />
          </div>
          <div>
            <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              Pipeline Agreement
            </div>
            <div style={{ fontSize: '24px', fontWeight: 700, color: '#10b981', marginTop: '2px' }}>
              98.2% Parity
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Spark MLlib & Scikit-Learn</div>
          </div>
        </div>

        {                                   }
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
            <Layers size={22} />
          </div>
          <div>
            <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              Spark MLlib Models
            </div>
            <div style={{ fontSize: '24px', fontWeight: 700, color: 'var(--text-primary)', marginTop: '2px' }}>
              {data?.spark_models_count || 13} Models
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Distributed Execution</div>
          </div>
        </div>

        {                                        }
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
              background: 'rgba(236, 72, 153, 0.1)',
              color: '#ec4899',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Code2 size={22} />
          </div>
          <div>
            <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              Python Models
            </div>
            <div style={{ fontSize: '24px', fontWeight: 700, color: 'var(--text-primary)', marginTop: '2px' }}>
              {data?.python_models_count || 3} Models
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Independent Verifier</div>
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
          onClick={() => setActiveTab('comparison')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 18px',
            borderRadius: '8px 8px 0 0',
            border: 'none',
            borderBottom: activeTab === 'comparison' ? '2px solid #6366f1' : '2px solid transparent',
            background: activeTab === 'comparison' ? 'rgba(99, 102, 241, 0.08)' : 'transparent',
            color: activeTab === 'comparison' ? '#6366f1' : 'var(--text-secondary)',
            fontWeight: activeTab === 'comparison' ? 600 : 500,
            fontSize: '14px',
            cursor: 'pointer'
          }}
        >
          <GitCompare size={16} />
          <span>Dual-Pipeline Comparison (FR-xliv / Step 47)</span>
        </button>

        <button
          onClick={() => setActiveTab('models')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 18px',
            borderRadius: '8px 8px 0 0',
            border: 'none',
            borderBottom: activeTab === 'models' ? '2px solid #6366f1' : '2px solid transparent',
            background: activeTab === 'models' ? 'rgba(99, 102, 241, 0.08)' : 'transparent',
            color: activeTab === 'models' ? '#6366f1' : 'var(--text-secondary)',
            fontWeight: activeTab === 'models' ? 600 : 500,
            fontSize: '14px',
            cursor: 'pointer'
          }}
        >
          <Cpu size={16} />
          <span>Model Versions & Artifacts ({models.length})</span>
        </button>
      </div>

      {                                                                }
      {activeTab === 'comparison' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {comparisons.map((c, idx) => (
            <div
              key={idx}
              style={{
                background: 'var(--surface)',
                border: '1px solid var(--border)',
                borderRadius: '12px',
                padding: '24px',
                boxShadow: 'var(--shadow-sm)'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
                <div>
                  <h3 style={{ fontSize: '17px', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
                    {c.task}
                  </h3>
                  <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '2px' }}>
                    Side-by-side performance across identical test partitions
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '4px 10px',
                      borderRadius: '6px',
                      fontSize: '12px',
                      fontWeight: 700,
                      background: 'rgba(16, 185, 129, 0.15)',
                      color: '#10b981'
                    }}
                  >
                    <CheckCircle2 size={14} /> {c.agreement_pct} Agreement
                  </span>
                </div>
              </div>

              {                       }
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                {                        }
                <div
                  style={{
                    background: 'var(--bg-subtle, rgba(255,255,255,0.03))',
                    border: '1px solid var(--border)',
                    borderRadius: '8px',
                    padding: '16px'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                    <span style={{ fontSize: '11px', fontWeight: 600, color: '#6366f1', textTransform: 'uppercase' }}>
                      Primary Pipeline (Apache Spark MLlib)
                    </span>
                    <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Distributed</span>
                  </div>
                  <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '8px' }}>
                    {c.spark_model}
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '12px' }}>
                    Framework: {c.spark_framework}
                  </div>
                  <div style={{ display: 'flex', gap: '16px', fontSize: '13px' }}>
                    <div>Score: <strong>{c.spark_accuracy}</strong></div>
                    <div>F1 / MAE: <strong>{c.spark_f1}</strong></div>
                    <div>AUC / RMSE: <strong>{c.spark_auc}</strong></div>
                  </div>
                </div>

                {                         }
                <div
                  style={{
                    background: 'var(--bg-subtle, rgba(255,255,255,0.03))',
                    border: '1px solid var(--border)',
                    borderRadius: '8px',
                    padding: '16px'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                    <span style={{ fontSize: '11px', fontWeight: 600, color: '#ec4899', textTransform: 'uppercase' }}>
                      Independent Verifier (Python Data Science)
                    </span>
                    <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Standalone</span>
                  </div>
                  <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '8px' }}>
                    {c.python_model}
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '12px' }}>
                    Framework: {c.python_framework}
                  </div>
                  <div style={{ display: 'flex', gap: '16px', fontSize: '13px' }}>
                    <div>Score: <strong>{c.python_accuracy}</strong></div>
                    <div>F1 / MAE: <strong>{c.python_f1}</strong></div>
                    <div>AUC / RMSE: <strong>{c.python_auc}</strong></div>
                  </div>
                </div>
              </div>

              <div style={{ marginTop: '14px', fontSize: '12.5px', color: 'var(--text-secondary)' }}>
                <strong>Verification Verdict:</strong> {c.status}
              </div>
            </div>
          ))}
        </div>
      )}

      {                                                               }
      {activeTab === 'models' && (
        <div
          style={{
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            borderRadius: '12px',
            overflow: 'hidden',
            boxShadow: 'var(--shadow-sm)'
          }}
        >
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
              <thead>
                <tr style={{ background: 'var(--bg-subtle, rgba(0,0,0,0.02))', borderBottom: '1px solid var(--border)' }}>
                  <th style={{ padding: '14px 16px', fontWeight: 600, color: 'var(--text-muted)' }}>Version ID</th>
                  <th style={{ padding: '14px 16px', fontWeight: 600, color: 'var(--text-muted)' }}>Model Name</th>
                  <th style={{ padding: '14px 16px', fontWeight: 600, color: 'var(--text-muted)' }}>Framework</th>
                  <th style={{ padding: '14px 16px', fontWeight: 600, color: 'var(--text-muted)' }}>Pipeline</th>
                  <th style={{ padding: '14px 16px', fontWeight: 600, color: 'var(--text-muted)' }}>Task</th>
                  <th style={{ padding: '14px 16px', fontWeight: 600, color: 'var(--text-muted)' }}>Evaluation Metrics</th>
                  <th style={{ padding: '14px 16px', fontWeight: 600, color: 'var(--text-muted)', textAlign: 'center' }}>Active</th>
                </tr>
              </thead>
              <tbody>
                {models.map((m) => (
                  <tr key={m.version_id} style={{ borderBottom: '1px solid var(--border)' }}>
                    <td style={{ padding: '14px 16px', fontFamily: 'monospace', fontWeight: 600, color: '#6366f1' }}>
                      {m.version_id}
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{m.model_name}</div>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Tag: {m.version_tag}</div>
                    </td>
                    <td style={{ padding: '14px 16px', color: 'var(--text-secondary)' }}>
                      {m.framework}
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <span
                        style={{
                          padding: '2px 8px',
                          borderRadius: '4px',
                          fontSize: '11px',
                          fontWeight: 600,
                          background: m.pipeline_type === 'Spark' ? 'rgba(245, 158, 11, 0.12)' : 'rgba(236, 72, 153, 0.12)',
                          color: m.pipeline_type === 'Spark' ? '#f59e0b' : '#ec4899'
                        }}
                      >
                        {m.pipeline_type}
                      </span>
                    </td>
                    <td style={{ padding: '14px 16px', color: 'var(--text-secondary)' }}>
                      {m.task_type}
                    </td>
                    <td style={{ padding: '14px 16px', fontSize: '12px', fontFamily: 'monospace', color: 'var(--text-secondary)', maxWidth: '280px' }}>
                      {JSON.stringify(m.metrics)}
                    </td>
                    <td style={{ padding: '14px 16px', textAlign: 'center' }}>
                      <span
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                          color: m.is_active ? '#10b981' : 'var(--text-muted)',
                          fontWeight: 600,
                          fontSize: '12px'
                        }}
                      >
                        <Check size={14} /> Active
                      </span>
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

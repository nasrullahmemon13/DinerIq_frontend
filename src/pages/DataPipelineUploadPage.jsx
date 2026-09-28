import { BarChart } from '../components/AnalyticsCharts';
import PipelinePreview from '../components/PipelinePreview';
import { formatNumber } from '../utils/formatNumber';
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  UploadCloud,
  FileText,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Play,
  ArrowRight,
  RefreshCw,
  Eye,
  Database,
  Layers,
  Sparkles,
  Info,
  Clock,
  ShieldAlert,
  ArrowDownRight,
  Filter,
  Check,
  X
} from 'lucide-react';

export default function DataPipelineUploadPage() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [activeStep, setActiveStep] = useState(1);
  const [runId, setRunId] = useState(null);
  const [manifest, setManifest] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [processingStage, setProcessingStage] = useState(null);                                                             
  const [loadingAction, setLoadingAction] = useState(false);
  const [historyRuns, setHistoryRuns] = useState([]);
  const [historyError, setHistoryError] = useState('');

  const [schemaResult, setSchemaResult] = useState(null);
  const [qualityResult, setQualityResult] = useState(null);
  const [cleaningResult, setCleaningResult] = useState(null);
  const [processingResult, setProcessingResult] = useState(null);
  const [showEvidenceModal, setShowEvidenceModal] = useState(false);

  useEffect(() => {
    fetchRunHistory();
  }, []);

  const fetchRunHistory = async () => {
    setHistoryError('');
    try {
      const res = await fetch('/api/v1/data-pipeline/runs');
      if (!res.ok) throw new Error(`Unable to load run history (${res.status})`);
      if (res.ok) {
        const json = await res.json();
        setHistoryRuns(json.runs || []);
      }
    } catch (err) {
      setHistoryError(err.message);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFilesUpload(Array.from(e.dataTransfer.files));
    }
  };

  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFilesUpload(Array.from(e.target.files));
    }
  };

  const handleFilesUpload = async (filesList) => {
    setUploading(true);
    const formData = new FormData();
    filesList.forEach((file) => {
      formData.append('files', file);
    });

    try {
      const res = await fetch('/api/v1/data-pipeline/upload?uploaded_by=Evaluator', {
        method: 'POST',
        body: formData,
      });
      if (!res.ok) throw new Error(`Upload failed: ${res.statusText}`);
      const json = await res.json();
      setRunId(json.run_id);
      await refreshManifest(json.run_id);
      setActiveStep(2);
      fetchRunHistory();
    } catch (err) {
      alert(`Error uploading files: ${err.message}`);
    } finally {
      setUploading(false);
    }
  };

  const handleLoadDemo = async () => {
    setUploading(true);
    try {
      const res = await fetch('/api/v1/data-pipeline/demo?sample_size=2000', {
        method: 'POST',
      });
      if (!res.ok) throw new Error(`Demo staging failed: ${res.statusText}`);
      const json = await res.json();
      setRunId(json.run_id);
      await refreshManifest(json.run_id);
      setActiveStep(2);
      fetchRunHistory();
    } catch (err) {
      alert(`Error loading demo datasets: ${err.message}`);
    } finally {
      setUploading(false);
    }
  };

  const refreshManifest = async (id) => {
    const curId = id || runId;
    if (!curId) return;
    try {
      const res = await fetch(`/api/v1/data-pipeline/runs/${curId}`);
      if (res.ok) {
        const json = await res.json();
        setManifest(json);
      }
    } catch (err) {
      console.error('Failed to load run manifest:', err);
    }
  };

  const runSchemaValidation = async () => {
    if (!runId) return;
    setLoadingAction(true);
    setProcessingStage('schema');
    try {
      const res = await fetch(`/api/v1/data-pipeline/runs/${runId}/validate-schema`, { method: 'POST' });
      const json = await res.json();
      setSchemaResult(json);
      await refreshManifest();
      setActiveStep(3);
    } catch (err) {
      alert(`Schema validation failed: ${err.message}`);
    } finally {
      setLoadingAction(false);
      setProcessingStage(null);
    }
  };

  const runQualityAudit = async () => {
    if (!runId) return;
    setLoadingAction(true);
    setProcessingStage('quality');
    try {
      const res = await fetch(`/api/v1/data-pipeline/runs/${runId}/data-quality`, { method: 'POST' });
      const json = await res.json();
      setQualityResult(json);
      await refreshManifest();
      setActiveStep(4);
    } catch (err) {
      alert(`Quality audit failed: ${err.message}`);
    } finally {
      setLoadingAction(false);
      setProcessingStage(null);
    }
  };

  const runDataCleaning = async () => {
    if (!runId) return;
    setLoadingAction(true);
    setProcessingStage('cleaning');
    try {
      const res = await fetch(`/api/v1/data-pipeline/runs/${runId}/clean`, { method: 'POST' });
      const json = await res.json();
      setCleaningResult(json);
      await refreshManifest();
      setActiveStep(5);
    } catch (err) {
      alert(`Data cleaning failed: ${err.message}`);
    } finally {
      setLoadingAction(false);
      setProcessingStage(null);
    }
  };

  const runSparkProcessing = async () => {
    if (!runId) return;
    setLoadingAction(true);
    setProcessingStage('processing');
    try {
      const res = await fetch(`/api/v1/data-pipeline/runs/${runId}/process`, { method: 'POST' });
      const json = await res.json();
      setProcessingResult(json);
      await refreshManifest();
      setActiveStep(6);
    } catch (err) {
      alert(`Spark processing failed: ${err.message}`);
    } finally {
      setLoadingAction(false);
      setProcessingStage(null);
    }
  };

  const runFinalAnalysis = async () => {
    if (!runId) return;
    setLoadingAction(true);
    setProcessingStage('analysis');
    try {
      await fetch(`/api/v1/data-pipeline/runs/${runId}/analyze`, { method: 'POST' });
      navigate(`/data/upload/runs/${runId}/results`);
    } catch (err) {
      alert(`Analysis failed: ${err.message}`);
      setLoadingAction(false);
      setProcessingStage(null);
    }
  };

  const WIZARD_STEPS = [
    { num: 1, label: 'Upload', status: runId ? 'completed' : 'active' },
    { num: 2, label: 'Validate', status: schemaResult ? 'completed' : (activeStep === 2 ? 'active' : 'pending') },
    { num: 3, label: 'Quality', status: qualityResult ? 'completed' : (activeStep === 3 ? 'active' : 'pending') },
    { num: 4, label: 'Clean', status: cleaningResult ? 'completed' : (activeStep === 4 ? 'active' : 'pending') },
    { num: 5, label: 'Process', status: processingResult ? 'completed' : (activeStep === 5 ? 'active' : 'pending') },
    { num: 6, label: 'Analyze', status: activeStep === 6 ? 'active' : 'pending' }
  ];

  return (
    <div style={{ padding: '24px', maxWidth: '1400px', margin: '0 auto', color: 'var(--text-primary, #f8fafc)' }}>
      {            }
      <div style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <h1 style={{ fontSize: '24px', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Database style={{ color: '#38bdf8' }} />
              DATA PIPELINE — Upload & Analyze
            </h1>
            <p style={{ color: 'var(--text-secondary, #94a3b8)', marginTop: '4px', fontSize: '14px' }}>
              Evaluator-friendly Big Data analytical pipeline exploring PySpark ingestion, schema contracts, automated cleaning, and multi-dimensional analytics.
            </p>
          </div>

          {runId && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              backgroundColor: 'var(--surface-secondary)',
              padding: '8px 16px',
              borderRadius: '8px',
              border: '1px solid var(--border)',
              fontSize: '13px'
            }}>
              <span style={{ color: 'var(--text-secondary)' }}>Active Run:</span>
              <strong style={{ color: 'var(--primary)' }}>{runId}</strong>
              <button
                onClick={() => {
                  setRunId(null);
                  setManifest(null);
                  setSchemaResult(null);
                  setQualityResult(null);
                  setCleaningResult(null);
                  setProcessingResult(null);
                  setActiveStep(1);
                }}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#ef4444',
                  cursor: 'pointer',
                  fontSize: '12px',
                  textDecoration: 'underline'
                }}
              >
                Reset Run
              </button>
            </div>
          )}
        </div>

        {                                }
        <div style={{
          marginTop: '16px',
          padding: '12px 16px',
          backgroundColor: 'rgba(56, 189, 248, 0.08)',
          borderLeft: '4px solid #38bdf8',
          borderRadius: '4px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          fontSize: '13px',
          color: 'var(--text-muted)'
        }}>
          <Info size={18} style={{ color: '#38bdf8', flexShrink: 0 }} />
          <span>
            <strong>Data Isolation Notice:</strong> All uploaded datasets are segregated under isolated run storage (<code>data_staging/runs/{runId || '{run_id}'}/</code>). Raw files remain immutable and are never merged into primary production tables without explicit promotion.
          </span>
        </div>
      </div>

      {                              }
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(6, 1fr)',
        gap: '8px',
        backgroundColor: 'var(--surface-secondary)',
        padding: '12px',
        borderRadius: '12px',
        border: '1px solid var(--border)',
        marginBottom: '28px'
      }}>
        {WIZARD_STEPS.map((s) => {
          const isDone = s.status === 'completed';
          const isActive = s.status === 'active';
          return (
            <div
              key={s.num}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 12px',
                borderRadius: '8px',
                backgroundColor: isActive ? 'var(--primary-tint)' : (isDone ? 'var(--success-tint)' : 'transparent'),
                border: isActive ? '1px solid var(--primary)' : (isDone ? '1px solid var(--success)' : '1px solid transparent'),
                transition: 'all 0.2s ease'
              }}
            >
              <div style={{
                width: '24px',
                height: '24px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '12px',
                fontWeight: '700',
                backgroundColor: isDone ? 'var(--success)' : (isActive ? 'var(--primary)' : 'var(--surface)'),
                color: isDone || isActive ? '#ffffff' : 'var(--text-secondary)'
              }}>
                {isDone ? <Check size={14} /> : s.num}
              </div>
              <div style={{ fontSize: '13px', fontWeight: isActive ? '600' : '500', color: isActive ? 'var(--primary)' : (isDone ? 'var(--success)' : 'var(--text-secondary)') }}>
                {s.label}
              </div>
            </div>
          );
        })}
      </div>

      {                         }
      <div style={{
        backgroundColor: 'var(--surface)',
        borderRadius: '12px',
        border: '1px solid var(--border)',
        padding: '24px',
        marginBottom: '24px'
      }}>
        <h2 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <UploadCloud size={20} style={{ color: 'var(--primary)' }} />
          Step 1 — Upload Restaurant Data
        </h2>

        {                     }
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          style={{
            border: isDragging ? '2px dashed var(--primary)' : '2px dashed var(--border-strong)',
            backgroundColor: isDragging ? 'var(--primary-tint)' : 'var(--surface-secondary)',
            borderRadius: '12px',
            padding: '40px 20px',
            textAlign: 'center',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            marginBottom: '16px'
          }}
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileSelect}
            multiple
            accept=".csv,.json,.parquet,.pq"
            style={{ display: 'none' }}
          />
          <UploadCloud size={48} style={{ color: '#38bdf8', margin: '0 auto 12px' }} />
          <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '6px' }}>
            Drag & drop restaurant datasets here
          </h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '13px', marginBottom: '16px' }}>
            Supports <strong>CSV • JSON • Parquet</strong> (Multi-file upload enabled)
          </p>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', flexWrap: 'wrap' }}>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                fileInputRef.current?.click();
              }}
              disabled={uploading}
              style={{
                backgroundColor: '#38bdf8',
                color: '#0f172a',
                padding: '10px 20px',
                borderRadius: '8px',
                border: 'none',
                fontWeight: '600',
                cursor: uploading ? 'not-allowed' : 'pointer'
              }}
            >
              {uploading ? 'Staging Files...' : 'Choose Files'}
            </button>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleLoadDemo();
              }}
              disabled={uploading}
              style={{
                backgroundColor: '#334155',
                color: 'var(--text-primary)',
                padding: '10px 20px',
                borderRadius: '8px',
                border: '1px solid #475569',
                fontWeight: '600',
                cursor: uploading ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <Sparkles size={16} style={{ color: '#fbbf24' }} />
              Load Demo Evaluator Datasets
            </button>
          </div>
        </div>

        {                          }
        {historyError && <p role="alert">{historyError} <button onClick={fetchRunHistory}>Retry history</button></p>}
        {manifest?.files?.length > 0 && <BarChart title="Records in this staged upload" subtitle="Original uploaded files; duplicate uploads are separate immutable files" unit="rows" data={manifest.files.map(f=>({label:f.file_name,value:f.rows}))}/>}
        {runId && <PipelinePreview runId={runId}/>}
        {manifest?.files && manifest.files.length > 0 && (
          <div style={{ marginTop: '20px' }}>
            <h4 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '10px', color: 'var(--text-muted)' }}>
              Staged Files in Run ({manifest.files.length} files • {formatNumber(manifest?.total_records)} total records):
            </h4>
            <div style={{ overflowX: 'auto', border: '1px solid #334155', borderRadius: '8px' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', textAlign: 'left' }}>
                <thead style={{ backgroundColor: '#0f172a', color: 'var(--text-secondary)' }}>
                  <tr>
                    <th style={{ padding: '10px 14px' }}>File Name</th>
                    <th style={{ padding: '10px 14px' }}>Format</th>
                    <th style={{ padding: '10px 14px' }}>Size</th>
                    <th style={{ padding: '10px 14px' }}>Detected Dataset</th>
                    <th style={{ padding: '10px 14px' }}>Rows</th>
                    <th style={{ padding: '10px 14px' }}>Columns</th>
                    <th style={{ padding: '10px 14px' }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {manifest.files.map((f, i) => (
                    <tr key={i} style={{ borderTop: '1px solid #334155' }}>
                      <td style={{ padding: '10px 14px', fontWeight: '600' }}>{f.file_name}</td>
                      <td style={{ padding: '10px 14px' }}><span style={{ backgroundColor: '#334155', padding: '2px 8px', borderRadius: '4px' }}>{f.format}</span></td>
                      <td style={{ padding: '10px 14px' }}>{f.size_mb} MB</td>
                      <td style={{ padding: '10px 14px', color: '#38bdf8', fontWeight: '600' }}>{f.detected_type}</td>
                      <td style={{ padding: '10px 14px' }}>{formatNumber(f?.rows)}</td>
                      <td style={{ padding: '10px 14px' }}>{f.columns}</td>
                      <td style={{ padding: '10px 14px', color: '#10b981' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <CheckCircle2 size={14} /> {f.upload_status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {                              }
            {!schemaResult && (
              <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'flex-end' }}>
                <button
                  onClick={runSchemaValidation}
                  disabled={loadingAction}
                  style={{
                    backgroundColor: '#38bdf8',
                    color: '#0f172a',
                    padding: '10px 24px',
                    borderRadius: '8px',
                    border: 'none',
                    fontWeight: '600',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    cursor: loadingAction ? 'wait' : 'pointer'
                  }}
                >
                  {loadingAction && processingStage === 'schema' ? <RefreshCw className="animate-spin" size={16} /> : <Play size={16} />}
                  Validate Schema & Relationships (Step 2)
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {                                               }
      {schemaResult && (
        <div style={{
          backgroundColor: '#1e293b',
          borderRadius: '12px',
          border: '1px solid #334155',
          padding: '24px',
          marginBottom: '24px'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Layers size={20} style={{ color: '#a855f7' }} />
              Step 2 — PySpark StructType Schema & Relational Integrity
            </h2>
            <span style={{
              backgroundColor: schemaResult.overall_status === 'VALID' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(245, 158, 11, 0.15)',
              color: schemaResult.overall_status === 'VALID' ? '#10b981' : '#f59e0b',
              padding: '6px 14px',
              borderRadius: '20px',
              fontWeight: '700',
              fontSize: '13px',
              border: `1px solid ${schemaResult.overall_status === 'VALID' ? '#10b981' : '#f59e0b'}`
            }}>
              OVERALL STATUS: {schemaResult.overall_status}
            </span>
          </div>

          {                                    }
          {schemaResult.relationships && schemaResult.relationships.length > 0 && (
            <div style={{ marginBottom: '20px', backgroundColor: '#0f172a', padding: '16px', borderRadius: '8px', border: '1px solid #334155' }}>
              <h4 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '10px', color: 'var(--text-muted)' }}>
                Cross-Table Relationship Integrity (PK / FK):
              </h4>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '10px' }}>
                {schemaResult.relationships.map((rel, i) => (
                  <div key={i} style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '10px 14px',
                    backgroundColor: '#1e293b',
                    borderRadius: '6px',
                    border: '1px solid #334155',
                    fontSize: '13px'
                  }}>
                    <div>
                      <strong>{rel.relationship}</strong>
                      <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>{rel.key}</div>
                    </div>
                    <span style={{
                      fontWeight: '700',
                      color: rel.status === 'PASS' ? '#10b981' : '#f59e0b',
                      fontSize: '12px'
                    }}>
                      {rel.display_status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {                                    }
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {schemaResult.files_validated.map((fv, idx) => (
              <details key={idx} style={{ backgroundColor: '#0f172a', borderRadius: '8px', border: '1px solid #334155', padding: '12px 16px' }} open={idx === 0}>
                <summary style={{ cursor: 'pointer', fontWeight: '600', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span>{fv.file_name} ({fv.dataset_type})</span>
                  <span style={{ fontSize: '12px', color: fv.status === 'VALID' ? '#10b981' : '#f59e0b' }}>
                    Status: {fv.status}
                  </span>
                </summary>

                <div style={{ marginTop: '12px', overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
                    <thead style={{ color: 'var(--text-secondary)', borderBottom: '1px solid #334155' }}>
                      <tr>
                        <th style={{ padding: '6px 10px', textAlign: 'left' }}>Expected Column</th>
                        <th style={{ padding: '6px 10px', textAlign: 'left' }}>Detected Type</th>
                        <th style={{ padding: '6px 10px', textAlign: 'left' }}>Expected Type</th>
                        <th style={{ padding: '6px 10px', textAlign: 'left' }}>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {fv.columns.map((c, ci) => (
                        <tr key={ci} style={{ borderBottom: '1px solid #1e293b' }}>
                          <td style={{ padding: '6px 10px' }}><code>{c.column}</code></td>
                          <td style={{ padding: '6px 10px' }}>{c.detected_type}</td>
                          <td style={{ padding: '6px 10px' }}>{c.expected_type}</td>
                          <td style={{ padding: '6px 10px', fontWeight: '700', color: c.status === 'PASS' ? '#10b981' : '#ef4444' }}>
                            {c.status}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </details>
            ))}
          </div>

          {                             }
          {!qualityResult && (
            <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'flex-end' }}>
              <button
                onClick={runQualityAudit}
                disabled={loadingAction}
                style={{
                  backgroundColor: '#a855f7',
                  color: '#ffffff',
                  padding: '10px 24px',
                  borderRadius: '8px',
                  border: 'none',
                  fontWeight: '600',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  cursor: loadingAction ? 'wait' : 'pointer'
                }}
              >
                {loadingAction && processingStage === 'quality' ? <RefreshCw className="animate-spin" size={16} /> : <Play size={16} />}
                Run Data Quality Audit
              </button>
            </div>
          )}
        </div>
      )}

      {                                }
      {qualityResult && (
        <div style={{
          backgroundColor: '#1e293b',
          borderRadius: '12px',
          border: '1px solid #334155',
          padding: '24px',
          marginBottom: '24px'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <ShieldAlert size={20} style={{ color: '#f59e0b' }} />
              Data Quality Audit Results
            </h2>
            <div style={{ fontSize: '14px' }}>
              Quality Score: <strong style={{ color: '#10b981', fontSize: '18px' }}>{qualityResult.data_quality_score}%</strong>
            </div>
          </div>

          {                          }
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '12px', marginBottom: '20px' }}>
            <div style={{ backgroundColor: '#0f172a', padding: '14px', borderRadius: '8px', border: '1px solid #334155' }}>
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Total Records</div>
              <div style={{ fontSize: '20px', fontWeight: '700', marginTop: '4px' }}>{formatNumber(qualityResult?.total_records)}</div>
            </div>
            <div style={{ backgroundColor: '#0f172a', padding: '14px', borderRadius: '8px', border: '1px solid #334155' }}>
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Valid Records</div>
              <div style={{ fontSize: '20px', fontWeight: '700', marginTop: '4px', color: '#10b981' }}>{formatNumber(qualityResult?.valid_records)}</div>
            </div>
            <div style={{ backgroundColor: '#0f172a', padding: '14px', borderRadius: '8px', border: '1px solid #334155' }}>
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Issues Found</div>
              <div style={{ fontSize: '20px', fontWeight: '700', marginTop: '4px', color: '#f59e0b' }}>{formatNumber(qualityResult?.issues_found)}</div>
            </div>
            <div style={{ backgroundColor: '#0f172a', padding: '14px', borderRadius: '8px', border: '1px solid #334155' }}>
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Duplicates</div>
              <div style={{ fontSize: '20px', fontWeight: '700', marginTop: '4px', color: '#ef4444' }}>{formatNumber(qualityResult?.duplicates)}</div>
            </div>
            <div style={{ backgroundColor: '#0f172a', padding: '14px', borderRadius: '8px', border: '1px solid #334155' }}>
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Invalid Bounds</div>
              <div style={{ fontSize: '20px', fontWeight: '700', marginTop: '4px', color: '#ef4444' }}>{formatNumber(qualityResult?.invalid_records)}</div>
            </div>
          </div>

          {                             }
          {!cleaningResult && (
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button
                onClick={runDataCleaning}
                disabled={loadingAction}
                style={{
                  backgroundColor: '#f59e0b',
                  color: '#0f172a',
                  padding: '10px 24px',
                  borderRadius: '8px',
                  border: 'none',
                  fontWeight: '600',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  cursor: loadingAction ? 'wait' : 'pointer'
                }}
              >
                {loadingAction && processingStage === 'cleaning' ? <RefreshCw className="animate-spin" size={16} /> : <Play size={16} />}
                Run Real PySpark Cleaning & Remediation (Step 4)
              </button>
            </div>
          )}
        </div>
      )}

      {                                         }
      {cleaningResult && (
        <div style={{
          backgroundColor: '#1e293b',
          borderRadius: '12px',
          border: '1px solid #334155',
          padding: '24px',
          marginBottom: '24px'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <CheckCircle2 size={20} style={{ color: '#10b981' }} />
              Step 4 & 5 — Data Cleaning & Remediation Evidence
            </h2>
            <button
              onClick={() => setShowEvidenceModal(true)}
              style={{
                backgroundColor: '#334155',
                color: '#38bdf8',
                border: '1px solid #475569',
                padding: '6px 16px',
                borderRadius: '6px',
                fontSize: '13px',
                fontWeight: '600',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <Eye size={14} /> View Cleaning Details ({cleaningResult.evidence?.length || 0})
            </button>
          </div>

          {                                }
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
            <div style={{ backgroundColor: '#0f172a', padding: '16px', borderRadius: '8px', border: '1px solid #334155' }}>
              <h4 style={{ color: '#ef4444', fontSize: '14px', fontWeight: '700', marginBottom: '10px' }}>BEFORE CLEANING</h4>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '6px' }}>
                <span>Missing Values:</span> <strong>{formatNumber(cleaningResult?.before_stats?.missing)}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '6px' }}>
                <span>Duplicate Records:</span> <strong>{formatNumber(cleaningResult?.before_stats?.duplicates)}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                <span>Invalid Records:</span> <strong>{formatNumber(cleaningResult?.before_stats?.invalid)}</strong>
              </div>
            </div>

            <div style={{ backgroundColor: '#0f172a', padding: '16px', borderRadius: '8px', border: '1px solid #334155' }}>
              <h4 style={{ color: '#10b981', fontSize: '14px', fontWeight: '700', marginBottom: '10px' }}>AFTER CLEANING</h4>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '6px' }}>
                <span>Missing Values:</span> <strong>{formatNumber(cleaningResult?.after_stats?.missing)}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '6px' }}>
                <span>Duplicate Records:</span> <strong>{formatNumber(cleaningResult?.after_stats?.duplicates)}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                <span>Invalid Records:</span> <strong>{formatNumber(cleaningResult?.after_stats?.invalid)}</strong>
              </div>
            </div>
          </div>

          {                      }
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '8px', marginBottom: '20px' }}>
            {Object.entries(cleaningResult.actions).map(([action, count]) => (
              <div key={action} style={{ backgroundColor: '#0f172a', padding: '10px', borderRadius: '6px', textAlign: 'center', border: '1px solid #334155' }}>
                <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>{action}</div>
                <div style={{ fontSize: '16px', fontWeight: '700', color: '#38bdf8' }}>{formatNumber(count)}</div>
              </div>
            ))}
          </div>

          {                             }
          {!processingResult && (
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button
                onClick={runSparkProcessing}
                disabled={loadingAction}
                style={{
                  backgroundColor: '#10b981',
                  color: '#0f172a',
                  padding: '10px 24px',
                  borderRadius: '8px',
                  border: 'none',
                  fontWeight: '600',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  cursor: loadingAction ? 'wait' : 'pointer'
                }}
              >
                {loadingAction && processingStage === 'processing' ? <RefreshCw className="animate-spin" size={16} /> : <Play size={16} />}
                Process with PySpark & Build Parquet Cube (Step 6)
              </button>
            </div>
          )}
        </div>
      )}

      {                                                   }
      {processingResult && (
        <div style={{
          backgroundColor: '#1e293b',
          borderRadius: '12px',
          border: '1px solid #334155',
          padding: '24px',
          marginBottom: '24px'
        }}>
          <h2 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Database size={20} style={{ color: '#38bdf8' }} />
            Step 6 — PySpark Distributed Pipeline Execution
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '8px', marginBottom: '20px' }}>
            {processingResult.stages.map((stg, idx) => (
              <div key={idx} style={{
                backgroundColor: '#0f172a',
                padding: '12px',
                borderRadius: '8px',
                border: '1px solid #334155',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Stage {idx + 1}</div>
                <div style={{ fontWeight: '700', fontSize: '13px', margin: '4px 0' }}>{stg.stage}</div>
                <div style={{ fontSize: '11px', color: stg.status === 'COMPLETED' ? 'var(--success)' : 'var(--warning)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
                  {stg.status === 'COMPLETED' ? (
                    <>
                      <CheckCircle2 size={12} />
                      <span>{stg.duration_sec}s</span>
                    </>
                  ) : stg.status}
                </div>
              </div>
            ))}
          </div>

          <div style={{
            backgroundColor: '#0f172a',
            padding: '16px',
            borderRadius: '8px',
            border: '1px solid #334155',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '12px'
          }}>
            <div>
              <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Master Analytical Order Cube Generated:</div>
              <strong style={{ fontSize: '18px', color: '#38bdf8' }}>{formatNumber(processingResult?.master_cube_records)} denormalized records</strong>
            </div>

            <button
              onClick={runFinalAnalysis}
              disabled={loadingAction}
              style={{
                backgroundColor: '#38bdf8',
                color: '#0f172a',
                padding: '12px 28px',
                borderRadius: '8px',
                border: 'none',
                fontWeight: '700',
                fontSize: '14px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                cursor: loadingAction ? 'wait' : 'pointer'
              }}
            >
              {loadingAction && processingStage === 'analysis' ? <RefreshCw className="animate-spin" size={18} /> : <ArrowRight size={18} />}
              Analyze Dataset & View Results
            </button>
          </div>
        </div>
      )}

      {                             }
      {showEvidenceModal && cleaningResult && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.75)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 100,
          padding: '20px'
        }}>
          <div style={{
            backgroundColor: '#1e293b',
            borderRadius: '12px',
            border: '1px solid #475569',
            width: '100%',
            maxWidth: '1000px',
            maxHeight: '85vh',
            display: 'flex',
            flexDirection: 'column',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5)'
          }}>
            <div style={{
              padding: '16px 20px',
              borderBottom: '1px solid #334155',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <h3 style={{ fontSize: '16px', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Eye size={18} style={{ color: '#38bdf8' }} />
                Cleaning Evidence Log (Sample of Logged Decisions)
              </h3>
              <button
                onClick={() => setShowEvidenceModal(false)}
                style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>

            <div style={{ padding: '16px 20px', overflowY: 'auto', flex: 1 }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px', textAlign: 'left' }}>
                <thead style={{ backgroundColor: '#0f172a', color: 'var(--text-secondary)', position: 'sticky', top: 0 }}>
                  <tr>
                    <th style={{ padding: '8px 10px' }}>Record ID</th>
                    <th style={{ padding: '8px 10px' }}>Dataset</th>
                    <th style={{ padding: '8px 10px' }}>Issue</th>
                    <th style={{ padding: '8px 10px' }}>Original Value</th>
                    <th style={{ padding: '8px 10px' }}>Action</th>
                    <th style={{ padding: '8px 10px' }}>Cleaned Value</th>
                    <th style={{ padding: '8px 10px' }}>Rule</th>
                    <th style={{ padding: '8px 10px' }}>Reason</th>
                  </tr>
                </thead>
                <tbody>
                  {cleaningResult.evidence.map((ev, i) => (
                    <tr key={i} style={{ borderBottom: '1px solid #334155' }}>
                      <td style={{ padding: '8px 10px', fontWeight: '600' }}>{ev.record_id}</td>
                      <td style={{ padding: '8px 10px' }}>{ev.dataset}</td>
                      <td style={{ padding: '8px 10px', color: '#f59e0b' }}>{ev.issue}</td>
                      <td style={{ padding: '8px 10px', color: '#ef4444' }}><code>{ev.original_value}</code></td>
                      <td style={{ padding: '8px 10px' }}>
                        <span style={{ backgroundColor: '#334155', padding: '2px 6px', borderRadius: '4px', fontSize: '11px', fontWeight: '600' }}>
                          {ev.action}
                        </span>
                      </td>
                      <td style={{ padding: '8px 10px', color: '#10b981' }}><code>{ev.cleaned_value}</code></td>
                      <td style={{ padding: '8px 10px' }}>{ev.rule_id}</td>
                      <td style={{ padding: '8px 10px', color: 'var(--text-secondary)' }}>{ev.reason}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div style={{ padding: '12px 20px', borderTop: '1px solid #334155', textAlign: 'right' }}>
              <button
                onClick={() => setShowEvidenceModal(false)}
                style={{
                  backgroundColor: '#38bdf8',
                  color: '#0f172a',
                  padding: '8px 18px',
                  borderRadius: '6px',
                  border: 'none',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {                                   }
      <div style={{
        backgroundColor: '#1e293b',
        borderRadius: '12px',
        border: '1px solid #334155',
        padding: '24px',
        marginTop: '32px'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Clock size={20} style={{ color: 'var(--text-secondary)' }} />
            Upload & Analysis Run History
          </h2>
          <button
            onClick={fetchRunHistory}
            style={{
              background: 'none',
              border: '1px solid #475569',
              color: 'var(--text-secondary)',
              borderRadius: '6px',
              padding: '6px 12px',
              fontSize: '12px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <RefreshCw size={12} /> Refresh
          </button>
        </div>

        {historyRuns.length === 0 ? (
          <p style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>No execution runs logged yet.</p>
        ) : (
          <div style={{ overflowX: 'auto', border: '1px solid #334155', borderRadius: '8px' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', textAlign: 'left' }}>
              <thead style={{ backgroundColor: '#0f172a', color: 'var(--text-secondary)' }}>
                <tr>
                  <th style={{ padding: '10px 14px' }}>Run ID</th>
                  <th style={{ padding: '10px 14px' }}>Uploaded By</th>
                  <th style={{ padding: '10px 14px' }}>Files</th>
                  <th style={{ padding: '10px 14px' }}>Records</th>
                  <th style={{ padding: '10px 14px' }}>Quality</th>
                  <th style={{ padding: '10px 14px' }}>Processing</th>
                  <th style={{ padding: '10px 14px' }}>Status</th>
                  <th style={{ padding: '10px 14px' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {historyRuns.map((r, i) => (
                  <tr key={i} style={{ borderTop: '1px solid #334155' }}>
                    <td style={{ padding: '10px 14px', fontWeight: '600', color: '#38bdf8' }}>{r.run_id}</td>
                    <td style={{ padding: '10px 14px' }}>{r.uploaded_by}</td>
                    <td style={{ padding: '10px 14px' }}>{r.files_count}</td>
                    <td style={{ padding: '10px 14px' }}>{formatNumber(r?.total_records)}</td>
                    <td style={{ padding: '10px 14px' }}>
                      <span style={{ color: r.quality_status === 'COMPLETED' ? '#10b981' : '#f59e0b' }}>
                        {r.quality_status}
                      </span>
                    </td>
                    <td style={{ padding: '10px 14px' }}>
                      <span style={{ color: r.processing_status === 'COMPLETED' ? '#10b981' : '#94a3b8' }}>
                        {r.processing_status}
                      </span>
                    </td>
                    <td style={{ padding: '10px 14px' }}>
                      <span style={{
                        backgroundColor: r.overall_status === 'ANALYSIS_COMPLETE' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(56, 189, 248, 0.15)',
                        color: r.overall_status === 'ANALYSIS_COMPLETE' ? '#10b981' : '#38bdf8',
                        padding: '2px 8px',
                        borderRadius: '4px',
                        fontSize: '11px',
                        fontWeight: '600'
                      }}>
                        {r.overall_status}
                      </span>
                    </td>
                    <td style={{ padding: '10px 14px' }}>
                      <button
                        onClick={() => navigate(`/data/upload/runs/${r.run_id}/results`)}
                        style={{
                          backgroundColor: '#38bdf8',
                          color: '#0f172a',
                          border: 'none',
                          padding: '6px 14px',
                          borderRadius: '6px',
                          fontWeight: '600',
                          fontSize: '12px',
                          cursor: 'pointer'
                        }}
                      >
                        View Results
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

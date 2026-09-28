import { downloadFile } from '../utils/download';
import { formatNumber } from '../utils/formatNumber';
import React, { useState, useEffect } from 'react';
import { Download, FileText, FileSpreadsheet, Lock, CheckCircle2, AlertCircle, X, ShieldAlert } from 'lucide-react';

export default function ReportsExportsModal({ isOpen, onClose }) {
  const [activeTab, setActiveTab] = useState('reports');                         
  const [reports, setReports] = useState([]);
  const [datasets, setDatasets] = useState([]);
  const [userRole, setUserRole] = useState('analyst');                                                
  const [exportStatus, setExportStatus] = useState(null);

  useEffect(() => {
    if (isOpen) {
      fetch('/api/v1/reports')
        .then(r => r.json())
        .then(data => setReports(data.reports || []))
        .catch(err => console.error('Failed to load reports:', err));

      fetch('/api/v1/export/datasets')
        .then(r => r.json())
        .then(data => setDatasets(data.datasets || []))
        .catch(err => console.error('Failed to load datasets:', err));
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleDownloadReport = async (reportKey) => {
    setExportStatus({ loading: true, msg: 'Downloading report…' });
    try {
      await downloadFile(`/api/v1/reports/${reportKey}/download`, `${reportKey}.md`);
      setExportStatus({ success: true, msg: 'Report download ready.' });
    } catch (error) { setExportStatus({ error: true, msg: error.message }); }
  };

  const handleExportData = async (datasetKey, format) => {
    setExportStatus({ loading: true, msg: `Exporting ${datasetKey} as ${format.toUpperCase()}...` });
    try {
      const res = await fetch(`/api/v1/export/${datasetKey}?format=${format}`, {
        headers: {
          'X-User-Role': userRole
        }
      });

      if (res.status === 403) {
        const errorData = await res.json();
        setExportStatus({
          error: true,
          msg: `Access Denied (403): Role '${userRole}' lacks permission to export data. Only 'admin', 'analyst', and 'executive' are authorized.`
        });
        return;
      }

      if (!res.ok) {
        throw new Error(`Export failed with status ${res.status}`);
      }

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `dineiq_${datasetKey}.${format === 'excel' ? 'xlsx' : 'csv'}`;
      document.body.appendChild(a);
      a.click();
      a.remove();

      setExportStatus({
        success: true,
        msg: `Successfully exported ${datasetKey} as ${format.toUpperCase()}!`
      });
    } catch (err) {
      setExportStatus({ error: true, msg: err.message });
    }
  };

  const canExport = ['admin', 'analyst', 'executive'].includes(userRole);

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      background: 'rgba(0, 0, 0, 0.65)',
      backdropFilter: 'blur(6px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '20px'
    }}>
      <div className="glass-card" style={{
        width: '100%',
        maxWidth: '960px',
        maxHeight: '90vh',
        overflowY: 'auto',
        padding: '28px',
        background: 'var(--surface)',
        borderColor: 'var(--border)'
      }}>
        {            }
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              Reports &amp; Data Export Center
            </h2>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              Download analytical reports and export datasets in CSV or Excel.
            </p>
          </div>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}>
            <X size={22} />
          </button>
        </div>

        {                  }
        <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid var(--border)', marginBottom: '20px' }}>
          <button
            onClick={() => setActiveTab('reports')}
            style={{
              padding: '10px 16px',
              fontSize: '0.85rem',
              fontWeight: 600,
              background: 'transparent',
              border: 'none',
              borderBottom: activeTab === 'reports' ? '2px solid var(--primary)' : '2px solid transparent',
              color: activeTab === 'reports' ? 'var(--primary)' : 'var(--text-secondary)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <FileText size={16} />
            <span>Downloadable Reports (Step 49 - 12 Topics)</span>
          </button>

          <button
            onClick={() => setActiveTab('exports')}
            style={{
              padding: '10px 16px',
              fontSize: '0.85rem',
              fontWeight: 600,
              background: 'transparent',
              border: 'none',
              borderBottom: activeTab === 'exports' ? '2px solid var(--primary)' : '2px solid transparent',
              color: activeTab === 'exports' ? 'var(--primary)' : 'var(--text-secondary)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <FileSpreadsheet size={16} />
            <span>Data Export &amp; Permissions (Step 50)</span>
          </button>
        </div>

        {                                           }
        {activeTab === 'reports' && (
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '12px' }}>
              {reports.map((rep) => (
                <div key={rep.report_key} style={{ background: 'var(--surface-secondary)', border: '1px solid var(--border)', borderRadius: '8px', padding: '16px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
                      <span style={{ fontSize: '0.7rem', fontWeight: 700, padding: '2px 8px', borderRadius: '4px', background: 'var(--primary-tint)', color: 'var(--primary)' }}>
                        {rep.category}
                      </span>
                      <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{rep.file_size_kb} KB</span>
                    </div>
                    <h4 style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '4px' }}>
                      {rep.title}
                    </h4>
                    <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: 1.3, marginBottom: '12px' }}>
                      {rep.description}
                    </p>
                  </div>

                  <button
                    onClick={() => handleDownloadReport(rep.report_key)}
                    style={{
                      background: 'var(--surface)',
                      border: '1px solid var(--border)',
                      color: 'var(--text-primary)',
                      padding: '8px 12px',
                      borderRadius: '6px',
                      fontSize: '0.78rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px'
                    }}
                  >
                    <Download size={14} />
                    <span>Download Report (Markdown)</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {                                                   }
        {activeTab === 'exports' && (
          <div>
            {                              }
            <div style={{ background: 'var(--surface-secondary)', border: '1px solid var(--border)', borderRadius: '8px', padding: '14px 18px', marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Lock size={15} color="var(--primary)" />
                  Simulate User Role (RBAC Permissions):
                </span>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                  Step 50 rule: 'Users with suitable permissions should be able to export results'.
                </span>
              </div>

              <div style={{ display: 'flex', gap: '8px' }}>
                {['analyst', 'admin', 'executive', 'viewer'].map(role => (
                  <button
                    key={role}
                    onClick={() => setUserRole(role)}
                    style={{
                      padding: '6px 12px',
                      borderRadius: '6px',
                      fontSize: '0.78rem',
                      fontWeight: 600,
                      border: 'none',
                      cursor: 'pointer',
                      background: userRole === role ? (role === 'viewer' ? 'var(--danger)' : 'var(--primary)') : 'var(--surface)',
                      color: userRole === role ? '#ffffff' : 'var(--text-secondary)',
                      boxShadow: 'var(--shadow-sm)'
                    }}
                  >
                    {role.toUpperCase()} {role === 'viewer' ? '(No Perms)' : '(Authorized)'}
                  </button>
                ))}
              </div>
            </div>

            {                      }
            {!canExport && (
              <div style={{ background: 'var(--danger-tint)', border: '1px solid var(--danger)', borderRadius: '8px', padding: '12px 16px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--danger)', fontSize: '0.85rem' }}>
                <ShieldAlert size={20} />
                <span>
                  <strong>Access Restricted:</strong> Current role '<code>{userRole}</code>' lacks data export privileges. Attempting export will result in HTTP 403 Forbidden.
                </span>
              </div>
            )}

            {                         }
            {exportStatus && (
              <div style={{
                background: exportStatus.error ? 'var(--danger-tint)' : 'var(--success-tint)',
                border: `1px solid ${exportStatus.error ? 'var(--danger)' : 'var(--success)'}`,
                borderRadius: '8px',
                padding: '10px 16px',
                marginBottom: '16px',
                fontSize: '0.85rem',
                color: exportStatus.error ? 'var(--danger)' : 'var(--success)'
              }}>
                {exportStatus.msg}
              </div>
            )}

            {                    }
            <div style={{ overflowX: 'auto' }}>
              <table className="anom-table">
                <thead>
                  <tr>
                    <th>Analytical Dataset</th>
                    <th>Records Available</th>
                    <th>Required Permission</th>
                    <th>Export Formats (Step 50)</th>
                  </tr>
                </thead>
                <tbody>
                  {datasets.map((d) => (
                    <tr key={d.dataset_key}>
                      <td style={{ fontWeight: 600 }}>{d.name}</td>
                      <td>{formatNumber(d?.record_count)} rows</td>
                      <td>
                        <span className="kpi-badge badge-indigo">
                          can_export_data
                        </span>
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: '6px' }}>
                          <button
                            onClick={() => handleExportData(d.dataset_key, 'csv')}
                            style={{
                              background: 'var(--surface-secondary)',
                              border: '1px solid var(--border)',
                              color: 'var(--primary)',
                              padding: '4px 10px',
                              borderRadius: '4px',
                              fontSize: '0.75rem',
                              fontWeight: 600,
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '4px'
                            }}
                          >
                            <Download size={12} />
                            CSV
                          </button>

                          <button
                            onClick={() => handleExportData(d.dataset_key, 'excel')}
                            style={{
                              background: 'var(--surface-secondary)',
                              border: '1px solid var(--border)',
                              color: 'var(--success)',
                              padding: '4px 10px',
                              borderRadius: '4px',
                              fontSize: '0.75rem',
                              fontWeight: 600,
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '4px'
                            }}
                          >
                            <FileSpreadsheet size={12} />
                            Excel (.xlsx)
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
    </div>
  );
}

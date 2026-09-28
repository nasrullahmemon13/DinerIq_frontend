import { BarChart, chartGrid } from '../components/AnalyticsCharts';
import { Link } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Users,
  FileText,
  Lock,
  RefreshCw,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  Clock,
  UserCheck
} from 'lucide-react';

export default function AdminUsersAuditPage({ defaultTab = 'users' }) {
  const [activeTab, setActiveTab] = useState(defaultTab);
  useEffect(() => { setActiveTab(defaultTab); }, [defaultTab]);
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [selectedEventType, setSelectedEventType] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');

  const fetchData = async () => {
    setLoading(true);
    setError('');
    try {
      const [uRes, aRes] = await Promise.all([
        fetch('/api/v1/admin-management/users'),
        fetch('/api/v1/admin-management/audit-logs?limit=150')
      ]);

      if (!uRes.ok || !aRes.ok) throw new Error('Unable to load administration data.');
      if (uRes.ok) {
        const uJson = await uRes.json();
        setUsers(uJson.users || []);
        setRoles(uJson.roles || []);
      }
      if (aRes.ok) {
        const aJson = await aRes.json();
        setAuditLogs(aJson.logs || []);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredLogs = auditLogs.filter((l) => {
    const matchType = selectedEventType === 'All' || l.event_type === selectedEventType;
    const matchStatus = selectedStatus === 'All' || l.status === selectedStatus;
    return matchType && matchStatus;
  });

  return (
    <div style={{ padding: '24px 32px 48px', maxWidth: '1600px', margin: '0 auto' }}>
      {error && <p role="alert">{error}</p>}
      <Link to="/register">Create user account</Link>
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
            System Administration & Security Telemetry
          </h1>
          <p style={{ fontSize: '14px', color: 'var(--text-muted)' }}>
            User role-based access control (RBAC Step 1 / FR-xlix) and persistent immutable audit logs (Step 1 / FR-l).
          </p>
        </div>

        <button
          onClick={fetchData}
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
          <span>Refresh Data</span>
        </button>
      </div>

      {!loading && !error && <div style={chartGrid}>
        {activeTab === 'users' && <BarChart title="Accounts by assigned role" subtitle="Current account directory" unit="accounts" data={[...new Set(users.map(u=>u.role_id))].map(label=>({label:label || 'Unassigned',value:users.filter(u=>u.role_id===label).length}))}/>}
        {activeTab === 'audit' && <BarChart title="Audit events by outcome" subtitle="Current filters within the latest 150 returned events" unit="events" data={[...new Set(filteredLogs.map(l=>l.status))].map(label=>({label:label || 'Unknown',value:filteredLogs.filter(l=>l.status===label).length}))}/>}
        {activeTab === 'audit' && <BarChart title="Audit event categories" subtitle="Current filters within the latest 150 returned events" unit="events" color="#a78bfa" data={[...new Set(filteredLogs.map(l=>l.event_type))].map(label=>({label:label || 'Unknown',value:filteredLogs.filter(l=>l.event_type===label).length}))}/>}
      </div>}
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
          onClick={() => setActiveTab('users')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 18px',
            borderRadius: '8px 8px 0 0',
            border: 'none',
            borderBottom: activeTab === 'users' ? '2px solid #6366f1' : '2px solid transparent',
            background: activeTab === 'users' ? 'rgba(99, 102, 241, 0.08)' : 'transparent',
            color: activeTab === 'users' ? '#6366f1' : 'var(--text-secondary)',
            fontWeight: activeTab === 'users' ? 600 : 500,
            fontSize: '14px',
            cursor: 'pointer'
          }}
        >
          <Users size={16} />
          <span>User Access Control & RBAC ({users.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('audit')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 18px',
            borderRadius: '8px 8px 0 0',
            border: 'none',
            borderBottom: activeTab === 'audit' ? '2px solid #6366f1' : '2px solid transparent',
            background: activeTab === 'audit' ? 'rgba(99, 102, 241, 0.08)' : 'transparent',
            color: activeTab === 'audit' ? '#6366f1' : 'var(--text-secondary)',
            fontWeight: activeTab === 'audit' ? 600 : 500,
            fontSize: '14px',
            cursor: 'pointer'
          }}
        >
          <ShieldCheck size={16} />
          <span>Audit Logs & Security Telemetry ({auditLogs.length})</span>
        </button>
      </div>

      {                                                                 }
      {activeTab === 'users' && (
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '12px', overflow: 'hidden', boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
              <thead>
                <tr style={{ background: 'var(--bg-subtle, rgba(0,0,0,0.02))', borderBottom: '1px solid var(--border)' }}>
                  <th style={{ padding: '14px 20px', fontWeight: 600, color: 'var(--text-muted)' }}>User ID</th>
                  <th style={{ padding: '14px 20px', fontWeight: 600, color: 'var(--text-muted)' }}>Username / Full Name</th>
                  <th style={{ padding: '14px 20px', fontWeight: 600, color: 'var(--text-muted)' }}>Email</th>
                  <th style={{ padding: '14px 20px', fontWeight: 600, color: 'var(--text-muted)' }}>Assigned Role</th>
                  <th style={{ padding: '14px 20px', fontWeight: 600, color: 'var(--text-muted)' }}>Location Scope</th>
                  <th style={{ padding: '14px 20px', fontWeight: 600, color: 'var(--text-muted)', textAlign: 'center' }}>Account Status</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.user_id} style={{ borderBottom: '1px solid var(--border)' }}>
                    <td style={{ padding: '16px 20px', fontFamily: 'monospace', fontWeight: 600, color: '#6366f1' }}>
                      {u.user_id}
                    </td>
                    <td style={{ padding: '16px 20px' }}>
                      <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{u.full_name || u.username}</div>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>@{u.username}</div>
                    </td>
                    <td style={{ padding: '16px 20px', color: 'var(--text-secondary)' }}>
                      {u.email}
                    </td>
                    <td style={{ padding: '16px 20px' }}>
                      <span
                        style={{
                          padding: '3px 8px',
                          borderRadius: '4px',
                          fontSize: '11px',
                          fontWeight: 700,
                          textTransform: 'uppercase',
                          background:
                            u.role_id === 'admin'
                              ? 'rgba(239, 68, 68, 0.12)'
                              : u.role_id === 'analyst'
                              ? 'rgba(99, 102, 241, 0.12)'
                              : 'rgba(16, 185, 129, 0.12)',
                          color:
                            u.role_id === 'admin'
                              ? '#ef4444'
                              : u.role_id === 'analyst'
                              ? '#6366f1'
                              : '#10b981'
                        }}
                      >
                        {u.role_id}
                      </span>
                    </td>
                    <td style={{ padding: '16px 20px', color: 'var(--text-muted)' }}>
                      {u.assigned_location_id || 'System-Wide (All Locations)'}
                    </td>
                    <td style={{ padding: '16px 20px', textAlign: 'center' }}>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: '#10b981', fontWeight: 600, fontSize: '12px' }}>
                        <CheckCircle2 size={14} /> Active
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
      {activeTab === 'audit' && (
        <div>
          {             }
          <div
            style={{
              background: 'var(--surface)',
              border: '1px solid var(--border)',
              borderRadius: '12px',
              padding: '16px',
              marginBottom: '20px',
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              gap: '16px',
              boxShadow: 'var(--shadow-sm)'
            }}
          >
            <select
              value={selectedEventType}
              onChange={(e) => setSelectedEventType(e.target.value)}
              style={{
                background: 'var(--surface)',
                border: '1px solid var(--border)',
                color: 'var(--text-primary)',
                borderRadius: '8px',
                padding: '8px 12px',
                fontSize: '13px',
                outline: 'none',
                cursor: 'pointer'
              }}
            >
              <option value="All">All Event Types</option>
              <option value="PREDICTION">PREDICTION</option>
              <option value="SYSTEM_ERROR">SYSTEM_ERROR</option>
              <option value="AUTH">AUTH</option>
              <option value="DATA_MUTATION">DATA_MUTATION</option>
            </select>

            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              style={{
                background: 'var(--surface)',
                border: '1px solid var(--border)',
                color: 'var(--text-primary)',
                borderRadius: '8px',
                padding: '8px 12px',
                fontSize: '13px',
                outline: 'none',
                cursor: 'pointer'
              }}
            >
              <option value="All">All Statuses</option>
              <option value="SUCCESS">SUCCESS</option>
              <option value="FAILED">FAILED</option>
            </select>

            <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginLeft: 'auto' }}>
              Displaying <strong>{filteredLogs.length}</strong> logged events
            </div>
          </div>

          {           }
          <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '12px', overflow: 'hidden', boxShadow: 'var(--shadow-sm)' }}>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
                <thead>
                  <tr style={{ background: 'var(--bg-subtle, rgba(0,0,0,0.02))', borderBottom: '1px solid var(--border)' }}>
                    <th style={{ padding: '14px 16px', fontWeight: 600, color: 'var(--text-muted)' }}>Timestamp</th>
                    <th style={{ padding: '14px 16px', fontWeight: 600, color: 'var(--text-muted)' }}>Audit ID</th>
                    <th style={{ padding: '14px 16px', fontWeight: 600, color: 'var(--text-muted)' }}>Event Type</th>
                    <th style={{ padding: '14px 16px', fontWeight: 600, color: 'var(--text-muted)' }}>Action</th>
                    <th style={{ padding: '14px 16px', fontWeight: 600, color: 'var(--text-muted)' }}>Actor</th>
                    <th style={{ padding: '14px 16px', fontWeight: 600, color: 'var(--text-muted)' }}>Status</th>
                    <th style={{ padding: '14px 16px', fontWeight: 600, color: 'var(--text-muted)' }}>Details</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredLogs.map((log) => (
                    <tr key={log.audit_id} style={{ borderBottom: '1px solid var(--border)' }}>
                      <td style={{ padding: '12px 16px', color: 'var(--text-muted)', fontSize: '12px' }}>
                        {log.timestamp ? log.timestamp.slice(0, 19).replace('T', ' ') : '—'}
                      </td>
                      <td style={{ padding: '12px 16px', fontFamily: 'monospace', fontWeight: 600, color: '#6366f1' }}>
                        {log.audit_id}
                      </td>
                      <td style={{ padding: '12px 16px', fontWeight: 600 }}>
                        {log.event_type}
                      </td>
                      <td style={{ padding: '12px 16px', color: 'var(--text-secondary)' }}>
                        {log.action}
                      </td>
                      <td style={{ padding: '12px 16px', color: 'var(--text-primary)', fontWeight: 500 }}>
                        {log.actor}
                      </td>
                      <td style={{ padding: '12px 16px' }}>
                        <span
                          style={{
                            padding: '2px 8px',
                            borderRadius: '4px',
                            fontSize: '11px',
                            fontWeight: 700,
                            background: log.status === 'SUCCESS' ? 'rgba(16, 185, 129, 0.12)' : 'rgba(239, 68, 68, 0.12)',
                            color: log.status === 'SUCCESS' ? '#10b981' : '#ef4444'
                          }}
                        >
                          {log.status}
                        </span>
                      </td>
                      <td style={{ padding: '12px 16px', color: 'var(--text-muted)', fontSize: '12px', maxWidth: '300px' }}>
                        {log.details || '—'}
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

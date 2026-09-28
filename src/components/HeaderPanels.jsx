import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { X } from 'lucide-react';
import { NAV_SECTIONS } from './Sidebar';
import { useAuth } from '../context/AuthContext';
import { useFilter } from '../context/FilterContext';
import useDashboardFeeds from '../hooks/useDashboardFeeds';

export function HeaderDialog({ title, onClose, children }) {
  const dialog = useRef(null);
  useEffect(() => {
    const previous = document.activeElement;
    dialog.current.showModal();
    return () => { previous?.focus(); };
  }, []);
  return <dialog ref={dialog} aria-label={title} onCancel={onClose} onClick={e => { if (e.target === e.currentTarget) onClose(); }} style={{ margin: 'auto', width: 'min(620px, 94vw)', maxHeight: '80vh', overflowY: 'auto', padding: 24, borderRadius: 14, border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--text-primary)' }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}><h2 style={{ fontSize: 20 }}>{title}</h2><button aria-label={`Close ${title}`} onClick={onClose}><X size={20} /></button></div>
    {children}
  </dialog>;
}
const rowStyle = { display: 'block', width: '100%', textAlign: 'left', padding: 12, marginTop: 8, borderRadius: 8, border: '1px solid var(--border)', background: 'var(--surface-secondary)', color: 'var(--text-primary)', cursor: 'pointer' };

export function HeaderSearch({ onClose, onAdvanced }) {
  const [query, setQuery] = useState('');
  const { hasRole } = useAuth();
  const { locations, setSelectedLocation } = useFilter();
  const navigate = useNavigate();
  const needle = query.trim().toLowerCase();
  const pages = NAV_SECTIONS.flatMap(section => section.items).filter(item => hasRole(item.allowedRoles) && item.name.toLowerCase().includes(needle));
  const matches = needle ? locations.filter(item => `${item.name} ${item.location_id}`.toLowerCase().includes(needle)) : [];
  const go = path => { onClose(); navigate(path); };
  return <HeaderDialog title="Search" onClose={onClose}>
    <input autoFocus aria-label="Search pages and locations" placeholder="Search menus, customers, locations, insights..." value={query} onChange={e => setQuery(e.target.value)} style={{ ...rowStyle, marginTop: 0 }} />
    <p style={{ marginTop: 12, color: 'var(--text-muted)' }}>Open a page or select a restaurant. Use advanced filters to search menu records.</p>
    {!pages.length && !matches.length && <p role="status">No matching pages or locations.</p>}
    {pages.map(item => <button key={item.path} style={rowStyle} onClick={() => go(item.path)}>{item.name}</button>)}
    {matches.map(item => <button key={item.location_id} style={rowStyle} onClick={() => { setSelectedLocation(item.location_id); go('/dashboard'); }}>{item.name} · {item.location_id}</button>)}
    <button style={rowStyle} onClick={onAdvanced}>Advanced data search & filters</button>
  </HeaderDialog>;
}

export function HeaderNotifications({ onClose }) {
  const { user, hasRole } = useAuth();
  const allowed = hasRole(['admin', 'analyst', 'regional_manager']);
  const { data, errors, loading, refresh } = useDashboardFeeds(allowed ? { alerts: '/api/v1/analytics/recommendations' } : {});
  const navigate = useNavigate();
  const storageKey = `dineiq-read-alerts:${user?.username || user?.id}`;
  const [read, setRead] = useState(() => { try { const saved = JSON.parse(localStorage.getItem(storageKey) || '[]'); return Array.isArray(saved) ? saved : []; } catch { return []; } });
  const alerts = (data.alerts?.recommendations || []).filter(item => /high|critical/i.test(item.priority) && (!item.review || item.review.status === 'pending'));
  const markRead = ids => { const next = [...new Set([...read, ...ids])]; setRead(next); try { localStorage.setItem(storageKey, JSON.stringify(next)); } catch {                                            } };
  return <HeaderDialog title="Notifications" onClose={onClose}>
    <p>High-priority recommendations awaiting review.</p>
    <button style={rowStyle} onClick={refresh} disabled={loading}>Refresh</button>
    {loading && <p role="status">Loading notifications...</p>}
    {errors.alerts && <p role="alert">Unable to load notifications: {errors.alerts}</p>}
    {!loading && !errors.alerts && !alerts.length && <p role="status">No pending notifications for your account.</p>}
    {!!alerts.length && <button style={rowStyle} onClick={() => markRead(alerts.map(item => item.recommendation_id))}>Mark all as read</button>}
    {alerts.map(item => <button key={item.recommendation_id} style={rowStyle} onClick={() => { markRead([item.recommendation_id]); onClose(); navigate('/decisions/recommendations'); }}>
      <strong>{read.includes(item.recommendation_id) ? 'Read' : 'Unread'} · {item.priority}</strong><div>{item.recommended_action}</div><small>{item.target_entity_name}</small>
    </button>)}
  </HeaderDialog>;
}

export function HeaderProfile({ onClose, onLogout, signingOut }) {
  const { user, roleMeta, hasRole } = useAuth();
  const navigate = useNavigate();
  return <HeaderDialog title="My profile" onClose={onClose}>
    <h3>{user.full_name || user.username}</h3>
    <p>{user.username}</p>{user.email && <p>{user.email}</p>}
    <p>{roleMeta.name}</p><p>{roleMeta.description}</p>
    {hasRole(['admin']) && <button style={rowStyle} onClick={() => { onClose(); navigate('/admin/users'); }}>Manage users</button>}
    <button style={rowStyle} disabled={signingOut} onClick={onLogout}>{signingOut ? 'Signing out...' : 'Sign out'}</button>
  </HeaderDialog>;
}

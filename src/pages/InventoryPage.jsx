import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  Package,
  AlertTriangle,
  TrendingDown,
  Plus,
  RefreshCw,
  Store,
  CheckCircle2,
  XCircle,
  Search,
  SlidersHorizontal,
  X,
  Layers,
  Clock,
  Sparkles
} from 'lucide-react';

export default function InventoryPage() {
  const { user, token } = useAuth();
  const userRole = user?.role_id || 'analyst';
  const canRestock = userRole === 'admin' || userRole === 'manager' || userRole === 'regional_manager';

  const [inventory, setInventory] = useState([]);
  const [summary, setSummary] = useState({
    total_monitored_items: 0,
    adequate_stock_count: 0,
    low_stock_warnings: 0,
    critical_stockouts: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [locationFilter, setLocationFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const [restockItem, setRestockItem] = useState(null);
  const [restockQty, setRestockQty] = useState(20);
  const [submitting, setSubmitting] = useState(false);
  const [restockError, setRestockError] = useState(null);

  const getAuthHeaders = useCallback(() => {
    const headers = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;
    if (userRole) headers['X-User-Role'] = userRole;
    return headers;
  }, [token, userRole]);

  const fetchInventory = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (locationFilter !== 'ALL') params.append('location_id', locationFilter);
      if (statusFilter !== 'ALL') params.append('stock_status', statusFilter);
      if (searchQuery.trim()) params.append('search', searchQuery.trim());

      const res = await fetch(`/api/v1/inventory/stock?${params.toString()}`, {
        headers: getAuthHeaders()
      });

      if (!res.ok) {
        throw new Error(`Failed to load inventory: HTTP ${res.status}`);
      }

      const data = await res.json();
      setInventory(data.inventory || []);
      if (data.summary) setSummary(data.summary);
    } catch (err) {
      console.error('Error fetching inventory:', err);
      setError(err.message || 'Unable to connect to inventory tracking service.');
    } finally {
      setLoading(false);
    }
  }, [locationFilter, statusFilter, searchQuery, getAuthHeaders]);

  useEffect(() => {
    fetchInventory();
  }, [fetchInventory]);

  const handleRestockSubmit = async (e) => {
    e.preventDefault();
    if (!restockItem || restockQty <= 0) return;

    setSubmitting(true);
    setRestockError(null);

    try {
      const res = await fetch('/api/v1/inventory/restock', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          inventory_id: restockItem.inventory_id,
          quantity_added: parseInt(restockQty, 10)
        })
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.detail || `Restock request failed: HTTP ${res.status}`);
      }

      setRestockItem(null);
      await fetchInventory();
    } catch (err) {
      console.error('Error replenishing stock:', err);
      setRestockError(err.message || 'Error occurred while saving restock snapshot.');
    } finally {
      setSubmitting(false);
    }
  };

  const formatNumber = (val) => {
    return new Intl.NumberFormat('en-US').format(val || 0);
  };

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
            Inventory Stocking
          </h1>
          <p style={{ fontSize: '14px', color: 'var(--text-muted)' }}>
            Track restaurant stock levels, consumption, and replenishment thresholds.
          </p>
        </div>

        <button
          onClick={() => fetchInventory()}
          title="Refresh inventory"
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
            cursor: 'pointer'
          }}
        >
          <RefreshCw size={15} />
          <span>Refresh</span>
        </button>
      </div>

      {                                                                }
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '14px',
          marginBottom: '24px'
        }}
      >
        {                           }
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '12px', padding: '18px 20px', boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: 'var(--text-muted)', fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            <span>Monitored Items</span>
            <Package size={18} style={{ color: '#3b82f6' }} />
          </div>
          <div style={{ fontSize: '24px', fontWeight: 700, color: 'var(--text-primary)', marginTop: '8px' }}>
            {loading ? '—' : formatNumber(summary.total_monitored_items)}
          </div>
        </div>

        {                    }
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '12px', padding: '18px 20px', boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: 'var(--text-muted)', fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            <span>Adequate Stock</span>
            <CheckCircle2 size={18} style={{ color: '#10b981' }} />
          </div>
          <div style={{ fontSize: '24px', fontWeight: 700, color: '#10b981', marginTop: '8px' }}>
            {loading ? '—' : formatNumber(summary.adequate_stock_count)}
          </div>
        </div>

        {                        }
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '12px', padding: '18px 20px', boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: 'var(--text-muted)', fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            <span>Low Stock Warnings</span>
            <AlertTriangle size={18} style={{ color: '#eab308' }} />
          </div>
          <div style={{ fontSize: '24px', fontWeight: 700, color: '#eab308', marginTop: '8px' }}>
            {loading ? '—' : formatNumber(summary.low_stock_warnings)}
          </div>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>
            Approaching reorder threshold
          </div>
        </div>

        {                        }
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '12px', padding: '18px 20px', boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: 'var(--text-muted)', fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            <span>Critical Stockouts</span>
            <XCircle size={18} style={{ color: '#ef4444' }} />
          </div>
          <div style={{ fontSize: '24px', fontWeight: 700, color: '#ef4444', marginTop: '8px' }}>
            {loading ? '—' : formatNumber(summary.critical_stockouts)}
          </div>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>
            Zero stock on hand
          </div>
        </div>
      </div>

      {                                                                }
      {!loading && summary.total_monitored_items > 0 && (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))',
            gap: '16px',
            marginBottom: '24px'
          }}
        >
          {                                                     }
          <div
            style={{
              background: 'var(--surface)',
              border: '1px solid var(--border)',
              borderRadius: '12px',
              padding: '20px',
              boxShadow: 'var(--shadow-sm)',
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div>
                <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)' }}>
                  Inventory Stock Health Status
                </div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                  Proportion of healthy vs vulnerable ingredient stock
                </div>
              </div>
              <span
                style={{
                  fontSize: '11px',
                  fontWeight: 600,
                  padding: '3px 8px',
                  borderRadius: '6px',
                  background: 'rgba(16, 185, 129, 0.1)',
                  color: '#10b981'
                }}
              >
                Stock Health
              </span>
            </div>

            {(() => {
              const total = summary.total_monitored_items || 1;
              const adequate = summary.adequate_stock_count || 0;
              const low = summary.low_stock_warnings || 0;
              const critical = summary.critical_stockouts || 0;

              const adqPct = Math.round((adequate / total) * 100);
              const lowPct = Math.round((low / total) * 100);
              const critPct = Math.round((critical / total) * 100);

              const radius = 38;
              const circumference = 2 * Math.PI * radius;
              const adqStroke = (adqPct / 100) * circumference;
              const lowStroke = (lowPct / 100) * circumference;
              const critStroke = (critPct / 100) * circumference;

              return (
                <div style={{ display: 'flex', alignItems: 'center', gap: '24px', flex: 1, flexWrap: 'wrap' }}>
                  {               }
                  <div style={{ position: 'relative', width: '130px', height: '130px', flexShrink: 0, margin: '0 auto' }}>
                    <svg width="130" height="130" viewBox="0 0 100 100">
                      <circle cx="50" cy="50" r={radius} fill="transparent" stroke="var(--border)" strokeWidth="12" />
                      {                    }
                      <circle
                        cx="50"
                        cy="50"
                        r={radius}
                        fill="transparent"
                        stroke="#10b981"
                        strokeWidth="12"
                        strokeDasharray={`${adqStroke} ${circumference}`}
                        strokeDashoffset="0"
                        strokeLinecap="round"
                        style={{ transform: 'rotate(-90deg)', transformOrigin: '50px 50px' }}
                      />
                      {                       }
                      <circle
                        cx="50"
                        cy="50"
                        r={radius}
                        fill="transparent"
                        stroke="#eab308"
                        strokeWidth="12"
                        strokeDasharray={`${lowStroke} ${circumference}`}
                        strokeDashoffset={`${-adqStroke}`}
                        strokeLinecap="round"
                        style={{ transform: 'rotate(-90deg)', transformOrigin: '50px 50px' }}
                      />
                      {                       }
                      {critical > 0 && (
                        <circle
                          cx="50"
                          cy="50"
                          r={radius}
                          fill="transparent"
                          stroke="#ef4444"
                          strokeWidth="12"
                          strokeDasharray={`${critStroke} ${circumference}`}
                          strokeDashoffset={`${-(adqStroke + lowStroke)}`}
                          strokeLinecap="round"
                          style={{ transform: 'rotate(-90deg)', transformOrigin: '50px 50px' }}
                        />
                      )}
                    </svg>
                    <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center' }}>
                      <div style={{ fontSize: '18px', fontWeight: 800, color: '#10b981', lineHeight: 1 }}>
                        {adqPct}%
                      </div>
                      <div style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase', marginTop: '2px' }}>
                        Adequate
                      </div>
                    </div>
                  </div>

                  {            }
                  <div style={{ flex: 1, minWidth: '180px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ width: '10px', height: '10px', borderRadius: '3px', background: '#10b981' }} />
                        <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>Adequate Stock</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{adequate.toLocaleString()}</span>
                        <span style={{ color: 'var(--text-muted)', fontSize: '11px' }}>({adqPct}%)</span>
                      </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ width: '10px', height: '10px', borderRadius: '3px', background: '#eab308' }} />
                        <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>Low Stock Warnings</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ fontWeight: 600, color: '#eab308' }}>{low.toLocaleString()}</span>
                        <span style={{ color: 'var(--text-muted)', fontSize: '11px' }}>({lowPct}%)</span>
                      </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ width: '10px', height: '10px', borderRadius: '3px', background: '#ef4444' }} />
                        <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>Critical Stockouts</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ fontWeight: 600, color: '#ef4444' }}>{critical.toLocaleString()}</span>
                        <span style={{ color: 'var(--text-muted)', fontSize: '11px' }}>({critPct}%)</span>
                      </div>
                    </div>

                    <div style={{ borderTop: '1px solid var(--border)', paddingTop: '8px', fontSize: '11px', color: 'var(--text-muted)' }}>
                      Total Monitored Items: <strong style={{ color: 'var(--text-primary)' }}>{total.toLocaleString()} SKUs</strong> across 20 locations.
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>

          {                                       }
          <div
            style={{
              background: 'var(--surface)',
              border: '1px solid var(--border)',
              borderRadius: '12px',
              padding: '20px',
              boxShadow: 'var(--shadow-sm)',
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div>
                <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)' }}>
                  Reorder Urgency & Depletion Index
                </div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                  Items with highest replenishment priority (Stock vs Threshold)
                </div>
              </div>
              <span
                style={{
                  fontSize: '11px',
                  fontWeight: 600,
                  padding: '3px 8px',
                  borderRadius: '6px',
                  background: 'rgba(234, 179, 8, 0.1)',
                  color: '#eab308'
                }}
              >
                Urgent Replenish
              </span>
            </div>

            {                            }
            {(() => {
              const vulnerable = [...inventory]
                .filter((i) => i.stock_status === 'LOW_STOCK' || i.stock_status === 'CRITICAL' || (i.ending_stock <= i.reorder_point * 1.2))
                .slice(0, 4);

              const itemsToShow = vulnerable.length > 0 ? vulnerable : inventory.slice(0, 4);

              return (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', flex: 1, justifyContent: 'center' }}>
                  {itemsToShow.map((item, idx) => {
                    const stock = item.ending_stock || 0;
                    const reorder = item.reorder_point ?? 0;
                    const ratio = reorder > 0 ? Math.min(Math.round((stock / (reorder * 2)) * 100), 100) : 0;
                    const isCrit = stock <= reorder;

                    return (
                      <div key={item.inventory_id || idx} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{item.item_name}</span>
                            <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>({item.location_name?.split(' ')[0]})</span>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ fontSize: '11px', color: isCrit ? '#ef4444' : '#eab308', fontWeight: 600 }}>
                              {stock} / {reorder} reorder
                            </span>
                            {canRestock && (
                              <button
                                onClick={() => handleOpenRestock(item)}
                                style={{
                                  padding: '2px 8px',
                                  fontSize: '11px',
                                  fontWeight: 600,
                                  borderRadius: '4px',
                                  border: '1px solid var(--border)',
                                  background: 'var(--surface-secondary)',
                                  color: 'var(--text-primary)',
                                  cursor: 'pointer'
                                }}
                              >
                                Restock
                              </button>
                            )}
                          </div>
                        </div>
                        <div style={{ width: '100%', height: '8px', background: 'var(--surface-secondary)', borderRadius: '4px', overflow: 'hidden' }}>
                          <div
                            style={{
                              width: `${Math.max(0, ratio)}%`,
                              height: '100%',
                              background: isCrit ? '#ef4444' : '#eab308',
                              borderRadius: '4px',
                              transition: 'width 0.6s ease'
                            }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              );
            })()}
          </div>
        </div>
      )}

      {                                                                }
      <div
        style={{
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          borderRadius: '12px',
          padding: '16px',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '12px',
          marginBottom: '20px',
          boxShadow: 'var(--shadow-sm)'
        }}
      >
        <div style={{ position: 'relative', flex: '1 1 260px', maxWidth: '380px' }}>
          <Search
            size={16}
            style={{
              position: 'absolute',
              left: '12px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--text-muted)'
            }}
          />
          <input
            type="text"
            placeholder="Search ingredient or menu dish..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '8px 12px 8px 36px',
              borderRadius: '8px',
              border: '1px solid var(--border)',
              background: 'var(--background)',
              color: 'var(--text-primary)',
              fontSize: '13px',
              outline: 'none'
            }}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {                   }
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{
              padding: '8px 12px',
              borderRadius: '8px',
              border: '1px solid var(--border)',
              background: 'var(--background)',
              color: 'var(--text-primary)',
              fontSize: '13px',
              outline: 'none',
              cursor: 'pointer'
            }}
          >
            <option value="ALL">All Stock Statuses</option>
            <option value="LOW">Low Stock Warnings</option>
            <option value="CRITICAL">Critical Stockouts</option>
            <option value="ADEQUATE">Adequate Levels</option>
          </select>
        </div>
      </div>

      {                                                                }
      {error && (
        <div
          style={{
            background: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            borderRadius: '10px',
            padding: '16px 20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '16px',
            marginBottom: '20px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#ef4444' }}>
            <AlertTriangle size={20} />
            <span style={{ fontSize: '14px', fontWeight: 500 }}>{error}</span>
          </div>
          <button
            onClick={() => fetchInventory()}
            style={{
              padding: '6px 14px',
              borderRadius: '6px',
              border: 'none',
              background: '#ef4444',
              color: '#ffffff',
              fontSize: '13px',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            Retry
          </button>
        </div>
      )}

      {                                                                }
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
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '950px' }}>
            <thead>
              <tr
                style={{
                  background: 'var(--background)',
                  borderBottom: '1px solid var(--border)',
                  color: 'var(--text-muted)',
                  fontSize: '12px',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em'
                }}
              >
                <th style={{ padding: '14px 18px', width: '130px' }}>Inventory ID</th>
                <th style={{ padding: '14px 18px' }}>Item / Dish Name</th>
                <th style={{ padding: '14px 18px' }}>Store Location</th>
                <th style={{ padding: '14px 18px', textAlign: 'right' }}>Start Stock</th>
                <th style={{ padding: '14px 18px', textAlign: 'right' }}>Received</th>
                <th style={{ padding: '14px 18px', textAlign: 'right' }}>Sold</th>
                <th style={{ padding: '14px 18px', textAlign: 'right' }}>Wasted</th>
                <th style={{ padding: '14px 18px', textAlign: 'right', fontWeight: 700 }}>Ending Stock</th>
                <th style={{ padding: '14px 18px', textAlign: 'center', width: '110px' }}>Status</th>
                {canRestock && (
                  <th style={{ padding: '14px 18px', textAlign: 'center', width: '100px' }}>Action</th>
                )}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                [...Array(8)].map((_, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid var(--border)' }}>
                    <td style={{ padding: '16px 18px' }}><div style={{ height: '18px', width: '90px', background: 'var(--border)', borderRadius: '4px' }} /></td>
                    <td style={{ padding: '16px 18px' }}><div style={{ height: '18px', width: '160px', background: 'var(--border)', borderRadius: '4px' }} /></td>
                    <td style={{ padding: '16px 18px' }}><div style={{ height: '18px', width: '130px', background: 'var(--border)', borderRadius: '4px' }} /></td>
                    <td style={{ padding: '16px 18px' }}><div style={{ height: '18px', width: '45px', background: 'var(--border)', borderRadius: '4px', marginLeft: 'auto' }} /></td>
                    <td style={{ padding: '16px 18px' }}><div style={{ height: '18px', width: '45px', background: 'var(--border)', borderRadius: '4px', marginLeft: 'auto' }} /></td>
                    <td style={{ padding: '16px 18px' }}><div style={{ height: '18px', width: '45px', background: 'var(--border)', borderRadius: '4px', marginLeft: 'auto' }} /></td>
                    <td style={{ padding: '16px 18px' }}><div style={{ height: '18px', width: '45px', background: 'var(--border)', borderRadius: '4px', marginLeft: 'auto' }} /></td>
                    <td style={{ padding: '16px 18px' }}><div style={{ height: '18px', width: '50px', background: 'var(--border)', borderRadius: '4px', marginLeft: 'auto' }} /></td>
                    <td style={{ padding: '16px 18px' }}><div style={{ height: '18px', width: '80px', background: 'var(--border)', borderRadius: '12px', margin: '0 auto' }} /></td>
                    {canRestock && (
                      <td style={{ padding: '16px 18px' }}><div style={{ height: '24px', width: '60px', background: 'var(--border)', borderRadius: '6px', margin: '0 auto' }} /></td>
                    )}
                  </tr>
                ))
              ) : inventory.length === 0 ? (
                <tr>
                  <td colSpan={10} style={{ padding: '64px 20px', textAlign: 'center' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
                      <div
                        style={{
                          width: '56px',
                          height: '56px',
                          borderRadius: '50%',
                          background: 'rgba(59, 130, 246, 0.1)',
                          color: '#3b82f6',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        <Package size={28} />
                      </div>
                      <div style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text-primary)' }}>
                        No inventory records found.
                      </div>
                      <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                        No stock items matched your search criteria.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                inventory.map((inv) => {
                  const isOut = inv.stock_status === 'OUT_OF_STOCK';
                  const isLow = inv.stock_status === 'LOW_STOCK';

                  return (
                    <tr
                      key={inv.inventory_id}
                      style={{
                        borderBottom: '1px solid var(--border)',
                        transition: 'background-color 0.15s ease'
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--background)')}
                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                    >
                      {        }
                      <td style={{ padding: '14px 18px' }}>
                        <span
                          style={{
                            fontFamily: 'monospace',
                            fontSize: '11px',
                            fontWeight: 600,
                            padding: '2px 6px',
                            borderRadius: '4px',
                            background: 'var(--surface-secondary)',
                            border: '1px solid var(--border)',
                            color: 'var(--text-secondary)'
                          }}
                        >
                          {inv.inventory_id}
                        </span>
                      </td>

                      {          }
                      <td style={{ padding: '14px 18px' }}>
                        <div style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '13px' }}>
                          {inv.item_name}
                        </div>
                        <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>
                          {inv.item_id} • Shelf life: {inv.shelf_life_days}d
                        </div>
                      </td>

                      {              }
                      <td style={{ padding: '14px 18px', fontSize: '13px', color: 'var(--text-secondary)' }}>
                        <div style={{ fontWeight: 500, color: 'var(--text-primary)' }}>{inv.location_name}</div>
                        <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{inv.location_id}</div>
                      </td>

                      {              }
                      <td style={{ padding: '14px 18px', textAlign: 'right', color: 'var(--text-secondary)' }}>
                        {inv.starting_stock}
                      </td>

                      {              }
                      <td style={{ padding: '14px 18px', textAlign: 'right', color: '#10b981' }}>
                        +{inv.quantity_received}
                      </td>

                      {          }
                      <td style={{ padding: '14px 18px', textAlign: 'right', color: 'var(--text-secondary)' }}>
                        -{inv.quantity_sold}
                      </td>

                      {            }
                      <td style={{ padding: '14px 18px', textAlign: 'right', color: inv.quantity_wasted > 0 ? '#ef4444' : 'var(--text-muted)' }}>
                        {inv.quantity_wasted > 0 ? `-${inv.quantity_wasted}` : '0'}
                      </td>

                      {                  }
                      <td style={{ padding: '14px 18px', textAlign: 'right', fontWeight: 700, fontSize: '14px', color: isOut ? '#ef4444' : isLow ? '#eab308' : 'var(--text-primary)' }}>
                        {inv.ending_stock}
                        <span style={{ fontSize: '11px', fontWeight: 400, color: 'var(--text-muted)', marginLeft: '4px' }}>
                          (min {inv.reorder_point})
                        </span>
                      </td>

                      {            }
                      <td style={{ padding: '14px 18px', textAlign: 'center' }}>
                        <span
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                            padding: '3px 8px',
                            borderRadius: '12px',
                            fontSize: '11px',
                            fontWeight: 600,
                            background: isOut
                              ? 'rgba(239, 68, 68, 0.12)'
                              : isLow
                              ? 'rgba(234, 179, 8, 0.12)'
                              : 'rgba(16, 185, 129, 0.12)',
                            color: isOut ? '#ef4444' : isLow ? '#eab308' : '#10b981'
                          }}
                        >
                          {isOut ? 'Stockout' : isLow ? 'Low Stock' : 'Adequate'}
                        </span>
                      </td>

                      {            }
                      {canRestock && (
                        <td style={{ padding: '14px 18px', textAlign: 'center' }}>
                          <button
                            onClick={() => {
                              setRestockItem(inv);
                              setRestockQty(25);
                              setRestockError(null);
                            }}
                            style={{
                              padding: '5px 10px',
                              borderRadius: '6px',
                              border: '1px solid var(--border)',
                              background: 'transparent',
                              color: 'var(--text-primary)',
                              fontSize: '12px',
                              fontWeight: 500,
                              cursor: 'pointer'
                            }}
                          >
                            Restock
                          </button>
                        </td>
                      )}
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {                                                                }
      {restockItem && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.65)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '16px'
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget && !submitting) setRestockItem(null);
          }}
        >
          <div
            style={{
              background: 'var(--surface)',
              border: '1px solid var(--border)',
              borderRadius: '14px',
              width: '100%',
              maxWidth: '440px',
              boxShadow: 'var(--shadow-lg)',
              overflow: 'hidden'
            }}
          >
            <div
              style={{
                padding: '20px 24px',
                borderBottom: '1px solid var(--border)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}
            >
              <div>
                <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)' }}>
                  Replenish Stock
                </h3>
                <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '2px' }}>
                  {restockItem.item_name} ({restockItem.location_name})
                </p>
              </div>
              <button
                onClick={() => setRestockItem(null)}
                disabled={submitting}
                style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleRestockSubmit} style={{ padding: '24px' }}>
              {restockError && (
                <div
                  style={{
                    background: 'rgba(239, 68, 68, 0.1)',
                    border: '1px solid rgba(239, 68, 68, 0.25)',
                    borderRadius: '8px',
                    padding: '10px 14px',
                    fontSize: '13px',
                    color: '#ef4444',
                    marginBottom: '16px'
                  }}
                >
                  {restockError}
                </div>
              )}

              <div style={{ marginBottom: '16px' }}>
                <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '8px' }}>
                  Current ending stock: <strong>{restockItem.ending_stock} units</strong> (Reorder point: {restockItem.reorder_point})
                </div>

                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                  Quantity to Add *
                </label>
                <input
                  type="number"
                  min="1"
                  max="1000"
                  value={restockQty}
                  onChange={(e) => setRestockQty(e.target.value)}
                  required
                  style={{
                    width: '100%',
                    padding: '9px 12px',
                    borderRadius: '8px',
                    border: '1px solid var(--border)',
                    background: 'var(--background)',
                    color: 'var(--text-primary)',
                    fontSize: '14px',
                    outline: 'none'
                  }}
                />
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '12px' }}>
                <button
                  type="button"
                  onClick={() => setRestockItem(null)}
                  disabled={submitting}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '8px',
                    border: '1px solid var(--border)',
                    background: 'transparent',
                    color: 'var(--text-secondary)',
                    fontSize: '13px',
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  style={{
                    padding: '8px 18px',
                    borderRadius: '8px',
                    border: 'none',
                    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                    color: '#ffffff',
                    fontSize: '13px',
                    fontWeight: 600,
                    cursor: submitting ? 'not-allowed' : 'pointer',
                    boxShadow: '0 2px 8px rgba(16, 185, 129, 0.25)'
                  }}
                >
                  {submitting ? 'Updating...' : 'Confirm Restock'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

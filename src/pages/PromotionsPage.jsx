import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  BadgePercent,
  Tag,
  Plus,
  Pencil,
  Eye,
  Trash2,
  Calendar,
  DollarSign,
  AlertTriangle,
  TrendingUp,
  Users,
  CheckCircle2,
  XCircle,
  Search,
  SlidersHorizontal,
  RefreshCw,
  X,
  ShoppingBag,
  Sparkles,
  Info
} from 'lucide-react';

export default function PromotionsPage() {
  const { user, token } = useAuth();
  const userRole = user?.role_id || 'analyst';
  const canManagePromo = userRole === 'admin' || userRole === 'regional_manager';

  const [promotions, setPromotions] = useState([]);
  const [summary, setSummary] = useState({
    total_promotions: 0,
    active_promotions: 0,
    promotion_orders: 0,
    promotion_revenue: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const [selectedPromo, setSelectedPromo] = useState(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('create');
  const [editingPromoId, setEditingPromoId] = useState(null);
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [formError, setFormError] = useState(null);

  const [formName, setFormName] = useState('');
  const [formType, setFormType] = useState('PERCENTAGE');
  const [formValue, setFormValue] = useState(15.0);
  const [formMinOrder, setFormMinOrder] = useState(0.0);
  const [formMaxDiscount, setFormMaxDiscount] = useState(50.0);
  const [formCategory, setFormCategory] = useState('ALL');
  const [formStartDate, setFormStartDate] = useState('');
  const [formEndDate, setFormEndDate] = useState('');
  const [formSegment, setFormSegment] = useState('ALL');
  const [formDescription, setFormDescription] = useState('');

  const getAuthHeaders = useCallback(() => {
    const headers = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;
    if (userRole) headers['X-User-Role'] = userRole;
    return headers;
  }, [token, userRole]);

  const fetchPromotions = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (searchQuery.trim()) params.append('search', searchQuery.trim());
      if (statusFilter !== 'ALL') params.append('status_filter', statusFilter);

      const res = await fetch(`/api/v1/promotions/analytics?${params.toString()}`, {
        headers: getAuthHeaders()
      });

      if (!res.ok) {
        throw new Error(`Failed to load promotions: HTTP ${res.status}`);
      }

      const data = await res.json();
      setPromotions(data.promotions || []);
      if (data.summary) setSummary(data.summary);
    } catch (err) {
      console.error('Error fetching promotions:', err);
      setError(err.message || 'Unable to connect to promotion management service.');
    } finally {
      setLoading(false);
    }
  }, [searchQuery, statusFilter, getAuthHeaders]);

  useEffect(() => {
    fetchPromotions();
  }, [fetchPromotions]);

  const handleOpenCreateModal = () => {
    setModalMode('create');
    setEditingPromoId(null);
    setFormName('');
    setFormType('PERCENTAGE');
    setFormValue(15.0);
    setFormMinOrder(0.0);
    setFormMaxDiscount(50.0);
    setFormCategory('ALL');
    setFormStartDate(new Date().toISOString().split('T')[0]);
    setFormEndDate('');
    setFormSegment('ALL');
    setFormDescription('');
    setFormError(null);
    setModalOpen(true);
  };

  const handleOpenEditModal = (p) => {
    setModalMode('edit');
    setEditingPromoId(p.promotion_id);
    setFormName(p.promotion_name);
    setFormType(p.discount_type);
    setFormValue(p.discount_value);
    setFormMinOrder(p.min_order_amount || 0.0);
    setFormMaxDiscount(p.max_discount_amount ?? 50.0);
    setFormCategory(p.applicable_category || 'ALL');
    setFormStartDate(p.start_date || '');
    setFormEndDate(p.end_date || '');
    setFormSegment(p.target_segment || 'ALL');
    setFormDescription(p.description || '');
    setFormError(null);
    setModalOpen(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!formName.trim()) {
      setFormError('Promotion campaign name is required.');
      return;
    }

    setFormSubmitting(true);
    setFormError(null);

    const payload = {
      promotion_name: formName.trim(),
      discount_type: formType,
      discount_value: parseFloat(formValue) || 0.0,
      min_order_amount: parseFloat(formMinOrder) || 0.0,
      max_discount_amount: Number.isFinite(parseFloat(formMaxDiscount)) ? parseFloat(formMaxDiscount) : 50.0,
      applicable_category: formCategory,
      start_date: formStartDate || null,
      end_date: formEndDate || null,
      target_segment: formSegment,
      description: formDescription.trim() || null
    };

    try {
      if (modalMode === 'create') {
        const res = await fetch('/api/v1/promotions', {
          method: 'POST',
          headers: getAuthHeaders(),
          body: JSON.stringify(payload)
        });
        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          throw new Error(errData.detail || `Server returned error ${res.status}`);
        }
      } else {
        const res = await fetch(`/api/v1/promotions/${editingPromoId}`, {
          method: 'PUT',
          headers: getAuthHeaders(),
          body: JSON.stringify(payload)
        });
        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          throw new Error(errData.detail || `Server returned error ${res.status}`);
        }
      }

      setModalOpen(false);
      await fetchPromotions();
    } catch (err) {
      console.error('Error saving promotion:', err);
      setFormError(err.message || 'An error occurred while saving.');
    } finally {
      setFormSubmitting(false);
    }
  };

  const handleDeletePromo = async (promoId, name) => {
    if (!window.confirm(`Are you sure you want to delete campaign '${name}' (${promoId})?`)) return;

    try {
      const res = await fetch(`/api/v1/promotions/${promoId}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });
      if (!res.ok) {
        throw new Error(`Failed to delete campaign: HTTP ${res.status}`);
      }
      if (selectedPromo && selectedPromo.promotion_id === promoId) {
        setSelectedPromo(null);
      }
      await fetchPromotions();
    } catch (err) {
      alert(`Error deleting promotion: ${err.message}`);
    }
  };

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(val || 0);
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
            Promotions
          </h1>
          <p style={{ fontSize: '14px', color: 'var(--text-muted)' }}>
            Manage promotional discount campaigns and marketing rules.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button
            onClick={() => fetchPromotions()}
            title="Refresh promotions"
            style={{
              padding: '9px',
              borderRadius: '8px',
              border: '1px solid var(--border)',
              background: 'var(--surface)',
              color: 'var(--text-secondary)',
              cursor: 'pointer',
              display: 'flex'
            }}
          >
            <RefreshCw size={16} />
          </button>

          {canManagePromo && (
            <button
              onClick={handleOpenCreateModal}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '9px 16px',
                borderRadius: '8px',
                border: 'none',
                background: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',
                color: '#ffffff',
                fontWeight: 600,
                fontSize: '13px',
                cursor: 'pointer',
                boxShadow: '0 2px 8px rgba(249, 115, 22, 0.25)'
              }}
            >
              <Plus size={16} />
              <span>Add Promotion</span>
            </button>
          )}
        </div>
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
        {                      }
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '12px', padding: '18px 20px', boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: 'var(--text-muted)', fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            <span>Total Promotions</span>
            <BadgePercent size={18} style={{ color: '#3b82f6' }} />
          </div>
          <div style={{ fontSize: '24px', fontWeight: 700, color: 'var(--text-primary)', marginTop: '8px' }}>
            {loading ? '—' : summary.total_promotions}
          </div>
        </div>

        {                       }
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '12px', padding: '18px 20px', boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: 'var(--text-muted)', fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            <span>Active Campaigns</span>
            <CheckCircle2 size={18} style={{ color: '#10b981' }} />
          </div>
          <div style={{ fontSize: '24px', fontWeight: 700, color: '#10b981', marginTop: '8px' }}>
            {loading ? '—' : summary.active_promotions}
          </div>
        </div>

        {                      }
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '12px', padding: '18px 20px', boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: 'var(--text-muted)', fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            <span>Promoted Orders</span>
            <ShoppingBag size={18} style={{ color: '#a855f7' }} />
          </div>
          <div style={{ fontSize: '24px', fontWeight: 700, color: 'var(--text-primary)', marginTop: '8px' }}>
            {loading ? '—' : formatNumber(summary.promotion_orders)}
          </div>
        </div>

        {                       }
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '12px', padding: '18px 20px', boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: 'var(--text-muted)', fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            <span>Promoted Revenue</span>
            <DollarSign size={18} style={{ color: '#f97316' }} />
          </div>
          <div style={{ fontSize: '24px', fontWeight: 700, color: 'var(--text-primary)', marginTop: '8px' }}>
            {loading ? '—' : formatCurrency(summary.promotion_revenue)}
          </div>
        </div>
      </div>

      {                                                               }
      {!loading && promotions.length > 0 && (
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
                  Campaign Financial ROI & Spoilage Impact
                </div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                  Promoted gross sales vs net margin and kitchen waste loss
                </div>
              </div>
              <span
                style={{
                  fontSize: '11px',
                  fontWeight: 600,
                  padding: '3px 8px',
                  borderRadius: '6px',
                  background: 'rgba(249, 115, 22, 0.1)',
                  color: '#f97316'
                }}
              >
                Top Campaigns
              </span>
            </div>

            {                                      }
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', flex: 1, justifyContent: 'center' }}>
              {(() => {
                const top4 = [...promotions]
                  .sort((a, b) => (b.promotional_revenue || 0) - (a.promotional_revenue || 0))
                  .slice(0, 4);
                const maxRev = Math.max(...top4.map((p) => p.promotional_revenue || 1), 1);

                return top4.map((p, idx) => {
                  const rev = p.promotional_revenue || 0;
                  const margin = p.contribution_margin_dollars || 0;
                  const waste = p.wasted_loss_amount || 0;
                  const revPct = Math.min(Math.round((rev / maxRev) * 100), 100);
                  const marginPct = rev > 0 ? Math.min(Math.round((margin / maxRev) * 100), 100) : 0;
                  const isTrap = p.evaluation_status && p.evaluation_status.includes('FAILED');

                  return (
                    <div key={p.promotion_id || idx} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{p.promotion_name}</span>
                          {isTrap && (
                            <span style={{ fontSize: '10px', fontWeight: 700, padding: '1px 5px', borderRadius: '4px', background: 'rgba(239, 68, 68, 0.15)', color: '#ef4444' }}>
                              TRAP
                            </span>
                          )}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ color: 'var(--text-muted)', fontSize: '11px' }}>Margin: ${Math.round(margin / 1000)}k</span>
                          <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>${Math.round(rev / 1000)}k</span>
                        </div>
                      </div>
                      {                                           }
                      <div style={{ width: '100%', height: '8px', background: 'var(--surface-secondary)', borderRadius: '4px', overflow: 'hidden', position: 'relative' }}>
                        <div
                          style={{
                            width: `${revPct}%`,
                            height: '100%',
                            background: isTrap ? 'linear-gradient(90deg, #f97316 0%, #ef4444 100%)' : '#3b82f6',
                            borderRadius: '4px'
                          }}
                        />
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: 'var(--text-muted)' }}>
                        <span>Discount: {p.discount_value}% {p.discount_type}</span>
                        <span style={{ color: isTrap ? '#ef4444' : '#10b981', fontWeight: 600 }}>
                          Profit Margin: {p.profit_margin_pct}% {waste > 0 ? `| Waste: $${Math.round(waste / 1000)}k` : ''}
                        </span>
                      </div>
                    </div>
                  );
                });
              })()}
            </div>
          </div>

          {                                                         }
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
                  Promotion Health & Trap Detection
                </div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                  Profitable campaigns vs value-destroying margin traps
                </div>
              </div>
              <span
                style={{
                  fontSize: '11px',
                  fontWeight: 600,
                  padding: '3px 8px',
                  borderRadius: '6px',
                  background: 'rgba(239, 68, 68, 0.1)',
                  color: '#ef4444'
                }}
              >
                Risk Audit
              </span>
            </div>

            {                   }
            {(() => {
              const trapCount = promotions.filter(
                (p) => p.evaluation_status && p.evaluation_status.includes('FAILED')
              ).length;
              const healthyCount = Math.max(0, promotions.length - trapCount);
              const total = promotions.length || 1;
              const trapPct = Math.round((trapCount / total) * 100);
              const healthyPct = 100 - trapPct;

              const radius = 38;
              const circumference = 2 * Math.PI * radius;
              const healthyStroke = (healthyPct / 100) * circumference;
              const trapStroke = (trapPct / 100) * circumference;

              return (
                <div style={{ display: 'flex', alignItems: 'center', gap: '24px', flex: 1, flexWrap: 'wrap' }}>
                  {               }
                  <div style={{ position: 'relative', width: '130px', height: '130px', flexShrink: 0, margin: '0 auto' }}>
                    <svg width="130" height="130" viewBox="0 0 100 100">
                      <circle cx="50" cy="50" r={radius} fill="transparent" stroke="var(--border)" strokeWidth="12" />
                      {                     }
                      <circle
                        cx="50"
                        cy="50"
                        r={radius}
                        fill="transparent"
                        stroke="#10b981"
                        strokeWidth="12"
                        strokeDasharray={`${healthyStroke} ${circumference}`}
                        strokeDashoffset="0"
                        strokeLinecap="round"
                        style={{ transform: 'rotate(-90deg)', transformOrigin: '50px 50px' }}
                      />
                      {                  }
                      {trapCount > 0 && (
                        <circle
                          cx="50"
                          cy="50"
                          r={radius}
                          fill="transparent"
                          stroke="#ef4444"
                          strokeWidth="12"
                          strokeDasharray={`${trapStroke} ${circumference}`}
                          strokeDashoffset={`${-healthyStroke}`}
                          strokeLinecap="round"
                          style={{ transform: 'rotate(-90deg)', transformOrigin: '50px 50px' }}
                        />
                      )}
                    </svg>
                    <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center' }}>
                      <div style={{ fontSize: '18px', fontWeight: 800, color: trapCount > 0 ? '#ef4444' : '#10b981', lineHeight: 1 }}>
                        {trapCount}
                      </div>
                      <div style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase', marginTop: '2px' }}>
                        Traps
                      </div>
                    </div>
                  </div>

                  {                            }
                  <div style={{ flex: 1, minWidth: '180px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ width: '10px', height: '10px', borderRadius: '3px', background: '#10b981' }} />
                        <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>Healthy ROI Campaigns</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{healthyCount}</span>
                        <span style={{ color: 'var(--text-muted)', fontSize: '11px' }}>({healthyPct}%)</span>
                      </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ width: '10px', height: '10px', borderRadius: '3px', background: '#ef4444' }} />
                        <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>Margin Traps Detected</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ fontWeight: 600, color: '#ef4444' }}>{trapCount}</span>
                        <span style={{ color: 'var(--text-muted)', fontSize: '11px' }}>({trapPct}%)</span>
                      </div>
                    </div>

                    <div style={{ borderTop: '1px solid var(--border)', paddingTop: '8px', fontSize: '11px', color: 'var(--text-muted)', lineHeight: 1.4 }}>
                      ⚠️ <strong style={{ color: 'var(--text-primary)' }}>Audit Criteria:</strong> Campaigns with &gt;15% discount triggering margin contraction or excessive inventory loss.
                    </div>
                  </div>
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
            placeholder="Search campaign name or ID..."
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
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              style={{
                position: 'absolute',
                right: '10px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'transparent',
                border: 'none',
                color: 'var(--text-muted)',
                cursor: 'pointer'
              }}
            >
              <X size={14} />
            </button>
          )}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <SlidersHorizontal size={14} style={{ color: 'var(--text-muted)' }} />
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
            <option value="ALL">All Statuses</option>
            <option value="ACTIVE">Active Campaigns</option>
            <option value="EXPIRED">Expired / Inactive</option>
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
            onClick={() => fetchPromotions()}
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
                <th style={{ padding: '14px 18px', width: '130px' }}>Promotion ID</th>
                <th style={{ padding: '14px 18px' }}>Campaign</th>
                <th style={{ padding: '14px 18px' }}>Discount</th>
                <th style={{ padding: '14px 18px' }}>Campaign Period</th>
                <th style={{ padding: '14px 18px' }}>Applicable Items</th>
                <th style={{ padding: '14px 18px', textAlign: 'right' }}>Usage</th>
                <th style={{ padding: '14px 18px', textAlign: 'right' }}>Revenue</th>
                <th style={{ padding: '14px 18px', width: '90px' }}>Status</th>
                <th style={{ padding: '14px 18px', textAlign: 'center', width: '120px' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                [...Array(6)].map((_, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid var(--border)' }}>
                    <td style={{ padding: '16px 18px' }}><div style={{ height: '18px', width: '80px', background: 'var(--border)', borderRadius: '4px' }} /></td>
                    <td style={{ padding: '16px 18px' }}><div style={{ height: '18px', width: '180px', background: 'var(--border)', borderRadius: '4px' }} /></td>
                    <td style={{ padding: '16px 18px' }}><div style={{ height: '18px', width: '90px', background: 'var(--border)', borderRadius: '4px' }} /></td>
                    <td style={{ padding: '16px 18px' }}><div style={{ height: '18px', width: '140px', background: 'var(--border)', borderRadius: '4px' }} /></td>
                    <td style={{ padding: '16px 18px' }}><div style={{ height: '18px', width: '80px', background: 'var(--border)', borderRadius: '4px' }} /></td>
                    <td style={{ padding: '16px 18px' }}><div style={{ height: '18px', width: '60px', background: 'var(--border)', borderRadius: '4px', marginLeft: 'auto' }} /></td>
                    <td style={{ padding: '16px 18px' }}><div style={{ height: '18px', width: '80px', background: 'var(--border)', borderRadius: '4px', marginLeft: 'auto' }} /></td>
                    <td style={{ padding: '16px 18px' }}><div style={{ height: '18px', width: '60px', background: 'var(--border)', borderRadius: '12px' }} /></td>
                    <td style={{ padding: '16px 18px' }}><div style={{ height: '24px', width: '70px', background: 'var(--border)', borderRadius: '6px', margin: '0 auto' }} /></td>
                  </tr>
                ))
              ) : promotions.length === 0 ? (
                <tr>
                  <td colSpan={9} style={{ padding: '64px 20px', textAlign: 'center' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
                      <div
                        style={{
                          width: '56px',
                          height: '56px',
                          borderRadius: '50%',
                          background: 'rgba(249, 115, 22, 0.1)',
                          color: '#f97316',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        <Tag size={28} />
                      </div>
                      <div style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text-primary)' }}>
                        No promotional campaigns found.
                      </div>
                      <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                        Adjust your search filters or click "Add Promotion" to launch a campaign.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                promotions.map((p) => {
                  const isTrap = p.evaluation_status && p.evaluation_status.includes('Trap');

                  return (
                    <tr
                      key={p.promotion_id}
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
                            fontSize: '12px',
                            fontWeight: 600,
                            padding: '3px 8px',
                            borderRadius: '6px',
                            background: 'var(--surface-secondary)',
                            border: '1px solid var(--border)',
                            color: 'var(--text-primary)'
                          }}
                        >
                          {p.promotion_id}
                        </span>
                      </td>

                      {              }
                      <td style={{ padding: '14px 18px' }}>
                        <div
                          onClick={() => setSelectedPromo(p)}
                          style={{
                            fontWeight: 600,
                            color: 'var(--text-primary)',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px'
                          }}
                        >
                          <span>{p.promotion_name}</span>
                          {isTrap && (
                            <span
                              title="Promotion Trap Detected (High Volume, Severe Margin Drop)"
                              style={{
                                fontSize: '10px',
                                fontWeight: 700,
                                padding: '1px 6px',
                                borderRadius: '4px',
                                background: 'rgba(239, 68, 68, 0.15)',
                                color: '#ef4444'
                              }}
                            >
                              TRAP
                            </span>
                          )}
                        </div>
                        {p.target_segment && p.target_segment !== 'ALL' && (
                          <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>
                            Target: {p.target_segment}
                          </div>
                        )}
                      </td>

                      {              }
                      <td style={{ padding: '14px 18px', fontSize: '13px' }}>
                        <span style={{ fontWeight: 600, color: '#f97316' }}>
                          {p.discount_type === 'PERCENTAGE'
                            ? `${p.discount_value}% OFF`
                            : p.discount_type === 'BOGO'
                            ? 'Buy 1 Get 1'
                            : `$${p.discount_value.toFixed(0)} OFF`}
                        </span>
                        {p.min_order_amount > 0 && (
                          <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                            Min: ${p.min_order_amount.toFixed(0)}
                          </div>
                        )}
                      </td>

                      {            }
                      <td style={{ padding: '14px 18px', fontSize: '12px', color: 'var(--text-secondary)' }}>
                        <div>{p.start_date || 'Open'}</div>
                        <div style={{ color: 'var(--text-muted)' }}>to {p.end_date || 'Ongoing'}</div>
                      </td>

                      {                      }
                      <td style={{ padding: '14px 18px', fontSize: '13px', color: 'var(--text-secondary)' }}>
                        <span
                          style={{
                            fontSize: '11px',
                            padding: '2px 8px',
                            borderRadius: '4px',
                            background: 'var(--background)',
                            border: '1px solid var(--border)'
                          }}
                        >
                          {p.applicable_category}
                        </span>
                      </td>

                      {           }
                      <td style={{ padding: '14px 18px', textAlign: 'right', fontWeight: 500, color: 'var(--text-secondary)' }}>
                        {formatNumber(p.order_volume)} orders
                      </td>

                      {             }
                      <td style={{ padding: '14px 18px', textAlign: 'right', fontWeight: 600, color: 'var(--text-primary)' }}>
                        {formatCurrency(p.promotional_revenue)}
                      </td>

                      {            }
                      <td style={{ padding: '14px 18px' }}>
                        <span
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                            padding: '3px 9px',
                            borderRadius: '12px',
                            fontSize: '11px',
                            fontWeight: 600,
                            background: p.is_active ? 'rgba(16, 185, 129, 0.12)' : 'rgba(239, 68, 68, 0.12)',
                            color: p.is_active ? '#10b981' : '#ef4444'
                          }}
                        >
                          {p.is_active ? 'Active' : 'Expired'}
                        </span>
                      </td>

                      {             }
                      <td style={{ padding: '14px 18px', textAlign: 'center' }}>
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                          <button
                            onClick={() => setSelectedPromo(p)}
                            title="View campaign details"
                            style={{
                              padding: '6px',
                              borderRadius: '6px',
                              border: '1px solid var(--border)',
                              background: 'transparent',
                              color: 'var(--text-secondary)',
                              cursor: 'pointer'
                            }}
                          >
                            <Eye size={14} />
                          </button>

                          {canManagePromo && (
                            <>
                              <button
                                onClick={() => handleOpenEditModal(p)}
                                title="Edit campaign"
                                style={{
                                  padding: '6px',
                                  borderRadius: '6px',
                                  border: '1px solid var(--border)',
                                  background: 'transparent',
                                  color: 'var(--text-secondary)',
                                  cursor: 'pointer'
                                }}
                              >
                                <Pencil size={14} />
                              </button>

                              {userRole === 'admin' && (
                                <button
                                  onClick={() => handleDeletePromo(p.promotion_id, p.promotion_name)}
                                  title="Delete campaign"
                                  style={{
                                    padding: '6px',
                                    borderRadius: '6px',
                                    border: '1px solid var(--border)',
                                    background: 'transparent',
                                    color: '#ef4444',
                                    cursor: 'pointer'
                                  }}
                                >
                                  <Trash2 size={14} />
                                </button>
                              )}
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {                                                                }
      {selectedPromo && (
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
            if (e.target === e.currentTarget) setSelectedPromo(null);
          }}
        >
          <div
            style={{
              background: 'var(--surface)',
              border: '1px solid var(--border)',
              borderRadius: '14px',
              width: '100%',
              maxWidth: '640px',
              maxHeight: '90vh',
              overflowY: 'auto',
              boxShadow: 'var(--shadow-lg)'
            }}
          >
            {            }
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
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)' }}>
                    {selectedPromo.promotion_name}
                  </h3>
                  <span
                    style={{
                      fontFamily: 'monospace',
                      fontSize: '11px',
                      padding: '2px 6px',
                      borderRadius: '4px',
                      border: '1px solid var(--border)',
                      color: 'var(--text-muted)'
                    }}
                  >
                    {selectedPromo.promotion_id}
                  </span>
                </div>
                <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '4px' }}>
                  {selectedPromo.start_date || 'Open'} to {selectedPromo.end_date || 'Ongoing'} •{' '}
                  {selectedPromo.discount_type} ({selectedPromo.discount_value})
                </div>
              </div>

              <button
                onClick={() => setSelectedPromo(null)}
                style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
              >
                <X size={18} />
              </button>
            </div>

            {          }
            <div style={{ padding: '24px' }}>
              {                              }
              {selectedPromo.evaluation_status && selectedPromo.evaluation_status.includes('Trap') && (
                <div
                  style={{
                    background: 'rgba(239, 68, 68, 0.1)',
                    border: '1px solid rgba(239, 68, 68, 0.3)',
                    borderRadius: '10px',
                    padding: '14px 18px',
                    marginBottom: '20px'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#ef4444', fontWeight: 700, fontSize: '14px' }}>
                    <AlertTriangle size={18} />
                    <span>Promotion Trap Warning: {selectedPromo.evaluation_status}</span>
                  </div>
                  <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '6px' }}>
                    {selectedPromo.status_rationale}
                  </p>
                </div>
              )}

              {                            }
              <h4 style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '12px' }}>
                Operational & Financial Impact
              </h4>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(2, 1fr)',
                  gap: '12px',
                  marginBottom: '20px'
                }}
              >
                <div style={{ background: 'var(--background)', border: '1px solid var(--border)', borderRadius: '8px', padding: '12px' }}>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Promotional Revenue</div>
                  <div style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)', marginTop: '2px' }}>
                    {formatCurrency(selectedPromo.promotional_revenue)}
                  </div>
                </div>

                <div style={{ background: 'var(--background)', border: '1px solid var(--border)', borderRadius: '8px', padding: '12px' }}>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Contribution Margin</div>
                  <div style={{ fontSize: '18px', fontWeight: 700, color: '#10b981', marginTop: '2px' }}>
                    {formatCurrency(selectedPromo.contribution_margin_dollars)}{' '}
                    <span style={{ fontSize: '12px', fontWeight: 400 }}>({selectedPromo.profit_margin_pct}%)</span>
                  </div>
                </div>

                <div style={{ background: 'var(--background)', border: '1px solid var(--border)', borderRadius: '8px', padding: '12px' }}>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Average Order Value</div>
                  <div style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)', marginTop: '2px' }}>
                    ${selectedPromo.average_order_value ? selectedPromo.average_order_value.toFixed(2) : '0.00'}
                  </div>
                </div>

                <div style={{ background: 'var(--background)', border: '1px solid var(--border)', borderRadius: '8px', padding: '12px' }}>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Wastage Loss Impact</div>
                  <div style={{ fontSize: '18px', fontWeight: 700, color: '#ef4444', marginTop: '2px' }}>
                    {formatCurrency(selectedPromo.wasted_loss_amount)}
                  </div>
                </div>
              </div>

              {                                  }
              <h4 style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '12px' }}>
                Customer Behavioral Response
              </h4>
              <div
                style={{
                  background: 'var(--background)',
                  border: '1px solid var(--border)',
                  borderRadius: '10px',
                  padding: '14px 16px',
                  fontSize: '13px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px',
                  marginBottom: '20px'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Target Customer Segment:</span>
                  <strong style={{ color: 'var(--text-primary)' }}>{selectedPromo.target_segment}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Applicable Category:</span>
                  <strong style={{ color: 'var(--text-primary)' }}>{selectedPromo.applicable_category}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Repeat Purchase Rate:</span>
                  <strong style={{ color: '#10b981' }}>{selectedPromo.repeat_purchase_rate_pct}%</strong>
                </div>
              </div>

              {selectedPromo.description && (
                <div>
                  <h4 style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '4px' }}>
                    Campaign Rules & Description
                  </h4>
                  <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                    {selectedPromo.description}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {                                                                }
      {modalOpen && (
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
            if (e.target === e.currentTarget && !formSubmitting) setModalOpen(false);
          }}
        >
          <div
            style={{
              background: 'var(--surface)',
              border: '1px solid var(--border)',
              borderRadius: '14px',
              width: '100%',
              maxWidth: '540px',
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
                  {modalMode === 'create' ? 'Create Promotion Campaign' : 'Edit Promotion'}
                </h3>
                <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '2px' }}>
                  Set discount parameters, eligibility, and validity period.
                </p>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                disabled={formSubmitting}
                style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} style={{ padding: '24px' }}>
              {formError && (
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
                  {formError}
                </div>
              )}

              {          }
              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                  Campaign Name *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Autumn Harvest 20% Off"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  required
                  style={{
                    width: '100%',
                    padding: '9px 12px',
                    borderRadius: '8px',
                    border: '1px solid var(--border)',
                    background: 'var(--background)',
                    color: 'var(--text-primary)',
                    fontSize: '13px',
                    outline: 'none'
                  }}
                />
              </div>

              {                           }
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                    Discount Type
                  </label>
                  <select
                    value={formType}
                    onChange={(e) => setFormType(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '9px 12px',
                      borderRadius: '8px',
                      border: '1px solid var(--border)',
                      background: 'var(--background)',
                      color: 'var(--text-primary)',
                      fontSize: '13px',
                      outline: 'none',
                      cursor: 'pointer'
                    }}
                  >
                    <option value="PERCENTAGE">Percentage (%)</option>
                    <option value="FIXED_AMOUNT">Fixed Dollar ($)</option>
                    <option value="BOGO">BOGO</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                    Discount Value
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    min="0"
                    value={formValue}
                    onChange={(e) => setFormValue(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '9px 12px',
                      borderRadius: '8px',
                      border: '1px solid var(--border)',
                      background: 'var(--background)',
                      color: 'var(--text-primary)',
                      fontSize: '13px',
                      outline: 'none'
                    }}
                  />
                </div>
              </div>

              {                         }
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={formStartDate}
                    onChange={(e) => setFormStartDate(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '9px 12px',
                      borderRadius: '8px',
                      border: '1px solid var(--border)',
                      background: 'var(--background)',
                      color: 'var(--text-primary)',
                      fontSize: '13px',
                      outline: 'none'
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                    End Date
                  </label>
                  <input
                    type="date"
                    value={formEndDate}
                    onChange={(e) => setFormEndDate(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '9px 12px',
                      borderRadius: '8px',
                      border: '1px solid var(--border)',
                      background: 'var(--background)',
                      color: 'var(--text-primary)',
                      fontSize: '13px',
                      outline: 'none'
                    }}
                  />
                </div>
              </div>

              {                               }
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                    Target Customer Segment
                  </label>
                  <select
                    value={formSegment}
                    onChange={(e) => setFormSegment(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '9px 12px',
                      borderRadius: '8px',
                      border: '1px solid var(--border)',
                      background: 'var(--background)',
                      color: 'var(--text-primary)',
                      fontSize: '13px',
                      outline: 'none',
                      cursor: 'pointer'
                    }}
                  >
                    <option value="ALL">All Customers</option>
                    <option value="High-Value Regulars">High-Value Regulars</option>
                    <option value="Occasional Diners">Occasional Diners</option>
                    <option value="Deal Seekers">Deal Seekers</option>
                    <option value="Weekend Indulgers">Weekend Indulgers</option>
                    <option value="At-Risk Diners">At-Risk Diners</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                    Applicable Category
                  </label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '9px 12px',
                      borderRadius: '8px',
                      border: '1px solid var(--border)',
                      background: 'var(--background)',
                      color: 'var(--text-primary)',
                      fontSize: '13px',
                      outline: 'none',
                      cursor: 'pointer'
                    }}
                  >
                    <option value="ALL">All Categories</option>
                    <option value="Prime Steaks & Butcher Cuts">Prime Steaks & Butcher Cuts</option>
                    <option value="Artisanal Pasta & Risotto">Artisanal Pasta & Risotto</option>
                    <option value="Fresh Seafood & Raw Bar">Fresh Seafood & Raw Bar</option>
                    <option value="Signature Cocktails & Mocktails">Signature Cocktails</option>
                    <option value="Decadent Desserts">Decadent Desserts</option>
                  </select>
                </div>
              </div>

              {                 }
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                  Description / Campaign Rules
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Valid on all dinner entrees with minimum purchase of $60."
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    border: '1px solid var(--border)',
                    background: 'var(--background)',
                    color: 'var(--text-primary)',
                    fontSize: '13px',
                    outline: 'none',
                    resize: 'vertical'
                  }}
                />
              </div>

              {             }
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '12px' }}>
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  disabled={formSubmitting}
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
                  disabled={formSubmitting}
                  style={{
                    padding: '8px 18px',
                    borderRadius: '8px',
                    border: 'none',
                    background: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',
                    color: '#ffffff',
                    fontSize: '13px',
                    fontWeight: 600,
                    cursor: formSubmitting ? 'not-allowed' : 'pointer',
                    boxShadow: '0 2px 8px rgba(249, 115, 22, 0.25)'
                  }}
                >
                  {formSubmitting ? 'Saving...' : modalMode === 'create' ? 'Save Campaign' : 'Update Campaign'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

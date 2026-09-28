import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Store,
  MapPin,
  Search,
  SlidersHorizontal,
  Plus,
  Eye,
  Pencil,
  ChartNoAxesCombined,
  Power,
  Trash2,
  RefreshCw,
  Star,
  Users,
  DollarSign,
  ShoppingBag,
  Activity,
  CheckCircle2,
  XCircle,
  TrendingUp,
  AlertTriangle,
  EllipsisVertical,
  X,
  Phone,
  UserCheck
} from 'lucide-react';

export default function RestaurantsManagementPage() {
  const navigate = useNavigate();
  const { user, token } = useAuth();

  const [restaurants, setRestaurants] = useState([]);
  const [summary, setSummary] = useState({
    total_locations: 0,
    active_locations: 0,
    total_orders: 0,
    total_revenue: 0
  });
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [cityFilter, setCityFilter] = useState('ALL');
  const [sortBy, setSortBy] = useState('revenue_desc');

  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('create');                     
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [formError, setFormError] = useState(null);

  const [formName, setFormName] = useState('');
  const [formCity, setFormCity] = useState('');
  const [formState, setFormState] = useState('');
  const [formStatus, setFormStatus] = useState('ACTIVE');
  const [formCapacity, setFormCapacity] = useState(120);
  const [formManager, setFormManager] = useState('');
  const [formPhone, setFormPhone] = useState('');

  const userRole = user?.role_id || 'analyst';
  const canAddRestaurant = userRole === 'admin' || userRole === 'regional_manager';
  const canDeleteRestaurant = userRole === 'admin';
  const canToggleStatus = userRole === 'admin' || userRole === 'regional_manager';

  const canEditLocation = useCallback((locId) => {
    if (userRole === 'admin' || userRole === 'regional_manager') return true;
    if (userRole === 'manager' && user?.assigned_location_id === locId) return true;
    return false;
  }, [userRole, user?.assigned_location_id]);

  const getAuthHeaders = useCallback(() => {
    const headers = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;
    if (userRole) headers['X-User-Role'] = userRole;
    return headers;
  }, [token, userRole]);

  const fetchRestaurants = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (searchQuery.trim()) params.append('search', searchQuery.trim());
      if (statusFilter !== 'ALL') params.append('status_filter', statusFilter);
      if (cityFilter !== 'ALL') params.append('city', cityFilter);
      if (sortBy) params.append('sort_by', sortBy);

      const res = await fetch(`/api/v1/restaurants?${params.toString()}`, {
        headers: getAuthHeaders()
      });

      if (!res.ok) {
        throw new Error(`Failed to load restaurants: HTTP ${res.status}`);
      }

      const data = await res.json();
      setRestaurants(data.restaurants || []);
      if (data.summary) setSummary(data.summary);
      if (data.cities) setCities(data.cities);
    } catch (err) {
      console.error('Error fetching restaurants:', err);
      setError(err.message || 'Unable to connect to the restaurant management service.');
    } finally {
      setLoading(false);
    }
  }, [searchQuery, statusFilter, cityFilter, sortBy, getAuthHeaders]);

  useEffect(() => {
    fetchRestaurants();
  }, [fetchRestaurants]);

  const handleOpenCreateModal = () => {
    setModalMode('create');
    setSelectedRestaurant(null);
    setFormName('');
    setFormCity('');
    setFormState('');
    setFormStatus('ACTIVE');
    setFormCapacity(120);
    setFormManager('');
    setFormPhone('');
    setFormError(null);
    setModalOpen(true);
  };

  const handleOpenEditModal = (loc) => {
    setModalMode('edit');
    setSelectedRestaurant(loc);
    setFormName(loc.name || '');
    setFormCity(loc.city || '');
    setFormState(loc.state || '');
    setFormStatus(loc.operating_status || 'ACTIVE');
    setFormCapacity(loc.seating_capacity || 120);
    setFormManager(loc.manager_name && loc.manager_name !== 'Unassigned' ? loc.manager_name : '');
    setFormPhone(loc.phone_number && loc.phone_number !== 'N/A' ? loc.phone_number : '');
    setFormError(null);
    setModalOpen(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!formName.trim() || !formCity.trim() || !formState.trim()) {
      setFormError('Please fill in all required fields (Name, City, and State).');
      return;
    }

    setFormSubmitting(true);
    setFormError(null);

    try {
      if (modalMode === 'create') {
        const payload = {
          name: formName.trim(),
          city: formCity.trim(),
          state: formState.trim(),
          operating_status: formStatus,
          seating_capacity: parseInt(formCapacity, 10) || 120,
          manager_name: formManager.trim() || null,
          phone_number: formPhone.trim() || null
        };

        const res = await fetch('/api/v1/restaurants', {
          method: 'POST',
          headers: getAuthHeaders(),
          body: JSON.stringify(payload)
        });

        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          throw new Error(errData.detail || `Server returned error ${res.status}`);
        }
      } else {
        const payload = {
          name: formName.trim(),
          city: formCity.trim(),
          state: formState.trim(),
          operating_status: formStatus,
          seating_capacity: parseInt(formCapacity, 10) || 120,
          manager_name: formManager.trim() || null,
          phone_number: formPhone.trim() || null
        };

        const res = await fetch(`/api/v1/restaurants/${selectedRestaurant.location_id}`, {
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
      await fetchRestaurants();
    } catch (err) {
      console.error('Error saving restaurant:', err);
      setFormError(err.message || 'An error occurred while saving.');
    } finally {
      setFormSubmitting(false);
    }
  };

  const handleToggleStatus = async (loc) => {
    const nextStatus = loc.operating_status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    const confirmMsg = `Are you sure you want to mark ${loc.name} as ${nextStatus}?`;
    if (!window.confirm(confirmMsg)) return;

    try {
      const res = await fetch(`/api/v1/restaurants/${loc.location_id}/status`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
        body: JSON.stringify({ operating_status: nextStatus })
      });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.detail || `Failed to update status`);
      }
      await fetchRestaurants();
    } catch (err) {
      alert(`Error toggling status: ${err.message}`);
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
    <div style={{ padding: '24px 32px', maxWidth: '1600px', margin: '0 auto' }}>
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
            Restaurants
          </h1>
          <p style={{ fontSize: '14px', color: 'var(--text-muted)' }}>
            Manage restaurant locations and view operational performance.
          </p>
        </div>

        {                    }
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          {                   }
          <button
            onClick={() => fetchRestaurants()}
            title="Refresh location matrix"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '9px',
              borderRadius: '8px',
              border: '1px solid var(--border)',
              background: 'var(--surface)',
              color: 'var(--text-secondary)',
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
          >
            <RefreshCw size={16} />
          </button>

          {                           }
          {canAddRestaurant && (
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
                boxShadow: '0 2px 8px rgba(249, 115, 22, 0.25)',
                transition: 'all 0.15s ease'
              }}
            >
              <Plus size={16} />
              <span>Add Restaurant</span>
            </button>
          )}
        </div>
      </div>

      {                                                                }
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '16px',
          marginBottom: '24px'
        }}
      >
        {                     }
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
              width: '48px',
              height: '48px',
              borderRadius: '10px',
              background: 'rgba(59, 130, 246, 0.12)',
              color: '#3b82f6',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}
          >
            <Store size={24} />
          </div>
          <div>
            <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Total Locations
            </div>
            <div style={{ fontSize: '26px', fontWeight: 700, color: 'var(--text-primary)', marginTop: '2px' }}>
              {loading ? '—' : formatNumber(summary.total_locations)}
            </div>
          </div>
        </div>

        {                      }
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
              width: '48px',
              height: '48px',
              borderRadius: '10px',
              background: 'rgba(16, 185, 129, 0.12)',
              color: '#10b981',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}
          >
            <CheckCircle2 size={24} />
          </div>
          <div>
            <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Active Locations
            </div>
            <div style={{ fontSize: '26px', fontWeight: 700, color: 'var(--text-primary)', marginTop: '2px' }}>
              {loading ? '—' : formatNumber(summary.active_locations)}
            </div>
          </div>
        </div>

        {                  }
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
              width: '48px',
              height: '48px',
              borderRadius: '10px',
              background: 'rgba(168, 85, 247, 0.12)',
              color: '#a855f7',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}
          >
            <ShoppingBag size={24} />
          </div>
          <div>
            <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Total Orders
            </div>
            <div style={{ fontSize: '26px', fontWeight: 700, color: 'var(--text-primary)', marginTop: '2px' }}>
              {loading ? '—' : formatNumber(summary.total_orders)}
            </div>
          </div>
        </div>

        {                   }
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
              width: '48px',
              height: '48px',
              borderRadius: '10px',
              background: 'rgba(249, 115, 22, 0.12)',
              color: '#f97316',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}
          >
            <DollarSign size={24} />
          </div>
          <div>
            <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Total Revenue
            </div>
            <div style={{ fontSize: '26px', fontWeight: 700, color: 'var(--text-primary)', marginTop: '2px' }}>
              {loading ? '—' : formatCurrency(summary.total_revenue)}
            </div>
          </div>
        </div>
      </div>

      {                                                                }
      {!loading && restaurants.length > 0 && (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))',
            gap: '16px',
            marginBottom: '24px'
          }}
        >
          {                                                 }
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
                  Top Locations by Sales Performance
                </div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                  Revenue distribution & transaction volume per unit
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
                Revenue Leaders
              </span>
            </div>

            {                          }
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', flex: 1, justifyContent: 'center' }}>
              {(() => {
                const top6 = [...restaurants]
                  .sort((a, b) => (b.total_revenue || 0) - (a.total_revenue || 0))
                  .slice(0, 6);
                const maxRev = Math.max(...top6.map((r) => r.total_revenue || 1), 1);

                return top6.map((loc, idx) => {
                  const rev = loc.total_revenue || 0;
                  const orders = loc.total_orders || 0;
                  const pct = Math.min(Math.round((rev / maxRev) * 100), 100);
                  const colors = ['#f97316', '#3b82f6', '#10b981', '#8b5cf6', '#ec4899', '#06b6d4'];
                  const barColor = colors[idx % colors.length];

                  return (
                    <div key={loc.location_id || idx} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', maxWidth: '240px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{loc.name}</span>
                          <span style={{ color: 'var(--text-muted)', fontSize: '11px' }}>({loc.city})</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{orders.toLocaleString()} orders</span>
                          <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>${(rev / 1000).toFixed(0)}k</span>
                        </div>
                      </div>
                      <div style={{ width: '100%', height: '8px', background: 'var(--surface-secondary)', borderRadius: '4px', overflow: 'hidden' }}>
                        <div
                          style={{
                            width: `${pct}%`,
                            height: '100%',
                            background: `linear-gradient(90deg, ${barColor} 0%, ${barColor}cc 100%)`,
                            borderRadius: '4px',
                            transition: 'width 0.6s cubic-bezier(0.4, 0, 0.2, 1)'
                          }}
                        />
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
                  Store Format & Capacity Matrix
                </div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                  Operating footprint, seating allocation & active ratios
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
                Capacity Insights
              </span>
            </div>

            {                            }
            {(() => {
              const tierCounts = restaurants.reduce((acc, r) => {
                const tier = r.location_tier || (r.seating_capacity > 150 ? 'Flagship' : r.seating_capacity > 90 ? 'Standard' : 'Express');
                acc[tier] = (acc[tier] || 0) + 1;
                return acc;
              }, {});

              const tierColors = {
                Flagship: '#f97316',
                Standard: '#3b82f6',
                Express: '#10b981',
                Bistro: '#8b5cf6'
              };

              const totalLocs = restaurants.length || 1;
              const entries = Object.entries(tierCounts);
              const totalCapacity = restaurants.reduce((sum, r) => sum + (r.seating_capacity || 0), 0);
              const avgCapacity = Math.round(totalCapacity / totalLocs);

              const radius = 38;
              const circumference = 2 * Math.PI * radius;
              let accumulatedPct = 0;

              return (
                <div style={{ display: 'flex', alignItems: 'center', gap: '24px', flex: 1, flexWrap: 'wrap' }}>
                  {               }
                  <div style={{ position: 'relative', width: '130px', height: '130px', flexShrink: 0, margin: '0 auto' }}>
                    <svg width="130" height="130" viewBox="0 0 100 100">
                      <circle cx="50" cy="50" r={radius} fill="transparent" stroke="var(--border)" strokeWidth="12" />
                      {entries.map(([tier, count], i) => {
                        const pct = count / totalLocs;
                        const strokeDasharray = `${pct * circumference} ${circumference}`;
                        const strokeDashoffset = -accumulatedPct * circumference;
                        accumulatedPct += pct;
                        const color = tierColors[tier] || '#64748b';

                        return (
                          <circle
                            key={tier}
                            cx="50"
                            cy="50"
                            r={radius}
                            fill="transparent"
                            stroke={color}
                            strokeWidth="12"
                            strokeDasharray={strokeDasharray}
                            strokeDashoffset={strokeDashoffset}
                            strokeLinecap="round"
                            style={{
                              transform: 'rotate(-90deg)',
                              transformOrigin: '50px 50px',
                              transition: 'stroke-dashoffset 0.8s ease'
                            }}
                          />
                        );
                      })}
                    </svg>
                    <div
                      style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        textAlign: 'center'
                      }}
                    >
                      <div style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1 }}>
                        {totalLocs}
                      </div>
                      <div style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase', marginTop: '2px' }}>
                        Units
                      </div>
                    </div>
                  </div>

                  {                                 }
                  <div style={{ flex: 1, minWidth: '180px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {entries.map(([tier, count]) => {
                      const color = tierColors[tier] || '#64748b';
                      const pct = Math.round((count / totalLocs) * 100);
                      return (
                        <div key={tier} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <div style={{ width: '10px', height: '10px', borderRadius: '3px', background: color }} />
                            <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{tier}</span>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{count}</span>
                            <span style={{ color: 'var(--text-muted)', fontSize: '11px' }}>({pct}%)</span>
                          </div>
                        </div>
                      );
                    })}

                    <div style={{ borderTop: '1px solid var(--border)', paddingTop: '10px', marginTop: '4px', display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                      <span style={{ color: 'var(--text-muted)' }}>Total Dining Seats:</span>
                      <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{totalCapacity.toLocaleString()}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                      <span style={{ color: 'var(--text-muted)' }}>Avg Seats per Store:</span>
                      <span style={{ fontWeight: 700, color: '#10b981' }}>{avgCapacity} seats</span>
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      )}

      {                                                                  }
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
          gap: '14px',
          marginBottom: '20px',
          boxShadow: 'var(--shadow-sm)'
        }}
      >
        {                        }
        <div style={{ position: 'relative', flex: '1 1 300px', maxWidth: '420px' }}>
          <Search
            size={16}
            style={{
              position: 'absolute',
              left: '12px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--text-muted)',
              pointerEvents: 'none'
            }}
          />
          <input
            type="text"
            placeholder="Search by restaurant name, city, location ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '9px 12px 9px 36px',
              borderRadius: '8px',
              border: '1px solid var(--border)',
              background: 'var(--background)',
              color: 'var(--text-primary)',
              fontSize: '13px',
              outline: 'none',
              transition: 'border-color 0.15s'
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
                cursor: 'pointer',
                display: 'flex'
              }}
            >
              <X size={14} />
            </button>
          )}
        </div>

        {                              }
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          {                 }
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <MapPin size={15} style={{ color: 'var(--text-muted)' }} />
            <select
              value={cityFilter}
              onChange={(e) => setCityFilter(e.target.value)}
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
              <option value="ALL">All Cities</option>
              {cities.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          {                   }
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <SlidersHorizontal size={15} style={{ color: 'var(--text-muted)' }} />
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
              <option value="ACTIVE">Active</option>
              <option value="INACTIVE">Inactive</option>
            </select>
          </div>

          {             }
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 500 }}>Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
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
              <option value="revenue_desc">Revenue (High to Low)</option>
              <option value="revenue_asc">Revenue (Low to High)</option>
              <option value="orders_desc">Orders (High to Low)</option>
              <option value="rating_desc">Rating (High to Low)</option>
              <option value="name_asc">Name (A - Z)</option>
            </select>
          </div>
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
            onClick={() => fetchRestaurants()}
            style={{
              padding: '6px 14px',
              borderRadius: '6px',
              border: '1px solid #ef4444',
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
                <th style={{ padding: '14px 18px', width: '110px' }}>Location ID</th>
                <th style={{ padding: '14px 18px' }}>Restaurant Name</th>
                <th style={{ padding: '14px 18px' }}>City / Location</th>
                <th style={{ padding: '14px 18px', width: '100px' }}>Status</th>
                <th style={{ padding: '14px 18px', textAlign: 'right' }}>Orders</th>
                <th style={{ padding: '14px 18px', textAlign: 'right' }}>Revenue</th>
                <th style={{ padding: '14px 18px', textAlign: 'right' }}>AOV</th>
                <th style={{ padding: '14px 18px', textAlign: 'center', width: '90px' }}>Rating</th>
                <th style={{ padding: '14px 18px', textAlign: 'center', width: '160px' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                [...Array(6)].map((_, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid var(--border)' }}>
                    <td style={{ padding: '16px 18px' }}>
                      <div style={{ height: '18px', width: '70px', background: 'var(--border)', borderRadius: '4px' }} />
                    </td>
                    <td style={{ padding: '16px 18px' }}>
                      <div style={{ height: '18px', width: '180px', background: 'var(--border)', borderRadius: '4px' }} />
                    </td>
                    <td style={{ padding: '16px 18px' }}>
                      <div style={{ height: '18px', width: '110px', background: 'var(--border)', borderRadius: '4px' }} />
                    </td>
                    <td style={{ padding: '16px 18px' }}>
                      <div style={{ height: '18px', width: '60px', background: 'var(--border)', borderRadius: '12px' }} />
                    </td>
                    <td style={{ padding: '16px 18px' }}>
                      <div style={{ height: '18px', width: '60px', background: 'var(--border)', borderRadius: '4px', marginLeft: 'auto' }} />
                    </td>
                    <td style={{ padding: '16px 18px' }}>
                      <div style={{ height: '18px', width: '90px', background: 'var(--border)', borderRadius: '4px', marginLeft: 'auto' }} />
                    </td>
                    <td style={{ padding: '16px 18px' }}>
                      <div style={{ height: '18px', width: '60px', background: 'var(--border)', borderRadius: '4px', marginLeft: 'auto' }} />
                    </td>
                    <td style={{ padding: '16px 18px' }}>
                      <div style={{ height: '18px', width: '45px', background: 'var(--border)', borderRadius: '4px', margin: '0 auto' }} />
                    </td>
                    <td style={{ padding: '16px 18px' }}>
                      <div style={{ height: '24px', width: '110px', background: 'var(--border)', borderRadius: '6px', margin: '0 auto' }} />
                    </td>
                  </tr>
                ))
              ) : restaurants.length === 0 ? (
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
                        <Store size={28} />
                      </div>
                      <div style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text-primary)' }}>
                        No restaurant locations found.
                      </div>
                      <p style={{ fontSize: '13px', color: 'var(--text-muted)', maxWidth: '380px' }}>
                        No restaurants matched your current filter criteria. Try adjusting your search term or filters.
                      </p>
                      {(searchQuery || statusFilter !== 'ALL' || cityFilter !== 'ALL') && (
                        <button
                          onClick={() => {
                            setSearchQuery('');
                            setStatusFilter('ALL');
                            setCityFilter('ALL');
                          }}
                          style={{
                            marginTop: '8px',
                            padding: '8px 16px',
                            borderRadius: '8px',
                            border: '1px solid var(--border)',
                            background: 'var(--surface)',
                            color: 'var(--text-primary)',
                            fontSize: '13px',
                            fontWeight: 500,
                            cursor: 'pointer'
                          }}
                        >
                          Clear Filters
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                restaurants.map((loc) => {
                  const isActive = loc.operating_status === 'ACTIVE';
                  const isAssignedManager = userRole === 'manager' && user?.assigned_location_id === loc.location_id;
                  const canEdit = canEditLocation(loc.location_id);

                  return (
                    <tr
                      key={loc.location_id}
                      style={{
                        borderBottom: '1px solid var(--border)',
                        transition: 'background-color 0.15s ease'
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--background)')}
                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                    >
                      {                 }
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
                            color: 'var(--text-secondary)'
                          }}
                        >
                          {loc.location_id}
                        </span>
                      </td>

                      {          }
                      <td style={{ padding: '14px 18px' }}>
                        <div
                          onClick={() => navigate(`/management/restaurants/${loc.location_id}`)}
                          style={{
                            fontWeight: 600,
                            color: 'var(--text-primary)',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px'
                          }}
                        >
                          <span style={{ transition: 'color 0.15s' }}>{loc.name}</span>
                          {loc.location_tier && (
                            <span
                              style={{
                                fontSize: '11px',
                                padding: '1px 6px',
                                borderRadius: '4px',
                                background: 'rgba(59, 130, 246, 0.1)',
                                color: '#3b82f6',
                                fontWeight: 500
                              }}
                            >
                              {loc.location_tier}
                            </span>
                          )}
                        </div>
                        {loc.manager_name && loc.manager_name !== 'Unassigned' && (
                          <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>
                            Mgr: {loc.manager_name}
                          </div>
                        )}
                      </td>

                      {          }
                      <td style={{ padding: '14px 18px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-secondary)' }}>
                          <MapPin size={14} style={{ color: 'var(--text-muted)' }} />
                          <span>{loc.city}, {loc.state}</span>
                        </div>
                      </td>

                      {            }
                      <td style={{ padding: '14px 18px' }}>
                        <span
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '5px',
                            padding: '3px 10px',
                            borderRadius: '12px',
                            fontSize: '12px',
                            fontWeight: 600,
                            background: isActive ? 'rgba(16, 185, 129, 0.12)' : 'rgba(239, 68, 68, 0.12)',
                            color: isActive ? '#10b981' : '#ef4444'
                          }}
                        >
                          <span
                            style={{
                              width: '6px',
                              height: '6px',
                              borderRadius: '50%',
                              backgroundColor: isActive ? '#10b981' : '#ef4444'
                            }}
                          />
                          {isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>

                      {            }
                      <td style={{ padding: '14px 18px', textAlign: 'right', fontWeight: 500, color: 'var(--text-secondary)' }}>
                        {formatNumber(loc.total_orders)}
                      </td>

                      {             }
                      <td style={{ padding: '14px 18px', textAlign: 'right', fontWeight: 600, color: 'var(--text-primary)' }}>
                        {formatCurrency(loc.total_revenue)}
                      </td>

                      {         }
                      <td style={{ padding: '14px 18px', textAlign: 'right', color: 'var(--text-secondary)' }}>
                        ${loc.average_order_value ? loc.average_order_value.toFixed(2) : '0.00'}
                      </td>

                      {            }
                      <td style={{ padding: '14px 18px', textAlign: 'center' }}>
                        <span
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                            fontWeight: 600,
                            fontSize: '13px',
                            color: '#eab308'
                          }}
                        >
                          <Star size={13} fill="#eab308" />
                          <span>{loc.avg_overall_rating ? loc.avg_overall_rating.toFixed(1) : '—'}</span>
                        </span>
                      </td>

                      {             }
                      <td style={{ padding: '14px 18px', textAlign: 'center' }}>
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                          {                  }
                          <button
                            onClick={() => navigate(`/management/restaurants/${loc.location_id}`)}
                            title="View details"
                            style={{
                              padding: '6px',
                              borderRadius: '6px',
                              border: '1px solid var(--border)',
                              background: 'transparent',
                              color: 'var(--text-secondary)',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              transition: 'all 0.15s ease'
                            }}
                          >
                            <Eye size={15} />
                          </button>

                          {          }
                          {canEdit && (
                            <button
                              onClick={() => handleOpenEditModal(loc)}
                              title="Edit location"
                              style={{
                                padding: '6px',
                                borderRadius: '6px',
                                border: '1px solid var(--border)',
                                background: 'transparent',
                                color: 'var(--text-secondary)',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                transition: 'all 0.15s ease'
                              }}
                            >
                              <Pencil size={15} />
                            </button>
                          )}

                          {               }
                          <button
                            onClick={() => navigate(`/intelligence/locations?location_id=${loc.location_id}`)}
                            title="View Location Analytics"
                            style={{
                              padding: '6px',
                              borderRadius: '6px',
                              border: '1px solid var(--border)',
                              background: 'transparent',
                              color: '#3b82f6',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              transition: 'all 0.15s ease'
                            }}
                          >
                            <ChartNoAxesCombined size={15} />
                          </button>

                          {                           }
                          {canToggleStatus && (
                            <button
                              onClick={() => handleToggleStatus(loc)}
                              title={isActive ? 'Deactivate location' : 'Activate location'}
                              style={{
                                padding: '6px',
                                borderRadius: '6px',
                                border: '1px solid var(--border)',
                                background: 'transparent',
                                color: isActive ? '#ef4444' : '#10b981',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                transition: 'all 0.15s ease'
                              }}
                            >
                              <Power size={15} />
                            </button>
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
              overflow: 'hidden',
              animation: 'fadeIn 0.2s ease'
            }}
          >
            {                  }
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
                  {modalMode === 'create' ? 'Add Restaurant' : `Edit Restaurant: ${selectedRestaurant?.name}`}
                </h3>
                <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '2px' }}>
                  {modalMode === 'create'
                    ? 'Register a new store location in the DineIQ network.'
                    : 'Update operational metadata and manager contact details.'}
                </p>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                disabled={formSubmitting}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--text-muted)',
                  cursor: 'pointer',
                  padding: '4px'
                }}
              >
                <X size={18} />
              </button>
            </div>

            {                }
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
                    marginBottom: '18px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                >
                  <AlertTriangle size={16} />
                  <span>{formError}</span>
                </div>
              )}

              {                   }
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                  Location Name *
                </label>
                <input
                  type="text"
                  placeholder="e.g. DineIQ Boston Back Bay"
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

              {                              }
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                    City *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Boston"
                    value={formCity}
                    onChange={(e) => setFormCity(e.target.value)}
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
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                    State / Region *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. MA"
                    value={formState}
                    onChange={(e) => setFormState(e.target.value)}
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
              </div>

              {                                                     }
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                    Operating Status
                  </label>
                  <select
                    value={formStatus}
                    onChange={(e) => setFormStatus(e.target.value)}
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
                    <option value="ACTIVE">Active</option>
                    <option value="INACTIVE">Inactive</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                    Seating Capacity
                  </label>
                  <input
                    type="number"
                    min="10"
                    max="1000"
                    value={formCapacity}
                    onChange={(e) => setFormCapacity(e.target.value)}
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

              {                                              }
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '24px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                    Manager Name (optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. John Calhoun"
                    value={formManager}
                    onChange={(e) => setFormManager(e.target.value)}
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
                    Contact Phone (optional)
                  </label>
                  <input
                    type="tel"
                    placeholder="e.g. (555) 019-2834"
                    value={formPhone}
                    onChange={(e) => setFormPhone(e.target.value)}
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

              {                   }
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '12px' }}>
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  disabled={formSubmitting}
                  style={{
                    padding: '9px 18px',
                    borderRadius: '8px',
                    border: '1px solid var(--border)',
                    background: 'transparent',
                    color: 'var(--text-secondary)',
                    fontSize: '13px',
                    fontWeight: 500,
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={formSubmitting}
                  style={{
                    padding: '9px 20px',
                    borderRadius: '8px',
                    border: 'none',
                    background: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',
                    color: '#ffffff',
                    fontSize: '13px',
                    fontWeight: 600,
                    cursor: formSubmitting ? 'not-allowed' : 'pointer',
                    boxShadow: '0 2px 8px rgba(249, 115, 22, 0.25)',
                    opacity: formSubmitting ? 0.7 : 1
                  }}
                >
                  {formSubmitting ? 'Saving...' : modalMode === 'create' ? 'Save Restaurant' : 'Update Restaurant'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

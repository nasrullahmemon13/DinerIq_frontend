import { BarChart } from '../components/AnalyticsCharts';
import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  ShoppingCart,
  ReceiptText,
  Eye,
  Search,
  SlidersHorizontal,
  CalendarDays,
  CheckCircle2,
  XCircle,
  Clock,
  MapPin,
  User,
  DollarSign,
  X,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  AlertTriangle,
  Tag,
  CreditCard,
  Utensils
} from 'lucide-react';

export default function OrdersPage() {
  const { user, token } = useAuth();
  const userRole = user?.role_id || 'analyst';

  const [orders, setOrders] = useState([]);
  const [summary, setSummary] = useState({
    total_orders: 0,
    completed_orders: 0,
    cancelled_orders: 0,
    total_revenue: 0,
    average_order_value: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const [searchQuery, setSearchQuery] = useState('');
  const [locationFilter, setLocationFilter] = useState('ALL');
  const [channelFilter, setChannelFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [sortBy, setSortBy] = useState('date_desc');

  const [selectedOrder, setSelectedOrder] = useState(null);
  const [drawerLoading, setDrawerLoading] = useState(false);
  const [drawerError, setDrawerError] = useState(null);
  const [statusUpdating, setStatusUpdating] = useState(false);

  const getAuthHeaders = useCallback(() => {
    const headers = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;
    if (userRole) headers['X-User-Role'] = userRole;
    return headers;
  }, [token, userRole]);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({
        page: String(page),
        page_size: String(pageSize),
        sort_by: sortBy
      });

      if (searchQuery.trim()) params.append('search', searchQuery.trim());
      if (locationFilter !== 'ALL') params.append('location_id', locationFilter);
      if (channelFilter !== 'ALL') params.append('channel', channelFilter);
      if (statusFilter !== 'ALL') params.append('status_filter', statusFilter);
      if (dateFrom) params.append('date_from', dateFrom);
      if (dateTo) params.append('date_to', dateTo);

      const res = await fetch(`/api/v1/orders/paginated?${params.toString()}`, {
        headers: getAuthHeaders()
      });

      if (!res.ok) {
        throw new Error(`Failed to load orders: HTTP ${res.status}`);
      }

      const data = await res.json();
      setOrders(data.orders || []);
      if (data.summary) setSummary(data.summary);
      setTotalCount(data.total_count || 0);
      setTotalPages(data.total_pages || 1);
    } catch (err) {
      console.error('Error fetching orders:', err);
      setError(err.message || 'Unable to connect to order management service.');
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, searchQuery, locationFilter, channelFilter, statusFilter, dateFrom, dateTo, sortBy, getAuthHeaders]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const handleFilterChange = (setter, val) => {
    setter(val);
    setPage(1);
  };

  const handleOpenDetail = async (orderId) => {
    setDrawerLoading(true);
    setDrawerError(null);
    setSelectedOrder(null);
    try {
      const res = await fetch(`/api/v1/orders/${orderId}/details`, {
        headers: getAuthHeaders()
      });
      if (!res.ok) {
        throw new Error(`Failed to retrieve order ${orderId}: HTTP ${res.status}`);
      }
      const data = await res.json();
      setSelectedOrder(data);
    } catch (err) {
      console.error('Error loading order detail:', err);
      setDrawerError(err.message);
    } finally {
      setDrawerLoading(false);
    }
  };

  const handleUpdateStatus = async (orderId, newStatus) => {
    setStatusUpdating(true);
    try {
      const res = await fetch(`/api/v1/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
        body: JSON.stringify({ order_status: newStatus })
      });
      if (!res.ok) {
        throw new Error(`Failed to update status: HTTP ${res.status}`);
      }
      if (selectedOrder && selectedOrder.header.order_id === orderId) {
        setSelectedOrder((prev) => ({
          ...prev,
          header: { ...prev.header, order_status: newStatus }
        }));
      }
      await fetchOrders();
    } catch (err) {
      alert(`Error updating order: ${err.message}`);
    } finally {
      setStatusUpdating(false);
    }
  };

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 2
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
            Orders
          </h1>
          <p style={{ fontSize: '14px', color: 'var(--text-muted)' }}>
            View and manage restaurant order transactions.
          </p>
        </div>

        {                   }
        <button
          onClick={() => fetchOrders()}
          title="Refresh orders"
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
        {                  }
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '12px', padding: '18px 20px', boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: 'var(--text-muted)', fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            <span>Total Orders</span>
            <ShoppingCart size={18} style={{ color: '#3b82f6' }} />
          </div>
          <div style={{ fontSize: '24px', fontWeight: 700, color: 'var(--text-primary)', marginTop: '8px' }}>
            {loading ? '—' : formatNumber(summary.total_orders)}
          </div>
        </div>

        {                      }
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '12px', padding: '18px 20px', boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: 'var(--text-muted)', fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            <span>Completed Orders</span>
            <CheckCircle2 size={18} style={{ color: '#10b981' }} />
          </div>
          <div style={{ fontSize: '24px', fontWeight: 700, color: '#10b981', marginTop: '8px' }}>
            {loading ? '—' : formatNumber(summary.completed_orders)}
          </div>
        </div>

        {                      }
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '12px', padding: '18px 20px', boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: 'var(--text-muted)', fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            <span>Cancelled Orders</span>
            <XCircle size={18} style={{ color: '#ef4444' }} />
          </div>
          <div style={{ fontSize: '24px', fontWeight: 700, color: '#ef4444', marginTop: '8px' }}>
            {loading ? '—' : formatNumber(summary.cancelled_orders)}
          </div>
        </div>

        {                   }
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '12px', padding: '18px 20px', boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: 'var(--text-muted)', fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            <span>Total Revenue</span>
            <DollarSign size={18} style={{ color: '#f97316' }} />
          </div>
          <div style={{ fontSize: '24px', fontWeight: 700, color: 'var(--text-primary)', marginTop: '8px' }}>
            {loading ? '—' : formatCurrency(summary.total_revenue)}
          </div>
        </div>

        {                         }
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '12px', padding: '18px 20px', boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: 'var(--text-muted)', fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            <span>Average Order Value</span>
            <ReceiptText size={18} style={{ color: '#a855f7' }} />
          </div>
          <div style={{ fontSize: '24px', fontWeight: 700, color: 'var(--text-primary)', marginTop: '8px' }}>
            {loading ? '—' : formatCurrency(summary.average_order_value)}
          </div>
        </div>
      </div>

      {                                                               }
      {!loading && summary.total_orders > 0 && (
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
                  Order Fulfillment & Status Ratio
                </div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                  Completion rate & delivery pipeline health
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
                Fulfillment Health
              </span>
            </div>

            {(() => {
              const comp = summary.completed_orders || 0;
              const canc = summary.cancelled_orders || 0;
              const pending = Math.max(0, summary.total_orders - comp - canc);
              const total = summary.total_orders || 1;
              const compRate = Math.round((comp / total) * 100);

              const radius = 38;
              const circumference = 2 * Math.PI * radius;

              const compPct = comp / total;
              const cancPct = canc / total;
              const pendPct = pending / total;

              return (
                <div style={{ display: 'flex', alignItems: 'center', gap: '24px', flex: 1, flexWrap: 'wrap' }}>
                  {               }
                  <div style={{ position: 'relative', width: '130px', height: '130px', flexShrink: 0, margin: '0 auto' }}>
                    <svg width="130" height="130" viewBox="0 0 100 100">
                      <circle cx="50" cy="50" r={radius} fill="transparent" stroke="var(--border)" strokeWidth="12" />
                      {                   }
                      <circle
                        cx="50"
                        cy="50"
                        r={radius}
                        fill="transparent"
                        stroke="#10b981"
                        strokeWidth="12"
                        strokeDasharray={`${compPct * circumference} ${circumference}`}
                        strokeDashoffset="0"
                        strokeLinecap="round"
                        style={{ transform: 'rotate(-90deg)', transformOrigin: '50px 50px' }}
                      />
                      {                   }
                      <circle
                        cx="50"
                        cy="50"
                        r={radius}
                        fill="transparent"
                        stroke="#ef4444"
                        strokeWidth="12"
                        strokeDasharray={`${cancPct * circumference} ${circumference}`}
                        strokeDashoffset={`${-compPct * circumference}`}
                        strokeLinecap="round"
                        style={{ transform: 'rotate(-90deg)', transformOrigin: '50px 50px' }}
                      />
                      {                 }
                      {pendPct > 0 && (
                        <circle
                          cx="50"
                          cy="50"
                          r={radius}
                          fill="transparent"
                          stroke="#f59e0b"
                          strokeWidth="12"
                          strokeDasharray={`${pendPct * circumference} ${circumference}`}
                          strokeDashoffset={`${-(compPct + cancPct) * circumference}`}
                          strokeLinecap="round"
                          style={{ transform: 'rotate(-90deg)', transformOrigin: '50px 50px' }}
                        />
                      )}
                    </svg>
                    <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center' }}>
                      <div style={{ fontSize: '18px', fontWeight: 800, color: '#10b981', lineHeight: 1 }}>
                        {compRate}%
                      </div>
                      <div style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase', marginTop: '2px' }}>
                        Success
                      </div>
                    </div>
                  </div>

                  {                   }
                  <div style={{ flex: 1, minWidth: '180px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ width: '10px', height: '10px', borderRadius: '3px', background: '#10b981' }} />
                        <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>Completed</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{comp.toLocaleString()}</span>
                        <span style={{ color: 'var(--text-muted)', fontSize: '11px' }}>({compRate}%)</span>
                      </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ width: '10px', height: '10px', borderRadius: '3px', background: '#ef4444' }} />
                        <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>Cancelled</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{canc.toLocaleString()}</span>
                        <span style={{ color: 'var(--text-muted)', fontSize: '11px' }}>({Math.round((canc / total) * 100)}%)</span>
                      </div>
                    </div>

                    {pending > 0 && (
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <div style={{ width: '10px', height: '10px', borderRadius: '3px', background: '#f59e0b' }} />
                          <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>In-Flight / Pending</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{pending.toLocaleString()}</span>
                          <span style={{ color: 'var(--text-muted)', fontSize: '11px' }}>({Math.round((pending / total) * 100)}%)</span>
                        </div>
                      </div>
                    )}

                    <div style={{ borderTop: '1px solid var(--border)', paddingTop: '8px', display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                      <span style={{ color: 'var(--text-muted)' }}>Net Revenue Generated:</span>
                      <span style={{ fontWeight: 700, color: '#10b981' }}>{formatCurrency(summary.total_revenue)}</span>
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>

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
                  Ordering Channel Distribution
                </div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                  Sales volume split across Dine-In, Delivery & Takeaway
                </div>
              </div>
              <span
                style={{
                  fontSize: '11px',
                  fontWeight: 600,
                  padding: '3px 8px',
                  borderRadius: '6px',
                  background: 'rgba(59, 130, 246, 0.1)',
                  color: '#3b82f6'
                }}
              >
                Multi-Channel
              </span>
            </div>

            <BarChart title="Orders by channel" subtitle="All records matching the current filters, before pagination" unit="orders" data={(summary.channel_distribution || []).map(r=>({label:r.channel,value:r.count}))}/>
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
        {            }
        <div style={{ position: 'relative', flex: '1 1 240px', maxWidth: '340px' }}>
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
            placeholder="Search Order ID, Customer..."
            value={searchQuery}
            onChange={(e) => handleFilterChange(setSearchQuery, e.target.value)}
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
              onClick={() => handleFilterChange(setSearchQuery, '')}
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

        {                  }
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          {             }
          <select
            value={channelFilter}
            onChange={(e) => handleFilterChange(setChannelFilter, e.target.value)}
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
            <option value="ALL">All Channels</option>
            <option value="DINE_IN">Dine-In</option>
            <option value="TAKEOUT">Takeout</option>
            <option value="DELIVERY">Delivery</option>
            <option value="DRIVE_THRU">Drive-Thru</option>
          </select>

          {            }
          <select
            value={statusFilter}
            onChange={(e) => handleFilterChange(setStatusFilter, e.target.value)}
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
            <option value="COMPLETED">Completed</option>
            <option value="CANCELLED">Cancelled</option>
            <option value="PENDING">Pending</option>
            <option value="PREPARING">Preparing</option>
          </select>

          {               }
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <CalendarDays size={14} style={{ color: 'var(--text-muted)' }} />
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => handleFilterChange(setDateFrom, e.target.value)}
              style={{
                padding: '7px 10px',
                borderRadius: '8px',
                border: '1px solid var(--border)',
                background: 'var(--background)',
                color: 'var(--text-primary)',
                fontSize: '12px',
                outline: 'none'
              }}
            />
          </div>

          {             }
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
            <option value="date_desc">Latest Orders</option>
            <option value="date_asc">Oldest Orders</option>
            <option value="amount_desc">Amount (High to Low)</option>
            <option value="amount_asc">Amount (Low to High)</option>
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
            onClick={() => fetchOrders()}
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
          boxShadow: 'var(--shadow-sm)',
          marginBottom: '20px'
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
                <th style={{ padding: '14px 18px', width: '130px' }}>Order ID</th>
                <th style={{ padding: '14px 18px', width: '140px' }}>Date / Time</th>
                <th style={{ padding: '14px 18px' }}>Customer</th>
                <th style={{ padding: '14px 18px' }}>Restaurant Location</th>
                <th style={{ padding: '14px 18px' }}>Channel</th>
                <th style={{ padding: '14px 18px', textAlign: 'center', width: '70px' }}>Items</th>
                <th style={{ padding: '14px 18px' }}>Promotion</th>
                <th style={{ padding: '14px 18px', textAlign: 'right', width: '110px' }}>Total</th>
                <th style={{ padding: '14px 18px', width: '110px' }}>Status</th>
                <th style={{ padding: '14px 18px', textAlign: 'center', width: '80px' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                [...Array(8)].map((_, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid var(--border)' }}>
                    <td style={{ padding: '16px 18px' }}><div style={{ height: '18px', width: '85px', background: 'var(--border)', borderRadius: '4px' }} /></td>
                    <td style={{ padding: '16px 18px' }}><div style={{ height: '18px', width: '100px', background: 'var(--border)', borderRadius: '4px' }} /></td>
                    <td style={{ padding: '16px 18px' }}><div style={{ height: '18px', width: '110px', background: 'var(--border)', borderRadius: '4px' }} /></td>
                    <td style={{ padding: '16px 18px' }}><div style={{ height: '18px', width: '150px', background: 'var(--border)', borderRadius: '4px' }} /></td>
                    <td style={{ padding: '16px 18px' }}><div style={{ height: '18px', width: '80px', background: 'var(--border)', borderRadius: '12px' }} /></td>
                    <td style={{ padding: '16px 18px' }}><div style={{ height: '18px', width: '30px', background: 'var(--border)', borderRadius: '4px', margin: '0 auto' }} /></td>
                    <td style={{ padding: '16px 18px' }}><div style={{ height: '18px', width: '70px', background: 'var(--border)', borderRadius: '4px' }} /></td>
                    <td style={{ padding: '16px 18px' }}><div style={{ height: '18px', width: '70px', background: 'var(--border)', borderRadius: '4px', marginLeft: 'auto' }} /></td>
                    <td style={{ padding: '16px 18px' }}><div style={{ height: '18px', width: '75px', background: 'var(--border)', borderRadius: '12px' }} /></td>
                    <td style={{ padding: '16px 18px' }}><div style={{ height: '24px', width: '28px', background: 'var(--border)', borderRadius: '6px', margin: '0 auto' }} /></td>
                  </tr>
                ))
              ) : orders.length === 0 ? (
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
                        <ShoppingCart size={28} />
                      </div>
                      <div style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text-primary)' }}>
                        No order transactions found.
                      </div>
                      <p style={{ fontSize: '13px', color: 'var(--text-muted)', maxWidth: '380px' }}>
                        No transactions matched your filter criteria. Try expanding your date range or clearing filters.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                orders.map((o) => {
                  const isCompleted = o.order_status === 'COMPLETED';
                  const isCancelled = o.order_status === 'CANCELLED';

                  return (
                    <tr
                      key={o.order_id}
                      style={{
                        borderBottom: '1px solid var(--border)',
                        transition: 'background-color 0.15s ease'
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--background)')}
                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                    >
                      {              }
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
                          {o.order_id}
                        </span>
                      </td>

                      {                 }
                      <td style={{ padding: '14px 18px', fontSize: '13px', color: 'var(--text-secondary)' }}>
                        <div>{o.order_date}</div>
                        <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{o.order_time}</div>
                      </td>

                      {              }
                      <td style={{ padding: '14px 18px', fontSize: '13px', color: 'var(--text-primary)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <User size={14} style={{ color: 'var(--text-muted)' }} />
                          <span style={{ fontFamily: 'monospace' }}>{o.customer_id}</span>
                        </div>
                      </td>

                      {              }
                      <td style={{ padding: '14px 18px', fontSize: '13px', color: 'var(--text-secondary)' }}>
                        <div style={{ fontWeight: 500, color: 'var(--text-primary)' }}>{o.location_name}</div>
                        <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{o.location_id}</div>
                      </td>

                      {             }
                      <td style={{ padding: '14px 18px' }}>
                        <span
                          style={{
                            fontSize: '11px',
                            fontWeight: 600,
                            padding: '3px 8px',
                            borderRadius: '6px',
                            background:
                              o.order_type === 'DINE_IN'
                                ? 'rgba(59, 130, 246, 0.12)'
                                : o.order_type === 'TAKEOUT'
                                ? 'rgba(249, 115, 22, 0.12)'
                                : o.order_type === 'DELIVERY'
                                ? 'rgba(16, 185, 129, 0.12)'
                                : 'rgba(168, 85, 247, 0.12)',
                            color:
                              o.order_type === 'DINE_IN'
                                ? '#3b82f6'
                                : o.order_type === 'TAKEOUT'
                                ? '#f97316'
                                : o.order_type === 'DELIVERY'
                                ? '#10b981'
                                : '#a855f7'
                          }}
                        >
                          {o.order_type.replace('_', ' ')}
                        </span>
                      </td>

                      {           }
                      <td style={{ padding: '14px 18px', textAlign: 'center', fontSize: '13px', color: 'var(--text-secondary)' }}>
                        {o.item_count}
                      </td>

                      {               }
                      <td style={{ padding: '14px 18px', fontSize: '12px' }}>
                        {o.promotion_id ? (
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: '#f97316', fontWeight: 500 }}>
                            <Tag size={12} />
                            <span>{o.promotion_id}</span>
                          </span>
                        ) : (
                          <span style={{ color: 'var(--text-muted)' }}>—</span>
                        )}
                      </td>

                      {           }
                      <td style={{ padding: '14px 18px', textAlign: 'right', fontWeight: 600, color: 'var(--text-primary)' }}>
                        {formatCurrency(o.total_amount)}
                      </td>

                      {            }
                      <td style={{ padding: '14px 18px' }}>
                        <span
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '5px',
                            padding: '3px 9px',
                            borderRadius: '12px',
                            fontSize: '11px',
                            fontWeight: 600,
                            background: isCompleted
                              ? 'rgba(16, 185, 129, 0.12)'
                              : isCancelled
                              ? 'rgba(239, 68, 68, 0.12)'
                              : 'rgba(234, 179, 8, 0.12)',
                            color: isCompleted ? '#10b981' : isCancelled ? '#ef4444' : '#eab308'
                          }}
                        >
                          <span
                            style={{
                              width: '6px',
                              height: '6px',
                              borderRadius: '50%',
                              backgroundColor: isCompleted ? '#10b981' : isCancelled ? '#ef4444' : '#eab308'
                            }}
                          />
                          {o.order_status}
                        </span>
                      </td>

                      {            }
                      <td style={{ padding: '14px 18px', textAlign: 'center' }}>
                        <button
                          onClick={() => handleOpenDetail(o.order_id)}
                          title="View order details"
                          style={{
                            padding: '6px',
                            borderRadius: '6px',
                            border: '1px solid var(--border)',
                            background: 'transparent',
                            color: 'var(--text-secondary)',
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                        >
                          <Eye size={15} />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {                                                               }
        <div
          style={{
            padding: '14px 20px',
            borderTop: '1px solid var(--border)',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px',
            fontSize: '13px',
            color: 'var(--text-muted)'
          }}
        >
          <div>
            Showing <strong style={{ color: 'var(--text-primary)' }}>{orders.length}</strong> of{' '}
            <strong style={{ color: 'var(--text-primary)' }}>{formatNumber(totalCount)}</strong> orders
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span>Rows per page:</span>
              <select
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                  setPage(1);
                }}
                style={{
                  padding: '4px 8px',
                  borderRadius: '6px',
                  border: '1px solid var(--border)',
                  background: 'var(--background)',
                  color: 'var(--text-primary)',
                  fontSize: '12px',
                  outline: 'none'
                }}
              >
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
              </select>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span>
                Page <strong style={{ color: 'var(--text-primary)' }}>{page}</strong> of{' '}
                <strong style={{ color: 'var(--text-primary)' }}>{totalPages}</strong>
              </span>

              <button
                onClick={() => setPage((p) => Math.max(p - 1, 1))}
                disabled={page <= 1 || loading}
                style={{
                  padding: '6px',
                  borderRadius: '6px',
                  border: '1px solid var(--border)',
                  background: 'transparent',
                  color: page <= 1 ? 'var(--text-muted)' : 'var(--text-primary)',
                  cursor: page <= 1 ? 'not-allowed' : 'pointer',
                  display: 'flex'
                }}
              >
                <ChevronLeft size={16} />
              </button>

              <button
                onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                disabled={page >= totalPages || loading}
                style={{
                  padding: '6px',
                  borderRadius: '6px',
                  border: '1px solid var(--border)',
                  background: 'transparent',
                  color: page >= totalPages ? 'var(--text-muted)' : 'var(--text-primary)',
                  cursor: page >= totalPages ? 'not-allowed' : 'pointer',
                  display: 'flex'
                }}
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {                                                                }
      {selectedOrder && (
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
            if (e.target === e.currentTarget && !statusUpdating) setSelectedOrder(null);
          }}
        >
          <div
            style={{
              background: 'var(--surface)',
              border: '1px solid var(--border)',
              borderRadius: '14px',
              width: '100%',
              maxWidth: '680px',
              maxHeight: '90vh',
              overflowY: 'auto',
              boxShadow: 'var(--shadow-lg)'
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
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)' }}>
                    Order Details: {selectedOrder.header.order_id}
                  </h3>
                  <span
                    style={{
                      fontSize: '11px',
                      fontWeight: 600,
                      padding: '2px 8px',
                      borderRadius: '12px',
                      background:
                        selectedOrder.header.order_status === 'COMPLETED'
                          ? 'rgba(16, 185, 129, 0.12)'
                          : 'rgba(239, 68, 68, 0.12)',
                      color:
                        selectedOrder.header.order_status === 'COMPLETED' ? '#10b981' : '#ef4444'
                    }}
                  >
                    {selectedOrder.header.order_status}
                  </span>
                </div>
                <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '4px' }}>
                  Placed on {selectedOrder.header.order_date} at {selectedOrder.header.order_time} • Channel:{' '}
                  {selectedOrder.header.order_type}
                </div>
              </div>

              <button
                onClick={() => setSelectedOrder(null)}
                style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
              >
                <X size={18} />
              </button>
            </div>

            {                }
            <div style={{ padding: '24px' }}>
              {               }
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(2, 1fr)',
                  gap: '12px',
                  background: 'var(--background)',
                  border: '1px solid var(--border)',
                  borderRadius: '10px',
                  padding: '16px',
                  marginBottom: '20px',
                  fontSize: '13px'
                }}
              >
                <div>
                  <span style={{ color: 'var(--text-muted)' }}>Customer Reference:</span>{' '}
                  <strong style={{ color: 'var(--text-primary)' }}>{selectedOrder.header.customer_id}</strong>
                </div>
                <div>
                  <span style={{ color: 'var(--text-muted)' }}>Payment Method:</span>{' '}
                  <strong style={{ color: 'var(--text-primary)' }}>{selectedOrder.header.payment_method}</strong>
                </div>
                <div>
                  <span style={{ color: 'var(--text-muted)' }}>Restaurant:</span>{' '}
                  <strong style={{ color: 'var(--text-primary)' }}>
                    {selectedOrder.header.location_name} ({selectedOrder.header.location_id})
                  </strong>
                </div>
                <div>
                  <span style={{ color: 'var(--text-muted)' }}>Applied Promotion:</span>{' '}
                  <strong style={{ color: selectedOrder.header.promotion_name ? '#f97316' : 'var(--text-muted)' }}>
                    {selectedOrder.header.promotion_name || 'None'}
                  </strong>
                </div>
              </div>

              {                                }
              <h4 style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '10px' }}>
                Itemized Order Lines
              </h4>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', marginBottom: '20px' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border)', color: 'var(--text-muted)', textAlign: 'left' }}>
                    <th style={{ padding: '8px 0' }}>Menu Item</th>
                    <th style={{ padding: '8px 0', textAlign: 'center', width: '50px' }}>Qty</th>
                    <th style={{ padding: '8px 0', textAlign: 'right', width: '90px' }}>Unit Price</th>
                    <th style={{ padding: '8px 0', textAlign: 'right', width: '80px' }}>Discount</th>
                    <th style={{ padding: '8px 0', textAlign: 'right', width: '90px' }}>Line Total</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedOrder.order_lines.map((ln, idx) => (
                    <tr key={idx} style={{ borderBottom: '1px solid var(--border)' }}>
                      <td style={{ padding: '10px 0', fontWeight: 500, color: 'var(--text-primary)' }}>
                        {ln.item_name}
                      </td>
                      <td style={{ padding: '10px 0', textAlign: 'center', color: 'var(--text-secondary)' }}>
                        {ln.quantity}
                      </td>
                      <td style={{ padding: '10px 0', textAlign: 'right', color: 'var(--text-secondary)' }}>
                        {formatCurrency(ln.unit_price)}
                      </td>
                      <td style={{ padding: '10px 0', textAlign: 'right', color: '#ef4444' }}>
                        {ln.discount > 0 ? `-${formatCurrency(ln.discount)}` : '—'}
                      </td>
                      <td style={{ padding: '10px 0', textAlign: 'right', fontWeight: 600, color: 'var(--text-primary)' }}>
                        {formatCurrency(ln.line_total)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {                      }
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '6px',
                  borderTop: '2px solid var(--border)',
                  paddingTop: '12px',
                  fontSize: '13px'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
                  <span>Subtotal:</span>
                  <span>{formatCurrency(selectedOrder.header.subtotal_amount)}</span>
                </div>
                {selectedOrder.header.discount_amount > 0 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: '#ef4444' }}>
                    <span>Promotion Discount:</span>
                    <span>-{formatCurrency(selectedOrder.header.discount_amount)}</span>
                  </div>
                )}
                {selectedOrder.header.tax_amount > 0 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
                    <span>Tax:</span>
                    <span>{formatCurrency(selectedOrder.header.tax_amount)}</span>
                  </div>
                )}
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    fontSize: '16px',
                    fontWeight: 700,
                    color: 'var(--text-primary)',
                    marginTop: '6px',
                    paddingTop: '6px',
                    borderTop: '1px solid var(--border)'
                  }}
                >
                  <span>Grand Total:</span>
                  <span>{formatCurrency(selectedOrder.header.total_amount)}</span>
                </div>
              </div>

              {                                          }
              {(userRole === 'admin' || userRole === 'manager' || userRole === 'regional_manager') && (
                <div
                  style={{
                    marginTop: '24px',
                    paddingTop: '16px',
                    borderTop: '1px solid var(--border)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}
                >
                  <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Update Order Lifecycle:</span>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    {selectedOrder.header.order_status !== 'COMPLETED' && (
                      <button
                        onClick={() => handleUpdateStatus(selectedOrder.header.order_id, 'COMPLETED')}
                        disabled={statusUpdating}
                        style={{
                          padding: '6px 12px',
                          borderRadius: '6px',
                          border: 'none',
                          background: '#10b981',
                          color: '#ffffff',
                          fontSize: '12px',
                          fontWeight: 600,
                          cursor: 'pointer'
                        }}
                      >
                        Mark Completed
                      </button>
                    )}
                    {selectedOrder.header.order_status !== 'CANCELLED' && (
                      <button
                        onClick={() => handleUpdateStatus(selectedOrder.header.order_id, 'CANCELLED')}
                        disabled={statusUpdating}
                        style={{
                          padding: '6px 12px',
                          borderRadius: '6px',
                          border: '1px solid rgba(239, 68, 68, 0.3)',
                          background: 'rgba(239, 68, 68, 0.1)',
                          color: '#ef4444',
                          fontSize: '12px',
                          fontWeight: 600,
                          cursor: 'pointer'
                        }}
                      >
                        Cancel Order
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

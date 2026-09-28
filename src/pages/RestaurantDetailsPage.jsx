import { BarChart, chartGrid } from '../components/AnalyticsCharts';
import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  ArrowLeft,
  Store,
  MapPin,
  Users,
  DollarSign,
  ShoppingBag,
  TrendingUp,
  Star,
  Trash2,
  ChartNoAxesCombined,
  Pencil,
  AlertTriangle,
  RefreshCw,
  Phone,
  UserCheck,
  Award,
  Layers,
  UtensilsCrossed,
  CheckCircle2,
  XCircle,
  Clock,
  Sparkles
} from 'lucide-react';

export default function RestaurantDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, token } = useAuth();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const userRole = user?.role_id || 'analyst';

  const getAuthHeaders = useCallback(() => {
    const headers = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;
    if (userRole) headers['X-User-Role'] = userRole;
    return headers;
  }, [token, userRole]);

  const fetchDetails = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/v1/restaurants/${id}`, {
        headers: getAuthHeaders()
      });

      if (!res.ok) {
        if (res.status === 404) {
          throw new Error(`Restaurant location '${id}' was not found.`);
        }
        throw new Error(`Failed to load restaurant details: HTTP ${res.status}`);
      }

      const resData = await res.json();
      setData(resData);
    } catch (err) {
      console.error('Error fetching restaurant details:', err);
      setError(err.message || 'An error occurred while loading restaurant information.');
    } finally {
      setLoading(false);
    }
  }, [id, getAuthHeaders]);

  useEffect(() => {
    if (id) {
      fetchDetails();
    }
  }, [id, fetchDetails]);

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

  if (loading) {
    return (
      <div style={{ padding: '32px', maxWidth: '1400px', margin: '0 auto' }}>
        {                      }
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
          <div style={{ height: '36px', width: '120px', background: 'var(--border)', borderRadius: '8px' }} />
        </div>
        <div style={{ height: '140px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '12px', marginBottom: '24px' }} />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' }}>
          {[...Array(4)].map((_, i) => (
            <div key={i} style={{ height: '100px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '10px' }} />
          ))}
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div style={{ padding: '40px 32px', maxWidth: '1400px', margin: '0 auto' }}>
        <button
          onClick={() => navigate('/management/restaurants')}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 14px',
            borderRadius: '8px',
            border: '1px solid var(--border)',
            background: 'var(--surface)',
            color: 'var(--text-secondary)',
            fontSize: '13px',
            cursor: 'pointer',
            marginBottom: '24px'
          }}
        >
          <ArrowLeft size={16} />
          <span>Back to Restaurants</span>
        </button>

        <div
          style={{
            background: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            borderRadius: '12px',
            padding: '24px',
            textAlign: 'center'
          }}
        >
          <AlertTriangle size={32} style={{ color: '#ef4444', margin: '0 auto 12px' }} />
          <h2 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '8px' }}>
            {error || 'Restaurant Details Unavailable'}
          </h2>
          <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '16px' }}>
            Could not retrieve data for location ID: {id}.
          </p>
          <button
            onClick={() => fetchDetails()}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 16px',
              borderRadius: '8px',
              background: '#ef4444',
              border: 'none',
              color: '#ffffff',
              fontSize: '13px',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            <RefreshCw size={14} />
            <span>Retry Connection</span>
          </button>
        </div>
      </div>
    );
  }

  const { restaurant, performance, menu_breakdown = [], channel_distribution = [] } = data;
  const isActive = restaurant.operating_status === 'ACTIVE';

  return (
    <div style={{ padding: '24px 32px 48px', maxWidth: '1600px', margin: '0 auto' }}>
      {                                                               }
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
        <button
          onClick={() => navigate('/management/restaurants')}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 14px',
            borderRadius: '8px',
            border: '1px solid var(--border)',
            background: 'var(--surface)',
            color: 'var(--text-secondary)',
            fontSize: '13px',
            fontWeight: 500,
            cursor: 'pointer',
            transition: 'all 0.15s ease'
          }}
        >
          <ArrowLeft size={16} />
          <span>Back to Restaurants</span>
        </button>

        {                                        }
        <button
          onClick={() => navigate(`/intelligence/locations?location_id=${restaurant.location_id}`)}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '9px 16px',
            borderRadius: '8px',
            border: 'none',
            background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
            color: '#ffffff',
            fontSize: '13px',
            fontWeight: 600,
            cursor: 'pointer',
            boxShadow: '0 2px 8px rgba(59, 130, 246, 0.25)',
            transition: 'all 0.15s ease'
          }}
        >
          <ChartNoAxesCombined size={16} />
          <span>View Location Analytics</span>
        </button>
      </div>

      <div style={chartGrid}>
        <BarChart title="Leading dishes at this restaurant" subtitle="Top 8 returned menu items by revenue" unit="USD" data={menu_breakdown.slice().sort((a,b)=>b.revenue-a.revenue).slice(0,8).map(r=>({label:r.dish_name,value:r.revenue}))}/>
        <BarChart title="Menu contribution margins" subtitle="Same 8 dishes by revenue; negative margins shown in full" unit="%" color="#34d399" data={menu_breakdown.slice().sort((a,b)=>b.revenue-a.revenue).slice(0,8).map(r=>({label:r.dish_name,value:r.margin_pct}))}/>
      </div>
      {                                                               }
      <div
        style={{
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          borderRadius: '14px',
          padding: '24px',
          marginBottom: '24px',
          boxShadow: 'var(--shadow-sm)',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '20px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
          <div
            style={{
              width: '60px',
              height: '60px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, rgba(249, 115, 22, 0.15) 0%, rgba(234, 88, 12, 0.25) 100%)',
              color: '#f97316',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}
          >
            <Store size={30} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
              <h1 style={{ fontSize: '24px', fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
                {restaurant.name}
              </h1>
              <span
                style={{
                  fontFamily: 'monospace',
                  fontSize: '12px',
                  fontWeight: 600,
                  padding: '2px 8px',
                  borderRadius: '6px',
                  background: 'var(--surface-secondary)',
                  border: '1px solid var(--border)',
                  color: 'var(--text-secondary)'
                }}
              >
                {restaurant.location_id}
              </span>
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
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginTop: '6px', fontSize: '13px', color: 'var(--text-muted)' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <MapPin size={14} />
                {restaurant.city}, {restaurant.state}, {restaurant.country}
              </span>
              <span>•</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <UserCheck size={14} />
                Manager: <strong style={{ color: 'var(--text-secondary)' }}>{restaurant.manager_name}</strong>
              </span>
              {restaurant.phone_number && restaurant.phone_number !== 'N/A' && (
                <>
                  <span>•</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <Phone size={14} />
                    {restaurant.phone_number}
                  </span>
                </>
              )}
            </div>
          </div>
        </div>

        {                 }
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {performance.revenue_rank > 0 && (
            <div
              style={{
                padding: '8px 14px',
                borderRadius: '8px',
                background: 'rgba(59, 130, 246, 0.08)',
                border: '1px solid rgba(59, 130, 246, 0.2)',
                textAlign: 'center'
              }}
            >
              <div style={{ fontSize: '11px', fontWeight: 600, color: '#3b82f6', textTransform: 'uppercase' }}>Revenue Rank</div>
              <div style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)' }}>
                #{performance.revenue_rank} <span style={{ fontSize: '12px', fontWeight: 400, color: 'var(--text-muted)' }}>in Network</span>
              </div>
            </div>
          )}
          {performance.profit_rank > 0 && (
            <div
              style={{
                padding: '8px 14px',
                borderRadius: '8px',
                background: 'rgba(16, 185, 129, 0.08)',
                border: '1px solid rgba(16, 185, 129, 0.2)',
                textAlign: 'center'
              }}
            >
              <div style={{ fontSize: '11px', fontWeight: 600, color: '#10b981', textTransform: 'uppercase' }}>Profit Rank</div>
              <div style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)' }}>
                #{performance.profit_rank} <span style={{ fontSize: '12px', fontWeight: 400, color: 'var(--text-muted)' }}>in Network</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {                                                                }
      <h2 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '14px', letterSpacing: '-0.01em' }}>
        Operational Performance Metrics
      </h2>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '14px',
          marginBottom: '28px'
        }}
      >
        {                   }
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '10px', padding: '16px', boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: 'var(--text-muted)', fontSize: '12px', fontWeight: 600, textTransform: 'uppercase' }}>
            <span>Total Revenue</span>
            <DollarSign size={16} style={{ color: '#f97316' }} />
          </div>
          <div style={{ fontSize: '22px', fontWeight: 700, color: 'var(--text-primary)', marginTop: '8px' }}>
            {formatCurrency(performance.total_revenue)}
          </div>
        </div>

        {                  }
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '10px', padding: '16px', boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: 'var(--text-muted)', fontSize: '12px', fontWeight: 600, textTransform: 'uppercase' }}>
            <span>Gross Profit</span>
            <TrendingUp size={16} style={{ color: '#10b981' }} />
          </div>
          <div style={{ fontSize: '22px', fontWeight: 700, color: 'var(--text-primary)', marginTop: '8px' }}>
            {formatCurrency(performance.gross_profit)}
          </div>
          <div style={{ fontSize: '11px', color: '#10b981', marginTop: '4px', fontWeight: 500 }}>
            {performance.contribution_margin_pct}% contribution margin
          </div>
        </div>

        {                  }
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '10px', padding: '16px', boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: 'var(--text-muted)', fontSize: '12px', fontWeight: 600, textTransform: 'uppercase' }}>
            <span>Total Orders</span>
            <ShoppingBag size={16} style={{ color: '#a855f7' }} />
          </div>
          <div style={{ fontSize: '22px', fontWeight: 700, color: 'var(--text-primary)', marginTop: '8px' }}>
            {formatNumber(performance.total_orders)}
          </div>
        </div>

        {                               }
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '10px', padding: '16px', boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: 'var(--text-muted)', fontSize: '12px', fontWeight: 600, textTransform: 'uppercase' }}>
            <span>Average Order Value</span>
            <DollarSign size={16} style={{ color: '#3b82f6' }} />
          </div>
          <div style={{ fontSize: '22px', fontWeight: 700, color: 'var(--text-primary)', marginTop: '8px' }}>
            ${performance.average_order_value ? performance.average_order_value.toFixed(2) : '0.00'}
          </div>
        </div>

        {                      }
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '10px', padding: '16px', boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: 'var(--text-muted)', fontSize: '12px', fontWeight: 600, textTransform: 'uppercase' }}>
            <span>Active Customers</span>
            <Users size={16} style={{ color: '#0ea5e9' }} />
          </div>
          <div style={{ fontSize: '22px', fontWeight: 700, color: 'var(--text-primary)', marginTop: '8px' }}>
            {formatNumber(performance.unique_customer_count)}
          </div>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>
            {performance.repeat_purchase_rate}% repeat rate
          </div>
        </div>

        {                         }
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '10px', padding: '16px', boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: 'var(--text-muted)', fontSize: '12px', fontWeight: 600, textTransform: 'uppercase' }}>
            <span>Wastage Loss</span>
            <Trash2 size={16} style={{ color: '#ef4444' }} />
          </div>
          <div style={{ fontSize: '22px', fontWeight: 700, color: '#ef4444', marginTop: '8px' }}>
            {formatCurrency(performance.total_wastage_loss_amount)}
          </div>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>
            {formatNumber(performance.quantity_wasted)} items reported
          </div>
        </div>

        {                     }
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '10px', padding: '16px', boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: 'var(--text-muted)', fontSize: '12px', fontWeight: 600, textTransform: 'uppercase' }}>
            <span>Overall Rating</span>
            <Star size={16} style={{ color: '#eab308' }} fill="#eab308" />
          </div>
          <div style={{ fontSize: '22px', fontWeight: 700, color: 'var(--text-primary)', marginTop: '8px', display: 'flex', alignItems: 'baseline', gap: '4px' }}>
            <span>{performance.avg_overall_rating ? performance.avg_overall_rating.toFixed(2) : '—'}</span>
            <span style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: 400 }}>/ 5.0</span>
          </div>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>
            CSAT: <strong style={{ color: '#10b981' }}>{performance.csat_pct}%</strong>
          </div>
        </div>

        {                        }
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '10px', padding: '16px', boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: 'var(--text-muted)', fontSize: '12px', fontWeight: 600, textTransform: 'uppercase' }}>
            <span>Seating Capacity</span>
            <Store size={16} style={{ color: '#6366f1' }} />
          </div>
          <div style={{ fontSize: '22px', fontWeight: 700, color: 'var(--text-primary)', marginTop: '8px' }}>
            {restaurant.seating_capacity ?? 'Unavailable'} <span style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: 400 }}>seats</span>
          </div>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>
            Cost index: {restaurant.cost_index ?? 'Unavailable'}x
          </div>
        </div>
      </div>

      {                                                                }
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '20px', marginBottom: '28px' }}>
        {                      }
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '12px', padding: '20px', boxShadow: 'var(--shadow-sm)' }}>
          <h3 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Layers size={18} style={{ color: '#f97316' }} />
            <span>Store Specification</span>
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '13px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border)', paddingBottom: '8px' }}>
              <span style={{ color: 'var(--text-muted)' }}>Location Tier</span>
              <strong style={{ color: 'var(--text-primary)' }}>{restaurant.location_tier}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border)', paddingBottom: '8px' }}>
              <span style={{ color: 'var(--text-muted)' }}>Drive-Thru Facility</span>
              <strong style={{ color: restaurant.has_drive_thru ? '#10b981' : 'var(--text-secondary)' }}>
                {restaurant.has_drive_thru ? 'Yes (Equipped)' : 'No'}
              </strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border)', paddingBottom: '8px' }}>
              <span style={{ color: 'var(--text-muted)' }}>Outdoor Seating / Patio</span>
              <strong style={{ color: restaurant.has_outdoor_seating ? '#10b981' : 'var(--text-secondary)' }}>
                {restaurant.has_outdoor_seating ? 'Yes (Equipped)' : 'No'}
              </strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border)', paddingBottom: '8px' }}>
              <span style={{ color: 'var(--text-muted)' }}>Food Quality Score</span>
              <strong style={{ color: 'var(--warning)', display: 'inline-flex', alignItems: 'center', gap: '3px' }}><Star size={13} fill="currentColor" /> {performance.avg_food_rating?.toFixed(2) || '4.10'}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '4px' }}>
              <span style={{ color: 'var(--text-muted)' }}>Service & Ambiance Score</span>
              <strong style={{ color: 'var(--warning)', display: 'inline-flex', alignItems: 'center', gap: '3px' }}><Star size={13} fill="currentColor" /> {performance.avg_service_rating?.toFixed(2) || '4.10'} / {performance.avg_ambiance_rating?.toFixed(2) || '4.20'}</strong>
            </div>
          </div>
        </div>

        {                          }
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '12px', padding: '20px', boxShadow: 'var(--shadow-sm)' }}>
          <h3 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ShoppingBag size={18} style={{ color: '#3b82f6' }} />
            <span>Ordering Channel Distribution</span>
          </h3>
          {channel_distribution.length === 0 ? (
            <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>No channel distribution data recorded for this location.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {channel_distribution.map((ch, idx) => (
                <div key={idx}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '6px' }}>
                    <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{ch.channel}</span>
                    <span style={{ color: 'var(--text-secondary)' }}>
                      {formatCurrency(ch.revenue)} ({ch.share_pct}%) • {formatNumber(ch.orders)} orders
                    </span>
                  </div>
                  <div style={{ width: '100%', height: '8px', background: 'var(--border)', borderRadius: '4px', overflow: 'hidden' }}>
                    <div
                      style={{
                        width: `${Math.min(ch.share_pct, 100)}%`,
                        height: '100%',
                        borderRadius: '4px',
                        background:
                          idx === 0
                            ? 'linear-gradient(90deg, #f97316, #ea580c)'
                            : idx === 1
                            ? 'linear-gradient(90deg, #3b82f6, #2563eb)'
                            : idx === 2
                            ? 'linear-gradient(90deg, #10b981, #059669)'
                            : 'linear-gradient(90deg, #a855f7, #9333ea)'
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {                                                                }
      <div
        style={{
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          borderRadius: '14px',
          overflow: 'hidden',
          boxShadow: 'var(--shadow-sm)'
        }}
      >
        <div style={{ padding: '18px 22px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <UtensilsCrossed size={18} style={{ color: '#f97316' }} />
              <span>Top Menu Items Performance</span>
            </h3>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '2px' }}>
              Leading revenue and volume drivers actively served at this location.
            </p>
          </div>
          <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
            Showing {menu_breakdown.length} items
          </span>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '850px' }}>
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
                <th style={{ padding: '12px 18px' }}>Dish Name</th>
                <th style={{ padding: '12px 18px' }}>Category</th>
                <th style={{ padding: '12px 18px', textAlign: 'right' }}>Quantity Sold</th>
                <th style={{ padding: '12px 18px', textAlign: 'right' }}>Revenue</th>
                <th style={{ padding: '12px 18px', textAlign: 'right' }}>Profit Margin</th>
                <th style={{ padding: '12px 18px', textAlign: 'center' }}>Rating</th>
                <th style={{ padding: '12px 18px', textAlign: 'center' }}>Classification</th>
              </tr>
            </thead>
            <tbody>
              {menu_breakdown.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ padding: '36px 20px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '13px' }}>
                    No menu breakdown items available for this location.
                  </td>
                </tr>
              ) : (
                menu_breakdown.map((item, idx) => (
                  <tr
                    key={idx}
                    style={{
                      borderBottom: '1px solid var(--border)',
                      transition: 'background-color 0.15s ease'
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--background)')}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                  >
                    <td style={{ padding: '12px 18px', fontWeight: 600, color: 'var(--text-primary)' }}>
                      {item.dish_name}
                    </td>
                    <td style={{ padding: '12px 18px', color: 'var(--text-secondary)', fontSize: '13px' }}>
                      {item.category_name}
                    </td>
                    <td style={{ padding: '12px 18px', textAlign: 'right', color: 'var(--text-secondary)' }}>
                      {formatNumber(item.quantity_sold)}
                    </td>
                    <td style={{ padding: '12px 18px', textAlign: 'right', fontWeight: 600, color: 'var(--text-primary)' }}>
                      {formatCurrency(item.revenue)}
                    </td>
                    <td style={{ padding: '12px 18px', textAlign: 'right', color: '#10b981', fontWeight: 500 }}>
                      {item.margin_pct}%
                    </td>
                    <td style={{ padding: '12px 18px', textAlign: 'center' }}>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '3px', color: '#eab308', fontWeight: 600, fontSize: '12px' }}>
                        <Star size={12} fill="#eab308" />
                        <span>{item.avg_rating?.toFixed(1) ?? 'Unavailable'}</span>
                      </span>
                    </td>
                    <td style={{ padding: '12px 18px', textAlign: 'center' }}>
                      <span
                        style={{
                          fontSize: '11px',
                          fontWeight: 600,
                          padding: '2px 8px',
                          borderRadius: '6px',
                          background:
                            item.classification === 'Profit Driver'
                              ? 'rgba(16, 185, 129, 0.12)'
                              : item.classification === 'Volume Driver'
                              ? 'rgba(59, 130, 246, 0.12)'
                              : item.classification === 'Hidden Opportunity'
                              ? 'rgba(168, 85, 247, 0.12)'
                              : 'rgba(239, 68, 68, 0.12)',
                          color:
                            item.classification === 'Profit Driver'
                              ? '#10b981'
                              : item.classification === 'Volume Driver'
                              ? '#3b82f6'
                              : item.classification === 'Hidden Opportunity'
                              ? '#a855f7'
                              : '#ef4444'
                        }}
                      >
                        {item.classification}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

import { BarChart } from '../components/AnalyticsCharts';
import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  Star,
  MessageSquare,
  TrendingUp,
  MapPin,
  UtensilsCrossed,
  Search,
  SlidersHorizontal,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  User,
  AlertTriangle,
  Award,
  Sparkles,
  Calendar
} from 'lucide-react';

export default function RatingsPage() {
  const { user, token } = useAuth();
  const userRole = user?.role_id || 'analyst';

  const [ratings, setRatings] = useState([]);
  const [summary, setSummary] = useState({
    average_rating: null,
    rating_count: 0,
    five_star_pct: 0,
    avg_food_score: null,
    avg_service_score: null,
    csat_pct: null
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const [starFilter, setStarFilter] = useState('ALL');
  const [locationFilter, setLocationFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const getAuthHeaders = useCallback(() => {
    const headers = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;
    if (userRole) headers['X-User-Role'] = userRole;
    return headers;
  }, [token, userRole]);

  const fetchRatings = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({
        page: String(page),
        page_size: String(pageSize)
      });

      if (starFilter !== 'ALL') params.append('star_rating', starFilter);
      if (locationFilter !== 'ALL') params.append('location_id', locationFilter);
      if (searchQuery.trim()) params.append('search', searchQuery.trim());

      const res = await fetch(`/api/v1/ratings/feed?${params.toString()}`, {
        headers: getAuthHeaders()
      });

      if (!res.ok) {
        throw new Error(`Failed to load ratings: HTTP ${res.status}`);
      }

      const data = await res.json();
      setRatings(data.ratings || []);
      if (data.summary) setSummary(data.summary);
      setTotalCount(data.total_count || 0);
      setTotalPages(data.total_pages || 1);
    } catch (err) {
      console.error('Error fetching ratings:', err);
      setError(err.message || 'Unable to connect to rating service.');
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, starFilter, locationFilter, searchQuery, getAuthHeaders]);

  useEffect(() => {
    fetchRatings();
  }, [fetchRatings]);

  const handleFilterChange = (setter, val) => {
    setter(val);
    setPage(1);
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
            Customer Ratings
          </h1>
          <p style={{ fontSize: '14px', color: 'var(--text-muted)' }}>
            Monitor guest dining feedback and service ratings across menu items and stores.
          </p>
        </div>

        <button
          onClick={() => fetchRatings()}
          title="Refresh rating feed"
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
        {                    }
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '12px', padding: '18px 20px', boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: 'var(--text-muted)', fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            <span>Average Rating</span>
            <Star size={18} fill="#eab308" color="#eab308" />
          </div>
          <div style={{ fontSize: '26px', fontWeight: 700, color: 'var(--text-primary)', marginTop: '8px', display: 'flex', alignItems: 'baseline', gap: '4px' }}>
            <span>{loading ? '—' : summary.average_rating.toFixed(2)}</span>
            <span style={{ fontSize: '14px', fontWeight: 400, color: 'var(--text-muted)' }}>/ 5.0</span>
          </div>
          <div style={{ fontSize: '11px', color: '#10b981', marginTop: '4px', fontWeight: 500 }}>
            CSAT Score: {summary.csat_pct}%
          </div>
        </div>

        {                  }
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '12px', padding: '18px 20px', boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: 'var(--text-muted)', fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            <span>Total Reviews</span>
            <MessageSquare size={18} style={{ color: '#3b82f6' }} />
          </div>
          <div style={{ fontSize: '26px', fontWeight: 700, color: 'var(--text-primary)', marginTop: '8px' }}>
            {loading ? '—' : formatNumber(summary.rating_count)}
          </div>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>
            Across all network locations
          </div>
        </div>

        {                  }
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '12px', padding: '18px 20px', boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: 'var(--text-muted)', fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            <span>5-Star Share</span>
            <Award size={18} style={{ color: '#10b981' }} />
          </div>
          <div style={{ fontSize: '26px', fontWeight: 700, color: '#10b981', marginTop: '8px' }}>
            {loading ? '—' : `${summary.five_star_pct}%`}
          </div>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>
            Top tier guest satisfaction
          </div>
        </div>

        {                     }
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '12px', padding: '18px 20px', boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: 'var(--text-muted)', fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            <span>Category Quality</span>
            <TrendingUp size={18} style={{ color: '#a855f7' }} />
          </div>
          <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)', marginTop: '8px' }}>
            Food: <strong style={{ color: 'var(--warning)', display: 'inline-flex', alignItems: 'center', gap: '3px' }}><Star size={13} fill="currentColor" /> {summary.avg_food_score?.toFixed(2)}</strong>
          </div>
          <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)', marginTop: '4px' }}>
            Service: <strong style={{ color: 'var(--warning)', display: 'inline-flex', alignItems: 'center', gap: '3px' }}><Star size={13} fill="currentColor" /> {summary.avg_service_score?.toFixed(2)}</strong>
          </div>
        </div>
      </div>

      {                                                                }
      {!loading && (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))',
            gap: '16px',
            marginBottom: '24px'
          }}
        >
          {                                                   }
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
                  Star Rating Frequency Distribution
                </div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                  Rating counts across the selected review scope
                </div>
              </div>
              <span
                style={{
                  fontSize: '11px',
                  fontWeight: 600,
                  padding: '3px 8px',
                  borderRadius: '6px',
                  background: 'rgba(245, 158, 11, 0.1)',
                  color: 'var(--warning)'
                }}
              >
                ★ {summary.average_rating?.toFixed(2)} Avg
              </span>
            </div>

            <BarChart title="Ratings distribution" subtitle="All reviews matching the current filters, before pagination" unit="reviews" color="#fbbf24" data={(summary.star_distribution || []).slice().reverse().map(r=>({label:`${r.stars} stars`,value:r.count}))}/>
          </div>

          {                                                                     }
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
                  Guest Satisfaction (CSAT) & Quality Dimensions
                </div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                  Food, service & hospitality satisfaction scores
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
                Benchmark 80%
              </span>
            </div>

            {                                             }
            {(() => {
              const csat = summary.csat_pct ?? 0;
              const radius = 38;
              const circumference = 2 * Math.PI * radius;
              const strokeVal = (csat / 100) * circumference;

              return (
                <div style={{ display: 'flex', alignItems: 'center', gap: '24px', flex: 1, flexWrap: 'wrap' }}>
                  {                         }
                  <div style={{ position: 'relative', width: '130px', height: '130px', flexShrink: 0, margin: '0 auto' }}>
                    <svg width="130" height="130" viewBox="0 0 100 100">
                      <circle cx="50" cy="50" r={radius} fill="transparent" stroke="var(--border)" strokeWidth="12" />
                      <circle
                        cx="50"
                        cy="50"
                        r={radius}
                        fill="transparent"
                        stroke={csat >= 75 ? '#10b981' : csat >= 60 ? '#f59e0b' : '#ef4444'}
                        strokeWidth="12"
                        strokeDasharray={`${strokeVal} ${circumference}`}
                        strokeDashoffset="0"
                        strokeLinecap="round"
                        style={{ transform: 'rotate(-90deg)', transformOrigin: '50px 50px' }}
                      />
                    </svg>
                    <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center' }}>
                      <div style={{ fontSize: '20px', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1 }}>
                        {summary.csat_pct == null ? 'Unavailable' : `${csat}%`}
                      </div>
                      <div style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase', marginTop: '2px' }}>
                        CSAT Index
                      </div>
                    </div>
                  </div>

                  {                             }
                  <div style={{ flex: 1, minWidth: '180px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '4px' }}>
                        <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>Food Quality & Freshness</span>
                        <span style={{ fontWeight: 700, color: '#f59e0b' }}>★ {summary.avg_food_score?.toFixed(2)} / 5.0</span>
                      </div>
                      <div style={{ width: '100%', height: '6px', background: 'var(--surface-secondary)', borderRadius: '3px', overflow: 'hidden' }}>
                        <div style={{ width: `${(summary.avg_food_score / 5) * 100}%`, height: '100%', background: '#f59e0b', borderRadius: '3px' }} />
                      </div>
                    </div>

                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '4px' }}>
                        <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>Hospitality & Speed of Service</span>
                        <span style={{ fontWeight: 700, color: '#3b82f6' }}>★ {summary.avg_service_score?.toFixed(2)} / 5.0</span>
                      </div>
                      <div style={{ width: '100%', height: '6px', background: 'var(--surface-secondary)', borderRadius: '3px', overflow: 'hidden' }}>
                        <div style={{ width: `${(summary.avg_service_score / 5) * 100}%`, height: '100%', background: '#3b82f6', borderRadius: '3px' }} />
                      </div>
                    </div>

                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '4px' }}>
                        <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>Overall Dining Experience</span>
                        <span style={{ fontWeight: 700, color: '#10b981' }}>★ {summary.average_rating?.toFixed(2)} / 5.0</span>
                      </div>
                      <div style={{ width: '100%', height: '6px', background: 'var(--surface-secondary)', borderRadius: '3px', overflow: 'hidden' }}>
                        <div style={{ width: `${(summary.average_rating / 5) * 100}%`, height: '100%', background: '#10b981', borderRadius: '3px' }} />
                      </div>
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
            placeholder="Search review text, menu dish, guest..."
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
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          {                 }
          <select
            value={starFilter}
            onChange={(e) => handleFilterChange(setStarFilter, e.target.value)}
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
            <option value="ALL">All Star Ratings</option>
            <option value="5">5 Stars (Excellent)</option>
            <option value="4">4 Stars (Good)</option>
            <option value="3">3 Stars (Average)</option>
            <option value="2">2 Stars (Poor)</option>
            <option value="1">1 Star (Critical)</option>
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
            onClick={() => fetchRatings()}
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
                <th style={{ padding: '14px 18px', width: '110px' }}>Rating ID</th>
                <th style={{ padding: '14px 18px', width: '110px' }}>Score</th>
                <th style={{ padding: '14px 18px' }}>Menu Item</th>
                <th style={{ padding: '14px 18px' }}>Restaurant Location</th>
                <th style={{ padding: '14px 18px' }}>Guest Review</th>
                <th style={{ padding: '14px 18px', width: '120px' }}>Customer</th>
                <th style={{ padding: '14px 18px', width: '100px' }}>Date</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                [...Array(8)].map((_, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid var(--border)' }}>
                    <td style={{ padding: '16px 18px' }}><div style={{ height: '18px', width: '70px', background: 'var(--border)', borderRadius: '4px' }} /></td>
                    <td style={{ padding: '16px 18px' }}><div style={{ height: '18px', width: '60px', background: 'var(--border)', borderRadius: '4px' }} /></td>
                    <td style={{ padding: '16px 18px' }}><div style={{ height: '18px', width: '140px', background: 'var(--border)', borderRadius: '4px' }} /></td>
                    <td style={{ padding: '16px 18px' }}><div style={{ height: '18px', width: '120px', background: 'var(--border)', borderRadius: '4px' }} /></td>
                    <td style={{ padding: '16px 18px' }}><div style={{ height: '18px', width: '240px', background: 'var(--border)', borderRadius: '4px' }} /></td>
                    <td style={{ padding: '16px 18px' }}><div style={{ height: '18px', width: '90px', background: 'var(--border)', borderRadius: '4px' }} /></td>
                    <td style={{ padding: '16px 18px' }}><div style={{ height: '18px', width: '80px', background: 'var(--border)', borderRadius: '4px' }} /></td>
                  </tr>
                ))
              ) : ratings.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ padding: '64px 20px', textAlign: 'center' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
                      <div
                        style={{
                          width: '56px',
                          height: '56px',
                          borderRadius: '50%',
                          background: 'rgba(234, 179, 8, 0.1)',
                          color: '#eab308',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        <Star size={28} />
                      </div>
                      <div style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text-primary)' }}>
                        No dining reviews found.
                      </div>
                      <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                        No ratings matched your current filter criteria.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                ratings.map((r) => (
                  <tr
                    key={r.rating_id}
                    style={{
                      borderBottom: '1px solid var(--border)',
                      transition: 'background-color 0.15s ease'
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--background)')}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                  >
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
                        {r.rating_id}
                      </span>
                    </td>

                    <td style={{ padding: '14px 18px' }}>
                      <span
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '3px',
                          fontWeight: 700,
                          fontSize: '13px',
                          color: '#eab308'
                        }}
                      >
                        <Star size={13} fill="#eab308" />
                        <span>{r.overall_rating} / 5</span>
                      </span>
                    </td>

                    <td style={{ padding: '14px 18px' }}>
                      <div style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '13px' }}>
                        {r.item_name}
                      </div>
                      {r.item_id && r.item_id !== 'General' && (
                        <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{r.item_id}</div>
                      )}
                    </td>

                    <td style={{ padding: '14px 18px', fontSize: '13px', color: 'var(--text-secondary)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <MapPin size={13} style={{ color: 'var(--text-muted)' }} />
                        <span>{r.location_name}</span>
                      </div>
                    </td>

                    <td style={{ padding: '14px 18px', fontSize: '13px', color: 'var(--text-secondary)', maxWidth: '320px' }}>
                      <div style={{ fontStyle: 'italic', lineHeight: 1.4 }}>
                        "{r.review_text}"
                      </div>
                    </td>

                    <td style={{ padding: '14px 18px', fontSize: '12px', color: 'var(--text-muted)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <User size={13} />
                        <span style={{ fontFamily: 'monospace' }}>{r.customer_id}</span>
                      </div>
                    </td>

                    <td style={{ padding: '14px 18px', fontSize: '12px', color: 'var(--text-muted)' }}>
                      {r.review_date}
                    </td>
                  </tr>
                ))
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
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: '13px',
            color: 'var(--text-muted)'
          }}
        >
          <div>
            Showing <strong style={{ color: 'var(--text-primary)' }}>{ratings.length}</strong> of{' '}
            <strong style={{ color: 'var(--text-primary)' }}>{formatNumber(totalCount)}</strong> ratings
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
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
                cursor: page <= 1 ? 'not-allowed' : 'pointer'
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
                cursor: page >= totalPages ? 'not-allowed' : 'pointer'
              }}
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

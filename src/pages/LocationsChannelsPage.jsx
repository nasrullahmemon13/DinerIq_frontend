import { BarChart, chartGrid } from '../components/AnalyticsCharts';
import { formatNumber } from '../utils/formatNumber';
import React, { useState } from 'react';
import { useFilter } from '../context/FilterContext';
import useDashboardFeeds from '../hooks/useDashboardFeeds';
import {
  MapPin,
  Store,
  Layers,
  TrendingUp,
  DollarSign,
  Star,
  Trash2,
  RefreshCw,
  Search,
  Filter,
  ArrowUpDown,
  UtensilsCrossed,
  Share2,
  CheckCircle2,
  AlertTriangle,
  ChevronRight,
  ExternalLink
} from 'lucide-react';

export default function LocationsChannelsPage() {
  const [activeTab, setActiveTab] = useState('locations');
  const { selectedLocation, selectedDateRange } = useFilter();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState('All');
  const [selectedTier, setSelectedTier] = useState('All');
  const [sortBy, setSortBy] = useState('revenue');

  const params = new URLSearchParams({ date_range: selectedDateRange, location_ids: selectedLocation, city: selectedCity, tier: selectedTier });
  const channelParams = new URLSearchParams({ date_range: selectedDateRange, location_id: selectedLocation });
  const { data, errors, loading, refresh: fetchAllData } = useDashboardFeeds({
    locations: `/api/v1/analytics/locations-channels/performance?${params}`,
    channels: `/api/v1/analytics/locations-channels/channels?${channelParams}`,
    divergence: '/api/v1/analytics/locations-channels/menu-intelligence',
  });
  const perfData = data.locations;
  const channelData = data.channels;
  const menuData = data.divergence;
  const error = errors[activeTab];

  const kpis = perfData?.kpis || {
    total_locations: 0,
    total_revenue: 0,
    total_profit: 0,
    average_order_value: 0,
    contribution_margin_pct: 0,
    average_rating: 0
  };

  const locations = perfData?.locations || [];
  const cities = ['All', ...(perfData?.cities || [])];
  const tiers = ['All', ...(perfData?.tiers || [])];

  const filteredLocations = locations
    .filter((loc) => {
      const matchSearch =
        !searchQuery ||
        loc.restaurant_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        loc.city.toLowerCase().includes(searchQuery.toLowerCase());
      const matchCity = selectedCity === 'All' || loc.city === selectedCity;
      const matchTier = selectedTier === 'All' || loc.location_tier === selectedTier;
      return matchSearch && matchCity && matchTier;
    })
    .sort((a, b) => {
      if (sortBy === 'revenue') return b.revenue - a.revenue;
      if (sortBy === 'profit') return b.profit - a.profit;
      if (sortBy === 'orders') return b.orders - a.orders;
      if (sortBy === 'rating') return b.avg_overall_rating - a.avg_overall_rating;
      if (sortBy === 'wastage') return b.wastage_loss - a.wastage_loss;
      return 0;
    });

  const channels = channelData?.channel_performance || [];
  const divergentDishes = menuData?.divergent_dishes || [];

  const formatCurrency = (val) =>
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(val || 0);

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
            Locations & Channels Performance
          </h1>
          <p style={{ fontSize: '14px', color: 'var(--text-muted)' }}>
            Benchmark cross-store financial performance, fulfillment channels, and divergent menu popularity.
          </p>
        </div>

        <button
          onClick={fetchAllData}
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
          <span>Refresh Analysis</span>
        </button>
      </div>

      {loading && <p role="status">Loading analysis…</p>}
      {Object.entries(errors).map(([section, message]) => <p role="alert" key={section} style={{ color: 'var(--danger, #ef4444)' }}>{section}: {message}. Use Refresh Analysis to retry.</p>)}
      {activeTab !== 'divergence' && perfData?.scope && <p style={{ color: 'var(--text-muted)', fontSize: 13 }}>
        {perfData.scope.start_date} to {perfData.scope.end_date} · Completed orders · Net sales exclude tax, tips and fees. Profit uses current menu costs; {perfData.scope.orders_missing_costs} orders lack item costs.
      </p>}
      {activeTab === 'divergence' && <p role="note">Full-year network comparison: date and location filters do not apply to this tab.</p>}
      {!loading && !error && <div style={chartGrid}>
        {activeTab === 'locations' && <BarChart title="Location revenue ranking" subtitle="Top 10 locations matching the city, tier and search filters" unit="USD" data={filteredLocations.slice().sort((a,b)=>b.revenue-a.revenue).slice(0,10).map(r=>({label:r.restaurant_name,value:r.revenue}))}/>}
        {activeTab === 'locations' && <BarChart title="Location profit comparison" subtitle="Same top 10 locations by revenue; negative profit remains visible" unit="USD" color="#34d399" data={filteredLocations.slice().sort((a,b)=>b.revenue-a.revenue).slice(0,10).map(r=>({label:r.restaurant_name,value:r.profit}))}/>}
        {activeTab === 'channels' && <BarChart title="Orders by channel" subtitle="Selected date and location; city/tier filters apply to the location table" unit="orders" data={channels.map(r=>({label:r.channel,value:r.orders}))}/>}
        {activeTab === 'channels' && <BarChart title="Revenue by channel" subtitle="Selected date and location" unit="USD" color="#34d399" data={channels.map(r=>({label:r.channel,value:r.revenue}))}/>}
      </div>}
      {                                                               }
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '16px',
          marginBottom: '28px'
        }}
      >
        {                             }
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
              width: '46px',
              height: '46px',
              borderRadius: '10px',
              background: 'rgba(99, 102, 241, 0.1)',
              color: '#6366f1',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Store size={22} />
          </div>
          <div>
            <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Active Locations
            </div>
            <div style={{ fontSize: '24px', fontWeight: 700, color: 'var(--text-primary)', marginTop: '2px' }}>
              {loading ? '...' : errors.locations ? 'Unavailable' : kpis.total_locations} Stores
            </div>
          </div>
        </div>

        {                           }
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
              width: '46px',
              height: '46px',
              borderRadius: '10px',
              background: 'rgba(16, 185, 129, 0.1)',
              color: '#10b981',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <DollarSign size={22} />
          </div>
          <div>
            <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Network Revenue
            </div>
            <div style={{ fontSize: '24px', fontWeight: 700, color: '#10b981', marginTop: '2px' }}>
              {loading ? '...' : errors.locations ? 'Unavailable' : formatCurrency(kpis.total_revenue)}
            </div>
          </div>
        </div>

        {                          }
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
              width: '46px',
              height: '46px',
              borderRadius: '10px',
              background: 'rgba(245, 158, 11, 0.1)',
              color: '#f59e0b',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <TrendingUp size={22} />
          </div>
          <div>
            <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Margin Rate
            </div>
            <div style={{ fontSize: '24px', fontWeight: 700, color: 'var(--text-primary)', marginTop: '2px' }}>
              {loading ? '...' : errors.locations ? 'Unavailable' : `${kpis.contribution_margin_pct}%`}
            </div>
          </div>
        </div>

        {                             }
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
              width: '46px',
              height: '46px',
              borderRadius: '10px',
              background: 'rgba(236, 72, 153, 0.1)',
              color: '#ec4899',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Layers size={22} />
          </div>
          <div>
            <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Average Order Value
            </div>
            <div style={{ fontSize: '24px', fontWeight: 700, color: 'var(--text-primary)', marginTop: '2px' }}>
              {loading ? '...' : errors.locations ? 'Unavailable' : formatCurrency(kpis.average_order_value)}
            </div>
          </div>
        </div>
      </div>

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
          onClick={() => setActiveTab('locations')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 18px',
            borderRadius: '8px 8px 0 0',
            border: 'none',
            borderBottom: activeTab === 'locations' ? '2px solid #6366f1' : '2px solid transparent',
            background: activeTab === 'locations' ? 'rgba(99, 102, 241, 0.08)' : 'transparent',
            color: activeTab === 'locations' ? '#6366f1' : 'var(--text-secondary)',
            fontWeight: activeTab === 'locations' ? 600 : 500,
            fontSize: '14px',
            cursor: 'pointer'
          }}
        >
          <Store size={16} />
          <span>Location Benchmarks ({locations.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('channels')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 18px',
            borderRadius: '8px 8px 0 0',
            border: 'none',
            borderBottom: activeTab === 'channels' ? '2px solid #6366f1' : '2px solid transparent',
            background: activeTab === 'channels' ? 'rgba(99, 102, 241, 0.08)' : 'transparent',
            color: activeTab === 'channels' ? '#6366f1' : 'var(--text-secondary)',
            fontWeight: activeTab === 'channels' ? 600 : 500,
            fontSize: '14px',
            cursor: 'pointer'
          }}
        >
          <Share2 size={16} />
          <span>Fulfillment Channels ({channels.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('divergence')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 18px',
            borderRadius: '8px 8px 0 0',
            border: 'none',
            borderBottom: activeTab === 'divergence' ? '2px solid #6366f1' : '2px solid transparent',
            background: activeTab === 'divergence' ? 'rgba(99, 102, 241, 0.08)' : 'transparent',
            color: activeTab === 'divergence' ? '#6366f1' : 'var(--text-secondary)',
            fontWeight: activeTab === 'divergence' ? 600 : 500,
            fontSize: '14px',
            cursor: 'pointer'
          }}
        >
          <UtensilsCrossed size={16} />
          <span>Cross-Location Divergence ({divergentDishes.length})</span>
        </button>
      </div>

      {                                                                }
      {activeTab === 'locations' && !errors.locations && (
        <div>
          {                }
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
            {            }
            <div
              style={{
                flex: '1 1 240px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                background: 'var(--bg-subtle, rgba(255,255,255,0.04))',
                border: '1px solid var(--border)',
                borderRadius: '8px',
                padding: '8px 12px'
              }}
            >
              <Search size={16} color="var(--text-muted)" />
              <input
                type="text"
                placeholder="Search location or city..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  outline: 'none',
                  color: 'var(--text-primary)',
                  fontSize: '13px',
                  width: '100%'
                }}
              />
            </div>

            {          }
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
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
              {cities.map((c) => (
                <option key={c} value={c}>
                  City: {c}
                </option>
              ))}
            </select>

            {          }
            <select
              value={selectedTier}
              onChange={(e) => setSelectedTier(e.target.value)}
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
              {tiers.map((t) => (
                <option key={t} value={t}>
                  Tier: {t}
                </option>
              ))}
            </select>

            {          }
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
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
              <option value="revenue">Sort by Revenue</option>
              <option value="profit">Sort by Profit</option>
              <option value="orders">Sort by Orders</option>
              <option value="rating">Sort by Rating</option>
              <option value="wastage">Sort by Wastage Loss</option>
            </select>
          </div>

          {                     }
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
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
                <thead>
                  <tr style={{ background: 'var(--bg-subtle, rgba(0,0,0,0.02))', borderBottom: '1px solid var(--border)' }}>
                    <th style={{ padding: '14px 16px', fontWeight: 600, color: 'var(--text-muted)' }}>Location</th>
                    <th style={{ padding: '14px 16px', fontWeight: 600, color: 'var(--text-muted)' }}>Tier</th>
                    <th style={{ padding: '14px 16px', fontWeight: 600, color: 'var(--text-muted)', textAlign: 'right' }}>Revenue</th>
                    <th style={{ padding: '14px 16px', fontWeight: 600, color: 'var(--text-muted)', textAlign: 'right' }}>Profit</th>
                    <th style={{ padding: '14px 16px', fontWeight: 600, color: 'var(--text-muted)', textAlign: 'center' }}>Margin</th>
                    <th style={{ padding: '14px 16px', fontWeight: 600, color: 'var(--text-muted)', textAlign: 'right' }}>Orders</th>
                    <th style={{ padding: '14px 16px', fontWeight: 600, color: 'var(--text-muted)', textAlign: 'right' }}>AOV</th>
                    <th style={{ padding: '14px 16px', fontWeight: 600, color: 'var(--text-muted)', textAlign: 'center' }}>Rating</th>
                    <th style={{ padding: '14px 16px', fontWeight: 600, color: 'var(--text-muted)', textAlign: 'right' }}>Wastage Loss</th>
                  </tr>
                </thead>
                <tbody>
                  {!loading && !filteredLocations.length && <tr><td colSpan={8} style={{ padding: 20 }}>No locations match these filters.</td></tr>}
                  {filteredLocations.map((loc) => (
                    <tr
                      key={loc.location_id}
                      style={{ borderBottom: '1px solid var(--border)', transition: 'background-color 0.15s ease' }}
                    >
                      <td style={{ padding: '14px 16px' }}>
                        <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{loc.restaurant_name}</div>
                        <div style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
                          <MapPin size={11} /> {loc.city}, {loc.state}
                        </div>
                      </td>
                      <td style={{ padding: '14px 16px' }}>
                        <span
                          style={{
                            padding: '3px 8px',
                            borderRadius: '4px',
                            fontSize: '11px',
                            fontWeight: 600,
                            background:
                              loc.location_tier === 'Flagship'
                                ? 'rgba(99, 102, 241, 0.12)'
                                : 'rgba(148, 163, 184, 0.12)',
                            color:
                              loc.location_tier === 'Flagship'
                                ? '#6366f1'
                                : 'var(--text-secondary)'
                          }}
                        >
                          {loc.location_tier}
                        </span>
                      </td>
                      <td style={{ padding: '14px 16px', textAlign: 'right', fontWeight: 600, color: 'var(--text-primary)', fontVariantNumeric: 'tabular-nums' }}>
                        {formatCurrency(loc.revenue)}
                      </td>
                      <td style={{ padding: '14px 16px', textAlign: 'right', color: '#10b981', fontWeight: 600, fontVariantNumeric: 'tabular-nums' }}>
                        {formatCurrency(loc.profit)}
                      </td>
                      <td style={{ padding: '14px 16px', textAlign: 'center' }}>
                        <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{loc.margin_pct}%</span>
                      </td>
                      <td style={{ padding: '14px 16px', textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>
                        {formatNumber(loc?.orders)}
                      </td>
                      <td style={{ padding: '14px 16px', textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>
                        {formatCurrency(loc.aov)}
                      </td>
                      <td style={{ padding: '14px 16px', textAlign: 'center' }}>
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontWeight: 600, color: '#f59e0b' }}>
                          <Star size={13} fill="#f59e0b" />
                          <span>{formatNumber(loc.avg_overall_rating, 'en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                        </div>
                      </td>
                      <td style={{ padding: '14px 16px', textAlign: 'right', color: '#ef4444', fontVariantNumeric: 'tabular-nums' }}>
                        {formatCurrency(loc.wastage_loss)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {                                                                }
      {activeTab === 'channels' && !errors.channels && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
              gap: '16px'
            }}
          >
            {!loading && !channels.length && <p>No completed orders match these filters.</p>}
            {channels.map((chan) => (
              <div
                key={chan.channel}
                style={{
                  background: 'var(--surface)',
                  border: '1px solid var(--border)',
                  borderRadius: '12px',
                  padding: '20px',
                  boxShadow: 'var(--shadow-sm)'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <h3 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>
                    {chan.channel}
                  </h3>
                  <span
                    style={{
                      padding: '3px 8px',
                      borderRadius: '4px',
                      fontSize: '11px',
                      fontWeight: 600,
                      background: 'rgba(99, 102, 241, 0.1)',
                      color: '#6366f1'
                    }}
                  >
                    {chan.order_share_pct}% Volume
                  </span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
                  <div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Revenue</div>
                    <div style={{ fontSize: '18px', fontWeight: 700, color: '#10b981', marginTop: '2px' }}>
                      {formatCurrency(chan.revenue)}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Orders</div>
                    <div style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)', marginTop: '2px' }}>
                      {formatNumber(chan?.orders)}
                    </div>
                  </div>
                </div>

                <div style={{ borderTop: '1px solid var(--border)', paddingTop: '12px', fontSize: '12.5px', color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Average Order Value:</span>
                    <strong style={{ color: 'var(--text-primary)' }}>{formatCurrency(chan.aov)}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Contribution Margin:</span>
                    <strong style={{ color: 'var(--text-primary)' }}>{chan.margin_pct}%</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Peak Ordering Hour:</span>
                    <strong style={{ color: 'var(--text-primary)' }}>{chan.peak_ordering_hour}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Lunch / Dinner Split:</span>
                    <strong style={{ color: 'var(--text-primary)' }}>{chan.lunch_peak_share_pct}% / {chan.dinner_peak_share_pct}%</strong>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {                                                                }
      {activeTab === 'divergence' && !errors.divergence && (
        <div>
          <div style={{ marginBottom: '16px' }}>
            <h2 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text-primary)' }}>
              Cross-Location Menu Popularity Divergence
            </h2>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
              Menu items demonstrating extreme variance across stores (e.g. classified as a Star in one market but an Underperformer in another).
            </p>
          </div>

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
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
                <thead>
                  <tr style={{ background: 'var(--bg-subtle, rgba(0,0,0,0.02))', borderBottom: '1px solid var(--border)' }}>
                    <th style={{ padding: '14px 16px', fontWeight: 600, color: 'var(--text-muted)' }}>Dish Name</th>
                    <th style={{ padding: '14px 16px', fontWeight: 600, color: 'var(--text-muted)' }}>Category</th>
                    <th style={{ padding: '14px 16px', fontWeight: 600, color: 'var(--text-muted)', textAlign: 'right' }}>Min Units Sold</th>
                    <th style={{ padding: '14px 16px', fontWeight: 600, color: 'var(--text-muted)', textAlign: 'right' }}>Max Units Sold</th>
                    <th style={{ padding: '14px 16px', fontWeight: 600, color: 'var(--text-muted)', textAlign: 'center' }}>Spread Ratio</th>
                    <th style={{ padding: '14px 16px', fontWeight: 600, color: 'var(--text-muted)' }}>Best Performing Location</th>
                    <th style={{ padding: '14px 16px', fontWeight: 600, color: 'var(--text-muted)' }}>Underperforming Location</th>
                  </tr>
                </thead>
                <tbody>
                  {divergentDishes.slice(0, 25).map((dish, idx) => (
                    <tr
                      key={idx}
                      style={{ borderBottom: '1px solid var(--border)', transition: 'background-color 0.15s ease' }}
                    >
                      <td style={{ padding: '14px 16px', fontWeight: 600, color: 'var(--text-primary)' }}>
                        {dish.item_name}
                      </td>
                      <td style={{ padding: '14px 16px', color: 'var(--text-secondary)' }}>
                        {dish.category_name}
                      </td>
                      <td style={{ padding: '14px 16px', textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>
                        {formatNumber(dish.min_quantity)}
                      </td>
                      <td style={{ padding: '14px 16px', textAlign: 'right', fontVariantNumeric: 'tabular-nums', fontWeight: 600 }}>
                        {formatNumber(dish.max_quantity)}
                      </td>
                      <td style={{ padding: '14px 16px', textAlign: 'center' }}>
                        <span
                          style={{
                            padding: '3px 8px',
                            borderRadius: '4px',
                            fontWeight: 700,
                            fontSize: '11px',
                            background: 'rgba(239, 68, 68, 0.12)',
                            color: '#ef4444'
                          }}
                        >
                          {dish.spread_ratio ? `${dish.spread_ratio.toFixed(1)}x` : 'Unavailable'}
                        </span>
                      </td>
                      <td style={{ padding: '14px 16px', color: '#10b981', fontWeight: 500 }}>
                        {dish.top_location_name || 'Unavailable'}
                      </td>
                      <td style={{ padding: '14px 16px', color: '#ef4444', fontWeight: 500 }}>
                        {dish.worst_location_name || 'Unavailable'}
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

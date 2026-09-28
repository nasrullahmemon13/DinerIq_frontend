import { formatNumber } from '../utils/formatNumber';
import React, { useState, useEffect } from 'react';
import { Filter, X, Search, RefreshCw, Star } from 'lucide-react';

export default function SearchFilterModal({ isOpen, onClose, onApplyFilters }) {
  const [options, setOptions] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [location, setLocation] = useState('');
  const [menuItem, setMenuItem] = useState('');
  const [menuCategory, setMenuCategory] = useState('');
  const [customerSegment, setCustomerSegment] = useState('');
  const [orderingChannel, setOrderingChannel] = useState('');
  const [promotion, setPromotion] = useState('');
  const [performanceClass, setPerformanceClass] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [minRating, setMinRating] = useState('');
  const [maxRating, setMaxRating] = useState('');
  const [minWastage, setMinWastage] = useState('');
  const [maxWastage, setMaxWastage] = useState('');

  const [queryResults, setQueryResults] = useState(null);
  const [filtering, setFiltering] = useState(false);

  useEffect(() => {
    if (isOpen && !options) {
      setLoading(true);
      fetch('/api/v1/search/options')
        .then(r => { if (!r.ok) throw new Error('Unable to load filter options. Close and reopen to retry.'); return r.json(); })
        .then(data => setOptions(data.dimensions))
        .catch(err => setError(err.message))
        .finally(() => setLoading(false));
    }
  }, [isOpen, options]);

  if (!isOpen) return null;

  const handleApply = async () => {
    setError(null);
    if (startDate && endDate && startDate > endDate) { setError('Start date must be before end date.'); return; }
    const ranges = [[minPrice, maxPrice, 'Price'], [minRating, maxRating, 'Rating'], [minWastage, maxWastage, 'Wastage']];
    for (const [min, max, label] of ranges) {
      if ((min !== '' && Number(min) < 0) || (max !== '' && Number(max) < 0) || (min !== '' && max !== '' && Number(min) > Number(max))) { setError(`${label}: enter a valid minimum and maximum.`); return; }
    }
    setFiltering(true);
    setQueryResults(null);
    const params = new URLSearchParams();
    if (startDate) params.append('start_date', startDate);
    if (endDate) params.append('end_date', endDate);
    if (location) params.append('location', location);
    if (menuItem) params.append('menu_item', menuItem);
    if (menuCategory) params.append('menu_category', menuCategory);
    if (customerSegment) params.append('customer_segment', customerSegment);
    if (orderingChannel) params.append('ordering_channel', orderingChannel);
    if (promotion) params.append('promotion', promotion);
    if (performanceClass) params.append('performance_class', performanceClass);
    if (minPrice) params.append('min_price', minPrice);
    if (maxPrice) params.append('max_price', maxPrice);
    if (minRating) params.append('min_rating', minRating);
    if (maxRating) params.append('max_rating', maxRating);
    if (minWastage) params.append('min_wastage_rate', minWastage);
    if (maxWastage) params.append('max_wastage_rate', maxWastage);

    try {
      const res = await fetch(`/api/v1/search/filter?${params.toString()}`);
      const data = await res.json();
      if (!res.ok) throw new Error(typeof data.detail === 'string' ? data.detail : 'Search failed. Please retry.');
      setQueryResults(data);
      if (onApplyFilters) onApplyFilters(data);
    } catch (e) {
      setError(e.message);
    } finally {
      setFiltering(false);
    }
  };

  const handleReset = () => {
    setError(null);
    setStartDate('');
    setEndDate('');
    setLocation('');
    setMenuItem('');
    setMenuCategory('');
    setCustomerSegment('');
    setOrderingChannel('');
    setPromotion('');
    setPerformanceClass('');
    setMinPrice('');
    setMaxPrice('');
    setMinRating('');
    setMaxRating('');
    setMinWastage('');
    setMaxWastage('');
    setQueryResults(null);
  };

  const inputStyle = {
    width: '100%',
    padding: '8px',
    borderRadius: '6px',
    border: '1px solid var(--border)',
    background: 'var(--surface-secondary)',
    color: 'var(--text-primary)',
    fontSize: '0.8rem'
  };

  const labelStyle = {
    fontSize: '0.75rem',
    fontWeight: 600,
    color: 'var(--text-secondary)',
    display: 'block',
    marginBottom: '4px'
  };

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
        maxWidth: '1020px',
        maxHeight: '90vh',
        overflowY: 'auto',
        padding: '28px',
        background: 'var(--surface)',
        borderColor: 'var(--border)'
      }}>
        {            }
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid var(--border)', paddingBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ padding: '6px', borderRadius: '8px', background: 'var(--primary-tint)', color: 'var(--primary)' }}>
              <Filter size={20} />
            </span>
            <div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                Multi-Dimensional Search &amp; Filter
              </h2>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                Search operational records by date, restaurant, menu and customer segment.
              </p>
            </div>
          </div>
          <button
            aria-label="Close advanced filters"
            onClick={onClose}
            style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', padding: '4px' }}
          >
            <X size={22} />
          </button>
        </div>

        {loading && <p role="status">Loading filter options...</p>}
        {error && <p role="alert" style={{ color: 'var(--danger)', marginBottom: 12 }}>{error}</p>}
        {                     }
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px', marginBottom: '20px' }}>
          {                   }
          <div>
            <label style={labelStyle}>
              1. Date Range (Start - End)
            </label>
            <div style={{ display: 'flex', gap: '6px' }}>
              <input
                type="date"
                value={startDate}
                onChange={e => setStartDate(e.target.value)}
                style={inputStyle}
              />
              <input
                type="date"
                value={endDate}
                onChange={e => setEndDate(e.target.value)}
                style={inputStyle}
              />
            </div>
          </div>

          {                 }
          <div>
            <label style={labelStyle}>
              2. Restaurant Location
            </label>
            <select
              value={location}
              onChange={e => setLocation(e.target.value)}
              style={inputStyle}
            >
              <option value="">All 20 Locations</option>
              {options?.location?.map((loc, idx) => (
                <option key={idx} value={loc}>{loc}</option>
              ))}
            </select>
          </div>

          {                  }
          <div>
            <label style={labelStyle}>
              3. Menu Item Search
            </label>
            <input
              type="text"
              placeholder="e.g. Lobster, Wagyu, Salmon"
              value={menuItem}
              onChange={e => setMenuItem(e.target.value)}
              style={inputStyle}
            />
          </div>

          {                      }
          <div>
            <label style={labelStyle}>
              4. Menu Category
            </label>
            <select
              value={menuCategory}
              onChange={e => setMenuCategory(e.target.value)}
              style={inputStyle}
            >
              <option value="">All 10 Categories</option>
              {options?.menu_category?.map((cat, idx) => (
                <option key={idx} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          {                         }
          <div>
            <label style={labelStyle}>
              5. Customer Segment
            </label>
            <select
              value={customerSegment}
              onChange={e => setCustomerSegment(e.target.value)}
              style={inputStyle}
            >
              <option value="">All Customer Segments</option>
              {options?.customer_segment?.map((seg, idx) => (
                <option key={idx} value={seg}>{seg}</option>
              ))}
            </select>
          </div>

          {                         }
          <div>
            <label style={labelStyle}>
              6. Ordering Channel
            </label>
            <select
              value={orderingChannel}
              onChange={e => setOrderingChannel(e.target.value)}
              style={inputStyle}
            >
              <option value="">All Ordering Channels</option>
              {options?.ordering_channel?.map((ch, idx) => (
                <option key={idx} value={ch}>{ch}</option>
              ))}
            </select>
          </div>

          {                  }
          <div>
            <label style={labelStyle}>
              7. Promotion Campaign
            </label>
            <select
              value={promotion}
              onChange={e => setPromotion(e.target.value)}
              style={inputStyle}
            >
              <option value="">All / Any Promotion</option>
              {options?.promotion?.map((p, idx) => (
                <option key={idx} value={p}>{p}</option>
              ))}
            </select>
          </div>

          {                          }
          <div>
            <label style={labelStyle}>
              8. Performance Class
            </label>
            <select
              value={performanceClass}
              onChange={e => setPerformanceClass(e.target.value)}
              style={inputStyle}
            >
              <option value="">All 4 Performance Classes</option>
              {options?.performance_class?.map((pc, idx) => (
                <option key={idx} value={pc}>{pc}</option>
              ))}
            </select>
          </div>

          {                    }
          <div>
            <label style={labelStyle}>
              9. Price Range ($)
            </label>
            <div style={{ display: 'flex', gap: '6px' }}>
              <input
                type="number"
                placeholder="Min $"
                value={minPrice}
                onChange={e => setMinPrice(e.target.value)}
                style={inputStyle}
              />
              <input
                type="number"
                placeholder="Max $"
                value={maxPrice}
                onChange={e => setMaxPrice(e.target.value)}
                style={inputStyle}
              />
            </div>
          </div>

          {                }
          <div>
            <label style={labelStyle}>
              10. Customer Rating (1.0 - 5.0)
            </label>
            <div style={{ display: 'flex', gap: '6px' }}>
              <input
                type="number"
                step="0.1"
                placeholder="Min Stars"
                value={minRating}
                onChange={e => setMinRating(e.target.value)}
                style={inputStyle}
              />
              <input
                type="number"
                step="0.1"
                placeholder="Max Stars"
                value={maxRating}
                onChange={e => setMaxRating(e.target.value)}
                style={inputStyle}
              />
            </div>
          </div>

          {                       }
          <div>
            <label style={labelStyle}>
              11. Wastage Rate Range (%)
            </label>
            <div style={{ display: 'flex', gap: '6px' }}>
              <input
                type="number"
                placeholder="Min %"
                value={minWastage}
                onChange={e => setMinWastage(e.target.value)}
                style={inputStyle}
              />
              <input
                type="number"
                placeholder="Max %"
                value={maxWastage}
                onChange={e => setMaxWastage(e.target.value)}
                style={inputStyle}
              />
            </div>
          </div>
        </div>

        {             }
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border)', paddingTop: '16px', marginBottom: '16px' }}>
          <button
            onClick={handleReset}
            style={{ background: 'transparent', border: '1px solid var(--border)', color: 'var(--text-secondary)', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontSize: '0.85rem' }}
          >
            Clear All Filters
          </button>

          <button
            onClick={handleApply}
            disabled={filtering}
            style={{
              background: 'var(--primary)',
              color: '#ffffff',
              border: 'none',
              padding: '10px 24px',
              borderRadius: '8px',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            {filtering ? <RefreshCw className="animate-spin" size={16} /> : <Search size={16} />}
            <span>Apply 11-Dimensional Filter</span>
          </button>
        </div>

        {                                 }
        {queryResults && (
          <div style={{ background: 'var(--surface-secondary)', borderRadius: '8px', padding: '16px', border: '1px solid var(--border)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                Filtered Matches: {formatNumber(queryResults?.total_matches)} records
              </span>
              <span className="kpi-badge badge-emerald">
                Filtered Revenue: ${queryResults.aggregates.filtered_total_revenue?.toLocaleString()}
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '10px', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              <div>Gross Profit: <strong style={{ color: 'var(--success)' }}>${queryResults.aggregates.filtered_total_profit?.toLocaleString()}</strong></div>
              <div>Margin: <strong style={{ color: 'var(--primary)' }}>{queryResults.aggregates.filtered_average_margin_pct}%</strong></div>
              <div>Units Sold: <strong style={{ color: 'var(--text-primary)' }}>{queryResults.aggregates.filtered_total_quantity_sold?.toLocaleString()}</strong></div>
              <div>Wastage Loss: <strong style={{ color: 'var(--danger)' }}>${queryResults.aggregates.filtered_total_wastage_cost?.toLocaleString()}</strong></div>
              <div>Avg Rating: <strong style={{ color: 'var(--warning)', display: 'inline-flex', alignItems: 'center', gap: '3px' }}><Star size={12} fill="currentColor" /> {queryResults.aggregates.filtered_average_rating}</strong></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

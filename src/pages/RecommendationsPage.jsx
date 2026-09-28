import { BarChart, chartGrid } from '../components/AnalyticsCharts';
import { useAuth } from '../context/AuthContext';
import React, { useState, useEffect } from 'react';
import {
  Lightbulb,
  Sparkles,
  ArrowRight,
  TrendingUp,
  AlertCircle,
  Search,
  Filter,
  RefreshCw,
  CheckCircle2,
  Tag,
  Gauge,
  Layers
} from 'lucide-react';

export default function RecommendationsPage() {
  const { user } = useAuth();
  const [reviewStatus, setReviewStatus] = useState('');
  const canReview = ['admin','analyst','regional_manager'].includes(user?.role_id);
  const review = async (id, status) => {
    try {
      const response = await fetch(`/api/v1/analytics/recommendations/${id}/review`, {method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({status})});
      if (!response.ok) throw new Error('Unable to save review');
      setReviewStatus('Review saved.'); await fetchRecommendations();
    } catch (error) { setReviewStatus(error.message); }
  };
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedPriority, setSelectedPriority] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const fetchRecommendations = async () => {
    setLoading(true);
    setError(null);
    try {
      let url = '/api/v1/analytics/recommendations';
      const params = new URLSearchParams();
      if (selectedCategory !== 'All') params.append('category', selectedCategory);
      if (selectedPriority !== 'All') params.append('priority', selectedPriority);
      if (searchQuery) params.append('search', searchQuery);
      if (params.toString()) url += `?${params.toString()}`;

      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP error ${res.status}`);
      const json = await res.json();
      setData(json);
    } catch (err) {
      console.error('Error fetching recommendations:', err);
      setError(err.message || 'Failed to load recommendations');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecommendations();
  }, [selectedCategory, selectedPriority, searchQuery]);

  const summary = data?.summary || {
    total_recommendations: 0,
    high_priority_count: 0,
    categories: [],
    priorities: []
  };

  const recommendations = data?.recommendations || [];

  return (
    <div style={{ padding: '24px 32px 48px', maxWidth: '1600px', margin: '0 auto' }}>
      {reviewStatus && <p role="status">{reviewStatus}</p>}
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
            Prescriptive AI Recommendations Engine
          </h1>
          <p style={{ fontSize: '14px', color: 'var(--text-muted)' }}>
            57 evidence-backed strategic actions derived across menu profitability, wastage reduction, and customer retention.
          </p>
        </div>

        <button
          onClick={fetchRecommendations}
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
          <span>Refresh Recommendations</span>
        </button>
      </div>

      {!loading && !error && <div style={chartGrid}>
        <BarChart title="Recommendations by priority" subtitle="Current filtered recommendations" unit="actions" data={['Critical','High','Medium','Low'].map(label=>({label,value:recommendations.filter(r=>r.priority===label).length}))}/>
        <BarChart title="Review progress" subtitle="Current filtered recommendations; saved review status" unit="actions" color="#34d399" data={['pending','accepted','dismissed','implemented'].map(label=>({label,value:recommendations.filter(r=>(r.review?.status || 'pending')===label).length}))}/>
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
        {                                   }
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
            <Lightbulb size={22} />
          </div>
          <div>
            <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              Action Catalog
            </div>
            <div style={{ fontSize: '24px', fontWeight: 700, color: 'var(--text-primary)', marginTop: '2px' }}>
              {summary.total_recommendations} Actions
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Evidence-backed proposals</div>
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
              background: 'rgba(239, 68, 68, 0.1)',
              color: '#ef4444',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Sparkles size={22} />
          </div>
          <div>
            <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              High Priority
            </div>
            <div style={{ fontSize: '24px', fontWeight: 700, color: '#ef4444', marginTop: '2px' }}>
              {summary.high_priority_count} Critical
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Immediate margin ROI</div>
          </div>
        </div>

        {                                }
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
            <Layers size={22} />
          </div>
          <div>
            <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              Analytical Domains
            </div>
            <div style={{ fontSize: '24px', fontWeight: 700, color: '#10b981', marginTop: '2px' }}>
              {summary.categories?.length || 5} Domains
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Menu, Waste, Churn, Ops</div>
          </div>
        </div>
      </div>

      {                                                                }
      <div
        style={{
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          borderRadius: '12px',
          padding: '16px',
          marginBottom: '24px',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          gap: '16px',
          boxShadow: 'var(--shadow-sm)'
        }}
      >
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
            placeholder="Search action or entity..."
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

        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
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
          <option value="All">All Categories</option>
          {summary.categories?.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>

        <select
          value={selectedPriority}
          onChange={(e) => setSelectedPriority(e.target.value)}
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
          <option value="All">All Priorities</option>
          <option value="High">High</option>
          <option value="Medium">Medium</option>
          <option value="Low">Low</option>
        </select>

        <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginLeft: 'auto' }}>
          Showing <strong>{recommendations.length}</strong> recommendations
        </div>
      </div>

      {                                                                }
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(420px, 1fr))',
          gap: '20px'
        }}
      >
        {recommendations.map((rec) => {
          const isHigh = rec.priority?.includes('High') || rec.priority?.includes('Critical');
          return (
            <div
              key={rec.recommendation_id}
              style={{
                background: 'var(--surface)',
                border: '1px solid var(--border)',
                borderRadius: '12px',
                padding: '22px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                boxShadow: 'var(--shadow-sm)'
              }}
            >
              <div>
                {                 }
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
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
                    {rec.category}
                  </span>

                  <div style={{ display: 'flex', gap: '8px' }}>
                    <span
                      style={{
                        padding: '3px 8px',
                        borderRadius: '4px',
                        fontSize: '11px',
                        fontWeight: 700,
                        background: isHigh ? 'rgba(239, 68, 68, 0.12)' : 'rgba(245, 158, 11, 0.12)',
                        color: isHigh ? '#ef4444' : '#f59e0b'
                      }}
                    >
                      {rec.priority} Priority
                    </span>

                    <span
                      style={{
                        padding: '3px 8px',
                        borderRadius: '4px',
                        fontSize: '11px',
                        fontWeight: 600,
                        background: 'rgba(148, 163, 184, 0.12)',
                        color: 'var(--text-secondary)'
                      }}
                    >
                      Effort: {rec.implementation_effort || 'Low'}
                    </span>
                  </div>
                </div>

                {                    }
                <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '6px', lineHeight: '1.3' }}>
                  {rec.recommended_action}
                </h3>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '14px' }}>
                  Target: <strong>{rec.target_entity_name}</strong> ({rec.target_entity_type})
                </div>

                {                       }
                <div
                  style={{
                    background: 'var(--bg-subtle, rgba(255,255,255,0.03))',
                    border: '1px solid var(--border)',
                    borderRadius: '8px',
                    padding: '12px 14px',
                    marginBottom: '14px'
                  }}
                >
                  <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '4px' }}>
                    Supporting Data Evidence
                  </div>
                  <div style={{ fontSize: '12.5px', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
                    {rec.formatted_evidence || rec.reason_bullets}
                  </div>
                </div>

                <div style={{ fontSize: '12.5px', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
                  <strong>Impact Rationale:</strong> {rec.business_impact_rationale}
                </div>
              </div>

              <div
                style={{
                  borderTop: '1px solid var(--border)',
                  marginTop: '16px',
                  paddingTop: '12px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  fontSize: '11.5px',
                  color: 'var(--text-muted)'
                }}
              >
                <span>ID: {rec.recommendation_id} · {rec.review?.status || 'pending'}</span>
                {canReview && <select aria-label={`Review ${rec.recommendation_id}`} value={rec.review?.status || 'pending'} onChange={e=>review(rec.recommendation_id,e.target.value)}>{['pending','accepted','dismissed','implemented'].map(status=><option key={status}>{status}</option>)}</select>}
                <span style={{ color: '#10b981', fontWeight: 600 }}>{rec.potential_business_impact}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

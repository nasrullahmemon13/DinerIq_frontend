import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, ArrowLeft, Layers } from 'lucide-react';

export default function UpcomingPlaceholder({ title, step, phase, description }) {
  const navigate = useNavigate();

  return (
    <div style={{
      maxWidth: '720px',
      margin: '60px auto',
      textAlign: 'center',
      padding: '48px 24px'
    }} className="glass-card">
      <div style={{
        width: '56px',
        height: '56px',
        borderRadius: '14px',
        backgroundColor: 'var(--primary-tint)',
        border: '1px solid var(--border)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        margin: '0 auto 16px'
      }}>
        <Clock size={28} color="var(--primary)" />
      </div>

      <div style={{
        display: 'inline-block',
        fontSize: '0.72rem',
        fontWeight: 700,
        padding: '3px 10px',
        borderRadius: '9999px',
        backgroundColor: 'var(--purple-tint)',
        border: '1px solid var(--border)',
        color: 'var(--purple)',
        marginBottom: '12px'
      }}>
        {phase || 'Upcoming Remediation Phase'} &bull; {step}
      </div>

      <h2 style={{
        fontSize: '1.4rem',
        fontWeight: 700,
        color: 'var(--text-primary)',
        marginBottom: '8px'
      }}>
        {title}
      </h2>

      <p style={{
        color: 'var(--text-secondary)',
        fontSize: '0.9rem',
        maxWidth: '520px',
        margin: '0 auto 24px',
        lineHeight: 1.5
      }}>
        {description || 'This module is being prepared. Please check back for updates.'}
      </p>

      <button
        onClick={() => navigate('/dashboard')}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          background: 'var(--primary)',
          color: '#ffffff',
          border: 'none',
          padding: '10px 20px',
          borderRadius: '8px',
          fontWeight: 600,
          fontSize: '0.88rem',
          cursor: 'pointer'
        }}
      >
        <ArrowLeft size={16} />
        <span>Return to Executive Overview</span>
      </button>
    </div>
  );
}

import React, { useState } from 'react';
import AppIcon from './AppIcon';
import { LoaderCircle } from 'lucide-react';

export default function IconButton({
  icon,
  label,
  tooltip,
  variant = 'ghost',
  size = 'md',
  disabled = false,
  loading = false,
  onClick,
  className = '',
  style = {},
  ...props
}) {
  const [showTooltip, setShowTooltip] = useState(false);

  const tooltipText = tooltip || label;

  const sizeStyles = {
    sm: { width: '28px', height: '28px', iconSize: 'xs' },
    md: { width: '34px', height: '34px', iconSize: 'sm' },
    lg: { width: '40px', height: '40px', iconSize: 'md' },
  };

  const currentSize = sizeStyles[size] || sizeStyles.md;

  const variantStyles = {
    ghost: {
      background: 'transparent',
      border: 'none',
      color: 'var(--text-secondary, #94a3b8)',
    },
    surface: {
      background: 'var(--bg-surface-elevated, #16223b)',
      border: '1px solid var(--border-subtle, rgba(255,255,255,0.08))',
      color: 'var(--text-primary, #f8fafc)',
    },
    primary: {
      background: 'var(--primary, #168cff)',
      border: 'none',
      color: '#ffffff',
    },
    danger: {
      background: 'var(--danger-bg, rgba(239, 68, 68, 0.12))',
      border: '1px solid rgba(239, 68, 68, 0.25)',
      color: 'var(--danger, #ef4444)',
    },
  };

  const currentVariant = variantStyles[variant] || variantStyles.ghost;

  return (
    <div
      style={{ position: 'relative', display: 'inline-flex' }}
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      <button
        type="button"
        aria-label={label}
        disabled={disabled || loading}
        onClick={onClick}
        className={`icon-btn icon-btn-${variant} ${className}`}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: currentSize.width,
          height: currentSize.height,
          borderRadius: 'var(--radius-sm, 6px)',
          cursor: disabled || loading ? 'not-allowed' : 'pointer',
          opacity: disabled ? 0.45 : 1,
          transition: 'all 0.2s ease',
          padding: 0,
          ...currentVariant,
          ...style,
        }}
        {...props}
      >
        {loading ? (
          <AppIcon icon={LoaderCircle} size={currentSize.iconSize} spin tone="default" />
        ) : (
          <AppIcon icon={icon} size={currentSize.iconSize} tone="default" />
        )}
      </button>

      {                        }
      {showTooltip && tooltipText && (
        <div
          role="tooltip"
          style={{
            position: 'absolute',
            bottom: 'calc(100% + 6px)',
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'var(--bg-surface-elevated, #16223b)',
            color: 'var(--text-primary, #f8fafc)',
            border: '1px solid var(--border, #1e2d4a)',
            padding: '4px 8px',
            borderRadius: '4px',
            fontSize: '0.72rem',
            fontWeight: 500,
            whiteSpace: 'nowrap',
            boxShadow: 'var(--card-shadow, 0 4px 12px rgba(0,0,0,0.3))',
            zIndex: 100,
            pointerEvents: 'none',
          }}
        >
          {tooltipText}
        </div>
      )}
    </div>
  );
}

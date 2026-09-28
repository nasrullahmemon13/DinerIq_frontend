import React from 'react';

export default function AppIcon({
  icon: IconComponent,
  size = 'md',
  tone = 'default',
  strokeWidth = 1.75,
  ariaLabel,
  spin = false,
  className = '',
  style = {},
  ...props
}) {
  if (!IconComponent) return null;

  const sizeMap = {
    xs: 14,
    sm: 16,
    md: 18,
    lg: 20,
    xl: 24,
  };

  const pixelSize = typeof size === 'number' ? size : (sizeMap[size] || 18);

  const toneColorMap = {
    default: 'currentColor',
    muted: 'var(--text-muted, #64748b)',
    primary: 'var(--primary, #168cff)',
    success: 'var(--success, #10b981)',
    warning: 'var(--warning, #f59e0b)',
    danger: 'var(--danger, #ef4444)',
    info: 'var(--info, #0284c7)',
    model: 'var(--purple, #8b5cf6)',
    spark: 'var(--cyan, #06b6d4)',
  };

  const resolvedColor = toneColorMap[tone] || 'currentColor';

  return (
    <IconComponent
      size={pixelSize}
      strokeWidth={strokeWidth}
      color={resolvedColor}
      aria-hidden={ariaLabel ? undefined : 'true'}
      role={ariaLabel ? 'img' : undefined}
      aria-label={ariaLabel}
      className={`app-icon ${spin ? 'icon-spin' : ''} ${className}`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        verticalAlign: 'middle',
        ...style,
      }}
      {...props}
    />
  );
}

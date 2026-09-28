import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import AppIcon from './AppIcon';

export default function SidebarItem({
  icon,
  label,
  to,
  badge,
  collapsed = false,
  onClick,
}) {
  const [showTooltip, setShowTooltip] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      style={{ position: 'relative' }}
      onMouseEnter={() => {
        setIsHovered(true);
        if (collapsed) setShowTooltip(true);
      }}
      onMouseLeave={() => {
        setIsHovered(false);
        setShowTooltip(false);
      }}
    >
      <NavLink
        to={to}
        onClick={onClick}
        end={to === '/'}
        style={({ isActive }) => ({
          display: 'flex',
          alignItems: 'center',
          justifyContent: collapsed ? 'center' : 'flex-start',
          gap: collapsed ? 0 : '12px',
          padding: collapsed ? '9px 0' : '8px 12px',
          margin: collapsed ? '3px 10px' : '2px 10px',
          borderRadius: '7px',
          textDecoration: 'none',
          fontSize: '0.82rem',
          fontWeight: isActive ? 600 : 500,
          color: isActive
            ? 'var(--primary, #0284c7)'
            : isHovered
            ? 'var(--text-primary)'
            : 'var(--text-secondary)',
          background: isActive
            ? 'var(--primary-tint, rgba(2, 132, 199, 0.12))'
            : isHovered
            ? 'var(--surface-secondary)'
            : 'transparent',
          borderLeft: (!collapsed && isActive)
            ? '3px solid var(--primary, #0284c7)'
            : '3px solid transparent',
          outline: (collapsed && isActive)
            ? '1.5px solid var(--primary, #0284c7)'
            : 'none',
          transition: 'all 0.16s ease',
        })}
      >
        {({ isActive }) => (
          <>
            <AppIcon
              icon={icon}
              size={18}
              strokeWidth={isActive ? 2 : 1.75}
              tone={isActive ? 'primary' : 'default'}
              color={isActive ? 'var(--primary, #168cff)' : undefined}
            />

            {!collapsed && (
              <span
                style={{
                  flex: 1,
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {label}
              </span>
            )}

            {!collapsed && badge !== undefined && badge !== null && (
              <span
                style={{
                  fontSize: '0.68rem',
                  fontWeight: 700,
                  padding: '1px 6px',
                  borderRadius: '10px',
                  background: 'var(--primary, #168cff)',
                  color: '#ffffff',
                }}
              >
                {badge}
              </span>
            )}
          </>
        )}
      </NavLink>

      {                       }
      {collapsed && showTooltip && (
        <div
          role="tooltip"
          style={{
            position: 'absolute',
            left: 'calc(100% + 8px)',
            top: '50%',
            transform: 'translateY(-50%)',
            background: 'var(--surface-elevated, #13243a)',
            color: 'var(--text-primary, #f8fafc)',
            border: '1px solid var(--border, #1e3048)',
            padding: '5px 10px',
            borderRadius: '6px',
            fontSize: '0.78rem',
            fontWeight: 600,
            whiteSpace: 'nowrap',
            boxShadow: 'var(--card-shadow, 0 4px 14px rgba(0,0,0,0.35))',
            zIndex: 9999,
            pointerEvents: 'none',
          }}
        >
          {label}
          {badge !== undefined && (
            <span
              style={{
                marginLeft: '6px',
                fontSize: '0.7rem',
                color: 'var(--primary, #168cff)',
              }}
            >
              ({badge})
            </span>
          )}
        </div>
      )}
    </div>
  );
}

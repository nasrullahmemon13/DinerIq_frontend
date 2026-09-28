import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../theme/ThemeProvider';

export default function ThemeToggle({ className = '', style: extraStyle = {} }) {
  const { isDark, toggleTheme } = useTheme();

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        borderRadius: '20px',
        border: '1px solid var(--border)',
        background: 'var(--surface-secondary)',
        padding: '3px',
        gap: '2px',
        flexShrink: 0,
        ...extraStyle
      }}
      className={className}
    >
      {                }
      <button
        type="button"
        onClick={() => isDark && toggleTheme()}
        aria-label="Switch to Light Mode"
        aria-pressed={!isDark}
        title="Light Mode"
        style={{
          width: '26px',
          height: '26px',
          borderRadius: '16px',
          border: 'none',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: isDark ? 'pointer' : 'default',
          background: !isDark ? 'var(--surface-elevated, var(--surface))' : 'transparent',
          color: !isDark ? 'var(--warning)' : 'var(--text-muted)',
          boxShadow: !isDark ? 'var(--shadow-sm)' : 'none',
          transition: 'all 0.2s ease'
        }}
      >
        <Sun size={13} />
      </button>

      {                 }
      <button
        type="button"
        onClick={() => !isDark && toggleTheme()}
        aria-label="Switch to Dark Mode"
        aria-pressed={isDark}
        title="Dark Mode"
        style={{
          width: '26px',
          height: '26px',
          borderRadius: '16px',
          border: 'none',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: !isDark ? 'pointer' : 'default',
          background: isDark ? 'var(--surface-elevated, var(--surface))' : 'transparent',
          color: isDark ? '#a5b4fc' : 'var(--text-muted)',
          boxShadow: isDark ? 'var(--shadow-sm)' : 'none',
          transition: 'all 0.2s ease'
        }}
      >
        <Moon size={13} />
      </button>
    </div>
  );
}

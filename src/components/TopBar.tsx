import { useNavigate } from 'react-router-dom';
import { Icon } from './Icon';
import { useAuth } from '@/stores/auth';
import { ROLE_LABEL } from '@/data/mock';
import type { Role } from '@/types';

interface TopBarProps {
  title: string;
  subtitle?: string;
}

const ROLES: Role[] = ['admin', 'pm', 'engineer', 'finance', 'vendor'];

export function TopBar({ title, subtitle }: TopBarProps) {
  const { role, setRole } = useAuth();
  const navigate = useNavigate();

  return (
    <header style={{
      height: 60,
      flexShrink: 0,
      background: '#fff',
      borderBottom: '1px solid var(--border-1)',
      padding: '0 22px',
      display: 'flex',
      alignItems: 'center',
      gap: 18,
    }}>
      <div style={{ minWidth: 0, flex: 1 }}>
        <div style={{
          fontSize: 16,
          fontWeight: 700,
          color: 'var(--ink-900)',
          lineHeight: 1.2,
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        }}>{title}</div>
        {subtitle && (
          <div style={{ fontSize: 12, color: 'var(--ink-500)', marginTop: 2 }}>{subtitle}</div>
        )}
      </div>

      {/* Search */}
      <div style={{
        flex: '0 0 320px',
        maxWidth: 320,
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        padding: '7px 12px',
        background: 'var(--ink-050)',
        border: '1px solid var(--border-1)',
        borderRadius: 8,
        color: 'var(--ink-500)',
        cursor: 'pointer',
      }}
        onClick={() => navigate('/app/search')}
      >
        <Icon name="search" size={16} />
        <span style={{ fontSize: 13 }}>ابحث في المشاريع، الفواتير، الموردين…</span>
      </div>

      {/* Role switcher — mock helper while we have no real auth */}
      <select
        value={role || 'admin'}
        onChange={(e) => setRole(e.target.value as Role)}
        style={{
          background: '#fff',
          border: '1px solid var(--border-2)',
          borderRadius: 8,
          padding: '7px 10px',
          fontSize: 13,
          fontFamily: 'var(--font-sans)',
          color: 'var(--ink-700)',
          cursor: 'pointer',
        }}
        title="تبديل الدور"
      >
        {ROLES.map((r) => (
          <option key={r} value={r}>{ROLE_LABEL[r]}</option>
        ))}
      </select>

      {/* Notifications */}
      <button
        onClick={() => navigate('/app/notifications')}
        style={{
          position: 'relative',
          background: 'transparent',
          border: '1px solid var(--border-1)',
          borderRadius: 8,
          padding: '7px 9px',
          cursor: 'pointer',
          color: 'var(--ink-700)',
          display: 'inline-flex',
        }}
        aria-label="الإشعارات"
      >
        <Icon name="bell" size={16} />
        <span style={{
          position: 'absolute',
          top: -4,
          left: -4,
          minWidth: 16,
          height: 16,
          padding: '0 4px',
          background: 'var(--danger-500)',
          color: '#fff',
          fontSize: 10,
          fontWeight: 700,
          borderRadius: 999,
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'var(--font-mono)',
        }}>3</span>
      </button>
    </header>
  );
}

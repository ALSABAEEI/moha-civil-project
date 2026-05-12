import { useNavigate } from 'react-router-dom';
import { Icon } from './Icon';
import { useAuth } from '@/stores/auth';
import { ROLE_LABEL } from '@/lib/roles';

interface TopBarProps {
  title: string;
  subtitle?: string;
}

export function TopBar({ title, subtitle }: TopBarProps) {
  const { role } = useAuth();
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

      {role && (
        <div style={{
          padding: '6px 12px',
          background: 'var(--navy-050)',
          color: 'var(--navy-800)',
          borderRadius: 999,
          fontSize: 12,
          fontWeight: 700,
        }}>
          {ROLE_LABEL[role]}
        </div>
      )}

      <button
        onClick={() => navigate('/app/notifications')}
        style={{
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
      </button>
    </header>
  );
}

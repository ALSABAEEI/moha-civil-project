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
    <header className="topbar">
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

      <div className="topbar-search" onClick={() => navigate('/app/search')}>
        <Icon name="search" size={16} />
        <span>ابحث في المشاريع، الفواتير، الموردين…</span>
      </div>

      {role && <div className="role-chip">{ROLE_LABEL[role]}</div>}

      <button
        onClick={() => navigate('/app/notifications')}
        className="topbar-icon-btn"
        aria-label="الإشعارات"
      >
        <Icon name="bell" size={16} />
      </button>
    </header>
  );
}

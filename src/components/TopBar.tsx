import { useNavigate } from 'react-router-dom';
import { Icon } from './Icon';
import { useAuth } from '@/stores/auth';
import { ROLE_LABEL } from '@/lib/roles';

interface TopBarProps {
  title: string;
  subtitle?: string;
  /** Called when the user taps the hamburger on mobile. */
  onMenuClick?: () => void;
}

export function TopBar({ title, subtitle, onMenuClick }: TopBarProps) {
  const { role } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="topbar">
      {/* Hamburger — visible only at ≤768 px via CSS */}
      <button
        type="button"
        onClick={onMenuClick}
        className="topbar-icon-btn hamburger-btn"
        aria-label="القائمة"
      >
        <Icon name="menu" size={18} />
      </button>

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
        <span className="topbar-search-text">ابحث في المشاريع، الفواتير، الموردين…</span>
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

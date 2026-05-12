import { useNavigate, useLocation } from 'react-router-dom';
import { Icon } from './Icon';
import { Avatar } from './Avatar';
import { useAuth } from '@/stores/auth';
import { ROLE_LABEL } from '@/lib/roles';
import type { Role } from '@/types';
import logoIcon from '../../design-system/assets/logo-icon.svg';

interface NavItem {
  to: string;
  label: string;
  icon: string;
  roles?: Role[];
}

const NAV: NavItem[] = [
  { to: '/app/dashboard',  label: 'الرئيسية',     icon: 'layout-dashboard' },
  { to: '/app/projects',   label: 'المشاريع',      icon: 'folder-kanban', roles: ['admin', 'pm', 'engineer', 'finance'] },
  { to: '/app/tasks',      label: 'المهام',        icon: 'list-checks',   roles: ['admin', 'pm', 'engineer'] },
  { to: '/app/vendors',    label: 'الموردون',      icon: 'shield-check',  roles: ['admin', 'pm', 'finance'] },
  { to: '/app/assignments',label: 'التعيينات',     icon: 'split',         roles: ['admin', 'pm'] },
];

const MONEY: NavItem[] = [
  { to: '/app/finance', label: 'المتابعة المالية', icon: 'wallet',     roles: ['admin', 'pm', 'finance'] },
  { to: '/app/reports', label: 'التقارير',          icon: 'bar-chart-3', roles: ['admin', 'pm', 'finance'] },
];

const SYS: NavItem[] = [
  { to: '/app/approvals',     label: 'الاعتمادات',         icon: 'check-check', roles: ['admin', 'pm', 'finance'] },
  { to: '/app/audit',         label: 'سجل التدقيق',        icon: 'scroll-text', roles: ['admin'] },
  { to: '/app/settings',      label: 'الإعدادات',          icon: 'settings-2' },
];

export function Sidebar() {
  const { role, profile, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const allowed = (item: NavItem) => !item.roles || (role && item.roles.includes(role));

  const isActive = (to: string) =>
    to === '/app/projects'
      ? location.pathname.startsWith('/app/projects')
      : location.pathname === to;

  const Item = ({ item }: { item: NavItem }) => {
    const active = isActive(item.to);
    return (
      <div
        onClick={() => navigate(item.to)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          padding: '9px 12px',
          borderRadius: 8,
          fontSize: 14,
          fontWeight: active ? 700 : 500,
          cursor: 'pointer',
          background: active ? 'var(--teal-500)' : 'transparent',
          color: active ? '#fff' : '#A9B6C7',
          transition: 'background var(--dur-2) var(--ease-out)',
        }}
      >
        <Icon name={item.icon} size={18} stroke={1.75} />
        <span style={{ flex: 1 }}>{item.label}</span>
      </div>
    );
  };

  const Group = ({ label, items }: { label: string; items: NavItem[] }) => {
    const visible = items.filter(allowed);
    if (!visible.length) return null;
    return (
      <>
        <div style={{ fontSize: 11, fontWeight: 700, color: '#5C6F89', padding: '14px 12px 6px' }}>{label}</div>
        {visible.map((it) => <Item key={it.to} item={it} />)}
      </>
    );
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/signin', { replace: true });
  };

  return (
    <aside style={{
      width: 248,
      background: 'var(--navy-800)',
      flexShrink: 0,
      display: 'flex',
      flexDirection: 'column',
      padding: '14px 12px 18px',
      borderLeft: '1px solid var(--navy-900)',
      overflowY: 'auto',
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        padding: '4px 8px 14px',
        borderBottom: '1px solid rgba(255,255,255,.06)',
        marginBottom: 6,
      }}>
        <img src={logoIcon} alt="ProTrack" style={{ width: 30, height: 30 }} />
        <span style={{ color: '#fff', fontWeight: 800, fontSize: 18 }}>ProTrack</span>
      </div>
      <Group label="مساحة العمل" items={NAV} />
      <Group label="المالية"       items={MONEY} />
      <Group label="النظام"        items={SYS} />
      <div style={{
        marginTop: 'auto',
        padding: '12px 8px 4px',
        display: 'flex',
        gap: 10,
        alignItems: 'center',
      }}>
        <Avatar person={profile?.id} size={34} />
        <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0, flex: 1 }}>
          <span style={{
            color: '#fff',
            fontSize: 13,
            fontWeight: 700,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}>{profile?.email || ''}</span>
          <span style={{ color: '#7A8AA0', fontSize: 11 }}>
            {role ? ROLE_LABEL[role] : ''}
          </span>
        </div>
        <button
          onClick={handleSignOut}
          title="تسجيل الخروج"
          style={{
            background: 'transparent',
            border: 'none',
            color: '#7A8AA0',
            cursor: 'pointer',
            padding: 4,
            display: 'inline-flex',
            borderRadius: 6,
          }}
        >
          <Icon name="log-out" size={16} />
        </button>
      </div>
    </aside>
  );
}

import { Card } from '@/components/Card';
import { Icon } from '@/components/Icon';
import { Chip } from '@/components/Chip';
import { useAsync } from '@/hooks/useAsync';
import { listNotifications } from '@/data/api';

const KIND_ICON: Record<string, string> = {
  finance: 'wallet',
  project: 'folder-kanban',
  task: 'check-check',
  mention: 'reply',
  vendor: 'truck',
  system: 'shield',
};

const KIND_TONE: Record<string, 'navy' | 'teal' | 'review' | 'risk' | 'completed'> = {
  finance: 'risk',
  project: 'navy',
  task: 'review',
  mention: 'teal',
  vendor: 'completed',
  system: 'navy',
};

export function Notifications() {
  const { data, loading } = useAsync(() => listNotifications(), []);

  return (
    <Card pad={0}>
      <div style={{ padding: '14px 20px', borderBottom: '1px solid var(--border-1)' }}>
        <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--ink-900)' }}>كل الإشعارات</div>
        <div style={{ fontSize: 12, color: 'var(--ink-500)', marginTop: 3 }}>
          الإشعارات الجديدة تظهر أولًا.
        </div>
      </div>
      {loading && <div style={{ padding: 30, textAlign: 'center', color: 'var(--ink-500)', fontSize: 13 }}>جارٍ التحميل…</div>}
      {!loading && (data?.length ?? 0) === 0 && (
        <div style={{ padding: '60px 20px', textAlign: 'center', color: 'var(--ink-500)' }}>
          <Icon name="bell" size={26} style={{ color: 'var(--ink-300)' }} />
          <div style={{ marginTop: 10, fontSize: 13 }}>لا توجد إشعارات بعد.</div>
        </div>
      )}
      {(data ?? []).map((n, i, arr) => (
        <div key={n.id} className="row-hover clickable" style={{
          display: 'flex',
          gap: 12,
          padding: '16px 20px',
          borderBottom: i < arr.length - 1 ? '1px solid var(--border-1)' : 'none',
          background: n.read ? '#fff' : 'var(--teal-050)',
        }}>
          <div style={{
            width: 40,
            height: 40,
            borderRadius: 10,
            background: 'var(--ink-050)',
            color: 'var(--ink-700)',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}>
            <Icon name={KIND_ICON[n.kind] || 'bell'} size={18} />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4, flexWrap: 'wrap' }}>
              <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--ink-900)' }}>{n.title}</span>
              <Chip tone={KIND_TONE[n.kind] || 'navy'} dot={false} style={{ fontSize: 10.5 }}>{n.kind}</Chip>
              {!n.read && <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--teal-500)' }} />}
            </div>
            <div style={{ fontSize: 13, color: 'var(--ink-700)', lineHeight: 1.65 }}>{n.body}</div>
            <div style={{ fontSize: 11.5, color: 'var(--ink-500)', marginTop: 6 }}>{n.when}</div>
          </div>
        </div>
      ))}
    </Card>
  );
}

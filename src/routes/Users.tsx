import { Card } from '@/components/Card';
import { Chip } from '@/components/Chip';
import { Button } from '@/components/Button';
import { Avatar } from '@/components/Avatar';
import { PEOPLE, ROLE_LABEL, USERS } from '@/data/mock';

const STATUS_LABEL: Record<string, string> = {
  active: 'نشط',
  invited: 'مدعو',
  suspended: 'موقوف',
};
const STATUS_TONE: Record<string, 'completed' | 'review' | 'blocked'> = {
  active: 'completed',
  invited: 'review',
  suspended: 'blocked',
};

export function Users() {
  return (
    <Card pad={0}>
      <div style={{ padding: '14px 20px', borderBottom: '1px solid var(--border-1)', display: 'flex', alignItems: 'center' }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--ink-900)' }}>المستخدمون</div>
          <div style={{ fontSize: 12, color: 'var(--ink-500)', marginTop: 3 }}>
            إدارة الأدوار، الصلاحيات، ودعوة الأعضاء الجدد.
          </div>
        </div>
        <Button icon="user-plus">دعوة عضو</Button>
      </div>
      <div style={{
        display: 'grid',
        gridTemplateColumns: '2fr 1.4fr 1fr 1fr 1fr 1fr',
        padding: '10px 20px',
        background: 'var(--ink-050)',
        borderBottom: '1px solid var(--border-2)',
        fontSize: 11,
        fontWeight: 700,
        color: 'var(--ink-500)',
        textTransform: 'uppercase',
        letterSpacing: '0.04em',
      }}>
        <span>العضو</span>
        <span>البريد</span>
        <span>الدور</span>
        <span>القسم</span>
        <span>الحالة</span>
        <span>آخر دخول</span>
      </div>
      {USERS.map((u, i) => {
        const person = PEOPLE.find((p) => p.id === u.personId);
        return (
          <div key={u.id} style={{
            display: 'grid',
            gridTemplateColumns: '2fr 1.4fr 1fr 1fr 1fr 1fr',
            padding: '14px 20px',
            borderBottom: i < USERS.length - 1 ? '1px solid var(--border-1)' : 'none',
            alignItems: 'center',
            fontSize: 13,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <Avatar person={u.personId} size={30} />
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--ink-900)' }}>{person?.name}</div>
                <div style={{ fontSize: 11, color: 'var(--ink-500)' }}>{person?.role}</div>
              </div>
            </div>
            <span className="num" style={{ color: 'var(--ink-700)', direction: 'ltr', textAlign: 'start' }}>{u.email}</span>
            <span style={{ color: 'var(--ink-700)' }}>{ROLE_LABEL[u.role]}</span>
            <span style={{ color: 'var(--ink-700)' }}>{u.department}</span>
            <Chip tone={STATUS_TONE[u.status]}>{STATUS_LABEL[u.status]}</Chip>
            <span className="num" style={{ color: 'var(--ink-600)' }}>{u.lastSeen}</span>
          </div>
        );
      })}
    </Card>
  );
}

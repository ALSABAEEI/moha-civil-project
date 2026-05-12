import { Card } from '@/components/Card';
import { Chip } from '@/components/Chip';
import { Button } from '@/components/Button';
import { Icon } from '@/components/Icon';
import { useAppData } from '@/contexts/AppData';

const STATUS_LABEL: Record<string, string> = {
  active: 'نشط',
  awaiting: 'بانتظار التأهيل',
  prequalified: 'مؤهَّل مسبقًا',
  suspended: 'موقوف',
};

const STATUS_TONE: Record<string, 'completed' | 'review' | 'navy' | 'blocked'> = {
  active: 'completed',
  awaiting: 'review',
  prequalified: 'navy',
  suspended: 'blocked',
};

export function Vendors() {
  const { vendors, loading } = useAppData();

  return (
    <Card pad={0}>
      <div style={{
        padding: '14px 20px',
        borderBottom: '1px solid var(--border-1)',
        display: 'flex',
        alignItems: 'center',
      }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--ink-900)' }}>الموردون</div>
          <div style={{ fontSize: 12, color: 'var(--ink-500)', marginTop: 3 }}>
            قائمة الموردين والمقاولين من الباطن وحالة التأهيل.
          </div>
        </div>
        <Button icon="plus" disabled title="قيد التطوير">مورد جديد</Button>
      </div>
      <div style={{
        display: 'grid',
        gridTemplateColumns: '2fr 1fr 1fr 1.4fr 100px',
        padding: '10px 20px',
        background: 'var(--ink-050)',
        borderBottom: '1px solid var(--border-2)',
        fontSize: 11,
        fontWeight: 700,
        color: 'var(--ink-500)',
        textTransform: 'uppercase',
        letterSpacing: '0.04em',
      }}>
        <span>المورد</span>
        <span>التخصص</span>
        <span>الحالة</span>
        <span>التواصل</span>
        <span style={{ textAlign: 'start' }}>المشاريع</span>
      </div>
      {vendors.map((v, i) => (
        <div key={v.id} style={{
          display: 'grid',
          gridTemplateColumns: '2fr 1fr 1fr 1.4fr 100px',
          padding: '14px 20px',
          borderBottom: i < vendors.length - 1 ? '1px solid var(--border-1)' : 'none',
          alignItems: 'center',
          fontSize: 13,
        }}>
          <div style={{ fontWeight: 700, color: 'var(--ink-900)' }}>{v.name}</div>
          <span style={{ color: 'var(--ink-700)' }}>{v.discipline}</span>
          <Chip tone={STATUS_TONE[v.status]}>{STATUS_LABEL[v.status]}</Chip>
          <span className="num" style={{ color: 'var(--ink-700)', direction: 'ltr', textAlign: 'start' }}>{v.contact}</span>
          <span className="num" style={{ fontWeight: 700 }}>{v.projects}</span>
        </div>
      ))}
      {!loading && vendors.length === 0 && (
        <div style={{ padding: '60px 20px', textAlign: 'center', color: 'var(--ink-500)' }}>
          <Icon name="inbox" size={26} style={{ color: 'var(--ink-300)' }} />
          <div style={{ marginTop: 10, fontSize: 13 }}>لا يوجد موردون بعد.</div>
        </div>
      )}
    </Card>
  );
}

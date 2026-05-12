import { Card } from '@/components/Card';
import { KPI } from '@/components/KPI';
import { PaymentChip } from '@/components/Chip';
import { Icon } from '@/components/Icon';
import { EXPENSES, PAYMENTS, PROJECTS } from '@/data/mock';
import { SARw } from '@/lib/format';

export function Finance() {
  const totalBudget = PROJECTS.reduce((s, p) => s + p.budget, 0);
  const totalExpenses = EXPENSES.reduce((s, e) => s + e.amount, 0);
  const totalPaid = PAYMENTS.filter((p) => p.status === 'paid').reduce((s, p) => s + p.amount, 0);
  const totalPending = PAYMENTS.filter((p) => p.status === 'pending').reduce((s, p) => s + p.amount, 0);
  const totalOverdue = PAYMENTS.filter((p) => p.status === 'overdue').reduce((s, p) => s + p.amount, 0);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
        gap: 14,
      }}>
        <KPI label="إجمالي الميزانية" value={SARw(totalBudget)} sub="عبر كل المشاريع" />
        <KPI label="إجمالي المصروفات" value={SARw(totalExpenses)} sub={`${((totalExpenses / totalBudget) * 100).toFixed(1)}% من الميزانية`} />
        <KPI label="المدفوع" value={SARw(totalPaid)} valueColor="var(--success-700)" sub="فواتير مكتملة" />
        <KPI label="بانتظار الدفع" value={SARw(totalPending)} sub="فواتير معتمدة" />
        <KPI label="متأخرة" value={SARw(totalOverdue)} valueColor="var(--danger-700)"
          sub={`${PAYMENTS.filter((p) => p.status === 'overdue').length} فاتورة`} />
      </div>

      <Card pad={0}>
        <div style={{ padding: '14px 20px', borderBottom: '1px solid var(--border-1)' }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--ink-900)' }}>كل الفواتير</div>
          <div style={{ fontSize: 12, color: 'var(--ink-500)', marginTop: 3 }}>
            عرض موحَّد للفواتير عبر كل المشاريع.
          </div>
        </div>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 2fr 1.4fr 1fr 1fr 130px',
          padding: '10px 20px',
          background: 'var(--ink-050)',
          borderBottom: '1px solid var(--border-2)',
          fontSize: 11,
          fontWeight: 700,
          color: 'var(--ink-500)',
          textTransform: 'uppercase',
          letterSpacing: '0.04em',
        }}>
          <span>رقم الفاتورة</span>
          <span>المورد</span>
          <span>المشروع</span>
          <span style={{ textAlign: 'start' }}>المبلغ</span>
          <span>الاستحقاق</span>
          <span>الحالة</span>
        </div>
        {PAYMENTS.map((p, i) => (
          <div key={p.id} style={{
            display: 'grid',
            gridTemplateColumns: '1fr 2fr 1.4fr 1fr 1fr 130px',
            padding: '14px 20px',
            borderBottom: i < PAYMENTS.length - 1 ? '1px solid var(--border-1)' : 'none',
            alignItems: 'center',
            fontSize: 13,
          }}>
            <span className="num" style={{ fontWeight: 700, direction: 'ltr', textAlign: 'start' }}>{p.id}</span>
            <span style={{ color: 'var(--ink-700)' }}>{p.vendor}</span>
            <span className="num" style={{ color: 'var(--ink-600)', direction: 'ltr', textAlign: 'start' }}>{p.project}</span>
            <span className="money" style={{ fontWeight: 700 }}>{SARw(p.amount)}</span>
            <span className="num" style={{ color: 'var(--ink-600)' }}>{p.due}</span>
            <PaymentChip status={p.status} />
          </div>
        ))}
      </Card>

      {totalOverdue > 0 && (
        <Card pad={14} style={{ background: 'var(--danger-050)', borderColor: 'var(--danger-100)' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
            <Icon name="circle-alert" size={18} style={{ color: 'var(--danger-700)', flexShrink: 0, marginTop: 2 }} />
            <div style={{ fontSize: 13, color: 'var(--ink-800)', lineHeight: 1.7 }}>
              <b style={{ color: 'var(--danger-700)' }}>تنبيه:</b> هناك فواتير متأخرة بإجمالي{' '}
              <span className="money" style={{ fontWeight: 700, color: 'var(--danger-700)' }}>{SARw(totalOverdue)}</span>{' '}
              تحتاج إلى متابعة عاجلة.
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}

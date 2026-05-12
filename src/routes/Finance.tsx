import { Card } from '@/components/Card';
import { KPI } from '@/components/KPI';
import { PaymentChip } from '@/components/Chip';
import { Icon } from '@/components/Icon';
import { useAsync } from '@/hooks/useAsync';
import { listExpenses, listPayments, listProjects } from '@/data/api';
import { SARw } from '@/lib/format';

export function Finance() {
  const projectsQ = useAsync(() => listProjects(), []);
  const expensesQ = useAsync(() => listExpenses(), []);
  const paymentsQ = useAsync(() => listPayments(), []);

  const loading = projectsQ.loading || expensesQ.loading || paymentsQ.loading;
  if (loading) return <div style={{ padding: 40, textAlign: 'center', color: 'var(--ink-500)' }}>جارٍ التحميل…</div>;

  const projects = projectsQ.data ?? [];
  const expenses = expensesQ.data ?? [];
  const payments = paymentsQ.data ?? [];

  const totalBudget = projects.reduce((s, p) => s + p.budget, 0);
  const totalExpenses = expenses.reduce((s, e) => s + e.amount, 0);
  const totalPaid = payments.filter((p) => p.status === 'paid').reduce((s, p) => s + p.amount, 0);
  const totalPending = payments.filter((p) => p.status === 'pending').reduce((s, p) => s + p.amount, 0);
  const totalOverdue = payments.filter((p) => p.status === 'overdue').reduce((s, p) => s + p.amount, 0);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
        gap: 14,
      }}>
        <KPI label="إجمالي الميزانية" value={SARw(totalBudget)} sub="عبر كل المشاريع" />
        <KPI label="إجمالي المصروفات" value={SARw(totalExpenses)}
          sub={totalBudget > 0 ? `${((totalExpenses / totalBudget) * 100).toFixed(1)}% من الميزانية` : undefined} />
        <KPI label="المدفوع" value={SARw(totalPaid)} valueColor="var(--success-700)" sub="فواتير مكتملة" />
        <KPI label="بانتظار الدفع" value={SARw(totalPending)} sub="فواتير معتمدة" />
        <KPI label="متأخرة" value={SARw(totalOverdue)} valueColor="var(--danger-700)"
          sub={`${payments.filter((p) => p.status === 'overdue').length} فاتورة`} />
      </div>

      <Card pad={0}>
        <div style={{ padding: '14px 20px', borderBottom: '1px solid var(--border-1)' }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--ink-900)' }}>كل الفواتير</div>
          <div style={{ fontSize: 12, color: 'var(--ink-500)', marginTop: 3 }}>
            عرض موحَّد للفواتير عبر كل المشاريع.
          </div>
        </div>
        <div className="responsive-table-head" style={{
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
        {payments.map((p, i) => (
          <div key={p.id} className="responsive-row" style={{
            display: 'grid',
            gridTemplateColumns: '1fr 2fr 1.4fr 1fr 1fr 130px',
            padding: '14px 20px',
            borderBottom: i < payments.length - 1 ? '1px solid var(--border-1)' : 'none',
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
        {payments.length === 0 && (
          <div style={{ padding: '40px 20px', textAlign: 'center', color: 'var(--ink-500)', fontSize: 13 }}>
            لا توجد فواتير مسجَّلة بعد.
          </div>
        )}
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

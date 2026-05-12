import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/Card';
import { KPI } from '@/components/KPI';
import { StatusChip } from '@/components/Chip';
import { Progress } from '@/components/Progress';
import { AvatarStack } from '@/components/Avatar';
import { Icon } from '@/components/Icon';
import { useAsync } from '@/hooks/useAsync';
import { listExpenses, listPayments, listProjects, listTasks } from '@/data/api';
import { SARw } from '@/lib/format';

export function Dashboard() {
  const navigate = useNavigate();

  const projectsQ = useAsync(() => listProjects(), []);
  const expensesQ = useAsync(() => listExpenses(), []);
  const paymentsQ = useAsync(() => listPayments(), []);
  const tasksQ    = useAsync(() => listTasks(),    []);

  const loading = projectsQ.loading || expensesQ.loading || paymentsQ.loading || tasksQ.loading;
  if (loading) return <LoadingShell />;

  const projects = projectsQ.data ?? [];
  const expenses = expensesQ.data ?? [];
  const payments = paymentsQ.data ?? [];
  const tasks = tasksQ.data ?? [];

  const totalBudget = projects.reduce((s, p) => s + p.budget, 0);
  const totalSpent = expenses.reduce((s, e) => s + e.amount, 0);
  const overdueInvoices = payments.filter((p) => p.status === 'overdue').length;
  const inProgressTasks = tasks.filter((t) => t.status === 'progress' || t.status === 'review').length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: 14,
      }}>
        <KPI label="المشاريع النشطة" value={String(projects.filter((p) => p.status !== 'completed').length)}
          sub={`من ${projects.length} مشروع`} />
        <KPI label="إجمالي الميزانية" value={SARw(totalBudget)} sub="عبر كل المشاريع" />
        <KPI label="إجمالي المصروف" value={SARw(totalSpent)}
          delta={totalBudget > 0 ? `${((totalSpent / totalBudget) * 100).toFixed(1)}%` : undefined}
          deltaUp={false} sub="من الميزانية" />
        <KPI label="فواتير متأخرة" value={String(overdueInvoices)}
          valueColor={overdueInvoices > 0 ? 'var(--danger-700)' : undefined} sub="تستحق المتابعة" />
        <KPI label="مهام نشطة" value={String(inProgressTasks)} sub="قيد التنفيذ والمراجعة" />
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: '2fr 1fr',
        gap: 16,
      }}>
        <Card pad={0}>
          <div style={{
            padding: '14px 20px',
            borderBottom: '1px solid var(--border-1)',
            display: 'flex',
            alignItems: 'center',
          }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--ink-900)' }}>مشاريعي</div>
              <div style={{ fontSize: 12, color: 'var(--ink-500)', marginTop: 3 }}>
                المشاريع المعيّنة لك أو التي تشرف عليها.
              </div>
            </div>
            <button
              onClick={() => navigate('/app/projects')}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--teal-700)',
                fontSize: 12.5,
                fontWeight: 700,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 4,
              }}
            >
              عرض الكل
              <Icon name="chevron-right" size={14} />
            </button>
          </div>
          {projects.slice(0, 5).map((p, i, arr) => (
            <div
              key={p.id}
              onClick={() => navigate(`/app/projects/${p.id}`)}
              className="row-hover clickable responsive-row"
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 110px 140px 100px',
                gap: 16,
                alignItems: 'center',
                padding: '14px 20px',
                borderBottom: i < arr.length - 1 ? '1px solid var(--border-1)' : 'none',
              }}
            >
              <div style={{ minWidth: 0 }}>
                <div style={{
                  fontSize: 13.5,
                  fontWeight: 700,
                  color: 'var(--ink-900)',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}>{p.name}</div>
                <div style={{
                  fontSize: 11,
                  color: 'var(--ink-500)',
                  marginTop: 3,
                }}>
                  <span className="num">{p.code}</span>{' · '}{p.discipline}
                </div>
              </div>
              <StatusChip status={p.status} />
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span className="num" style={{ fontSize: 12, fontWeight: 700, minWidth: 32 }}>{p.progress}%</span>
                <div style={{ flex: 1 }}>
                  <Progress value={p.progress} status={p.status} height={6} />
                </div>
              </div>
              <AvatarStack ids={p.team} size={22} max={3} />
            </div>
          ))}
          {projects.length === 0 && (
            <EmptyRow text="لا توجد مشاريع معيّنة لك بعد." />
          )}
        </Card>

        <Card>
          <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--ink-900)', marginBottom: 14 }}>
            النشاط الأخير
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, fontSize: 13, color: 'var(--ink-700)' }}>
            {expenses.slice(0, 6).map((e) => {
              const project = projects.find((p) => p.id === e.project);
              return (
                <div key={e.id} style={{ display: 'flex', gap: 8 }}>
                  <Icon name="receipt" size={14} style={{ color: 'var(--ink-500)', marginTop: 3 }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ color: 'var(--ink-800)' }}>
                      <b>{e.name}</b> — <span className="money" dir="ltr">{SARw(e.amount)}</span>
                    </div>
                    <div style={{ fontSize: 11, color: 'var(--ink-500)', marginTop: 2 }}>
                      {project?.code || '—'} · {e.date}
                    </div>
                  </div>
                </div>
              );
            })}
            {expenses.length === 0 && <EmptyRow text="لا توجد مصروفات بعد." />}
          </div>
        </Card>
      </div>

      <Card pad={0}>
        <div style={{
          padding: '14px 20px',
          borderBottom: '1px solid var(--border-1)',
        }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--ink-900)' }}>آخر المصروفات</div>
          <div style={{ fontSize: 12, color: 'var(--ink-500)', marginTop: 3 }}>
            المصروفات المسجّلة عبر كل المشاريع.
          </div>
        </div>
        <div className="responsive-table-head" style={{
          display: 'grid',
          gridTemplateColumns: '1.5fr 1fr 1fr 1fr 1fr',
          padding: '10px 20px',
          background: 'var(--ink-050)',
          borderBottom: '1px solid var(--border-2)',
          fontSize: 11,
          fontWeight: 700,
          color: 'var(--ink-500)',
          textTransform: 'uppercase',
          letterSpacing: '0.04em',
        }}>
          <span>الوصف</span>
          <span>النوع</span>
          <span>المشروع</span>
          <span>التاريخ</span>
          <span style={{ textAlign: 'start' }}>المبلغ</span>
        </div>
        {expenses.slice(0, 8).map((e, i, arr) => {
          const project = projects.find((p) => p.id === e.project);
          return (
            <div key={e.id} className="responsive-row" style={{
              display: 'grid',
              gridTemplateColumns: '1.5fr 1fr 1fr 1fr 1fr',
              padding: '12px 20px',
              borderBottom: i < arr.length - 1 ? '1px solid var(--border-1)' : 'none',
              alignItems: 'center',
              fontSize: 13,
            }}>
              <div>
                <div style={{ fontWeight: 600, color: 'var(--ink-900)' }}>{e.name}</div>
                <div className="num" style={{ fontSize: 11, color: 'var(--ink-500)', marginTop: 2 }}>{e.id.slice(0, 8)}</div>
              </div>
              <span style={{ color: 'var(--ink-700)' }}>{e.type}</span>
              <span style={{ color: 'var(--ink-700)' }}>{project?.code || '—'}</span>
              <span className="num" style={{ color: 'var(--ink-600)' }}>{e.date}</span>
              <span className="money" dir="ltr" style={{ fontWeight: 700, color: 'var(--ink-900)' }}>{SARw(e.amount)}</span>
            </div>
          );
        })}
        {expenses.length === 0 && <EmptyRow text="لا توجد مصروفات مسجَّلة بعد." />}
      </Card>
    </div>
  );
}

function LoadingShell() {
  return (
    <div style={{
      padding: 60,
      textAlign: 'center',
      color: 'var(--ink-500)',
      fontSize: 13,
    }}>
      جارٍ التحميل…
    </div>
  );
}

function EmptyRow({ text }: { text: string }) {
  return (
    <div style={{ padding: '40px 20px', textAlign: 'center', color: 'var(--ink-500)', fontSize: 13 }}>{text}</div>
  );
}

import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/Card';
import { KPI } from '@/components/KPI';
import { StatusChip } from '@/components/Chip';
import { Progress } from '@/components/Progress';
import { Avatar, AvatarStack } from '@/components/Avatar';
import { Icon } from '@/components/Icon';
import { useAuth } from '@/stores/auth';
import { ACTIVITY, EXPENSES, PAYMENTS, PEOPLE, TASKS, visibleProjects } from '@/data/mock';
import { SARw } from '@/lib/format';

export function Dashboard() {
  const { role, personId } = useAuth();
  const navigate = useNavigate();
  const projects = visibleProjects(role, personId);

  const totalBudget = projects.reduce((s, p) => s + p.budget, 0);
  const totalSpent = projects.reduce((s, p) => s + p.spent, 0);
  const overdueInvoices = PAYMENTS.filter((p) => p.status === 'overdue').length;
  const inProgressTasks = TASKS.filter((t) => t.status === 'progress' || t.status === 'review').length;

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
          delta={`${((totalSpent / Math.max(totalBudget, 1)) * 100).toFixed(1)}%`} deltaUp={false} sub="من الميزانية" />
        <KPI label="فواتير متأخرة" value={String(overdueInvoices)}
          valueColor={overdueInvoices > 0 ? 'var(--danger-700)' : undefined} sub="تستحق المتابعة" />
        <KPI label="مهام نشطة" value={String(inProgressTasks)} sub="قيد التنفيذ والمراجعة" />
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: '2fr 1fr',
        gap: 16,
      }}>
        {/* My projects */}
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
              <Icon name="chevron-left" size={14} />
            </button>
          </div>
          {projects.slice(0, 5).map((p, i, arr) => (
            <div
              key={p.id}
              onClick={() => navigate(`/app/projects/${p.id}`)}
              className="row-hover clickable"
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
                <div className="num" style={{
                  fontSize: 11,
                  color: 'var(--ink-500)',
                  marginTop: 3,
                  direction: 'ltr',
                  textAlign: 'start',
                }}>{p.code} · {p.discipline}</div>
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
            <div style={{ padding: '40px 20px', textAlign: 'center', color: 'var(--ink-500)', fontSize: 13 }}>
              لا توجد مشاريع معيّنة لك بعد.
            </div>
          )}
        </Card>

        {/* Recent activity */}
        <Card>
          <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--ink-900)', marginBottom: 14 }}>
            النشاط الأخير
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {ACTIVITY.map((a, i) => {
              const person = PEOPLE.find((p) => p.id === a.actor);
              return (
                <div key={i} style={{ display: 'flex', gap: 10 }}>
                  <Avatar person={a.actor} size={28} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, lineHeight: 1.6, color: 'var(--ink-800)' }}>
                      <b style={{ color: 'var(--ink-900)' }}>{person?.name || a.actor}</b>{' '}
                      <span style={{ color: 'var(--ink-600)' }}>{a.verb}</span>{' '}
                      <span>{a.target}</span>
                    </div>
                    <div style={{ fontSize: 11, color: 'var(--ink-500)', marginTop: 2 }}>{a.when}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>

      {/* Recent expenses */}
      <Card pad={0}>
        <div style={{
          padding: '14px 20px',
          borderBottom: '1px solid var(--border-1)',
          display: 'flex',
          alignItems: 'center',
        }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--ink-900)' }}>آخر المصروفات</div>
            <div style={{ fontSize: 12, color: 'var(--ink-500)', marginTop: 3 }}>
              المصروفات المسجّلة عبر كل المشاريع.
            </div>
          </div>
        </div>
        <div style={{
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
        {EXPENSES.slice(0, 6).map((e, i, arr) => {
          const project = projects.find((p) => p.id === e.project);
          return (
            <div
              key={e.id}
              style={{
                display: 'grid',
                gridTemplateColumns: '1.5fr 1fr 1fr 1fr 1fr',
                padding: '12px 20px',
                borderBottom: i < arr.length - 1 ? '1px solid var(--border-1)' : 'none',
                alignItems: 'center',
                fontSize: 13,
              }}
            >
              <div>
                <div style={{ fontWeight: 600, color: 'var(--ink-900)' }}>{e.name}</div>
                <div className="num" style={{ fontSize: 11, color: 'var(--ink-500)', marginTop: 2 }}>{e.id}</div>
              </div>
              <span style={{ color: 'var(--ink-700)' }}>{e.type}</span>
              <span style={{ color: 'var(--ink-700)' }}>{project?.code || '—'}</span>
              <span className="num" style={{ color: 'var(--ink-600)' }}>{e.date}</span>
              <span className="money" style={{ fontWeight: 700, color: 'var(--ink-900)' }}>{SARw(e.amount)}</span>
            </div>
          );
        })}
      </Card>
    </div>
  );
}

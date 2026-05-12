import { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { Icon } from '@/components/Icon';
import { StatusChip, Chip, PaymentChip } from '@/components/Chip';
import { Progress } from '@/components/Progress';
import { Avatar } from '@/components/Avatar';
import { Modal } from '@/components/Modal';
import { useAuth } from '@/stores/auth';
import { useAsync } from '@/hooks/useAsync';
import { useAppData } from '@/contexts/AppData';
import {
  countProjectTasks, createExpense, createTask, createTerm, deleteExpense, deleteTask, deleteTerm,
  getProject, listExpenses, listPayments, listTasks, listTerms, updateExpense, updateTerm,
  type NewTaskInput,
} from '@/data/api';
import { SARw } from '@/lib/format';
import { confirmDelete, toast } from '@/lib/notify';
import { computeProjectFinance, EXPENSE_TYPES, PAYMENT_METHODS, TERM_STATUS_LABEL, TERM_TYPES } from '@/lib/finance';
import type { Expense, Project, Task, Term } from '@/types';

type TabId = 'overview' | 'terms' | 'tasks' | 'vendors' | 'team' | 'expenses' | 'finance' | 'documents' | 'activity';

const TABS: { id: TabId; label: string; icon: string }[] = [
  { id: 'overview',  label: 'نظرة عامة',       icon: 'layout-dashboard' },
  { id: 'terms',     label: 'بنود المشروع',     icon: 'list-checks' },
  { id: 'tasks',     label: 'المهام',           icon: 'check-check' },
  { id: 'vendors',   label: 'الموردون',         icon: 'truck' },
  { id: 'team',      label: 'الفريق',           icon: 'users' },
  { id: 'expenses',  label: 'مصروفات المشروع',  icon: 'receipt' },
  { id: 'finance',   label: 'المتابعة المالية', icon: 'wallet' },
  { id: 'documents', label: 'المستندات',        icon: 'file-text' },
  { id: 'activity',  label: 'النشاطات',         icon: 'scroll-text' },
];

export function ProjectDetail() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { role } = useAuth();
  const [tab, setTab] = useState<TabId>('overview');

  const projectQ  = useAsync(() => projectId ? getProject(projectId) : Promise.resolve(null), [projectId]);
  const termsQ    = useAsync(() => projectId ? listTerms(projectId)  : Promise.resolve([]),   [projectId]);
  const tasksQ    = useAsync(() => projectId ? listTasks(projectId)  : Promise.resolve([]),   [projectId]);
  const expensesQ = useAsync(() => projectId ? listExpenses(projectId) : Promise.resolve([]), [projectId]);
  const paymentsQ = useAsync(() => projectId ? listPayments(projectId) : Promise.resolve([]), [projectId]);

  if (projectQ.loading) return <Loading />;
  if (!projectQ.data)   return <NotFound onBack={() => navigate('/app/projects')} />;

  const project = projectQ.data;
  const terms = termsQ.data ?? [];
  const tasks = tasksQ.data ?? [];
  const expenses = expensesQ.data ?? [];
  const payments = paymentsQ.data ?? [];

  const finance = computeProjectFinance(
    project,
    expenses,
    terms,
    payments.map((p) => ({ ...p, project: project.code })),
  );

  const canEdit = role === 'admin' || role === 'pm' || role === 'finance';

  const refetchAll = async () => {
    await Promise.all([
      projectQ.refetch(),
      expensesQ.refetch(),
      termsQ.refetch(),
      paymentsQ.refetch(),
    ]);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <Header
        project={project}
        finance={finance}
        onBack={() => navigate('/app/projects')}
      />

      <Card pad={0}>
        <div style={{
          display: 'flex',
          gap: 4,
          padding: '0 14px',
          borderBottom: '1px solid var(--border-1)',
          overflowX: 'auto',
        }}>
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={tab === t.id ? 'tab-btn tab-btn-active' : 'tab-btn'}
            >
              <Icon name={t.icon} size={14} />
              {t.label}
            </button>
          ))}
        </div>
      </Card>

      {tab === 'overview' && <OverviewTab project={project} finance={finance} />}
      {tab === 'terms' && (
        <TermsTab
          projectId={project.id}
          terms={terms}
          canEdit={canEdit}
          reload={async () => { await termsQ.refetch(); await refetchAll(); }}
        />
      )}
      {tab === 'tasks' && (
        <TasksTab
          tasks={tasks}
          projectId={project.id}
          projectCode={project.code}
          team={project.team}
          canEdit={canEdit}
          reload={() => tasksQ.refetch()}
        />
      )}
      {tab === 'vendors' && <VendorsTab />}
      {tab === 'team' && <TeamTab team={project.team} />}
      {tab === 'expenses' && (
        <ExpensesTab
          projectId={project.id}
          terms={terms}
          expenses={expenses}
          canEdit={canEdit}
          reload={async () => { await expensesQ.refetch(); await refetchAll(); }}
        />
      )}
      {tab === 'finance' && (
        <FinanceTab
          payments={payments}
          finance={finance}
        />
      )}
      {tab === 'documents' && <DocumentsTab />}
      {tab === 'activity' && <ActivityTab />}
    </div>
  );
}

function Loading() {
  return <div style={{ padding: 60, textAlign: 'center', color: 'var(--ink-500)' }}>جارٍ التحميل…</div>;
}

function NotFound({ onBack }: { onBack: () => void }) {
  return (
    <Card>
      <div style={{ padding: 60, textAlign: 'center' }}>
        <Icon name="inbox" size={26} style={{ color: 'var(--ink-300)' }} />
        <div style={{ marginTop: 10, fontSize: 14, fontWeight: 700, color: 'var(--ink-800)' }}>المشروع غير موجود</div>
        <div style={{ marginTop: 4, fontSize: 12, color: 'var(--ink-500)' }}>قد يكون المشروع غير معيّن لك أو محذوف.</div>
        <div style={{ marginTop: 16 }}>
          <Button variant="secondary" onClick={onBack}>العودة إلى المشاريع</Button>
        </div>
      </div>
    </Card>
  );
}

/* =========================================================
   Header — branding + live finance KPIs
   ========================================================= */

function Header({ project, finance, onBack }: {
  project: Project;
  finance: ReturnType<typeof computeProjectFinance>;
  onBack: () => void;
}) {
  return (
    <Card pad={0}>
      <div style={{ padding: '20px 22px', display: 'flex', flexDirection: 'column', gap: 14 }}>
        <button
          onClick={onBack}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            color: 'var(--ink-600)',
            fontSize: 12,
            padding: 0,
            fontFamily: 'var(--font-sans)',
            alignSelf: 'flex-start',
          }}
        >
          <Icon name="chevron-left" size={14} />
          العودة إلى المشاريع
        </button>
        <div style={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          gap: 16,
          flexWrap: 'wrap',
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
              <span className="num" style={{ fontSize: 12, color: 'var(--ink-500)' }}>{project.code}</span>
              <span style={{ width: 3, height: 3, borderRadius: '50%', background: 'var(--ink-300)' }} />
              <span style={{ fontSize: 12, color: 'var(--ink-500)' }}>{project.discipline}</span>
              <StatusChip status={project.status} />
              {finance.paymentStatus === 'over' && <Chip tone="blocked">تجاوز الميزانية</Chip>}
              {finance.paymentStatus === 'tight' && <Chip tone="risk">قريب من الحد</Chip>}
            </div>
            <div style={{ fontSize: 22, fontWeight: 700, color: 'var(--ink-900)' }}>{project.name}</div>
            <div style={{
              display: 'flex',
              gap: 18,
              fontSize: 13,
              color: 'var(--ink-600)',
              flexWrap: 'wrap',
            }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                <Icon name="building-2" size={14} />{project.client}
              </span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                <Icon name="map-pin" size={14} />{project.location}
              </span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                <Icon name="calendar" size={14} />التسليم {project.due}
              </span>
            </div>
          </div>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr',
          gap: 18,
          paddingTop: 14,
          borderTop: '1px solid var(--border-1)',
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--ink-500)' }}>تقدّم المشروع</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span className="num" style={{ fontSize: 20, fontWeight: 700, color: 'var(--ink-900)' }}>{project.progress}٪</span>
              <Progress value={project.progress} status={project.status} height={8} />
            </div>
          </div>
          <Stat label="الميزانية" value={SARw(finance.budget)} />
          <Stat label="إجمالي المصروفات" value={SARw(finance.expensesTotal)}
            tone={finance.spendPercent > 90 ? 'danger' : null} />
          <Stat label="المتبقي" value={SARw(finance.remaining)}
            tone={finance.remaining < 0 ? 'danger' : 'success'} />
          <Stat label="نسبة الصرف" value={`${finance.spendPercent.toFixed(1)}%`}
            tone={finance.spendPercent > 90 ? 'danger' : finance.spendPercent > 70 ? 'warn' : null} />
        </div>
      </div>
    </Card>
  );
}

function Stat({ label, value, tone }: { label: string; value: string; tone?: 'success' | 'danger' | 'warn' | null }) {
  const color =
    tone === 'success' ? 'var(--success-700)' :
    tone === 'danger' ? 'var(--danger-700)' :
    tone === 'warn' ? 'var(--warning-700)' :
    'var(--ink-900)';
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--ink-500)' }}>{label}</span>
      <span className="money" style={{ fontSize: 16, fontWeight: 700, color }}>{value}</span>
    </div>
  );
}

/* =========================================================
   Overview
   ========================================================= */

function OverviewTab({ project, finance }: {
  project: Project;
  finance: ReturnType<typeof computeProjectFinance>;
}) {
  const { people } = useAppData();
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 16 }}>
      <Card>
        <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 14, color: 'var(--ink-900)' }}>
          الجدول الزمني
        </div>
        <Timeline phases={[
          { id: 'm1', label: 'التصميم والتراخيص',  start: 0,  end: 18,  status: 'completed' },
          { id: 'm2', label: 'التجهيز والمباشرة',  start: 14, end: 32,  status: 'completed' },
          { id: 'm3', label: 'الأعمال المدنية',    start: 28, end: 62,  status: 'progress' },
          { id: 'm4', label: 'التركيب والتشغيل',   start: 58, end: 88,  status: 'todo' },
          { id: 'm5', label: 'الاستلام النهائي',   start: 86, end: 100, status: 'todo' },
        ]} />
        <div style={{
          marginTop: 22,
          paddingTop: 18,
          borderTop: '1px solid var(--border-1)',
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 14,
        }}>
          <MiniStat label="إجمالي البنود" value={SARw(finance.termsTotal)} />
          <MiniStat label="المدفوع للموردين" value={SARw(finance.paid)} />
          <MiniStat
            label="آخر مصروف"
            value={finance.lastExpense ? `${finance.lastExpense.date}` : '—'}
            sub={finance.lastExpense ? SARw(finance.lastExpense.amount) : undefined}
          />
        </div>
      </Card>

      <Card>
        <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 14, color: 'var(--ink-900)' }}>
          الفريق
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {project.team.map((id) => {
            const person = people.find((p) => p.id === id);
            return (
              <div key={id} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <Avatar person={id} size={36} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13.5, fontWeight: 700, color: 'var(--ink-900)' }}>{person?.name || '—'}</div>
                  <div style={{ fontSize: 12, color: 'var(--ink-500)' }}>{person?.role || ''}</div>
                </div>
              </div>
            );
          })}
          {project.team.length === 0 && (
            <div style={{ fontSize: 12.5, color: 'var(--ink-500)' }}>لا يوجد أعضاء فريق معيّنون بعد.</div>
          )}
        </div>
      </Card>
    </div>
  );
}

function MiniStat({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--ink-500)' }}>{label}</span>
      <span className="money" style={{ fontSize: 15, fontWeight: 700, color: 'var(--ink-900)' }}>{value}</span>
      {sub && <span className="money" style={{ fontSize: 11.5, color: 'var(--ink-600)' }}>{sub}</span>}
    </div>
  );
}

function Timeline({ phases }: { phases: { id: string; label: string; start: number; end: number; status: 'completed' | 'progress' | 'todo' }[] }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      {phases.map((ph) => (
        <div key={ph.id} style={{
          display: 'grid',
          gridTemplateColumns: '140px 1fr 100px',
          gap: 14,
          alignItems: 'center',
        }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink-800)' }}>{ph.label}</div>
          <div style={{ position: 'relative', height: 18, background: 'var(--ink-100)', borderRadius: 999 }}>
            <div style={{
              position: 'absolute',
              top: 0,
              bottom: 0,
              right: `${ph.start}%`,
              width: `${ph.end - ph.start}%`,
              background: ph.status === 'completed' ? 'var(--success-500)' :
                ph.status === 'progress' ? 'var(--teal-500)' : 'var(--ink-300)',
              borderRadius: 999,
            }} />
          </div>
          <StatusChip status={ph.status} />
        </div>
      ))}
    </div>
  );
}

/* =========================================================
   Terms tab
   ========================================================= */

function TermsTab({ projectId, terms, canEdit, reload }: {
  projectId: string;
  terms: Term[];
  canEdit: boolean;
  reload: () => Promise<void>;
}) {
  const [editing, setEditing] = useState<Term | null>(null);
  const [creating, setCreating] = useState(false);
  const [busy, setBusy] = useState(false);

  return (
    <>
      <Card pad={0}>
        <div style={{ padding: '14px 20px', borderBottom: '1px solid var(--border-1)', display: 'flex', alignItems: 'center' }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--ink-900)' }}>بنود المشروع</div>
            <div style={{ fontSize: 12, color: 'var(--ink-500)', marginTop: 3 }}>
              البنود التعاقدية والأعمال المُكوِّنة للمشروع.
            </div>
          </div>
          {canEdit && <Button icon="plus" onClick={() => setCreating(true)}>إضافة بند</Button>}
        </div>
        {terms.map((t, i) => (
          <div key={t.id} style={{
            padding: '18px 20px',
            borderBottom: i < terms.length - 1 ? '1px solid var(--border-1)' : 'none',
            display: 'flex',
            gap: 16,
            alignItems: 'flex-start',
          }}>
            <div className="num" style={{
              width: 36,
              height: 36,
              borderRadius: 8,
              background: 'var(--navy-050)',
              color: 'var(--navy-700)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 700,
              fontSize: 12,
              flexShrink: 0,
            }}>{i + 1}</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6, flexWrap: 'wrap' }}>
                <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--ink-900)' }}>{t.title}</div>
                <Chip tone="navy">{t.type}</Chip>
                <Chip tone={t.status === 'done' ? 'completed' : t.status === 'in_progress' ? 'progress' : t.status === 'on_hold' ? 'blocked' : 'neutral'}>
                  {TERM_STATUS_LABEL[t.status]}
                </Chip>
              </div>
              <div style={{ fontSize: 13.5, color: 'var(--ink-700)', lineHeight: 1.75 }}>{t.summary}</div>
              <div style={{ display: 'flex', gap: 18, marginTop: 10, fontSize: 12, color: 'var(--ink-600)' }}>
                {t.amount != null && (
                  <span className="money" style={{ fontWeight: 700, color: 'var(--ink-900)' }}>{SARw(t.amount)}</span>
                )}
                {t.startDate && t.endDate && (
                  <span className="num">{t.startDate} → {t.endDate}</span>
                )}
              </div>
            </div>
            {canEdit && (
              <div style={{ display: 'flex', gap: 6 }}>
                <Button variant="ghost" size="sm" icon="edit-3" onClick={() => setEditing(t)}>تحرير</Button>
                <Button variant="danger" size="sm" icon="trash-2" disabled={busy} onClick={async () => {
                  const ok = await confirmDelete({
                    title: 'حذف البند',
                    text: `هل تريد حذف البند "${t.title}"؟`,
                  });
                  if (!ok) return;
                  setBusy(true);
                  try {
                    await deleteTerm(t.id);
                    await reload();
                    toast.success('تم حذف البند');
                  } catch (e: any) {
                    toast.error(e?.message || 'تعذّر الحذف');
                  } finally { setBusy(false); }
                }}>حذف</Button>
              </div>
            )}
          </div>
        ))}
        {terms.length === 0 && (
          <div style={{ padding: '60px 20px', textAlign: 'center', color: 'var(--ink-500)' }}>
            <Icon name="inbox" size={26} style={{ color: 'var(--ink-300)' }} />
            <div style={{ marginTop: 10, fontSize: 13 }}>لا توجد بنود مُضافة بعد.</div>
          </div>
        )}
      </Card>

      <TermFormModal
        open={creating || editing !== null}
        onClose={() => { setCreating(false); setEditing(null); }}
        initial={editing}
        onSave={async (t) => {
          setBusy(true);
          try {
            if (editing) {
              await updateTerm(t);
              toast.success('تم تحديث البند');
            } else {
              await createTerm({ ...t, project: projectId });
              toast.success('تم إضافة البند');
            }
            await reload();
          } catch (e: any) {
            toast.error(e?.message || 'تعذّر حفظ البند');
            throw e;
          } finally {
            setBusy(false);
            setCreating(false);
            setEditing(null);
          }
        }}
        busy={busy}
      />
    </>
  );
}

function TermFormModal({ open, onClose, initial, onSave, busy }: {
  open: boolean;
  onClose: () => void;
  initial: Term | null;
  onSave: (t: Term) => Promise<void>;
  busy: boolean;
}) {
  const [form, setForm] = useState<Partial<Term>>({});

  useMemo(() => {
    if (open) setForm(initial || { type: TERM_TYPES[0], status: 'planned' });
  }, [open, initial]);

  if (!open) return null;

  const submit = async () => {
    if (!form.title || !form.summary) return;
    await onSave({
      id: initial?.id ?? '',
      project: initial?.project ?? '',
      title: form.title!,
      type: form.type || TERM_TYPES[0],
      amount: form.amount !== undefined && form.amount !== null && (form.amount as any) !== '' ? Number(form.amount) : undefined,
      startDate: form.startDate || undefined,
      endDate: form.endDate || undefined,
      status: (form.status as Term['status']) || 'planned',
      summary: form.summary!,
      notes: form.notes || undefined,
    });
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={initial ? 'تحرير بند' : 'إضافة بند جديد'}
      subtitle="أضف بنود العقد والأعمال المُكوِّنة للمشروع."
      width={620}
      footer={<>
        <Button variant="secondary" onClick={onClose} disabled={busy}>إلغاء</Button>
        <Button onClick={submit} icon="save" disabled={busy}>
          {busy ? 'جارٍ الحفظ…' : 'حفظ البند'}
        </Button>
      </>}
    >
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 14 }}>
        <div style={{ gridColumn: 'span 2' }}>
          <label className="field-label">اسم البند *</label>
          <input className="input" value={form.title || ''}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            placeholder="مثال: أعمال الكهرباء" />
        </div>
        <div>
          <label className="field-label">نوع البند</label>
          <select className="input" value={form.type || ''} onChange={(e) => setForm({ ...form, type: e.target.value })}>
            {TERM_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
        <div>
          <label className="field-label">القيمة (ر.س)</label>
          <input className="input num" type="number" value={form.amount ?? ''} onChange={(e) => setForm({ ...form, amount: e.target.value === '' ? undefined : Number(e.target.value) })} placeholder="0" />
        </div>
        <div>
          <label className="field-label">تاريخ البداية</label>
          <input className="input num" type="date" value={form.startDate || ''} onChange={(e) => setForm({ ...form, startDate: e.target.value })} />
        </div>
        <div>
          <label className="field-label">تاريخ النهاية</label>
          <input className="input num" type="date" value={form.endDate || ''} onChange={(e) => setForm({ ...form, endDate: e.target.value })} />
        </div>
        <div>
          <label className="field-label">الحالة</label>
          <select className="input" value={form.status || 'planned'} onChange={(e) => setForm({ ...form, status: e.target.value as Term['status'] })}>
            {(['planned', 'in_progress', 'done', 'on_hold'] as Term['status'][]).map((s) =>
              <option key={s} value={s}>{TERM_STATUS_LABEL[s]}</option>
            )}
          </select>
        </div>
        <div style={{ gridColumn: 'span 2' }}>
          <label className="field-label">وصف البند *</label>
          <textarea className="input" rows={3} value={form.summary || ''}
            onChange={(e) => setForm({ ...form, summary: e.target.value })}
            placeholder="نطاق العمل وأبرز تفاصيل البند." />
        </div>
        <div style={{ gridColumn: 'span 2' }}>
          <label className="field-label">ملاحظات</label>
          <input className="input" value={form.notes || ''} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
        </div>
      </div>
    </Modal>
  );
}

/* =========================================================
   Expenses tab
   ========================================================= */

function ExpensesTab({ projectId, terms, expenses, canEdit, reload }: {
  projectId: string;
  terms: Term[];
  expenses: Expense[];
  canEdit: boolean;
  reload: () => Promise<void>;
}) {
  const { vendors } = useAppData();
  const [editing, setEditing] = useState<Expense | null>(null);
  const [creating, setCreating] = useState(false);
  const [busy, setBusy] = useState(false);

  const total = expenses.reduce((s, e) => s + e.amount, 0);

  return (
    <>
      <Card pad={0}>
        <div style={{ padding: '14px 20px', borderBottom: '1px solid var(--border-1)', display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 10 }}>
          <div style={{ flex: 1, minWidth: 220 }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--ink-900)' }}>مصروفات المشروع</div>
            <div style={{ fontSize: 12, color: 'var(--ink-500)', marginTop: 3 }}>
              المصروفات الفعلية المُسجَّلة — الحساب المالي يُحدَّث تلقائيًا عند الإضافة أو التعديل أو الحذف.
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--ink-500)' }}>إجمالي المصروفات</span>
              <span className="money" style={{ fontSize: 17, fontWeight: 800, color: 'var(--ink-900)' }}>{SARw(total)}</span>
            </div>
            {canEdit && <Button icon="plus" onClick={() => setCreating(true)}>إضافة مصروف</Button>}
          </div>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: '1.6fr 1fr 1fr 110px 1fr 1fr 90px',
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
          <span>المورد</span>
          <span>التاريخ</span>
          <span>طريقة الدفع</span>
          <span style={{ textAlign: 'start' }}>المبلغ</span>
          <span></span>
        </div>
        {expenses.map((e, i) => {
          const vendor = vendors.find((v) => v.id === e.vendor);
          return (
            <div key={e.id} style={{
              display: 'grid',
              gridTemplateColumns: '1.6fr 1fr 1fr 110px 1fr 1fr 90px',
              padding: '12px 20px',
              borderBottom: i < expenses.length - 1 ? '1px solid var(--border-1)' : 'none',
              alignItems: 'center',
              gap: 6,
              fontSize: 13,
            }}>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontWeight: 600, color: 'var(--ink-900)' }}>{e.name}</div>
                <div className="num" style={{ fontSize: 11, color: 'var(--ink-500)', marginTop: 2, direction: 'ltr', textAlign: 'start' }}>
                  {e.invoiceNo || e.id.slice(0, 8)}
                </div>
              </div>
              <Chip tone="navy" dot={false}>{e.type}</Chip>
              <span style={{ color: 'var(--ink-700)' }}>{vendor?.name || '—'}</span>
              <span className="num" style={{ color: 'var(--ink-600)' }}>{e.date}</span>
              <span style={{ color: 'var(--ink-700)' }}>{PAYMENT_METHODS[e.method]}</span>
              <span className="money" style={{ fontWeight: 700, color: 'var(--ink-900)' }}>{SARw(e.amount)}</span>
              {canEdit ? (
                <div style={{ display: 'flex', gap: 4, justifyContent: 'flex-start' }}>
                  <button onClick={() => setEditing(e)} className="icon-btn" title="تحرير">
                    <Icon name="edit-3" size={14} />
                  </button>
                  <button disabled={busy} onClick={async () => {
                    const ok = await confirmDelete({
                      title: 'حذف المصروف',
                      text: 'سيتم تحديث الملخص المالي تلقائيًا.',
                    });
                    if (!ok) return;
                    setBusy(true);
                    try {
                      await deleteExpense(e.id);
                      await reload();
                      toast.success('تم حذف المصروف');
                    } catch (err: any) {
                      toast.error(err?.message || 'تعذّر الحذف');
                    } finally { setBusy(false); }
                  }} className="icon-btn icon-btn-danger" title="حذف">
                    <Icon name="trash-2" size={14} />
                  </button>
                </div>
              ) : <span />}
            </div>
          );
        })}
        {expenses.length === 0 && (
          <div style={{ padding: '60px 20px', textAlign: 'center', color: 'var(--ink-500)' }}>
            <Icon name="receipt" size={26} style={{ color: 'var(--ink-300)' }} />
            <div style={{ marginTop: 10, fontSize: 13 }}>لم تُسجَّل أي مصروفات بعد.</div>
          </div>
        )}
      </Card>

      <ExpenseFormModal
        open={creating || editing !== null}
        onClose={() => { setCreating(false); setEditing(null); }}
        initial={editing}
        projectId={projectId}
        terms={terms}
        busy={busy}
        onSave={async (e) => {
          setBusy(true);
          try {
            if (editing) {
              await updateExpense(e);
              toast.success('تم تحديث المصروف');
            } else {
              await createExpense(e);
              toast.success('تم إضافة المصروف');
            }
            await reload();
          } catch (err: any) {
            toast.error(err?.message || 'تعذّر حفظ المصروف');
            throw err;
          } finally {
            setBusy(false);
            setCreating(false);
            setEditing(null);
          }
        }}
      />
    </>
  );
}

function ExpenseFormModal({ open, onClose, initial, projectId, terms, onSave, busy }: {
  open: boolean;
  onClose: () => void;
  initial: Expense | null;
  projectId: string;
  terms: Term[];
  onSave: (e: Expense) => Promise<void>;
  busy: boolean;
}) {
  const { vendors } = useAppData();
  const [form, setForm] = useState<Partial<Expense>>({});

  useMemo(() => {
    if (open) {
      setForm(initial || {
        type: EXPENSE_TYPES[0],
        method: 'bank_transfer',
        date: new Date().toISOString().slice(0, 10),
        amount: 0,
      });
    }
  }, [open, initial]);

  if (!open) return null;

  const submit = async () => {
    if (!form.name || !form.amount || !form.date) return;
    await onSave({
      id: initial?.id ?? '',
      project: projectId,
      name: form.name!,
      type: form.type || EXPENSE_TYPES[0],
      amount: Number(form.amount),
      date: form.date!,
      vendor: form.vendor || null,
      term: form.term ?? null,
      method: (form.method as Expense['method']) || 'bank_transfer',
      invoiceNo: form.invoiceNo,
      attachment: form.attachment || null,
      notes: form.notes,
    });
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={initial ? 'تحرير المصروف' : 'إضافة مصروف جديد'}
      subtitle="سيتم تحديث ملخص المشروع المالي تلقائيًا عند الحفظ."
      width={680}
      footer={<>
        <Button variant="secondary" onClick={onClose} disabled={busy}>إلغاء</Button>
        <Button onClick={submit} icon="save" disabled={busy}>
          {busy ? 'جارٍ الحفظ…' : 'حفظ المصروف'}
        </Button>
      </>}
    >
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 14 }}>
        <div style={{ gridColumn: 'span 2' }}>
          <label className="field-label">اسم المصروف *</label>
          <input className="input" value={form.name || ''} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="مثال: توريد كوابل 25مم" />
        </div>
        <div>
          <label className="field-label">نوع المصروف</label>
          <select className="input" value={form.type || ''} onChange={(e) => setForm({ ...form, type: e.target.value })}>
            {EXPENSE_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
        <div>
          <label className="field-label">المبلغ (ر.س) *</label>
          <input className="input num" type="number" min={0} value={form.amount ?? ''} onChange={(e) => setForm({ ...form, amount: Number(e.target.value) })} placeholder="0" />
        </div>
        <div>
          <label className="field-label">التاريخ *</label>
          <input className="input num" type="date" value={form.date || ''} onChange={(e) => setForm({ ...form, date: e.target.value })} />
        </div>
        <div>
          <label className="field-label">طريقة الدفع</label>
          <select className="input" value={form.method || 'bank_transfer'} onChange={(e) => setForm({ ...form, method: e.target.value as Expense['method'] })}>
            {Object.entries(PAYMENT_METHODS).map(([id, label]) => <option key={id} value={id}>{label}</option>)}
          </select>
        </div>
        <div>
          <label className="field-label">المورد (اختياري)</label>
          <select className="input" value={form.vendor || ''} onChange={(e) => setForm({ ...form, vendor: e.target.value || null })}>
            <option value="">— بدون مورد —</option>
            {vendors.map((v) => <option key={v.id} value={v.id}>{v.name}</option>)}
          </select>
        </div>
        <div>
          <label className="field-label">البند المرتبط (اختياري)</label>
          <select className="input" value={form.term ?? ''} onChange={(e) => setForm({ ...form, term: e.target.value === '' ? null : e.target.value })}>
            <option value="">— بدون بند —</option>
            {terms.map((t) => <option key={t.id} value={t.id}>{t.title}</option>)}
          </select>
        </div>
        <div>
          <label className="field-label">رقم الفاتورة (اختياري)</label>
          <input className="input num" value={form.invoiceNo || ''} onChange={(e) => setForm({ ...form, invoiceNo: e.target.value })} placeholder="INV-XXXX" />
        </div>
        <div>
          <label className="field-label">مرفق / صورة الفاتورة</label>
          <div style={{
            border: '1px dashed var(--border-2)',
            borderRadius: 8,
            padding: '10px 12px',
            background: 'var(--ink-050)',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            fontSize: 12.5,
            color: 'var(--ink-600)',
            cursor: 'pointer',
          }}>
            <Icon name="paperclip" size={14} />
            <span>اسحب صورة الفاتورة أو اضغط للاختيار (قيد التطوير)</span>
          </div>
        </div>
        <div style={{ gridColumn: 'span 2' }}>
          <label className="field-label">ملاحظات</label>
          <textarea className="input" rows={2} value={form.notes || ''} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
        </div>
      </div>
    </Modal>
  );
}

/* =========================================================
   Other tabs (Tasks / Vendors / Team / Finance / Documents / Activity)
   ========================================================= */

function TasksTab({ tasks, projectId, projectCode, team, canEdit, reload }: {
  tasks: Task[];
  projectId: string;
  projectCode: string;
  team: string[];
  canEdit: boolean;
  reload: () => void | Promise<void>;
}) {
  const [creating, setCreating] = useState(false);
  const [busy, setBusy] = useState(false);

  return (
    <>
      <Card pad={0}>
        <div style={{
          padding: '14px 20px',
          borderBottom: '1px solid var(--border-1)',
          display: 'flex',
          alignItems: 'center',
        }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--ink-900)' }}>المهام</div>
            <div style={{ fontSize: 12, color: 'var(--ink-500)', marginTop: 3 }}>
              المهام المرتبطة بهذا المشروع وحالتها الحالية.
            </div>
          </div>
          {canEdit && <Button icon="plus" onClick={() => setCreating(true)}>مهمة جديدة</Button>}
        </div>
        {tasks.length === 0 && (
          <div style={{ padding: '60px 20px', textAlign: 'center', color: 'var(--ink-500)' }}>
            <Icon name="check-check" size={26} style={{ color: 'var(--ink-300)' }} />
            <div style={{ marginTop: 10, fontSize: 13 }}>لا توجد مهام مرتبطة بهذا المشروع.</div>
          </div>
        )}
        {tasks.map((t, i) => (
          <div key={t.id} style={{
            display: 'grid',
            gridTemplateColumns: '24px 1fr 130px 110px 36px 60px',
            gap: 14,
            alignItems: 'center',
            padding: '14px 20px',
            borderBottom: i < tasks.length - 1 ? '1px solid var(--border-1)' : 'none',
          }}>
            <input type="checkbox" defaultChecked={t.status === 'done'}
              style={{ width: 16, height: 16, accentColor: 'var(--teal-500)' }} />
            <div>
              <div style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--ink-900)' }}>{t.title}</div>
              <div className="num" style={{ fontSize: 11, color: 'var(--ink-500)', marginTop: 3, direction: 'ltr', textAlign: 'start' }}>{t.code}</div>
            </div>
            <StatusChip status={t.status} />
            <span style={{ fontSize: 12, color: t.priority === 'high' ? 'var(--danger-700)' : 'var(--ink-600)' }}>{t.due}</span>
            <Avatar person={t.assignee} size={26} />
            {canEdit ? (
              <button
                disabled={busy}
                onClick={async () => {
                  const ok = await confirmDelete({
                    title: 'حذف المهمة',
                    text: `هل تريد حذف المهمة "${t.title}"؟`,
                  });
                  if (!ok) return;
                  setBusy(true);
                  try {
                    await deleteTask(t.id);
                    await reload();
                    toast.success('تم حذف المهمة');
                  } catch (err: any) {
                    toast.error(err?.message || 'تعذّر الحذف');
                  } finally { setBusy(false); }
                }}
                className="icon-btn icon-btn-danger"
                style={{ justifySelf: 'start' }}
                title="حذف"
              >
                <Icon name="trash-2" size={14} />
              </button>
            ) : <span />}
          </div>
        ))}
      </Card>

      <TaskFormModal
        open={creating}
        onClose={() => setCreating(false)}
        projectId={projectId}
        projectCode={projectCode}
        team={team}
        onSaved={async () => { setCreating(false); await reload(); }}
      />
    </>
  );
}

function TaskFormModal({ open, onClose, projectId, projectCode, team, onSaved }: {
  open: boolean;
  onClose: () => void;
  projectId: string;
  projectCode: string;
  team: string[];
  onSaved: () => void | Promise<void>;
}) {
  const { people } = useAppData();
  const teamMembers = useMemo(() => people.filter((p) => team.includes(p.id)), [people, team]);
  const [form, setForm] = useState<Partial<NewTaskInput>>({});
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  useMemo(() => {
    if (open) {
      // Suggest next task code: e.g. "CIV-2026-014 · T-XX"
      countProjectTasks(projectId).then((n) => {
        const num = String(n + 1).padStart(2, '0');
        setForm({
          status: 'todo',
          priority: 'normal',
          code: `${projectCode} · T-${num}`,
          dueDate: '',
          assigneeId: teamMembers[0]?.id || null,
        });
      });
      setErr(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, projectId, projectCode]);

  if (!open) return null;

  const submit = async () => {
    setErr(null);
    if (!form.title) {
      setErr('عنوان المهمة حقل إلزامي.');
      return;
    }
    setBusy(true);
    try {
      await createTask({
        projectId,
        code: form.code || `${projectCode} · T-01`,
        title: form.title!,
        status: form.status || 'todo',
        assigneeId: form.assigneeId || null,
        dueDate: form.dueDate || null,
        priority: form.priority || 'normal',
      });
      toast.success('تم إضافة المهمة');
      await onSaved();
    } catch (e: any) {
      setErr(e?.message || 'تعذّر إنشاء المهمة.');
      toast.error(e?.message || 'تعذّر إنشاء المهمة');
    } finally {
      setBusy(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="مهمة جديدة"
      subtitle="أضف مهمة إلى هذا المشروع وعيّن لها مسؤولًا."
      width={620}
      footer={<>
        <Button variant="secondary" onClick={onClose} disabled={busy}>إلغاء</Button>
        <Button onClick={submit} icon="save" disabled={busy}>
          {busy ? 'جارٍ الحفظ…' : 'حفظ المهمة'}
        </Button>
      </>}
    >
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 14 }}>
        <div style={{ gridColumn: 'span 2' }}>
          <label className="field-label">عنوان المهمة *</label>
          <input className="input" value={form.title || ''} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="مثال: مراجعة مخططات حديد التسليح" />
        </div>
        <div>
          <label className="field-label">الرمز</label>
          <input className="input num" value={form.code || ''} onChange={(e) => setForm({ ...form, code: e.target.value })} />
        </div>
        <div>
          <label className="field-label">الحالة</label>
          <select className="input" value={form.status || 'todo'} onChange={(e) => setForm({ ...form, status: e.target.value as Task['status'] })}>
            <option value="todo">لم تبدأ</option>
            <option value="progress">قيد التنفيذ</option>
            <option value="review">قيد المراجعة</option>
            <option value="done">مكتملة</option>
          </select>
        </div>
        <div>
          <label className="field-label">المسؤول</label>
          <select className="input" value={form.assigneeId || ''} onChange={(e) => setForm({ ...form, assigneeId: e.target.value || null })}>
            <option value="">— بدون مسؤول —</option>
            {teamMembers.map((m) => <option key={m.id} value={m.id}>{m.name}</option>)}
          </select>
          {teamMembers.length === 0 && (
            <div style={{ fontSize: 11, color: 'var(--ink-500)', marginTop: 4 }}>
              لا يوجد أعضاء فريق معيّنون. أضف أعضاء من تبويب "الفريق" أو "إدارة المستخدمين".
            </div>
          )}
        </div>
        <div>
          <label className="field-label">تاريخ الاستحقاق</label>
          <input className="input num" type="date" value={form.dueDate || ''} onChange={(e) => setForm({ ...form, dueDate: e.target.value })} />
        </div>
        <div>
          <label className="field-label">الأولوية</label>
          <select className="input" value={form.priority || 'normal'} onChange={(e) => setForm({ ...form, priority: e.target.value as 'normal' | 'high' })}>
            <option value="normal">عادية</option>
            <option value="high">عالية</option>
          </select>
        </div>
      </div>

      {err && (
        <div style={{
          marginTop: 14,
          padding: '10px 12px',
          borderRadius: 8,
          background: 'var(--danger-050)',
          border: '1px solid var(--danger-100)',
          color: 'var(--danger-700)',
          fontSize: 13,
          display: 'flex',
          gap: 8,
          alignItems: 'center',
        }}>
          <Icon name="circle-alert" size={14} />
          {err}
        </div>
      )}
    </Modal>
  );
}

function VendorsTab() {
  const { vendors } = useAppData();
  return (
    <Card pad={0}>
      <div style={{
        display: 'grid',
        gridTemplateColumns: '2fr 1fr 1fr 1fr 80px',
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
          gridTemplateColumns: '2fr 1fr 1fr 1fr 80px',
          padding: '14px 20px',
          borderBottom: i < vendors.length - 1 ? '1px solid var(--border-1)' : 'none',
          alignItems: 'center',
          fontSize: 13,
        }}>
          <div style={{ fontWeight: 700, color: 'var(--ink-900)' }}>{v.name}</div>
          <span style={{ color: 'var(--ink-700)' }}>{v.discipline}</span>
          <Chip tone={v.status === 'active' ? 'completed' : v.status === 'awaiting' ? 'review' : v.status === 'prequalified' ? 'navy' : 'blocked'}>
            {v.status === 'active' ? 'نشط' : v.status === 'awaiting' ? 'بانتظار التأهيل' : v.status === 'prequalified' ? 'مؤهَّل مسبقًا' : 'موقوف'}
          </Chip>
          <span className="num" style={{ color: 'var(--ink-700)', direction: 'ltr', textAlign: 'start' }}>{v.contact}</span>
          <span className="num" style={{ fontWeight: 700 }}>{v.projects}</span>
        </div>
      ))}
    </Card>
  );
}

function TeamTab({ team }: { team: string[] }) {
  const { people } = useAppData();
  return (
    <Card pad={0}>
      <div style={{ padding: '14px 20px', borderBottom: '1px solid var(--border-1)', display: 'flex', alignItems: 'center' }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--ink-900)' }}>الفريق والمهندسون</div>
          <div style={{ fontSize: 12, color: 'var(--ink-500)', marginTop: 3 }}>
            صلاحياتهم الأساسية تأتي من دورهم العام، يمكن تجاوزها لهذا المشروع.
          </div>
        </div>
        <Button icon="user-plus" disabled title="قيد التطوير">إضافة عضو</Button>
      </div>
      {team.map((id, i) => {
        const person = people.find((p) => p.id === id);
        return (
          <div key={id} style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            padding: '14px 20px',
            borderBottom: i < team.length - 1 ? '1px solid var(--border-1)' : 'none',
          }}>
            <Avatar person={id} size={36} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--ink-900)' }}>{person?.name || '—'}</div>
              <div style={{ fontSize: 12, color: 'var(--ink-500)' }}>{person?.role} · {person?.city}</div>
            </div>
          </div>
        );
      })}
      {team.length === 0 && (
        <div style={{ padding: '40px 20px', textAlign: 'center', color: 'var(--ink-500)', fontSize: 13 }}>
          لا يوجد أعضاء فريق معيّنون لهذا المشروع.
        </div>
      )}
    </Card>
  );
}

function FinanceTab({ payments, finance }: {
  payments: import('@/types').Payment[];
  finance: ReturnType<typeof computeProjectFinance>;
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
        gap: 14,
      }}>
        <FinanceKpi label="ميزانية المشروع" value={SARw(finance.budget)} icon="wallet" />
        <FinanceKpi label="إجمالي البنود" value={SARw(finance.termsTotal)} icon="list-checks" />
        <FinanceKpi label="إجمالي المصروفات" value={SARw(finance.expensesTotal)} icon="receipt"
          color={finance.spendPercent > 90 ? 'var(--danger-700)' : undefined} />
        <FinanceKpi label="المدفوع للموردين" value={SARw(finance.paid)} icon="check-check" color="var(--success-700)" />
        <FinanceKpi label="المتبقي" value={SARw(finance.remaining)} icon="circle-dollar-sign"
          color={finance.remaining < 0 ? 'var(--danger-700)' : 'var(--success-700)'} />
        <FinanceKpi label="نسبة الصرف" value={`${finance.spendPercent.toFixed(1)}%`} icon="trending-up"
          color={finance.spendPercent > 90 ? 'var(--danger-700)' : finance.spendPercent > 70 ? 'var(--warning-700)' : undefined} />
        <FinanceKpi label="الفرق (ميزانية − صرف)" value={SARw(finance.difference)} icon="badge-check"
          color={finance.difference < 0 ? 'var(--danger-700)' : 'var(--ink-900)'} />
        <FinanceKpi
          label="آخر مصروف"
          value={finance.lastExpense ? SARw(finance.lastExpense.amount) : '—'}
          sub={finance.lastExpense?.date}
          icon="clock"
        />
      </div>

      <Card pad={0}>
        <div style={{ padding: '14px 20px', borderBottom: '1px solid var(--border-1)' }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--ink-900)' }}>الفواتير</div>
          <div style={{ fontSize: 12, color: 'var(--ink-500)', marginTop: 3 }}>المدفوعات والمستحقات للمشروع.</div>
        </div>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 2fr 1fr 1fr 130px',
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
          <span style={{ textAlign: 'start' }}>المبلغ</span>
          <span>الاستحقاق</span>
          <span>الحالة</span>
        </div>
        {payments.map((p, i) => (
          <div key={p.id} style={{
            display: 'grid',
            gridTemplateColumns: '1fr 2fr 1fr 1fr 130px',
            padding: '14px 20px',
            borderBottom: i < payments.length - 1 ? '1px solid var(--border-1)' : 'none',
            alignItems: 'center',
            fontSize: 13,
          }}>
            <span className="num" style={{ fontWeight: 700, direction: 'ltr', textAlign: 'start' }}>{p.id}</span>
            <span style={{ color: 'var(--ink-700)' }}>{p.vendor}</span>
            <span className="money" style={{ fontWeight: 700 }}>{SARw(p.amount)}</span>
            <span className="num" style={{ color: 'var(--ink-600)' }}>{p.due}</span>
            <PaymentChip status={p.status} />
          </div>
        ))}
        {payments.length === 0 && (
          <div style={{ padding: '40px 20px', textAlign: 'center', color: 'var(--ink-500)', fontSize: 13 }}>
            لا توجد فواتير مسجَّلة على هذا المشروع بعد.
          </div>
        )}
      </Card>
    </div>
  );
}

function FinanceKpi({ label, value, sub, icon, color }: {
  label: string;
  value: string;
  sub?: string;
  icon: string;
  color?: string;
}) {
  return (
    <Card pad={16}>
      <div style={{ display: 'flex', gap: 12 }}>
        <div style={{
          width: 40,
          height: 40,
          borderRadius: 10,
          background: 'var(--navy-050)',
          color: 'var(--navy-700)',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}>
          <Icon name={icon} size={18} />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4, minWidth: 0 }}>
          <span style={{ fontSize: 11.5, fontWeight: 600, color: 'var(--ink-500)' }}>{label}</span>
          <span className="money" style={{ fontSize: 18, fontWeight: 800, color: color || 'var(--ink-900)' }}>{value}</span>
          {sub && <span className="num" style={{ fontSize: 11, color: 'var(--ink-500)' }}>{sub}</span>}
        </div>
      </div>
    </Card>
  );
}

function DocumentsTab() {
  return (
    <Card>
      <div style={{ padding: '40px 20px', textAlign: 'center', color: 'var(--ink-500)' }}>
        <Icon name="file-text" size={26} style={{ color: 'var(--ink-300)' }} />
        <div style={{ marginTop: 10, fontSize: 13, color: 'var(--ink-700)', fontWeight: 700 }}>المستندات</div>
        <div style={{ marginTop: 4, fontSize: 12 }}>
          ارفع العقود، المخططات، وتقارير الفحص. سيتم ربط رفع الملفات بـ Supabase Storage لاحقًا.
        </div>
        <div style={{ marginTop: 16 }}>
          <Button icon="paperclip" disabled>رفع مستند</Button>
        </div>
      </div>
    </Card>
  );
}

function ActivityTab() {
  return (
    <Card>
      <div style={{ padding: '40px 20px', textAlign: 'center', color: 'var(--ink-500)' }}>
        <Icon name="scroll-text" size={26} style={{ color: 'var(--ink-300)' }} />
        <div style={{ marginTop: 10, fontSize: 13, color: 'var(--ink-700)', fontWeight: 700 }}>سجل النشاطات</div>
        <div style={{ marginTop: 4, fontSize: 12 }}>
          سيتم تعبئته تلقائيًا عند تنفيذ عمليات على المشروع (إضافة بنود، مصروفات، اعتمادات).
        </div>
      </div>
    </Card>
  );
}

import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/Card';
import { StatusChip } from '@/components/Chip';
import { Progress } from '@/components/Progress';
import { AvatarStack } from '@/components/Avatar';
import { Button } from '@/components/Button';
import { Icon } from '@/components/Icon';
import { Modal } from '@/components/Modal';
import { useAuth } from '@/stores/auth';
import { useAsync } from '@/hooks/useAsync';
import { useAppData } from '@/contexts/AppData';
import { createProject, listProjects, type NewProjectInput } from '@/data/api';
import { SARw } from '@/lib/format';
import { toast } from '@/lib/notify';
import type { ProjectStatus } from '@/types';

const STATUS_OPTIONS: { id: ProjectStatus | 'all'; label: string }[] = [
  { id: 'all', label: 'الكل' },
  { id: 'progress', label: 'قيد التنفيذ' },
  { id: 'review', label: 'قيد المراجعة' },
  { id: 'risk', label: 'في خطر' },
  { id: 'blocked', label: 'متوقف' },
  { id: 'completed', label: 'مكتمل' },
];

const PROJECT_STATUS_LABEL: Record<ProjectStatus, string> = {
  progress: 'قيد التنفيذ',
  review: 'قيد المراجعة',
  risk: 'في خطر',
  blocked: 'متوقف',
  completed: 'مكتمل',
};

export function ProjectsList() {
  const { role } = useAuth();
  const navigate = useNavigate();
  const { data: all, loading, error, refetch } = useAsync(() => listProjects(), []);
  const [filter, setFilter] = useState<ProjectStatus | 'all'>('all');
  const [q, setQ] = useState('');
  const [creating, setCreating] = useState(false);

  const projects = useMemo(() => {
    return (all ?? []).filter((p) => {
      if (filter !== 'all' && p.status !== filter) return false;
      if (q && !`${p.name} ${p.code} ${p.client}`.toLowerCase().includes(q.toLowerCase())) return false;
      return true;
    });
  }, [all, filter, q]);

  const canCreate = role === 'admin' || role === 'pm';

  if (loading) return <div style={{ padding: 40, textAlign: 'center', color: 'var(--ink-500)' }}>جارٍ التحميل…</div>;
  if (error) return <ErrorState message={error} />;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <Card pad={14}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            padding: '7px 12px',
            background: 'var(--ink-050)',
            border: '1px solid var(--border-1)',
            borderRadius: 8,
            flex: '1 1 240px',
            maxWidth: 360,
          }}>
            <Icon name="search" size={14} style={{ color: 'var(--ink-500)' }} />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="ابحث في اسم المشروع، الرمز، العميل…"
              style={{
                flex: 1,
                background: 'transparent',
                border: 'none',
                outline: 'none',
                fontSize: 13,
                fontFamily: 'var(--font-sans)',
                color: 'var(--ink-900)',
              }}
            />
          </div>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {STATUS_OPTIONS.map((o) => {
              const active = filter === o.id;
              return (
                <button
                  key={o.id}
                  onClick={() => setFilter(o.id)}
                  className={active ? 'pill pill-active' : 'pill'}
                >
                  {o.label}
                </button>
              );
            })}
          </div>
          <div style={{ marginInlineStart: 'auto', display: 'flex', gap: 8 }}>
            {canCreate && (
              <Button icon="plus" onClick={() => setCreating(true)}>مشروع جديد</Button>
            )}
          </div>
        </div>
      </Card>

      <Card pad={0}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '2fr 110px 130px 130px 130px 100px',
          padding: '12px 20px',
          background: 'var(--ink-050)',
          borderBottom: '1px solid var(--border-2)',
          fontSize: 11,
          fontWeight: 700,
          color: 'var(--ink-500)',
          textTransform: 'uppercase',
          letterSpacing: '0.04em',
          alignItems: 'center',
        }}>
          <span>المشروع</span>
          <span>الحالة</span>
          <span>التقدّم</span>
          <span>الميزانية</span>
          <span>المصروف</span>
          <span style={{ textAlign: 'start' }}>الفريق</span>
        </div>
        {projects.map((p, i, arr) => (
          <div
            key={p.id}
            onClick={() => navigate(`/app/projects/${p.id}`)}
            className="row-hover clickable"
            style={{
              display: 'grid',
              gridTemplateColumns: '2fr 110px 130px 130px 130px 100px',
              padding: '14px 20px',
              borderBottom: i < arr.length - 1 ? '1px solid var(--border-1)' : 'none',
              alignItems: 'center',
              gap: 8,
            }}
          >
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--ink-900)' }}>{p.name}</div>
              <div style={{ fontSize: 11.5, color: 'var(--ink-500)', marginTop: 3 }}>
                <span className="num">{p.code}</span>
                {' · '}{p.discipline}{' · '}{p.client}
              </div>
            </div>
            <StatusChip status={p.status} />
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span className="num" style={{ fontSize: 12, fontWeight: 700, minWidth: 32 }}>{p.progress}%</span>
              <div style={{ flex: 1 }}>
                <Progress value={p.progress} status={p.status} height={6} />
              </div>
            </div>
            <span className="money" style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink-900)' }}>{SARw(p.budget)}</span>
            <span className="money" style={{ fontSize: 13, color: p.budget > 0 && p.spent / p.budget > 0.9 ? 'var(--danger-700)' : 'var(--ink-700)' }}>
              {SARw(p.spent)}
            </span>
            <AvatarStack ids={p.team} size={22} max={3} />
          </div>
        ))}
        {projects.length === 0 && (
          <div style={{
            padding: '60px 20px',
            textAlign: 'center',
            color: 'var(--ink-500)',
            fontSize: 13,
          }}>
            <Icon name="inbox" size={26} style={{ color: 'var(--ink-300)' }} />
            <div style={{ marginTop: 10 }}>لا توجد مشاريع مطابقة للتصفية.</div>
          </div>
        )}
      </Card>

      <ProjectFormModal
        open={creating}
        onClose={() => setCreating(false)}
        onSaved={async () => { setCreating(false); await refetch(); }}
      />
    </div>
  );
}

/* =========================================================
   Project create modal
   ========================================================= */

function ProjectFormModal({ open, onClose, onSaved }: {
  open: boolean;
  onClose: () => void;
  onSaved: () => void | Promise<void>;
}) {
  const { people, disciplines } = useAppData();
  const { personId } = useAuth();
  const disciplineNames = disciplines.map((d) => d.name);
  const defaultDiscipline = disciplineNames[0] || '';
  const [form, setForm] = useState<Partial<NewProjectInput>>({
    discipline: defaultDiscipline,
    status: 'progress',
    progress: 0,
    budget: 0,
  });
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  // Reset form whenever the modal re-opens
  useMemo(() => {
    if (open) {
      const first = disciplineNames[0] || '';
      setForm({
        code: suggestProjectCode(first),
        name: '',
        discipline: first,
        status: 'progress',
        progress: 0,
        budget: 0,
        pmId: personId || people[0]?.id || '',
      });
      setErr(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  if (!open) return null;

  const submit = async () => {
    setErr(null);
    if (!form.code || !form.name || !form.discipline || form.budget === undefined || !form.pmId) {
      setErr('الرمز، الاسم، التخصص، الميزانية، ومسؤول المشروع حقول إلزامية.');
      return;
    }
    setBusy(true);
    try {
      await createProject({
        code: form.code!,
        name: form.name!,
        discipline: form.discipline!,
        status: (form.status as ProjectStatus) || 'progress',
        progress: Number(form.progress) || 0,
        budget: Number(form.budget) || 0,
        dueDate: form.dueDate || null,
        client: form.client || null,
        location: form.location || null,
        pmId: form.pmId!,
      });
      toast.success('تم إنشاء المشروع');
      await onSaved();
    } catch (e: any) {
      const m = e?.message || '';
      if (/duplicate|unique/i.test(m)) {
        setErr('رمز المشروع مستخدم من قبل، اختر رمزًا آخر.');
        toast.error('رمز المشروع مستخدم من قبل');
      } else {
        setErr(m || 'تعذّر إنشاء المشروع.');
        toast.error(m || 'تعذّر إنشاء المشروع');
      }
    } finally {
      setBusy(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="مشروع جديد"
      subtitle="املأ بيانات المشروع — يمكنك إضافة البنود والمصروفات بعد الإنشاء."
      width={720}
      footer={<>
        <Button variant="secondary" onClick={onClose} disabled={busy}>إلغاء</Button>
        <Button onClick={submit} icon="save" disabled={busy}>
          {busy ? 'جارٍ الإنشاء…' : 'إنشاء المشروع'}
        </Button>
      </>}
    >
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 14 }}>
        <div>
          <label className="field-label">رمز المشروع *</label>
          <input className="input num" value={form.code || ''} onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })} placeholder="CIV-2026-015" />
        </div>
        <div>
          <label className="field-label">التخصص *</label>
          {disciplineNames.length === 0 ? (
            <div style={{
              padding: '9px 12px',
              background: 'var(--warning-050)',
              border: '1px solid var(--warning-100)',
              borderRadius: 6,
              fontSize: 12.5,
              color: 'var(--warning-700)',
            }}>
              لا توجد تخصصات مُعرَّفة. أضفها من الإعدادات أولاً.
            </div>
          ) : (
            <select className="input" value={form.discipline} onChange={(e) => setForm({ ...form, discipline: e.target.value, code: form.code || suggestProjectCode(e.target.value) })}>
              {disciplineNames.map((d) => <option key={d} value={d}>{d}</option>)}
            </select>
          )}
        </div>
        <div style={{ gridColumn: 'span 2' }}>
          <label className="field-label">اسم المشروع *</label>
          <input className="input" value={form.name || ''} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="مثال: محطة الرياض الفرعية الجنوبية" />
        </div>
        <div>
          <label className="field-label">العميل</label>
          <input className="input" value={form.client || ''} onChange={(e) => setForm({ ...form, client: e.target.value })} placeholder="اسم الجهة المالكة" />
        </div>
        <div>
          <label className="field-label">الموقع</label>
          <input className="input" value={form.location || ''} onChange={(e) => setForm({ ...form, location: e.target.value })} placeholder="المدينة · الحي" />
        </div>
        <div>
          <label className="field-label">الحالة</label>
          <select className="input" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as ProjectStatus })}>
            {(['progress', 'review', 'risk', 'blocked', 'completed'] as ProjectStatus[]).map((s) =>
              <option key={s} value={s}>{PROJECT_STATUS_LABEL[s]}</option>
            )}
          </select>
        </div>
        <div>
          <label className="field-label">التقدّم (٪)</label>
          <input className="input num" type="number" min={0} max={100} value={form.progress ?? 0} onChange={(e) => setForm({ ...form, progress: Math.max(0, Math.min(100, Number(e.target.value))) })} />
        </div>
        <div>
          <label className="field-label">الميزانية (ر.س) *</label>
          <input className="input num" type="number" min={0} value={form.budget ?? 0} onChange={(e) => setForm({ ...form, budget: Number(e.target.value) })} />
        </div>
        <div>
          <label className="field-label">تاريخ التسليم</label>
          <input className="input num" type="date" value={form.dueDate || ''} onChange={(e) => setForm({ ...form, dueDate: e.target.value })} />
        </div>
        <div style={{ gridColumn: 'span 2' }}>
          <label className="field-label">مسؤول المشروع *</label>
          {people.length === 0 ? (
            <div style={{
              padding: '9px 12px',
              background: 'var(--warning-050)',
              border: '1px solid var(--warning-100)',
              borderRadius: 6,
              fontSize: 12.5,
              color: 'var(--warning-700)',
            }}>
              لا يوجد أعضاء بعد. أضف عضوًا من الإعدادات → إدارة المستخدمين أولاً.
            </div>
          ) : (
            <select
              className="input"
              value={form.pmId || ''}
              onChange={(e) => setForm({ ...form, pmId: e.target.value })}
            >
              {people.map((p) => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          )}
          <div style={{ fontSize: 11, color: 'var(--ink-500)', marginTop: 6 }}>
            الشخص المسؤول عن إدارة هذا المشروع. يمكنك تغييره لاحقًا.
          </div>
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

/** Suggest a code prefix based on the chosen discipline. */
function suggestProjectCode(discipline: string): string {
  const prefix =
    discipline === 'كهربائي' ? 'ELC' :
    discipline === 'ميكانيكي' ? 'MEC' :
    discipline === 'إنشاءات' ? 'CON' :
    discipline === 'صيانة' ? 'MNT' :
    discipline === 'خدمة فنية' ? 'TSV' :
    'CIV';
  const year = new Date().getFullYear();
  const rand = String(Math.floor(Math.random() * 900) + 100);
  return `${prefix}-${year}-${rand}`;
}

function ErrorState({ message }: { message: string }) {
  return (
    <Card>
      <div style={{ padding: 40, textAlign: 'center' }}>
        <Icon name="circle-alert" size={26} style={{ color: 'var(--danger-500)' }} />
        <div style={{ marginTop: 10, fontSize: 13, color: 'var(--ink-700)' }}>تعذّر تحميل المشاريع</div>
        <div style={{ marginTop: 4, fontSize: 11, color: 'var(--ink-500)' }}>{message}</div>
      </div>
    </Card>
  );
}

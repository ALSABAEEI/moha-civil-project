import { useMemo, useState } from 'react';
import { Chip } from '@/components/Chip';
import { Button } from '@/components/Button';
import { Avatar } from '@/components/Avatar';
import { Icon } from '@/components/Icon';
import { Modal } from '@/components/Modal';
import { useAsync } from '@/hooks/useAsync';
import { createTeamMember, listUsers, type NewTeamMemberInput } from '@/data/api';
import { useAppData } from '@/contexts/AppData';
import { useAuth } from '@/stores/auth';
import { ROLE_LABEL } from '@/lib/roles';
import type { Role } from '@/types';

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

const ROLES: Role[] = ['admin', 'pm', 'engineer', 'finance', 'vendor'];

/**
 * Embeddable users-management body. Designed to drop into a Settings <Section>
 * with no outer Card wrapper (the Section provides its own surface).
 */
export function UsersManager() {
  const { data: users, loading, refetch } = useAsync(() => listUsers(), []);
  const { people, refresh } = useAppData();
  const { role } = useAuth();
  const [creating, setCreating] = useState(false);
  const canCreate = role === 'admin';

  return (
    <>
      <div>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 14 }}>
          <div style={{ flex: 1, fontSize: 12.5, color: 'var(--ink-500)', lineHeight: 1.7 }}>
            إدارة الأدوار والصلاحيات وإضافة أعضاء جدد.
          </div>
          {canCreate && (
            <Button icon="user-plus" onClick={() => setCreating(true)}>إضافة عضو</Button>
          )}
        </div>

        <div style={{ border: '1px solid var(--border-1)', borderRadius: 10, overflow: 'hidden' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '2fr 1.4fr 1fr 1fr 1fr',
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
        </div>
        {(users ?? []).map((u, i, arr) => {
          const person = people.find((p) => p.id === u.id);
          return (
            <div key={u.id} style={{
              display: 'grid',
              gridTemplateColumns: '2fr 1.4fr 1fr 1fr 1fr',
              padding: '14px 20px',
              borderBottom: i < arr.length - 1 ? '1px solid var(--border-1)' : 'none',
              alignItems: 'center',
              fontSize: 13,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <Avatar person={u.id} size={30} />
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--ink-900)' }}>{person?.name || '—'}</div>
                  <div style={{ fontSize: 11, color: 'var(--ink-500)' }}>{person?.role || ''}</div>
                </div>
              </div>
              <span className="num" style={{ color: 'var(--ink-700)', direction: 'ltr', textAlign: 'start' }}>{u.email}</span>
              <span style={{ color: 'var(--ink-700)' }}>{ROLE_LABEL[u.role]}</span>
              <span style={{ color: 'var(--ink-700)' }}>{u.department}</span>
              <Chip tone={STATUS_TONE[u.status]}>{STATUS_LABEL[u.status]}</Chip>
            </div>
          );
        })}
        {loading && (
          <div style={{ padding: 30, textAlign: 'center', color: 'var(--ink-500)', fontSize: 13 }}>جارٍ التحميل…</div>
        )}
        {!loading && (users?.length ?? 0) === 0 && (
          <div style={{ padding: '60px 20px', textAlign: 'center', color: 'var(--ink-500)' }}>
            <Icon name="users" size={26} style={{ color: 'var(--ink-300)' }} />
            <div style={{ marginTop: 10, fontSize: 13 }}>لا يوجد أعضاء بعد.</div>
          </div>
        )}
        </div>
      </div>

      <UserFormModal
        open={creating}
        onClose={() => setCreating(false)}
        onSaved={async () => {
          setCreating(false);
          await refetch();
          await refresh();
        }}
      />
    </>
  );
}

/* =========================================================
   Add User modal
   ========================================================= */

function UserFormModal({ open, onClose, onSaved }: {
  open: boolean;
  onClose: () => void;
  onSaved: () => void | Promise<void>;
}) {
  const [form, setForm] = useState<Partial<NewTeamMemberInput>>({});
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  useMemo(() => {
    if (open) {
      setForm({ role: 'engineer', department: '' });
      setErr(null);
    }
  }, [open]);

  if (!open) return null;

  const setDisplayName = (v: string) => {
    setForm((f) => ({
      ...f,
      displayName: v,
      initials: f.initials || suggestInitials(v),
    }));
  };

  const submit = async () => {
    setErr(null);
    if (!form.email || !form.password || !form.displayName || !form.role) {
      setErr('البريد، كلمة المرور، الاسم، والدور حقول إلزامية.');
      return;
    }
    if (form.password.length < 8) {
      setErr('كلمة المرور يجب أن تكون 8 أحرف فأكثر.');
      return;
    }
    setBusy(true);
    try {
      await createTeamMember({
        email: form.email!.trim(),
        password: form.password!,
        displayName: form.displayName!.trim(),
        initials: (form.initials || suggestInitials(form.displayName!)).slice(0, 3),
        role: form.role as Role,
        department: form.department || null,
        city: form.city || null,
      });
      await onSaved();
    } catch (e: any) {
      const m = e?.message || '';
      if (/already registered|already exists|duplicate/i.test(m)) {
        setErr('هذا البريد مسجَّل من قبل.');
      } else if (/password/i.test(m)) {
        setErr('كلمة مرور غير صالحة. اختر كلمة أقوى.');
      } else {
        setErr(m || 'تعذّر إنشاء العضو.');
      }
    } finally {
      setBusy(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="إضافة عضو جديد"
      subtitle="أنشئ حسابًا لعضو في الفريق. سيتمكن من تسجيل الدخول فورًا بالبريد وكلمة المرور التي تختارها."
      width={680}
      footer={<>
        <Button variant="secondary" onClick={onClose} disabled={busy}>إلغاء</Button>
        <Button onClick={submit} icon="save" disabled={busy}>
          {busy ? 'جارٍ الإنشاء…' : 'إضافة العضو'}
        </Button>
      </>}
    >
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 14 }}>
        <div>
          <label className="field-label">البريد الإلكتروني *</label>
          <input className="input num" dir="ltr" type="email" value={form.email || ''} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="name@protrack.sa" />
        </div>
        <div>
          <label className="field-label">كلمة المرور *</label>
          <input className="input" type="text" value={form.password || ''} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="٨ أحرف فأكثر" />
        </div>
        <div>
          <label className="field-label">الاسم الكامل *</label>
          <input className="input" value={form.displayName || ''} onChange={(e) => setDisplayName(e.target.value)} placeholder="مثال: فيصل الحربي" />
        </div>
        <div>
          <label className="field-label">الأحرف الأولى</label>
          <input className="input" value={form.initials || ''} onChange={(e) => setForm({ ...form, initials: e.target.value.slice(0, 3) })} placeholder="فح" maxLength={3} />
        </div>
        <div>
          <label className="field-label">الدور *</label>
          <select className="input" value={form.role || 'engineer'} onChange={(e) => setForm({ ...form, role: e.target.value as Role })}>
            {ROLES.map((r) => <option key={r} value={r}>{ROLE_LABEL[r]}</option>)}
          </select>
        </div>
        <div>
          <label className="field-label">القسم</label>
          <input className="input" value={form.department || ''} onChange={(e) => setForm({ ...form, department: e.target.value })} placeholder="مثال: الهندسة" />
        </div>
        <div style={{ gridColumn: 'span 2' }}>
          <label className="field-label">المدينة</label>
          <input className="input" value={form.city || ''} onChange={(e) => setForm({ ...form, city: e.target.value })} placeholder="مثال: الرياض" />
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

      <div style={{
        marginTop: 14,
        padding: '10px 12px',
        background: 'var(--info-050)',
        border: '1px solid var(--info-100)',
        borderRadius: 8,
        fontSize: 12.5,
        color: 'var(--ink-700)',
        lineHeight: 1.7,
        display: 'flex',
        gap: 10,
        alignItems: 'flex-start',
      }}>
        <Icon name="info" size={14} style={{ color: 'var(--info-700)', marginTop: 2, flexShrink: 0 }} />
        <span>
          شارك كلمة المرور مع العضو مباشرةً. يمكنه تغييرها من <b>الإعدادات</b> بعد تسجيل الدخول.
        </span>
      </div>
    </Modal>
  );
}

function suggestInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '··';
  if (parts.length === 1) return parts[0].slice(0, 2);
  return parts[0][0] + parts[1][0];
}

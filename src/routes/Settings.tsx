import { useState, type ReactNode } from 'react';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { Icon } from '@/components/Icon';
import { useAuth } from '@/stores/auth';
import { useAppData } from '@/contexts/AppData';
import { createDiscipline, deleteDiscipline, updateMyPassword } from '@/data/api';
import { confirmDelete, toast } from '@/lib/notify';
import { ROLE_LABEL } from '@/lib/roles';
import { UsersManager } from '@/routes/Users';
import type { User } from '@/types';

export function Settings() {
  const { role, profile } = useAuth();
  const isAdmin = role === 'admin';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 880 }}>
      <AccountSection profile={profile} roleLabel={role ? ROLE_LABEL[role] : ''} />
      <PasswordSection />
      {isAdmin && (
        <Section
          title="إدارة المستخدمين"
          subtitle="الأعضاء الداخليون: المدراء، المهندسون، الإداريون، والماليون. لا تشمل العمالة الميدانية."
          icon="users-round"
        >
          <UsersManager />
        </Section>
      )}
      {isAdmin && <DisciplinesSection />}
      {!isAdmin && (
        <Card>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
            <Icon name="info" size={18} style={{ color: 'var(--info-700)', marginTop: 2 }} />
            <div style={{ fontSize: 13, color: 'var(--ink-700)', lineHeight: 1.7 }}>
              <b>إدارة التخصصات والأعضاء</b> متاحة لدور <span style={{ fontWeight: 700 }}>{ROLE_LABEL.admin}</span> فقط.
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}

/* =========================================================
   Collapsible section shell (accordion style — closed by default)
   ========================================================= */

function Section({
  title,
  subtitle,
  icon,
  children,
  defaultOpen = false,
  rightHint,
}: {
  title: string;
  subtitle?: string;
  icon: string;
  children: ReactNode;
  defaultOpen?: boolean;
  rightHint?: ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <Card pad={0}>
      <button
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          gap: 14,
          padding: '16px 20px',
          background: 'transparent',
          border: 'none',
          cursor: 'pointer',
          textAlign: 'start',
          fontFamily: 'var(--font-sans)',
          color: 'var(--ink-900)',
        }}
      >
        <span style={{
          width: 36,
          height: 36,
          borderRadius: 8,
          background: 'var(--navy-050)',
          color: 'var(--navy-700)',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}>
          <Icon name={icon} size={18} />
        </span>
        <span style={{ flex: 1, minWidth: 0 }}>
          <span style={{ display: 'block', fontSize: 15, fontWeight: 700, color: 'var(--ink-900)' }}>
            {title}
          </span>
          {subtitle && (
            <span style={{
              display: 'block',
              fontSize: 12.5,
              color: 'var(--ink-500)',
              marginTop: 3,
              lineHeight: 1.6,
            }}>
              {subtitle}
            </span>
          )}
        </span>
        {rightHint && (
          <span style={{ display: 'inline-flex', alignItems: 'center', color: 'var(--ink-500)', fontSize: 12 }}>
            {rightHint}
          </span>
        )}
        <span
          aria-hidden
          style={{
            display: 'inline-flex',
            color: 'var(--ink-500)',
            transition: 'transform var(--dur-2) var(--ease-out)',
            transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
          }}
        >
          <Icon name="chevron-down" size={18} mirror={false} />
        </span>
      </button>
      {open && (
        <div style={{
          padding: '4px 20px 20px',
          borderTop: '1px solid var(--border-1)',
        }}>
          {children}
        </div>
      )}
    </Card>
  );
}

/* =========================================================
   Account info — read-only
   ========================================================= */

function AccountSection({ profile, roleLabel }: { profile: User | null; roleLabel: string }) {
  return (
    <Section
      title="بيانات الحساب"
      subtitle="معلومات حسابك الحالية."
      icon="users-round"
      rightHint={profile?.email}
    >
      <div style={{
        marginTop: 14,
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: 14,
      }}>
        <Field label="البريد الإلكتروني" value={profile?.email || '—'} mono />
        <Field label="الدور" value={roleLabel || '—'} />
        <Field label="القسم" value={profile?.department || '—'} />
        <Field label="الحالة" value={profile?.status === 'active' ? 'نشط' : profile?.status || '—'} />
      </div>
    </Section>
  );
}

function Field({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--ink-500)' }}>{label}</span>
      <span className={mono ? 'num' : undefined} style={{ fontSize: 14, fontWeight: 600, color: 'var(--ink-900)' }}>
        {value}
      </span>
    </div>
  );
}

/* =========================================================
   Password reset
   ========================================================= */

function PasswordSection() {
  const [pw, setPw] = useState('');
  const [pw2, setPw2] = useState('');
  const [show, setShow] = useState(false);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ kind: 'ok' | 'err'; text: string } | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg(null);
    if (pw.length < 8) { setMsg({ kind: 'err', text: 'كلمة المرور يجب أن تكون 8 أحرف على الأقل.' }); return; }
    if (pw !== pw2) { setMsg({ kind: 'err', text: 'كلمتا المرور غير متطابقتين.' }); return; }
    setBusy(true);
    try {
      await updateMyPassword(pw);
      setPw(''); setPw2('');
      setMsg({ kind: 'ok', text: 'تم تحديث كلمة المرور بنجاح. استخدمها في تسجيل الدخول التالي.' });
      toast.success('تم تحديث كلمة المرور');
    } catch (err: any) {
      const m = err?.message || 'تعذّر تحديث كلمة المرور.';
      setMsg({ kind: 'err', text: m });
      toast.error(m);
    } finally {
      setBusy(false);
    }
  };

  return (
    <Section
      title="تغيير كلمة المرور"
      subtitle="حدّث كلمة المرور لحسابك. يجب أن تكون 8 أحرف فأكثر."
      icon="lock"
    >
      <form onSubmit={submit} className="form-grid" style={{
        marginTop: 14,
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: 14,
        maxWidth: 600,
      }}>
        <div>
          <label className="field-label">كلمة المرور الجديدة</label>
          <input
            className="input"
            type={show ? 'text' : 'password'}
            value={pw}
            onChange={(e) => setPw(e.target.value)}
            autoComplete="new-password"
            disabled={busy}
            placeholder="••••••••"
            required
          />
        </div>
        <div>
          <label className="field-label">تأكيد كلمة المرور</label>
          <input
            className="input"
            type={show ? 'text' : 'password'}
            value={pw2}
            onChange={(e) => setPw2(e.target.value)}
            autoComplete="new-password"
            disabled={busy}
            placeholder="••••••••"
            required
          />
        </div>
        <label style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          fontSize: 13,
          color: 'var(--ink-700)',
          cursor: 'pointer',
          gridColumn: 'span 2',
        }}>
          <input type="checkbox" checked={show} onChange={(e) => setShow(e.target.checked)} style={{ accentColor: 'var(--teal-500)' }} />
          إظهار كلمة المرور أثناء الكتابة
        </label>

        {msg && (
          <div style={{
            gridColumn: 'span 2',
            padding: '10px 12px',
            borderRadius: 8,
            background: msg.kind === 'ok' ? 'var(--success-050)' : 'var(--danger-050)',
            border: '1px solid',
            borderColor: msg.kind === 'ok' ? 'var(--success-100)' : 'var(--danger-100)',
            color: msg.kind === 'ok' ? 'var(--success-700)' : 'var(--danger-700)',
            fontSize: 13,
            display: 'flex',
            gap: 8,
            alignItems: 'center',
          }}>
            <Icon name={msg.kind === 'ok' ? 'check-circle-2' : 'circle-alert'} size={14} />
            {msg.text}
          </div>
        )}

        <div style={{ gridColumn: 'span 2' }}>
          <Button type="submit" icon="save" disabled={busy}>
            {busy ? 'جارٍ الحفظ…' : 'تحديث كلمة المرور'}
          </Button>
        </div>
      </form>
    </Section>
  );
}

/* =========================================================
   Disciplines management (admin only)
   ========================================================= */

function DisciplinesSection() {
  const { disciplines, refresh } = useAppData();
  const [newName, setNewName] = useState('');
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const add = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(null);
    const trimmed = newName.trim();
    if (!trimmed) return;
    if (disciplines.some((d) => d.name === trimmed)) {
      setErr('هذا التخصص موجود مسبقًا.');
      return;
    }
    setBusy(true);
    try {
      const maxOrder = disciplines.reduce((m, d) => Math.max(m, d.displayOrder), 0);
      await createDiscipline(trimmed, maxOrder + 10);
      setNewName('');
      await refresh();
      toast.success('تم إضافة التخصص');
    } catch (e: any) {
      const m = e?.message || 'تعذّر إضافة التخصص.';
      setErr(m);
      toast.error(m);
    } finally {
      setBusy(false);
    }
  };

  const remove = async (id: string, name: string) => {
    const ok = await confirmDelete({
      title: `حذف التخصص "${name}"`,
      text: 'المشاريع والموردون الذين يحملون هذا التخصص لن يتأثروا، لكنه لن يظهر في القوائم بعد ذلك.',
    });
    if (!ok) return;
    setBusy(true);
    try {
      await deleteDiscipline(id);
      await refresh();
      toast.success('تم حذف التخصص');
    } catch (e: any) {
      const m = e?.message || 'تعذّر حذف التخصص.';
      setErr(m);
      toast.error(m);
    } finally {
      setBusy(false);
    }
  };

  return (
    <Section
      title="تخصصات المشاريع والموردين"
      subtitle="القائمة المستخدمة في نموذجَي إضافة مشروع وإضافة مورد. الحذف لا يحذف السجلات المرتبطة، فقط يزيل الخيار من القائمة."
      icon="tag"
      rightHint={`${disciplines.length} تخصص`}
    >
      <form onSubmit={add} style={{ marginTop: 14, display: 'flex', gap: 8, alignItems: 'center' }}>
        <input
          className="input"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          placeholder="مثال: تكييف وتبريد"
          disabled={busy}
          style={{ flex: '1 1 240px', maxWidth: 360 }}
        />
        <Button type="submit" icon="plus" disabled={busy || !newName.trim()}>
          إضافة تخصص
        </Button>
      </form>

      {err && (
        <div style={{
          marginTop: 10,
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
        marginTop: 18,
        display: 'flex',
        flexWrap: 'wrap',
        gap: 8,
      }}>
        {disciplines.length === 0 && (
          <div style={{
            width: '100%',
            padding: '40px 20px',
            textAlign: 'center',
            color: 'var(--ink-500)',
            fontSize: 13,
            background: 'var(--ink-050)',
            borderRadius: 8,
          }}>
            لا توجد تخصصات بعد — أضف أول تخصص أعلاه.
          </div>
        )}
        {disciplines.map((d) => (
          <span key={d.id} style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            padding: '6px 10px 6px 14px',
            background: 'var(--navy-050)',
            color: 'var(--navy-800)',
            borderRadius: 999,
            fontSize: 13,
            fontWeight: 600,
            border: '1px solid var(--navy-100)',
          }}>
            {d.name}
            <button
              onClick={() => remove(d.id, d.name)}
              disabled={busy}
              title="حذف"
              style={{
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                color: 'var(--ink-500)',
                padding: 2,
                display: 'inline-flex',
                borderRadius: 4,
              }}
            >
              <Icon name="x" size={14} />
            </button>
          </span>
        ))}
      </div>
    </Section>
  );
}

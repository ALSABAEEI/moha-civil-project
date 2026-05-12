import { useMemo, useState } from 'react';
import { Card } from '@/components/Card';
import { Chip } from '@/components/Chip';
import { Button } from '@/components/Button';
import { Icon } from '@/components/Icon';
import { Modal } from '@/components/Modal';
import { useAppData } from '@/contexts/AppData';
import { useAuth } from '@/stores/auth';
import { createVendor, type NewVendorInput } from '@/data/api';
import type { Vendor } from '@/types';

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

const STATUS_OPTIONS: Vendor['status'][] = ['active', 'awaiting', 'prequalified', 'suspended'];

export function Vendors() {
  const { vendors, loading, refresh } = useAppData();
  const { role } = useAuth();
  const [creating, setCreating] = useState(false);
  const canCreate = role === 'admin' || role === 'finance';

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
            <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--ink-900)' }}>الموردون</div>
            <div style={{ fontSize: 12, color: 'var(--ink-500)', marginTop: 3 }}>
              العمالة والمقاولون من الباطن المعتمدون لتنفيذ أعمال المشاريع — لا يملكون حسابات في النظام.
            </div>
          </div>
          {canCreate && (
            <Button icon="plus" onClick={() => setCreating(true)}>مورد جديد</Button>
          )}
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

      <VendorFormModal
        open={creating}
        onClose={() => setCreating(false)}
        onSaved={async () => { setCreating(false); await refresh(); }}
      />
    </>
  );
}

/* =========================================================
   Vendor create modal
   ========================================================= */

function VendorFormModal({ open, onClose, onSaved }: {
  open: boolean;
  onClose: () => void;
  onSaved: () => void | Promise<void>;
}) {
  const { disciplines } = useAppData();
  const disciplineNames = disciplines.map((d) => d.name);
  const [form, setForm] = useState<Partial<NewVendorInput>>({
    discipline: disciplineNames[0] || '',
    status: 'awaiting',
  });
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  useMemo(() => {
    if (open) {
      setForm({ discipline: disciplineNames[0] || '', status: 'awaiting' });
      setErr(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  if (!open) return null;

  const submit = async () => {
    setErr(null);
    if (!form.name || !form.discipline) {
      setErr('الاسم والتخصص حقول إلزامية.');
      return;
    }
    setBusy(true);
    try {
      await createVendor({
        name: form.name!,
        discipline: form.discipline!,
        status: form.status || 'awaiting',
        contact: form.contact || null,
        notes: form.notes || null,
      });
      await onSaved();
    } catch (e: any) {
      setErr(e?.message || 'تعذّر إنشاء المورد.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="مورد جديد"
      subtitle="أضف موردًا أو مقاول باطن إلى قائمة المعتمدين."
      width={560}
      footer={<>
        <Button variant="secondary" onClick={onClose} disabled={busy}>إلغاء</Button>
        <Button onClick={submit} icon="save" disabled={busy}>
          {busy ? 'جارٍ الحفظ…' : 'حفظ المورد'}
        </Button>
      </>}
    >
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 14 }}>
        <div style={{ gridColumn: 'span 2' }}>
          <label className="field-label">اسم المورد *</label>
          <input className="input" value={form.name || ''} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="مثال: شركة نجد للأعمال الكهربائية" />
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
            <select className="input" value={form.discipline} onChange={(e) => setForm({ ...form, discipline: e.target.value })}>
              {disciplineNames.map((d) => <option key={d} value={d}>{d}</option>)}
            </select>
          )}
        </div>
        <div>
          <label className="field-label">الحالة</label>
          <select className="input" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as Vendor['status'] })}>
            {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{STATUS_LABEL[s]}</option>)}
          </select>
        </div>
        <div style={{ gridColumn: 'span 2' }}>
          <label className="field-label">رقم التواصل</label>
          <input className="input num" dir="ltr" value={form.contact || ''} onChange={(e) => setForm({ ...form, contact: e.target.value })} placeholder="+966 11 234 5678" />
        </div>
        <div style={{ gridColumn: 'span 2' }}>
          <label className="field-label">ملاحظات</label>
          <textarea className="input" rows={2} value={form.notes || ''} onChange={(e) => setForm({ ...form, notes: e.target.value })} placeholder="أي ملاحظات داخلية عن المورد." />
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

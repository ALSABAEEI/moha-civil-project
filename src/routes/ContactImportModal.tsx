import { useMemo, useState } from 'react';
import Swal from 'sweetalert2';
import { Button } from '@/components/Button';
import { Icon } from '@/components/Icon';
import { Modal } from '@/components/Modal';
import { useAppData } from '@/contexts/AppData';
import { createVendor } from '@/data/api';
import { toast } from '@/lib/notify';
import type { PickedContact } from '@/lib/contacts';
import type { Vendor } from '@/types';

const STATUSES: { id: Vendor['status']; label: string }[] = [
  { id: 'awaiting', label: 'بانتظار التأهيل' },
  { id: 'active', label: 'نشط' },
  { id: 'prequalified', label: 'مؤهَّل مسبقًا' },
  { id: 'suspended', label: 'موقوف' },
];

interface Row {
  include: boolean;
  name: string;
  contact: string;
  discipline: string;
  status: Vendor['status'];
  duplicate: boolean;
}

interface Props {
  open: boolean;
  picked: PickedContact[];
  onClose: () => void;
  onImported: () => void | Promise<void>;
}

export function ContactImportModal({ open, picked, onClose, onImported }: Props) {
  const { vendors, disciplines, refresh } = useAppData();
  const disciplineNames = disciplines.map((d) => d.name);

  // Normalize a phone for duplicate check: keep digits only
  const normPhone = (s: string) => s.replace(/[^\d]/g, '');
  const existingPhones = useMemo(
    () => new Set(vendors.map((v) => normPhone(v.contact)).filter(Boolean)),
    [vendors],
  );

  const [rows, setRows] = useState<Row[]>([]);
  const [busy, setBusy] = useState(false);

  // Initialize rows whenever the modal opens with a new picked list.
  useMemo(() => {
    if (open) {
      const initial = picked.map((p) => ({
        include: true,
        name: p.name || '',
        contact: p.tel || '',
        discipline: disciplineNames[0] || '',
        status: 'awaiting' as Vendor['status'],
        duplicate: existingPhones.has(normPhone(p.tel || '')),
      }));
      setRows(initial);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, picked]);

  if (!open) return null;

  const updateRow = (idx: number, patch: Partial<Row>) => {
    setRows((cur) => cur.map((r, i) => (i === idx ? { ...r, ...patch } : r)));
  };
  const bulkSet = (patch: Partial<Pick<Row, 'discipline' | 'status'>>) => {
    setRows((cur) => cur.map((r) => ({ ...r, ...patch })));
  };

  const includedCount = rows.filter((r) => r.include && !r.duplicate).length;

  const submit = async () => {
    const toImport = rows.filter((r) => r.include && !r.duplicate && r.name && r.contact);
    if (toImport.length === 0) {
      toast.warning('لا توجد جهات اتصال للاستيراد');
      return;
    }
    setBusy(true);
    const skipped = rows.filter((r) => r.include && r.duplicate).length;
    let imported = 0;
    const failures: string[] = [];

    Swal.fire({
      title: 'جارٍ الاستيراد…',
      html: `<div style="font-family: var(--font-sans); color: var(--ink-700);">جارٍ معالجة <b>${toImport.length}</b> جهة اتصال</div>`,
      allowOutsideClick: false,
      didOpen: () => Swal.showLoading(),
      customClass: { popup: 'protrack-swal' },
    });

    for (const r of toImport) {
      try {
        await createVendor({
          name: r.name.trim(),
          discipline: r.discipline || disciplineNames[0] || 'أخرى',
          status: r.status,
          contact: r.contact.trim() || null,
          notes: null,
        });
        imported++;
      } catch (e: any) {
        failures.push(r.name);
      }
    }

    Swal.close();
    setBusy(false);

    if (imported > 0) {
      const parts: string[] = [`تم استيراد ${imported} مورد`];
      if (skipped > 0) parts.push(`تم تخطي ${skipped} مكرر`);
      toast.success(parts.join(' · '));
    }
    if (failures.length > 0) {
      toast.warning(`تعذّر استيراد ${failures.length} من ${toImport.length}`);
    }

    await refresh();
    await onImported();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={`استيراد جهات الاتصال (${rows.length} محددة)`}
      subtitle="راجع البيانات قبل الاستيراد. المكرر يُتخطى تلقائيًا."
      width={820}
      footer={<>
        <Button variant="secondary" onClick={onClose} disabled={busy}>إلغاء</Button>
        <Button onClick={submit} icon="save" disabled={busy || includedCount === 0}>
          {busy ? 'جارٍ الاستيراد…' : `أضف ${includedCount} مورد`}
        </Button>
      </>}
    >
      {/* Bulk-apply row */}
      <div style={{
        padding: 12,
        borderRadius: 10,
        background: 'var(--ink-050)',
        border: '1px solid var(--border-1)',
        marginBottom: 12,
        display: 'flex',
        gap: 10,
        alignItems: 'center',
        flexWrap: 'wrap',
      }}>
        <span style={{ fontSize: 12.5, fontWeight: 700, color: 'var(--ink-700)' }}>تطبيق على الكل:</span>
        {disciplineNames.length > 0 && (
          <select
            className="input"
            style={{ width: 'auto', flex: '0 1 200px' }}
            defaultValue={disciplineNames[0]}
            onChange={(e) => bulkSet({ discipline: e.target.value })}
          >
            {disciplineNames.map((d) => <option key={d} value={d}>{d}</option>)}
          </select>
        )}
        <select
          className="input"
          style={{ width: 'auto', flex: '0 1 180px' }}
          defaultValue="awaiting"
          onChange={(e) => bulkSet({ status: e.target.value as Vendor['status'] })}
        >
          {STATUSES.map((s) => <option key={s.id} value={s.id}>{s.label}</option>)}
        </select>
      </div>

      {/* Rows list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {rows.map((r, i) => (
          <div
            key={i}
            className="form-grid"
            style={{
              display: 'grid',
              gridTemplateColumns: '24px 1.6fr 1.2fr 1fr 1fr',
              gap: 10,
              alignItems: 'center',
              padding: 10,
              borderRadius: 8,
              background: r.duplicate ? 'var(--warning-050)' : '#fff',
              border: '1px solid',
              borderColor: r.duplicate ? 'var(--warning-100)' : 'var(--border-1)',
              opacity: r.include ? 1 : 0.5,
            }}
          >
            <input
              type="checkbox"
              checked={r.include && !r.duplicate}
              disabled={r.duplicate}
              onChange={(e) => updateRow(i, { include: e.target.checked })}
              style={{ accentColor: 'var(--teal-500)' }}
            />
            <input
              className="input"
              value={r.name}
              onChange={(e) => updateRow(i, { name: e.target.value })}
              placeholder="الاسم"
            />
            <input
              className="input num"
              dir="ltr"
              value={r.contact}
              onChange={(e) => updateRow(i, { contact: e.target.value })}
              placeholder="+966 ..."
            />
            <select
              className="input"
              value={r.discipline}
              onChange={(e) => updateRow(i, { discipline: e.target.value })}
            >
              {disciplineNames.map((d) => <option key={d} value={d}>{d}</option>)}
              {disciplineNames.length === 0 && <option value="">— لا توجد تخصصات —</option>}
            </select>
            <select
              className="input"
              value={r.status}
              onChange={(e) => updateRow(i, { status: e.target.value as Vendor['status'] })}
            >
              {STATUSES.map((s) => <option key={s.id} value={s.id}>{s.label}</option>)}
            </select>
            {r.duplicate && (
              <div style={{ gridColumn: '2 / -1', fontSize: 11, color: 'var(--warning-700)', display: 'flex', gap: 6, alignItems: 'center' }}>
                <Icon name="circle-alert" size={12} />
                موجود مسبقًا في قائمة الموردين (نفس رقم التواصل).
              </div>
            )}
          </div>
        ))}
        {rows.length === 0 && (
          <div style={{ padding: 30, textAlign: 'center', color: 'var(--ink-500)', fontSize: 13 }}>
            لم يتم اختيار جهات اتصال.
          </div>
        )}
      </div>
    </Modal>
  );
}

/**
 * Format SAR with Western Arabic digits + Arabic ر.س suffix.
 * Example: SAR(184500) -> "184,500.00 ر.س"
 */
export function SAR(n: number, opts: { halalas?: boolean } = {}): string {
  const { halalas = true } = opts;
  const v = (n || 0).toLocaleString('en-US', {
    minimumFractionDigits: halalas ? 2 : 0,
    maximumFractionDigits: halalas ? 2 : 0,
  });
  return `${v} ر.س`;
}

/** Whole-riyal variant (no halalas) — for compact KPIs */
export function SARw(n: number): string {
  return SAR(n, { halalas: false });
}

/** Replace Western digits with Eastern Arabic digits. Use only in narrative copy. */
export function toArabicDigits(s: string | number): string {
  return String(s).replace(/[0-9]/g, (d) => '٠١٢٣٤٥٦٧٨٩'[Number(d)]);
}

/** Plain number with thousands separators, Western digits. */
export function num(n: number, fractionDigits = 0): string {
  return (n || 0).toLocaleString('en-US', {
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  });
}

const AR_MONTHS = [
  'يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو',
  'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر',
];

/** ISO date (YYYY-MM-DD) -> "18 مايو 2026" */
export function formatDateArabic(iso: string): string {
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(iso);
  if (!m) return iso;
  const [, y, mo, d] = m;
  return `${Number(d)} ${AR_MONTHS[Number(mo) - 1]} ${y}`;
}

/** Today's date in ISO format. */
export function todayIso(): string {
  return new Date().toISOString().slice(0, 10);
}

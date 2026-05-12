import type { CSSProperties, ReactNode } from 'react';
import type { ProjectStatus, TaskStatus } from '@/types';

export type ChipTone = 'neutral' | 'progress' | 'review' | 'risk' | 'blocked' | 'completed' | 'navy' | 'teal';

const TONE_MAP: Record<ChipTone, { bg: string; fg: string; d: string }> = {
  neutral:   { bg: 'var(--ink-100)',     fg: 'var(--ink-700)',     d: 'var(--ink-500)' },
  progress:  { bg: 'var(--teal-050)',    fg: 'var(--teal-700)',    d: 'var(--teal-500)' },
  review:    { bg: 'var(--info-050)',    fg: 'var(--info-700)',    d: 'var(--info-500)' },
  risk:      { bg: 'var(--warning-050)', fg: 'var(--warning-700)', d: 'var(--warning-500)' },
  blocked:   { bg: 'var(--danger-050)',  fg: 'var(--danger-700)',  d: 'var(--danger-500)' },
  completed: { bg: 'var(--success-050)', fg: 'var(--success-700)', d: 'var(--success-500)' },
  navy:      { bg: 'var(--navy-100)',    fg: 'var(--navy-800)',    d: 'var(--navy-700)' },
  teal:      { bg: 'var(--teal-050)',    fg: 'var(--teal-700)',    d: 'var(--teal-500)' },
};

export interface ChipProps {
  tone?: ChipTone;
  dot?: boolean;
  children: ReactNode;
  style?: CSSProperties;
}

export function Chip({ tone = 'neutral', dot = true, children, style }: ChipProps) {
  const c = TONE_MAP[tone];
  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: 6,
      padding: '3px 10px',
      borderRadius: 999,
      fontSize: 11.5,
      fontWeight: 600,
      background: c.bg,
      color: c.fg,
      fontFamily: 'var(--font-sans)',
      whiteSpace: 'nowrap',
      ...style,
    }}>
      {dot && <span style={{ width: 6, height: 6, borderRadius: '50%', background: c.d }} />}
      {children}
    </span>
  );
}

const STATUS_LABEL: Record<string, string> = {
  progress: 'قيد التنفيذ', review: 'قيد المراجعة', risk: 'في خطر',
  blocked: 'متوقف', completed: 'مكتمل', todo: 'لم يبدأ', done: 'مكتمل',
};
const STATUS_TONE: Record<string, ChipTone> = {
  progress: 'progress', review: 'review', risk: 'risk',
  blocked: 'blocked', completed: 'completed', todo: 'neutral', done: 'completed',
};

export function StatusChip({ status }: { status: ProjectStatus | TaskStatus | string }) {
  return <Chip tone={STATUS_TONE[status] || 'neutral'}>{STATUS_LABEL[status] || status}</Chip>;
}

const PAYMENT_LABEL: Record<string, string> = {
  paid: 'مدفوعة', pending: 'بانتظار الدفع', overdue: 'متأخرة', draft: 'مسودة',
};
const PAYMENT_TONE: Record<string, ChipTone> = {
  paid: 'completed', pending: 'review', overdue: 'blocked', draft: 'neutral',
};

export function PaymentChip({ status }: { status: 'paid' | 'pending' | 'overdue' | 'draft' }) {
  return <Chip tone={PAYMENT_TONE[status]}>{PAYMENT_LABEL[status]}</Chip>;
}

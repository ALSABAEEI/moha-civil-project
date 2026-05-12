import type { ProjectStatus } from '@/types';

export interface ProgressProps {
  value: number;
  status?: ProjectStatus | 'progress';
  height?: number;
}

const FILL_COLOR: Record<string, string> = {
  progress: 'var(--teal-500)',
  risk: 'var(--warning-500)',
  blocked: 'var(--danger-500)',
  completed: 'var(--success-500)',
  review: 'var(--info-500)',
};

export function Progress({ value, status = 'progress', height = 8 }: ProgressProps) {
  const fill = FILL_COLOR[status] || 'var(--teal-500)';
  const clamped = Math.max(0, Math.min(100, value));
  return (
    <div style={{
      height,
      background: 'var(--ink-150)',
      borderRadius: 999,
      overflow: 'hidden',
      direction: 'rtl',
    }}>
      <div style={{
        width: `${clamped}%`,
        height: '100%',
        background: fill,
        borderRadius: 999,
        transition: 'width var(--dur-3) var(--ease-out)',
      }} />
    </div>
  );
}

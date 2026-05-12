import { Card } from './Card';

export interface KPIProps {
  label: string;
  value: string;
  delta?: string;
  deltaUp?: boolean;
  sub?: string;
  valueColor?: string;
}

export function KPI({ label, value, delta, deltaUp, sub, valueColor }: KPIProps) {
  return (
    <Card pad={18}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--ink-500)' }}>{label}</span>
        <span className="money" dir="ltr" style={{
          fontSize: 24,
          fontWeight: 700,
          color: valueColor || 'var(--ink-900)',
          lineHeight: 1.1,
        }}>{value}</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {delta && (
            <span style={{
              fontSize: 11,
              fontWeight: 600,
              padding: '1px 6px',
              borderRadius: 4,
              color: deltaUp ? 'var(--success-700)' : 'var(--danger-700)',
              background: deltaUp ? 'var(--success-050)' : 'var(--danger-050)',
              direction: 'ltr',
            }}>{deltaUp ? '+' : ''}{delta}</span>
          )}
          {sub && <span style={{ fontSize: 11, color: 'var(--ink-500)' }}>{sub}</span>}
        </div>
      </div>
    </Card>
  );
}

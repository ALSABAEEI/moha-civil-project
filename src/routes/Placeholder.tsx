import { Card } from '@/components/Card';
import { Icon } from '@/components/Icon';

interface PlaceholderProps {
  title: string;
  subtitle?: string;
}

export function Placeholder({ title, subtitle }: PlaceholderProps) {
  return (
    <Card>
      <div style={{
        padding: '60px 20px',
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 10,
      }}>
        <div style={{
          width: 56,
          height: 56,
          borderRadius: 12,
          background: 'var(--ink-050)',
          color: 'var(--ink-500)',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <Icon name="construction" size={26} />
        </div>
        <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--ink-900)' }}>وحدة {title}</div>
        {subtitle && <div style={{ fontSize: 13, color: 'var(--ink-500)' }}>{subtitle}</div>}
        <div style={{ fontSize: 12, color: 'var(--ink-400)', marginTop: 6 }}>
          قيد التطوير في الإصدار الأول.
        </div>
      </div>
    </Card>
  );
}

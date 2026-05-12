import { Card } from '@/components/Card';
import { Avatar } from '@/components/Avatar';
import { Chip } from '@/components/Chip';
import { TASKS } from '@/data/mock';
import type { TaskStatus } from '@/types';

const COLUMNS: { id: TaskStatus; label: string; tone: 'neutral' | 'progress' | 'review' | 'completed' }[] = [
  { id: 'todo',     label: 'لم تبدأ',       tone: 'neutral' },
  { id: 'progress', label: 'قيد التنفيذ',   tone: 'progress' },
  { id: 'review',   label: 'قيد المراجعة',  tone: 'review' },
  { id: 'done',     label: 'مكتملة',        tone: 'completed' },
];

export function TaskBoard() {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(4, 1fr)',
      gap: 14,
      minHeight: 'calc(100vh - 160px)',
    }}>
      {COLUMNS.map((col) => {
        const items = TASKS.filter((t) => t.status === col.id);
        return (
          <div key={col.id} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '8px 4px',
            }}>
              <Chip tone={col.tone}>{col.label}</Chip>
              <span className="num" style={{ fontSize: 12, fontWeight: 700, color: 'var(--ink-500)' }}>{items.length}</span>
            </div>
            <div style={{
              flex: 1,
              padding: 10,
              background: 'var(--ink-050)',
              borderRadius: 12,
              display: 'flex',
              flexDirection: 'column',
              gap: 10,
              minHeight: 100,
            }}>
              {items.map((t) => (
                <Card key={t.id} pad={14}>
                  <div style={{ fontSize: 13.5, fontWeight: 700, color: 'var(--ink-900)', marginBottom: 6 }}>{t.title}</div>
                  <div className="num" style={{ fontSize: 11, color: 'var(--ink-500)', marginBottom: 10, direction: 'ltr' }}>{t.code}</div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Avatar person={t.assignee} size={22} />
                    <span style={{ fontSize: 11, color: t.priority === 'high' ? 'var(--danger-700)' : 'var(--ink-600)' }}>
                      {t.due}
                    </span>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

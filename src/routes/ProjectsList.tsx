import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/Card';
import { StatusChip } from '@/components/Chip';
import { Progress } from '@/components/Progress';
import { AvatarStack } from '@/components/Avatar';
import { Button } from '@/components/Button';
import { Icon } from '@/components/Icon';
import { useAuth } from '@/stores/auth';
import { visibleProjects } from '@/data/mock';
import { SARw } from '@/lib/format';
import type { ProjectStatus } from '@/types';

const STATUS_OPTIONS: { id: ProjectStatus | 'all'; label: string }[] = [
  { id: 'all', label: 'الكل' },
  { id: 'progress', label: 'قيد التنفيذ' },
  { id: 'review', label: 'قيد المراجعة' },
  { id: 'risk', label: 'في خطر' },
  { id: 'blocked', label: 'متوقف' },
  { id: 'completed', label: 'مكتمل' },
];

export function ProjectsList() {
  const { role, personId } = useAuth();
  const navigate = useNavigate();
  const all = visibleProjects(role, personId);
  const [filter, setFilter] = useState<ProjectStatus | 'all'>('all');
  const [q, setQ] = useState('');

  const projects = useMemo(() => {
    return all.filter((p) => {
      if (filter !== 'all' && p.status !== filter) return false;
      if (q && !`${p.name} ${p.code} ${p.client}`.toLowerCase().includes(q.toLowerCase())) return false;
      return true;
    });
  }, [all, filter, q]);

  const canCreate = role === 'admin' || role === 'pm';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Filters */}
      <Card pad={14}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            padding: '7px 12px',
            background: 'var(--ink-050)',
            border: '1px solid var(--border-1)',
            borderRadius: 8,
            flex: '1 1 240px',
            maxWidth: 360,
          }}>
            <Icon name="search" size={14} style={{ color: 'var(--ink-500)' }} />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="ابحث في اسم المشروع، الرمز، العميل…"
              style={{
                flex: 1,
                background: 'transparent',
                border: 'none',
                outline: 'none',
                fontSize: 13,
                fontFamily: 'var(--font-sans)',
                color: 'var(--ink-900)',
              }}
            />
          </div>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {STATUS_OPTIONS.map((o) => {
              const active = filter === o.id;
              return (
                <button
                  key={o.id}
                  onClick={() => setFilter(o.id)}
                  style={{
                    padding: '6px 12px',
                    borderRadius: 999,
                    fontSize: 12.5,
                    fontWeight: 600,
                    fontFamily: 'var(--font-sans)',
                    border: '1px solid',
                    borderColor: active ? 'var(--navy-800)' : 'var(--border-2)',
                    background: active ? 'var(--navy-800)' : '#fff',
                    color: active ? '#fff' : 'var(--ink-700)',
                    cursor: 'pointer',
                  }}
                >
                  {o.label}
                </button>
              );
            })}
          </div>
          <div style={{ marginInlineStart: 'auto', display: 'flex', gap: 8 }}>
            {canCreate && <Button icon="plus">مشروع جديد</Button>}
          </div>
        </div>
      </Card>

      {/* Table */}
      <Card pad={0}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '2fr 110px 130px 130px 130px 100px',
          padding: '12px 20px',
          background: 'var(--ink-050)',
          borderBottom: '1px solid var(--border-2)',
          fontSize: 11,
          fontWeight: 700,
          color: 'var(--ink-500)',
          textTransform: 'uppercase',
          letterSpacing: '0.04em',
          alignItems: 'center',
        }}>
          <span>المشروع</span>
          <span>الحالة</span>
          <span>التقدّم</span>
          <span>الميزانية</span>
          <span>المصروف</span>
          <span style={{ textAlign: 'start' }}>الفريق</span>
        </div>
        {projects.map((p, i, arr) => (
          <div
            key={p.id}
            onClick={() => navigate(`/app/projects/${p.id}`)}
            className="row-hover clickable"
            style={{
              display: 'grid',
              gridTemplateColumns: '2fr 110px 130px 130px 130px 100px',
              padding: '14px 20px',
              borderBottom: i < arr.length - 1 ? '1px solid var(--border-1)' : 'none',
              alignItems: 'center',
              gap: 8,
            }}
          >
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--ink-900)' }}>{p.name}</div>
              <div className="num" style={{ fontSize: 11.5, color: 'var(--ink-500)', marginTop: 3, direction: 'ltr', textAlign: 'start' }}>
                {p.code} · {p.discipline} · {p.client}
              </div>
            </div>
            <StatusChip status={p.status} />
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span className="num" style={{ fontSize: 12, fontWeight: 700, minWidth: 32 }}>{p.progress}%</span>
              <div style={{ flex: 1 }}>
                <Progress value={p.progress} status={p.status} height={6} />
              </div>
            </div>
            <span className="money" style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink-900)' }}>{SARw(p.budget)}</span>
            <span className="money" style={{ fontSize: 13, color: p.spent / p.budget > 0.9 ? 'var(--danger-700)' : 'var(--ink-700)' }}>
              {SARw(p.spent)}
            </span>
            <AvatarStack ids={p.team} size={22} max={3} />
          </div>
        ))}
        {projects.length === 0 && (
          <div style={{
            padding: '60px 20px',
            textAlign: 'center',
            color: 'var(--ink-500)',
            fontSize: 13,
          }}>
            <Icon name="inbox" size={26} style={{ color: 'var(--ink-300)' }} />
            <div style={{ marginTop: 10 }}>لا توجد مشاريع مطابقة للتصفية.</div>
          </div>
        )}
      </Card>
    </div>
  );
}

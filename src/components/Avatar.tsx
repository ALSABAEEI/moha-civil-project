import { PEOPLE } from '@/data/mock';
import type { Person } from '@/types';

export interface AvatarProps {
  person: string | Person | undefined;
  size?: number;
  ring?: boolean;
}

export function Avatar({ person, size = 28, ring = false }: AvatarProps) {
  const p = typeof person === 'string' ? PEOPLE.find((x) => x.id === person) : person;
  if (!p) return null;
  const fs = size <= 22 ? 10 : size <= 28 ? 11 : size <= 36 ? 12 : 14;
  return (
    <span style={{
      width: size,
      height: size,
      borderRadius: '50%',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#fff',
      fontWeight: 700,
      background: p.color,
      fontSize: fs,
      fontFamily: 'var(--font-sans)',
      flexShrink: 0,
      border: ring ? '2px solid #fff' : 'none',
      boxSizing: 'border-box',
    }}>
      {p.initials}
    </span>
  );
}

export interface AvatarStackProps {
  ids: string[];
  size?: number;
  max?: number;
}

export function AvatarStack({ ids, size = 24, max = 4 }: AvatarStackProps) {
  const shown = ids.slice(0, max);
  const overflow = ids.length - shown.length;
  return (
    <div style={{ display: 'flex' }}>
      {shown.map((id, i) => (
        <span key={id} style={{
          marginRight: i === 0 ? 0 : -8,
          border: '2px solid #fff',
          borderRadius: '50%',
          display: 'inline-flex',
        }}>
          <Avatar person={id} size={size} />
        </span>
      ))}
      {overflow > 0 && (
        <span style={{
          marginRight: -8,
          width: size,
          height: size,
          borderRadius: '50%',
          background: 'var(--ink-200)',
          color: 'var(--ink-700)',
          fontSize: 10,
          fontWeight: 700,
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          border: '2px solid #fff',
        }}>+{overflow}</span>
      )}
    </div>
  );
}

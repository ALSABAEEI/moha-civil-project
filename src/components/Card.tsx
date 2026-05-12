import type { CSSProperties, ReactNode } from 'react';

export interface CardProps {
  children: ReactNode;
  style?: CSSProperties;
  pad?: number;
}

export function Card({ children, style, pad = 20 }: CardProps) {
  return (
    <div style={{
      background: '#fff',
      border: '1px solid var(--border-1)',
      borderRadius: 12,
      boxShadow: 'var(--shadow-sm)',
      padding: pad,
      ...style,
    }}>
      {children}
    </div>
  );
}

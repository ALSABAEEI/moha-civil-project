import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { Icon } from './Icon';

export type ButtonVariant = 'primary' | 'secondary' | 'accent' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: string;
  iconAfter?: string;
  children?: ReactNode;
  block?: boolean;
}

export function Button({
  variant = 'primary',
  size = 'md',
  icon,
  iconAfter,
  children,
  block,
  disabled,
  style,
  ...rest
}: ButtonProps) {
  const variantStyle: Record<ButtonVariant, React.CSSProperties> = {
    primary:   { background: 'var(--navy-800)', color: '#fff', border: '1px solid var(--navy-800)' },
    secondary: { background: '#fff', color: 'var(--navy-800)', border: '1px solid var(--border-2)' },
    accent:    { background: 'var(--teal-500)', color: '#fff', border: '1px solid var(--teal-500)' },
    ghost:     { background: 'transparent', color: 'var(--ink-700)', border: '1px solid transparent' },
    danger:    { background: '#fff', color: 'var(--danger-700)', border: '1px solid var(--danger-100)' },
  };
  const pad = { sm: '6px 12px', md: '9px 16px', lg: '12px 20px' }[size];
  const fs = { sm: 13, md: 14, lg: 15 }[size];
  return (
    <button
      disabled={disabled}
      {...rest}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        padding: pad,
        borderRadius: 8,
        fontFamily: 'var(--font-sans)',
        fontSize: fs,
        fontWeight: 600,
        lineHeight: 1.4,
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.5 : 1,
        transition: 'background var(--dur-2) var(--ease-out), transform var(--dur-1) var(--ease-out)',
        width: block ? '100%' : undefined,
        ...variantStyle[variant],
        ...style,
      }}
    >
      {icon && <Icon name={icon} size={14} stroke={2.1} />}
      {children}
      {iconAfter && <Icon name={iconAfter} size={14} stroke={2.1} />}
    </button>
  );
}

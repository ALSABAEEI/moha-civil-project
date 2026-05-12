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
  className,
  style,
  ...rest
}: ButtonProps) {
  const cls = [
    'btn',
    `btn-${size}`,
    `btn-${variant}`,
    block ? 'btn-block' : null,
    className,
  ].filter(Boolean).join(' ');

  return (
    <button disabled={disabled} className={cls} style={style} {...rest}>
      {icon && <Icon name={icon} size={14} stroke={2.1} />}
      {children}
      {iconAfter && <Icon name={iconAfter} size={14} stroke={2.1} />}
    </button>
  );
}

import { ButtonHTMLAttributes, ReactNode } from 'react';
import styles from './button.module.scss';
import classNames from 'classnames';

type ButtonVariant = 'primary' | 'outline' | 'text';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: ButtonVariant;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  ...props
}: ButtonProps) => {
  return (
    <button
      className={classNames(styles.button, styles[variant], styles[size], className)}
      {...props}
    >
      {children}
    </button>
  );
};

import { ButtonHTMLAttributes, ReactNode } from 'react';
import styles from './button.module.scss';
import classNames from 'classnames';

type ButtonVariant = 'primary' | 'outline' | 'text';

interface ButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'prefix'> {
  children: ReactNode;
  variant?: ButtonVariant;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  prefix?: ReactNode;
  postfix?: ReactNode;
  fullWidth?: boolean;
}

export const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  prefix,
  postfix,
  fullWidth = false,
  ...props
}: ButtonProps) => {
  return (
    <button
      className={classNames(
        styles.button,
        styles[variant],
        styles[size],
        !!prefix && styles.withPrefix,
        !!postfix && styles.withPostfix,
        fullWidth && styles.fullWidth,
        className
      )}
      {...props}
    >
      {prefix ? <span className={styles.prefix}>{prefix}</span> : null}
      {children}
      {postfix ? <span className={styles.postfix}>{postfix}</span> : null}
    </button>
  );
};

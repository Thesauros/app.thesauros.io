import { ButtonHTMLAttributes, ReactNode } from 'react';
import styles from './button.module.scss';
import classNames from 'classnames';

type ButtonVariant = 'primary' | 'secondary';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: ButtonVariant;
  size?: 'xxs' | 'xs' | 's' | 'm';
  className?: string;
}

export const Button = ({
  children,
  variant = 'primary',
  size = 'm',
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

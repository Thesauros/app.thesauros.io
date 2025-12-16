import { ButtonHTMLAttributes, ReactNode } from 'react';
import styles from './button.module.scss';
import classNames from 'classnames';
import { FlexBlock } from '../flex-block';

type ButtonVariant = 'primary' | 'outline' | 'text';

interface ButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'prefix'> {
  children: ReactNode;
  variant?: ButtonVariant;
  size?: 'sm' | 'md' | 'lg' | 'xl';
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
        fullWidth && styles.fullWidth,
        className
      )}
      {...props}
    >
      <FlexBlock alignItems="center" gap={8}>
        {prefix ?? null}
        {children}
        {postfix ?? null}
      </FlexBlock>
    </button>
  );
};

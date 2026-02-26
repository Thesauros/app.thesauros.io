import { ReactNode } from 'react';
import styles from './card.module.scss';
import classNames from 'classnames';

export const Card = ({
  children,
  variant = 'primary',
  className = '',
  onClick,
  block = false,
  dataTestId = '',
}: {
  children: ReactNode;
  variant?: 'primary' | 'secondary';
  className?: string;
  onClick?: () => void;
  block?: boolean;
  dataTestId?: string;
}) => {
  return (
    <div
      className={classNames(styles.card, styles[variant], styles[block ? 'block' : ''], className)}
      onClick={onClick}
      data-testid={dataTestId}
    >
      {children}
    </div>
  );
};

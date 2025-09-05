import { ReactNode } from 'react';
import styles from './card.module.scss';
import classNames from 'classnames';

export const Card = ({
  children,
  size = 'm',
  className = '',
  onClick,
}: {
  children: ReactNode;
  size?: 'm' | 's';
  className?: string;
  onClick?: () => void;
}) => {
  return (
    <div className={classNames(styles.card, styles[size], className)} onClick={onClick}>
      {children}
    </div>
  );
};

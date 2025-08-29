import { ReactNode } from 'react';
import styles from './card.module.scss';
import classNames from 'classnames';

export const Card = ({
  children,
  size = 'm',
  className = '',
}: {
  children: ReactNode;
  size?: 'm' | 's';
  className?: string;
}) => {
  return <div className={classNames(styles.card, styles[size], className)}>{children}</div>;
};

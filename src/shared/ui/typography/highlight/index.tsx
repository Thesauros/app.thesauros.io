import { ReactNode } from 'react';
import styles from './highlight.module.scss';

export const Higlight = ({ children }: { children: ReactNode }) => {
  return <span className={styles.highlight}>{children}</span>;
};

import styles from './subtitle.module.scss';
import classNames from 'classnames';
import { ReactNode } from 'react';

type TProps = {
  children: ReactNode;
  className?: string;
  level?: 1 | 2;
  inline?: boolean;
  weight?: 'bold' | 'medium' | 'regular';
};

export const Subtitle = ({
  children,
  className,
  weight = 'medium',
  level = 1,
  inline = false,
}: TProps) => {
  const content = (
    <p
      className={classNames(
        styles.root,
        styles[weight],
        styles[`level-${level}`],
        inline && styles.inline,
        className
      )}
    >
      {children}
    </p>
  );

  return content;
};

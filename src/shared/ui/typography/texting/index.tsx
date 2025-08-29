import styles from './texting.module.scss';
import classNames from 'classnames';
import { ReactNode } from 'react';

type TProps = {
  children: ReactNode;
  className?: string;
  level?: 1 | 2 | 3 | 4;
  inline?: boolean;
  weight?: 'semibold' | 'medium' | 'regular';
};

export const Texting = ({
  children,
  className,
  weight = 'medium',
  level = 3,
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

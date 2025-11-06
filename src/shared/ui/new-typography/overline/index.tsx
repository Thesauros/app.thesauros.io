import styles from './overline.module.scss';
import classNames from 'classnames';
import { ReactNode } from 'react';

type TProps = {
  children: ReactNode;
  className?: string;
  level?: 1;
  inline?: boolean;
  weight?: 'bold' | 'medium' | 'regular';
};

export const Overline = ({
  children,
  className,
  weight = 'regular',
  level = 1,
  inline = false,
}: TProps) => {
  const content = (
    <span
      className={classNames(
        styles.root,
        styles[weight],
        styles[`level-${level}`],
        inline && styles.inline,
        className
      )}
    >
      {children}
    </span>
  );

  return content;
};

import styles from './heading.module.scss';
import { ReactNode, createElement } from 'react';
import classNames from 'classnames';

type TProps = {
  level: 1 | 2 | 3 | 4;
  children: ReactNode;
  weight?: 'bold' | 'semibold' | 'medium' | 'regular' | 'light';
  inline?: boolean;
  className?: string;
};

export const Heading = ({
  level,
  children,
  weight = 'medium',
  inline = false,
  className = '',
}: TProps) => {
  return createElement(
    `h${level}`,
    {
      className: classNames(
        styles.root,
        styles[weight],
        inline ? styles.inline : '',
        level ? styles[`level-${level}`] : '',
        className
      ),
    },
    children
  );
};

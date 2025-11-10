import { ReactNode, RefObject } from 'react';
import styles from './flex-block.module.scss';
import classNames from 'classnames';

type TProps = {
  children: ReactNode;
  id?: string;
  direction?: 'row' | 'column';
  gap?:
    | 0
    | 2
    | 4
    | 8
    | 12
    | 14
    | 16
    | 20
    | 22
    | 24
    | 28
    | 32
    | 36
    | 40
    | 48
    | 56
    | 64
    | 68
    | 70
    | 80
    | 96
    | 100
    | 184;
  className?: string;
  ref?: RefObject<HTMLDivElement | null>;
  alignItems?: 'flex-end' | 'flex-start' | 'center';
  justifyContent?: 'space-between' | 'end' | 'start' | 'center';
  block?: boolean;
  flexShrink?: number;
  flexWrap?: boolean;
  onClick?: () => void;
};

export const FlexBlock = ({
  children,
  id,
  direction = 'row',
  gap = 8,
  className = '',
  alignItems = direction === 'row' ? 'center' : 'flex-start',
  justifyContent,
  block = false,
  flexShrink,
  flexWrap,
  ref,
  onClick,
}: TProps) => {
  return (
    <div
      id={id ?? ''}
      ref={ref}
      onClick={onClick}
      className={classNames(
        styles.root,
        styles[`direction-${direction}`],
        styles[`gap-${gap}`],
        styles[`align-items-${alignItems}`],
        styles[`justify-content-${justifyContent}`],
        styles[block ? 'block' : ''],
        styles[flexShrink !== undefined ? `flex-shrink-${flexShrink}` : ''],
        styles[flexWrap ? 'flex-wrap' : ''],
        className
      )}
    >
      {children}
    </div>
  );
};

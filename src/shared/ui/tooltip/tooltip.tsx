import 'react-tooltip/dist/react-tooltip.css';
import styles from './tooltip.module.scss';
import { Tooltip as ReactTooltip } from 'react-tooltip';
import { ReactNode } from 'react';
import { FlexBlock } from '../flex-block';
import { NewInfoIcon } from '../icons/new-info';

type TProps = {
  tooltipText: string;
  children: ReactNode;
  display?: string;
  withIcon?: boolean;
};

const createUniqueId = (name: string) => `tooltip-${name.toLowerCase()}`;

export const Tooltip = ({ tooltipText, children, display = 'block', withIcon = false }: TProps) => {
  const uniqueId = createUniqueId(tooltipText);

  return (
    <div style={{ display: display }}>
      <div
        data-tooltip-id={uniqueId}
        data-tooltip-content={tooltipText}
        style={{ display: display }}
      >
        <FlexBlock alignItems="center" gap={4}>
          {children}
          {withIcon && <NewInfoIcon />}
        </FlexBlock>
      </div>
      <ReactTooltip
        className={styles.root}
        id={uniqueId}
        place="bottom"
        content={tooltipText}
        opacity={1}
        style={{
          backgroundColor: '#30343A',
          borderRadius: '8px',
          padding: '8px',
          fontSize: '16px',
          lineHeight: '18px',
          fontWeight: 400,
          textAlign: 'center',
        }}
      />
    </div>
  );
};

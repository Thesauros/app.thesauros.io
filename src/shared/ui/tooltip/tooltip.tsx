import 'react-tooltip/dist/react-tooltip.css';
import styles from './tooltip.module.scss';
import { Tooltip as ReactTooltip } from 'react-tooltip';
import { ReactNode } from 'react';

type TProps = {
  tooltipText: string;
  children: ReactNode;
  display?: string;
};

const createUniqueId = (name: string) => `tooltip-${name.toLowerCase()}`;

export const Tooltip = ({ tooltipText, children, display = 'block' }: TProps) => {
  const uniqueId = createUniqueId(tooltipText);

  return (
    <div style={{ display: display }}>
      <div
        data-tooltip-id={uniqueId}
        data-tooltip-content={tooltipText}
        style={{ display: display }}
      >
        {children}
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

import 'react-tooltip/dist/react-tooltip.css';
import styles from './tooltip.module.scss';
import { Tooltip as ReactTooltip } from 'react-tooltip';
import React, { ReactNode } from 'react';
import { FlexBlock } from '../flex-block';
import { NewInfoIcon } from '../icons/new-info';

type TProps = {
  tooltipText: string;
  fullWidth?: boolean;
  children: ReactNode;
  display?: string;
  withIcon?: boolean;
};

const createUniqueId = (name: string) => `tooltip-${name.toLowerCase()}`;

export const Tooltip = ({
  tooltipText,
  fullWidth = false,
  children,
  display = 'block',
  withIcon = false,
}: TProps) => {
  const uniqueId = createUniqueId(tooltipText);

  return (
    <div style={{ display: display, width: fullWidth ? '100%' : 'auto' }}>
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
        place={'bottom-end'}
        noArrow
        content={tooltipText}
        opacity={1}
        style={{
          backgroundColor: '#262F38',
          borderRadius: '8px',
          padding: '12px 16px',
          fontSize: '12px',
          lineHeight: '16px',
          letterSpacing: 0,
          fontWeight: 400,
        }}
      />
    </div>
  );
};

export const TooltipWithContent = ({
  children,
  content,
}: {
  children: ReactNode;
  content: ReactNode;
}) => {
  return (
    <FlexBlock direction="column" gap={0}>
      <a id="clickable">{children}</a>
      <ReactTooltip
        anchorSelect="#clickable"
        place={'bottom-end'}
        opacity={1}
        style={{
          width: '186px',
          backgroundColor: '#262F38',
          borderRadius: '8px',
          padding: '10px 12px',
          fontSize: '12px',
          lineHeight: '16px',
          letterSpacing: 0,
          fontWeight: 400,
          zIndex: 1,
        }}
        noArrow
        clickable
      >
        {content}
      </ReactTooltip>
    </FlexBlock>
  );
};

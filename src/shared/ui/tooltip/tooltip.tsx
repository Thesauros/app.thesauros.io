import 'react-tooltip/dist/react-tooltip.css';
import styles from './tooltip.module.scss';
import { Tooltip as ReactTooltip } from 'react-tooltip';
import React, { ReactNode, useId, useMemo } from 'react';
import { FlexBlock } from '../flex-block';
import { NewInfoIcon } from '../icons/new-info';
import { useIsTouchDevice } from '@/shared/browser/useIsTouchDevice';

type TProps = {
  tooltipText: string;
  fullWidth?: boolean;
  children: ReactNode;
  display?: string;
  withIcon?: boolean;
};

const createUniqueId = (name: string) => `tooltip-${name.toLowerCase().replace(/\s+/g, '-')}`;

export const Tooltip = ({
  tooltipText,
  fullWidth = false,
  children,
  display = 'block',
  withIcon = false,
}: TProps) => {
  const uniqueId = useMemo(() => createUniqueId(tooltipText), [tooltipText]);
  const isTouch = useIsTouchDevice();

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
        openOnClick={isTouch}
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
  // Every instance needs its own anchor id, otherwise several tooltips on the
  // same page all attach to the first anchor in the document.
  // useId() output is not selector-safe (React wraps it in punctuation).
  const anchorId = `tooltip-anchor-${useId().replace(/[^a-zA-Z0-9]/g, '')}`;
  const isTouch = useIsTouchDevice();

  return (
    <FlexBlock direction="column" gap={0}>
      <a id={anchorId}>{children}</a>
      <ReactTooltip
        anchorSelect={`#${anchorId}`}
        place={'bottom-end'}
        opacity={1}
        openOnClick={isTouch}
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

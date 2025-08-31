import { FlexBlock } from '@/shared/ui/flex-block';
import { CustomTooltipProps } from '../types';
import styles from './sessions-chart.module.scss';

export const SessionsTooltip = ({ active, payload, label }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    const value = payload[0]?.value;

    return (
      <FlexBlock direction="column" gap={4} className={styles.tooltipContainer}>
        <div className={styles.tooltipValue}>{value}</div>
        <div className={styles.tooltipDate}>{label}</div>
      </FlexBlock>
    );
  }
  return null;
};

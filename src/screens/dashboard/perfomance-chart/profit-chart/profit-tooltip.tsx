import { CustomTooltipProps } from '../types';
import styles from './profit-chart.module.scss';

export const ProfitTooltip = ({ active, payload, label }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    const value = payload[0]?.value;

    return (
      <div className={styles.tooltipContainer}>
        <div className={styles.tooltipValue}>${value}</div>
        <div className={styles.tooltipDate}>{label}</div>
      </div>
    );
  }
  return null;
};

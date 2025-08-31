import styles from './revenue-chart.module.scss';
import { CustomTooltipProps } from '../types';
import { FlexBlock } from '@/shared/ui/flex-block';
import { ArrowTopRightIcon } from '@/shared/ui/icons/arrow-top-right';

export const RevenueTooltip = ({ active, payload }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    const revenueValue = payload[0]?.value;
    const revenueProfit = payload[0]?.payload.profit;

    return (
      <div className={styles.revenueTooltip}>
        <FlexBlock alignItems="center" gap={8}>
          <div className={styles.tooltipValue}>${revenueValue}k</div>
          <div className={styles.tooltipChange}>
            <span>{revenueProfit}%</span>
            <ArrowTopRightIcon />
          </div>
        </FlexBlock>
        <div className={styles.tooltipDate}>June 21, 2025</div>
      </div>
    );
  }
  return null;
};

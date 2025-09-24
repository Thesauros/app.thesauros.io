import styles from './apr-chart.module.scss';
import { CustomTooltipProps } from '../types';
import { FlexBlock } from '@/shared/ui/flex-block';
import { ArrowTopRightIcon } from '@/shared/ui/icons/arrow-top-right';
import { round } from '@/shared/number/round';
import classNames from 'classnames';

export const APRChartTooltip = ({ active, payload }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    const aprValue = payload[0]?.value;
    const aprDate = payload[0].payload.date;
    const aprMarketValue = payload[0].payload.marketValue;

    const diffPercent = round((aprValue / aprMarketValue) * 100 - 100);

    return (
      <div className={styles.revenueTooltip}>
        <FlexBlock alignItems="center" gap={8}>
          <div className={styles.tooltipValue}>${round(aprValue)}</div>
          {diffPercent !== Infinity && (
            <div
              className={classNames(styles.tooltipChange, diffPercent < 0 ? styles.negative : '')}
            >
              <span>{diffPercent}%</span>
              {diffPercent > 0.1 && <ArrowTopRightIcon />}
            </div>
          )}
        </FlexBlock>
        <div className={styles.tooltipDate}>{aprDate}</div>
      </div>
    );
  }
  return null;
};

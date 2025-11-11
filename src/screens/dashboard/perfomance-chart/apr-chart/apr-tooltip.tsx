import styles from './apr-chart.module.scss';
import { CustomTooltipProps } from '../types';
import { FlexBlock } from '@/shared/ui/flex-block';
import { ArrowTopRightIcon } from '@/shared/ui/icons/arrow-top-right';
import { round } from '@/shared/number/round';
import classNames from 'classnames';
import { Caption } from '@/shared/ui/new-typography/caption';
import { Body } from '@/shared/ui/new-typography/body';

export const APRChartTooltip = ({ active, payload }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    const aprMarketValue = payload.find(item => item.dataKey === 'marketValue')?.value ?? 0;
    const aprValue = payload.find(item => item.dataKey === 'dateValue')?.value ?? 0;
    const aprDate = payload.find(item => item.dataKey === 'dateValue')?.payload.date ?? '';

    const diffPercent = round((aprValue / aprMarketValue) * 100 - 100);

    return (
      <div className={styles.revenueTooltip}>
        <FlexBlock alignItems="center" gap={8}>
          <Body level={2} weight="bold">
            {round(aprValue)}%
          </Body>
          {diffPercent !== Infinity && (
            <div
              className={classNames(styles.tooltipChange, diffPercent < 0 ? styles.negative : '')}
            >
              <Caption weight="medium">{diffPercent}%</Caption>
              {diffPercent > 0.1 && <ArrowTopRightIcon />}
            </div>
          )}
        </FlexBlock>
        <Caption weight="regular" className={styles.tooltipDate}>
          {aprDate}
        </Caption>
      </div>
    );
  }

  return null;
};

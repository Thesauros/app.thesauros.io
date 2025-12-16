import styles from './apr-chart.module.scss';
import { CustomTooltipProps } from '../types';
import { FlexBlock } from '@/shared/ui/flex-block';
import { round } from '@/shared/number/round';
import { Caption } from '@/shared/ui/new-typography/caption';
import { Body } from '@/shared/ui/new-typography/body';
import formatNumberSmart from '@/shared/number/formatNumberSmart';

export const APRChartTooltip = ({ active, payload }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    const aprMarketValue = payload.find(item => item.dataKey === 'marketValue')?.value ?? 0;
    const aprValue = payload.find(item => item.dataKey === 'dateValue')?.value ?? 0;
    const profitValue = payload.find(item => item.dataKey === 'profitValue')?.value ?? 0;
    const aprDate = payload.find(item => item.dataKey === 'dateValue')?.payload.date ?? '';

    return (
      <div className={styles.revenueTooltip}>
        <FlexBlock alignItems="center" justifyContent="space-between" gap={8}>
          <Caption weight="regular">Av. daily APY</Caption>
          <Body level={1} weight="medium">
            {round(aprValue)}%
          </Body>
        </FlexBlock>
        <FlexBlock alignItems="center" justifyContent="space-between" gap={8}>
          <Caption weight="regular">Market av. APY</Caption>
          <Body level={1} weight="medium">
            {round(aprMarketValue)}%
          </Body>
        </FlexBlock>
        <FlexBlock alignItems="center" justifyContent="space-between" gap={8}>
          <Caption weight="regular">Daily Earnings</Caption>
          <Body level={1} weight="medium">
            {formatNumberSmart(profitValue)}$
          </Body>
        </FlexBlock>
        <Caption weight="regular" className={styles.tooltipDate}>
          {aprDate}
        </Caption>
      </div>
    );
  }

  return null;
};

import styles from './apr-chart.module.scss';
import {
  Area,
  AreaChart,
  Bar,
  CartesianGrid,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { useAPRData, useProfitData } from '../mocks';
import { APRChartTooltip } from './apr-tooltip';
import { Loader } from '@/shared/ui/loader';
import { TVault } from '@/shared/blockchain/core/types';
import { FlexBlock } from '@/shared/ui/flex-block';
import { Caption } from '@/shared/ui/new-typography/caption';
import { Body } from '@/shared/ui/new-typography/body';
import formatNumberSmart from '@/shared/number/formatNumberSmart';
import { useMemo } from 'react';
import { round } from '@/shared/number/round';
import { useDashboardConstants } from '@/shared/constants/dashboard-constants';
import { useCheckResolution } from '@/shared/browser/useCheckResolution';

export const APRChart = ({
  currentVault,
  period,
}: {
  currentVault: TVault;
  period: { title: string; value: number };
}) => {
  const { data, average, isLoading } = useAPRData({
    coinName: currentVault.coinName as 'USDC' | 'USDT',
    period: period.value,
  });

  const {
    data: profitData,
    isLoading: isProfitLoading,
    total,
  } = useProfitData({
    coinName: currentVault.coinName as 'USDC' | 'USDT',
    period: period.value,
  });

  const isWeekPeriod = period.value === 7;

  const { totalPosition } = useDashboardConstants();

  const isDeposited = totalPosition > 0;

  const combinedData = useMemo(() => {
    if (!data || !profitData || !isDeposited) return data || [];

    return data.map(aprItem => {
      const profitItem = profitData.find(p => p.date === aprItem.date);
      return {
        ...aprItem,
        profitValue: profitItem?.dateValue || 0,
      };
    });
  }, [data, profitData, isDeposited]);

  const isMobile = useCheckResolution(576);

  return (
    <div className={styles.container}>
      <FlexBlock alignItems="flex-start" gap={16} className={styles.legendBlock}>
        {isDeposited && (
          <FlexBlock gap={8} alignItems="flex-start">
            <div className={styles.profitLegendCircle} />
            <FlexBlock direction="column" gap={0}>
              <Caption weight="regular" className={styles.secondary}>
                Earned in {period.title}
              </Caption>
              <Body level={2} weight="bold">
                ${round(total)}
              </Body>
            </FlexBlock>
          </FlexBlock>
        )}
        <FlexBlock gap={8} alignItems="flex-start">
          <div className={styles.apyLegendCircle} />
          <FlexBlock direction="column" gap={0}>
            <Caption weight="regular" className={styles.secondary}>
              Av. {period.title} APY
            </Caption>
            <Body level={2} weight="bold">
              {average}%
            </Body>
          </FlexBlock>
        </FlexBlock>
        <FlexBlock gap={8} alignItems="flex-start">
          <div className={styles.marketValueLegendCircle} />
          <FlexBlock direction="column" gap={0}>
            <Caption weight="regular" className={styles.secondary}>
              Market value
            </Caption>
          </FlexBlock>
        </FlexBlock>
      </FlexBlock>
      {isLoading || isProfitLoading ? (
        <Loader />
      ) : (
        <ResponsiveContainer width="100%" height={394}>
          <AreaChart data={combinedData} margin={{ left: 10, right: isMobile ? -40 : 10 }}>
            <defs>
              <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#FFDDAD" stopOpacity={0.6} />
                <stop offset="75%" stopColor="#FF9500" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              vertical={true}
              horizontal={false}
              strokeDasharray={'10 10'}
              stroke="#CFD7DD"
              strokeWidth={0.8}
            />
            <CartesianGrid vertical={false} horizontal={true} stroke="#CFD7DD" strokeWidth={0.8} />
            <XAxis
              dataKey="date"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: '#9D9D9D' }}
              tickMargin={10}
              interval={!isMobile ? (isWeekPeriod ? 1 : 5) : isWeekPeriod ? 5 : 14}
            />
            <YAxis
              yAxisId="left"
              axisLine={false}
              tickLine={false}
              tickCount={7}
              tick={{ fontSize: 12, fill: '#9D9D9D' }}
              tickMargin={20}
              tickFormatter={value => `${value.toFixed(2)}%`}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              axisLine={false}
              tickLine={false}
              tickCount={4}
              tick={{ fontSize: 12, fill: '#9D9D9D' }}
              tickFormatter={value => formatNumberSmart(value as number)}
            />
            <Tooltip content={<APRChartTooltip />} />
            {isDeposited && (
              <Bar
                yAxisId="right"
                dataKey="profitValue"
                fill="#009EFF"
                radius={[4, 4, 0, 0]}
                activeBar={{ fill: '#7cb2fc' }}
                maxBarSize={20}
              />
            )}
            <Area
              yAxisId="left"
              type="monotone"
              dataKey="dateValue"
              stroke="#F57C00"
              strokeWidth={2}
              fill="url(#revenueGradient)"
              activeDot={{ fill: '#F57C00', stroke: '#FFF', strokeWidth: 6, r: 12 }}
            />
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="marketValue"
              stroke="#ffd4a8"
              strokeWidth={2}
              activeDot={false}
              dot={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

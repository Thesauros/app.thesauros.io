import styles from './apr-chart.module.scss';
import {
  Area,
  AreaChart,
  CartesianGrid,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { useAPRData } from '../mocks';
import { APRChartTooltip } from './apr-tooltip';
import { Loader } from '@/shared/ui/loader';
import { TVault } from '@/shared/blockchain/core/types';
import { FlexBlock } from '@/shared/ui/flex-block';
import { Caption } from '@/shared/ui/new-typography/caption';
import { Heading } from '@/shared/ui/new-typography/heading';

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

  const isWeekPeriod = period.value === 7;

  return (
    <div className={styles.container}>
      <FlexBlock alignItems="center" gap={16} className={styles.legendBlock}>
        <FlexBlock gap={8} alignItems="flex-start">
          <div className={styles.apyLegendCircle} />
          <FlexBlock direction="column" gap={0}>
            <Caption weight="regular" className={styles.secondary}>
              Av. {period.title} APY
            </Caption>
            <Heading level={6} weight="medium">
              {average}%
            </Heading>
          </FlexBlock>
        </FlexBlock>
      </FlexBlock>
      {isLoading ? (
        <Loader />
      ) : (
        <ResponsiveContainer width="100%" height={394}>
          <AreaChart data={data} margin={{ left: 10 }}>
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
              interval={isWeekPeriod ? 1 : 5}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tickCount={7}
              tick={{ fontSize: 12, fill: '#9D9D9D' }}
              tickMargin={20}
              tickFormatter={value => `${value.toFixed(2)}%`}
            />
            <Tooltip content={<APRChartTooltip />} />
            <Area
              type="monotone"
              dataKey="dateValue"
              stroke="#F57C00"
              strokeWidth={2}
              fill="url(#revenueGradient)"
              activeDot={{ fill: '#F57C00', stroke: '#FFF', strokeWidth: 6, r: 12 }}
            />
            <Line
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

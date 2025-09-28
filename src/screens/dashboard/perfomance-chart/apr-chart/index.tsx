import { InfoIcon } from '@/shared/ui/icons';
import styles from './apr-chart.module.scss';
import {
  Area,
  AreaChart,
  CartesianGrid,
  Legend,
  LegendPayload,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { useAPRData } from '../mocks';
import { APRChartTooltip } from './apr-tooltip';
import { Card } from '@/shared/ui/card';
import { FlexBlock } from '@/shared/ui/flex-block';
import { Texting } from '@/shared/ui/typography/texting';
import { Loader } from '@/shared/ui/loader';
import { TVault } from '@/shared/blockchain/core/types';

export const APRChart = ({ currentVault }: { currentVault: TVault }) => {
  const { data, isLoading } = useAPRData({ coinName: currentVault.coinName as 'USDC' | 'USDT' });

  return (
    <Card className={styles.container}>
      <FlexBlock alignItems="center" justifyContent="space-between" block>
        <FlexBlock alignItems="center" gap={8}>
          <Texting level={3} weight="regular" className={styles.chartTitle}>
            APR
          </Texting>
          <InfoIcon />
        </FlexBlock>
      </FlexBlock>

      {isLoading ? (
        <Loader />
      ) : (
        <ResponsiveContainer width="100%" height={394}>
          <AreaChart data={data} margin={{ left: 10 }}>
            <Legend
              verticalAlign="top"
              align="left"
              wrapperStyle={{ paddingBottom: 8 }}
              content={({ payload }) => (
                <div
                  style={{
                    display: 'flex',
                    gap: 16,
                    paddingBottom: 16,
                    justifyContent: 'flex-end',
                  }}
                >
                  {payload?.map((entry: LegendPayload) => (
                    <div
                      key={entry.value}
                      style={{
                        display: 'flex',
                        alignItems: 'center',

                        gap: 8,
                      }}
                    >
                      <span
                        style={{
                          display: 'inline-block',
                          width: 10,
                          height: 10,
                          borderRadius: 2,
                          background: entry.color,
                        }}
                      />
                      <span style={{ color: '#9D9D9D', fontSize: 12 }}>
                        {entry.value === 'dateValue'
                          ? `${currentVault.coinName}`
                          : entry.value === 'marketValue'
                            ? 'Market APR'
                            : entry.value}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            />
            <defs>
              <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#196bff" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#196bff" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} stroke="#0B173933" strokeWidth={0.8} />
            <XAxis
              dataKey="date"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: '#9D9D9D' }}
              tickMargin={10}
              interval={1}
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
              stroke="#196BFF"
              strokeWidth={2}
              fill="url(#revenueGradient)"
              activeDot={{ fill: '#1E6EFF', stroke: '#FCFCFFCC', strokeWidth: 3, r: 6 }}
            />
            <Line
              type="monotone"
              dataKey="marketValue"
              stroke="#1E6EFF33"
              strokeWidth={2}
              activeDot={false}
              dot={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      )}
    </Card>
  );
};

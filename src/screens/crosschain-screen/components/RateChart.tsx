import { memo, useMemo } from 'react';
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { Card } from '@/shared/ui/new-card';
import { FlexBlock } from '@/shared/ui/flex-block';
import { Subtitle } from '@/shared/ui/new-typography/subtitle';
import { Body } from '@/shared/ui/new-typography/body';
import { Loader } from '@/shared/ui/loader';
import { formatShortDate } from '@/shared/date';
import { TCrossChainTick } from '@/shared/api/crosschain';
import styles from '../crosschain.module.scss';

export const RateChart = memo(
  ({ ticks, isLoading }: { ticks?: TCrossChainTick[]; isLoading: boolean }) => {
    const data = useMemo(
      () =>
        (ticks ?? [])
          .filter(t => t.status === 1 || t.status === 3)
          .sort((a, b) => a.committed_at - b.committed_at)
          .map(t => ({
            time: t.committed_at * 1000,
            rate:
              Number((BigInt(t.rate_bid) * BigInt(1_000_000)) / BigInt('1000000000000000000')) /
              1e6,
            nav: Number(BigInt(t.nav_bid) / BigInt(10_000)) / 100,
          })),
      [ticks]
    );

    return (
      <Card block>
        <FlexBlock direction="column" gap={12} block>
          <Subtitle level={1} weight="bold">
            Share price history
          </Subtitle>
          {isLoading ? (
            <Loader />
          ) : data.length < 2 ? (
            <Body level={2} className={styles.muted}>
              Not enough NAV ticks yet.
            </Body>
          ) : (
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
                <defs>
                  <linearGradient id="xcRate" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#FFDDAD" />
                    <stop offset="100%" stopColor="#FF9500" stopOpacity={0.05} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="#CFD7DD" vertical={false} />
                <XAxis
                  dataKey="time"
                  type="number"
                  domain={['dataMin', 'dataMax']}
                  tickFormatter={v => formatShortDate(new Date(v).toISOString())}
                  tick={{ fontSize: 12, fill: '#9D9D9D' }}
                />
                <YAxis
                  dataKey="rate"
                  domain={['auto', 'auto']}
                  width={72}
                  tickFormatter={v => Number(v).toFixed(4)}
                  tick={{ fontSize: 12, fill: '#9D9D9D' }}
                />
                <Tooltip
                  labelFormatter={v => new Date(Number(v)).toLocaleString()}
                  formatter={(v, name) =>
                    name === 'rate' ? [Number(v).toFixed(6), 'Share price'] : [v, name]
                  }
                />
                <Area
                  type="monotone"
                  dataKey="rate"
                  stroke="#F57C00"
                  fill="url(#xcRate)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </FlexBlock>
      </Card>
    );
  }
);

RateChart.displayName = 'RateChart';

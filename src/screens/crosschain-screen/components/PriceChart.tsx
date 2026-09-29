import { memo, useMemo, useState } from 'react';
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip as ChartTooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { Card } from '@/shared/ui/new-card';
import { FlexBlock } from '@/shared/ui/flex-block';
import { Subtitle } from '@/shared/ui/new-typography/subtitle';
import { Body } from '@/shared/ui/new-typography/body';
import { Caption } from '@/shared/ui/new-typography/caption';
import { Loader } from '@/shared/ui/loader';
import type { TCrossChainTick } from '@/shared/api/crosschain';
import { RATE_SCALE } from '@/shared/blockchain/crosschain/config';
import { fmtAmount, fmtRate } from '../model/money';
import styles from '../crosschain.module.scss';

type TMode = 'rate' | 'nav';

type TProps = {
  ticks?: TCrossChainTick[];
  isLoading: boolean;
  assetSymbol: string;
  shareSymbol: string;
};

const timeLabel = (ms: number) =>
  new Date(ms).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

export const PriceChart = memo(({ ticks, isLoading, assetSymbol, shareSymbol }: TProps) => {
  const [mode, setMode] = useState<TMode>('rate');

  const { data, heldForReview } = useMemo(() => {
    const all = [...(ticks ?? [])].sort((a, b) => a.committed_at - b.committed_at);
    return {
      data: all
        .filter(t => t.status === 1 || t.status === 3)
        .map(t => ({
          time: t.committed_at * 1000,
          rate: Number((BigInt(t.rate_bid) * BigInt(1_000_000)) / RATE_SCALE) / 1e6,
          nav: Number(BigInt(t.nav_bid)) / 1e6,
        })),
      heldForReview: all.filter(t => t.status === 2).length,
    };
  }, [ticks]);

  const isRate = mode === 'rate';

  return (
    <Card block>
      <FlexBlock direction="column" gap={14} block>
        <FlexBlock justifyContent="space-between" alignItems="center" flexWrap block>
          <FlexBlock direction="column" gap={4}>
            <Subtitle level={1} weight="bold">
              {isRate ? `Price of one ${shareSymbol}` : 'Net value of the fund'}
            </Subtitle>
            <Caption className={styles.muted}>
              {isRate
                ? 'Each point is one published valuation — the price every request in that period is settled at'
                : 'Everything the fund owns, minus what it owes'}
            </Caption>
          </FlexBlock>
          <div className={styles.toggle}>
            <button
              type="button"
              className={`${styles.toggleBtn} ${isRate ? styles.toggleOn : ''}`}
              onClick={() => setMode('rate')}
            >
              Share price
            </button>
            <button
              type="button"
              className={`${styles.toggleBtn} ${!isRate ? styles.toggleOn : ''}`}
              onClick={() => setMode('nav')}
            >
              Net value
            </button>
          </div>
        </FlexBlock>

        {isLoading ? (
          <Loader />
        ) : data.length < 2 ? (
          <FlexBlock direction="column" gap={6} className={styles.chartEmpty}>
            <Body level={2} className={styles.muted}>
              Not enough published valuations to draw a line yet.
            </Body>
            <Caption className={styles.muted}>
              A valuation is published roughly once an hour; the chart starts once there are two.
            </Caption>
          </FlexBlock>
        ) : (
          <>
            <ResponsiveContainer width="100%" height={260}>
              <AreaChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
                <defs>
                  <linearGradient id="xcSeries" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#196bff" stopOpacity={0.22} />
                    <stop offset="100%" stopColor="#196bff" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="rgba(25,107,255,0.10)" vertical={false} />
                <XAxis
                  dataKey="time"
                  type="number"
                  domain={['dataMin', 'dataMax']}
                  tickFormatter={v => timeLabel(Number(v))}
                  tick={{ fontSize: 11, fill: '#64788c' }}
                  minTickGap={48}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  dataKey={mode}
                  domain={['auto', 'auto']}
                  width={isRate ? 88 : 70}
                  tickFormatter={v =>
                    isRate
                      ? // A share price moves in the sixth decimal; four decimals would label
                        // every gridline identically and say nothing.
                        Number(v).toFixed(6)
                      : fmtAmount(String(Math.round(Number(v) * 1e6)))
                  }
                  tick={{ fontSize: 11, fill: '#64788c' }}
                  axisLine={false}
                  tickLine={false}
                />
                <ChartTooltip
                  cursor={{ stroke: 'rgba(25,107,255,0.25)' }}
                  contentStyle={{
                    borderRadius: 12,
                    border: '1px solid rgba(25,107,255,0.15)',
                    background: 'rgba(255,255,255,0.96)',
                    boxShadow: '0 8px 24px -12px rgba(15,20,25,0.25)',
                    fontSize: 12,
                  }}
                  labelFormatter={v => timeLabel(Number(v))}
                  formatter={v => [
                    isRate
                      ? `${fmtRate(String(Math.round(Number(v) * 1e6)))} ${assetSymbol}`
                      : `${fmtAmount(String(Math.round(Number(v) * 1e6)))} ${assetSymbol}`,
                    isRate ? `Price of 1 ${shareSymbol}` : 'Net value',
                  ]}
                />
                <Area
                  type="monotone"
                  dataKey={mode}
                  stroke="#196bff"
                  fill="url(#xcSeries)"
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 3.5, fill: '#196bff', stroke: '#fff', strokeWidth: 1.5 }}
                />
              </AreaChart>
            </ResponsiveContainer>
            <FlexBlock justifyContent="space-between" block>
              <Caption className={styles.muted}>
                {data.length} valuations shown
                {heldForReview > 0
                  ? ` · ${heldForReview} held for review and excluded, because those are not settled prices`
                  : ''}
              </Caption>
              <Caption className={styles.muted}>
                Published on-chain, independently reproducible
              </Caption>
            </FlexBlock>
          </>
        )}
      </FlexBlock>
    </Card>
  );
});

PriceChart.displayName = 'PriceChart';

import { InfoIcon } from '@/shared/ui/icons';
import { ResponsiveContainer, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Bar } from 'recharts';
import { useProfitData } from '../mocks';
import styles from './profit-chart.module.scss';
import { ProfitTooltip } from './profit-tooltip';
import { FlexBlock } from '@/shared/ui/flex-block';
import { Texting } from '@/shared/ui/typography/texting';
import { Card } from '@/shared/ui/card';
import { Loader } from '@/shared/ui/loader';
import { TVault } from '@/shared/blockchain/core/types';

export const ProfitChart = ({ currentVault }: { currentVault: TVault }) => {
  const { data: profitData, isLoading } = useProfitData({
    coinName: currentVault.coinName as 'USDC' | 'USDT',
  });

  return (
    <Card className={styles.container}>
      <FlexBlock alignItems="flex-start" justifyContent="space-between" block>
        <FlexBlock alignItems="center" gap={8}>
          <Texting level={3} className={styles.profitChartTitle}>
            Total profit
          </Texting>
          <InfoIcon />
        </FlexBlock>
        <Texting level={2} className={styles.totalValue}>
          ${profitData ? profitData[profitData?.length - 1].dateValue : '0'}
        </Texting>
      </FlexBlock>

      {isLoading ? (
        <Loader />
      ) : (
        <ResponsiveContainer width="100%" height={394}>
          <BarChart data={profitData} margin={{ left: 0 }}>
            <CartesianGrid vertical={false} stroke="#0B173933" strokeWidth={0.8} />
            <XAxis
              dataKey="date"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: '#9D9D9D' }}
              tickMargin={10}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tickCount={4}
              tick={{ fontSize: 12, fill: '#9D9D9D' }}
              tickMargin={30}
            />
            <Tooltip content={<ProfitTooltip />} cursor={false} />
            <Bar
              dataKey="dateValue"
              fill="#C5DDFE"
              radius={[4, 4, 0, 0]}
              activeBar={{ fill: '#7cb2fc' }}
            />
          </BarChart>
        </ResponsiveContainer>
      )}
    </Card>
  );
};

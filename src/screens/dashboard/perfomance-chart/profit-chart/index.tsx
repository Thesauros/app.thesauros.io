import { InfoIcon } from '@/shared/ui/icons';
import { ResponsiveContainer, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Bar } from 'recharts';
import { profitData } from '../mocks';
import styles from './profit-chart.module.scss';
import { ProfitTooltip } from './profit-tooltip';
import { FlexBlock } from '@/shared/ui/flex-block';
import { Texting } from '@/shared/ui/typography/texting';
import { Card } from '@/shared/ui/card';

export const ProfitChart = () => {
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
          $144.6K
        </Texting>
      </FlexBlock>
      <ResponsiveContainer width="100%" height={147}>
        <BarChart data={profitData} margin={{ left: 0 }}>
          <CartesianGrid vertical={false} stroke="#0B173933" strokeWidth={0.8} />
          <XAxis
            dataKey="time"
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
            dataKey="profit"
            fill="#C5DDFE"
            radius={[4, 4, 0, 0]}
            activeBar={{ fill: '#7cb2fc' }}
          />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
};

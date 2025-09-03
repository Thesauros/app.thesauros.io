import { InfoIcon } from '@/shared/ui/icons';
import styles from './revenue-chart.module.scss';
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
import { revenueData } from '../mocks';
import { RevenueTooltip } from './revenue-tooltip';
import { Card } from '@/shared/ui/card';
import { FlexBlock } from '@/shared/ui/flex-block';
import { Texting } from '@/shared/ui/typography/texting';
import { CalendarIcon } from '@/shared/ui/icons/calendar';

export const RevenueChart = () => {
  return (
    <Card className={styles.container}>
      <FlexBlock alignItems="center" justifyContent="space-between" block>
        <FlexBlock alignItems="center" gap={8}>
          <Texting level={3} weight="regular" className={styles.chartTitle}>
            Revenue & Engagement
          </Texting>
          <InfoIcon />
        </FlexBlock>
        <Card className={styles.dateRange}>
          <CalendarIcon />
          <select
            id="revenue-chart-date"
            className={styles.dateDropdown}
            defaultValue="Jan 2025 - Dec 2025"
          >
            <option>Jan 2025 - Dec 2025</option>
            <option>Jan 2024 - Dec 2024</option>
          </select>
        </Card>
      </FlexBlock>
      <ResponsiveContainer width="100%" height={394}>
        <AreaChart data={revenueData} margin={{ left: 0 }}>
          <defs>
            <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#196bff" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#196bff" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid vertical={false} stroke="#0B173933" strokeWidth={0.8} />
          <XAxis
            dataKey="month"
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12, fill: '#9D9D9D' }}
            tickMargin={10}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tickCount={7}
            tick={{ fontSize: 12, fill: '#9D9D9D' }}
            tickMargin={25}
            tickFormatter={value => `${value}K`}
          />
          <Tooltip content={<RevenueTooltip />} />
          <Area
            type="monotone"
            dataKey="revenue"
            stroke="#196BFF"
            strokeWidth={1}
            fill="url(#revenueGradient)"
            activeDot={{ fill: '#1E6EFF', stroke: '#FCFCFFCC', strokeWidth: 3, r: 6 }}
          />
          <Line
            type="monotone"
            dataKey="engagement"
            stroke="#1E6EFF33"
            strokeWidth={1}
            activeDot={false}
            dot={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </Card>
  );
};

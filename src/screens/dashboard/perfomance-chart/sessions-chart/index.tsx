import { Card } from '@/shared/ui/card';
import styles from './sessions-chart.module.scss';
import { InfoIcon } from '@/shared/ui/icons';
import {
  ResponsiveContainer,
  LineChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Line,
} from 'recharts';
import { sessionsData } from '../mocks';
import { SessionsTooltip } from './session-tooltip';
import { FlexBlock } from '@/shared/ui/flex-block';
import { Texting } from '@/shared/ui/typography/texting';

export const SessionsChart = () => {
  return (
    <Card className={styles.container}>
      <FlexBlock alignItems="flex-start" justifyContent="space-between" block>
        <FlexBlock alignItems="center" gap={8}>
          <Texting level={3} className={styles.sessionsChartTitle}>
            Total sessions
          </Texting>
          <InfoIcon />
        </FlexBlock>
        <Texting level={2} className={styles.totalValue}>
          $144.6K
        </Texting>
      </FlexBlock>

      <ResponsiveContainer width="100%" height={122}>
        <LineChart data={sessionsData} margin={{ left: 0 }}>
          <CartesianGrid strokeDasharray="1 3" stroke="#0B173933" />
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
            tick={{ fontSize: 12, fill: '#9D9D9D' }}
            tickMargin={30}
            tickCount={4}
          />
          <Tooltip content={<SessionsTooltip />} />
          <Line
            type="monotone"
            dataKey="sessions"
            stroke="#196bff"
            strokeWidth={1}
            dot={false}
            activeDot={{ fill: '#1E6EFF', stroke: '#FCFCFFCC', strokeWidth: 3, r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </Card>
  );
};

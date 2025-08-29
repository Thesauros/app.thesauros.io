import React, { useState } from 'react';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { InfoIcon } from '@/shared/ui/icons';
import styles from './perfomance-chart.module.scss';
import { Heading } from '@/shared/ui/typography/heading';
import { revenueData, profitData, sessionsData } from './mocks';
import { FlexBlock } from '@/shared/ui/flex-block';

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    value: number;
    dataKey: string;
    payload: {
      revenue?: number;
      engagement?: number;
      profit?: number;
      sessions?: number;
    };
  }>;
  label?: string;
}

const RevenueTooltip = ({ active, payload }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    const revenueValue = payload[0]?.value;
    const _engagementValue = payload[1]?.value; // Префикс _ для неиспользуемой переменной

    return (
      <div className={styles.customTooltip}>
        <div className={styles.tooltipTitle}>Revenue & Engagement</div>
        <div className={styles.tooltipValue}>${revenueValue}k</div>
        <div className={styles.tooltipChange}>
          <span>↗</span>
          <span>12.5%</span>
        </div>
        <div className={styles.tooltipDate}>June 21, 2025</div>
      </div>
    );
  }
  return null;
};

const ProfitTooltip = ({ active, payload, label }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    const value = payload[0]?.value;

    return (
      <div className={styles.customTooltip}>
        <div className={styles.tooltipTitle}>Total Profit</div>
        <div className={styles.tooltipValue}>${value}</div>
        <div className={styles.tooltipDate}>{label}</div>
      </div>
    );
  }
  return null;
};

const SessionsTooltip = ({ active, payload, label }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    const value = payload[0]?.value;

    return (
      <div className={styles.customTooltip}>
        <div className={styles.tooltipTitle}>Total Sessions</div>
        <div className={styles.tooltipValue}>{value}</div>
        <div className={styles.tooltipDate}>{label}</div>
      </div>
    );
  }
  return null;
};

export const PerfomanceChart = () => {
  const [timeRange, setTimeRange] = useState('30d');

  return (
    <FlexBlock direction="column" gap={20}>
      <FlexBlock alignItems="center" justifyContent="space-between" block>
        <Heading level={4}>Performance Chart</Heading>
        <div className={styles.timeRangeSelector}>
          {['7D', '30d', '6m', '1y'].map(range => (
            <button
              key={range}
              className={`${styles.timeRangeButton} ${timeRange === range ? styles.active : ''}`}
              onClick={() => setTimeRange(range)}
            >
              {range}
            </button>
          ))}
        </div>
      </FlexBlock>
      <div className={styles.container}>
        <div className={styles.leftPanel}>
          <div className={styles.panelHeader}>
            <div className={styles.panelTitle}>
              Revenue & Engagement Trends
              <InfoIcon className={styles.infoIcon} />
            </div>
            <div className={styles.dateRange}>
              <span>Date Range:</span>
              <select className={styles.dateDropdown} defaultValue="Jan 2025 - Dec 2025">
                <option>Jan 2025 - Dec 2025</option>
                <option>Jan 2024 - Dec 2024</option>
              </select>
            </div>
          </div>

          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={revenueData}>
              <defs>
                <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#196bff" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#196bff" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis
                dataKey="month"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: '#666' }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: '#666' }}
                tickFormatter={value => `${value}K`}
              />
              <Tooltip content={<RevenueTooltip />} />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="#196bff"
                strokeWidth={2}
                fill="url(#revenueGradient)"
              />
              <Line
                type="monotone"
                dataKey="engagement"
                stroke="#4a90e2"
                strokeWidth={2}
                dot={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className={styles.rightTopPanel}>
          <div className={styles.panelHeader}>
            <div className={styles.panelTitle}>
              Total profit
              <InfoIcon className={styles.infoIcon} />
            </div>
          </div>

          <div className={styles.totalValue}>$144.6K</div>

          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={profitData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis
                dataKey="time"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: '#666' }}
              />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#666' }} />
              <Tooltip content={<ProfitTooltip />} />
              <Bar dataKey="profit" fill="#196bff" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className={styles.rightBottomPanel}>
          <div className={styles.panelHeader}>
            <div className={styles.panelTitle}>
              Total sessions
              <InfoIcon className={styles.infoIcon} />
            </div>
          </div>

          <div className={styles.totalValue}>$144.6K</div>

          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={sessionsData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis
                dataKey="time"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: '#666' }}
              />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#666' }} />
              <Tooltip content={<SessionsTooltip />} />
              <Line
                type="monotone"
                dataKey="sessions"
                stroke="#196bff"
                strokeWidth={3}
                dot={{ fill: '#196bff', strokeWidth: 2, r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </FlexBlock>
  );
};

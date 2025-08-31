import React, { useState } from 'react';
import styles from './perfomance-chart.module.scss';
import { Heading } from '@/shared/ui/typography/heading';
import { FlexBlock } from '@/shared/ui/flex-block';
import { PeriodSelector } from './period-selector';
import { RevenueChart } from './revenue-chart/ index';
import { ProfitChart } from './profit-chart';
import { SessionsChart } from './sessions-chart';

export const PerfomanceChart = () => {
  const [timeRange, setTimeRange] = useState('30D');

  return (
    <FlexBlock direction="column" gap={20} block>
      <FlexBlock alignItems="center" justifyContent="space-between" block>
        <Heading level={4}>Performance Chart</Heading>
        <PeriodSelector activePeriod={timeRange} onPeriodSelect={setTimeRange} />
      </FlexBlock>
      <div className={styles.container}>
        <RevenueChart />
        <ProfitChart />
        <SessionsChart />
      </div>
    </FlexBlock>
  );
};

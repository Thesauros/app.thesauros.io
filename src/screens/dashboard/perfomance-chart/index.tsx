import React, { useState } from 'react';
import styles from './perfomance-chart.module.scss';
import { Heading } from '@/shared/ui/typography/heading';
import { FlexBlock } from '@/shared/ui/flex-block';

import { ProfitChart } from './profit-chart';
import { APRChart } from './apr-chart';
import { VaultSelector } from './vault-selector';
import { vaults } from '@/shared/blockchain/config';
import { PeriodSelector } from './period-selector';

const periods = [
  { title: '7D', value: 7 },
  { title: '30D', value: 30 },
];

export const PerfomanceChart = () => {
  const [currentVault, setCurrentVault] = useState(vaults[0]);
  const [timePeriod, setTimePeriod] = useState(periods[0]);

  return (
    <FlexBlock direction="column" gap={20} block>
      <FlexBlock
        alignItems="center"
        justifyContent="space-between"
        block
        className={styles.headContainer}
      >
        <Heading level={4}>Performance Chart</Heading>
        <FlexBlock alignItems="center" gap={24}>
          <PeriodSelector
            activePeriod={timePeriod}
            onPeriodSelect={setTimePeriod}
            periods={periods}
          />
          <VaultSelector activeVault={currentVault} onVaultSelect={setCurrentVault} />
        </FlexBlock>
      </FlexBlock>
      <div className={styles.container}>
        <APRChart currentVault={currentVault} period={timePeriod} />
        <ProfitChart currentVault={currentVault} period={timePeriod} />
      </div>
    </FlexBlock>
  );
};

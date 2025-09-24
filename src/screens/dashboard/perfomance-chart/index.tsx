import React, { useState } from 'react';
import styles from './perfomance-chart.module.scss';
import { Heading } from '@/shared/ui/typography/heading';
import { FlexBlock } from '@/shared/ui/flex-block';

import { ProfitChart } from './profit-chart';
import { APRChart } from './apr-chart';
import { VaultSelector } from './vault-selector';
import { vaults } from '@/shared/blockchain/config';

export const PerfomanceChart = () => {
  const [currentVault, setCurrentVault] = useState(vaults[0]);

  return (
    <FlexBlock direction="column" gap={20} block>
      <FlexBlock
        alignItems="center"
        justifyContent="space-between"
        block
        className={styles.headContainer}
      >
        <Heading level={4}>Performance Chart</Heading>
        <VaultSelector activeVault={currentVault} onVaultSelect={setCurrentVault} />
        {/* <PeriodSelector activePeriod={timeRange} onPeriodSelect={setTimeRange} /> */}
      </FlexBlock>
      <div className={styles.container}>
        <APRChart currentVault={currentVault} />
        <ProfitChart currentVault={currentVault} />
      </div>
    </FlexBlock>
  );
};

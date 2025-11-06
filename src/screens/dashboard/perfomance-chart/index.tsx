import React, { useState } from 'react';
import styles from './perfomance-chart.module.scss';
import { FlexBlock } from '@/shared/ui/flex-block';
import { APRChart } from './apr-chart';
import { vaults } from '@/shared/blockchain/config';
import { Card } from '@/shared/ui/new-card';
import { SwitchToggle } from '@/shared/ui/switch-toggle';
import { Subtitle } from '@/shared/ui/new-typography/subtitle';

const periods = [
  { title: '7D', value: 7 },
  { title: '30D', value: 30 },
];

export const PerfomanceChart = () => {
  const [timePeriod, setTimePeriod] = useState(periods[0]);

  return (
    <Card block>
      <FlexBlock direction="column" gap={20}>
        <FlexBlock justifyContent="space-between" alignItems="center">
          <Subtitle level={2} weight="regular">
            Thesauros Performance APY, %
          </Subtitle>
          <SwitchToggle active={timePeriod} onSelect={setTimePeriod} values={periods} />
        </FlexBlock>
        <FlexBlock direction="column" gap={20} block>
          <div className={styles.container}>
            <APRChart currentVault={vaults[0]} period={timePeriod} />
          </div>
        </FlexBlock>
      </FlexBlock>
    </Card>
  );
};

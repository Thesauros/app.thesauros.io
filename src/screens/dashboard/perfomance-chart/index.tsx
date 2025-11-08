import React, { useState } from 'react';
import styles from './perfomance-chart.module.scss';
import { FlexBlock } from '@/shared/ui/flex-block';
import { APRChart } from './apr-chart';
import { vaults } from '@/shared/blockchain/config';
import { Card } from '@/shared/ui/new-card';
import { SwitchToggle } from '@/shared/ui/switch-toggle';
import { Subtitle } from '@/shared/ui/new-typography/subtitle';
import { Tooltip } from '@/shared/ui/tooltip/tooltip';
import { useAccount } from '@/shared/blockchain';
import { useCheckResolution } from '@/shared/browser/useCheckResolution';

const periods = [
  { title: '7D', value: 7 },
  { title: '30D', value: 30 },
];

export const PerfomanceChart = () => {
  const [timePeriod, setTimePeriod] = useState(periods[0]);
  const { isConnected } = useAccount();
  const isMobile = useCheckResolution(576);

  return (
    <Card block>
      <FlexBlock direction="column" gap={20}>
        <FlexBlock
          justifyContent="space-between"
          alignItems={isMobile ? 'flex-start' : 'center'}
          direction={isMobile ? 'column' : 'row'}
        >
          <Tooltip
            withIcon
            tooltipText={
              isConnected
                ? 'Here you can see how your deposit grows over time and what average return the strategy is generating for you. The chart shows both your earned amount for the selected period and the average APY the strategy maintained during that time.'
                : 'Shows the current average yield the strategy generates from connected DeFi protocols. The percentage can move up or down depending on market conditions.'
            }
          >
            <Subtitle level={2} weight="regular">
              Thesauros Performance APY, %
            </Subtitle>
          </Tooltip>

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

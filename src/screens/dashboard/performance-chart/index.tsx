import React, { useState } from 'react';
import styles from './performance-chart.module.scss';
import { FlexBlock } from '@/shared/ui/flex-block';
import { APRChart } from './apr-chart';
import { vaults, DEFAULT_VAULT_INDEX } from '@/shared/blockchain/config';
import { Card } from '@/shared/ui/new-card';
import { SwitchToggle } from '@/shared/ui/switch-toggle';
import { Subtitle } from '@/shared/ui/new-typography/subtitle';
import { Tooltip } from '@/shared/ui/tooltip/tooltip';
import { useAccount, useViewChain } from '@/shared/blockchain';
import { useCheckResolution } from '@/shared/browser/useCheckResolution';
import { InfoIcon } from '@/shared/ui/icons';

const periods = [
  { title: '7D', value: 7 },
  { title: '30D', value: 30 },
];

export const PerformanceChart = () => {
  const [timePeriod, setTimePeriod] = useState(periods[0]);
  const { isConnected } = useAccount();
  const { viewChainId } = useViewChain();
  const isMobile = useCheckResolution(576);
  const chosenVault =
    vaults.find(vault => vault.chainID === viewChainId) ?? vaults[DEFAULT_VAULT_INDEX];

  return (
    <Card block dataTestId="dashboard-block-performance">
      <FlexBlock direction="column" gap={20}>
        <FlexBlock
          justifyContent="space-between"
          alignItems={isMobile ? 'flex-start' : 'center'}
          direction={isMobile ? 'column' : 'row'}
          gap={isMobile ? 16 : 8}
        >
          <FlexBlock
            alignItems="center"
            gap={8}
            justifyContent={isMobile ? 'space-between' : 'start'}
            block={isMobile}
          >
            <Subtitle level={2} weight="regular">
              Thesauros Performance APY, %
            </Subtitle>
            <Tooltip
              tooltipText={
                isConnected
                  ? 'Here you can see how your deposit grows over time and what average return the strategy is generating for you. The chart shows both your earned amount for the selected period and the average APY the strategy maintained during that time.'
                  : 'Shows the current average yield the strategy generates from connected DeFi protocols. The percentage can move up or down depending on market conditions.'
              }
            >
              <InfoIcon />
            </Tooltip>
          </FlexBlock>

          <SwitchToggle active={timePeriod} onSelect={setTimePeriod} values={periods} />
        </FlexBlock>
        <FlexBlock direction="column" gap={20} block>
          <div className={styles.container}>
            <APRChart currentVault={chosenVault} period={timePeriod} />
          </div>
        </FlexBlock>
      </FlexBlock>
    </Card>
  );
};

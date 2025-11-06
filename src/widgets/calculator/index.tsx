import { FlexBlock } from '@/shared/ui/flex-block';
import { Card } from '@/shared/ui/new-card';
import { Body } from '@/shared/ui/new-typography/body';
import { Caption } from '@/shared/ui/new-typography/caption';
import { Tooltip } from '@/shared/ui/tooltip/tooltip';
import styles from './calculator.module.scss';
import { Subtitle } from '@/shared/ui/new-typography/subtitle';
import { Slider } from '@/shared/ui/slider';
import { useState } from 'react';
import { Heading } from '@/shared/ui/new-typography/heading';
import { NewInfoIcon } from '@/shared/ui/icons/new-info';
import { PointCoinIcon } from '@/shared/ui/icons/point-icon';
import { SwitchToggle } from '@/shared/ui/switch-toggle';
import { round } from '@/shared/number/round';

type TPeriod = '6m' | '1y' | '3y' | '6y';

const periods = [
  { title: '6m', value: 0.5 },
  { title: '1y', value: 1 },
  { title: '3y', value: 3 },
  { title: '6y', value: 6 },
];

const PERIOD_TITLE_MAP_TO_TEXT: Record<TPeriod, string> = {
  '6m': '6 month',
  '1y': '1 year',
  '3y': '3 years',
  '6y': '6 years',
};

export const Calculator = ({ apy }: { apy: number }) => {
  const [depositValue, setDepositValue] = useState(500000);
  const [timePeriod, setTimePeriod] = useState(periods[0]);

  const pointsValue = depositValue * timePeriod.value * 365;

  const potenitalReturns = round(timePeriod.value * apy * (depositValue / 100) + depositValue);

  return (
    <Card block>
      <FlexBlock direction="column" gap={16} block>
        <FlexBlock justifyContent="space-between" alignItems="center" block>
          <Tooltip tooltipText="" withIcon>
            <Body level={2} weight="regular">
              Potential earnings
            </Body>
          </Tooltip>
          <FlexBlock alignItems="center" gap={16}>
            <Body weight="medium">Withdraw anytime — no lock period 😎</Body>
            <SwitchToggle active={timePeriod} values={periods} onSelect={setTimePeriod} />
          </FlexBlock>
        </FlexBlock>
        <div className={styles.earningsBlock}>
          <Card variant="secondary" className={styles.depositBlock}>
            <FlexBlock direction="column" gap={24}>
              <FlexBlock alignItems="center" justifyContent="space-between">
                <Body level={2} weight="medium" className={styles.description}>
                  My deposit
                </Body>
                <Tooltip tooltipText="" withIcon>
                  <Caption weight="regular">Current APY {round(apy)}%</Caption>
                </Tooltip>
              </FlexBlock>
              <FlexBlock direction="column" gap={12} block>
                <FlexBlock alignItems="center" justifyContent="space-between" block>
                  <Subtitle weight="bold">Amount</Subtitle>
                  <Subtitle weight="bold">${depositValue}</Subtitle>
                </FlexBlock>
                <Slider
                  min={1000}
                  max={1000000}
                  value={depositValue}
                  onChange={value => setDepositValue(value)}
                />
              </FlexBlock>
            </FlexBlock>
          </Card>
          <Card variant="secondary" className={styles.returnsBlock}>
            <FlexBlock direction="column" gap={24}>
              <FlexBlock direction="column" gap={12}>
                <Body level={2} className={styles.description}>
                  Potential return in{' '}
                  <span className={styles.highlight}>
                    {PERIOD_TITLE_MAP_TO_TEXT[timePeriod.title as TPeriod]}
                  </span>
                </Body>
                <Heading level={5}>${potenitalReturns}</Heading>
              </FlexBlock>
              <Tooltip tooltipText="" withIcon>
                <Caption>Total cumulative profit 60%</Caption>
              </Tooltip>
            </FlexBlock>
          </Card>
          <Card variant="secondary" className={styles.pointsBlock}>
            <FlexBlock direction="column" gap={16} block className={styles.fullHeignt}>
              <FlexBlock justifyContent="space-between" alignItems="center" block>
                <Caption className={styles.description}>Projected points</Caption>
                <Tooltip tooltipText="">
                  <NewInfoIcon />
                </Tooltip>
              </FlexBlock>
              <div className={styles.pointsInfo}>
                <PointCoinIcon />
                <Heading level={5} weight="bold">
                  {pointsValue}
                </Heading>
              </div>
            </FlexBlock>
          </Card>
        </div>
      </FlexBlock>
    </Card>
  );
};

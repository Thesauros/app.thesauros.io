import { FlexBlock } from '@/shared/ui/flex-block';
import { Card } from '@/shared/ui/new-card';
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
import { InputComponent } from '@/shared/ui/input';
import { formatNumberWithCommas } from '@/shared/number/formatNumberWithCommas';

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
  const [depositValue, setDepositValue] = useState('10000');
  const [timePeriod, setTimePeriod] = useState(periods[0]);

  const pointsValue = Number(depositValue) * timePeriod.value * 365;

  const potenitalReturns = round(
    timePeriod.value * apy * (Number(depositValue) / 100) + Number(depositValue)
  );

  return (
    <Card block>
      <FlexBlock direction="column" gap={16} block>
        <FlexBlock justifyContent="space-between" alignItems="center" block>
          <Tooltip
            tooltipText="Shows how much your balance could grow, including your deposit and potential income for the selected period. The amount is based on the current APY and can change as the rate updates."
            withIcon
          >
            <Subtitle level={2} weight="regular">
              Potential earnings
            </Subtitle>
          </Tooltip>
          <SwitchToggle active={timePeriod} values={periods} onSelect={setTimePeriod} />
        </FlexBlock>
        <div className={styles.earningsBlock}>
          <Card variant="secondary" className={styles.depositBlock}>
            <FlexBlock direction="column" gap={24}>
              <FlexBlock alignItems="center" justifyContent="space-between">
                <Subtitle level={2} weight="regular" className={styles.description}>
                  My deposit
                </Subtitle>
                <Tooltip
                  tooltipText="Annual Percentage Yield shows how much your money could earn in one year if profits are reinvested. In DeFi the rate changes over time depending on market activity."
                  withIcon
                >
                  <Caption weight="regular">Current APY {round(apy)}%</Caption>
                </Tooltip>
              </FlexBlock>
              <FlexBlock direction="column" gap={12} block>
                <FlexBlock alignItems="center" justifyContent="space-between" block>
                  <Subtitle level={2} weight="bold">
                    Amount
                  </Subtitle>
                  <InputComponent
                    id="deposit-value"
                    variant="primary"
                    value={depositValue}
                    minValue={1000}
                    maxValue={1000000}
                    textAlign="right"
                    prefix="$"
                    type="number"
                    onChange={setDepositValue}
                  />
                </FlexBlock>
                <Slider
                  min={1000}
                  max={1000000}
                  value={Number(depositValue)}
                  onChange={value => setDepositValue(String(value))}
                />
              </FlexBlock>
            </FlexBlock>
          </Card>
          <Card variant="secondary" className={styles.returnsBlock}>
            <FlexBlock direction="column" gap={24}>
              <FlexBlock direction="column" gap={12}>
                <Subtitle level={2} weight="regular" className={styles.description}>
                  Potential return in{' '}
                  <span className={styles.highlight}>
                    {PERIOD_TITLE_MAP_TO_TEXT[timePeriod.title as TPeriod]}
                  </span>
                </Subtitle>
                <Heading level={5} weight="bold">
                  ${formatNumberWithCommas(potenitalReturns)}
                </Heading>
              </FlexBlock>
              <Tooltip
                tooltipText="Displays your projected total profit if you keep funds for the full selected period. Earnings are added back to your deposit, so your balance can grow faster over time."
                withIcon
              >
                <Caption weight="regular" className={styles.secondary}>
                  Total cumulative profit <span className={styles.highlight}>60%</span>
                </Caption>
              </Tooltip>
            </FlexBlock>
          </Card>
          <Card variant="secondary" className={styles.pointsBlock}>
            <FlexBlock direction="column" gap={16} block className={styles.fullHeignt}>
              <FlexBlock justifyContent="space-between" alignItems="center" block>
                <Subtitle level={2} weight="regular" className={styles.description}>
                  Projected points
                </Subtitle>
                <Tooltip
                  tooltipText="You receive 1 point for every $1 you hold each day.
 For example, holding 1,000 USDC for one year gives you about 365,000 points."
                >
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

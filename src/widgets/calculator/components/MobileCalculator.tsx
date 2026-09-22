import { memo } from 'react';
import { FlexBlock } from '@/shared/ui/flex-block';
import { Caption } from '@/shared/ui/new-typography/caption';
import { Body } from '@/shared/ui/new-typography/body';
import { Tooltip } from '@/shared/ui/tooltip/tooltip';
import { NewInfoIcon } from '@/shared/ui/icons/new-info';
import { PointCoinIcon } from '@/shared/ui/icons/point-icon';
import { Slider } from '@/shared/ui/slider';
import { formatNumberWithCommas } from '@/shared/number/formatNumberWithCommas';
import { formatPercent } from '@/shared/number/formatPercent';
import styles from '../calculator.module.scss';

type MobileCalculatorProps = {
  apy: number;
  depositValue: string;
  potentialReturns: number;
  pointsValue: number;
  onDepositChange: (value: string) => void;
};

const SLIDER_MIN = 1000;
const SLIDER_MAX = 1000000;

const APY_TOOLTIP_TEXT =
  'Annual Percentage Yield shows how much your money could earn in one year if profits are reinvested. In DeFi the rate changes over time depending on market activity.';

const POINTS_TOOLTIP_TEXT = `You receive 1 point for every $1 you hold each day.
For example, holding 1,000 USDC for one year gives you about 365,000 points.`;

export const MobileCalculator = memo(function MobileCalculator({
  apy,
  depositValue,
  potentialReturns,
  pointsValue,
  onDepositChange,
}: MobileCalculatorProps) {
  return (
    <FlexBlock direction="column" gap={16} block>
      <FlexBlock alignItems="center" justifyContent="space-between">
        <FlexBlock alignItems="center" gap={4}>
          <Caption weight="regular" className={styles.secondary}>
            Current APY
          </Caption>
          <Tooltip tooltipText={APY_TOOLTIP_TEXT}>
            <NewInfoIcon />
          </Tooltip>
        </FlexBlock>
        <Body level={2} weight="bold">
          {formatPercent(apy)}%
        </Body>
      </FlexBlock>

      <FlexBlock alignItems="center" justifyContent="space-between">
        <FlexBlock alignItems="center" gap={4}>
          <Caption weight="regular" className={styles.secondary}>
            My deposit
          </Caption>
        </FlexBlock>
        <Body level={2} weight="bold">
          ${formatNumberWithCommas(Number(depositValue))}
        </Body>
      </FlexBlock>

      <Slider
        min={SLIDER_MIN}
        max={SLIDER_MAX}
        value={Number(depositValue)}
        onChange={value => onDepositChange(String(value))}
      />

      <FlexBlock alignItems="center" justifyContent="space-between">
        <FlexBlock alignItems="center" gap={4}>
          <Caption weight="regular" className={styles.secondary}>
            Potential return
          </Caption>
        </FlexBlock>
        <Body level={2} weight="bold">
          ${formatNumberWithCommas(potentialReturns)}
        </Body>
      </FlexBlock>

      <FlexBlock alignItems="center" justifyContent="space-between">
        <FlexBlock alignItems="center" gap={4}>
          <Caption weight="regular" className={styles.secondary}>
            Projected points
          </Caption>
          <Tooltip tooltipText={POINTS_TOOLTIP_TEXT}>
            <NewInfoIcon />
          </Tooltip>
        </FlexBlock>
        <FlexBlock alignItems="center" gap={4}>
          <PointCoinIcon size={20} />
          <Body level={2} weight="bold">
            {formatNumberWithCommas(pointsValue)}
          </Body>
        </FlexBlock>
      </FlexBlock>
    </FlexBlock>
  );
});

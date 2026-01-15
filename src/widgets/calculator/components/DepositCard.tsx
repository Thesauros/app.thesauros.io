import { memo } from 'react';
import { FlexBlock } from '@/shared/ui/flex-block';
import { Card } from '@/shared/ui/new-card';
import { Subtitle } from '@/shared/ui/new-typography/subtitle';
import { Caption } from '@/shared/ui/new-typography/caption';
import { Tooltip } from '@/shared/ui/tooltip/tooltip';
import { InputComponent } from '@/shared/ui/input';
import { Slider } from '@/shared/ui/slider';
import { round } from '@/shared/number/round';
import styles from '../calculator.module.scss';

type DepositCardProps = {
  depositValue: string;
  apy: number;
  onDepositChange: (value: string) => void;
};

const SLIDER_MIN = 0;
const SLIDER_MAX = 1000000;

export const DepositCard = memo(function DepositCard({
  depositValue,
  apy,
  onDepositChange,
}: DepositCardProps) {
  const handleDepositChange = (value: string) => {
    onDepositChange(value === '' ? String(SLIDER_MIN) : value);
  };

  return (
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
            <Caption weight="regular" className={styles.secondary}>
              24h average APY <span className={styles.highlight}>{round(apy)}%</span>
            </Caption>
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
              minValue={SLIDER_MIN}
              maxValue={SLIDER_MAX}
              textAlign="right"
              numberPrefix="$"
              type="number"
              onChange={handleDepositChange}
            />
          </FlexBlock>
          <Slider
            min={SLIDER_MIN}
            max={SLIDER_MAX}
            value={Number(depositValue)}
            onChange={value => onDepositChange(String(value))}
          />
        </FlexBlock>
      </FlexBlock>
    </Card>
  );
});

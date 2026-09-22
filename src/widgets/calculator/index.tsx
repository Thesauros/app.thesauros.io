import { useMemo, useState, useCallback } from 'react';
import { FlexBlock } from '@/shared/ui/flex-block';
import { Card } from '@/shared/ui/new-card';
import { Caption } from '@/shared/ui/new-typography/caption';
import { Subtitle } from '@/shared/ui/new-typography/subtitle';
import { Tooltip } from '@/shared/ui/tooltip/tooltip';
import { SwitchToggle } from '@/shared/ui/switch-toggle';
import { round } from '@/shared/number/round';
import { useCheckResolution } from '@/shared/browser/useCheckResolution';
import { InfoIcon } from '@/shared/ui/icons';
import { DepositCard, ReturnsCard, PointsCard, MobileCalculator } from './components';
import styles from './calculator.module.scss';

type TPeriod = {
  title: string;
  value: number;
};

const PERIODS: TPeriod[] = [
  { title: '6m', value: 0.5 },
  { title: '1y', value: 1 },
  { title: '3y', value: 3 },
  { title: '6y', value: 6 },
];

const PERIOD_TITLE_MAP_TO_TEXT: Record<string, string> = {
  '6m': '6 month',
  '1y': '1 year',
  '3y': '3 years',
  '6y': '6 years',
};

const DAYS_IN_YEAR = 365;
const DEFAULT_DEPOSIT = '10000';

type CalculatorProps = {
  apy: number;
};

export const Calculator = ({ apy }: CalculatorProps) => {
  const [depositValue, setDepositValue] = useState(DEFAULT_DEPOSIT);
  const [timePeriod, setTimePeriod] = useState<TPeriod>(PERIODS[1]);
  const isMobile = useCheckResolution(576);

  const handleDepositChange = useCallback((value: string) => {
    setDepositValue(value);
  }, []);

  const handlePeriodChange = useCallback((period: TPeriod) => {
    setTimePeriod(period);
  }, []);

  // Memoized calculations to prevent unnecessary recalculations
  const calculations = useMemo(() => {
    const depositNum = Number(depositValue);
    const periodYears = timePeriod.value;

    return {
      pointsValue: depositNum * 2 * periodYears * DAYS_IN_YEAR,
      potentialReturns: round(periodYears * apy * (depositNum / 100) + depositNum),
      cumulativeProfit: periodYears * apy,
      periodText: PERIOD_TITLE_MAP_TO_TEXT[timePeriod.title],
    };
  }, [depositValue, timePeriod.value, timePeriod.title, apy]);

  return (
    <Card block dataTestId="dashboard-block-potential-earnings">
      <FlexBlock direction="column" gap={16} block>
        {/* Header with period toggle */}
        <FlexBlock
          justifyContent={isMobile ? 'center' : 'space-between'}
          alignItems="center"
          direction={isMobile ? 'column' : 'row'}
          gap={isMobile ? 16 : 8}
          block
        >
          <FlexBlock
            alignItems="center"
            gap={8}
            justifyContent={isMobile ? 'space-between' : 'start'}
            block={isMobile}
          >
            {isMobile ? (
              <Caption weight="regular">Potential earnings</Caption>
            ) : (
              <Subtitle level={1} weight="regular">
                Potential earnings
              </Subtitle>
            )}
            <Tooltip tooltipText="Shows how much your balance could grow, including your deposit and potential income for the selected period. The amount is based on the current APY and can change as the rate updates.">
              <InfoIcon />
            </Tooltip>
          </FlexBlock>
          <SwitchToggle active={timePeriod} values={PERIODS} onSelect={handlePeriodChange} />
        </FlexBlock>

        {/* Cards Grid */}
        <div className={styles.earningsBlock}>
          {isMobile ? (
            <MobileCalculator
              apy={apy}
              depositValue={depositValue}
              potentialReturns={calculations.potentialReturns}
              pointsValue={calculations.pointsValue}
              onDepositChange={handleDepositChange}
            />
          ) : (
            <>
              <DepositCard
                depositValue={depositValue}
                apy={apy}
                onDepositChange={handleDepositChange}
              />
              <ReturnsCard
                periodText={calculations.periodText}
                potentialReturns={calculations.potentialReturns}
                cumulativeProfit={calculations.cumulativeProfit}
              />
              <PointsCard pointsValue={calculations.pointsValue} />
            </>
          )}
        </div>
      </FlexBlock>
    </Card>
  );
};

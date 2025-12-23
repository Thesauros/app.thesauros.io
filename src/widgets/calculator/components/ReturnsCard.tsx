import { memo } from 'react';
import { FlexBlock } from '@/shared/ui/flex-block';
import { Card } from '@/shared/ui/new-card';
import { Subtitle } from '@/shared/ui/new-typography/subtitle';
import { Caption } from '@/shared/ui/new-typography/caption';
import { Heading } from '@/shared/ui/new-typography/heading';
import { Tooltip } from '@/shared/ui/tooltip/tooltip';
import { formatNumberWithCommas } from '@/shared/number/formatNumberWithCommas';
import styles from '../calculator.module.scss';

type ReturnsCardProps = {
  periodText: string;
  potentialReturns: number;
  cumulativeProfit: number;
};

export const ReturnsCard = memo(function ReturnsCard({
  periodText,
  potentialReturns,
  cumulativeProfit,
}: ReturnsCardProps) {
  return (
    <Card variant="secondary" className={styles.returnsBlock}>
      <FlexBlock direction="column" gap={24}>
        <FlexBlock direction="column" gap={12}>
          <Subtitle level={2} weight="regular" className={styles.description}>
            In <span className={styles.highlight}>{periodText}</span> you could have
          </Subtitle>
          <Heading level={5} weight="bold">
            ${formatNumberWithCommas(potentialReturns)}
          </Heading>
        </FlexBlock>
        <Tooltip
          tooltipText="Displays your projected total profit if you keep funds for the full selected period. Earnings are added back to your deposit, so your balance can grow faster over time."
          withIcon
        >
          <Caption weight="regular" className={styles.secondary}>
            Projected growth <span className={styles.highlight}>{cumulativeProfit}%</span>
          </Caption>
        </Tooltip>
      </FlexBlock>
    </Card>
  );
});

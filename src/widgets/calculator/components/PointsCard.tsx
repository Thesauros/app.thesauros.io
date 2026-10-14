import { memo } from 'react';
import { FlexBlock } from '@/shared/ui/flex-block';
import { Card } from '@/shared/ui/new-card';
import { Subtitle } from '@/shared/ui/new-typography/subtitle';
import { Heading } from '@/shared/ui/new-typography/heading';
import { Tooltip } from '@/shared/ui/tooltip/tooltip';
import { NewInfoIcon } from '@/shared/ui/icons/new-info';
import { PointCoinIcon } from '@/shared/ui/icons/point-icon';
import { formatNumberWithCommas } from '@/shared/number/formatNumberWithCommas';
import styles from '../calculator.module.scss';

type PointsCardProps = {
  pointsValue: number;
};

const POINTS_TOOLTIP_TEXT = `You receive 2 points for every $1 you hold each day.
For example, holding 1,000 USDC for one year gives you about 730,000 points.`;

export const PointsCard = memo(function PointsCard({ pointsValue }: PointsCardProps) {
  return (
    <Card variant="secondary" className={styles.pointsBlock}>
      <FlexBlock direction="column" gap={16} block className={styles.fullHeignt}>
        <FlexBlock justifyContent="space-between" alignItems="center" block>
          <Subtitle level={2} weight="regular" className={styles.description}>
            Projected points
          </Subtitle>
          <Tooltip tooltipText={POINTS_TOOLTIP_TEXT}>
            <NewInfoIcon />
          </Tooltip>
        </FlexBlock>
        <div className={styles.pointsInfo}>
          <PointCoinIcon />
          <Heading level={5} weight="bold">
            {formatNumberWithCommas(pointsValue)}
          </Heading>
        </div>
      </FlexBlock>
    </Card>
  );
});

import { Card } from '@/shared/ui/new-card';
import { FlexBlock } from '@/shared/ui/flex-block';
import { Heading } from '@/shared/ui/new-typography/heading';
import { Subtitle } from '@/shared/ui/new-typography/subtitle';
import { Tooltip } from '@/shared/ui/tooltip/tooltip';
import { InfoIcon } from '@/shared/ui/icons';
import { PointCoinIcon } from '@/shared/ui/icons/point-icon';
import { formatNumberWithCommas } from '@/shared/number/formatNumberWithCommas';
import { formatUsd } from '@/shared/number/formatUsd';
import styles from '../main.module.scss';

type MobileUserCardsProps = {
  totalPosition: number;
};

const POINTS_TOOLTIP =
  'You receive 1 point for every $1 you hold each day. Points are accrued over time and will be converted into tokens once the points program ends and the token launches.';

export const MobileUserCards = ({ totalPosition }: MobileUserCardsProps) => {
  return (
    <FlexBlock direction="column" gap={8} block>
      <Card variant="secondary" className={styles.mobilePointsCard}>
        <FlexBlock justifyContent="space-between" alignItems="center" block>
          <FlexBlock gap={4} alignItems="center">
            <Subtitle level={2} weight="regular" className={styles.secondaryHighlight}>
              Points
            </Subtitle>
            <Tooltip tooltipText={POINTS_TOOLTIP}>
              <InfoIcon />
            </Tooltip>
          </FlexBlock>
          <FlexBlock gap={4} alignItems="center">
            <PointCoinIcon size={16} />
            <Heading level={6} weight="bold">
              {formatNumberWithCommas(totalPosition * 2)}
            </Heading>
            <span className={styles.daily}>/day</span>
          </FlexBlock>
        </FlexBlock>
      </Card>
      <Card variant="secondary" className={styles.mobilePointsCard}>
        <FlexBlock justifyContent="space-between" alignItems="center" block>
          <Subtitle level={2} weight="regular" className={styles.secondaryHighlight}>
            Your funds
          </Subtitle>
          <Heading level={6} weight="bold">
            ${formatUsd(totalPosition)}
          </Heading>
        </FlexBlock>
      </Card>
    </FlexBlock>
  );
};

import { Card } from '@/shared/ui/new-card';
import { FlexBlock } from '@/shared/ui/flex-block';
import { Heading } from '@/shared/ui/new-typography/heading';
import { Body } from '@/shared/ui/new-typography/body';
import { Subtitle } from '@/shared/ui/new-typography/subtitle';
import { Tooltip, TooltipWithContent } from '@/shared/ui/tooltip/tooltip';
import { InfoIcon } from '@/shared/ui/icons';
import { PointCoinIcon } from '@/shared/ui/icons/point-icon';
import { StarsIcon } from '@/shared/ui/icons/stars-icon';
import { formatNumberWithCommas } from '@/shared/number/formatNumberWithCommas';
import { formatPercent } from '@/shared/number/formatPercent';
import { formatUsd } from '@/shared/number/formatUsd';
import { ApyTooltipContent } from './ApyTooltip';
import styles from '../main.module.scss';

type ApyCardsProps = {
  isDeposited: boolean;
  totalPosition: number;
  apy: number;
};

const POINTS_TOOLTIP =
  'You receive 1 point for every $1 you hold each day. Points are accrued over time and will be converted into tokens once the points program ends and the token launches.';

export const ApyCards = ({ isDeposited, totalPosition, apy }: ApyCardsProps) => {
  return (
    <FlexBlock direction="column" justifyContent="space-between" alignItems="flex-end" fullHeight>
      <FlexBlock gap={8} alignItems="flex-start">
        {isDeposited && (
          <Card variant="secondary" className={styles.apyCard}>
            <FlexBlock justifyContent="space-between" alignItems="center" block>
              <Body level={2}>Points</Body>
              <Tooltip tooltipText={POINTS_TOOLTIP}>
                <InfoIcon />
              </Tooltip>
            </FlexBlock>
            <Heading level={6} weight="bold">
              <FlexBlock gap={4} alignItems="center">
                <PointCoinIcon size={16} />
                {formatNumberWithCommas(totalPosition * 2)}
                <span className={styles.daily}>/day</span>
              </FlexBlock>
            </Heading>
          </Card>
        )}

        {isDeposited && (
          <Card variant="secondary" className={styles.apyCard}>
            <Body level={2}>Your funds</Body>
            <Heading level={6} weight="bold">
              ${formatUsd(totalPosition)}
            </Heading>
          </Card>
        )}

        <TooltipWithContent content={<ApyTooltipContent apy={apy} />}>
          <Card variant="secondary" className={styles.apyCard}>
            <Subtitle level={2} weight="regular" className={styles.secondaryHighlight}>
              APY
            </Subtitle>
            <FlexBlock alignItems="center" gap={12}>
              <Heading level={5} weight="bold">
                {formatPercent(apy)}%
              </Heading>
              <StarsIcon />
            </FlexBlock>
          </Card>
        </TooltipWithContent>
      </FlexBlock>
    </FlexBlock>
  );
};

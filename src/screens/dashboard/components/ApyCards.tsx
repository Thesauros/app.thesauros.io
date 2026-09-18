import { Card } from '@/shared/ui/new-card';
import { FlexBlock } from '@/shared/ui/flex-block';
import { Heading } from '@/shared/ui/new-typography/heading';
import { Body } from '@/shared/ui/new-typography/body';
import { Caption } from '@/shared/ui/new-typography/caption';
import { Subtitle } from '@/shared/ui/new-typography/subtitle';
import { Overline } from '@/shared/ui/new-typography/overline';
import { Tooltip, TooltipWithContent } from '@/shared/ui/tooltip/tooltip';
import { InfoIcon } from '@/shared/ui/icons';
import { PointCoinIcon } from '@/shared/ui/icons/point-icon';
import { StarsIcon } from '@/shared/ui/icons/stars-icon';
import styles from '../main.module.scss';

type ComplexApy = {
  netApy: number;
  baseApy: number;
  performanceFeePercent: number;
};

type ApyCardsProps = {
  isDeposited: boolean;
  totalPosition: number;
  complexApy: ComplexApy;
};

const POINTS_TOOLTIP = `You receive 2 points for every $1 you hold each day.
For example, holding 1,000 USDC for one year gives you about 730,000 points.`;

const APY_DESCRIPTION =
  'Net APY is the yield the DeFi strategies generate after the performance fee. The fee is taken from generated yield only, never from your principal. Points are tracked separately and will be converted into tokens once the points program ends and the token launches.';

export const ApyCards = ({ isDeposited, totalPosition, complexApy }: ApyCardsProps) => {
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
                {totalPosition * 2}
                <span className={styles.daily}>/day</span>
              </FlexBlock>
            </Heading>
          </Card>
        )}

        {isDeposited && (
          <Card variant="secondary" className={styles.apyCard}>
            <Body level={2}>Your funds</Body>
            <Heading level={6} weight="bold">
              ${totalPosition}
            </Heading>
          </Card>
        )}

        <TooltipWithContent
          content={
            <FlexBlock direction="column" gap={8} block>
              <FlexBlock direction="column" gap={0} className={styles.tooltipApyInfo} block>
                <FlexBlock justifyContent="space-between" block>
                  <Overline>Base Rate</Overline>
                  <Caption weight="regular">+{complexApy.baseApy}%</Caption>
                </FlexBlock>
                <FlexBlock justifyContent="space-between" block>
                  <Overline>Performance fee</Overline>
                  <Caption weight="regular">{complexApy.performanceFeePercent}%</Caption>
                </FlexBlock>
                <FlexBlock justifyContent="space-between" block>
                  <Overline>Net APY</Overline>
                  <Caption weight="regular">+{complexApy.netApy}%</Caption>
                </FlexBlock>
              </FlexBlock>
              <Overline className={styles.tooltipApyDescription}>{APY_DESCRIPTION}</Overline>
            </FlexBlock>
          }
        >
          <Card variant="secondary" className={styles.apyCard}>
            <Subtitle level={2} weight="regular" className={styles.secondaryHighlight}>
              APY
            </Subtitle>
            <FlexBlock alignItems="center" gap={12}>
              <Heading level={5} weight="bold">
                {complexApy.netApy}%
              </Heading>
              <StarsIcon />
            </FlexBlock>
          </Card>
        </TooltipWithContent>
      </FlexBlock>
    </FlexBlock>
  );
};

import { FlexBlock } from '@/shared/ui/flex-block';
import { Overline } from '@/shared/ui/new-typography/overline';
import { Caption } from '@/shared/ui/new-typography/caption';
import { formatPercent } from '@/shared/number/formatPercent';
import styles from '../main.module.scss';

/**
 * One tooltip body, shared by the desktop APY card and the mobile vault header,
 * so both platforms explain the number the same way.
 */
export const ApyTooltipContent = ({ apy }: { apy: number }) => (
  <FlexBlock direction="column" gap={8} block>
    <FlexBlock direction="column" gap={0} className={styles.tooltipApyInfo} block>
      <FlexBlock justifyContent="space-between" block>
        <Overline>Current APY</Overline>
        <Caption weight="regular">{formatPercent(apy)}%</Caption>
      </FlexBlock>
    </FlexBlock>
    <Overline className={styles.tooltipApyDescription}>
      The current average yield the strategy earns across the DeFi protocols it is allocated to. It
      moves up and down with market conditions, and it is the same figure plotted on the performance
      chart below.
    </Overline>
  </FlexBlock>
);

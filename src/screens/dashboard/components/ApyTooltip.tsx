import { FlexBlock } from '@/shared/ui/flex-block';
import { Overline } from '@/shared/ui/new-typography/overline';
import { Caption } from '@/shared/ui/new-typography/caption';
import { formatPercent } from '@/shared/number/formatPercent';
import type { ComplexApy } from '@/shared/constants/dashboard-constants';
import styles from '../main.module.scss';

const APY_DESCRIPTION =
  'Net APY is the yield the DeFi strategies generate after the performance fee. The fee is taken from generated yield only, never from your principal.';

/**
 * One tooltip body, shared by the desktop APY card and the mobile vault header,
 * so both platforms explain the number the same way.
 */
export const ApyTooltipContent = ({ complexApy }: { complexApy: ComplexApy }) => (
  <FlexBlock direction="column" gap={8} block>
    <FlexBlock direction="column" gap={0} className={styles.tooltipApyInfo} block>
      <FlexBlock justifyContent="space-between" block>
        <Overline>Base Rate</Overline>
        <Caption weight="regular">+{formatPercent(complexApy.baseApy)}%</Caption>
      </FlexBlock>
      <FlexBlock justifyContent="space-between" block>
        <Overline>Performance fee</Overline>
        <Caption weight="regular">{formatPercent(complexApy.performanceFeePercent)}%</Caption>
      </FlexBlock>
      <FlexBlock justifyContent="space-between" block>
        <Overline>Net APY</Overline>
        <Caption weight="regular">+{formatPercent(complexApy.netApy)}%</Caption>
      </FlexBlock>
    </FlexBlock>
    <Overline className={styles.tooltipApyDescription}>{APY_DESCRIPTION}</Overline>
  </FlexBlock>
);

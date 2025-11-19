import { FlexBlock } from '../flex-block';
import { Body } from '../new-typography/body';
import styles from './deposit-badge.module.scss';
import { PointCoinIcon } from '../icons/point-icon';
import { Caption } from '../new-typography/caption';
import { useCheckResolution } from '@/shared/browser/useCheckResolution';

export const DepositBadge = () => {
  const isMobile = useCheckResolution(576);

  return (
    <FlexBlock
      direction="column"
      gap={0}
      justifyContent={isMobile ? 'center' : undefined}
      alignItems={isMobile ? 'center' : undefined}
    >
      <FlexBlock gap={8} alignItems="center">
        <Body level={2} weight="bold">
          Deposit now and get
        </Body>
        <FlexBlock gap={4} alignItems="center">
          <PointCoinIcon size={16} />
          <Body level={2} weight="bold">
            500 points
          </Body>
        </FlexBlock>
      </FlexBlock>
      <Caption className={styles.secondary}>Withdraw anytime — no lock period</Caption>
    </FlexBlock>
  );
};

import { FlexBlock } from '../flex-block';
import { Card } from '../new-card';
import styles from './convert-badge.module.scss';
import { ConvertCoins } from '../icons/convert-coins';
import { Caption } from '../new-typography/caption';
import { useCheckResolution } from '@/shared/browser/useCheckResolution';

export const ConvertBadge = () => {
  const isMobile = useCheckResolution(576);

  if (isMobile) {
    return (
      <FlexBlock gap={8} alignItems="center">
        <Caption>Convert any crypto to USDC during Deposit</Caption>
        <ConvertCoins />
      </FlexBlock>
    );
  }

  return (
    <Card className={styles.badgeContainer}>
      <FlexBlock gap={8} alignItems="center">
        <Caption>Convert any crypto to USDC during Deposit</Caption>
        <ConvertCoins />
      </FlexBlock>
    </Card>
  );
};

import { FlexBlock } from '../flex-block';
import { Card } from '../new-card';
import { Body } from '../new-typography/body';
import styles from './connect-wallet-badge.module.scss';
import { PointCoinIcon } from '../icons/point-icon';

export const ConnectWalletBadge = () => {
  return (
    <Card className={styles.badgeContainer}>
      <FlexBlock gap={8} alignItems="center">
        <Body level={2} weight="regular">
          Connect wallet and get
        </Body>
        <FlexBlock gap={8}>
          <PointCoinIcon size={24} />
          <Body level={2} weight="bold" className={styles.highlight}>
            100 points
          </Body>
        </FlexBlock>
      </FlexBlock>
    </Card>
  );
};

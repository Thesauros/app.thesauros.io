import styles from './ProfileMenu.module.scss';
import { useAccount } from '@/shared/blockchain/useAccount';
import { Body } from '../new-typography/body';
import { CopyButton } from '../copy-button';
import { useDisconnect } from 'wagmi';
import { LogoutIcon } from '../icons/logout';
import { Avatar } from '../generated-avatar';
import { shortString } from '@/shared/string';
import { FlexBlock } from '../flex-block';
import { Card } from '../new-card';
import { useNetwork } from '@/shared/blockchain/useNetwork';

export const ProfileMenu = () => {
  const { address = '', isConnected } = useAccount();
  const { chain } = useNetwork();
  const { disconnect } = useDisconnect();

  return (
    <div className={styles.root} data-testid="user-wallet-menu">
      <div className={styles.top}>
        <FlexBlock gap={12} block>
          <div className={styles.iconContainer}>
            <Avatar value={address} />{' '}
          </div>
          <div className={styles.addressContainer}>
            <Body level={1} weight="regular" className={styles.address}>
              {shortString(address) ?? ''}
            </Body>
            <Body level={2} weight="regular" className={styles.balance}>
              {chain?.name}
            </Body>
          </div>
        </FlexBlock>
        <div className={styles.buttonsContainer}>
          <div data-testid="user-wallet-copy-button">
            <Card variant="secondary" className={styles.actionButton}>
              <CopyButton
                value={address}
                text={
                  <Body level={2} weight="regular">
                    Copy
                  </Body>
                }
              />
            </Card>
          </div>

          {isConnected && (
            <div data-testid="user-wallet-logout-button">
              <Card
                variant="secondary"
                className={styles.actionButton}
                onClick={() => disconnect()}
              >
                <LogoutIcon width={16} height={16} />
                <Body level={2} weight="regular">
                  Log out
                </Body>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

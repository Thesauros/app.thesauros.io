import styles from './ProfileMenu.module.scss';
import { JSXElementConstructor } from 'react';
import { useAccount } from '@/shared/blockchain/useAccount';
import { CloseIcon } from '../icons/close';
import { Texting } from '../typography/texting';
import { CopyButton } from '../copy-button';
import { useDisconnect } from 'wagmi';
import { LogoutIcon } from '../icons/logout';
import { Avatar } from '../generated-avatar';
import { shortString } from '@/shared/string';
import { FlexBlock } from '../flex-block';
import { Card } from '../card';
import { useNetwork } from '@/shared/blockchain/useNetwork';

type TProps = {
  onClose: () => void;
};

export type TProfileMenuComponent = JSXElementConstructor<TProps>;

export const ProfileMenu = ({ onClose }: TProps) => {
  const { address = '', isConnected } = useAccount();
  const { chain } = useNetwork();
  const { disconnect } = useDisconnect();

  return (
    <div className={styles.root}>
      <div className={styles.top}>
        <div className={styles.closeButton} onClick={onClose}>
          <CloseIcon />
        </div>
        <FlexBlock gap={12} block>
          <div className={styles.iconContainer}>
            <Avatar value={address} />{' '}
          </div>
          <div className={styles.addressContainer}>
            <Texting level={2} weight="regular" className={styles.address}>
              {shortString(address) ?? ''}
            </Texting>
            <Texting level={3} weight="regular" className={styles.balance}>
              {chain?.name}
            </Texting>
          </div>
        </FlexBlock>
        <div className={styles.buttonsContainer}>
          <Card size="xs" className={styles.actionButton}>
            <CopyButton value={address} text={<Texting level={4}>Copy</Texting>} />
          </Card>

          {isConnected && (
            <Card size="xs" className={styles.actionButton} onClick={() => disconnect()}>
              <LogoutIcon width={16} height={16} />
              <Texting level={4}>Log out</Texting>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

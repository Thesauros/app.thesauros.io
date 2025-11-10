import { useClickOutside } from '@/shared/browser/useClickOutside';
import styles from './ProfileWindow.module.scss';
import { useRef, useState } from 'react';
import { Avatar } from '../generated-avatar';
import { useAccount } from '@/shared/blockchain/useAccount';
import { ProfileMenu } from './ProfileMenu';
import { FlexBlock } from '../flex-block';
import { Subtitle } from '../new-typography/subtitle';
import { shortString } from '@/shared/string';

export const ProfileWindow = () => {
  const [opened, setOpened] = useState(false);
  const { address } = useAccount();
  const ref = useRef<HTMLDivElement>(null);

  useClickOutside(ref, () => {
    setOpened(false);
  });

  if (!address) {
    return null;
  }

  return (
    !!address && (
      <div className={styles.button} ref={ref}>
        {address && (
          <div onClick={() => setOpened(true)} style={{ cursor: 'pointer' }}>
            <FlexBlock gap={8} alignItems="center">
              <Avatar value={address} />
              <Subtitle>{shortString(address)}</Subtitle>
            </FlexBlock>
          </div>
        )}
        {opened && (
          <>
            <div className={styles.overlay} onClick={() => setOpened(false)} />
            <div className={styles.profileWidget}>{<ProfileMenu />}</div>
          </>
        )}
      </div>
    )
  );
};

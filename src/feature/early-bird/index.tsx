import { FlexBlock } from '@/shared/ui/flex-block';
import styles from './early-bird.module.scss';
import CloseIcon from './close.svg';
import PrizeIcon from './prize.svg';
import Image from 'next/image';
import { Heading } from '@/shared/ui/new-typography/heading';
import { Body } from '@/shared/ui/new-typography/body';
import { Button } from '@/shared/ui/button';
import { useState } from 'react';
import { useModal } from '@/shared/ui/modal';
import { useLargeDepositCount, useWhiteList } from '@/shared/api/dashboard';
import { useAccount } from '@/shared/blockchain';

import { TelegramIcon } from '@/shared/ui/icons/telegram-icon';
import { TwitterIcon } from '@/shared/ui/icons/twitter-icon';
import { DiscordIcon } from '@/shared/ui/icons/discord-icon';

const socialLinks = [
  {
    id: 'discord',
    name: 'Discord',
    link: 'https://discord.gg/TQHez89EAE',
    icon: <DiscordIcon color="#fff" size={24} />,
  },
  {
    id: 'telegram',
    name: 'Telegram',
    link: 'https://t.me/+p9DRrmX7ou05ODUy',
    icon: <TelegramIcon color="#fff" size={24} />,
  },
  {
    id: 'twitter',
    name: 'X',
    link: 'https://x.com/thesauros_io',
    icon: <TwitterIcon color="#fff" size={24} />,
  },
];

export const EarlyBirdModal = () => {
  const { close } = useModal();
  const { address } = useAccount();
  const { sendUserTelegram, refetchUserInfo } = useWhiteList(address);
  const [success, setSuccess] = useState(false);

  const handleSubmitTelegram = async () => {
    if (!address) return;

    const res = await sendUserTelegram(address, 'new_telegram_user');

    if (res.success) {
      setTimeout(() => {
        setSuccess(res.success);
      }, 3000);
    }

    refetchUserInfo();
  };

  const { largeDepositCount } = useLargeDepositCount({ enabled: success });

  return (
    <div className={styles.modalBackground}>
      <FlexBlock direction="column" gap={32} alignItems="center" justifyContent="center">
        <FlexBlock alignItems="center" justifyContent="end" block>
          <Image src={CloseIcon} alt={'Close'} className={styles.pointerCursor} onClick={close} />
        </FlexBlock>
        <FlexBlock className={styles.innerBlock} direction="column" gap={32} alignItems="center">
          <Image src={PrizeIcon} className={styles.birdBlock} alt={'Early bird'} />
          <FlexBlock gap={12} direction="column" alignItems="center" justifyContent="center">
            <Heading level={4}>{success ? 'Early access unlocked!' : 'You`re lucky!'}</Heading>
            <Heading level={6} className={styles.centered}>
              {!success ? (
                'You’re close to securing one of 500 whitelist spots. Join our community to confirm your place and unlock boosted rewards.'
              ) : (
                <>
                  You’re <span className={styles.highlight}>{largeDepositCount}</span> /{' '}
                  <span className={styles.bold}>500</span> on the whitelist. <br /> Deposit now to
                  activate increased rewards while early slots are still active.
                </>
              )}
            </Heading>
            <div className={styles.secondaryCard}>
              <Body level={2} weight="regular">
                {success ? (
                  <>
                    Your address is verified and approved. <br /> You can deposit immediately —
                    rewards for early users are boosted
                  </>
                ) : (
                  'Your address is under review — a spot is reserved for you. Join Telegram, Discord or X to complete your whitelist entry ⭐'
                )}
              </Body>
            </div>
          </FlexBlock>
          {!success && (
            <FlexBlock
              gap={12}
              direction="column"
              alignItems="center"
              justifyContent="center"
              block
            >
              {socialLinks.map(link => (
                <Button
                  key={link.id}
                  size="lg"
                  fullWidth
                  prefix={link.icon}
                  onClick={() => {
                    window.open(link.link, '_blank');
                    handleSubmitTelegram();
                  }}
                >
                  {link.name}
                </Button>
              ))}
            </FlexBlock>
          )}
          {success && (
            <Button size="lg" fullWidth onClick={close}>
              Got it
            </Button>
          )}
        </FlexBlock>
      </FlexBlock>
    </div>
  );
};

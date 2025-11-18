import { FlexBlock } from '@/shared/ui/flex-block';
import styles from './early-bird.module.scss';
import CloseIcon from './close.svg';
import EarlyBirdIcon from './early-bird-icon.svg';
import ArrowRight from './arrow-right.svg';
import TelegramIcon from './telegram.svg';
import Image from 'next/image';
import { Heading } from '@/shared/ui/new-typography/heading';
import { Body } from '@/shared/ui/new-typography/body';
import { Button } from '@/shared/ui/button';
import { Caption } from '@/shared/ui/new-typography/caption';
import { InputComponent } from '@/shared/ui/input';
import { useState } from 'react';
import { useModal } from '@/shared/ui/modal';
import { useWhiteList } from '@/shared/api/dashboard';
import { useAccount } from '@/shared/blockchain';

export const EarlyBirdModal = () => {
  const [email, setEmail] = useState('');
  const { close } = useModal();
  const { sendUserEmail } = useWhiteList();
  const { address } = useAccount();
  const [success, setSuccess] = useState(false);

  return (
    <div className={styles.modalBackground}>
      <FlexBlock direction="column" gap={32} alignItems="center" justifyContent="center">
        <FlexBlock alignItems="center" justifyContent="end" block>
          <Image src={CloseIcon} alt={'Close'} className={styles.pointerCursor} onClick={close} />
        </FlexBlock>
        <FlexBlock className={styles.innerBlock} direction="column" gap={32} alignItems="center">
          <Image src={EarlyBirdIcon} className={styles.birdBlock} alt={'Early bird'} />
          <FlexBlock gap={12} direction="column" alignItems="center" justifyContent="center">
            <Heading level={4}>You`re lucky!</Heading>
            <Heading level={6} className={styles.centered}>
              You can become one of 500 early birds and participate in our incentive campaign,
              receive unique benefits!
            </Heading>
          </FlexBlock>
          <div className={styles.secondaryCard}>
            <Body level={2} weight="regular">
              Your address in under review. We will add you to the whitelist shortly. Choose where
              to notify you and send your first bonus ⭐
            </Body>
          </div>
          {!success && (
            <>
              <Button
                variant="outline"
                size="lg"
                fullWidth
                prefix={<Image src={TelegramIcon} alt={'telegram'} />}
              >
                Telegram
              </Button>
              <FlexBlock gap={8} alignItems="center" block>
                <div className={styles.line} />
                <Caption className={styles.secondary} weight="regular">
                  Or by Email
                </Caption>
                <div className={styles.line} />
              </FlexBlock>
              {address && (
                <FlexBlock block>
                  <InputComponent
                    value={email}
                    size="md"
                    onChange={value => setEmail(value)}
                    id={'email'}
                    placeholder="Your@email.com"
                    type={'string'}
                    fullWidth
                  />
                  <Button
                    size="lg"
                    onClick={() =>
                      sendUserEmail(address, email).then(res => setSuccess(res.success))
                    }
                  >
                    <Image src={ArrowRight} alt="arrow right" />
                  </Button>
                </FlexBlock>
              )}
            </>
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

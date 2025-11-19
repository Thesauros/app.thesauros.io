import { FlexBlock } from '@/shared/ui/flex-block';
import styles from './early-bird.module.scss';
import CloseIcon from './close.svg';
import EarlyBirdIcon from './early-bird-icon.svg';
import ArrowRight from './arrow-right.svg';
import ArrowBlackRight from './arrow-black-right.svg';
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

export const EarlyBirdModal = ({ isOnApproving = false }: { isOnApproving?: boolean }) => {
  const [email, setEmail] = useState('');
  const [telegram, setTelegram] = useState('');
  const { close } = useModal();
  const { address } = useAccount();
  const { sendUserEmail, sendUserTelegram, refetchUserInfo } = useWhiteList(address);
  const [success, setSuccess] = useState(false);

  const isValidEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

  const handleChangeEmail = (value: string) => {
    const clean = sanitize(value);
    setEmail(clean);
  };

  const handleChangeTelegram = (value: string) => {
    const clean = sanitize(value);
    setTelegram(clean);
  };

  const sanitize = (value: string) => {
    return value
      .replace(/<.*?>/g, '') // delete tags
      .replace(/javascript:/gi, '') // delete js injection
      .replace(/["'`;(){}]/g, ''); // delete potential symbols
  };

  const handleSubmitEmail = async () => {
    if (!isValidEmail(email) || !address) return;

    const res = await sendUserEmail(address, email);
    setSuccess(res.success);
    refetchUserInfo();
  };

  const handleSubmitTelegram = async () => {
    if (!address) return;

    const res = await sendUserTelegram(address, telegram);
    setSuccess(res.success);
    refetchUserInfo();
  };

  const isShowForm = !success && !isOnApproving;

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
          {isShowForm && (
            <>
              {address && (
                <FlexBlock block>
                  <InputComponent
                    value={telegram}
                    size="md"
                    onChange={handleChangeTelegram}
                    id={'telegram'}
                    placeholder="Your telegram username"
                    type={'string'}
                    fullWidth
                  />
                  <Button
                    size="lg"
                    variant="outline"
                    disabled={!telegram}
                    onClick={handleSubmitTelegram}
                  >
                    <Image src={ArrowBlackRight} alt="arrow black right" />
                  </Button>
                </FlexBlock>
              )}
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
                    onChange={handleChangeEmail}
                    id={'email'}
                    placeholder="Your@email.com"
                    type={'string'}
                    fullWidth
                  />
                  <Button
                    size="lg"
                    disabled={!email || !isValidEmail(email)}
                    onClick={handleSubmitEmail}
                  >
                    <Image src={ArrowRight} alt="arrow right" />
                  </Button>
                </FlexBlock>
              )}
            </>
          )}
          {!isShowForm && (
            <Button size="lg" fullWidth onClick={close}>
              Got it
            </Button>
          )}
        </FlexBlock>
      </FlexBlock>
    </div>
  );
};

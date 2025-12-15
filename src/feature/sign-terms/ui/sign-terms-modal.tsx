import { FlexBlock } from '@/shared/ui/flex-block';
import { CloseIcon } from '@/shared/ui/icons/close';
import { useModal } from '@/shared/ui/modal';
import { Heading } from '@/shared/ui/new-typography/heading';
import ShieldIcon from './shield.svg';
import Image from 'next/image';
import { InputComponent } from '@/shared/ui/input';
import { Caption } from '@/shared/ui/new-typography/caption';
import { useAccount } from '@/shared/blockchain';
import { Subtitle } from '@/shared/ui/new-typography/subtitle';
import styles from './sign-terms-modal.module.scss';
import { Button } from '@/shared/ui/button';
import { useSignTerms } from '../model/useSignTerms';
import { useState } from 'react';

export const SignTermsModal = ({ onSuccess }: { onSuccess?: () => void }) => {
  const { close } = useModal();
  const { address } = useAccount();
  const { signTerms, isLoading } = useSignTerms();
  const [isChecked, setIsChecked] = useState(false);

  const handleSign = async () => {
    if (!isChecked) {
      return;
    }

    try {
      await signTerms();
      close();

      // Call callback after successful signing
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error('Error signing terms:', error);
    }
  };

  return (
    <FlexBlock direction="column" gap={40} block>
      <FlexBlock direction="column" gap={16} block>
        {/* Header */}
        <FlexBlock alignItems="center" justifyContent="space-between" block>
          <FlexBlock gap={4} alignItems="center">
            <Image src={ShieldIcon} alt="Shield" />
            <Heading level={6} weight="regular">
              Terms of use Agreement
            </Heading>
          </FlexBlock>
          <CloseIcon onClick={close} />
        </FlexBlock>
        {/* Content */}
        <FlexBlock direction="column" gap={4} block>
          <Caption>Connected wallet</Caption>
          <InputComponent
            value={address ?? ''}
            type="string"
            id="wallet"
            size="md"
            disabled
            fullWidth
          />
        </FlexBlock>
        <Subtitle level={2} weight="regular" className={styles.subtitle}>
          Please review and accept our{' '}
          <a href="https://thesauros.io/terms" target="_blank" className={styles.link}>
            terms of use
          </a>{' '}
          to continue using our platform with your connected wallet.
        </Subtitle>
        <FlexBlock alignItems="center" gap={8} block>
          <input
            type="checkbox"
            id="terms"
            className={styles.checkbox}
            checked={isChecked}
            onChange={e => setIsChecked(e.target.checked)}
          />
          <label htmlFor="terms" className={styles.label}>
            I have read and agree to the{' '}
            <a href="https://thesauros.io/terms" target="_blank" className={styles.link}>
              Terms of use
            </a>
          </label>
        </FlexBlock>
      </FlexBlock>
      <FlexBlock alignItems="center" justifyContent="center" gap={16} block>
        <Button size="lg" fullWidth variant="text" onClick={close} disabled={isLoading}>
          Decline
        </Button>
        <Button
          size="lg"
          fullWidth
          variant="primary"
          onClick={handleSign}
          disabled={isLoading || !isChecked}
        >
          {isLoading ? 'Signing...' : 'Accept and Sign'}
        </Button>
      </FlexBlock>
    </FlexBlock>
  );
};

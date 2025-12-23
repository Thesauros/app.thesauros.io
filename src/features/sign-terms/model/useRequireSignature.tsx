import { useEffect, useRef } from 'react';
import { useSignTerms } from './useSignTerms';
import { useModal } from '@/shared/ui/modal';
import { SignTermsModal } from '../ui/sign-terms-modal';
import { useAccount } from '@/shared/blockchain';
import { useWhiteList } from '@/shared/api/dashboard/useWhiteList';
import { EarlyBirdModal } from '@/features/early-bird';

export const useRequireSignature = () => {
  const { isSigned, isLoading, signatureData } = useSignTerms();
  const { address, isConnected } = useAccount();
  const { open } = useModal();
  const { isInWhiteList } = useWhiteList(address);
  const hasOpenedModal = useRef(false);
  const hasShownEarlyBird = useRef(false);

  useEffect(() => {
    hasOpenedModal.current = false;
    hasShownEarlyBird.current = false;
  }, [address]);

  useEffect(() => {
    if (address && isConnected && !isLoading && !isSigned && !hasOpenedModal.current) {
      hasOpenedModal.current = true;
      open(
        <SignTermsModal
          onSuccess={() => {
            // After signing, show EarlyBirdModal for users not in whitelist
            if (!isInWhiteList && !hasShownEarlyBird.current) {
              hasShownEarlyBird.current = true;
              // Small delay to ensure SignTermsModal is closed
              setTimeout(() => {
                open(<EarlyBirdModal />, {
                  smallPaddings: true,
                  maxWidth: 596,
                });
              }, 100);
            }
          }}
        />
      );
    }
  }, [address, isConnected, isSigned, isLoading, open, isInWhiteList]);

  return {
    isSigned,
    isLoading,
    signatureData,
  };
};

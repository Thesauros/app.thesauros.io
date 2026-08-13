import { useEffect, useRef } from 'react';
import { useSignTerms } from './useSignTerms';
import { useModal } from '@/shared/ui/modal';
import { SignTermsModal } from '../ui/sign-terms-modal';
import { useAccount } from '@/shared/blockchain';

export const useRequireSignature = () => {
  const { isSigned, isLoading, signatureData } = useSignTerms();
  const { address, isConnected } = useAccount();
  const { open } = useModal();
  const hasOpenedModal = useRef(false);

  useEffect(() => {
    hasOpenedModal.current = false;
  }, [address]);

  useEffect(() => {
    if (address && isConnected && !isLoading && !isSigned && !hasOpenedModal.current) {
      hasOpenedModal.current = true;
      open(<SignTermsModal />);
    }
  }, [address, isConnected, isSigned, isLoading, open]);

  return {
    isSigned,
    isLoading,
    signatureData,
  };
};

import { useCallback } from 'react';
import { useModal } from '@/shared/ui/modal';
import { useSignTerms } from './useSignTerms';
import { SignTermsModal } from '../ui/sign-terms-modal';

export const useSignTermsWithCallback = () => {
  const { isSigned } = useSignTerms();
  const { open } = useModal();

  const checkSignatureAndExecute = useCallback(
    (callback: () => void) => {
      if (!isSigned) {
        open(<SignTermsModal onSuccess={callback} />);
        return;
      }

      callback();
    },
    [isSigned, open]
  );

  return { checkSignatureAndExecute, isSigned };
};

import { useEffect, useState, useCallback, useMemo } from 'react';
import { useSignMessage } from 'wagmi';
import { verifyMessage } from 'viem';
import { useAccount } from '@/shared/blockchain';
import { LocalStorageKey } from '@/shared/browser/localStorage';
import { useSubmitSignature, useSignatureStatus } from '@/shared/api/signed-terms';
import { SignatureData, TERMS_MESSAGE } from './types';

export const useSignTerms = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [signatureData, setSignatureData] = useState<SignatureData | null>(null);

  const { address, isConnected } = useAccount();
  const { signMessageAsync } = useSignMessage();
  const { mutateAsync: submitSignature } = useSubmitSignature();
  const { hasSignature, isLoadingSignatureStatus, refetchSignatureStatus } =
    useSignatureStatus(address);

  const isSigned = useMemo(() => {
    if (!address || !isConnected) {
      return false;
    }

    if (isLoadingSignatureStatus) {
      return false;
    }

    if (hasSignature === true) {
      return true;
    }

    if (hasSignature === false) {
      const savedSignature = localStorage.getItem(LocalStorageKey.SIGNED_TERMS);
      if (savedSignature) {
        try {
          const data: SignatureData = JSON.parse(savedSignature);
          if (data.address.toLowerCase() === address.toLowerCase()) {
            return true;
          }
        } catch (error) {
          console.error('Error parsing saved signature:', error);
        }
      }
    }

    return false;
  }, [address, isConnected, hasSignature, isLoadingSignatureStatus]);

  useEffect(() => {
    if (!address || !isConnected) {
      setSignatureData(null);
      return;
    }

    const savedSignature = localStorage.getItem(LocalStorageKey.SIGNED_TERMS);
    if (savedSignature) {
      try {
        const data: SignatureData = JSON.parse(savedSignature);
        if (data.address.toLowerCase() === address.toLowerCase()) {
          setSignatureData(data);
        } else {
          setSignatureData(null);
        }
      } catch (error) {
        console.error('Error parsing saved signature:', error);
        setSignatureData(null);
      }
    } else {
      setSignatureData(null);
    }
  }, [address, isConnected]);

  const signTerms = useCallback(
    async (customMessage?: string) => {
      setIsLoading(true);

      try {
        const message = customMessage || TERMS_MESSAGE;

        const signature = await signMessageAsync({ message });

        const isValid = await verifyMessage({
          address: address as `0x${string}`,
          message,
          signature,
        });

        if (!isValid) {
          throw new Error('Invalid signature');
        }

        const data: SignatureData = {
          address: address as `0x${string}`,
          message,
          signature,
          timestamp: Date.now(),
        };

        localStorage.setItem(LocalStorageKey.SIGNED_TERMS, JSON.stringify(data));
        setSignatureData(data);

        try {
          await submitSignature({
            address: address as `0x${string}`,
            signature,
          });
          await refetchSignatureStatus();
        } catch (backendError) {
          console.error('Error submitting signature to backend:', backendError);
        }
      } finally {
        setIsLoading(false);
      }
    },
    [address, signMessageAsync, submitSignature, refetchSignatureStatus]
  );

  const verifySignature = useCallback(async (data: SignatureData): Promise<boolean> => {
    try {
      const isValid = await verifyMessage({
        address: data.address as `0x${string}`,
        message: data.message,
        signature: data.signature as `0x${string}`,
      });

      return isValid;
    } catch (error) {
      console.error('Error verifying signature:', error);
      return false;
    }
  }, []);

  return {
    isSigned,
    isLoading: isLoading || isLoadingSignatureStatus,
    signatureData,
    signTerms,
    verifySignature,
  };
};

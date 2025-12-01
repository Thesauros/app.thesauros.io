import { TAddress } from '@/shared/blockchain/core/types';
import { customFetch, getApiUrl, useCustomQueryKey } from '../core';

type TSignatureStatusResponse = {
  success: boolean;
  data: {
    hasSignature: boolean;
  };
  message: string;
};

const fetchSignatureStatus = async (address: TAddress): Promise<TSignatureStatusResponse> => {
  return customFetch<TSignatureStatusResponse>(getApiUrl(`users/${address}/signature/status`));
};

export const useSignatureStatus = (address?: TAddress) => {
  const {
    data: signatureStatus,
    isLoading: isLoadingSignatureStatus,
    refetch: refetchSignatureStatus,
    error,
  } = useCustomQueryKey(
    ['GET_SIGNATURE_STATUS', address ?? '0x'],
    () => fetchSignatureStatus(address ?? '0x'),
    {
      enabled: !!address,
      staleTime: 1000 * 60 * 5, // Кешируем на 5 минут
    }
  );

  if (error) {
    return {
      hasSignature: false,
      isLoadingSignatureStatus: false,
      refetchSignatureStatus,
    };
  }

  return {
    hasSignature: signatureStatus?.data?.hasSignature,
    isLoadingSignatureStatus,
    refetchSignatureStatus,
  };
};

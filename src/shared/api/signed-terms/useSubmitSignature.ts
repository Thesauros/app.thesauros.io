import { useMutation } from '@tanstack/react-query';
import { TAddress } from '@/shared/blockchain/core/types';
import { customFetch, getApiUrl } from '../core';

type TSubmitSignatureResponse = {
  success: boolean;
  message?: string;
};

const submitSignature = async (
  address: TAddress,
  signature: string
): Promise<TSubmitSignatureResponse> => {
  return customFetch<TSubmitSignatureResponse>(getApiUrl(`users/${address}/signature`), {
    method: 'POST',
    body: JSON.stringify({ signature }),
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

export const useSubmitSignature = () => {
  return useMutation({
    mutationFn: ({ address, signature }: { address: TAddress; signature: string }) =>
      submitSignature(address, signature),
  });
};

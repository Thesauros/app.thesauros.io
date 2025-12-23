import { customFetch, getApiUrl } from '@/shared/api/core';
import { TAddress } from '@/shared/blockchain';

export interface PostRefferalParams {
  address: TAddress;
  referrer_address: string;
}

export const postRefferal = async (
  params: PostRefferalParams
): Promise<{ success: boolean; message: string }> => {
  return customFetch<{ success: boolean; message: string }>(getApiUrl('users'), {
    method: 'POST',
    body: JSON.stringify({
      address: params.address,
      referrer_address: params.referrer_address,
    }),
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

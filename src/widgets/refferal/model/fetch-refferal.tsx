import { customFetch, getApiUrl } from '@/shared/api/core';
import { TAddress } from '@/shared/blockchain';

export const fetchRegisterReferral = async (
  address: TAddress,
  referralID: string
): Promise<{ success: boolean; message: string }> => {
  return customFetch<{ success: boolean; message: string }>(
    getApiUrl(`referral/${address}?referralID=${referralID}`),
    {
      method: 'POST',
      body: JSON.stringify({
        referralID,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );
};

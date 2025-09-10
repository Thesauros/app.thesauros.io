import { TAddress } from '@/shared/blockchain/core/types';
import { customFetch, getApiUrl } from '../core';

type TUserPointsInfoRaw = {
  bonusAmount: number;
};

export const connectBonus = async (address: TAddress): Promise<TUserPointsInfoRaw> => {
  return customFetch<TUserPointsInfoRaw>(getApiUrl(`users/${address}/registration-bonus`), {
    method: 'POST',
    body: JSON.stringify({
      bonusAmount: 10000,
    }),
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

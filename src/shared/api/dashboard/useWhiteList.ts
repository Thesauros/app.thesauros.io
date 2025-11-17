import { TAddress } from '@/shared/blockchain/core/types';
import { customFetch, getApiUrl } from '../core';

type TSendUserInfoRaw = {
  success: boolean;
};

const sendUserEmail = async (address: TAddress, email: string): Promise<TSendUserInfoRaw> => {
  return customFetch<TSendUserInfoRaw>(getApiUrl(`users/${address}/email`), {
    method: 'POST',
    body: JSON.stringify({
      email: email,
    }),
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

const sendUserTelegram = async (address: TAddress, telegram: string): Promise<TSendUserInfoRaw> => {
  return customFetch<TSendUserInfoRaw>(getApiUrl(`users/${address}/telegram`), {
    method: 'POST',
    body: JSON.stringify({
      telegram: telegram,
    }),
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

export const useWhiteList = () => {
  return { sendUserEmail, sendUserTelegram };
};

import { TAddress } from '@/shared/blockchain/core/types';
import { customFetch, getApiUrl, useCustomQueryKey } from '../core';

type TSendUserInfoRaw = {
  success: boolean;
};

type TWhitelistResponse = { data: { isWhitelisted: boolean } };

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

const fetcWhiteList = async (address: TAddress): Promise<TWhitelistResponse> => {
  const response = await customFetch<TWhitelistResponse>(getApiUrl(`users/${address}/whitelist `));
  return response;
};

export const useWhiteList = (address?: TAddress) => {
  const { data, isLoading } = useCustomQueryKey(
    ['GET_WHITELIST', address ?? '0x'],
    () => fetcWhiteList(address ?? '0x'),
    { enabled: !!address }
  );

  return {
    isInWhiteList: data?.data?.isWhitelisted ?? false,
    isLoading,
    sendUserEmail,
    sendUserTelegram,
  };
};

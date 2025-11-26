import { TAddress } from '@/shared/blockchain/core/types';
import { customFetch, getApiUrl, useCustomQueryKey } from '../core';
import { useUserData } from './useUserData';

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
  const { data: whiteList, isLoading: isLoadingWhiteList } = useCustomQueryKey(
    ['GET_WHITELIST', address ?? '0x'],
    () => fetcWhiteList(address ?? '0x'),
    { enabled: !!address }
  );

  const { userInfo, isLoadingUserInfo, refetchUserInfo } = useUserData(address);

  const isLoading = isLoadingWhiteList || isLoadingUserInfo;
  const isInWhiteList = whiteList?.data?.isWhitelisted ?? false;
  const isOnApproving = userInfo?.data?.email !== null || userInfo?.data?.telegram !== null;

  return {
    isInWhiteList,
    isOnApproving,
    isLoading,
    sendUserEmail,
    sendUserTelegram,
    refetchUserInfo,
  };
};

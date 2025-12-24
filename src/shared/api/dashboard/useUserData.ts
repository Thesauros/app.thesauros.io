import { TAddress } from '@/shared/blockchain';
import { customFetch, getApiUrl, useCustomQueryKey } from '../core';

type TUserInfoResponse = {
  data: { email: string | null; telegram: string | null; status: string; referralLink?: string };
};

const fetchUserInfo = async (address: TAddress): Promise<TUserInfoResponse> => {
  const response = await customFetch<TUserInfoResponse>(getApiUrl(`users/${address}`));
  return response;
};

export const useUserData = (address?: TAddress) => {
  const {
    data: userInfo,
    isLoading: isLoadingUserInfo,
    refetch: refetchUserInfo,
  } = useCustomQueryKey(['GET_USER_INFO', address ?? '0x'], () => fetchUserInfo(address ?? '0x'), {
    enabled: !!address,
  });

  return { userInfo, isLoadingUserInfo, refetchUserInfo };
};

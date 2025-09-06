import { TAddress } from '@/shared/blockchain/core/types';
import { customFetch, getApiUrl, useCustomQueryKey } from '../core';

type TUserPointsInfoRaw = {
  success: boolean;
  data: {
    address: string;
    creation_date: number;
    totalBalance: number;
    rank: number;
    referralEarnings: number;
    referralLink: string;
    referrers: string[];
    status: string;
    created_at: string;
    updated_at: string;
  };
  message: string;
};

const fetchUserInfo = async (address: TAddress): Promise<TUserPointsInfoRaw> => {
  return customFetch<TUserPointsInfoRaw>(getApiUrl(`users/${address}`));
};

export const useUserPointsInfo = (address?: TAddress) => {
  const { data: userPointsInfo, isLoading } = useCustomQueryKey(
    ['GET_USER_POINTS_INFO', address ?? ''],
    () => fetchUserInfo(address!),
    {
      enabled: !!address,
    }
  );

  return { userPointsInfo: userPointsInfo?.data, isLoading };
};

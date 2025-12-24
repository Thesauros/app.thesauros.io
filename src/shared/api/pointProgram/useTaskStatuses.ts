import { TAddress } from '@/shared/blockchain/core/types';
import { customFetch, getApiUrl, useCustomQueryKey } from '../core';

type TUserPointsInfoRaw = {
  success: boolean;
  data: {
    user_address: string;
    season_number: number;
    tasks: Record<string, { status: string; value?: number }>;
  };
  message: string;
};

const fetchTaskStatuses = async (address: TAddress): Promise<TUserPointsInfoRaw> => {
  return customFetch<TUserPointsInfoRaw>(
    getApiUrl(`task-status/user/${address}/season?season_number=1`)
  );
};

export const useTaskStatuses = (address?: TAddress) => {
  const { data: userTaskStatuses, isLoading } = useCustomQueryKey(
    ['GET_TASK_STATUSES', address ?? ''],
    () => fetchTaskStatuses(address!),
    {
      enabled: !!address,
    }
  );

  return { userTaskStatuses: userTaskStatuses?.data, isLoading };
};

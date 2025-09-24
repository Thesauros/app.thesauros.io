import { TAddress } from '@/shared/blockchain/core/types';
import { customFetch, getGrafanaUrl, useCustomQueryKey } from '../core';

type TAPRInfoRaw = TTickRaw[];

type TTickRaw = {
  from: string;
  to: string;
  value: number;
};

type TParams = {
  interval: number;
  intervals: number;
  address?: TAddress;
};

const fetchEarnedOverall = async (params: TParams): Promise<TAPRInfoRaw> => {
  return customFetch<TAPRInfoRaw>(
    getGrafanaUrl(
      `lending/user-earned-overall-ticks/${params.address}/${params.interval}/${params.intervals}`
    )
  );
};

export const useUserEarnedOverallicks = (params: TParams) => {
  const { data, isLoading } = useCustomQueryKey(
    [
      'GET_USER_EARNED_OVERALL_TICKS',
      params.address ?? '0x',
      String(params.interval),
      String(params.intervals),
    ],
    () => fetchEarnedOverall(params),
    { enabled: !!params.address }
  );

  return { data, isLoading };
};

import { TAddress } from '@/shared/blockchain/core/types';
import { customFetch, getVaultDataUrl, useCustomQueryKey } from '../core';

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
  chainID: number;
};

const fetchEarnedOverall = async (params: TParams): Promise<TAPRInfoRaw> => {
  return customFetch<TAPRInfoRaw>(
    getVaultDataUrl(
      `lending/user-earned-overall-ticks/${params.address}/${params.interval}/${params.intervals}`,
      params.chainID
    )
  );
};

export const useUserEarnedOverallTicks = (params: TParams) => {
  const { data, isLoading } = useCustomQueryKey(
    [
      'GET_USER_EARNED_OVERALL_TICKS',
      params.address ?? '0x',
      String(params.interval),
      String(params.intervals),
      String(params.chainID),
    ],
    () => fetchEarnedOverall(params),
    { enabled: !!params.address }
  );

  return { data, isLoading };
};

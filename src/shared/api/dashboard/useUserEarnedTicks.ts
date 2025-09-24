import { TAddress } from '@/shared/blockchain/core/types';
import { customFetch, getGrafanaUrl, useCustomQueryKey } from '../core';

type TAPRInfoRaw = TTickRaw[];

type TTickRaw = {
  from: string;
  to: string;
  value: number;
};

type TParams = {
  token: 'USDC' | 'USDT';
  interval: number;
  intervals: number;
  address?: TAddress;
};

const fetchEarnedTicks = async (params: TParams): Promise<TAPRInfoRaw> => {
  return customFetch<TAPRInfoRaw>(
    getGrafanaUrl(
      `lending/${params.token}/user-earned-ticks/${params.address}/${params.interval}/${params.intervals}`
    )
  );
};

export const useUserEarnedTicks = (params: TParams) => {
  const { data, isLoading } = useCustomQueryKey(
    [
      'GET_USER_EARNED_TICKS',
      params.address ?? '0x',
      params.token,
      String(params.interval),
      String(params.intervals),
    ],
    () => fetchEarnedTicks(params),
    { enabled: !!params.address }
  );

  return { data, isLoading };
};

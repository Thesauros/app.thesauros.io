import { TAddress } from '@/shared/blockchain/core/types';
import { customFetch, getGrafanaUrl, useCustomQueryKey } from '../core';
import { getBaseUrl } from '../core/getApiUrl';

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
  chainID: number;
};

const fetchEarnedTicks = async (params: TParams): Promise<TAPRInfoRaw> => {
  return customFetch<TAPRInfoRaw>(
    params.chainID === 42161
      ? getGrafanaUrl(
          `lending/${params.token}/user-earned-ticks/${params.address}/${params.interval}/${params.intervals}`
        )
      : getBaseUrl(
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
      String(params.chainID),
    ],
    () => fetchEarnedTicks(params),
    { enabled: !!params.address }
  );

  return { data, isLoading };
};

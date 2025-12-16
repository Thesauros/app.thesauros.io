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
  chainID: number;
};

const fetcAPRTicks = async (params: TParams): Promise<TAPRInfoRaw> => {
  return customFetch<TAPRInfoRaw>(
    params.chainID === 42161
      ? getGrafanaUrl(`lending/${params.token}/apr-ticks/${params.interval}/${params.intervals}`)
      : getBaseUrl(`lending/${params.token}/apr-ticks/${params.interval}/${params.intervals}`)
  );
};

export const useAPRTicks = (params: TParams) => {
  const { data, isLoading } = useCustomQueryKey(
    [
      'GET_APR_TICKS',
      params.token,
      String(params.interval),
      String(params.intervals),
      String(params.chainID),
    ],
    () => fetcAPRTicks(params)
  );

  return { data, isLoading };
};

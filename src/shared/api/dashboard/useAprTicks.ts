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
};

const fetcAPRTicks = async (params: TParams): Promise<TAPRInfoRaw> => {
  return customFetch<TAPRInfoRaw>(
    getGrafanaUrl(`lending/${params.token}/apr-ticks/${params.interval}/${params.intervals}`)
  );
};

export const useAPRTicks = (params: TParams) => {
  const { data, isLoading } = useCustomQueryKey(
    ['GET_APR_TICKS', params.token, String(params.interval), String(params.intervals)],
    () => fetcAPRTicks(params)
  );

  return { data, isLoading };
};

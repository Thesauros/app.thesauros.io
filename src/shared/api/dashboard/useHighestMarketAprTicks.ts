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

const fetcMarketAPRTicks = async (params: TParams): Promise<TAPRInfoRaw> => {
  return customFetch<TAPRInfoRaw>(
    getGrafanaUrl(
      `lending/${params.token}/highest-market-apr-ticks/${params.interval}/${params.intervals}`
    )
  );
};

export const useMarketAPRTicks = (params: TParams) => {
  const { data, isLoading } = useCustomQueryKey(
    ['GET_MARKET_APR_TICKS', params.token, String(params.interval), String(params.intervals)],
    () => fetcMarketAPRTicks(params)
  );

  return { data, isLoading };
};

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

const fetcMarketAPRTicks = async (params: TParams): Promise<TAPRInfoRaw> => {
  return customFetch<TAPRInfoRaw>(
    params.chainID === 42161
      ? getGrafanaUrl(
          `lending/${params.token}/highest-market-apr-ticks/${params.interval}/${params.intervals}`
        )
      : getBaseUrl(
          `lending/${params.token}/highest-market-apr-ticks/${params.interval}/${params.intervals}`
        )
  );
};

export const useMarketAPRTicks = (params: TParams) => {
  const { data, isLoading } = useCustomQueryKey(
    [
      'GET_MARKET_APR_TICKS',
      params.token,
      String(params.interval),
      String(params.intervals),
      String(params.chainID),
    ],
    () => fetcMarketAPRTicks(params)
  );

  return { data, isLoading };
};

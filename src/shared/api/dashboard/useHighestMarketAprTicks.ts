import { customFetch, useCustomQueryKey, getVaultDataUrl } from '../core';

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
    getVaultDataUrl(
      `lending/${params.token}/highest-market-apr-ticks/${params.interval}/${params.intervals}`,
      params.chainID
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

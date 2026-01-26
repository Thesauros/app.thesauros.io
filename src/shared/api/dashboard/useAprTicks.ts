import { customFetch, useCustomQueryKey } from '../core';
import { getVaultDataUrl } from '../core';

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
    getVaultDataUrl(
      `lending/${params.token}/apr-ticks/${params.interval}/${params.intervals}`,
      params.chainID
    )
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

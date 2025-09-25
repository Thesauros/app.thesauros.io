import { customFetch, getGrafanaUrl, useCustomQueryKey } from '../core';

type TCommonData = TTokenInfoRaw[];

type TTokenInfoRaw = {
  token: string;
  vaultAddress: string;
  tokenAddress: string;
  tokenDecimals: number;
  tokenPrice: number;
  funds: number;
  earned: number;
  avgApr30D: number;
  highestMarket30DAprDiff: number;
};

const fetchCommonData = async (): Promise<TCommonData> => {
  return customFetch<TCommonData>(getGrafanaUrl('lending'));
};

export const useCurrentAPR = () => {
  const { data, isLoading } = useCustomQueryKey(['GET_COMMON_DATA'], () => fetchCommonData());

  const maxApr30D =
    data?.reduce((max, item) => {
      return item.avgApr30D > max ? item.avgApr30D : max;
    }, 0) ?? 0;

  return { apr30D: maxApr30D, isLoading };
};

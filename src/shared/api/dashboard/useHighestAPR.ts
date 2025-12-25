import { customFetch, getVaultDataUrl, useCustomQueryKey } from '../core';

type TResponse = string;

const fetcHighestAPRT = async (days: number): Promise<TResponse> => {
  const response = await customFetch<TResponse>(
    getVaultDataUrl(`lending/highest-apr-token/${days}`, 42161)
  );
  return response;
};

export const useHighestApr = (days: number) => {
  const { data, isLoading } = useCustomQueryKey(['GET_HIGHEST_APR_TOKEN', String(days)], () =>
    fetcHighestAPRT(days)
  );

  return { data, isLoading };
};

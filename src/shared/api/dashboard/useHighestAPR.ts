import { customFetch, getGrafanaUrl, useCustomQueryKey } from '../core';

type TResponse = string;

const fetcHighestAPRT = async (days: number): Promise<TResponse> => {
  const response = await customFetch<TResponse>(getGrafanaUrl(`lending/highest-apr-token/${days}`));
  return response;
};

export const useHighestApr = (days: number) => {
  const { data, isLoading } = useCustomQueryKey(['GET_HIGHEST_APR_TOKEN', String(days)], () =>
    fetcHighestAPRT(days)
  );

  return { data, isLoading };
};

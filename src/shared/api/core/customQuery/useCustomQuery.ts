import { QueryFunction, QueryKey, UseQueryResult, useQuery } from '@tanstack/react-query';

type TUseQueryOptions = {
  staleTime?: number;
  enabled?: boolean;
};

export const useCustomQueryKey = <TData, TError = Error>(
  key: string | string[],
  fetcher: QueryFunction<TData, QueryKey>,
  options?: TUseQueryOptions
): UseQueryResult<TData, TError> => {
  return useQuery<TData, TError>({
    queryKey: Array.isArray(key) ? key : [key],
    queryFn: fetcher,
    retry: 0,
    ...options,
  });
};

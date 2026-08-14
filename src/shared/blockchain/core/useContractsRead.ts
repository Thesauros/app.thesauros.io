import { useCallback, useMemo } from 'react';
import { useQueries } from '@tanstack/react-query';
import { useConfig } from 'wagmi';
import { readContractQueryOptions } from 'wagmi/query';
import { abi } from '../abi';
import { TAddress, TArg, TChainID } from './types';

type TContractReadConfig = {
  address: TAddress;
  functionName: string;
  args: TArg[];
  chainID: TChainID;
  watch?: boolean;
  staleTime?: number;
  isEnabled?: boolean;
  selectData?: ((data: unknown) => unknown) | undefined;
};

type TContractsReadProps = {
  contracts: TContractReadConfig[];
  watch?: boolean;
  staleTime?: number;
  refetchOnWindowFocus?: boolean;
  refetchOnMount?: boolean;
  refetchOnReconnect?: boolean;
};

type TContractsReadResult<T = unknown> = {
  data: T[] | undefined;
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
  results: Array<{
    data: T | undefined;
    isLoading: boolean;
    error: Error | null;
    refetch: () => void;
  }>;
};

export const useContractsRead = <T = unknown>({
  contracts,
  staleTime,
  refetchOnWindowFocus = true,
  refetchOnMount = true,
  refetchOnReconnect = true,
}: TContractsReadProps): TContractsReadResult<T> => {
  const config = useConfig();
  const staleTimeResult = staleTime ?? Infinity;

  const queries = useQueries({
    queries: contracts.map(contract => ({
      ...readContractQueryOptions(config, {
        address: contract.address,
        abi,
        chainId: contract.chainID,
        functionName: contract.functionName,
        args: contract.args,
      }),
      staleTime: staleTimeResult,
      refetchOnWindowFocus,
      refetchOnMount,
      refetchOnReconnect,
      enabled: Boolean(contract.address && contract.functionName && (contract.isEnabled ?? true)),
    })),
  });

  const results = useMemo(() => {
    return contracts.map((contract, index) => {
      const query = queries[index];
      const contractResult = query?.data;
      const contractError = (query?.error as Error | null) ?? null;

      return {
        data: contract.selectData
          ? (contract.selectData(contractResult) as T)
          : (contractResult as T),
        isLoading: query?.isLoading ?? false,
        error: contractError,
        refetch: query?.refetch ?? (() => undefined),
      };
    });
  }, [contracts, queries]);

  const refetch = useCallback(() => {
    queries.forEach(query => {
      query.refetch();
    });
  }, [queries]);

  const isLoading = queries.some(query => query.isLoading);
  const error =
    queries.length > 0 && queries.every(query => query.error)
      ? (queries[0]?.error as Error)
      : null;

  return {
    data: results.map(r => r.data) as T[],
    isLoading,
    error,
    refetch,
    results,
  };
};

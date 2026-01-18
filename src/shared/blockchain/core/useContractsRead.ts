import { useMemo } from 'react';
import { useReadContracts } from 'wagmi';
import { abi } from '../abi';
import { TAddress, TArg, TChainID } from './types';

type TContractReadConfig = {
  address: TAddress;
  functionName: string;
  args: TArg[];
  chainID: TChainID;
  watch?: boolean;
  staleTime?: number;
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
  const staleTimeResult = staleTime ?? Infinity;

  const result = useReadContracts({
    contracts: contracts.map(contract => ({
      address: contract.address,
      abi: abi,
      chainId: contract.chainID,
      functionName: contract.functionName,
      watch: contract.watch,
      args: contract.args,
    })),
    query: {
      staleTime: staleTimeResult,
      refetchOnWindowFocus,
      refetchOnMount,
      refetchOnReconnect,
    },
  });

  const results = useMemo(() => {
    return contracts.map((contract, index) => {
      const contractData = result.data?.[index];
      const contractResult = contractData?.result;
      const contractError = contractData?.error || result.error;

      return {
        data: contract.selectData
          ? (contract.selectData(contractResult) as T)
          : (contractResult as T),
        isLoading: result.isLoading,
        error: contractError as Error | null,
        refetch: result.refetch,
      };
    });
  }, [contracts, result.data, result.isLoading, result.error, result.refetch]);

  const refetch = () => {
    result.refetch();
  };

  return {
    data: results.map(r => r.data) as T[],
    isLoading: result.isLoading,
    error: result.error as Error | null,
    refetch,
    results,
  };
};

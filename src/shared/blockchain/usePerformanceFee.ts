import { round } from '../number/round';
import { TAddress, TChainID } from './core/types';
import { useContractRead } from './core/useContractRead';

export const PUBLISHED_PERFORMANCE_FEE_PERCENT = 25;

const WAD_TO_PERCENT = 10 ** 16;

type TPerformanceFeeProps = {
  vaultAddress: TAddress;
  chainID: TChainID;
  staleTime?: number;
};

type TPerformanceFeeResult = {
  data: number | undefined;
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
};

export const usePerformanceFee = ({
  vaultAddress,
  chainID,
  staleTime = 300000,
}: TPerformanceFeeProps): TPerformanceFeeResult => {
  const { data, isLoading, error, refetch } = useContractRead({
    address: vaultAddress,
    chainID,
    functionName: 'getPerformanceFee',
    args: [],
    watch: false,
    staleTime,
    selectData: (value: unknown): number => round(Number(value) / WAD_TO_PERCENT, 2),
  });

  return {
    data: data as number | undefined,
    isLoading,
    error: error as Error | null,
    refetch,
  };
};

import { round } from '../number/round';
import { TAddress, TChainID } from './core/types';
import { useContractRead } from './core/useContractRead';

type TMinAmountProps = {
  vaultAddress: TAddress;
  chainID: TChainID;
  decimals: number;
};

type TMinAmountResult = {
  data: number | undefined;
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
};

export const useMinAmount = ({
  vaultAddress,
  chainID,
  decimals,
}: TMinAmountProps): TMinAmountResult => {
  const { data, isLoading, error, refetch } = useContractRead({
    address: vaultAddress,
    chainID,
    functionName: 'getMinAssets',
    args: [],
    watch: false,
    selectData: (data: unknown): number => {
      return round(Number(data) / 10 ** decimals, 2);
    },
  });

  return {
    data: data as number | undefined,
    isLoading,
    error: error as Error | null,
    refetch,
  };
};

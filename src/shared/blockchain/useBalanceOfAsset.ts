import { useCallback } from 'react';
import { ReadContractReturnType } from 'viem';
import { TAddress, TChainID } from './core/types';
import { useContractRead } from './core/useContractRead';

type TBalanceOfAssetProps = {
  vaultAddress: TAddress;
  chainID: TChainID;
  account?: TAddress;
  staleTime?: number;
  selectData?: ((data: ReadContractReturnType) => unknown) | undefined;
};

export const useBalanceOfAsset = ({
  vaultAddress,
  chainID,
  account,
  staleTime,
  selectData,
}: TBalanceOfAssetProps) => {
  const {
    data: shares,
    isLoading: isLoadingShares,
    refetch: refetchShares,
  } = useContractRead({
    address: vaultAddress,
    functionName: 'balanceOf',
    args: [account],
    chainID,
    staleTime,
  });

  const {
    data: assets,
    isLoading: isLoadingAssets,
    refetch: refetchAssets,
  } = useContractRead({
    address: vaultAddress,
    functionName: 'convertToAssets',
    args: shares !== undefined ? [shares as bigint] : undefined,
    chainID,
    staleTime,
    selectData,
    isEnabled: shares !== undefined,
  });

  const refetch = useCallback(() => {
    refetchShares();
    refetchAssets();
  }, [refetchShares, refetchAssets]);

  return {
    data: assets,
    isLoading: isLoadingShares || isLoadingAssets,
    refetch,
  };
};

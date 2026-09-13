import { useCallback, useMemo } from 'react';
import { useContractsRead } from './core/useContractsRead';
import { vaults } from './config';
import { TVault } from './core/types';
import { round } from '../number/round';
import { useAccount } from './useAccount';

type TVaultPositionResult = {
  data: number | undefined;
  isLoading: boolean;
  refetchData: () => void;
};

const queryOptions = {
  staleTime: Infinity,
  refetchOnWindowFocus: false,
  refetchOnMount: false,
  refetchOnReconnect: false,
} as const;

export const useVaultsPosition = (): TVaultPositionResult => {
  const { address } = useAccount();

  const shareContracts = useMemo(
    () =>
      (address ? vaults : []).map((vault: TVault) => ({
        address: vault.vaultAddress,
        functionName: 'balanceOf',
        args: [address],
        chainID: vault.chainID,
      })),
    [address]
  );

  const {
    results: shareResults,
    isLoading: isLoadingShares,
    refetch: refetchShares,
  } = useContractsRead<bigint>({
    contracts: shareContracts,
    ...queryOptions,
  });

  const assetContracts = useMemo(() => {
    if (!address) return [];

    return vaults.map((vault: TVault, index) => ({
      address: vault.vaultAddress,
      functionName: 'convertToAssets',
      args: [shareResults[index]?.data ?? BigInt(0)],
      chainID: vault.chainID,
      isEnabled: shareResults[index]?.data !== undefined,
    }));
  }, [address, shareResults]);

  const {
    data: assets,
    isLoading: isLoadingAssets,
    refetch: refetchAssets,
  } = useContractsRead<bigint>({
    contracts: assetContracts,
    ...queryOptions,
  });

  const isLoading = isLoadingShares || isLoadingAssets;

  const totalPosition = useMemo(() => {
    if (!address) return undefined;

    const positionsInDollars = (assets ?? []).reduce((sum, position, index) => {
      if (position === undefined) return sum;

      const vault = vaults[index];
      const divisor = BigInt(10 ** vault.decimals);
      const value = Number(position) / Number(divisor);
      return sum + value;
    }, 0);

    if (isLoading && positionsInDollars === 0) return undefined;

    return positionsInDollars > 0 ? round(positionsInDollars) : undefined;
  }, [address, assets, isLoading]);

  const refetchData = useCallback(() => {
    refetchShares();
    refetchAssets();
  }, [refetchShares, refetchAssets]);

  return {
    data: totalPosition,
    isLoading,
    refetchData,
  };
};

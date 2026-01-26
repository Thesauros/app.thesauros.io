import { useMemo } from 'react';
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

export const useVaultsPosition = (): TVaultPositionResult => {
  const { address } = useAccount();

  const contracts = useMemo(
    () =>
      (address ? vaults : []).map((vault: TVault) => ({
        address: vault.vaultAddress,
        functionName: 'getBalanceOfAsset',
        args: [address],
        chainID: vault.chainID,
      })),
    [address]
  );

  const { data, isLoading, refetch } = useContractsRead<bigint>({
    contracts,
    staleTime: Infinity,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
  });

  const totalPosition = useMemo(() => {
    if (!address || isLoading || !data) return undefined;

    const positionsInDollars = data.reduce((sum, position, index) => {
      if (position === undefined) return sum;

      const vault = vaults[index];
      const divisor = BigInt(10 ** vault.decimals);
      const value = Number(position) / Number(divisor);
      return sum + value;
    }, 0);

    return positionsInDollars > 0 ? round(positionsInDollars) : undefined;
  }, [address, data, isLoading]);

  return {
    data: totalPosition,
    isLoading,
    refetchData: refetch,
  };
};

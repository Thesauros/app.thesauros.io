import { useMemo } from 'react';
import { useContractsRead } from './core/useContractsRead';
import { vaults } from './config';
import { TVault } from './core/types';
import { round } from '../number/round';
import { useAccount } from './useAccount';

type TVaultPositionResult = {
  data: number | undefined;
  isLoading: boolean;
};

export const useVaultsPosition = (): TVaultPositionResult => {
  const { address } = useAccount();

  const contracts = (address ? vaults : []).map((vault: TVault) => ({
    address: vault.vaultAddress,
    functionName: 'getBalanceOfAsset',
    args: [address],
    chainID: vault.chainID,
    watch: true,
  }));

  const { data, isLoading } = useContractsRead<bigint>({
    contracts,
    watch: true,
  });

  const totalPosition = useMemo(() => {
    if (!address) return undefined;
    if (isLoading) return undefined;

    const validResults = data?.filter((value): value is bigint => value !== undefined) || [];
    if (validResults.length === 0) return undefined;

    const positionsInDollars = validResults.map((position, index) => {
      const vault = vaults[index];
      const divisor = BigInt(10 ** vault.decimals);
      const value = Number(position) / Number(divisor);
      return value;
    });

    return round(positionsInDollars.reduce((sum, v) => sum + v, 0));
  }, [address, data, isLoading]);

  return {
    data: totalPosition,
    isLoading,
  };
};

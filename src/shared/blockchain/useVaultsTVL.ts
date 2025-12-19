import { useMemo } from 'react';
import { useContractsRead } from './core/useContractsRead';
import { vaults } from './config';
import { TVault } from './core/types';
import { round } from '../number/round';

type TVaultTVLResult = {
  data: number | undefined;
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
};

export const useVaultsTVL = (): TVaultTVLResult => {
  const contracts = vaults.map((vault: TVault) => ({
    address: vault.vaultAddress,
    functionName: 'totalAssets',
    args: [],
    chainID: vault.chainID,
    staleTime: 1000,
  }));

  const { data, isLoading, error, refetch } = useContractsRead<bigint>({
    contracts,
    staleTime: 1000,
  });

  const totalTVL = useMemo(() => {
    if (isLoading || error) return undefined;

    const validResults = data?.filter((tvl): tvl is bigint => tvl !== undefined) || [];

    if (validResults.length === 0) return undefined;

    const tvlInDollars = validResults.map((tvl, index) => {
      const vault = vaults[index];
      const decimals = vault.decimals;

      const divisor = BigInt(10 ** decimals);
      const tvlInDollars = Number(tvl) / Number(divisor);

      return tvlInDollars;
    });

    return round(tvlInDollars.reduce((sum, tvl) => sum + tvl, 0));
  }, [data, isLoading, error]);

  return {
    data: totalTVL,
    isLoading,
    error,
    refetch,
  };
};

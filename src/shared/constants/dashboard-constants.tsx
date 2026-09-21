import { useMemo } from 'react';
import {
  useVaultsPosition,
  useVaultsTVL,
  useAccount,
  vaults,
  usePerformanceFee,
  PUBLISHED_PERFORMANCE_FEE_PERCENT,
} from '../blockchain';
import { round } from '../number/round';
import { useHighestApr, useUserEarnedOverallTicks } from '../api/dashboard';
import { useOnchainCurrentAPY } from '../blockchain/useOnchainCurrentAPY';

export const useDashboardConstants = () => {
  const { address, chainId } = useAccount();
  const { data } = useUserEarnedOverallTicks({
    interval: 1,
    intervals: 7,
    address: address,
    chainID: chainId ?? 42161,
  });
  const { data: vaultsTVL } = useVaultsTVL();
  const { data: totalPosition } = useVaultsPosition();
  const { data: performerOfTheWeek } = useHighestApr(7);

  const totalEarned = useMemo(() => (data ? round(data[0].value, 6) : 0), [data]);

  const chosenVault = vaults.find(vault => vault.chainID === chainId) ?? vaults[1];

  const apy = useOnchainCurrentAPY({
    vaultAddress: chosenVault.vaultAddress,
    chainID: chosenVault.chainID,
  });

  const { data: performanceFee } = usePerformanceFee({
    vaultAddress: chosenVault.vaultAddress,
    chainID: chosenVault.chainID,
  });

  const performanceFeePercent = performanceFee ?? PUBLISHED_PERFORMANCE_FEE_PERCENT;

  const complexApy = {
    netApy: round(apy * (1 - performanceFeePercent / 100)),
    baseApy: round(apy),
    performanceFeePercent: performanceFeePercent,
  };

  return {
    apy: apy,
    complexApy: complexApy,
    totalPosition: totalPosition ? round(totalPosition) : 0,
    performerOfTheWeek,
    totalEarned,
    vaultsTVL,
  };
};

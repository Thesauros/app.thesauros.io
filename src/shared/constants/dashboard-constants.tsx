import { useMemo } from 'react';
import {
  useVaultsPosition,
  useVaultsTVL,
  useAccount,
  useViewChain,
  vaults,
  usePerformanceFee,
  PUBLISHED_PERFORMANCE_FEE_PERCENT,
} from '../blockchain';
import { round } from '../number/round';
import { useHighestApr, useUserEarnedOverallTicks } from '../api/dashboard';
import { useOnchainCurrentAPY } from '../blockchain/useOnchainCurrentAPY';

export type ComplexApy = {
  netApy: number;
  baseApy: number;
  performanceFeePercent: number;
};

export const useDashboardConstants = () => {
  const { address } = useAccount();
  const { viewChainId } = useViewChain();
  const { data } = useUserEarnedOverallTicks({
    interval: 1,
    intervals: 7,
    address: address,
    chainID: viewChainId,
  });
  const { data: vaultsTVL } = useVaultsTVL();
  const { data: totalPosition } = useVaultsPosition();
  const { data: performerOfTheWeek } = useHighestApr(7);

  const totalEarned = useMemo(() => (data ? round(data[0].value, 6) : 0), [data]);

  const chosenVault = vaults.find(vault => vault.chainID === viewChainId) ?? vaults[1];

  const apy = useOnchainCurrentAPY({
    vaultAddress: chosenVault.vaultAddress,
    chainID: chosenVault.chainID,
  });

  const { data: performanceFee } = usePerformanceFee({
    vaultAddress: chosenVault.vaultAddress,
    chainID: chosenVault.chainID,
  });

  const performanceFeePercent = performanceFee ?? PUBLISHED_PERFORMANCE_FEE_PERCENT;

  const complexApy: ComplexApy = {
    netApy: round(apy * (1 - performanceFeePercent / 100)),
    baseApy: round(apy),
    performanceFeePercent: performanceFeePercent,
  };

  return {
    // The deposit-weighted on-chain yield of the vault, and the same yield net
    // of the performance fee. Both are measured on the same basis as the APR
    // ticks behind the performance chart, so the card and the chart cannot
    // disagree.
    apy: apy,
    complexApy: complexApy,
    totalPosition: totalPosition ? round(totalPosition) : 0,
    performerOfTheWeek,
    totalEarned,
    vaultsTVL,
  };
};

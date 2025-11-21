import { useMemo } from 'react';
import { useVaultsPosition, useVaultsTVL, useAccount, vaults } from '../blockchain';
import { round } from '../number/round';
import { useHighestApr, useUserEarnedOverallicks } from '../api/dashboard';
import { useOnchainCurrentAPY } from '../blockchain/useOnchainCurrentAPY';

export const useDashboardConstants = () => {
  const { address } = useAccount();
  const { data } = useUserEarnedOverallicks({ interval: 1, intervals: 7, address: address });
  const { data: vaultsTVL } = useVaultsTVL();
  const { data: totalPosition } = useVaultsPosition();
  const { data: performerOfTheWeek } = useHighestApr(7);

  const totalEarned = useMemo(() => (data ? round(data[0].value, 6) : 0), [data]);

  const apy = useOnchainCurrentAPY({
    vaultAddress: vaults[0].vaultAddress,
    chainID: vaults[0].chainID,
  });

  const complexApy = {
    netApy: 10 + round(apy % 1),
    baseApy: round(apy),
    rewardApy: round(10 + round(apy % 1) - round(apy)),
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

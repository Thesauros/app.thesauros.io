import { useMemo } from 'react';
import { useVaultsPosition, useVaultsTVL, useAccount, useViewChain, vaults } from '../blockchain';
import { round } from '../number/round';
import { useHighestApr, useUserEarnedOverallTicks } from '../api/dashboard';
import { useOnchainCurrentAPY } from '../blockchain/useOnchainCurrentAPY';

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

  return {
    // The deposit-weighted on-chain yield of the vault. This is the only APY
    // the app shows: it is measured on the same basis as the APR ticks behind
    // the performance chart, so the card and the chart cannot disagree.
    apy: apy,
    totalPosition: totalPosition ? round(totalPosition) : 0,
    performerOfTheWeek,
    totalEarned,
    vaultsTVL,
  };
};

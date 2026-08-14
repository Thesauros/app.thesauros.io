import { TAddress, TChainID } from './core/types';
import { useContractRead } from './core/useContractRead';
import { useContractsRead } from './core/useContractsRead';

export const useOnchainCurrentAPY = ({
  vaultAddress,
  chainID,
}: {
  vaultAddress: TAddress;
  chainID: TChainID;
}) => {
  const { data: providers } = useContractRead({
    address: vaultAddress,
    functionName: 'getProviders',
    chainID: chainID,
    staleTime: 300000,
  });

  const providerAddresses = (providers as TAddress[] | undefined) ?? [];

  const { data: balancesAndRates } = useContractsRead<bigint>({
    contracts: providerAddresses.flatMap(providerAddress => [
      {
        address: providerAddress,
        functionName: 'getDepositBalance',
        args: [vaultAddress, vaultAddress],
        chainID: chainID,
      },
      {
        address: providerAddress,
        functionName: 'getDepositRate',
        args: [vaultAddress],
        chainID: chainID,
      },
    ]),
    staleTime: 300000,
  });

  if (!balancesAndRates || providerAddresses.length === 0) {
    return 0;
  }

  // A Rebalancer vault can hold its position across several providers at once,
  // so the vault's real APY is the deposit-weighted average across the providers
  // it actually has a balance in — not just the entry provider's rate.
  let totalBalance = 0;
  let weightedApySum = 0;

  providerAddresses.forEach((_, index) => {
    const balance = Number(balancesAndRates[index * 2] ?? BigInt(0));
    const apy = Number(balancesAndRates[index * 2 + 1] ?? BigInt(0)) / 10 ** 25;

    totalBalance += balance;
    weightedApySum += balance * apy;
  });

  return totalBalance > 0 ? weightedApySum / totalBalance : 0;
};

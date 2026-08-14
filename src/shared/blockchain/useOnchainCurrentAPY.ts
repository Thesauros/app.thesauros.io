import { TAddress, TChainID } from './core/types';
import { useContractRead } from './core/useContractRead';

export const useOnchainCurrentAPY = ({
  vaultAddress,
  chainID,
}: {
  vaultAddress: TAddress;
  chainID: TChainID;
}) => {
  const { data: activeProvider } = useContractRead({
    address: vaultAddress,
    functionName: 'getEntryProvider',
    chainID: chainID,
    staleTime: 300000,
  });

  const { data: depositRate } = useContractRead({
    address: activeProvider as TAddress,
    functionName: 'getDepositRate',
    chainID: chainID,
    args: [vaultAddress as TAddress],
    staleTime: 300000,
    isEnabled: activeProvider !== undefined,
  });

  return depositRate ? Number(depositRate) / 10 ** 25 : 0;
};

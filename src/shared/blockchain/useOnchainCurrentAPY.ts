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
    functionName: 'activeProvider',
    chainID: chainID,
    staleTime: 1000,
  });

  const { data: depositRate } = useContractRead({
    address: activeProvider as TAddress,
    functionName: 'getDepositRate',
    chainID: chainID,
    args: [vaultAddress as TAddress],
    staleTime: 1000,
  });

  return depositRate ? Number(depositRate) / 10 ** 25 : 0;
};

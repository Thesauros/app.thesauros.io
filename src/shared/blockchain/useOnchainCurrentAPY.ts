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
  });

  const { data: depositRate } = useContractRead({
    address: activeProvider as TAddress,
    functionName: 'getDepositRate',
    chainID: chainID,
    args: [vaultAddress as TAddress],
  });

  return depositRate ? Number(depositRate) / 10 ** 25 : 0;
};

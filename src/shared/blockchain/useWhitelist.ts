import { TVault } from './core/types';
import { useContractRead } from './core/useContractRead';
import { useAccount } from './useAccount';

export const useWhitelist = (vault: TVault) => {
  const { address, isConnected } = useAccount();

  const { data: isWhitelisted } = useContractRead({
    address: vault.vaultAddress,
    functionName: 'isWhitelisted',
    args: [address],
    chainID: vault.chainID,
    isEnabled: isConnected,
  });

  return isWhitelisted;
};

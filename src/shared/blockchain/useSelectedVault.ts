import { useAccount } from 'wagmi';
import { vaults, getVaultByChainId, DEFAULT_VAULT_INDEX } from './config';
import { TVault } from './core/types';

export const useSelectedVault = (): TVault => {
  const { chainId } = useAccount();

  return getVaultByChainId(chainId ?? 0) ?? vaults[DEFAULT_VAULT_INDEX];
};

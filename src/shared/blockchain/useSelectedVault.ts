import { vaults, getVaultByChainId, DEFAULT_VAULT_INDEX } from './config';
import { TVault } from './core/types';
import { useViewChain } from './useViewChain';

export const useSelectedVault = (): TVault => {
  const { viewChainId } = useViewChain();

  return getVaultByChainId(viewChainId) ?? vaults[DEFAULT_VAULT_INDEX];
};

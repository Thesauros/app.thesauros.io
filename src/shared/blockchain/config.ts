import { TVault, TAddress } from './core/types';
import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import * as wagmiChains from 'wagmi/chains';
import { type Chain } from 'viem';

const allChains = Object.values(wagmiChains).filter(
  chain => typeof chain === 'object' && chain !== null && 'id' in chain
) as unknown as [Chain, ...Chain[]];

const walletConnectProjectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID;

if (!walletConnectProjectId) {
  throw new Error('NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID is not defined in environment variables');
}

export const wagmiConfig = getDefaultConfig({
  appName: 'thesauros',
  projectId: walletConnectProjectId,
  chains: allChains,
  ssr: true,
});

/**
 * Vault configuration - single source of truth for all vault data.
 * To add a new vault, simply add a new entry to this array.
 */
export const vaults: TVault[] = [
  {
    chainID: 42161,
    chainName: 'Arbitrum One',
    decimals: 6,
    vaultAddress: '0x57C10bd3fdB2849384dDe954f63d37DfAD9d7d70' as TAddress,
    coinName: 'USDC',
    coinAddress: '0xaf88d065e77c8cc2239327c5edb3a432268e5831' as TAddress,
  },
  {
    chainID: 8453,
    chainName: 'Base',
    decimals: 6,
    vaultAddress: '0x6C7013b3596623d146781c90b4Ee182331Af6148' as TAddress,
    coinName: 'USDC',
    coinAddress: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913' as TAddress,
  },
] as const;

/**
 * Helper to get vault by chain ID
 */
export const getVaultByChainId = (chainId: number): TVault | undefined => {
  return vaults.find(vault => vault.chainID === chainId);
};

/**
 * Helper to get all supported chain IDs
 */
export const getSupportedChainIds = (): number[] => {
  return vaults.map(vault => vault.chainID);
};

/**
 * Default vault index (used when chain is not supported)
 */
export const DEFAULT_VAULT_INDEX = 1;

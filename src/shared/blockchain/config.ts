import { TVault, TAddress } from './core/types';
import { createConfig } from '@privy-io/wagmi';
import { mainnet, arbitrum, base } from 'viem/chains';
import { http } from 'wagmi';

const moralisApiKey = process.env.NEXT_PUBLIC_MORALIS_API_KEY;

export const wagmiConfig = createConfig({
  chains: [mainnet, arbitrum, base],
  transports: moralisApiKey
    ? {
        // Moralis RPC for Ethereum mainnet (better simulation support)
        [mainnet.id]: http(`https://site1.moralis-nodes.com/eth/${moralisApiKey}`),
        // Default public RPCs for L2s
        [arbitrum.id]: http(),
        [base.id]: http(),
      }
    : {
        // Default public RPCs for all chains
        [mainnet.id]: http(),
        [arbitrum.id]: http(),
        [base.id]: http(),
      },
});

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
  {
    chainID: 1,
    chainName: 'Ethereum',
    decimals: 6,
    vaultAddress: '0x839E57080C18195D8D343a02c2f623b5916f7383' as TAddress,
    coinName: 'USDC',
    coinAddress: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48' as TAddress,
  },
] as const;

export const getVaultByChainId = (chainId: number): TVault | undefined => {
  return vaults.find(vault => vault.chainID === chainId);
};

export const getSupportedChainIds = (): number[] => {
  return vaults.map(vault => vault.chainID);
};

export const DEFAULT_VAULT_INDEX = 1;

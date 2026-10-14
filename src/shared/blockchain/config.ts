import { TVault, TAddress } from './core/types';
import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { mainnet, arbitrum, base, monad, plasma } from 'wagmi/chains';
import { http } from 'viem';

const walletConnectProjectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID;
const moralisApiKey = process.env.NEXT_PUBLIC_MORALIS_API_KEY;
const plasmaRpcUrl = process.env.NEXT_PUBLIC_PLASMA_RPC_URL;
const monadRpcUrl = process.env.NEXT_PUBLIC_MONAD_RPC_URL;

if (!walletConnectProjectId) {
  throw new Error('NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID is not defined in environment variables');
}

export const wagmiConfig = getDefaultConfig({
  appName: 'thesauros',
  projectId: walletConnectProjectId,
  chains: [mainnet, arbitrum, base, plasma, monad],
  transports: {
    [mainnet.id]: moralisApiKey
      ? http(`https://site1.moralis-nodes.com/eth/${moralisApiKey}`)
      : http(),
    [arbitrum.id]: http(),
    [base.id]: http(),
    [plasma.id]: plasmaRpcUrl ? http(plasmaRpcUrl) : http(),
    [monad.id]: monadRpcUrl ? http(monadRpcUrl) : http(),
  },
  ssr: true,
});

export const vaults: TVault[] = [
  {
    chainID: 42161,
    chainName: 'Arbitrum One',
    decimals: 6,
    vaultAddress: '0x4E5c0A4C11d713002D74bA43a458efc31bc76378' as TAddress,
    coinName: 'USDC',
    coinAddress: '0xaf88d065e77c8cc2239327c5edb3a432268e5831' as TAddress,
  },
  {
    chainID: 8453,
    chainName: 'Base',
    decimals: 6,
    vaultAddress: '0x3C7739173cca612B6394EE57131458185A5beC44' as TAddress,
    coinName: 'USDC',
    coinAddress: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913' as TAddress,
  },
  {
    chainID: 1,
    chainName: 'Ethereum',
    decimals: 6,
    vaultAddress: '0xc3156Da39EeEa9De80F1d74b497C0E4A7030Aae3' as TAddress,
    coinName: 'USDC',
    coinAddress: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48' as TAddress,
  },
  {
    chainID: 9745,
    chainName: 'Plasma',
    decimals: 6,
    vaultAddress: '0x2Ed9B7fB6Bbe0920145B2a79c18C3f7cFCAE3C99' as TAddress,
    coinName: 'USDT0',
    coinAddress: '0xB8CE59FC3717ada4C02eaDF9682A9e934F625ebb' as TAddress,
  },
  {
    chainID: 143,
    chainName: 'Monad',
    decimals: 6,
    vaultAddress: '0x40F1fBf6a92155a6D321c09936234BFEb9Ec4760' as TAddress,
    coinName: 'USDC',
    coinAddress: '0x754704Bc059F8C67012fEd69BC8A327a5aafb603' as TAddress,
  },
] as const;

export const getVaultByChainId = (chainId: number): TVault | undefined => {
  return vaults.find(vault => vault.chainID === chainId);
};

export const getSupportedChainIds = (): number[] => {
  return vaults.map(vault => vault.chainID);
};

export const DEFAULT_VAULT_INDEX = 1;

import { TVault } from './core/types';
import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { mainnet, polygon, optimism, arbitrum, base } from 'wagmi/chains';

export const wagmiConfig = getDefaultConfig({
  appName: 'thesauros',
  projectId: 'c251732975350cbb92d74a64f88273c0',
  chains: [mainnet, polygon, optimism, arbitrum, base],
  ssr: true,
});

export const config = {
  networks: [
    {
      chainId: 42161,
      chainName: 'Arbitrum One',
      vaults: [
        {
          coin: 'USDT',
          decimals: 6,
          address: '0x648b8780B4F05C4a3d91960ba216e014453521Df',
          coinAddress: '0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9',
        },
        {
          coin: 'USDC',
          decimals: 6,
          address: '0xA69AC7E2216B0924Fd50f7a9fdDeB98ecC64d76D',
          coinAddress: '0xaf88d065e77c8cc2239327c5edb3a432268e5831',
        },
      ],
    },
    {
      chainId: 8453,
      chainName: 'Base',
      vaults: [
        {
          coin: 'USDC',
          decimals: 6,
          address: '0x386b6872358981f199BF23f12c369dB26a5F2869',
          coinAddress: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
        },
      ],
    },
  ],
};

export const vaults: TVault[] = [
  // {
  //   chainID: 42161,
  //   chainName: 'Arbitrum One',
  //   decimals: 6,
  //   vaultAddress: '0x648b8780B4F05C4a3d91960ba216e014453521Df',
  //   coinName: 'USDT',
  //   coinAddress: '0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9',
  // },
  {
    chainID: 42161,
    chainName: 'Arbitrum One',
    decimals: 6,
    vaultAddress: '0xA69AC7E2216B0924Fd50f7a9fdDeB98ecC64d76D',
    coinName: 'USDC',
    coinAddress: '0xaf88d065e77c8cc2239327c5edb3a432268e5831',
  },
  // {
  //   chainID: 8453,
  //   chainName: 'Base',
  //   decimals: 6,
  //   vaultAddress: '0x386b6872358981f199BF23f12c369dB26a5F2869',
  //   coinName: 'USDC',
  //   coinAddress: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
  // },
];

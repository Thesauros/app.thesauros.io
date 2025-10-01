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
          address: '0xcd72118C0707D315fa13350a63596dCd9B294A30',
          coinAddress: '0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9',
        },
        {
          coin: 'USDC',
          decimals: 6,
          address: '0x57C10bd3fdB2849384dDe954f63d37DfAD9d7d70',
          coinAddress: '0xaf88d065e77c8cc2239327c5edb3a432268e5831',
        },
      ],
    },
    // {
    //   chainId: 8453,
    //   chainName: 'Base',
    //   vaults: [
    //     {
    //       coin: 'USDC',
    //       decimals: 6,
    //       address: '0x4C7e55689aCcC42562E113e04c3BDe1B2eb76622',
    //       coinAddress: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
    //     },
    //   ],
    // },
  ],
};

export const vaults: TVault[] = [
  {
    chainID: 42161,
    chainName: 'Arbitrum One',
    decimals: 6,
    vaultAddress: '0xcd72118C0707D315fa13350a63596dCd9B294A30',
    coinName: 'USDT',
    coinAddress: '0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9',
  },
  {
    chainID: 42161,
    chainName: 'Arbitrum One',
    decimals: 6,
    vaultAddress: '0x57C10bd3fdB2849384dDe954f63d37DfAD9d7d70',
    coinName: 'USDC',
    coinAddress: '0xaf88d065e77c8cc2239327c5edb3a432268e5831',
  },
  // {
  //   chainID: 8453,
  //   chainName: 'Base',
  //   decimals: 6,
  //   vaultAddress: '0x4C7e55689aCcC42562E113e04c3BDe1B2eb76622',
  //   coinName: 'USDC',
  //   coinAddress: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
  // },
];

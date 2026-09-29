import type { TAddress } from '../core/types';

/**
 * Cross-chain vault (hub on Base). Set after deployment:
 *   NEXT_PUBLIC_CROSSCHAIN_VAULT    EpochVault proxy address on Base
 *   NEXT_PUBLIC_CROSSCHAIN_API_URL  ops indexer base URL (e.g. https://xc-indexer.example.com)
 * The page is hidden from the menu while the vault address is not configured.
 */
export const CROSSCHAIN = {
  chainId: 8453 as const,
  chainName: 'Base',
  vaultAddress: (process.env.NEXT_PUBLIC_CROSSCHAIN_VAULT ?? '') as TAddress,
  assetAddress: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913' as TAddress,
  assetSymbol: 'USDC',
  /** Fallback only: the live symbol comes from the indexer, because the stand is `tcUSDC-stand`. */
  shareSymbol: 'tcUSDC',
  decimals: 6,
  apiUrl: process.env.NEXT_PUBLIC_CROSSCHAIN_API_URL ?? '',
  explorer: 'https://basescan.org',
};

export const isCrossChainEnabled = () =>
  CROSSCHAIN.vaultAddress.length === 42 && CROSSCHAIN.apiUrl !== '';

/** Rates are asset units per share scaled by 1e18. */
export const RATE_SCALE = BigInt('1000000000000000000');

export type TChainMeta = {
  name: string;
  explorer: string;
  logo: string;
  /** What this network holds, in one sentence a non-technical reader can parse. */
  hubRole: string;
  spokeRole: string;
};

/** Chain ids the vault can span. Unknown ids fall back to a neutral label. */
export const CROSSCHAIN_META: Record<number, TChainMeta> = {
  8453: {
    name: 'Base',
    explorer: 'https://basescan.org',
    logo: 'https://icons.llamao.fi/icons/chains/rsz_base.jpg',
    hubRole: 'Where your shares and the queue live',
    spokeRole: 'Where part of the fund earns yield',
  },
  42161: {
    name: 'Arbitrum',
    explorer: 'https://arbiscan.io',
    logo: 'https://icons.llamao.fi/icons/chains/rsz_arbitrum.jpg',
    hubRole: 'Where your shares and the queue live',
    spokeRole: 'Where part of the fund earns yield',
  },
};

export const chainMeta = (chainId: number | null | undefined) =>
  (chainId !== null && chainId !== undefined ? CROSSCHAIN_META[chainId] : undefined) ?? {
    name: chainId ? `Chain ${chainId}` : 'Unknown network',
    explorer: CROSSCHAIN.explorer,
    logo: '',
    hubRole: '',
    spokeRole: '',
  };

export const explorerTx = (chainId: number | null | undefined, hash: string) =>
  `${chainMeta(chainId).explorer}/tx/${hash}`;

export const explorerAddress = (chainId: number | null | undefined, address: string) =>
  `${chainMeta(chainId).explorer}/address/${address}`;

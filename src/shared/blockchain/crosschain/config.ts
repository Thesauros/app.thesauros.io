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
  shareSymbol: 'tcUSDC',
  decimals: 6,
  apiUrl: process.env.NEXT_PUBLIC_CROSSCHAIN_API_URL ?? '',
  explorer: 'https://basescan.org',
};

export const isCrossChainEnabled = () =>
  CROSSCHAIN.vaultAddress.length === 42 && CROSSCHAIN.apiUrl !== '';

/** Rates are asset units per share scaled by 1e18. */
export const RATE_SCALE = BigInt('1000000000000000000');

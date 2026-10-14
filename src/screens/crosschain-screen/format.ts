import { formatUnits } from 'viem';
import { CROSSCHAIN, RATE_SCALE } from '@/shared/blockchain/crosschain/config';

/**
 * Conversions and formatting for the deposit/withdraw panel.
 *
 * Display formatting for the visualisation lives in `model/money.ts`; only the share<->asset
 * conversions and the input-field helpers belong here, because they are about the form rather
 * than about presenting chain state.
 */

/** Base-unit string/bigint -> human number string with up to `digits` decimals. */
export const fmtUnits = (
  value: string | bigint | undefined,
  digits = 2,
  decimals = CROSSCHAIN.decimals
) => {
  if (value === undefined || value === '') return '—';
  const n = Number(formatUnits(BigInt(value), decimals));
  return n.toLocaleString('en-US', {
    maximumFractionDigits: digits,
    minimumFractionDigits: Math.min(2, digits),
  });
};

export const shortHash = (h?: string | null) => (h ? `${h.slice(0, 6)}…${h.slice(-4)}` : '');

export const txUrl = (hash: string) => `${CROSSCHAIN.explorer}/tx/${hash}`;

/** assets = shares * rate / 1e18 */
export const sharesToAssets = (shares: bigint, rate: bigint) => (shares * rate) / RATE_SCALE;

export const assetsToShares = (assets: bigint, rate: bigint) =>
  rate === BigInt(0) ? BigInt(0) : (assets * RATE_SCALE) / rate;

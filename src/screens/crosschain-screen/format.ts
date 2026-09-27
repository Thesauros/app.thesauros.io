import { formatUnits } from 'viem';
import { CROSSCHAIN, RATE_SCALE } from '@/shared/blockchain/crosschain/config';

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

/** 1e18-scaled rate -> "1.000123". */
export const fmtRate = (rate: string | bigint | undefined) =>
  rate === undefined
    ? '—'
    : (Number((BigInt(rate) * BigInt(1_000_000)) / RATE_SCALE) / 1e6).toFixed(6);

export const fmtApr = (v: number | null | undefined) =>
  v === null || v === undefined ? '—' : `${(v * 100).toFixed(2)}%`;

export const fmtDuration = (seconds: number) => {
  if (seconds <= 0) return 'now';
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
};

export const shortHash = (h?: string | null) => (h ? `${h.slice(0, 6)}…${h.slice(-4)}` : '');

export const txUrl = (hash: string) => `${CROSSCHAIN.explorer}/tx/${hash}`;

/** assets = shares * rate / 1e18 */
export const sharesToAssets = (shares: bigint, rate: bigint) => (shares * rate) / RATE_SCALE;
export const assetsToShares = (assets: bigint, rate: bigint) =>
  rate === BigInt(0) ? BigInt(0) : (assets * RATE_SCALE) / rate;

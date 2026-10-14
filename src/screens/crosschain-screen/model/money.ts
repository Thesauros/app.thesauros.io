import { formatUnits } from 'viem';
import type {
  TCrossChainAllocation,
  TCrossChainTick,
  TCrossChainVault,
} from '@/shared/api/crosschain';
import { CROSSCHAIN, RATE_SCALE } from '@/shared/blockchain/crosschain/config';

/**
 * Where the fund's assets physically are, as segments of one bar.
 *
 * The segments must not double count. `accounting.cash` already contains the queued deposits
 * and the cash set aside for withdrawals, so those are a breakdown of the vault segment, not
 * siblings of it. Everything here sums to the gross assets the fund controls.
 */
export type TSegmentId = 'vault' | 'lending' | 'idle' | 'transit';

export type TSegment = {
  id: TSegmentId;
  label: string;
  hint: string;
  amount: bigint;
};

const sum = (values: bigint[]) => values.reduce((a, b) => a + b, BigInt(0));

const toBigInt = (v: string | bigint | null | undefined) => {
  if (typeof v === 'bigint') return v;
  try {
    return v === null || v === undefined || v === '' ? BigInt(0) : BigInt(v);
  } catch {
    return BigInt(0);
  }
};

/** Capital that has left one network and not yet arrived on the other, at the sent amount. */
export const inFlightTotal = (allocation?: TCrossChainAllocation) =>
  sum((allocation?.inFlight ?? []).map(t => toBigInt(t.amount)));

/** Everything the fund controls, wherever it sits. */
export const grossAssets = (vault?: TCrossChainVault, allocation?: TCrossChainAllocation) =>
  sum([
    toBigInt(vault?.accounting.cash),
    ...(allocation?.chains ?? []).map(c => toBigInt(c.idle) + toBigInt(c.strategyValue)),
    inFlightTotal(allocation),
  ]);

/**
 * Live net value, recomputed with the same arithmetic the on-chain snapshot uses:
 * assets minus what is queued but unpriced and minus what is owed to exiting users.
 *
 * This is fresher than `tick.navBid`, which is only as current as the last published tick
 * (up to `risk.maxTickAge` old, and stale by design right after a large deposit clears).
 */
export const liveNav = (vault?: TCrossChainVault, allocation?: TCrossChainAllocation) => {
  const owed = toBigInt(vault?.accounting.liabilities);
  const queued = toBigInt(vault?.accounting.pendingDeposits);
  const nav = grossAssets(vault, allocation) - queued - owed;
  return nav > BigInt(0) ? nav : BigInt(0);
};

/** Cash owed to withdrawals that were priced but not yet funded. */
export const unfundedOwed = (vault?: TCrossChainVault) => {
  const d = toBigInt(vault?.accounting.liabilities) - toBigInt(vault?.accounting.reserved);
  return d > BigInt(0) ? d : BigInt(0);
};

export const segmentsOf = (
  vault?: TCrossChainVault,
  allocation?: TCrossChainAllocation
): TSegment[] => {
  const chains = allocation?.chains ?? [];
  return [
    {
      id: 'vault',
      label: 'In the vault',
      hint: 'Held on Base as USDC. Covers instant exits, queued deposits and withdrawals ready to be paid.',
      amount: toBigInt(vault?.accounting.cash),
    },
    {
      id: 'lending',
      label: 'Earning yield',
      hint: 'Deposited into lending markets (Aave, Compound, Morpho) across the connected networks.',
      amount: sum(chains.map(c => toBigInt(c.strategyValue))),
    },
    {
      id: 'idle',
      label: 'Idle on networks',
      hint: "Held by the fund's wallet on a network but not yet put to work.",
      amount: sum(chains.map(c => toBigInt(c.idle))),
    },
    {
      id: 'transit',
      label: 'In transit',
      hint: 'Moving between networks right now. Counted at what is guaranteed to arrive.',
      amount: inFlightTotal(allocation),
    },
  ];
};

/** Breakdown of the vault cash segment; these three sum to `accounting.cash`. */
export const vaultCashBreakdown = (vault?: TCrossChainVault) => ({
  available: toBigInt(vault?.accounting.freeCash),
  queued: toBigInt(vault?.accounting.pendingDeposits),
  setAside: toBigInt(vault?.accounting.reserved),
});

/**
 * The cash `pushToAgent` may never take: the larger of the absolute floor and the NAV ratio.
 * This is the protocol's answer to "why is cash sitting idle" — it is the liquidity that lets an
 * instant exit and the first payout of a batch be honoured without selling anything.
 */
export const safetyBuffer = (vault?: TCrossChainVault) => {
  if (!vault) return BigInt(0);
  const absolute = toBigInt(vault.limits.minimumBuffer);
  const ratio = (toBigInt(vault.tick.navBid) * toBigInt(vault.limits.minBufferRatio)) / RATE_SCALE;
  return absolute > ratio ? absolute : ratio;
};

/** Free cash above the safety buffer: what the executor could still put to work right now. */
export const deployableHeadroom = (vault?: TCrossChainVault) => {
  const h = toBigInt(vault?.accounting.freeCash) - safetyBuffer(vault);
  return h > BigInt(0) ? h : BigInt(0);
};

/**
 * Share of gross assets that is actually in lending markets.
 *
 * In-transit and queued capital are deliberately excluded: neither earns while it is moving or
 * waiting to be priced, so counting them would flatter the number.
 */
export const utilization = (vault?: TCrossChainVault, allocation?: TCrossChainAllocation) => {
  const gross = grossAssets(vault, allocation);
  if (gross <= BigInt(0)) return null;
  const deployed = sum((allocation?.chains ?? []).map(c => toBigInt(c.strategyValue)));
  return Number((deployed * BigInt(1_000_000)) / gross) / 1e6;
};

/** Total shares outstanding valued at the last published exit price. */
export const supplyValue = (vault?: TCrossChainVault) =>
  (toBigInt(vault?.totalSupply) * toBigInt(vault?.tick.rateBid)) / RATE_SCALE;

export type TApr = { value: number | null; sinceSeconds: number | null };

const YEAR = 365 * 24 * 3600;

/**
 * Annualized share-price growth over whatever history actually exists.
 *
 * Computed here rather than taken from `/v1/vault.apr`, because that endpoint falls back to
 * the earliest tick when a 7- or 30-day window is not available yet and reports both figures
 * identically — which reads as a measured 7d/30d APR when it is not. Returning the window
 * alongside the number lets the UI label it honestly.
 */
export const aprFromTicks = (ticks?: TCrossChainTick[], now?: number): TApr => {
  const accepted = (ticks ?? [])
    .filter(t => t.status === 1 || t.status === 3)
    .sort((a, b) => a.committed_at - b.committed_at);
  if (accepted.length < 2) return { value: null, sinceSeconds: null };
  const first = accepted[0];
  const last = accepted[accepted.length - 1];
  const seconds = last.committed_at - first.committed_at;
  const rateThen = toBigInt(first.rate_bid);
  const rateNow = toBigInt(last.rate_bid);
  if (seconds < 3600 || rateThen === BigInt(0)) return { value: null, sinceSeconds: seconds };
  const growth = Number((rateNow * BigInt(1e9)) / rateThen) / 1e9;
  const reference = now ?? Math.floor(Date.now() / 1000);
  return {
    value: Math.pow(growth, YEAR / seconds) - 1,
    sinceSeconds: Math.max(seconds, reference - first.committed_at),
  };
};

/**
 * Base-unit string -> display string.
 *
 * Money always shows two decimals: a figure that reads "7" beside one that reads "1.000007"
 * invites the reader to trust the wrong precision. Values below one cent keep their significant
 * digits instead, because rounding them to 0.00 would hide that anything happened at all.
 */
export const fmtAmount = (
  value: string | bigint | undefined | null,
  decimals = CROSSCHAIN.decimals
) => {
  const v = toBigInt(value);
  const n = Number(formatUnits(v, decimals));
  if (n === 0) return '0.00';
  if (n > 0 && n < 0.01) return n.toFixed(6).replace(/0+$/, '').replace(/\.$/, '');
  return n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

export const fmtRate = (rate: string | bigint | undefined | null) => {
  const v = toBigInt(rate);
  if (v === BigInt(0)) return '—';
  return (Number((v * BigInt(1_000_000)) / RATE_SCALE) / 1e6).toFixed(6);
};

export const fmtPct = (v: number | null | undefined, digits = 2) =>
  v === null || v === undefined || Number.isNaN(v) ? '—' : `${(v * 100).toFixed(digits)}%`;

/** Human duration; trailing zero units are dropped so a range reads "1h – 2h", not "1h 0m". */
export const fmtDuration = (seconds: number) => {
  if (!Number.isFinite(seconds) || seconds <= 0) return 'now';
  const d = Math.floor(seconds / 86400);
  const h = Math.floor((seconds % 86400) / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  if (d > 0) return h > 0 ? `${d}d ${h}h` : `${d}d`;
  if (h > 0) return m > 0 ? `${h}h ${m}m` : `${h}h`;
  if (m > 0) return s > 0 ? `${m}m ${s}s` : `${m}m`;
  return `${s}s`;
};

/** Compact duration for "updated Xs ago" counters. */
export const fmtAgo = (seconds: number) => {
  if (!Number.isFinite(seconds) || seconds < 0) return '—';
  if (seconds < 60) return `${Math.floor(seconds)}s ago`;
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
};

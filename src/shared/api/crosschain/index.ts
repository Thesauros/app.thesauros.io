import { useQuery } from '@tanstack/react-query';
import { customFetch } from '@/shared/api/core';
import { CROSSCHAIN, isCrossChainEnabled } from '@/shared/blockchain/crosschain/config';

/** Types of the ops indexer API (optimized-rebalancer-contracts, ops/src/indexer.ts). Amounts are base-unit strings. */
export type TCrossChainVault = {
  chainId: number;
  vault: string;
  asset: string;
  /** Live on-chain share symbol; the stand reports `tcUSDC-stand`. */
  symbol: string;
  decimals: number;
  profile: string;
  totalSupply: string;
  tick: {
    id: number;
    rateBid: string;
    rateOffer: string;
    navBid: string;
    navOffer: string;
    committedAt: number;
    /** Null while nothing has been published yet (tick id 0 is the synthetic launch tick). */
    ageSeconds: number | null;
    flags: number;
    frozen: boolean;
    quarantined: boolean;
  };
  /** Thresholds needed to judge the tick and the in-flight capital honestly. */
  risk: {
    maxTickAge: number;
    maxTransit: number;
    maxSpread: string;
    maxInFlightRatio: string;
  };
  apr: { d7: number | null; d30: number | null };
  epoch: {
    id: number;
    openedAt: number;
    earliestCloseAt: number;
    latestCloseAt: number;
    depositAssets: string;
    redeemShares: string;
  };
  accounting: {
    cash: string;
    pendingDeposits: string;
    liabilities: string;
    reserved: string;
    freeCash: string;
  };
  limits: {
    minDeposit: string;
    maxEpochDeposits: string;
    /** Cash the executor may never push out, absolute floor. */
    minimumBuffer: string;
    /** Same floor as a fraction of NAV; the binding one is the larger of the two. */
    minBufferRatio: string;
    maxInstantWithdrawal: string;
    dailyInstantLimit: string;
    instantFee: string;
    instantRemainingEstimate: string;
  };
  epochConfig: {
    minDuration: number;
    maxDuration: number;
    minTicks: number;
    maxClearingDelay: number;
  };
  now: number;
};

export type TRequestState =
  | 'pending'
  | 'clearing'
  | 'awaiting_liquidity'
  | 'claimable'
  | 'claimed'
  | 'cancelled';

export type TCrossChainRequest = {
  id: number;
  kind: 'deposit' | 'redeem';
  owner: string;
  receiver: string;
  epoch: number;
  amount: string;
  state: TRequestState;
  cancellable: boolean;
  claimable: string;
  claimedAmount: string | null;
  requestedAt: number;
  requestedTx: string;
  claimedTx: string | null;
  epochClosedAt: number | null;
};

export type TCrossChainUser = {
  address: string;
  shares: string;
  valueBid: string;
  requests: TCrossChainRequest[];
  instantExits: { tx: string; shares: string; assets: string; time: number }[];
};

/** Raw SQLite rows: snake_case, unlike every other endpoint. */
export type TCrossChainTick = {
  id: number;
  status: number;
  flags: number;
  reference_time: number;
  hub_block: number;
  rate_bid: string;
  rate_offer: string;
  nav_bid: string;
  nav_offer: string;
  nav_hash: string;
  committed_at: number;
  tx: string;
};

export type TCrossChainProvider = {
  address: string;
  identifier: string;
  /** Registry name, which is what distinguishes the three Morpho vaults sharing one identifier. */
  label: string | null;
  /** 0 means uncapped, not "zero allowed". */
  capBps: number;
  agentShare: string;
};

export type TCrossChainChain = {
  chainId: number;
  network: string;
  role: 'hub' | 'spoke';
  agent: string;
  idle: string;
  strategy: string;
  strategyValue: string;
  providersHealthy: boolean;
  providers: TCrossChainProvider[];
};

export type TCrossChainTransfer = {
  id: string;
  src_chain: number | null;
  dst_chain: number | null;
  amount: string | null;
  min_receive: string | null;
  rebalance_id: string | null;
  sent_tx: string | null;
  sent_at: number | null;
  received_amount: string | null;
  received_tx: string | null;
  received_at: number | null;
  written_down: string;
  state: 'in_flight' | 'delivered' | 'unknown';
};

export type TCrossChainAllocation = {
  chains: TCrossChainChain[];
  inFlight: TCrossChainTransfer[];
};

export type TActivityType =
  | 'deposit_requested'
  | 'deposit_claimed'
  | 'redeem_requested'
  | 'redeem_claimed'
  | 'request_cancelled'
  | 'instant_exit'
  | 'tick_accepted'
  | 'tick_quarantined'
  | 'tick_ratified'
  | 'bridge_sent'
  | 'bridge_arrived';

/** One line of the public feed. Which optional fields are set depends on `type`. */
export type TCrossChainActivity = {
  time: number;
  type: TActivityType;
  tx: string | null;
  requestId?: number;
  kind?: 'deposit' | 'redeem';
  epoch?: number;
  owner?: string;
  receiver?: string;
  amount?: string;
  tickId?: number;
  rateBid?: string;
  navBid?: string;
  srcChain?: number;
  dstChain?: number;
  shares?: string;
  assets?: string;
};

export type TIndexerHealth = {
  service: string;
  healthy: boolean;
  lastSync: string;
  lastError: string;
  indexedTo: Record<string, number | undefined>;
};

const url = (path: string) => `${CROSSCHAIN.apiUrl}${path}`;

/**
 * Refresh budgets, set per endpoint by what it costs the indexer rather than uniformly.
 * /v1/vault and /v1/activity are cheap; /v1/allocation is ~40 sequential RPC reads with
 * batching disabled, so it is polled gently.
 */
const REFRESH = {
  vault: 15_000,
  activity: 15_000,
  transfers: 30_000,
  ticks: 60_000,
  allocation: 60_000,
  health: 30_000,
};

export const CROSSCHAIN_QUERY_KEYS = {
  vault: ['CROSSCHAIN_VAULT'],
  user: (address?: string) => ['CROSSCHAIN_USER', String(address)],
  ticks: ['CROSSCHAIN_TICKS'],
  allocation: ['CROSSCHAIN_ALLOCATION'],
  activity: ['CROSSCHAIN_ACTIVITY'],
  transfers: ['CROSSCHAIN_TRANSFERS'],
  health: ['CROSSCHAIN_HEALTH'],
};

export const useCrossChainVault = () =>
  useQuery({
    queryKey: CROSSCHAIN_QUERY_KEYS.vault,
    queryFn: () => customFetch<TCrossChainVault>(url('/v1/vault')),
    enabled: isCrossChainEnabled(),
    refetchInterval: REFRESH.vault,
    retry: 0,
  });

export const useCrossChainUser = (address?: string) =>
  useQuery({
    queryKey: CROSSCHAIN_QUERY_KEYS.user(address),
    queryFn: () => customFetch<TCrossChainUser>(url(`/v1/users/${address}`)),
    enabled: isCrossChainEnabled() && !!address,
    refetchInterval: REFRESH.vault,
    retry: 0,
  });

export const useCrossChainTicks = (limit = 500) =>
  useQuery({
    queryKey: CROSSCHAIN_QUERY_KEYS.ticks,
    queryFn: () => customFetch<TCrossChainTick[]>(url(`/v1/ticks?limit=${limit}`)),
    enabled: isCrossChainEnabled(),
    refetchInterval: REFRESH.ticks,
    retry: 0,
  });

export const useCrossChainAllocation = () =>
  useQuery({
    queryKey: CROSSCHAIN_QUERY_KEYS.allocation,
    queryFn: () => customFetch<TCrossChainAllocation>(url('/v1/allocation')),
    enabled: isCrossChainEnabled(),
    refetchInterval: REFRESH.allocation,
    retry: 0,
  });

export const useCrossChainActivity = (limit = 40) =>
  useQuery({
    queryKey: CROSSCHAIN_QUERY_KEYS.activity,
    queryFn: () => customFetch<TCrossChainActivity[]>(url(`/v1/activity?limit=${limit}`)),
    enabled: isCrossChainEnabled(),
    refetchInterval: REFRESH.activity,
    retry: 0,
  });

export const useCrossChainTransfers = (limit = 50) =>
  useQuery({
    queryKey: CROSSCHAIN_QUERY_KEYS.transfers,
    queryFn: () => customFetch<TCrossChainTransfer[]>(url(`/v1/transfers?limit=${limit}`)),
    enabled: isCrossChainEnabled(),
    refetchInterval: REFRESH.transfers,
    retry: 0,
  });

/**
 * 503 while the indexer is behind or erroring, with the same body either way — so this
 * deliberately does not go through customFetch, which throws on a non-2xx and would drop it.
 */
export const useIndexerHealth = () =>
  useQuery({
    queryKey: CROSSCHAIN_QUERY_KEYS.health,
    queryFn: async (): Promise<TIndexerHealth | null> => {
      try {
        const r = await fetch(url('/health'));
        return (await r.json()) as TIndexerHealth;
      } catch {
        return null;
      }
    },
    enabled: isCrossChainEnabled(),
    refetchInterval: REFRESH.health,
    retry: 0,
  });

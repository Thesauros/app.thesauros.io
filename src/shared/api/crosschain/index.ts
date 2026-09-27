import { useQuery } from '@tanstack/react-query';
import { customFetch } from '@/shared/api/core';
import { CROSSCHAIN, isCrossChainEnabled } from '@/shared/blockchain/crosschain/config';

/** Types of the ops indexer API (optimized-rebalancer-contracts, ops/src/indexer.ts). Amounts are base-unit strings. */
export type TCrossChainVault = {
  chainId: number;
  vault: string;
  profile: string;
  totalSupply: string;
  tick: {
    id: number;
    rateBid: string;
    rateOffer: string;
    navBid: string;
    navOffer: string;
    committedAt: number;
    ageSeconds: number;
    flags: number;
    frozen: boolean;
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

export type TCrossChainTick = {
  id: number;
  status: number;
  flags: number;
  reference_time: number;
  rate_bid: string;
  rate_offer: string;
  nav_bid: string;
  committed_at: number;
};

export type TCrossChainAllocation = {
  chains: {
    chainId: number;
    network: string;
    role: 'hub' | 'spoke';
    idle: string;
    strategyValue: string;
    providersHealthy: boolean;
    providers: { address: string; identifier: string; capBps: number; agentShare: string }[];
  }[];
  inFlight: { id: string; src_chain: number; dst_chain: number; amount: string; sent_at: number }[];
};

const url = (path: string) => `${CROSSCHAIN.apiUrl}${path}`;
const REFRESH_MS = 15_000;

export const CROSSCHAIN_QUERY_KEYS = {
  vault: ['CROSSCHAIN_VAULT'],
  user: (address?: string) => ['CROSSCHAIN_USER', String(address)],
  ticks: ['CROSSCHAIN_TICKS'],
  allocation: ['CROSSCHAIN_ALLOCATION'],
};

export const useCrossChainVault = () =>
  useQuery({
    queryKey: CROSSCHAIN_QUERY_KEYS.vault,
    queryFn: () => customFetch<TCrossChainVault>(url('/v1/vault')),
    enabled: isCrossChainEnabled(),
    refetchInterval: REFRESH_MS,
    retry: 0,
  });

export const useCrossChainUser = (address?: string) =>
  useQuery({
    queryKey: CROSSCHAIN_QUERY_KEYS.user(address),
    queryFn: () => customFetch<TCrossChainUser>(url(`/v1/users/${address}`)),
    enabled: isCrossChainEnabled() && !!address,
    refetchInterval: REFRESH_MS,
    retry: 0,
  });

export const useCrossChainTicks = () =>
  useQuery({
    queryKey: CROSSCHAIN_QUERY_KEYS.ticks,
    queryFn: () => customFetch<TCrossChainTick[]>(url('/v1/ticks?limit=500')),
    enabled: isCrossChainEnabled(),
    staleTime: 60_000,
    retry: 0,
  });

export const useCrossChainAllocation = () =>
  useQuery({
    queryKey: CROSSCHAIN_QUERY_KEYS.allocation,
    queryFn: () => customFetch<TCrossChainAllocation>(url('/v1/allocation')),
    enabled: isCrossChainEnabled(),
    staleTime: 60_000,
    retry: 0,
  });

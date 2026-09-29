import type {
  TCrossChainAllocation,
  TCrossChainVault,
  TIndexerHealth,
} from '@/shared/api/crosschain';
import { unfundedOwed } from './money';

export type TLevel = 'ok' | 'warn' | 'crit';

export type TSignal = {
  id: string;
  level: TLevel;
  /** Short label for the status pill. */
  label: string;
  /** One sentence a non-technical reader can act on or at least understand. */
  note: string;
};

/** Tick flag bits, from TickAccountant. */
const FLAG_DOWN_BEYOND_DEPOSIT_LIMIT = 1;
const FLAG_OVERDUE_IN_FLIGHT = 2;
const FLAG_IN_FLIGHT_LIMIT = 4;

const RANK: Record<TLevel, number> = { ok: 0, warn: 1, crit: 2 };

/**
 * System state derived on the client from the indexer's own data.
 *
 * The ops monitor computes a richer check list, but its status port sends no CORS headers, so
 * a browser cannot read it. Everything here is derivable from /v1/vault and /v1/allocation,
 * which the page already fetches, so the signals stay available wherever the API is reachable.
 */
export const signalsOf = (
  vault: TCrossChainVault | undefined,
  allocation: TCrossChainAllocation | undefined,
  health: TIndexerHealth | null | undefined,
  now: number
): TSignal[] => {
  const out: TSignal[] = [];
  if (!vault) {
    out.push({
      id: 'feed.offline',
      level: 'crit',
      label: 'Data feed unavailable',
      note: 'The indexer that reads the blockchain is not answering. On-chain funds are unaffected; this view is simply blind.',
    });
    return out;
  }

  if (health && !health.healthy) {
    out.push({
      id: 'feed.stale',
      level: 'warn',
      label: 'Data may be behind',
      note: 'The indexer has not finished a sync recently, so this page can lag the blockchain.',
    });
  }

  if (vault.profile === 'stand') {
    out.push({
      id: 'profile.stand',
      level: 'warn',
      label: 'Test deployment',
      note: 'This is a test stand with small limits and a single governance key. It is not the production vault.',
    });
  }

  const { tick, risk } = vault;

  if (tick.id === 0) {
    out.push({
      id: 'tick.none',
      level: 'warn',
      label: 'No valuation published yet',
      note: 'The fund has not recorded its first official price reading, so nothing can be priced or paid out yet.',
    });
  } else if (tick.quarantined) {
    out.push({
      id: 'tick.quarantine',
      level: 'crit',
      label: 'Price move under review',
      note: 'The latest reading moved further than the safety corridor allows. It is recorded, but pricing and payouts wait for the next normal reading or a governance decision. Requests are still accepted and funds are safe.',
    });
  } else if (tick.frozen) {
    out.push({
      id: 'tick.frozen',
      level: 'crit',
      label: 'Pricing paused',
      note: 'A guardian stopped pricing on purpose while a valuation is reviewed. You can still cancel an unpriced deposit and collect anything already owed to you.',
    });
  } else if (tick.ageSeconds !== null && tick.ageSeconds > risk.maxTickAge) {
    out.push({
      id: 'tick.stale',
      level: 'crit',
      label: 'Valuation out of date',
      note: 'No new price reading has landed within the allowed window, so pricing and payouts are stopped until one does.',
    });
  } else if (tick.ageSeconds !== null && tick.ageSeconds > risk.maxTickAge * 0.75) {
    out.push({
      id: 'tick.ageing',
      level: 'warn',
      label: 'Valuation ageing',
      note: 'The latest price reading is close to the limit after which pricing pauses.',
    });
  }

  if (tick.flags & FLAG_OVERDUE_IN_FLIGHT) {
    out.push({
      id: 'flag.overdue',
      level: 'crit',
      label: 'A transfer is overdue',
      note: 'Capital moving between networks has been travelling longer than expected. New deposits are not priced and no further transfers are sent until it arrives.',
    });
  }
  if (tick.flags & FLAG_DOWN_BEYOND_DEPOSIT_LIMIT) {
    out.push({
      id: 'flag.down',
      level: 'warn',
      label: 'Deposits wait for the next price',
      note: 'The latest reading fell more than deposits may be priced on. Withdrawals still settle; deposits wait for the next reading.',
    });
  }
  if (tick.flags & FLAG_IN_FLIGHT_LIMIT) {
    out.push({
      id: 'flag.inflight',
      level: 'warn',
      label: 'Bridging paused',
      note: 'Too much capital is in transit at once, so no further transfers are sent until some arrive. Deposits and withdrawals are unaffected.',
    });
  }

  const owed = unfundedOwed(vault);
  if (owed > BigInt(0)) {
    out.push({
      id: 'vault.unfunded',
      level: 'warn',
      label: 'Withdrawals awaiting cash',
      note: 'Some priced withdrawals are waiting for cash to be recalled from the lending markets before they can be paid.',
    });
  }

  const unhealthy = (allocation?.chains ?? []).filter(c => !c.providersHealthy);
  if (unhealthy.length > 0) {
    out.push({
      id: 'strategy.health',
      level: 'crit',
      label: 'A lending market is unavailable',
      note: 'A market on one network is not reporting its balance, so deposits into it are blocked and the valuation shown here may be understated.',
    });
  }

  const overdue = (allocation?.inFlight ?? []).filter(
    t => t.sent_at !== null && now - t.sent_at > risk.maxTransit
  );
  if (overdue.length > 0) {
    out.push({
      id: 'transfer.overdue',
      level: 'warn',
      label: 'Transfer taking longer than usual',
      note: 'A transfer between networks has been in transit beyond the normal window. It is still claimable and counted in the valuation.',
    });
  }

  if (out.length === 0) {
    out.push({
      id: 'ok',
      level: 'ok',
      label: 'Operating normally',
      note: 'Prices are current, all markets are reporting, and nothing is paused.',
    });
  }
  return out;
};

/** The single worst signal, for the status pill. */
export const headline = (signals: TSignal[]): TSignal =>
  signals.reduce((worst, s) => (RANK[s.level] > RANK[worst.level] ? s : worst), signals[0]);

export const worstLevel = (signals: TSignal[]): TLevel => headline(signals).level;

import type { TCrossChainActivity, TActivityType } from '@/shared/api/crosschain';
import { chainMeta } from '@/shared/blockchain/crosschain/config';
import { fmtAmount, fmtRate } from './money';

export type TTone = 'deposit' | 'withdraw' | 'price' | 'bridge';

export type TFeedItem = {
  key: string;
  time: number;
  tone: TTone;
  /** Two or three words, no jargon. */
  title: string;
  detail: string;
  /** Truncated counterparty address, when the event has one. */
  actor?: string;
  /** Network the event belongs to, for bridge legs. */
  place?: string;
  tx?: string | null;
  chainId?: number;
};

const TONE: Record<TActivityType, TTone> = {
  deposit_requested: 'deposit',
  deposit_claimed: 'deposit',
  redeem_requested: 'withdraw',
  redeem_claimed: 'withdraw',
  request_cancelled: 'withdraw',
  instant_exit: 'withdraw',
  tick_accepted: 'price',
  tick_quarantined: 'price',
  tick_ratified: 'price',
  bridge_sent: 'bridge',
  bridge_arrived: 'bridge',
};

const TITLE: Record<TActivityType, string> = {
  deposit_requested: 'Deposit received',
  deposit_claimed: 'Shares issued',
  redeem_requested: 'Withdrawal requested',
  redeem_claimed: 'Withdrawal paid',
  request_cancelled: 'Request cancelled',
  instant_exit: 'Instant withdrawal',
  tick_accepted: 'Price published',
  tick_quarantined: 'Price held for review',
  tick_ratified: 'Price approved',
  bridge_sent: 'Transfer sent',
  bridge_arrived: 'Transfer arrived',
};

const shortAddress = (a?: string) => (a ? `${a.slice(0, 6)}…${a.slice(-4)}` : undefined);

/**
 * One feed row -> one line of plain English.
 *
 * Amounts are quoted in the unit the event actually carries: a deposit request is in USDC, a
 * deposit claim in shares, a redemption request in shares and a redemption payout in USDC.
 * Getting these the wrong way round is the easiest way to mislead a reader here.
 */
export const describe = (
  a: TCrossChainActivity,
  assetSymbol: string,
  shareSymbol: string
): TFeedItem => {
  const base: TFeedItem = {
    key: `${a.type}-${a.tx ?? ''}-${a.time}-${a.requestId ?? a.tickId ?? ''}`,
    time: a.time,
    tone: TONE[a.type],
    title: TITLE[a.type],
    detail: '',
    tx: a.tx,
  };

  switch (a.type) {
    case 'deposit_requested':
      return {
        ...base,
        detail: `${fmtAmount(a.amount)} ${assetSymbol}`,
        actor: shortAddress(a.owner),
      };
    case 'deposit_claimed':
      return {
        ...base,
        detail: `${fmtAmount(a.amount)} ${shareSymbol}`,
        actor: shortAddress(a.receiver),
      };
    case 'redeem_requested':
      return {
        ...base,
        detail: `${fmtAmount(a.amount)} ${shareSymbol}`,
        actor: shortAddress(a.owner),
      };
    case 'redeem_claimed':
      return {
        ...base,
        detail: `${fmtAmount(a.amount)} ${assetSymbol}`,
        actor: shortAddress(a.receiver),
      };
    case 'request_cancelled':
      return {
        ...base,
        detail: `${fmtAmount(a.amount)} ${a.kind === 'deposit' ? assetSymbol : shareSymbol} returned`,
        actor: shortAddress(a.owner),
      };
    case 'instant_exit':
      return {
        ...base,
        detail: `${fmtAmount(a.assets)} ${assetSymbol}`,
        actor: shortAddress(a.owner),
      };
    case 'tick_accepted':
      return { ...base, detail: `#${a.tickId} · ${fmtRate(a.rateBid)} ${assetSymbol} per share` };
    case 'tick_quarantined':
      return { ...base, detail: `#${a.tickId} · moved more than the safety corridor allows` };
    case 'tick_ratified':
      return { ...base, detail: `#${a.tickId} · reviewed and accepted by governance` };
    case 'bridge_sent':
    case 'bridge_arrived': {
      const from = chainMeta(a.srcChain).name;
      const to = chainMeta(a.dstChain).name;
      return {
        ...base,
        detail: `${fmtAmount(a.amount)} ${assetSymbol} · ${from} → ${to}`,
        place: a.type === 'bridge_sent' ? from : to,
        chainId: a.type === 'bridge_sent' ? a.srcChain : a.dstChain,
      };
    }
    default:
      return base;
  }
};

export const toFeed = (
  items: TCrossChainActivity[] | undefined,
  assetSymbol: string,
  shareSymbol: string
): TFeedItem[] =>
  (items ?? [])
    .filter(a => Number.isFinite(a.time) && a.time > 0)
    .map(a => describe(a, assetSymbol, shareSymbol))
    .sort((x, y) => y.time - x.time);

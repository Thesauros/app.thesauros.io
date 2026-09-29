import { Card } from '@/shared/ui/new-card';
import { FlexBlock } from '@/shared/ui/flex-block';
import { Subtitle } from '@/shared/ui/new-typography/subtitle';
import { Body } from '@/shared/ui/new-typography/body';
import { Caption } from '@/shared/ui/new-typography/caption';
import { Button } from '@/shared/ui/button';
import { Tooltip } from '@/shared/ui/tooltip/tooltip';
import { CROSSCHAIN, explorerTx } from '@/shared/blockchain/crosschain/config';
import { epochVaultAbi } from '@/shared/blockchain/crosschain/abi';
import type { TCrossChainRequest, TCrossChainUser, TRequestState } from '@/shared/api/crosschain';
import { useCrossChainTx } from '@/features/crosschain/model/useCrossChainTx';
import { fmtAmount } from '../model/money';
import styles from '../crosschain.module.scss';

type TStep = { state: TRequestState; label: string; note: string };

/**
 * The two lifecycles, in order. A redeem has one more stage than a deposit because its payout
 * must be funded with real cash before it can be collected, and gathering that cash can mean
 * recalling from a lending market on another network.
 */
const DEPOSIT_STEPS: TStep[] = [
  {
    state: 'pending',
    label: 'Requested',
    note: 'Your USDC is held in the vault until this batch closes.',
  },
  {
    state: 'clearing',
    label: 'Batch closed',
    note: 'Waiting for the next published valuation to set your price.',
  },
  { state: 'claimable', label: 'Priced', note: 'Your shares are ready to collect.' },
  { state: 'claimed', label: 'Received', note: 'The shares are in your wallet.' },
];

const REDEEM_STEPS: TStep[] = [
  {
    state: 'pending',
    label: 'Requested',
    note: 'Your shares are held in escrow until this batch closes.',
  },
  {
    state: 'clearing',
    label: 'Batch closed',
    note: 'Waiting for the valuation that fixes your payout.',
  },
  {
    state: 'awaiting_liquidity',
    label: 'Priced',
    note: 'Your amount is fixed. Cash is being recalled from the lending markets.',
  },
  { state: 'claimable', label: 'Ready', note: 'Your USDC is set aside and ready to collect.' },
  { state: 'claimed', label: 'Paid', note: 'The USDC is in your wallet.' },
];

const Journey = ({
  r,
  assetSymbol,
  shareSymbol,
}: {
  r: TCrossChainRequest;
  assetSymbol: string;
  shareSymbol: string;
}) => {
  const tx = useCrossChainTx();
  const deposit = r.kind === 'deposit';
  const steps = deposit ? DEPOSIT_STEPS : REDEEM_STEPS;
  const idx = Math.max(
    0,
    steps.findIndex(s => s.state === r.state)
  );
  const done = r.state === 'claimed';

  const amountUnit = deposit ? assetSymbol : shareSymbol;
  const resultUnit = deposit ? shareSymbol : assetSymbol;
  const result =
    r.state === 'claimed' && r.claimedAmount
      ? r.claimedAmount
      : r.state === 'claimable' || r.state === 'awaiting_liquidity'
        ? r.claimable
        : null;

  return (
    <div className={styles.journey}>
      <FlexBlock justifyContent="space-between" alignItems="flex-start" flexWrap block>
        <FlexBlock direction="column" gap={2}>
          <Body level={1} weight="bold">
            {deposit ? 'Deposit' : 'Withdrawal'} · {fmtAmount(r.amount)} {amountUnit}
          </Body>
          <Caption className={styles.muted}>
            Batch #{r.epoch}
            {r.requestedTx ? (
              <>
                {' · '}
                <a
                  className={styles.feedTx}
                  href={explorerTx(CROSSCHAIN.chainId, r.requestedTx)}
                  target="_blank"
                  rel="noreferrer"
                >
                  your transaction
                </a>
              </>
            ) : null}
          </Caption>
        </FlexBlock>

        {r.state === 'claimable' || r.cancellable ? (
          <FlexBlock gap={8}>
            {r.state === 'claimable' ? (
              <Button
                size="sm"
                disabled={tx.isBusy}
                onClick={() =>
                  tx.send({
                    address: CROSSCHAIN.vaultAddress,
                    abi: epochVaultAbi,
                    functionName: 'claim',
                    args: [BigInt(r.id)],
                  })
                }
              >
                {tx.isBusy
                  ? 'Working…'
                  : `Collect ${result ? `${fmtAmount(result)} ${resultUnit}` : ''}`}
              </Button>
            ) : null}
            {r.cancellable ? (
              <Tooltip tooltipText="Pulling out refunds the full amount. A deposit can be pulled out any time before it is priced; a withdrawal only before the batch closes.">
                <Button
                  size="sm"
                  variant="outline"
                  disabled={tx.isBusy}
                  onClick={() =>
                    tx.send({
                      address: CROSSCHAIN.vaultAddress,
                      abi: epochVaultAbi,
                      functionName: 'cancel',
                      args: [BigInt(r.id)],
                    })
                  }
                >
                  Pull out
                </Button>
              </Tooltip>
            ) : null}
          </FlexBlock>
        ) : null}
      </FlexBlock>

      <div className={styles.steps}>
        {steps.map((s, i) => {
          const state = i < idx || done ? 'done' : i === idx ? 'now' : 'next';
          return (
            <div key={s.state} className={styles.step}>
              <div className={styles.stepRail}>
                <span className={`${styles.stepDot} ${styles[`step_${state}`]}`} />
                {i < steps.length - 1 ? (
                  <span
                    className={`${styles.stepLine} ${i < idx || done ? styles.stepLineDone : ''}`}
                  />
                ) : null}
              </div>
              <Caption className={i === idx && !done ? styles.stepNow : styles.muted}>
                {s.label}
              </Caption>
            </div>
          );
        })}
      </div>

      <Caption className={styles.journeyNote}>{steps[idx]?.note ?? ''}</Caption>
      {tx.error ? <Caption className={styles.error}>{tx.error}</Caption> : null}
    </div>
  );
};

type TProps = {
  user?: TCrossChainUser;
  assetSymbol: string;
  shareSymbol: string;
};

export const PositionJourney = ({ user, assetSymbol, shareSymbol }: TProps) => {
  if (!user) return null;

  const active = user.requests.filter(
    r =>
      r.state === 'pending' ||
      r.state === 'clearing' ||
      r.state === 'awaiting_liquidity' ||
      r.state === 'claimable'
  );
  const settled = user.requests.filter(r => r.state === 'claimed' || r.state === 'cancelled');

  return (
    <Card block>
      <FlexBlock direction="column" gap={16} block>
        <FlexBlock justifyContent="space-between" alignItems="center" flexWrap block>
          <Subtitle level={1} weight="bold">
            Your position
          </Subtitle>
          <Caption className={styles.muted}>
            {fmtAmount(user.shares)} {shareSymbol} · worth {fmtAmount(user.valueBid)} {assetSymbol}
          </Caption>
        </FlexBlock>

        {active.length === 0 ? (
          <Caption className={styles.muted}>
            Nothing in progress. Deposits and withdrawals you start will show their stage here.
          </Caption>
        ) : (
          <FlexBlock direction="column" gap={12} block>
            {active.map(r => (
              <Journey key={r.id} r={r} assetSymbol={assetSymbol} shareSymbol={shareSymbol} />
            ))}
          </FlexBlock>
        )}

        {settled.length > 0 ? (
          <FlexBlock direction="column" gap={6} block>
            <Caption className={styles.subhead}>Completed</Caption>
            {settled.slice(0, 6).map(r => (
              <FlexBlock key={r.id} justifyContent="space-between" alignItems="center" block>
                <Caption className={styles.muted}>
                  {r.state === 'cancelled'
                    ? 'Cancelled'
                    : r.kind === 'deposit'
                      ? 'Deposit'
                      : 'Withdrawal'}{' '}
                  · batch #{r.epoch}
                </Caption>
                <Caption className={styles.num}>
                  {r.state === 'cancelled'
                    ? `${fmtAmount(r.amount)} ${r.kind === 'deposit' ? assetSymbol : shareSymbol} returned`
                    : `${fmtAmount(r.claimedAmount ?? '0')} ${r.kind === 'deposit' ? shareSymbol : assetSymbol}`}
                </Caption>
              </FlexBlock>
            ))}
          </FlexBlock>
        ) : null}
      </FlexBlock>
    </Card>
  );
};

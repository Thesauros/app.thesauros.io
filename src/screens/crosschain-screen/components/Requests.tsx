import { Card } from '@/shared/ui/new-card';
import { FlexBlock } from '@/shared/ui/flex-block';
import { Subtitle } from '@/shared/ui/new-typography/subtitle';
import { Caption } from '@/shared/ui/new-typography/caption';
import { Body } from '@/shared/ui/new-typography/body';
import { Button } from '@/shared/ui/button';
import { Badge } from '@/shared/ui/badge';
import { CROSSCHAIN } from '@/shared/blockchain/crosschain/config';
import { epochVaultAbi } from '@/shared/blockchain/crosschain/abi';
import { TCrossChainRequest, TCrossChainUser, TRequestState } from '@/shared/api/crosschain';
import { useCrossChainTx } from '@/features/crosschain/model/useCrossChainTx';
import { fmtUnits, shortHash, txUrl } from '../format';
import styles from '../crosschain.module.scss';

const STATE_LABEL: Record<TRequestState, string> = {
  pending: 'In current epoch',
  clearing: 'Waiting for clearing',
  awaiting_liquidity: 'Waiting for liquidity',
  claimable: 'Ready to claim',
  claimed: 'Completed',
  cancelled: 'Cancelled',
};

const Row = ({ r }: { r: TCrossChainRequest }) => {
  const tx = useCrossChainTx();
  const deposit = r.kind === 'deposit';
  const amount = `${fmtUnits(r.amount, 4)} ${deposit ? CROSSCHAIN.assetSymbol : CROSSCHAIN.shareSymbol}`;
  const outcome =
    r.state === 'claimed' && r.claimedAmount
      ? `${fmtUnits(r.claimedAmount, 4)} ${deposit ? CROSSCHAIN.shareSymbol : CROSSCHAIN.assetSymbol}`
      : r.state === 'claimable' || r.state === 'awaiting_liquidity'
        ? `${fmtUnits(r.claimable, 4)} ${deposit ? CROSSCHAIN.shareSymbol : CROSSCHAIN.assetSymbol}`
        : '—';

  return (
    <div className={styles.row}>
      <Body level={2}>#{r.id}</Body>
      <Body level={2}>{deposit ? 'Deposit' : 'Redemption'}</Body>
      <Body level={2}>{amount}</Body>
      <Body level={2}>{outcome}</Body>
      <Body level={2}>{r.epoch}</Body>
      <Badge label={STATE_LABEL[r.state]} />
      <FlexBlock gap={8} justifyContent="end">
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
            {tx.isBusy ? '…' : 'Claim'}
          </Button>
        ) : null}
        {r.cancellable ? (
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
            {tx.isBusy ? '…' : 'Cancel'}
          </Button>
        ) : null}
        <a
          className={styles.muted}
          href={txUrl(r.claimedTx ?? r.requestedTx)}
          target="_blank"
          rel="noreferrer"
        >
          {shortHash(r.claimedTx ?? r.requestedTx)}
        </a>
      </FlexBlock>
    </div>
  );
};

export const Requests = ({ user }: { user?: TCrossChainUser }) => (
  <Card block>
    <FlexBlock direction="column" gap={12} block>
      <FlexBlock justifyContent="space-between" block>
        <Subtitle level={1} weight="bold">
          Your requests
        </Subtitle>
        {user ? (
          <Caption>
            {fmtUnits(user.shares, 4)} {CROSSCHAIN.shareSymbol} ≈ {fmtUnits(user.valueBid)}{' '}
            {CROSSCHAIN.assetSymbol}
          </Caption>
        ) : null}
      </FlexBlock>
      {!user || user.requests.length === 0 ? (
        <Body level={2} className={styles.muted}>
          No requests yet.
        </Body>
      ) : (
        <div className={styles.table}>
          <div className={`${styles.row} ${styles.head}`}>
            {['ID', 'Type', 'Amount', 'Result', 'Epoch', 'Status', ''].map(h => (
              <Caption key={h}>{h}</Caption>
            ))}
          </div>
          {user.requests.map(r => (
            <Row key={r.id} r={r} />
          ))}
        </div>
      )}
    </FlexBlock>
  </Card>
);

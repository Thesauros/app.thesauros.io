import { useEffect, useState } from 'react';
import { Card } from '@/shared/ui/new-card';
import { FlexBlock } from '@/shared/ui/flex-block';
import { Subtitle } from '@/shared/ui/new-typography/subtitle';
import { Body } from '@/shared/ui/new-typography/body';
import { Caption } from '@/shared/ui/new-typography/caption';
import { Tooltip } from '@/shared/ui/tooltip/tooltip';
import type { TCrossChainVault } from '@/shared/api/crosschain';
import { fmtAmount, fmtDuration } from '../model/money';
import styles from '../crosschain.module.scss';

type TProps = {
  vault: TCrossChainVault;
  assetSymbol: string;
  shareSymbol: string;
};

const clamp01 = (n: number) => (Number.isFinite(n) ? Math.min(1, Math.max(0, n)) : 0);

/**
 * The current batch, as a timeline.
 *
 * Owns its own one-second clock: the countdown is the only thing on the page that needs
 * sub-poll resolution, and keeping the tick local avoids re-rendering the whole view every
 * second. Wall clock is corrected by the offset against the chain timestamp the indexer
 * reported, so a skewed client clock cannot show a countdown that is simply wrong.
 */
export const EpochDial = ({ vault, assetSymbol, shareSymbol }: TProps) => {
  const [now, setNow] = useState(() => vault.now);

  useEffect(() => {
    const skew = vault.now - Math.floor(Date.now() / 1000);
    setNow(Math.floor(Date.now() / 1000) + skew);
    const t = setInterval(() => setNow(Math.floor(Date.now() / 1000) + skew), 1000);
    return () => clearInterval(t);
  }, [vault.now]);

  const { openedAt, earliestCloseAt, latestCloseAt } = vault.epoch;
  const span = Math.max(1, latestCloseAt - openedAt);
  const progress = clamp01((now - openedAt) / span);
  const cutoffAt = clamp01((earliestCloseAt - openedAt) / span);

  const open = now < earliestCloseAt;
  const closing = now >= latestCloseAt;
  const deposits = BigInt(vault.epoch.depositAssets);
  const redeems = BigInt(vault.epoch.redeemShares);

  const status = closing
    ? 'Closing now'
    : open
      ? `Open · cutoff in ${fmtDuration(earliestCloseAt - now)}`
      : `Past cutoff · closes by ${fmtDuration(latestCloseAt - now)}`;

  return (
    <Card block>
      <FlexBlock direction="column" gap={16} block>
        <FlexBlock justifyContent="space-between" alignItems="flex-end" flexWrap block>
          <FlexBlock direction="column" gap={4}>
            <Subtitle level={1} weight="bold">
              Batch #{vault.epoch.id}
            </Subtitle>
            <Tooltip tooltipText="Deposits and withdrawals are grouped into batches. Everyone in the same batch gets the same price, set after the batch closes — so nobody, including us, can trade against the fund.">
              <Caption className={styles.muted}>
                Deposits and withdrawals are priced together, once per batch
              </Caption>
            </Tooltip>
          </FlexBlock>
          <span className={`${styles.phaseTag} ${open ? styles.phaseOpen : styles.phaseWait}`}>
            {status}
          </span>
        </FlexBlock>

        <div className={styles.dial}>
          <div className={styles.dialFill} style={{ width: `${progress * 100}%` }} />
          <div className={styles.dialCutoff} style={{ left: `${cutoffAt * 100}%` }} />
          <div className={styles.dialNow} style={{ left: `${progress * 100}%` }} />
        </div>

        <FlexBlock justifyContent="space-between" block>
          <Caption className={styles.muted}>Opened {fmtDuration(now - openedAt)} ago</Caption>
          <Caption className={styles.muted}>Cutoff</Caption>
          <Caption className={styles.muted}>Closes in {fmtDuration(latestCloseAt - now)}</Caption>
        </FlexBlock>

        <FlexBlock gap={24} flexWrap block className={styles.dialMeta}>
          <FlexBlock direction="column" gap={2}>
            <Caption className={styles.muted}>Joined this batch</Caption>
            <Body level={2} weight="bold" className={styles.num}>
              {fmtAmount(deposits)} {assetSymbol}
            </Body>
          </FlexBlock>
          <FlexBlock direction="column" gap={2}>
            <Caption className={styles.muted}>Leaving this batch</Caption>
            <Body level={2} weight="bold" className={styles.num}>
              {fmtAmount(redeems)} {shareSymbol}
            </Body>
          </FlexBlock>
          <FlexBlock direction="column" gap={2}>
            <Tooltip
              tooltipText={`A batch runs at least ${fmtDuration(vault.epochConfig.minDuration)} and at most ${fmtDuration(vault.epochConfig.maxDuration)}. It closes early only if a new price has been published since it opened.`}
            >
              <Caption className={styles.muted}>Batch length</Caption>
            </Tooltip>
            <Body level={2} weight="bold" className={styles.num}>
              {fmtDuration(vault.epochConfig.minDuration)} –{' '}
              {fmtDuration(vault.epochConfig.maxDuration)}
            </Body>
          </FlexBlock>
        </FlexBlock>
      </FlexBlock>
    </Card>
  );
};

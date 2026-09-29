import { Card } from '@/shared/ui/new-card';
import { FlexBlock } from '@/shared/ui/flex-block';
import { Subtitle } from '@/shared/ui/new-typography/subtitle';
import { Body } from '@/shared/ui/new-typography/body';
import { Caption } from '@/shared/ui/new-typography/caption';
import { Tooltip } from '@/shared/ui/tooltip/tooltip';
import type { TCrossChainAllocation, TCrossChainVault } from '@/shared/api/crosschain';
import {
  deployableHeadroom,
  fmtAmount,
  fmtPct,
  grossAssets,
  liveNav,
  safetyBuffer,
  segmentsOf,
  unfundedOwed,
  utilization,
  vaultCashBreakdown,
} from '../model/money';
import styles from '../crosschain.module.scss';

type TProps = {
  vault: TCrossChainVault;
  allocation?: TCrossChainAllocation;
  assetSymbol: string;
};

/** Integer-safe percentage of a share of the total, to two decimals. */
const pctOf = (part: bigint, total: bigint) =>
  total > BigInt(0) ? Number((part * BigInt(10_000)) / total) / 100 : 0;

export const MoneyMap = ({ vault, allocation, assetSymbol }: TProps) => {
  const segments = segmentsOf(vault, allocation);
  // Zero-width segments are left out of both the bar and the legend: an empty stripe and a
  // "0.00" row say nothing, and the page is meant to stay scannable.
  const live = segments.filter(s => s.amount > BigInt(0));
  const total = grossAssets(vault, allocation);
  const nav = liveNav(vault, allocation);
  const queued = BigInt(vault.accounting.pendingDeposits);
  const owed = unfundedOwed(vault);
  const cash = vaultCashBreakdown(vault);
  const hasDeductions = queued > BigInt(0) || owed > BigInt(0);
  // Until the allocation answers, everything below would be the vault alone: a bar claiming the
  // lending markets hold nothing, and a net value missing most of the fund. Rather than show a
  // confidently wrong picture, show nothing until the read completes.
  const ready = allocation !== undefined;

  return (
    <Card block>
      <FlexBlock direction="column" gap={20} block>
        <FlexBlock justifyContent="space-between" alignItems="flex-end" flexWrap block>
          <FlexBlock direction="column" gap={4}>
            <Subtitle level={1} weight="bold">
              Where the money is
            </Subtitle>
            <Caption className={styles.muted}>
              Every USDC the fund controls right now, by where it sits
            </Caption>
          </FlexBlock>
          <FlexBlock direction="column" gap={2} alignItems="flex-end">
            <Caption className={styles.muted}>Total held</Caption>
            <Subtitle level={1} weight="bold">
              {ready ? `${fmtAmount(total)} ${assetSymbol}` : '—'}
            </Subtitle>
          </FlexBlock>
        </FlexBlock>

        {ready ? (
          <>
            <div className={styles.bar} role="img" aria-label="Distribution of fund assets">
              {total > BigInt(0) && live.length > 0 ? (
                live.map(s => (
                  <div
                    key={s.id}
                    className={`${styles.barSeg} ${styles[`seg_${s.id}`]}`}
                    style={{ width: `${pctOf(s.amount, total)}%` }}
                    title={`${s.label}: ${fmtAmount(s.amount)} ${assetSymbol} (${pctOf(s.amount, total).toFixed(1)}%)`}
                  />
                ))
              ) : (
                <div className={styles.barEmpty} />
              )}
            </div>

            <FlexBlock direction="column" gap={8} block>
              {live.map(s => (
                <FlexBlock key={s.id} justifyContent="space-between" alignItems="center" block>
                  <FlexBlock gap={8}>
                    <span className={`${styles.dot} ${styles[`dot_${s.id}`]}`} />
                    <Tooltip tooltipText={s.hint}>
                      <Body level={2} weight="medium">
                        {s.label}
                      </Body>
                    </Tooltip>
                  </FlexBlock>
                  <FlexBlock gap={12} alignItems="center">
                    <Caption className={styles.muted}>{pctOf(s.amount, total).toFixed(1)}%</Caption>
                    <Body level={2} weight="bold" className={styles.num}>
                      {fmtAmount(s.amount)}
                    </Body>
                  </FlexBlock>
                </FlexBlock>
              ))}
            </FlexBlock>

            <FlexBlock direction="column" gap={4} block>
              <FlexBlock justifyContent="space-between" alignItems="center" block>
                <Tooltip tooltipText="The share of the fund that is in lending markets earning yield. Capital in transit and deposits waiting to be priced are not counted, because neither earns yet.">
                  <Caption className={styles.muted}>Capital utilization</Caption>
                </Tooltip>
                <Body level={2} weight="bold" className={styles.num}>
                  {fmtPct(utilization(vault, allocation), 1)}
                </Body>
              </FlexBlock>
              <Caption className={styles.reconNote}>
                {fmtAmount(deployableHeadroom(vault))} {assetSymbol} could still be put to work now;{' '}
                {fmtAmount(safetyBuffer(vault))} {assetSymbol} must stay in the vault as the safety
                buffer that pays instant exits without selling anything.
              </Caption>
            </FlexBlock>

            <div className={styles.recon}>
              <FlexBlock justifyContent="space-between" alignItems="center" flexWrap block>
                <Body level={2}>
                  Net value <span className={styles.muted}>(what the shares are worth)</span>
                </Body>
                <Body level={2} weight="bold" className={styles.num}>
                  {fmtAmount(nav)} {assetSymbol}
                </Body>
              </FlexBlock>
              {hasDeductions ? (
                <Caption className={styles.reconNote}>
                  {fmtAmount(total)} held
                  {queued > BigInt(0) ? ` − ${fmtAmount(queued)} deposited but not yet priced` : ''}
                  {owed > BigInt(0) ? ` − ${fmtAmount(owed)} owed to withdrawals` : ''} ={' '}
                  {fmtAmount(nav)}
                </Caption>
              ) : (
                <Caption className={styles.reconNote}>
                  Nothing is queued or owed right now, so the whole holding belongs to the shares.
                </Caption>
              )}
              {cash.queued > BigInt(0) || cash.setAside > BigInt(0) ? (
                <Caption className={styles.reconNote}>
                  Of the {fmtAmount(vault.accounting.cash)} {assetSymbol} in the vault:{' '}
                  {fmtAmount(cash.available)} available
                  {cash.queued > BigInt(0)
                    ? `, ${fmtAmount(cash.queued)} awaiting their price`
                    : ''}
                  {cash.setAside > BigInt(0)
                    ? `, ${fmtAmount(cash.setAside)} set aside for withdrawals`
                    : ''}
                  .
                </Caption>
              ) : null}
            </div>
          </>
        ) : (
          <Caption className={styles.muted}>Reading positions on each network…</Caption>
        )}
      </FlexBlock>
    </Card>
  );
};

import { FlexBlock } from '@/shared/ui/flex-block';
import { Heading } from '@/shared/ui/new-typography/heading';
import { Body } from '@/shared/ui/new-typography/body';
import { Caption } from '@/shared/ui/new-typography/caption';
import { Subtitle } from '@/shared/ui/new-typography/subtitle';
import { Tooltip } from '@/shared/ui/tooltip/tooltip';
import type { TCrossChainAllocation, TCrossChainVault } from '@/shared/api/crosschain';
import {
  fmtAmount,
  fmtAgo,
  fmtDuration,
  fmtPct,
  fmtRate,
  liveNav,
  supplyValue,
  type TApr,
} from '../model/money';
import { headline, type TSignal } from '../model/health';
import styles from '../crosschain.module.scss';

type TProps = {
  vault: TCrossChainVault;
  allocation?: TCrossChainAllocation;
  /** False until /v1/allocation answers; live NAV cannot be computed without it. */
  allocationReady: boolean;
  signals: TSignal[];
  assetSymbol: string;
  shareSymbol: string;
  apr: TApr;
};

const Stat = ({
  label,
  value,
  sub,
  hint,
}: {
  label: string;
  value: string;
  sub?: string;
  hint: string;
}) => (
  <FlexBlock direction="column" gap={4} className={styles.stat}>
    <Tooltip tooltipText={hint}>
      <Caption className={styles.muted}>{label}</Caption>
    </Tooltip>
    <Subtitle level={1} weight="bold" className={styles.num}>
      {value}
    </Subtitle>
    {sub ? <Caption className={styles.muted}>{sub}</Caption> : null}
  </FlexBlock>
);

export const StatusStrip = ({
  vault,
  allocation,
  allocationReady,
  signals,
  assetSymbol,
  shareSymbol,
  apr,
}: TProps) => {
  const top = headline(signals);
  const published = BigInt(vault.tick.navBid);
  const live = liveNav(vault, allocation);
  // Until the allocation answers, live NAV would silently omit everything held outside the
  // vault and read as a large loss. Show the published figure instead and say nothing about drift.
  const nav = allocationReady ? live : published;
  const drift =
    allocationReady && published > BigInt(0)
      ? Number(((live - published) * BigInt(1000)) / published) / 10
      : 0;

  return (
    <FlexBlock direction="column" gap={20} block>
      <FlexBlock justifyContent="space-between" alignItems="flex-start" flexWrap block>
        <FlexBlock direction="column" gap={6}>
          <Heading level={3}>Cross-chain USDC vault</Heading>
          <Body level={2} className={styles.muted}>
            One position, held across several networks. Everything below is read from the blockchain
            and updates as it happens.
          </Body>
        </FlexBlock>

        <Tooltip
          tooltipText={signals.map(s => `${s.label} — ${s.note}`).join('\n\n')}
          fullWidth={false}
        >
          <span className={`${styles.pill} ${styles[`pill_${top.level}`]}`}>
            <span className={styles.pillDot} />
            {top.label}
          </span>
        </Tooltip>
      </FlexBlock>

      {vault.profile === 'stand' ? (
        <div className={styles.notice}>
          <Body level={2}>
            <strong>Test deployment.</strong> This is a stand with small limits and a single
            governance key, used to exercise the system with real contracts before production. The
            mechanics shown are the real ones; the amounts are not.
          </Body>
        </div>
      ) : null}

      <FlexBlock gap={32} flexWrap block className={styles.stats}>
        <Stat
          label="Net value"
          value={`${fmtAmount(nav)} ${assetSymbol}`}
          sub={
            vault.tick.id > 0
              ? `published ${fmtAgo(vault.tick.ageSeconds ?? 0)}${Math.abs(drift) >= 0.5 ? ` · moved ${drift > 0 ? '+' : ''}${drift.toFixed(1)}% since` : ''}`
              : 'no valuation published yet'
          }
          hint="Everything the fund owns — cash, lending positions and money travelling between networks — minus deposits not yet priced and withdrawals already owed. Recomputed live; the on-chain valuation is republished roughly hourly."
        />
        <Stat
          label={`Price of 1 ${shareSymbol}`}
          value={vault.tick.id > 0 ? `${fmtRate(vault.tick.rateBid)} ${assetSymbol}` : '—'}
          sub={
            vault.tick.id > 0 ? `from valuation #${vault.tick.id}` : 'awaiting the first valuation'
          }
          hint="What one share is worth if you withdrew now. Every price you receive comes from a published valuation, never from a momentary market quote."
        />
        <Stat
          label="Yield"
          value={fmtPct(apr.value)}
          sub={
            apr.value === null
              ? 'needs more history'
              : `annualised over ${fmtDuration(apr.sinceSeconds ?? 0)}`
          }
          hint="Share-price growth annualised over the history that actually exists, after fees. A short window makes this figure sensitive, so the period is stated rather than implied."
        />
        <Stat
          label="Shares held by investors"
          value={`${fmtAmount(vault.totalSupply)} ${shareSymbol}`}
          sub={`worth ${fmtAmount(supplyValue(vault))} ${assetSymbol}`}
          hint="Total shares in existence. Your shares times the current price is your money."
        />
      </FlexBlock>
    </FlexBlock>
  );
};

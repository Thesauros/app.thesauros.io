import { Fragment } from 'react';
import { Card } from '@/shared/ui/new-card';
import { FlexBlock } from '@/shared/ui/flex-block';
import { Subtitle } from '@/shared/ui/new-typography/subtitle';
import { Body } from '@/shared/ui/new-typography/body';
import { Caption } from '@/shared/ui/new-typography/caption';
import { Tooltip } from '@/shared/ui/tooltip/tooltip';
import type {
  TCrossChainAllocation,
  TCrossChainChain,
  TCrossChainProvider,
  TCrossChainTransfer,
  TCrossChainVault,
} from '@/shared/api/crosschain';
import { chainMeta, explorerAddress } from '@/shared/blockchain/crosschain/config';
import { fmtAmount, fmtDuration, vaultCashBreakdown } from '../model/money';
import styles from '../crosschain.module.scss';

/** Registry labels are camelCase identifiers; these are the names a reader recognises. */
const PROVIDER_NAMES: Record<string, string> = {
  AaveV3: 'Aave V3',
  CompoundV3: 'Compound V3',
  GauntletCoreMorpho: 'Morpho · Gauntlet Core',
  SteakhouseHighYieldMorpho: 'Morpho · Steakhouse High Yield',
  SteakhousePrimeMorpho: 'Morpho · Steakhouse Prime',
};

export const providerName = (p: TCrossChainProvider) =>
  (p.label && PROVIDER_NAMES[p.label]) ||
  (p.label ?? undefined) ||
  p.identifier.replace(/_/g, ' ').replace(/ Provider$/, '') ||
  p.address;

const capLabel = (capBps: number) => (capBps === 0 ? 'no cap' : `${capBps / 100}% cap`);

type TRow = { label: string; value: string; hint?: string; strong?: boolean };

const Rows = ({ rows }: { rows: TRow[] }) => (
  <FlexBlock direction="column" gap={6} block>
    {rows.map(r => (
      <FlexBlock key={r.label} justifyContent="space-between" alignItems="center" block>
        {r.hint ? (
          <Tooltip tooltipText={r.hint}>
            <Caption className={styles.muted}>{r.label}</Caption>
          </Tooltip>
        ) : (
          <Caption className={styles.muted}>{r.label}</Caption>
        )}
        <Body level={2} weight={r.strong ? 'bold' : 'medium'} className={styles.num}>
          {r.value}
        </Body>
      </FlexBlock>
    ))}
  </FlexBlock>
);

const ChainPanel = ({
  chain,
  vault,
  assetSymbol,
}: {
  chain: TCrossChainChain;
  vault?: TCrossChainVault;
  assetSymbol: string;
}) => {
  const meta = chainMeta(chain.chainId);
  const isHub = chain.role === 'hub';
  const cash = vaultCashBreakdown(vault);
  const funded = chain.providers.filter(p => BigInt(p.agentShare) > BigInt(0));
  const chainTotal = BigInt(chain.idle) + BigInt(chain.strategyValue);

  const rows: TRow[] = [];
  if (isHub && vault) {
    rows.push({
      label: 'In the vault',
      value: `${fmtAmount(vault.accounting.cash)} ${assetSymbol}`,
      hint: `Held on ${meta.name} as ${assetSymbol}. ${fmtAmount(cash.available)} available, ${fmtAmount(cash.queued)} awaiting a price, ${fmtAmount(cash.setAside)} set aside for withdrawals.`,
      strong: true,
    });
  }
  if (BigInt(chain.idle) > BigInt(0)) {
    rows.push({
      label: 'Idle, not yet working',
      value: `${fmtAmount(chain.idle)} ${assetSymbol}`,
      hint: 'Held by the fund wallet on this network, waiting to be put into a lending market.',
    });
  }
  rows.push({
    label: 'In lending markets',
    value: `${fmtAmount(chain.strategyValue)} ${assetSymbol}`,
    hint: 'Spread across the markets listed below. This is the part earning yield.',
    strong: true,
  });

  return (
    <div className={styles.chain}>
      <FlexBlock direction="column" gap={14} block>
        <FlexBlock justifyContent="space-between" alignItems="center" block>
          <FlexBlock gap={12}>
            {meta.logo ? <img src={meta.logo} alt="" className={styles.chainLogo} /> : null}
            <FlexBlock direction="column" gap={2}>
              <FlexBlock gap={8} alignItems="center">
                <Body level={1} weight="bold">
                  {meta.name}
                </Body>
                <span className={`${styles.roleTag} ${isHub ? styles.roleHub : styles.roleSpoke}`}>
                  {isHub ? 'main' : 'secondary'}
                </span>
              </FlexBlock>
              <Caption className={styles.muted}>{isHub ? meta.hubRole : meta.spokeRole}</Caption>
            </FlexBlock>
          </FlexBlock>
        </FlexBlock>

        <Rows rows={rows} />

        <FlexBlock direction="column" gap={6} block>
          <FlexBlock justifyContent="space-between" alignItems="center" block>
            <Caption className={styles.subhead}>Markets used on {meta.name}</Caption>
            <span
              className={`${styles.healthDot} ${chain.providersHealthy ? styles.healthOk : styles.healthBad}`}
              title={chain.providersHealthy ? 'All markets reporting' : 'A market is not reporting'}
            />
          </FlexBlock>
          {funded.length === 0 ? (
            <Caption className={styles.muted}>Nothing deployed here yet.</Caption>
          ) : (
            funded.map(p => (
              <FlexBlock key={p.address} justifyContent="space-between" alignItems="center" block>
                <Tooltip
                  tooltipText={`Maximum ${capLabel(p.capBps)} of the fund on this market. ${chainTotal > BigInt(0) ? `${(Number((BigInt(p.agentShare) * BigInt(1000)) / chainTotal) / 10).toFixed(1)}% of this network.` : ''}`}
                >
                  <Caption>{providerName(p)}</Caption>
                </Tooltip>
                <Caption className={styles.num}>{fmtAmount(p.agentShare)}</Caption>
              </FlexBlock>
            ))
          )}
          {!chain.providersHealthy ? (
            <Caption className={styles.warnText}>
              A market here is not reporting its balance, so this total may be understated.
            </Caption>
          ) : null}
        </FlexBlock>

        <a
          className={styles.verify}
          href={explorerAddress(chain.chainId, isHub && vault ? vault.vault : chain.agent)}
          target="_blank"
          rel="noreferrer"
        >
          Verify on{' '}
          {meta.name === 'Base'
            ? 'Basescan'
            : meta.name === 'Arbitrum'
              ? 'Arbiscan'
              : 'the explorer'}
        </a>
      </FlexBlock>
    </div>
  );
};

type TLinkProps = {
  inFlight: TCrossChainTransfer[];
  crossingTime: number | null;
  now: number;
  assetSymbol: string;
};

/**
 * The connector between two chain panels. It is a sibling of the panels rather than a child of
 * one, so the line sits between them at full height instead of floating above the second panel.
 */
const BridgeLink = ({ inFlight, crossingTime, now, assetSymbol }: TLinkProps) => (
  <div className={styles.link}>
    <div className={styles.linkLine}>
      {inFlight.length > 0 ? <span className={styles.linkPulse} /> : null}
    </div>
    <FlexBlock direction="column" gap={2} alignItems="center" className={styles.linkLabel}>
      {inFlight.length > 0 ? (
        inFlight.map(t => (
          <Caption key={t.id} className={styles.transitText}>
            {fmtAmount(t.amount)} {assetSymbol} ·{' '}
            {t.sent_at !== null ? fmtDuration(now - t.sent_at) : '—'} in transit
          </Caption>
        ))
      ) : (
        <Caption className={styles.muted}>
          {crossingTime !== null
            ? `Last crossing took ${fmtDuration(crossingTime)}`
            : 'Nothing in transit'}
        </Caption>
      )}
    </FlexBlock>
  </div>
);

type TProps = {
  allocation?: TCrossChainAllocation;
  transfers?: TCrossChainTransfer[];
  vault?: TCrossChainVault;
  assetSymbol: string;
};

export const NetworkMap = ({ allocation, transfers, vault, assetSymbol }: TProps) => {
  const chains = allocation?.chains ?? [];
  const inFlight = allocation?.inFlight ?? [];
  const now = vault?.now ?? Math.floor(Date.now() / 1000);

  // The last completed crossing answers "how long does moving between networks take?"
  // without the reader having to ask. `maxTransit` is the promise; this is the measurement.
  const lastDelivered = (transfers ?? [])
    .filter(t => t.state === 'delivered' && t.sent_at !== null && t.received_at !== null)
    .sort((a, b) => (b.received_at ?? 0) - (a.received_at ?? 0))[0];
  const crossingTime =
    lastDelivered && lastDelivered.sent_at !== null && lastDelivered.received_at !== null
      ? lastDelivered.received_at - lastDelivered.sent_at
      : null;

  return (
    <Card block>
      <FlexBlock direction="column" gap={20} block>
        <FlexBlock direction="column" gap={4}>
          <Subtitle level={1} weight="bold">
            Across which networks
          </Subtitle>
          <Caption className={styles.muted}>
            One fund, held on more than one network. Money moves between them through Circle&apos;s
            USDC transfer mechanism — no liquidity pool, so no slippage.
          </Caption>
        </FlexBlock>

        {chains.length === 0 ? (
          <Caption className={styles.muted}>Loading network positions…</Caption>
        ) : (
          <div className={styles.mapGrid}>
            {chains.map((c, i) => (
              <Fragment key={c.chainId}>
                {i > 0 ? (
                  <BridgeLink
                    inFlight={inFlight}
                    crossingTime={crossingTime}
                    now={now}
                    assetSymbol={assetSymbol}
                  />
                ) : null}
                <div className={styles.mapCell}>
                  <ChainPanel chain={c} vault={vault} assetSymbol={assetSymbol} />
                </div>
              </Fragment>
            ))}
          </div>
        )}
      </FlexBlock>
    </Card>
  );
};

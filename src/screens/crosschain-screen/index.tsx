import { FlexBlock } from '@/shared/ui/flex-block';
import { Heading } from '@/shared/ui/new-typography/heading';
import { Body } from '@/shared/ui/new-typography/body';
import { Caption } from '@/shared/ui/new-typography/caption';
import { Loader } from '@/shared/ui/loader';
import { useAccount } from '@/shared/blockchain';
import { CROSSCHAIN, isCrossChainEnabled } from '@/shared/blockchain/crosschain/config';
import {
  useCrossChainActivity,
  useCrossChainAllocation,
  useCrossChainTicks,
  useCrossChainTransfers,
  useCrossChainUser,
  useCrossChainVault,
  useIndexerHealth,
} from '@/shared/api/crosschain';
import { StatusStrip } from './components/StatusStrip';
import { MoneyMap } from './components/MoneyMap';
import { NetworkMap } from './components/NetworkMap';
import { EpochDial } from './components/EpochDial';
import { ActivityFeed } from './components/ActivityFeed';
import { PriceChart } from './components/PriceChart';
import { PositionJourney } from './components/PositionJourney';
import { ActionPanel } from './components/ActionPanel';
import { aprFromTicks } from './model/money';
import { signalsOf } from './model/health';
import styles from './crosschain.module.scss';

/**
 * The cross-chain vault as a live picture rather than a table of numbers.
 *
 * Rendered twice from one component: inside the app shell at /crosschain, where a connected
 * wallet also gets the action panel and its own request journeys, and bare at /live as a
 * read-only page an investor can open without a wallet.
 */
export const CrossChainScreen = () => {
  const { address, isConnected } = useAccount();
  const vault = useCrossChainVault();
  const user = useCrossChainUser(address);
  const ticks = useCrossChainTicks();
  const allocation = useCrossChainAllocation();
  const activity = useCrossChainActivity();
  const transfers = useCrossChainTransfers();
  const health = useIndexerHealth();

  if (!isCrossChainEnabled()) {
    return (
      <FlexBlock direction="column" gap={16} className={styles.container}>
        <Heading level={3}>Cross-chain vault</Heading>
        <Body level={2}>
          Not configured: set NEXT_PUBLIC_CROSSCHAIN_VAULT and NEXT_PUBLIC_CROSSCHAIN_API_URL.
        </Body>
      </FlexBlock>
    );
  }

  if (vault.isLoading) {
    return (
      <FlexBlock direction="column" gap={16} className={styles.container} block>
        <Loader />
        <Caption className={styles.muted}>Reading the vault from Base…</Caption>
      </FlexBlock>
    );
  }

  if (!vault.data) {
    return (
      <FlexBlock direction="column" gap={12} className={styles.container} block>
        <Heading level={3}>Cross-chain USDC vault</Heading>
        <div className={styles.notice}>
          <Body level={2}>
            The data service is not answering, so this page cannot show live figures. The vault
            itself is unaffected — everything on it stays readable on BaseScan.
          </Body>
        </div>
      </FlexBlock>
    );
  }

  const v = vault.data;
  // The live symbol, because the stand is `tcUSDC-stand` and a hardcoded label would be wrong.
  const shareSymbol = v.symbol || CROSSCHAIN.shareSymbol;
  const assetSymbol = CROSSCHAIN.assetSymbol;
  const signals = signalsOf(v, allocation.data, health.data, v.now);
  const apr = aprFromTicks(ticks.data, v.now);

  return (
    <FlexBlock direction="column" gap={24} className={styles.container} block>
      <StatusStrip
        vault={v}
        allocation={allocation.data}
        allocationReady={allocation.data !== undefined}
        signals={signals}
        assetSymbol={assetSymbol}
        shareSymbol={shareSymbol}
        apr={apr}
      />

      {isConnected ? (
        <div className={styles.grid}>
          <ActionPanel vault={v} shareSymbol={shareSymbol} />
          <PositionJourney user={user.data} assetSymbol={assetSymbol} shareSymbol={shareSymbol} />
        </div>
      ) : null}

      <MoneyMap vault={v} allocation={allocation.data} assetSymbol={assetSymbol} />

      <NetworkMap
        allocation={allocation.data}
        transfers={transfers.data}
        vault={v}
        assetSymbol={assetSymbol}
      />

      <div className={styles.grid}>
        <EpochDial vault={v} assetSymbol={assetSymbol} shareSymbol={shareSymbol} />
        <ActivityFeed
          activity={activity.data}
          isLoading={activity.isLoading}
          assetSymbol={assetSymbol}
          shareSymbol={shareSymbol}
          now={v.now}
          updatedAt={Math.floor(activity.dataUpdatedAt / 1000)}
        />
      </div>

      <PriceChart
        ticks={ticks.data}
        isLoading={ticks.isLoading}
        assetSymbol={assetSymbol}
        shareSymbol={shareSymbol}
      />

      <Caption className={styles.footnote}>
        Every figure on this page is read from the blockchain, and every event links to the
        transaction that caused it. Valuations are published on-chain and can be recomputed
        independently by anyone.
      </Caption>
    </FlexBlock>
  );
};

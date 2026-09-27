import { FlexBlock } from '@/shared/ui/flex-block';
import { Heading } from '@/shared/ui/new-typography/heading';
import { Body } from '@/shared/ui/new-typography/body';
import { Loader } from '@/shared/ui/loader';
import { useAccount } from '@/shared/blockchain';
import { isCrossChainEnabled } from '@/shared/blockchain/crosschain/config';
import {
  useCrossChainAllocation,
  useCrossChainTicks,
  useCrossChainUser,
  useCrossChainVault,
} from '@/shared/api/crosschain';
import { Overview } from './components/Overview';
import { ActionPanel } from './components/ActionPanel';
import { Requests } from './components/Requests';
import { RateChart } from './components/RateChart';
import { Allocation } from './components/Allocation';
import styles from './crosschain.module.scss';

export const CrossChainScreen = () => {
  const { address } = useAccount();
  const vault = useCrossChainVault();
  const user = useCrossChainUser(address);
  const ticks = useCrossChainTicks();
  const allocation = useCrossChainAllocation();

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

  return (
    <FlexBlock direction="column" gap={24} className={styles.container} block>
      <FlexBlock direction="column" gap={4}>
        <Heading level={3}>Cross-chain USDC vault</Heading>
        <Body level={2} className={styles.muted}>
          One position across Base and Arbitrum. NAV is committed on-chain in ticks and
          independently reproducible.
        </Body>
      </FlexBlock>
      {vault.isLoading || !vault.data ? (
        vault.isError ? (
          <Body level={2}>Vault data is unavailable right now.</Body>
        ) : (
          <Loader />
        )
      ) : (
        <>
          <Overview vault={vault.data} />
          <div className={styles.grid}>
            <ActionPanel vault={vault.data} />
            <Allocation allocation={allocation.data} vault={vault.data} />
          </div>
          <Requests user={user.data} />
          <RateChart ticks={ticks.data} isLoading={ticks.isLoading} />
        </>
      )}
    </FlexBlock>
  );
};

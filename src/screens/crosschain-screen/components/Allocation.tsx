import { Card } from '@/shared/ui/new-card';
import { FlexBlock } from '@/shared/ui/flex-block';
import { Subtitle } from '@/shared/ui/new-typography/subtitle';
import { Body } from '@/shared/ui/new-typography/body';
import { Caption } from '@/shared/ui/new-typography/caption';
import { TCrossChainAllocation, TCrossChainVault } from '@/shared/api/crosschain';
import { fmtDuration, fmtUnits } from '../format';
import styles from '../crosschain.module.scss';

const NETWORK_NAME: Record<number, string> = { 8453: 'Base', 42161: 'Arbitrum', 1: 'Ethereum' };

export const Allocation = ({
  allocation,
  vault,
}: {
  allocation?: TCrossChainAllocation;
  vault: TCrossChainVault;
}) => {
  if (!allocation) return null;
  const now = vault.now;
  return (
    <Card block>
      <FlexBlock direction="column" gap={12} block>
        <Subtitle level={1} weight="bold">
          Where the capital is
        </Subtitle>
        <FlexBlock direction="column" gap={4} block>
          <FlexBlock justifyContent="space-between" block>
            <Body level={2}>Vault buffer (Base)</Body>
            <Body level={2}>{fmtUnits(vault.accounting.freeCash)} USDC</Body>
          </FlexBlock>
          {allocation.chains.map(c => (
            <FlexBlock
              key={c.chainId}
              direction="column"
              gap={4}
              block
              className={styles.allocationChain}
            >
              <FlexBlock justifyContent="space-between" block>
                <Body level={2} weight="bold">
                  {NETWORK_NAME[c.chainId] ?? c.network}
                  {c.providersHealthy ? '' : ' (a market is unavailable)'}
                </Body>
                <Body level={2}>{fmtUnits(BigInt(c.idle) + BigInt(c.strategyValue))} USDC</Body>
              </FlexBlock>
              {c.providers
                .filter(p => BigInt(p.agentShare) > BigInt(0))
                .map(p => (
                  <FlexBlock key={p.address} justifyContent="space-between" block>
                    <Caption>{p.identifier.replace(/_/g, ' ')}</Caption>
                    <Caption>{fmtUnits(p.agentShare)} USDC</Caption>
                  </FlexBlock>
                ))}
              {BigInt(c.idle) > BigInt(0) ? (
                <FlexBlock justifyContent="space-between" block>
                  <Caption>Idle</Caption>
                  <Caption>{fmtUnits(c.idle)} USDC</Caption>
                </FlexBlock>
              ) : null}
            </FlexBlock>
          ))}
          {allocation.inFlight.map(t => (
            <FlexBlock key={t.id} justifyContent="space-between" block>
              <Caption>
                In transit {NETWORK_NAME[t.src_chain]} → {NETWORK_NAME[t.dst_chain]} (
                {fmtDuration(now - t.sent_at)})
              </Caption>
              <Caption>{fmtUnits(t.amount)} USDC</Caption>
            </FlexBlock>
          ))}
        </FlexBlock>
      </FlexBlock>
    </Card>
  );
};

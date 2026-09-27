import { useEffect, useState } from 'react';
import { Card } from '@/shared/ui/new-card';
import { FlexBlock } from '@/shared/ui/flex-block';
import { Caption } from '@/shared/ui/new-typography/caption';
import { Body } from '@/shared/ui/new-typography/body';
import { Subtitle } from '@/shared/ui/new-typography/subtitle';
import { Tooltip } from '@/shared/ui/tooltip/tooltip';
import { TCrossChainVault } from '@/shared/api/crosschain';
import { CROSSCHAIN } from '@/shared/blockchain/crosschain/config';
import { fmtApr, fmtDuration, fmtRate, fmtUnits } from '../format';
import styles from '../crosschain.module.scss';

const Stat = ({ label, value, hint }: { label: string; value: string; hint?: string }) => (
  <FlexBlock direction="column" gap={4} className={styles.stat}>
    {hint ? (
      <Tooltip tooltipText={hint} withIcon>
        <Caption>{label}</Caption>
      </Tooltip>
    ) : (
      <Caption>{label}</Caption>
    )}
    <Subtitle level={1} weight="bold">
      {value}
    </Subtitle>
  </FlexBlock>
);

export const Overview = ({ vault }: { vault: TCrossChainVault }) => {
  const [now, setNow] = useState(() => Math.floor(Date.now() / 1000));
  useEffect(() => {
    const t = setInterval(() => setNow(Math.floor(Date.now() / 1000)), 15_000);
    return () => clearInterval(t);
  }, []);
  const skew = vault.now - Math.floor(Date.now() / 1000);
  const chainNow = now + skew;
  const closesIn = vault.epoch.earliestCloseAt - chainNow;
  const closesLatest = vault.epoch.latestCloseAt - chainNow;

  return (
    <Card block>
      <FlexBlock direction="column" gap={16} block>
        {vault.profile === 'stand' ? (
          <div className={styles.warning}>
            <Body level={2}>
              Test stand: small amounts only. Governance is a single key during testing.
            </Body>
          </div>
        ) : null}
        {vault.tick.frozen ? (
          <div className={styles.warning}>
            <Body level={2}>
              Settlement is paused while the latest NAV is reviewed. Requests are accepted and funds
              are safe.
            </Body>
          </div>
        ) : null}
        <FlexBlock gap={24} flexWrap block>
          <Stat
            label="Total value (NAV)"
            value={`${fmtUnits(vault.tick.navBid)} ${CROSSCHAIN.assetSymbol}`}
            hint="Recognized net asset value across Base and Arbitrum at the latest tick"
          />
          <Stat
            label={`Share price (${CROSSCHAIN.shareSymbol})`}
            value={fmtRate(vault.tick.rateBid)}
            hint="USDC per share at the latest tick (redemption side)"
          />
          <Stat
            label="APR 7d / 30d"
            value={`${fmtApr(vault.apr.d7)} / ${fmtApr(vault.apr.d30)}`}
            hint="Annualized share price growth, net of fees"
          />
          <Stat
            label={`Epoch #${vault.epoch.id}`}
            value={
              closesIn > 0
                ? `closes in ${fmtDuration(closesIn)}`
                : `closing (≤ ${fmtDuration(closesLatest)})`
            }
            hint="Deposits and redemptions requested in this epoch are priced at the first NAV tick after it closes"
          />
          <Stat
            label="Last NAV update"
            value={`${fmtDuration(vault.tick.ageSeconds + (chainNow - vault.now))} ago`}
            hint={`Tick #${vault.tick.id}`}
          />
        </FlexBlock>
      </FlexBlock>
    </Card>
  );
};

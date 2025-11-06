import Image from 'next/image';
import { useDashboardConstants } from '@/shared/constants/dashboard-constants';
import { Card } from '@/shared/ui/new-card';
import { FlexBlock } from '@/shared/ui/flex-block';
import { Heading, Heading as NewHeading } from '@/shared/ui/new-typography/heading';
import { Body } from '@/shared/ui/new-typography/body';
import { PerfomanceChart } from './perfomance-chart';
import styles from './main.module.scss';
import { Calculator } from '@/widgets/calculator';
import { UsdcIcon } from '@/shared/ui/icons/usdc-icon';
import { Caption } from '@/shared/ui/new-typography/caption';
import { Tooltip } from '@/shared/ui/tooltip/tooltip';
import { LightningIcon } from '@/shared/ui/icons/lightning-icon';
import { StarsIcon } from '@/shared/ui/icons/stars-icon';
import { round } from '@/shared/number/round';
import { DepositBadge } from '@/shared/ui/deposit-badge';
import { Button } from '@/shared/ui/button';
import { ConvertBadge } from '@/shared/ui/convert-badge';
import { useModal } from '@/shared/ui/modal';
import { DepositModal } from '@/feature/deposit/ui/DepositModal';
import { Subtitle } from '@/shared/ui/new-typography/subtitle';
import { Overline } from '@/shared/ui/new-typography/overline';
import ProtocolsIcons from '@/shared/ui/images/protocols.png';
import { HexensIcon } from '@/shared/ui/icons/hexens-icon';

export const DashboardScreen = () => {
  const dashbardConstants = useDashboardConstants();
  const { open } = useModal();

  return (
    <FlexBlock direction="column" gap={12} block>
      <FlexBlock direction="column" gap={20} block>
        <FlexBlock direction="column" gap={12}>
          <NewHeading level={5} weight="bold">
            Dashboard
          </NewHeading>
          <Body level={2} weight="regular" className={styles.pageDescription}>
            Welcome back! Here&apos;s your portfolio overview.
          </Body>
        </FlexBlock>
        <Calculator apy={dashbardConstants.apy} />
      </FlexBlock>
      <Card block>
        <FlexBlock direction="column" gap={40}>
          <FlexBlock justifyContent="space-between" alignItems="flex-start" gap={24}>
            <FlexBlock direction="column" gap={16} className={styles.vaultInfoCard}>
              <FlexBlock gap={12} alignItems="center">
                <UsdcIcon />
                <Heading level={5} weight="bold">
                  USDC
                </Heading>
              </FlexBlock>
              <Body weight="regular">
                Your stablecoins are automatically allocated across top and safest DeFi providers
                holding over $60 billion in assets. When yields shift, the system reallocates funds
                to maintain the best available return.
              </Body>
              <FlexBlock alignItems="center" gap={20}>
                <FlexBlock direction="column" gap={4}>
                  <Tooltip withIcon tooltipText={''}>
                    <Caption weight="regular" className={styles.secondaryHighlight}>
                      Withdraw
                    </Caption>
                  </Tooltip>
                  <FlexBlock alignItems="center" gap={4}>
                    <LightningIcon />
                    <Body level={2} weight="bold">
                      INSTANT
                    </Body>
                  </FlexBlock>
                </FlexBlock>
                <FlexBlock direction="column" gap={4}>
                  <Tooltip withIcon tooltipText={''}>
                    <Caption weight="regular" className={styles.secondaryHighlight}>
                      Withdraw
                    </Caption>
                  </Tooltip>
                  <Body level={2} weight="bold">
                    ${dashbardConstants.vaultsTVL}
                  </Body>
                </FlexBlock>
              </FlexBlock>
            </FlexBlock>
            <Card variant="secondary" className={styles.apyCard}>
              <Body level={2}>APY</Body>
              <FlexBlock alignItems="center" gap={12}>
                <Heading level={6} weight="bold" className={styles.highlight}>
                  {round(dashbardConstants.apy)}%
                </Heading>
                <StarsIcon />
              </FlexBlock>
            </Card>
          </FlexBlock>
          <FlexBlock justifyContent="space-between" alignItems="center">
            <FlexBlock alignItems="center" gap={20}>
              <Button onClick={() => open(<DepositModal />)}>Deposit</Button>
              <ConvertBadge />
            </FlexBlock>
            <DepositBadge />
          </FlexBlock>
        </FlexBlock>
      </Card>
      <PerfomanceChart />
      <Card block>
        <FlexBlock direction="column" gap={16}>
          <Subtitle level={2} weight="regular">
            About
          </Subtitle>
          <FlexBlock gap={56} alignItems="flex-start">
            <Caption weight="regular" className={styles.aboutText}>
              The system constantly monitors yield across DeFi protocols and rebalances positions
              when conditions change — keeping your returns optimized in real time. Under the hood,
              the underlying protocols generate yield through over-collateralized lending. Borrowers
              must lock more collateral than they borrow, and if they fail to repay, their
              collateral is liquidated to cover lenders’ funds. This model keeps each market solvent
              while enabling returns on deposited assets. By aggregating these markets, the strategy
              diversifies exposure and smooths out fluctuations between platforms. It automatically
              shifts capital toward higher-yield, balanced-risk opportunities — without any manual
              action required from the user.
            </Caption>
            <FlexBlock direction="column" gap={16} block>
              <Card variant="secondary" block>
                <FlexBlock justifyContent="space-between" gap={16}>
                  <FlexBlock direction="column" gap={4}>
                    <Subtitle level={2}>Protocols</Subtitle>
                    <Overline className={styles.grayText}>
                      Funds are diversified across leading DeFi protocols (may vary)
                    </Overline>
                  </FlexBlock>
                  <Image src={ProtocolsIcons} alt={'Protocols icons'} width={116} />
                </FlexBlock>
              </Card>
              <Card variant="secondary" block>
                <FlexBlock justifyContent="space-between" gap={16}>
                  <FlexBlock direction="column" gap={4}>
                    <Subtitle level={2}>Audited by Hexens</Subtitle>
                    <Overline className={styles.grayText}>
                      Smart contracts reviewed and verified for safety and reliability
                    </Overline>
                  </FlexBlock>
                  <HexensIcon />
                </FlexBlock>
              </Card>
            </FlexBlock>
          </FlexBlock>
        </FlexBlock>
      </Card>
    </FlexBlock>
  );
};

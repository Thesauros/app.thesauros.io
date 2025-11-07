import Image from 'next/image';
import { useConnectModal } from '@rainbow-me/rainbowkit';
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
import { Button } from '@/shared/ui/button';
import { ConvertBadge } from '@/shared/ui/convert-badge';
import { Subtitle } from '@/shared/ui/new-typography/subtitle';
import ProtocolsIcons from '@/shared/ui/images/protocols.png';
import { HexensIcon } from '@/shared/ui/icons/hexens-icon';
import { PointCoinIcon } from '@/shared/ui/icons/point-icon';
import { useAccount } from '@/shared/blockchain';
import { InfoIcon } from '@/shared/ui/icons';
import { DepositModal } from '@/feature/deposit/ui/DepositModal';
import { useModal } from '@/shared/ui/modal';
import { WithdrawModal } from '@/feature/withdraw/ui/WithdrawModal';

export const DashboardScreen = () => {
  const dashbardConstants = useDashboardConstants();
  const { openConnectModal } = useConnectModal();
  const { isConnected } = useAccount();
  const { open } = useModal();

  return (
    <FlexBlock direction="column" gap={12} block>
      <FlexBlock direction="column" gap={20} block>
        <FlexBlock direction="column" gap={12}>
          <NewHeading level={5} weight="bold">
            Dashboard
          </NewHeading>
          <Body level={2} weight="regular" className={styles.pageDescription}>
            Welcome back! Here`s your portfolio overview.
          </Body>
        </FlexBlock>
        <Calculator apy={dashbardConstants.apy} />
      </FlexBlock>
      <Card block>
        <FlexBlock direction="column" gap={28}>
          <FlexBlock justifyContent="space-between" alignItems="flex-start" gap={24}>
            <FlexBlock direction="column" gap={16} className={styles.vaultInfoCard}>
              <FlexBlock gap={12} alignItems="center">
                <UsdcIcon />
                <Heading level={5} weight="bold">
                  USDC
                </Heading>
              </FlexBlock>
              <Body level={2} weight="regular" className={styles.secondaryHighlight}>
                Your stablecoins are automatically allocated across top and safest DeFi providers
                holding over $60 billion in assets. When yields shift, the system reallocates funds
                to maintain the best available return.
              </Body>
              <FlexBlock alignItems="center" gap={32}>
                <FlexBlock direction="column" gap={4}>
                  <Tooltip
                    withIcon
                    tooltipText="There are no fixed terms or lockups.
 You can withdraw your funds whenever you choose."
                  >
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
                  <Tooltip
                    withIcon
                    tooltipText="TVL (Total Value Locked) means the total amount of money currently deposited by all users in this strategy. It works like Assets Under Management (AUM) in traditional finance, showing how much capital is being managed right now."
                  >
                    <Caption weight="regular" className={styles.secondaryHighlight}>
                      TVL
                    </Caption>
                  </Tooltip>
                  <Body level={2} weight="bold">
                    ${dashbardConstants.vaultsTVL}
                  </Body>
                </FlexBlock>
                {!isConnected && (
                  <FlexBlock direction="column" gap={4}>
                    <Caption weight="regular" className={styles.secondaryHighlight}>
                      Deposit now and get
                    </Caption>
                    <FlexBlock gap={4}>
                      <PointCoinIcon size={16} />
                      <Body level={2} weight="bold">
                        500 points
                      </Body>
                    </FlexBlock>
                  </FlexBlock>
                )}
              </FlexBlock>
            </FlexBlock>
            <FlexBlock
              direction="column"
              justifyContent="space-between"
              alignItems="flex-end"
              fullHeight
            >
              <FlexBlock gap={8} alignItems="flex-start">
                {isConnected && (
                  <Card variant="secondary" className={styles.apyCard}>
                    <FlexBlock justifyContent="space-between" alignItems="center" block>
                      <Body level={2}>Points</Body>
                      <Tooltip
                        tooltipText="Shows the current average yield the strategy generates from connected DeFi protocols.
 The percentage can move up or down depending on market conditions."
                      >
                        <InfoIcon />
                      </Tooltip>
                    </FlexBlock>
                    <Heading level={6} weight="bold">
                      <FlexBlock gap={4} alignItems="center">
                        <PointCoinIcon size={16} />
                        {dashbardConstants.totalPosition * 1000}
                        <span className={styles.daily}>/daily</span>
                      </FlexBlock>
                    </Heading>
                  </Card>
                )}
                {isConnected && (
                  <Card variant="secondary" className={styles.apyCard}>
                    <Body level={2}>Your funds</Body>
                    <Heading level={6} weight="bold">
                      ${dashbardConstants.totalPosition}
                    </Heading>
                  </Card>
                )}
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
              {isConnected && (
                <FlexBlock alignItems="center" gap={12}>
                  <Button variant="outline" size="lg" onClick={() => open(<WithdrawModal />)}>
                    Withdraw
                  </Button>
                  <Button size="lg" onClick={() => open(<DepositModal />)}>
                    Add to deposit
                  </Button>
                </FlexBlock>
              )}
            </FlexBlock>
          </FlexBlock>
          {!isConnected && (
            <FlexBlock justifyContent="space-between" alignItems="center">
              <FlexBlock alignItems="center" gap={20}>
                <Button onClick={openConnectModal}>Deposit</Button>
                <Caption weight="regular" className={styles.secondaryHighlight}>
                  Withdraw anytime — no lock period 😎
                </Caption>
              </FlexBlock>
              <ConvertBadge />
            </FlexBlock>
          )}
        </FlexBlock>
      </Card>
      <PerfomanceChart />
      <Card block>
        <FlexBlock direction="column" gap={16}>
          <Subtitle level={2} weight="regular">
            About
          </Subtitle>
          <FlexBlock gap={28} direction="column" alignItems="flex-start">
            <FlexBlock gap={16} block>
              <Card variant="secondary" className={styles.partnersBlock} block>
                <FlexBlock justifyContent="space-between" gap={16}>
                  <FlexBlock direction="column" gap={4}>
                    <Subtitle level={2}>Protocols</Subtitle>
                    <Caption className={styles.grayText}>
                      Funds are diversified across leading DeFi protocols (may vary)
                    </Caption>
                  </FlexBlock>
                  <Image src={ProtocolsIcons} alt={'Protocols icons'} width={116} />
                </FlexBlock>
              </Card>
              <Card variant="secondary" className={styles.partnersBlock} block>
                <FlexBlock justifyContent="space-between" gap={16}>
                  <FlexBlock direction="column" gap={4}>
                    <Subtitle level={2}>Audited by Hexens</Subtitle>
                    <Caption className={styles.grayText}>
                      Smart contracts reviewed and verified for safety and reliability
                    </Caption>
                  </FlexBlock>
                  <HexensIcon />
                </FlexBlock>
              </Card>
            </FlexBlock>
            <Caption weight="regular" className={styles.aboutText}>
              The system constantly monitors yield across DeFi protocols and rebalances positions
              when conditions change — keeping your returns optimized in real time. Under the hood,
              the underlying protocols generate yield through over-collateralized lending. Borrowers
              must lock more collateral than they borrow, and if they fail to repay, their
              collateral is liquidated to cover lenders’ funds. This model keeps each market solvent
              while enabling returns on deposited assets. By aggregating these markets, the strategy
              diversifies exposure and smooths out fluctuations between platforms. It automatically
              shifts capital toward higher-yield, balanced-risk opportunities — without any manual
              action required from the user.
            </Caption>
          </FlexBlock>
        </FlexBlock>
      </Card>
    </FlexBlock>
  );
};

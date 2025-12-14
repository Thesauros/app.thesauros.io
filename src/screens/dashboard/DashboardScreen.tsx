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
import { Tooltip, TooltipWithContent } from '@/shared/ui/tooltip/tooltip';
import { LightningIcon } from '@/shared/ui/icons/lightning-icon';
import { StarsIcon } from '@/shared/ui/icons/stars-icon';
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
import { useCheckResolution } from '@/shared/browser/useCheckResolution';
import { useEffect, useState } from 'react';
import { CalculatorIcon } from '@/shared/ui/icons/calculator-icon';
import { ChevronTopIcon } from '@/shared/ui/icons/chevron-top-icon';
import { DepositBadge } from '@/shared/ui/deposit-badge';
import { EarlyBirdModal } from '@/feature/early-bird';
import { useWhiteList } from '@/shared/api/dashboard/useWhiteList';
import { Overline } from '@/shared/ui/new-typography/overline';
import { formatNumberWithCommas } from '@/shared/number/formatNumberWithCommas';
import { useSignTermsWithCallback } from '@/feature/sign-terms';

export const DashboardScreen = () => {
  const { totalPosition, vaultsTVL, complexApy } = useDashboardConstants();
  const { openConnectModal } = useConnectModal();
  const { address, isConnected } = useAccount();
  const { open } = useModal();
  const { checkSignatureAndExecute } = useSignTermsWithCallback();

  const isMobile = useCheckResolution(576);
  const isDeposited = totalPosition > 0;
  const { isInWhiteList } = useWhiteList(address);

  const onDepositClick = () => {
    if (isConnected) {
      checkSignatureAndExecute(() => {
        open(isInWhiteList ? <DepositModal /> : <EarlyBirdModal />, {
          smallPaddings: !isInWhiteList,
          maxWidth: !isInWhiteList ? 596 : undefined,
        });
      });
    } else if (openConnectModal) {
      openConnectModal();
    }
  };

  const [isCalculatorOpened, setCalculatorOpened] = useState(true);

  useEffect(() => {
    if (isDeposited) {
      setCalculatorOpened(false);
    }
  }, [isDeposited]);

  return (
    <FlexBlock direction="column" gap={12} block>
      <FlexBlock direction="column" gap={20} block>
        <FlexBlock justifyContent="space-between" block>
          <NewHeading level={isMobile ? 5 : 4} weight="bold">
            Dashboard
          </NewHeading>
          <Button
            size={isMobile ? 'md' : 'lg'}
            variant="outline"
            prefix={!isCalculatorOpened ? <CalculatorIcon /> : <ChevronTopIcon />}
            onClick={() => setCalculatorOpened(!isCalculatorOpened)}
          >
            {isMobile ? null : 'Potential earnings'}
          </Button>
        </FlexBlock>
        {isCalculatorOpened && <Calculator apy={complexApy.netApy} />}
      </FlexBlock>
      <Card block>
        <FlexBlock direction="column" gap={28}>
          <FlexBlock
            justifyContent="space-between"
            alignItems="flex-start"
            gap={24}
            direction={isMobile ? 'column' : 'row'}
          >
            <FlexBlock direction="column" gap={16} className={styles.vaultInfoCard}>
              <FlexBlock justifyContent="space-between" alignItems="center" block>
                <FlexBlock gap={isMobile ? 8 : 12} alignItems="center">
                  <UsdcIcon size={isMobile ? 24 : 40} />
                  {isMobile ? (
                    <Body level={2} weight="bold">
                      USDC
                    </Body>
                  ) : (
                    <Heading level={5} weight="bold">
                      USDC
                    </Heading>
                  )}
                </FlexBlock>
                {isMobile && (
                  <FlexBlock alignItems="center" gap={8}>
                    <Subtitle level={2} weight="regular" className={styles.secondaryHighlight}>
                      APY
                    </Subtitle>
                    <Body level={2} weight="bold">
                      {complexApy.netApy}%
                    </Body>
                    <StarsIcon />
                  </FlexBlock>
                )}
              </FlexBlock>
              {!isMobile ? (
                <Body level={2} weight="regular" className={styles.secondaryHighlight}>
                  Your stablecoins are automatically allocated across top and safest DeFi providers
                  holding over $60 billion in assets. When yields shift, the system reallocates
                  funds to maintain the best available return.
                </Body>
              ) : (
                <Caption weight="regular" className={styles.secondaryHighlight}>
                  Your stablecoins are automatically allocated across top and safest DeFi providers
                  holding over $60 billion in assets. When yields shift, the system reallocates
                  funds to maintain the best available return.
                </Caption>
              )}
              <FlexBlock alignItems="center" gap={isMobile ? 80 : 32}>
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
                    ${formatNumberWithCommas(vaultsTVL ?? 0)}
                  </Body>
                </FlexBlock>
              </FlexBlock>
            </FlexBlock>

            {isMobile && isConnected && (
              <FlexBlock direction="column" gap={8} block>
                <Card variant="secondary" className={styles.mobilePointsCard}>
                  <FlexBlock justifyContent="space-between" alignItems="center" block>
                    <FlexBlock gap={4} alignItems="center">
                      <Subtitle level={2} weight="regular" className={styles.secondaryHighlight}>
                        Points
                      </Subtitle>
                      <Tooltip
                        tooltipText="Shows the current average yield the strategy generates from connected DeFi protocols.
 The percentage can move up or down depending on market conditions."
                      >
                        <InfoIcon />
                      </Tooltip>
                    </FlexBlock>
                    <FlexBlock gap={4} alignItems="center">
                      <PointCoinIcon size={16} />
                      <Heading level={6} weight="bold">
                        {totalPosition}
                      </Heading>
                      <span className={styles.daily}>/day</span>
                    </FlexBlock>
                  </FlexBlock>
                </Card>
                <Card variant="secondary" className={styles.mobilePointsCard}>
                  <FlexBlock justifyContent="space-between" alignItems="center" block>
                    <Subtitle level={2} weight="regular" className={styles.secondaryHighlight}>
                      Your funds
                    </Subtitle>
                    <Heading level={6} weight="bold">
                      ${formatNumberWithCommas(totalPosition)}
                    </Heading>
                  </FlexBlock>
                </Card>
              </FlexBlock>
            )}
            {!isMobile && (
              <FlexBlock
                direction="column"
                justifyContent="space-between"
                alignItems="flex-end"
                fullHeight
              >
                <FlexBlock gap={8} alignItems="flex-start">
                  {isDeposited && !isMobile && (
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
                          {totalPosition}
                          <span className={styles.daily}>/day</span>
                        </FlexBlock>
                      </Heading>
                    </Card>
                  )}
                  {isDeposited && (
                    <Card variant="secondary" className={styles.apyCard}>
                      <Body level={2}>Your funds</Body>
                      <Heading level={6} weight="bold">
                        ${totalPosition}
                      </Heading>
                    </Card>
                  )}

                  <TooltipWithContent
                    content={
                      <FlexBlock direction="column" gap={8} block>
                        <FlexBlock
                          direction="column"
                          gap={0}
                          className={styles.tooltipApyInfo}
                          block
                        >
                          <FlexBlock justifyContent="space-between" block>
                            <Overline>Base Rate</Overline>
                            <Caption weight="regular">+{complexApy.baseApy}%</Caption>
                          </FlexBlock>
                          <FlexBlock justifyContent="space-between" block>
                            <Overline>Reward Rate</Overline>
                            <Caption weight="regular">+{complexApy.rewardApy}%</Caption>
                          </FlexBlock>
                          <FlexBlock justifyContent="space-between" block>
                            <Overline>Net APY</Overline>
                            <Caption weight="regular">+{complexApy.netApy}%</Caption>
                          </FlexBlock>
                        </FlexBlock>
                        <Overline className={styles.tooltipApyDescription}>
                          The displayed APY includes the base yield from DeFi strategies and an
                          additional part earned as points. These points are accrued over time and
                          will be converted into tokens once the points program ends and the token
                          launches.
                        </Overline>
                      </FlexBlock>
                    }
                  >
                    <Card variant="secondary" className={styles.apyCard}>
                      <Subtitle level={2} weight="regular">
                        APY
                      </Subtitle>
                      <FlexBlock alignItems="center" gap={12}>
                        <Heading level={5} weight="bold">
                          {complexApy.netApy}%
                        </Heading>
                        <StarsIcon />
                      </FlexBlock>
                    </Card>
                  </TooltipWithContent>
                </FlexBlock>
              </FlexBlock>
            )}
          </FlexBlock>
          {!isDeposited && (
            <FlexBlock
              justifyContent="space-between"
              alignItems="center"
              direction={isMobile ? 'column' : 'row'}
            >
              <FlexBlock
                alignItems="center"
                direction={isMobile ? 'column' : 'row'}
                gap={isMobile ? 16 : 20}
                block={isMobile}
              >
                {isMobile && <ConvertBadge />}
                <Button size="lg" onClick={onDepositClick} fullWidth={isMobile}>
                  Deposit
                </Button>
                <DepositBadge />
              </FlexBlock>
              {!isMobile && <ConvertBadge />}
            </FlexBlock>
          )}
          {isDeposited && (
            <FlexBlock
              justifyContent="space-between"
              alignItems="center"
              direction={isMobile ? 'column' : 'row'}
              gap={isMobile ? 16 : 0}
            >
              <ConvertBadge />
              <FlexBlock
                alignItems="center"
                direction={isMobile ? 'column-reverse' : 'row'}
                gap={12}
                block={isMobile}
              >
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => open(<WithdrawModal />)}
                  fullWidth={isMobile}
                >
                  Withdraw
                </Button>
                <Button
                  size="lg"
                  fullWidth={isMobile}
                  onClick={() => {
                    checkSignatureAndExecute(() => {
                      open(isInWhiteList ? <DepositModal /> : <EarlyBirdModal />, {
                        smallPaddings: !isInWhiteList,
                        maxWidth: !isInWhiteList ? 596 : undefined,
                      });
                    });
                  }}
                >
                  Add to deposit
                </Button>
              </FlexBlock>
              {isMobile && (
                <Caption weight="regular" className={styles.secondaryHighlight}>
                  Withdraw anytime — no lock period
                </Caption>
              )}
            </FlexBlock>
          )}
        </FlexBlock>
      </Card>
      <PerfomanceChart />
      <Card block>
        <FlexBlock direction="column" gap={16}>
          {!isMobile ? (
            <Subtitle level={1} weight="regular">
              About
            </Subtitle>
          ) : (
            <Caption weight="regular">About</Caption>
          )}
          <FlexBlock gap={16} direction="column" alignItems="flex-start">
            <FlexBlock gap={16} direction={isMobile ? 'column' : 'row'} block>
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

import { useEffect, useState } from 'react';
import { useDashboardConstants } from '@/shared/constants/dashboard-constants';
import { Card } from '@/shared/ui/new-card';
import { FlexBlock } from '@/shared/ui/flex-block';
import { Heading } from '@/shared/ui/new-typography/heading';
import { Button } from '@/shared/ui/button';
import { Calculator } from '@/widgets/calculator';
import { CalculatorIcon } from '@/shared/ui/icons/calculator-icon';
import { ChevronTopIcon } from '@/shared/ui/icons/chevron-top-icon';
import { useAccount } from '@/shared/blockchain';
import { useModal } from '@/shared/ui/modal';
import { useCheckResolution } from '@/shared/browser/useCheckResolution';
import { useWhiteList } from '@/shared/api/dashboard/useWhiteList';
import { useSignTermsWithCallback } from '@/features/sign-terms';
import { DepositModal } from '@/features/deposit/ui/DepositModal';
import { WithdrawModal } from '@/features/withdraw/ui/WithdrawModal';
import { EarlyBirdModal } from '@/features/early-bird';
import { PerformanceChart } from './performance-chart';
import {
  VaultInfoCard,
  ApyCards,
  MobileUserCards,
  DepositActions,
  AboutSection,
} from './components';

export const DashboardScreen = () => {
  const { totalPosition, vaultsTVL, complexApy } = useDashboardConstants();
  const { login, address, isConnected } = useAccount();

  const { open } = useModal();
  const { checkSignatureAndExecute } = useSignTermsWithCallback();
  const { isInWhiteList } = useWhiteList(address);

  const isMobile = useCheckResolution(768);
  const isLaptop = useCheckResolution(1024);
  const isDeposited = totalPosition > 0;

  const [isCalculatorOpened, setCalculatorOpened] = useState(true);

  useEffect(() => {
    if (isDeposited) {
      setCalculatorOpened(false);
    }
  }, [isDeposited]);

  const openDepositModal = () => {
    open(isInWhiteList ? <DepositModal /> : <EarlyBirdModal />, {
      smallPaddings: !isInWhiteList,
      maxWidth: !isInWhiteList ? 596 : undefined,
    });
  };

  const handleDepositClick = () => {
    if (isConnected) {
      checkSignatureAndExecute(openDepositModal);
    } else {
      login();
    }
  };

  const handleWithdrawClick = () => {
    open(<WithdrawModal />);
  };

  return (
    <FlexBlock direction="column" gap={12} block>
      {/* Header with Calculator Toggle */}
      <FlexBlock direction="column" gap={20} block>
        <FlexBlock justifyContent="space-between" block>
          <Heading level={isMobile ? 5 : 4} weight="bold">
            Dashboard
          </Heading>
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
      {/* Main Vault Card */}
      <Card block>
        <FlexBlock direction="column" gap={28}>
          <FlexBlock
            justifyContent="space-between"
            alignItems="flex-start"
            gap={24}
            direction={isLaptop ? 'column' : 'row'}
          >
            <VaultInfoCard isMobile={isMobile} netApy={complexApy.netApy} vaultsTVL={vaultsTVL} />

            {isMobile && isConnected && <MobileUserCards totalPosition={totalPosition} />}

            {!isMobile && (
              <ApyCards
                isDeposited={isDeposited}
                totalPosition={totalPosition}
                complexApy={complexApy}
              />
            )}
          </FlexBlock>

          <DepositActions
            isMobile={isMobile}
            isDeposited={isDeposited}
            onDepositClick={handleDepositClick}
            onWithdrawClick={handleWithdrawClick}
          />
        </FlexBlock>
      </Card>
      <PerformanceChart />
      <AboutSection isMobile={isMobile} />
    </FlexBlock>
  );
};

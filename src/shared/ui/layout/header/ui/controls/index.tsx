import { useConnectModal } from '@rainbow-me/rainbowkit';
import { useAccount, useAccountEffect } from 'wagmi';
import { FlexBlock } from '@/shared/ui/flex-block';
import { Moon } from '@shared/ui/icons/moon';
import { Button } from '@/shared/ui/button';
import { AppTheme, useTheme } from '@/shared/ui/theme';
import { useCheckResolution } from '@/shared/browser/useCheckResolution';
import { useModal } from '@/shared/ui/modal';
import { DepositModal } from '../../../../../../feature/deposit/ui/DepositModal';
import { WithdrawModal } from '@/feature/withdraw/ui/WithdrawModal';
import { LocalStorageKey, useLocalStorageState } from '@/shared/browser/localStorage';
import { connectBonus } from '@/shared/api/pointProgram';
import { ProfileWindow } from '@/shared/ui/profile-window';
import { MobileMenu } from '../../../mobile-menu';

export const Controls = () => {
  const { theme, setTheme } = useTheme();
  const isMobile = useCheckResolution(576);
  const { openConnectModal } = useConnectModal();
  const { isConnected, address } = useAccount();
  const isEnabledSwitcher = false;
  const { open } = useModal();
  const [isConnectedLS, setConnectedLS] = useLocalStorageState(
    LocalStorageKey.CONNECTED_WALLET,
    'false'
  );

  useAccountEffect({
    onConnect(data) {
      if (!Boolean(isConnectedLS)) {
        connectBonus(data.address).then(_ => {
          setConnectedLS('true');
        });
      }
    },
  });

  const toggleTheme = () => {
    setTheme(theme === AppTheme.LIGHT ? AppTheme.DARK : AppTheme.LIGHT);
  };

  if (!isConnected) {
    return (
      <FlexBlock
        alignItems="center"
        justifyContent={isMobile ? 'space-between' : undefined}
        gap={24}
        block={!!isMobile}
      >
        <Button variant="primary" size="s" onClick={openConnectModal}>
          Connect wallet
        </Button>
        {isMobile && <MobileMenu />}
      </FlexBlock>
    );
  }

  return (
    <FlexBlock gap={40} alignItems="center" justifyContent={isMobile ? 'space-between' : undefined}>
      <FlexBlock gap={14} alignItems="center">
        {isEnabledSwitcher && !isMobile && <Moon onClick={toggleTheme} />}
        <Button variant="primary" size="s" onClick={() => open(<DepositModal />)}>
          Deposit
        </Button>
        <Button variant="secondary" size="s" onClick={() => open(<WithdrawModal />)}>
          Withdraw
        </Button>
      </FlexBlock>
      <FlexBlock alignItems="flex-end" gap={12}>
        {address && <ProfileWindow />}
        {isMobile && <MobileMenu />}
      </FlexBlock>
    </FlexBlock>
  );
};

import { useConnectModal } from '@rainbow-me/rainbowkit';
import { useAccount } from 'wagmi';
import { FlexBlock } from '@/shared/ui/flex-block';
import { Moon } from '@shared/ui/icons/moon';
import { Button } from '@/shared/ui/button';
import { AppTheme, useTheme } from '@/shared/ui/theme';
import { useCheckResolution } from '@/shared/browser/useCheckResolution';
import { Avatar } from '@/shared/ui/generated-avatar';

export const Controls = () => {
  const { theme, setTheme } = useTheme();
  const isMobile = useCheckResolution(576);
  const { openConnectModal } = useConnectModal();
  const { isConnected, address } = useAccount();
  const isEnabledSwitcher = false;

  const toggleTheme = () => {
    setTheme(theme === AppTheme.LIGHT ? AppTheme.DARK : AppTheme.LIGHT);
  };

  if (!isConnected) {
    return (
      <Button variant="primary" size="s" onClick={openConnectModal}>
        Connect wallet
      </Button>
    );
  }

  return (
    <FlexBlock gap={40} alignItems="center" justifyContent={isMobile ? 'space-between' : undefined}>
      <FlexBlock gap={14} alignItems="center">
        {isEnabledSwitcher && !isMobile && <Moon onClick={toggleTheme} />}
        <Button variant="primary" size="s">
          Deposit
        </Button>
        <Button variant="secondary" size="s">
          Withdraw
        </Button>
      </FlexBlock>
      {address && <Avatar value={address} />}
    </FlexBlock>
  );
};

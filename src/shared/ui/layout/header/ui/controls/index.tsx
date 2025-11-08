import { useConnectModal } from '@rainbow-me/rainbowkit';
import { useAccount, useAccountEffect } from 'wagmi';
import { FlexBlock } from '@/shared/ui/flex-block';
import { Button } from '@/shared/ui/button';
import { useCheckResolution } from '@/shared/browser/useCheckResolution';
import { LocalStorageKey, useLocalStorageState } from '@/shared/browser/localStorage';
import { connectBonus } from '@/shared/api/pointProgram';
import { ProfileWindow } from '@/shared/ui/profile-window';
import { MobileMenu } from '../../../mobile-menu';
import { SelectChainButton } from '@/shared/ui/select-chain-button';
import { ConnectWalletBadge } from '@/shared/ui/connect-wallet-badge';

export const Controls = () => {
  const isMobile = useCheckResolution(576);
  const { openConnectModal } = useConnectModal();
  const { isConnected, address } = useAccount();
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

  if (!isConnected) {
    return (
      <FlexBlock
        alignItems="center"
        justifyContent={isMobile ? 'space-between' : undefined}
        gap={24}
        block={!!isMobile}
      >
        {!isMobile && <ConnectWalletBadge />}
        <Button variant="primary" size="lg" onClick={openConnectModal}>
          Connect wallet
        </Button>
        {isMobile && <MobileMenu />}
      </FlexBlock>
    );
  }

  return (
    <FlexBlock gap={16} alignItems="center" justifyContent={isMobile ? 'space-between' : undefined}>
      <SelectChainButton />
      <FlexBlock alignItems="flex-end" gap={12}>
        {address && <ProfileWindow />}
        {isMobile && <MobileMenu />}
      </FlexBlock>
    </FlexBlock>
  );
};

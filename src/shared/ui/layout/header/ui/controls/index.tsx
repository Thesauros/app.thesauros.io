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
import { ThesaurosMiniLogo } from '@/shared/ui/icons/thesauros-mini-logo';
import { WalletIcon } from '@/shared/ui/icons/wallet-icon';

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
      if (!isConnectedLS) {
        connectBonus(data.address).then(_ => {
          setConnectedLS('true');
        });
      }
    },
  });

  if (!isConnected && isMobile) {
    return (
      <FlexBlock alignItems="center" justifyContent="space-between" block>
        <ThesaurosMiniLogo />
        <FlexBlock alignItems="center" gap={24}>
          <Button variant="primary" size="md" onClick={openConnectModal}>
            <WalletIcon />
          </Button>
          {isMobile && <MobileMenu />}
        </FlexBlock>
      </FlexBlock>
    );
  }

  if (!isConnected && !isMobile) {
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

  if (isConnected && isMobile) {
    return (
      <FlexBlock gap={16} alignItems="center" justifyContent="space-between">
        <ThesaurosMiniLogo />
        <FlexBlock alignItems="center" gap={16}>
          <SelectChainButton />
          {address && <ProfileWindow />}
        </FlexBlock>
        <MobileMenu />
      </FlexBlock>
    );
  }

  return (
    <FlexBlock gap={16} alignItems="center">
      <SelectChainButton />
      <FlexBlock alignItems="flex-end" gap={12}>
        {address && <ProfileWindow />}
      </FlexBlock>
    </FlexBlock>
  );
};

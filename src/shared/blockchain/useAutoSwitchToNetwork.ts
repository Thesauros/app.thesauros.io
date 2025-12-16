import { useEffect } from 'react';
import { useAccount } from './useAccount';
import { useSwitchNetwork } from './core/useSwtichNetwork';

export const useAutoSwitchToNetwork = ({ targetChainID }: { targetChainID: number }) => {
  const { isConnected } = useAccount();
  const { switchNetwork } = useSwitchNetwork({
    targetChainID,
  });

  useEffect(() => {
    if (isConnected) {
      try {
        switchNetwork(targetChainID);
      } catch (error) {
        if (error) {
          console.warn('Can`t switch the network:');
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isConnected]);
};

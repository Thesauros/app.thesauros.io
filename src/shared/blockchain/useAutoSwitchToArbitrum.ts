import { useEffect } from 'react';
import { useAccount } from './useAccount';
import { useSwitchNetwork } from './core/useSwtichNetwork';

export const useAutoSwitchToArbitrum = () => {
  const { isConnected } = useAccount();
  const { switchNetwork } = useSwitchNetwork({
    targetChainID: 42161,
  });

  useEffect(() => {
    if (isConnected) {
      try {
        switchNetwork(42161);
      } catch (error) {
        if (error) {
          console.warn('Can`t switch the network:');
        }
      }
    }
  }, [isConnected]);
};

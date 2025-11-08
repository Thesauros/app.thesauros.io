import { useEffect } from 'react';
import { useAccount } from './useAccount';
import { useSwitchNetwork } from './core/useSwtichNetwork';

export const useAutoSwitchToArbitrum = () => {
  const { isConnected } = useAccount();
  const { isNeedSwitch, switchNetwork } = useSwitchNetwork({
    targetChainID: 42161,
  });

  useEffect(() => {
    if (isConnected && isNeedSwitch) {
      try {
        switchNetwork(42161);
      } catch (error) {
        if (error) {
          console.warn('Can`t switch the network:');
        }
      }
    }
  }, [isConnected, isNeedSwitch, switchNetwork]);
};

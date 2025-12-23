import { useEffect, useRef } from 'react';
import { useAccount } from './useAccount';
import { useSwitchNetwork } from './core/useSwitchNetwork';

const AUTO_SWITCH_DONE_KEY = 'autoSwitchNetworkDone';

export const useAutoSwitchToNetwork = ({ targetChainID }: { targetChainID: number }) => {
  const { isConnected } = useAccount();
  const { switchNetwork } = useSwitchNetwork({
    targetChainID,
  });

  const wasConnectedRef = useRef(false);

  useEffect(() => {
    if (!isConnected) {
      wasConnectedRef.current = false;
      return;
    }

    const autoSwitchDone = localStorage.getItem(AUTO_SWITCH_DONE_KEY);

    if (!wasConnectedRef.current && !autoSwitchDone) {
      try {
        switchNetwork(targetChainID);
        localStorage.setItem(AUTO_SWITCH_DONE_KEY, 'true');
      } catch (error) {
        if (error) {
          console.warn('Can`t switch the network:');
        }
      }
    }

    wasConnectedRef.current = true;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isConnected]);
};

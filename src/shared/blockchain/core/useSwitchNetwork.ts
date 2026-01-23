import { useMemo } from 'react';
import { useSwitchChain } from 'wagmi';
import { switchChain } from '@wagmi/core';
import { wagmiConfig } from '../config';
import { TChainID } from './types';
import { useAccount } from '../useAccount';

export const useSwitchNetwork = ({ targetChainID }: { targetChainID: number }) => {
  const { switchChain, switchChainAsync, isPending } = useSwitchChain();
  const { chain } = useAccount();
  const isNeedSwitch = useMemo(() => chain?.id !== targetChainID, [chain?.id, targetChainID]);

  return {
    isLoading: isPending,
    isNeedSwitch: isNeedSwitch,
    switchNetwork: (chainId: number) => switchChain({ chainId }),
    switchNetworkAsync: (chainId: number) => switchChainAsync({ chainId }),
  };
};

export const switchNetwork = (chainId: TChainID) => {
  return switchChain(wagmiConfig, { chainId: chainId as 1 | 42161 | 8453 });
};
